import { startGmailWatcher } from "../watchers/gmail.watcher.js"
import { startTodoWatcher } from "../watchers/todo.watcher.js"

export const startWatchers = () =>{
    startGmailWatcher();
    startTodoWatcher();
}