    const { Server } = require('ssh2');
    const fs = require('fs');
    const path = require('path');
    const readyHandler = require('./modules/ready');

    new Server(
        {
            hostKeys: [fs.readFileSync(path.join(__dirname, 'keys', 'private.pem'))]
        },
        (client) => {
            client.on('authentication', (ctx) => {
                client.username = ctx.username || 'there!';
                ctx.accept();
            });

            client.on('ready', () => {
                readyHandler(client);
            });
            client.on('close', () => {
                console.log('Client disconnected');
            });

            client.on('error', console.error);
        }
    ).listen(2222, '0.0.0.0', () => {
        console.log('Listening on port 2222');
    });