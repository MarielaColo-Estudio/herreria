console.log("todo esta funcionando corectamente")
// ==========================
// VARIABLES Y CONSTANTES
// ==========================

const trabajos = [
{ nombre: "Reja", precio: 50000 },
{ nombre: "Portón", precio: 120000 },
{ nombre: "Cerramiento", precio: 90000 }
];

let nombreCliente = "";
let totalPresupuesto = 0;

// ==========================
// FUNCIONES
// ==========================

// Función 1: pedir nombre del cliente
function pedirNombre() {
nombreCliente = prompt("Bienvenido al simulador de herrería.\n\nIngresá tu nombre:");
console.log("Cliente:", nombreCliente);
}

// Función 2: mostrar trabajos disponibles
function mostrarTrabajos() {
let mensaje = "Trabajos disponibles:\n";

for (let i = 0; i < trabajos.length; i++) {
mensaje += `${i + 1}. ${trabajos[i].nombre} - $${trabajos[i].precio}\n`;
}

alert(mensaje);
}

// Función 3: calcular presupuesto
function calcularPresupuesto() {
let opcion = parseInt(prompt("Elegí el número del trabajo que necesitás:"));
let cantidad = parseInt(prompt("¿Cuántas unidades necesitás?"));

if (opcion >= 1 && opcion <= trabajos.length && cantidad > 0) {
totalPresupuesto = trabajos[opcion - 1].precio * cantidad;

alert(
"Resumen del presupuesto:\n\n" +
"Cliente: " + nombreCliente + "\n" +
"Trabajo: " + trabajos[opcion - 1].nombre + "\n" +
"Cantidad: " + cantidad + "\n" +
"Total estimado: $" + totalPresupuesto
);

console.log("Presupuesto calculado:", totalPresupuesto);
} else {
alert("Datos incorrectos. Por favor, intentá nuevamente.");
}
}

// ==========================
// EJECUCIÓN DEL SIMULADOR
// ==========================

pedirNombre();
mostrarTrabajos();
calcularPresupuesto();

let confirmar = confirm("¿Deseás realizar otra simulación?");
console.log("Confirmación del usuario:", confirmar);