// ===== SIMULACIÓN INTERACTIVA — MATERIA OSCURA =====
// Three.js r128, sin módulos ni OrbitControls.

// Buscamos los elementos del HTML.
const lienzo=document.getElementById("lienzo");
const control=document.getElementById("control");
const valor=document.getElementById("valor");
const dato1=document.getElementById("dato1");
const dato2=document.getElementById("dato2");
const boton=document.getElementById("reiniciar");

// Creamos escena, cámara y renderizador.
const escena=new THREE.Scene();
const camara=new THREE.PerspectiveCamera(55,lienzo.clientWidth/lienzo.clientHeight,0.1,1000);
camara.position.z=4.2;
const renderizador=new THREE.WebGLRenderer({canvas:lienzo,antialias:true});
renderizador.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderizador.setSize(lienzo.clientWidth,lienzo.clientHeight,false);

// El anillo representa de forma conceptual un halo de materia oscura.
const geometria=new THREE.TorusGeometry(1,0.4,24,80);
const material=new THREE.MeshBasicMaterial({color:0x8ed8ff,wireframe:true});
const anillo=new THREE.Mesh(geometria,material);
escena.add(anillo);

// Creamos un fondo de estrellas con puntos.
const cantidadEstrellas=900;
const posiciones=new Float32Array(cantidadEstrellas*3);
for(let i=0;i<posiciones.length;i+=3){
  posiciones[i]=(Math.random()-0.5)*18;
  posiciones[i+1]=(Math.random()-0.5)*10;
  posiciones[i+2]=(Math.random()-0.5)*12-2;
}
const estrellasGeometria=new THREE.BufferGeometry();
estrellasGeometria.setAttribute("position",new THREE.BufferAttribute(posiciones,3));
const estrellasMaterial=new THREE.PointsMaterial({color:0xffffff,size:0.025});
const estrellas=new THREE.Points(estrellasGeometria,estrellasMaterial);
escena.add(estrellas);

// Convertimos el radio del control en una escala visual.
function escalaHalo(radio){return 0.55+((radio-20)/180)*1.35;}

// Clasificamos la escala para mostrar un segundo dato.
function clasificar(radio){
  if(radio<70)return "Compacta";
  if(radio<140)return "Moderada";
  return "Extendida";
}

// Actualizamos la pantalla y el objeto.
function actualizar(){
  const radio=Number(control.value);
  anillo.scale.setScalar(escalaHalo(radio));
  valor.textContent=radio;
  dato1.textContent=radio+" kpc";
  dato2.textContent=clasificar(radio);
}

// Ajustamos el tamaño cuando cambia la pantalla.
function ajustarTamano(){
  const ancho=lienzo.clientWidth;
  const alto=lienzo.clientHeight;
  camara.aspect=ancho/alto;
  camara.updateProjectionMatrix();
  renderizador.setSize(ancho,alto,false);
}
window.addEventListener("resize",ajustarTamano);

// El deslizador responde al instante.
control.addEventListener("input",actualizar);

// El botón devuelve el control al inicio.
boton.addEventListener("click",function(){
  control.value=80;
  actualizar();
});

// Animación.
function animar(){
  requestAnimationFrame(animar);
  anillo.rotation.x+=0.004;
  anillo.rotation.y+=0.009;
  estrellas.rotation.y+=0.00025;
  renderizador.render(escena,camara);
}

// Estado inicial.
ajustarTamano();
actualizar();
animar();
