// Pomodoro Timer Logic
// Handles timer, UI, stats tracking, and page transitions

window.addEventListener('DOMContentLoaded', () => {
  // Handle page entry animation based on navigation source
  const wrap = document.querySelector('.timerDiv');
  const from = sessionStorage.getItem('entryFrom');
  if (!wrap) return;

  if (from === 'home') {
    wrap.classList.add('slide-in-right');
    sessionStorage.removeItem('entryFrom');
  } else if (from === 'finish-back') {
    wrap.classList.add('slide-in-left');
    sessionStorage.removeItem('entryFrom');
  } else {
    wrap.classList.add('slide-in-right');
  }
});


/* ========= Time selector logic ========= */

const STEP = 15; // seconds per click
// Time selector logic: step size and minimum
const MIN_SECONDS = 0;

// initial defaults (in minutes)
const defaults = { pomo: 25, short: 5, long: 15 };
// Default durations for each timer mode

// Format seconds as mm:ss
function format(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return { mm, ss };
}

// Read seconds from a timer display element
function readDisplay(displayEl) {
  const mm = parseInt(displayEl.querySelector('.mm').textContent, 10);
  const ss = parseInt(displayEl.querySelector('.ss').textContent, 10);
  return (isNaN(mm) ? 0 : mm) * 60 + (isNaN(ss) ? 0 : ss);
}

// Write seconds to a timer display element
function writeDisplay(displayEl, secs) {
  const { mm, ss } = format(Math.max(0, secs));
  displayEl.querySelector('.mm').textContent = mm;
  displayEl.querySelector('.ss').textContent = ss;
}

// ========= Stats tracking (top-level helpers) =========

// Update and save stats in localStorage for each tick and cycle
function updateStats(secs, mode) {
  // Load or init stats
  const stats = JSON.parse(localStorage.getItem('pomoStats') || '{}');
  stats.totalTime = (stats.totalTime || 0) + (secs || 0);

  if (mode === 'pomo') {
    stats.pomoTime = (stats.pomoTime || 0) + (secs || 0);
  } else if (mode === 'short' || mode === 'long') {
    stats.breakTime = (stats.breakTime || 0) + (secs || 0);
  } else if (mode === 'cycle') {
    stats.cycles = (stats.cycles || 0) + 1;
  }

  localStorage.setItem('pomoStats', JSON.stringify(stats));
}
// Get duration in seconds for a mode
function getDurationSeconds(mode){ return readDisplay(pickers[mode]); }


// set initial defaults (in case HTML changes later)
document.querySelectorAll('.time-control').forEach(ctrl => {
// Initialize time pickers and handle up/down arrow clicks
  const key = ctrl.dataset.key; // pomo | short | long
  const display = ctrl.querySelector('.display');
  const startSecs = (defaults[key] ?? 0) * 60;
  writeDisplay(display, startSecs);
});

// handle arrow clicks
document.querySelectorAll('.time-control').forEach(ctrl => {
  const display = ctrl.querySelector('.display');
  ctrl.querySelector('.up').addEventListener('click', () => {
    writeDisplay(display, readDisplay(display) + STEP);
    if (state.mode === ctrl.dataset.key && !state.running) syncMainFromPickers();
  });
  ctrl.querySelector('.down').addEventListener('click', () => {
    writeDisplay(display, Math.max(MIN_SECONDS, readDisplay(display) - STEP));
    if (state.mode === ctrl.dataset.key && !state.running) syncMainFromPickers();
  });
});

/* ========= Main timer logic ========= */

// UI elements (bottom section)
const modeLabel   = document.getElementById('mode-label');
const cycleCount  = document.getElementById('cycle-count');
const mmEl        = document.getElementById('count-mm');
const ssEl        = document.getElementById('count-ss');
const startBtn    = document.getElementById('start-btn');
const pauseBtn    = document.getElementById('pause-btn');
const resetBtn    = document.getElementById('reset-btn');

// Pickers
const pickers = {
// References to time pickers for each mode
  pomo : document.querySelector('[data-key="pomo"] .display'),
  short: document.querySelector('[data-key="short"] .display'),
  long : document.querySelector('[data-key="long"] .display')
};
// Get duration in seconds for a mode
function getDurationSeconds(mode){ 
  return readDisplay(pickers[mode]); 
}

// Set main timer display
function setMain(secs){
  const {mm, ss} = format(secs);
  mmEl.textContent = mm; ssEl.textContent = ss;
}

const state = {
// Timer state object
  mode: 'pomo',
  cycle: 1,
  remaining: getDurationSeconds('pomo'),
  timerId: null,
  running: false
};

// Sync timer display and labels from pickers
function syncMainFromPickers(){
  state.remaining = getDurationSeconds(state.mode);
  setMain(state.remaining);
  modeLabel.textContent = labelFor(state.mode);
  cycleCount.textContent = state.cycle;
}
syncMainFromPickers();

// Get label for timer mode
function labelFor(mode){
  if (mode === 'pomo')  return 'Pomodoro';
  if (mode === 'short') return 'Short Break';
  return 'Long Break';
}

// Called every second when timer is running
function tick(){
  if (state.remaining > 0){
    state.remaining -= 1;
    setMain(state.remaining);
    // Track stats every tick
    updateStats(1, state.mode);
    return;
  }
  // period finished -> transition
  nextPhase();
}

// Start the timer and session, reset stats if first run
function start(){
  if (state.running) return;
    const hasStartedBefore = sessionStorage.getItem('pomoSessionStarted');
    if (!hasStartedBefore) {
      localStorage.removeItem('pomoStats');
      sessionStorage.setItem('pomoSessionStarted', '1');
    }
  state.running = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resetBtn.disabled = false;
  state.timerId = setInterval(tick, 1000);
}

// Pause the timer
function pause(){
  if (!state.running) return;
  clearInterval(state.timerId);
  state.timerId = null;
  state.running = false;
  startBtn.disabled = false;
}

// Reset timer and UI to picker values
function reset(){
  clearInterval(state.timerId);
  state.timerId = null;
  state.running = false;
  startBtn.disabled = false;
  pauseBtn.disabled = false;
  // Reset current phase back to picker value
  syncMainFromPickers();
}

// Transition to next timer phase and update cycles
function nextPhase(){
  clearInterval(state.timerId);
  state.timerId = null;
  state.running = false;
  startBtn.disabled = false;

  // Track completed cycle
  if (state.mode === 'pomo') {
    updateStats(0, 'cycle');
  }

  if (state.mode === 'pomo'){
    if (state.cycle < 4){
      state.mode = 'short';
    } else {
      state.mode = 'long';
    }
  } else if (state.mode === 'short'){
    state.mode = 'pomo';
    state.cycle += 1;
  } else if (state.mode === 'long'){
    state.mode = 'pomo';
    state.cycle = 1;
  }
  modeLabel.textContent = labelFor(state.mode);
  cycleCount.textContent = state.cycle;
  state.remaining = getDurationSeconds(state.mode);
  setMain(state.remaining);
}

// Stats tracking
function updateStats(secs, mode) {
  let stats = JSON.parse(localStorage.getItem('pomoStats') || '{}');
  stats.totalTime = (stats.totalTime || 0) + secs;
  if (mode === 'pomo') stats.pomoTime = (stats.pomoTime || 0) + secs;
  if (mode === 'short' || mode === 'long') stats.breakTime = (stats.breakTime || 0) + secs;
  if (mode === 'cycle') stats.cycles = (stats.cycles || 0) + 1;
  localStorage.setItem('pomoStats', JSON.stringify(stats));
}
// Start button event
startBtn.addEventListener('click', start);
// Pause button event
pauseBtn.addEventListener('click', pause);
// Reset button event
resetBtn.addEventListener('click', reset);

// Also refresh the big display when user changes pickers (if not running)
['pomo','short','long'].forEach(k => {
// Sync display when pickers change
  pickers[k].addEventListener('DOMSubtreeModified', () => {
    if (!state.running && state.mode === k) syncMainFromPickers();
  });
});

// Finish time button
const pageWrap = document.querySelector('.timerDiv');
const finishTime = document.getElementById('finishTime-btn');


function slideLeftThenGo(url) {
  sessionStorage.setItem('entryFrom', 'pomo');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !pageWrap) {
    window.location.href = url;
    return;
  }
  pageWrap.classList.remove('slide-in-right');
  pageWrap.classList.remove('slide-in-left');
  pageWrap.classList.add('slide-out-left');
  pageWrap.addEventListener('animationend', () => { window.location.href = url; }, { once:true });
}

if (finishTime) finishTime.addEventListener('click', (e) => {
  e.preventDefault();
  slideLeftThenGo('finishTime.html');
});
