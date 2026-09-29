/* ==========================================================================
   PROYECTO COSTEÑITA: CATÁLOGO, CARRITO WHATSAPP Y MODO OSCURO/CLARO
   ========================================================================== */

// 1. Datos reales del catálogo de Costeñita
const productosCostenita = [
    {
        id: 1,
        codigo: "Producto 01",
        nombre: "Miel de Abeja Pura",
        envase: "Plástico (Hexagonal)",
        categoria: "plastico",
        tamano: "250 gr",
        precio: 15,
        imagen: "img/producto-01.jpg"
    },
    {
        id: 2,
        codigo: "Producto 02",
        nombre: "Miel de Abeja Pura",
        envase: "Plástico (Pote bajo)",
        categoria: "plastico",
        tamano: "250 gr",
        precio: 15,
        imagen: "img/producto-02.jpg"
    },
    {
        id: 3,
        codigo: "Producto 03",
        nombre: "Miel de Abeja Pura",
        envase: "Plástico (Colmena)",
        categoria: "plastico",
        tamano: "500 gr",
        precio: 28,
        imagen: "img/producto-03.jpg"
    },
    {
        id: 4,
        codigo: "Producto 04",
        nombre: "Miel de Abeja Pura",
        envase: "Plástico (Envase grande)",
        categoria: "plastico",
        tamano: "1 kg",
        precio: 52,
        imagen: "img/producto-04.jpg"
    },
    {
        id: 5,
        codigo: "Producto 05",
        nombre: "Miel de Abeja Pura",
        envase: "Vidrio (Frasco tradicional)",
        categoria: "vidrio",
        tamano: "250 gr",
        precio: 20,
        imagen: "img/producto-05.jpg"
    },
    {
        id: 6,
        codigo: "Producto 06",
        nombre: "Miel de Abeja Pura",
        envase: "Vidrio (Frasco redondo)",
        categoria: "vidrio",
        tamano: "500 gr",
        precio: 38,
        imagen: "img/producto-06.jpg"
    },
    {
        id: 7,
        codigo: "Producto 07",
        nombre: "Miel de Abeja Pura",
        envase: "Vidrio (Frasco grande)",
        categoria: "vidrio",
        tamano: "1 kg",
        precio: 65,
        imagen: "img/producto-07.jpg"
    }
];

// Estado del Carrito
let carrito = [];

$(function () {
    const telefonoWhatsApp = "59168460448";

    /* ==========================================================================
       CONTROL DE TEMA: MODO CLARO / OSCURO (CON LOCALSTORAGE)
       ========================================================================== */
    const temaGuardado = localStorage.getItem("costenita_theme");
    
    // Si el usuario ya lo tenía en oscuro, aplicarlo al inicio
    if (temaGuardado === "dark") {
        $("body").addClass("dark-mode");
        $("#btnThemeToggle i").removeClass("fa-moon").addClass("fa-sun");
    }

    $("#btnThemeToggle").on("click", function () {
        $("body").toggleClass("dark-mode");
        const esOscuro = $("body").hasClass("dark-mode");
        const $icon =$(this).find("i");

        if (esOscuro) {
            $icon.removeClass("fa-moon").addClass("fa-sun");
            localStorage.setItem("costenita_theme", "dark");
        } else {
            $icon.removeClass("fa-sun").addClass("fa-moon");
            localStorage.setItem("costenita_theme", "light");
        }
    });

    /* ==========================================================================
       CONTROL DEL MENÚ RESPONSIVO (MÓVIL / PC)
       ========================================================================== */
    $("#btnMenuToggle").on("click", function () {
        $(".nav-bar").toggleClass("menu-abierto");
        const $icon =$(this).find("i");

        if ($(".nav-bar").hasClass("menu-abierto")) {
            $icon.removeClass("fa-bars").addClass("fa-xmark");
        } else {
            $icon.removeClass("fa-xmark").addClass("fa-bars");
        }
    });

    // Cerrar el menú al tocar cualquier opción en móviles
    $(".nav-link").on("click", function () {
        if ($(window).width() <= 860) {$(".nav-bar").removeClass("menu-abierto");
            $("#btnMenuToggle").find("i").removeClass("fa-xmark").addClass("fa-bars");
        }
    });

    // Restaurar si el usuario redimensiona la ventana en PC
    $(window).on("resize", function () {
        if ($(window).width() > 860) {$(".nav-bar").removeClass("menu-abierto");
            $("#btnMenuToggle").find("i").removeClass("fa-xmark").addClass("fa-bars");
        }
    });

    /* ==========================================================================
       RENDERIZADO DE PRODUCTOS Y FILTROS
       ========================================================================== */
    function renderProductos(filtro = "todos") {
        $("#catalogoGrid").empty();

        const productosFiltrados = (filtro === "todos")
            ? productosCostenita
            : productosCostenita.filter(p => p.categoria === filtro);

        productosFiltrados.forEach(prod => {
            const $card =$(`
                <article class="product-card">
                    <img src="${prod.imagen}" alt="${prod.nombre}" class="product-image" onerror="this.src='https://placehold.co/300x300/dda15e/white?text=Costeñita+${prod.tamano}'">
                    <p class="product-detail">${prod.envase} - ${prod.tamano}</p>
                    <h4>${prod.nombre}</h4>
                    <p class="product-price">Bs ${prod.precio.toFixed(2)}</p>
                    <button class="btn-add-cart" data-id="${prod.id}">
                        <i class="fa-solid fa-plus"></i> Agregar al Pedido
                    </button>
                </article>
            `);

            $("#catalogoGrid").append($card);
        });
    }

    // Filtrado por categoría en la barra de menú
    $(".nav-link[data-categoria]").on("click", function (e) {
        e.preventDefault();
        $(".nav-link").removeClass("active");
        $(this).addClass("active");

        const categoria = $(this).data("categoria");
        if (categoria === "todos") {
            $("#tituloCategoria").text("NUESTRAS MIELES");
        } else if (categoria === "plastico") {
            $("#tituloCategoria").text("MIELES EN ENVASE PLÁSTICO");
        } else if (categoria === "vidrio") {
            $("#tituloCategoria").text("MIELES EN ENVASE DE VIDRIO");
        }

        renderProductos(categoria);
    });

    /* ==========================================================================
       CARRITO DE COMPRAS Y PEDIDOS POR WHATSAPP
       ========================================================================== */
    // Agregar producto al carrito
    $(document).on("click", ".btn-add-cart", function () {
        const id = parseInt($(this).data("id"));
        const prod = productosCostenita.find(p => p.id === id);

        const itemExistente = carrito.find(item => item.id === id);
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            carrito.push({ ...prod, cantidad: 1 });
        }

        actualizarCarrito();
        abrirCarrito();
    });

    // Controles dentro del carrito (+ / -)
    $(document).on("click", ".btn-qty", function () {
        const id = parseInt($(this).data("id"));
        const operacion = $(this).data("op");
        const item = carrito.find(i => i.id === id);

        if (item) {
            if (operacion === "sumar") {
                item.cantidad += 1;
            } else if (operacion === "restar") {
                item.cantidad -= 1;
                if (item.cantidad <= 0) {
                    carrito = carrito.filter(i => i.id !== id);
                }
            }
        }

        actualizarCarrito();
    });

    // Actualizar vista del carrito
    function actualizarCarrito() {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        $("#cartCount").text(totalItems);

        const $list =$("#cartItemsList");
        $list.empty();

        if (carrito.length === 0) {
            $list.html("<p style='text-align:center; color:var(--text-muted); margin-top:40px;'>Tu pedido está vacío</p>");
            $("#cartTotalMonto").text("Bs 0.00");
            return;
        }

        let totalPagar = 0;
        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            totalPagar += subtotal;

            $list.append(`
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h5>${item.nombre} (${item.tamano})</h5>
                        <p style="font-size:0.75rem; color:var(--text-muted);">${item.envase}</p>
                        <span>Bs ${subtotal.toFixed(2)}</span>
                    </div>
                    <div class="cart-item-controls">
                        <button class="btn-qty" data-id="${item.id}" data-op="restar">-</button>
                        <span style="margin: 0 5px; font-weight: bold;">${item.cantidad}</span>
                        <button class="btn-qty" data-id="${item.id}" data-op="sumar">+</button>
                    </div>
                </div>
            `);
        });

        $("#cartTotalMonto").text(`Bs ${totalPagar.toFixed(2)}`);
    }

    // Abrir y cerrar Drawer del Carrito
    function abrirCarrito() {
        $("#cartModal").addClass("open");
        $("#cartOverlay").addClass("open");
    }

    function cerrarCarrito() {
        $("#cartModal").removeClass("open");
        $("#cartOverlay").removeClass("open");
    }

    $("#btnAbrirCarrito").on("click", abrirCarrito);
    $("#btnCerrarCarrito, #cartOverlay").on("click", cerrarCarrito);

    // Botón para generar mensaje directo a WhatsApp
    $("#btnEnviarWhatsApp").on("click", function () {
        if (carrito.length === 0) {
            alert("Agrega al menos un producto a tu pedido.");
            return;
        }

        let mensaje = "¡Hola Costeñita! Quisiera realizar el siguiente pedido:%0A%0A";
        let totalFinal = 0;

        carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            totalFinal += subtotal;
            mensaje += `• *${item.cantidad}x* ${item.nombre} (${item.tamano}, ${item.envase}) - Bs ${subtotal.toFixed(2)}%0A`;
        });

        mensaje += `%0A*Total a pagar:* Bs ${totalFinal.toFixed(2)}%0A`;
        mensaje += "Por favor, indíquenme los métodos de pago y la coordinación del envío.";

        const urlWhatsApp = `https://wa.me/${telefonoWhatsApp}?text=${mensaje}`;
        window.open(urlWhatsApp, "_blank");
    });

    // Render inicial
    renderProductos();
});
