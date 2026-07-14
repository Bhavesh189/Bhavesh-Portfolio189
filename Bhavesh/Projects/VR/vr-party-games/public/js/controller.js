/**
 * Controller Device - Input capture and transmission
 * 
 * Captures: virtual joystick, buttons, device gyroscope
 * Transmits: real-time inputs via WebSocket
 */
(function() {
  'use strict';

  // ─── State ────────────────────────────────────────────────
  let socket = null;
  let sessionCode = null;
  let gameId = null;
  let inputManager = null;
  let latencyInterval = null;
  let vibrationEnabled = true;

  // ─── DOM Elements ─────────────────────────────────────────
  const screenJoin = document.getElementById('screenJoin');
  const screenController = document.getElementById('screenController');
  const codeInput = document.getElementById('codeInput');
  const btnJoin = document.getElementById('btnJoin');
  const joinError = document.getElementById('joinError');
  const connectingIndicator = document.getElementById('connectingIndicator');
  const ctrlGameName = document.getElementById('ctrlGameName');
  const ctrlLatency = document.getElementById('ctrlLatency');
  const ctrlScore = document.getElementById('ctrlScore');
  const ctrlHealthFill = document.getElementById('ctrlHealthFill');
  const buttonsArea = document.getElementById('buttonsArea');
  const gyroIndicator = document.getElementById('gyroIndicator');
  const disconnectedOverlay = document.getElementById('disconnectedOverlay');
  const btnCtrlFullscreen = document.getElementById('btnCtrlFullscreen');
  const btnCtrlVibrate = document.getElementById('btnCtrlVibrate');
  const btnCtrlMenu = document.getElementById('btnCtrlMenu');

  // ─── Initialize ───────────────────────────────────────────
  function init() {
    setupSocket();
    setupJoinUI();
    setupControllerUI();
    checkURLCode();
  }

  // ─── Check URL for pre-filled code (QR scan) ─────────────
  function checkURLCode() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      codeInput.value = code.toUpperCase();
      // Auto-join after a brief delay
      setTimeout(() => joinSession(), 500);
    }
  }

  // ─── Socket Setup ─────────────────────────────────────────
  function setupSocket() {
    socket = io({
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('[Controller] Connected:', socket.id);
      // If we were in a session, try reconnecting
      if (sessionCode && screenController.classList.contains('active')) {
        socket.emit('reconnect-session', { code: sessionCode, role: 'controller' }, (response) => {
          if (response.success) {
            disconnectedOverlay.style.display = 'none';
          }
        });
      }
    });

    socket.on('disconnect', () => {
      if (screenController.classList.contains('active')) {
        disconnectedOverlay.style.display = 'flex';
      }
    });

    // Game state feedback from host
    socket.on('game-state', (data) => {
      if (data.type === 'score' || data.score !== undefined) {
        ctrlScore.textContent = data.score;
      }
      if (data.type === 'health') {
        ctrlHealthFill.style.width = `${data.health}%`;
      }
      if (data.type === 'gameOver') {
        ctrlScore.textContent = data.score;
        vibrateDevice([200, 100, 200]);
      }
      if (data.type === 'hit') {
        vibrateDevice([100]);
        flashFeedback();
      }
    });

    // Session state changes
    socket.on('session-state', (data) => {
      if (data.state === 'playing') {
        // Game started
      }
    });

    // Host disconnected
    socket.on('host-disconnected', () => {
      alert('Host disconnected. Returning to join screen.');
      showScreen(screenJoin);
      sessionCode = null;
    });
  }

  // ─── Join UI ──────────────────────────────────────────────
  function setupJoinUI() {
    btnJoin.addEventListener('click', joinSession);
    
    codeInput.addEventListener('keyup', (e) => {
      codeInput.value = codeInput.value.toUpperCase();
      if (e.key === 'Enter') joinSession();
    });

    // Format input
    codeInput.addEventListener('input', () => {
      codeInput.value = codeInput.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });
  }

  function joinSession() {
    const code = codeInput.value.trim();
    if (code.length < 4) {
      showError('Please enter a valid session code.');
      return;
    }

    joinError.style.display = 'none';
    connectingIndicator.style.display = 'flex';
    btnJoin.disabled = true;

    socket.emit('join-session', { code }, (response) => {
      connectingIndicator.style.display = 'none';
      btnJoin.disabled = false;

      if (response.success) {
        sessionCode = code;
        gameId = response.gameId;
        setupGameController(gameId);
        showScreen(screenController);
        startLatencyMonitor();
        vibrateDevice([50]);
        
        // Lock screen orientation to landscape if possible
        try {
          screen.orientation.lock('landscape').catch(() => {});
        } catch(e) {}
      } else {
        showError(response.error);
      }
    });
  }

  function showError(msg) {
    joinError.textContent = msg;
    joinError.style.display = 'block';
  }

  // ─── Setup Game-Specific Controller ───────────────────────
  function setupGameController(gameId) {
    const gameNames = {
      'maze': 'VR Maze Explorer',
      'shooter': 'Space Defender'
    };
    ctrlGameName.textContent = gameNames[gameId] || gameId;

    // Configure buttons based on game type
    switch(gameId) {
      case 'maze':
        setupMazeControls();
        break;
      case 'shooter':
        setupShooterControls();
        break;
    }

    // Initialize input manager with joystick
    inputManager = new InputManager({
      joystickElement: document.getElementById('joystickContainer'),
      onInput: (inputData) => {
        socket.volatile.emit('controller-input', inputData);
      },
      onAction: (actionData) => {
        socket.emit('controller-action', actionData);
        vibrateDevice([30]);
      }
    });
  }

  function setupMazeControls() {
    buttonsArea.innerHTML = `
      <button class="ctrl-btn ctrl-btn-action" data-action="interact">🔓</button>
      <div class="ctrl-btn-row">
        <button class="ctrl-btn ctrl-btn-action2" data-action="sprint">⚡</button>
        <button class="ctrl-btn ctrl-btn-fire" data-action="jump">⬆</button>
      </div>
    `;
    gyroIndicator.style.display = 'none';
    setupButtonListeners();
  }

  function setupShooterControls() {
    buttonsArea.innerHTML = `
      <button class="ctrl-btn ctrl-btn-fire" data-action="fire">🔥</button>
      <div class="ctrl-btn-row">
        <button class="ctrl-btn ctrl-btn-action" data-action="shield">🛡️</button>
        <button class="ctrl-btn ctrl-btn-action2" data-action="special">💥</button>
      </div>
    `;
    gyroIndicator.style.display = 'flex';
    setupButtonListeners();
    
    // Enable gyro for aiming in shooter
    if (inputManager) {
      inputManager.enableGyro = true;
    }
  }

  function setupButtonListeners() {
    buttonsArea.querySelectorAll('.ctrl-btn').forEach(btn => {
      const action = btn.dataset.action;
      
      // Touch start
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        btn.style.transform = 'scale(0.85)';
        socket.emit('controller-action', { action, state: 'start' });
        vibrateDevice([20]);
      });
      
      // Touch end
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        btn.style.transform = 'scale(1)';
        socket.emit('controller-action', { action, state: 'end' });
      });

      // Mouse fallback
      btn.addEventListener('mousedown', (e) => {
        btn.style.transform = 'scale(0.85)';
        socket.emit('controller-action', { action, state: 'start' });
      });
      btn.addEventListener('mouseup', (e) => {
        btn.style.transform = 'scale(1)';
        socket.emit('controller-action', { action, state: 'end' });
      });
    });
  }

  // ─── Controller UI Setup ──────────────────────────────────
  function setupControllerUI() {
    btnCtrlFullscreen.addEventListener('click', () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        document.documentElement.requestFullscreen?.() || 
        document.documentElement.webkitRequestFullscreen?.();
      }
    });

    btnCtrlVibrate.addEventListener('click', () => {
      vibrationEnabled = !vibrationEnabled;
      btnCtrlVibrate.style.opacity = vibrationEnabled ? '1' : '0.4';
      vibrateDevice([30, 50, 30]);
    });

    btnCtrlMenu.addEventListener('click', () => {
      if (confirm('Leave game session?')) {
        showScreen(screenJoin);
        if (inputManager) {
          inputManager.destroy();
          inputManager = null;
        }
        sessionCode = null;
      }
    });
  }

  // ─── Latency Monitor ─────────────────────────────────────
  function startLatencyMonitor() {
    if (latencyInterval) clearInterval(latencyInterval);
    latencyInterval = setInterval(() => {
      const start = Date.now();
      socket.emit('ping-measure', {}, () => {
        const latency = Date.now() - start;
        ctrlLatency.textContent = `${latency}ms`;
        ctrlLatency.style.color = latency < 50 ? 'var(--success)' : 
                                   latency < 100 ? 'var(--warning)' : 'var(--danger)';
      });
    }, 3000);
  }

  // ─── Haptic Feedback ──────────────────────────────────────
  function vibrateDevice(pattern) {
    if (vibrationEnabled && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  }

  function flashFeedback() {
    const el = document.getElementById('ctrlFeedback');
    el.style.background = 'rgba(255, 107, 107, 0.3)';
    setTimeout(() => { el.style.background = ''; }, 200);
  }

  // ─── Screen Navigation ────────────────────────────────────
  function showScreen(screen) {
    [screenJoin, screenController].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
  }

  // ─── Init ─────────────────────────────────────────────────
  init();
})();