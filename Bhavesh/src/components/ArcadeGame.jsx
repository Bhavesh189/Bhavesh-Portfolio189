import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiX, FiTv, FiAward, FiRotateCcw, FiArrowLeft } from 'react-icons/fi';
import './ArcadeGame.css';

// Synthesize retro game sound effects using Web Audio API
function playSynthSound(type) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'bounce') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } else if (type === 'brick') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } else if (type === 'fail') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } else if (type === 'win') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.start();
      osc.stop(ctx.currentTime + 0.46);
    }
  } catch (err) {}
}

// Synthesize mechanical keyboard key clicks using Web Audio API
function playTypeSound(isSpace = false) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    // Slightly lower pitch for spacebar key presses
    const freq = isSpace ? 140 : (240 + Math.random() * 120);
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch (err) {}
}

const BUG_LABELS = ['SQL-BUG', 'leak()', 'NullPtr', 'NaN', 'Overflow', 'syntax', '404', 'segfault'];

// Speed Typer paragraph resources grouped by difficulty
const PARAGRAPHS = {
  easy: [
    "the quick brown fox jumps over the lazy dog",
    "coding is fun and simple when you practice daily",
    "write clean code and keep your folders organized",
    "javascript and html are the core blocks of the web",
    "speed and accuracy are key to master typing tests"
  ],
  medium: [
    "Full-stack MERN engineering combines React user interfaces with Node and Express backends, backed by MongoDB storage schemas.",
    "Web applications should prioritize rich aesthetics, custom layouts, and responsive grids to deliver high-quality digital experiences.",
    "Security penetration testing utilizes defensive scripting to identify vulnerabilities and secure clinical document assets.",
    "Vite bundlers leverage ES modules for rapid hot-reload performance during complex application development cycles."
  ],
  hard: [
    "const result = await fetch('/api/check', { method: 'POST', body: JSON.stringify({ roll: '25ELDCS010' }) });",
    "let list = Array.from({ length: 365 }).map((_, i) => ({ id: i, count: Math.floor(Math.random() * 5) }));",
    "const osc = ctx.createOscillator(); osc.type = 'triangle'; osc.frequency.setValueAtTime(freq, ctx.currentTime);",
    "if (ball.x + ball.radius >= brick.x && ball.y + ball.radius >= brick.y) { ball.dy = -ball.dy; brick.status = 0; }"
  ],
  infinite: [
    " Bhavesh Sharma is a premium developer solving algorithm limits in competitive coding setups.",
    " Cyber threats are intercepted using a strict defensive code mindset built directly in application frameworks.",
    " High traffic latency is resolved using structured MongoDB index tables and load balancer routes.",
    " Canvas animations run on delta timeframes, enabling smooth framerates on low-end hardware.",
    " Let's build scalable pipelines that run processes asynchronously without freezing the execution threads."
  ]
};

export default function ArcadeGame({ autoOpen = false }) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [activeGame, setActiveGame] = useState('menu'); // 'menu', 'breaker', 'typer'

  // ==========================================
  // BUG BREAKER (BRICK BREAKER) STATE
  // ==========================================
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const canvasRef = useRef(null);
  const requestRef = useRef(null);

  // ==========================================
  // SPEED TYPER STATE
  // ==========================================
  const [typerState, setTyperState] = useState('idle'); // 'idle', 'playing', 'finished'
  const [difficulty, setDifficulty] = useState('easy'); // 'easy', 'medium', 'hard', 'infinite'
  const [durationMode, setDurationMode] = useState(60); // 60, 300, 'custom'
  const [customTimeInput, setCustomTimeInput] = useState('120');
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [paragraph, setParagraph] = useState('');
  const [typedText, setTypedText] = useState('');
  const [errorsCount, setErrorsCount] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [cumulativeTypedLength, setCumulativeTypedLength] = useState(0);
  const [inputValue, setInputValue] = useState(' ');
  const [typerPlayerName, setTyperPlayerName] = useState('Bhavesh');

  const hiddenInputRef = useRef(null);
  const typerTimerRef = useRef(null);
  const typerSecondsElapsed = useRef(0);

  // Load High Score
  useEffect(() => {
    try {
      const saved = localStorage.getItem('arcade-highscore');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
    }
  }, [autoOpen]);

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      exitToMenu();
    };
    window.addEventListener('open-bhavesh-arcade', handleOpen);
    return () => window.removeEventListener('open-bhavesh-arcade', handleOpen);
  }, []);

  // Handle Breaker canvas resizing & mouse movement
  const game = useRef({
    ball: { x: 200, y: 300, dx: 3, dy: -3, radius: 7 },
    paddle: { x: 155, y: 375, width: 90, height: 10 },
    bricks: [],
    mouseRelX: 0,
  });

  const initBreakerGame = () => {
    const cols = 5;
    const rows = 4;
    const brickWidth = 72;
    const brickHeight = 18;
    const gap = 6;
    const offsetLeft = 10;
    const offsetTop = 40;

    const list = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * (brickWidth + gap) + offsetLeft;
        const y = r * (brickHeight + gap) + offsetTop;
        const bugLabel = BUG_LABELS[Math.floor(Math.random() * BUG_LABELS.length)];
        list.push({ x, y, width: brickWidth, height: brickHeight, status: 1, label: bugLabel });
      }
    }

    game.current.bricks = list;
    game.current.ball = { x: 200, y: 320, dx: 3.5 * (Math.random() > 0.5 ? 1 : -1), dy: -3.5, radius: 7 };
    game.current.paddle = { x: 155, y: 365, width: 90, height: 10 };
    setScore(0);
    setLives(3);
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const relativeX = (e.clientX - rect.left) * scaleX;
    game.current.mouseRelX = relativeX;
  };

  const updateBreaker = () => {
    const canvas = canvasRef.current;
    if (!canvas || gameState !== 'playing') return;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { ball, paddle, bricks, mouseRelX } = game.current;

    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const rootStyle = getComputedStyle(document.documentElement);
    const themeViolet = rootStyle.getPropertyValue('--violet').trim() || '#dfa95c';
    const themeCyan = rootStyle.getPropertyValue('--cyan').trim() || '#c5a880';
    ctx.strokeStyle = themeViolet + '0d';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let j = 0; j < canvas.height; j += 20) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(canvas.width, j);
      ctx.stroke();
    }

    paddle.x = mouseRelX - paddle.width / 2;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x > canvas.width - paddle.width) paddle.x = canvas.width - paddle.width;

    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
      playSynthSound('bounce');
    }
    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
      playSynthSound('bounce');
    }

    if (ball.y + ball.radius > canvas.height) {
      setLives((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          setGameState('over');
          playSynthSound('fail');
        } else {
          ball.x = paddle.x + paddle.width / 2;
          ball.y = paddle.y - 20;
          ball.dy = -3.5;
          ball.dx = 3.5 * (Math.random() > 0.5 ? 1 : -1);
          playSynthSound('fail');
        }
        return next;
      });
    }

    if (
      ball.y + ball.radius >= paddle.y &&
      ball.y - ball.radius <= paddle.y + paddle.height &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.width
    ) {
      const hitPoint = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2);
      ball.dy = -Math.abs(ball.dy);
      ball.dx = hitPoint * 4.5;
      playSynthSound('bounce');
    }

    let allCleared = true;
    bricks.forEach((brick) => {
      if (brick.status === 1) {
        allCleared = false;
        if (
          ball.x + ball.radius >= brick.x &&
          ball.x - ball.radius <= brick.x + brick.width &&
          ball.y + ball.radius >= brick.y &&
          ball.y - ball.radius <= brick.y + brick.height
        ) {
          brick.status = 0;
          ball.dy = -ball.dy;
          setScore((s) => {
            const nextScore = s + 10;
            if (nextScore > highScore) {
              setHighScore(nextScore);
              localStorage.setItem('arcade-highscore', nextScore.toString());
            }
            return nextScore;
          });
          playSynthSound('brick');
        }
      }
    });

    if (allCleared) {
      setGameState('win');
      playSynthSound('win');
    }

    bricks.forEach((brick) => {
      if (brick.status === 1) {
        ctx.fillStyle = 'rgba(255, 92, 157, 0.15)';
        ctx.strokeStyle = '#ff5c9d';
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 4);
        ctx.fill();
        ctx.stroke();

        ctx.font = '8px monospace';
        ctx.fillStyle = '#ff85b6';
        ctx.textAlign = 'center';
        ctx.fillText(brick.label, brick.x + brick.width / 2, brick.y + brick.height / 2 + 3);
      }
    });

    const gradient = ctx.createLinearGradient(paddle.x, paddle.y, paddle.x + paddle.width, paddle.y);
    gradient.addColorStop(0, themeViolet);
    gradient.addColorStop(1, themeCyan);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 4);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = themeCyan;
    ctx.shadowColor = themeCyan;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    requestRef.current = requestAnimationFrame(updateBreaker);
  };

  useEffect(() => {
    if (activeGame === 'breaker' && gameState === 'playing') {
      requestRef.current = requestAnimationFrame(updateBreaker);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, activeGame]);

  const startBreakerGame = () => {
    initBreakerGame();
    setGameState('playing');
  };

  // ==========================================
  // SPEED TYPER LOGIC
  // ==========================================
  const getRandomParagraph = (level) => {
    const list = PARAGRAPHS[level] || PARAGRAPHS.easy;
    return list[Math.floor(Math.random() * list.length)];
  };

  const getTargetDuration = () => {
    if (difficulty === 'infinite') return Infinity;
    if (durationMode === 'custom') {
      const parsed = parseInt(customTimeInput, 10);
      return isNaN(parsed) || parsed <= 0 ? 60 : parsed;
    }
    return durationMode;
  };

  const updateStats = (text) => {
    let errors = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== paragraph[i]) {
        errors++;
      }
    }
    setErrorsCount(errors);
    setAccuracy(text.length === 0 ? 100 : Math.round(((text.length - errors) / text.length) * 100));
  };

  const initTyperGame = () => {
    if (typerTimerRef.current) clearInterval(typerTimerRef.current);
    
    const initialText = getRandomParagraph(difficulty);
    setParagraph(initialText);
    setTypedText('');
    setInputValue(' ');
    setErrorsCount(0);
    setWpm(0);
    setAccuracy(100);
    setCumulativeTypedLength(0);
    typerSecondsElapsed.current = 0;

    const targetTime = getTargetDuration();
    setTimeRemaining(targetTime);
    setTyperState('idle');
  };

  // Update paragraph on difficulty switch
  useEffect(() => {
    if (activeGame === 'typer' && typerState === 'idle') {
      initTyperGame();
    }
  }, [difficulty, durationMode, activeGame]);

  const startTyper = () => {
    setTyperState('playing');
    typerSecondsElapsed.current = 0;

    typerTimerRef.current = setInterval(() => {
      typerSecondsElapsed.current += 1;

      setTimeRemaining((prev) => {
        // Infinite mode doesn't count down
        if (difficulty === 'infinite') {
          // Calculate WPM & Accuracy in real-time
          setWpm(() => {
            const minutes = typerSecondsElapsed.current / 60 || 0.01;
            return Math.round((cumulativeTypedLength / 5) / minutes);
          });
          return Infinity;
        }

        const nextTime = prev - 1;
        if (nextTime <= 0) {
          clearInterval(typerTimerRef.current);
          setTyperState('finished');
          playSynthSound('win');
          return 0;
        }

        // Standard WPM calculations
        setWpm(() => {
          const minutes = typerSecondsElapsed.current / 60 || 0.01;
          return Math.round((typedText.length / 5) / minutes);
        });

        return nextTime;
      });
    }, 1000);
  };

  const handleTypingInput = (e) => {
    if (typerState === 'finished') return;

    if (typerState === 'idle') {
      startTyper();
    }

    const val = e.target.value;
    
    if (val.length === 0) {
      // Backspace was pressed (dummy space was deleted)
      playTypeSound(false);
      setTypedText((prev) => {
        const nextText = prev.slice(0, -1);
        updateStats(nextText);
        return nextText;
      });
      setInputValue(' ');
      return;
    }

    // A character was typed
    const char = val.replace(' ', '');
    if (char.length > 0) {
      const lastChar = char[char.length - 1];
      playTypeSound(lastChar === ' ');

      setTypedText((prev) => {
        const nextText = prev + lastChar;
        if (nextText.length <= paragraph.length) {
          updateStats(nextText);

          // Check if completed
          if (nextText.length === paragraph.length) {
            if (difficulty === 'infinite') {
              setCumulativeTypedLength((c) => c + nextText.length);
              const nextTextParagraph = getRandomParagraph('infinite');
              setParagraph(nextTextParagraph);
              setTypedText('');
              setErrorsCount(0);
            } else {
              clearInterval(typerTimerRef.current);
              setTyperState('finished');
              playSynthSound('win');
            }
          }
          return nextText;
        }
        return prev;
      });
    }

    setInputValue(' ');
  };

  // Keyboard shortcut listener to restart typer or navigate back
  useEffect(() => {
    const handleKeys = (e) => {
      if (activeGame !== 'typer') return;
      if (e.key === 'Escape') {
        exitToMenu();
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [activeGame]);

  const exitToMenu = () => {
    if (typerTimerRef.current) clearInterval(typerTimerRef.current);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setGameState('idle');
    setTyperState('idle');
    setActiveGame('menu');
  };

  const closeArcade = () => {
    exitToMenu();
    setIsOpen(false);
  };

  // Format time remaining for display
  const formatTime = (seconds) => {
    if (seconds === Infinity) return 'INFINITE';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Floating launcher */}
      <div className="arcade-launcher">
        <button
          className="arcade-launch-btn"
          onClick={() => {
            setIsOpen(true);
            exitToMenu();
          }}
          title="Open Bhavesh's Arcade Panel"
          aria-label="Open Bhavesh's Arcade Panel"
        >
          <FiTv size={20} />
          <span className="arcade-badge">ARCADE</span>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="arcade-modal-backdrop">
            <motion.div
              className="arcade-window glass"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Title Bar */}
              <div className="arcade-title-bar">
                <div className="bar-dots">
                  <span className="dot red" onClick={closeArcade} />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="bar-title">BHAVESH-ARCADE v2.0.0</span>
                <button className="bar-close" onClick={closeArcade} aria-label="Close Arcade">
                  <FiX size={16} />
                </button>
              </div>

              {/* Game Menu Selection */}
              {activeGame === 'menu' && (
                <div className="game-select-container crt">
                  <h1 className="game-select-title">SELECT CHALLENGE</h1>
                  <div className="game-cards-row">
                    <div className="game-card" onClick={() => { setActiveGame('breaker'); startBreakerGame(); }}>
                      <FiTv className="game-card-icon" />
                      <h3 className="game-card-title">Bug Breaker</h3>
                      <p className="game-card-desc">Slide paddle to clear syntax & overflow bugs before losing your system lives!</p>
                    </div>
                    <div className="game-card" onClick={() => { setActiveGame('typer'); initTyperGame(); }}>
                      <FiAward className="game-card-icon" />
                      <h3 className="game-card-title">Speed Typer</h3>
                      <p className="game-card-desc">Test your programming & terminal typing speed against technical snippets.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Game 1: Bug Breaker (Brick Breaker) */}
              {activeGame === 'breaker' && (
                <div className="arcade-body crt">
                  <div className="arcade-info">
                    <button className="typer-back-btn" onClick={exitToMenu}>
                      <FiArrowLeft /> Back to Menu
                    </button>
                    <div className="info-stat">
                      <span>SCORE</span>
                      <h3 className="neon-cyan">{score}</h3>
                    </div>
                    <div className="info-stat">
                      <span>HIGH SCORE</span>
                      <h3 className="neon-violet">{highScore}</h3>
                    </div>
                    <div className="info-stat">
                      <span>LIVES</span>
                      <div className="info-lives-row">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <span key={i} className={`heart ${i < lives ? 'active' : ''}`}>❤️</span>
                        ))}
                      </div>
                    </div>
                    <div className="info-instructions">
                      <h4>️ BUG BREAKER</h4>
                      <p>Slide mouse left/right to position paddle. Squash all the red bugs before you run out of lives!</p>
                    </div>
                  </div>

                  <div className="arcade-canvas-wrap">
                    <canvas
                      ref={canvasRef}
                      width={400}
                      height={400}
                      onPointerMove={handlePointerMove}
                    />

                    {gameState === 'idle' && (
                      <div className="canvas-overlay">
                        <h2>RESOLVE ALL BUGS</h2>
                        <p>Move mouse to slide paddle</p>
                        <button className="btn" onClick={startBreakerGame}>
                          Start Session <FiPlay style={{ marginLeft: 6 }} />
                        </button>
                      </div>
                    )}

                    {gameState === 'over' && (
                      <div className="canvas-overlay error-state">
                        <h2>SYSTEM OVERFLOW</h2>
                        <p>Too many unresolved memory bugs found!</p>
                        <h4 className="final-score">Final Score: {score}</h4>
                        <button className="btn" onClick={startBreakerGame}>
                          Reboot System
                        </button>
                      </div>
                    )}

                    {gameState === 'win' && (
                      <div className="canvas-overlay success-state">
                        <FiAward className="win-badge" />
                        <h2>BUILD SUCCESSFUL</h2>
                        <p>Clean deployment! Code base contains 0 bugs.</p>
                        <h4 className="final-score">Final Score: {score}</h4>
                        <button className="btn" onClick={startBreakerGame}>
                          Patch Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Game 2: Speed Typer */}
              {activeGame === 'typer' && (
                <div className="typing-game-wrap crt">
                  {/* Header Config Panel */}
                  <div className="typer-config-bar">
                    <button className="typer-back-btn" onClick={exitToMenu}>
                      <FiArrowLeft /> Back to Menu
                    </button>

                    {typerState !== 'idle' && (
                      <div className="config-group">
                        <span className="config-chip active" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff' }}>Player: {typerPlayerName}</span>
                        <span className="config-chip active" style={{ background: 'rgba(255,255,255,0.06)', color: '#fff' }}>Level: {difficulty}</span>
                      </div>
                    )}
                  </div>

                  <div className="typer-board" onClick={() => { if (typerState === 'playing') hiddenInputRef.current?.focus(); }}>
                    <div className="typer-text-display">
                      {paragraph.split('').map((char, index) => {
                        let cls = '';
                        if (index < typedText.length) {
                          cls = typedText[index] === char ? 'char-correct' : 'char-incorrect';
                        } else if (index === typedText.length) {
                          cls = 'char-current';
                        }
                        return (
                          <span key={index} className={cls}>
                            {char}
                          </span>
                        );
                      })}
                    </div>

                    {/* Hidden input captured for desktop & mobile support */}
                    <input
                      ref={hiddenInputRef}
                      type="text"
                      className="typer-hidden-input"
                      value={inputValue}
                      onChange={handleTypingInput}
                      disabled={typerState === 'finished'}
                      autoFocus
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      spellCheck="false"
                      style={{ pointerEvents: typerState === 'finished' ? 'none' : 'auto' }}
                    />

                    {/* Start overlay */}
                    {typerState === 'idle' && (
                      <div className="typer-overlay">
                        <h2>SPEED TYPER SETUP</h2>
                        <p>Customize credentials and select difficulty to initialize the test.</p>
                        
                        <div className="typer-setup-form">
                          <div className="typer-form-group">
                            <label>Player Name</label>
                            <input
                              type="text"
                              value={typerPlayerName}
                              onChange={(e) => setTyperPlayerName(e.target.value)}
                              placeholder="Enter your name"
                              className="typer-form-input"
                            />
                          </div>

                          <div className="typer-form-group">
                            <label>Difficulty</label>
                            <div className="config-options">
                              {['easy', 'medium', 'hard', 'infinite'].map((diff) => (
                                <span
                                  key={diff}
                                  className={`config-chip ${difficulty === diff ? 'active' : ''}`}
                                  onClick={() => setDifficulty(diff)}
                                >
                                  {diff}
                                </span>
                              ))}
                            </div>
                          </div>

                          {difficulty !== 'infinite' && (
                            <div className="typer-form-group">
                              <label>Timer Limit</label>
                              <div className="config-options">
                                {[60, 300].map((t) => (
                                  <span
                                    key={t}
                                    className={`config-chip ${durationMode === t ? 'active' : ''}`}
                                    onClick={() => setDurationMode(t)}
                                  >
                                    {t === 60 ? '1m' : '5m'}
                                  </span>
                                ))}
                                <span
                                  className={`config-chip ${durationMode === 'custom' ? 'active' : ''}`}
                                  onClick={() => setDurationMode('custom')}
                                >
                                  Custom
                                </span>
                                {durationMode === 'custom' && (
                                  <input
                                    type="number"
                                    className="custom-time-input"
                                    value={customTimeInput}
                                    onChange={(e) => setCustomTimeInput(e.target.value)}
                                    placeholder="Secs"
                                    style={{ width: '80px', marginLeft: '6px' }}
                                  />
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <button className="btn" style={{ marginTop: '12px' }} onClick={() => { startTyper(); setTimeout(() => hiddenInputRef.current?.focus(), 50); }}>
                          START GAME
                        </button>
                      </div>
                    )}

                    {/* Finished overlay */}
                    {typerState === 'finished' && (
                      <div className="typer-overlay">
                        <h2>GG, {typerPlayerName}!</h2>
                        <p style={{ marginTop: '-8px', fontSize: '12px' }}>Here are your typing analytics:</p>
                        <div className="results-grid">
                          <div className="results-val">
                            <span>WPM</span>
                            <h3>{wpm}</h3>
                          </div>
                          <div className="results-val">
                            <span>Accuracy</span>
                            <h3>{accuracy}%</h3>
                          </div>
                          <div className="results-val">
                            <span>Mistakes</span>
                            <h3 style={{ color: '#ff5c9c' }}>{errorsCount}</h3>
                          </div>
                        </div>
                        <button className="btn" onClick={initTyperGame}>
                          <FiRotateCcw style={{ marginRight: 6 }} /> Reboot Test
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Real-time stats bar */}
                  <div className="typer-stats-grid">
                    <div className="typer-stat-item">
                      <span>TIME LEFT</span>
                      <p>{formatTime(timeRemaining)}</p>
                    </div>
                    <div className="typer-stat-item">
                      <span>SPEED (WPM)</span>
                      <p className="neon-cyan">{wpm}</p>
                    </div>
                    <div className="typer-stat-item">
                      <span>ACCURACY</span>
                      <p className="neon-violet">{accuracy}%</p>
                    </div>
                    <div className="typer-stat-item">
                      <span>ERRORS</span>
                      <p style={{ color: '#ff5c9c' }}>{errorsCount}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
