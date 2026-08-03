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

    //En caso de que no haya usuarios registrados recientemente

    if (usuarios.length===0){
      contenedorUsuarios.innerHTML=`
      <div class="text-center p-5 text-secondary">
      <i data-lucide="users-2" class="mb-3 opacity-20" style="width: 48px; height: 48px;"></i>
      <p class="small mb-0">No hay usuarios registrados todavía.</p>
      </div>`;
      lucide.createIcons();
      return;
    }

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

async function cargarRutasDesdeBackend() {
  const contenedorRutas = document.getElementById('contenedorRutas');

  if (!contenedorRutas) {
    return;
  }
  fetch("/api/rutas")
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
function cargarDetalleRutaDesdeBackend() {
  const paginaActual = window.location.pathname;

  if (!paginaActual.includes("detalle-ruta.html")) {
    return;
  }
  const parametros = new URLSearchParams(window.location.search);
  const idRuta = parametros.get("id") || 1;

  fetch(`/api/rutas/${idRuta}`)
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

//Funcion para mostrar rutas visualmente en el panel de admin
async function cargarRutasPanelAdmin() {
  const tablaAdmin = document.querySelector('#tabla-rutas-admin');
  if (!tablaAdmin) return; //Verificar si la tabla existe

  tablaAdmin.innerHTML = '<tr><td colspan="7" class="text-center">Actualizando...</td></tr>';

  try {
    const respuesta = await fetch("/api/rutas");
    const rutas = await respuesta.json();

    let filasHTML = "";

    rutas.forEach(ruta => {
      const badgeColor = ruta.estado === 'Activa' ? 'bg-success' : 'bg-warning'; //Si la ruta dice "Activa" se guarda como bg-success, si no es asi se guarda como bg-warning

      //Inyecta esos valores a la base de datos
      filasHTML += ` 
      <tr class="border-bottom">
      <td class="ps-4 py-3 fw-bold text-dark">${ruta.origen} - ${ruta.destino}</td>
      <td class="py-3 text-secondary">${ruta.empresa}</td>
      <td class="py-3 text-secondary">${ruta.tipo}</td>
      <td class="py-3 fw-bolder text-dark">₡${(ruta.tarifa || 0).toLocaleString("es-CR")}</td>
      <td class="py-3">${ruta.frecuencia || 'N/A'}</td>
      <td class="py-3">
      <span class="badge ${badgeColor} bg-opacity-10 ${badgeColor.replace('bg-', 'text-')} rounded-pill px-3">
              ${ruta.estado || 'Activa'}
      </span>
      </td>
      <td class="py-3 text-end pe-4">
      <div class="d-flex gap-2 justify-content-end">
      <button onclick="prepararEdicion(${ruta.id})" class="btn btn-sm btn-light border">Editar</button>
      <button onclick="confirmarEliminar(${ruta.id})" class="btn btn-sm btn-outline-danger">Eliminar</button>
      </div>
      </td>
       </tr>`;
    });

    //Coloca todo lo que esta acumulado en filasHTML y lo coloca en la tablaAdmin

    tablaAdmin.innerHTML = filasHTML;

    if (typeof lucide !== "undefined") lucide.createIcons(); //Volver a dibujar los iconos

  } catch (error) {
    console.error("Error al conectar con la API de rutas:", error); //Manejo de errores
    tablaAdmin.innerHTML = '<tr><td colspan="7" class="text-danger text-center">Error al cargar datos</td></tr>';
  }
}

async function guardarRuta(e) {
  e.preventDefault();

  //Recoleccion de datos de lo que se escribio en el modal

  const datosRuta = {
    id: document.getElementById('rutaID').value || null,
    origen: document.getElementById('origen').value,
    destino: document.getElementById('destino').value,
    empresa: document.getElementById('empresa').value,
    tarifa: parseFloat(document.getElementById('tarifa').value),
    frecuencia: document.getElementById('frecuencia').value,
    tipo: document.getElementById('tipo').value,
    estado: document.getElementById('estado').value,
  };

  try {
    const respuesta = await fetch("http://localhost:8080/api/rutas", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosRuta)
    });


    if (respuesta.ok) {
      Swal.fire('¡Éxito!', 'La ruta se guardó correctamente', 'success');

      const modal = bootstrap.Modal.getInstance(document.getElementById('modalRuta'));
      modal.hide();

      //Volver a llamar a la funcion para que muestre la lista actualizada y la dibuje
      cargarRutasPanelAdmin();
    }
  } catch (error) {
    console.error("Error al guardar:", error);
  }
}

async function confirmarEliminar(id){
  const result= await Swal.fire({
    title: '¿Eliminar ruta?',
    text: "Esta acción no se puede deshacer",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc3545',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed){
    try{
      const respuesta= await fetch (`/api/rutas/${id}`, { method: 'DELETE' });
      if (respuesta.ok){
        Swal.fire('Eliminada', 'La ruta ha sido borrada', 'success');
        cargarRutasPanelAdmin();
      }

    }catch(error){
       Swal.fire('Error', 'No se pudo eliminar', 'error');
    }
  }
}

async function prepararEdicion(id) {
  try {
    const respuesta = await fetch(`/api/rutas/${id}`);
    const ruta = await respuesta.json();

    document.getElementById('modalTitulo').innerText = "Editar ruta";
    document.getElementById('rutaID').value = ruta.id;

    document.getElementById('origen').value = ruta.origen ||"";
    document.getElementById('destino').value = ruta.destino ||"";
      document.getElementById('empresa').value = ruta.empresa ||"";
    document.getElementById('tarifa').value = ruta.tarifa || 0;
    document.getElementById('frecuencia').value = ruta.frecuencia ||"";
    document.getElementById('tipo').value = ruta.tipo ||"Urbano";
    document.getElementById('estado').value = ruta.estado ||"Activa";

    const modalRuta = new bootstrap.Modal(document.getElementById('modalRuta'));
    modalRuta.show();


  } catch (error) {
    console.error("Error al cargar datos para editar:", error);
  }
}

function limpiarFormularioRuta(){
    document.getElementById('modalTitulo').innerText="Agregar nueva ruta";
    document.getElementById('formularioRuta').reset();
    document.getElementById('rutaID').value="";
}


  //INICIALIACION
  document.addEventListener("DOMContentLoaded", function () {

    //Cargar estructura visual
    cargarPlantillas();

    //Listeners de formularios
    //Crear cuenta
    crearCuenta();
    //Login
    iniciarSesion();
    //Boton contrasena
    verContrasena('#togglePassword', '#password');

    //Cargar usuarios recientes en el panel de admin
    cargarUsuariosRecientes();

    //Llenado de tabla para admin
    cargarRutasPanelAdmin();

    //Cargar datos de rutas
    cargarRutasDesdeBackend();
    cargarDetalleRutaDesdeBackend();


});
