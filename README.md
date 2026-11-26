# Escampa: planificador de tareas

Aplicación web para organizar tareas, desarrollada como proyecto individual del bootcamp **Full Stack Java de Generation Colombia**. Se construye por sprints: primero la interfaz con HTML, CSS y Bootstrap; después JavaScript y consumo de APIs; al final un backend con Java, Spring Boot y SQL.

El diseño es un escritorio de noche frente a una ventana con lluvia. Las tareas se anotan en un cuaderno cuadriculado y, cuando no queda ninguna pendiente, escampa: la lluvia se detiene y la ventana muestra el amanecer.

## Enlaces

| | |
|---|---|
| Demo (GitHub Pages) | [jonathan-dlc.github.io/planificador-tareas-web](https://jonathan-dlc.github.io/planificador-tareas-web/) |
| Copia en Vercel | [planificador-tareas-web.vercel.app](https://planificador-tareas-web.vercel.app) |
| Tablero de Trello | [Planificador de Tareas](https://trello.com/b/EjGkYPzF/planificador-de-tareas) |
| Diseño en Figma | [Planificador de tareas](https://www.figma.com/design/SLYZeWm8oUjhDzlQZXs8tU/Planificador-de-tareas?node-id=4-564) |

## Funcionalidades

JavaScript valida el formulario, crea, completa y elimina tareas, y las guarda en `localStorage`. Los filtros, el conteo y el cambio de clima se resuelven con CSS (`:has()` y contadores) a partir de las clases que pone JavaScript.

### Tareas

- **Formulario de nueva tarea**: nombre, descripción, fecha de entrega, estado, categoría (trabajo, estudio o personal) y prioridad (baja, media o alta).
- **Validación con JavaScript** (`js/index.js`): al enviar, la función `validFormFieldInput(data)` revisa que el nombre tenga al menos 3 caracteres, que la descripción no esté vacía, que haya una fecha de entrega y que se haya elegido un estado. Si falta algo, una alerta de Bootstrap lista lo que hay que corregir y los campos con error se marcan en rojo; si todo está bien, la alerta se oculta.
- **Clase `TaskManager`** (`js/taskManager.js`): guarda las tareas en `tasks` y lleva un contador `currentId`.
  - `addTask(name, description, dueDate, status)` sube el contador y agrega con `push()` una tarea con `id` consecutivo y estado inicial `PORHACER`. Acepta además la prioridad y la categoría.
  - `deleteTask(taskId)` arma un array `newTasks` con todas las tareas menos la del id recibido y lo asigna a `tasks`.
  - `getTaskById(taskId)` recorre `tasks` y devuelve la tarea con ese id.
  - `save()` y `load()` guardan y recuperan las tareas y el contador en `localStorage`.
  - `render()` dibuja la lista con `createTaskHtml(id, name, description, dueDate, status, …)`, que arma el HTML de cada tarjeta con su `data-task-id`.
- **Tarjetas de tarea** con el componente Card de Bootstrap: nombre, descripción, estado (*Por hacer* o *Completada*), prioridad, categoría, fecha de entrega y cuántos días faltan o pasaron.
- **Agregar tareas**: con datos válidos, el formulario llama a `addTask()`, guarda, vuelve a dibujar la lista con la tarea nueva arriba, confirma con una alerta verde y queda limpio.
- **Marcar como hecha** (Mark As Done): cada tarjeta tiene un botón `done-button`. Al tocarlo se lee el `data-task-id`, se busca la tarea con `getTaskById()`, su `status` cambia a `DONE` y la lista se vuelve a dibujar con `render()`. Funciona como interruptor: tocarlo otra vez la devuelve a `PORHACER`. El título se tacha con una línea que se dibuja de izquierda a derecha y el estado queda guardado.
- **Eliminar tareas**: cada tarjeta tiene un botón **Eliminar** (`delete-button`). Al tocarlo se lee el `data-task-id` de la tarjeta, se pasa a número y se llama a `deleteTask()`, `save()` y `render()`. La tarea eliminada no vuelve al recargar.
- **Tareas guardadas**: todo se conserva en `localStorage`. En la primera visita aparecen cinco tareas de ejemplo; si se borran, no vuelven.
- **Filtros** *Todas*, *Pendientes* y *Completadas*, un conteo de tareas completadas y un mensaje cuando la lista queda vacía.

### Ambiente

- **Escampa**: mientras haya tareas pendientes llueve; cuando no queda ninguna, para de llover y la ventana pasa al amanecer.
- **Walkman** (`js/walkman.js`):
  - Sonidos de fondo de lluvia, tormenta, café y chimenea, y una lista de 6 canciones lo-fi con botón para pasar a la siguiente. Todos empiezan apagados; cada deslizador enciende su sonido y ajusta el volumen.
  - Temporizador pomodoro de 25 minutos de enfoque y 5 de descanso, con una campanita al cambiar.
- **Fecha de hoy** en el encabezado.
- **Diseño adaptable**: en celular las columnas se apilan. Con *reducir movimiento* activado en el sistema, la lluvia queda quieta.

## Tecnologías

- HTML5, CSS3 y JavaScript
- `localStorage` para guardar las tareas
- [Bootstrap 5.3](https://getbootstrap.com/) y [Bootstrap Icons](https://icons.getbootstrap.com/) por CDN
- Fuentes de Google Fonts: Atkinson Hyperlegible Next y Shantell Sans
- Git y GitHub, publicado en [GitHub Pages](https://pages.github.com/) y [Vercel](https://vercel.com/)

## Cómo ejecutarlo

No necesita instalar nada: Bootstrap y las fuentes se cargan desde internet.

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Jonathan-DLC/planificador-tareas-web.git
   ```

2. Abre `index.html` con la extensión **Live Server** de VS Code (clic derecho → *Open with Live Server*). También funciona abriendo el archivo directo en el navegador, aunque algunos navegadores bloquean el audio en archivos locales.

## Avance por sprints

- [x] **Planificación**: repositorio en GitHub, tablero de Trello y diseño en Figma.
- [x] **Tarea 1**: estructura de la interfaz con Bootstrap (encabezado, formulario y lista).
- [x] **Tarea 2**: tarjeta de tarea con Card de Bootstrap, lista de tareas y cinco ejemplos.
- [x] **Tarea 3**: validación de las entradas del formulario con JavaScript y alerta de Bootstrap.
- [x] **Tarea 4**: clase `TaskManager` en `js/taskManager.js` y botón para marcar o desmarcar una tarea como completada.
- [x] **Tarea 5**: método `addTask()` con `currentId` y formulario conectado para registrar y mostrar tareas nuevas.
- [x] **Tarea 6**: botón Eliminar con `deleteTask()`, y tareas guardadas en `localStorage` con `save()` y dibujadas con `render()`.
- [x] **Tarea 7**: botón `done-button` con `getTaskById()` para cambiar el estado de una tarea a `DONE` y volver a dibujar la lista.
- [ ] **Tarea 8**: persistir las tareas en `localStorage`.
- [ ] **Backend**: API con Java y Spring Boot, base de datos SQL y conexión con el frontend.

## Créditos de los sonidos

Todos los sonidos son de [Pixabay](https://pixabay.com/) y se usan bajo su licencia de contenido.

| Archivo | Sonido | Autor |
|---|---|---|
| `audio/lluvia.mp3` | [Calming Rain Loop](https://pixabay.com/sound-effects/nature-calming-rain-loop-398653/) | DRAGON-STUDIO |
| `audio/tormenta.mp3` | [Thunderstorm with Rain](https://pixabay.com/sound-effects/film-special-effects-thunderstorm-with-rain-516367/) | loswin23 |
| `audio/cafe.mp3` | [Ambience Coffee Shop 5](https://pixabay.com/sound-effects/city-ambience-coffee-shop-5-17059/) | freesound_community |
| `audio/chimenea.mp3` | [Fireplace Fire Crackling - Loop](https://pixabay.com/sound-effects/nature-fireplace-fire-crackling-loop-123930/) | SoundsForYou |
| `audio/lofi-1.mp3` | [Chill — Lamp Light](https://pixabay.com/music/lofi-chill-lamp-light-553405/) | Ornave |
| `audio/lofi-2.mp3` | [Lofi Study Rainy Night](https://pixabay.com/music/lofi-lofi-study-rainy-night-568166/) | alex-morgan |
| `audio/lofi-3.mp3` | [Chillhop Jazz Coffee Shop](https://pixabay.com/music/lofi-chillhop-jazz-coffee-shop-552792/) | alex-morgan |
| `audio/lofi-4.mp3` | [Lofi — Moon Light](https://pixabay.com/music/lofi-lofi-moon-light-553399/) | Ornave |
| `audio/lofi-5.mp3` | [Good Night - Lofi Cozy Chill Music](https://pixabay.com/music/beats-good-night-lofi-cozy-chill-music-160166/) | FASSounds |
| `audio/lofi-6.mp3` | [Ink & Rain (Zen Lofi)](https://pixabay.com/music/lofi-ink-amp-rain-zen-lofi-469329/) | Turning_Pages |

## Autor

Jonathan Lozano, proyecto individual del bootcamp Full Stack Java de Generation Colombia.
