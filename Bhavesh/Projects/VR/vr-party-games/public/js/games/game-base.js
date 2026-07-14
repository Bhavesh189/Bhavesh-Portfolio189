/**
 * GameBase - Abstract base class for all games
 * 
 * Provides: Three.js scene setup, render loop, VR support,
 * camera controls, stereo rendering, common utilities
 */
class GameBase {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = options;
    this.vrEnabled = options.vrEnabled || false;
    this.socket = options.socket;
    
    // Callbacks
    this.onScoreUpdate = options.onScoreUpdate || (() => {});
    this.onTimerUpdate = options.onTimerUpdate || (() => {});
    this.onGameOver = options.onGameOver || (() => {});
    this.onHealthUpdate = options.onHealthUpdate || (() => {});
    
    // Game state
    this.score = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.isStereo = false;
    
    // Three.js
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();
    
    // Controller input state
    this.input = {
      joystick: { x: 0, y: 0 },
      gyro: null,
      actions: {}
    };
    
    // Device orientation for VR-like head tracking
    this.deviceOrientation = { alpha: 0, beta: 90, gamma: 0 };
    this.orientationQuat = new THREE.Quaternion();
    this.useDeviceOrientation = false;
    
    // Audio
    this.audioCtx = null;
    this.sounds = {};
    
    // Animation frame
    this._animFrame = null;
  }

  // ─── Scene Setup ──────────────────────────────────────────

  initThreeJS() {
    // Scene
    this.scene = new THREE.Scene();
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    
    // Handle resize
    this._resizeHandler = () => this._onResize();
    window.addEventListener('resize', this._resizeHandler);
    
    // Setup device orientation for head tracking
    this._setupDeviceOrientation();
    
    // Initialize audio context
    this._initAudio();
  }

  // ─── Device Orientation (Head Tracking) ───────────────────

  _setupDeviceOrientation() {
    if (this.vrEnabled || this.isStereo) {
      this.useDeviceOrientation = true;
    }
    
    const handleOrientation = (e) => {
      if (!this.useDeviceOrientation) return;
      this.deviceOrientation = {
        alpha: e.alpha || 0,
        beta: e.beta || 0,
        gamma: e.gamma || 0
      };
    };

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      document.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission()
          .then(state => {
            if (state === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          });
      }, { once: true });
    } else {
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }

  _updateCameraFromOrientation() {
    if (!this.useDeviceOrientation) return;
    
    const { alpha, beta, gamma } = this.deviceOrientation;
    
    // Convert device orientation to quaternion
    const euler = new THREE.Euler();
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
    
    euler.set(
      THREE.MathUtils.degToRad(beta),
      THREE.MathUtils.degToRad(alpha),
      -THREE.MathUtils.degToRad(gamma),
      'YXZ'
    );
    
    this.orientationQuat.setFromEuler(euler);
    this.orientationQuat.multiply(q1);
    
    // Apply to camera
    this.camera.quaternion.copy(this.orientationQuat);
  }

  // ─── VR / Stereo Mode ────────────────────────────────────

  async enterVR() {
    if (!navigator.xr) {
      console.warn('WebXR not available');
      this.toggleStereo();
      return;
    }

    try {
      const supported = await navigator.xr.isSessionSupported('immersive-vr');
      if (supported) {
        this.renderer.xr.enabled = true;
        const session = await navigator.xr.requestSession('immersive-vr', {
          optionalFeatures: ['local-floor', 'bounded-floor']
        });
        this.renderer.xr.setSession(session);
      } else {
        this.toggleStereo();
      }
    } catch (e) {
      console.warn('VR session failed:', e);
      this.toggleStereo();
    }
  }

  toggleStereo() {
    this.isStereo = !this.isStereo;
    this.useDeviceOrientation = this.isStereo;
    
    if (this.isStereo) {
      // Stereo rendering - split screen for cardboard
      this._stereoEffect = true;
    } else {
      this._stereoEffect = false;
    }
  }

  _renderStereo() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const halfWidth = width / 2;
    
    // Store original
    const originalAspect = this.camera.aspect;
    this.camera.aspect = halfWidth / height;
    this.camera.updateProjectionMatrix();
    
    // Left eye
    this.renderer.setViewport(0, 0, halfWidth, height);
    this.renderer.setScissor(0, 0, halfWidth, height);
    this.renderer.setScissorTest(true);
    
    const eyeOffset = 0.032; // IPD / 2
    this.camera.position.x -= eyeOffset;
    this.renderer.render(this.scene, this.camera);
    
    // Right eye
    this.renderer.setViewport(halfWidth, 0, halfWidth, height);
    this.renderer.setScissor(halfWidth, 0, halfWidth, height);
    
    this.camera.position.x += eyeOffset * 2;
    this.renderer.render(this.scene, this.camera);
    
    // Restore
    this.camera.position.x -= eyeOffset;
    this.camera.aspect = originalAspect;
    this.camera.updateProjectionMatrix();
    this.renderer.setScissorTest(false);
    this.renderer.setViewport(0, 0, width, height);
  }

  // ─── Audio System ─────────────────────────────────────────

  _initAudio() {
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('AudioContext not available');
    }
  }

  playSound(type) {
    if (!this.audioCtx) return;
    
    // Resume if suspended
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    
    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    switch(type) {
      case 'shoot':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
        
      case 'hit':
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
        break;
        
      case 'collect':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.08);
        osc.frequency.setValueAtTime(784, now + 0.16);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
        
      case 'success':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523, now);
        osc.frequency.setValueAtTime(659, now + 0.15);
        osc.frequency.setValueAtTime(784, now + 0.3);
        osc.frequency.setValueAtTime(1047, now + 0.45);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
        break;
        
      case 'explosion':
        // White noise burst
        const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
        const channel = buffer.getChannelData(0);
        for (let i = 0; i < channel.length; i++) {
          channel[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / channel.length, 2);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.3, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);
        // Still stop the oscillator
        gain.gain.setValueAtTime(0, now);
        osc.start(now);
        osc.stop(now + 0.01);
        break;

      case 'footstep':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(60, now + 0.05);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;

      default:
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
    }
  }

  // ─── Input Handling ───────────────────────────────────────

  handleInput(data) {
    if (data.joystick) {
      this.input.joystick = data.joystick;
    }
    if (data.gyro) {
      this.input.gyro = data.gyro;
    }
  }

  handleAction(data) {
    this.input.actions[data.action] = data.state === 'start';
  }

  // ─── Scoring ──────────────────────────────────────────────

  addScore(points) {
    this.score += points;
    this.onScoreUpdate(this.score);
  }

  // ─── Render Loop ──────────────────────────────────────────

  _gameLoop() {
    if (!this.isRunning) return;
    
    this._animFrame = requestAnimationFrame(() => this._gameLoop());
    
    const delta = this.clock.getDelta();
    const elapsed = this.clock.getElapsedTime();
    
    if (!this.isPaused) {
      // Update head tracking
      this._updateCameraFromOrientation();
      
      // Game-specific update
      this.update(delta, elapsed);
    }
    
    // Render
    if (this._stereoEffect) {
      this._renderStereo();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  // ─── Resize Handler ───────────────────────────────────────

  _onResize() {
    if (!this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ─── Lifecycle (Override in subclasses) ────────────────────

  /** Setup game objects. Called once. */
  setup() {}

  /** Update game logic. Called every frame. */
  update(delta, elapsed) {}

  /** Called when controller connects */
  onControllerConnected() {}

  /** Called when controller disconnects */
  onControllerDisconnected() {}

  /** Start the game */
  start() {
    this.initThreeJS();
    this.setup();
    this.isRunning = true;
    this.score = 0;
    this.clock.start();
    this._gameLoop();
  }

  /** Destroy and cleanup */
  destroy() {
    this.isRunning = false;
    if (this._animFrame) {
      cancelAnimationFrame(this._animFrame);
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }
    if (this.audioCtx) {
      this.audioCtx.close().catch(() => {});
    }
    // Clean scene
    if (this.scene) {
      this.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
    }
  }

  // ─── Utilities ────────────────────────────────────────────

  createMaterial(color, options = {}) {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: options.roughness ?? 0.7,
      metalness: options.metalness ?? 0.1,
      ...options
    });
  }

  addLighting() {
    // Ambient
    const ambient = new THREE.AmbientLight(0x404060, 0.5);
    this.scene.add(ambient);
    
    // Directional (sun)
    const sun = new THREE.DirectionalLight(0xffffff, 1.0);
    sun.position.set(10, 20, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 50;
    sun.shadow.camera.left = -20;
    sun.shadow.camera.right = 20;
    sun.shadow.camera.top = 20;
    sun.shadow.camera.bottom = -20;
    this.scene.add(sun);
    
    // Hemisphere
    const hemi = new THREE.HemisphereLight(0x88aaff, 0x445522, 0.3);
    this.scene.add(hemi);
    
    return { ambient, sun, hemi };
  }
}

window.GameBase = GameBase;