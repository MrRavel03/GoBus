// js/main.js
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

function actualizarHeaderInterfaz() {
  const loggeado = localStorage.getItem("loggeado") === "true";
  const rol = localStorage.getItem("usuarioRol");

  const linkAdmin = document.getElementById("link-admin-header");
  const botonSesion = document.getElementById("btn-sesion-header");

  if (loggeado) {
    if (linkAdmin) {
      linkAdmin.style.display = rol === "ADMIN" ? "inline" : "none";
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
  } else {
    if (linkAdmin) {
      linkAdmin.style.display = "none";
    }

    if (botonSesion) {
      botonSesion.innerHTML =
        '<i data-lucide="log-in" class="nav-icon"></i> Ingresar';
      botonSesion.classList.replace("btn-outline-danger", "btn-outline-light");
      botonSesion.href = "login.html";
      botonSesion.onclick = null;
    }
  }

  if (typeof lucide !== "undefined") lucide.createIcons();
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
        const respuesta = await fetch("http://localhost:8080/usuarios", {
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
        const respuesta = await fetch("http://localhost:8080/usuarios/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginDatos),
        });

        //Verificar si se pudo completar la accion correctamente

        if (respuesta.ok) {
          const usuario = await respuesta.json();

          localStorage.setItem("usuarioNombre", usuario.nombre);
          localStorage.setItem("usuarioRol", usuario.rol);
          localStorage.setItem("loggeado", "true");

          Swal.fire({
            title: "¡Bienvenido!",
            text: "Hola " + usuario.nombre + ", bienvenido a GoBus",
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
    const respuesta = await fetch("http://localhost:8080/usuarios");
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
    let contenedorVacio='';

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

async function cargarRutasDesdeBackend() {
  const contenedorRutas = document.getElementById("contenedorRutas");
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
      selectDestino.innerHTML = '<option value="">Destino no disponible</option>';
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

    const parametros = new URLSearchParams();
    if (origen) parametros.set("origen", origen);
    if (destino) parametros.set("destino", destino);

    window.location.href = "rutas.html?" + parametros.toString();
  });
}


// Imagenes por defecto segun el origen de la ruta.
// Si el origen no coincide con ninguna, se usa la imagen "default".
const IMAGENES_POR_ORIGEN = {
  "san jose": "https://www.geckoroutes.com/images/wp-uploads/2021/10/Aerial-view-of-Costa-Ricas-San-Jose-city.jpg",
  "alajuela": "https://costarica.org/wp-content/uploads/2014/12/Alajuela-Building1.jpg",
  "heredia": "https://media.licdn.com/dms/image/v2/D4E12AQH8SKQDWor_kg/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1685067618225?e=2147483647&v=beta&t=oeppYclxfvpdzasfmjpxHMexONIh4HOb7n4X5l2lIDk",
  "cartago": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaE_tmCJP22O6_1VPiT3T0YLbDwt-iOcdeJzvlS2TKlfRoTNDybGjDhqE&s=10",
  "default": "https://img.magnific.com/vector-gratis/ubicacion-pin-ruta-bandera_78370-4270.jpg?semt=ais_hybrid&w=740&q=80"
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

  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("El servidor respondio " + response.status);
      }
      return response.json();
    })
    .then(function (rutas) {
      if (!Array.isArray(rutas) || rutas.length === 0) {
        const huboFiltro = parametros.toString() !== "";
        contenedorRutas.innerHTML = `
          <div class="text-center text-secondary py-5">
            ${huboFiltro
              ? "No hay rutas que coincidan con tu busqueda."
              : "No hay rutas registradas todavia."}
          </div>`;
        return;
      }

      let html = "";

      rutas.forEach(function (ruta) {
        html += `
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
                <span class="fs-4 fw-bolder text-dark mb-2">${formatearColones(ruta.tarifa)}</span>
                <div class="btn-round-arrow">
                  <i data-lucide="chevron-right" style="width: 20px;"></i>
                </div>
              </div>
            </div>
          </a>
        `;
      });

      contenedorRutas.innerHTML = html;

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    })
    .catch(function (error) {
      console.error("Error al cargar las rutas:", error);
      contenedorRutas.innerHTML = `
        <div class="text-center text-danger py-5">
          No se pudieron cargar las rutas. Revisa que el servidor este corriendo.
        </div>`;
    });
}

//Angelica actualizacion recorridos.
function cargarDetalleRutaDesdeBackend() {
  const paginaActual = window.location.pathname;

  if (!paginaActual.includes("detalle-ruta.html")) {
    return;
  }
  const parametros = new URLSearchParams(window.location.search);
  const idRuta = parametros.get("id") || 1;

  fetch(`/api/rutas/${idRuta}`)
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

  if (tablaHorarios && ruta.horarios && ruta.horarios.length > 0) {
    tablaHorarios.innerHTML = "";

    ruta.horarios.forEach(function (horario) {
      tablaHorarios.innerHTML += `
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
          <td class="py-3 text-dark small">${horario.frecuencia}</td>
        </tr>
      `;
    });
  }
  // Recorrido y paradas
  const recorrido = document.querySelector(".detail-timeline");

  if (recorrido && ruta.paradas && ruta.paradas.length > 0) {
    recorrido.innerHTML = "";

    ruta.paradas.forEach(function (parada, index) {
      let claseDot = "";

      if (index === 0) {
        claseDot = "primary";
      } else if (index === ruta.paradas.length - 1) {
        claseDot = "success";
      }
      htmlParadas += `
        <div class="detail-timeline-item">
          <div class="detail-timeline-dot ${claseDot}"></div>
          <h6 class="fw-bold text-dark mb-1">${parada.nombre}</h6>
          <p class="small text-secondary mb-0">${parada.descripcion || ""}</p> 
        </div>`;
    });
    recorrido.innerHTML = htmlParadas;
  }

  //SECCION 4: Tarifa y empresa
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
  let url = "http://localhost:8080/api/rutas";
  let metodo = "POST";

  //Editar ruta
  if (idRuta && idRuta.trim() !== "") {
    url = `http://localhost:8080/api/rutas/${idRuta}`;
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
    const respuesta = await fetch("http://localhost:8080/api/horarios", {
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

  const res = await fetch("http://localhost:8080/api/paradas", {
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

  paradas.forEach((p) => {
    L.marker([p.latitud, p.longitud])
      .addTo(mapaDetalle)
      .bindPopup(`<b>${p.nombre}</b><br>Punto de abordaje oficial`);
  });
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
    estado: "Pendiente",
  };

  try {
    const res = await fetch("http://localhost:8080/api/reportes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datosReporte),
    });
}



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
    const res = await fetch("http://localhost:8080/api/reportes");
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
  const response = await fetch("http://localhost:8080/api/reportes");
  const reportes = await response.json();
  const tablaBody = document.querySelector("#tabla-todos-reportes tbody");
  tablaBody.innerHTML = "";

  //Muestra reportes mas recientes primero
  reportes.reverse().forEach((rep) => {
    const Pendiente = rep.estado === "Pendiente";
    const filaClase = Pendiente ? "" : "opacity-50 bg-light";

    const badgeClass = Pendiente
      ? "bg-warning text-warning"
      : "bg-success text-success";

    //Si el reporte tiene fecha desde la base de datos la muestra, si no es asi muestra la fecha actual
    const fechaReal = rep.fecha
      ? new Date(rep.fecha).toLocaleDateString()
      : new Date().toLocaleDateString();

    tablaBody.innerHTML += `
    <tr class="${filaClase} align-middle">
    <td class="small text-muted py-3">${fechaReal}</td>
    <td class="py-3">
    <div class="fw-bold text-dark fs-5 mb-2">${rep.tipo}</div>
    <div class="text-secondary fw-medium">${rep.rutaNombre}</div>
    </td>
    <td class="py-3 text-end pe-4">
    <button onclick="${Pendiente ? `cambiarEstadoReporte(${rep.id})` : ''}" 
    class="badge ${badgeClass} bg-opacity-10 border-0 py-2 px-3 rounded-pill"
    style="${Pendiente ? 'cursor: pointer;' : 'cursor: default;'} font-size: 0.75rem;">
    ${rep.estado}
    </button>
    </td>
    </tr>`;
  });
        
  const modal = document.getElementById("modalHistorialReportes");
  //Evita duplicados de memoria
  let instancia = bootstrap.Modal.getInstance(modal);

  if (!instancia) {
    instancia = new bootstrap.Modal(modal);
  }
  instancia.show();
}

async function cambiarEstadoReporte(id) {
  try {
    const res = await fetch(
      `http://localhost:8080/api/reportes/${id}/revisado`,
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

    //Cargar los datos de reportes
    cargarReportes(),
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
    });
  }

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
    //Cargar header
    cargarPlantillas();

    //Registro
    crearCuenta();

    //Login
    iniciarSesion();

    //Boton contrasena
    verContrasena('#togglePassword', '#password');

    //Cargar usuarios recientes en el panel de admin
    cargarUsuariosRecientes();

    //Buscador del index (selects de origen y destino)
    cargarOpcionesBusqueda();
    activarBusqueda();

    //Cargar datos de rutas
    cargarRutasDesdeBackend();
    cargarDetalleRutaDesdeBackend();

    //Cargar rutas destacadas al azar en index.html
    cargarRutasDestacadas();


});
