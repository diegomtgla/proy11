const control = document.getElementById("control");
const valor = document.getElementById("valor");
const dato1 = document.getElementById("dato1");
const dato2 = document.getElementById("dato2");
const boton = document.getElementById("reiniciar");
 
// 2. Las funciones de cálculo
 
// En una galaxia real, la velocidad orbital sube rápido cerca
// del centro y luego se mantiene casi constante (curva "plana").
// Esa parte plana es la evidencia indirecta del halo de materia
// oscura mencionada en el marco teórico.
function calcularVelocidad(distancia) {
  if (distancia < 10) {
    return Math.round(22 * distancia);
  } else {
    return 220;
  }
}
 
function clasificarZona(distancia) {
  if (distancia < 10) {
    return "Bulbo";
  } else if (distancia < 50) {
    return "Disco";
  } else {
    return "Halo";
  }
}
 
// 3. La función que actualiza la pantalla
function actualizar() {
  const x = Number(control.value);
 
  valor.textContent = x;
  dato1.textContent = calcularVelocidad(x) + " km/s";
  dato2.textContent = clasificarZona(x);
}
 
// 4. Los eventos
control.addEventListener("input", actualizar);
 
boton.addEventListener("click", function () {
  control.value = 1;
  actualizar();
});
 
actualizar();
 