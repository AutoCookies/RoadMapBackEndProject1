import { addTask, updateTask, deleteTask } from "./Utils/utils.js";

function main() {
    while (true) {
        console.log("\nTask Tracker CLI");
        console.log("1. Add Task");
        console.log("2. Delete Task");
        console.log("3. Update Task");
        console.log("0. Exit");

        let choice = readlineSync.question("Choose an option: ").trim();

        if (choice === "1") {
            addTask();
        } else if (choice === "2") {
            deleteTask();
        } else if (choice === "3") {
            updateTask();
        } else if (choice === "0") {
            console.log("Program ended.");
            return;
        } else {
            console.log("Invalid choice. Please enter 1, 2, 3, or 0.");
        }
    }
}

main();