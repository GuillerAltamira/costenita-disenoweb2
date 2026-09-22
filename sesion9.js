/* ==========================================================================
   SESIÓN 9: INTRODUCCIÓN A JQUERY Y MANEJO AVANZADO DEL DOM
   Materia: Diseño Web II (SIS-0141) - UPDS Tarija
   Estudiantes: Ronny Guillermo Altamirano Suarez, Miguel Angel Lopez Villca
   Empresa: Costeñita (Comercio de Miel)

   PUNTO 5 (ACTIVIDAD EN CLASE): COMPARATIVA DE LÍNEAS
   --------------------------------------------------------------------------
   1. renderCatalogo():
      - JS Puro (Sesión 6): ~20 líneas (document.createElement, innerHTML,
        classList.add, appendChild repetidos).
      - jQuery (Sesión 9): ~12 líneas (resuelto con $("<article>"), .html(),
        .addClass() y .append()).
   2. renderResumen():
      - JS Puro: ~6 líneas (document.getElementById + textContent por cada id).
      - jQuery: ~3 líneas (uso directo de $("#id").text()).
   ========================================================================== */

// --- MODELO DE DATOS (POO) ---
class ProductoMiel {
    constructor(id, nombre, presentacion, precio, stock) {
        this.id = id;
        this.nombre = nombre;
        this.presentacion = presentacion;
        this.precio = precio;
        this.stock = stock;
    }
}

class InventarioCostenita {
    constructor() {
        this.productos = [
            new ProductoMiel(1, "Miel Pura Líquida", "250 g", 15.00, 10),
            new ProductoMiel(2, "Miel Pura Líquida", "500 g", 35.00, 4),   // Poco stock
            new ProductoMiel(3, "Miel Pura Líquida", "1 kg", 60.00, 0),     // Agotado
            new ProductoMiel(4, "Miel con Panal", "500 g", 40.00, 8)
        ];
    }

    valorInventario() {
        return this.productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);
    }

    agotados() {
        return this.productos.filter(p => p.stock === 0);
    }
}

const inventario = new InventarioCostenita();

// --- EJECUCIÓN CUANDO EL DOM ESTÉ LISTO ---
$(function () {
    console.log("Sesión 9 inicializada: DOM listo y operando con jQuery 3.7.1");

    // 1. Render del catálogo de tarjetas con jQuery
    function renderCatalogo() {
        $("#catalogo").empty(); // Vaciar antes de volver a dibujar

        inventario.productos.forEach(producto => {
            const $tarjeta =$("<article></article>").addClass("tarjeta");

            $tarjeta.html(`
                <h3>${producto.nombre}</h3>
                <p>Presentación: <strong>${producto.presentacion}</strong></p>
                <p class="precio">Bs ${producto.precio.toFixed(2)}</p>
                <p>Stock disponible: ${producto.stock} unidades</p>
            `);

            if (producto.stock === 0) {
                $tarjeta.addClass("agotado");
            } else if (producto.stock <= 5) {
                $tarjeta.addClass("pocoStock");
            }

            $("#catalogo").append($tarjeta);
        });
    }

    // 2. Render del panel de resumen usando .text()
    function renderResumen() {
        $("#totalProductos").text(inventario.productos.length);
        $("#valorInventario").text(inventario.valorInventario().toFixed(2));
        $("#totalAgotados").text(inventario.agotados().length);
    }

    // 3. Render dinámico del select del formulario (Actividad para la casa)
    function renderSelectProductos() {
        const $select =$("#selectProductos");
        $select.empty();$select.append("<option value=''>-- Seleccione una presentación --</option>");

        inventario.productos.forEach(producto => {
            if (producto.stock > 0) {
                const $opcion =$("<option></option>")
                    .val(producto.id)
                    .text(`${producto.nombre} (${producto.presentacion}) - Bs ${producto.precio.toFixed(2)}`);
                
                $select.append($opcion);
            }
        });
    }

    // Evento de prueba del select de pedidos
    $("#btnProbarSeleccion").on("click", function () {
        const idSeleccionado = $("#selectProductos").val();
        if (idSeleccionado) {
            const prod = inventario.productos.find(p => p.id == idSeleccionado);
            alert("Seleccionaste: " + prod.nombre + " (" + prod.presentacion + ") por Bs " + prod.precio.toFixed(2));
        } else {
            alert("Por favor selecciona un producto disponible del menú desplegable.");
        }
    });

    // 4. Reto de encadenamiento (chaining)
    $("#avisoPromocion")
        .addClass("destacado")
        .text("¡Promoción Costeñita: Envío gratis en compras mayores a 1 kg en Tarija!")
        .css({
            "background-color": "#fff3cd",
            "color": "#856404",
            "padding": "12px",
            "border": "1px solid #ffeeba"
        });

    // Llamadas iniciales a las funciones de render
    renderCatalogo();
    renderResumen();
    renderSelectProductos();
});