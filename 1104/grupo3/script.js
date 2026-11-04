// Simulación 3D de una galaxia espiral mediante Three.js

// 1. Obtenemos el canvas donde se va a dibujar la escena
const canvas = document.getElementById('lienzo');

// 2. Creamos la escena, la cámara y el renderizador
const escena = new THREE.Scene();

const camara = new THREE.PerspectiveCamera(
  60,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);

camara.position.set(0, 4, 9);
camara.lookAt(0, 0, 0);

const renderizador = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});

renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 3. Parámetros de la galaxia
const parametrosGalaxia = {
  cantidad: 12000,
  radio: 5,
  brazos: 4,
  giroBrazo: 1.5,
  aleatoriedad: 0.35,
  colorCentro: new THREE.Color(0xffc857),
  colorBorde: new THREE.Color(0x4d7fff)
};

// 4. Creamos la geometría de la galaxia
const geometria = new THREE.BufferGeometry();
const posiciones = new Float32Array(parametrosGalaxia.cantidad * 3);
const colores = new Float32Array(parametrosGalaxia.cantidad * 3);

// Guardamos los datos base de cada estrella
const datosBase = [];

for (let i = 0; i < parametrosGalaxia.cantidad; i++) {
  const distancia = Math.random() * parametrosGalaxia.radio;
  const anguloBrazo =
    (i % parametrosGalaxia.brazos) /
    parametrosGalaxia.brazos *
    Math.PI * 2;

  const dispersionX =
    (Math.random() - 0.5) *
    parametrosGalaxia.aleatoriedad *
    distancia;

  const dispersionY =
    (Math.random() - 0.5) *
    parametrosGalaxia.aleatoriedad *
    0.4;

  const dispersionZ =
    (Math.random() - 0.5) *
    parametrosGalaxia.aleatoriedad *
    distancia;

  datosBase.push({
    distancia,
    anguloBrazo,
    dispersionX,
    dispersionY,
    dispersionZ
  });

  const i3 = i * 3;
  const colorMezclado = parametrosGalaxia.colorCentro.clone();

  colorMezclado.lerp(
    parametrosGalaxia.colorBorde,
    distancia / parametrosGalaxia.radio
  );

  colores[i3] = colorMezclado.r;
  colores[i3 + 1] = colorMezclado.g;
  colores[i3 + 2] = colorMezclado.b;
}

// Calcula las posiciones de las estrellas para un giroBrazo dado
function calcularPosiciones(giroBrazo) {
  for (let i = 0; i < parametrosGalaxia.cantidad; i++) {
    const i3 = i * 3;
    const d = datosBase[i];

    const anguloGiro = d.distancia * giroBrazo;
    const anguloFinal = d.anguloBrazo + anguloGiro;

    posiciones[i3] =
      Math.cos(anguloFinal) * d.distancia + d.dispersionX;

    posiciones[i3 + 1] = d.dispersionY;

    posiciones[i3 + 2] =
      Math.sin(anguloFinal) * d.distancia + d.dispersionZ;
  }
}

calcularPosiciones(parametrosGalaxia.giroBrazo);

geometria.setAttribute(
  'position',
  new THREE.BufferAttribute(posiciones, 3)
);

geometria.setAttribute(
  'color',
  new THREE.BufferAttribute(colores, 3)
);

// 5. Material de las partículas
const material = new THREE.PointsMaterial({
  size: 0.045,
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  depthWrite: false
});

// 6. Creamos la galaxia
const galaxia = new THREE.Points(geometria, material);
escena.add(galaxia);

// 7. Núcleo brillante en el centro
const nucleo = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xfff3c4 })
);

escena.add(nucleo);

// 7b. Fondo de estrellas
const cantidadFondo = 3000;
const geometriaFondo = new THREE.BufferGeometry();
const posicionesFondo = new Float32Array(cantidadFondo * 3);

for (let i = 0; i < cantidadFondo; i++) {
  const i3 = i * 3;

  const radioFondo = 15 + Math.random() * 25;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos((Math.random() * 2) - 1);

  posicionesFondo[i3] =
    radioFondo * Math.sin(phi) * Math.cos(theta);

  posicionesFondo[i3 + 1] =
    radioFondo * Math.sin(phi) * Math.sin(theta);

  posicionesFondo[i3 + 2] =
    radioFondo * Math.cos(phi);
}

geometriaFondo.setAttribute(
  'position',
  new THREE.BufferAttribute(posicionesFondo, 3)
);

const materialFondo = new THREE.PointsMaterial({
  size: 0.06,
  color: 0xffffff,
  transparent: true,
  opacity: 0.6,
  depthWrite: false
});

const fondoEstrellas = new THREE.Points(
  geometriaFondo,
  materialFondo
);

escena.add(fondoEstrellas);

// 8. Animación
function animar() {
  requestAnimationFrame(animar);

  galaxia.rotation.y += 0.0025;
  nucleo.rotation.y += 0.0025;
  fondoEstrellas.rotation.y += 0.0002;

  renderizador.render(escena, camara);
}

// 9. Ajuste del tamaño del canvas
function ajustarTamano() {
  const ancho = canvas.clientWidth;
  const alto = canvas.clientHeight;

  if (!ancho || !alto) return;

  camara.aspect = ancho / alto;
  camara.updateProjectionMatrix();

  renderizador.setSize(ancho, alto, false);
}

window.addEventListener('resize', ajustarTamano);
ajustarTamano();
animar();

// 10. Control deslizante para modificar la apertura de los brazos
const controlGiro = document.getElementById('control');
const etiquetaValor = document.getElementById('valor');

controlGiro.addEventListener('input', () => {
  const nuevoGiro = parseFloat(controlGiro.value);

  etiquetaValor.textContent = nuevoGiro.toFixed(1);
  parametrosGalaxia.giroBrazo = nuevoGiro;

  calcularPosiciones(nuevoGiro);
  geometria.attributes.position.needsUpdate = true;
});
