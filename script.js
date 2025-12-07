// Seleccionar elementos del DOM
const navbarToggle = document.getElementById('navbarToggle');
const navbarMenu = document.getElementById('navbarMenu');
const navbarActions = document.querySelector('.navbar-actions');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');
// Nuevos elementos para el dropdown
const dropdownToggle = document.querySelector('.dropdown-toggle');
const subLinks = document.querySelectorAll('.nav-link-sub');
// Seleccionar el padre del dropdown globalmente (CORREGIDO)
const dropdownParent = document.querySelector('.dropdown'); 


/**
 * Toggle del menú móvil (Abre/Cierra el menú y las acciones)
 */
navbarToggle.addEventListener('click', () => {
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
    navbarActions.classList.toggle('active');
    
    // Prevenir scroll del body cuando el menú está abierto
    if (window.innerWidth <= 992) {
        if (navbarMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
});

/**
 * Toggle del Dropdown (Acordeón solo para vistas móviles)
 */
dropdownToggle.addEventListener('click', (e) => {
    // Si la pantalla es menor o igual a 992px, activa el acordeón
    if (window.innerWidth <= 992) {
        e.preventDefault(); // Evita que navegue inmediatamente a #portafolio
        
        // El dropdownParent ya está definido globalmente (CORREGIDO)
        const dropdownMenu = dropdownParent.querySelector('.dropdown-menu');

        // Toggle de la clase activa en el padre
        dropdownParent.classList.toggle('active');

        // Manejo de altura para el efecto de acordeón
        if (dropdownParent.classList.contains('active')) {
             // Establece la altura al tamaño real para la transición
            dropdownMenu.style.height = `${dropdownMenu.scrollHeight}px`;
        } else {
             // Cierra el menú estableciendo la altura a 0
            dropdownMenu.style.height = '0';
        }

    }
    // En escritorio, el CSS se encarga de mostrarlo al pasar el mouse (hover)
});


/**
 * Cerrar el menú principal al hacer clic en un enlace (en móviles)
 * Incluye los links principales y los sublinks del dropdown.
 */
function closeMobileMenu() {
    navbarToggle.classList.remove('active');
    navbarMenu.classList.remove('active');
    navbarActions.classList.remove('active');
    document.body.style.overflow = '';
    
    // Desactivar el dropdown de categorías al cerrar el menú principal (CORREGIDO)
    if (dropdownParent) {
        dropdownParent.classList.remove('active');
        const dropdownMenu = dropdownParent.querySelector('.dropdown-menu');
        if (dropdownMenu) {
             // Aseguramos que la altura se restablezca a 0 al cerrar
             dropdownMenu.style.height = '0'; 
        }
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Enlaces normales y el toggle en desktop navegan, en mobile cierran
        if (window.innerWidth <= 992 && !link.classList.contains('dropdown-toggle')) {
             closeMobileMenu();
        }
        
        // Manejo de la clase active para enlaces principales
        navLinks.forEach(l => l.classList.remove('active'));
        // El link "Portafolio" no debe tener la clase active permanente, se activa al scrollear
        if (!link.classList.contains('dropdown-toggle')) {
            link.classList.add('active');
        } else {
            // Si hacen click en Portafolio, activamos Inicio (solo un fallback para desktop)
            document.querySelector('.nav-link[href="#inicio"]').classList.add('active');
        }
    });
});

// Los sublinks cierran el menú principal y cierran el dropdown.
subLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 992) {
             closeMobileMenu();
        }
        // Cuando se selecciona una subsección, el link principal de Portafolio se activa
        navLinks.forEach(l => l.classList.remove('active'));
        document.querySelector('.nav-link[href="#portafolio"]').classList.add('active');
    });
});


/**
 * Cambiar el estilo de la navbar al hacer scroll (Tema Claro con Blur)
 */
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Si se ha hecho suficiente scroll, aplica el fondo semi-transparente y blur
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.9)'; // Blanco semi-transparente
        navbar.style.backdropFilter = 'blur(10px)';
        navbar.style.boxShadow = '0 2px 8px rgba(167, 139, 250, 0.15)'; // Sombra suave
    } else {
        // Vuelve al fondo estático
        navbar.style.background = 'var(--color-card-bg)';
        navbar.style.backdropFilter = 'none';
        navbar.style.boxShadow = '0 2px 4px rgba(167, 139, 250, 0.15)';
    }
});

/**
 * Scroll spy - Resaltar el enlace de la sección actual
 */
const sections = document.querySelectorAll('#inicio, #portafolio, #servicios, #sobre-mi, #contacto');
const subSections = document.querySelectorAll('#otono, #primavera, #invierno, #verano');

const observerOptions = {
    root: null,
    // La sección se considera intersectada cuando su centro cruza el centro del viewport
    rootMargin: '-50% 0px -50% 0px', 
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Si la sección actual es una estación (subsección), activamos el link principal de Portafolio
            if (['otono', 'primavera', 'invierno', 'verano'].includes(id)) {
                document.querySelector('.nav-link[href="#portafolio"]').classList.add('active');
            } else {
                // Para las secciones principales, activamos su link
                const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

subSections.forEach(section => {
    observer.observe(section);
});


/**
 * Cerrar el menú al hacer clic fuera de él (en móviles)
 */
document.addEventListener('click', (e) => {
    const isClickInsideNavbar = navbar.contains(e.target);
    const isMenuOpen = navbarMenu.classList.contains('active');
    
    if (!isClickInsideNavbar && isMenuOpen) {
        closeMobileMenu();
    }
});

/**
 * Animación de aparición suave para las cards al hacer scroll
 */
const observeElements = document.querySelectorAll('.service-card, .gallery-item'); 

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeInObserver.unobserve(entry.target); 
        }
    });
}, {
    threshold: 0.1
});

observeElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(element);
});