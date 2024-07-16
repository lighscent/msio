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
        console.log(chalk.yellow('Available commands:'));
        console.log(chalk.green('help - Show this help message'));
        console.log(chalk.green('list - List all folders in /containers'));
        console.log(chalk.green('setup [name] - Setup a new container'));
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
    setup: async (args) => {
        if (args.length === 0) {
            console.log(chalk.red('Error: Missing container name.'));
            rl.prompt();
            return;
        } else if (args.length > 1) {
            console.log(chalk.red('Error: Too many arguments.'));
            rl.prompt();
            return;
        } else {
            const containerName = args[0];
            const containerPath = `./containers/${containerName}`;
            fs.mkdir(containerPath, (err) => {
                if (err) {
                    console.error(chalk.red(`Error: ${err.message}`));
                    rl.prompt();
                    return;
                }
                console.log(chalk.green(`Container ${containerName} created successfully.`));
                rl.prompt();
            });
        }
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

rl.on('line', (line) => {
    const input = line.trim().split(/\s+/);
    const command = input.shift().toLowerCase();
    const args = input;
    const handler = commandHandlers[command] || commandHandlers.default;
    handler(args);
  }).on('close', () => {
    console.log(chalk.red('Bye!'));
    process.exit(0);
  });