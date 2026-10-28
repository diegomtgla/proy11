
(() => {
  const canvas = document.getElementById("lienzo");
  const control = document.getElementById("control");
  const valor = document.getElementById("valor");
  const etapaTexto = document.getElementById("etapa-estrella");
  const descripcionEtapa = document.getElementById("descripcion-etapa");

  if (!canvas || !control || !valor) {
    console.error("No se encontraron los elementos de la simulación.");
    return;
  }

  if (typeof THREE === "undefined") {
    etapaTexto.textContent = "No se pudo cargar la simulación";
    descripcionEtapa.textContent =
      "Comprueba tu conexión a internet para cargar la biblioteca Three.js.";
    return;
  }

  const escena = new THREE.Scene();
  escena.background = new THREE.Color(0x090614);

  const camara = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camara.position.z = 4.5;

  const renderizador = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });

  renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // Esfera que representa la estrella.
  const geometria = new THREE.SphereGeometry(1, 64, 48);
  const material = new THREE.MeshPhongMaterial({
    color: 0x438cff,
    shininess: 80,
    emissive: 0x101030
  });

  const estrella = new THREE.Mesh(geometria, material);
  escena.add(estrella);

  // Halo exterior decorativo.
  const geometriaHalo = new THREE.SphereGeometry(1.13, 48, 32);
  const materialHalo = new THREE.MeshBasicMaterial({
    color: 0x7546ff,
    transparent: true,
    opacity: 0.10,
    side: THREE.BackSide
  });

  const halo = new THREE.Mesh(geometriaHalo, materialHalo);
  estrella.add(halo);

  // Iluminación.
  escena.add(new THREE.AmbientLight(0xffffff, 0.65));

  const luz = new THREE.PointLight(0xffffff, 2);
  luz.position.set(3, 3, 4);
  escena.add(luz);

  const luzRelleno = new THREE.PointLight(0x7040ff, 1);
  luzRelleno.position.set(-3, -1, 2);
  escena.add(luzRelleno);

  function actualizarSimulacion() {
    const edad = Number(control.value);
    const progreso = (edad - 1) / 49;

    valor.textContent = edad;

    // Escala visual gradual, sin hacer desaparecer la estrella.
    const escala = 0.65 + progreso * 0.65;
    estrella.scale.setScalar(escala);

    // Evolución visual del azul hacia el rojo.
    const tono = THREE.MathUtils.lerp(0.61, 0.015, progreso);
    material.color.setHSL(tono, 0.85, 0.55);
    material.emissive.setHSL(tono, 0.8, 0.12);
    materialHalo.color.setHSL(tono, 0.8, 0.55);

    // Descripciones educativas de la escala representada.
    if (progreso < 0.25) {
      etapaTexto.textContent = "Etapa inicial";
      descripcionEtapa.textContent =
        "La estrella se representa con tonos azulados. En una estrella real, su evolución depende de su masa, temperatura y composición.";
    } else if (progreso < 0.60) {
      etapaTexto.textContent = "Estrella en evolución";
      descripcionEtapa.textContent =
        "El modelo aumenta de tamaño y cambia de color para representar visualmente el avance de la evolución estelar.";
    } else if (progreso < 0.85) {
      etapaTexto.textContent = "Etapa avanzada";
      descripcionEtapa.textContent =
        "Los tonos cálidos y el mayor tamaño simbolizan una posible fase avanzada. Las estrellas no evolucionan todas de la misma manera.";
    } else {
      etapaTexto.textContent = "Fase final representada";
      descripcionEtapa.textContent =
        "Esta última parte de la escala es ilustrativa. El destino real de la estrella depende principalmente de su masa inicial.";
    }
  }

  function ajustarTamano() {
    const ancho = canvas.clientWidth;
    const alto = canvas.clientHeight;

    if (!ancho || !alto) return;

    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
    renderizador.setSize(ancho, alto, false);
  }

  function animar() {
    requestAnimationFrame(animar);

    estrella.rotation.y += 0.006;
    estrella.rotation.x += 0.002;

    renderizador.render(escena, camara);
  }

  control.addEventListener("input", actualizarSimulacion);
  window.addEventListener("resize", ajustarTamano);

  if ("ResizeObserver" in window) {
    const observador = new ResizeObserver(ajustarTamano);
    observador.observe(canvas);
  }

  actualizarSimulacion();
  ajustarTamano();
  animar();
})();
