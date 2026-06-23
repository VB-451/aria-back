import { addItemToGroup, addKeyToNode, removeGroup, removeItem, retrieveWhitelist } from "../services/whitelist/whitelist.service.js";

export const getWhitelist = async (req, res) =>{
    res.json(retrieveWhitelist())
}

export const postNewGroupItem = async (req, res) =>{
    const { section, key, item } = req.body;
    try {
        await addItemToGroup(section, key, item);
    } catch (e){
        res.status(400).send(e)
    }
    res.send(`Item ${item} sucessfully added to ${key}.`)
}

export const postKeyToNode = async (req, res) =>{
    const { name, entry } = req.body;
    try {
        await addKeyToNode(name, entry);
    } catch (e){
        res.status(400).send(e)
    }
    res.send(`${name} entry successfully upserted.`)
}

export const deleteGroup = async (req, res) =>{
    const { section, key } = req.body;
    try {
        await removeGroup(section, key);
    } catch (e){
        res.status(400).send(e)
    }
    res.send(`${key} successfully deleted.`)
}

export const deleteItem = async (req, res) =>{
    const { section, key, index } = req.body;
    try {
        await removeItem(section, key, index);
    } catch (e){
        res.status(400).send(e)
    }
    res.send(`Item successfully removed.`)
}

