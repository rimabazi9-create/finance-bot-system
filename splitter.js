// سكريبت بسيط لتقسيم المبلغ بين الطرفين
function calculateSettlement(totalAmount, receiverPercentage) {
    const receiverShare = (totalAmount * receiverPercentage) / 100;
    const senderShare = totalAmount - receiverShare;

    return {
        totalAmount: totalAmount,
        receiverShare: receiverShare,
        senderShare: senderShare,
        currency: "USD"
    };
}

// مثال للاستخدام (يمكنكِ ربط هذه القيم بحقول الإدخال في الواجهة الخاصة بكِ)
const total = 1000000; // المبلغ الكلي
const receiverRate = 60; // نسبة المستقبل التي أدخلتها في النظام

const result = calculateSettlement(total, receiverRate);

console.log("--- تفاصيل التحويل ---");
console.log(`المبلغ الكلي: ${result.totalAmount} ${result.currency}`);
console.log(`حصة المستقبل (${receiverRate}%): ${result.receiverShare} ${result.currency}`);
console.log(`حصة المرسل (${100 - receiverRate}%): ${result.senderShare} ${result.currency}`);
