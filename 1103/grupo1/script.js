/* SIMULACIÓN EDUCATIVA DE FORMACIÓN ESTELAR
   Requiere que Three.js esté cargado en el HTML. */
(() => {
  "use strict";

  const lienzo = document.getElementById("lienzo");
  if (!lienzo || !window.THREE) {
    if (lienzo) lienzo.insertAdjacentHTML("afterend",
      '<p class="nota-simulacion">No se pudo cargar la biblioteca 3D. Comprueba tu conexión a internet y vuelve a cargar la página.</p>');
    return;
  }

  const THREE = window.THREE;
  const escena = new THREE.Scene();
  escena.background = new THREE.Color(0x030510);

  const camara = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camara.position.set(0, 2, 13);
  camara.lookAt(0, 0, 0);

  const renderizador = new THREE.WebGLRenderer({ canvas: lienzo, antialias: true });
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  escena.add(new THREE.AmbientLight(0x526080, 0.7));
  const luzEstelar = new THREE.PointLight(0xffa640, 0, 30);
  escena.add(luzEstelar);

  /* Estrellas de fondo */
  const geometriaFondo = new THREE.BufferGeometry();
  const posicionesFondo = [];
  for (let i = 0; i < 500; i++) {
    posicionesFondo.push(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 35,
      (Math.random() - 0.5) * 20 - 5
    );
  }
  geometriaFondo.setAttribute("position", new THREE.Float32BufferAttribute(posicionesFondo, 3));
  const estrellasFondo = new THREE.Points(
    geometriaFondo,
    new THREE.PointsMaterial({ color: 0xc4d8ff, size: 0.055, transparent: true, opacity: 0.8 })
  );
  escena.add(estrellasFondo);

  /* Nube molecular */
  const nube = new THREE.Group();
  escena.add(nube);
  const cantidadParticulas = 1800;
  const datosParticulas = [];
  const geometriaNube = new THREE.BufferGeometry();
  const posicionesNube = [];
  const coloresNube = [];

  for (let i = 0; i < cantidadParticulas; i++) {
    const radio = 2.2 + Math.random() * 3.2;
    const theta = Math.random() * Math.PI * 2;
    const cosPhi = Math.random() * 2 - 1;
    const sinPhi = Math.sqrt(1 - cosPhi * cosPhi);
    const x = radio * sinPhi * Math.cos(theta);
    const y = radio * cosPhi;
    const z = radio * sinPhi * Math.sin(theta);

    datosParticulas.push({
      x, y, z,
      fase: Math.random() * Math.PI * 2,
      velocidad: 0.5 + Math.random() * 1.5
    });
    posicionesNube.push(x, y, z);

    const color = new THREE.Color();
    color.setHSL(0.60 + Math.random() * 0.15, 0.65, 0.45 + Math.random() * 0.3);
    coloresNube.push(color.r, color.g, color.b);
  }

  geometriaNube.setAttribute("position", new THREE.Float32BufferAttribute(posicionesNube, 3));
  geometriaNube.setAttribute("color", new THREE.Float32BufferAttribute(coloresNube, 3));
  const materialNube = new THREE.PointsMaterial({
    size: 0.075, vertexColors: true, transparent: true, opacity: 0.9,
    sizeAttenuation: true, depthWrite: false
  });
  nube.add(new THREE.Points(geometriaNube, materialNube));

  /* Disco de gas */
  const disco = new THREE.Mesh(
    new THREE.RingGeometry(1.1, 3.3, 100),
    new THREE.MeshBasicMaterial({
      color: 0x9b63ff, side: THREE.DoubleSide,
      transparent: true, opacity: 0, depthWrite: false
    })
  );
  disco.rotation.x = Math.PI * 0.36;
  escena.add(disco);

  /* Protoestrella y corona */
  const nucleo = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0xff6a22 })
  );
  escena.add(nucleo);

  const corona = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xff9b36, transparent: true, opacity: 0.15,
      blending: THREE.AdditiveBlending, depthWrite: false
    })
  );
  escena.add(corona);

  let progreso = 0;
  let velocidadSimulacion = 0.08;
  let pausada = true;

  const botonIniciar = document.getElementById("iniciar");
  const botonPausa = document.getElementById("pausar");
  const botonReiniciar = document.getElementById("reiniciar");
  const controlVelocidad = document.getElementById("velocidad");
  const valorVelocidad = document.getElementById("valorVelocidad");
  const indicador = document.getElementById("etapa");
  const barra = document.getElementById("progreso");
  const barraAccesible = document.getElementById("barraAccesible");
  const explicacion = document.getElementById("explicacion");

  const descripciones = [
    "Una nube de gas y polvo comienza a contraerse por efecto de la gravedad.",
    "La gravedad concentra el material y la nube se vuelve más densa; el gas también empieza a organizarse en un disco.",
    "En el centro se forma una protoestrella. La materia continúa acumulándose y aumenta la temperatura del núcleo.",
    "La estrella aparece más brillante en esta representación. En una estrella real, el inicio estable de la fusión depende de alcanzar las condiciones físicas necesarias."
  ];

  function actualizarInterfaz() {
    let numeroEtapa = 0;
    if (progreso >= 0.85) numeroEtapa = 3;
    else if (progreso >= 0.5) numeroEtapa = 2;
    else if (progreso >= 0.2) numeroEtapa = 1;

    const nombres = [
      "1. Nebulosa molecular",
      "2. Contracción gravitatoria",
      "3. Protoestrella",
      "4. Estrella formada"
    ];
    indicador.textContent = nombres[numeroEtapa];
    explicacion.textContent = descripciones[numeroEtapa];
    barra.style.width = (progreso * 100) + "%";
    barraAccesible.setAttribute("aria-valuenow", String(Math.round(progreso * 100)));
    botonPausa.textContent = pausada ? "Reanudar" : "Pausar";
  }

  botonIniciar.addEventListener("click", () => {
    pausada = false;
    actualizarInterfaz();
  });

  botonPausa.addEventListener("click", () => {
    pausada = !pausada;
    actualizarInterfaz();
  });

  botonReiniciar.addEventListener("click", () => {
    progreso = 0;
    pausada = true;
    actualizarInterfaz();
  });

  controlVelocidad.addEventListener("input", () => {
    velocidadSimulacion = Number(controlVelocidad.value);
    valorVelocidad.textContent = velocidadSimulacion.toFixed(2);
  });

  function actualizarFormacion(delta) {
    if (!pausada) progreso = Math.min(1, progreso + delta * velocidadSimulacion * 0.08);

    const contraccion = 1 - progreso * 0.82;
    const posiciones = geometriaNube.attributes.position.array;
    const tiempo = performance.now() * 0.001;

    for (let i = 0; i < datosParticulas.length; i++) {
      const p = datosParticulas[i];
      const movimiento = Math.sin(tiempo * p.velocidad + p.fase) * 0.025 * (1 - progreso);
      posiciones[i * 3] = p.x * contraccion + movimiento;
      posiciones[i * 3 + 1] = p.y * contraccion +
        Math.cos(tiempo * p.velocidad + p.fase) * 0.025 * (1 - progreso);
      posiciones[i * 3 + 2] = p.z * contraccion + movimiento;
    }
    geometriaNube.attributes.position.needsUpdate = true;
    materialNube.opacity = 0.9 - progreso * 0.35;
    disco.material.opacity = Math.min(0.65, Math.max(0, (progreso - 0.15) * 1.0));

    const tamanoNucleo = 0.15 + progreso * 0.8;
    nucleo.scale.setScalar(tamanoNucleo);
    corona.scale.setScalar(tamanoNucleo * 1.6);

    const colorNucleo = new THREE.Color();
    if (progreso < 0.55) {
      colorNucleo.setRGB(1, 0.22 + progreso, 0.04);
    } else {
      const mezcla = (progreso - 0.55) / 0.45;
      colorNucleo.setRGB(1, 0.52 + mezcla * 0.43, 0.04 + mezcla * 0.78);
    }
    nucleo.material.color.copy(colorNucleo);
    corona.material.color.copy(colorNucleo);
    luzEstelar.color.copy(colorNucleo);
    luzEstelar.intensity = progreso * 3.5;
    corona.material.opacity = 0.12 + progreso * 0.25;

    disco.rotation.z += delta * 0.25;
    nube.rotation.y += delta * 0.035;
    actualizarInterfaz();
  }

  function ajustarTamano() {
    const ancho = lienzo.clientWidth;
    const alto = lienzo.clientHeight;
    if (ancho <= 0 || alto <= 0) return;
    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();
    renderizador.setSize(ancho, alto, false);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  }

  window.addEventListener("resize", ajustarTamano);
  if ("ResizeObserver" in window) new ResizeObserver(ajustarTamano).observe(lienzo);
  ajustarTamano();
  actualizarInterfaz();

  const reloj = new THREE.Clock();
  function animar() {
    requestAnimationFrame(animar);
    const delta = Math.min(reloj.getDelta(), 0.05);
    actualizarFormacion(delta);
    luzEstelar.position.set(0, 0, 0);
    renderizador.render(escena, camara);
  }
  animar();
})();
