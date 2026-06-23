import fs from "fs/promises";

let config = {};

export const loadConfig = async () =>{
  const data = await fs.readFile(
      "./storage/config.json",
      "utf8"
  );
  config = JSON.parse(data);
}

export const saveConfig = async () =>{
  await fs.writeFile(
      "./storage/config.json",
      JSON.stringify(config, null, 2)
  );
}

export const getConfigParameter = key =>{
  return config[key];
}

export const setConfigParameter = (key, value) =>{
  config[key] = value;
}

export const getFullConfig = () =>{
  return config;
}