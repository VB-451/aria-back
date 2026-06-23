import { selectDirectory, selectExe } from "../services/powershell/powershell.service.js";

export const getDirectoryPath = async (req, res) =>{
    try {
        const directory = await selectDirectory();

        res.json({
            success: true,
            directory: directory || null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export const getExecutablePath = async (req, res) =>{
    try {
        const executablePath = await selectExe();

        res.json({
            success: true,
            executablePath: executablePath || null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}