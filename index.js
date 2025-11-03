import { loadTasks, saveTasks, addTask, getTasks, markTaskAsDone, removeTask } from './tasks';

const args = process.argv.slice(2);

loadTasks();

switch (args[0]) {
    case 'add':
        const task = addTask(args[1]);
        console.log(`Added new item: "${task.title}" (ID: ${task.id})`);
        break;
    case 'list':
        console.log('Todo List:');
        const tasks = getTasks();
        tasks.forEach(task => {
            console.log(`${task.id}. [${task.completed ? 'x' : ' '}] ${task.title}`);
        });
        break;
    case 'done':
        const doneTask = markTaskAsDone(args[1]);
        if (doneTask) {
            console.log(`Marked item as done: "${doneTask.title}" (ID: ${doneTask.id})`);
        } else {
            console.log(`Item with ID ${args[1]} not found.`);
        }
        break;
    case 'remove':
        const removedTask = removeTask(args[1]);
        if (removedTask) {
            console.log(`Removed item: "${removedTask.title}" (ID: ${removedTask.id})`);
        }
        else {
            console.log(`Item with ID ${args[1]} not found.`);
        }
        break;
}

saveTasks();
