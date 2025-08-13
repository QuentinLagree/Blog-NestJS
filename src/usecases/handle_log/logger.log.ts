import fs from 'fs';
import chalk from 'chalk';
import path from 'path';

type Level = 'Info' | 'Warning' | 'Success' | 'Debug' | 'Fatal';

export class LoggerManager {
  level: Level;

  

  logFolderPath = path.join(__dirname, 'logs_files');


  constructor() {}

  init() {
    this.createLogFolderIfNotExist();
    this.log('Logger initialized', 'Info');
}

  private createLogFolderIfNotExist() {
    try {
      if (!fs.existsSync(this.logFolderPath)) {
        fs.mkdirSync(this.logFolderPath);
      }

      const fileNameWithDate = `/${new Date().toLocaleDateString('fr-FR').replaceAll('/', '-')}.log`;

      if (fs.existsSync(this.logFolderPath + fileNameWithDate)) return;

      fs.appendFile(this.logFolderPath + fileNameWithDate, '', function (err) {
        if (err) throw err;
        console.log(
          `\n\n${chalk.green('> ')} ${chalk.bold.bgGreen(' GOOD ')} ${chalk.green(`Le fichier:`)} ${chalk.yellow.underline(fileNameWithDate)} ${chalk.green(`a bien été créé.`)}\n`,
        );
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async log(message: string, level: Level = 'Info') {
    const fileNameWithDate = `${new Date().toLocaleDateString('fr-FR').replaceAll('/', '-')}.log`;

    
    if (!fs.existsSync(this.logFolderPath + fileNameWithDate)) {
        fs.appendFile(this.logFolderPath + fileNameWithDate, '', function (err) {
            if (err) throw err;
            console.log(
              `\n\n${chalk.green('> ')} ${chalk.bold.bgGreen(' GOOD ')} ${chalk.green(`Le fichier:`)} ${chalk.yellow.underline(fileNameWithDate)} ${chalk.green(`a bien été créé.`)}\n`,
            );
          });
    }

    let hours = ((new Date().getHours() < 10) ? "0" : "") + new Date().getHours()
    let minutes = ((new Date().getMinutes() < 10) ? "0" : "") + new Date().getMinutes()
    let seconds = ((new Date().getSeconds() < 10) ? "0" : "") + new Date().getSeconds()
    const logFormat = `[${hours}:${minutes}:${seconds}] (${level})`
    
    fs.appendFile(this.logFolderPath + "/" + fileNameWithDate, `${logFormat} ${message}\n`, function (err) {
        if (err) throw err;
      });
  }


}
