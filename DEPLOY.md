# راهنمای استقرار منچ آنلاین

## روش ۱: Render.com (ساده‌ترین و رایگان)

### مرحله ۱: ساخت اکانت
1. به [render.com](https://render.com) بروید
2. با GitHub یا ایمیل ثبت‌نام کنید

### مرحله ۲: آپلود پروژه روی GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ludo-online.git
git push -u origin main
```

### مرحله ۳: استقرار روی Render
1. در داشبورد Render روی **New +** کلیک کنید
2. **Web Service** را انتخاب کنید
3. اکانت GitHub خود را متصل کنید
4. ریپازیتوری `ludo-online` را انتخاب کنید
5. تنظیمات:
   - **Name**: ludo-online (یا هر نام دلخواه)
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free
6. روی **Create Web Service** کلیک کنید

### مرحله ۴: دریافت لینک
Render یک لینک مثل این می‌دهد:
```
https://ludo-online-xxx.onrender.com
```

این لینک را برای دوستتان بفرستید و بازی کنید!

---

## روش ۲: Railway.app

1. به [railway.app](https://railway.app) بروید
2. ثبت‌نام کنید
3. روی **New Project** کلیک کنید
4. **Deploy from GitHub repo** را انتخاب کنید
5. ریپازیتوری را انتخاب کنید
6. Railway خودکار شناسایی می‌کند و استقرار می‌دهد

---

## روش ۳: Docker (روی VPS یا کامپیوتر شخصی)

### ساخت ایمیج Docker:
```bash
cd ludo-game
docker build -t ludo-online .
```

### اجرا:
```bash
docker run -p 3000:3000 -e JWT_SECRET=your-secret-key ludo-online
```

---

## روش ۴: اجرای مستقیم روی سرور VPS

```bash
# نصب Node.js
sudo apt update
sudo apt install -y nodejs npm

# کپی پروژه
scp -r ludo-game user@your-server-ip:/home/user/

# اجرا
ssh user@your-server-ip
cd /home/user/ludo-game
npm install
JWT_SECRET=your-secret-key node server.js
```

---

## نکات مهم

### 🔐 امنیت
- در Render، JWT_SECRET به‌صورت خودکار تولید می‌شود
- در Railway و VPS، حتماً یک کلید قوی برای JWT_SECRET تنظیم کنید:
  ```bash
  openssl rand -base64 32
  ```

### 🌐 WebSocket
- Render از WebSocket پشتیبانی می‌کند
- Railway هم پشتیبانی می‌کند
- اگر از Nginx استفاده می‌کنید، تنظیمات WebSocket را اضافه کنید:
  ```nginx
  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
  ```

### 💾 دیتابیس
- فعالاً از JSON file استفاده می‌شود
- برای Production، SQLite یا MongoDB توصیه می‌شود
- در Render، دیسک persist می‌شود

### 🎙️ Voice Chat
- نیاز به HTTPS دارد (Render خودکار HTTPS می‌دهد)
- ممکن است نیاز به TURN server داشته باشد
- برای تست داخلی کار می‌کند

---

## لینک نمونه پس از استقرار
```
https://ludo-online-abc123.onrender.com
```

با این لینک، دو نفر از هر جای دنیا می‌توانند بازی کنند!
