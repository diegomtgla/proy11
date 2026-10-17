(function () {

// 1. Obtenemos el canvas donde se va a dibujar la escena
const canvas = document.getElementById('lienzo-sim');

// 2. Creamos la escena, la cámara y el renderizador
const escena = new THREE.Scene();

const camara = new THREE.PerspectiveCamera(
  60,
  canvas.clientWidth / canvas.clientHeight,
  0.1,
  1000
);
camara.position.set(0, 4, 9); // la alejamos y la subimos un poco para ver la espiral desde arriba
camara.lookAt(0, 0, 0); // sin esto la cámara miraba en línea recta y no hacia el centro de la galaxia, por eso se cortaba

const renderizador = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

// 3. Parámetros de la galaxia: cuántas partículas, qué tan abierta es la espiral, etc.
const parametrosGalaxia = {
  cantidad: 12000,      // número de partículas (estrellas) de la galaxia
  radio: 5,              // qué tan grande es la galaxia
  brazos: 4,              // número de brazos espirales
  giroBrazo: 1.5,          // qué tan "enrollados" están los brazos
  aleatoriedad: 0.35,      // dispersión de las estrellas alrededor del brazo
  colorCentro: new THREE.Color(0xffc857),  // color hacia el centro (amarillo/naranja)
  colorBorde: new THREE.Color(0x4d7fff)    // color hacia los bordes (azul)
};

// 4. Creamos la geometría de la galaxia: calculamos la posición y el color de cada partícula
const geometria = new THREE.BufferGeometry();
const posiciones = new Float32Array(parametrosGalaxia.cantidad * 3);
const colores = new Float32Array(parametrosGalaxia.cantidad * 3);

// Guardamos los datos base (distancia, brazo y dispersión) de cada estrella una sola vez.
// Así, cuando el control mueva "giroBrazo", solo recalculamos el ángulo final,
// sin generar estrellas nuevas ni perder la dispersión aleatoria ya asignada.
const datosBase = [];
for (let i = 0; i < parametrosGalaxia.cantidad; i++) {
  const distancia = Math.random() * parametrosGalaxia.radio;
  const anguloBrazo = (i % parametrosGalaxia.brazos) / parametrosGalaxia.brazos * Math.PI * 2;
  const dispersionX = (Math.random() - 0.5) * parametrosGalaxia.aleatoriedad * distancia;
  const dispersionY = (Math.random() - 0.5) * parametrosGalaxia.aleatoriedad * 0.4;
  const dispersionZ = (Math.random() - 0.5) * parametrosGalaxia.aleatoriedad * distancia;

  datosBase.push({ distancia, anguloBrazo, dispersionX, dispersionY, dispersionZ });

  const i3 = i * 3;
  const colorMezclado = parametrosGalaxia.colorCentro.clone();
  colorMezclado.lerp(parametrosGalaxia.colorBorde, distancia / parametrosGalaxia.radio);
  colores[i3] = colorMezclado.r;
  colores[i3 + 1] = colorMezclado.g;
  colores[i3 + 2] = colorMezclado.b;
}

// Calcula las posiciones de todas las estrellas para un giroBrazo dado
function calcularPosiciones(giroBrazo) {
  for (let i = 0; i < parametrosGalaxia.cantidad; i++) {
    const i3 = i * 3;
    const d = datosBase[i];

    const anguloGiro = d.distancia * giroBrazo;
    const anguloFinal = d.anguloBrazo + anguloGiro;

    posiciones[i3] = Math.cos(anguloFinal) * d.distancia + d.dispersionX;
    posiciones[i3 + 1] = d.dispersionY;
    posiciones[i3 + 2] = Math.sin(anguloFinal) * d.distancia + d.dispersionZ;
  }
}
calcularPosiciones(parametrosGalaxia.giroBrazo);

geometria.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
geometria.setAttribute('color', new THREE.BufferAttribute(colores, 3));

// 5. Material de las partículas: puntos pequeños que usan el color calculado por partícula
const material = new THREE.PointsMaterial({
  size: 0.045,
  vertexColors: true,
  transparent: true,
  opacity: 0.9,
  depthWrite: false
});

// 6. Creamos el objeto de puntos (la galaxia) y lo agregamos a la escena
const galaxia = new THREE.Points(geometria, material);
escena.add(galaxia);

// 7. También agregamos un pequeño núcleo brillante en el centro
const nucleo = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xfff3c4 })
);
escena.add(nucleo);

// 7b. Fondo de estrellas: una nube de puntos blancos, mucho más grande y dispersa
// que la galaxia, distribuida en una esfera para simular el cielo detrás de ella.
const cantidadFondo = 3000;
const geometriaFondo = new THREE.BufferGeometry();
const posicionesFondo = new Float32Array(cantidadFondo * 3);

for (let i = 0; i < cantidadFondo; i++) {
  const i3 = i * 3;

  // Coordenadas esféricas aleatorias para repartir las estrellas en todas direcciones
  const radioFondo = 15 + Math.random() * 25; // entre 15 y 40 unidades de distancia
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos((Math.random() * 2) - 1);

  posicionesFondo[i3] = radioFondo * Math.sin(phi) * Math.cos(theta);
  posicionesFondo[i3 + 1] = radioFondo * Math.sin(phi) * Math.sin(theta);
  posicionesFondo[i3 + 2] = radioFondo * Math.cos(phi);
}

geometriaFondo.setAttribute('position', new THREE.BufferAttribute(posicionesFondo, 3));

const materialFondo = new THREE.PointsMaterial({
  size: 0.06,
  color: 0xffffff,
  transparent: true,
  opacity: 0.6,
  depthWrite: false
});

const fondoEstrellas = new THREE.Points(geometriaFondo, materialFondo);
escena.add(fondoEstrellas);

// 8. Función de animación: hace que la galaxia gire lentamente y renderiza cada cuadro
function animar() {
  requestAnimationFrame(animar);

  galaxia.rotation.y += 0.0025;
  nucleo.rotation.y += 0.0025;
  fondoEstrellas.rotation.y += 0.0002;

  renderizador.render(escena, camara);
}
animar();

// 9. Hacemos que el tamaño se ajuste al ancho del canvas cuando cambia la ventana
function ajustarTamano() {
  const ancho = canvas.clientWidth;
  const alto = canvas.clientHeight;

  camara.aspect = ancho / alto;
  camara.updateProjectionMatrix();

  renderizador.setSize(ancho, alto, false);
}
window.addEventListener('resize', ajustarTamano);
ajustarTamano();

// 10. Conectamos el control deslizante: mueve "giroBrazo" y recalcula la espiral al instante
const controlGiro = document.getElementById('control-sim');
const etiquetaValor = document.getElementById('valor-sim');

controlGiro.addEventListener('input', () => {
  const nuevoGiro = parseFloat(controlGiro.value);
  etiquetaValor.textContent = nuevoGiro.toFixed(1);

  parametrosGalaxia.giroBrazo = nuevoGiro;
  calcularPosiciones(nuevoGiro);
  geometria.attributes.position.needsUpdate = true;
});

})();
