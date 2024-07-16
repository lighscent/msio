const chalkPromise = import('chalk');
const figletPromise = import('figlet');

const { exec } = require('child_process');
const readline = require('readline');

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
    const trimmedLine = line.trim().toLowerCase();

    if (trimmedLine === 'help') {
        console.log(chalk.green('Available commands:'));
        console.log(chalk.green('help - Show this help message'));
        console.log(chalk.green('exit - Exit the program'));
        rl.prompt();
        return;
    }

    if (trimmedLine === 'exit' || trimmedLine === 'quit' || trimmedLine === 'close') {
        rl.close();
        return;
    }

    if (trimmedLine === 'cls' || trimmedLine === 'clear') {
        console.clear();
        showWelcomeMessage();
        rl.prompt();
        return;
    }

    exec(line, (error, stdout, stderr) => {
        if (error) {
            console.error(chalk.red(`Error: ${error.message}`));
            return;
        }
        if (stderr) {
            console.error(chalk.red(`Error: ${stderr}`));
            return;
        }
        console.log(chalk.green(stdout));
    });

    console.error(chalk.red(`Command not recognized: ${trimmedLine}`));
    rl.prompt();
}).on('close', async () => {
    const chalkModule = await chalkPromise;
    const chalk = chalkModule.default ? chalkModule.default : chalkModule;
    console.log(chalk.red('Bye!'));
    process.exit(0);
});