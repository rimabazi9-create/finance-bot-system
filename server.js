const express = require('express');
const path = require('path');
const TronWeb = require('tronweb');

const app = express();
app.use(express.json());
// للسماح للسيرفر بتقديم ملفات HTML و CSS
app.use(express.static(__dirname));

// إعداد الاتصال بشبكة Shasta
const tronWeb = new TronWeb({
    fullHost: 'https://api.shasta.trongrid.io',
    headers: { 'TRON-PRO-API-KEY': 'ضعي_مفتاح_API_الخاص_بك_هنا' }
});

// المسار الرئيسي لفتح الواجهة
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// مسار تسجيل الدخول
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // يمكنك تعديل اسم المستخدم وكلمة المرور هنا
    if (username === "admin" && password === "1234") {
        res.json({ status: "Success" });
    } else {
        res.json({ status: "Error", message: "بيانات الدخول غير صحيحة" });
    }
});

// مسار معالجة المعاملة
app.post('/process-transaction', async (req, res) => {
    const { totalAmount, receiverAddress, approvalCode } = req.body;
    
    try {
        console.log("جاري معالجة معاملة بقيمة:", totalAmount);
        
        // هنا يمكنك إضافة كود الربط الفعلي مع البلوكشين لاحقاً
        // حالياً سنعيد نجاح العملية للتأكد من ربط الواجهة
        res.json({ status: "Success" });
    } catch (error) {
        res.json({ status: "Error", message: error.message });
    }
});// مسار معالجة المعاملة المحدث
app.post('/process-transaction', async (req, res) => {
    const { totalAmount, receiverAddress, approvalCode } = req.body;
    
    // التحقق البسيط من البيانات
    if (!totalAmount || !receiverAddress || !approvalCode) {
        return res.json({ status: "Error", message: "يرجى ملء جميع الحقول" });
    }

    console.log("تفاصيل العملية الواردة:");
    console.log("المبلغ:", totalAmount);
    console.log("العنوان:", receiverAddress);
    console.log("كود الموافقة:", approvalCode);
    
    // هنا سيقوم النظام لاحقاً بالاتصال بـ TronWeb لإتمام التحويل
    res.json({ status: "Success" });
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Broker System is Live on port ${port}`));
