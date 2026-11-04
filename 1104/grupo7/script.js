const canvas = document.getElementById("lienzo");

// Escena
const escena = new THREE.Scene();
escena.background = new THREE.Color(0x03040c);

// Cámara
const camara = new THREE.PerspectiveCamera(
    60,
    1,
    0.1,
    1000
);

camara.position.set(0, 5, 12);
camara.lookAt(0, 0, 0);

// Renderizador
const renderizador = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderizador.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

// Grupo que contiene la galaxia
const galaxia = new THREE.Group();
escena.add(galaxia);

// Grupo independiente para las estrellas de fondo
const fondo = new THREE.Group();
escena.add(fondo);

// Controles HTML
const controlDensidad = document.getElementById("densidad");
const controlApertura = document.getElementById("apertura");
const controlVelocidad = document.getElementById("velocidad");

const valorDensidad = document.getElementById("valorDensidad");
const valorApertura = document.getElementById("valorApertura");
const valorVelocidad = document.getElementById("valorVelocidad");

const botonReiniciar = document.getElementById("reiniciar");

let velocidad = 0.001;
let arrastrando = false;
let ultimoX = 0;
let ultimoY = 0;
let velocidadX = 0;
let velocidadY = 0;

// Función para generar un número aleatorio normal aproximado.
// Se utiliza para dispersar las estrellas alrededor de los brazos.
function aleatorioNormal() {
    return (
        Math.random() +
        Math.random() +
        Math.random() +
        Math.random() +
        Math.random() +
        Math.random() - 3
    ) * 0.35;
}

// Elimina los objetos de un grupo y libera su memoria.
function limpiarGrupo(grupo) {
    while (grupo.children.length > 0) {
        const objeto = grupo.children[0];

        grupo.remove(objeto);

        if (objeto.geometry) {
            objeto.geometry.dispose();
        }

        if (objeto.material) {
            objeto.material.dispose();
        }
    }
}

// Generar una galaxia espiral.
function crearGalaxia() {
    limpiarGrupo(galaxia);

    const cantidad = Number(controlDensidad.value);
    const apertura = Number(controlApertura.value);

    const posiciones = [];
    const colores = [];

    const colorCentro = new THREE.Color(0xffd6a0);
    const colorInterior = new THREE.Color(0xffa15c);
    const colorExterior = new THREE.Color(0x4e80ff);
    const colorAzul = new THREE.Color(0xaacbff);

    // Crear estrellas distribuidas en cuatro brazos.
    const brazos = 4;
    const radioMaximo = 5;
    const giro = apertura * 0.075;

    for (let i = 0; i < cantidad; i++) {
        // Distribución con más estrellas cerca del centro.
        const radio = Math.sqrt(Math.random()) * radioMaximo;

        const brazo = i % brazos;

        const anguloBrazo =
            brazo * (Math.PI * 2 / brazos);

        // La distancia al centro modifica el ángulo,
        // generando la forma espiral.
        const angulo =
            anguloBrazo +
            radio * giro +
            aleatorioNormal() * (0.10 + radio * 0.045);

        // Dispersión lateral y vertical.
        const dispersion = 0.025 + radio * 0.035;

        const x =
            Math.cos(angulo) * radio +
            aleatorioNormal() * dispersion;

        const z =
            Math.sin(angulo) * radio +
            aleatorioNormal() * dispersion;

        const y =
            aleatorioNormal() *
            (0.035 + radio * 0.012);

        posiciones.push(x, y, z);

        // Colores: cálidos cerca del centro,
        // azules y violetas en las regiones exteriores.
        const mezcla = Math.min(radio / radioMaximo, 1);
        const color = new THREE.Color();

        if (mezcla < 0.35) {
            color.copy(colorCentro).lerp(
                colorInterior,
                mezcla / 0.35
            );
        } else {
            color.copy(colorInterior).lerp(
                colorExterior,
                (mezcla - 0.35) / 0.65
            );
        }

        if (Math.random() > 0.75) {
            color.lerp(colorAzul, 0.35);
        }

        colores.push(color.r, color.g, color.b);
    }

    // Añadir una concentración extra de estrellas en el núcleo.
    const cantidadNucleo = Math.floor(cantidad * 0.12);

    for (let i = 0; i < cantidadNucleo; i++) {
        const radio = Math.pow(Math.random(), 2) * 1.1;
        const angulo = Math.random() * Math.PI * 2;

        posiciones.push(
            Math.cos(angulo) * radio,
            aleatorioNormal() * 0.05,
            Math.sin(angulo) * radio
        );

        const color = colorCentro.clone();

        colores.push(color.r, color.g, color.b);
    }

    const geometria = new THREE.BufferGeometry();

    geometria.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(posiciones, 3)
    );

    geometria.setAttribute(
        "color",
        new THREE.Float32BufferAttribute(colores, 3)
    );

    const material = new THREE.PointsMaterial({
        size: 0.045,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const estrellas = new THREE.Points(geometria, material);
    galaxia.add(estrellas);

    // Núcleo brillante adicional.
    const geometriaNucleo = new THREE.SphereGeometry(0.22, 24, 24);

    const materialNucleo = new THREE.MeshBasicMaterial({
        color: 0xffd9a0
    });

    const nucleo = new THREE.Mesh(
        geometriaNucleo,
        materialNucleo
    );

    galaxia.add(nucleo);
}

// Campo de estrellas lejanas.
function crearFondoEstelar() {
    limpiarGrupo(fondo);

    const posiciones = [];
    const cantidad = 1400;

    for (let i = 0; i < cantidad; i++) {
        posiciones.push(
            (Math.random() - 0.5) * 45,
            (Math.random() - 0.5) * 30,
            -3 - Math.random() * 25
        );
    }

    const geometria = new THREE.BufferGeometry();

    geometria.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(posiciones, 3)
    );

    const material = new THREE.PointsMaterial({
        color: 0xc8d7ff,
        size: 0.025,
        transparent: true,
        opacity: 0.65,
        sizeAttenuation: true
    });

    fondo.add(new THREE.Points(geometria, material));
}

// Actualizar los valores que aparecen en pantalla.
function actualizarControles() {
    valorDensidad.textContent =
        Number(controlDensidad.value).toLocaleString("es-ES");

    valorApertura.textContent = controlApertura.value;

    valorVelocidad.textContent =
        (Number(controlVelocidad.value) / 10).toFixed(1) + "×";

    velocidad = Number(controlVelocidad.value) * 0.0001;
}

// Reconstruir la galaxia al cambiar sus parámetros.
controlDensidad.addEventListener("input", () => {
    actualizarControles();
    crearGalaxia();
});

controlApertura.addEventListener("input", () => {
    actualizarControles();
    crearGalaxia();
});

controlVelocidad.addEventListener("input", actualizarControles);

// Restablecer los parámetros iniciales.
botonReiniciar.addEventListener("click", () => {
    controlDensidad.value = 10000;
    controlApertura.value = 25;
    controlVelocidad.value = 10;

    galaxia.rotation.set(0, 0, 0);
    camara.position.set(0, 5, 12);
    camara.lookAt(0, 0, 0);

    velocidadX = 0;
    velocidadY = 0;

    actualizarControles();
    crearGalaxia();
});

// Permitir girar la vista arrastrando el ratón o el dedo.
canvas.addEventListener("pointerdown", (evento) => {
    arrastrando = true;
    ultimoX = evento.clientX;
    ultimoY = evento.clientY;

    canvas.setPointerCapture(evento.pointerId);
});

canvas.addEventListener("pointermove", (evento) => {
    if (!arrastrando) return;

    const deltaX = evento.clientX - ultimoX;
    const deltaY = evento.clientY - ultimoY;

    galaxia.rotation.y += deltaX * 0.006;
    galaxia.rotation.x += deltaY * 0.006;

    ultimoX = evento.clientX;
    ultimoY = evento.clientY;
});

function detenerArrastre() {
    arrastrando = false;
}

canvas.addEventListener("pointerup", detenerArrastre);
canvas.addEventListener("pointercancel", detenerArrastre);

// Zoom con la rueda del ratón.
canvas.addEventListener("wheel", (evento) => {
    evento.preventDefault();

    camara.position.z += evento.deltaY * 0.008;

    camara.position.z = THREE.MathUtils.clamp(
        camara.position.z,
        6,
        22
    );
}, { passive: false });

// Ajustar el canvas al tamaño disponible.
function ajustarTamano() {
    const ancho = canvas.clientWidth;
    const alto = canvas.clientHeight;

    if (!ancho || !alto) return;

    renderizador.setSize(ancho, alto, false);

    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
}

window.addEventListener("resize", ajustarTamano);

// Animación continua.
function animar() {
    requestAnimationFrame(animar);

    // Rotación automática alrededor del eje vertical.
    galaxia.rotation.y += velocidad;

    renderizador.render(escena, camara);
}

// Iniciar simulación.
actualizarControles();
crearGalaxia();
crearFondoEstelar();
ajustarTamano();
animar();