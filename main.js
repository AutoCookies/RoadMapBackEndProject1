#!/usr/bin/env node
import { Command } from "commander";
import { 
    addTask, updateTask, deleteTask, markATask, 
    showAll, showDoneTasks, showInProgressTasks 
} from "./Utils/utils.js";

const program = new Command();

program
    .name("task-cli")
    .description("A simple task tracker CLI")
    .version("1.0.0");

program
    .command("add <description>")
    .description("Add a new task")
    .action((description) => {
        addTask(description);
    });

program
    .command("update <id> <description>")
    .description("Update task description")
    .action((id, description) => {
        updateTask(parseInt(id), description);
    });

program
    .command("delete <id>")
    .description("Delete a task")
    .action((id) => {
        deleteTask(parseInt(id));
    });

program
    .command("mark-done <id>")
    .description("Mark task as done")
    .action((id) => {
        markATask(parseInt(id));
    });

program
    .command("list")
    .description("List all tasks")
    .action(() => {
        showAll();
    });

program
    .command("list-done")
    .description("List all done tasks")
    .action(() => {
        showDoneTasks();
    });

program
    .command("list-in-progress")
    .description("List all in-progress tasks")
    .action(() => {
        showInProgressTasks();
    });

program.parse(process.argv);
