// ============================================================
// SIMULADOR DEL SISTEMA SOLAR
// Three.js r128 - versión global
// NO usa imports ni módulos
// ============================================================


// ============================================================
// 1. CANVAS, ESCENA, CÁMARA Y RENDERIZADOR
// ============================================================

const canvas = document.getElementById("lienzo");
const control = document.getElementById("control");
const valor = document.getElementById("valor");

const escena = new THREE.Scene();

const camara = new THREE.PerspectiveCamera(
    45,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
);

camara.position.set(0, 0, 6);

const renderizador = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderizador.setSize(
    canvas.clientWidth,
    canvas.clientHeight,
    false
);

renderizador.setClearColor(0x050816);


// ============================================================
// 2. FONDO DE ESTRELLAS
// ============================================================

const estrellasGeometria = new THREE.BufferGeometry();

const cantidadEstrellas = 1800;
const posicionesEstrellas = new Float32Array(cantidadEstrellas * 3);

for (let i = 0; i < cantidadEstrellas * 3; i += 3) {

    posicionesEstrellas[i] =
        (Math.random() - 0.5) * 100;

    posicionesEstrellas[i + 1] =
        (Math.random() - 0.5) * 100;

    posicionesEstrellas[i + 2] =
        (Math.random() - 0.5) * 100;
}

estrellasGeometria.setAttribute(
    "position",
    new THREE.BufferAttribute(posicionesEstrellas, 3)
);

const estrellasMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.035,
    transparent: true,
    opacity: 0.9
});

const estrellas = new THREE.Points(
    estrellasGeometria,
    estrellasMaterial
);

escena.add(estrellas);


// ============================================================
// 3. GRUPO PRINCIPAL DEL PLANETA
// ============================================================

const grupoPlaneta = new THREE.Group();

escena.add(grupoPlaneta);


// ============================================================
// 4. DATOS FÍSICOS DE LOS PLANETAS
// ============================================================

const planetas = [

    {
        nombre: "Mercurio",
        masa: 0.055,
        volumen: 0.056,
        densidad: 5.43,
        gravedad: 3.70,
        tipo: "Planeta rocoso",
        composicion: "Hierro y silicatos",
        color: "#8b8b8b",
        radioVisual: 0.42,
        radioTerrestre: 0.383
    },

    {
        nombre: "Venus",
        masa: 0.815,
        volumen: 0.857,
        densidad: 5.24,
        gravedad: 8.87,
        tipo: "Planeta rocoso",
        composicion: "Silicatos, hierro y atmósfera densa",
        color: "#d99b52",
        radioVisual: 0.60,
        radioTerrestre: 0.949
    },

    {
        nombre: "Tierra",
        masa: 1,
        volumen: 1,
        densidad: 5.51,
        gravedad: 9.81,
        tipo: "Planeta rocoso",
        composicion: "Silicatos, hierro, níquel y agua",
        color: "#2878c8",
        radioVisual: 0.64,
        radioTerrestre: 1.000
    },

    {
        nombre: "Marte",
        masa: 0.107,
        volumen: 0.151,
        densidad: 3.93,
        gravedad: 3.71,
        tipo: "Planeta rocoso",
        composicion: "Silicatos, hierro y óxidos",
        color: "#b94c32",
        radioVisual: 0.48,
        radioTerrestre: 0.532
    },

    {
        nombre: "Júpiter",
        masa: 317.8,
        volumen: 1321,
        densidad: 1.33,
        gravedad: 24.79,
        tipo: "Gigante gaseoso",
        composicion: "Hidrógeno y helio",
        color: "#c99c70",
        radioVisual: 1.35,
        radioTerrestre: 11.21
    },

    {
        nombre: "Saturno",
        masa: 95.2,
        volumen: 764,
        densidad: 0.69,
        gravedad: 10.44,
        tipo: "Gigante gaseoso",
        composicion: "Hidrógeno y helio",
        color: "#d6c18a",
        radioVisual: 1.20,
        radioTerrestre: 9.45
    },

    {
        nombre: "Urano",
        masa: 14.5,
        volumen: 63.1,
        densidad: 1.27,
        gravedad: 8.69,
        tipo: "Gigante helado",
        composicion: "Agua, amoníaco, metano, hidrógeno y helio",
        color: "#70d6df",
        radioVisual: 0.95,
        radioTerrestre: 4.01
    },

    {
        nombre: "Neptuno",
        masa: 17.1,
        volumen: 57.7,
        densidad: 1.64,
        gravedad: 11.15,
        tipo: "Gigante helado",
        composicion: "Agua, amoníaco, metano, hidrógeno y helio",
        color: "#315bc9",
        radioVisual: 0.93,
        radioTerrestre: 3.88
    }

];


// ============================================================
// 5. PLANETA PRINCIPAL
// ============================================================

const geometriaPlaneta = new THREE.SphereGeometry(
    1,
    96,
    96
);

const materialPlaneta = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.75,
    metalness: 0.05
});

const planeta = new THREE.Mesh(
    geometriaPlaneta,
    materialPlaneta
);

grupoPlaneta.add(planeta);


// ============================================================
// 6. ATMÓSFERA EXTERIOR
// ============================================================

const atmosferaGeometria = new THREE.SphereGeometry(
    1.045,
    64,
    64
);

const atmosferaMaterial = new THREE.MeshBasicMaterial({
    color: 0x6bdff5,
    transparent: true,
    opacity: 0.08,
    side: THREE.BackSide
});

const atmosfera = new THREE.Mesh(
    atmosferaGeometria,
    atmosferaMaterial
);

grupoPlaneta.add(atmosfera);


// ============================================================
// 7. ILUMINACIÓN
// ============================================================

const luzAmbiental = new THREE.AmbientLight(
    0xffffff,
    0.7
);

escena.add(luzAmbiental);


const luzPrincipal = new THREE.DirectionalLight(
    0xffffff,
    2.2
);

luzPrincipal.position.set(
    5,
    4,
    6
);

escena.add(luzPrincipal);


const luzSecundaria = new THREE.DirectionalLight(
    0x6688ff,
    0.35
);

luzSecundaria.position.set(
    -4,
    -2,
    -5
);

escena.add(luzSecundaria);


// ============================================================
// 8. FUNCIÓN PARA CREAR CANVAS DE TEXTURA
// ============================================================

function crearCanvas() {

    const canvasTextura = document.createElement("canvas");

    canvasTextura.width = 1024;
    canvasTextura.height = 512;

    return canvasTextura;
}


// ============================================================
// 9. TEXTURA DE MERCURIO
// ============================================================

function texturaMercurio() {

    const c = crearCanvas();
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#777777";
    ctx.fillRect(0, 0, c.width, c.height);

    // manchas superficiales
    for (let i = 0; i < 350; i++) {

        const x = Math.random() * c.width;
        const y = Math.random() * c.height;

        const r = Math.random() * 25 + 5;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);

        ctx.fillStyle =
            Math.random() > 0.5
                ? "rgba(40,40,40,0.45)"
                : "rgba(190,190,190,0.25)";

        ctx.fill();
    }

    // cráteres
    for (let i = 0; i < 120; i++) {

        const x = Math.random() * c.width;
        const y = Math.random() * c.height;

        const r = Math.random() * 14 + 3;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);

        ctx.strokeStyle = "rgba(30,30,30,0.75)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
            x - r * 0.2,
            y - r * 0.2,
            r * 0.55,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "rgba(200,200,200,0.2)";
        ctx.fill();
    }

    return new THREE.CanvasTexture(c);
}


// ============================================================
// 10. TEXTURA DE VENUS
// ============================================================

function texturaVenus() {

    const c = crearCanvas();
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#d18c3d";
    ctx.fillRect(0, 0, c.width, c.height);

    // nubes turbulentas
    for (let i = 0; i < 180; i++) {

        const x = Math.random() * c.width;
        const y = Math.random() * c.height;

        const ancho = Math.random() * 180 + 50;
        const alto = Math.random() * 20 + 5;

        ctx.beginPath();

        ctx.ellipse(
            x,
            y,
            ancho,
            alto,
            Math.random(),
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            Math.random() > 0.5
                ? "rgba(255,215,140,0.25)"
                : "rgba(100,50,15,0.18)";

        ctx.fill();
    }

    // bandas atmosféricas
    for (let y = 0; y < c.height; y += 45) {

        ctx.fillStyle =
            "rgba(255,190,90,0.12)";

        ctx.fillRect(
            0,
            y,
            c.width,
            18
        );
    }

    return new THREE.CanvasTexture(c);
}


// ============================================================
// 11. TEXTURA DE LA TIERRA
// ============================================================

function texturaTierra() {

    const c = crearCanvas();
    const ctx = c.getContext("2d");

    // océano
    ctx.fillStyle = "#1266a8";
    ctx.fillRect(0, 0, c.width, c.height);

    // océanos con variaciones
    for (let i = 0; i < 120; i++) {

        const x = Math.random() * c.width;
        const y = Math.random() * c.height;

        const r = Math.random() * 60 + 10;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            r,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(30,130,190,0.25)";

        ctx.fill();
    }

    // continentes estilizados
    const continentes = [
        [250, 180, 100, 70],
        [420, 260, 90, 120],
        [570, 170, 120, 70],
        [700, 300, 90, 100],
        [800, 170, 80, 55],
        [150, 330, 70, 90]
    ];

    continentes.forEach((dato) => {

        const x = dato[0];
        const y = dato[1];
        const rx = dato[2];
        const ry = dato[3];

        ctx.beginPath();

        ctx.ellipse(
            x,
            y,
            rx,
            ry,
            Math.random(),
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#3e8b45";
        ctx.fill();

        // zonas montañosas
        ctx.beginPath();

        ctx.ellipse(
            x + 10,
            y - 5,
            rx * 0.45,
            ry * 0.25,
            0,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#6f8d48";
        ctx.fill();
    });

    // nubes
    for (let i = 0; i < 80; i++) {

        const x = Math.random() * c.width;
        const y = Math.random() * c.height;

        const rx = Math.random() * 60 + 20;
        const ry = Math.random() * 10 + 4;

        ctx.beginPath();

        ctx.ellipse(
            x,
            y,
            rx,
            ry,
            Math.random(),
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(255,255,255,0.5)";

        ctx.fill();
    }

    // polos
    ctx.fillStyle = "rgba(255,255,255,0.9)";

    ctx.fillRect(
        0,
        0,
        c.width,
        25
    );

    ctx.fillRect(
        0,
        c.height - 25,
        c.width,
        25
    );

    return new THREE.CanvasTexture(c);
}


// ============================================================
// 12. TEXTURA DE MARTE
// ============================================================

function texturaMarte() {

    const c = crearCanvas();
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#a83f2b";
    ctx.fillRect(0, 0, c.width, c.height);

    // zonas de diferentes tonos
    for (let i = 0; i < 160; i++) {

        const x = Math.random() * c.width;
        const y = Math.random() * c.height;

        const r = Math.random() * 45 + 10;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            r,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            Math.random() > 0.5
                ? "rgba(70,25,15,0.25)"
                : "rgba(230,100,50,0.18)";

        ctx.fill();
    }

    // cráteres
    for (let i = 0; i < 90; i++) {

        const x = Math.random() * c.width;
        const y = Math.random() * c.height;

        const r = Math.random() * 12 + 3;

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            r,
            0,
            Math.PI * 2
        );

        ctx.strokeStyle =
            "rgba(55,20,15,0.65)";

        ctx.lineWidth = 2;

        ctx.stroke();
    }

    // casquetes polares
    ctx.fillStyle = "#f0ddd0";

    ctx.fillRect(
        0,
        0,
        c.width,
        20
    );

    ctx.fillRect(
        0,
        c.height - 20,
        c.width,
        20
    );

    return new THREE.CanvasTexture(c);
}


// ============================================================
// 13. TEXTURA DE JÚPITER
// ============================================================

function texturaJupiter() {

    const c = crearCanvas();
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#c99a6a";
    ctx.fillRect(0, 0, c.width, c.height);

    // bandas atmosféricas
    const bandas = [
        ["#d9b58a", 55],
        ["#a87552", 45],
        ["#e0c197", 65],
        ["#a66e4d", 40],
        ["#d8ad7b", 70],
        ["#916047", 50],
        ["#d9b486", 60],
        ["#a87552", 45],
        ["#e3c39a", 60]
    ];

    let y = 0;

    bandas.forEach((banda) => {

        ctx.fillStyle = banda[0];

        ctx.fillRect(
            0,
            y,
            c.width,
            banda[1]
        );

        // turbulencias
        for (let i = 0; i < 20; i++) {

            const x = Math.random() * c.width;

            ctx.beginPath();

            ctx.ellipse(
                x,
                y + banda[1] / 2,
                Math.random() * 50 + 20,
                Math.random() * 8 + 3,
                0,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "rgba(255,255,255,0.08)";

            ctx.fill();
        }

        y += banda[1];
    });

    // Gran Mancha Roja
    ctx.beginPath();

    ctx.ellipse(
        730,
        320,
        75,
        38,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#a94b38";
    ctx.fill();

    ctx.beginPath();

    ctx.ellipse(
        730,
        320,
        55,
        25,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(255,180,130,0.3)";

    ctx.fill();

    return new THREE.CanvasTexture(c);
}


// ============================================================
// 14. TEXTURA DE SATURNO
// ============================================================

function texturaSaturno() {

    const c = crearCanvas();
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#d6c08a";
    ctx.fillRect(0, 0, c.width, c.height);

    const colores = [
        "#e4cf9e",
        "#c9af77",
        "#ead7aa",
        "#bca36f",
        "#dfc995",
        "#c4aa73",
        "#e7d4a4"
    ];

    let y = 0;

    colores.forEach((color, indice) => {

        const altura = 60;

        ctx.fillStyle = color;

        ctx.fillRect(
            0,
            y,
            c.width,
            altura
        );

        // pequeñas ondas
        for (let i = 0; i < 18; i++) {

            ctx.beginPath();

            ctx.ellipse(
                Math.random() * c.width,
                y + Math.random() * altura,
                Math.random() * 60 + 20,
                5,
                0,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "rgba(255,255,255,0.08)";

            ctx.fill();
        }

        y += altura;
    });

    return new THREE.CanvasTexture(c);
}


// ============================================================
// 15. TEXTURA DE URANO
// ============================================================

function texturaUrano() {

    const c = crearCanvas();
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#69cdd6";
    ctx.fillRect(0, 0, c.width, c.height);

    // bandas muy suaves
    for (let y = 0; y < c.height; y += 45) {

        ctx.fillStyle =
            y % 90 === 0
                ? "rgba(255,255,255,0.10)"
                : "rgba(20,130,150,0.08)";

        ctx.fillRect(
            0,
            y,
            c.width,
            25
        );
    }

    // nubes suaves
    for (let i = 0; i < 50; i++) {

        ctx.beginPath();

        ctx.ellipse(
            Math.random() * c.width,
            Math.random() * c.height,
            Math.random() * 80 + 30,
            Math.random() * 8 + 3,
            0,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(255,255,255,0.12)";

        ctx.fill();
    }

    return new THREE.CanvasTexture(c);
}


// ============================================================
// 16. TEXTURA DE NEPTUNO
// ============================================================

function texturaNeptuno() {

    const c = crearCanvas();
    const ctx = c.getContext("2d");

    ctx.fillStyle = "#2451b8";
    ctx.fillRect(0, 0, c.width, c.height);

    // bandas azules
    for (let y = 0; y < c.height; y += 45) {

        ctx.fillStyle =
            y % 90 === 0
                ? "#3264ca"
                : "#193f99";

        ctx.fillRect(
            0,
            y,
            c.width,
            28
        );
    }

    // turbulencias
    for (let i = 0; i < 70; i++) {

        ctx.beginPath();

        ctx.ellipse(
            Math.random() * c.width,
            Math.random() * c.height,
            Math.random() * 60 + 15,
            Math.random() * 8 + 3,
            Math.random(),
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(120,180,255,0.18)";

        ctx.fill();
    }

    // Gran tormenta oscura
    ctx.beginPath();

    ctx.ellipse(
        650,
        250,
        70,
        45,
        0,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(10,30,90,0.8)";

    ctx.fill();

    return new THREE.CanvasTexture(c);
}


// ============================================================
// 17. CREAR TEXTURA SEGÚN PLANETA
// ============================================================

function obtenerTextura(indice) {

    switch (indice) {

        case 0:
            return texturaMercurio();

        case 1:
            return texturaVenus();

        case 2:
            return texturaTierra();

        case 3:
            return texturaMarte();

        case 4:
            return texturaJupiter();

        case 5:
            return texturaSaturno();

        case 6:
            return texturaUrano();

        case 7:
            return texturaNeptuno();

        default:
            return texturaTierra();
    }
}


// ============================================================
// 18. ANILLOS DE SATURNO
// ============================================================

function crearAnillosSaturno() {

    const grupo = new THREE.Group();

    const anillos = [

        {
            interior: 1.25,
            exterior: 1.48,
            color: 0xd8c69b,
            opacidad: 0.85
        },

        {
            interior: 1.50,
            exterior: 1.63,
            color: 0xeee1bd,
            opacidad: 0.7
        },

        {
            interior: 1.66,
            exterior: 1.82,
            color: 0xbca878,
            opacidad: 0.75
        },

        {
            interior: 1.84,
            exterior: 2.02,
            color: 0xe4d4a9,
            opacidad: 0.65
        },

        {
            interior: 2.05,
            exterior: 2.16,
            color: 0x9f8d69,
            opacidad: 0.5
        }

    ];

    anillos.forEach((anillo) => {

        const geometria = new THREE.RingGeometry(
            anillo.interior,
            anillo.exterior,
            128
        );

        const material = new THREE.MeshBasicMaterial({

            color: anillo.color,

            transparent: true,

            opacity: anillo.opacidad,

            side: THREE.DoubleSide,

            depthWrite: false

        });

        const mesh = new THREE.Mesh(
            geometria,
            material
        );

        grupo.add(mesh);
    });

    grupo.rotation.x = Math.PI / 2;

    return grupo;
}


// ============================================================
// 19. ANILLOS DE URANO
// ============================================================

function crearAnillosUrano() {

    const grupo = new THREE.Group();

    const anillos = [

        [1.18, 1.22, 0x526d70, 0.45],
        [1.27, 1.31, 0x789497, 0.35],
        [1.36, 1.40, 0x3e595c, 0.5],
        [1.47, 1.50, 0x8ba4a5, 0.25]

    ];

    anillos.forEach((datos) => {

        const geometria = new THREE.RingGeometry(
            datos[0],
            datos[1],
            96
        );

        const material = new THREE.MeshBasicMaterial({

            color: datos[2],

            transparent: true,

            opacity: datos[3],

            side: THREE.DoubleSide,

            depthWrite: false

        });

        grupo.add(
            new THREE.Mesh(
                geometria,
                material
            )
        );

    });

    // Inclinación característica de Urano
    grupo.rotation.x = Math.PI / 2;
    grupo.rotation.z = THREE.MathUtils.degToRad(25);

    return grupo;
}


// ============================================================
// 20. CARACTERÍSTICAS EXTRA
// ============================================================

function crearCaracteristicas(indice) {

    const grupo = new THREE.Group();

    // -----------------------------
    // MERCURIO
    // -----------------------------

    if (indice === 0) {

        // cráteres externos decorativos
        for (let i = 0; i < 18; i++) {

            const geometria = new THREE.TorusGeometry(
                Math.random() * 0.025 + 0.015,
                0.008,
                8,
                16
            );

            const material = new THREE.MeshBasicMaterial({
                color: 0x4d4d4d
            });

            const crater = new THREE.Mesh(
                geometria,
                material
            );

            const phi = Math.random() * Math.PI;
            const theta = Math.random() * Math.PI * 2;

            crater.position.set(
                Math.sin(phi) * Math.cos(theta),
                Math.cos(phi),
                Math.sin(phi) * Math.sin(theta)
            );

            crater.lookAt(0, 0, 0);

            grupo.add(crater);
        }
    }


    // -----------------------------
    // VENUS
    // -----------------------------

    if (indice === 1) {

        for (let i = 0; i < 4; i++) {

            const nube = new THREE.Mesh(
                new THREE.TorusGeometry(
                    1.01,
                    0.008,
                    8,
                    64
                ),
                new THREE.MeshBasicMaterial({
                    color: 0xffd58a,
                    transparent: true,
                    opacity: 0.25
                })
            );

            nube.rotation.x =
                Math.random() * Math.PI;

            grupo.add(nube);
        }
    }


    // -----------------------------
    // TIERRA
    // -----------------------------

    if (indice === 2) {

        const atmosferaTierra =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    1.07,
                    64,
                    64
                ),
                new THREE.MeshBasicMaterial({
                    color: 0x5bbcff,
                    transparent: true,
                    opacity: 0.13,
                    side: THREE.BackSide
                })
            );

        grupo.add(atmosferaTierra);
    }


    // -----------------------------
    // MARTE
    // -----------------------------

    if (indice === 3) {

        const poloNorte =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.22,
                    32,
                    16
                ),
                new THREE.MeshBasicMaterial({
                    color: 0xf0ddd0
                })
            );

        poloNorte.position.y = 0.93;

        poloNorte.scale.set(
            1,
            0.35,
            1
        );

        grupo.add(poloNorte);
    }


    // -----------------------------
    // JÚPITER
    // -----------------------------

    if (indice === 4) {

        // Gran Mancha Roja exterior
        const mancha = new THREE.Mesh(
            new THREE.CircleGeometry(
                0.18,
                32
            ),
            new THREE.MeshBasicMaterial({
                color: 0xa94c38
            })
        );

        mancha.position.set(
            0.82,
            -0.18,
            0.55
        );

        mancha.lookAt(
            camara.position
        );

        grupo.add(mancha);
    }


    // -----------------------------
    // SATURNO
    // -----------------------------

    if (indice === 5) {

        grupo.add(
            crearAnillosSaturno()
        );
    }


    // -----------------------------
    // URANO
    // -----------------------------

    if (indice === 6) {

        grupo.add(
            crearAnillosUrano()
        );

        const atmosferaUrano =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    1.06,
                    64,
                    64
                ),
                new THREE.MeshBasicMaterial({
                    color: 0x7fe8ed,
                    transparent: true,
                    opacity: 0.10,
                    side: THREE.BackSide
                })
            );

        grupo.add(atmosferaUrano);
    }


    // -----------------------------
    // NEPTUNO
    // -----------------------------

    if (indice === 7) {

        const tormenta =
            new THREE.Mesh(
                new THREE.CircleGeometry(
                    0.15,
                    32
                ),
                new THREE.MeshBasicMaterial({
                    color: 0x172c78,
                    transparent: true,
                    opacity: 0.65
                })
            );

        tormenta.position.set(
            0.7,
            0.15,
            0.65
        );

        tormenta.lookAt(
            camara.position
        );

        grupo.add(tormenta);
    }

    return grupo;
}


// ============================================================
// 21. ACTUALIZAR PLANETA
// ============================================================

let caracteristicasActuales = null;
let texturaActual = null;

function actualizarPlaneta() {

    let indice = parseInt(control.value);

    if (isNaN(indice)) {
        indice = 0;
    }

    const datos = planetas[indice];

    // Actualizar todos los datos visibles del panel.
    const ponerTexto = (id, texto) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = texto;
    };
    const formato = (numero, decimales = 2) => numero.toLocaleString("es-CO", {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales
    });
    const resumenes = [
        "Un planeta pequeño, rocoso y rico en metales.",
        "Un mundo rocoso cubierto por una atmósfera muy densa.",
        "Un planeta rocoso con agua líquida estable en su superficie.",
        "Un mundo frío y rocoso conocido por su superficie rojiza.",
        "El planeta más grande, formado principalmente por hidrógeno y helio.",
        "Un gigante gaseoso reconocido por su amplio sistema de anillos.",
        "Un gigante helado que gira con una inclinación extrema.",
        "Un gigante helado azul con vientos muy intensos."
    ];
    ponerTexto("nombrePlaneta", datos.nombre);
    ponerTexto("tipoPlaneta", datos.tipo);
    ponerTexto("resumenPlaneta", resumenes[indice]);
    ponerTexto("masa", `${formato(datos.masa, datos.masa < 1 ? 3 : 1)} masas terrestres`);
    ponerTexto("volumen", `${formato(datos.volumen, datos.volumen < 1 ? 3 : 1)} volúmenes terrestres`);
    ponerTexto("densidad", `${formato(datos.densidad)} g/cm³`);
    ponerTexto("gravedad", `${formato(datos.gravedad)} m/s²`);
    ponerTexto("radio", `${formato(datos.radioTerrestre, 3)} radios terrestres`);
    ponerTexto("composicionPlaneta", datos.composicion);
    ponerTexto("comparacion", `La gravedad equivale aproximadamente al ${formato(datos.gravedad / 9.81 * 100, 1)} % de la gravedad terrestre.`);
    const barraGravedad = document.getElementById("barraGravedad");
    const barraDensidad = document.getElementById("barraDensidad");
    if (barraGravedad) barraGravedad.style.width = `${Math.min(datos.gravedad / 25 * 100, 100)}%`;
    if (barraDensidad) barraDensidad.style.width = `${Math.min(datos.densidad / 6 * 100, 100)}%`;
    const anterior = document.getElementById("anterior");
    const siguiente = document.getElementById("siguiente");
    if (anterior) anterior.disabled = indice === 0;
    if (siguiente) siguiente.disabled = indice === planetas.length - 1;


    // ------------------------------------------
    // ELIMINAR CARACTERÍSTICAS ANTERIORES
    // ------------------------------------------

    if (caracteristicasActuales) {

        grupoPlaneta.remove(
            caracteristicasActuales
        );

        caracteristicasActuales.traverse(
            function (objeto) {

                if (objeto.geometry) {
                    objeto.geometry.dispose();
                }

                if (objeto.material) {

                    if (Array.isArray(objeto.material)) {

                        objeto.material.forEach(
                            material => material.dispose()
                        );

                    } else {

                        objeto.material.dispose();

                    }
                }

            }
        );

        caracteristicasActuales = null;
    }


    // ------------------------------------------
    // TEXTURA
    // ------------------------------------------

    if (texturaActual) {
        texturaActual.dispose();
    }

    texturaActual = obtenerTextura(indice);

    texturaActual.wrapS =
        THREE.RepeatWrapping;

    texturaActual.wrapT =
        THREE.ClampToEdgeWrapping;

    texturaActual.needsUpdate = true;

    materialPlaneta.map = texturaActual;
    materialPlaneta.color.set(0xffffff);

    materialPlaneta.needsUpdate = true;


    // ------------------------------------------
    // ESCALA DEL PLANETA
    // ------------------------------------------

    grupoPlaneta.scale.set(
        datos.radioVisual,
        datos.radioVisual,
        datos.radioVisual
    );


    // ------------------------------------------
    // ROTACIÓN
    // ------------------------------------------

    grupoPlaneta.rotation.set(
        0,
        0,
        0
    );


    // Urano está inclinado
    if (indice === 6) {

        grupoPlaneta.rotation.z =
            THREE.MathUtils.degToRad(82);

    }


    // ------------------------------------------
    // CARACTERÍSTICAS
    // ------------------------------------------

    caracteristicasActuales =
        crearCaracteristicas(indice);

    grupoPlaneta.add(
        caracteristicasActuales
    );


    // ------------------------------------------
    // ATMÓSFERA
    // ------------------------------------------

    if (
        indice === 0 ||
        indice === 2 ||
        indice === 3
    ) {

        atmosfera.visible =
            indice === 2;

    } else {

        atmosfera.visible = true;

    }


    // ------------------------------------------
    // COLOR DE ATMÓSFERA
    // ------------------------------------------

    if (indice === 1) {

        atmosferaMaterial.color.set(
            0xffc46b
        );

    } else if (indice === 2) {

        atmosferaMaterial.color.set(
            0x6bbcff
        );

    } else if (indice === 6) {

        atmosferaMaterial.color.set(
            0x71e7ed
        );

    } else if (indice === 7) {

        atmosferaMaterial.color.set(
            0x4b82ff
        );

    } else {

        atmosferaMaterial.color.set(
            0xffffff
        );

    }


    // ------------------------------------------
    // TEXTO DEL CONTROL
    // ------------------------------------------

    if (valor) {

        valor.textContent =
            datos.nombre;

    }


    // ------------------------------------------
    // INFORMACIÓN EN CONSOLA
    // ------------------------------------------

    console.log(
        "PLANETA:",
        datos.nombre
    );

    console.log(
        "Masa:",
        datos.masa,
        "Tierras"
    );

    console.log(
        "Volumen:",
        datos.volumen,
        "Tierras"
    );

    console.log(
        "Densidad:",
        datos.densidad,
        "g/cm³"
    );

    console.log(
        "Gravedad:",
        datos.gravedad,
        "m/s²"
    );

    console.log(
        "Composición:",
        datos.composicion
    );
}


// ============================================================
// 22. CONTROL DESLIZANTE
// ============================================================

if (control) {
    control.min = 0;
    control.max = 7;
    control.step = 1;
    control.addEventListener("input", actualizarPlaneta);
}

const botonAnterior = document.getElementById("anterior");
const botonSiguiente = document.getElementById("siguiente");
if (botonAnterior) botonAnterior.addEventListener("click", () => {
    control.value = Math.max(0, Number(control.value) - 1);
    actualizarPlaneta();
});
if (botonSiguiente) botonSiguiente.addEventListener("click", () => {
    control.value = Math.min(7, Number(control.value) + 1);
    actualizarPlaneta();
});


// ============================================================
// 23. INICIAR
// ============================================================

actualizarPlaneta();


// ============================================================
// 24. AJUSTAR TAMAÑO
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
// 25. ANIMACIÓN
// ============================================================

function animar() {

    requestAnimationFrame(animar);


    // rotación de estrellas
    estrellas.rotation.y += 0.00015;


    // rotación del planeta
    grupoPlaneta.rotation.y += 0.0025;


    renderizador.render(
        escena,
        camara
    );
}

animar();