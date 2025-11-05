const { loadTasks, saveTasks, addTask, getTasks, markTaskAsDone, removeTask } = require('./tasks');

if (process.argv.length < 3) {
    console.log('node index.js <command> [arguments]');
}

const args = process.argv.slice(2);

loadTasks();

switch (args[0]) {
    case 'add':
        if (args.length < 2) {
            console.log('node index.js add <title>');
            break;
        }

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
        if (args.length < 2) {
            console.log('node index.js done <id>');
            break;
        }

        const doneTask = markTaskAsDone(args[1]);
        if (doneTask) {
            console.log(`Marked item as done: "${doneTask.title}" (ID: ${doneTask.id})`);
        } else {
            console.log(`Item with ID ${args[1]} not found.`);
        }
        break;
    case 'remove':
        if (args.length < 2) {
            console.log('node index.js remove <id>');
            break;
        }

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
