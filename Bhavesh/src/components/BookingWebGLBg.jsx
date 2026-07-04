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
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    
    vec2 center1 = vec2(0.5 + sin(time * 0.4) * 0.25, 0.5 + cos(time * 0.25) * 0.25);
    vec2 center2 = vec2(0.5 - cos(time * 0.3) * 0.25, 0.5 - sin(time * 0.4) * 0.25);
    vec2 center3 = vec2(0.3 + sin(time * 0.25) * 0.2, 0.7 + cos(time * 0.3) * 0.2);

    float dist1 = distance(uv, center1);
    float dist2 = distance(uv, center2);
    float dist3 = distance(uv, center3);

    float glow1 = smoothstep(0.45, 0.0, dist1) * 0.35;
    float glow2 = smoothstep(0.38, 0.0, dist2) * 0.35;
    float glow3 = smoothstep(0.40, 0.0, dist3) * 0.30;

    vec3 col1 = vec3(0.48, 0.36, 1.0);
    vec3 col2 = vec3(0.16, 0.82, 0.93);
    vec3 col3 = vec3(1.0, 0.36, 0.61);

    vec3 finalColor = vec3(0.02, 0.02, 0.06) + col1 * glow1 + col2 * glow2 + col3 * glow3;
    gl_FragColor = vec4(finalColor, 0.55);
  }
`;

export default function BookingWebGLBg() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = { time: { value: 0 } };
    const material = new THREE.ShaderMaterial({
      vertexShader: glassVertexShader,
      fragmentShader: glassFragmentShader,
      uniforms,
      depthWrite: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let raf;
    const clock = new THREE.Clock();
    const loop = () => {
      uniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    const onResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight || 520;
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="liquid-glass-bg" ref={mountRef} />;
}
