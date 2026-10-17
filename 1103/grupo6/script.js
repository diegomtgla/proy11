// ======================================================
// 1. Obtener el canvas existente del HTML
// ======================================================

const canvas = document.getElementById("lienzo");


// ======================================================
// 2. Crear la escena
// ======================================================

const escena = new THREE.Scene();

// Fondo negro espacial
escena.background = new THREE.Color(0x02020a);


// ======================================================
// 3. Crear la cámara
// ======================================================

const camara = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
);

// Alejamos la cámara
camara.position.z = 18;


// ======================================================
// 4. Crear el renderizador
// ======================================================

const renderizador = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderizador.setSize(
    canvas.clientWidth,
    canvas.clientHeight,
    false
);


// ======================================================
// 5. CREAR LA GALAXIA ESPIRAL
// ======================================================

// Grupo que contendrá toda la galaxia
const galaxia = new THREE.Group();

escena.add(galaxia);


// Número de estrellas
const cantidadEstrellas = 12000;

// Cantidad de brazos de la galaxia
const cantidadBrazos = 4;

// Radio máximo de la galaxia
const radioMaximo = 8;


// Arrays para guardar posiciones
const posiciones = [];
const colores = [];


// Colores utilizados
const colorAzul = new THREE.Color(0x66aaff);
const colorVioleta = new THREE.Color(0xaa66ff);
const colorDorado = new THREE.Color(0xffcc66);


// ======================================================
// Crear las estrellas
// ======================================================

for (let i = 0; i < cantidadEstrellas; i++) {

    // Distancia desde el centro
    const radio = Math.pow(Math.random(), 0.6) * radioMaximo;

    // Determinar a qué brazo pertenece la estrella
    const brazo = i % cantidadBrazos;

    // Ángulo inicial del brazo
    const anguloBrazo =
        (brazo / cantidadBrazos) * Math.PI * 2;

    // Curvatura de la espiral
    const curvatura = radio * 0.75;

    // Ángulo final
    const angulo =
        anguloBrazo +
        curvatura +
        (Math.random() - 0.5) * 0.7;


    // Posición X
    const x =
        Math.cos(angulo) * radio;

    // Posición Y
    const y =
        Math.sin(angulo) * radio;


    // Profundidad de la galaxia
    const z =
        (Math.random() - 0.5) *
        (1.5 - radio / radioMaximo);


    posiciones.push(x, y, z);


    // ==================================================
    // Elegir color según la posición
    // ==================================================

    let color;

    const aleatorio = Math.random();

    if (radio < 2) {

        // Centro más dorado
        color = colorDorado.clone();

    } else if (aleatorio < 0.5) {

        // Estrellas azules
        color = colorAzul.clone();

    } else {

        // Estrellas violetas
        color = colorVioleta.clone();
    }


    // Pequeñas variaciones de color
    color.offsetHSL(
        0,
        0,
        (Math.random() - 0.5) * 0.2
    );


    colores.push(
        color.r,
        color.g,
        color.b
    );
}


// ======================================================
// Crear la geometría de las estrellas
// ======================================================

const geometriaEstrellas =
    new THREE.BufferGeometry();


// Posiciones
geometriaEstrellas.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        posiciones,
        3
    )
);


// Colores
geometriaEstrellas.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(
        colores,
        3
    )
);


// ======================================================
// Material de las estrellas
// ======================================================

const materialEstrellas =
    new THREE.PointsMaterial({

        size: 0.035,

        vertexColors: true,

        transparent: true,

        opacity: 0.9
    });


// Crear las estrellas
const estrellas =
    new THREE.Points(
        geometriaEstrellas,
        materialEstrellas
    );


// Agregar las estrellas a la galaxia
galaxia.add(estrellas);


// ======================================================
// 6. Crear el núcleo brillante
// ======================================================

const geometriaNucleo =
    new THREE.SphereGeometry(
        1.4,
        32,
        32
    );


const materialNucleo =
    new THREE.MeshBasicMaterial({
        color: 0xffdd88
    });


const nucleo =
    new THREE.Mesh(
        geometriaNucleo,
        materialNucleo
    );


galaxia.add(nucleo);


// ======================================================
// 7. Crear un halo alrededor del núcleo
// ======================================================

const geometriaHalo =
    new THREE.SphereGeometry(
        2.2,
        32,
        32
    );


const materialHalo =
    new THREE.MeshBasicMaterial({

        color: 0xffaa55,

        transparent: true,

        opacity: 0.12,

        blending: THREE.AdditiveBlending,

        depthWrite: false
    });


const halo =
    new THREE.Mesh(
        geometriaHalo,
        materialHalo
    );


galaxia.add(halo);


// ======================================================
// 8. Crear estrellas pequeñas alrededor de la galaxia
// ======================================================

const estrellasLejanas = [];

for (let i = 0; i < 2000; i++) {

    const x =
        (Math.random() - 0.5) * 40;

    const y =
        (Math.random() - 0.5) * 40;

    const z =
        (Math.random() - 0.5) * 20;

    estrellasLejanas.push(
        x,
        y,
        z
    );
}


const geometriaFondo =
    new THREE.BufferGeometry();


geometriaFondo.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        estrellasLejanas,
        3
    )
);


const materialFondo =
    new THREE.PointsMaterial({

        color: 0xffffff,

        size: 0.025
    });


const estrellasFondo =
    new THREE.Points(
        geometriaFondo,
        materialFondo
    );


escena.add(estrellasFondo);


// ======================================================
// 9. Ajustar tamaño del canvas
// ======================================================

function ajustarTamano() {

    const ancho = canvas.clientWidth;
    const alto = canvas.clientHeight;


    camara.aspect =
        ancho / alto;

    camara.updateProjectionMatrix();


    renderizador.setSize(
        ancho,
        alto,
        false
    );
}


window.addEventListener(
    "resize",
    ajustarTamano
);


// ======================================================
// 10. Animación
// ======================================================

function animar() {

    requestAnimationFrame(animar);


    // Rotación lenta de la galaxia
    galaxia.rotation.z += 0.0015;


    // Rotación ligeramente diferente del fondo
    estrellasFondo.rotation.y += 0.0001;


    // El núcleo gira
    nucleo.rotation.y += 0.002;


    // Renderizar
    renderizador.render(
        escena,
        camara
    );
}


// ======================================================
// 11. Iniciar
// ======================================================

ajustarTamano();

animar();