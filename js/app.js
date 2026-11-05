/* =========================================================
   ESCAMPA · Validación del formulario de nueva tarea
   Sprint 1, Tarea 3: antes de procesar una tarea se revisa que
   los campos obligatorios estén completos. Si falta algo, una
   alerta de Bootstrap dice qué corregir; si todo está bien, la
   alerta se oculta.
   ========================================================= */

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
    newTaskSuccessAlert.classList.remove('d-none');
    console.log('Formulario válido');
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
