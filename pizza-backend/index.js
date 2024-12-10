const config = require('./config.json');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const WebSocket = require('ws');

const app = express();
app.set('trust proxy', true);
app.use(cors());
app.use(bodyParser.json());


const rune = config.rune;
const LNREST_URL = config.LNREST_URL; // Update with Core Lightning REST URL

// Generate a Lightning Invoice
app.post('/api/create-invoice', async (req, res) => {
    const { amount, description } = req.body;
    try {
        const response = await axios.post(`${LNREST_URL}/v1/invoice`, {
            amount_msat: amount * 1000, // Convert satoshis to msats
            label: `pizza-${Date.now()}`,
            description,
            expiry: 3600
        }, {
            headers: {
                'Rune': rune
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error("Error creating invoice:", error.message);
        res.status(500).json({ error: "Failed to create invoice" });
    }
});

// WebSocket for listening to invoice updates
const wss = new WebSocket.Server({ port: 8080 });
wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    ws.on('message', (message) => {
        console.log('Received:', message);
    });
});
app.listen(3008, () => console.log("Backend running on port 3008"));
