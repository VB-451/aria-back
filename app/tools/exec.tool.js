import { exec, spawn } from "child_process";
import fs from "fs";
import { retrieveWhitelist } from "../services/whitelist/whitelist.service.js";

export function safeExec(type, name) {
  
  const whitelist = retrieveWhitelist();

  if (type === "apps") {
    
    let commands;

    for(const key of Object.keys(whitelist.apps)){
      if(name.toLowerCase() === key.toLowerCase()){
        commands = whitelist.apps[key];
      }
    }

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
    
    let group;

    for(const key of Object.keys(whitelist.links)){
      if(name.toLowerCase() === key.toLowerCase()){
        group = whitelist.links[key];
      }
    }
    
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
  } else if (type === "node") {
    
    let parameters;

    for(const key of Object.keys(whitelist.node)){
      if(name.toLowerCase() === key.toLowerCase()){
        parameters = whitelist.node[key];
      }
    }

    if (!parameters) {
        console.warn(`[Aria] Node "${name}" not allowed.`);
        return;
    }
    spawn("npm", ["run", parameters.script], {
        cwd: parameters.directory,
        stdio: "inherit",
        shell: true
    });
    exec(`start ${parameters.webpage}`);
    return;
}
  
  else {
    console.warn(`[Aria] Invalid type "${type}" requested.`);
  }
}