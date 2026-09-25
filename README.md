# 🎮 منچ آنلاین دو نفره (Online 2-Player Ludo)

## راه‌اندازی سریع

```bash
# ۱. نصب وابستگی‌ها
npm install

# ۲. اجرای سرور
npm start

# ۳. باز کردن در مرورگر
http://localhost:3000
```

## ویژگی‌ها
- ثبت‌نام و ورود امن با هش رمز عبور (PBKDF2)
- لابی آنلاین با کد اتق
- بازی Real-Time با WebSocket
- تاس تصادفی سمت سرور (ضد تقلب)
- چت فارسی Real-Time با Rate Limiting
- واکنش‌های ایموجی با انیمیشن
- Voice Chat با WebRTC
- طراحی RTL و Responsive برای موبایل و دسکتاپ
- ذخیره‌سازی JSON (قابل ارتقا به SQLite/MongoDB)

## امنیت
- PBKDF2 Password Hashing
- JWT Token با امضای HMAC-SHA256
- اعتبارسنجی حرکات سمت سرور
- Rate Limiting چت (۵ پیام در دقیقه)
- تاس فقط توسط سرور تولید می‌شود
- هیچ اطلاعات حساسی در سمت کلاینت ذخیره نمی‌شود

## ساختار پروژه
```
ludo-game/
├── package.json
├── server.js
├── config.js
├── README.md
├── database/
│   ├── index.js
│   └── data.json (خودکار ساخته می‌شود)
├── middleware/
│   └── auth.js
├── utils/
│   ├── helpers.js
│   └── security.js
├── routes/
│   ├── auth.js
│   ├── game.js
│   └── user.js
├── game/
│   └── logic.js
├── websocket/
│   └── index.js
└── public/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── app.js
```

## نکات Production
- حتماً `JWT_SECRET` را در متغیر محیطی تنظیم کنید
- از دیتابیس SQLite/PostgreSQL استفاده کنید
- سرور STUN/TURN برای Voice Chat اضافه کنید
- از HTTPS استفاده کنید
- Rate Limiting را برای API هم اضافه کنید
