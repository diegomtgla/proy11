// ======================================================
// PLANETAS TERRESTRES REALISTAS - THREE.JS r128
// ======================================================
// Superficies procedurales con:
// - Color
// - Relieve / bump map
// - Rugosidad
// - Cráteres
// - Montañas
// - Nubes de la Tierra
// ======================================================


// ======================================================
// 1. CANVAS
// ======================================================

const canvas = document.getElementById("lienzo");

const escena = new THREE.Scene();

escena.background = new THREE.Color(0x010207);


// ======================================================
// 2. CÁMARA
// ======================================================

const camara = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100
);

camara.position.set(0, 0, 5);


// ======================================================
// 3. RENDERIZADOR
// ======================================================

const renderizador = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderizador.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderizador.setSize(
    canvas.clientWidth,
    canvas.clientHeight,
    false
);

// Mejor respuesta de luz
renderizador.outputEncoding = THREE.sRGBEncoding;

renderizador.toneMapping = THREE.ACESFilmicToneMapping;
renderizador.toneMappingExposure = 1.15;


// ======================================================
// 4. ILUMINACIÓN
// ======================================================

const luzAmbiente = new THREE.AmbientLight(
    0xffffff,
    0.18
);

escena.add(luzAmbiente);


// Sol principal
const luzSol = new THREE.DirectionalLight(
    0xffffff,
    3.2
);

luzSol.position.set(
    5,
    2.5,
    4
);

escena.add(luzSol);


// Luz azul muy tenue del espacio
const luzRelleno = new THREE.DirectionalLight(
    0x5577ff,
    0.12
);

luzRelleno.position.set(
    -4,
    -2,
    -4
);

escena.add(luzRelleno);


// ======================================================
// 5. GRUPO
// ======================================================

const sistemaPlaneta = new THREE.Group();

escena.add(sistemaPlaneta);


// ======================================================
// 6. GEOMETRÍA
// ======================================================

const geometriaPlaneta =
    new THREE.SphereGeometry(
        1.45,
        160,
        128
    );


// ======================================================
// 7. GENERADOR ALEATORIO
// ======================================================

function aleatorioSemilla(semilla) {

    const x =
        Math.sin(semilla * 12.9898) *
        43758.5453;

    return x - Math.floor(x);
}


// ======================================================
// 8. RUIDO PROCEDURAL
// ======================================================

function ruido(x, y, semilla) {

    const n =
        Math.sin(
            x * 127.1 +
            y * 311.7 +
            semilla * 74.7
        ) * 43758.5453;

    return n - Math.floor(n);
}


function interpolar(a, b, t) {

    return a +
        (b - a) *
        (t * t * (3 - 2 * t));
}


function ruidoSuave(x, y, semilla) {

    const x0 = Math.floor(x);
    const y0 = Math.floor(y);

    const fx = x - x0;
    const fy = y - y0;

    const a = ruido(
        x0,
        y0,
        semilla
    );

    const b = ruido(
        x0 + 1,
        y0,
        semilla
    );

    const c = ruido(
        x0,
        y0 + 1,
        semilla
    );

    const d = ruido(
        x0 + 1,
        y0 + 1,
        semilla
    );

    const ab =
        interpolar(a, b, fx);

    const cd =
        interpolar(c, d, fx);

    return interpolar(
        ab,
        cd,
        fy
    );
}


// ======================================================
// 9. FRACTAL BROWN / FBM
// ======================================================

function fbm(x, y, semilla, octavas) {

    let valor = 0;
    let amplitud = 0.5;
    let frecuencia = 1;
    let suma = 0;

    for (let i = 0; i < octavas; i++) {

        valor +=
            ruidoSuave(
                x * frecuencia,
                y * frecuencia,
                semilla + i * 17
            ) * amplitud;

        suma += amplitud;

        amplitud *= 0.5;
        frecuencia *= 2;
    }

    return valor / suma;
}


// ======================================================
// 10. FUNCIONES DE COLOR
// ======================================================

function limitar(v) {

    return Math.max(
        0,
        Math.min(255, v)
    );
}


function colorPixel(
    datos,
    indice,
    r,
    g,
    b
) {

    datos[indice] = limitar(r);
    datos[indice + 1] = limitar(g);
    datos[indice + 2] = limitar(b);
    datos[indice + 3] = 255;
}


// ======================================================
// 11. CRÁTERES REALISTAS
// ======================================================

function dibujarCraterRealista(
    ctx,
    x,
    y,
    radio,
    color
) {

    // Halo exterior
    const gradiente =
        ctx.createRadialGradient(
            x,
            y,
            radio * 0.05,
            x,
            y,
            radio
        );

    gradiente.addColorStop(
        0,
        color
    );

    gradiente.addColorStop(
        0.55,
        color
    );

    gradiente.addColorStop(
        0.72,
        "rgba(20,18,17,0.25)"
    );

    gradiente.addColorStop(
        0.86,
        "rgba(230,220,205,0.16)"
    );

    gradiente.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = gradiente;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radio,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Interior del cráter
    const interior =
        ctx.createRadialGradient(
            x - radio * 0.12,
            y - radio * 0.12,
            radio * 0.05,
            x,
            y,
            radio * 0.62
        );

    interior.addColorStop(
        0,
        "rgba(25,23,21,0.55)"
    );

    interior.addColorStop(
        0.7,
        "rgba(60,55,50,0.28)"
    );

    interior.addColorStop(
        1,
        "rgba(0,0,0,0)"
    );

    ctx.fillStyle = interior;

    ctx.beginPath();

    ctx.arc(
        x,
        y,
        radio * 0.68,
        0,
        Math.PI * 2
    );

    ctx.fill();


    // Pico central
    if (radio > 9) {

        ctx.fillStyle =
            "rgba(220,215,205,0.25)";

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radio * 0.10,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}


// ======================================================
// 12. MAPA DE ALTURA
// ======================================================

function crearMapaAltura(
    tipo,
    ancho,
    alto
) {

    const mapa =
        document.createElement("canvas");

    mapa.width = ancho;
    mapa.height = alto;

    const ctx =
        mapa.getContext("2d");

    const imagen =
        ctx.createImageData(
            ancho,
            alto
        );

    const datos =
        imagen.data;


    for (
        let y = 0;
        y < alto;
        y++
    ) {

        for (
            let x = 0;
            x < ancho;
            x++
        ) {

            const i =
                (y * ancho + x) * 4;

            const nx = x / ancho;
            const ny = y / alto;


            let altura = 0.5;


            // ------------------------------------------
            // MERCURIO
            // ------------------------------------------

            if (tipo === "mercurio") {

                const grande =
                    fbm(
                        nx * 8,
                        ny * 8,
                        10,
                        5
                    );

                const pequeno =
                    fbm(
                        nx * 35,
                        ny * 35,
                        20,
                        3
                    );

                altura =
                    0.43 +
                    grande * 0.32 +
                    pequeno * 0.12;
            }


            // ------------------------------------------
            // VENUS
            // ------------------------------------------

            if (tipo === "venus") {

                const montanas =
                    fbm(
                        nx * 5,
                        ny * 5,
                        30,
                        6
                    );

                const volcanes =
                    fbm(
                        nx * 15,
                        ny * 15,
                        40,
                        3
                    );

                altura =
                    0.46 +
                    montanas * 0.35 +
                    volcanes * 0.10;
            }


            // ------------------------------------------
            // TIERRA
            // ------------------------------------------

            if (tipo === "tierra") {

                const continente =
                    fbm(
                        nx * 3.2,
                        ny * 3.2,
                        50,
                        6
                    );

                const montana =
                    fbm(
                        nx * 18,
                        ny * 18,
                        60,
                        4
                    );

                // Oceanos relativamente bajos
                if (continente < 0.53) {

                    altura =
                        0.43 +
                        continente * 0.05;

                } else {

                    altura =
                        0.52 +
                        (continente - 0.53) *
                        0.75;

                    altura +=
                        montana * 0.12;
                }
            }


            // ------------------------------------------
            // MARTE
            // ------------------------------------------

            if (tipo === "marte") {

                const terreno =
                    fbm(
                        nx * 6,
                        ny * 6,
                        70,
                        6
                    );

                const detalle =
                    fbm(
                        nx * 28,
                        ny * 28,
                        80,
                        3
                    );

                altura =
                    0.40 +
                    terreno * 0.40 +
                    detalle * 0.10;
            }


            const gris =
                Math.floor(
                    limitar(
                        altura * 255
                    )
                );

            datos[i] = gris;
            datos[i + 1] = gris;
            datos[i + 2] = gris;
            datos[i + 3] = 255;
        }
    }


    ctx.putImageData(
        imagen,
        0,
        0
    );


    // Cráteres también afectan el relieve
    let cantidad = 0;

    if (tipo === "mercurio")
        cantidad = 180;

    if (tipo === "venus")
        cantidad = 70;

    if (tipo === "tierra")
        cantidad = 35;

    if (tipo === "marte")
        cantidad = 150;


    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

        const x =
            aleatorioSemilla(
                i * 9 + 1
            ) * ancho;

        const y =
            aleatorioSemilla(
                i * 9 + 2
            ) * alto;

        const radio =
            2 +
            aleatorioSemilla(
                i * 9 + 3
            ) * (
                tipo === "mercurio"
                    ? 20
                    : 13
            );


        const gradiente =
            ctx.createRadialGradient(
                x,
                y,
                radio * 0.1,
                x,
                y,
                radio
            );

        gradiente.addColorStop(
            0,
            "rgb(65,65,65)"
        );

        gradiente.addColorStop(
            0.45,
            "rgb(90,90,90)"
        );

        gradiente.addColorStop(
            0.68,
            "rgb(210,210,210)"
        );

        gradiente.addColorStop(
            0.78,
            "rgb(110,110,110)"
        );

        gradiente.addColorStop(
            1,
            "rgba(120,120,120,0)"
        );


        ctx.fillStyle =
            gradiente;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radio,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    return mapa;
}


// ======================================================
// 13. MAPA DE COLOR
// ======================================================

function crearMapaColor(
    tipo,
    ancho,
    alto
) {

    const mapa =
        document.createElement("canvas");

    mapa.width = ancho;
    mapa.height = alto;

    const ctx =
        mapa.getContext("2d");

    const imagen =
        ctx.createImageData(
            ancho,
            alto
        );

    const datos =
        imagen.data;


    for (
        let y = 0;
        y < alto;
        y++
    ) {

        for (
            let x = 0;
            x < ancho;
            x++
        ) {

            const i =
                (y * ancho + x) * 4;

            const nx = x / ancho;
            const ny = y / alto;


            // ------------------------------------------
            // MERCURIO
            // ------------------------------------------

            if (tipo === "mercurio") {

                const base =
                    fbm(
                        nx * 7,
                        ny * 7,
                        10,
                        5
                    );

                const detalle =
                    fbm(
                        nx * 35,
                        ny * 35,
                        20,
                        3
                    );

                const r =
                    95 +
                    base * 55 +
                    detalle * 22;

                const g =
                    94 +
                    base * 54 +
                    detalle * 20;

                const b =
                    90 +
                    base * 50 +
                    detalle * 18;

                colorPixel(
                    datos,
                    i,
                    r,
                    g,
                    b
                );
            }


            // ------------------------------------------
            // VENUS
            // ------------------------------------------

            if (tipo === "venus") {

                const n =
                    fbm(
                        nx * 6,
                        ny * 12,
                        30,
                        5
                    );

                const bandas =
                    Math.sin(
                        ny * 45 +
                        n * 5
                    ) * 0.5 + 0.5;

                const r =
                    170 +
                    n * 55;

                const g =
                    125 +
                    n * 45 +
                    bandas * 15;

                const b =
                    65 +
                    n * 35;

                colorPixel(
                    datos,
                    i,
                    r,
                    g,
                    b
                );
            }


            // ------------------------------------------
            // TIERRA
            // ------------------------------------------

            if (tipo === "tierra") {

                const continente =
                    fbm(
                        nx * 3.2,
                        ny * 3.2,
                        50,
                        6
                    );

                const detalle =
                    fbm(
                        nx * 18,
                        ny * 18,
                        60,
                        4
                    );


                // OCEANO
                if (continente < 0.53) {

                    const profundidad =
                        0.53 - continente;

                    const r =
                        5 +
                        profundidad * 18;

                    const g =
                        55 +
                        profundidad * 35;

                    const b =
                        125 +
                        profundidad * 80;

                    colorPixel(
                        datos,
                        i,
                        r,
                        g,
                        b
                    );
                }

                // TIERRA
                else {

                    const montana =
                        detalle;

                    let r =
                        65 +
                        continente * 75;

                    let g =
                        78 +
                        continente * 72;

                    let b =
                        34 +
                        continente * 32;


                    // Regiones montañosas
                    if (montana > 0.68) {

                        r += 42;
                        g += 37;
                        b += 32;
                    }


                    // Regiones desérticas
                    if (
                        continente > 0.70 &&
                        montana < 0.50
                    ) {

                        r += 32;
                        g += 22;
                        b -= 5;
                    }


                    colorPixel(
                        datos,
                        i,
                        r,
                        g,
                        b
                    );
                }
            }


            // ------------------------------------------
            // MARTE
            // ------------------------------------------

            if (tipo === "marte") {

                const terreno =
                    fbm(
                        nx * 6,
                        ny * 6,
                        70,
                        6
                    );

                const detalle =
                    fbm(
                        nx * 25,
                        ny * 25,
                        80,
                        4
                    );


                const r =
                    105 +
                    terreno * 80 +
                    detalle * 25;

                const g =
                    30 +
                    terreno * 38;

                const b =
                    20 +
                    terreno * 25;


                colorPixel(
                    datos,
                    i,
                    r,
                    g,
                    b
                );
            }
        }
    }


    ctx.putImageData(
        imagen,
        0,
        0
    );


    // Cráteres visibles
    let cantidad = 0;

    if (tipo === "mercurio")
        cantidad = 220;

    if (tipo === "venus")
        cantidad = 85;

    if (tipo === "tierra")
        cantidad = 28;

    if (tipo === "marte")
        cantidad = 190;


    for (
        let i = 0;
        i < cantidad;
        i++
    ) {

        const x =
            aleatorioSemilla(
                1000 + i * 5
            ) * ancho;

        const y =
            aleatorioSemilla(
                2000 + i * 5
            ) * alto;

        const radio =
            1.5 +
            aleatorioSemilla(
                3000 + i * 5
            ) * (
                tipo === "mercurio"
                    ? 18
                    : 11
            );


        let color =
            "rgba(50,45,40,0.35)";


        if (tipo === "marte") {

            color =
                "rgba(75,35,27,0.38)";
        }

        if (tipo === "venus") {

            color =
                "rgba(105,70,38,0.28)";
        }


        dibujarCraterRealista(
            ctx,
            x,
            y,
            radio,
            color
        );
    }


    return mapa;
}


// ======================================================
// 14. MAPA DE RUGOSIDAD
// ======================================================

function crearMapaRugosidad(
    tipo,
    ancho,
    alto
) {

    const mapa =
        document.createElement("canvas");

    mapa.width = ancho;
    mapa.height = alto;

    const ctx =
        mapa.getContext("2d");

    const imagen =
        ctx.createImageData(
            ancho,
            alto
        );

    const datos =
        imagen.data;


    for (
        let y = 0;
        y < alto;
        y++
    ) {

        for (
            let x = 0;
            x < ancho;
            x++
        ) {

            const i =
                (y * ancho + x) * 4;

            let r = 200;


            if (tipo === "mercurio") {

                r = 210;
            }


            if (tipo === "venus") {

                r = 185;
            }


            if (tipo === "tierra") {

                const continente =
                    fbm(
                        x / ancho * 3,
                        y / alto * 3,
                        50,
                        5
                    );

                // Tierra: agua más reflectante
                r =
                    continente < 0.53
                        ? 80
                        : 205;
            }


            if (tipo === "marte") {

                r = 190;
            }


            datos[i] = r;
            datos[i + 1] = r;
            datos[i + 2] = r;
            datos[i + 3] = 255;
        }
    }


    ctx.putImageData(
        imagen,
        0,
        0
    );


    return mapa;
}


// ======================================================
// 15. TEXTURAS
// ======================================================

function crearTexturasPlaneta(tipo) {

    const ancho = 1024;
    const alto = 512;


    const mapaColor =
        crearMapaColor(
            tipo,
            ancho,
            alto
        );


    const mapaAltura =
        crearMapaAltura(
            tipo,
            ancho,
            alto
        );


    const mapaRugosidad =
        crearMapaRugosidad(
            tipo,
            ancho,
            alto
        );


    const texturaColor =
        new THREE.CanvasTexture(
            mapaColor
        );

    const texturaAltura =
        new THREE.CanvasTexture(
            mapaAltura
        );

    const texturaRugosidad =
        new THREE.CanvasTexture(
            mapaRugosidad
        );


    texturaColor.encoding =
        THREE.sRGBEncoding;


    texturaColor.anisotropy =
        renderizador
            .capabilities
            .getMaxAnisotropy();


    texturaAltura.anisotropy =
        renderizador
            .capabilities
            .getMaxAnisotropy();


    texturaRugosidad.anisotropy =
        renderizador
            .capabilities
            .getMaxAnisotropy();


    return {
        color: texturaColor,
        altura: texturaAltura,
        rugosidad: texturaRugosidad
    };
}


// ======================================================
// 16. MATERIAL
// ======================================================

function crearMaterial(tipo) {

    const texturas =
        crearTexturasPlaneta(
            tipo
        );


    let intensidadRelieve =
        0.18;


    if (tipo === "mercurio")
        intensidadRelieve = 0.30;


    if (tipo === "venus")
        intensidadRelieve = 0.20;


    if (tipo === "tierra")
        intensidadRelieve = 0.16;


    if (tipo === "marte")
        intensidadRelieve = 0.28;


    const material =
        new THREE.MeshStandardMaterial({

            map:
                texturas.color,

            bumpMap:
                texturas.altura,

            bumpScale:
                intensidadRelieve,

            roughnessMap:
                texturas.rugosidad,

            roughness:
                tipo === "tierra"
                    ? 0.72
                    : 0.91,

            metalness:
                0.0
        });


    material.userData =
        texturas;


    return material;
}


// ======================================================
// 17. PLANETA
// ======================================================

const esfera =
    new THREE.Mesh(
        geometriaPlaneta,
        crearMaterial("mercurio")
    );


sistemaPlaneta.add(
    esfera
);


// ======================================================
// 18. ATMÓSFERA DE LA TIERRA
// ======================================================

const geometriaAtmosfera =
    new THREE.SphereGeometry(
        1.49,
        96,
        64
    );


const materialAtmosfera =
    new THREE.MeshBasicMaterial({

        color: 0x4da6ff,

        transparent: true,

        opacity: 0.075,

        side: THREE.BackSide
    });


const atmosfera =
    new THREE.Mesh(
        geometriaAtmosfera,
        materialAtmosfera
    );


atmosfera.visible = false;

sistemaPlaneta.add(
    atmosfera
);


// ======================================================
// 19. NUBES DE LA TIERRA
// ======================================================

function crearTexturaNubes() {

    const canvasNubes =
        document.createElement("canvas");

    canvasNubes.width = 1024;
    canvasNubes.height = 512;

    const ctx =
        canvasNubes.getContext("2d");


    ctx.clearRect(
        0,
        0,
        1024,
        512
    );


    for (
        let i = 0;
        i < 260;
        i++
    ) {

        const x =
            aleatorioSemilla(
                i * 7 + 1
            ) * 1024;

        const y =
            aleatorioSemilla(
                i * 7 + 2
            ) * 512;

        const rx =
            15 +
            aleatorioSemilla(
                i * 7 + 3
            ) * 70;

        const ry =
            4 +
            aleatorioSemilla(
                i * 7 + 4
            ) * 18;


        const gradiente =
            ctx.createRadialGradient(
                x,
                y,
                0,
                x,
                y,
                rx
            );


        gradiente.addColorStop(
            0,
            "rgba(255,255,255,0.38)"
        );

        gradiente.addColorStop(
            0.55,
            "rgba(255,255,255,0.20)"
        );

        gradiente.addColorStop(
            1,
            "rgba(255,255,255,0)"
        );


        ctx.fillStyle =
            gradiente;


        ctx.beginPath();

        ctx.ellipse(
            x,
            y,
            rx,
            ry,
            0,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }


    return new THREE.CanvasTexture(
        canvasNubes
    );
}


const texturaNubes =
    crearTexturaNubes();


texturaNubes.encoding =
    THREE.sRGBEncoding;


const geometriaNubes =
    new THREE.SphereGeometry(
        1.505,
        96,
        64
    );


const materialNubes =
    new THREE.MeshStandardMaterial({

        map: texturaNubes,

        transparent: true,

        opacity: 0.78,

        depthWrite: false,

        roughness: 1,

        metalness: 0
    });


const nubes =
    new THREE.Mesh(
        geometriaNubes,
        materialNubes
    );


nubes.visible = false;

sistemaPlaneta.add(
    nubes
);


// ======================================================
// 20. NOMBRES
// ======================================================

const nombres = [

    "Mercurio",
    "Venus",
    "Tierra",
    "Marte"

];


const tipos = [

    "mercurio",
    "venus",
    "tierra",
    "marte"

];


const control =
    document.getElementById(
        "control"
    );


const valor =
    document.getElementById(
        "valor"
    );


control.min = 0;
control.max = 3;
control.step = 1;


// ======================================================
// 21. CAMBIAR PLANETA
// ======================================================

function cambiarPlaneta(indice) {

    indice =
        parseInt(indice);


    valor.textContent =
        nombres[indice];


    const nuevoMaterial =
        crearMaterial(
            tipos[indice]
        );


    const materialAnterior =
        esfera.material;


    esfera.material =
        nuevoMaterial;


    // Liberar memoria
    if (materialAnterior) {

        if (
            materialAnterior.userData
        ) {

            const t =
                materialAnterior.userData;

            if (t.color)
                t.color.dispose();

            if (t.altura)
                t.altura.dispose();

            if (t.rugosidad)
                t.rugosidad.dispose();
        }

        materialAnterior.dispose();
    }


    // Atmósfera
    atmosfera.visible =
        tipos[indice] === "tierra";


    // Nubes
    nubes.visible =
        tipos[indice] === "tierra";


    // Rotación inicial
    if (
        tipos[indice] === "mercurio"
    ) {

        esfera.rotation.z = 0.02;
    }


    if (
        tipos[indice] === "venus"
    ) {

        esfera.rotation.z = 0.15;
    }


    if (
        tipos[indice] === "tierra"
    ) {

        esfera.rotation.z = 0.35;
    }


    if (
        tipos[indice] === "marte"
    ) {

        esfera.rotation.z = 0.20;
    }
}


// ======================================================
// 22. CONTROL
// ======================================================

control.addEventListener(
    "input",
    function () {

        cambiarPlaneta(
            control.value
        );

    }
);


// ======================================================
// 23. PLANETA INICIAL
// ======================================================

cambiarPlaneta(0);


// ======================================================
// 24. ANIMACIÓN
// ======================================================

function animar() {

    requestAnimationFrame(
        animar
    );


    // Rotación planetaria
    esfera.rotation.y += 0.0018;


    // Las nubes se mueven un poco más rápido
    nubes.rotation.y += 0.0022;


    // Atmósfera acompaña al planeta
    atmosfera.rotation.y += 0.0013;


    // Movimiento muy lento del sistema
    sistemaPlaneta.rotation.y += 0.00025;


    renderizador.render(
        escena,
        camara
    );
}


animar();


// ======================================================
// 25. RESPONSIVE
// ======================================================

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