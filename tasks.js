const fs = require('fs');

const tasksFilePath = './tasks.json';
const tasks = [];

const loadTasks = () => {
    if (!fs.existsSync(tasksFilePath)) {
        return;
    }

    const data = fs.readFileSync(tasksFilePath, 'utf-8');
    tasks.push(...JSON.parse(data));
    tasks.sort((a, b) => a.id - b.id);
}

const saveTasks = () => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
}

const findFreeId = () => {
    let id = 1;
    while (tasks.some(t => t.id === id)) {
        id++;
    }

    return id;
}

const addTask = (title) => {
    const newTask = {
        id: findFreeId(),
        title,
        completed: false
    };

    tasks.push(newTask);
    return newTask;
}

const getTasks = () => {
    return tasks;
}

const markTaskAsDone = (id) => {
    const task = tasks.find(t => t.id === parseInt(id));
    if (task) {
        task.completed = true;
    }

    return task;
}

const removeTask = (id) => {
    const index = tasks.findIndex(t => t.id === parseInt(id));
    if (index !== -1) {
        return tasks.splice(index, 1)[0];
    }

    return null;
}

module.exports = {
    loadTasks,
    saveTasks,
    addTask,
    getTasks,
    markTaskAsDone,
    removeTask
};
