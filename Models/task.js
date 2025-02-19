class Task {
    constructor(id, description, status, createAt, updateAt) {
        this.id = id;
        this.description = description;
        this.status = status;
        this.createAt = createAt;
        this.updateAt = updateAt;
    }

    printInfo() {
        console.log(`Task ID: ${this.id}`);
        console.log(`Description: ${this.description}`);
        console.log(`Status: ${this.status}`);
        console.log(`Created At: ${this.createAt}`);
        console.log(`Last Updated: ${this.updateAt}`);
        console.log("--------------------------");
    }
}

export default Task;