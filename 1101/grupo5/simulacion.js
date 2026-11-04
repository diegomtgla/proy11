// Three.js se carga desde index.html (three.min.js), así la página
// funciona aunque se abra con doble clic, sin servidor.

// =============================================
// INFORMACIÓN DE LOS CUERPOS CELESTES
// =============================================

const cuerpos = [
  {
    nombre: "Sol",
    tipo: "Estrella",
    diametro: "1.392.700 km",
    temperatura: "5.500 °C en la superficie",
    atmosfera: "Hidrógeno y helio",
    descripcion: "El Sol es la estrella central del Sistema Solar. Su actividad magnética produce fenómenos como las llamaradas solares y las eyecciones de masa coronal.",
    magnetismo: "Posee un campo magnético complejo y variable que cambia durante su ciclo de actividad.",
    origen: "Movimiento del plasma conductor en su interior.",
    intensidad: "Variable; presenta regiones de intensa actividad magnética.",
    viento: "El Sol emite continuamente un flujo de partículas cargadas llamado viento solar, que se desplaza por el Sistema Solar e interactúa con las magnetosferas planetarias.",
    curioso: "Su actividad magnética sigue un ciclo aproximado de 11 años.",
    color: 0xffa51e,
    radio: 2.0,
    campo: "sol"
  },
  {
    nombre: "Mercurio",
    tipo: "Planeta terrestre",
    diametro: "4.879 km",
    temperatura: "167 °C de temperatura media aproximada",
    atmosfera: "Exosfera muy tenue",
    descripcion: "Es el planeta más cercano al Sol y uno de los más pequeños del Sistema Solar.",
    magnetismo: "Tiene un campo magnético global débil, mucho menos intenso que el terrestre.",
    origen: "Dínamo asociado al núcleo metálico parcialmente líquido.",
    intensidad: "Aproximadamente el 1 % de la intensidad superficial ecuatorial terrestre.",
    viento: "Su magnetosfera es pequeña y permite que el viento solar interactúe con gran parte de su entorno.",
    curioso: "A pesar de su pequeño tamaño, conserva un campo magnético global.",
    color: 0x99938c,
    radio: 0.62,
    campo: "debil"
  },
  {
    nombre: "Venus",
    tipo: "Planeta terrestre",
    diametro: "12.104 km",
    temperatura: "464 °C aproximadamente",
    atmosfera: "Principalmente dióxido de carbono",
    descripcion: "Venus es un planeta rocoso con una atmósfera extremadamente densa y temperaturas superficiales muy elevadas.",
    magnetismo: "No posee un campo magnético global intrínseco como el de la Tierra.",
    origen: "No presenta una dínamo interna global activa detectada.",
    intensidad: "Sin campo magnético global propio.",
    viento: "El viento solar interactúa directamente con su ionosfera y puede generar una magnetosfera inducida.",
    curioso: "Aunque carece de un campo magnético global propio, su atmósfera interactúa con el viento solar.",
    color: 0xdba44e,
    radio: 0.95,
    campo: "ninguno"
  },
  {
    nombre: "Tierra",
    tipo: "Planeta terrestre",
    diametro: "12.742 km",
    temperatura: "15 °C de temperatura media aproximada",
    atmosfera: "Nitrógeno y oxígeno",
    descripcion: "Nuestro planeta posee una magnetosfera que interactúa con el viento solar y contribuye a proteger su entorno espacial.",
    magnetismo: "Tiene un campo magnético global con una estructura aproximadamente dipolar.",
    origen: "Efecto dínamo producido por el movimiento del hierro líquido en el núcleo externo.",
    intensidad: "Aproximadamente entre 25 y 65 microteslas en la superficie.",
    viento: "La magnetosfera desvía gran parte del viento solar alrededor del planeta, aunque algunas partículas pueden penetrar en regiones polares.",
    curioso: "Las auroras polares aparecen cuando partículas energéticas interactúan con la atmósfera.",
    color: 0x2689e8,
    radio: 1.0,
    campo: "fuerte"
  },
  {
    nombre: "Marte",
    tipo: "Planeta terrestre",
    diametro: "6.779 km",
    temperatura: "-65 °C de temperatura media aproximada",
    atmosfera: "Principalmente dióxido de carbono, muy delgada",
    descripcion: "Marte es un planeta rocoso que presenta restos de antiguos procesos magnéticos en su corteza.",
    magnetismo: "No tiene un campo magnético global dipolar actualmente, pero conserva regiones de magnetismo localizado en su corteza.",
    origen: "Magnetización remanente de antiguas rocas de su corteza.",
    intensidad: "Campos locales de intensidad variable.",
    viento: "El viento solar interactúa directamente con su ionosfera y contribuye a la pérdida de partículas atmosféricas.",
    curioso: "Sus regiones de corteza magnetizada son evidencia de un pasado con una dínamo global.",
    color: 0xc65d42,
    radio: 0.72,
    campo: "local"
  },
  {
    nombre: "Júpiter",
    tipo: "Gigante gaseoso",
    diametro: "139.820 km",
    temperatura: "-110 °C aproximadamente en las nubes",
    atmosfera: "Hidrógeno y helio",
    descripcion: "Es el planeta más grande del Sistema Solar y posee uno de los campos magnéticos planetarios más intensos.",
    magnetismo: "Posee una enorme magnetosfera y un campo magnético muy poderoso.",
    origen: "Movimiento de hidrógeno metálico líquido en su interior.",
    intensidad: "Aproximadamente 10 a 14 veces más intenso que el campo terrestre cerca de su ecuador.",
    viento: "Su gran magnetosfera interactúa con el viento solar y también con partículas procedentes de sus lunas.",
    curioso: "Su magnetosfera puede extenderse millones de kilómetros en dirección al Sol.",
    color: 0xc58b5b,
    radio: 1.75,
    campo: "muyfuerte"
  },
  {
    nombre: "Saturno",
    tipo: "Gigante gaseoso",
    diametro: "116.460 km",
    temperatura: "-140 °C aproximadamente en las nubes",
    atmosfera: "Hidrógeno y helio",
    descripcion: "Saturno es conocido por sus grandes anillos y su campo magnético global.",
    magnetismo: "Posee un campo magnético global muy organizado y casi alineado con su eje de rotación.",
    origen: "Dínamo generada por materiales conductores en su interior, incluido hidrógeno metálico.",
    intensidad: "Aproximadamente 580 veces menor que la intensidad superficial ecuatorial terrestre.",
    viento: "Su magnetosfera interactúa con el viento solar y con partículas provenientes de sus lunas y anillos.",
    curioso: "Su campo magnético está extraordinariamente alineado con su eje de rotación.",
    color: 0xd9bd83,
    radio: 1.55,
    campo: "fuerte",
    anillos: true
  },
  {
    nombre: "Urano",
    tipo: "Gigante helado",
    diametro: "50.724 km",
    temperatura: "-195 °C aproximadamente",
    atmosfera: "Hidrógeno, helio y metano",
    descripcion: "Urano es un gigante helado cuyo eje de rotación está muy inclinado respecto a su órbita.",
    magnetismo: "Su campo magnético está muy inclinado y desplazado respecto al centro del planeta.",
    origen: "Movimiento de materiales conductores en el interior, probablemente en capas de fluidos ricos en agua, amoníaco y otros compuestos.",
    intensidad: "Aproximadamente 50 veces menor que la intensidad superficial ecuatorial terrestre.",
    viento: "Su magnetosfera tiene una geometría irregular que cambia durante la rotación del planeta.",
    curioso: "Su eje de rotación está inclinado aproximadamente 98 grados.",
    color: 0x69c5d6,
    radio: 1.35,
    campo: "inclinado"
  },
  {
    nombre: "Neptuno",
    tipo: "Gigante helado",
    diametro: "49.244 km",
    temperatura: "-200 °C aproximadamente",
    atmosfera: "Hidrógeno, helio y metano",
    descripcion: "Neptuno es el planeta más lejano del Sol y presenta vientos atmosféricos extremadamente rápidos.",
    magnetismo: "Posee un campo magnético inclinado y desplazado respecto a su centro.",
    origen: "Dínamo generada por materiales conductores en su interior.",
    intensidad: "Aproximadamente 25 veces menor que la intensidad superficial ecuatorial terrestre.",
    viento: "Su magnetosfera interactúa con el viento solar y presenta una estructura irregular.",
    curioso: "Su campo magnético tiene una inclinación aproximada de 47 grados.",
    color: 0x2863cb,
    radio: 1.32,
    campo: "inclinado"
  }
];

// =============================================
// ESCENA 3D
// =============================================

const contenedor = document.getElementById("escena3d");

const escena = new THREE.Scene();
escena.background = new THREE.Color(0x050a19);

const camara = new THREE.PerspectiveCamera(
  45,
  contenedor.clientWidth / contenedor.clientHeight,
  0.1,
  100
);

// En pantallas angostas (celular) se aleja la cámara para que el planeta quepa
function ajustarDistanciaCamara() {
  const aspecto = contenedor.clientWidth / contenedor.clientHeight;
  camara.position.set(0, 0, aspecto < 1.2 ? 8.5 * 1.2 / aspecto : 8.5);
}

ajustarDistanciaCamara();

const renderizador = new THREE.WebGLRenderer({
  antialias: true
});

renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);

contenedor.appendChild(renderizador.domElement);

// =============================================
// ILUMINACIÓN
// =============================================

escena.add(new THREE.AmbientLight(0xffffff, 0.55));

const luz = new THREE.PointLight(0xffffff, 1.1);
luz.position.set(4, 4, 6);
escena.add(luz);

// =============================================
// ESTRELLAS DEL ESPACIO
// =============================================

const posicionesEstrellas = [];

for (let i = 0; i < 1200; i++) {
  posicionesEstrellas.push(
    (Math.random() - 0.5) * 35,
    (Math.random() - 0.5) * 35,
    (Math.random() - 0.5) * 20
  );
}

const geometriaEstrellas = new THREE.BufferGeometry();

geometriaEstrellas.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(posicionesEstrellas, 3)
);

const estrellas = new THREE.Points(
  geometriaEstrellas,
  new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.025
  })
);

escena.add(estrellas);

// =============================================
// TEXTURAS PROCEDURALES DE LOS PLANETAS
// =============================================

function crearTextura(planeta) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;

  const ctx = canvas.getContext("2d");

  const color = new THREE.Color(planeta.color);

  ctx.fillStyle = "#" + color.getHexString();
  ctx.fillRect(0, 0, 1024, 512);

  // Bandas atmosféricas de los gigantes gaseosos
  if (
    ["Júpiter", "Saturno", "Urano", "Neptuno"].includes(planeta.nombre)
  ) {
    for (let i = 0; i < 18; i++) {
      ctx.globalAlpha = 0.13 + Math.random() * 0.18;
      ctx.fillStyle = i % 2 === 0 ? "#ffffff" : "#252d42";
      ctx.fillRect(
        0,
        i * 30,
        1024,
        12 + Math.random() * 15
      );
    }
  }

  // Continentes aproximados de la Tierra
  if (planeta.nombre === "Tierra") {
    ctx.fillStyle = "#43a66c";
    ctx.globalAlpha = 0.9;

    for (let i = 0; i < 13; i++) {
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * 1024,
        Math.random() * 512,
        30 + Math.random() * 80,
        15 + Math.random() * 50,
        Math.random(),
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    ctx.globalAlpha = 1;

    ctx.fillStyle = "rgba(255,255,255,0.25)";
    for (let i = 0; i < 40; i++) {
      ctx.fillRect(
        Math.random() * 1024,
        Math.random() * 512,
        20 + Math.random() * 80,
        2 + Math.random() * 5
      );
    }
  }

  // Detalles superficiales de Marte
  if (planeta.nombre === "Marte") {
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = i % 2 ? "#9e402f" : "#e38a58";
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.arc(
        Math.random() * 1024,
        Math.random() * 512,
        3 + Math.random() * 22,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  return new THREE.CanvasTexture(canvas);
}

// =============================================
// CREAR CUERPO CELESTE
// =============================================

let cuerpoActual = null;
let indiceActual = 3;

function crearCuerpo(planeta) {
  const grupo = new THREE.Group();

  const geometria = new THREE.SphereGeometry(
    planeta.radio,
    64,
    64
  );

  const textura = crearTextura(planeta);

  const material = new THREE.MeshStandardMaterial({
    map: textura,
    color: 0xffffff,
    roughness: 0.9,
    emissive: planeta.nombre === "Sol" ? planeta.color : 0x000000,
    emissiveIntensity: planeta.nombre === "Sol" ? 0.8 : 0
  });

  const esfera = new THREE.Mesh(geometria, material);

  grupo.add(esfera);

  // Anillos de Saturno
  if (planeta.anillos) {
    const anillo = new THREE.Mesh(
      new THREE.RingGeometry(
        planeta.radio * 1.35,
        planeta.radio * 2.15,
        100
      ),
      new THREE.MeshStandardMaterial({
        color: 0xcab78e,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85
      })
    );

    anillo.rotation.x = Math.PI / 2.35;
    grupo.add(anillo);
  }

  // Corona del Sol
  if (planeta.nombre === "Sol") {
    const corona = new THREE.Mesh(
      new THREE.SphereGeometry(planeta.radio * 1.12, 48, 48),
      new THREE.MeshBasicMaterial({
        color: 0xffa52a,
        transparent: true,
        opacity: 0.18,
        side: THREE.BackSide
      })
    );

    grupo.add(corona);

    // Representación esquemática del viento solar
    const rayos = new THREE.Group();

    for (let i = 0; i < 32; i++) {
      const angulo = Math.random() * Math.PI * 2;
      const direccion = new THREE.Vector3(
        Math.cos(angulo),
        Math.sin(angulo),
        (Math.random() - 0.5) * 0.8
      ).normalize();

      const puntos = [
        direccion.clone().multiplyScalar(planeta.radio * 1.05),
        direccion.clone().multiplyScalar(planeta.radio * 2.0)
      ];

      const geo = new THREE.BufferGeometry().setFromPoints(puntos);

      const linea = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({
          color: 0xffc857,
          transparent: true,
          opacity: 0.5
        })
      );

      rayos.add(linea);
    }

    grupo.add(rayos);
  }

  // ===========================================
  // REPRESENTACIÓN DEL CAMPO MAGNÉTICO
  // ===========================================

  if (
    ["sol", "debil", "fuerte", "muyfuerte", "inclinado"].includes(planeta.campo)
  ) {
    const campo = new THREE.Group();

    const cantidad = planeta.campo === "muyfuerte" ? 12 : 8;

    for (let i = 0; i < cantidad; i++) {
      const puntos = [];

      for (let j = 0; j <= 100; j++) {
        const t = (j / 100) * Math.PI * 2;

        puntos.push(new THREE.Vector3(
          Math.cos(t) * planeta.radio * 1.8,
          Math.sin(t) * planeta.radio * (1.15 + i * 0.035),
          Math.sin(t * 2) * planeta.radio * 0.25
        ));
      }

      const geo = new THREE.BufferGeometry().setFromPoints(puntos);

      const linea = new THREE.Line(
        geo,
        new THREE.LineBasicMaterial({
          color: planeta.nombre === "Sol" ? 0xffc857 : 0x299dff,
          transparent: true,
          opacity: 0.55
        })
      );

      linea.rotation.y = (i / cantidad) * Math.PI;
      linea.rotation.x = (i / cantidad) * 0.8;

      campo.add(linea);
    }

    if (planeta.campo === "inclinado") {
      campo.rotation.z = 0.8;
      campo.rotation.x = 0.5;
    }

    grupo.add(campo);
  }

  // Magnetismo localizado de Marte
  if (planeta.campo === "local") {
    for (let i = 0; i < 4; i++) {
      const puntos = [];

      for (let j = 0; j <= 40; j++) {
        const t = j / 40 * Math.PI;

        puntos.push(new THREE.Vector3(
          Math.cos(t) * planeta.radio * 1.15,
          planeta.radio * 0.3 + Math.sin(t) * planeta.radio * 0.4,
          0.1
        ));
      }

      const geo = new THREE.BufferGeometry().setFromPoints(puntos);

      grupo.add(
        new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({
            color: 0x299dff,
            transparent: true,
            opacity: 0.6
          })
        )
      );
    }
  }

  return grupo;
}

// =============================================
// CAMBIAR PLANETA Y ACTUALIZAR INFORMACIÓN
// =============================================

function seleccionarCuerpo(indice) {
  indiceActual = Math.max(0, Math.min(8, indice));

  const planeta = cuerpos[indiceActual];

  if (cuerpoActual) {
    escena.remove(cuerpoActual);
  }

  cuerpoActual = crearCuerpo(planeta);
  escena.add(cuerpoActual);

  document.getElementById("nombre-cuerpo").textContent =
    planeta.nombre;

  document.getElementById("info-nombre").textContent =
    planeta.nombre;

  document.getElementById("info-descripcion").textContent =
    planeta.descripcion;

  document.getElementById("info-tipo").textContent =
    planeta.tipo;

  document.getElementById("info-diametro").textContent =
    planeta.diametro;

  document.getElementById("info-temperatura").textContent =
    planeta.temperatura;

  document.getElementById("info-atmosfera").textContent =
    planeta.atmosfera;

  document.getElementById("info-magnetismo").textContent =
    planeta.magnetismo;

  document.getElementById("info-origen").textContent =
    planeta.origen;

  document.getElementById("info-intensidad").textContent =
    planeta.intensidad;

  document.getElementById("info-viento").textContent =
    planeta.viento;

  document.getElementById("info-curioso").textContent =
    planeta.curioso;

  document.getElementById("contador-planeta").textContent =
    `${indiceActual + 1} / 9`;

  document.getElementById("deslizador-planetas").value =
    indiceActual;
}

// =============================================
// BOTONES Y DESLIZADOR
// =============================================

document.getElementById("anterior").addEventListener("click", () => {
  seleccionarCuerpo((indiceActual + 8) % 9);
});

document.getElementById("siguiente").addEventListener("click", () => {
  seleccionarCuerpo((indiceActual + 1) % 9);
});

document.getElementById("deslizador-planetas").addEventListener(
  "input",
  (evento) => {
    seleccionarCuerpo(Number(evento.target.value));
  }
);

// =============================================
// ANIMACIÓN Y ROTACIÓN
// =============================================

const reloj = new THREE.Clock();

function animar() {
  requestAnimationFrame(animar);

  const tiempo = reloj.getDelta();

  if (cuerpoActual) {
    cuerpoActual.rotation.y += tiempo * 0.12;
  }

  estrellas.rotation.y += tiempo * 0.003;

  renderizador.render(escena, camara);
}

seleccionarCuerpo(indiceActual);
animar();

// =============================================
// AJUSTE DE TAMAÑO DE LA VENTANA
// =============================================

window.addEventListener("resize", () => {
  const ancho = contenedor.clientWidth;
  const alto = contenedor.clientHeight;

  camara.aspect = ancho / alto;
  camara.updateProjectionMatrix();
  ajustarDistanciaCamara();

  renderizador.setSize(ancho, alto);
});

