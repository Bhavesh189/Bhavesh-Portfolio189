import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const glassVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const glassFragmentShader = `
  uniform float time;
  uniform vec2 mouse;
  uniform float shatterProgress;
  uniform vec3 colorBg1;
  uniform vec3 colorBg2;
  uniform vec3 colorGlow1;
  uniform vec3 colorGlow2;
  varying vec2 vUv;

  float noise(vec2 p) {
    return sin(p.x * 10.0 + time) * cos(p.y * 10.0 + time) * 0.5;
  }

  void main() {
    vec2 uv = vUv;
    
    float dist = distance(uv, mouse);
    float n = noise(uv * 3.0 + vec2(time * 0.2));
    
    float distortionStrength = 0.02 + shatterProgress * 0.08;
    uv += vec2(n * distortionStrength) * (1.0 - smoothstep(0.4, 0.0, dist));

    float glow = exp(-dist * 4.0) * (0.8 + shatterProgress * 0.4);
    
    vec3 bgColor = mix(colorBg1, colorBg2, uv.y);
    vec3 glowColor = mix(colorGlow1, colorGlow2, uv.x);
    vec3 highlight = glowColor * glow;

    float grid = step(0.99, fract(uv.x * 18.0)) + step(0.99, fract(uv.y * 18.0));
    vec3 gridColor = glowColor * grid * 0.04 * (glow + 0.1);

    vec3 finalColor = bgColor + highlight + gridColor;
    
    if (shatterProgress > 0.01) {
      finalColor = mix(finalColor, vec3(1.0), shatterProgress * 0.15);
    }

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const getThemeColors = () => {
  const style = getComputedStyle(document.documentElement);
  const parseColor = (varName, defaultHex) => {
    const raw = style.getPropertyValue(varName).trim();
    return new THREE.Color(raw || defaultHex);
  };
  return {
    colorBg1: parseColor('--bg', '#030303'),
    colorBg2: parseColor('--bg-1', '#09090b'),
    colorGlow1: parseColor('--violet', '#dfa95c'),
    colorGlow2: parseColor('--cyan', '#c5a880'),
  };
};

export default function SkillsWebGLBg({ onTiltChange, containerRef }) {
  const mountRef = useRef(null);
  
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const prevMousePos = useRef({ x: 0.5, y: 0.5, time: Date.now() });
  const cursorVelocity = useRef(0);
  const shatterValue = useRef(0.0);

  useEffect(() => {
    const mount = mountRef.current;
    const container = containerRef.current;
    if (!mount || !container) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight || 550;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const colors = getThemeColors();
    const uniforms = {
      time: { value: 0 },
      mouse: { value: new THREE.Vector2(0.5, 0.5) },
      shatterProgress: { value: 0.0 },
      colorBg1: { value: colors.colorBg1 },
      colorBg2: { value: colors.colorBg2 },
      colorGlow1: { value: colors.colorGlow1 },
      colorGlow2: { value: colors.colorGlow2 },
    };

    const observer = new MutationObserver(() => {
      const updated = getThemeColors();
      uniforms.colorBg1.value.copy(updated.colorBg1);
      uniforms.colorBg2.value.copy(updated.colorBg2);
      uniforms.colorGlow1.value.copy(updated.colorGlow1);
      uniforms.colorGlow2.value.copy(updated.colorGlow2);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    
    const material = new THREE.ShaderMaterial({
      vertexShader: glassVertexShader,
      fragmentShader: glassFragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - ((e.clientY - rect.top) / rect.height);
      
      mousePos.current = { x, y };
      uniforms.mouse.value.set(x, y);

      const now = Date.now();
      const dt = (now - prevMousePos.current.time) / 1000.0;
      if (dt > 0.01) {
        const dx = x - prevMousePos.current.x;
        const dy = y - prevMousePos.current.y;
        const speed = Math.sqrt(dx * dx + dy * dy) / dt;
        cursorVelocity.current = speed;

        prevMousePos.current = { x, y, time: now };
      }

      const speedMultiplier = 1.0 + Math.min(2.5, cursorVelocity.current * 0.15);
      const tiltX = ((e.clientX - rect.left) / rect.width - 0.5) * 6 * speedMultiplier;
      const tiltY = ((e.clientY - rect.top) / rect.height - 0.5) * -6 * speedMultiplier;
      
      onTiltChange({ x: tiltX, y: tiltY });
    };

    const onPointerDown = () => {
      shatterValue.current = 1.0;
    };

    const onPointerLeave = () => {
      onTiltChange({ x: 0, y: 0 });
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointerleave', onPointerLeave);

    const clock = new THREE.Clock();
    let raf;

    let isIntersecting = true;
    const viewObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (isIntersecting) {
        clock.getDelta(); // reset clock delta to prevent jump
        loop();
      }
    }, { threshold: 0.01 });
    viewObserver.observe(mount);

    const loop = () => {
      uniforms.time.value = clock.getElapsedTime() * 0.45;

      shatterValue.current += (0.0 - shatterValue.current) * 0.12;
      uniforms.shatterProgress.value = shatterValue.current;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    
    if (isIntersecting) {
      loop();
    }

    const onResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight || 550;
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      observer.disconnect();
      viewObserver.disconnect();
      cancelAnimationFrame(raf);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [containerRef, onTiltChange]);

  return <div className="matrix-canvas-mount" ref={mountRef} />;
}
