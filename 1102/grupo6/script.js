// ==========================================
// 1. CONTROL DEL MENÚ PLEGABLE / DESPLEGABLE
// ==========================================
const btnToggleMenu = document.getElementById("btn-toggle-menu");
const enlacesMenu = document.getElementById("enlaces-menu");

btnToggleMenu.addEventListener("click", () => {
  enlacesMenu.classList.toggle("menu-colapsado");
  btnToggleMenu.textContent = enlacesMenu.classList.contains("menu-colapsado")
    ? "☰ Desplegar Menú"
    : "☰ Recoger Menú";
});

// Cierra automáticamente el menú al hacer clic en cualquier enlace en celulares
document.querySelectorAll(".enlaces-menu a").forEach(link => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 700) {
      enlacesMenu.classList.add("menu-colapsado");
      btnToggleMenu.textContent = "☰ Desplegar Menú";
    }
  });
});

// ==========================================
// 2. CONFIGURACIÓN INICIAL Y ESCENA 3D
// ==========================================
const canvas = document.getElementById("lienzo");
const escena = new THREE.Scene();
escena.background = null; 

const fovBase = 45;
const camara = new THREE.PerspectiveCamera(
  fovBase,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camara.position.set(0, 1.5, 12);

const renderizador = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ==========================================
// 3. ILUMINACIÓN ESPACIAL
// ==========================================
const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.4);
escena.add(luzAmbiental);

const luzSol = new THREE.DirectionalLight(0xffffff, 1.8);
luzSol.position.set(20, 10, 15);
escena.add(luzSol);

const luzRelieve = new THREE.PointLight(0x6688ff, 0.8, 50);
luzRelieve.position.set(-10, -5, -10);
escena.add(luzRelieve);

// ==========================================
// 4. ELEMENTOS 3D (TELESCOPIO Y PLANETAS)
// ==========================================

// Campo de estrellas
const geometriaEstrellas = new THREE.BufferGeometry();
const numEstrellas = 1200;
const posEstrellas = new Float32Array(numEstrellas * 3);
for (let i = 0; i < numEstrellas * 3; i += 3) {
  posEstrellas[i] = (Math.random() - 0.5) * 300;
  posEstrellas[i + 1] = (Math.random() - 0.5) * 300;
  posEstrellas[i + 2] = (Math.random() - 0.5) * 300;
}
geometriaEstrellas.setAttribute('position', new THREE.BufferAttribute(posEstrellas, 3));
const materialEstrellas = new THREE.PointsMaterial({ color: 0xffffff, size: 0.8 });
const campoEstrellas = new THREE.Points(geometriaEstrellas, materialEstrellas);
escena.add(campoEstrellas);

// --- TELESCOPIO ORBITAL ---
const telescopio = new THREE.Group();
escena.add(telescopio);

const matMetal = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.9, roughness: 0.2 });
const matOscuro = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.3 });
const matOro = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.3 });

const tubo = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 4, 32), matMetal);
tubo.rotation.z = Math.PI / 2;
telescopio.add(tubo);

const lente = new THREE.Mesh(
  new THREE.CylinderGeometry(0.78, 0.78, 0.1, 32),
  new THREE.MeshStandardMaterial({ color: 0x113355, metalness: 0.9, roughness: 0.1 })
);
lente.rotation.z = Math.PI / 2;
lente.position.x = 2.01;
telescopio.add(lente);

const genPanel = () => new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.8, 3.5), matOro);
const panelIzquierdo = genPanel();
panelIzquierdo.position.set(0, 0, 2.5);
telescopio.add(panelIzquierdo);

const panelDerecho = genPanel();
panelDerecho.position.set(0, 0, -2.5);
telescopio.add(panelDerecho);

const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.5, 0.5, 32), matOscuro);
base.position.y = -2;
telescopio.add(base);

const eje = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 2, 16), matMetal);
eje.position.y = -1;
telescopio.add(eje);

// --- PLANETA GIGANTE GASEOSO (TIPO SATURNO) ---
const planetaGigante = new THREE.Mesh(
  new THREE.SphereGeometry(8, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0xc28d53, roughness: 0.8 })
);
planetaGigante.position.set(-35, 12, -70);
escena.add(planetaGigante);

const geometriaAnillo = new THREE.RingGeometry(10, 16, 32);
const materialAnillo = new THREE.MeshBasicMaterial({ color: 0xa07842, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
const anillo = new THREE.Mesh(geometriaAnillo, materialAnillo);
anillo.rotation.x = Math.PI / 2.3;
planetaGigante.add(anillo);

// --- PLANETA HABITABLE AZUL ---
const planetaAzul = new THREE.Mesh(
  new THREE.SphereGeometry(4, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x2b75a0, roughness: 0.4 })
);
planetaAzul.position.set(35, -10, -50);
escena.add(planetaAzul);

// Atmospheric halo del planeta azul
const atmosferaAzul = new THREE.Mesh(
  new THREE.SphereGeometry(4.2, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x66ccff, transparent: true, opacity: 0.25 })
);
planetaAzul.add(atmosferaAzul);

// ==========================================
// 5. INTERACCIÓN MOUSE Y TÁCTIL (ROTAR VISTA)
// ==========================================
let arrastrando = false;
let prevX = 0, prevY = 0;

canvas.addEventListener("mousedown", (e) => {
  arrastrando = true;
  prevX = e.clientX;
  prevY = e.clientY;
});

window.addEventListener("mouseup", () => arrastrando = false);

canvas.addEventListener("mousemove", (e) => {
  if (!arrastrando) return;
  const deltaX = e.clientX - prevX;
  const deltaY = e.clientY - prevY;

  // Rota el objetivo actual seleccionado
  const objActual = objetivos[idxObjetivo];
  objActual.objeto.rotation.y += deltaX * 0.01;
  objActual.objeto.rotation.x += deltaY * 0.01;

  prevX = e.clientX;
  prevY = e.clientY;
});

canvas.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    arrastrando = true;
    prevX = e.touches[0].clientX;
    prevY = e.touches[0].clientY;
  }
});

window.addEventListener("touchend", () => arrastrando = false);

canvas.addEventListener("touchmove", (e) => {
  if (!arrastrando || e.touches.length !== 1) return;
  const deltaX = e.touches[0].clientX - prevX;
  const deltaY = e.touches[0].clientY - prevY;

  const objActual = objetivos[idxObjetivo];
  objActual.objeto.rotation.y += deltaX * 0.01;
  objActual.objeto.rotation.x += deltaY * 0.01;

  prevX = e.touches[0].clientX;
  prevY = e.touches[0].clientY;
});

// ==========================================
// 6. CONTROLES HUD Y CAMBIO DE OBJETIVO 3D
// ==========================================
const sliderZoom = document.getElementById("control-zoom");
const textoZoom = document.getElementById("valor-zoom");
const telemetriaZoom = document.getElementById("telemetria-zoom");
const btnVisor = document.getElementById("btn-visor");
const hudVisor = document.getElementById("hud-visor");
const btnObjetivo = document.getElementById("btn-objetivo");

sliderZoom.addEventListener("input", (e) => {
  const zoom = parseFloat(e.target.value);
  camara.fov = fovBase / zoom;
  camara.updateProjectionMatrix();

  textoZoom.textContent = zoom.toFixed(1) + "x";
  telemetriaZoom.textContent = "ZOOM: " + zoom.toFixed(1) + "x";
});

btnVisor.addEventListener("click", () => {
  hudVisor.classList.toggle("hud-oculto");
  btnVisor.textContent = hudVisor.classList.contains("hud-oculto") 
    ? "Activar Visor" 
    : "Desactivar Visor";
});

// Objetivos intergalácticos reales con posiciones de cámara
const objetivos = [
  {
    nombre: "TELESCOPIO ORBITAL",
    objeto: telescopio,
    camaraPos: { x: 0, y: 1.5, z: 12 },
    lookAt: { x: 0, y: 0, z: 0 },
    espectro: "ESPECTRO: OPTICO / VISIBLE"
  },
  {
    nombre: "GIGANTE GASEOSO [04-B]",
    objeto: planetaGigante,
    camaraPos: { x: -35, y: 12, z: -40 },
    lookAt: { x: -35, y: 12, z: -70 },
    espectro: "ESPECTRO: INFRARROJO CERCANO"
  },
  {
    nombre: "EXOPLANETA HABITABLE [AZUL-9]",
    objeto: planetaAzul,
    camaraPos: { x: 35, y: -10, z: -35 },
    lookAt: { x: 35, y: -10, z: -50 },
    espectro: "ESPECTRO: BIOSEÑALES / ATMÓSFERA"
  }
];

let idxObjetivo = 0;
let posCamaraDestino = { ...objetivos[0].camaraPos };
let lookAtDestino = { ...objetivos[0].lookAt };
let lookAtActual = { x: 0, y: 0, z: 0 };

btnObjetivo.addEventListener("click", () => {
  idxObjetivo = (idxObjetivo + 1) % objetivos.length;
  const obj = objetivos[idxObjetivo];

  // Actualizar interfaz HUD
  document.querySelector(".top-left").textContent = "OBJ: " + obj.nombre;
  document.querySelector(".bottom-left").textContent = obj.espectro;

  // Fijar destinos para la transición suave de cámara
  posCamaraDestino = obj.camaraPos;
  lookAtDestino = obj.lookAt;
});

// ==========================================
// 7. BUCLE DE ANIMACIÓN Y RESPONSIVIDAD
// ==========================================
function animar() {
  requestAnimationFrame(animar);

  // Animación continua de cuerpos celestes
  planetaGigante.rotation.y += 0.001;
  planetaAzul.rotation.y += 0.003;
  campoEstrellas.rotation.y += 0.0002;

  if (!arrastrando) {
    telescopio.rotation.y += 0.002;
  }

  // Transición suave de la cámara (Interpolación Lineal - Lerp)
  camara.position.x += (posCamaraDestino.x - camara.position.x) * 0.05;
  camara.position.y += (posCamaraDestino.y - camara.position.y) * 0.05;
  camara.position.z += (posCamaraDestino.z - camara.position.z) * 0.05;

  lookAtActual.x += (lookAtDestino.x - lookAtActual.x) * 0.05;
  lookAtActual.y += (lookAtDestino.y - lookAtActual.y) * 0.05;
  lookAtActual.z += (lookAtDestino.z - lookAtActual.z) * 0.05;

  camara.lookAt(lookAtActual.x, lookAtActual.y, lookAtActual.z);

  renderizador.render(escena, camara);
}

function redimensionar() {
  const ancho = canvas.clientWidth;
  const alto = canvas.clientHeight;
  camara.aspect = ancho / alto;
  camara.updateProjectionMatrix();
  renderizador.setSize(ancho, alto, false);
}

window.addEventListener("resize", redimensionar);

redimensionar();
animar();