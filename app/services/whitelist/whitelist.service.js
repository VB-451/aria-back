import fs from "fs/promises";

let whitelist = {}

export const loadWhitelist = async () =>{
    const data = await fs.readFile(
        "./storage/exec_whitelist.json",
        "utf8"
    );

    whitelist = JSON.parse(data);
}

const saveWhitelist = async () =>{
    await fs.writeFile(
        "./storage/exec_whitelist.json",
        JSON.stringify(whitelist, null, 2)
    );    
}

export const retrieveWhitelist = () =>{
    return whitelist;
}

export const addItemToGroup = async (section, key, item) =>{
    if (!whitelist[section][key]) {
        whitelist[section][key] = [];
    }
    whitelist[section][key].push(item);
    await saveWhitelist();
}

export const addKeyToNode = async (name, entry) =>{
    whitelist.node[name] = entry;
    await saveWhitelist();
}

export const removeGroup = async (section, key) =>{
    delete whitelist[section][key]
    await saveWhitelist();
}

export const removeItem = async (section, key, index) =>{
    const copy = [...whitelist[section][key]]
    copy.splice(index, 1)
    whitelist[section][key] = copy;
    await saveWhitelist();
}






