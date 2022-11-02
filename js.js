// Kun sivu latautuu, hae local storageen tallennetut tehtävät
window.onload = loadTasks;

// Kun lomake lähetetään (eli tehtävä lähetetään nappia painamalla), 
// suoritetaan funktio tehtävän lisäämiselle
document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault(); // Sivun päivitys estetty, kun lomaketta lähetetään
  addTask();
});

// -- Tehtävien lataus local storagesta --
function loadTasks() {
  if (localStorage.getItem("tasks") == null) return; // Palauta tyhjä, jos ei tehtäviä
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks"))); // Haetaan tehtävät ja järjestetään listaksi (array -> jotta voidaan loopata)

  // Loopataan ja muotoillaan tehtävät
  tasks.forEach(task => {
    const list = document.querySelector("ul");
    const li = document.createElement("li");
    li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check" ${task.completed ? 'checked' : ''}>
      <input type="text" value="${task.task}" class="task ${task.completed ? 'completed' : ''}" readonly>
      <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
    list.insertBefore(li, list.children[0]);
  });
}

// -- Tehtävän lisäys --
function addTask() {
  const formInput = document.querySelector("form input");
  const list = document.querySelector("ul");

  // Tehtävän merkkimäärän tarkastus, ei saa olla tyhjä tai alle 5 merkkiä
  if (formInput.value === "" || formInput.value.length < 5) {
    alert("Not spooky enough! \n\n (Minimum of 5 characters)");
    return false;
  }

  // Lisätään tehtävä local storageen
  localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { task: formInput.value, completed: false }]));

  // Tulostetaan tehtävät sivulle
  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" onclick="taskComplete(this)" class="check">
  <input type="text" value="${formInput.value}" class="task" readonly>
  <i class="fa fa-trash" onclick="removeTask(this)"></i>`;
  list.insertBefore(li, list.children[0]);
  
  // Tyhjennetään syöte
  formInput.value = "";
}

// -- Tehtävän suorituksen päivitys local storageen --
function taskComplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.nextElementSibling.value) {
      task.completed = !task.completed;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.nextElementSibling.classList.toggle("completed");
}

// -- Tehtävän poisto local storagesta --
function removeTask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.parentNode.children[1].value) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.parentElement.remove(); // ... ja sivun listalta
}

// Ei tehtäviä, jos niitä ei ole aiemmin syötetty
var currentTasks = null;

// Ladataan tehtävät
function getCurrentTasks(event) {
  currentTasks = event.value;
}
