import { listTasks } from "../tools/todo.tool.js"
import { addNotification } from "../services/notifications/notifications.service.js";
import { dateTimeDiff } from "../utils/dateTimeDiff.js"
import { getConfigParameter } from "../services/configuration/configuration.service.js";

let alreadyNotified = [];
let timeoutId = null;
let running = true;

export const pushToAlreadyNotified = taskID =>{
    alreadyNotified.push(taskID)
}

const pollTodo = async () =>{
    try {
        const todosWithDueDate = listTasks().filter(task => task.due !== null)
        for (let task of todosWithDueDate){
            const remainingTime = dateTimeDiff(task.due)
            if(alreadyNotified.includes(task.id)) continue;
            if(remainingTime.days < 15){
                addNotification("todo", "approaching_duedate", task)
                alreadyNotified.push(task.id)
            }
        }
    } catch (error) {

    }
}

const scheduleNextPoll = () => {
  if (!running) return;

  const interval = getConfigParameter("todoInterval") * 1000;

  timeoutId = setTimeout(async () => {
    await pollTodo();
    scheduleNextPoll();
  }, interval);
};

export const startTodoWatcher = async () =>{
   scheduleNextPoll()
}

export const stopTodoWatcher = () =>{
    running = false;
    clearTimeout(timeoutId);
}
