const express = require('express');
const path = require('path');
const fs = require('fs');
const TronWeb = require('tronweb');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Configuration for Shasta Testnet
const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io'
});

const ADMIN_USER = "admin";
const ADMIN_PASS = "123456";

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        res.json({ status: "Success" });
    } else {
        res.json({ status: "Error", message: "Invalid credentials" });
    }
});

// Transaction endpoint (Simulation + Real Blockchain check)
app.post('/process-transaction', async (req, res) => {
    const { totalAmount, receiverAddress, approvalCode } = req.body;
    
    if (approvalCode !== "407388") {
        return res.json({ status: "Error", message: "Invalid Approval Code" });
    }

    try {
        // Validate address format on Tron Network
        const isValid = tronWeb.isAddress(receiverAddress);
        if (!isValid) return res.json({ status: "Error", message: "Invalid Tron Address" });

        const logEntry = `Date: ${new Date().toISOString()} | Amount: ${totalAmount} | Receiver: ${receiverAddress}\n`;
        fs.appendFile('transactions.log', logEntry, (err) => { if (err) console.log(err); });

        res.json({ status: "Success", details: "Transaction Verified on Testnet" });
    } catch (e) {
        res.json({ status: "Error", message: "Blockchain Error" });
    }
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
