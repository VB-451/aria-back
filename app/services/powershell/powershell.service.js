import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scriptsDir = path.resolve(__dirname, '../../../scripts');

async function runPowerShellScript(scriptName) {
    const scriptPath = path.join(scriptsDir, scriptName);

    const { stdout } = await execFileAsync(
        'powershell.exe',
        [
            '-NoProfile',
            '-ExecutionPolicy',
            'Bypass',
            '-File',
            scriptPath
        ]
    );

    return stdout.trim();
}

export async function selectDirectory() {
    return runPowerShellScript('directory_select.ps1');
}

export async function selectExe() {
    return runPowerShellScript('exe_select.ps1');
}

