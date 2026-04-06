import { webSearch } from "../../tools/search.tool.js";
import { getYoutubeTranscript } from "../../tools/ytt.tool.js";
import { currentWeather, dailyWeatherFor7Days } from "../../tools/weather.tool.js";
import { addTask, removeTask, completeTask, listTasks } from "../../tools/todo.tool.js";
import { safeExec } from "../../tools/exec.tool.js";

export const toolRegistry = {
  search: {
    exec: async ({ query }) => webSearch(query),
    buildPrompt: (args, data) => `
      You have access to web search results.

      Search query: "${args.query}"

      Search results:
      ${data}

      Now, ${args.task}.
    `
  },

  ytt: {
    exec: async ({ link }) => getYoutubeTranscript(link),
    buildPrompt: (args, data) => `
      You have access to a YouTube video transcript.

      Video: ${args.link}

      Transcript:
      ${data}

      Now, ${args.task}.
    `
  },

  "weather.now": {
    exec: async () => currentWeather(),
    buildPrompt: (args, data) => `
      You have access to current weather data.

      Data:
      ${JSON.stringify(data, null, 2)}

      Now, ${args.task}.
    `
  },

  "weather.week": {
    exec: async () => dailyWeatherFor7Days(),
    buildPrompt: (args, data) => `
      You have access to weather data for 7 days.

      Data:
      ${JSON.stringify(data, null, 2)}

      Now, ${args.task}.
    `
  },

  todo: {
    exec: async (args) => {
      const { action, task, due, tag } = args;
      switch (action) {
        case "add":
          return addTask(task, due, tag);
        case "remove":
          return removeTask(task);
        case "complete":
          return completeTask(task);
        case "list":
          return listTasks({ due, tag, done: args.done ?? null });
        default:
          throw new Error(`Unknown todo action: ${action}`);
      }
    },
    buildPrompt: (args, data) => {
      let actionMsg = '';
      const filters = [];
      if (args.tag) filters.push(`tag = ${args.tag}`);
      if (args.due) filters.push(`due ${args.due}`);
      if (args.done) filters.push(`done = ${args.done}`);
      const criteria = filters.length > 0 ? filters.join(', ') : 'no filters applied';
      switch (args.action) {
        case "add":
          actionMsg = `Task "${args.task}" has been added.`;
          break;
        case "remove":
          actionMsg = `Task "${args.task}" has been removed.`;
          break;
        case "complete":
          actionMsg = `Task "${args.task}" has been marked as done.`;
          break;
        case "list":
          actionMsg = `Here is the todo list with the applied criteria: ${criteria}`;
          break;
        default:
          actionMsg = `Action "${args.action}" executed.`;
      }

      return `
        You have access to a todo list.

        ${actionMsg}

        ${data !== "No tasks found matching the criteria." ? JSON.stringify(data, null, 2) : "No tasks found matching the criteria." }
        `;
    },
  },
  execute: {
    exec: async ({ type, target }) => safeExec(type, target),
    buildPrompt: (args) => `
      You were asked to open a group of links, apps or a node app that the user needs at the moment: ${args.type} -> ${args.target}

      They are already in the process of being opened right now.
    `
  }
};