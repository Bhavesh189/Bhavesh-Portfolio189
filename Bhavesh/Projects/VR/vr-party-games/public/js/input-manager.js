/**
 * InputManager - Handles virtual joystick, gyroscope, and touch input
 * 
 * Provides normalized input data:
 * - joystick: { x: -1..1, y: -1..1 }
 * - gyro: { alpha, beta, gamma }
 * 
 * Sends input at a fixed rate for consistency
 */
class InputManager {
  constructor(options) {
    this.onInput = options.onInput || (() => {});
    this.onAction = options.onAction || (() => {});
    this.enableGyro = options.enableGyro || false;
    
    // Joystick state
    this.joystick = { x: 0, y: 0, active: false };
    this.joystickElement = options.joystickElement;
    this.joystickHandle = this.joystickElement?.querySelector('.joystick-handle');
    this.joystickBase = this.joystickElement?.querySelector('.joystick-base');
    
    // Gyro state
    this.gyro = { alpha: 0, beta: 0, gamma: 0 };
    this.gyroCalibration = null;
    
    // Touch tracking
    this.joystickTouchId = null;
    this.joystickCenter = { x: 0, y: 0 };
    this.joystickRadius = 45; // Max distance handle can move
    
    // Input send rate (60fps)
    this.sendInterval = null;
    this.destroyed = false;
    
    this._bindEvents();
    this._startSendLoop();
  }

  _bindEvents() {
    // ─── Joystick Touch Events ────────────────────────
    if (this.joystickElement) {
      const area = this.joystickElement.closest('.ctrl-joystick-area') || this.joystickElement;
      
      area.addEventListener('touchstart', (e) => this._onJoystickStart(e), { passive: false });
      area.addEventListener('touchmove', (e) => this._onJoystickMove(e), { passive: false });
      area.addEventListener('touchend', (e) => this._onJoystickEnd(e), { passive: false });
      area.addEventListener('touchcancel', (e) => this._onJoystickEnd(e), { passive: false });
      
      // Mouse fallback
      area.addEventListener('mousedown', (e) => this._onMouseJoystickStart(e));
      window.addEventListener('mousemove', (e) => this._onMouseJoystickMove(e));
      window.addEventListener('mouseup', () => this._onMouseJoystickEnd());
    }

    // ─── Gyroscope ────────────────────────────────────
    if (window.DeviceOrientationEvent) {
      // Request permission on iOS 13+
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // We'll request on first interaction
        document.addEventListener('click', () => {
          DeviceOrientationEvent.requestPermission()
            .then(state => {
              if (state === 'granted') {
                window.addEventListener('deviceorientation', (e) => this._onGyro(e));
              }
            })
            .catch(console.warn);
        }, { once: true });
      } else {
        window.addEventListener('deviceorientation', (e) => this._onGyro(e));
      }
    }
  }

  // ─── Joystick: Touch ──────────────────────────────────────

  _onJoystickStart(e) {
    e.preventDefault();
    if (this.joystickTouchId !== null) return;
    
    const touch = e.changedTouches[0];
    this.joystickTouchId = touch.identifier;
    
    const rect = this.joystickBase.getBoundingClientRect();
    this.joystickCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    
    this.joystick.active = true;
    this.joystickHandle.classList.add('active');
    this._updateJoystickFromTouch(touch);
  }

  _onJoystickMove(e) {
    e.preventDefault();
    if (this.joystickTouchId === null) return;
    
    for (const touch of e.changedTouches) {
      if (touch.identifier === this.joystickTouchId) {
        this._updateJoystickFromTouch(touch);
        break;
      }
    }
  }

  _onJoystickEnd(e) {
    if (this.joystickTouchId === null) return;
    
    for (const touch of e.changedTouches) {
      if (touch.identifier === this.joystickTouchId) {
        this.joystickTouchId = null;
        this.joystick = { x: 0, y: 0, active: false };
        this.joystickHandle.classList.remove('active');
        this.joystickHandle.style.transform = 'translate(-50%, -50%)';
        break;
      }
    }
  }

  _updateJoystickFromTouch(touch) {
    let dx = touch.clientX - this.joystickCenter.x;
    let dy = touch.clientY - this.joystickCenter.y;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDist = this.joystickRadius;
    
    if (distance > maxDist) {
      dx = (dx / distance) * maxDist;
      dy = (dy / distance) * maxDist;
    }
    
    // Normalized -1 to 1
    this.joystick.x = dx / maxDist;
    this.joystick.y = dy / maxDist;
    
    // Update visual
    const handleX = -50 + (dx / maxDist) * 40;
    const handleY = -50 + (dy / maxDist) * 40;
    this.joystickHandle.style.transform = `translate(${handleX}%, ${handleY}%)`;
  }

  // ─── Joystick: Mouse Fallback ─────────────────────────────

  _onMouseJoystickStart(e) {
    this.joystick.active = true;
    this.joystickHandle.classList.add('active');
    const rect = this.joystickBase.getBoundingClientRect();
    this.joystickCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
    this._mouseActive = true;
  }

  _onMouseJoystickMove(e) {
    if (!this._mouseActive) return;
    
    let dx = e.clientX - this.joystickCenter.x;
    let dy = e.clientY - this.joystickCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDist = this.joystickRadius;
    
    if (distance > maxDist) {
      dx = (dx / distance) * maxDist;
      dy = (dy / distance) * maxDist;
    }
    
    this.joystick.x = dx / maxDist;
    this.joystick.y = dy / maxDist;
    
    const handleX = -50 + (dx / maxDist) * 40;
    const handleY = -50 + (dy / maxDist) * 40;
    this.joystickHandle.style.transform = `translate(${handleX}%, ${handleY}%)`;
  }

  _onMouseJoystickEnd() {
    if (!this._mouseActive) return;
    this._mouseActive = false;
    this.joystick = { x: 0, y: 0, active: false };
    this.joystickHandle.classList.remove('active');
    this.joystickHandle.style.transform = 'translate(-50%, -50%)';
  }

  // ─── Gyroscope ────────────────────────────────────────────

  _onGyro(e) {
    if (!this.enableGyro) return;
    
    // Calibrate on first reading
    if (!this.gyroCalibration) {
      this.gyroCalibration = {
        alpha: e.alpha || 0,
        beta: e.beta || 0,
        gamma: e.gamma || 0
      };
    }
    
    this.gyro = {
      alpha: ((e.alpha || 0) - this.gyroCalibration.alpha),
      beta: ((e.beta || 0) - this.gyroCalibration.beta),
      gamma: ((e.gamma || 0) - this.gyroCalibration.gamma)
    };
    
    // Update gyro dot visual
    const gyroDot = document.getElementById('gyroDot');
    if (gyroDot) {
      const clampedGamma = Math.max(-30, Math.min(30, this.gyro.gamma));
      const clampedBeta = Math.max(-30, Math.min(30, this.gyro.beta));
      gyroDot.style.transform = `translate(${clampedGamma * 2}px, ${clampedBeta * 1.5}px)`;
    }
  }

  recalibrateGyro() {
    this.gyroCalibration = null;
  }

  // ─── Send Loop ────────────────────────────────────────────

  _startSendLoop() {
    // Send at ~30fps for network efficiency
    this.sendInterval = setInterval(() => {
      if (this.destroyed) return;
      
      const data = {
        joystick: { x: this.joystick.x, y: this.joystick.y },
        gyro: this.enableGyro ? this.gyro : null,
        active: this.joystick.active
      };
      
      this.onInput(data);
    }, 33); // ~30 Hz
  }

  // ─── Cleanup ──────────────────────────────────────────────

  destroy() {
    this.destroyed = true;
    if (this.sendInterval) {
      clearInterval(this.sendInterval);
    }
  }
}

// Make available globally
window.InputManager = InputManager;