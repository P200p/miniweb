# ระบบเพจสมัคร/ธีมสำเร็จรูปสำหรับแบรนด์ (Ready-made Signup Page System)

## แนวคิดหลัก
- ทุกแบรนด์ในเว็บเป็นของเจ้าของระบบ (คุณ)
- เมื่อลูกค้าสั่ง จะเปลี่ยนลิงก์สมัครของทุกแบรนด์เป็นของลูกค้านั้น (แก้แค่ไฟล์ signup.txt ในแต่ละโฟลเดอร์)
- รองรับหลายธีม หน้าเว็บแต่ละธีมสามารถปรับแต่งดีไซน์/ลูกเล่นได้อิสระ
- **ทุกครั้งที่ต้องการเพิ่ม/เปลี่ยนธีม ให้ copy generateGlowGiftGrid.js ไปเป็น genaratetheme1.js, genaratetheme2.js ฯลฯ แล้วแก้ไขธีมในแต่ละไฟล์**
- ลูกค้าเลือกธีมไหน ให้รัน generate script ของธีมนั้น (เช่น genaratetheme1.js)

## โครงสร้างโฟลเดอร์
```
/sell/
  /59G/signup.txt
  /YN9/signup.txt
  /z8/signup.txt
  ...
  genaratetheme1.js
  genaratetheme2.js
  ...
  README.md
  (output.html หรือโฟลเดอร์สำหรับไฟล์ที่สร้าง)
```

- **แต่ละโฟลเดอร์แบรนด์**: เก็บไฟล์ signup.txt (มีลิงก์สมัครของลูกค้าแต่ละราย)
- **genaratethemeX.js**: สคริปต์สำหรับ generate หน้าเว็บธีมแต่ละแบบ (ธีมละ 1 ไฟล์)
- **README.md**: คู่มือและแผนงาน

## หลักการทำงาน
1. **เตรียมลิงก์สมัคร**
   - ใส่ลิงก์สมัครของลูกค้าแต่ละรายใน `signup.txt` ของแต่ละแบรนด์
2. **สร้างหรือเลือกธีม**
   - เพิ่มธีมใหม่ = copy generateGlowGiftGrid.js ไปเป็น genaratethemeX.js แล้วแก้ style/HTML/ลูกเล่น ในไฟล์นั้น
   - ตัวอย่าง: genaratetheme1.js, genaratetheme2.js, ...
3. **รัน generate script ของธีมนั้น**
   - สคริปต์จะอ่านชื่อแบรนด์ (ชื่อโฟลเดอร์), รูปภาพ (ไฟล์ในโฟลเดอร์แบรนด์), ลิงก์สมัคร (จาก signup.txt)
   - สร้างหน้าเว็บใหม่โดยใช้ธีมที่อยู่ใน script นั้น
   - ใช้ metatag เดิม (title, og:image ฯลฯ) อัตโนมัติ

## จุดที่ควรปรับแต่ง
- **ธีม/ดีไซน์**: แก้ไขเฉพาะในแต่ละไฟล์ genaratethemeX.js (เปลี่ยน style, HTML, ลูกเล่น ฯลฯ)
- **โครงสร้างข้อมูล/ปุ่ม/ลิงก์**: แก้ไข logic ในแต่ละ genaratethemeX.js
- **ลูกเล่น/JS เพิ่มเติม**: เพิ่มในแต่ละไฟล์ธีม script ได้เลย

## ตัวอย่างการเพิ่มธีม
1. คัดลอก generateGlowGiftGrid.js ไปเป็น genaratetheme3.js
2. แก้ style, HTML, metatag, ลูกเล่น ตามที่ต้องการใน genaratetheme3.js
3. สร้างไฟล์ตัวอย่าง (theme3_example.html) ให้ลูกค้าดู
4. ลูกค้าเลือกธีมไหน ให้ใช้ generate script ของธีมนั้น

## หมายเหตุสำคัญ
- ไม่ควรแก้ไข/เพิ่ม logic ในแต่ละโฟลเดอร์แบรนด์ (นอกจาก signup.txt)
- ทุกการเปลี่ยนแปลงธีม/ดีไซน์/โครงสร้าง ให้แก้แค่ในแต่ละ generate script (genaratethemeX.js) เท่านั้น
- agent หรือ dev ใหม่ สามารถอ่านไฟล์นี้แล้วเข้าใจ workflow ทั้งหมดได้ทันที

---

**สรุป:**
- ระบบนี้ออกแบบให้เพิ่ม/เปลี่ยนธีม ได้ง่ายสุดๆ (copy script แล้วแก้ style/HTML)
- งานหลักของ dev/agent คือดูแลแต่ละไฟล์ generate script (genaratethemeX.js)
- เพิ่มแบรนด์ใหม่ = เพิ่มโฟลเดอร์ + signup.txt + รูป
- เพิ่มธีมใหม่ = copy generate script แล้วแก้ style/HTML

