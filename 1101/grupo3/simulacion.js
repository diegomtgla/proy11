// ==========================================
// 1. OBTENER ELEMENTOS Y CONFIGURAR MEDIDAS
// ==========================================
const canvas = document.getElementById('lienzo');
const sliderControl = document.getElementById('control');
const spanValor = document.getElementById('valor');

if (sliderControl) {
    sliderControl.min = "0";
    sliderControl.max = "100";
    sliderControl.value = "0";
    sliderControl.step = "0.5";
}

function getDimensions() {
    return {
        width: canvas.clientWidth || window.innerWidth,
        height: canvas.clientHeight || window.innerHeight
    };
}

let { width, height } = getDimensions();

// ==========================================
// 2. ESCENA, CÁMARA Y RENDERIZADOR
// ==========================================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
camera.position.z = 4.8;

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ==========================================
// 3. ILUMINACIÓN SOLAR REALISTA
// ==========================================
// Luz ambiental suave para no dejar la zona oscura totalmente negra
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Luz direccional que simula la luz del Sol
const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
sunLight.position.set(5, 3, 5);
scene.add(sunLight);

// ==========================================
// 4. CARGA DE TEXTURAS FOTORREALISTAS (NASA)
// ==========================================
const textureLoader = new THREE.TextureLoader();

// Texturas oficiales de Three.js / NASA
const earthMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
const earthNormal = textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg');
const earthSpecular = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg');

// Material Phong para simular reflejos especulares en océanos y relieve en continentes
const materialCorteza = new THREE.MeshPhongMaterial({
    map: earthMap,
    normalMap: earthNormal,
    specularMap: earthSpecular,
    specular: new THREE.Color(0x333333),
    shininess: 25,
    side: THREE.DoubleSide
});

// ==========================================
// 5. NÚCLEO DE MAGMA E INCANDESCENCIA
// ==========================================
const planetaGroup = new THREE.Group();
scene.add(planetaGroup);

// Esfera interior de magma candente
const magmaGeo = new THREE.SphereGeometry(1.92, 32, 32);
const magmaMat = new THREE.MeshBasicMaterial({
    color: 0xff2200
});
const nucleoMagma = new THREE.Mesh(magmaGeo, magmaMat);
planetaGroup.add(nucleoMagma);

// Luz interna brillante que emana del magma al abrir las placas
const magmaLight = new THREE.PointLight(0xff4500, 2, 10);
planetaGroup.add(magmaLight);

// ==========================================
// 6. CREACIÓN DE PLACAS TECTÓNICAS PERFECTAS
// ==========================================
// Definimos 8 sectores esféricos (Placas)
const divisionesLon = 4; // 4 sectores longitudinales
const divisionesLat = 2; // 2 sectores latitudinales (Hemisferio Norte / Sur)
const radioTierra = 2.0;

const placas = [];

// Función para mapear correctamente las UVs globales sin distorsión
function recalcularUVsGlobales(geometry) {
    const uvAttr = geometry.attributes.uv;
    const posAttr = geometry.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const z = posAttr.getZ(i);

        const norm = Math.sqrt(x * x + y * y + z * z);
        const ny = Math.max(-1, Math.min(1, y / norm));

        // Cálculo de latitud (theta) y longitud (phi)
        const theta = Math.acos(ny); // 0 (Norte) a PI (Sur)
        let phi = Math.atan2(z, x);  // -PI a PI
        if (phi < 0) phi += 2 * Math.PI;

        const u = 1 - (phi / (2 * Math.PI));
        const v = 1 - (theta / Math.PI);

        uvAttr.setXY(i, u, v);
    }
    uvAttr.needsUpdate = true;
}

// Generamos cada una de las placas
for (let i = 0; i < divisionesLon; i++) {
    for (let j = 0; j < divisionesLat; j++) {
        const phiStart = (i * Math.PI * 2) / divisionesLon;
        const phiLength = (Math.PI * 2) / divisionesLon;

        const thetaStart = (j * Math.PI) / divisionesLat;
        const thetaLength = Math.PI / divisionesLat;

        // Crear segmento esférico
        const placaGeo = new THREE.SphereGeometry(
            radioTierra, 32, 32,
            phiStart, phiLength,
            thetaStart, thetaLength
        );

        // Mapear la textura globalmente para alineación perfecta al 0%
        recalcularUVsGlobales(placaGeo);

        const placaMesh = new THREE.Mesh(placaGeo, materialCorteza);
        planetaGroup.add(placaMesh);

        // Calcular dirección radial de expansión de la placa
        const phiCenter = phiStart + phiLength / 2;
        const thetaCenter = thetaStart + thetaLength / 2;

        const dirVector = new THREE.Vector3(
            Math.sin(thetaCenter) * Math.cos(phiCenter),
            Math.cos(thetaCenter),
            Math.sin(thetaCenter) * Math.sin(phiCenter)
        ).normalize();

        placas.push({
            mesh: placaMesh,
            direccion: dirVector
        });
    }
}

// ==========================================
// 7. INTERACCIÓN CON EL CONTROL (SLIDER)
// ==========================================
function actualizarTectonica() {
    const valor = parseFloat(sliderControl ? sliderControl.value : 0);

    if (spanValor) {
        spanValor.textContent = `${valor}% (Deriva Tectónica)`;
    }

    // Distancia que se alejan las placas del centro
    const offset = (valor / 100) * 0.6;

    placas.forEach(placa => {
        placa.mesh.position.copy(placa.direccion).multiplyScalar(offset);
    });
}

if (sliderControl) {
    sliderControl.addEventListener('input', actualizarTectonica);
}

// ==========================================
// 8. BUCLE DE ANIMACIÓN
// ==========================================
function animate() {
    requestAnimationFrame(animate);

    // Rotación suave del planeta completo e inclinación de la Tierra (~23.4°)
    planetaGroup.rotation.y += 0.002;
    planetaGroup.rotation.z = 0.08;

    renderer.render(scene, camera);
}

animate();

// ==========================================
// 9. AJUSTE RESPONSIVE
// ==========================================
window.addEventListener('resize', () => {
    const { width, height } = getDimensions();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
