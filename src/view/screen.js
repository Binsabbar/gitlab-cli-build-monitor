/* eslint-disable no-return-assign */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

const readline = require('readline');

class Screen {
  constructor() {
    this.linesPrinted = 0;
    this.logPrinted = 0;
    this.readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.readlineInterface.on('line', (_) => this.linesPrinted += 1);
  }

  screenWrite(message) {
    const linesToClear = -1 * (this.logPrinted + this.linesPrinted);
    readline.moveCursor(process.stdout, linesToClear, linesToClear, () => {
      readline.clearScreenDown(process.stdout, () => {
        console.log(message);
        this.logPrinted = (String(message).match(/\r\n|\r|\n/g) || '').length + 1;
        this.linesPrinted = 0;
      });
    });
  }
}

exports.Screen = Screen;
