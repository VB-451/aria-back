import fs from "fs";
import path from "path";

const TODO_FILE = path.join(process.cwd(), "todos.json");

function ensureTodoFile() {
  if (!fs.existsSync(TODO_FILE)) {
    fs.writeFileSync(TODO_FILE, JSON.stringify([]));
  }
}
function readTasks() {
  ensureTodoFile();
  const raw = fs.readFileSync(TODO_FILE, "utf-8");
  return JSON.parse(raw);
}

function writeTasks(tasks) {
  fs.writeFileSync(TODO_FILE, JSON.stringify(tasks, null, 2));
}

export function addTask(task, due = null, tag = null) {
  const tasks = readTasks();
  tasks.push({ task, due, tag, done: false });
  writeTasks(tasks);
  return `Task added: "${task}"`;
}

export function removeTask(identifier) {
  let tasks = readTasks();
  if (typeof identifier === "number") {
    if (identifier < 0 || identifier > tasks.length)
      throw new Error("Invalid task index");
    tasks.splice(identifier - 1, 1);
  } else {
    let index = tasks.findIndex(t => t.task.toLowerCase() === identifier.toLowerCase());
    if (index === -1) {
      index = tasks.findIndex(t => t.task.toLowerCase().includes(identifier.toLowerCase()));
    }
    if (index === -1) throw new Error("Task not found");
    tasks.splice(index, 1);
  }
  writeTasks(tasks);
  return tasks;
}

export function completeTask(identifier) {
  const tasks = readTasks();
  let task;

  if (typeof identifier === "number") {
    if (identifier <= 0 || identifier > tasks.length)
      throw new Error("Invalid task index");
    task = tasks[identifier - 1];
  } else {
    task = tasks.find(t => t.task.toLowerCase() === identifier.toLowerCase());

    if (!task) {
      task = tasks.find(t => t.task.toLowerCase().includes(identifier.toLowerCase()));
    }

    if (!task) throw new Error("Task not found");
  }

  task.done = true;
  writeTasks(tasks);
  return tasks;
}


export function listTasks({ due = null, tag = null, done = null } = {}) {
  let tasks = readTasks();
  if (due !== null) tasks = tasks.filter(t => t.due === due);
  if (tag !== null) tasks = tasks.filter(t => t.tag.toLowerCase() === tag.toLowerCase());
  if (done !== null) tasks = tasks.filter(t => t.done === done);
  if (tasks.length === 0) return "No tasks found matching the criteria.";
  return tasks;
}
