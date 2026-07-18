const express = require('express');
const TronWeb = require('tronweb');
const app = express();
app.use(express.json());

// إعداد الاتصال بشبكة Shasta الحقيقية
const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io',
    headers: { 'TRON-PRO-API-KEY': 'ضعي_مفتاح_API_الخاص_بك_هنا' } // ضعي مفتاحك من TronGrid
});

// عملية تحويل تجريبية حقيقية
app.post('/transfer', async (req, res) => {
    const { toAddress, amount } = req.body;
    try {
        // إنشاء المعاملة
        const transaction = await tronWeb.transactionBuilder.sendTrx(toAddress, amount * 1000000);
        // توقيع المعاملة (يتطلب وجود المفتاح الخاص في ملف الأمان)
        const signedTx = await tronWeb.trx.sign(transaction, process.env.PRIVATE_KEY);
        // إرسال المعاملة إلى البلوكشين
        const receipt = await tronWeb.trx.sendRawTransaction(signedTx);
        
        res.json({ status: "Success", txid: receipt.txid });
    } catch (error) {
        res.json({ status: "Error", message: error.message });
    }
});

app.listen(3000, () => console.log('Broker System is Live on Shasta Testnet'));
