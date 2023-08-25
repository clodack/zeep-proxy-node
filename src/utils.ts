import { spawn } from 'node:child_process';
import path from 'path';
import fs from 'fs';

const ROOT_DIR = fs.realpathSync(path.resolve(__dirname, '..'));
const CURRENT_DIR = fs.realpathSync(process.cwd());

/**
 * 
 * @param {string} relativePath
 * @return {string} 
 */
export function resolveByCurentDir(relativePath: string) {
    return path.resolve(CURRENT_DIR, relativePath);
}

/**
 * 
 * @param {string} relativePath
 * @return {string} 
 */
export function resolveByRootDir(relativePath: string) {
    return path.resolve(ROOT_DIR, relativePath);
}

/**
 * 
 * @param {string} command 
 * @param {{cwd?: string, noExit?: boolean}} options 
 * @return {Promise<number>}
 */
export function executeCommand(command: string, options: { cwd?: string; noExit?: boolean } = {}) {
    const { cwd, noExit } = options;

    // @ts-ignore
    let result = new Promise((resolve, reject) => {
        // @ts-ignore
        const process = spawn(command, { shell: true, stdin: 'inherit', cwd });
        // @ts-ignore
        process.stdout.on('data', (data) => {
            console.log(data.toString());
        });
        // @ts-ignore
        process.on('error', reject);
        // @ts-ignore
        process.on('close', resolve);
    });

    if (!noExit) {
        result = result.then((code) => {
            if (!Number.isNaN(code) && code !== 0) {
                console.error('Error execute command!', code);
                // @ts-ignore
                process.exit(code);
            }

            return code;
        });
    }

    return result;
}
