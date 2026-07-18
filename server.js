const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Credentials (You can change these for higher security)
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

// Transaction endpoint
app.post('/process-transaction', (req, res) => {
    const { totalAmount, receiverRate, approvalCode } = req.body;
    if (approvalCode !== "407388") {
        return res.json({ status: "Error", message: "Invalid Approval Code" });
    }
    const receiverShare = (totalAmount * receiverRate) / 100;
    res.json({ status: "Success", details: { receiverShare, message: "Transaction successful" } });
});

app.listen(port, () => console.log(`Server running on port: ${port}`));
