/* =========================================================
   ESCAMPA · Walkman
   Sonido de fondo y temporizador pomodoro, cada uno por su lado.
   - Sonidos: los cinco canales empiezan apagados (volumen en 0).
     Al subir un deslizador, su sonido de la carpeta audio/ empieza a
     sonar; al bajarlo a 0, se detiene. Lluvia, tormenta, café y
     chimenea repiten un solo mp3 en bucle; lo-fi es una lista de
     canciones que suenan una tras otra y se pueden saltar.
   - Temporizador: el botón de play lo inicia o lo pausa.
     25 minutos de enfoque y 5 de descanso, con una campanita al cambiar.
   ========================================================= */

const walkmanPlay = document.querySelector('.walkman-play');
const walkmanReiniciar = document.querySelector('.walkman-reiniciar');
const walkmanTiempo = document.querySelector('.walkman-tiempo');
const walkmanEstado = document.querySelector('.walkman-estado');

const DURACION = { enfoque: 25 * 60, descanso: 5 * 60 };
const TITULO_PAGINA = document.title;

// ---------------------------------------------------------
// Sonidos
// ---------------------------------------------------------

// Canciones del canal lo-fi, todas de Pixabay. El título y el autor se muestran en el walkman
const LISTA_LOFI = [
  { archivo: 'lofi-1.mp3', titulo: 'Chill — Lamp Light', autor: 'Ornave' },
  { archivo: 'lofi-2.mp3', titulo: 'Lofi Study Rainy Night', autor: 'alex-morgan' },
  { archivo: 'lofi-3.mp3', titulo: 'Chillhop Jazz Coffee Shop', autor: 'alex-morgan' },
  { archivo: 'lofi-4.mp3', titulo: 'Lofi — Moon Light', autor: 'Ornave' },
  { archivo: 'lofi-5.mp3', titulo: 'Good Night - Lofi Cozy Chill Music', autor: 'FASSounds' },
  { archivo: 'lofi-6.mp3', titulo: 'Ink & Rain (Zen Lofi)', autor: 'Turning_Pages' }
];

const PISTAS = {
  lluvia: [{ archivo: 'lluvia.mp3' }],
  lofi: LISTA_LOFI,
  tormenta: [{ archivo: 'tormenta.mp3' }],
  cafe: [{ archivo: 'cafe.mp3' }],
  chimenea: [{ archivo: 'chimenea.mp3' }]
};

const lofiCancion = document.querySelector('#lofi-cancion');
const lofiSiguiente = document.querySelector('#lofi-siguiente');

const canales = Object.keys(PISTAS).map((nombre) => {
  const audio = new Audio();
  // preload none: cada mp3 se descarga recién cuando se sube su volumen, no al abrir la página
  audio.preload = 'none';

  const deslizador = document.querySelector(`#vol-${nombre}`);
  const etiqueta = document.querySelector(`label[for="vol-${nombre}"]`).textContent.trim();
  const canal = { nombre, etiqueta, audio, deslizador, pistas: PISTAS[nombre], indice: 0, falta: false };

  ponerPista(canal, 0);

  // Una lista pasa a la siguiente canción al terminar; un sonido suelto se repite con loop
  audio.addEventListener('ended', () => siguientePista(canal));

  audio.addEventListener('error', () => {
    canal.pistas[canal.indice].falta = true;

    // En una lista se salta la canción que falta, mientras quede alguna disponible
    if (canal.pistas.some((pista) => !pista.falta)) {
      siguientePista(canal);
      return;
    }

    canal.falta = true;
    deslizador.closest('.canal').classList.add('canal-sin-audio');
    deslizador.closest('.canal').title = `Faltan los archivos de ${etiqueta} en audio/`;
    pintarPantalla();
  });

  return canal;
});

function ponerPista(canal, indice) {
  const pista = canal.pistas[indice];
  canal.indice = indice;
  canal.audio.src = `audio/${pista.archivo}`;
  canal.audio.loop = canal.pistas.length === 1;

  if (canal.nombre === 'lofi') {
    lofiCancion.textContent = pista.titulo;
    lofiCancion.title = `${pista.titulo}, de ${pista.autor}`;
  }
}

function siguientePista(canal) {
  // Busca la siguiente canción que no se sepa faltante, dando la vuelta a la lista
  let indice = canal.indice;
  for (let i = 0; i < canal.pistas.length; i++) {
    indice = (indice + 1) % canal.pistas.length;
    if (!canal.pistas[indice].falta) break;
  }

  ponerPista(canal, indice);
  actualizarCanal(canal);
}

lofiSiguiente.addEventListener('click', () => {
  siguientePista(canales.find((canal) => canal.nombre === 'lofi'));
});

function actualizarCanal(canal) {
  const volumen = canal.deslizador.value / 100;
  canal.audio.volume = volumen;

  // Suena mientras su volumen esté sobre 0; en 0 se pausa para no gastar datos ni batería
  if (volumen > 0 && !canal.falta) {
    canal.audio.play().catch(() => {});
  } else {
    canal.audio.pause();
  }
}

for (const canal of canales) {
  canal.deslizador.addEventListener('input', () => actualizarCanal(canal));
}

// Campanita al terminar un periodo, generada con Web Audio para no depender de otro archivo
function sonarCampanita() {
  const contexto = new AudioContext();
  [880, 1320].forEach((frecuencia, i) => {
    const oscilador = contexto.createOscillator();
    const ganancia = contexto.createGain();
    const inicio = contexto.currentTime + i * 0.18;

    oscilador.type = 'sine';
    oscilador.frequency.value = frecuencia;
    ganancia.gain.setValueAtTime(0.0001, inicio);
    ganancia.gain.exponentialRampToValueAtTime(0.3, inicio + 0.02);
    ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + 1.2);

    oscilador.connect(ganancia).connect(contexto.destination);
    oscilador.start(inicio);
    oscilador.stop(inicio + 1.3);
  });
}

// ---------------------------------------------------------
// Temporizador pomodoro
// ---------------------------------------------------------

let corriendo = false;
let modo = 'enfoque';
let segundosRestantes = DURACION.enfoque;
let finDelPeriodo = null;
let intervalo = null;

function formatear(segundos) {
  const minutos = String(Math.floor(segundos / 60)).padStart(2, '0');
  const resto = String(segundos % 60).padStart(2, '0');
  return `${minutos}:${resto}`;
}

function pintarPantalla() {
  const nombreModo = modo === 'enfoque' ? 'Enfoque' : 'Descanso';
  const faltantes = canales.filter((canal) => canal.falta).map((canal) => canal.etiqueta);

  walkmanTiempo.textContent = formatear(segundosRestantes);
  walkmanEstado.textContent = faltantes.length
    ? `Faltan audios: ${faltantes.join(', ')}`
    : corriendo ? nombreModo : `${nombreModo} en pausa`;

  // El tiempo en la pestaña sirve para verlo desde otra ventana
  document.title = corriendo ? `${formatear(segundosRestantes)} ${nombreModo}: Escampa` : TITULO_PAGINA;
}

function avanzarReloj() {
  // Se calcula contra la hora real: si el navegador frena el intervalo
  // en una pestaña de fondo, el tiempo igual queda bien
  segundosRestantes = Math.max(0, Math.round((finDelPeriodo - Date.now()) / 1000));

  if (segundosRestantes === 0) {
    sonarCampanita();
    modo = modo === 'enfoque' ? 'descanso' : 'enfoque';
    segundosRestantes = DURACION[modo];
    finDelPeriodo = Date.now() + segundosRestantes * 1000;
  }

  pintarPantalla();
}

function iniciarTemporizador() {
  corriendo = true;
  finDelPeriodo = Date.now() + segundosRestantes * 1000;
  intervalo = setInterval(avanzarReloj, 1000);

  walkmanPlay.innerHTML = '<i class="bi bi-pause-fill" aria-hidden="true"></i>';
  walkmanPlay.setAttribute('aria-label', 'Pausar temporizador');
  pintarPantalla();
}

function pausarTemporizador() {
  corriendo = false;
  clearInterval(intervalo);

  walkmanPlay.innerHTML = '<i class="bi bi-play-fill" aria-hidden="true"></i>';
  walkmanPlay.setAttribute('aria-label', 'Iniciar temporizador');
  pintarPantalla();
}

walkmanPlay.addEventListener('click', () => {
  if (corriendo) {
    pausarTemporizador();
  } else {
    iniciarTemporizador();
  }
});

// Reiniciar vuelve a 25:00 de enfoque sin cambiar si el temporizador corre o está en pausa
walkmanReiniciar.addEventListener('click', () => {
  modo = 'enfoque';
  segundosRestantes = DURACION.enfoque;
  finDelPeriodo = Date.now() + segundosRestantes * 1000;
  pintarPantalla();
});

pintarPantalla();
