const chalk = require('./chalk.js');

const banner = `
8888888b.  d8b          888      d8b 888
888   Y88b Y8P          888      Y8P 888
888    888              888          888
888   d88P 888  .d8888b 88888b.  888 888888
8888888P"  888 d88P"    888 "88b 888 888
888 T88b   888 888      888  888 888 888
888  T88b  888 Y88b.    888  888 888 Y88b.
888   T88b 888  "Y8888P 888  888 888  "Y888
`;

module.exports = function(client) {
    console.log('Authenticated');

    client.on('session', (accept) => {
        const session = accept();

        session.on('pty', (accept) => {
            accept();
        });

        session.on('shell', (accept) => {
            const stream = accept();

            const renderHome = () => {
                stream.write(chalk.clearScreen());
                stream.write(banner.trim().replace(/\n/g, '\r\n'));

                stream.write(chalk.green('\r\nWelcome to SSH-Folio!\r\n'));
                stream.write(chalk.green('This is my very own portfolio!\r\n'));
                stream.write(chalk.green("Type 'help' for a list of commands.\r\n"));
                stream.write(chalk.green('Hello ') + chalk.yellow(client.username + '!\r\n'));
                stream.write(chalk.yellow('psst... ') + chalk.blue('give my repository ') + chalk.green('a star') + chalk.yellow(' ★\r\n'));
            };

            const commands = {
                help() {
                    stream.write(chalk.blue('\r\nAvailable commands:\r\n'));
                    stream.write(chalk.blue('whoareyou - Learn more about me\r\n'));
                    stream.write(chalk.blue('help     - Show this help message\r\n'));
                    stream.write(chalk.blue('projects - List my projects\r\n'));
                    stream.write(chalk.blue('contact  - Show contact information\r\n'));
                    stream.write(chalk.blue('clear    - Clear the screen\r\n'));
                    stream.write(chalk.blue('exit     - Disconnect\r\n'));
                },

                projects() {
                    stream.write(chalk.blue('\r\nProjects:\r\n'));
                    stream.write(chalk.blue('1. Aaloo - Virtual pet potato\r\n'));
                    stream.write(chalk.blue('2. Archpad - Arch Linux HackPad\r\n'));
                    stream.write(chalk.blue('3. SSH-Folio - Terminal portfolio\r\n'));
                    stream.write(chalk.green('GitHub:') + chalk.bgBlue('https://github.com/bhatrichit10-ux\r\n'));
                },

                contact() {
                    stream.write(chalk.blue('\r\nContact:\r\n'));
                    stream.write(chalk.blue('Email: ') + chalk.green('bhatrichit10@gmail.com') + '\r\n');
                    stream.write(chalk.green('GitHub:') + chalk.bgBlue('https://github.com/bhatrichit10-ux\r\n'));
                },

                clear() {
                    renderHome();
                },
                whoareyou() {
                    stream.write(chalk.blue('I am Richit!'));
                    stream.write(chalk.blue('- A hackclubber from ') + chalk.green('Jammu/India\r\n'));
                    stream.write(chalk.blue('- I love coding,') + chalk.green('gaming, and') + chalk.blue(' learning new things!\r\n'));
                    stream.write(chalk.blue('me ') + chalk.red('♥ ') + chalk.yellow('JavaScript\r\n'));
                    stream.write(chalk.blue('I learnt javascript, my first ever programming language to prank my friends on discord!\r\n'));
 
                },

                exit() {
                    stream.write(chalk.red('\r\nGoodbye!\r\n'));
                    stream.exit(0);
                    stream.end();
                }
            };

            let buffer = '';

            renderHome();
            stream.write(chalk.yellow('\r\n> '));

            stream.on('data', (data) => {
                if (data.includes(0x03)) {
                    stream.write(chalk.red('\r\nGoodbye!\r\n'));
                    stream.exit(0);
                    stream.end();
                    return;
                }

                const input = data.toString();

                for (const char of input) {
                    if (char === '\r' || char === '\n') {
                        const command = buffer.trim().toLowerCase();

                        stream.write('\r\n');

                        if (command) {
                            if (commands[command]) {
                                commands[command]();
                            } else {
                                stream.write(
                                    chalk.red(`Unknown command: ${command}\r\n`)
                                );
                            }
                        }

                        buffer = '';

                        if (!stream.destroyed) {
                            stream.write(chalk.yellow('\r\n> '));
                        }

                        continue;
                    }

                    if (char === '\x7f' || char === '\b') {
                        if (buffer.length > 0) {
                            buffer = buffer.slice(0, -1);
                            stream.write('\b \b');
                        }
                        continue;
                    }

                    buffer += char;
                    stream.write(char);
                }
            });
        });
    });
};