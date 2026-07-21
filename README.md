# บ้านตะวัน ผับระยอง — เว็บเมนูอาหาร

เว็บ Landing Page แสดงเมนูอาหารแบบ Static (HTML + CSS + JS ล้วน ไม่มี Backend)
รองรับการค้นหาเมนู, กรองตามหมวดหมู่, ดูรูปเมนูขยายใหญ่ และ Responsive ทุกขนาดหน้าจอ

## โครงสร้างไฟล์

```
baan-tawan-rayong/
├── index.html            หน้าเว็บหลัก (โครงหน้า + SEO meta)
├── css/
│   └── style.css         สไตล์ทั้งหมด (ธีม, responsive, การ์ดเมนู, modal)
├── js/
│   ├── data.js           ★ ข้อมูลเมนู/หมวดหมู่ — แก้ตรงนี้เวลาจะเพิ่ม-ลบเมนู
│   └── main.js           ตรรกะ: render เมนู, ค้นหา, กรองหมวด, modal ดูรูป
├── images/
│   └── menu/              วางไฟล์รูปเมนูจริงไว้ในโฟลเดอร์นี้
└── README.md
```

## วิธีเพิ่ม/แก้ไขเมนู

เปิดไฟล์ `js/data.js` แล้วเพิ่มอ็อบเจกต์ใหม่ในอาเรย์ `MENU_ITEMS` เช่น

```js
{
  id: "somtum-thai",
  category: "yumtumlarb",   // ต้องตรงกับ id ใน MENU_CATEGORIES
  name: "ส้มตำไทย",
  price: 120,
  spicy: true,               // ใส่ true ถ้าต้องการโชว์ป้าย "เผ็ด" (ไม่ใส่ก็ได้)
  img: "images/menu/somtum-thai.jpg",
}
```

ถ้าต้องการเพิ่มหมวดหมู่ใหม่ ให้เพิ่มใน `MENU_CATEGORIES` ก่อน แล้วค่อยอ้างอิง `category` ในเมนู

## วิธีใส่รูปเมนู

1. เตรียมรูปภาพ (แนะนำอัตราส่วน 4:3 เช่น 800x600px ไฟล์ .jpg หรือ .webp ขนาดไม่เกิน ~300KB เพื่อความเร็ว)
2. นำไฟล์ไปวางไว้ที่โฟลเดอร์ `images/menu/`
3. ตั้งชื่อไฟล์ให้ตรงกับค่า `img` ที่ระบุไว้ในเมนูนั้นใน `js/data.js`
4. ถ้ายังไม่มีรูป ระบบจะแสดงกรอบ "ใส่รูปที่นี่" ให้อัตโนมัติ ไม่ต้องแก้โค้ดอะไรเพิ่ม — พอวางไฟล์รูปตามชื่อที่กำหนดไว้ รูปจะขึ้นเองทันที

## รันดูบนเครื่องตัวเอง

ไม่ต้องติดตั้งอะไรเพิ่ม เปิดไฟล์ `index.html` ด้วยเบราว์เซอร์ได้เลย
หรือถ้าต้องการรันผ่าน local server (แนะนำ เพื่อให้ path รูปภาพทำงานถูกต้องทุกกรณี):

```bash
# ใช้ Python (มีมาให้ในเครื่องส่วนใหญ่)
python3 -m http.server 5500
# แล้วเปิด http://localhost:5500
```

## Deploy ขึ้น GitHub

```bash
cd baan-tawan-rayong
git init
git add .
git commit -m "Initial commit: baan tawan rayong menu website"
git branch -M main
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

## Deploy ขึ้น Vercel

**วิธีที่ 1 — ผ่านเว็บ Vercel (ง่ายสุด)**
1. เข้า https://vercel.com แล้ว Login ด้วยบัญชี GitHub
2. กด **Add New → Project**
3. เลือก Repository ที่เพิ่ง push ขึ้นไป
4. Framework Preset เลือก **Other** (เพราะเป็น Static HTML ธรรมดา ไม่ต้อง build)
5. Root Directory ปล่อยเป็นค่าเริ่มต้น, Build Command ปล่อยว่าง, Output Directory ปล่อยว่าง
6. กด **Deploy** รอสักครู่ก็จะได้ลิงก์ เช่น `https://baan-tawan-rayong.vercel.app`

**วิธีที่ 2 — ผ่าน Vercel CLI**
```bash
npm i -g vercel
cd baan-tawan-rayong
vercel        # ครั้งแรกจะถามตั้งค่าโปรเจกต์ ตอบตามค่าเริ่มต้นได้เลย
vercel --prod # deploy ขึ้น production
```

จากนี้ไปทุกครั้งที่ `git push` ขึ้น branch `main`, Vercel จะ deploy เวอร์ชันใหม่ให้อัตโนมัติ

## หมายเหตุ

- ข้อมูลร้าน (ชื่อ, เวลาเปิด-ปิด, ที่อยู่) อยู่ใน `index.html` ส่วน `<header class="hero">` และ `<footer>` แก้ตรงนี้ได้โดยตรงถ้าข้อมูลเปลี่ยน
- ลิงก์แผนที่ Google Maps ในหน้า Footer ใช้ที่อยู่ร้านค้นหาอัตโนมัติ ถ้าต้องการปักหมุดตำแหน่งจริงแม่นยำขึ้น แนะนำเปลี่ยนเป็นลิงก์ที่ก็อปมาจาก Google Maps โดยตรง (แชร์ตำแหน่ง → คัดลอกลิงก์)