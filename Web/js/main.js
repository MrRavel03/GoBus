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

    // 3. Inicializar los íconos de Lucide UNA sola vez al final
    lucide.createIcons();

  } catch (error) {
    console.error("Error cargando las plantillas:", error);
  }
}

// Ejecutar la función cuando el archivo cargue
cargarPlantillas();