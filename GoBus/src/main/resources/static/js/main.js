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
  const botonSesion= document.getElementById('btn-sesion-header');

  if (loggeado){
    if (linkAdmin){
      linkAdmin.style.display=(rol==='ADMIN')?'inline':'none';
    }

    if (botonSesion){
      botonSesion.innerHTML='<i data-lucide="log-out" class="nav-icon"></i> Salir';
      botonSesion.href="#";

      botonSesion.onclick = (e) => {
        e.preventDefault();
        cerrarSesion();
      };
    }
    }else{

      if (linkAdmin){
      linkAdmin.style.display = 'none';
    }

    if (botonSesion){
      botonSesion.innerHTML='<i data-lucide="log-in" class="nav-icon"></i> Ingresar';
      botonSesion.classList.replace('btn-outline-danger', 'btn-outline-light')
      botonSesion.href="login.html";
      botonSesion.onclick=null;
    }
    }

    if (typeof lucide!=="undefined") lucide.createIcons();


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

//FUNCIONALIDADES DE USUARIO

//Boton para mostrar la contrasena oculta
function verContrasena(idBoton, idInput) {
  const btn = document.querySelector(idBoton);
  const input = document.querySelector(idInput);

  if (btn && input) {
    btn.addEventListener('click', function () {
      const tipo = input.getAttribute('type') === 'password' ? 'text' : 'password';
      input.setAttribute('type', tipo);

      const icono = btn.querySelector('[data-lucide]');

      if (icono) {
        if (tipo == 'text') {
          icono.setAttribute('data-lucide', 'eye');
        } else {
          icono.setAttribute('data-lucide', 'eye-off');
        }
        lucide.createIcons();
      }
    });
  }
}


function crearCuenta(){
  const formulario= document.getElementById('registroFormulario');
  
  if (formulario){
    formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    //Capturar los valores del formulario
    const nombreInput=document.querySelector('input[placeholder="Tu nombre y apellidos"]').value;
    const emailInput= document.getElementById('email').value;
    const passwordInput= document.getElementById('password').value;

    //Crear el objecto Json
    const usuarioDatos ={
      nombre: nombreInput,
      correo: emailInput,
      userPassword: passwordInput,
    };

    try{
      //Peticion hacia el servidor
      const respuesta= await fetch('http://localhost:8080/usuarios',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioDatos)      
      });

      //Verificar si se pudo completar la accion correctamente

      if (respuesta.ok){
        Swal.fire({
          title: 'Exito',
          text: 'Usuario registrado exitosamente',
          icon: 'success',
          confirmButtonColor: '#0d6efd'
        }).then(() => {
          window.location.href="login.html";
        });

      }else{
        Swal.fire({
            title: 'Error en registro',
            text: 'Error al registrar el usuario',
            icon: 'error',
            confirmButtonColor: '#fd0d0d'
        });
      }

    }catch(error){
      console.error("Error de conexion:",error)
      Swal.fire({
          title: 'Error de conexion',
          text: 'No se pudo conectar con el servidor',
          icon: 'error',
          confirmButtonColor: '#cccbcb'
        });
      
    }
  });

}
}

function iniciarSesion(){
  const formulario= document.getElementById('loginFormulario');
  
  if (formulario){
    formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    //Recolectar datos
    const loginDatos ={
      correo: document.getElementById('email').value,
      userPassword: document.getElementById('password').value,
    };

    try{
      //Peticion hacia el servidor
      const respuesta= await fetch('http://localhost:8080/usuarios/login',{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginDatos)      
      });

      //Verificar si se pudo completar la accion correctamente

      if (respuesta.ok){
        const usuario = await respuesta.json();

        localStorage.setItem('usuarioNombre', usuario.nombre);
        localStorage.setItem('usuarioRol', usuario.rol);
        localStorage.setItem('loggeado', 'true');

        Swal.fire({
          title: '¡Bienvenido!',
          text: 'Hola ' + usuario.nombre + ', bienvenido a GoBus',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
           timerProgressBar: true
         }).then(() => {
          window.location.href="index.html";
         });

      }else{
        Swal.fire({
          title: 'Error de acceso',
          text: 'Correo o contraseña incorrectos',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
      }

    }catch(error){
      console.error("Error de conexion:",error)
      Swal.fire({
          title: 'Error de conexion',
          text: 'No se pudo conectar con el servidor',
          icon: 'error',
          confirmButtonColor: '#cccbcb'
        });
    }
  });

}
}

function cerrarSesion(){
    Swal.fire({
      title:'¿Cerrar sesión?',
      text: "¿Estás seguro de que deseas salir de GoBus?",
      icon:'question',
      showCancelButton: true,
      confirmButtonColor: '#0d6efd',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar'
      
    }).then((resultado) => {
      if (resultado.isConfirmed) {
      localStorage.clear();
      location.href = "index.html";
    }
  });

}

async function cargarUsuariosRecientes() {
  const contenedorUsuarios= document.getElementById('contenedor-usuarios-recientes')
  if (!contenedorUsuarios) return;

  try{
    const respuesta= await fetch('http://localhost:8080/usuarios');
    const usuarios= await respuesta.json();

    let contenedorVacio='';

    //Cargar ultimos 3 o 5 usuarios recientemente creados

    const ultimosCincoUsuarios = [...usuarios].reverse().slice(0, 4);

    ultimosCincoUsuarios.forEach(user => {
      //Segun el rol del usuario la seccion dibuja al lado del usuario su rol si es admin o usuario
      contenedorVacio += `
      <div class="list-group-item p-4 d-flex justify-content-between align-items-center fila-usuario">

      <div>
        <h6 class="fw-bold mb-1">${user.nombre}</h6>
        <p class="small text-secondary mb-0">${user.correo}</p>
        </div>

      <span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">
        ${user.rol === 'ADMIN' ? 'Admin' : 'Usuario'}
        </span>
        </div>
        `;
    });

    contenedorUsuarios.innerHTML=contenedorVacio;

  }catch(error){
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
  "ts-internacional": "Internacional"
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
}

// Pinta un arreglo de rutas dado dentro de #contenedor-rutas (ya sea todas o el resultado de un filtro)
// Estado de la paginacion
const RUTAS_POR_PAGINA = 3;
let paginaActual = 1;
let rutasActualmentefiltradas = [];

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
  if (paginaActual > totalPaginas) {
    paginaActual = 1;
  }

  const inicio = (paginaActual - 1) * RUTAS_POR_PAGINA;
  const rutasDeEstaPagina = rutasActualmentefiltradas.slice(inicio, inicio + RUTAS_POR_PAGINA);

  let html = "";

  rutasDeEstaPagina.forEach(function (ruta) {
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

  contenedorPaginacion.addEventListener("click", function (e) {
    const link = e.target.closest("[data-pagina]");
    if (!link) return;

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



  //INICIALIACION
  document.addEventListener("DOMContentLoaded", function () {

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
