// js/main.js
async function cargarPlantillas() {
  try {
    // 1. Cargar el Header
    const respuestaHeader = await fetch('plantillas/header.html');
    const htmlHeader = await respuestaHeader.text();
    document.getElementById('header-container').innerHTML = htmlHeader;

    // 2. Cargar el Footer
    const respuestaFooter = await fetch('plantillas/footer.html');
    const htmlFooter = await respuestaFooter.text();
    // Verificamos si la página tiene footer (el login quizás no lo necesite)
    if (document.getElementById('footer-container')) {
      document.getElementById('footer-container').innerHTML = htmlFooter;
    }

    // 3. Activar el menú correspondiente según la página actual
    marcarMenuActivo();

    // 4. Inicializar los íconos de Lucide UNA sola vez al final
    lucide.createIcons();

  } catch (error) {
    console.error("Error cargando las plantillas:", error);
  }
}

// Función para resaltar la página actual en el menú
function marcarMenuActivo() {
  // Obtenemos el nombre del archivo actual de la URL (ej. 'rutas.html')
  let paginaActual = window.location.pathname.split('/').pop();
  
  // Si la ruta está vacía (ej. cuando entras a la raíz del sitio), asumimos que es index.html
  if (paginaActual === '') {
    paginaActual = 'index.html';
  }

  // Seleccionamos todos los enlaces de navegación dentro del header
  const enlaces = document.querySelectorAll('#header-container .nav-link');

  enlaces.forEach(enlace => {
    // Primero le quitamos la clase 'active' a todos los enlaces por si acaso
    enlace.classList.remove('active');

    // Obtenemos a dónde apunta el botón
    const href = enlace.getAttribute('href');

    // Si el href del botón coincide con la página en la que estamos, lo encendemos
    if (href === paginaActual) {
      enlace.classList.add('active');
    }
  });
}

// Ejecutar la función cuando el archivo cargue
cargarPlantillas();