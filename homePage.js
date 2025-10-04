// Home page enters from the right
window.addEventListener('DOMContentLoaded', () => {
  const homeWrap = document.querySelector('.homeDiv');
  if (homeWrap) homeWrap.classList.add('slide-in-right');
});

// ===== Buttons + slide-out navigation =====
(() => {
  const pageWrap = document.querySelector('.homeDiv');
  const listBtn  = document.getElementById('list-btn');
  const timerBtn = document.getElementById('timer-btn');

  if (!pageWrap) return;

  function slideLeftThenGo(url) {
    sessionStorage.setItem('entryFrom', 'home');
    pageWrap.classList.remove('slide-in-right');
    pageWrap.classList.add('slide-out-left');
    pageWrap.addEventListener('animationend', () => { window.location.href = url; }, { once:true });
  }

  // To-Do List button
  if (listBtn) listBtn.addEventListener('click', (e) => {
    e.preventDefault();
    slideLeftThenGo('toDoList.html');
  });
  // Pomodoro Timer button
  if (timerBtn) timerBtn.addEventListener('click', (e) => {
    e.preventDefault();
    slideLeftThenGo('pomoTimer.html');
  });

})();
