// js/main.js
const API_BASE = "http://localhost:8080";
async function cargarPlantillas() {
  try {
    // 1. Cargar el Header
    const respuestaHeader = await fetch("plantillas/header.html");
    const htmlHeader = await respuestaHeader.text();
    document.getElementById("header-container").innerHTML = htmlHeader;

    // 2. Cargar el Footer
    const respuestaFooter = await fetch("plantillas/footer.html");
    const htmlFooter = await respuestaFooter.text();

    // Verificamos si la página tiene footer (el login quizás no lo necesite)
    if (document.getElementById("footer-container")) {
      document.getElementById("footer-container").innerHTML = htmlFooter;
    }

    // 3. Activar el menú correspondiente según la página actual
    marcarMenuActivo();

    //4. Actualizar la interfaz segun el rol del usuario
    actualizarHeaderInterfaz();

    // 5. Inicializar los íconos de Lucide UNA sola vez al final
    lucide.createIcons();
  } catch (error) {
    console.error("Error cargando las plantillas:", error);
  }
}

function actualizarHeaderInterfaz(){
  const loggeado= localStorage.getItem('loggeado')==='true';
  const rol= localStorage.getItem('usuarioRol');

  const linkAdmin= document.getElementById('link-admin-header');
  const linkFavoritos = document.getElementById('link-favoritos-header');
  const botonSesion= document.getElementById('btn-sesion-header');
  const linkPerfil = document.getElementById("link-perfil-header");

  if (loggeado){
    if (linkAdmin){
      linkAdmin.style.display=(rol==='ADMIN')?'inline':'none';
    }

    if (linkFavoritos){     
      linkFavoritos.style.display = 'block';
    }

    if (linkPerfil) {
      linkPerfil.style.display = "inline";
    }

    if (botonSesion) {
      botonSesion.innerHTML =
        '<i data-lucide="log-out" class="nav-icon"></i> Salir';
      botonSesion.href = "#";

      botonSesion.onclick = (e) => {
        e.preventDefault();
        cerrarSesion();
      };
    }
    }else{

      if (linkAdmin){
      linkAdmin.style.display = 'none';
    }

    if (linkFavoritos){        
      linkFavoritos.style.display = 'none';
    }

    if (linkPerfil) {
      linkPerfil.style.display = "none";
    }

    if (botonSesion) {
      botonSesion.innerHTML =
        '<i data-lucide="log-in" class="nav-icon"></i> Ingresar';
      botonSesion.classList.replace("btn-outline-danger", "btn-outline-light");
      botonSesion.href = "login.html";
      botonSesion.onclick = null;
    }

    if (botonSesion){
      botonSesion.innerHTML='<i data-lucide="log-in" class="nav-icon"></i> Ingresar';
      botonSesion.classList.replace('btn-outline-danger', 'btn-outline-light')
      botonSesion.href="login.html";
      botonSesion.onclick=null;
    }
    

    if (typeof lucide!=="undefined") lucide.createIcons();


  }

// Función para resaltar la página actual en el menú
function marcarMenuActivo() {
  // Obtenemos el nombre del archivo actual de la URL (ej. 'rutas.html')
  let paginaActual = window.location.pathname.split("/").pop();

  // Si la ruta está vacía (ej. cuando entras a la raíz del sitio), asumimos que es index.html
  if (paginaActual === "") {
    paginaActual = "index.html";
  }

  // Seleccionamos todos los enlaces de navegación dentro del header
  const enlaces = document.querySelectorAll("#header-container .nav-link");

  enlaces.forEach((enlace) => {
    // Primero le quitamos la clase 'active' a todos los enlaces por si acaso
    enlace.classList.remove("active");

    // Obtenemos a dónde apunta el botón
    const href = enlace.getAttribute("href");

    // Si el href del botón coincide con la página en la que estamos, lo encendemos
    if (href === paginaActual) {
      enlace.classList.add("active");
    }
  });
}

//FUNCIONALIDADES DE USUARIO

//Boton para mostrar la contrasena oculta
function verContrasena(idBoton, idInput) {
  const btn = document.querySelector(idBoton);
  const input = document.querySelector(idInput);

  if (btn && input) {
    btn.addEventListener("click", function () {
      const tipo =
        input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", tipo);

      const icono = btn.querySelector("[data-lucide]");

      if (icono) {
        if (tipo == "text") {
          icono.setAttribute("data-lucide", "eye");
        } else {
          icono.setAttribute("data-lucide", "eye-off");
        }
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

      //Capturar los valores del formulario
      const nombreInput = document.querySelector(
        'input[placeholder="Tu nombre y apellidos"]',
      ).value;
      const emailInput = document.getElementById("email").value;
      const passwordInput = document.getElementById("password").value;

      //Crear el objecto Json
      const usuarioDatos = {
        nombre: nombreInput,
        correo: emailInput,
        userPassword: passwordInput,
      };

      try {
        //Peticion hacia el servidor
        const respuesta = await fetch("/usuarios", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(usuarioDatos),
        });

        //Verificar si se pudo completar la accion correctamente

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
          Swal.fire({
            title: "Error en registro",
            text: "Error al registrar el usuario",
            icon: "error",
            confirmButtonColor: "#fd0d0d",
          });
        }
      } catch (error) {
        console.error("Error de conexion:", error);
        Swal.fire({
          title: "Error de conexion",
          text: "No se pudo conectar con el servidor",
          icon: "error",
          confirmButtonColor: "#cccbcb",
        });
      }
    });
  }
}

function iniciarSesion() {
  const formulario = document.getElementById("loginFormulario");

  if (formulario) {
    formulario.addEventListener("submit", async (e) => {
      e.preventDefault();

      //Recolectar datos
      const loginDatos = {
        correo: document.getElementById("email").value,
        userPassword: document.getElementById("password").value,
      };

      try {
        //Peticion hacia el servidor
        const respuesta = await fetch("/usuarios/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginDatos),
        });

        //Verificar si se pudo completar la accion correctamente

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
          Swal.fire({
            title: "Error de acceso",
            text: "Correo o contraseña incorrectos",
            icon: "error",
            confirmButtonColor: "#dc3545",
          });
        }
      } catch (error) {
        console.error("Error de conexion:", error);
        Swal.fire({
          title: "Error de conexion",
          text: "No se pudo conectar con el servidor",
          icon: "error",
          confirmButtonColor: "#cccbcb",
        });
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
  const contenedorUsuarios = document.getElementById(
    "contenedor-usuarios-recientes",
  );
  if (!contenedorUsuarios) return;

  try {
    const respuesta = await fetch("/usuarios");
    const usuarios = await respuesta.json();

    //En caso de que no haya usuarios registrados recientemente

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

    //Cargar ultimos 3 o 5 usuarios recientemente creados

    const ultimosCincoUsuarios = [...usuarios].reverse().slice(0, 4);

    ultimosCincoUsuarios.forEach((user) => {
      //Segun el rol del usuario la seccion dibuja al lado del usuario su rol si es admin o usuario
      contenedorVacio += `
      <div class="list-group-item p-4 d-flex justify-content-between align-items-center fila-usuario">

      <div>
        <h6 class="fw-bold mb-1">${user.nombre}</h6>
        <p class="small text-secondary mb-0">${user.correo}</p>
        </div>

      <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
        ${user.rol === "ADMIN" ? "Admin" : "Usuario"}
        </span>
        </div>
        `;
    });

    contenedorUsuarios.innerHTML = contenedorVacio;
  } catch (error) {
    console.error("Error al cargar los usuarios", error);
  }
}

//RUTAS Y DETALLES
//Angelica rutas

// Formatea un numero como colones. Si viene null o undefined muestra 0
// en vez de tronar con "Cannot read properties of undefined".
function formatearColones(valor) {
  const numero = Number(valor);
  return "₡" + (isNaN(numero) ? 0 : numero).toLocaleString("es-CR");
}

//BUSCADOR DEL INDEX

// Rellena un <select> con la lista de textos que venga del backend.
function llenarSelect(elemento, opciones, textoPorDefecto) {
  elemento.innerHTML = `<option value="">${textoPorDefecto}</option>`;

  opciones.forEach(function (opcion) {
    const item = document.createElement("option");
    item.value = opcion;
    item.textContent = opcion;
    elemento.appendChild(item);
  });
}

// Pide al backend los origenes y destinos que existen en la base
// y los carga en los dos select del buscador de index.html.
function cargarOpcionesBusqueda() {
  const selectOrigen = document.getElementById("select-origen");
  const selectDestino = document.getElementById("select-destino");

  if (!selectOrigen || !selectDestino) {
    return;
  }

  fetch("/api/rutas/origenes")
    .then(function (response) {
      return response.json();
    })
    .then(function (origenes) {
      llenarSelect(selectOrigen, origenes, "Origen");
    })
    .catch(function (error) {
      console.error("Error al cargar los origenes:", error);
      selectOrigen.innerHTML = '<option value="">Origen no disponible</option>';
    });

  fetch("/api/rutas/destinos")
    .then(function (response) {
      return response.json();
    })
    .then(function (destinos) {
      llenarSelect(selectDestino, destinos, "Destino");
    })
    .catch(function (error) {
      console.error("Error al cargar los destinos:", error);
      selectDestino.innerHTML =
        '<option value="">Destino no disponible</option>';
    });
}

// Al enviar el buscador, lleva al usuario a rutas.html con lo que eligio.
function activarBusqueda() {
  const formulario = document.getElementById("formulario-busqueda");

  if (!formulario) {
    return;
  }

  formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    const origen = document.getElementById("select-origen").value;
    const destino = document.getElementById("select-destino").value;

    //Guardar la busqueda en el historial del usuario logueado (si hay uno)
    registrarBusqueda(origen, destino);

    const parametros = new URLSearchParams();
    if (origen) parametros.set("origen", origen);
    if (destino) parametros.set("destino", destino);

    window.location.href = "rutas.html?" + parametros.toString();
  });
}

// Guarda la busqueda en el historial del usuario logueado. No bloquea la redireccion si falla.
function registrarBusqueda(origen, destino) {
  const idUsuario = localStorage.getItem("usuarioId");
  if (!idUsuario || (!origen && !destino)) return;

  fetch("/api/historial", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      origen: origen,
      destino: destino,
      usuario: { id: Number(idUsuario) },
    }),
  }).catch(function (error) {
    console.error("Error al registrar la busqueda:", error);
  });
}

//PERFIL DE USUARIO (Favoritos + Historial de busquedas)

// Punto de entrada de perfil.html: valida sesion y carga los datos del usuario
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
    }).then(() => {
      window.location.href = "login.html";
    });
    return;
  }

  const iniciales = nombre
    ? nombre.trim().split(/\s+/).slice(0, 2).map((palabra) => palabra[0].toUpperCase()).join("")
    : "?";

  contenedorAvatar.textContent = iniciales;
  document.getElementById("perfil-nombre").textContent = nombre || "Usuario";
  document.getElementById("perfil-correo").textContent = localStorage.getItem("usuarioCorreo") || "";

  const botonSalir = document.getElementById("btn-cerrar-sesion-perfil");
  if (botonSalir) {
    botonSalir.addEventListener("click", function (e) {
      e.preventDefault();
      cerrarSesion();
    });
  }

  const botonLimpiarHistorial = document.getElementById("btn-limpiar-historial");
  if (botonLimpiarHistorial) {
    botonLimpiarHistorial.addEventListener("click", limpiarHistorialPerfil);
  }

  cargarFavoritosPerfil(idUsuario);
  cargarHistorialPerfil(idUsuario);
}

// Trae y pinta las rutas favoritas del usuario en perfil.html
async function cargarFavoritosPerfil(idUsuario) {
  const contenedor = document.getElementById("contenedor-perfil-favoritos");
  if (!contenedor) return;

  try {
    const respuesta = await fetch(`/favoritos/usuario/${idUsuario}`);
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
        await fetch(`/favoritos/${boton.dataset.favoritoId}`, { method: "DELETE" });
        cargarFavoritosPerfil(idUsuario);
      });
    });
  } catch (error) {
    console.error("Error al cargar los favoritos del perfil:", error);
  }
}

// Trae y pinta el historial de busquedas del usuario en perfil.html
async function cargarHistorialPerfil(idUsuario) {
  const contenedor = document.getElementById("contenedor-perfil-historial");
  if (!contenedor) return;

  try {
    const respuesta = await fetch(`/api/historial/usuario/${idUsuario}`);
    const historial = await respuesta.json();

    if (historial.length === 0) {
      contenedor.innerHTML = `<p class="text-secondary small text-center py-5 mb-0">Aun no has hecho ninguna busqueda.</p>`;
      return;
    }

    let html = "";
    historial.forEach(function (busqueda) {
      const fecha = busqueda.fecha
        ? new Date(busqueda.fecha).toLocaleString("es-CR", { dateStyle: "medium", timeStyle: "short" })
        : "";

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
        await fetch(`/api/historial/${boton.dataset.busquedaId}`, { method: "DELETE" });
        cargarHistorialPerfil(idUsuario);
      });
    });
  } catch (error) {
    console.error("Error al cargar el historial del perfil:", error);
  }
}

// Borra todo el historial de busquedas del usuario, pidiendo confirmacion primero
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

    const respuesta = await fetch(`/api/historial/usuario/${idUsuario}`);
    const historial = await respuesta.json();

    await Promise.all(
      historial.map((busqueda) => fetch(`/api/historial/${busqueda.id}`, { method: "DELETE" })),
    );

    cargarHistorialPerfil(idUsuario);
  });
}

// Imagenes por defecto segun el origen de la ruta.
// Si el origen no coincide con ninguna, se usa la imagen "default".
var IMAGENES_POR_ORIGEN = {
  "san jose":
    "https://www.geckoroutes.com/images/wp-uploads/2021/10/Aerial-view-of-Costa-Ricas-San-Jose-city.jpg",
  alajuela:
    "https://costarica.org/wp-content/uploads/2014/12/Alajuela-Building1.jpg",
  heredia:
    "https://media.licdn.com/dms/image/v2/D4E12AQH8SKQDWor_kg/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1685067618225?e=2147483647&v=beta&t=oeppYclxfvpdzasfmjpxHMexONIh4HOb7n4X5l2lIDk",
  cartago:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaE_tmCJP22O6_1VPiT3T0YLbDwt-iOcdeJzvlS2TKlfRoTNDybGjDhqE&s=10",
  default:
    "https://img.magnific.com/vector-gratis/ubicacion-pin-ruta-bandera_78370-4270.jpg?semt=ais_hybrid&w=740&q=80",
};

// Quita tildes y pasa a minusculas para poder comparar "San Jose" con "san jose".
function normalizarTexto(texto) {
  return (texto || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Busca en IMAGENES_POR_ORIGEN una clave que este contenida en el origen de la ruta.
function obtenerImagenPorOrigen(origen) {
  const origenNormalizado = normalizarTexto(origen);

  for (const clave in IMAGENES_POR_ORIGEN) {
    if (clave !== "default" && origenNormalizado.includes(clave)) {
      return IMAGENES_POR_ORIGEN[clave];
    }
  }
  return IMAGENES_POR_ORIGEN["default"];
}

// Devuelve una copia del arreglo mezclada al azar (Fisher-Yates).
function mezclarArreglo(arreglo) {
  const copia = [...arreglo];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// Carga 3 rutas al azar desde el backend y las pinta en index.html
function cargarRutasDestacadas() {
  const contenedor = document.getElementById("contenedor-rutas-destacadas");

  if (!contenedor) {
    return;
  }

  fetch("/api/rutas")
    .then(function (response) {
      if (!response.ok) {
        throw new Error("El servidor respondio " + response.status);
      }
      return response.json();
    })
    .then(function (rutas) {
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
                  <img src="${imagen}" class="card-img-top"
                    style="height: 220px; object-fit: cover; width: 100%;" alt="${ruta.destino}">
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
          </div>
        `;
      });

      contenedor.innerHTML = html;

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    })
    .catch(function (error) {
      console.error("Error al cargar las rutas destacadas:", error);
      contenedor.innerHTML = `<p class="text-center text-danger">No se pudieron cargar las rutas destacadas.</p>`;
    });
}

// Guarda todas las rutas descargadas del backend, para filtrar en memoria sin volver a pedirlas
let todasLasRutas = [];

// Mapeo de provincia -> palabras clave a buscar dentro del texto de "origen"
const PROVINCIA_POR_ORIGEN = {
  "p-sanjose": ["san jose"],
  "p-alajuela": ["alajuela"],
  "p-cartago": ["cartago"],
  "p-heredia": ["heredia"],
  "p-guanacaste": ["guanacaste", "liberia", "nicoya", "santa cruz"],
  "p-puntarenas": ["puntarenas"],
  "p-limon": ["limon"]
};

// Mapeo de checkbox de tipo -> valor real que se guarda en la columna "tipo"
const TIPO_POR_CHECKBOX = {
  "ts-urbano": "Urbano",
  "ts-interurbano": "Interurbano",
};
function cargarRutasDesdeBackend() {
  const contenedorRutas = document.getElementById("contenedor-rutas");

  if (!contenedorRutas) {
    return;
  }

  // Si venimos del buscador del index, respetamos el filtro de la URL
  const filtros = new URLSearchParams(window.location.search);
  const parametros = new URLSearchParams();
  if (filtros.get("origen")) parametros.set("origen", filtros.get("origen"));
  if (filtros.get("destino")) parametros.set("destino", filtros.get("destino"));

  const url = parametros.toString()
    ? "/api/rutas?" + parametros.toString()
    : "/api/rutas";

  
  cargarFavoritosDelUsuario().then(function () {
   
    fetch(url)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("El servidor respondio " + response.status);
        }
        return response.json();
      })
      .then(function (rutas) {
        todasLasRutas = Array.isArray(rutas) ? rutas : [];
        pintarRutas(todasLasRutas);      
        activarFiltros();
        activarPaginacion();
      })
      .catch(function (error) {
        console.error("Error al cargar las rutas:", error);
        contenedorRutas.innerHTML = `
          <div class="text-center text-danger py-5">
            No se pudieron cargar las rutas. Revisa que el servidor este corriendo.
          </div>`;
      });
  });
}

// Pinta un arreglo de rutas dado dentro de #contenedor-rutas (ya sea todas o el resultado de un filtro)
// Estado de la paginacion
const RUTAS_POR_PAGINA = 3;
let paginaActual = 1;
let rutasActualmentefiltradas = [];

// Favoritos del usuario logueado: { idRuta: idFavorito }, para saber que corazon pintar lleno
let favoritosDelUsuario = {};

// Pinta un arreglo de rutas dado dentro de #contenedor-rutas (ya sea todas o el resultado de un filtro)
function pintarRutas(rutas) {
  const contenedorRutas = document.getElementById("contenedor-rutas");
  if (!contenedorRutas) return;

  rutasActualmentefiltradas = Array.isArray(rutas) ? rutas : [];

  if (rutasActualmentefiltradas.length === 0) {
    contenedorRutas.innerHTML = `
      <div class="text-center text-secondary py-5">
        No hay rutas que coincidan con tu busqueda.
      </div>`;
    pintarPaginacion();
    return;
  }

  // Si la pagina actual quedo fuera de rango (ej. tras filtrar), la regresamos a la 1
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
      </div>
    `;
  });

  contenedorRutas.innerHTML = html;

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
  
  document.querySelectorAll("#contenedor-rutas .btn-favorito").forEach(function (boton) {
    boton.addEventListener("click", function (e) {
      e.preventDefault(); 
      const idRuta = Number(boton.getAttribute("data-id-ruta"));
      
      alternarFavorito(idRuta, boton, function(esFavoritoAhora) {

      });
    });
  });

  pintarPaginacion();
}

// Dibuja los numeros de pagina y activa Ant/Sig segun cuantas rutas hay
function pintarPaginacion() {
  const contenedorPaginacion = document.querySelector(".pagination");
  if (!contenedorPaginacion) return;

  const totalPaginas = Math.ceil(rutasActualmentefiltradas.length / RUTAS_POR_PAGINA);

  if (totalPaginas <= 1) {
    contenedorPaginacion.innerHTML = "";
    return;
  }

  let html = "";

  html += `
    <li class="page-item ${paginaActual === 1 ? "disabled" : ""}">
      <a class="page-link text-secondary border-0 bg-transparent" href="#" data-pagina="ant">Ant</a>
    </li>`;

  for (let numero = 1; numero <= totalPaginas; numero++) {
    html += `
      <li class="page-item ${numero === paginaActual ? "active" : ""}">
        <a class="page-link ${numero === paginaActual ? "rounded bg-primary border-0" : "text-secondary border-0 bg-transparent"}" href="#" data-pagina="${numero}">${numero}</a>
      </li>`;
  }

  html += `
    <li class="page-item ${paginaActual === totalPaginas ? "disabled" : ""}">
      <a class="page-link text-secondary border-0 bg-transparent" href="#" data-pagina="sig">Sig</a>
    </li>`;

  contenedorPaginacion.innerHTML = html;
}

// Escucha los clics en los links de paginacion (delegado, porque se re-dibujan cada vez)
function activarPaginacion() {
  const contenedorPaginacion = document.querySelector(".pagination");
  if (!contenedorPaginacion) return;

  //Para evitar listeners viejos
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

    // Sube la vista al inicio del listado al cambiar de pagina
    document.getElementById("contenedor-rutas").scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

// FAVORITOS

function obtenerUsuarioIdLogueado() {
  const loggeado = localStorage.getItem('loggeado') === 'true';
  const usuarioId = localStorage.getItem('usuarioId');
  return (loggeado && usuarioId) ? Number(usuarioId) : null;
}

// Guarda en memoria el set de ids de rutas que el usuario ya tiene en favoritos
let idsRutasFavoritas = new Set();

function cargarFavoritosDelUsuario() {
  const usuarioId = obtenerUsuarioIdLogueado();
  if (!usuarioId) {
    idsRutasFavoritas = new Set();
    return Promise.resolve();
  }

  return fetch(`${API_BASE}/favoritos/usuario/${usuarioId}`)
    .then(function (response) {
      if (!response.ok) throw new Error("No se pudieron cargar los favoritos");
      return response.json();
    })
    .then(function (favoritos) {
      idsRutasFavoritas = new Set(favoritos.map(function (fav) { return fav.ruta.id; }));
    })
    .catch(function (error) {
      console.error("Error al cargar favoritos:", error);
      idsRutasFavoritas = new Set();
    });
}

function alternarFavorito(idRuta, botonCorazon, onCambio) {
  const usuarioId = obtenerUsuarioIdLogueado();

  if (!usuarioId) {
    Swal.fire({
      title: 'Inicia sesion',
      text: 'Debes iniciar sesion para guardar rutas favoritas',
      icon: 'info',
      confirmButtonColor: '#0d6efd'
    });
    return;
  }

  const yaEsFavorito = idsRutasFavoritas.has(idRuta);

  if (yaEsFavorito) {
    fetch(`${API_BASE}/favoritos/usuario/${usuarioId}/ruta/${idRuta}`, { method: "DELETE" })
      .then(function (response) {
        if (!response.ok) throw new Error("No se pudo quitar el favorito");
        idsRutasFavoritas.delete(idRuta);
        actualizarIconoFavorito(botonCorazon, false);
        if (typeof onCambio === "function") onCambio(false);
      })
      .catch(function (error) {
        console.error(error);
      });
  } else {
    fetch(`${API_BASE}/favoritos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usuario: { id: usuarioId },
        ruta: { id: idRuta }
      })
    })
      .then(function (response) {
        if (!response.ok) throw new Error("No se pudo guardar el favorito");
        idsRutasFavoritas.add(idRuta);
        actualizarIconoFavorito(botonCorazon, true);
        if (typeof onCambio === "function") onCambio(true);
      })
      .catch(function (error) {
        console.error(error);
      });
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
  if (textoSpan) {
    textoSpan.textContent = esFavorito ? "Guardado" : "Guardar";
  }
  if (typeof lucide !== "undefined") lucide.createIcons();
}

// Revisa el estado de checkboxes + texto de busqueda, filtra en memoria y vuelve a pintar
function aplicarFiltros() {
  const provinciasMarcadas = Object.keys(PROVINCIA_POR_ORIGEN)
    .filter(function (idCheckbox) {
      const el = document.getElementById(idCheckbox);
      return el && el.checked;
    });

  const tiposMarcados = Object.keys(TIPO_POR_CHECKBOX)
    .filter(function (idCheckbox) {
      const el = document.getElementById(idCheckbox);
      return el && el.checked;
    })
    .map(function (idCheckbox) {
      return TIPO_POR_CHECKBOX[idCheckbox];
    });

  const inputBusqueda = document.getElementById("buscador-texto");
  const textoBusqueda = normalizarTexto(inputBusqueda ? inputBusqueda.value : "");

  const rutasFiltradas = todasLasRutas.filter(function (ruta) {
    // Filtro de provincia: si NINGUNA provincia esta marcada, no mostramos nada;
    // si el origen de la ruta coincide con alguna provincia marcada, pasa.
    // Despues:
  const origenNormalizado = normalizarTexto(ruta.origen);
  const destinoNormalizado = normalizarTexto(ruta.destino);
  const coincideProvincia = provinciasMarcadas.some(function (idCheckbox) {
    return PROVINCIA_POR_ORIGEN[idCheckbox].some(function (palabraClave) {
      return origenNormalizado.includes(palabraClave) || destinoNormalizado.includes(palabraClave);
    });
  });

    // Filtro de tipo: si ningun tipo esta marcado, no mostramos nada;
    // si el tipo de la ruta esta entre los marcados, pasa.
    const coincideTipo = tiposMarcados.length === 0
      ? false
      : tiposMarcados.includes(ruta.tipo);

    // Filtro de texto libre: busca en origen, destino y empresa
    const coincideTexto = textoBusqueda === "" || [ruta.origen, ruta.destino, ruta.empresa]
      .some(function (campo) {
        return normalizarTexto(campo).includes(textoBusqueda);
      });

    return coincideProvincia && coincideTipo && coincideTexto;
  });

  pintarRutas(rutasFiltradas);
}

// Conecta los checkboxes, el buscador y el boton de limpiar a aplicarFiltros()
function activarFiltros() {
  Object.keys(PROVINCIA_POR_ORIGEN).forEach(function (idCheckbox) {
    const el = document.getElementById(idCheckbox);
    if (el) el.addEventListener("change", aplicarFiltros);
  });

  Object.keys(TIPO_POR_CHECKBOX).forEach(function (idCheckbox) {
    const el = document.getElementById(idCheckbox);
    if (el) el.addEventListener("change", aplicarFiltros);
  });

  const inputBusqueda = document.getElementById("buscador-texto");
  if (inputBusqueda) {
    inputBusqueda.addEventListener("input", aplicarFiltros);
  }

  const btnLimpiar = document.getElementById("btn-limpiar-filtros");
  if (btnLimpiar) {
    btnLimpiar.addEventListener("click", function () {
      Object.keys(PROVINCIA_POR_ORIGEN).forEach(function (idCheckbox) {
        const el = document.getElementById(idCheckbox);
        if (el) el.checked = true;
      });
      Object.keys(TIPO_POR_CHECKBOX).forEach(function (idCheckbox) {
        const el = document.getElementById(idCheckbox);
        if (el) el.checked = true;
      });
      if (inputBusqueda) inputBusqueda.value = "";
      aplicarFiltros();
    });
  }
}

//Angelica actualizacion recorridos.
function cargarDetalleRutaDesdeBackend() {
  const paginaActual = window.location.pathname;

  if (!paginaActual.includes("detalle-ruta.html")) {
    return;
  }
  const parametros = new URLSearchParams(window.location.search);
  const idRuta = parametros.get("id") || 1;

  cargarFavoritosDelUsuario().then(function () {
    fetch(`${API_BASE}/api/rutas/${idRuta}`)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("No se encontro la ruta " + idRuta);
        }
        return response.json();
      })
      .then(function (ruta) {
        actualizarDetalleRuta(ruta);
      })
      .catch(function (error) {
        console.error("Error al cargar el detalle de la ruta:", error);
      });
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
  document.querySelector(".badge-soft-primary").textContent =
    ruta.tipo || "Urbano";
  document.querySelector(".text-primary.small.fw-medium").textContent =
    ruta.empresa;

  // Boton de favorito ("Guardar"): guarda el id de la ruta y refleja si ya es favorita
  const botonFavoritoDetalle = document.getElementById("btn-favorito-detalle");
  if (botonFavoritoDetalle) {
    botonFavoritoDetalle.dataset.rutaId = ruta.id;
    sincronizarBotonFavoritoDetalle();
  }

  //SECCION 1.1: Estado de la ruta (Activa/ En revision)
  const badgeEstado = document.getElementById("badge-estado-servicio");
  if (badgeEstado) {
    const estadoRevision = ruta.estado === "En revisión";
    badgeEstado.textContent = estadoRevision
      ? "En revisión"
      : "Servicio Activo";

    badgeEstado.className = `badge ${
      estadoRevision
        ? "bg-warning bg-opacity-10 text-warning border border-warning-subtle"
        : "badge-soft-success"
    }`;
  }

  //SECCION 2: Tabla de horarios
  const tablaHorarios = document.getElementById("tabla-horarios-cuerpo");

  if (tablaHorarios && ruta.horarios) {
    let horarios = "";

    ruta.horarios.forEach((horario) => {
      horarios += `
        <tr class="border-bottom">
          <td class="ps-4 py-3 fw-medium text-dark">${horario.dia}</td>
          <td class="py-3 text-secondary">${horario.primerServicio}</td>
          <td class="py-3 text-secondary">${horario.ultimoServicio}</td>
          <td class="py-3 text-dark small">Cada ${horario.frecuencia || "Consultar"}</td>
        </tr>`;
    });
    tablaHorarios.innerHTML = horarios;
  }

  //SECCION 3: Recorrido y paradas
  const recorrido = document.querySelector(".detail-timeline");

  if (recorrido && ruta.paradas && ruta.paradas.length > 0) {
    let htmlParadas = "";

    ruta.paradas.forEach(function (parada, index) {
      let claseDot = "";

      if (index === 0) {
        claseDot = "primary";
      } else if (index === ruta.paradas.length - 1) {
        claseDot = "success";
      }
      htmlParadas += `
      <div class="detail-timeline-item" 
      onclick="enfocarParada(${index}, ${parada.latitud}, ${parada.longitud})" 
      style="cursor: pointer;">
      <div class="detail-timeline-dot ${claseDot}"></div>
      <h6 class="fw-bold text-dark mb-1">${parada.nombre}</h6>
      <p class="small text-secondary mb-0">${parada.descripcion || ''}</p>
      </div>`;
    });
    recorrido.innerHTML = htmlParadas;
  }

  //SECCION 4: Tarifa y empresa
  // Tarifa principal
  const tarifaPrincipal = document.querySelector("#tarifas h2");

  if (tarifaPrincipal) {
    tarifaPrincipal.textContent = formatearColones(ruta.tarifa);
  }
  // Información de empresa
  const infoEmpresa = document.querySelector(".col-lg-4 .p-4");

  if (infoEmpresa) {
    infoEmpresa.innerHTML = `
      <h6 class="fw-bold text-dark mb-3">Información de la empresa</h6>
      <div class="small text-secondary mb-2"><strong class="text-dark">Nombre:</strong> ${ruta.empresa}</div>
      <div class="small text-secondary mb-2"><strong class="text-dark">Teléfono:</strong> ${ruta.telefono || "No disponible"}</div>
      <div class="small text-secondary mb-4"><strong class="text-dark">Email:</strong> ${ruta.email || "No disponible"}</div>

      <button class="btn btn-light w-100 fw-medium text-secondary bg-slate-50 border" 
        data-bs-toggle="modal" 
        data-bs-target="#modalReporte">
        Reportar un problema
        </button>
    `;
  }
    // Boton de favorito
  const botonFavorito = document.getElementById("btn-favorito-detalle");
  const textoFavorito = document.getElementById("texto-favorito-detalle");

  if (botonFavorito) {
    const yaEsFavorito = idsRutasFavoritas.has(ruta.id);
    pintarEstadoBotonFavorito(botonFavorito, textoFavorito, yaEsFavorito);

    botonFavorito.onclick = function () {
      alternarFavorito(ruta.id, null, function (esFavoritoAhora) {
        pintarEstadoBotonFavorito(botonFavorito, textoFavorito, esFavoritoAhora);
      });
    };
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  inicializarMapaDetalleRuta(ruta.paradas);
}

//RUTAS

//Funcion para mostrar rutas visualmente en el panel de admin
async function cargarRutasPanelAdmin() {
  const tablaAdmin = document.querySelector("#tabla-rutas-admin");
  if (!tablaAdmin) return; //Verificar si la tabla existe

  tablaAdmin.innerHTML =
    '<tr><td colspan="7" class="text-center">Actualizando...</td></tr>';

  try {
    const respuesta = await fetch("/api/rutas");
    const rutas = await respuesta.json();

    let filasHTML = "";

    rutas.forEach((ruta) => {
      const badgeColor = ruta.estado === "Activa" ? "bg-success" : "bg-warning"; //Si la ruta dice "Activa" se guarda como bg-success, si no es asi se guarda como bg-warning

      //Inyecta esos valores a la base de datos
      filasHTML += ` 
      <tr class="border-bottom">
      <td class="ps-4 py-3 fw-bold text-dark">${ruta.origen} - ${ruta.destino}</td>
      <td class="py-3 text-secondary">${ruta.empresa}</td>
      <td class="py-3 text-secondary">${ruta.tipo}</td>
      <td class="py-3 fw-bolder text-dark">₡${(ruta.tarifa || 0).toLocaleString("es-CR")}</td>
      <td class="py-3">${ruta.frecuencia || "N/A"}</td>
      <td class="py-3">
      <span class="badge ${badgeColor} bg-opacity-10 ${badgeColor.replace("bg-", "text-")} rounded-pill px-3">
              ${ruta.estado || "Activa"}
      </span>
      </td>
      <td class="py-3 text-end pe-4">
      <div class="d-flex gap-2 justify-content-end">

      <button onclick="gestionarHorarios(${ruta.id}, '${ruta.origen} - ${ruta.destino}')" class="btn btn-sm btn-info text-white">
      <i data-lucide="clock" style="width:14px;"></i> Horarios
      </button>

      <button onclick="gestionarParadas(${ruta.id}, '${ruta.origen} - ${ruta.destino}')" class="btn btn-sm btn-warning text-dark">
      <i data-lucide="map-pin" style="width:14px;"></i> Paradas
      </button>


      <button onclick="prepararEdicion(${ruta.id})" class="btn btn-sm btn-light border">Editar</button>
      <button onclick="eliminarRuta(${ruta.id})" class="btn btn-sm btn-outline-danger">Eliminar</button>
      </div>
      </td>
       </tr>`;
    });

    //Coloca todo lo que esta acumulado en filasHTML y lo coloca en la tablaAdmin

    tablaAdmin.innerHTML = filasHTML;

    if (typeof lucide !== "undefined") lucide.createIcons(); //Volver a dibujar los iconos
  } catch (error) {
    console.error("Error al conectar con la API de rutas:", error); //Manejo de errores
    tablaAdmin.innerHTML =
      '<tr><td colspan="7" class="text-danger text-center">Error al cargar datos</td></tr>';
  }
}

async function guardarRuta(e) {
  e.preventDefault();
  const idRuta = document.getElementById("rutaID").value;

  //Recoleccion de datos de lo que se escribio en el modal
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

  //Definir el metodo, si es editar o crear
  let url = "/api/rutas";
  let metodo = "POST";

  //Editar ruta
  if (idRuta && idRuta.trim() !== "") {
    url = `/api/rutas/${idRuta}`;
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
      Swal.fire(
        "¡Éxito!",
        `La ruta se ${metodo === "PUT" ? "actualizó" : "guardó"} correctamente`,
        "success",
      );

      //Cerrar el modal de manera segura
      const elementoModal = document.getElementById("modalRuta");
      const modal = bootstrap.Modal.getInstance(elementoModal);
      if (modal) {
        modal.hide();
      }

      limpiarFormularioRuta();

      //Volver a llamar a la funcion para que muestre la lista actualizada y la dibuje
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
    const respuesta = await fetch(`/api/rutas/${id}`);
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
    title: "¿Eliminar ruta?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const respuesta = await fetch(`/api/rutas/${id}`, { method: "DELETE" });
      if (respuesta.ok) {
        Swal.fire("Eliminada", "La ruta ha sido borrada", "success");
        cargarRutasPanelAdmin();
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
  }
}

function limpiarFormularioRuta() {
  document.getElementById("modalTitulo").innerText = "Agregar nueva ruta";
  document.getElementById("formularioRuta").reset();
  document.getElementById("rutaID").value = "";
}

//HORARIOS

async function gestionarHorarios(idRuta, nombre) {
  document.getElementById("rutaIdDestino").value = idRuta;
  document.getElementById("nombreRutaHorario").innerText = nombre;

  document.getElementById("formularioNuevoHorario").reset();

  //Traer la ruta completa para ver todos sus horarios
  const respuesta = await fetch(`/api/rutas/${idRuta}`);
  const ruta = await respuesta.json();

  const contenedor = document.getElementById("listaHorariosRuta");
  contenedor.innerHTML = "";

  //Dibujar cada horario en una lista junto con un boton para eliminar
  ruta.horarios.forEach((h) => {
    contenedor.innerHTML += `
      <div class="list-group-item d-flex justify-content-between align-items-center">
      <span>
      <strong>${h.dia}:</strong> ${h.primerServicio} - ${h.ultimoServicio}
      <span class="text-muted ms-1">(Cada ${h.frecuencia})</span>
      </span>
      <button onclick="eliminarHorario(${h.id}, ${idRuta}, '${nombre}')" class="btn btn-sm text-danger border-0">Borrar</button>
      </div>`;
  });

  //Abrir el modal solo si no esta abierto
  const modalElemento = document.getElementById("modalHorarios");
  if (!modalElemento.classList.contains("show")) {
    const modalBootstrap = new bootstrap.Modal(modalElemento);
    modalBootstrap.show();
  }
}

async function guardarHorario(e) {
  e.preventDefault();

  //Recoleccion de datos de lo que se escribio en el modal de horario
  const dia = document.getElementById("horarioDia").value.trim();
  const primerServicio = document.getElementById("horarioInicio").value.trim();
  const ultimoServicio = document.getElementById("horarioFin").value.trim();

  const numFrecuenciaInput = document.getElementById("horarioFrecuenciaNum");
  const unidadFrecuenciaInput = document.getElementById(
    "horarioFrecuenciaUnidad",
  );
  //Validar si existe el campo de numero
  const numFrecuencia = numFrecuenciaInput
    ? parseInt(numFrecuenciaInput.value.trim(), 10)
    : 0;
  //Validar si existe el campo selector
  const unidadFrecuencia = unidadFrecuenciaInput
    ? unidadFrecuenciaInput.value
    : "min";

  const frecuencia = `${numFrecuencia} ${unidadFrecuencia}`;

  const rutaId = document.getElementById("rutaIdDestino").value;

  //Validar que los campos no esten vacios
  if (
    !dia ||
    primerServicio.trim() === "" ||
    ultimoServicio.trim() === "" ||
    frecuencia.trim() === ""
  ) {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor complete todos los campos",
      confirmButtonColor: "#0d6efd",
    });
    return;
  }

  //Validacion para revisar si la hora del ultimo servicio es menor o igual a la hora del primer servicio
  const minutosInicio = convertirHorasAMinutos(primerServicio);
  const minutosFin = convertirHorasAMinutos(ultimoServicio);
  if (minutosFin <= minutosInicio) {
    Swal.fire({
      icon: "error",
      title: "Horarios incoherentes",
      text: "El último servicio no puede ser igual o anterior al primer servicio.",
      confirmButtonColor: "#dc3545",
    });
    return;
  }

  //Validacion para evitar que la frecuencia sea enviada con valores negativos o decimales
  if (isNaN(numFrecuencia) || numFrecuencia <= 0) {
    Swal.fire({
      icon: "error",
      title: "Frecuencia inválida",
      text: "Ingrese un número entero positivo válido",
      confirmButtonColor: "#dc3545",
    });
    return;
  }

  //Validacion de frecuencia para que no sea mayor a la duracion total del servicio
  const duracionRutaMinutos = minutosFin - minutosInicio;
  let frecuenciaMinutos = numFrecuencia;
  if (unidadFrecuencia === "hr") {
    frecuenciaMinutos = numFrecuencia * 60;
  }

  if (frecuenciaMinutos > duracionRutaMinutos) {
    Swal.fire({
      icon: "error",
      title: "Frecuencia ilógica",
      text: `La frecuencia (${numFrecuencia} ${unidadFrecuencia}) es mayor que la duración total de la ruta (${duracionRutaMinutos} min).`,
      confirmButtonColor: "#dc3545",
    });
    return;
  }

  //Armar el objecto con los datos
  const datosHorarios = {
    dia: dia,
    primerServicio: primerServicio,
    ultimoServicio: ultimoServicio,
    frecuencia: frecuencia,

    //Conectar el horario con su respectiva ruta
    ruta: { id: Number(rutaId) },
  };

  try {
    const respuesta = await fetch("/api/horarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosHorarios),
    });

    if (respuesta.ok) {
      const nombreRuta = document.getElementById("nombreRutaHorario").innerText;

      //Limpiar campos del formulario
      document.getElementById("formularioNuevoHorario").reset();

      const idRuta = document.getElementById("rutaIdDestino").value;

      //Refrescar de nuevo la lista
      gestionarHorarios(idRuta, nombreRuta);

      Swal.fire({
        title: "¡Agregado!",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  } catch (error) {
    console.error("Error al guardar horario:", error);
  }
}

async function eliminarHorario(idHorario, idRuta, nombreRuta) {
  const result = await Swal.fire({
    title: "¿Eliminar este horario?",
    text: "Esta acción quitará el horario de la ruta seleccionada",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const respuesta = await fetch(`/api/horarios/${idHorario}`, {
        method: "DELETE",
      });

      if (respuesta.ok) {
        Swal.fire({
          title: "Eliminado!",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });
        gestionarHorarios(idRuta, nombreRuta);
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo conectar con el servidor", "error");
    }
  }
}

function convertirHorasAMinutos(horaString) {
  //Validacion por si la hora viene null, no existe o es undefined
  if (!horaString) return 0;

  //Expresion para separar hora, minutos y el indicador AM/PM
  const expresionHora = horaString.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!expresionHora) return 0;

  let horas = parseInt(expresionHora[1], 10);
  const minutos = parseInt(expresionHora[2], 10);

  //Evita problemas de minúsculas
  const ampm = expresionHora[3].toUpperCase();

  //Convierte a formato 24 horas
  if (ampm === "PM" && horas < 12) horas += 12;
  if (ampm === "AM" && horas === 12) horas = 0;

  //Total de minutos en el dia
  return horas * 60 + minutos;
}

//FUNCIONES DEL MAPA
var mapaAdmin = null;
var seleccionMarcador = null;
var mapaDetalle = null;

//Funcion que abre el modal, activa el mapa selector y carga las paradas existentes
async function gestionarParadas(idRuta, nombreRuta) {
  document.getElementById("rutaIdParaParada").value = idRuta;
  document.getElementById("nombreRutaParada").innerText = nombreRuta;

  //Traer paradas actuales de la ruta
  const res = await fetch(`/api/rutas/${idRuta}`);
  const ruta = await res.json();

  //Dibujar la lista de paradas en el modal
  const contenedor = document.getElementById("listaParadasRuta");
  contenedor.innerHTML = "";
  ruta.paradas.forEach((p) => {
    contenedor.innerHTML += `
       <div class="list-group-item d-flex justify-content-between align-items-center">
       <span><strong>${p.nombre}</strong> <br>
       <p class="small text-secondary mb-0">${p.descripcion || ""}</p>
       <small class="text-muted">Lat: ${p.latitud.toFixed(4)} 
       | Lon: ${p.longitud.toFixed(4)}</small></span>
       <button onclick="eliminarParada(${p.id}, ${idRuta}, '${nombreRuta}')" class="btn btn-sm text-danger border-0">Borrar</button>
       </div>`;
  });

  //Mostrar el modal
  const modal = document.getElementById("modalParadas");
  const instancia = bootstrap.Modal.getOrCreateInstance(modal);
  instancia.show();

  //Esperar a que el modal se abra
  setTimeout(() => prepararMapaAdmin(), 500);
}

//Funcion donde se capturan las coordenadas sin necesidad de que el admin las escriba
function prepararMapaAdmin() {
  if (mapaAdmin) {
    mapaAdmin.remove();
  }

  seleccionMarcador = null;

  //Mapa centrado por defecto en San Jose
  mapaAdmin = L.map("mapa-admin-selector").setView([9.9333, -84.0833], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
    mapaAdmin,
  );

  mapaAdmin.on("click", async function (e) {
    const latitud = e.latlng.lat;
    const longitud = e.latlng.lng;

    //LLenado automatico de los inputs latitud y longitud
    document.getElementById("p_lat").value = latitud;
    document.getElementById("p_lon").value = longitud;

    try {
      //Consultar a OpenStreetMap por la direccion segun la latitud y longitud del marcador de seleccion
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitud}&lon=${longitud}`,
      );
      const datos = await res.json();

      //Si se encuentra una direccion se coloca
      if (datos.display_name) {
        //Coloca solo las tres primeras partes de la direccion
        const partes = datos.display_name.split(",");
        const direccionCorta = partes.slice(0, 3).join(",").trim();
        document.getElementById("paradaDescripcion").value = direccionCorta;
      }
    } catch (error) {
      console.log("No se pudo obtener la dirección automática.");
    }

    //Para hacerle saber al admin lo que eligio
    if (seleccionMarcador) {
      seleccionMarcador.setLatLng(e.latlng);
    } else {
      seleccionMarcador = L.marker(e.latlng).addTo(mapaAdmin);
    }
  });
}

//FUNCION para guardar la parada
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

  const res = await fetch("/api/paradas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  if (res.ok) {
    //Limpiar el formulario
    document.getElementById("formNuevaParada").reset();

    //Remover el marcador del mapa en caso de que exista
    if (seleccionMarcador && mapaAdmin) {
      mapaAdmin.removeLayer(seleccionMarcador);
      seleccionMarcador = null;
    }

    gestionarParadas(idRuta, nombreRuta);

    Swal.fire({
      title: "¡Parada registrada!",
      icon: "success",
      timer: 1000,
      showConfirmButton: false,
      target: document.getElementById("modalParadas"),
    });
  }
}

var marcadoresRuta = [];

//FUNCION de la pagina detalle ruta
function inicializarMapaDetalleRuta(paradas) {
  if (mapaDetalle) {
    mapaDetalle.remove();
  } //Borra el mapa viejo de la memoria
  if (!paradas || paradas.length === 0) return; //En caso de que una ruta no tenga paradas registradas no dibuja el mapa

  //Centrar el mapa en la primera parada
  mapaDetalle = L.map("mapa-interactivo").setView(
    [paradas[0].latitud, paradas[0].longitud],
    14,
  ); //Para indicarle al usuario donde empieza su viaje
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
    mapaDetalle,
  ); //

  marcadoresRuta = [];

  paradas.forEach((p, index) => {
    const marcador = L.marker([p.latitud, p.longitud])
    .addTo(mapaDetalle)
     .bindPopup(`<b>${p.nombre}</b><br>${p.descripcion || 'Sin descripción'}`);
     marcadoresRuta[index] = marcador; 
  });
    
}

function enfocarParada(index, latitud, longitud) {
  
   if (!mapaDetalle) return;
   mapaDetalle.flyTo([latitud, longitud], 16, {
    animate: true,
    duration: 1.5
   });

   //Abrir el globo de texto de esa parada
   if (marcadoresRuta[index]) {
    marcadoresRuta[index].openPopup();
   }
  }


//FUNCION ELIMINAR PARADA
async function eliminarParada(idParada, idRuta, nombreRuta) {
  const resultado = await Swal.fire({
    title: "¿Eliminar parada?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    target: document.getElementById("modalParadas"), //La alerta sale sobre el modal
  });

  if (resultado.isConfirmed) {
    const res = await fetch(`/api/paradas/${idParada}`, { method: "DELETE" });
    if (res.ok) {
      await Swal.fire({
        title: "Eliminada",
        text: "Parada quitada de la ruta",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        target: document.getElementById("modalParadas"),
      });
      gestionarParadas(idRuta, nombreRuta);
    }
  }
}

//Funcion para borrar cualquier sombra que haya quedado de un modal
function forzarCierreModal() {
  document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());
  document.body.classList.remove("modal-open");
  document.body.style.overflow = "auto";
  document.body.style.paddingRight = "0";
}

//Funciones de REPORTES
async function enviarReporte(e) {
  e.preventDefault();

  //Validar que el titulo exista
  const tituloRuta = document.getElementById("detalle-titulo-ruta");
  const nombreRuta = tituloRuta ? tituloRuta.innerText : "Ruta desconocida";

  const datosReporte = {
    tipo: document.getElementById("tipoReporte").value,
    rutaNombre: nombreRuta,
    comentario: document.getElementById("comentarioReporte").value,
    estado: "Pendiente",
  };

  try {
    const res = await fetch("/api/reportes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosReporte),
    });

    if (res.ok) {
      //Cerrar el modal primero
      const modalEl = document.getElementById("modalReporte");
      const modalInstancia = bootstrap.Modal.getInstance(modalEl);
      if (modalInstancia) modalInstancia.hide();

      //Limpiar sombras restantes
      forzarCierreModal();

      Swal.fire({
        title: "¡Gracias!",
        icon: "success",
        text: "Su reporte ha sido recibido",
        timer: 1000,
        showConfirmButton: false,
      });

      document.getElementById("formReporte").reset();
    } else {
      const errorTexto = await res.text();
      console.error("Error del servidor:", errorTexto);
      Swal.fire(
        "Error",
        "No se pudo enviar el reporte. Inténtalo de nuevo.",
        "error",
      );
    }
  } catch (error) {
    console.error("Error de conexión:", error);
    Swal.fire(
      "Error de red",
      "No hay conexión con el servidor de GoBus.",
      "error",
    );
  }
}

async function cargarReportes() {
  const contenedor = document.getElementById("contenedor-reportes-recientes");
  if (!contenedor) return;

  try {
    const res = await fetch("/api/reportes");
    const reportes = await res.json();

    let html = "";
    //Crea una copia del arreglo con el fin de que los ultimos reportes generados recientemente aparezcan primero
    if (reportes.length > 0) {
      [...reportes]
        .reverse()
        //Muestra unicamente los 3 primeros reportes
        .slice(0, 3)
        .forEach((rep) => {
          const badgeColor =
            //Asigna un color segun el estado
            rep.estado === "Pendiente" ? "bg-warning" : "bg-success";

          html += `
        <div class="list-group-item p-4 border-0 border-bottom">
          <h6 class="fw-bold mb-1">${rep.tipo}</h6>
          <p class="small text-secondary mb-1">Ruta: ${rep.rutaNombre}</p>
          <span class="badge ${badgeColor} bg-opacity-10 ${badgeColor.replace("bg-", "text-")}">${rep.estado}</span>
        </div>`;
        });
      contenedor.innerHTML = html;
    } else {
      contenedor.innerHTML = `
  <div class="text-center py-5">
    <p class="text-secondary mb-0 fs-6">No hay reportes pendientes por revisar</p>
  </div>`;
    }
  } catch (error) {
    console.error("Error al cargar reportes:", error);
    contenedor.innerHTML =
      '<p class="p-4 text-center text-danger small">Error al conectar con el servidor de reportes.</p>';
  }
}

async function abrirHistorialReportes() {
  try {
    const response = await fetch("/api/reportes");
    const reportes = await response.json();
    const tablaBody = document.querySelector("#tabla-todos-reportes tbody");

    if (!tablaBody) return;
    tablaBody.innerHTML = "";

    //Muestra reportes mas recientes primero
    [...reportes].reverse().forEach((rep) => {
      const pendiente = rep.estado === "Pendiente";
      const filaClase = pendiente ? "" : "opacity-50 bg-light";
      const badgeClass = pendiente
        ? "bg-warning text-warning"
        : "bg-success text-success";

      //Si el reporte tiene fecha desde la base de datos la muestra, si no es asi muestra la fecha actual
      const fechaReal = rep.fecha
        ? new Date(rep.fecha).toLocaleDateString()
        : new Date().toLocaleDateString();

      //Comentario de reporte
      const comentario = rep.tipo === "Otro problema" && rep.comentario ? rep.comentario : "";

      
      tablaBody.innerHTML += `
  <tr class="${filaClase} align-middle">
    <td class="small text-muted py-3 ps-4 align-top" style="width: 15%;">
      ${fechaReal}
    </td>          
    <td class="py-3 align-top" style="width: 65%;">
      <div class="fw-bold text-dark fs-6 mb-1">${rep.tipo}</div>
      <div class="small text-muted fw-normal mb-1" style="line-height: 1.2;">
        ${rep.rutaNombre}
      </div>
      ${comentario ? `
        <div class="small text-secondary fst-italic mt-1">
          <span class="d-inline-block text-truncate align-bottom" style="max-width: 320px;">
            "${comentario}"
          </span>
          ${comentario.length > 60 ? `
            <a href="javascript:void(0)" 
               class="text-primary fw-bold text-decoration-none ms-1 small"
               data-bs-toggle="popover" 
               data-bs-trigger="focus" 
               data-bs-placement="bottom" 
               title="Detalle del reporte" 
               data-bs-content="${comentario.replace(/"/g, "&quot;")}">
              Ver más
            </a>
          ` : ""}
        </div>
      ` : ""}      
    </td>
    <td class="py-3 text-end pe-4 align-top" style="width: 20%;">
      <button onclick="${pendiente ? `cambiarEstadoReporte(${rep.id})` : ""}" 
              class="badge ${badgeClass} bg-opacity-10 border-0 py-2 px-3 rounded-pill" 
              style="${pendiente ? "cursor: pointer;" : "cursor: default;"} font-size: 0.8rem;">
        ${rep.estado}
      </button>
    </td>
  </tr>`;
});

const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(el => new bootstrap.Popover(el));

    const modal = document.getElementById("modalHistorialReportes");
    //Evita duplicados de memoria
    let instancia = bootstrap.Modal.getInstance(modal);
    if (!instancia) {
      instancia = new bootstrap.Modal(modal);
    }
    instancia.show();
  } catch (error) {
    console.error("Error al cargar historial:", error);
  }
}

async function cambiarEstadoReporte(id) {
  try {
    const res = await fetch(
      `/api/reportes/${id}/revisado`,
      {
        method: "PUT",
      },
    );

    if (res.ok) {
      Swal.fire({
        title: "¡Revisado!",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
        target: document.getElementById("modalHistorialReportes"),
      });

      cargarReportes();
      abrirHistorialReportes();
    }
  } catch (error) {
    console.error(error);
  }
}

function configurarVisibilidadReporte() {
  const selectReporte = document.getElementById('tipoReporte');
  const divComentario = document.getElementById('contenedorComentario');
  const txtComentario = document.getElementById('comentarioReporte');
  
  if (!selectReporte || !divComentario || !txtComentario) return;

   selectReporte.addEventListener('change', function() {
    if (this.value === 'Otro problema') {
       divComentario.style.display = 'block';
       txtComentario.setAttribute('required', 'true'); 
       } else {
         divComentario.style.display = 'none';
         txtComentario.removeAttribute('required');
         txtComentario.value = ''; 
       }
      });
    }




//INICIALIACION
document.addEventListener("DOMContentLoaded", function () {
  //Para que la carga de la pagina sea rapida e eficiente
  Promise.all([
    //Cargar estructura visual
    cargarPlantillas(),

    //Cargar usuarios recientes en el panel de admin
    cargarUsuariosRecientes(),

    //Llenado de tabla para admin
    cargarRutasPanelAdmin(),

    //Cargar datos de rutas
    cargarRutasDesdeBackend(),
    cargarDetalleRutaDesdeBackend(),

    //Cargar los favoritos del usuario logueado, para pintar los corazones
    cargarFavoritosDelUsuario(),

    //Buscador del index (selects de origen y destino)
    cargarOpcionesBusqueda(),
    activarBusqueda(),

    //Cargar rutas destacadas al azar en index.html
    cargarRutasDestacadas(),

    //Cargar los datos de reportes
    cargarReportes(),
    
    //Cargar los datos de favoritos
    cargarPaginaFavoritos(),
  ]).then(() => {
    console.log("Datos dinamicos cargados");
  });

  //Listeners de formularios
  //Crear cuenta
  crearCuenta();
  //Login
  iniciarSesion();
  //Boton contrasena
  verContrasena("#togglePassword", "#password");

  //Corazones de favoritos en las tarjetas de rutas
  activarFavoritos();

  //Boton "Guardar" de favorito en detalle-ruta.html
  activarFavoritoDetalle();

  //Carga de perfil.html (favoritos + historial de busquedas), no hace nada en las demas paginas
  cargarPerfil();

  //Guardar/editar ruta en el modal, para que el evento submit ya este conectado a la funcion
  const formularioRuta = document.getElementById("formularioRuta");
  if (formularioRuta) {
    formularioRuta.addEventListener("submit", guardarRuta);
  }

  //Para borrar cualquier sombra negra restante
  const modalParadas = document.getElementById("modalParadas");
  if (modalParadas) {
    modalParadas.addEventListener("hidden.bs.modal", function () {
      forzarCierreModal();

      const divC = document.getElementById('contenedorComentario');
       if (divC) {
        divC.style.display = 'none';
       }

      if (mapaAdmin) {
        mapaAdmin.remove();
        mapaAdmin = null;
      }
      seleccionMarcador = null;
    });
  }

  //Limpiar el modal de reportes
  const modalReportes = document.getElementById("modalReporte");
  if (modalReportes) {
    modalReportes.addEventListener("hidden.bs.modal", function () {
      document.getElementById("formReporte").reset();

      const divComentario = document.getElementById('contenedorComentario');
      if (divComentario) {
        divComentario.style.display = 'none';
      }

      const textoComentario = document.getElementById('comentarioReporte');
       if (textoComentario) {
         textoComentario.removeAttribute('required');
       }
    });
  }

  //Visiblidad del campo de comentarios en el modal de reporte
  configurarVisibilidadReporte();

  //Para borrar todo rastro de la barra de busqueda
  window.addEventListener("pageshow", function (event) {
    const formularioBusqueda = document.getElementById("formulario-busqueda");
    if (formularioBusqueda) {
      formularioBusqueda.reset();
    }
  });

  //Activar la libreria de reloj
  if (
    typeof flatpickr !== "undefined" &&
    document.querySelector(".reloj-pro")
  ) {
    flatpickr(".reloj-pro", {
      enableTime: true,
      noCalendar: true,
      dateFormat: "h:i K", //Formato estilo "8:00 AM"
      minuteIncrement: 15,
    });
  }
});


// FAVORITOS - pagina dedicada
function cargarPaginaFavoritos() {
  const contenedor = document.getElementById("contenedor-favoritos");
  if (!contenedor) return;

  const usuarioId = obtenerUsuarioIdLogueado();

  if (!usuarioId) {
    contenedor.innerHTML = `
      <div class="text-center text-secondary py-5">
        <p class="mb-3">Debes iniciar sesion para ver tus rutas favoritas.</p>
        <a href="login.html" class="btn btn-auth-primary">Iniciar sesion</a>
      </div>`;
    return;
  }

  fetch(`${API_BASE}/favoritos/usuario/${usuarioId}`)
    .then(function (response) {
      if (!response.ok) throw new Error("No se pudieron cargar los favoritos");
      return response.json();
    })
    .then(function (favoritos) {
      idsRutasFavoritas = new Set(favoritos.map(function (fav) { return fav.ruta.id; }));
      pintarTarjetasFavoritos(favoritos);
    })
    .catch(function (error) {
      console.error("Error al cargar favoritos:", error);
      contenedor.innerHTML = `
        <div class="text-center text-danger py-5">
          No se pudieron cargar tus favoritos. Revisa que el servidor este corriendo.
        </div>`;
    });
}

function pintarTarjetasFavoritos(favoritos) {
  const contenedor = document.getElementById("contenedor-favoritos");
  if (!contenedor) return;

  if (!Array.isArray(favoritos) || favoritos.length === 0) {
    contenedor.innerHTML = `
      <div class="text-center text-secondary py-5">
        Aun no tienes rutas guardadas como favoritas.
      </div>`;
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
      </div>
    `;
  });

  contenedor.innerHTML = html;

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

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
}}
