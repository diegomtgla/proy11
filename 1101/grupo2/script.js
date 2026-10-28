// ============================================================
// PLANETAS DEL SISTEMA SOLAR - CORTE INTERNO
// Three.js r128
// SOLO THREE.* GLOBAL - SIN IMPORTS NI MÓDULOS
// ============================================================


// ============================================================
// ELEMENTOS HTML
// ============================================================

const canvas = document.getElementById("lienzo");
const control = document.getElementById("control");
const valor = document.getElementById("valor");


// ============================================================
// ESCENA
// ============================================================

const escena = new THREE.Scene();

escena.background = new THREE.Color(0x050510);


// ============================================================
// CÁMARA
// ============================================================

const camara = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
);

camara.position.set(0, 0, 20);

camara.lookAt(0, 0, 0);


// ============================================================
// RENDERIZADOR
// ============================================================

const renderizador = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderizador.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);


// ============================================================
// LUCES
// ============================================================

const luzAmbiente = new THREE.AmbientLight(
    0xffffff,
    0.7
);

escena.add(luzAmbiente);


const luzPrincipal = new THREE.DirectionalLight(
    0xffffff,
    1.8
);

luzPrincipal.position.set(
    5,
    8,
    10
);

escena.add(luzPrincipal);


const luzInterior = new THREE.PointLight(
    0xffffff,
    1.5,
    50
);

luzInterior.position.set(
    0,
    0,
    8
);

escena.add(luzInterior);


// ============================================================
// DATOS DE LOS 8 PLANETAS
// ============================================================

const planetas = [

    {
        nombre: "Mercurio",

        color: 0x888888,

        atmosfera: 0xbfc7d5,

        tipo: "rocoso",

        radio: 0.55,

        capas: [
            {
                nombre: "Corteza",
                color: 0x777777,
                escala: 1.00
            },
            {
                nombre: "Manto",
                color: 0xa66d4d,
                escala: 0.78
            },
            {
                nombre: "Núcleo metálico",
                color: 0xc58b45,
                escala: 0.48
            }
        ]
    },


    {
        nombre: "Venus",

        color: 0xd49a4c,

        atmosfera: 0xffc56b,

        tipo: "rocoso",

        radio: 0.75,

        capas: [
            {
                nombre: "Corteza",
                color: 0xb87845,
                escala: 1.00
            },
            {
                nombre: "Manto rocoso",
                color: 0xc85f35,
                escala: 0.78
            },
            {
                nombre: "Núcleo",
                color: 0x8f431f,
                escala: 0.42
            }
        ]
    },


    {
        nombre: "Tierra",

        color: 0x2374d8,

        atmosfera: 0x55cfff,

        tipo: "rocoso",

        radio: 0.80,

        capas: [
            {
                nombre: "Corteza",
                color: 0x4e9b55,
                escala: 1.00
            },
            {
                nombre: "Manto",
                color: 0xc46f3d,
                escala: 0.82
            },
            {
                nombre: "Núcleo externo",
                color: 0xd18b32,
                escala: 0.52
            },
            {
                nombre: "Núcleo interno",
                color: 0xf0c84b,
                escala: 0.30
            }
        ]
    },


    {
        nombre: "Marte",

        color: 0xb74b35,

        atmosfera: 0xff7254,

        tipo: "rocoso",

        radio: 0.65,

        capas: [
            {
                nombre: "Corteza",
                color: 0xa84732,
                escala: 1.00
            },
            {
                nombre: "Manto",
                color: 0xb8663e,
                escala: 0.78
            },
            {
                nombre: "Núcleo",
                color: 0xd08a3c,
                escala: 0.45
            }
        ]
    },


    {
        nombre: "Júpiter",

        color: 0xd2a16c,

        atmosfera: 0xe8c99c,

        tipo: "gaseoso",

        radio: 1.25,

        capas: [
            {
                nombre: "Atmósfera",
                color: 0xd6b07d,
                escala: 1.00
            },
            {
                nombre: "Hidrógeno molecular",
                color: 0xc79562,
                escala: 0.78
            },
            {
                nombre: "Hidrógeno metálico",
                color: 0x7b5965,
                escala: 0.55
            },
            {
                nombre: "Núcleo",
                color: 0x4a3540,
                escala: 0.28
            }
        ]
    },


    {
        nombre: "Saturno",

        color: 0xd8bd7c,

        atmosfera: 0xffdf9c,

        tipo: "gaseoso",

        radio: 1.10,

        capas: [
            {
                nombre: "Atmósfera",
                color: 0xe0c68c,
                escala: 1.00
            },
            {
                nombre: "Hidrógeno molecular",
                color: 0xc8a96c,
                escala: 0.78
            },
            {
                nombre: "Hidrógeno metálico",
                color: 0x776071,
                escala: 0.55
            },
            {
                nombre: "Núcleo",
                color: 0x4b3940,
                escala: 0.28
            }
        ]
    },


    {
        nombre: "Urano",

        color: 0x6ed5dc,

        atmosfera: 0x9ff7ff,

        tipo: "giganteHielo",

        radio: 0.95,

        capas: [
            {
                nombre: "Atmósfera",
                color: 0x75dce4,
                escala: 1.00
            },
            {
                nombre: "Manto de agua, amoníaco y metano",
                color: 0x257f9c,
                escala: 0.78
            },
            {
                nombre: "Núcleo rocoso",
                color: 0x7a5a4a,
                escala: 0.35
            }
        ]
    },


    {
        nombre: "Neptuno",

        color: 0x315bd6,

        atmosfera: 0x668cff,

        tipo: "giganteHielo",

        radio: 0.95,

        capas: [
            {
                nombre: "Atmósfera",
                color: 0x315bd6,
                escala: 1.00
            },
            {
                nombre: "Manto de agua, amoníaco y metano",
                color: 0x194f91,
                escala: 0.78
            },
            {
                nombre: "Núcleo rocoso",
                color: 0x705548,
                escala: 0.35
            }
        ]
    }

];


// ============================================================
// GRUPO PRINCIPAL
// ============================================================

const grupoPlanetas = new THREE.Group();

escena.add(grupoPlanetas);


// ============================================================
// INFORMACIÓN DE LOS PLANETAS CREADOS
// ============================================================

const objetosPlanetas = [];


// ============================================================
// POSICIONES
// ============================================================

const posiciones = [

    [-6.0, 3.0],
    [-2.0, 3.0],
    [2.0, 3.0],
    [6.0, 3.0],

    [-6.0, -3.0],
    [-2.0, -3.0],
    [2.0, -3.0],
    [6.0, -3.0]

];


// ============================================================
// CREAR ESFERA INTERNA
// ============================================================

function crearCapaInterna(
    radio,
    capa
) {

    const geometria =
        new THREE.SphereGeometry(
            radio * capa.escala,
            48,
            32
        );


    const material =
        new THREE.MeshPhongMaterial({

            color: capa.color,

            shininess: 35

        });


    const esfera =
        new THREE.Mesh(
            geometria,
            material
        );


    return esfera;

}


// ============================================================
// CREAR ATMÓSFERA
// ============================================================

function crearAtmosfera(
    radio,
    color
) {

    const geometria =
        new THREE.SphereGeometry(
            radio * 1.08,
            48,
            32
        );


    const material =
        new THREE.MeshPhongMaterial({

            color: color,

            transparent: true,

            opacity: 0.25,

            side: THREE.DoubleSide,

            depthWrite: false

        });


    return new THREE.Mesh(
        geometria,
        material
    );

}


// ============================================================
// CREAR PLANETA
// ============================================================

function crearPlaneta(
    datos,
    indice
) {

    const grupo =
        new THREE.Group();


    // --------------------------------------------------------
    // POSICIÓN
    // --------------------------------------------------------

    grupo.position.x =
        posiciones[indice][0];

    grupo.position.y =
        posiciones[indice][1];


    // --------------------------------------------------------
    // RADIO
    // --------------------------------------------------------

    const escalaGeneral = 0.68;

    const radio =
        datos.radio *
        escalaGeneral;


    // ========================================================
    // GRUPO SUPERIOR
    // ========================================================

    const superior =
        new THREE.Group();


    // ========================================================
    // GRUPO INFERIOR
    // ========================================================

    const inferior =
        new THREE.Group();


    // ========================================================
    // CREAR LAS CAPAS INTERNAS
    // ========================================================

    for (
        let i = 0;
        i < datos.capas.length;
        i++
    ) {

        const capa =
            datos.capas[i];


        // -----------------------------------------------
        // RADIO DE ESTA CAPA
        // -----------------------------------------------

        const radioCapa =
            radio *
            capa.escala;


        // -----------------------------------------------
        // GEOMETRÍA COMPLETA
        // -----------------------------------------------

        const geometria =
            new THREE.SphereGeometry(
                radioCapa,
                48,
                32
            );


        const material =
            new THREE.MeshPhongMaterial({

                color: capa.color,

                shininess: 50

            });


        // -----------------------------------------------
        // MITAD SUPERIOR
        // -----------------------------------------------

        const geometriaSuperior =
            new THREE.SphereGeometry(
                radioCapa,
                48,
                32,
                0,
                Math.PI * 2,
                0,
                Math.PI / 2
            );


        const objetoSuperior =
            new THREE.Mesh(
                geometriaSuperior,
                material
            );


        // -----------------------------------------------
        // MITAD INFERIOR
        // -----------------------------------------------

        const geometriaInferior =
            new THREE.SphereGeometry(
                radioCapa,
                48,
                32,
                0,
                Math.PI * 2,
                Math.PI / 2,
                Math.PI / 2
            );


        const objetoInferior =
            new THREE.Mesh(
                geometriaInferior,
                material
            );


        superior.add(
            objetoSuperior
        );

        inferior.add(
            objetoInferior
        );

    }


    // ========================================================
    // ATMÓSFERA
    // ========================================================

    const atmosferaCompleta =
        crearAtmosfera(
            radio,
            datos.atmosfera
        );


    // ========================================================
    // MITADES DE ATMÓSFERA
    // ========================================================

    const geometriaAtmSuperior =
        new THREE.SphereGeometry(
            radio * 1.08,
            48,
            32,
            0,
            Math.PI * 2,
            0,
            Math.PI / 2
        );


    const geometriaAtmInferior =
        new THREE.SphereGeometry(
            radio * 1.08,
            48,
            32,
            0,
            Math.PI * 2,
            Math.PI / 2,
            Math.PI / 2
        );


    const materialAtm =
        new THREE.MeshPhongMaterial({

            color: datos.atmosfera,

            transparent: true,

            opacity: 0.30,

            side: THREE.DoubleSide,

            depthWrite: false,

            shininess: 100

        });


    const atmSuperior =
        new THREE.Mesh(
            geometriaAtmSuperior,
            materialAtm
        );


    const atmInferior =
        new THREE.Mesh(
            geometriaAtmInferior,
            materialAtm
        );


    superior.add(
        atmSuperior
    );

    inferior.add(
        atmInferior
    );


    // ========================================================
    // AÑADIR MITADES
    // ========================================================

    grupo.add(
        superior
    );

    grupo.add(
        inferior
    );


    // ========================================================
    // ANILLOS DE SATURNO
    // ========================================================

    if (
        datos.nombre === "Saturno"
    ) {

        const geometriaAnillo =
            new THREE.RingGeometry(
                radio * 1.25,
                radio * 2.0,
                64
            );


        const materialAnillo =
            new THREE.MeshBasicMaterial({

                color: 0xd8c38f,

                side: THREE.DoubleSide,

                transparent: true,

                opacity: 0.7

            });


        const anillo =
            new THREE.Mesh(
                geometriaAnillo,
                materialAnillo
            );


        anillo.rotation.x =
            Math.PI / 2;


        grupo.add(
            anillo
        );

    }


    // ========================================================
    // GUARDAR INFORMACIÓN
    // ========================================================

    objetosPlanetas.push({

        grupo: grupo,

        superior: superior,

        inferior: inferior,

        radio: radio,

        rotacion:
            0.002 +
            Math.random() * 0.003

    });


    // ========================================================
    // AÑADIR A LA ESCENA
    // ========================================================

    grupoPlanetas.add(
        grupo
    );

}


// ============================================================
// CREAR LOS 8 PLANETAS
// ============================================================

for (
    let i = 0;
    i < planetas.length;
    i++
) {

    crearPlaneta(
        planetas[i],
        i
    );

}


// ============================================================
// CONTROL RANGE
// ============================================================

function actualizarApertura() {

    // -----------------------------------------------
    // VALOR
    // -----------------------------------------------

    const porcentaje =
        Number(control.value);


    // -----------------------------------------------
    // MOSTRAR VALOR
    // -----------------------------------------------

    valor.textContent =
        porcentaje + "%";


    // -----------------------------------------------
    // CONVERTIR 0-100 A 0-1
    // -----------------------------------------------

    const progreso =
        porcentaje / 100;


    // =================================================
    // ABRIR TODOS LOS PLANETAS
    // =================================================

    objetosPlanetas.forEach(
        function(planeta) {

            const separacion =
                planeta.radio *
                2.2 *
                progreso;


            // Mitad superior
            planeta.superior.position.y =
                separacion;


            // Mitad inferior
            planeta.inferior.position.y =
                -separacion;

        }
    );

}


// ============================================================
// EVENTO DEL RANGE
// ============================================================

control.addEventListener(
    "input",
    actualizarApertura
);


// ============================================================
// ESTADO INICIAL
// ============================================================

actualizarApertura();


// ============================================================
// REDIMENSIONAR
// ============================================================

function ajustarTamano() {

    const ancho =
        canvas.clientWidth;

    const alto =
        canvas.clientHeight;


    if (
        ancho === 0 ||
        alto === 0
    ) {

        return;

    }


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


ajustarTamano();


// ============================================================
// ANIMACIÓN
// ============================================================

function animar() {

    requestAnimationFrame(
        animar
    );


    // -----------------------------------------------
    // ROTACIÓN
    // -----------------------------------------------

    objetosPlanetas.forEach(
        function(planeta) {

            planeta.superior.rotation.y +=
                planeta.rotacion;


            planeta.inferior.rotation.y +=
                planeta.rotacion;

        }
    );


    // -----------------------------------------------
    // MOVIMIENTO SUAVE
    // -----------------------------------------------

    grupoPlanetas.rotation.y =
        Math.sin(
            Date.now() * 0.0002
        ) * 0.02;


    // -----------------------------------------------
    // RENDER
    // -----------------------------------------------

    renderizador.render(
        escena,
        camara
    );

}


// ============================================================
// INICIAR
// ============================================================

animar();
// ---------- SONIDO AMBIENTAL ----------
let audio = null;
function iniciarSonido() {
audio = new AudioContext();
const onda = audio.createOscillator();
const volumen = audio.createGain();
onda.type = "sine";
onda.frequency.value = 110; // el tono de su ambiente
volumen.gain.value = 0.12; // nunca pasen de 0.15
onda.connect(volumen);
volumen.connect(audio.destination);
onda.start();
}
// ---------- EL BOTÓN DE ENTRADA ----------
const botonEntrar = document.getElementById("entrar");
botonEntrar.addEventListener("click", function () {
iniciarSonido();
if (typeof DeviceOrientationEvent !== "undefined" &&
typeof DeviceOrientationEvent.requestPermission === "function") {
DeviceOrientationEvent.requestPermission();
}
botonEntrar.style.display = "none";
});