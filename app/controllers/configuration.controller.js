import { getFullConfig, saveConfig, setConfigParameter } from "../services/configuration/configuration.service.js"

const ALLOWED_KEYS_OBJECT = {
    numberOfInteractionsContext: {
        min: 0,
        max: 3
    },
    memorySearchThreshold: {
        min: 0.4,
        max: 0.8
    },
    ttsTalkSpeed: {
        min: 0.5,
        max: 2
    },
    ttsVolume: {
        min: 0,
        max: 1
    },
    gmailInterval: {
        min: 20,
        max: 120
    },
    todoInterval: {
        min: 20,
        max: 120
    }
}

export const retrieveConfig = (req, res) =>{
    res.json(getFullConfig())
}

export const changeParameter = async (req, res) =>{
    for (const key of Object.keys(req.body)){
        if(!(key in ALLOWED_KEYS_OBJECT)){
            return res.status(400).json({
                error: `Unknown config key: ${key}`
            });
        }
        if(req.body[key] < ALLOWED_KEYS_OBJECT[key].min || req.body[key] > ALLOWED_KEYS_OBJECT[key].max){
            return res.status(400).json({
                error: `Value outside of allowed interval for ${key}.`
            });
        }
        setConfigParameter(key, req.body[key])
    }
    await saveConfig();
    res.json(getFullConfig());
}