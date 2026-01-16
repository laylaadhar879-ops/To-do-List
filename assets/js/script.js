document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const toDoContainer = document.querySelector('.box-container');

    //function to adjust empty state display

    const toggleEmptyState = () => {
        toDoContainer.computedStyleMap.width = taskList.children.length === 0 ? '100%' : '50%';
    };

    //function to add a new task

    const addTask = (event) => {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            return;
        }

        //task text and checkbox

        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.innerHTML = `<span>${taskText}</span><div class="task-btns"><button class="edit-btn"><i class="fas fa-edit"></i></button>
        <button class="delete-btn"><i class="fas fa-trash-alt"></i></button></div><input type="checkbox" class="checkbox">`;

        //edit and delete button functionality
        const checkbox = listItem.querySelector('.checkbox');
        const editBtn = listItem.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            if (checkbox.checked) {
                taskInput.value = listItem.querySelector('span').textContent;
                taskList.removeChild(listItem);
                toggleEmptyState();
            }
        });
       
        listItem.querySelector('.delete-btn').addEventListener('click', () => {
            taskList.removeChild(listItem);
            toggleEmptyState();
        });

        taskList.appendChild(listItem);
        taskInput.value = '';
        toggleEmptyState();
    };

    //adds task on button click or enter key press

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            addTask(event);
        }
    });
});