import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlay, FiX, FiTv, FiAward } from 'react-icons/fi';
import './ArcadeGame.css';


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
  } catch (err) {

  }
}

const BUG_LABELS = ['SQL-BUG', 'leak()', 'NullPtr', 'NaN', 'Overflow', 'syntax', '404', 'segfault'];

export default function ArcadeGame({ autoOpen = false }) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [gameState, setGameState] = useState('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  
  const canvasRef = useRef(null);
  const requestRef = useRef(null);


  useEffect(() => {
    try {
      const saved = localStorage.getItem('arcade-highscore');
      if (saved) setHighScore(parseInt(saved, 10));
    } catch (e) {

    }
  }, []);

  useEffect(() => {
    if (autoOpen) {
      setIsOpen(true);
      initGame();
    }
  }, [autoOpen]);


  const game = useRef({
    ball: { x: 200, y: 300, dx: 3, dy: -3, radius: 7 },
    paddle: { x: 155, y: 375, width: 90, height: 10 },
    bricks: [],
    mouseRelX: 0,
  });

  const initGame = () => {
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


  const update = () => {
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
    ctx.strokeStyle = themeViolet + '0d'; // ~0.05 opacity in hex (0d)
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


    requestRef.current = requestAnimationFrame(update);
  };


  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  const startGame = () => {
    initGame();
    setGameState('playing');
  };

  const closeArcade = () => {
    setIsOpen(false);
    setGameState('idle');
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  return (
    <>
      {}
      <div className="arcade-launcher">
        <button
          className="arcade-launch-btn"
          onClick={() => {
            setIsOpen(true);
            initGame();
          }}
          title="Play Bug Breaker game!"
          aria-label="Play Bug Breaker game"
        >
          <FiTv size={20} />
          <span className="arcade-badge">ARCADE</span>
        </button>
      </div>

      {}
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
              {}
              <div className="arcade-title-bar">
                <div className="bar-dots">
                  <span className="dot red" onClick={closeArcade} />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="bar-title"> BHAVESH-OS ARCADE v1.0.0</span>
                <button className="bar-close" onClick={closeArcade} aria-label="Close Arcade game">
                  <FiX size={16} />
                </button>
              </div>

              {}
              <div className="arcade-body crt">
                {}
                <div className="arcade-info">
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
                        <span key={i} className={`heart ${i < lives ? 'active' : ''}`}>
                          
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="info-instructions">
                    <h4>️ BUG BREAKER</h4>
                    <p>Move your mouse left/right to position the paddle. Break all the red bugs before you run out of lives!</p>
                  </div>
                </div>

                {}
                <div className="arcade-canvas-wrap">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={400}
                    onPointerMove={handlePointerMove}
                  />

                  {}
                  {gameState === 'idle' && (
                    <div className="canvas-overlay">
                      <h2>RESOLVE ALL BUGS</h2>
                      <p>Move mouse to slide paddle</p>
                      <button className="btn" onClick={startGame}>
                        Start Session <FiPlay style={{ marginLeft: 6 }} />
                      </button>
                    </div>
                  )}

                  {gameState === 'over' && (
                    <div className="canvas-overlay error-state">
                      <h2>CRITICAL FAIL</h2>
                      <p>System overflow. Too many unfixed bugs!</p>
                      <h4 className="final-score">Final Score: {score}</h4>
                      <button className="btn" onClick={startGame}>
                        Reboot System
                      </button>
                    </div>
                  )}

                  {gameState === 'win' && (
                    <div className="canvas-overlay success-state">
                      <FiAward className="win-badge" />
                      <h2>BUILD SUCCESSFUL</h2>
                      <p>All bugs successfully squashed! Clean deployment!</p>
                      <h4 className="final-score">Final Score: {score}</h4>
                      <button className="btn" onClick={startGame}>
                        Patch Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
