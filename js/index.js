/* =========================================================
   ESCAMPA · Lógica de la página
   - Sprint 2, Tarea 6: eliminar tareas y guardarlas en
     localStorage para que sigan ahí al recargar.
   - Sprint 2, Tarea 5: el formulario registra tareas con
     taskManager.addTask() y las muestra en el cuaderno.
   - Sprint 2, Tarea 4: instancia de TaskManager y botón para
     marcar o desmarcar una tarea como completada.
   - Sprint 1, Tarea 3: validación del formulario de nueva tarea
     con una alerta de Bootstrap que dice qué corregir.
   ========================================================= */

// TaskManager viene de taskManager.js, que se carga antes que este archivo
const taskManager = new TaskManager();

// Fecha de hoy en el encabezado, por ejemplo "Martes, 24 de noviembre"
const fechaHoy = new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' });
document.querySelector('.barra-fecha').textContent = fechaHoy.charAt(0).toUpperCase() + fechaHoy.slice(1);

// ---------------------------------------------------------
// Cargar las tareas guardadas
// ---------------------------------------------------------

// Fecha en formato "2026-11-30" a una cantidad de días de hoy
function fechaDentroDe(dias) {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${fecha.getFullYear()}-${mes}-${dia}`;
}

// La primera visita no tiene nada guardado: se cargan cinco tareas de ejemplo.
// Si el usuario las borra, se guardan borradas y no vuelven a aparecer
function cargarTareasDeEjemplo() {
  taskManager.addTask('Diseñar el wireframe en Figma', 'Encabezado, formulario, lista de tareas y botones principales.', '2026-11-02', 'PORHACER', 'alta', 'trabajo');
  taskManager.addTask('Maquetar el layout con Bootstrap', 'Encabezado y dos columnas, formulario y lista, que se apilan en el celular.', '2026-11-03', 'PORHACER', 'alta', 'trabajo');
  taskManager.addTask('Crear la tarjeta de tarea', 'Card de Bootstrap con nombre, descripción, fecha de entrega y estado.', '2026-11-03', 'PORHACER', 'media', 'trabajo');
  taskManager.addTask('Validar el formulario', 'Nombre, descripción, fecha de entrega y estado obligatorios, con alerta de Bootstrap.', fechaDentroDe(2), 'PORHACER', 'media', 'trabajo');
  taskManager.addTask('Repasar Box Model y Flexbox', 'Volver al laboratorio práctico antes de seguir maquetando.', fechaDentroDe(-1), 'PORHACER', 'baja', 'estudio');

  // Las tres primeras ya están hechas
  [1, 2, 3].forEach((id) => taskManager.toggleTaskStatus(id));
  taskManager.save();
}

if (!taskManager.load()) {
  cargarTareasDeEjemplo();
}
taskManager.render();
console.log(taskManager.tasks);

// ---------------------------------------------------------
// Completar y eliminar tareas
// ---------------------------------------------------------

const listaTareas = document.querySelector('#tasksList');
const filtroTodas = document.querySelector('#filtro-todas');
const filtroCompletadas = document.querySelector('#filtro-completadas');

// Se cambia la clase en la tarjeta que ya existe (sin volver a dibujar la lista)
// para que se vea la animación del tachado
function alternarCompletada(tarjeta) {
  const completada = tarjeta.classList.toggle('completada');
  const boton = tarjeta.querySelector('.btn-completar');
  const titulo = tarjeta.querySelector('.tarea-titulo').textContent;

  boton.setAttribute('aria-pressed', completada);
  boton.setAttribute('aria-label', (completada ? 'Marcar como pendiente: ' : 'Marcar como completada: ') + titulo);
}

// Un solo listener en la lista sirve para todas las tarjetas,
// también para las que se dibujan después con render()
listaTareas.addEventListener('click', (event) => {
  // closest() encuentra el botón aunque el clic caiga sobre su ícono
  const botonCompletar = event.target.closest('.btn-completar');
  const botonEliminar = event.target.closest('.delete-button');

  if (botonCompletar) {
    const tarjeta = botonCompletar.closest('[data-task-id]');
    taskManager.toggleTaskStatus(Number(tarjeta.dataset.taskId));
    taskManager.save();
    alternarCompletada(tarjeta);
  }

  if (botonEliminar) {
    // La tarjeta (el elemento con data-task-id) está varios niveles arriba del botón
    const parentTask = botonEliminar.closest('[data-task-id]');
    // dataset entrega el id como texto: se pasa a número para compararlo con task.id
    const taskId = Number(parentTask.dataset.taskId);

    taskManager.deleteTask(taskId);
    taskManager.save();
    taskManager.render();
    console.log('Tarea eliminada:', taskId, taskManager.tasks);
  }
});

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
    taskManager.save();

    // Si está activo el filtro "Completadas", la tarea nueva (por hacer) quedaría oculta
    if (filtroCompletadas.checked) filtroTodas.checked = true;
    taskManager.render();
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
