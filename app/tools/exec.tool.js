import { exec, spawn } from "child_process";
import fs from "fs";

const whitelist = JSON.parse(fs.readFileSync("./exec_whitelist.json", "utf-8"))

export function safeExec(type, name) {
  if (type === "apps") {
    const commands = whitelist.apps[name.toLowerCase()];
    if (!commands) {
      console.warn(`[Aria] App "${name}" not allowed.`);
      return;
    }

    let delay = 0;
    
    commands.forEach((command, index) => {
      setTimeout(() => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            console.error(`[Aria] Failed to open app "${name}" at index ${index}:`, error.message);
          } else if (stderr) {
            console.error(`[Aria] Error in app "${name}" at index ${index}:`, stderr);
          }
        });
      }, delay);

      delay += 2000;
    });
  } else if (type === "links") {
    let delay = 0;
    const group = whitelist.links[name.toLowerCase()];
    if (!group) {
      console.warn(`[Aria] Link group "${name}" not allowed.`);
      return;
    }

    group.forEach((url, index) => {
      setTimeout(() => {
        exec(`start ${url}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`[Aria] Failed to open URL "${url}" at index ${index}:`, error.message);
        } else if (stderr) {
          console.error(`[Aria] Error in opening URL "${url}" at index ${index}:`, stderr);
        }
      });
      }, delay)
      
      delay += 1300;
    });
  } else if(type === "node") {
    const parameters = whitelist.node[name.toLowerCase()]
    if (!parameters) {
      console.warn(`[Aria] Node "${name}" not allowed.`);
      return;
    }
    spawn("node", [parameters.js], {
        cwd: parameters.location,
        stdio: "inherit",
        shell: true
    });
    exec(`start ${parameters.webpage}`)
    return;
  } 
  
  else {
    console.warn(`[Aria] Invalid type "${type}" requested.`);
  }
}