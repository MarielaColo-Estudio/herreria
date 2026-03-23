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

        async calcularTotal() {
            try {
                const res = await fetch("https://mocki.io/v1/0a8f2f6e-3fd9-4d6d-9c9a-123456789abc");
                const precios = await res.json();

                let superficie = this.ancho * this.alto;
                this.total = superficie * precios[this.material];

                if (this.pintura) this.total += 15000;
                if (this.instalacion) this.total += 20000;

                return this.total;
            } catch {
                Swal.fire("Error", "No se pudieron obtener los precios", "error");
            }
        }
    }

    const form = document.getElementById("formPresupuesto");
    const contenedor = document.getElementById("resultado");
    const mensajeError = document.getElementById("mensajeError");
    const cantidadSpan = document.getElementById("cantidad");
    const totalAcumuladoSpan = document.getElementById("totalAcumulado");
    const btnBorrar = document.getElementById("btnBorrar");

    let presupuestos = JSON.parse(localStorage.getItem("presupuestos")) || [];
    let presupuestoActivo = null;

    if (contenedor) renderizar();

    // 🔹 PRECARGA DE DATOS
    if (form) {
        document.getElementById("cliente").value = "Juan Pérez";
        document.getElementById("email").value = "juan@email.com";
        document.getElementById("telefono").value = "1122334455";
        document.getElementById("ancho").value = 2;
        document.getElementById("alto").value = 1.5;
    }

    // ===============
    // FORMULARIO
    // ===============
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const cliente = document.getElementById("cliente")?.value;
            const email = document.getElementById("email")?.value;
            const telefono = document.getElementById("telefono")?.value;
            const tipo = document.getElementById("tipo")?.value;
            const ancho = parseFloat(document.getElementById("ancho")?.value);
            const alto = parseFloat(document.getElementById("alto")?.value);
            const material = document.getElementById("material")?.value;
            const pintura = document.getElementById("pintura")?.checked;
            const instalacion = document.getElementById("instalacion")?.checked;

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

            await nuevo.calcularTotal();

            presupuestos.push(nuevo);
            guardarStorage();
            renderizar();
            form.reset();

            mostrarNotificacion(nuevo);
        });
    }

    function mostrarNotificacion(presupuesto) {
        Swal.fire({
            icon: "success",
            title: "Presupuesto generado",
            html: `
                ${presupuesto.cliente}, el presupuesto fue enviado a ${presupuesto.email}.<br><br>
                ¿Desea agendar un turno?
            `,
            showCancelButton: true,
            confirmButtonText: "Agendar turno"
        }).then(result => {
            if (result.isConfirmed) {
                abrirModal(presupuesto.id);
            }
        });
    }

    // ============
    // MODAL
    // ============
    window.abrirModal = function(id) {
        presupuestoActivo = id;
        document.getElementById("modalTurno")?.classList.remove("oculto");
    }

    window.cerrarModal = function() {
        document.getElementById("modalTurno")?.classList.add("oculto");
    }

    window.confirmarTurno = function() {
        const fecha = document.getElementById("fechaTurno")?.value;
        const hora = document.getElementById("horaTurno")?.value;

        if (!fecha || !hora) {
            Swal.fire("Datos incompletos", "Seleccione fecha y horario", "warning");
            return;
        }

        const presupuesto = presupuestos.find(p => p.id === presupuestoActivo);
        if (!presupuesto) return;

        presupuesto.turno = { fecha, hora };
        presupuesto.estado = "Turno Agendado";

        guardarStorage();
        renderizar();
        cerrarModal();

        Swal.fire("Turno confirmado", `📅 ${fecha} ⏰ ${hora}`, "success");
    }

    // ===============
    // RENDERIZAR
    // ===============
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
                <button class="btn-eliminar btn btn-danger" data-id="${p.id}">Eliminar</button>
            `;

            contenedor.appendChild(div);
        });

        actualizarEstadisticas();
    }

    // 🔹 EVENT DELEGATION
    contenedor.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn-eliminar")) {
            const id = Number(e.target.dataset.id);
            eliminar(id);
        }
    });

    function eliminar(id) {
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

    if (btnBorrar) {
        btnBorrar.addEventListener("click", () => {
            Swal.fire({
                title: "¿Borrar historial?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, borrar"
            }).then(result => {
                if (result.isConfirmed) {
                    presupuestos = [];
                    guardarStorage();
                    renderizar();
                }
            });
        });
    }

});