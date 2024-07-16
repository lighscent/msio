const chalkPromise = import('chalk');
const figletPromise = import('figlet');

const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let chalk, figlet;

(async () => {
    const chalkModule = await import('chalk');
    const figletModule = await import('figlet');

    chalk = chalkModule.default ? chalkModule.default : chalkModule;
    figlet = figletModule.default ? figletModule.default : figletModule;

    showWelcomeMessage();
})();

async function showWelcomeMessage() {
    console.clear();
    console.log(chalk.magenta(figlet.textSync('MultiScriptInOne', { horizontalLayout: 'full' })));
    console.log(chalk.blue(`Welcome in `+chalk.magenta("MultiScriptInOne")+` by `+chalk.yellow(`@light2k4`)));
    console.log(chalk.blue(`Type `+chalk.green("help")+` to get a list of available commands or `+chalk.red("exit")+` to quit`));
    rl.setPrompt(chalk.cyan('MSIO> '));
    rl.prompt();
}

const commandHandlers = {
    help: async () => {
        rl.pause();
        console.log(chalk.green('Available commands:'));
        console.log(chalk.green('help - Show this help message'));
        console.log(chalk.green('list - List all folders in /containers'));
        console.log(chalk.green('exit - Exit the program'));
        rl.resume();
        rl.prompt();
    },
    list: async () => {
        rl.pause(); 
        fs.readdir('./containers', (err, files) => {
            if (err) {
                console.error(chalk.red(`Error: ${err.message}`));
                rl.resume(); 
                rl.prompt(); 
                return;
            }
            if (files.length === 0) {
                console.log(chalk.yellow('No folders found in /containers.'));
            } else {
                files.forEach((file) => {
                    console.log(chalk.green(file));
                });
            }
            rl.resume();
            rl.prompt();
        });
    },
    exit: async () => {
        rl.close();
    },
    quit: async () => {
        rl.close();
    },
    close: async () => {
        rl.close();
    },
    default: async () => {
        rl.prompt();
    }
};

rl.on('line', async (line) => {
    const command = line.trim().toLowerCase();
    const handler = commandHandlers[command] || commandHandlers.default;
    await handler();
}).on('close', async () => {
    console.log(chalk.red('Bye!'));
    process.exit(0);
});