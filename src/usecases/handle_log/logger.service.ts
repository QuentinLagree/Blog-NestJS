import { Injectable, OnModuleInit } from "@nestjs/common";
import chalk from 'chalk'
import { LoggerManager } from "./logger.log";

@Injectable()
export class LoggerService implements OnModuleInit {
    private static isInitiated: boolean = false;    
    private logger: LoggerManager = new LoggerManager();

    async onModuleInit() {
        if(!LoggerService.isInitiated) {
            try {
                this.logger.init();
                console.log(`\n\n${chalk.green('> ')} ${chalk.bold.bgGreen(" GOOD ")} ${chalk.green("Le logger est bien initialisé.")}\n`);
            } catch(error) {
                console.log(`${chalk.red('> ')} ${chalk.bold.bgRed(" ERROR ")} ${chalk.red("Echec lors de l'initialisation du logger : " + error)}`);
            }
            LoggerService.isInitiated = true

        }        
    }
}