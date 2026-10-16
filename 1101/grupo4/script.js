
/* ============================================================
   SIMULACIÓN 3D DE SATÉLITES ALREDEDOR DE UN PLANETA
   Three.js r128
   ============================================================ */

// 1. COMPROBAR QUE THREE.JS ESTÉ CARGADO

if (typeof THREE === "undefined") {
  console.error(
    "Three.js no se ha cargado. Revisa la conexión a internet."
  );
} else {

  // 2. ELEMENTOS HTML

  const canvas = document.getElementById("lienzo");
  const control = document.getElementById("control");
  const valor = document.getElementById("valor");

  if (!canvas || !control || !valor) {
    throw new Error(
      "No se encontraron los elementos de la simulación en el HTML."
    );
  }

  // 3. ESCENA

  const escena = new THREE.Scene();
  escena.background = new THREE.Color(0x000308);

  // 4. CÁMARA

  const camara = new THREE.PerspectiveCamera(
    45,
    1,
    0.1,
    1000
  );

  camara.position.set(0, 2, 9);
  camara.lookAt(0, 0, 0);

  // 5. RENDERIZADOR

  const renderizador = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false
  });

  renderizador.setPixelRatio(
    Math.min(window.devicePixelRatio || 1, 2)
  );

  // 6. AJUSTAR EL TAMAÑO DEL CANVAS

  function ajustarTamano() {
    const ancho = Math.max(canvas.clientWidth, 1);
    const alto = Math.max(canvas.clientHeight, 1);

    camara.aspect = ancho / alto;
    camara.updateProjectionMatrix();

    renderizador.setSize(ancho, alto, false);
  }

  window.addEventListener("resize", ajustarTamano);

  ajustarTamano();

  // 7. FONDO DE ESTRELLAS

  const estrellasGeometria = new THREE.BufferGeometry();
  const posicionesEstrellas = [];

  for (let i = 0; i < 1000; i++) {
    const radio = 30 + Math.random() * 50;

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const x =
      radio * Math.sin(phi) * Math.cos(theta);

    const y =
      radio * Math.sin(phi) * Math.sin(theta);

    const z = radio * Math.cos(phi);

    posicionesEstrellas.push(x, y, z);
  }

  estrellasGeometria.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      posicionesEstrellas,
      3
    )
  );

  const estrellasMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08
  });

  const estrellas = new THREE.Points(
    estrellasGeometria,
    estrellasMaterial
  );

  escena.add(estrellas);

  // 8. PLANETA

  const planetaGeometria = new THREE.SphereGeometry(
    1.7,
    64,
    64
  );

  const planetaMaterial = new THREE.MeshBasicMaterial({
    color: 0x1769aa
  });

  const planeta = new THREE.Mesh(
    planetaGeometria,
    planetaMaterial
  );

  escena.add(planeta);

  // 9. CONTINENTES DECORATIVOS

  const continentes = new THREE.Group();
  planeta.add(continentes);

  for (let i = 0; i < 10; i++) {
    const geometriaContinente =
      new THREE.SphereGeometry(
        0.18 + Math.random() * 0.25,
        12,
        8
      );

    const materialContinente =
      new THREE.MeshBasicMaterial({
        color: 0x39a852
      });

    const continente = new THREE.Mesh(
      geometriaContinente,
      materialContinente
    );

    const angulo = Math.random() * Math.PI * 2;
    const altura = -0.7 + Math.random() * 1.4;

    continente.position.set(
      Math.cos(angulo) * 1.45,
      altura,
      Math.sin(angulo) * 1.45
    );

    continente.scale.set(1.5, 0.4, 0.8);

    continentes.add(continente);
  }

  // 10. ATMÓSFERA

  const atmosferaGeometria = new THREE.SphereGeometry(
    1.82,
    64,
    64
  );

  const atmosferaMaterial = new THREE.MeshBasicMaterial({
    color: 0x4fc3ff,
    transparent: true,
    opacity: 0.18,
    side: THREE.BackSide
  });

  const atmosfera = new THREE.Mesh(
    atmosferaGeometria,
    atmosferaMaterial
  );

  escena.add(atmosfera);

  // 11. GRUPO DE SATÉLITES

  const grupoSatelites = new THREE.Group();
  escena.add(grupoSatelites);

  // 12. FUNCIÓN PARA CREAR CADA SATÉLITE

  function crearSatelite(indice) {
    const satelite = new THREE.Group();

    // Cuerpo principal

    const cuerpoGeometria = new THREE.BoxGeometry(
      0.28,
      0.22,
      0.4
    );

    const colores = [
      0xffc857,
      0xffffff,
      0xc5c5c5
    ];

    const cuerpoMaterial = new THREE.MeshBasicMaterial({
      color: colores[indice % colores.length]
    });

    const cuerpo = new THREE.Mesh(
      cuerpoGeometria,
      cuerpoMaterial
    );

    satelite.add(cuerpo);

    // Paneles solares

    const panelGeometria = new THREE.BoxGeometry(
      0.55,
      0.04,
      0.28
    );

    const panelMaterial = new THREE.MeshBasicMaterial({
      color: 0x163d91
    });

    const panelIzquierdo = new THREE.Mesh(
      panelGeometria,
      panelMaterial
    );

    panelIzquierdo.position.x = -0.42;
    satelite.add(panelIzquierdo);

    const panelDerecho = new THREE.Mesh(
      panelGeometria,
      panelMaterial
    );

    panelDerecho.position.x = 0.42;
    satelite.add(panelDerecho);

    // Antena

    const antenaGeometria = new THREE.CylinderGeometry(
      0.02,
      0.02,
      0.35,
      8
    );

    const antenaMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });

    const antena = new THREE.Mesh(
      antenaGeometria,
      antenaMaterial
    );

    antena.position.y = 0.27;
    satelite.add(antena);

    // Plato de antena

    const antenaPlatoGeometria = new THREE.ConeGeometry(
      0.13,
      0.08,
      16,
      1,
      true
    );

    const antenaPlatoMaterial =
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide
      });

    const antenaPlato = new THREE.Mesh(
      antenaPlatoGeometria,
      antenaPlatoMaterial
    );

    antenaPlato.position.y = 0.45;
    antena.add(antenaPlato);

    // Datos de la órbita

    const radioOrbita =
      2.7 + (indice % 5) * 0.45;

    const velocidad =
      0.004 + (indice % 4) * 0.001;

    const anguloInicial =
      (indice / 20) * Math.PI * 2;

    const inclinacion =
      (-0.5 + Math.random()) * 0.7;

    const escala =
      0.8 + Math.random() * 0.35;

    satelite.userData = {
      radio: radioOrbita,
      velocidad: velocidad,
      angulo: anguloInicial,
      inclinacion: inclinacion,
      escala: escala
    };

    satelite.scale.setScalar(escala);

    grupoSatelites.add(satelite);

    return satelite;
  }

  // 13. CREAR 20 SATÉLITES

  const MAX_SATELITES = 20;
  const satelites = [];

  for (let i = 0; i < MAX_SATELITES; i++) {
    satelites.push(crearSatelite(i));
  }

  // 14. CREAR CINCO ÓRBITAS

  const orbitas = [];

  for (let i = 0; i < 5; i++) {
    const radio = 2.7 + i * 0.45;
    const puntos = [];

    for (let j = 0; j <= 128; j++) {
      const angulo =
        (j / 128) * Math.PI * 2;

      puntos.push(
        new THREE.Vector3(
          Math.cos(angulo) * radio,
          0,
          Math.sin(angulo) * radio
        )
      );
    }

    const geometriaOrbita =
      new THREE.BufferGeometry().setFromPoints(puntos);

    const materialOrbita =
      new THREE.LineBasicMaterial({
        color: 0x4fc3ff,
        transparent: true,
        opacity: 0.3
      });

    const orbita = new THREE.LineLoop(
      geometriaOrbita,
      materialOrbita
    );

    escena.add(orbita);
    orbitas.push(orbita);
  }

  // 15. ANILLO DECORATIVO

  const anilloGeometria = new THREE.RingGeometry(
    2.05,
    2.08,
    64
  );

  const anilloMaterial = new THREE.MeshBasicMaterial({
    color: 0x66d9ff,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide
  });

  const anillo = new THREE.Mesh(
    anilloGeometria,
    anilloMaterial
  );

  anillo.rotation.x = Math.PI / 2;
  escena.add(anillo);

  // 16. CONTROL DE CANTIDAD DE SATÉLITES

  control.min = 0;
  control.max = MAX_SATELITES;
  control.step = 1;

  function actualizarSatelites() {
    const cantidad = Math.max(
      0,
      Math.min(
        MAX_SATELITES,
        parseInt(control.value, 10) || 0
      )
    );

    valor.textContent = cantidad;

    for (let i = 0; i < satelites.length; i++) {
      satelites[i].visible = i < cantidad;
    }
  }

  control.addEventListener(
    "input",
    actualizarSatelites
  );

  actualizarSatelites();

  // 17. ANIMACIÓN

  const reloj = new THREE.Clock();

  function animar() {
    requestAnimationFrame(animar);

    const tiempo = reloj.getElapsedTime();

    // Rotación del planeta

    planeta.rotation.y += 0.0025;

    // Rotación de la atmósfera

    atmosfera.rotation.y -= 0.001;

    // Movimiento orbital de los satélites

    for (let i = 0; i < satelites.length; i++) {
      const satelite = satelites[i];

      if (!satelite.visible) {
        continue;
      }

      const datos = satelite.userData;

      datos.angulo += datos.velocidad;

      const x =
        Math.cos(datos.angulo) * datos.radio;

      const z =
        Math.sin(datos.angulo) * datos.radio;

      const y =
        Math.sin(datos.angulo * 0.7) *
        datos.inclinacion;

      satelite.position.set(x, y, z);

      // Orientar el satélite hacia el planeta

      satelite.lookAt(0, 0, 0);

      // Pequeño movimiento adicional

      satelite.rotateZ(
        Math.sin(tiempo * 2 + i) * 0.002
      );
    }

    // Movimiento de las estrellas

    estrellas.rotation.y += 0.00015;

    // Movimiento del anillo

    anillo.rotation.z += 0.0005;

    // Pequeño movimiento de cámara

    camara.position.x =
      Math.sin(tiempo * 0.15) * 0.3;

    camara.position.y =
      2 + Math.sin(tiempo * 0.2) * 0.15;

    camara.lookAt(0, 0, 0);

    // Dibujar la escena

    renderizador.render(escena, camara);
  }

  // 18. INICIAR SIMULACIÓN

  animar();
}
