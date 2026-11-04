
"use strict";

// =====================================================
// 1. ELEMENTOS HTML
// =====================================================

const canvas = document.getElementById("lienzo");
const control = document.getElementById("control");
const valor = document.getElementById("valor");

// Comprobar que Three.js se haya cargado.
if (typeof THREE === "undefined") {
  console.error("No se pudo cargar la librería Three.js.");
  canvas.insertAdjacentHTML(
    "afterend",
    '<p class="ayuda-control">No se pudo cargar la simulación. Comprueba tu conexión a internet.</p>'
  );
  throw new Error("Three.js no está disponible.");
}


// =====================================================
// 2. ESCENA
// =====================================================

const escena = new THREE.Scene();

escena.background = new THREE.Color(0x050518);


// =====================================================
// 3. CÁMARA
// =====================================================

const camara = new THREE.PerspectiveCamera(
  45,
  1,
  0.1,
  100
);

camara.position.set(0, 0.5, 8);
camara.lookAt(0, 0, 0);


// =====================================================
// 4. RENDERIZADOR
// =====================================================

let renderizador;

try {
  renderizador = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false
  });
} catch (error) {
  console.error("No se pudo iniciar WebGL:", error);

  canvas.insertAdjacentHTML(
    "afterend",
    '<p class="ayuda-control">Tu navegador no pudo iniciar la simulación 3D. Intenta abrir la página en un navegador actualizado.</p>'
  );

  throw error;
}

renderizador.setPixelRatio(
  Math.min(window.devicePixelRatio || 1, 2)
);

renderizador.setClearColor(0x050518, 1);


// =====================================================
// 5. ESTRELLAS DEL FONDO
// =====================================================

const cantidadEstrellas = 600;
const posicionesEstrellas = [];

for (let i = 0; i < cantidadEstrellas; i++) {
  posicionesEstrellas.push(
    (Math.random() - 0.5) * 32,
    (Math.random() - 0.5) * 20,
    -Math.random() * 20 - 2
  );
}

const geometriaEstrellas = new THREE.BufferGeometry();

geometriaEstrellas.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(
    posicionesEstrellas,
    3
  )
);

const materialEstrellas = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.035,
  transparent: true,
  opacity: 0.85,
  sizeAttenuation: true
});

const estrellasFondo = new THREE.Points(
  geometriaEstrellas,
  materialEstrellas
);

escena.add(estrellasFondo);


// =====================================================
// 6. SOL
// =====================================================

const geometriaSol = new THREE.SphereGeometry(
  1.25,
  64,
  64
);

const materialSol = new THREE.MeshBasicMaterial({
  color: 0xffd84d
});

const sol = new THREE.Mesh(
  geometriaSol,
  materialSol
);

sol.position.set(0, 0, 0);

escena.add(sol);


// =====================================================
// 7. HALO DEL SOL
// =====================================================

const geometriaHalo = new THREE.SphereGeometry(
  1.48,
  48,
  48
);

const materialHalo = new THREE.MeshBasicMaterial({
  color: 0xffa726,
  transparent: true,
  opacity: 0.17,
  side: THREE.BackSide,
  depthWrite: false
});

const halo = new THREE.Mesh(
  geometriaHalo,
  materialHalo
);

escena.add(halo);


// Segundo halo exterior.

const geometriaHaloExterior = new THREE.SphereGeometry(
  1.72,
  48,
  48
);

const materialHaloExterior = new THREE.MeshBasicMaterial({
  color: 0xffe082,
  transparent: true,
  opacity: 0.07,
  side: THREE.BackSide,
  depthWrite: false
});

const haloExterior = new THREE.Mesh(
  geometriaHaloExterior,
  materialHaloExterior
);

escena.add(haloExterior);


// =====================================================
// 8. PLANETA
// =====================================================

const geometriaPlaneta = new THREE.SphereGeometry(
  1,
  64,
  64
);

const materialPlaneta = new THREE.MeshStandardMaterial({
  color: 0x5c8cff,
  roughness: 0.75,
  metalness: 0.05
});

const planeta = new THREE.Mesh(
  geometriaPlaneta,
  materialPlaneta
);

escena.add(planeta);


// =====================================================
// 9. ATMÓSFERA
// =====================================================

const geometriaAtmosfera = new THREE.SphereGeometry(
  1.08,
  64,
  64
);

const materialAtmosfera = new THREE.MeshBasicMaterial({
  color: 0x72d9ff,
  transparent: true,
  opacity: 0.20,
  side: THREE.BackSide,
  depthWrite: false
});

const atmosfera = new THREE.Mesh(
  geometriaAtmosfera,
  materialAtmosfera
);

// La atmósfera acompaña al planeta cuando cambia de tamaño.
planeta.add(atmosfera);


// =====================================================
// 10. LUCES
// =====================================================

const luzSol = new THREE.PointLight(
  0xffdd88,
  2.5,
  25
);

luzSol.position.set(0, 0, 2);

escena.add(luzSol);


const luzAmbiente = new THREE.AmbientLight(
  0x5060aa,
  0.55
);

escena.add(luzAmbiente);


// =====================================================
// 11. ESTRELLAS DECORATIVAS
// =====================================================

const geometriaPunto = new THREE.SphereGeometry(
  0.035,
  12,
  12
);

const materialPunto = new THREE.MeshBasicMaterial({
  color: 0xfff5b8
});

const puntosDecorativos = [];

for (let i = 0; i < 25; i++) {
  const punto = new THREE.Mesh(
    geometriaPunto,
    materialPunto
  );

  punto.position.set(
    (Math.random() - 0.5) * 12,
    (Math.random() - 0.5) * 7,
    -1.5
  );

  escena.add(punto);
  puntosDecorativos.push(punto);
}


// =====================================================
// 12. CONTROL DEL TAMAÑO DEL PLANETA
// =====================================================

function actualizarTamanoPlaneta() {
  const valorControl = Number(control.value);

  // Convertir el valor del control en una escala visual.
  const tamano = 0.2 + valorControl / 25;

  planeta.scale.setScalar(tamano);

  // La atmósfera es hija del planeta y escala con él.
  atmosfera.scale.set(1, 1, 1);

  // Actualizar el número mostrado en la interfaz.
  valor.textContent = valorControl;
}

control.addEventListener(
  "input",
  actualizarTamanoPlaneta
);

actualizarTamanoPlaneta();


// =====================================================
// 13. AJUSTAR EL CANVAS A SU CONTENEDOR
// =====================================================

function ajustarTamano() {
  const ancho = canvas.clientWidth;
  const alto = canvas.clientHeight;

  if (ancho <= 0 || alto <= 0) {
    return;
  }

  camara.aspect = ancho / alto;
  camara.updateProjectionMatrix();

  renderizador.setSize(
    ancho,
    alto,
    false
  );
}

const observadorTamano = new ResizeObserver(
  ajustarTamano
);

observadorTamano.observe(canvas);

window.addEventListener(
  "resize",
  ajustarTamano
);

ajustarTamano();


// =====================================================
// 14. ANIMACIÓN
// =====================================================

let tiempo = 0;

function animar() {
  requestAnimationFrame(animar);

  tiempo += 0.01;

  // Rotación del Sol.
  sol.rotation.y += 0.003;

  // El planeta gira sobre su propio eje.
  planeta.rotation.y += 0.008;

  // Movimiento orbital simplificado.
  planeta.position.x =
    Math.cos(tiempo) * 3.1;

  planeta.position.y =
    Math.sin(tiempo) * 0.45;

  planeta.position.z =
    0.8 + Math.sin(tiempo) * 0.35;

  // Efecto de respiración del halo.
  const brillo =
    1 + Math.sin(tiempo * 2) * 0.025;

  halo.scale.setScalar(brillo);

  haloExterior.scale.setScalar(
    1 + Math.sin(tiempo * 1.5) * 0.015
  );

  // Parpadeo sutil de las estrellas.
  materialEstrellas.opacity =
    0.75 + Math.sin(tiempo * 2) * 0.12;

  // Dibujar la escena.
  renderizador.render(
    escena,
    camara
  );
}


// =====================================================
// 15. INICIAR
// =====================================================

animar();
