import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import './InfinityScene.css';


function makeGlowSprite() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.85)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}




const getThemeColors = () => {
  const style = getComputedStyle(document.documentElement);
  const parseColor = (varName, defaultHex) => {
    const raw = style.getPropertyValue(varName).trim();
    return new THREE.Color(raw || defaultHex);
  };
  return {
    violet: parseColor('--violet', '#dfa95c'),
    cyan: parseColor('--cyan', '#c5a880'),
    pink: parseColor('--pink', '#e2c08d'),
  };
};

export default function InfinityScene({ reducedMotion = false }) {
  const mountRef = useRef(null);
  const initialPositions = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let width = mount.clientWidth || window.innerWidth;
    let height = mount.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (err) {

      return undefined;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const sprite = makeGlowSprite();
    const group = new THREE.Group();
    scene.add(group);


    const COUNT = 2600;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const A = 3.7;
    const B = 2.15;

    for (let i = 0; i < COUNT; i++) {
      const t = (i / COUNT) * Math.PI * 2;
      const x = A * Math.cos(t);
      const y = B * Math.sin(t) * Math.cos(t);
      const radius = Math.pow(Math.random(), 1.5) * 0.55;
      const a = Math.random() * Math.PI * 2;
      const b = Math.random() * Math.PI * 2;
      const ox = radius * Math.sin(a) * Math.cos(b);
      const oy = radius * Math.sin(a) * Math.sin(b);
      const oz = radius * Math.cos(a) + Math.sin(t * 2) * 0.45;
      positions[i * 3] = x + ox;
      positions[i * 3 + 1] = y + oy;
      positions[i * 3 + 2] = oz;
    }

    initialPositions.current = new Float32Array(positions);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const colorAttr = new THREE.BufferAttribute(colors, 3);
    geo.setAttribute('color', colorAttr);

    const updateColors = () => {
      const themeColors = getThemeColors();
      const colorsArr = colorAttr.array;
      for (let i = 0; i < COUNT; i++) {
        const t = (i / COUNT) * Math.PI * 2;
        const mix = (Math.sin(t) + 1) / 2;
        const col = themeColors.violet.clone().lerp(themeColors.cyan, mix);
        if (i % 14 === 0) col.lerp(themeColors.pink, 0.65);
        colorsArr[i * 3] = col.r;
        colorsArr[i * 3 + 1] = col.g;
        colorsArr[i * 3 + 2] = col.b;
      }
      colorAttr.needsUpdate = true;
    };
    updateColors();

    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });
    const mat = new THREE.PointsMaterial({
      size: 0.08,
      map: sprite,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const points = new THREE.Points(geo, mat);
    group.add(points);


    const STARS = 850;
    const starPos = new Float32Array(STARS * 3);
    for (let i = 0; i < STARS; i++) {
      const R = 9 + Math.random() * 16;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      starPos[i * 3] = R * Math.sin(ph) * Math.cos(th);
      starPos[i * 3 + 1] = R * Math.sin(ph) * Math.sin(th);
      starPos[i * 3 + 2] = R * Math.cos(ph);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.05,
      map: sprite,
      color: 0x9a9ac0,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);


    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointerMove = (e) => {
      pointer.tx = (e.clientX / window.innerWidth) - 0.5;
      pointer.ty = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('pointermove', onPointerMove);

    const clock = new THREE.Clock();
    let raf = 0;

    const renderFrame = () => {
      const el = clock.getElapsedTime();
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      group.rotation.y = el * 0.18 + pointer.x * 0.6;
      group.rotation.x = 0.32 + pointer.y * 0.4 + Math.sin(el * 0.4) * 0.05;
      stars.rotation.y = el * 0.02;


      mat.size = 0.08;


      const posAttr = points.geometry.attributes.position;
      const arr = posAttr.array;
      const orig = initialPositions.current;
      
      const targetParallaxX = pointer.x * 6.5;
      const targetParallaxY = -pointer.y * 4.0;

      for (let i = 0; i < COUNT; i++) {
        const t = (i / COUNT) * Math.PI * 2;
        const wave = Math.sin(el * 1.6 + t * 6) * 0.14;
        const twist = Math.cos(el * 1.2 + t * 3) * 0.14;

        const origX = orig[i * 3];
        const origY = orig[i * 3 + 1];


        const dx = origX - targetParallaxX;
        const dy = origY - targetParallaxY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let pushX = 0;
        let pushY = 0;
        if (dist < 1.6) {
          const force = (1.6 - dist) * 0.38;
          pushX = (dx / dist) * force;
          pushY = (dy / dist) * force;
        }

        arr[i * 3] = origX + wave * Math.sin(t) + pushX;
        arr[i * 3 + 1] = origY + twist * Math.cos(t) + pushY;
        arr[i * 3 + 2] = orig[i * 3 + 2] + wave * Math.cos(t * 2);
      }

      posAttr.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const loop = () => {
      renderFrame();
      raf = requestAnimationFrame(loop);
    };

    let isIntersecting = true;
    const viewObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (isIntersecting && !document.hidden && !reducedMotion) {
        clock.getDelta(); // reset clock delta to prevent jump
        loop();
      }
    }, { threshold: 0.01 });
    viewObserver.observe(mount);

    if (reducedMotion) {
      renderFrame();
    } else if (isIntersecting) {
      loop();
    }

    const onResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (isIntersecting && !document.hidden && !reducedMotion) loop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      observer.disconnect();
      viewObserver.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      geo.dispose();
      mat.dispose();
      starGeo.dispose();
      starMat.dispose();
      sprite.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  return <div className="infinity-scene" ref={mountRef} aria-hidden="true" />;
}
