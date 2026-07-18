const express = require('express');
const path = require('path');
const TronWeb = require('tronweb');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// إعداد الاتصال بشبكة Shasta
const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io',
    headers: { 'TRON-PRO-API-KEY': 'ضعي_مفتاح_API_الخاص_بك_هنا' }
});

// 1. المسار الرئيسي
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. مسار تسجيل الدخول
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "1234") {
        res.json({ status: "Success" });
    } else {
        res.json({ status: "Error", message: "بيانات الدخول غير صحيحة" });
    }
});

// 3. مسار معالجة التحويل المالي الحقيقي
app.post('/process-transaction', async (req, res) => {
    const { totalAmount, receiverAddress, approvalCode } = req.body;
    
    // التحقق من كود الموافقة قبل تنفيذ أي شيء
    if (approvalCode !== "mysecretcode") {
        return res.json({ status: "Error", message: "كود الموافقة غير صحيح" });
    }

    try {
        // تحويل المبلغ إلى وحدة Sun (التي يتعامل بها البلوكشين)
        const amountInSun = totalAmount * 1000000;
        
        // إنشاء المعاملة
        const transaction = await tronWeb.transactionBuilder.sendTrx(
            receiverAddress,
            amountInSun
        );
        
        // توقيع المعاملة باستخدام المفتاح الخاص المخزن في إعدادات Render
        const signedTx = await tronWeb.trx.sign(transaction, process.env.PRIVATE_KEY);
        
        // إرسال المعاملة إلى الشبكة
        const receipt = await tronWeb.trx.sendRawTransaction(signedTx);
        
        console.log("تمت المعاملة بنجاح، رقم التعريف:", receipt.txid);
        res.json({ status: "Success", txid: receipt.txid });
        
    } catch (error) {
        res.json({ status: "Error", message: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Broker System is Live on port ${port}`));
