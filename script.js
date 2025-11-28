let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editIndex = null;

// SAVE TO LOCAL STORAGE
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

const addTask = () => {
  const taskInput = document.getElementById("taks-input");
  const text = taskInput.value.trim();

  if (text) {

    // Edit mode
    if (editIndex !== null) {
      tasks[editIndex].text = text;
      editIndex = null;
    } 
    else {
      tasks.push({ text: text, completed: false });
    }

    taskInput.value = "";
    updateTaskList();
    updateProgress();
    saveTasks();
  }
};

const updateTaskList = () => {   
  const takslist = document.querySelector(".box-list");  
  takslist.innerHTML = "";

  tasks.forEach((task, index) => { 
    const listItem = document.createElement("li");

    listItem.innerHTML = `
      <div class="taskItem ${task.completed ? "done" : ""}">
        <div class="task">
          <input type="checkbox" class="checkbox" ${task.completed ? "checked" : ""} />
          <p>${task.text}</p>
        </div>

        <div class="icons">
          <img src="edit2.png" onclick="editTask(${index})" />
          <img src="bin.png" onclick="deleteTask(${index})" />
        </div>
      </div>
    `;

    const checkbox = listItem.querySelector(".checkbox");

    checkbox.addEventListener("change", () => {
      tasks[index].completed = checkbox.checked;
      listItem.querySelector(".taskItem").classList.toggle("done");

      updateProgress();
      saveTasks();

      // ✔ 1) Single task complete → 1 confetti
      if (checkbox.checked) {
        taskComplete(1);
      }

      // ✔ 2) All tasks completed → 3 confetti
      const total = tasks.length;
      const done = tasks.filter(t => t.completed).length;

      if (total > 0 && done === total) {
        taskComplete(1);
      }
    });

    takslist.appendChild(listItem);
  });
};

// DELETE SYSTEM
window.deleteTask = function(index) {
  const confirmDelete = confirm("Kya aap is task ko delete karna chahte ho?");

  if (confirmDelete) {
    tasks.splice(index, 1);
    updateTaskList();
    updateProgress();
    saveTasks();
  }
};

// EDIT → form me text wapas
window.editTask = function(index) {
  const taskInput = document.getElementById("taks-input");

  taskInput.value = tasks[index].text;
  taskInput.focus();

  editIndex = index;
};

// PROGRESS BAR
function updateProgress() {
  const progress = document.getElementById("progress");
  const numbers = document.getElementById("numbers");

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;

  let percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progress.style.width = percent + "%";
  numbers.innerText = percent + "%";
}

// CONFETTI FUNCTION
function taskComplete(times = 1) {
  const count = 200;
  const defaults = { origin: { y: 0.7 } };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  for (let i = 0; i < times; i++) {
    setTimeout(() => {
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }, i * 600);
  }
}

document.getElementById("new-task").addEventListener("click", function (e) {
  e.preventDefault();
  addTask();
});

// Load tasks on start
updateTaskList();
updateProgress();