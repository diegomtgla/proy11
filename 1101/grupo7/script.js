/* Simulación 3D de un cohete en Three.js r128. */
(() => {
  const canvas = document.getElementById('lienzo');
  const container = document.querySelector('.contenedor-simulacion');
  if (!canvas || !container || !window.THREE) {
    if (container && !window.THREE) container.innerHTML = '<p class="aviso-simulacion">No se pudo cargar Three.js. Comprueba tu conexión a internet y vuelve a cargar la página.</p>';
    return;
  }

  const controls = document.createElement('div');
  controls.className = 'controles-simulacion';
  controls.innerHTML = '<label for="velocidad-cohete">Velocidad <span id="valor-velocidad">1.0×</span></label><input id="velocidad-cohete" type="range" min="0" max="3" step="0.1" value="1"><button type="button" id="pausa-cohete" aria-pressed="false">Pausar</button>';
  container.insertAdjacentElement('afterend', controls);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x030713);
  scene.fog = new THREE.FogExp2(0x030713, 0.012);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 500);
  camera.position.set(0, 2.5, 12);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;

  scene.add(new THREE.AmbientLight(0x8ba6d9, 1.1));
  const sunLight = new THREE.PointLight(0xffd18a, 2.5, 100);
  sunLight.position.set(-8, 5, -12); scene.add(sunLight);

  // Campo de estrellas
  const starPositions = [];
  for (let i = 0; i < 900; i++) starPositions.push((Math.random() - 0.5) * 100, (Math.random() - 0.5) * 65, -Math.random() * 90 - 5);
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xdceaff, size: 0.13, sizeAttenuation: true }));
  scene.add(stars);

  // Sol lejano
  const sun = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 24), new THREE.MeshBasicMaterial({ color: 0xffb84d }));
  sun.position.set(-10, 5, -24); scene.add(sun);
  const sunGlow = new THREE.Mesh(new THREE.SphereGeometry(2.9, 24, 18), new THREE.MeshBasicMaterial({ color: 0xff8a32, transparent: true, opacity: 0.12 }));
  sunGlow.position.copy(sun.position); scene.add(sunGlow);

  const rocket = new THREE.Group(); scene.add(rocket);
  const white = new THREE.MeshStandardMaterial({ color: 0xe8edf5, metalness: 0.35, roughness: 0.35 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x68758b, metalness: 0.7, roughness: 0.3 });
  const red = new THREE.MeshStandardMaterial({ color: 0xff5a45, metalness: 0.25, roughness: 0.4 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x58d8ff, metalness: 0.5, roughness: 0.15, emissive: 0x092e50 });
  function mesh(geometry, material, x, y, z) { const m = new THREE.Mesh(geometry, material); m.position.set(x, y, z); rocket.add(m); return m; }
  // Cohete orientado hacia arriba en su eje local Y
  mesh(new THREE.CylinderGeometry(0.48, 0.58, 2.5, 20), white, 0, 0, 0);
  mesh(new THREE.ConeGeometry(0.48, 1.05, 20), red, 0, 1.78, 0);
  mesh(new THREE.CylinderGeometry(0.25, 0.38, 0.5, 16), dark, 0, -1.48, 0);
  mesh(new THREE.CylinderGeometry(0.22, 0.31, 0.25, 16), red, 0, -1.84, 0);
  mesh(new THREE.SphereGeometry(0.22, 20, 16), glass, 0, 0.55, 0.45);
  // Franjas decorativas
  mesh(new THREE.CylinderGeometry(0.49, 0.49, 0.16, 20), red, 0, -0.65, 0);
  [-1, 1].forEach((side) => {
    const fin = mesh(new THREE.BoxGeometry(0.12, 0.85, 0.58), red, side * 0.48, -1.05, 0);
    fin.rotation.z = side * -0.25;
  });
  // Boquilla y llama
  mesh(new THREE.ConeGeometry(0.28, 0.7, 16), new THREE.MeshBasicMaterial({ color: 0xff8c32 }), 0, -2.25, 0).rotation.x = Math.PI;
  const flame = mesh(new THREE.ConeGeometry(0.17, 0.9, 12), new THREE.MeshBasicMaterial({ color: 0x62dfff }), 0, -2.45, 0);
  flame.rotation.x = Math.PI;
  rocket.position.set(1.4, -0.2, 0);
  rocket.rotation.z = -0.18;

  // Pequeños fragmentos brillantes que dan sensación de avance
  const dustPositions = [];
  for (let i = 0; i < 180; i++) dustPositions.push((Math.random() - 0.5) * 24, (Math.random() - 0.5) * 15, Math.random() * 30 - 15);
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPositions, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0x4b83bc, size: 0.055 })); scene.add(dust);

  const speedInput = controls.querySelector('#velocidad-cohete');
  const speedLabel = controls.querySelector('#valor-velocidad');
  const pauseButton = controls.querySelector('#pausa-cohete');
  let speed = 1, paused = false, elapsed = 0;
  speedInput.addEventListener('input', () => { speed = Number(speedInput.value); speedLabel.textContent = speed.toFixed(1) + '×'; });
  pauseButton.addEventListener('click', () => { paused = !paused; pauseButton.textContent = paused ? 'Continuar' : 'Pausar'; pauseButton.setAttribute('aria-pressed', String(paused)); });

  function resize() {
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(250, container.clientHeight);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.position.z = width < 500 ? 15 : 12;
    camera.updateProjectionMatrix();
  }
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(container);
  else window.addEventListener('resize', resize);
  resize();

  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.05);
    if (!paused) {
      elapsed += delta * speed;
      rocket.rotation.y = Math.sin(elapsed * 0.55) * 0.18;
      rocket.rotation.z = -0.18 + Math.sin(elapsed * 0.8) * 0.06;
      rocket.position.y = -0.2 + Math.sin(elapsed * 1.4) * 0.16;
      stars.rotation.z += delta * speed * 0.0015;
      dust.rotation.y += delta * speed * 0.025;
      flame.scale.y = 0.75 + Math.abs(Math.sin(elapsed * 12)) * 0.55;
      flame.scale.x = flame.scale.z = 0.8 + Math.abs(Math.sin(elapsed * 9)) * 0.3;
    }
    renderer.render(scene, camera);
  }
  animate();
})();
