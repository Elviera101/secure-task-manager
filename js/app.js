
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const loadSamplesBtn = document.getElementById("loadSamplesBtn");
const taskList = document.getElementById("taskList");
const taskMessage = document.getElementById("taskMessage");

const totalCount = document.getElementById("totalCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let taskCounter = 1;

// Create a task element
function createTaskElement(taskText, taskId) {
    const li = document.createElement("li");
    li.classList.add("task-item");
    li.dataset.taskId = taskId;
    li.dataset.state = "pending";

    const span = document.createElement("span");
    span.classList.add("task-text");
    span.textContent = taskText;

    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = "Complete";

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "Edit";

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "Remove";

    li.appendChild(span);
    li.appendChild(completeBtn);
    li.appendChild(editBtn);
    li.appendChild(removeBtn);

    return li;
}

// Add a new task
function addTask(taskText) {
    const text = taskText.trim();

    if (text === "") {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }

    const taskId = "task-" + taskCounter;
    taskCounter++;

    const taskItem = createTaskElement(text, taskId);
    taskList.appendChild(taskItem);

    taskInput.value = "";
    taskMessage.textContent = "";

    updateTaskCounts();
}

// Toggle task completion
function toggleTaskComplete(taskItem) {
    taskItem.classList.toggle("completed");

    if (taskItem.dataset.state === "pending") {
        taskItem.dataset.state = "completed";
    } else {
        taskItem.dataset.state = "pending";
    }

    updateTaskCounts();
}

// Begin editing a task
function beginTaskEdit(taskItem) {
    const taskText = taskItem.querySelector(".task-text");
    const editBtn = taskItem.querySelector(".edit-btn");

    if (!taskText || !editBtn) return;

    const editInput = document.createElement("input");
    editInput.classList.add("edit-input");
    editInput.type = "text";
    editInput.value = taskText.textContent;

    taskItem.replaceChild(editInput, taskText);
    editBtn.textContent = "Save";
    taskMessage.textContent = "";

    editInput.focus();
}

// Save edited task
function saveTaskEdit(taskItem) {
    const editInput = taskItem.querySelector(".edit-input");
    const editBtn = taskItem.querySelector(".edit-btn");

    if (!editInput || !editBtn) return;

    const newText = editInput.value.trim();

    if (newText === "") {
        taskMessage.textContent = "Task cannot be empty";
        return;
    }

    const newSpan = document.createElement("span");
    newSpan.classList.add("task-text");
    newSpan.textContent = newText;

    taskItem.replaceChild(newSpan, editInput);
    editBtn.textContent = "Edit";
    taskMessage.textContent = "";
}

// Remove a task
function removeTask(taskItem) {
    taskItem.remove();
    taskMessage.textContent = "";
    updateTaskCounts();
}

// Update task counts
function updateTaskCounts() {
    const tasks = taskList.querySelectorAll(".task-item");

    const total = tasks.length;
    const completed = taskList.querySelectorAll(
        '.task-item[data-state="completed"]'
    ).length;
    const pending = taskList.querySelectorAll(
        '.task-item[data-state="pending"]'
    ).length;

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;
}

// Handle all task button clicks using event delegation
function handleTaskListClick(event) {
    const taskItem = event.target.closest(".task-item");

    if (!taskItem || !taskList.contains(taskItem)) return;

    if (event.target.matches(".complete-btn")) {
        toggleTaskComplete(taskItem);
    } else if (event.target.matches(".edit-btn")) {
        const editInput = taskItem.querySelector(".edit-input");

        if (editInput) {
            saveTaskEdit(taskItem);
        } else {
            beginTaskEdit(taskItem);
        }
    } else if (event.target.matches(".remove-btn")) {
        removeTask(taskItem);
    }
}

// Load the required sample tasks
function loadSampleTasks() {
    const sampleTasks = [
        "Review DOM selectors",
        "Practice createElement",
        "Study event delegation"
    ];

    const fragment = document.createDocumentFragment();

    sampleTasks.forEach(function(taskText) {
        const taskId = "task-" + taskCounter;
        taskCounter++;

        const taskItem = createTaskElement(taskText, taskId);
        fragment.appendChild(taskItem);
    });

    taskList.appendChild(fragment);
    taskMessage.textContent = "";
    updateTaskCounts();
}

// Event listeners
addTaskBtn.addEventListener("click", function() {
    addTask(taskInput.value);
});

taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask(taskInput.value);
    }
});

loadSamplesBtn.addEventListener("click", loadSampleTasks);

// Only one click listener for all task actions
taskList.addEventListener("click", handleTaskListClick);

// Initial counts
updateTaskCounts();