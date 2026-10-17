const control = document.getElementById("control");
const tamaño = document.getElementById("tamaño");
const radio = document.getElementById("radio");
const masa = document.getElementById("masa");
const boton = document.getElementById("reiniciar");

function calcularTamaño(masa) {
return Math.round(5800 * Math.sqrt(masa));
}
function clasificar(masa) {
if (masa < 2) {
return "Pequena";
} else if (masa < 8) {
return "Mediana";
} else {
return "Grande";
}
}

function actualizar() {
const x = Number(control.value);
valor.textContent = x;
dato1.textContent = calcularTemperatura(x) + " K";
dato2.textContent = clasificar(x);
}

control.addEventListener("input", actualizar);
boton.addEventListener("click", function () {
control.value = 1;
actualizar();
});
actualizar();