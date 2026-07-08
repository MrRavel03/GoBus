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


//Angelica new backend

document.addEventListener("DOMContentLoaded", function () {
  cargarRutasDesdeBackend();
});

function cargarRutasDesdeBackend() {
  const contenedorRutas = document.querySelector(".route-card")?.parentElement;

  if (!contenedorRutas) {
    return;
  }

  fetch("api/rutas.php")
    .then(function (response) {
      return response.json();
    })
    .then(function (rutas) {
      contenedorRutas.innerHTML = "";

      rutas.forEach(function (ruta) {
        const rutaHTML = `
          <a href="detalle-ruta.html?id=${ruta.id}" class="route-card p-4">
            <div class="row align-items-center">
              <div class="col-8 col-md-9">
                <div class="d-flex align-items-center gap-2 mb-3">
                  <span class="badge-soft-primary small">${ruta.tipo}</span>
                  <span class="text-secondary small fw-medium">• ${ruta.empresa}</span>
                </div>
                <div class="route-path">
                  <div class="route-dot start"></div>
                  <h6 class="fw-bold text-dark mb-3">${ruta.origen}</h6>
                  <div class="route-dot end"></div>
                  <h6 class="fw-bold text-dark mb-0">${ruta.destino}</h6>
                </div>
              </div>
              <div class="col-4 col-md-3 text-end d-flex flex-column align-items-end justify-content-between h-100">
                <span class="text-secondary small d-flex align-items-center gap-1 mb-2">
                  <i data-lucide="clock" style="width:14px;"></i> ${ruta.frecuencia}
                </span>
                <span class="fs-4 fw-bolder text-dark mb-2">₡${ruta.tarifa.toLocaleString("es-CR")}</span>
                <div class="btn-round-arrow">
                  <i data-lucide="chevron-right" style="width: 20px;"></i>
                </div>
              </div>
            </div>
          </a>
        `;

        contenedorRutas.innerHTML += rutaHTML;
      });

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    })
    .catch(function (error) {
      console.error("Error al cargar las rutas:", error);
    });
}

//Angelica actualizacion recorridos. 

document.addEventListener("DOMContentLoaded", function () {
  cargarDetalleRutaDesdeBackend();
});

function cargarDetalleRutaDesdeBackend() {
  const paginaActual = window.location.pathname;

  if (!paginaActual.includes("detalle-ruta.html")) {
    return;
  }

  const parametros = new URLSearchParams(window.location.search);
  const idRuta = parametros.get("id") || 1;

  fetch(`api/detalle-ruta.php?id=${idRuta}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (ruta) {
      actualizarDetalleRuta(ruta);
    })
    .catch(function (error) {
      console.error("Error al cargar el detalle de la ruta:", error);
    });
}

function actualizarDetalleRuta(ruta) {
  // Encabezado principal: San José -> Liberia
  const tituloRuta = document.querySelector("h1.fw-bolder");

  if (tituloRuta) {
    tituloRuta.innerHTML = `
      ${ruta.origen} 
      <i data-lucide="arrow-right" class="text-muted" style="width: 24px;"></i> 
      ${ruta.destino}
    `;
  }

  // Tipo de ruta y empresa
  const tipoRuta = document.querySelector(".badge-soft-primary");

  if (tipoRuta) {
    tipoRuta.textContent = ruta.tipo;
  }

  const empresaRuta = document.querySelector(".text-primary.small.fw-medium");

  if (empresaRuta) {
    empresaRuta.textContent = ruta.empresa;
  }

  // Tabla de horarios
  const tablaHorarios = document.querySelector("#horarios tbody");

  if (tablaHorarios && ruta.horarios) {
    tablaHorarios.innerHTML = "";

    ruta.horarios.forEach(function (horario) {
      tablaHorarios.innerHTML += `
        <tr class="border-bottom">
          <td class="ps-4 py-3 fw-medium text-dark">${horario.dia}</td>
          <td class="py-3 text-secondary">${horario.primerServicio}</td>
          <td class="py-3 text-secondary">${horario.ultimoServicio}</td>
          <td class="py-3 text-dark small">${horario.frecuencia}</td>
        </tr>
      `;
    });
  }

  // Recorrido y paradas
  const recorrido = document.querySelector(".detail-timeline");

  if (recorrido && ruta.paradas) {
    recorrido.innerHTML = "";

    ruta.paradas.forEach(function (parada, index) {
      let claseDot = "";

      if (index === 0) {
        claseDot = "primary";
      } else if (index === ruta.paradas.length - 1) {
        claseDot = "success";
      }

      recorrido.innerHTML += `
        <div class="detail-timeline-item">
          <div class="detail-timeline-dot ${claseDot}"></div>
          <h6 class="fw-bold text-dark mb-1">${parada.nombre}</h6>
          <p class="small text-secondary mb-0">${parada.descripcion}</p>
        </div>
      `;
    });
  }

  // Tarifa principal
  const tarifaPrincipal = document.querySelector("#tarifas h2");

  if (tarifaPrincipal) {
    tarifaPrincipal.textContent = `₡${Number(ruta.tarifa).toLocaleString("es-CR")}`;
  }

  // Información de empresa
  const infoEmpresa = document.querySelector(".col-lg-4 .p-4");

  if (infoEmpresa) {
    infoEmpresa.innerHTML = `
      <h6 class="fw-bold text-dark mb-3">Información de la empresa</h6>
      <div class="small text-secondary mb-2">
        <strong class="text-dark">Nombre:</strong> ${ruta.empresa}
      </div>
      <div class="small text-secondary mb-2">
        <strong class="text-dark">Teléfono:</strong> ${ruta.telefono}
      </div>
      <div class="small text-secondary mb-4">
        <strong class="text-dark">Email:</strong> ${ruta.email}
      </div>

      <button class="btn btn-light w-100 fw-medium text-secondary bg-slate-50 border">
        Reportar un problema
      </button>
    `;
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}