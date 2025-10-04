// To-Do page entry animation depends on where we came from
window.addEventListener('DOMContentLoaded', () => {
  // Entry animation based on navigation source (sessionStorage flag)
// Grab UI elements for task input, list, and progress
  const wrap = document.querySelector('.toDoDiv');
  const from = sessionStorage.getItem('entryFrom');   // 'home', 'finish', 'finish-back', etc.

  // from Home => slide IN from RIGHT
  if (from === 'home') {
    wrap.classList.add('slide-in-right');
  } else if (from === 'finish-back') {
    // if arriving from finish, slide in from LEFT 
    wrap.classList.add('slide-in-left');
  } else {
    // default if no flag present
    wrap.classList.add('slide-in-right');
  }

  // clear the flag so refreshes don’t re-use it
  sessionStorage.removeItem('entryFrom');
});


// ====== Grab elements ======
const writeTask   = document.getElementById("write-task");
const taskList    = document.getElementById("task-list");
const addBtn      = document.getElementById("add-btn");
const progressBar = document.getElementById("progress-bar");

// ====== Date (top-left) ======
const dayEl    = document.getElementById("day");
const numberEl = document.getElementById("number");
const monthEl  = document.getElementById("month");

const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// Update the date display at the top-left
function updateDate() {
  const now = new Date();
  dayEl.textContent = days[now.getDay()];
  numberEl.textContent = now.getDate();
  monthEl.textContent = months[now.getMonth()];
}
updateDate();

// Update the progress bar based on completed tasks
function updateProgressBar() {
  const total = taskList.querySelectorAll("li").length;
  const done  = taskList.querySelectorAll("li.checked").length;
  progressBar.value = total ? Math.round((done / total) * 100) : 0;
}

// Add a new task to the list
function addTask() {
  const text = writeTask.value.trim();
  if (!text) {
    alert("You must write something!");
    return;
  }
  // Create new list item with icon, text, and delete button
  // Leaf icon
  const li   = document.createElement("li");
  const icon = document.createElement("i");
  icon.className = "bx bxs-leaf"; 
  // Task text span
  const spanText = document.createElement("span");
  spanText.className = "task-text";
  spanText.textContent = text;
  // Delete button
  const del = document.createElement("span");
  del.className = "delete";
  del.textContent = "\u00D7"; // ×

  li.append(icon, spanText, del);
  taskList.appendChild(li);

  writeTask.value = "";
  saveData();
  updateProgressBar();
}

// Button + Enter key
addBtn.addEventListener("click", addTask);
// Add task on button click
writeTask.addEventListener("keydown", (e) => {
// Add task on Enter key press
  if (e.key === "Enter") addTask();
});

// ====== Click handling (toggle / delete) ======
taskList.addEventListener("click", (e) => {
// Handle task completion toggle and delete
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
    saveData();
    updateProgressBar();
    return;
  }

  // toggle checked on the row when clicking icon/text/row
  const li = e.target.closest("li");
  if (li) {
    li.classList.toggle("checked");
    saveData();
    updateProgressBar();
  }
}, false);

// Save current task list to localStorage
function saveData() {
  localStorage.setItem("data", taskList.innerHTML);
}

// Load tasks from localStorage and migrate old data
function showTask() {
  const data = localStorage.getItem("data");
  if (data) taskList.innerHTML = data;

  // migrate any old items so only text gets struck
  taskList.querySelectorAll("li").forEach(li => {
    const firstSpan = li.querySelector("span:not(.delete)");
    if (firstSpan && !firstSpan.classList.contains("task-text")) {
      firstSpan.classList.add("task-text");
    }
    // ensure each li has a leaf icon (in case old data misses it)
    if (!li.querySelector(".bx")) {
      const icon = document.createElement("i");
      icon.className = "bx bxs-leaf";
      li.insertBefore(icon, li.firstChild);
    }
  });

  updateProgressBar();
}
showTask();

// Finish Day: slide out, then navigate
(() => {
// Finish Day button: slide out and navigate to finishDay.html
  const pageWrap  = document.querySelector('.toDoDiv');
  const finishBtn = document.getElementById('finish-btn');
  if (!pageWrap || !finishBtn) return;
  finishBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.location.href = 'finishDay.html';
      return;
    }

    pageWrap.classList.remove('slide-in-left');
    pageWrap.classList.add('slide-out-left');
    pageWrap.addEventListener('animationend', () => {
      window.location.href = 'finishDay.html';
    }, { once: true });
  });
})();
