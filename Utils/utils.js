import fs from "fs";
import Task from "../Models/task.js"
import readlineSync from "readline-sync";
const TASK_FILE = "tasks.json";

export function loadTasks() {
    if (fs.existsSync(TASK_FILE)) {
        let rawData = JSON.parse(fs.readFileSync(TASK_FILE, "utf8"));
        
        return {
            todo: rawData.todo.map(task => new Task(task.id, task.description, task.status, task.createAt, task.updateAt)),
            in_progress: rawData.in_progress.map(task => new Task(task.id, task.description, task.status, task.createAt, task.updateAt)),
            done: rawData.done.map(task => new Task(task.id, task.description, task.status, task.createAt, task.updateAt))
        };
    }

    return { todo: [], in_progress: [], done: [] };
}

export function saveTasks(tasks) {
    fs.writeFileSync(TASK_FILE, JSON.stringify(tasks, null, 4));
}

export function getNextTaskId(tasks) {
    let allTasks = Object.values(tasks).flat();
    if (allTasks.length === 0) return 1;
    let maxId = Math.max(...allTasks.map(task => task.id));
    return maxId + 1;
}

export function addTask(description) {
    let tasks = loadTasks();

    const id = getNextTaskId(tasks);
    if (!description.trim()) {
        console.log("Task description cannot be empty.");
        return;
    }

    const startDate = new Date().toISOString();
    const task = new Task(id, description, "todo", startDate, startDate);

    tasks.todo.push(task);
    saveTasks(tasks);

    console.log(`Task added successfully (ID: ${id})`);
}

export function deleteTask(id) {
    let tasks = loadTasks();

    if (Object.values(tasks).flat().length === 0) {
        console.log("There are no tasks now!");
        return;
    }

    let found = false;
    for (let key of Object.keys(tasks)) {
        tasks[key] = tasks[key].filter(task => {
            if (task.id !== id) return true;
            found = true;
            return false;
        });
    }

    if (!found) {
        console.log(`No Task with ID ${id} found.`);
        return;
    }

    saveTasks(tasks);
    console.log(`Task with ID ${id} deleted successfully.`);
}

export function updateTask(id, newDescription) {
    let tasks = loadTasks();
    let taskFound = false;

    for (let key of Object.keys(tasks)) {
        tasks[key] = tasks[key].map(task => {
            if (task.id === id) {
                taskFound = true;
                task.description = newDescription;
                task.updateAt = new Date().toISOString();
            }
            return task;
        });
    }

    if (!taskFound) {
        console.log(`No Task with ID ${id} found.`);
        return;
    }

    saveTasks(tasks);
    console.log(`Task updated successfully (ID: ${id})`);
}

export function markATask(id) {
    let tasks = loadTasks();

    if (Object.values(tasks).flat().length === 0) {
        console.log("There are no tasks now!");
        return;
    }

    let taskFound = null;
    let taskList = null;

    for (let key of Object.keys(tasks)) {
        for (let task of tasks[key]) {
            if (task.id === id) {
                taskFound = task;
                taskList = key;
                break;
            }
        }
        if (taskFound) break;
    }

    if (!taskFound) {
        console.log(`No Task with ID ${id} found.`);
        return;
    }

    console.log("1. Mark as In Progress");
    console.log("2. Mark as Done");

    const statusChoice = readlineSync.question("Choose status (1 or 2): ").trim();

    if (statusChoice === "1") {
        taskFound.status = "in_progress";
    } else if (statusChoice === "2") {
        taskFound.status = "done";
    } else {
        console.log("Invalid choice. Please enter 1 or 2.");
        return;
    }

    tasks[taskList] = tasks[taskList].filter(task => task.id !== id);
    tasks[taskFound.status].push(taskFound);

    saveTasks(tasks);
    console.log(`Task with ID ${id} marked as ${taskFound.status}.`);
}

export function showAll() {
    let tasks = loadTasks();

    if (!tasks || Object.values(tasks).flat().length === 0) {
        console.log("\n❌ There are no tasks now!");
        return;
    }

    console.log("\n📌 LIST OF TASKS:");
    
    if (tasks.todo.length > 0) {
        console.log("\n🔹 TODO TASKS:");
        tasks.todo.forEach(task => task.printInfo());
    } else {
        console.log("\n✅ No TODO tasks.");
    }

    if (tasks.in_progress.length > 0) {
        console.log("\n🚀 IN-PROGRESS TASKS:");
        tasks.in_progress.forEach(task => task.printInfo());
    } else {
        console.log("\n✅ No IN-PROGRESS tasks.");
    }

    if (tasks.done.length > 0) {
        console.log("\n✔️ COMPLETED TASKS:");
        tasks.done.forEach(task => task.printInfo());
    } else {
        console.log("\n✅ No COMPLETED tasks.");
    }
}

export function showDoneTasks () {
    let tasks = loadTasks();

    if (!tasks || Object.values(tasks).flat().length === 0) {
        console.log("\n❌ There are no tasks now!");
        return;
    }

    if (tasks.done.length > 0) {
        console.log("\n✔️ COMPLETED TASKS:");
        tasks.done.forEach(task => task.printInfo());
    } else {
        console.log("\n✅ No COMPLETED tasks.");
    }
}

export function showNotDoneTasks () {
    let tasks = loadTasks();

    if (!tasks || Object.values(tasks).flat().length === 0) {
        console.log("\n❌ There are no tasks now!");
        return;
    }

    if (tasks.todo.length > 0) {
        console.log("\n🔹 TODO TASKS:");
        tasks.todo.forEach(task => task.printInfo());
    } else {
        console.log("\n✅ No TODO tasks.");
    }

    if (tasks.in_progress.length > 0) {
        console.log("\n🚀 IN-PROGRESS TASKS:");
        tasks.in_progress.forEach(task => task.printInfo());
    } else {
        console.log("\n✅ No IN-PROGRESS tasks.");
    }
}

export function showInProgressTasks () {
    let tasks = loadTasks();

    if (!tasks || Object.values(tasks).flat().length === 0) {
        console.log("\n❌ There are no tasks now!");
        return;
    }

    if (tasks.in_progress.length > 0) {
        console.log("\n🚀 IN-PROGRESS TASKS:");
        tasks.in_progress.forEach(task => task.printInfo());
    } else {
        console.log("\n✅ No IN-PROGRESS tasks.");
    }
}