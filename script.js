'use strict';

const submitTask = document.getElementById('todo-submit');
const inputContent = document.getElementById('todo-input');
const taskContainer = document.querySelector('.tasks');
const task = document.querySelector('.task');
const taskContent = document.querySelector('.text');
const editTask = document.querySelector('.edit');
const deleteTask = document.querySelector('.delete');
const saveList = document.getElementById('save-list');
let allTask = [];
let findTask;

//?  Helper functions: 
// To replace edit and save class and their text content respectively
function replaceClass(a, b, clicked, taskToEdit) {
    if (taskToEdit.hasAttribute('readonly')) taskToEdit.removeAttribute('readonly')
    else taskToEdit.setAttribute('readonly', true)

    if (a === 'edit') taskToEdit.focus()
    clicked.textContent = b.toUpperCase();
    clicked.classList.replace(a, b)
}

// Finds the edited task from array allTask
function findTaskInStorage(task) {
    return allTask.findIndex(t => t === task)
}

// Replace the previous task with edited task
function replaceTaskInStorage(task) {
    allTask.splice(findTask, 1, task)
}


//?  Regular functions
// Display new task
function newTask(taskContent) {
    const html = `
    <div class="task">
                    <div class="content">
                        <input type="text" name="text" class="text" value="${taskContent}" readonly>
                    </div>
                    <div class="actions">
                        <button class="edit">EDIT</button>
                        <button class="delete">DELETE</button>
                    </div>
                </div>
    `

    taskContainer.insertAdjacentHTML('beforeend', html)
    inputContent.value = '';
}

// Generate new task when user clicks on add task button
function displayNewTask(e) {
    e.preventDefault();
    const newTaskContent = inputContent.value;

    if (!newTaskContent) return;

    allTask.push(newTaskContent)
    newTask(newTaskContent);
}

// Edit or delete task
function changeTask(e) {
    const clicked = e.target;
    const taskToEdit = clicked.closest('.task').querySelector('.text')

    if (clicked.classList.contains('edit')) {
        replaceClass('edit', 'save', clicked, taskToEdit)
        findTask = findTaskInStorage(taskToEdit.value);

    } else if (clicked.classList.contains('save')) {
        // const taskToEdit = clicked.closest('.task').querySelector('.text')
        replaceClass('save', 'edit', clicked, taskToEdit)
        replaceTaskInStorage(taskToEdit.value)
    }

    if (clicked.classList.contains('delete')) {
        findTask = findTaskInStorage(taskToEdit.value);
        allTask.splice(findTask, 1)
        clicked.closest('.task').remove();
    }
}

function setLocalStorage() {
    const data = JSON.stringify(allTask)
    localStorage.setItem('taskList',data)
}

function getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('taskList'))
    if(!data) return

    allTask = data;
    data.forEach(task => newTask(task));
}


// Event handlers
submitTask.addEventListener('click', displayNewTask)
taskContainer.addEventListener('click', changeTask)
window.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') displayNewTask(e);
})
saveList.addEventListener('click', setLocalStorage)
window.addEventListener('load', getLocalStorage)
