//fetching DOM elements and initializing event listeners
document.addEventListener("DOMContentLoaded", function() {
    const themeToggle = document.getElementById('themeToggle');
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");

    //theme toggle functionality
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = themeToggle.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    //function to add a new task
    const addTask = (text, completed = false) => {
        const taskText = text || taskInput.value.trim();
        if (taskText === '') {
            return;
        }

        //task text and checkbox
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `<input type="checkbox" class="checkbox" ${completed ? 'checked' : ''}>
        <span>${taskText}</span><div class="task-btns"><button class="edit-btn"><i class="fas fa-edit"></i></button>
        <button class="delete-btn"><i class="fas fa-trash-alt"></i></button></div>`;

        //edit and checkbox elements
        const checkbox = listItem.querySelector('.checkbox');
        const editBtn = listItem.querySelector('.edit-btn');

        //apply completed styling when restoring saved tasks
        if (completed) {
            listItem.classList.add('completed');
            checkbox.checked = true;
            editBtn.disabled = true;
            editBtn.style.opacity = 0.5;
            editBtn.style.cursor = 'not-allowed';
        }

        //edit button functionality when checkbox is checked
        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            listItem.classList.toggle('completed', isChecked);
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? 0.5 : 1;
            editBtn.style.cursor = isChecked ? 'not-allowed' : 'pointer';
            saveTasks();
        });

        editBtn.addEventListener('click', function handleEdit() {
            if (!checkbox.checked) {
                const taskSpan = listItem.querySelector('span');
                const currentText = taskSpan.textContent;
                
                // Create an input field to edit the task
                const editInput = document.createElement('input');
                editInput.type = 'text';
                editInput.value = currentText;
                editInput.className = 'edit-input';
                
                // Replace span with input
                taskSpan.replaceWith(editInput);
                editInput.focus();
                editInput.select();
                
                // Change edit button to save button
                editBtn.innerHTML = '<i class="fas fa-check"></i>';
                editBtn.removeEventListener('click', handleEdit);
                
                // Save on Enter key or clicking save button
                const saveEdit = () => {
                    const newText = editInput.value.trim();
                    if (newText !== '') {
                        const newSpan = document.createElement('span');
                        newSpan.textContent = newText;
                        editInput.replaceWith(newSpan);
                        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                    }  else {
                        // If empty, restore original text
                        const newSpan = document.createElement('span');
                        newSpan.textContent = currentText;
                        editInput.replaceWith(newSpan);
                        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
                    }
                    // Re-attach the edit listener after saving
                    editBtn.addEventListener('click', handleEdit);
                    saveTasks();
                };
                
                // Save on Enter key
                editInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        saveEdit();
                    }
                });
                
                // Save on clicking the save button
                const saveHandler = () => {
                    saveEdit();
                    editBtn.removeEventListener('click', saveHandler);
                };
                editBtn.addEventListener('click', saveHandler);
            }
        });

        //deleting task on delete button click
       
        listItem.querySelector('.delete-btn').addEventListener('click', () => {
            taskList.removeChild(listItem);
            saveTasks();
        });

        taskList.appendChild(listItem);
        taskInput.value = '';
        saveTasks();
    };

    //adds task on form submit or button click (prevents page reload)
    taskForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addTask();
    });
    addTaskBtn.addEventListener('click', (event) => {
        event.preventDefault();
        addTask();
    });

    //save tasks to local storage
    const saveTasks = () => {
        const tasks = Array.from(taskList.querySelectorAll('li')).map((item) => ({
            text: item.querySelector('span').textContent,
            completed: item.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    //restore tasks from local storage on page load
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => addTask(task.text, task.completed));
});

