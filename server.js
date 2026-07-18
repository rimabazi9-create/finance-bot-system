const express = require('express');
const path = require('path');
const TronWeb = require('tronweb');

const app = express();
app.use(express.json());
app.use(express.static(__dirname)); // للسماح للسيرفر بقراءة ملفات CSS أو JS الملحقة بـ index.html

// إعداد الاتصال بشبكة Shasta الحقيقية
const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io',
    headers: { 'TRON-PRO-API-KEY': 'ضعي_مفتاح_API_الخاص_بك_هنا' } // ضعي مفتاحك من TronGrid
});

// المسار الرئيسي: يعرض واجهة النظام (index.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// مسار معالجة التحويلات المالية
app.post('/transfer', async (req, res) => {
    const { toAddress, amount } = req.body;
    try {
        // إنشاء المعاملة
        const transaction = await tronWeb.transactionBuilder.sendTrx(toAddress, amount * 1000000);
        
        // توقيع المعاملة باستخدام المفتاح السري الموجود في إعدادات Render
        const signedTx = await tronWeb.trx.sign(transaction, process.env.PRIVATE_KEY);
        
        // إرسال المعاملة إلى البلوكشين
        const receipt = await tronWeb.trx.sendRawTransaction(signedTx);
        
        res.json({ status: "Success", txid: receipt.txid });
    } catch (error) {
        res.json({ status: "Error", message: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Broker System is Live on port ${port}`));
