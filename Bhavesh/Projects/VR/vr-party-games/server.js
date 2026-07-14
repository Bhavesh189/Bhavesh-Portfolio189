/**
 * VR Party Games - Server
 * 
 * Manages game sessions, WebSocket communication between host and controller devices.
 * Handles session creation, joining, input relay, and disconnection logic.
 */

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  // Latency optimizations
  pingInterval: 2000,
  pingTimeout: 5000,
  transports: ['websocket', 'polling'],
  allowUpgrades: true
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// ─── Session Management ───────────────────────────────────────────

/**
 * Session Store
 * Each session: {
 *   id: string,
 *   code: string,
 *   hostSocketId: string,
 *   controllerSocketId: string | null,
 *   gameId: string,
 *   state: 'waiting' | 'playing' | 'paused',
 *   createdAt: Date,
 *   gameState: object
 * }
 */
const sessions = new Map();
const socketToSession = new Map(); // socket.id → session code

/**
 * Generate a unique 6-character alphanumeric session code
 */
function generateSessionCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed ambiguous: I,O,0,1
  let code;
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (sessions.has(code));
  return code;
}

/**
 * Clean up expired sessions (older than 2 hours)
 */
function cleanupSessions() {
  const now = Date.now();
  const MAX_AGE = 2 * 60 * 60 * 1000; // 2 hours
  for (const [code, session] of sessions) {
    if (now - session.createdAt > MAX_AGE) {
      sessions.delete(code);
      console.log(`[Cleanup] Session ${code} expired`);
    }
  }
}
setInterval(cleanupSessions, 60000);

// ─── REST API ─────────────────────────────────────────────────────

/**
 * Generate QR code as data URL for a given session code
 */
app.get('/api/qrcode/:code', async (req, res) => {
  try {
    const { code } = req.params;
    // Build the URL that controller should visit
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers.host;
    const url = `${protocol}://${host}/controller.html?code=${code}`;
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 256,
      margin: 2,
      color: { dark: '#ffffff', light: '#00000000' }
    });
    res.json({ qr: qrDataUrl, url });
  } catch (err) {
    res.status(500).json({ error: 'QR generation failed' });
  }
});

/**
 * Get server info / health check
 */
app.get('/api/status', (req, res) => {
  res.json({
    activeSessions: sessions.size,
    uptime: process.uptime()
  });
});

// ─── WebSocket Communication ──────────────────────────────────────

io.on('connection', (socket) => {
  console.log(`[Connect] Socket ${socket.id} connected`);

  /**
   * HOST: Create a new game session
   * Payload: { gameId: string }
   */
  socket.on('create-session', (data, callback) => {
    const code = generateSessionCode();
    const session = {
      id: uuidv4(),
      code,
      hostSocketId: socket.id,
      controllerSocketId: null,
      gameId: data.gameId,
      state: 'waiting',
      createdAt: Date.now(),
      gameState: {}
    };
    
    sessions.set(code, session);
    socketToSession.set(socket.id, code);
    socket.join(`session:${code}`);
    
    console.log(`[Session] Created: ${code} by ${socket.id} for game: ${data.gameId}`);
    
    callback({
      success: true,
      code,
      sessionId: session.id
    });
  });

  /**
   * CONTROLLER: Join an existing session
   * Payload: { code: string }
   */
  socket.on('join-session', (data, callback) => {
    const code = data.code.toUpperCase().trim();
    const session = sessions.get(code);
    
    if (!session) {
      callback({ success: false, error: 'Session not found. Check the code and try again.' });
      return;
    }
    
    if (session.controllerSocketId && io.sockets.sockets.get(session.controllerSocketId)) {
      callback({ success: false, error: 'Session already has a controller connected.' });
      return;
    }
    
    // Register controller
    session.controllerSocketId = socket.id;
    socketToSession.set(socket.id, code);
    socket.join(`session:${code}`);
    
    console.log(`[Session] Controller ${socket.id} joined session ${code}`);
    
    // Notify host
    io.to(session.hostSocketId).emit('controller-connected', {
      controllerId: socket.id
    });
    
    callback({
      success: true,
      gameId: session.gameId,
      sessionId: session.id
    });
  });

  /**
   * CONTROLLER → HOST: Relay controller inputs
   * Payload: any input data (joystick, buttons, gyro)
   * Uses volatile emit for non-critical updates (latest state wins)
   */
  socket.on('controller-input', (data) => {
    const code = socketToSession.get(socket.id);
    if (!code) return;
    const session = sessions.get(code);
    if (!session || session.controllerSocketId !== socket.id) return;
    
    // Volatile emit - drop if network is congested (latest input matters most)
    socket.volatile.to(session.hostSocketId).emit('controller-input', {
      ...data,
      timestamp: Date.now()
    });
  });

  /**
   * CONTROLLER → HOST: Reliable button events (fire, action)
   * These must not be dropped
   */
  socket.on('controller-action', (data) => {
    const code = socketToSession.get(socket.id);
    if (!code) return;
    const session = sessions.get(code);
    if (!session || session.controllerSocketId !== socket.id) return;
    
    io.to(session.hostSocketId).emit('controller-action', {
      ...data,
      timestamp: Date.now()
    });
  });

  /**
   * HOST → CONTROLLER: Send game state feedback
   * (score, health, game events)
   */
  socket.on('game-state', (data) => {
    const code = socketToSession.get(socket.id);
    if (!code) return;
    const session = sessions.get(code);
    if (!session || session.hostSocketId !== socket.id) return;
    
    if (session.controllerSocketId) {
      socket.volatile.to(session.controllerSocketId).emit('game-state', data);
    }
  });

  /**
   * HOST: Update session state
   */
  socket.on('session-state', (data) => {
    const code = socketToSession.get(socket.id);
    if (!code) return;
    const session = sessions.get(code);
    if (!session || session.hostSocketId !== socket.id) return;
    
    session.state = data.state;
    if (session.controllerSocketId) {
      io.to(session.controllerSocketId).emit('session-state', data);
    }
  });

  /**
   * Ping measurement for latency display
   */
  socket.on('ping-measure', (data, callback) => {
    callback({ serverTime: Date.now() });
  });

  /**
   * Handle disconnection
   */
  socket.on('disconnect', (reason) => {
    console.log(`[Disconnect] Socket ${socket.id}: ${reason}`);
    const code = socketToSession.get(socket.id);
    if (!code) return;
    
    const session = sessions.get(code);
    if (!session) {
      socketToSession.delete(socket.id);
      return;
    }
    
    if (session.hostSocketId === socket.id) {
      // Host disconnected - notify controller and clean up
      if (session.controllerSocketId) {
        io.to(session.controllerSocketId).emit('host-disconnected');
        socketToSession.delete(session.controllerSocketId);
      }
      sessions.delete(code);
      console.log(`[Session] ${code} destroyed (host left)`);
    } else if (session.controllerSocketId === socket.id) {
      // Controller disconnected - notify host, allow reconnect
      session.controllerSocketId = null;
      io.to(session.hostSocketId).emit('controller-disconnected');
      console.log(`[Session] Controller left session ${code}`);
    }
    
    socketToSession.delete(socket.id);
  });

  /**
   * Reconnect to existing session
   */
  socket.on('reconnect-session', (data, callback) => {
    const code = data.code.toUpperCase().trim();
    const session = sessions.get(code);
    
    if (!session) {
      callback({ success: false, error: 'Session no longer exists.' });
      return;
    }
    
    if (data.role === 'controller') {
      if (session.controllerSocketId && io.sockets.sockets.get(session.controllerSocketId)) {
        callback({ success: false, error: 'Another controller is connected.' });
        return;
      }
      session.controllerSocketId = socket.id;
      socketToSession.set(socket.id, code);
      socket.join(`session:${code}`);
      io.to(session.hostSocketId).emit('controller-connected', { controllerId: socket.id, reconnect: true });
      callback({ success: true, gameId: session.gameId });
    } else {
      callback({ success: false, error: 'Host reconnection not supported.' });
    }
  });
});

// ─── Start Server ─────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎮 VR Party Games Server running on port ${PORT}`);
  console.log(`   Local:   http://localhost:${PORT}`);
  
  // Show network addresses for mobile testing
  const os = require('os');
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        console.log(`   Network: http://${iface.address}:${PORT}`);
      }
    }
  }
  console.log('\n   Open on two devices to play!\n');
});