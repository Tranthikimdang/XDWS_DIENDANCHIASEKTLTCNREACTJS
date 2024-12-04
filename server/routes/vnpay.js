// routes/vnpay.js

const config = require('config');
const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');
const crypto = require('crypto');
const qs = require('qs');

// Retrieve configurations
const tmnCode = config.get('VNP_TMN_CODE');
const secretKey = config.get('VNP_HASH_SECRET');
const vnpUrl = config.get('VNP_URL');
const vnpApi = config.get('VNP_API');
const returnUrl = config.get('VNP_RETURN_URL');

// Utility function to sort object keys
function sortObject(obj) {
    let sorted = {};
    let keys = Object.keys(obj).sort();
    keys.forEach(key => {
        sorted[key] = obj[key];
    });
    return sorted;
}

// Render Order List
router.get('/', (req, res) => {
    res.render('orderlist', { title: 'Danh sách đơn hàng' });
});

// Render Create Payment Page
router.get('/create_payment_url', (req, res) => {
    res.render('order', { title: 'Tạo mới đơn hàng', amount: 10000 });
});

// Render Query Result Page
router.get('/querydr', (req, res) => {
    res.render('querydr', { title: 'Truy vấn kết quả thanh toán' });
});

// Render Refund Page
router.get('/refund', (req, res) => {
    res.render('refund', { title: 'Hoàn tiền giao dịch thanh toán' });
});

// Create VNPay Payment URL
router.post('/create_payment_url', (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    const tmnCode = config.get('vnp_TmnCode');
    const secretKey = config.get('vnp_HashSecret');
    const vnpUrl = config.get('vnp_Url');
    const returnUrl = config.get('vnp_ReturnUrl');
    const orderId = moment(date).format('DDHHmmss');
    const amount = req.body.amount;
    const bankCode = req.body.bankCode || '';

    const locale = req.body.language || 'vn';
    const currCode = 'VND';
    let vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': tmnCode,
        'vnp_Locale': locale,
        'vnp_CurrCode': currCode,
        'vnp_TxnRef': orderId,
        'vnp_OrderInfo': `Thanh toan cho ma GD: ${orderId}`,
        'vnp_OrderType': 'other',
        'vnp_Amount': amount * 100,
        'vnp_ReturnUrl': returnUrl,
        'vnp_IpAddr': ipAddr,
        'vnp_CreateDate': createDate
    };

    if (bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = `${vnpUrl}?${qs.stringify(vnp_Params, { encode: false })}`;
    res.json({ url: paymentUrl });
});

// Handle VNPay Return
router.get('/vnpay_return', (req, res) => {
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const secretKey = config.get('vnp_HashSecret');
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        // TODO: Verify order details in the database
        res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
    } else {
        res.render('success', { code: '97' });
    }
});

// Handle VNPay IPN
router.get('/vnpay_ipn', (req, res) => {
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    const orderId = vnp_Params['vnp_TxnRef'];
    const rspCode = vnp_Params['vnp_ResponseCode'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const secretKey = config.get('vnp_HashSecret');
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    // TODO: Fetch order from database using orderId
    const checkOrderId = true; // Replace with actual check
    const checkAmount = true; // Replace with actual check
    let paymentStatus = '0'; // Initial status

    if (secureHash === signed) {
        if (checkOrderId) {
            if (checkAmount) {
                if (paymentStatus === "0") {
                    if (rspCode === "00") {
                        // Payment successful
                        // TODO: Update order status in the database
                        res.status(200).json({ RspCode: '00', Message: 'Success' });
                    } else {
                        // Payment failed
                        // TODO: Update order status in the database
                        res.status(200).json({ RspCode: '00', Message: 'Success' });
                    }
                } else {
                    res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status' });
                }
            } else {
                res.status(200).json({ RspCode: '04', Message: 'Amount invalid' });
            }
        } else {
            res.status(200).json({ RspCode: '01', Message: 'Order not found' });
        }
    } else {
        res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
});

// Query VNPay Transaction Result
router.post('/querydr', (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();

    const tmnCode = config.get('vnp_TmnCode');
    const secretKey = config.get('vnp_HashSecret');
    const vnp_Api = config.get('vnp_Api');

    const vnp_TxnRef = req.body.orderId;
    const vnp_TransactionDate = req.body.transDate;

    const vnp_RequestId = moment(date).format('HHmmss');
    const vnp_Version = '2.1.0';
    const vnp_Command = 'querydr';
    const vnp_OrderInfo = `Truy van GD ma: ${vnp_TxnRef}`;

    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const currCode = 'VND';
    const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

    const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${tmnCode}|${vnp_TxnRef}|${vnp_TransactionDate}|${vnp_CreateDate}|${ipAddr}|${vnp_OrderInfo}`;
    const hmac = crypto.createHmac("sha512", secretKey);
    const vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest("hex");

    const dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': tmnCode,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_TransactionDate': vnp_TransactionDate,
        'vnp_CreateDate': vnp_CreateDate,
        'vnp_IpAddr': ipAddr,
        'vnp_SecureHash': vnp_SecureHash
    };

    request({
        url: vnp_Api,
        method: "POST",
        json: true,
        body: dataObj
    }, (error, response, body) => {
        console.log(response);
        res.json(body);
    });
});

// Refund VNPay Transaction
router.post('/refund', (req, res) => {
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();

    const tmnCode = config.get('vnp_TmnCode');
    const secretKey = config.get('vnp_HashSecret');
    const vnp_Api = config.get('vnp_Api');

    const vnp_TxnRef = req.body.orderId;
    const vnp_TransactionDate = req.body.transDate;
    const vnp_Amount = req.body.amount * 100;
    const vnp_TransactionType = req.body.transType;
    const vnp_CreateBy = req.body.user;

    const currCode = 'VND';
    const vnp_RequestId = moment(date).format('HHmmss');
    const vnp_Version = '2.1.0';
    const vnp_Command = 'refund';
    const vnp_OrderInfo = `Hoan tien GD ma: ${vnp_TxnRef}`;

    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');
    const vnp_TransactionNo = '0';

    const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${tmnCode}|${vnp_TransactionType}|${vnp_TxnRef}|${vnp_Amount}|${vnp_TransactionNo}|${vnp_TransactionDate}|${vnp_CreateBy}|${vnp_CreateDate}|${ipAddr}|${vnp_OrderInfo}`;
    const hmac = crypto.createHmac("sha512", secretKey);
    const vnp_SecureHash = hmac.update(Buffer.from(data, 'utf-8')).digest("hex");

    const dataObj = {
        'vnp_RequestId': vnp_RequestId,
        'vnp_Version': vnp_Version,
        'vnp_Command': vnp_Command,
        'vnp_TmnCode': tmnCode,
        'vnp_TransactionType': vnp_TransactionType,
        'vnp_TxnRef': vnp_TxnRef,
        'vnp_Amount': vnp_Amount,
        'vnp_TransactionNo': vnp_TransactionNo,
        'vnp_CreateBy': vnp_CreateBy,
        'vnp_OrderInfo': vnp_OrderInfo,
        'vnp_TransactionDate': vnp_TransactionDate,
        'vnp_CreateDate': vnp_CreateDate,
        'vnp_IpAddr': ipAddr,
        'vnp_SecureHash': vnp_SecureHash
    };

    request({
        url: vnp_Api,
        method: "POST",
        json: true,
        body: dataObj
    }, (error, response, body) => {
        console.log(response);
        res.json(body);
    });
});

module.exports = router;