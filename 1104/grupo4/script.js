
/* =====================================================
   COLISIONES Y FUSIONES GALACTICAS
   Three.js r128
   Modelo visual educativo
   ===================================================== */

/* 1. ELEMENTOS HTML */

const canvas = document.getElementById("lienzo-sim");
const control = document.getElementById("control-sim");
const valor = document.getElementById("valor-sim");
const fase = document.getElementById("fase-sim");
const botonReiniciar = document.getElementById("reiniciar-sim");

/* 2. ESCENA */

const escena = new THREE.Scene();
escena.background = new THREE.Color(0x000308);

/* 3. CAMARA */

const camara = new THREE.PerspectiveCamera(
    50,
    1,
    0.1,
    150
);

camara.position.set(0, 0.5, 9);

/* 4. RENDERIZADOR */

const renderizador = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false
});

renderizador.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
);

/* 5. FONDO ESTELAR */

const fondoGeometria = new THREE.BufferGeometry();
const cantidadFondo = 3500;
const posicionesFondo = new Float32Array(cantidadFondo * 3);

for (let i = 0; i < cantidadFondo; i++) {
    const i3 = i * 3;

    posicionesFondo[i3] = (Math.random() - 0.5) * 45;
    posicionesFondo[i3 + 1] = (Math.random() - 0.5) * 30;
    posicionesFondo[i3 + 2] = (Math.random() - 0.5) * 40;
}

fondoGeometria.setAttribute(
    "position",
    new THREE.BufferAttribute(posicionesFondo, 3)
);

const fondoMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.018,
    transparent: true,
    opacity: 0.8,
    depthWrite: false
});

const estrellasFondo = new THREE.Points(
    fondoGeometria,
    fondoMaterial
);

escena.add(estrellasFondo);

/* 6. CREAR GALAXIA */

function crearGalaxia(colorBase, semilla) {
    const grupo = new THREE.Group();

    const cantidad = 8500;
    const geometria = new THREE.BufferGeometry();

    const posiciones = new Float32Array(cantidad * 3);
    const colores = new Float32Array(cantidad * 3);

    const color = new THREE.Color(colorBase);

    // Particulas distribuidas en dos brazos espirales.

    for (let i = 0; i < cantidad; i++) {
        const i3 = i * 3;

        const radio = Math.pow(Math.random(), 0.58) * 2.5;

        const brazo = i % 2 === 0 ? 0 : Math.PI;

        const angulo = radio * 3.0 + brazo + semilla;

        const dispersion =
            (Math.random() - 0.5) * (0.12 + radio * 0.23);

        const x =
            Math.cos(angulo) * radio + dispersion;

        const z =
            Math.sin(angulo) * radio + dispersion;

        const y =
            (Math.random() - 0.5) * (0.08 + radio * 0.12);

        posiciones[i3] = x;
        posiciones[i3 + 1] = y;
        posiciones[i3 + 2] = z;

        const brillo = 0.45 + Math.random() * 0.55;

        colores[i3] = color.r * brillo;
        colores[i3 + 1] = color.g * brillo;
        colores[i3 + 2] = color.b * brillo;
    }

    geometria.setAttribute(
        "position",
        new THREE.BufferAttribute(posiciones, 3)
    );

    geometria.setAttribute(
        "color",
        new THREE.BufferAttribute(colores, 3)
    );

    const material = new THREE.PointsMaterial({
        size: 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const estrellas = new THREE.Points(geometria, material);
    grupo.add(estrellas);

    // Nucleo brillante.

    const nucleo = new THREE.Mesh(
        new THREE.SphereGeometry(0.32, 32, 32),
        new THREE.MeshBasicMaterial({
            color: 0xfff3dc
        })
    );

    grupo.add(nucleo);

    // Halo interior.

    const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.65, 32, 32),
        new THREE.MeshBasicMaterial({
            color: colorBase,
            transparent: true,
            opacity: 0.11,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );

    grupo.add(halo);

    // Halo exterior.

    const haloExterior = new THREE.Mesh(
        new THREE.SphereGeometry(1.1, 32, 32),
        new THREE.MeshBasicMaterial({
            color: colorBase,
            transparent: true,
            opacity: 0.035,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        })
    );

    grupo.add(haloExterior);

    return grupo;
}

/* 7. CREAR LAS DOS GALAXIAS */

const galaxiaAzul = crearGalaxia(0x2587ff, 0);
const galaxiaRosa = crearGalaxia(0xff3f9f, Math.PI * 0.25);

/* 8. ORIENTACION INICIAL */

galaxiaAzul.rotation.x = 0.45;
galaxiaAzul.rotation.z = -0.15;

galaxiaRosa.rotation.x = -0.45;
galaxiaRosa.rotation.z = 0.15;

/* 9. AGREGAR A LA ESCENA */

escena.add(galaxiaAzul);
escena.add(galaxiaRosa);

/* 10. MOVIMIENTO SEGUN EL CONTROL */

function actualizarSimulacion() {
    const progreso = Number(control.value) / 100;

    valor.textContent = Math.round(progreso * 100) + "%";

    // Distancia entre las galaxias.

    const distancia = 3.2 * (1 - progreso);

    // Aproximacion y movimiento vertical.

    const movimientoVertical =
        Math.sin(progreso * Math.PI) * 0.65;

    galaxiaAzul.position.set(
        -distancia,
        movimientoVertical,
        Math.sin(progreso * Math.PI) * 0.5
    );

    galaxiaRosa.position.set(
        distancia,
        -movimientoVertical,
        -Math.sin(progreso * Math.PI) * 0.5
    );

    // Deformacion visual del disco.

    const deformacion =
        1 + Math.sin(progreso * Math.PI) * 0.35;

    const grosor =
        1 - Math.sin(progreso * Math.PI) * 0.18;

    galaxiaAzul.scale.set(deformacion, 1, grosor);
    galaxiaRosa.scale.set(deformacion, 1, grosor);

    // Giro de las galaxias.

    galaxiaAzul.rotation.z = -0.15 + progreso * 1.4;
    galaxiaRosa.rotation.z = 0.15 - progreso * 1.4;

    // Cambiar el texto de la fase.

    if (progreso < 0.25) {
        fase.textContent = "Separación";
    } else if (progreso < 0.65) {
        fase.textContent = "Interacción";
    } else if (progreso < 0.95) {
        fase.textContent = "Colisión";
    } else {
        fase.textContent = "Fusión";
    }

    // Al final, ambas galaxias comparten una region central.
    // Se conserva su identidad de color para mostrar la mezcla.

    if (progreso >= 1) {
        galaxiaAzul.position.set(-0.12, 0, 0);
        galaxiaRosa.position.set(0.12, 0, 0);

        galaxiaAzul.scale.set(1.45, 1.15, 1.45);
        galaxiaRosa.scale.set(1.45, 1.15, 1.45);
    }
}

/* 11. EVENTO DEL CONTROL */

control.addEventListener("input", actualizarSimulacion);

/* 12. REINICIAR */

botonReiniciar.addEventListener("click", function () {
    control.value = 0;
    actualizarSimulacion();
});

/* 13. AJUSTAR EL CANVAS */

function ajustarTamano() {
    const ancho = canvas.clientWidth;
    const alto = canvas.clientHeight;

    if (ancho <= 0 || alto <= 0) {
        return;
    }

    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();

    renderizador.setSize(ancho, alto, false);
}

window.addEventListener("resize", ajustarTamano);

/* 14. ANIMACION */

function animar() {
    requestAnimationFrame(animar);

    // Rotacion continua de las galaxias.

    galaxiaAzul.rotation.y += 0.0015;
    galaxiaRosa.rotation.y -= 0.0015;

    // Desplazamiento suave del fondo.

    estrellasFondo.rotation.y += 0.00004;

    renderizador.render(escena, camara);
}

/* 15. INICIAR */

ajustarTamano();
actualizarSimulacion();
animar();
