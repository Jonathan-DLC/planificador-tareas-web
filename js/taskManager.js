/* =========================================================
   ESCAMPA · TaskManager
   La clase que guarda las tareas de la aplicación.
   - Sprint 2, Tarea 4: colección de tareas vacía.
   - Sprint 2, Tarea 5: contador currentId y método addTask().
   ========================================================= */

class TaskManager {
  constructor(currentId = 0) {
    this.tasks = [];
    this.currentId = currentId;
  }

  // priority y category son opcionales: los usa la tarjeta del cuaderno
  addTask(name, description, dueDate, status, priority = 'media', category = 'sprint-1') {
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
}
