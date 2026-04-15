const mineflayer = require('mineflayer');
const express = require('express');
const app = express();

// --- CONFIGURATION ---
const SERVER_IP = 'ns566750.seedloaf.com'; // <--- CHANGE THIS
const PORT_A = 29292;               // Primary Port
const PORT_B = 49303;               // Backup Port
const BOT_NAME = 'AFK_Bot';

// --- WEB SERVER (For Render/Uptime) ---
const WEB_PORT = process.env.PORT || 10000;
app.get('/', (req, res) => res.send('Bot system is online.'));
app.listen(WEB_PORT, () => console.log(`Web monitor live on port ${WEB_PORT}`));

// --- BOT LOGIC ---
function createBot(currentPort) {
    console.log(`Attempting to join ${SERVER_IP} on port ${currentPort}...`);

    const bot = mineflayer.createBot({
        host: SERVER_IP,
        port: currentPort,
        username: BOT_NAME,
        auth: 'offline' // Change to 'microsoft' for Premium servers
    });

    // Success
    bot.on('spawn', () => {
        console.log(`✅ Success! Bot is online on port ${currentPort}`);
    });

    // Failure / Kick
    bot.on('end', (reason) => {
        console.log(`❌ Connection ended: ${reason}`);
        
        // If it failed to connect to Port A, try Port B. 
        // If it was already on Port B, go back to Port A.
        const nextPort = (currentPort === PORT_A) ? PORT_B : PORT_A;
        
        console.log(`Switching to port ${nextPort} in 10 seconds...`);
        setTimeout(() => createBot(nextPort), 10000);
    });

    // Anti-AFK (Head movement)
    setInterval(() => {
        if (bot.entity) {
            bot.look(bot.entity.yaw + 0.5, 0);
        }
    }, 20000);

    bot.on('error', (err) => {
        if (err.code === 'ECONNREFUSED') {
            console.log(`⚠️ Port ${currentPort} refused connection.`);
        } else {
            console.log(`⚠️ Error: ${err.message}`);
        }
    });
}

// Start with the primary port
createBot(PORT_A);