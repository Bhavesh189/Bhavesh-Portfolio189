import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import './LiquidCursor.css';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 points[40];
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float intensity = 0.0;
    

    for (int i = 0; i < 40; i++) {
      vec3 p = points[i];
      if (p.z > 0.0) {
        float dist = distance(uv, p.xy);

        float falloff = exp(-dist * 35.0) * p.z;
        intensity += falloff;
      }
    }
    

    vec3 colA = vec3(0.48, 0.36, 1.0);
    vec3 colB = vec3(0.16, 0.82, 0.93);
    vec3 trailColor = mix(colA, colB, uv.x) * clamp(intensity, 0.0, 1.0);
    
    gl_FragColor = vec4(trailColor, clamp(intensity * 0.7, 0.0, 0.95));
  }
`;

export default function LiquidCursor() {
  const mountRef = useRef(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {

    const checkPerformance = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (!gl) return true;
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
          if (/Mali|Adreno|Intel HD|HD Graphics|PowerVR/i.test(renderer)) {
            return true;
          }
        }
        return false;
      } catch (err) {
        return true;
      }
    };

    if (checkPerformance()) {
      setDisabled(true);
      return;
    }

    const mount = mountRef.current;
    if (!mount) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);


    const pointsArray = [];
    for (let i = 0; i < 40; i++) {
      pointsArray.push(new THREE.Vector3(0, 0, 0));
    }

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      points: { value: pointsArray },
    };
    
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let writeIndex = 0;
    const onPointerMove = (e) => {

      const uvX = e.clientX / window.innerWidth;
      const uvY = 1.0 - (e.clientY / window.innerHeight);


      pointsArray[writeIndex].set(uvX, uvY, 1.0);
      writeIndex = (writeIndex + 1) % 40;
    };
    window.addEventListener('pointermove', onPointerMove);

    let raf;
    const loop = () => {

      for (let i = 0; i < 40; i++) {
        if (pointsArray[i].z > 0.0) {
          pointsArray[i].z -= 0.024;
        }
      }
      uniforms.points.value = pointsArray;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  if (disabled) return null;

  return <div className="liquid-cursor-overlay" ref={mountRef} />;
}
