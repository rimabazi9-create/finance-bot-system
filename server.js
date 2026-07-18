const express = require('express');
const path = require('path');
const TronWeb = require('tronweb');
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io',
    headers: { 'TRON-PRO-API-KEY': 'YOUR_API_KEY_HERE' } // ضعي مفتاحك هنا
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "1234") {
        res.json({ status: "Success" });
    } else {
        res.json({ status: "Error", message: "بيانات الدخول خاطئة" });
    }
});

app.post('/process-transaction', async (req, res) => {
    const { totalAmount, receiverAddress, approvalCode } = req.body;
    
    if (approvalCode !== "9176") {
        return res.json({ status: "Error", message: "كود الموافقة غير صحيح" });
    }

    try {
        const amountInSun = totalAmount * 1000000;
        const transaction = await tronWeb.transactionBuilder.sendTrx(receiverAddress, amountInSun);
        const signedTx = await tronWeb.trx.sign(transaction, process.env.PRIVATE_KEY);
        const receipt = await tronWeb.trx.sendRawTransaction(signedTx);
        
        res.json({ status: "Success", txid: receipt.txid });
    } catch (error) {
        res.json({ status: "Error", message: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Broker System is Live on port ${port}`));
