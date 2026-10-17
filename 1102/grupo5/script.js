// EXO/VIDA · Simulación 3D inspirada en el código original del proyecto.
// Three.js se carga desde CDN; por eso esta sección requiere conexión a internet.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('lienzo');
const selector = document.getElementById('planetSelector');
if (canvas && selector) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080b18);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 5.4);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x080b18, 1);

  // Luces similares a las del código original del usuario.
  scene.add(new THREE.AmbientLight(0xffffff, 1.15));
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
  keyLight.position.set(4, 4, 5);
  scene.add(keyLight);
  const rimLight = new THREE.PointLight(0x65f4e2, 18, 12);
  rimLight.position.set(-3, 1, -2);
  scene.add(rimLight);

  // Fondo de estrellas sencillo, generado sin imágenes externas.
  const starPositions = [];
  for (let i = 0; i < 500; i++) {
    starPositions.push((Math.random() - 0.5) * 18, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8 - 2);
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xcbd7ff, size: 0.025, transparent: true, opacity: 0.85 }));
  scene.add(stars);

  const planetGroup = new THREE.Group();
  scene.add(planetGroup);

  const sphereGeometry = new THREE.SphereGeometry(1.18, 72, 56);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xd18aa9, roughness: 0.88, metalness: 0.02, emissive: 0x180a22, emissiveIntensity: 0.3
  });
  const planet = new THREE.Mesh(sphereGeometry, sphereMaterial);
  planetGroup.add(planet);

  // Bandas superficiales estilizadas para dar textura visual al globo.
  const textureCanvas = document.createElement('canvas');
  textureCanvas.width = 1024;
  textureCanvas.height = 512;
  const ctx = textureCanvas.getContext('2d');
  const palette = ['#d6a1ad', '#a86f9c', '#654d87', '#e5b9ad', '#554a7c'];
  ctx.fillStyle = palette[0];
  ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
  for (let i = 0; i < 42; i++) {
    ctx.fillStyle = palette[i % palette.length];
    ctx.globalAlpha = 0.22 + Math.random() * 0.35;
    ctx.beginPath();
    const y = Math.random() * textureCanvas.height;
    ctx.ellipse(Math.random() * textureCanvas.width, y, 70 + Math.random() * 260, 5 + Math.random() * 24, (Math.random() - .5) * .3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const surfaceTexture = new THREE.CanvasTexture(textureCanvas);
  surfaceTexture.colorSpace = THREE.SRGBColorSpace;
  sphereMaterial.map = surfaceTexture;
  sphereMaterial.needsUpdate = true;

  // Aro 3D: conserva la idea del TorusGeometry del código original.
  const ringGeometry = new THREE.TorusGeometry(1.55, 0.035, 16, 120);
  const ringMaterial = new THREE.MeshStandardMaterial({ color: 0xffadeb, roughness: 0.3, metalness: 0.1, emissive: 0x4a173f, emissiveIntensity: 0.7 });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = 1.08;
  ring.rotation.y = 0.25;
  planetGroup.add(ring);

  // Halo suave alrededor del planeta.
  const halo = new THREE.Mesh(
    new THREE.SphereGeometry(1.23, 48, 36),
    new THREE.MeshBasicMaterial({ color: 0x65f4e2, transparent: true, opacity: 0.055, side: THREE.BackSide })
  );
  planetGroup.add(halo);

  const planets = {
    trappist: {
      index: '01 / 04', name: 'TRAPPIST-1e', color: '#d68ca9', ring: '#ffadeb',
      description: 'Un mundo rocoso de tamaño comparable con la Tierra, en el sistema TRAPPIST-1.',
      star: 'Enana roja', reason: 'Posible agua líquida', surface: ['#d6a1ad', '#a86f9c', '#654d87', '#e5b9ad', '#554a7c']
    },
    proxima: {
      index: '02 / 04', name: 'Próxima Centauri b', color: '#d99b73', ring: '#ffca82',
      description: 'Un planeta cercano en términos astronómicos; su estrella es activa y podría afectar su atmósfera.',
      star: 'Enana roja activa', reason: 'Cercanía a la Tierra', surface: ['#e5bd8c', '#c87b67', '#774f75', '#d99b73', '#4f426b']
    },
    kepler442: {
      index: '03 / 04', name: 'Kepler-442b', color: '#bd8796', ring: '#9debe4',
      description: 'Una supertierra interesante por su tamaño estimado y la energía que recibe de su estrella.',
      star: 'Más fría que el Sol', reason: 'Flujo de energía', surface: ['#d8b2a1', '#bd8796', '#78658e', '#c9877e', '#51476d']
    },
    kepler186: {
      index: '04 / 04', name: 'Kepler-186f', color: '#9da9df', ring: '#a8c5ff',
      description: 'Un mundo de tamaño parecido al terrestre que orbita una estrella enana roja.',
      star: 'Enana roja', reason: 'Tamaño terrestre', surface: ['#c8d2ef', '#9da9df', '#747bb1', '#a2a6d0', '#4e557f']
    }
  };

  function makeTexture(colors) {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 512;
    const g = c.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 1024, 512);
    colors.forEach((color, i) => grad.addColorStop(i / (colors.length - 1), color));
    g.fillStyle = grad;
    g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 65; i++) {
      g.globalAlpha = 0.08 + Math.random() * 0.16;
      g.fillStyle = colors[i % colors.length];
      g.beginPath();
      const y = Math.random() * 512;
      g.ellipse(Math.random() * 1024, y, 60 + Math.random() * 210, 4 + Math.random() * 22, (Math.random() - .5) * .4, 0, Math.PI * 2);
      g.fill();
    }
    g.globalAlpha = 1;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function setPlanet(key) {
    const p = planets[key];
    if (!p) return;
    document.getElementById('simPlanetIndex').textContent = p.index;
    document.getElementById('simPlanetName').textContent = p.name;
    document.getElementById('simPlanetDescription').textContent = p.description;
    document.getElementById('simStarType').textContent = p.star;
    document.getElementById('simReason').textContent = p.reason;
    sphereMaterial.color.set(p.color);
    sphereMaterial.map?.dispose();
    sphereMaterial.map = makeTexture(p.surface);
    sphereMaterial.needsUpdate = true;
    ringMaterial.color.set(p.ring);
    ringMaterial.emissive.set(p.ring);
    halo.material.color.set(p.color);
  }

  let paused = false;
  let speed = 1;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let userRotX = -0.12;
  let userRotY = 0.25;

  canvas.addEventListener('pointerdown', e => {
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture?.(e.pointerId);
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    userRotY += (e.clientX - lastX) * 0.008;
    userRotX += (e.clientY - lastY) * 0.008;
    userRotX = Math.max(-1.2, Math.min(1.2, userRotX));
    lastX = e.clientX; lastY = e.clientY;
  });
  canvas.addEventListener('pointerup', () => dragging = false);
  canvas.addEventListener('pointercancel', () => dragging = false);
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    camera.position.z = Math.max(3.2, Math.min(8, camera.position.z + e.deltaY * 0.004));
  }, { passive: false });

  selector.addEventListener('change', () => setPlanet(selector.value));
  document.getElementById('simPause').addEventListener('click', e => {
    paused = !paused;
    e.currentTarget.textContent = paused ? '▶ Reanudar giro' : 'Ⅱ Pausar giro';
  });
  document.getElementById('simReset').addEventListener('click', () => {
    userRotX = -0.12; userRotY = 0.25; camera.position.set(0, 0, 5.4);
  });
  document.getElementById('simSpeed').addEventListener('input', e => {
    speed = Number(e.target.value);
    document.getElementById('simSpeedValue').textContent = `${speed.toFixed(1)}×`;
  });

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(canvas);
  setPlanet('trappist');
  resize();

  function animate() {
    requestAnimationFrame(animate);
    if (!paused && !dragging) {
      userRotY += 0.004 * speed;
      planet.rotation.y += 0.006 * speed;
      ring.rotation.z += 0.0025 * speed;
    }
    planetGroup.rotation.x += (userRotX - planetGroup.rotation.x) * 0.08;
    planetGroup.rotation.y += (userRotY - planetGroup.rotation.y) * 0.08;
    stars.rotation.y += 0.00008;
    renderer.render(scene, camera);
  }
  animate();
}
