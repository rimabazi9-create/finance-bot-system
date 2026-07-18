const express = require('express');
const path = require('path');
const fs = require('fs'); // Import File System module
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const ADMIN_USER = "admin";
const ADMIN_PASS = "123456";

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === ADMIN_USER && password === ADMIN_PASS) {
        res.json({ status: "Success" });
    } else {
        res.json({ status: "Error", message: "Invalid credentials" });
    }
});

app.post('/process-transaction', (req, res) => {
    const { totalAmount, receiverRate, approvalCode, receiverAddress } = req.body;
    
    if (approvalCode !== "407388") {
        return res.json({ status: "Error", message: "Invalid Approval Code" });
    }

    const receiverShare = (totalAmount * receiverRate) / 100;
    
    // Create a log entry
    const logEntry = `Date: ${new Date().toISOString()} | Amount: ${totalAmount} | Receiver: ${receiverAddress} | Share: ${receiverShare}\n`;
    
    // Append to transactions.log file
    fs.appendFile('transactions.log', logEntry, (err) => {
        if (err) console.log("Failed to save log");
    });

    res.json({ status: "Success", details: { receiverShare, message: "Transaction successful and saved" } });
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
