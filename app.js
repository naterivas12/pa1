// Datos de productos (simulando una base de datos)
const productos = [
	{
		id: 1,
		nombre: "Laptop HP Pavilion",
		precio: 12999.99,
		imagen:
			"https://rymportatiles.com.pe/cdn/shop/files/HP-250-G10-1_2205e73f-09cd-4cc4-8dbf-ca3faa266623.png?v=1738180765&width=1214",
		categoria: "laptops",
		descripcion:
			"Laptop HP Pavilion con procesador Intel Core i5, 8GB RAM, 512GB SSD",
	},
	{
		id: 2,
		nombre: "Smartphone Samsung Galaxy S21",
		precio: 9999.99,
		imagen:
			"https://http2.mlstatic.com/D_NQ_NP_950192-MLA74242183335_012024-O.webp",
		categoria: "smartphones",
		descripcion:
			'Samsung Galaxy S21 con pantalla AMOLED de 6.2", 128GB almacenamiento',
	},
	{
		id: 3,
		nombre: "Audífonos Bluetooth Sony",
		precio: 1999.99,
		imagen:
			"https://mercury.vtexassets.com/arquivos/ids/13184687-800-800?v=638246150013130000&width=800&height=800&aspect=true",
		categoria: "accesorios",
		descripcion:
			"Audífonos inalámbricos con cancelación de ruido y 30 horas de batería",
	},
	{
		id: 4,
		nombre: "Laptop MacBook Air",
		precio: 19999.99,
		imagen:
			"https://rymportatiles.com.pe/cdn/shop/files/MACBOOK-AIR-A2337-GOLD_a923a779-4d43-49af-918b-181bc4808cef.png?v=1728926477&width=1214",
		categoria: "laptops",
		descripcion: "MacBook Air con chip M1, 8GB RAM, 256GB SSD",
	},
	{
		id: 5,
		nombre: "Smartphone iPhone 13",
		precio: 15999.99,
		imagen:
			"https://oechsle.vtexassets.com/arquivos/ids/6261917/image-b5a7eb44daea495bbdc4c80e380abea3.jpg?v=637747455424130000",
		categoria: "smartphones",
		descripcion:
			'iPhone 13 con pantalla Super Retina XDR de 6.1", 128GB almacenamiento',
	},
	{
		id: 6,
		nombre: "Mouse Inalámbrico Logitech",
		precio: 599.99,
		imagen: "https://compusystemperu.com/wp-content/uploads/2021/12/M170-1.jpg",
		categoria: "accesorios",
		descripcion: "Mouse ergonómico inalámbrico con batería de larga duración",
	},
];

// Variables globales
let carrito = [];
let productosActuales = [...productos];

// Elementos del DOM
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar la página
    mostrarProductos(productos);
    configurarEventListeners();
    cargarCarritoDesdeLocalStorage();
});

// Función para mostrar productos en la página
function mostrarProductos(productosAMostrar) {
    const contenedorProductos = document.querySelector('.productos-grid');
    contenedorProductos.innerHTML = '';

    productosAMostrar.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('producto');
        productoElement.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p class="precio">S/.${producto.precio.toFixed(2)}</p>
            <p class="descripcion">${producto.descripcion}</p>
            <button class="btn-agregar" data-id="${producto.id}">Agregar al Carrito</button>
        `;
        contenedorProductos.appendChild(productoElement);
    });

    // Agregar eventos a los botones de agregar al carrito
    document.querySelectorAll('.btn-agregar').forEach(boton => {
        boton.addEventListener('click', agregarAlCarrito);
    });
}

// Configurar todos los event listeners
function configurarEventListeners() {
    // Filtros de categorías
    document.querySelectorAll('.btn-filtro').forEach(boton => {
        boton.addEventListener('click', filtrarProductos);
    });

    // Carrito
    document.querySelector('.carrito-icon').addEventListener('click', toggleCarrito);
    document.querySelector('.cerrar-carrito').addEventListener('click', toggleCarrito);
    document.querySelector('.btn-vaciar').addEventListener('click', vaciarCarrito);
    document.querySelector('.btn-comprar').addEventListener('click', procesarCompra);

    // Modal
    document.querySelector('.cerrar-modal').addEventListener('click', cerrarModal);
    document.querySelector('.btn-modal-ok').addEventListener('click', cerrarModal);
    document.querySelector('.overlay').addEventListener('click', cerrarModal);

    // Formulario de contacto
    document.getElementById('formulario-contacto').addEventListener('submit', validarFormulario);
}

// Función para filtrar productos
function filtrarProductos(e) {
    // Actualizar botones activos
    document.querySelectorAll('.btn-filtro').forEach(btn => {
        btn.classList.remove('activo');
    });
    e.target.classList.add('activo');

    const categoria = e.target.getAttribute('data-categoria');
    
    if (categoria === 'todos') {
        productosActuales = [...productos];
    } else {
        productosActuales = productos.filter(producto => producto.categoria === categoria);
    }
    
    mostrarProductos(productosActuales);
}

// Funciones del carrito
function toggleCarrito() {
    const carritoPanel = document.querySelector('.carrito-panel');
    const overlay = document.querySelector('.overlay');
    
    carritoPanel.classList.toggle('activo');
    overlay.classList.toggle('activo');
}

function agregarAlCarrito(e) {
    const productoId = parseInt(e.target.getAttribute('data-id'));
    const productoSeleccionado = productos.find(producto => producto.id === productoId);
    
    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.find(item => item.id === productoId);
    
    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        carrito.push({
            ...productoSeleccionado,
            cantidad: 1
        });
    }
    
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
    
    // Mostrar notificación
    mostrarNotificacion(`${productoSeleccionado.nombre} agregado al carrito`);
}

function actualizarCarrito() {
    const carritoItems = document.querySelector('.carrito-items');
    const contadorCarrito = document.querySelector('.contador-carrito');
    const totalPrecio = document.querySelector('.total-precio');
    
    // Limpiar el contenido actual
    carritoItems.innerHTML = '';
    
    // Actualizar contador
    const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
    contadorCarrito.textContent = totalItems;
    
    // Si el carrito está vacío
    if (carrito.length === 0) {
        carritoItems.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío</p>';
        totalPrecio.textContent = '$0.00';
        return;
    }
    
    // Agregar items al carrito
    carrito.forEach(item => {
        const carritoItem = document.createElement('div');
        carritoItem.classList.add('carrito-item');
        carritoItem.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}">
            <div class="item-detalles">
                <h4>${item.nombre}</h4>
                <p>S/.${item.precio.toFixed(2)}</p>
                <div class="item-cantidad">
                    <button class="btn-cantidad restar" data-id="${item.id}">-</button>
                    <span>${item.cantidad}</span>
                    <button class="btn-cantidad sumar" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="btn-eliminar" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        carritoItems.appendChild(carritoItem);
    });
    
    // Calcular y mostrar el total
    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    totalPrecio.textContent = `$${total.toFixed(2)}`;
    
    // Agregar eventos a los botones
    document.querySelectorAll('.btn-eliminar').forEach(boton => {
        boton.addEventListener('click', eliminarDelCarrito);
    });
    
    document.querySelectorAll('.restar').forEach(boton => {
        boton.addEventListener('click', restarCantidad);
    });
    
    document.querySelectorAll('.sumar').forEach(boton => {
        boton.addEventListener('click', sumarCantidad);
    });
}

function eliminarDelCarrito(e) {
    const id = parseInt(e.target.closest('.btn-eliminar').getAttribute('data-id'));
    carrito = carrito.filter(item => item.id !== id);
    
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
}

function restarCantidad(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const item = carrito.find(item => item.id === id);
    
    if (item.cantidad > 1) {
        item.cantidad--;
    } else {
        carrito = carrito.filter(item => item.id !== id);
    }
    
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
}

function sumarCantidad(e) {
    const id = parseInt(e.target.getAttribute('data-id'));
    const item = carrito.find(item => item.id === id);
    item.cantidad++;
    
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
}

function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
}

function procesarCompra() {
    if (carrito.length === 0) {
        mostrarNotificacion('Tu carrito está vacío', true);
        return;
    }
    
    // Aquí iría la lógica para procesar la compra (enviar a un servidor, etc.)
    
    // Mostrar modal de compra exitosa
    mostrarModal();
    
    // Vaciar el carrito
    vaciarCarrito();
}

// Funciones para el modal
function mostrarModal() {
    document.getElementById('modal-compra').classList.add('activo');
    document.querySelector('.overlay').classList.add('activo');
}

function cerrarModal() {
    document.getElementById('modal-compra').classList.remove('activo');
    document.querySelector('.overlay').classList.remove('activo');
    document.querySelector('.carrito-panel').classList.remove('activo');
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, esError = false) {
    const notificacion = document.createElement('div');
    notificacion.classList.add('notificacion');
    
    if (esError) {
        notificacion.classList.add('error');
    }
    
    notificacion.textContent = mensaje;
    document.body.appendChild(notificacion);
    
    // Mostrar la notificación
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);
    
    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
        }, 300);
    }, 3000);
}

// Validación del formulario de contacto
function validarFormulario(e) {
    e.preventDefault();
    
    let esValido = true;
    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const mensaje = document.getElementById('mensaje');
    
    // Validar nombre
    if (nombre.value.trim() === '') {
        mostrarErrorInput(nombre, 'El nombre es obligatorio');
        esValido = false;
    } else {
        limpiarErrorInput(nombre);
    }
    
    // Validar email
    if (email.value.trim() === '') {
        mostrarErrorInput(email, 'El correo electrónico es obligatorio');
        esValido = false;
    } else if (!validarEmail(email.value)) {
        mostrarErrorInput(email, 'Ingresa un correo electrónico válido');
        esValido = false;
    } else {
        limpiarErrorInput(email);
    }
    
    // Validar mensaje
    if (mensaje.value.trim() === '') {
        mostrarErrorInput(mensaje, 'El mensaje es obligatorio');
        esValido = false;
    } else {
        limpiarErrorInput(mensaje);
    }
    
    // Si todo es válido, enviar el formulario
    if (esValido) {
        // Aquí iría la lógica para enviar el formulario (AJAX, fetch, etc.)
        mostrarNotificacion('¡Mensaje enviado con éxito! Te contactaremos pronto.');
        e.target.reset();
    }
}

function mostrarErrorInput(input, mensaje) {
    const formGroup = input.parentElement;
    const errorMensaje = formGroup.querySelector('.error-mensaje');
    
    formGroup.classList.add('error');
    errorMensaje.textContent = mensaje;
}

function limpiarErrorInput(input) {
    const formGroup = input.parentElement;
    const errorMensaje = formGroup.querySelector('.error-mensaje');
    
    formGroup.classList.remove('error');
    errorMensaje.textContent = '';
}

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Funciones para localStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

// Función para animación de scroll suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});