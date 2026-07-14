/**
 * ShooterGame - Space Defender
 * 
 * Player is stationary. Asteroids/enemies fly toward you.
 * Aim with head movement (gyro on host) or controller gyro.
 * Fire with controller button.
 * Survive waves of increasing difficulty.
 */
class ShooterGame extends GameBase {
  constructor(canvas, options) {
    super(canvas, options);
    
    // Player state
    this.health = 100;
    this.maxHealth = 100;
    this.shieldActive = false;
    this.shieldCooldown = 0;
    this.specialCharges = 3;
    
    // Aiming
    this.aimPitch = 0;
    this.aimYaw = 0;
    this.crosshairTarget = new THREE.Vector3(0, 0, -20);
    
    // Projectiles
    this.bullets = [];
    this.bulletSpeed = 60;
    this.fireRate = 0.15; // seconds between shots
    this.fireCooldown = 0;
    this.isFiring = false;
    
    // Enemies
    this.enemies = [];
    this.enemySpawnRate = 2.0; // seconds
    this.spawnTimer = 0;
    this.wave = 1;
    this.waveTimer = 0;
    this.enemiesPerWave = 5;
    this.enemiesSpawnedThisWave = 0;
    this.enemiesDestroyedThisWave = 0;
    
    // Explosions
    this.explosions = [];
    
    // Stars
    this.stars = null;
    
    // Crosshair
    this.crosshair = null;
    
    // Combo
    this.combo = 0;
    this.comboTimer = 0;
  }

  // ─── Setup ────────────────────────────────────────────────

  setup() {
    // Space background
    this.scene.background = new THREE.Color(0x050510);
    
    // Stars
    this._createStarfield();
    
    // Lighting
    const ambient = new THREE.AmbientLight(0x222244, 0.5);
    this.scene.add(ambient);
    
    const sunLight = new THREE.DirectionalLight(0xffffee, 1.2);
    sunLight.position.set(5, 10, 5);
    this.scene.add(sunLight);
    
    const blueLight = new THREE.PointLight(0x6c5ce7, 0.8, 50);
    blueLight.position.set(-10, 5, -10);
    this.scene.add(blueLight);
    
    // Camera at origin
    this.camera.position.set(0, 0, 0);
    
    // Crosshair
    this._createCrosshair();
    
    // Shield visual
    this._createShield();
    
    // HUD
    this.onScoreUpdate(0);
    this.onHealthUpdate(100);
  }

  // ─── Starfield ────────────────────────────────────────────

  _createStarfield() {
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Distribute in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 80 + Math.random() * 120;
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = r * Math.cos(phi);
      
      const brightness = 0.5 + Math.random() * 0.5;
      colors[i3] = brightness;
      colors[i3 + 1] = brightness;
      colors[i3 + 2] = brightness * (0.8 + Math.random() * 0.2);
    }
    
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const mat = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      sizeAttenuation: true
    });
    
    this.stars = new THREE.Points(geo, mat);
    this.scene.add(this.stars);
  }

  // ─── Crosshair ────────────────────────────────────────────

  _createCrosshair() {
    const group = new THREE.Group();
    
    // Center dot
    const dotGeo = new THREE.CircleGeometry(0.05, 16);
    const dotMat = new THREE.MeshBasicMaterial({ 
      color: 0xff3333, 
      transparent: true, 
      opacity: 0.9,
      depthTest: false
    });
    const dot = new THREE.Mesh(dotGeo, dotMat);
    group.add(dot);
    
    // Ring
    const ringGeo = new THREE.RingGeometry(0.15, 0.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({ 
      color: 0xff3333, 
      transparent: true, 
      opacity: 0.5,
      side: THREE.DoubleSide,
      depthTest: false 
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);
    
    // Cross lines
    const lineMat = new THREE.MeshBasicMaterial({ 
      color: 0xff3333, 
      transparent: true, 
      opacity: 0.4,
      depthTest: false
    });
    
    for (let i = 0; i < 4; i++) {
      const lineGeo = new THREE.PlaneGeometry(0.02, 0.12);
      const line = new THREE.Mesh(lineGeo, lineMat);
      const angle = (i * Math.PI) / 2;
      line.position.set(Math.cos(angle) * 0.3, Math.sin(angle) * 0.3, 0);
      line.rotation.z = angle;
      group.add(line);
    }
    
    group.position.set(0, 0, -5);
    group.renderOrder = 999;
    this.camera.add(group);
    this.scene.add(this.camera);
    this.crosshair = group;
  }

  // ─── Shield ───────────────────────────────────────────────

  _createShield() {
    const shieldGeo = new THREE.SphereGeometry(2, 16, 16);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x00cec9,
      transparent: true,
      opacity: 0,
      wireframe: true,
      side: THREE.DoubleSide
    });
    this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    this.camera.add(this.shieldMesh);
  }

  // ─── Update Loop ──────────────────────────────────────────

  update(delta, elapsed) {
    // Update aiming
    this._updateAim(delta);
    
    // Handle firing
    this._updateFiring(delta);
    
    // Update shield
    this._updateShield(delta);
    
    // Spawn enemies
    this._updateSpawning(delta);
    
    // Update enemies
    this._updateEnemies(delta);
    
    // Update bullets
    this._updateBullets(delta);
    
    // Check collisions
    this._checkCollisions();
    
    // Update explosions
    this._updateExplosions(delta);
    
    // Update combo
    this._updateCombo(delta);
    
    // Rotate stars slowly
    if (this.stars) {
      this.stars.rotation.y += delta * 0.01;
    }
    
    // Animate crosshair
    if (this.crosshair) {
      this.crosshair.children[1].rotation.z += delta * 2; // Spin ring
    }
    
    // Wave info
    const waveText = `Wave ${this.wave}`;
    this.onTimerUpdate(waveText);
    
    // Check game over
    if (this.health <= 0) {
      this.health = 0;
      this.onHealthUpdate(0);
      this.onGameOver(this.score);
      return;
    }
  }

  // ─── Aiming ───────────────────────────────────────────────

  _updateAim(delta) {
    // Use controller joystick for aiming (right stick equivalent)
    const jx = this.input.joystick.x;
    const jy = this.input.joystick.y;
    
    // Controller gyro for fine aiming
    if (this.input.gyro) {
      this.aimYaw -= this.input.gyro.gamma * 0.0015;
      this.aimPitch -= this.input.gyro.beta * 0.0015;
    }
    
    // Joystick for aiming
    this.aimYaw += jx * delta * 2.5;
    this.aimPitch -= jy * delta * 2.5;
    
    // Clamp pitch
    this.aimPitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.aimPitch));
    this.aimYaw = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.aimYaw));
    
    // Apply to camera only if not using device orientation
    if (!this.useDeviceOrientation) {
      this.camera.rotation.order = 'YXZ';
      this.camera.rotation.y = -this.aimYaw;
      this.camera.rotation.x = this.aimPitch;
    }
  }

  // ─── Firing ───────────────────────────────────────────────

  _updateFiring(delta) {
    this.fireCooldown -= delta;
    
    // Fire button from controller
    if (this.input.actions['fire'] && this.fireCooldown <= 0) {
      this._fire();
      this.fireCooldown = this.fireRate;
    }
    
    // Special attack
    if (this.input.actions['special']) {
      this.input.actions['special'] = false; // One-shot
      this._fireSpecial();
    }
  }

  _fire() {
    // Create bullet
    const bulletGeo = new THREE.SphereGeometry(0.1, 6, 6);
    const bulletMat = new THREE.MeshBasicMaterial({
      color: 0xff4444,
      emissive: 0xff4444
    });
    const bullet = new THREE.Mesh(bulletGeo, bulletMat);
    
    // Position at camera
    bullet.position.copy(this.camera.position);
    
    // Direction from camera
    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyQuaternion(this.camera.quaternion);
    
    // Add light to bullet
    const bulletLight = new THREE.PointLight(0xff4444, 0.5, 5);
    bullet.add(bulletLight);
    
    this.scene.add(bullet);
    this.bullets.push({
      mesh: bullet,
      velocity: dir.multiplyScalar(this.bulletSpeed),
      life: 3 // seconds
    });
    
    this.playSound('shoot');
  }

  _fireSpecial() {
    if (this.specialCharges <= 0) return;
    this.specialCharges--;
    
    // Destroy all visible enemies
    for (const enemy of this.enemies) {
      this._destroyEnemy(enemy, true);
    }
    this.enemies = [];
    
    this.playSound('explosion');
    
    // Flash effect
    const flash = new THREE.PointLight(0xffffff, 5, 100);
    flash.position.copy(this.camera.position);
    this.scene.add(flash);
    
    setTimeout(() => this.scene.remove(flash), 200);
  }

  _updateBullets(delta) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.mesh.position.add(b.velocity.clone().multiplyScalar(delta));
      b.life -= delta;
      
      if (b.life <= 0 || b.mesh.position.length() > 100) {
        this.scene.remove(b.mesh);
        b.mesh.geometry.dispose();
        b.mesh.material.dispose();
        this.bullets.splice(i, 1);
      }
    }
  }

  // ─── Shield ───────────────────────────────────────────────

  _updateShield(delta) {
    this.shieldCooldown -= delta;
    
    if (this.input.actions['shield'] && this.shieldCooldown <= 0) {
      this.shieldActive = true;
    } else if (!this.input.actions['shield']) {
      if (this.shieldActive) {
        this.shieldCooldown = 3; // 3 second cooldown
      }
      this.shieldActive = false;
    }
    
    // Visual
    const targetOpacity = this.shieldActive ? 0.3 : 0;
    this.shieldMesh.material.opacity += (targetOpacity - this.shieldMesh.material.opacity) * 5 * delta;
    
    if (this.shieldActive) {
      this.shieldMesh.rotation.y += delta * 3;
    }
  }

  // ─── Enemy Spawning ───────────────────────────────────────

  _updateSpawning(delta) {
    this.spawnTimer -= delta;
    this.waveTimer += delta;
    
    if (this.spawnTimer <= 0 && this.enemiesSpawnedThisWave < this.enemiesPerWave) {
      this._spawnEnemy();
      this.enemiesSpawnedThisWave++;
      this.spawnTimer = this.enemySpawnRate;
    }
    
    // Check wave complete
    if (this.enemiesDestroyedThisWave >= this.enemiesPerWave && this.enemies.length === 0) {
      this._nextWave();
    }
  }

  _spawnEnemy() {
    // Random position on a sphere around player
    const angle = Math.random() * Math.PI * 2;
    const elevation = (Math.random() - 0.5) * Math.PI * 0.6;
    const distance = 30 + Math.random() * 20;
    
    const x = Math.cos(angle) * Math.cos(elevation) * distance;
    const y = Math.sin(elevation) * distance;
    const z = Math.sin(angle) * Math.cos(elevation) * distance;
    
    // Enemy type
    const types = ['asteroid', 'ship'];
    const type = this.wave >= 3 ? types[Math.floor(Math.random() * 2)] : 'asteroid';
    
    let mesh;
    let hp;
    let speed;
    let points;
    
    if (type === 'asteroid') {
      const size = 0.5 + Math.random() * 1;
      const geo = new THREE.IcosahedronGeometry(size, 1);
      // Randomize vertices for rocky look
      const positions = geo.attributes.position;
      for (let i = 0; i < positions.count; i++) {
        const offset = 0.8 + Math.random() * 0.4;
        positions.setXYZ(
          i,
          positions.getX(i) * offset,
          positions.getY(i) * offset,
          positions.getZ(i) * offset
        );
      }
      geo.computeVertexNormals();
      
      const mat = new THREE.MeshStandardMaterial({
        color: 0x665544,
        roughness: 0.9,
        metalness: 0.1
      });
      mesh = new THREE.Mesh(geo, mat);
      hp = Math.ceil(size * 2);
      speed = 5 + Math.random() * 5 + this.wave * 0.5;
      points = Math.ceil(size * 50);
    } else {
      // Enemy ship
      const bodyGeo = new THREE.ConeGeometry(0.5, 2, 6);
      const bodyMat = new THREE.MeshStandardMaterial({
        color: 0xcc3333,
        emissive: 0x331111,
        metalness: 0.7,
        roughness: 0.3
      });
      mesh = new THREE.Mesh(bodyGeo, bodyMat);
      mesh.rotation.x = Math.PI / 2;
      
      // Engine glow
      const engineLight = new THREE.PointLight(0xff3333, 1, 5);
      engineLight.position.set(0, -1, 0);
      mesh.add(engineLight);
      
      hp = 2;
      speed = 8 + this.wave;
      points = 150;
    }
    
    mesh.position.set(x, y, z);
    this.scene.add(mesh);
    
    // Direction toward player (with some randomness)
    const dir = new THREE.Vector3(-x, -y, -z).normalize();
    dir.x += (Math.random() - 0.5) * 0.3;
    dir.y += (Math.random() - 0.5) * 0.3;
    dir.normalize();
    
    this.enemies.push({
      mesh,
      type,
      velocity: dir.multiplyScalar(speed),
      hp,
      maxHp: hp,
      points,
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3
      )
    });
  }

  _nextWave() {
    this.wave++;
    this.enemiesPerWave = Math.min(5 + this.wave * 2, 25);
    this.enemySpawnRate = Math.max(0.5, 2.0 - this.wave * 0.15);
    this.enemiesSpawnedThisWave = 0;
    this.enemiesDestroyedThisWave = 0;
    
    // Bonus
    this.addScore(this.wave * 100);
    this.playSound('success');
    
    // Restore some health
    this.health = Math.min(this.maxHealth, this.health + 10);
    this.onHealthUpdate(this.health);
    
    // Add special charge every 3 waves
    if (this.wave % 3 === 0) {
      this.specialCharges = Math.min(this.specialCharges + 1, 5);
    }
  }

  // ─── Enemy Update ─────────────────────────────────────────

  _updateEnemies(delta) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      
      // Move
      e.mesh.position.add(e.velocity.clone().multiplyScalar(delta));
      
      // Rotate
      e.mesh.rotation.x += e.rotSpeed.x * delta;
      e.mesh.rotation.y += e.rotSpeed.y * delta;
      e.mesh.rotation.z += e.rotSpeed.z * delta;
      
      // Check if reached player
      if (e.mesh.position.length() < 2) {
        this._enemyHitPlayer(e);
        this._removeEnemy(i);
        continue;
      }
      
      // Remove if too far past player
      if (e.mesh.position.length() > 80) {
        this._removeEnemy(i);
      }
    }
  }

  _enemyHitPlayer(enemy) {
    if (this.shieldActive) {
      // Deflected
      this.playSound('hit');
      this._spawnExplosion(enemy.mesh.position.clone(), 0x00cec9, 8);
      return;
    }
    
    const damage = enemy.type === 'ship' ? 20 : 15;
    this.health -= damage;
    this.onHealthUpdate(Math.max(0, this.health));
    this.playSound('explosion');
    this._spawnExplosion(enemy.mesh.position.clone(), 0xff4444, 15);
    
    // Send hit feedback to controller
    if (this.socket) {
      this.socket.emit('game-state', { type: 'hit' });
    }
    
    // Reset combo
    this.combo = 0;
  }

  _removeEnemy(index) {
    const e = this.enemies[index];
    this.scene.remove(e.mesh);
    if (e.mesh.geometry) e.mesh.geometry.dispose();
    if (e.mesh.material) e.mesh.material.dispose();
    this.enemies.splice(index, 1);
  }

  _destroyEnemy(enemy, special = false) {
    this.scene.remove(enemy.mesh);
    if (enemy.mesh.geometry) enemy.mesh.geometry.dispose();
    if (enemy.mesh.material) enemy.mesh.material.dispose();
    
    // Score
    const comboMultiplier = 1 + this.combo * 0.2;
    const points = Math.floor(enemy.points * comboMultiplier);
    this.addScore(points);
    
    // Combo
    this.combo++;
    this.comboTimer = 2;
    
    // Explosion
    const color = enemy.type === 'ship' ? 0xff3333 : 0xff8844;
    this._spawnExplosion(enemy.mesh.position.clone(), color, 12);
    this.playSound('explosion');
    
    this.enemiesDestroyedThisWave++;
  }

  // ─── Collision Detection ──────────────────────────────────

  _checkCollisions() {
    for (let bi = this.bullets.length - 1; bi >= 0; bi--) {
      const bullet = this.bullets[bi];
      
      for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
        const enemy = this.enemies[ei];
        
        const dist = bullet.mesh.position.distanceTo(enemy.mesh.position);
        const hitRadius = enemy.type === 'asteroid' ? 1.5 : 1;
        
        if (dist < hitRadius) {
          // Hit!
          enemy.hp--;
          
          // Remove bullet
          this.scene.remove(bullet.mesh);
          bullet.mesh.geometry.dispose();
          bullet.mesh.material.dispose();
          this.bullets.splice(bi, 1);
          
          if (enemy.hp <= 0) {
            // Destroy enemy
            this._destroyEnemy(enemy);
            this.enemies.splice(ei, 1);
          } else {
            this.playSound('hit');
            // Flash enemy
            if (enemy.mesh.material.emissive) {
              enemy.mesh.material.emissive.setHex(0xff0000);
              setTimeout(() => {
                if (enemy.mesh.material.emissive) {
                  enemy.mesh.material.emissive.setHex(0x000000);
                }
              }, 100);
            }
          }
          
          break;
        }
      }
    }
  }

  // ─── Explosions ───────────────────────────────────────────

  _spawnExplosion(position, color, count = 10) {
    const geo = new THREE.SphereGeometry(0.12, 4, 4);
    
    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 1
      });
      const p = new THREE.Mesh(geo, mat);
      p.position.copy(position);
      
      this.scene.add(p);
      
      const speed = 3 + Math.random() * 8;
      const dir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize().multiplyScalar(speed);
      
      this.explosions.push({
        mesh: p,
        velocity: dir,
        life: 0.5 + Math.random() * 0.5,
        maxLife: 1
      });
    }
    
    // Flash light
    const light = new THREE.PointLight(color, 3, 15);
    light.position.copy(position);
    this.scene.add(light);
    setTimeout(() => this.scene.remove(light), 150);
  }

  _updateExplosions(delta) {
    for (let i = this.explosions.length - 1; i >= 0; i--) {
      const e = this.explosions[i];
      e.mesh.position.add(e.velocity.clone().multiplyScalar(delta));
      e.velocity.multiplyScalar(0.95); // Drag
      e.life -= delta;
      e.mesh.material.opacity = Math.max(0, e.life / e.maxLife);
      e.mesh.scale.setScalar(1 + (1 - e.life / e.maxLife));
      
      if (e.life <= 0) {
        this.scene.remove(e.mesh);
        e.mesh.geometry.dispose();
        e.mesh.material.dispose();
        this.explosions.splice(i, 1);
      }
    }
  }

  // ─── Combo ────────────────────────────────────────────────

  _updateCombo(delta) {
    if (this.combo > 0) {
      this.comboTimer -= delta;
      if (this.comboTimer <= 0) {
        this.combo = 0;
      }
    }
  }
}

window.ShooterGame = ShooterGame;