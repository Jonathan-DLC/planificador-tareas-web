/* =========================================================
   ESCAMPA · Lógica de la página
   - Sprint 2, Tarea 5: el formulario registra tareas con
     taskManager.addTask() y las muestra en el cuaderno.
   - Sprint 2, Tarea 4: instancia de TaskManager y botón para
     marcar o desmarcar una tarea como completada.
   - Sprint 1, Tarea 3: validación del formulario de nueva tarea
     con una alerta de Bootstrap que dice qué corregir.
   ========================================================= */

// TaskManager viene de taskManager.js, que se carga antes que este archivo
const taskManager = new TaskManager();
console.log(taskManager.tasks);

// ---------------------------------------------------------
// Completar tareas
// ---------------------------------------------------------

const listaTareas = document.querySelector('.tareas');

function alternarCompletada(tarjeta) {
  const completada = tarjeta.classList.toggle('completada');
  const boton = tarjeta.querySelector('.btn-completar');
  const titulo = tarjeta.querySelector('.tarea-titulo').textContent;

  boton.setAttribute('aria-pressed', completada);
  boton.setAttribute('aria-label', (completada ? 'Marcar como pendiente: ' : 'Marcar como completada: ') + titulo);
}

// Un solo listener en la lista sirve para todas las tarjetas,
// también para las que se agreguen después con JavaScript
listaTareas.addEventListener('click', (evento) => {
  const boton = evento.target.closest('.btn-completar');
  if (boton) {
    alternarCompletada(boton.closest('.tarea'));
  }
});

// ---------------------------------------------------------
// Mostrar una tarea nueva en el cuaderno
// ---------------------------------------------------------

const plantillaTarea = document.querySelector('#plantillaTarea');
const filtroTodas = document.querySelector('#filtro-todas');
const filtroCompletadas = document.querySelector('#filtro-completadas');

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const TEXTO_PRIORIDAD = { baja: 'Baja', media: 'Media', alta: 'Alta' };
const TEXTO_CATEGORIA = { trabajo: 'Trabajo', estudio: 'Estudio', personal: 'Personal' };

// El input date entrega "2026-11-30"; se arma la fecha local para que no se corra un día por la zona horaria
function leerFecha(textoFecha) {
  const [anio, mes, dia] = textoFecha.split('-').map(Number);
  return new Date(anio, mes - 1, dia);
}

function textoRelativo(fecha) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const dias = Math.round((fecha - hoy) / 86400000);

  if (dias === 0) return { texto: '(vence hoy)', clase: 'entrega-hoy' };
  if (dias === 1) return { texto: '(mañana)', clase: '' };
  if (dias > 1) return { texto: `(en ${dias} días)`, clase: '' };
  if (dias === -1) return { texto: '(venció ayer)', clase: 'entrega-atrasada' };
  return { texto: `(venció hace ${-dias} días)`, clase: 'entrega-atrasada' };
}

function crearTarjeta(tarea) {
  const tarjeta = plantillaTarea.content.firstElementChild.cloneNode(true);
  const fecha = leerFecha(tarea.dueDate);
  const relativo = textoRelativo(fecha);

  tarjeta.dataset.id = tarea.id;
  tarjeta.querySelector('.tarea-titulo span').textContent = tarea.name;
  tarjeta.querySelector('.tarea-desc').textContent = tarea.description;

  const prioridad = tarjeta.querySelector('.prioridad');
  prioridad.classList.add(`prioridad-${tarea.priority}`);
  prioridad.textContent = TEXTO_PRIORIDAD[tarea.priority];
  tarjeta.querySelector('.categoria').textContent = TEXTO_CATEGORIA[tarea.category];

  const tiempo = tarjeta.querySelector('time');
  tiempo.dateTime = tarea.dueDate;
  tiempo.textContent = `${fecha.getDate()} ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}`;

  const entregaRelativa = tarjeta.querySelector('.entrega-relativa');
  entregaRelativa.textContent = relativo.texto;
  if (relativo.clase) entregaRelativa.classList.add(relativo.clase);

  tarjeta.querySelector('.btn-completar').setAttribute('aria-label', `Marcar como completada: ${tarea.name}`);
  tarjeta.querySelector('.btn-editar').setAttribute('aria-label', `Editar: ${tarea.name}`);
  tarjeta.querySelector('.btn-eliminar').setAttribute('aria-label', `Eliminar: ${tarea.name}`);

  return tarjeta;
}

function mostrarTarea(tarea) {
  // Si está activo el filtro "Completadas", la tarea nueva (por hacer) quedaría oculta
  if (filtroCompletadas.checked) filtroTodas.checked = true;
  listaTareas.prepend(crearTarjeta(tarea));
}

// ---------------------------------------------------------
// Validación del formulario
// ---------------------------------------------------------

// Campos del formulario
const newTaskForm = document.querySelector('#newTaskForm');
const newTaskNameInput = document.querySelector('#newTaskNameInput');
const newTaskDescriptionInput = document.querySelector('#newTaskDescriptionInput');
const newTaskDateInput = document.querySelector('#newTaskDateInput');
const newTaskStatusSelect = document.querySelector('#newTaskStatusSelect');
const newTaskCategorySelect = document.querySelector('#newTaskCategorySelect');

// Alertas
const newTaskErrorAlert = document.querySelector('#newTaskErrorAlert');
const newTaskErrorList = document.querySelector('#newTaskErrorList');
const newTaskSuccessAlert = document.querySelector('#newTaskSuccessAlert');

// Relaciona cada dato con su campo, para marcar en rojo el que tenga error
const camposPorDato = {
  nombre: newTaskNameInput,
  descripcion: newTaskDescriptionInput,
  fechaEntrega: newTaskDateInput,
  estado: newTaskStatusSelect
};

function leerFormulario() {
  return {
    nombre: newTaskNameInput.value,
    descripcion: newTaskDescriptionInput.value,
    fechaEntrega: newTaskDateInput.value,
    estado: newTaskStatusSelect.value,
    categoria: newTaskCategorySelect.value,
    prioridad: newTaskForm.querySelector('input[name="prioridad"]:checked').value
  };
}

/**
 * Revisa los datos del formulario y devuelve si son válidos
 * junto con la lista de errores encontrados.
 */
function validFormFieldInput(data) {
  const errores = [];
  const nombre = data.nombre.trim();

  if (nombre === '') {
    errores.push({ dato: 'nombre', mensaje: 'Escribe el nombre de la tarea.' });
  } else if (nombre.length < 3) {
    errores.push({ dato: 'nombre', mensaje: 'El nombre necesita al menos 3 caracteres.' });
  }

  if (data.descripcion.trim() === '') {
    errores.push({ dato: 'descripcion', mensaje: 'Escribe una descripción.' });
  }

  if (data.fechaEntrega === '') {
    errores.push({ dato: 'fechaEntrega', mensaje: 'Elige la fecha de entrega.' });
  }

  if (data.estado === '') {
    errores.push({ dato: 'estado', mensaje: 'Elige el estado de la tarea.' });
  }

  return { esValido: errores.length === 0, errores };
}

function marcarCampos(errores) {
  const datosConError = errores.map((error) => error.dato);

  for (const [dato, campo] of Object.entries(camposPorDato)) {
    const tieneError = datosConError.includes(dato);
    campo.classList.toggle('is-invalid', tieneError);
    campo.setAttribute('aria-invalid', tieneError);
  }

  // El mensaje del nombre cambia según el error (vacío o muy corto)
  const errorNombre = errores.find((error) => error.dato === 'nombre');
  if (errorNombre) {
    document.querySelector('#error-nombre').textContent = errorNombre.mensaje;
  }
}

function mostrarErrores(errores) {
  newTaskErrorList.innerHTML = '';
  for (const error of errores) {
    const item = document.createElement('li');
    item.textContent = error.mensaje;
    newTaskErrorList.append(item);
  }

  newTaskSuccessAlert.classList.add('d-none');
  newTaskErrorAlert.classList.remove('d-none');
}

function ocultarErrores() {
  newTaskErrorAlert.classList.add('d-none');
  newTaskErrorList.innerHTML = '';
}

newTaskForm.addEventListener('submit', (evento) => {
  // Sin esto el navegador recargaría la página al enviar
  evento.preventDefault();

  const data = leerFormulario();
  console.log('Datos del formulario:', data);

  const { esValido, errores } = validFormFieldInput(data);
  marcarCampos(errores);

  if (esValido) {
    ocultarErrores();

    // Solo con datos válidos se registra la tarea en TaskManager
    taskManager.addTask(
      data.nombre.trim(),
      data.descripcion.trim(),
      data.fechaEntrega,
      data.estado,
      data.prioridad,
      data.categoria
    );
    const tareaNueva = taskManager.tasks[taskManager.tasks.length - 1];
    mostrarTarea(tareaNueva);
    console.log('Tarea agregada:', tareaNueva);
    console.log(taskManager.tasks);

    newTaskSuccessAlert.textContent = `Tarea agregada: ${tareaNueva.name}.`;
    newTaskSuccessAlert.classList.remove('d-none');

    // El formulario queda limpio para la siguiente tarea
    newTaskForm.reset();
    newTaskNameInput.focus();
  } else {
    mostrarErrores(errores);
    // Lleva el foco al primer campo con error para corregirlo directo
    camposPorDato[errores[0].dato].focus();
    console.log('Formulario con errores:', errores);
  }
});

// Al corregir un campo se quita su marca roja; la alerta se actualiza en el siguiente envío
for (const campo of Object.values(camposPorDato)) {
  const evento = campo.tagName === 'SELECT' || campo.type === 'date' ? 'change' : 'input';
  campo.addEventListener(evento, () => {
    campo.classList.remove('is-invalid');
    campo.setAttribute('aria-invalid', false);
    newTaskSuccessAlert.classList.add('d-none');
  });
}
