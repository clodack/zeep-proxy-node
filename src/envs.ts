import fs from 'fs';

import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';

import { resolveByCurentDir, resolveByRootDir } from './utils';

/**
 * 
 * @param {string} fileName 
 * @param {string} envName 
 */
export function injectEnvFiles(fileName: string, envName: string) {
    const rootEnvPath = resolveByRootDir(fileName);
    const envPath = resolveByCurentDir(fileName);

    const envFiles = [
        envName && `${envPath}.${envName}.local`,
        envName && `${envPath}.${envName}`,
        `${envPath}.local`,
        `${envPath}`,
        envName && `${rootEnvPath}.${envName}.local`,
        envName && `${rootEnvPath}.${envName}`,
        `${rootEnvPath}.local`,
        `${rootEnvPath}`,
    ].filter(Boolean);

    envFiles.forEach((envFile) => {
        if (fs.existsSync(envFile)) {
            dotenvExpand.expand(dotenv.config({ path: envFile }));
        }
    });
}

export function getClientEnvironments() {
    const NODE_ENV = process.env.NODE_ENV ?? 'development';
    const ENV_TARGET = process.env.ENV_TARGET ?? process.env.npm_package_config_dotenv_target ?? 'web';

    const appEnv = Object.keys(process.env)
        .reduce((envs, key) => {
            envs[key] = process.env[key];
            return envs;
        }, {} as Record<string, string | undefined>);

    const allEnvs = {
        ...appEnv,
        ENV_TARGET,
        NODE_ENV,
    } as Record<string, string>;

    const stringified = Object.keys(allEnvs).reduce((envs, key) => {
        envs[`process.env.${key}`] = JSON.stringify(allEnvs[key]);
        return envs;
    }, {} as Record<string, string | undefined>);

    return {
        envs: allEnvs,
        stringified,
    }
}
