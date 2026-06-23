import { listTasks } from "../tools/todo.tool.js"
import { addNotification } from "../services/notifications/notifications.service.js";
import { dateTimeDiff } from "../utils/dateTimeDiff.js"
import { getConfigParameter } from "../services/configuration/configuration.service.js";

let alreadyNotified = [];


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
                addNotification("todo", "approaching_duedate", {task, remainingTime})
                alreadyNotified.push(task.id)
            }
        }
    } catch (error) {

    }
}

export const startTodoWatcher = async () =>{
    setInterval(pollTodo, getConfigParameter("todoInterval") * 1000)
}
