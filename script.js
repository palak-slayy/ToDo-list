
const todoInput = document.getElementById("todoInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");

// Load saved tasks
let todos = JSON.parse(localStorage.getItem("friendTodos")) || [];

let editId = null;

// Save tasks
function saveTodos() {
    localStorage.setItem("friendTodos", JSON.stringify(todos));
}

// Display tasks
function displayTodos() {

    todoList.innerHTML = "";

    emptyMessage.style.display =
        todos.length === 0 ? "block" : "none";

    todos.forEach(function(todo) {

        const li = document.createElement("li");

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.completed;

        checkbox.addEventListener("change", function() {
            toggleComplete(todo.id);
        });

        // Task text
        const span = document.createElement("span");
        span.textContent = todo.text;
        span.className = "task-text";

        if (todo.completed) {
            span.classList.add("completed");
        }

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";

        editBtn.addEventListener("click", function() {
            editTodo(todo.id);
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", function() {
            deleteTodo(todo.id);
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);

    });

    updateStats();
}

// Add or update task
function addTodo() {

    const text = todoInput.value.trim();

    if (text === "") {
        alert("Please enter a task!");
        return;
    }

    if (editId !== null) {

        const todo = todos.find(function(item) {
            return item.id === editId;
        });

        if (todo) {
            todo.text = text;
        }

        editId = null;
        addBtn.textContent = "+ Add Task";

    } else {

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };

        todos.push(newTodo);
    }

    todoInput.value = "";

    saveTodos();
    displayTodos();
}

// Edit task
function editTodo(id) {

    const todo = todos.find(function(item) {
        return item.id === id;
    });

    if (todo) {
        todoInput.value = todo.text;
        editId = id;
        addBtn.textContent = "Update Task";
        todoInput.focus();
    }
}

// Delete task
function deleteTodo(id) {

    todos = todos.filter(function(todo) {
        return todo.id !== id;
    });

    if (editId === id) {
        editId = null;
        todoInput.value = "";
        addBtn.textContent = "+ Add Task";
    }

    saveTodos();
    displayTodos();
}

// Complete task
function toggleComplete(id) {

    const todo = todos.find(function(item) {
        return item.id === id;
    });

    if (todo) {
        todo.completed = !todo.completed;
    }

    saveTodos();
    displayTodos();
}

// Update statistics
function updateStats() {

    const completed = todos.filter(function(todo) {
        return todo.completed;
    }).length;

    totalTasks.textContent = todos.length;
    completedTasks.textContent = completed;
    pendingTasks.textContent = todos.length - completed;

    taskCount.textContent =
        todos.length + (todos.length === 1 ? " task" : " tasks");
}

// Button click event
addBtn.addEventListener("click", addTodo);

// Enter key event
todoInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTodo();
    }
});

// Load tasks when page opens
displayTodos();
