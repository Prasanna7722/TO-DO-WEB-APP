document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dateInput = document.getElementById('dateInput');
    const timeInput = document.getElementById('timeInput');
    const taskText = taskInput.value.trim();
    const taskDate = dateInput.value;
    const taskTime = timeInput.value;

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        date: taskDate,
        time: taskTime,
        completed: false
    };

    saveTask(task);
    renderTask(task);

    taskInput.value = '';
    dateInput.value = '';
    timeInput.value = '';
}

function renderTask(task) {
    const taskList = document.getElementById('taskList');
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    let dateTimeString = '';
    if (task.date && task.time) {
        dateTimeString = ` - ${task.date} at ${task.time}`;
    } else if (task.date) {
        dateTimeString = ` - ${task.date}`;
    }

    li.innerHTML = `
        <span class="task-text">${task.text}${dateTimeString}</span>
        <div class="actions">
            <button class="edit-btn" onclick="editTask(this)">Edit</button>
            <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
        </div>
    `;

    li.addEventListener('click', (e) => {
        if (!e.target.closest('.actions')) {
            toggleComplete(li);
        }
    });

    taskList.appendChild(li);
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
}

function toggleComplete(li) {
    const taskId = li.dataset.id;
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(t => t.id == taskId);

    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        li.classList.toggle('completed', tasks[taskIndex].completed);
    }
}

function deleteTask(button) {
    const li = button.closest('.task-item');
    const taskId = li.dataset.id;

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(t => t.id != taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    li.remove();
}

function editTask(button) {
    const li = button.closest('.task-item');
    const taskTextSpan = li.querySelector('.task-text');
    const taskId = li.dataset.id;
    
    // Extract the pure task text, without date/time
    const currentText = taskTextSpan.textContent.split(' - ')[0].trim();
    
    const isEditing = li.querySelector('.edit-input');

    if (isEditing) {
        // Save the edited task
        const newText = isEditing.value.trim();
        if (newText === '') {
            alert('Task cannot be empty.');
            return;
        }

        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskIndex = tasks.findIndex(t => t.id == taskId);
        
        if (taskIndex > -1) {
            tasks[taskIndex].text = newText;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskTextSpan.textContent = newText + (tasks[taskIndex].date ? ` - ${tasks[taskIndex].date} at ${tasks[taskIndex].time}` : '');
            li.classList.remove('editing');
            // Restore edit button
            button.textContent = 'Edit';
        }
    } else {
        // Start editing
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.value = currentText;
        taskTextSpan.replaceWith(editInput);
        editInput.focus();
        
        li.classList.add('editing');
        button.textContent = 'Save';
        
        editInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                editTask(button);
            }
        });
    }
}