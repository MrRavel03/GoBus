// js/main.js
const API_BASE = "http://localhost:8080";

async function cargarPlantillas() {
  try {
    const respuestaHeader = await fetch("plantillas/header.html");
    const htmlHeader = await respuestaHeader.text();
    document.getElementById("header-container").innerHTML = htmlHeader;

    const respuestaFooter = await fetch("plantillas/footer.html");
    const htmlFooter = await respuestaFooter.text();

    if (document.getElementById("footer-container")) {
      document.getElementById("footer-container").innerHTML = htmlFooter;
    }

    marcarMenuActivo();
    actualizarHeaderInterfaz();
    lucide.createIcons();
  } catch (error) {
    console.error("Error cargando las plantillas:", error);
  }
}

function actualizarHeaderInterfaz(){
  const loggeado = localStorage.getItem('loggeado') === 'true';
  const rol = localStorage.getItem('usuarioRol');

  const linkAdmin = document.getElementById('link-admin-header');
  const linkFavoritos = document.getElementById('link-favoritos-header');
  const botonSesion = document.getElementById('btn-sesion-header');
  const linkPerfil = document.getElementById("link-perfil-header");

  if (loggeado){
    if (linkAdmin) linkAdmin.style.display = (rol === 'ADMIN') ? 'inline' : 'none';
    if (linkFavoritos) linkFavoritos.style.display = 'block';
    if (linkPerfil) linkPerfil.style.display = "inline";

    if (botonSesion) {
      botonSesion.innerHTML = '<i data-lucide="log-out" class="nav-icon"></i> Salir';
      botonSesion.href = "#";
      botonSesion.onclick = (e) => {
        e.preventDefault();
        cerrarSesion();
      };
    }
  } else {
    if (linkAdmin) linkAdmin.style.display = 'none';
    if (linkFavoritos) linkFavoritos.style.display = 'none';
    if (linkPerfil) linkPerfil.style.display = "none";

    if (botonSesion) {
      botonSesion.innerHTML = '<i data-lucide="log-in" class="nav-icon"></i> Ingresar';
      botonSesion.classList.replace('btn-outline-danger', 'btn-outline-light');
      botonSesion.href = "login.html";
      botonSesion.onclick = null;
    }
  }

  if (typeof lucide !== "undefined") lucide.createIcons();
}

function marcarMenuActivo() {
  let paginaActual = window.location.pathname.split("/").pop();
  if (paginaActual === "") paginaActual = "index.html";

  const enlaces = document.querySelectorAll("#header-container .nav-link");
  enlaces.forEach((enlace) => {
    enlace.classList.remove("active");
    const href = enlace.getAttribute("href");
    if (href === paginaActual) {
      enlace.classList.add("active");
    }
  });
}

function verContrasena(idBoton, idInput) {
  const btn = document.querySelector(idBoton);
  const input = document.querySelector(idInput);

  if (btn && input) {
    btn.addEventListener("click", function () {
      const tipo = input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", tipo);
      const icono = btn.querySelector("[data-lucide]");
      if (icono) {
        icono.setAttribute("data-lucide", tipo === "text" ? "eye" : "eye-off");
        lucide.createIcons();
      }
    });
  }
}

function crearCuenta() {
  const formulario = document.getElementById("registroFormulario");
  if (formulario) {
    formulario.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombreInput = document.querySelector('input[placeholder="Tu nombre y apellidos"]').value;
      const emailInput = document.getElementById("email").value;
      const passwordInput = document.getElementById("password").value;

      const usuarioDatos = { nombre: nombreInput, correo: emailInput, userPassword: passwordInput };

      try {
        const respuesta = await fetch(`${API_BASE}/usuarios`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuarioDatos),
        });

        if (respuesta.ok) {
          Swal.fire({
            title: "Exito",
            text: "Usuario registrado exitosamente",
            icon: "success",
            confirmButtonColor: "#0d6efd",
          }).then(() => {
            window.location.href = "login.html";
          });
        } else {
          Swal.fire({ title: "Error en registro", text: "Error al registrar el usuario", icon: "error", confirmButtonColor: "#fd0d0d" });
        }
      } catch (error) {
        console.error("Error de conexion:", error);
        Swal.fire({ title: "Error de conexion", text: "No se pudo conectar con el servidor", icon: "error", confirmButtonColor: "#cccbcb" });
      }
    });
  }
}

function iniciarSesion() {
  const formulario = document.getElementById("loginFormulario");
  if (formulario) {
    formulario.addEventListener("submit", async (e) => {
      e.preventDefault();
      const loginDatos = {
        correo: document.getElementById("email").value,
        userPassword: document.getElementById("password").value,
      };

      try {
        const respuesta = await fetch(`${API_BASE}/usuarios/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginDatos),
        });

        if (respuesta.ok){
          const usuario = await respuesta.json();
          localStorage.setItem("usuarioId", usuario.id);
          localStorage.setItem("usuarioNombre", usuario.nombre);
          localStorage.setItem("usuarioCorreo", usuario.correo);
          localStorage.setItem("usuarioRol", usuario.rol);
          localStorage.setItem("loggeado", "true");

          Swal.fire({
            title: "¡Bienvenido!",
            text: `Hola ${usuario.nombre}, qué bueno verte en GoBus`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            timerProgressBar: true,
          }).then(() => {
            window.location.href = "index.html";
          });
        } else {
          Swal.fire({ title: "Error de acceso", text: "Correo o contraseña incorrectos", icon: "error", confirmButtonColor: "#dc3545" });
        }
      } catch (error) {
        console.error("Error de conexion:", error);
        Swal.fire({ title: "Error de conexion", text: "No se pudo conectar con el servidor", icon: "error", confirmButtonColor: "#cccbcb" });
      }
    });
  }
}

function cerrarSesion() {
  Swal.fire({
    title: "¿Cerrar sesión?",
    text: "¿Estás seguro de que deseas salir de GoBus?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#0d6efd",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Sí, salir",
    cancelButtonText: "Cancelar",
  }).then((resultado) => {
    if (resultado.isConfirmed) {
      localStorage.clear();
      location.href = "index.html";
    }
  });
}

async function cargarUsuariosRecientes() {
  const contenedorUsuarios = document.getElementById("contenedor-usuarios-recientes");
  if (!contenedorUsuarios) return;

  try {
    const respuesta = await fetch(`${API_BASE}/usuarios`);
    const usuarios = await respuesta.json();

    if (usuarios.length === 0) {
      contenedorUsuarios.innerHTML = `
      <div class="text-center p-5 text-secondary">
      <i data-lucide="users-2" class="mb-3 opacity-20" style="width: 48px; height: 48px;"></i>
      <p class="small mb-0">No hay usuarios registrados todavía.</p>
      </div>`;
      lucide.createIcons();
      return;
    }

    let contenedorVacio = "";
    const ultimosCincoUsuarios = [...usuarios].reverse().slice(0, 4);

    ultimosCincoUsuarios.forEach((user) => {
      contenedorVacio += `
      <div class="list-group-item p-4 d-flex justify-content-between align-items-center fila-usuario">
        <div>
          <h6 class="fw-bold mb-1">${user.nombre}</h6>
          <p class="small text-secondary mb-0">${user.correo}</p>
        </div>
        <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
          ${user.rol === "ADMIN" ? "Admin" : "Usuario"}
        </span>
      </div>`;
    });

    contenedorUsuarios.innerHTML = contenedorVacio;
  } catch (error) {
    console.error("Error al cargar los usuarios", error);
  }
}

function formatearColones(valor) {
  const numero = Number(valor);
  return "₡" + (isNaN(numero) ? 0 : numero).toLocaleString("es-CR");
}

function llenarSelect(elemento, opciones, textoPorDefecto) {
  elemento.innerHTML = `<option value="">${textoPorDefecto}</option>`;
  opciones.forEach(function (opcion) {
    const item = document.createElement("option");
    item.value = opcion;
    item.textContent = opcion;
    elemento.appendChild(item);
  });
}

function cargarOpcionesBusqueda() {
  const selectOrigen = document.getElementById("select-origen");
  const selectDestino = document.getElementById("select-destino");

  if (!selectOrigen || !selectDestino) return;

  fetch(`${API_BASE}/api/rutas/origenes`)
    .then(response => response.json())
    .then(origenes => llenarSelect(selectOrigen, origenes, "Origen"))
    .catch(error => {
      console.error("Error al cargar los origenes:", error);
      selectOrigen.innerHTML = '<option value="">Origen no disponible</option>';
    });

  fetch(`${API_BASE}/api/rutas/destinos`)
    .then(response => response.json())
    .then(destinos => llenarSelect(selectDestino, destinos, "Destino"))
    .catch(error => {
      console.error("Error al cargar los destinos:", error);
      selectDestino.innerHTML = '<option value="">Destino no disponible</option>';
    });
}

function activarBusqueda() {
  const formulario = document.getElementById("formulario-busqueda");
  if (!formulario) return;

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();
    const origen = document.getElementById("select-origen").value;
    const destino = document.getElementById("select-destino").value;

    registrarBusqueda(origen, destino);

    const parametros = new URLSearchParams();
    if (origen) parametros.set("origen", origen);
    if (destino) parametros.set("destino", destino);

    window.location.href = "rutas.html?" + parametros.toString();
  });
}

function registrarBusqueda(origen, destino) {
  const idUsuario = localStorage.getItem("usuarioId");
  if (!idUsuario || (!origen && !destino)) return;

  fetch(`${API_BASE}/api/historial`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      origen: origen,
      destino: destino,
      usuario: { id: Number(idUsuario) },
    }),
  }).catch(error => console.error("Error al registrar la busqueda:", error));
}

function cargarPerfil() {
  const contenedorAvatar = document.getElementById("perfil-avatar");
  if (!contenedorAvatar) return;

  const idUsuario = localStorage.getItem("usuarioId");
  const nombre = localStorage.getItem("usuarioNombre");

  if (!idUsuario) {
    Swal.fire({
      title: "Inicia sesion",
      text: "Necesitas una cuenta para ver tu perfil",
      icon: "info",
      confirmButtonColor: "#0d6efd",
    }).then(() => { window.location.href = "login.html"; });
    return;
  }

  const iniciales = nombre ? nombre.trim().split(/\s+/).slice(0, 2).map(p => p[0].toUpperCase()).join("") : "?";
  contenedorAvatar.textContent = iniciales;
  document.getElementById("perfil-nombre").textContent = nombre || "Usuario";
  document.getElementById("perfil-correo").textContent = localStorage.getItem("usuarioCorreo") || "";

  const botonSalir = document.getElementById("btn-cerrar-sesion-perfil");
  if (botonSalir) botonSalir.addEventListener("click", (e) => { e.preventDefault(); cerrarSesion(); });

  const botonLimpiarHistorial = document.getElementById("btn-limpiar-historial");
  if (botonLimpiarHistorial) botonLimpiarHistorial.addEventListener("click", limpiarHistorialPerfil);

  cargarFavoritosPerfil(idUsuario);
  cargarHistorialPerfil(idUsuario);
}

async function cargarFavoritosPerfil(idUsuario) {
  const contenedor = document.getElementById("contenedor-perfil-favoritos");
  if (!contenedor) return;

  try {
    const respuesta = await fetch(`${API_BASE}/favoritos/usuario/${idUsuario}`);
    const favoritos = await respuesta.json();

    if (favoritos.length === 0) {
      contenedor.innerHTML = `
        <div class="col-12">
          <a href="rutas.html" class="btn-dashed w-100 d-flex flex-column align-items-center justify-content-center text-secondary py-5">
            <i data-lucide="plus-circle" style="width:32px; height:32px;" class="mb-2 text-muted"></i>
            <span class="fw-medium small">Aun no tienes rutas favoritas, buscá una</span>
          </a>
        </div>`;
      if (typeof lucide !== "undefined") lucide.createIcons();
      return;
    }

    let html = "";
    favoritos.forEach(function (favorito) {
      const ruta = favorito.ruta;
      html += `
        <div class="col">
          <div class="card h-100 rounded-xl border shadow-sm p-3 position-relative">
            <button type="button" class="btn btn-link text-secondary position-absolute top-0 end-0 p-3 shadow-none border-0 btn-quitar-favorito-perfil" data-favorito-id="${favorito.id}" title="Quitar de favoritos">
              <i data-lucide="trash-2" style="width:18px;"></i>
            </button>
            <div class="mb-3"><span class="badge-soft-primary small">${ruta.tipo}</span></div>
            <h5 class="fw-bold text-dark d-flex align-items-center gap-2">${ruta.origen} <i data-lucide="arrow-right" class="text-muted" style="width:16px;"></i> ${ruta.destino}</h5>
            <p class="small text-secondary mb-4">${ruta.empresa}</p>
            <div class="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
              <span class="fs-5 fw-bold text-dark">${formatearColones(ruta.tarifa)}</span>
              <a href="detalle-ruta.html?id=${ruta.id}" class="text-decoration-none small fw-bold d-flex align-items-center gap-1">Ver horarios <i data-lucide="chevron-right" style="width:16px;"></i></a>
            </div>
          </div>
        </div>`;
    });

    contenedor.innerHTML = html;
    if (typeof lucide !== "undefined") lucide.createIcons();

    contenedor.querySelectorAll(".btn-quitar-favorito-perfil").forEach(function (boton) {
      boton.addEventListener("click", async function () {
        await fetch(`${API_BASE}/favoritos/${boton.dataset.favoritoId}`, { method: "DELETE" });
        cargarFavoritosPerfil(idUsuario);
      });
    });
  } catch (error) {
    console.error("Error al cargar los favoritos del perfil:", error);
  }
}

async function cargarHistorialPerfil(idUsuario) {
  const contenedor = document.getElementById("contenedor-perfil-historial");
  if (!contenedor) return;

  try {
    const respuesta = await fetch(`${API_BASE}/api/historial/usuario/${idUsuario}`);
    const historial = await respuesta.json();

    if (historial.length === 0) {
      contenedor.innerHTML = `<p class="text-secondary small text-center py-5 mb-0">Aun no has hecho ninguna busqueda.</p>`;
      return;
    }

    let html = "";
    historial.forEach(function (busqueda) {
      const fecha = busqueda.fecha ? new Date(busqueda.fecha).toLocaleString("es-CR", { dateStyle: "medium", timeStyle: "short" }) : "";
      html += `
        <div class="bg-white border rounded-xl p-3 d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-3">
            <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center" style="width:36px; height:36px;">
              <i data-lucide="history" style="width:16px;"></i>
            </div>
            <div>
              <p class="fw-medium text-dark mb-0 small">${busqueda.origen || "Cualquier origen"} <i data-lucide="arrow-right" class="text-muted" style="width:14px;"></i> ${busqueda.destino || "Cualquier destino"}</p>
              <p class="text-secondary mb-0" style="font-size: 0.75rem;">${fecha}</p>
            </div>
          </div>
          <button type="button" class="btn btn-link text-secondary shadow-none border-0 btn-borrar-busqueda" data-busqueda-id="${busqueda.id}" title="Borrar del historial">
            <i data-lucide="x" style="width:18px;"></i>
          </button>
        </div>`;
    });

    contenedor.innerHTML = html;
    if (typeof lucide !== "undefined") lucide.createIcons();

    contenedor.querySelectorAll(".btn-borrar-busqueda").forEach(function (boton) {
      boton.addEventListener("click", async function () {
        await fetch(`${API_BASE}/api/historial/${boton.dataset.busquedaId}`, { method: "DELETE" });
        cargarHistorialPerfil(idUsuario);
      });
    });
  } catch (error) {
    console.error("Error al cargar el historial del perfil:", error);
  }
}

function limpiarHistorialPerfil() {
  const idUsuario = localStorage.getItem("usuarioId");
  if (!idUsuario) return;

  Swal.fire({
    title: "¿Limpiar historial?",
    text: "Se van a borrar todas tus busquedas guardadas",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    cancelButtonColor: "#6c757d",
    confirmButtonText: "Si, limpiar",
    cancelButtonText: "Cancelar",
  }).then(async (resultado) => {
    if (!resultado.isConfirmed) return;
    const respuesta = await fetch(`${API_BASE}/api/historial/usuario/${idUsuario}`);
    const historial = await respuesta.json();
    await Promise.all(historial.map((b) => fetch(`${API_BASE}/api/historial/${b.id}`, { method: "DELETE" })));
    cargarHistorialPerfil(idUsuario);
  });
}

var IMAGENES_POR_ORIGEN = {
  "san jose": "https://www.geckoroutes.com/images/wp-uploads/2021/10/Aerial-view-of-Costa-Ricas-San-Jose-city.jpg",
  alajuela: "https://costarica.org/wp-content/uploads/2014/12/Alajuela-Building1.jpg",
  heredia: "https://media.licdn.com/dms/image/v2/D4E12AQH8SKQDWor_kg/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1685067618225?e=2147483647&v=beta&t=oeppYclxfvpdzasfmjpxHMexONIh4HOb7n4X5l2lIDk",
  cartago: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaE_tmCJP22O6_1VPiT3T0YLbDwt-iOcdeJzvlS2TKlfRoTNDybGjDhqE&s=10",
  default: "https://img.magnific.com/vector-gratis/ubicacion-pin-ruta-bandera_78370-4270.jpg?semt=ais_hybrid&w=740&q=80",
};

function normalizarTexto(texto) {
  return (texto || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function obtenerImagenPorOrigen(origen) {
  const origenNormalizado = normalizarTexto(origen);
  for (const clave in IMAGENES_POR_ORIGEN) {
    if (clave !== "default" && origenNormalizado.includes(clave)) {
      return IMAGENES_POR_ORIGEN[clave];
    }
  }
  return IMAGENES_POR_ORIGEN["default"];
}

function mezclarArreglo(arreglo) {
  const copia = [...arreglo];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function cargarRutasDestacadas() {
  const contenedor = document.getElementById("contenedor-rutas-destacadas");
  if (!contenedor) return;

  fetch(`${API_BASE}/api/rutas`)
    .then(response => {
      if (!response.ok) throw new Error("El servidor respondio " + response.status);
      return response.json();
    })
    .then(rutas => {
      if (!Array.isArray(rutas) || rutas.length === 0) {
        contenedor.innerHTML = `<p class="text-center text-secondary">No hay rutas destacadas por ahora.</p>`;
        return;
      }
      const rutasElegidas = mezclarArreglo(rutas).slice(0, 3);
      let html = "";
      rutasElegidas.forEach(function (ruta) {
        const imagen = obtenerImagenPorOrigen(ruta.origen);
        html += `
          <div class="col">
            <a href="detalle-ruta.html?id=${ruta.id}" class="text-decoration-none">
              <div class="card h-100 card-route border-0 shadow-sm rounded-4 overflow-hidden">
                <div class="position-relative">
                  <img src="${imagen}" class="card-img-top" style="height: 220px; object-fit: cover; width: 100%;" alt="${ruta.destino}">
                  <div class="position-absolute top-0 end-0 m-3">
                    <span class="badge bg-white text-dark rounded-pill px-3 py-2 shadow-sm fs-6">${formatearColones(ruta.tarifa)}</span>
                  </div>
                </div>
                <div class="card-body p-4">
                  <h5 class="card-title fw-bold mb-1">${ruta.origen} - ${ruta.destino}</h5>
                  <p class="card-text text-muted small mb-3">${ruta.empresa}</p>
                  <div class="d-flex gap-3 small text-secondary">
                    <span class="d-flex align-items-center gap-1"><i data-lucide="clock" style="width:16px;"></i> ${ruta.frecuencia || "N/D"}</span>
                    <span class="d-flex align-items-center gap-1"><i data-lucide="map-pin" style="width:16px;"></i> ${ruta.tipo || "Directo"}</span>
                  </div>
                </div>
              </div>
            </a>
          </div>`;
      });
      contenedor.innerHTML = html;
      if (typeof lucide !== "undefined") lucide.createIcons();
    })
    .catch(error => {
      console.error("Error al cargar las rutas destacadas:", error);
      contenedor.innerHTML = `<p class="text-center text-danger">No se pudieron cargar las rutas destacadas.</p>`;
    });
}

let todasLasRutas = [];
const PROVINCIA_POR_ORIGEN = {
  "p-sanjose": ["san jose"],
  "p-alajuela": ["alajuela"],
  "p-cartago": ["cartago"],
  "p-heredia": ["heredia"],
  "p-guanacaste": ["guanacaste", "liberia", "nicoya", "santa cruz"],
  "p-puntarenas": ["puntarenas"],
  "p-limon": ["limon"]
};

const TIPO_POR_CHECKBOX = {
  "ts-urbano": "Urbano",
  "ts-interurbano": "Interurbano",
};

function cargarRutasDesdeBackend() {
  const contenedorRutas = document.getElementById("contenedor-rutas");
  if (!contenedorRutas) return;

  const filtros = new URLSearchParams(window.location.search);
  const parametros = new URLSearchParams();
  if (filtros.get("origen")) parametros.set("origen", filtros.get("origen"));
  if (filtros.get("destino")) parametros.set("destino", filtros.get("destino"));

  const url = parametros.toString() ? `${API_BASE}/api/rutas?` + parametros.toString() : `${API_BASE}/api/rutas`;

  cargarFavoritosDelUsuario().then(function () {
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error("El servidor respondio " + response.status);
        return response.json();
      })
      .then(rutas => {
        todasLasRutas = Array.isArray(rutas) ? rutas : [];
        pintarRutas(todasLasRutas);      
        activarFiltros();
        activarPaginacion();
      })
      .catch(error => {
        console.error("Error al cargar las rutas:", error);
        contenedorRutas.innerHTML = `<div class="text-center text-danger py-5">No se pudieron cargar las rutas. Revisa que el servidor este corriendo.</div>`;
      });
  });
}

const RUTAS_POR_PAGINA = 3;
let paginaActual = 1;
let rutasActualmentefiltradas = [];
let idsRutasFavoritas = new Set();

function pintarRutas(rutas) {
  const contenedorRutas = document.getElementById("contenedor-rutas");
  if (!contenedorRutas) return;

  rutasActualmentefiltradas = Array.isArray(rutas) ? rutas : [];

  if (rutasActualmentefiltradas.length === 0) {
    contenedorRutas.innerHTML = `<div class="text-center text-secondary py-5">No hay rutas que coincidan con tu busqueda.</div>`;
    pintarPaginacion();
    return;
  }

  const totalPaginas = Math.ceil(rutasActualmentefiltradas.length / RUTAS_POR_PAGINA);
  if (paginaActual > totalPaginas) paginaActual = 1;
  if (paginaActual < 1) paginaActual = 1;

  const inicio = (paginaActual - 1) * RUTAS_POR_PAGINA;
  const rutasDeEstaPagina = rutasActualmentefiltradas.slice(inicio, inicio + RUTAS_POR_PAGINA);

  let html = "";
  rutasDeEstaPagina.forEach(function (ruta) {
    const esFavorito = idsRutasFavoritas.has(ruta.id);
    html += `
      <div class="route-card p-4 position-relative">
        <button type="button" class="btn-favorito position-absolute z-3" style="top: 1.5rem; right: 1.5rem; background: none; border: none; padding: 0;" data-id-ruta="${ruta.id}">
          <i data-lucide="heart" style="width:20px;" ${esFavorito ? 'fill="#dc3545" stroke="#dc3545"' : ''}></i>
        </button>
        <a href="detalle-ruta.html?id=${ruta.id}" class="text-decoration-none text-dark">
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
              <span class="text-secondary small d-flex align-items-center gap-1 mb-2 me-4 pe-2 mt-1">
                <i data-lucide="clock" style="width:14px;"></i> ${ruta.frecuencia}
              </span>
              <span class="fs-4 fw-bolder text-dark mb-2 mt-2">${formatearColones(ruta.tarifa)}</span>
              <div class="btn-round-arrow">
                <i data-lucide="chevron-right" style="width: 20px;"></i>
              </div>
            </div>
          </div>
        </a>
      </div>`;
  });

  contenedorRutas.innerHTML = html;
  if (typeof lucide !== "undefined") lucide.createIcons();

  document.querySelectorAll("#contenedor-rutas .btn-favorito").forEach(function (boton) {
    boton.addEventListener("click", function (e) {
      e.preventDefault(); 
      const idRuta = Number(boton.getAttribute("data-id-ruta"));
      alternarFavorito(idRuta, boton);
    });
  });

  pintarPaginacion();
}

function pintarPaginacion() {
  const contenedorPaginacion = document.querySelector(".pagination");
  if (!contenedorPaginacion) return;

  const totalPaginas = Math.ceil(rutasActualmentefiltradas.length / RUTAS_POR_PAGINA);
  if (totalPaginas <= 1) {
    contenedorPaginacion.innerHTML = "";
    return;
  }

  let html = `<li class="page-item ${paginaActual === 1 ? "disabled" : ""}"><a class="page-link text-secondary border-0 bg-transparent" href="#" data-pagina="ant">Ant</a></li>`;
  for (let numero = 1; numero <= totalPaginas; numero++) {
    html += `<li class="page-item ${numero === paginaActual ? "active" : ""}"><a class="page-link ${numero === paginaActual ? "rounded bg-primary border-0" : "text-secondary border-0 bg-transparent"}" href="#" data-pagina="${numero}">${numero}</a></li>`;
  }
  html += `<li class="page-item ${paginaActual === totalPaginas ? "disabled" : ""}"><a class="page-link text-secondary border-0 bg-transparent" href="#" data-pagina="sig">Sig</a></li>`;

  contenedorPaginacion.innerHTML = html;
}

function activarPaginacion() {
  const contenedorPaginacion = document.querySelector(".pagination");
  if (!contenedorPaginacion) return;

  const nuevoContenedor = contenedorPaginacion.cloneNode(true);
  contenedorPaginacion.parentNode.replaceChild(nuevoContenedor, contenedorPaginacion);

  nuevoContenedor.addEventListener("click", function (e) {
    const link = e.target.closest("[data-pagina]");
    if (!link || link.parentElement.classList.contains('disabled')) return;

    e.preventDefault();
    const valor = link.getAttribute("data-pagina");
    const totalPaginas = Math.ceil(rutasActualmentefiltradas.length / RUTAS_POR_PAGINA);

    if (valor === "ant") {
      if (paginaActual > 1) paginaActual--;
    } else if (valor === "sig") {
      if (paginaActual < totalPaginas) paginaActual++;
    } else {
      paginaActual = parseInt(valor, 10);
    }

    pintarRutas(rutasActualmentefiltradas);
    document.getElementById("contenedor-rutas").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function obtenerUsuarioIdLogueado() {
  const loggeado = localStorage.getItem('loggeado') === 'true';
  const usuarioId = localStorage.getItem('usuarioId');
  return (loggeado && usuarioId) ? Number(usuarioId) : null;
}

function cargarFavoritosDelUsuario() {
  const usuarioId = obtenerUsuarioIdLogueado();
  if (!usuarioId) {
    idsRutasFavoritas = new Set();
    return Promise.resolve();
  }

  return fetch(`${API_BASE}/favoritos/usuario/${usuarioId}`)
    .then(response => {
      if (!response.ok) throw new Error("No se pudieron cargar los favoritos");
      return response.json();
    })
    .then(favoritos => {
      idsRutasFavoritas = new Set(favoritos.map(fav => fav.ruta.id));
    })
    .catch(error => {
      console.error("Error al cargar favoritos:", error);
      idsRutasFavoritas = new Set();
    });
}

function alternarFavorito(idRuta, botonCorazon, onCambio) {
  const usuarioId = obtenerUsuarioIdLogueado();
  if (!usuarioId) {
    Swal.fire({ title: 'Inicia sesion', text: 'Debes iniciar sesion para guardar rutas favoritas', icon: 'info', confirmButtonColor: '#0d6efd' });
    return;
  }

  const yaEsFavorito = idsRutasFavoritas.has(idRuta);

  if (yaEsFavorito) {
    fetch(`${API_BASE}/favoritos/usuario/${usuarioId}/ruta/${idRuta}`, { method: "DELETE" })
      .then(response => {
        if (!response.ok) throw new Error("No se pudo quitar el favorito");
        idsRutasFavoritas.delete(idRuta);
        actualizarIconoFavorito(botonCorazon, false);
        if (typeof onCambio === "function") onCambio(false);
      })
      .catch(error => console.error(error));
  } else {
    fetch(`${API_BASE}/favoritos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario: { id: usuarioId }, ruta: { id: idRuta } })
    })
      .then(response => {
        if (!response.ok) throw new Error("No se pudo guardar el favorito");
        idsRutasFavoritas.add(idRuta);
        actualizarIconoFavorito(botonCorazon, true);
        if (typeof onCambio === "function") onCambio(true);
      })
      .catch(error => console.error(error));
  }
}

function actualizarIconoFavorito(botonCorazon, esFavorito) {
  if (!botonCorazon) return;
  botonCorazon.innerHTML = esFavorito
    ? '<i data-lucide="heart" style="width:18px;" fill="#dc3545" stroke="#dc3545"></i>'
    : '<i data-lucide="heart" style="width:18px;"></i>';
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function pintarEstadoBotonFavorito(boton, textoSpan, esFavorito) {
  const icono = boton.querySelector('[data-lucide="heart"]');
  if (icono) {
    if (esFavorito) {
      icono.setAttribute("fill", "#dc3545");
      icono.setAttribute("stroke", "#dc3545");
    } else {
      icono.removeAttribute("fill");
      icono.setAttribute("stroke", "currentColor");
    }
  }
  if (textoSpan) textoSpan.textContent = esFavorito ? "Guardado" : "Guardar";
  if (typeof lucide !== "undefined") lucide.createIcons();
}

function aplicarFiltros() {
  const provinciasMarcadas = Object.keys(PROVINCIA_POR_ORIGEN).filter(id => {
    const el = document.getElementById(id);
    return el && el.checked;
  });

  const tiposMarcados = Object.keys(TIPO_POR_CHECKBOX).filter(id => {
    const el = document.getElementById(id);
    return el && el.checked;
  }).map(id => TIPO_POR_CHECKBOX[id]);

  const inputBusqueda = document.getElementById("buscador-texto");
  const textoBusqueda = normalizarTexto(inputBusqueda ? inputBusqueda.value : "");

  const rutasFiltradas = todasLasRutas.filter(function (ruta) {
    const origenNormalizado = normalizarTexto(ruta.origen);
    const destinoNormalizado = normalizarTexto(ruta.destino);
    const coincideProvincia = provinciasMarcadas.some(id => {
      return PROVINCIA_POR_ORIGEN[id].some(palabra => origenNormalizado.includes(palabra) || destinoNormalizado.includes(palabra));
    });

    const coincideTipo = tiposMarcados.length === 0 ? false : tiposMarcados.includes(ruta.tipo);
    const coincideTexto = textoBusqueda === "" || [ruta.origen, ruta.destino, ruta.empresa].some(c => normalizarTexto(c).includes(textoBusqueda));

    return coincideProvincia && coincideTipo && coincideTexto;
  });

  pintarRutas(rutasFiltradas);
}

function activarFiltros() {
  Object.keys(PROVINCIA_POR_ORIGEN).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", aplicarFiltros);
  });
  Object.keys(TIPO_POR_CHECKBOX).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", aplicarFiltros);
  });
  const inputBusqueda = document.getElementById("buscador-texto");
  if (inputBusqueda) inputBusqueda.addEventListener("input", aplicarFiltros);

  const btnLimpiar = document.getElementById("btn-limpiar-filtros");
  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", function () {
      Object.keys(PROVINCIA_POR_ORIGEN).forEach(id => { const el = document.getElementById(id); if (el) el.checked = true; });
      Object.keys(TIPO_POR_CHECKBOX).forEach(id => { const el = document.getElementById(id); if (el) el.checked = true; });
      if (inputBusqueda) inputBusqueda.value = "";
      aplicarFiltros();
    });
  }
}

function cargarDetalleRutaDesdeBackend() {
  const paginaActual = window.location.pathname;
  if (!paginaActual.includes("detalle-ruta.html")) return;

  const parametros = new URLSearchParams(window.location.search);
  const idRuta = parametros.get("id") || 1;

  cargarFavoritosDelUsuario().then(function () {
    fetch(`${API_BASE}/api/rutas/${idRuta}`)
      .then(response => {
        if (!response.ok) throw new Error("No se encontro la ruta " + idRuta);
        return response.json();
      })
      .then(ruta => { actualizarDetalleRuta(ruta); })
      .catch(error => console.error("Error al cargar el detalle de la ruta:", error));
  });
}

function actualizarDetalleRuta(ruta) {
  const tituloRuta = document.querySelector("h1.fw-bolder");
  if (tituloRuta) {
    tituloRuta.innerHTML = `${ruta.origen} <i data-lucide="arrow-right" class="text-muted" style="width: 24px;"></i> ${ruta.destino}`;
  }
  document.querySelector(".badge-soft-primary").textContent = ruta.tipo || "Urbano";
  document.querySelector(".text-primary.small.fw-medium").textContent = ruta.empresa;

  const badgeEstado = document.getElementById("badge-estado-servicio");
  if (badgeEstado) {
    const estadoRevision = ruta.estado === "En revisión";
    badgeEstado.textContent = estadoRevision ? "En revisión" : "Servicio Activo";
    badgeEstado.className = `badge ${estadoRevision ? "bg-warning bg-opacity-10 text-warning border border-warning-subtle" : "badge-soft-success"}`;
  }

  const tablaHorarios = document.getElementById("tabla-horarios-cuerpo");
  if (tablaHorarios && ruta.horarios) {
    let horarios = "";
    ruta.horarios.forEach((horario) => {
      horarios += `<tr class="border-bottom"><td class="ps-4 py-3 fw-medium text-dark">${horario.dia}</td><td class="py-3 text-secondary">${horario.primerServicio}</td><td class="py-3 text-secondary">${horario.ultimoServicio}</td><td class="py-3 text-dark small">Cada ${horario.frecuencia || "Consultar"}</td></tr>`;
    });
    tablaHorarios.innerHTML = horarios;
  }

  const recorrido = document.querySelector(".detail-timeline");
  if (recorrido && ruta.paradas && ruta.paradas.length > 0) {
    let htmlParadas = "";
    ruta.paradas.forEach(function (parada, index) {
      let claseDot = index === 0 ? "primary" : (index === ruta.paradas.length - 1 ? "success" : "");
      htmlParadas += `<div class="detail-timeline-item" onclick="enfocarParada(${index}, ${parada.latitud}, ${parada.longitud})" style="cursor: pointer;"><div class="detail-timeline-dot ${claseDot}"></div><h6 class="fw-bold text-dark mb-1">${parada.nombre}</h6><p class="small text-secondary mb-0">${parada.descripcion || ''}</p></div>`;
    });
    recorrido.innerHTML = htmlParadas;
  }

  const tarifaPrincipal = document.querySelector("#tarifas h2");
  if (tarifaPrincipal) tarifaPrincipal.textContent = formatearColones(ruta.tarifa);

  const infoEmpresa = document.querySelector(".col-lg-4 .p-4");
  if (infoEmpresa) {
    infoEmpresa.innerHTML = `
      <h6 class="fw-bold text-dark mb-3">Información de la empresa</h6>
      <div class="small text-secondary mb-2"><strong class="text-dark">Nombre:</strong> ${ruta.empresa}</div>
      <div class="small text-secondary mb-2"><strong class="text-dark">Teléfono:</strong> ${ruta.telefono || "No disponible"}</div>
      <div class="small text-secondary mb-4"><strong class="text-dark">Email:</strong> ${ruta.email || "No disponible"}</div>
      <button class="btn btn-light w-100 fw-medium text-secondary bg-slate-50 border" data-bs-toggle="modal" data-bs-target="#modalReporte">Reportar un problema</button>`;
  }

  const botonFavorito = document.getElementById("btn-favorito-detalle");
  const textoFavorito = document.getElementById("texto-favorito-detalle");
  if (botonFavorito) {
    const yaEsFavorito = idsRutasFavoritas.has(ruta.id);
    pintarEstadoBotonFavorito(botonFavorito, textoFavorito, yaEsFavorito);
    botonFavorito.onclick = function () {
      alternarFavorito(ruta.id, botonFavorito, function (esFavoritoAhora) {
        pintarEstadoBotonFavorito(botonFavorito, textoFavorito, esFavoritoAhora);
      });
    };
  }

  if (typeof lucide !== "undefined") lucide.createIcons();
  inicializarMapaDetalleRuta(ruta.paradas);
}

async function cargarRutasPanelAdmin() {
  const tablaAdmin = document.querySelector("#tabla-rutas-admin");
  if (!tablaAdmin) return;

  tablaAdmin.innerHTML = '<tr><td colspan="7" class="text-center">Actualizando...</td></tr>';
  try {
    const respuesta = await fetch(`${API_BASE}/api/rutas`);
    const rutas = await respuesta.json();
    let filasHTML = "";
    rutas.forEach((ruta) => {
      const badgeColor = ruta.estado === "Activa" ? "bg-success" : "bg-warning";
      filasHTML += `
      <tr class="border-bottom">
        <td class="ps-4 py-3 fw-bold text-dark">${ruta.origen} - ${ruta.destino}</td>
        <td class="py-3 text-secondary">${ruta.empresa}</td>
        <td class="py-3 text-secondary">${ruta.tipo}</td>
        <td class="py-3 fw-bolder text-dark">₡${(ruta.tarifa || 0).toLocaleString("es-CR")}</td>
        <td class="py-3">${ruta.frecuencia || "N/A"}</td>
        <td class="py-3"><span class="badge ${badgeColor} bg-opacity-10 ${badgeColor.replace("bg-", "text-")} rounded-pill px-3">${ruta.estado || "Activa"}</span></td>
        <td class="py-3 text-end pe-4">
          <div class="d-flex gap-2 justify-content-end">
            <button onclick="gestionarHorarios(${ruta.id}, '${ruta.origen} - ${ruta.destino}')" class="btn btn-sm btn-info text-white"><i data-lucide="clock" style="width:14px;"></i> Horarios</button>
            <button onclick="gestionarParadas(${ruta.id}, '${ruta.origen} - ${ruta.destino}')" class="btn btn-sm btn-warning text-dark"><i data-lucide="map-pin" style="width:14px;"></i> Paradas</button>
            <button onclick="prepararEdicion(${ruta.id})" class="btn btn-sm btn-light border">Editar</button>
            <button onclick="eliminarRuta(${ruta.id})" class="btn btn-sm btn-outline-danger">Eliminar</button>
          </div>
        </td>
      </tr>`;
    });
    tablaAdmin.innerHTML = filasHTML;
    if (typeof lucide !== "undefined") lucide.createIcons();
  } catch (error) {
    console.error("Error al conectar con la API de rutas:", error);
    tablaAdmin.innerHTML = '<tr><td colspan="7" class="text-danger text-center">Error al cargar datos</td></tr>';
  }
}

async function guardarRuta(e) {
  e.preventDefault();
  const idRuta = document.getElementById("rutaID").value;
  const datosRuta = {
    origen: document.getElementById("origen").value,
    destino: document.getElementById("destino").value,
    empresa: document.getElementById("empresa").value,
    tarifa: parseFloat(document.getElementById("tarifa").value) || 0,
    frecuencia: document.getElementById("frecuencia").value,
    tipo: document.getElementById("tipo").value,
    estado: document.getElementById("estado").value,
    telefono: document.getElementById("telefonoEmpresa").value,
    email: document.getElementById("emailEmpresa").value,
  };

  let url = `${API_BASE}/api/rutas`;
  let metodo = "POST";
  if (idRuta && idRuta.trim() !== "") {
    url = `${API_BASE}/api/rutas/${idRuta}`;
    metodo = "PUT";
    datosRuta.id = parseInt(idRuta, 10);
  }

  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosRuta),
    });
    if (respuesta.ok) {
      Swal.fire("¡Éxito!", `La ruta se ${metodo === "PUT" ? "actualizó" : "guardó"} correctamente`, "success");
      const elementoModal = document.getElementById("modalRuta");
      const modal = bootstrap.Modal.getInstance(elementoModal);
      if (modal) modal.hide();
      limpiarFormularioRuta();
      cargarRutasPanelAdmin();
    } else {
      Swal.fire("Error", "No se pudo guardar la ruta", "error");
    }
  } catch (error) {
    console.error("Error al guardar la ruta:", error);
    Swal.fire("Error", "Error de conexión con el servidor", "error");
  }
}

async function prepararEdicion(id) {
  try {
    const respuesta = await fetch(`${API_BASE}/api/rutas/${id}`);
    const ruta = await respuesta.json();
    document.getElementById("modalTitulo").innerText = "Editar ruta";
    document.getElementById("rutaID").value = ruta.id;
    document.getElementById("origen").value = ruta.origen || "";
    document.getElementById("destino").value = ruta.destino || "";
    document.getElementById("empresa").value = ruta.empresa || "";
    document.getElementById("tarifa").value = ruta.tarifa || 0;
    document.getElementById("frecuencia").value = ruta.frecuencia || "";
    document.getElementById("tipo").value = ruta.tipo || "Urbano";
    document.getElementById("estado").value = ruta.estado || "Activa";
    document.getElementById("telefonoEmpresa").value = ruta.telefono || "";
    document.getElementById("emailEmpresa").value = ruta.email || "";
    const modalRuta = new bootstrap.Modal(document.getElementById("modalRuta"));
    modalRuta.show();
  } catch (error) {
    console.error("Error al cargar datos para editar:", error);
  }
}

async function eliminarRuta(id) {
  const result = await Swal.fire({
    title: "¿Eliminar ruta?", text: "Esta acción no se puede deshacer", icon: "warning",
    showCancelButton: true, confirmButtonColor: "#dc3545", confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
  });
  if (result.isConfirmed) {
    try {
      const respuesta = await fetch(`${API_BASE}/api/rutas/${id}`, { method: "DELETE" });
      if (respuesta.ok) {
        Swal.fire("Eliminada", "La ruta ha sido borrada", "success");
        cargarRutasPanelAdmin();
      }
    } catch (error) { Swal.fire("Error", "No se pudo conectar con el servidor", "error"); }
  }
}

function limpiarFormularioRuta() {
  document.getElementById("modalTitulo").innerText = "Agregar nueva ruta";
  document.getElementById("formularioRuta").reset();
  document.getElementById("rutaID").value = "";
}

async function gestionarHorarios(idRuta, nombre) {
  document.getElementById("rutaIdDestino").value = idRuta;
  document.getElementById("nombreRutaHorario").innerText = nombre;
  document.getElementById("formularioNuevoHorario").reset();

  const respuesta = await fetch(`${API_BASE}/api/rutas/${idRuta}`);
  const ruta = await respuesta.json();
  const contenedor = document.getElementById("listaHorariosRuta");
  contenedor.innerHTML = "";

  ruta.horarios.forEach((h) => {
    contenedor.innerHTML += `
      <div class="list-group-item d-flex justify-content-between align-items-center">
        <span><strong>${h.dia}:</strong> ${h.primerServicio} - ${h.ultimoServicio} <span class="text-muted ms-1">(Cada ${h.frecuencia})</span></span>
        <button onclick="eliminarHorario(${h.id}, ${idRuta}, '${nombre}')" class="btn btn-sm text-danger border-0">Borrar</button>
      </div>`;
  });

  const modalElemento = document.getElementById("modalHorarios");
  if (!modalElemento.classList.contains("show")) {
    const modalBootstrap = new bootstrap.Modal(modalElemento);
    modalBootstrap.show();
  }
}

async function guardarHorario(e) {
  e.preventDefault();
  const dia = document.getElementById("horarioDia").value.trim();
  const primerServicio = document.getElementById("horarioInicio").value.trim();
  const ultimoServicio = document.getElementById("horarioFin").value.trim();
  const numFrecuenciaInput = document.getElementById("horarioFrecuenciaNum");
  const unidadFrecuenciaInput = document.getElementById("horarioFrecuenciaUnidad");
  const numFrecuencia = numFrecuenciaInput ? parseInt(numFrecuenciaInput.value.trim(), 10) : 0;
  const unidadFrecuencia = unidadFrecuenciaInput ? unidadFrecuenciaInput.value : "min";
  const frecuencia = `${numFrecuencia} ${unidadFrecuencia}`;
  const rutaId = document.getElementById("rutaIdDestino").value;

  if (!dia || !primerServicio || !ultimoServicio) {
    Swal.fire({ icon: "warning", title: "Campos incompletos", text: "Por favor complete todos los campos", confirmButtonColor: "#0d6efd" });
    return;
  }

  const datosHorarios = { dia, primerServicio, ultimoServicio, frecuencia, ruta: { id: Number(rutaId) } };
  try {
    const respuesta = await fetch(`${API_BASE}/api/horarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosHorarios),
    });
    if (respuesta.ok) {
      const nombreRuta = document.getElementById("nombreRutaHorario").innerText;
      document.getElementById("formularioNuevoHorario").reset();
      gestionarHorarios(rutaId, nombreRuta);
      Swal.fire({ title: "¡Agregado!", icon: "success", timer: 1000, showConfirmButton: false });
    }
  } catch (error) { console.error("Error al guardar horario:", error); }
}

async function eliminarHorario(idHorario, idRuta, nombreRuta) {
  const result = await Swal.fire({ title: "¿Eliminar este horario?", icon: "warning", showCancelButton: true, confirmButtonColor: "#dc3545", confirmButtonText: "Sí, eliminar" });
  if (result.isConfirmed) {
    const respuesta = await fetch(`${API_BASE}/api/horarios/${idHorario}`, { method: "DELETE" });
    if (respuesta.ok) {
      Swal.fire({ title: "Eliminado!", icon: "success", timer: 1000, showConfirmButton: false });
      gestionarHorarios(idRuta, nombreRuta);
    }
  }
}

var mapaAdmin = null;
var seleccionMarcador = null;
var mapaDetalle = null;

async function gestionarParadas(idRuta, nombreRuta) {
  document.getElementById("rutaIdParaParada").value = idRuta;
  document.getElementById("nombreRutaParada").innerText = nombreRuta;

  const res = await fetch(`${API_BASE}/api/rutas/${idRuta}`);
  const ruta = await res.json();
  const contenedor = document.getElementById("listaParadasRuta");
  contenedor.innerHTML = "";
  ruta.paradas.forEach((p) => {
    contenedor.innerHTML += `
       <div class="list-group-item d-flex justify-content-between align-items-center">
       <span><strong>${p.nombre}</strong> <br><p class="small text-secondary mb-0">${p.descripcion || ""}</p><small class="text-muted">Lat: ${p.latitud.toFixed(4)} | Lon: ${p.longitud.toFixed(4)}</small></span>
       <button onclick="eliminarParada(${p.id}, ${idRuta}, '${nombreRuta}')" class="btn btn-sm text-danger border-0">Borrar</button>
       </div>`;
  });

  const modal = document.getElementById("modalParadas");
  bootstrap.Modal.getOrCreateInstance(modal).show();
  setTimeout(() => prepararMapaAdmin(), 500);
}

function prepararMapaAdmin() {
  if (mapaAdmin) mapaAdmin.remove();
  seleccionMarcador = null;

  mapaAdmin = L.map("mapa-admin-selector").setView([9.9333, -84.0833], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapaAdmin);

  mapaAdmin.on("click", async function (e) {
    const latitud = e.latlng.lat;
    const longitud = e.latlng.lng;
    document.getElementById("p_lat").value = latitud;
    document.getElementById("p_lon").value = longitud;

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}`);
      const datos = await res.json();
      if (datos.display_name) {
        const partes = datos.display_name.split(",");
        document.getElementById("paradaDescripcion").value = partes.slice(0, 3).join(",").trim();
      }
    } catch (e) { console.log("No se pudo obtener la dirección automática."); }

    if (seleccionMarcador) seleccionMarcador.setLatLng(e.latlng);
    else seleccionMarcador = L.marker(e.latlng).addTo(mapaAdmin);
  });
}

async function guardarParada(e) {
  e.preventDefault();
  const idRuta = document.getElementById("rutaIdParaParada").value;
  const nombreRuta = document.getElementById("nombreRutaParada").innerText;

  const datos = {
    nombre: document.getElementById("paradaNombre").value,
    descripcion: document.getElementById("paradaDescripcion").value,
    latitud: parseFloat(document.getElementById("p_lat").value),
    longitud: parseFloat(document.getElementById("p_lon").value),
    ruta: { id: Number(idRuta) },
  };

  const res = await fetch(`${API_BASE}/api/paradas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  if (res.ok) {
    document.getElementById("formNuevaParada").reset();
    if (seleccionMarcador && mapaAdmin) {
      mapaAdmin.removeLayer(seleccionMarcador);
      seleccionMarcador = null;
    }
    gestionarParadas(idRuta, nombreRuta);
    Swal.fire({ title: "¡Parada registrada!", icon: "success", timer: 1000, showConfirmButton: false, target: document.getElementById("modalParadas") });
  }
}

var marcadoresRuta = [];

function inicializarMapaDetalleRuta(paradas) {
  if (mapaDetalle) mapaDetalle.remove();
  if (!paradas || paradas.length === 0) return;

  mapaDetalle = L.map("mapa-interactivo").setView([paradas[0].latitud, paradas[0].longitud], 14);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapaDetalle);

  marcadoresRuta = [];
  paradas.forEach((p, index) => {
    const marcador = L.marker([p.latitud, p.longitud]).addTo(mapaDetalle).bindPopup(`<b>${p.nombre}</b><br>${p.descripcion || 'Sin descripción'}`);
    marcadoresRuta[index] = marcador;
  });
}

function enfocarParada(index, latitud, longitud) {
  if (!mapaDetalle) return;
  mapaDetalle.flyTo([latitud, longitud], 16, { animate: true, duration: 1.5 });
  if (marcadoresRuta[index]) marcadoresRuta[index].openPopup();
}

async function eliminarParada(idParada, idRuta, nombreRuta) {
  const resultado = await Swal.fire({ title: "¿Eliminar parada?", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar", target: document.getElementById("modalParadas") });
  if (resultado.isConfirmed) {
    const res = await fetch(`${API_BASE}/api/paradas/${idParada}`, { method: "DELETE" });
    if (res.ok) {
      Swal.fire({ title: "Eliminada", icon: "success", timer: 1000, showConfirmButton: false, target: document.getElementById("modalParadas") });
      gestionarParadas(idRuta, nombreRuta);
    }
  }
}

function forzarCierreModal() {
  document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "auto";
  document.body.style.paddingRight = "0";
}

async function cargarReportes() {
  const contenedor = document.getElementById("contenedor-reportes-recientes");
  if (!contenedor) return;

  try {
    const res = await fetch(`${API_BASE}/api/reportes`);
    const reportes = await res.json();
    let html = "";
    if (reportes.length > 0) {
      [...reportes].reverse().slice(0, 3).forEach((rep) => {
        const badgeColor = rep.estado === "Pendiente" ? "bg-warning" : "bg-success";
        html += `<div class="list-group-item p-4 border-0 border-bottom"><h6 class="fw-bold mb-1">${rep.tipo}</h6><p class="small text-secondary mb-1">Ruta: ${rep.rutaNombre}</p><span class="badge ${badgeColor} bg-opacity-10 ${badgeColor.replace("bg-", "text-")}">${rep.estado}</span></div>`;
      });
      contenedor.innerHTML = html;
    } else {
      contenedor.innerHTML = `<div class="text-center py-5"><p class="text-secondary mb-0 fs-6">No hay reportes pendientes por revisar</p></div>`;
    }
  } catch (error) {
    contenedor.innerHTML = '<p class="p-4 text-center text-danger small">Error al conectar con el servidor de reportes.</p>';
  }
}

document.addEventListener("DOMContentLoaded", function () {
  Promise.all([
    cargarPlantillas(),
    cargarUsuariosRecientes(),
    cargarRutasPanelAdmin(),
    cargarRutasDesdeBackend(),
    cargarDetalleRutaDesdeBackend(),
    cargarOpcionesBusqueda(),
    activarBusqueda(),
    cargarRutasDestacadas(),
    cargarReportes(),
    cargarPaginaFavoritos(),
  ]).then(() => {
    console.log("Datos dinamicos cargados");
  });

  crearCuenta();
  iniciarSesion();
  verContrasena("#togglePassword", "#password");
  cargarPerfil();

  const formularioRuta = document.getElementById("formularioRuta");
  if (formularioRuta) formularioRuta.addEventListener("submit", guardarRuta);
});

function cargarPaginaFavoritos() {
  const contenedor = document.getElementById("contenedor-favoritos");
  if (!contenedor) return;

  const usuarioId = obtenerUsuarioIdLogueado();
  if (!usuarioId) {
    contenedor.innerHTML = `<div class="text-center text-secondary py-5"><p class="mb-3">Debes iniciar sesion para ver tus rutas favoritas.</p><a href="login.html" class="btn btn-auth-primary">Iniciar sesion</a></div>`;
    return;
  }

  fetch(`${API_BASE}/favoritos/usuario/${usuarioId}`)
    .then(response => { if (!response.ok) throw new Error(); return response.json(); })
    .then(favoritos => {
      idsRutasFavoritas = new Set(favoritos.map(fav => fav.ruta.id));
      pintarTarjetasFavoritos(favoritos);
    })
    .catch(() => { contenedor.innerHTML = `<div class="text-center text-danger py-5">No se pudieron cargar tus favoritos.</div>`; });
}

function pintarTarjetasFavoritos(favoritos) {
  const contenedor = document.getElementById("contenedor-favoritos");
  if (!contenedor) return;

  if (!Array.isArray(favoritos) || favoritos.length === 0) {
    contenedor.innerHTML = `<div class="text-center text-secondary py-5">Aun no tienes rutas guardadas como favoritas.</div>`;
    return;
  }

  let html = "";
  favoritos.forEach(function (favorito) {
    const ruta = favorito.ruta;
    html += `
      <div class="route-card p-4 position-relative">
        <button type="button" class="btn-favorito position-absolute z-3" style="top: 1.5rem; right: 1.5rem; background: none; border: none; padding: 0;" data-id-ruta="${ruta.id}">
          <i data-lucide="heart" style="width:20px;" fill="#dc3545" stroke="#dc3545"></i>
        </button>
        <a href="detalle-ruta.html?id=${ruta.id}" class="text-decoration-none text-dark">
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
              <span class="text-secondary small d-flex align-items-center gap-1 mb-2 me-4 pe-2 mt-1"><i data-lucide="clock" style="width:14px;"></i> ${ruta.frecuencia}</span>
              <span class="fs-4 fw-bolder text-dark mb-2 mt-2">${formatearColones(ruta.tarifa)}</span>
              <div class="btn-round-arrow"><i data-lucide="chevron-right" style="width: 20px;"></i></div>
            </div>
          </div>
        </a>
      </div>`;
  });

  contenedor.innerHTML = html;
  if (typeof lucide !== "undefined") lucide.createIcons();

  document.querySelectorAll("#contenedor-favoritos .btn-favorito").forEach(function (boton) {
    boton.addEventListener("click", function (e) {
      e.preventDefault();
      const idRuta = Number(boton.getAttribute("data-id-ruta"));
      const tarjeta = boton.closest(".route-card");
      alternarFavorito(idRuta, boton, function (esFavoritoAhora) {
        if (!esFavoritoAhora && tarjeta) {
          tarjeta.remove();
          if (document.querySelectorAll("#contenedor-favoritos .route-card").length === 0) {
            pintarTarjetasFavoritos([]);
          }
        }
      });
    });
  });
}