// Page enters from the right
window.addEventListener('DOMContentLoaded', () => {
  const finishWrap = document.querySelector('.finishDiv');
  if (finishWrap) finishWrap.classList.add('slide-in-right');
});


// Grab elements
const finalProgress = document.getElementById('final-progress');
const finalPercent  = document.getElementById('final-percent');

// Pull saved list HTML from localStorage
const saved = localStorage.getItem('data');

// Compute completion from saved HTML
function computePercentFromHTML(html) {
  if (!html) return 0;

  // Create a temporary container to parse the saved list
  const temp = document.createElement('div');
  temp.innerHTML = html;

  const all = temp.querySelectorAll('li').length;
  const done = temp.querySelectorAll('li.checked').length;

  if (!all) return 0;
  return Math.round((done / all) * 100);
}

// Set UI
const percent = computePercentFromHTML(saved);
finalProgress.value = percent;
finalPercent.textContent = `${percent}%`;

//======== Page Transitions =========

// Page enters from the right
window.addEventListener('DOMContentLoaded', () => {
  const finishWrap = document.querySelector('.finishDiv');
  finishWrap.classList.add('slide-in-right');
});


(() => {
  const pageWrap = document.querySelector('.finishDiv');
  const backBtn  = document.getElementById('back-btn');
  const homeBtn  = document.getElementById('home-btn');
  if (!pageWrap) return;

  function slideRightThenGo(url, flag) {
    sessionStorage.setItem('entryFrom', flag);
    pageWrap.classList.remove('slide-in-right');
    pageWrap.classList.add('slide-out-right');
    pageWrap.addEventListener('animationend', () => {
      window.location.href = url;
    }, { once:true });
  }

  function slideLeftThenGo(url, flag) {
    sessionStorage.setItem('entryFrom', flag);
    pageWrap.classList.remove('slide-in-right');
    pageWrap.classList.add('slide-out-left');
    pageWrap.addEventListener('animationend', () => {
      window.location.href = url;
    }, { once:true });
  }

  // Back -> go to To-Do List, sliding right
  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      slideRightThenGo('toDoList.html','finish-back');
    });
  }

  // Home -> go to Home, sliding left (like normal)
  if (homeBtn) {
    homeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      slideLeftThenGo('homePage.html','finish');
    });
  }
})();

