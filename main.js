const chalkPromise = import('chalk');
const figletPromise = import('figlet');

const { exec } = require('child_process');
const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function showWelcomeMessage() {
    const chalkModule = await chalkPromise;
    const figletModule = await figletPromise;

    const chalk = chalkModule.default ? chalkModule.default : chalkModule;
    const figlet = figletModule.default ? figletModule.default : figletModule;

    console.clear();
    console.log(chalk.magenta(figlet.textSync('MultiScriptInOne', { horizontalLayout: 'full' })));
    console.log(chalk.blue(`Welcome in `+chalk.magenta("MultiScriptInOne")+` by `+chalk.yellow(`@light2k4`)));
    console.log(chalk.blue(`Type `+chalk.green("help")+` to get a list of available commands or `+chalk.red("exit")+` to quit`));
    rl.setPrompt(chalk.cyan('MSIO> '));
    rl.prompt();
}

showWelcomeMessage();

rl.on('line', async (line) => {
    const chalkModule = await chalkPromise;
    const chalk = chalkModule.default ? chalkModule.default : chalkModule;
    const command = line.trim().toLowerCase();
    let handled = false; // Flag to indicate if the command has been handled

    if (command === 'help') {
        rl.pause(); // Pause the prompt
        console.log(chalk.green('Available commands:'));
        console.log(chalk.green('help - Show this help message'));
        console.log(chalk.green('list - List all folders in /containers'));
        console.log(chalk.green('exit - Exit the program'));
        rl.resume(); // Resume the prompt
        handled = true; // Command has been handled
    } else if (command === 'list') {
        rl.pause(); // Pause the prompt
        // this command list all folders in the folder containers with module fs
        fs.readdir('./containers', (err, files) => {
            if (err) {
                console.error(chalk.red(`Error: ${err.message}`));
                rl.resume(); // Resume to ensure prompt comes after logging
                rl.prompt(); 
                return;
            }
            if (files.length === 0) {
                console.log(chalk.yellow('No folders found in /containers.'));
                rl.resume(); // Ensure the prompt comes after the message
                rl.prompt(); // Reprompt even if no files are found
            } else {
                files.forEach((file, index) => {
                    console.log(chalk.green(file));
                    if (index === files.length - 1) {
                        rl.resume(); // Resume to ensure prompt comes after logging
                        rl.prompt(); // Reprompt after all files have been listed
                    }
                });
            }
        });
        handled = true; // Command has been handled
    } else if (command === 'exit' || command === 'quit' || command === 'close') {
        rl.close();
    }

    if (handled) {
        // For synchronous commands, prompt is handled outside the condition
        // For asynchronous commands like 'list', rl.prompt() is called after the operation
    }
}).on('close', async () => {
    const chalkModule = await chalkPromise;
    const chalk = chalkModule.default ? chalkModule.default : chalkModule;
    console.log(chalk.red('Bye!'));
    process.exit(0);
});