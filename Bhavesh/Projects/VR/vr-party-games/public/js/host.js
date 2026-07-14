/**
 * Host Device - Game host logic
 * 
 * Manages: game selection, session creation, game lifecycle,
 * WebXR VR mode, and controller input reception.
 */
(function() {
  'use strict';

  // ─── Game Registry ────────────────────────────────────────
  const GAMES = [
    {
      id: 'maze',
      name: 'VR Maze Explorer',
      icon: '🏰',
      description: 'Navigate through a procedurally generated 3D maze. Find the exit before time runs out!',
      badges: ['VR', 'Multiplayer'],
      GameClass: MazeGame
    },
    {
      id: 'shooter',
      name: 'Space Defender',
      icon: '🚀',
      description: 'Shoot incoming asteroids and enemy ships. Aim with head movement, fire from controller!',
      badges: ['VR', 'Multiplayer', 'Action'],
      GameClass: ShooterGame
    }
  ];

  // ─── State ────────────────────────────────────────────────
  let socket = null;
  let currentGame = null;
  let sessionCode = null;
  let controllerConnected = false;
  let isVRMode = false;

  // ─── DOM Elements ─────────────────────────────────────────
  const screenSelect = document.getElementById('screenSelect');
  const screenWaiting = document.getElementById('screenWaiting');
  const screenGame = document.getElementById('screenGame');
  const gameGrid = document.getElementById('gameGrid');
  const sessionCodeEl = document.getElementById('sessionCode');
  const qrCode = document.getElementById('qrCode');
  const waitingText = document.getElementById('waitingText');
  const selectedGameName = document.getElementById('selectedGameName');
  const btnStartVR = document.getElementById('btnStartVR');
  const btnStartFlat = document.getElementById('btnStartFlat');
  const canvas = document.getElementById('gameCanvas');
  const hudScore = document.getElementById('hudScore');
  const hudTimer = document.getElementById('hudTimer');
  const hudConnectionStatus = document.getElementById('hudConnectionStatus');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const finalScore = document.getElementById('finalScore');
  const btnVRToggle = document.getElementById('btnVRToggle');
  const btnFullscreen = document.getElementById('btnFullscreen');
  const btnExitGame = document.getElementById('btnExitGame');
  const btnPlayAgain = document.getElementById('btnPlayAgain');
  const btnBackToMenu = document.getElementById('btnBackToMenu');
  const gameHud = document.getElementById('gameHud');

  // ─── Initialize ───────────────────────────────────────────
  function init() {
    buildGameGrid();
    setupSocket();
    setupUIHandlers();
  }

  // ─── Build Game Selection Grid ────────────────────────────
  function buildGameGrid() {
    gameGrid.innerHTML = GAMES.map(game => `
      <div class="game-card" data-game-id="${game.id}">
        <div class="game-card-icon">${game.icon}</div>
        <div class="game-card-info">
          <h3>${game.name}</h3>
          <p>${game.description}</p>
          <div class="game-card-badges">
            ${game.badges.map(b => 
              `<span class="badge ${b.toLowerCase()}">${b}</span>`
            ).join('')}
          </div>
        </div>
      </div>
    `).join('');

    // Click handlers
    gameGrid.querySelectorAll('.game-card').forEach(card => {
      card.addEventListener('click', () => selectGame(card.dataset.gameId));
    });
  }

  // ─── Socket Setup ─────────────────────────────────────────
  function setupSocket() {
    socket = io({
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    socket.on('connect', () => {
      console.log('[Host] Connected to server:', socket.id);
    });

    // Controller connected
    socket.on('controller-connected', (data) => {
      console.log('[Host] Controller connected:', data.controllerId);
      controllerConnected = true;
      waitingText.textContent = 'Controller connected! Ready to play.';
      document.querySelector('.pulse-ring').style.background = 'var(--success)';
      
      // Show start buttons
      btnStartVR.style.display = 'inline-flex';
      btnStartFlat.style.display = 'inline-flex';

      // Update HUD
      const statusDot = hudConnectionStatus.querySelector('.status-dot');
      if (statusDot) statusDot.className = 'status-dot connected';
      
      // Notify game
      if (currentGame && currentGame.onControllerConnected) {
        currentGame.onControllerConnected();
      }
    });

    // Controller disconnected
    socket.on('controller-disconnected', () => {
      console.log('[Host] Controller disconnected');
      controllerConnected = false;
      
      const statusDot = hudConnectionStatus.querySelector('.status-dot');
      if (statusDot) statusDot.className = 'status-dot disconnected';
      
      if (currentGame && currentGame.onControllerDisconnected) {
        currentGame.onControllerDisconnected();
      }
    });

    // Receive controller inputs
    socket.on('controller-input', (data) => {
      if (currentGame && currentGame.handleInput) {
        currentGame.handleInput(data);
      }
    });

    // Receive controller actions (reliable)
    socket.on('controller-action', (data) => {
      if (currentGame && currentGame.handleAction) {
        currentGame.handleAction(data);
      }
    });
  }

  // ─── UI Event Handlers ────────────────────────────────────
  function setupUIHandlers() {
    btnStartVR.addEventListener('click', () => startGame(true));
    btnStartFlat.addEventListener('click', () => startGame(false));
    
    btnVRToggle.addEventListener('click', toggleVR);
    btnFullscreen.addEventListener('click', toggleFullscreen);
    btnExitGame.addEventListener('click', exitGame);
    btnPlayAgain.addEventListener('click', playAgain);
    btnBackToMenu.addEventListener('click', backToMenu);
  }

  // ─── Game Selection ───────────────────────────────────────
  function selectGame(gameId) {
    const gameDef = GAMES.find(g => g.id === gameId);
    if (!gameDef) return;

    selectedGameName.textContent = gameDef.name;

    // Create session on server
    socket.emit('create-session', { gameId }, (response) => {
      if (response.success) {
        sessionCode = response.code;
        sessionCodeEl.textContent = sessionCode;
        
        // Load QR code
        fetch(`/api/qrcode/${sessionCode}`)
          .then(r => r.json())
          .then(data => {
            qrCode.src = data.qr;
          })
          .catch(() => {
            document.getElementById('qrContainer').style.display = 'none';
          });

        showScreen(screenWaiting);
        
        // Store selected game class
        window._selectedGameClass = gameDef.GameClass;
        window._selectedGameId = gameId;
      }
    });
  }

  // ─── Start Game ───────────────────────────────────────────
  function startGame(vrEnabled) {
    isVRMode = vrEnabled;
    showScreen(screenGame);
    gameOverOverlay.style.display = 'none';

    // Initialize game
    const GameClass = window._selectedGameClass;
    currentGame = new GameClass(canvas, {
      vrEnabled,
      socket,
      onScoreUpdate: (score) => {
        hudScore.textContent = score;
        // Send to controller
        socket.emit('game-state', { score, type: 'score' });
      },
      onTimerUpdate: (time) => {
        hudTimer.textContent = time;
      },
      onGameOver: (score) => {
        finalScore.textContent = score;
        gameOverOverlay.style.display = 'flex';
        socket.emit('game-state', { type: 'gameOver', score });
      },
      onHealthUpdate: (health) => {
        socket.emit('game-state', { type: 'health', health });
      }
    });

    currentGame.start();
    
    // Notify server
    socket.emit('session-state', { state: 'playing' });

    // Enter fullscreen
    if (!vrEnabled) {
      tryFullscreen();
    }
  }

  // ─── VR Toggle ────────────────────────────────────────────
  async function toggleVR() {
    if (!currentGame) return;
    
    if (currentGame.renderer && currentGame.renderer.xr) {
      if (currentGame.renderer.xr.isPresenting) {
        await currentGame.renderer.xr.getSession().end();
        isVRMode = false;
        gameHud.classList.remove('vr-mode');
      } else {
        try {
          await currentGame.enterVR();
          isVRMode = true;
          gameHud.classList.add('vr-mode');
        } catch (e) {
          console.warn('WebXR not available, using stereo mode');
          currentGame.toggleStereo();
        }
      }
    } else if (currentGame.toggleStereo) {
      currentGame.toggleStereo();
    }
  }

  // ─── Fullscreen ───────────────────────────────────────────
  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      tryFullscreen();
    }
  }

  function tryFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }

  // ─── Game Lifecycle ───────────────────────────────────────
  function playAgain() {
    if (currentGame) {
      currentGame.destroy();
    }
    gameOverOverlay.style.display = 'none';
    startGame(isVRMode);
  }

  function exitGame() {
    if (currentGame) {
      currentGame.destroy();
      currentGame = null;
    }
    showScreen(screenWaiting);
    socket.emit('session-state', { state: 'waiting' });
  }

  function backToMenu() {
    if (currentGame) {
      currentGame.destroy();
      currentGame = null;
    }
    showScreen(screenSelect);
  }

  // ─── Screen Navigation ────────────────────────────────────
  function showScreen(screen) {
    [screenSelect, screenWaiting, screenGame].forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
  }

  // ─── Init ─────────────────────────────────────────────────
  init();
})();