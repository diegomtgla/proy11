// ============================================================
// Simulación 3D de un sistema planetario + clasificador
// ============================================================

// Clasificador de exoplanetas
const planetas = {
  a: {
    nombre: "Planeta A",
    datos: "0,95 Tierras · rocoso · 18 °C · órbita moderada",
    tipo: "🌎 Similar a la Tierra",
    explicacion: "Su tamaño es cercano al terrestre y es rocoso. Las condiciones del modelo son moderadas, por lo que resulta interesante para estudiar."
  },
  b: {
    nombre: "Planeta B",
    datos: "1,7 Tierras · rocoso · 30 °C · órbita moderada",
    tipo: "🪨 Supertierra",
    explicacion: "Es mayor que la Tierra, pero está dentro del rango usado para describir supertierras. Ser una supertierra no significa automáticamente que sea habitable."
  },
  c: {
    nombre: "Planeta C",
    datos: "1,05 Júpiteres · gaseoso · 1.100 °C · órbita muy cercana",
    tipo: "🔥 Júpiter caliente",
    explicacion: "Es un gigante gaseoso muy cercano a su estrella y con una temperatura extremadamente alta: características típicas de un Júpiter caliente."
  },
  d: {
    nombre: "Planeta D",
    datos: "8 Tierras · composición incierta · 450 °C · órbita cercana",
    tipo: "🪨 Supertierra / caso de análisis",
    explicacion: "Su masa está dentro del rango que puede incluir supertierras, pero su composición y condiciones muestran por qué una clasificación sencilla no basta para conocer su naturaleza."
  }
};

function mostrarPlaneta(id) {
  const p = planetas[id];
  const resultado = document.getElementById("resultado");
  if (!p || !resultado) return;

  resultado.innerHTML = `
    <p class="mini-titulo">${p.nombre}</p>
    <h3>${p.tipo}</h3>
    <p><strong>Datos:</strong> ${p.datos}</p>
    <p>${p.explicacion}</p>
  `;
  resultado.scrollIntoView({ behavior: "smooth", block: "center" });
}

// Simulación Three.js: estrella, planeta, anillo y estrellas de fondo
(() => {
  const canvas = document.getElementById("lienzo");
  const control = document.getElementById("control");
  const valor = document.getElementById("valor");

  // Si el navegador no admite WebGL o Three.js no cargó, se informa sin romper la página.
  if (!canvas || !control || !valor || typeof THREE === "undefined") {
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = Math.max(canvas.clientWidth, 300);
        canvas.height = Math.max(canvas.clientHeight, 260);
        ctx.fillStyle = "#080d21";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffc857";
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("La simulación 3D necesita conexión para cargar Three.js.", canvas.width / 2, canvas.height / 2);
      }
    }
    return;
  }

  const escena = new THREE.Scene();
  escena.background = new THREE.Color(0x080d21);

  const camara = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camara.position.set(0, 0, 10);

  const renderizador = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false
  });
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  function ajustarTamano() {
    const ancho = Math.max(canvas.clientWidth, 1);
    const alto = Math.max(canvas.clientHeight, 1);
    renderizador.setSize(ancho, alto, false);
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
  }
  ajustarTamano();

  // Estrella central
  const estrella = new THREE.Mesh(
    new THREE.SphereGeometry(1.25, 40, 40),
    new THREE.MeshBasicMaterial({ color: 0xffe6a8 })
  );
  escena.add(estrella);

  // Halo suave
  const brillo = new THREE.Mesh(
    new THREE.SphereGeometry(1.58, 40, 40),
    new THREE.MeshBasicMaterial({
      color: 0xffb7d5,
      transparent: true,
      opacity: 0.15,
      depthWrite: false
    })
  );
  escena.add(brillo);

  // Planeta y anillo
  const planeta = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0xb89cff,
      roughness: 0.7,
      metalness: 0.02
    })
  );
  planeta.position.set(-4.6, 0, 1);
  escena.add(planeta);

  const anillo = new THREE.Mesh(
    new THREE.RingGeometry(0.7, 0.85, 48),
    new THREE.MeshBasicMaterial({
      color: 0xffb6d9,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    })
  );
  anillo.rotation.x = Math.PI / 2;
  planeta.add(anillo);

  // Iluminación
  const luzEstrella = new THREE.PointLight(0xffd6a5, 2.4, 25);
  luzEstrella.position.set(0, 0, 2);
  escena.add(luzEstrella);
  escena.add(new THREE.AmbientLight(0xc8a2ff, 0.55));

  // Fondo estrellado
  const colores = [0xffffff, 0xffd6ec, 0xfff0b8, 0xdcc8ff];
  for (let i = 0; i < 110; i++) {
    const puntito = new THREE.Mesh(
      new THREE.SphereGeometry(Math.random() * 0.025 + 0.012, 8, 8),
      new THREE.MeshBasicMaterial({
        color: colores[Math.floor(Math.random() * colores.length)]
      })
    );
    puntito.position.set(
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 8,
      -2 - Math.random() * 2
    );
    escena.add(puntito);
  }

  function actualizarTamanoPlaneta() {
    const tamano = Number(control.value) / 50;
    planeta.scale.setScalar(tamano);
    valor.textContent = control.value;
  }
  control.addEventListener("input", actualizarTamanoPlaneta);
  actualizarTamanoPlaneta();

  function animar() {
    requestAnimationFrame(animar);
    const tiempo = Date.now() * 0.001;

    planeta.position.x += 0.018;
    planeta.position.y = Math.sin(tiempo) * 0.13;
    planeta.rotation.y += 0.01;
    anillo.rotation.z += 0.005;

    if (planeta.position.x > 4.8) {
      planeta.position.x = -4.8;
    }

    const pulso = 1 + Math.sin(tiempo * 2) * 0.025;
    estrella.scale.setScalar(pulso);
    brillo.scale.setScalar(pulso);

    renderizador.render(escena, camara);
  }

  window.addEventListener("resize", ajustarTamano);
  // ResizeObserver mejora el ajuste si cambia el ancho del contenedor sin redimensionar la ventana.
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(ajustarTamano);
    observer.observe(canvas);
  }

  animar();
})();
