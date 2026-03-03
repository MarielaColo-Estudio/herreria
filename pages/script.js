document.addEventListener("DOMContentLoaded", () => {

    class Presupuesto {
        constructor(id, cliente, email, telefono, tipo, ancho, alto, material, pintura, instalacion) {
            this.id = id;
            this.cliente = cliente;
            this.email = email;
            this.telefono = telefono;
            this.tipo = tipo;
            this.ancho = ancho;
            this.alto = alto;
            this.material = material;
            this.pintura = pintura;
            this.instalacion = instalacion;
            this.estado = "Pendiente";
            this.turno = null;
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

    const form = document.getElementById("formPresupuesto");
    const contenedor = document.getElementById("resultado");
    const mensajeError = document.getElementById("mensajeError");
    const cantidadSpan = document.getElementById("cantidad");
    const totalAcumuladoSpan = document.getElementById("totalAcumulado");
    const btnBorrar = document.getElementById("btnBorrar");
    const noti = document.getElementById("notificacion");

    let presupuestos = JSON.parse(localStorage.getItem("presupuestos")) || [];
    let presupuestoActivo = null;

    renderizar();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const cliente = document.getElementById("cliente").value;
        const email = document.getElementById("email").value;
        const telefono = document.getElementById("telefono").value;
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
            cliente,
            email,
            telefono,
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

        mostrarNotificacion(nuevo);
    });

    function mostrarNotificacion(presupuesto) {
        noti.innerHTML = `
            <div style="margin-top:15px; padding:15px; background:#e8f5e9; border:1px solid #4caf50; border-radius:8px;">
                <strong>¡Presupuesto enviado correctamente!</strong><br><br>
                ${presupuesto.cliente}, el presupuesto fue enviado a ${presupuesto.email}.<br><br>
                ¿Desea agendar un turno?<br><br>
                <button onclick="abrirModal(${presupuesto.id})">Agendar Turno</button>
            </div>
        `;
        noti.classList.remove("oculto");
    }

    window.abrirModal = function(id) {
        presupuestoActivo = id;
        document.getElementById("modalTurno").classList.remove("oculto");
    }

    window.cerrarModal = function() {
        document.getElementById("modalTurno").classList.add("oculto");
    }

  window.confirmarTurno = function() {
    const fecha = document.getElementById("fechaTurno").value;
    const hora = document.getElementById("horaTurno").value;

    if (!fecha || !hora) {
        alert("Seleccione fecha y horario");
        return;
    }

    const presupuesto = presupuestos.find(p => p.id === presupuestoActivo);

    presupuesto.turno = { fecha, hora };
    presupuesto.estado = "Turno Agendado";

    guardarStorage();
    renderizar();
    cerrarModal();

    // 🔔 Mostrar confirmación por mail
    mostrarConfirmacionTurno(presupuesto);
}
function mostrarConfirmacionTurno(presupuesto) {
    const noti = document.getElementById("notificacion");

    noti.innerHTML = `
        <div style="margin-top:15px; padding:15px; background:#e3f2fd; border:1px solid #2196f3; border-radius:8px;">
            <strong>¡Turno confirmado correctamente!</strong><br><br>
            📅 Fecha: ${presupuesto.turno.fecha}<br>
            ⏰ Hora: ${presupuesto.turno.hora}<br><br>
            Se envió la confirmación al email: <strong>${presupuesto.email}</strong>
        </div>
    `;

    noti.classList.remove("oculto");
}


    function renderizar() {
        contenedor.innerHTML = "";

        presupuestos.forEach(p => {
            const div = document.createElement("div");
            div.classList.add("card");

            div.innerHTML = `
                <h3>${p.tipo}</h3>
                <p><strong>Cliente:</strong> ${p.cliente}</p>
                <p>Total: $${p.total.toLocaleString()}</p>
                <p><strong>Estado:</strong> ${p.estado}</p>
                ${p.turno ? `<p><strong>Turno:</strong> ${p.turno.fecha} - ${p.turno.hora}</p>` : ""}
                <button onclick="eliminar(${p.id})">Eliminar</button>
            `;

            contenedor.appendChild(div);
        });

        actualizarEstadisticas();
    }

    window.eliminar = function(id) {
        presupuestos = presupuestos.filter(p => p.id !== id);
        guardarStorage();
        renderizar();
    }

    function guardarStorage() {
        localStorage.setItem("presupuestos", JSON.stringify(presupuestos));
    }

    function actualizarEstadisticas() {
        cantidadSpan.textContent = presupuestos.length;
        const total = presupuestos.reduce((acc, p) => acc + p.total, 0);
        totalAcumuladoSpan.textContent = total.toLocaleString();
    }

    btnBorrar.addEventListener("click", () => {
        presupuestos = [];
        guardarStorage();
        renderizar();
    });

});
