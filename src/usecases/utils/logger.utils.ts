import { LoggerManager } from "../handle_log/logger.log"

export type Message<T = any> = {
    log?: string,
    message: string,
    data: T,
}

type MessageOptions = {
    log?: boolean
    level?: 'Info' | 'Warning' | 'Success' | 'Debug' | 'Fatal'
}

export function makeMessage<T>(log: string, message: string, data: T, options?: MessageOptions): Message<T> {
    const isTest = process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID !== undefined;
    
    options = { log: options?.log ?? true, level: options?.level ?? 'Info' };

    if (options.log && !isTest) {
        console.log("Je suis dans le log")
        const Logger = new LoggerManager();
        Logger.log(log, options.level)
    }

    return { message, data}
}