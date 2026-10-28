// Simulación educativa de atmósferas de exoplanetas con Three.js r128
(() => {
  const canvas = document.getElementById("lienzo-sim");
  if (!canvas || !window.THREE) {
    const desc = document.getElementById("descripcion");
    if (desc) desc.textContent = "No se pudo cargar Three.js. Revisa tu conexión a internet.";
    return;
  }

  const escena = new THREE.Scene();
  escena.background = new THREE.Color(0x020817);
  const camara = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camara.position.set(0, 0, 8.8);
  camara.lookAt(0, 0, 0);

  const renderizador = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderizador.setClearColor(0x020817, 1);

  escena.add(new THREE.AmbientLight(0x789bd4, 1.4));
  const luz = new THREE.PointLight(0xffb45c, 3, 30);
  luz.position.set(-4, 1, 4);
  escena.add(luz);

  // Fondo estrellado
  const starPositions = [];
  for (let i = 0; i < 850; i++) {
    starPositions.push((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 13, -3 - Math.random() * 10);
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
  const stars = new THREE.Points(starGeometry, new THREE.PointsMaterial({ color: 0xc4ddff, size: 0.025, transparent: true, opacity: 0.85 }));
  escena.add(stars);

  // Estrella y su halo
  const star = new THREE.Mesh(new THREE.SphereGeometry(0.72, 40, 40), new THREE.MeshBasicMaterial({ color: 0xffc45c }));
  star.position.set(-3.15, 0.25, 0);
  escena.add(star);
  const starHalo = new THREE.Mesh(new THREE.SphereGeometry(0.91, 32, 32), new THREE.MeshBasicMaterial({ color: 0xff8c32, transparent: true, opacity: 0.18, side: THREE.BackSide }));
  starHalo.position.copy(star.position);
  escena.add(starHalo);

  // Planeta y atmósfera
  const planetGroup = new THREE.Group();
  planetGroup.position.set(0.65, 0, 0);
  escena.add(planetGroup);
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(1.55, 64, 64),
    new THREE.MeshStandardMaterial({ color: 0x367bd7, roughness: 0.65, metalness: 0.03, emissive: 0x071a45, emissiveIntensity: 0.5 })
  );
  planetGroup.add(planet);
  const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.68, 64, 64),
    new THREE.MeshBasicMaterial({ color: 0x39bfff, transparent: true, opacity: 0.2, side: THREE.BackSide, depthWrite: false })
  );
  planetGroup.add(atmosphere);

  // Líneas decorativas suaves sobre el planeta
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.8, 0.012, 8, 120),
    new THREE.MeshBasicMaterial({ color: 0x6edaff, transparent: true, opacity: 0.4 })
  );
  ring.rotation.x = 1.15;
  ring.rotation.y = 0.15;
  planetGroup.add(ring);

  // Partículas con colores ilustrativos para cada grupo de gases
  const gasColors = [0x3295ff, 0x35e08a, 0xffbd42, 0xff397c, 0x9b8cff];
  const gasGroups = [];
  gasColors.forEach((color, index) => {
    const positions = [];
    for (let i = 0; i < 100; i++) {
      const a = Math.random() * Math.PI * 2;
      const z = Math.random() * 2 - 1;
      const r = 1.72 + Math.random() * 0.48;
      const planar = Math.sqrt(1 - z * z);
      positions.push(Math.cos(a) * planar * r, Math.sin(a) * planar * r, z * r);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    const points = new THREE.Points(geo, new THREE.PointsMaterial({ color, size: 0.045, transparent: true, opacity: 0.8, depthWrite: false }));
    planetGroup.add(points);
    gasGroups.push(points);
  });

  // Haz de luz que representa de forma esquemática la observación
  const rayGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-2.45, 0.25, 0),
    new THREE.Vector3(-1.5, 0.25, 0),
    new THREE.Vector3(-0.95, 0.25, 0)
  ]);
  escena.add(new THREE.Line(rayGeo, new THREE.LineBasicMaterial({ color: 0x66dfff, transparent: true, opacity: 0.85 })));

  const typeSelect = document.getElementById("tipo-planeta");
  const tempControl = document.getElementById("temperatura");
  const gasDefs = [
    { id: "agua", name: "Vapor de agua" },
    { id: "co2", name: "Dióxido de carbono" },
    { id: "metano", name: "Metano" },
    { id: "monoxido", name: "Monóxido de carbono" },
    { id: "otros", name: "Otros gases" }
  ];
  const planetColors = { jupiter: 0x367bd7, neptuno: 0x287de0, rocoso: 0xa96548 };
  const initialValues = { agua: 40, co2: 20, metano: 10, monoxido: 10, otros: 20 };

  function updateSimulation() {
    const temp = Number(tempControl.value);
    document.getElementById("valor-temperatura").textContent = temp;
    const values = gasDefs.map(g => {
      const value = Number(document.getElementById(g.id).value);
      document.getElementById("valor-" + g.id).textContent = value + "%";
      return { ...g, value };
    });
    const total = values.reduce((sum, g) => sum + g.value, 0);
    const normalized = total ? values.map(g => ({ ...g, relative: g.value / total * 100 })) : values.map(g => ({ ...g, relative: 0 }));

    planet.material.color.setHex(planetColors[typeSelect.value]);
    planet.material.emissiveIntensity = 0.25 + temp / 2500;
    atmosphere.material.color.setHex(temp > 1400 ? 0xff7549 : temp > 800 ? 0x39bfff : 0x698dff);
    atmosphere.material.opacity = total === 0 ? 0.06 : 0.12 + Math.min(total, 100) / 400;
    gasGroups.forEach((group, i) => {
      const gas = normalized[i];
      group.visible = gas.relative > 0;
      group.material.opacity = Math.min(1, gas.relative / 20 + 0.15);
      group.material.size = 0.025 + Math.min(gas.relative, 50) / 900;
    });

    const desc = typeSelect.value === "jupiter"
      ? "Este modelo representa un gigante gaseoso. La luz de la estrella atraviesa esquemáticamente sus capas atmosféricas."
      : typeSelect.value === "neptuno"
        ? "Este modelo representa un planeta tipo Neptuno. Su aspecto es ilustrativo y no corresponde a una observación real."
        : "Este modelo representa un planeta rocoso. Su color cambia para diferenciar visualmente esta categoría.";
    document.getElementById("descripcion").textContent = desc;

    const dominant = [...normalized].sort((a, b) => b.relative - a.relative)[0];
    let result;
    if (total === 0) {
      result = "Todos los componentes están en cero. Aumenta algún control para explorar una mezcla atmosférica.";
    } else {
      result = "El componente relativo más abundante es " + dominant.name + " (" + dominant.relative.toFixed(1) +
        "% de los valores seleccionados). Temperatura configurada: " + temp +
        " K. La temperatura y estos valores no permiten predecir por sí solos qué moléculas detectaría el JWST.";
    }
    document.getElementById("resultado-sim").textContent = result;
  }

  typeSelect.addEventListener("change", updateSimulation);
  tempControl.addEventListener("input", updateSimulation);
  gasDefs.forEach(g => document.getElementById(g.id).addEventListener("input", updateSimulation));
  document.getElementById("reiniciar").addEventListener("click", () => {
    typeSelect.value = "jupiter";
    tempControl.value = 1200;
    gasDefs.forEach(g => { document.getElementById(g.id).value = initialValues[g.id]; });
    updateSimulation();
  });

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderizador.setSize(width, height, false);
    camara.aspect = width / height;
    camara.updateProjectionMatrix();
  }
  if ("ResizeObserver" in window) {
    new ResizeObserver(resize).observe(canvas);
  } else {
    window.addEventListener("resize", resize);
  }

  function animate() {
    requestAnimationFrame(animate);
    planet.rotation.y += 0.0025;
    planet.rotation.x += 0.0004;
    atmosphere.rotation.y -= 0.001;
    gasGroups.forEach((group, i) => { group.rotation.y += 0.001 + i * 0.00025; });
    stars.rotation.z += 0.000025;
    renderizador.render(escena, camara);
  }

  // Clasificador educativo existente
  const planets = {
    a: { nombre: "Planeta A", datos: "0,95 Tierras · rocoso · 18 °C · órbita moderada", tipo: "🌎 Similar a la Tierra", explicacion: "Su tamaño es cercano al terrestre y es rocoso. Las condiciones del modelo son moderadas, por lo que resulta interesante para estudiar." },
    b: { nombre: "Planeta B", datos: "1,7 Tierras · rocoso · 30 °C · órbita moderada", tipo: "🪨 Supertierra", explicacion: "Es mayor que la Tierra y está dentro del rango usado para describir supertierras. Ser una supertierra no significa automáticamente que sea habitable." },
    c: { nombre: "Planeta C", datos: "1,05 Júpiteres · gaseoso · 1.100 °C · órbita muy cercana", tipo: "🔥 Júpiter caliente", explicacion: "Es un gigante gaseoso muy cercano a su estrella y con una temperatura muy alta: características típicas de un Júpiter caliente." },
    d: { nombre: "Planeta D", datos: "8 Tierras · composición incierta · 450 °C · órbita cercana", tipo: "🪨 Supertierra / caso de análisis", explicacion: "Su masa está en un rango que puede incluir supertierras, pero su composición y condiciones muestran por qué una clasificación sencilla no basta para conocer su naturaleza." }
  };
  window.mostrarPlaneta = function(id) {
    const p = planets[id];
    document.getElementById("resultado").innerHTML =
      `<p class="mini-titulo">${p.nombre}</p><h3>${p.tipo}</h3><p><strong>Datos:</strong> ${p.datos}</p><p>${p.explicacion}</p>`;
    document.getElementById("resultado").scrollIntoView({ behavior: "smooth", block: "center" });
  };

  updateSimulation();
  resize();
  animate();
})();
