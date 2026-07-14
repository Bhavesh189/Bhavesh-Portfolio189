/**
 * MazeGame - VR Maze Explorer
 * 
 * Player navigates a procedurally generated 3D maze.
 * Controller joystick moves the player.
 * Host device gyroscope controls camera look direction.
 * Find collectibles and reach the exit.
 */
class MazeGame extends GameBase {
  constructor(canvas, options) {
    super(canvas, options);
    
    // Maze config
    this.mazeWidth = 11;  // Must be odd
    this.mazeHeight = 11;
    this.cellSize = 4;
    this.wallHeight = 3.5;
    this.grid = [];
    
    // Player
    this.playerPos = new THREE.Vector3();
    this.playerVelocity = new THREE.Vector3();
    this.moveSpeed = 6;
    this.sprintMultiplier = 1.8;
    this.isSprinting = false;
    this.playerRadius = 0.4;
    this.cameraYaw = 0;
    
    // Collectibles
    this.collectibles = [];
    this.collectiblesFound = 0;
    this.totalCollectibles = 0;
    
    // Exit
    this.exitPos = new THREE.Vector3();
    this.exitMesh = null;
    this.exitReached = false;
    
    // Timer
    this.timeLimit = 120; // seconds
    this.timeRemaining = this.timeLimit;
    
    // Minimap
    this.minimapData = null;
    
    // Particles
    this.particles = [];

    // Footstep timer
    this._footstepTimer = 0;
  }

  // ─── Setup ────────────────────────────────────────────────

  setup() {
    // Sky color
    this.scene.background = new THREE.Color(0x1a1a2e);
    this.scene.fog = new THREE.FogExp2(0x1a1a2e, 0.04);
    
    // Lighting
    this.addLighting();
    
    // Add point lights for atmosphere
    const pointLight1 = new THREE.PointLight(0x6c5ce7, 1, 20);
    pointLight1.position.set(0, 3, 0);
    this.scene.add(pointLight1);
    this._ambientLight = pointLight1;
    
    // Generate maze
    this._generateMaze();
    
    // Build 3D maze
    this._buildMaze3D();
    
    // Place player at start
    this.playerPos.set(1.5 * this.cellSize, 1.5, 1.5 * this.cellSize);
    this.camera.position.copy(this.playerPos);
    
    // Place exit
    this._placeExit();
    
    // Place collectibles
    this._placeCollectibles();
    
    // Floor
    this._createFloor();
    
    // Ceiling (optional, adds claustrophobia)
    this._createCeiling();

    // Initial score
    this.onScoreUpdate(0);
    this.onHealthUpdate(100);
  }

  // ─── Maze Generation (Recursive Backtracker) ──────────────

  _generateMaze() {
    const w = this.mazeWidth;
    const h = this.mazeHeight;
    
    // Initialize grid: 1 = wall, 0 = path
    this.grid = Array.from({ length: h }, () => Array(w).fill(1));
    
    const stack = [];
    const startX = 1;
    const startY = 1;
    this.grid[startY][startX] = 0;
    stack.push([startX, startY]);
    
    const directions = [
      [0, -2], [0, 2], [-2, 0], [2, 0]
    ];
    
    while (stack.length > 0) {
      const [cx, cy] = stack[stack.length - 1];
      
      // Find unvisited neighbors
      const neighbors = [];
      for (const [dx, dy] of directions) {
        const nx = cx + dx;
        const ny = cy + dy;
        if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 && this.grid[ny][nx] === 1) {
          neighbors.push([nx, ny, dx, dy]);
        }
      }
      
      if (neighbors.length > 0) {
        const [nx, ny, dx, dy] = neighbors[Math.floor(Math.random() * neighbors.length)];
        // Remove wall between
        this.grid[cy + dy / 2][cx + dx / 2] = 0;
        this.grid[ny][nx] = 0;
        stack.push([nx, ny]);
      } else {
        stack.pop();
      }
    }
    
    // Ensure exit is reachable (bottom-right area)
    this.grid[h - 2][w - 2] = 0;
    this.grid[h - 2][w - 3] = 0;
    this.grid[h - 3][w - 2] = 0;
  }

  // ─── Build 3D Maze ────────────────────────────────────────

  _buildMaze3D() {
    const wallMat = this.createMaterial(0x2d2d5e, { roughness: 0.9 });
    const wallMatAlt = this.createMaterial(0x3d3d7e, { roughness: 0.85 });
    
    // Use instanced geometry for performance
    const wallGeo = new THREE.BoxGeometry(this.cellSize, this.wallHeight, this.cellSize);
    
    for (let y = 0; y < this.mazeHeight; y++) {
      for (let x = 0; x < this.mazeWidth; x++) {
        if (this.grid[y][x] === 1) {
          const mat = (x + y) % 2 === 0 ? wallMat : wallMatAlt;
          const wall = new THREE.Mesh(wallGeo, mat);
          wall.position.set(
            (x + 0.5) * this.cellSize,
            this.wallHeight / 2,
            (y + 0.5) * this.cellSize
          );
          wall.castShadow = true;
          wall.receiveShadow = true;
          this.scene.add(wall);
        }
      }
    }
    
    // Outer boundary walls
    const boundaryMat = this.createMaterial(0x1a1a3e);
    const bw = this.mazeWidth * this.cellSize;
    const bh = this.mazeHeight * this.cellSize;
    const boundaryHeight = this.wallHeight + 1;
    
    // North
    const wallN = new THREE.Mesh(new THREE.BoxGeometry(bw + 2, boundaryHeight, 1), boundaryMat);
    wallN.position.set(bw / 2, boundaryHeight / 2, -0.5);
    this.scene.add(wallN);
    
    // South
    const wallS = new THREE.Mesh(new THREE.BoxGeometry(bw + 2, boundaryHeight, 1), boundaryMat);
    wallS.position.set(bw / 2, boundaryHeight / 2, bh + 0.5);
    this.scene.add(wallS);
    
    // East
    const wallE = new THREE.Mesh(new THREE.BoxGeometry(1, boundaryHeight, bh + 2), boundaryMat);
    wallE.position.set(bw + 0.5, boundaryHeight / 2, bh / 2);
    this.scene.add(wallE);
    
    // West
    const wallW = new THREE.Mesh(new THREE.BoxGeometry(1, boundaryHeight, bh + 2), boundaryMat);
    wallW.position.set(-0.5, boundaryHeight / 2, bh / 2);
    this.scene.add(wallW);
  }

  // ─── Floor & Ceiling ──────────────────────────────────────

  _createFloor() {
    const floorGeo = new THREE.PlaneGeometry(
      this.mazeWidth * this.cellSize + 4,
      this.mazeHeight * this.cellSize + 4
    );
    const floorMat = this.createMaterial(0x1a1a2e, { roughness: 0.95 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(
      this.mazeWidth * this.cellSize / 2,
      0,
      this.mazeHeight * this.cellSize / 2
    );
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  _createCeiling() {
    const ceilGeo = new THREE.PlaneGeometry(
      this.mazeWidth * this.cellSize + 4,
      this.mazeHeight * this.cellSize + 4
    );
    const ceilMat = this.createMaterial(0x0d0d1a, {
      roughness: 1,
      side: THREE.DoubleSide
    });
    const ceiling = new THREE.Mesh(ceilGeo, ceilMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(
      this.mazeWidth * this.cellSize / 2,
      this.wallHeight,
      this.mazeHeight * this.cellSize / 2
    );
    this.scene.add(ceiling);
  }

  // ─── Collectibles ────────────────────────────────────────

  _placeCollectibles() {
    const positions = [];
    
    // Find open cells
    for (let y = 1; y < this.mazeHeight - 1; y++) {
      for (let x = 1; x < this.mazeWidth - 1; x++) {
        if (this.grid[y][x] === 0 && !(x === 1 && y === 1)) {
          positions.push({ x, y });
        }
      }
    }
    
    // Shuffle and pick some
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    const count = Math.min(8, Math.floor(positions.length / 3));
    this.totalCollectibles = count;
    
    const gemGeo = new THREE.OctahedronGeometry(0.3, 0);
    
    for (let i = 0; i < count; i++) {
      const { x, y } = positions[i];
      const colors = [0x6c5ce7, 0x00cec9, 0xfeca57, 0xff6b6b, 0x55efc4];
      const color = colors[i % colors.length];
      
      const gemMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.8
      });
      
      const gem = new THREE.Mesh(gemGeo, gemMat);
      gem.position.set(
        (x + 0.5) * this.cellSize,
        1.5,
        (y + 0.5) * this.cellSize
      );
      
      // Add point light
      const light = new THREE.PointLight(color, 0.5, 8);
      gem.add(light);
      
      this.scene.add(gem);
      this.collectibles.push({ mesh: gem, collected: false });
    }
  }

  // ─── Exit ─────────────────────────────────────────────────

  _placeExit() {
    const ex = this.mazeWidth - 2;
    const ey = this.mazeHeight - 2;
    
    this.exitPos.set(
      (ex + 0.5) * this.cellSize,
      0,
      (ey + 0.5) * this.cellSize
    );
    
    // Exit marker - glowing pillar
    const exitGeo = new THREE.CylinderGeometry(0.5, 0.5, this.wallHeight, 8);
    const exitMat = new THREE.MeshStandardMaterial({
      color: 0x55efc4,
      emissive: 0x55efc4,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.6
    });
    
    this.exitMesh = new THREE.Mesh(exitGeo, exitMat);
    this.exitMesh.position.set(this.exitPos.x, this.wallHeight / 2, this.exitPos.z);
    this.scene.add(this.exitMesh);
    
    // Exit light
    const exitLight = new THREE.PointLight(0x55efc4, 2, 15);
    exitLight.position.copy(this.exitMesh.position);
    this.scene.add(exitLight);
    this._exitLight = exitLight;
  }

  // ─── Update Loop ──────────────────────────────────────────

  update(delta, elapsed) {
    // Timer
    this.timeRemaining -= delta;
    if (this.timeRemaining <= 0) {
      this.timeRemaining = 0;
      this._gameEnd(false);
      return;
    }
    
    const mins = Math.floor(this.timeRemaining / 60);
    const secs = Math.floor(this.timeRemaining % 60);
    this.onTimerUpdate(`${mins}:${secs.toString().padStart(2, '0')}`);
    
    // Player movement
    this._updatePlayer(delta);
    
    // Animate collectibles
    this._updateCollectibles(elapsed);
    
    // Animate exit
    if (this.exitMesh) {
      this.exitMesh.rotation.y += delta * 2;
      this._exitLight.intensity = 2 + Math.sin(elapsed * 3) * 0.5;
    }
    
    // Check collectible pickup
    this._checkCollectibles();
    
    // Check exit
    this._checkExit();
    
    // Update particles
    this._updateParticles(delta);
    
    // Move ambient light with player
    this._ambientLight.position.copy(this.camera.position);
  }

  _updatePlayer(delta) {
    const jx = this.input.joystick.x;
    const jy = this.input.joystick.y;
    
    // Sprint
    this.isSprinting = this.input.actions['sprint'] || false;
    const speed = this.moveSpeed * (this.isSprinting ? this.sprintMultiplier : 1.0);
    
    // Camera rotation from controller gyro or device orientation
    if (this.input.gyro && !this.useDeviceOrientation) {
      this.cameraYaw -= this.input.gyro.gamma * 0.002;
    }
    
    // Build movement direction relative to camera facing
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    
    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
    
    const moveDir = new THREE.Vector3();
    moveDir.addScaledVector(forward, -jy); // Forward/back
    moveDir.addScaledVector(right, jx);    // Left/right
    
    if (moveDir.length() > 1) moveDir.normalize();
    
    // Apply movement with collision
    const movement = moveDir.multiplyScalar(speed * delta);
    
    // Collision detection
    const newPos = this.playerPos.clone().add(movement);
    
    // Check X collision
    if (!this._isWall(newPos.x, this.playerPos.z)) {
      this.playerPos.x = newPos.x;
    }
    // Check Z collision
    if (!this._isWall(this.playerPos.x, newPos.z)) {
      this.playerPos.z = newPos.z;
    }
    
    // Update camera
    this.camera.position.copy(this.playerPos);
    
    // Footstep sound
    if (moveDir.length() > 0.1) {
      this._footstepTimer += delta * (this.isSprinting ? 1.5 : 1);
      if (this._footstepTimer >= 0.4) {
        this._footstepTimer = 0;
        this.playSound('footstep');
      }
    }
    
    // Apply camera yaw when not using device orientation
    if (!this.useDeviceOrientation) {
      // Touch-based rotation: use right side of controller's gyro
      this.camera.rotation.y = this.cameraYaw;
    }
  }

  _isWall(x, z) {
    const gridX = Math.floor(x / this.cellSize);
    const gridZ = Math.floor(z / this.cellSize);
    
    // Check bounds
    if (gridX < 0 || gridX >= this.mazeWidth || gridZ < 0 || gridZ >= this.mazeHeight) {
      return true;
    }
    
    // Check wall
    if (this.grid[gridZ][gridX] === 1) {
      return true;
    }
    
    // Detailed collision with wall edges
    const cellX = (gridX + 0.5) * this.cellSize;
    const cellZ = (gridZ + 0.5) * this.cellSize;
    const halfCell = this.cellSize / 2;
    const r = this.playerRadius;
    
    // Check adjacent cells
    const neighbors = [
      [gridX - 1, gridZ], [gridX + 1, gridZ],
      [gridX, gridZ - 1], [gridX, gridZ + 1]
    ];
    
    for (const [nx, nz] of neighbors) {
      if (nx < 0 || nx >= this.mazeWidth || nz < 0 || nz >= this.mazeHeight) continue;
      if (this.grid[nz][nx] !== 1) continue;
      
      // Wall cell center
      const wx = (nx + 0.5) * this.cellSize;
      const wz = (nz + 0.5) * this.cellSize;
      
      // AABB collision
      const closestX = Math.max(wx - halfCell, Math.min(x, wx + halfCell));
      const closestZ = Math.max(wz - halfCell, Math.min(z, wz + halfCell));
      
      const dx = x - closestX;
      const dz = z - closestZ;
      
      if (dx * dx + dz * dz < r * r) {
        return true;
      }
    }
    
    return false;
  }

  _updateCollectibles(elapsed) {
    for (const c of this.collectibles) {
      if (c.collected) continue;
      c.mesh.rotation.y = elapsed * 2;
      c.mesh.position.y = 1.5 + Math.sin(elapsed * 3 + c.mesh.position.x) * 0.2;
    }
  }

  _checkCollectibles() {
    for (const c of this.collectibles) {
      if (c.collected) continue;
      
      const dist = this.playerPos.distanceTo(c.mesh.position);
      if (dist < 1.5) {
        c.collected = true;
        this.scene.remove(c.mesh);
        this.collectiblesFound++;
        this.addScore(100);
        this.playSound('collect');
        
        // Spawn particles
        this._spawnParticles(c.mesh.position.clone(), c.mesh.material.color);
        
        // Send feedback
        if (this.socket) {
          this.socket.emit('game-state', { 
            type: 'hit',
            collectibles: `${this.collectiblesFound}/${this.totalCollectibles}` 
          });
        }
      }
    }
  }

  _checkExit() {
    if (this.exitReached) return;
    
    const dist2D = new THREE.Vector2(
      this.playerPos.x - this.exitPos.x,
      this.playerPos.z - this.exitPos.z
    ).length();
    
    if (dist2D < 2) {
      this.exitReached = true;
      // Bonus for time remaining
      const timeBonus = Math.floor(this.timeRemaining * 5);
      this.addScore(500 + timeBonus);
      this.playSound('success');
      this._gameEnd(true);
    }
  }

  _gameEnd(won) {
    this.isRunning = false;
    if (won) {
      this.addScore(this.collectiblesFound * 50); // Bonus for collectibles
    }
    this.onGameOver(this.score);
  }

  // ─── Particles ────────────────────────────────────────────

  _spawnParticles(position, color) {
    const count = 12;
    const geo = new THREE.SphereGeometry(0.08, 4, 4);
    
    for (let i = 0; i < count; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: color || 0xffffff,
        transparent: true,
        opacity: 1
      });
      const p = new THREE.Mesh(geo, mat);
      p.position.copy(position);
      
      this.scene.add(p);
      this.particles.push({
        mesh: p,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 5,
          Math.random() * 4 + 2,
          (Math.random() - 0.5) * 5
        ),
        life: 1.0
      });
    }
  }

  _updateParticles(delta) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.velocity.y -= 9.8 * delta;
      p.mesh.position.add(p.velocity.clone().multiplyScalar(delta));
      p.life -= delta * 2;
      p.mesh.material.opacity = Math.max(0, p.life);
      
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
      }
    }
  }
}

window.MazeGame = MazeGame;