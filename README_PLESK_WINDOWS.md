# คู่มือการติดตั้งและใช้งานระบบบน Plesk Control Panel (Windows Server)

ระบบแผนปฏิบัติการประจำปีและจัดสรรงบประมาณโรงเรียน (ฉบับ Node.js 100% Full-Stack)

---

## 📌 ข้อมูลสถาปัตยกรรมระบบ (100% Pure Node.js)
- **Backend:** Node.js (Express) + TypeScript + `@google/genai` SDK
- **Frontend:** React 19 + TypeScript + Tailwind CSS (Vite Engine)
- **Web Server:** Microsoft IIS + iisnode module (ผ่าน Plesk Node.js Extension)
- **Database Storage:** Local JSON Storage / MySQL Server รองรับการเชื่อมต่อแบบ Multi-Tenant
- **ตัดส่วนที่ไม่จำเป็นออกทั้งหมด:** ไม่มีโค้ด PHP หรือ Apache `.htaccess` หลงเหลือ ทำงานด้วย Node.js ล้วน 100%

---

## 🛠️ ความต้องการของระบบ (System Requirements)
1. **ระบบปฏิบัติการ:** Windows Server 2016 / 2019 / 2022
2. **Plesk Version:** Plesk Obsidian for Windows
3. **Plesk Components ที่จำเป็น:**
   - **Node.js Extension for Windows**
   - **IIS URL Rewrite Module 2.0+**
   - **iisnode module** (ติดตั้งมาพร้อมกับ Plesk Node.js extension)
4. **Node.js Runtime:** เวอร์ชัน 18.x, 20.x หรือ 22.x (แนะนำ Node.js 20.x LTS)

---

## 🚀 ขั้นตอนการติดตั้งบน Plesk Control Panel (Windows Server)

### ขั้นตอนที่ 1: อัปโหลดไฟล์ขึ้นโฮสติ้ง
1. เข้าสู่ **Plesk Control Panel** ของโดเมนของคุณ
2. ไปที่เมนู **Files (File Manager)**
3. เข้าไปในโฟลเดอร์รากของเว็บไซต์ (โดยปกติคือ `httpdocs/`)
4. อัปโหลดไฟล์ของโปรเจกต์ทั้งหมด หรืออัปโหลดไฟล์ `.zip` ที่ดาวน์โหลดจากระบบแล้วกด **Extract Files**
5. ตรวจสอบว่าใน `httpdocs/` มีไฟล์เหล่านี้อยู่:
   - `web.config` (ไฟล์ตั้งค่า IIS และ iisnode สำคัญมาก ⭐)
   - `server.js` (ไฟล์จุดเริ่มต้นของแอปพลิเคชัน Startup File)
   - `package.json`
   - โฟลเดอร์ `src/`, `config/`, `database/`

---

### ขั้นตอนที่ 2: ตั้งค่า Node.js ใน Plesk
1. ในหน้า **Websites & Domains** ของ Plesk คลิกที่ไอคอน **Node.js**
2. กำหนดค่าต่างๆ ดังนี้:
   - **Node.js Version:** เลือก `20.x.x` หรือ `22.x.x`
   - **Package Manager:** เลือก `npm`
   - **Document Root:** `/httpdocs`
   - **Application Mode:** เลือก **`production`**
   - **Application Root:** `/httpdocs`
   - **Application Startup File:** พิมพ์ **`server.js`**
3. คลิกปุ่ม **Enable Node.js**

---

### ขั้นตอนที่ 3: ติดตั้ง Dependencies และเปิดใช้งานระบบ
1. ในหน้า Node.js ของ Plesk ให้คลิกปุ่ม **NPM Install** (หรือเลือกคำสั่ง **`install`** จากเมนู) เพื่อติดตั้งแพ็กเกจ
   *(ระบบมีไฟล์ `.npmrc` พร้อมค่า `legacy-peer-deps=true` ป้องกันปัญหา ERESOLVE ไว้ให้เรียบร้อยแล้ว หรือหากรันผ่าน Command Line สามารถใช้คำสั่ง: `npm install --legacy-peer-deps`)*
2. **สำคัญมากสำหรับเซิร์ฟเวอร์ที่มี Node.js 18.20.6:**
   - **ไม่ต้องรันคำสั่ง `build` บนเซิร์ฟเวอร์!** เนื่องจากในแพ็กเกจ `.ZIP` มีโฟลเดอร์ `dist/` และไฟล์ `dist/server.cjs` ที่ผ่านการคอมไพล์สำเร็จ 100% บรรจุมาให้พร้อมใช้งานแล้ว
   - การรัน `vite build` บน Node.js 18 จะติดปัญหา `styleText` ซึ่งเป็นข้อจำกัดของ Node.js 18 แต่โฟลเดอร์ `dist/` ที่สร้างไว้แล้วสามารถรันบน Node.js 18.20.6 ได้อย่างราบรื่น 100%
3. ตรวจสอบว่าในโฟลเดอร์ `httpdocs/` มีโฟลเดอร์ `dist/` (ประกอบด้วย `dist/index.html`, `dist/assets/`, `dist/server.cjs`)
4. คลิกปุ่ม **Restart** ในหน้า Plesk Node.js เพื่อเปิดใช้งานเว็บไซต์ทันที!

---

### ขั้นตอนที่ 4: ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)
ในหน้า Node.js ของ Plesk คลิกที่แท็บ **Environment Variables** (หรือสร้างไฟล์ `.env` ใน `httpdocs/`):
- `NODE_ENV` = `production`
- `PORT` = (ไม่ต้องแก้ไข IISNode จะจัดสรร Named Pipe ให้อัตโนมัติ)
- `GEMINI_API_KEY` = `รหัส API Key ของคุณจาก Google AI Studio`

---

### ขั้นตอนที่ 5: ตั้งค่าสิทธิ์โฟลเดอร์ (File Permissions)
โฟลเดอร์ `config/` ใช้บันทึกข้อมูลการตั้งค่าและฐานข้อมูล JSON ต้องให้สิทธิ์ผู้ใช้ IIS เขียนไฟล์ได้:
1. ใน Plesk File Manager ให้คลิกที่ไอคอนแม่กุญแจ / ฟันเฟืองข้างโฟลเดอร์ `config`
2. เลือก **Permissions**
3. เพิ่มสิทธิ์ **Modify / Full Control** ให้กับผู้ใช้:
   - `IIS_IUSRS` (กลุ่มผู้ใช้ IIS)
   - หรือ Application Pool User ของโดเมนคุณ

---

### ขั้นตอนที่ 6: รีสตาร์ตและเริ่มใช้งาน
1. คลิกปุ่ม **Restart Application** ในหน้า Node.js
2. เปิดเบราว์เซอร์แล้วเข้าชื่อโดเมนของโรงเรียน เช่น `https://your-school-domain.com`
3. ระบบจะแสดงหน้าล็อกอินของระบบแผนปฏิบัติการประจำปีทันที!

---

## 🔍 การตรวจสอบข้อผิดพลาด (Troubleshooting on Windows Server)

### 1. หน้าเว็บขึ้น "500 - Internal Server Error" หรือ "HTTP Error 500.19"
- **สาเหตุ:** ขาดโมดูล **IIS URL Rewrite** หรือ `web.config` มีไวยากรณ์ไม่ถูกต้อง
- **วิธีแก้:** ตรวจสอบว่าเซิร์ฟเวอร์ Windows ได้ติดตั้ง **IIS URL Rewrite Module 2.1** เรียบร้อยแล้ว (สามารถติดตั้งผ่าน Web Platform Installer หรือดาวน์โหลดจาก Microsoft)

### 2. ดู Log การทำงานของ Node.js (iisnode Logs)
- เมื่อเกิด Error เบื้องหลัง IISNode จะบันทึก Log ไว้ที่โฟลเดอร์:
  `httpdocs/iisnode/`
- สามารถเปิดไฟล์ `.txt` ในโฟลเดอร์ดังกล่าวเพื่อดู Error Trace ได้อย่างละเอียด

### 3. กรณี AI Project Writer ใช้งานไม่ได้
- ตรวจสอบว่าได้ตั้งค่า `GEMINI_API_KEY` ใน Environment Variables ของ Plesk หรือในไฟล์ `.env` แล้วหรือไม่
- รหัส API Key รับฟรีได้ที่ [Google AI Studio](https://aistudio.google.com/app/apikey)
