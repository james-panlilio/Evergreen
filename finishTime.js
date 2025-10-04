// Displays session stats and handles navigation transitions
// Finish Time page enters from the right
window.addEventListener('DOMContentLoaded', () => {
  const wrap = document.querySelector('.finishTimeDiv');
  if (wrap) wrap.classList.add('slide-in-right');

  // Stats overview
  const statsDiv = document.getElementById('stats-overview');
  // Get and display stats from localStorage
  if (statsDiv) {
    // Get stats from localStorage
    const stats = JSON.parse(localStorage.getItem('pomoStats') || '{}');
    const totalTime = stats.totalTime || 0;
    const pomoTime = stats.pomoTime || 0;
    const breakTime = stats.breakTime || 0;
    const cycles = stats.cycles || 0;

    statsDiv.innerHTML = `
      <h2>Session Overview</h2>
      <ul>
        <li><strong>Total Time:</strong> ${formatTime(totalTime)}</li>
        <li><strong>Total Pomodoro Time:</strong> ${formatTime(pomoTime)}</li>
        <li><strong>Total Break Time:</strong> ${formatTime(breakTime)}</li>
        <li><strong>Total Pomodoro Cycles:</strong> ${cycles}</li>
      </ul>
    `;
  }
});

// Format seconds as mm:ss for stats display
function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

// Main wrapper for page transitions
const pageWrap = document.querySelector('.finishTimeDiv');
// Back button element
const timerBtn  = document.getElementById('timer-btn');
// Home button element
const homeBtn  = document.getElementById('home-btn');

// Animate page out to left and navigate
function slideLeftThenGo(url) {
  if (!pageWrap) { window.location.href = url; return; }
  pageWrap.classList.remove('slide-in-right');
  pageWrap.classList.add('slide-out-left');
  pageWrap.addEventListener('animationend', () => { window.location.href = url; }, { once:true });
}

// Animate page out to right and navigate
function slideRightThenGo(url) {
  if (!pageWrap) { window.location.href = url; return; }
  pageWrap.classList.remove('slide-in-right');
  pageWrap.classList.add('slide-out-right');
  pageWrap.addEventListener('animationend', () => { window.location.href = url; }, { once:true });
}

// Back -> slide out RIGHT, tell next page we came from Finish
if (timerBtn) {
  timerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.setItem('entryFrom', 'finish-back');
    slideRightThenGo('pomoTimer.html');
  });
}

// Home -> unchanged (slide out LEFT)
if (homeBtn) {
  homeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    sessionStorage.setItem('entryFrom', 'finish');
    slideLeftThenGo('homePage.html');
  });
}
