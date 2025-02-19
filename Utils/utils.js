import fs from "fs";
import Task from "../Models/task.js"
import readlineSync from "readline-sync";
const TASK_FILE = "tasks.json";

export function loadTasks() {
    if (fs.existsSync(TASK_FILE)) {
        return JSON.parse(fs.readFileSync(TASK_FILE, "utf8"));
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

export function addTask() {
    let tasks = loadTasks();

    const id = getNextTaskId(tasks);
    const description = readlineSync.question("Enter task description: ").trim();

    if (!description) {
        console.log("Task description cannot be empty.");
        return;
    }

    const startDate = new Date().toISOString();
    const task = new Task(id, description, "todo", startDate, startDate);

    tasks.todo.push(task);
    saveTasks(tasks);

    console.log(`Task "${description}" added successfully with ID: ${id}`);
}

export function deleteTask() {
    let tasks = loadTasks();

    if (Object.values(tasks).flat().length === 0) {
        console.log("There are no tasks now!");
        return;
    }

    const id = parseInt(readlineSync.question("Type in task ID you want to delete: ").trim());

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

export function updateTask() {
    let tasks = loadTasks();

    if (Object.values(tasks).flat().length === 0) {
        console.log("There are no tasks now!");
        return;
    }

    const id = parseInt(readlineSync.question("Type in task ID you want to update: ").trim());

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
    }

    if (!taskFound) {
        console.log(`No Task with ID ${id} found.`);
        return;
    }

    const newDescription = readlineSync.question("Enter new task description: ").trim();
    if (newDescription) {
        taskFound.description = newDescription;
        taskFound.updateAt = new Date().toISOString();
    }

    saveTasks(tasks);
    console.log(`Task with ID ${id} updated successfully.`);
}

export function markATask() {
    let tasks = loadTasks();

    if (Object.values(tasks).flat().length === 0) {
        console.log("There are no tasks now!");
        return;
    }

    const id = parseInt(readlineSync.question("Type in task ID you want to update: ").trim());

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
        if (taskFound) break; // Dừng vòng lặp nếu tìm thấy task
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

    // Cập nhật danh sách tasks: xóa task khỏi danh sách cũ và thêm vào danh sách mới
    tasks[taskList] = tasks[taskList].filter(task => task.id !== id);
    tasks[taskFound.status].push(taskFound);

    saveTasks(tasks);
    console.log(`Task with ID ${id} marked as ${taskFound.status}.`);
}

export function showAll() {
    
}