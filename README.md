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

JavaScript valida el formulario, registra las tareas nuevas y las marca como completadas. Los filtros, el conteo y el cambio de clima se resuelven con CSS (`:has()` y contadores) a partir de la clase que pone JavaScript.

- **Formulario de nueva tarea**: nombre, descripción, fecha de entrega, estado, categoría y prioridad (baja, media o alta).
- **Validación con JavaScript** (`js/index.js`): al enviar, la función `validFormFieldInput(data)` revisa que el nombre tenga al menos 3 caracteres, que la descripción no esté vacía, que haya una fecha de entrega y que se haya elegido un estado. Si falta algo, una alerta de Bootstrap lista lo que hay que corregir y los campos con error se marcan en rojo; si todo está bien, la alerta se oculta. Los datos leídos se muestran en la consola con `console.log()`.
- **Tarjetas de tarea** con el componente Card de Bootstrap. Cada una muestra el nombre, la descripción, el estado (*Por hacer* o *Completada*), la prioridad, la categoría y la fecha de entrega.
- **Cinco tareas de ejemplo** con información distinta.
- **Clase `TaskManager`** (`js/taskManager.js`): guarda las tareas en la propiedad `tasks`, que empieza como un array vacío, y lleva un contador `currentId`. Su método `addTask(name, description, dueDate, status)` sube el contador y agrega con `push()` un objeto con `id` consecutivo y estado inicial `PORHACER`. Acepta además la prioridad y la categoría, que usa la tarjeta.
- **Agregar tareas**: al enviar el formulario con datos válidos, `js/index.js` llama a `taskManager.addTask()`, muestra la tarea nueva al principio del cuaderno (a partir de un `<template>` con el mismo diseño de las tarjetas), confirma con una alerta verde y deja el formulario limpio. Si los datos no son válidos, no se registra nada. La lista actualizada se puede ver en la consola con `taskManager.tasks`.
- **Completar tareas**: cada tarjeta tiene un botón que funciona como interruptor. Al tocarlo, JavaScript le agrega a la tarjeta la clase `completada`: el título se tacha con una línea que se dibuja de izquierda a derecha, el estado cambia a *Completada* y la tarjeta se atenúa. Al tocarlo otra vez vuelve a *Por hacer*, sin recargar la página.
- **Filtros** *Todas*, *Pendientes* y *Completadas*, y un conteo de tareas completadas al final del cuaderno.
- **Escampa**: si todas las tareas están completadas, para de llover y la ventana pasa al amanecer.
- **Walkman**: controles de sonido de fondo (lluvia, lo-fi, tormenta, café y chimenea) y un temporizador de enfoque de 25 minutos. Por ahora son solo visuales; el sonido llega más adelante.
- **Diseño adaptable**: en celular las columnas se apilan. Con *reducir movimiento* activado en el sistema, la lluvia queda quieta.

## Tecnologías

- HTML5, CSS3 y JavaScript
- [Bootstrap 5.3](https://getbootstrap.com/) y [Bootstrap Icons](https://icons.getbootstrap.com/) por CDN
- Fuentes de Google Fonts: Atkinson Hyperlegible Next y Shantell Sans
- Git y GitHub, publicado en [GitHub Pages](https://pages.github.com/) y [Vercel](https://vercel.com/)

## Cómo ejecutarlo

No necesita instalar nada: Bootstrap y las fuentes se cargan desde internet.

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Jonathan-DLC/planificador-tareas-web.git
   ```

2. Abre `index.html` en el navegador, o con la extensión **Live Server** de VS Code (clic derecho → *Open with Live Server*).

## Avance por sprints

- [x] **Planificación**: repositorio en GitHub, tablero de Trello y diseño en Figma.
- [x] **Tarea 1**: estructura de la interfaz con Bootstrap (encabezado, formulario y lista).
- [x] **Tarea 2**: tarjeta de tarea con Card de Bootstrap, lista de tareas y cinco ejemplos.
- [x] **Tarea 3**: validación de las entradas del formulario con JavaScript y alerta de Bootstrap.
- [x] **Tarea 4**: clase `TaskManager` en `js/taskManager.js` y botón para marcar o desmarcar una tarea como completada.
- [x] **Tarea 5**: método `addTask()` con `currentId` y formulario conectado para registrar y mostrar tareas nuevas.
- [ ] **Tarea 6**: eliminar una tarea.
- [ ] **Después**: guardar las tareas en `localStorage` y hacer sonar el walkman.
- [ ] **Backend**: API con Java y Spring Boot, base de datos SQL y conexión con el frontend.

## Autor

Jonathan Lozano, proyecto individual del bootcamp Full Stack Java de Generation Colombia.
