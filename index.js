const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

const SETTINGS = {
    host: 'ns566750.seedloaf.com',
    port1: 29292,
    port2: 49303,
    username: 'AFK_Bot',
    auth: 'offline'
};

let currentPort = SETTINGS.port1;

// Web Server for Render
const PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bypass Active'));
app.listen(PORT);

function startBot() {
    console.log(`Connecting to ${SETTINGS.host}:${currentPort}...`);
    
    const bot = mineflayer.createBot({
        host: SETTINGS.host,
        port: currentPort,
        username: SETTINGS.username,
        auth: SETTINGS.auth,

        // --- THE VERSION BYPASS ---
        // We force '1.21' because 26.1.1 is built on the 1.21 protocol.
        // This stops the "Unsupported Version" crash.
        version: '1.21', 
        checkTimeoutInterval: 60000 
        // --------------------------
    });

    bot.on('spawn', () => {
        console.log(`✅ Success! Bot bypassed check on port ${currentPort}`);
        setInterval(() => {
            if (bot.entity) bot.look(bot.entity.yaw + 0.1, 0);
        }, 15000);
    });

    bot.on('end', (reason) => {
        console.log(`❌ Disconnected: ${reason}`);
        currentPort = (currentPort === SETTINGS.port1) ? SETTINGS.port2 : SETTINGS.port1;
        setTimeout(startBot, 10000);
    });

    bot.on('error', (err) => console.log('Bypass Log:', err.message));
}

startBot();