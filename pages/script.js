class Presupuesto {
    constructor(id, tipo, ancho, alto, material, pintura, instalacion) {
        this.id = id;
        this.tipo = tipo;
        this.ancho = ancho;
        this.alto = alto;
        this.material = material;
        this.pintura = pintura;
        this.instalacion = instalacion;
        this.total = 0;
    }

    calcularTotal() {
        const precios = {
            hierro: 50000,
            aluminio: 70000,
            acero: 90000
        };

        let superficie = this.ancho * this.alto;
        this.total = superficie * precios[this.material];

        if (this.pintura) this.total += 15000;
        if (this.instalacion) this.total += 20000;

        return this.total;
    }
}

// --------------------------

const form = document.getElementById("formPresupuesto");
const contenedor = document.getElementById("resultado");
const mensajeError = document.getElementById("mensajeError");
const cantidadSpan = document.getElementById("cantidad");
const totalAcumuladoSpan = document.getElementById("totalAcumulado");
const btnBorrar = document.getElementById("btnBorrar");

let presupuestos = JSON.parse(localStorage.getItem("presupuestos")) || [];

document.addEventListener("DOMContentLoaded", () => {
    renderizar();
});

// Evento submit
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const tipo = document.getElementById("tipo").value;
    const ancho = parseFloat(document.getElementById("ancho").value);
    const alto = parseFloat(document.getElementById("alto").value);
    const material = document.getElementById("material").value;
    const pintura = document.getElementById("pintura").checked;
    const instalacion = document.getElementById("instalacion").checked;

    if (!tipo || !material || ancho <= 0 || alto <= 0) {
        mensajeError.textContent = "Completar correctamente todos los campos.";
        return;
    }

    mensajeError.textContent = "";

    const nuevo = new Presupuesto(
        Date.now(),
        tipo,
        ancho,
        alto,
        material,
        pintura,
        instalacion
    );

    nuevo.calcularTotal();
    presupuestos.push(nuevo);

    guardarStorage();
    renderizar();
    form.reset();
});

// Renderizar todo
function renderizar() {
    contenedor.innerHTML = "";

    presupuestos.forEach(p => {
        const div = document.createElement("div");
        div.classList.add("card");

        div.innerHTML = `
            <h3>${p.tipo}</h3>
            <p>${p.ancho}m x ${p.alto}m</p>
            <p>Material: ${p.material}</p>
            <p>Total: $${p.total.toLocaleString()}</p>
            <button onclick="eliminar(${p.id})">Eliminar</button>
        `;

        contenedor.appendChild(div);
    });

    actualizarEstadisticas();
}

// Eliminar individual
function eliminar(id) {
    presupuestos = presupuestos.filter(p => p.id !== id);
    guardarStorage();
    renderizar();
}

// Guardar en localStorage
function guardarStorage() {
    localStorage.setItem("presupuestos", JSON.stringify(presupuestos));
}

// Estadísticas
function actualizarEstadisticas() {
    cantidadSpan.textContent = presupuestos.length;

    const total = presupuestos.reduce((acc, p) => acc + p.total, 0);
    totalAcumuladoSpan.textContent = total.toLocaleString();
}

// Borrar todo
btnBorrar.addEventListener("click", () => {
    presupuestos = [];
    guardarStorage();
    renderizar();
});