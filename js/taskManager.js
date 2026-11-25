/* =========================================================
   ESCAMPA · TaskManager
   La clase que guarda las tareas de la aplicación.
   - Sprint 2, Tarea 4: colección de tareas vacía.
   - Sprint 2, Tarea 5: contador currentId y método addTask().
   - Sprint 2, Tarea 6: deleteTask(), save() y load() con
     localStorage, y render() para dibujar las tarjetas.
   ========================================================= */

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const TEXTO_PRIORIDAD = { baja: 'Baja', media: 'Media', alta: 'Alta' };
const TEXTO_CATEGORIA = { trabajo: 'Trabajo', estudio: 'Estudio', personal: 'Personal' };

// El nombre y la descripción los escribe el usuario: se escapan para que
// un texto como "<b>" se vea tal cual y no se interprete como HTML
function escaparHtml(texto) {
  return texto
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

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

// Devuelve el HTML de la tarjeta de una tarea. data-task-id guarda su id
// para que el botón Eliminar sepa cuál tarea borrar
function createTaskHtml(task) {
  const completada = task.status === 'COMPLETADA';
  const nombre = escaparHtml(task.name);
  const fecha = leerFecha(task.dueDate);
  const relativo = textoRelativo(fecha);
  // Una tarea completada ya no "vence": solo se muestra su fecha
  const textoRelativoHtml = completada
    ? ''
    : ` <span class="entrega-relativa ${relativo.clase}">${relativo.texto}</span>`;

  return `
    <li class="card tarea${completada ? ' completada' : ''}" data-task-id="${task.id}">
      <div class="card-body tarea-cuerpo">
        <button class="btn-completar" type="button" aria-pressed="${completada}" aria-label="${completada ? 'Marcar como pendiente' : 'Marcar como completada'}: ${nombre}">
          <i class="bi bi-check-lg" aria-hidden="true"></i>
        </button>
        <div class="tarea-contenido">
          <h3 class="card-title tarea-titulo"><span>${nombre}</span></h3>
          <p class="card-text tarea-desc">${escaparHtml(task.description)}</p>
          <div class="tarea-etiquetas">
            <span class="badge rounded-pill estado"><span class="estado-pendiente">Por hacer</span><span class="estado-completada">Completada</span></span>
            <span class="prioridad prioridad-${task.priority}">${TEXTO_PRIORIDAD[task.priority]}</span>
            <span class="categoria">${TEXTO_CATEGORIA[task.category]}</span>
          </div>
          <p class="tarea-entrega"><i class="bi bi-calendar-event" aria-hidden="true"></i> Entrega: <time datetime="${task.dueDate}">${fecha.getDate()} ${MESES[fecha.getMonth()]} ${fecha.getFullYear()}</time>${textoRelativoHtml}</p>
        </div>
        <div class="tarea-acciones">
          <button class="delete-button btn btn-eliminar" type="button" aria-label="Eliminar: ${nombre}">
            <i class="bi bi-trash3" aria-hidden="true"></i> Eliminar
          </button>
        </div>
      </div>
    </li>`;
}

class TaskManager {
  constructor(currentId = 0) {
    this.tasks = [];
    this.currentId = currentId;
  }

  // priority y category son opcionales: los usa la tarjeta del cuaderno
  addTask(name, description, dueDate, status, priority = 'media', category = 'trabajo') {
    // El id sube antes de crear la tarea para que la primera sea la 1
    this.currentId++;

    // Por regla de la actividad, toda tarea nueva empieza en PORHACER
    // aunque llegue otro status; se completa después con el botón de la tarjeta
    this.tasks.push({
      id: this.currentId,
      name: name,
      description: description,
      dueDate: dueDate,
      status: 'PORHACER',
      priority: priority,
      category: category
    });
  }

  // Conserva todas las tareas menos la del id recibido
  deleteTask(taskId) {
    const newTasks = [];

    for (let task of this.tasks) {
      if (task.id !== taskId) {
        newTasks.push(task);
      }
    }

    this.tasks = newTasks;
  }

  // Cambia una tarea entre PORHACER y COMPLETADA (botón de completar de la tarjeta)
  toggleTaskStatus(taskId) {
    const task = this.tasks.find((tarea) => tarea.id === taskId);
    if (task) {
      task.status = task.status === 'COMPLETADA' ? 'PORHACER' : 'COMPLETADA';
    }
  }

  // localStorage solo guarda texto: las tareas se convierten a JSON.
  // Las claves llevan el prefijo escampa- porque en GitHub Pages todos los
  // proyectos de jonathan-dlc.github.io comparten el mismo localStorage
  save() {
    localStorage.setItem('escampa-tasks', JSON.stringify(this.tasks));
    localStorage.setItem('escampa-currentId', String(this.currentId));
  }

  // Recupera lo guardado. Devuelve false si todavía no hay nada guardado
  load() {
    const tasksJson = localStorage.getItem('escampa-tasks');
    if (tasksJson === null) return false;

    this.tasks = JSON.parse(tasksJson);
    this.currentId = Number(localStorage.getItem('escampa-currentId')) || 0;
    return true;
  }

  // Dibuja todas las tareas en la lista, la más reciente arriba
  render() {
    const tasksHtmlList = [];

    for (let task of this.tasks) {
      tasksHtmlList.unshift(createTaskHtml(task));
    }

    document.querySelector('#tasksList').innerHTML = tasksHtmlList.join('');
  }
}
