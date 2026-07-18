const express = require('express');
const path = require('path'); // نحتاج هذه المكتبة لتحديد مسار الملفات
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// لجعل السيرفر يقرأ ملف الـ index.html من نفس المجلد
app.use(express.static(__dirname));

// عند زيارة الرابط الرئيسي يفتح الـ index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// مسار معالجة البيانات
app.post('/process-transaction', (req, res) => {
    const { totalAmount, receiverRate, approvalCode } = req.body;
    
    // كود الموافقة المعتمد
    if (approvalCode !== "407388") {
        return res.json({ status: "Error", message: "كود الموافقة غير صحيح" });
    }

    const receiverShare = (totalAmount * receiverRate) / 100;
    res.json({ status: "Success", receiverShare: receiverShare });
});

app.listen(port, () => {
    console.log(`السيرفر يعمل على المنفذ: ${port}`);
});
