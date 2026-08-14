# TCAS-ST

ระบบบันทึกข้อมูลผลงานนักเรียน โรงเรียนเซนต์เทเรซา

## ส่วนประกอบ

- หน้าเว็บนักเรียนและแดชบอร์ดครู (GitHub Pages)
- Google Apps Script API
- Google Sheets สำหรับข้อมูลนักเรียน ผลงาน รีวิว และรายการไฟล์แนบ
- Google Drive สำหรับจัดเก็บภาพหลักฐาน แยกตามปีการศึกษา/ห้อง/นักเรียน/ประเภท

## แหล่งข้อมูลที่ตั้งค่าไว้

- Spreadsheet: `1seV4fk00kr62MiWd9i6IxjHqVZaTLQinZmb7MDXDzc4`
- Student sheet: `students`
- Evidence folder: `1BPExo71uPO1WPc1L1GP3mlK1TDDZx2Kb`
- เว็บไซต์: `https://theerawa21.github.io/TCAS-ST/`

## ติดตั้ง Apps Script

1. คัดลอก `apps-script/Code.gs` ไปแทนไฟล์ในโปรเจกต์ Apps Script
2. ตั้ง Script Properties:
   - `TEACHER_CODE` รหัสครูอย่างน้อย 8 ตัวอักษร
   - `SESSION_SECRET` สุ่มอย่างน้อย 32 ตัวอักษร (หรือรัน `setupConfig()` ให้ระบบสร้าง)
   - `ALLOWED_ORIGIN=https://theerawa21.github.io`
3. รัน `setupSheets()` และ `setupConfig()` ครั้งแรก
4. Deploy เป็น Web app เวอร์ชันใหม่ และให้สิทธิ์ผู้ใช้ที่เข้าถึงเป็น Anyone
5. ถ้า URL ของ Web app เปลี่ยน ให้แก้ `apiUrl` ใน `index.html` และ `config.js`

## เปิด GitHub Pages

ไปที่ Settings → Pages → Deploy from a branch → `main` / `(root)`.

> ห้ามบันทึก `TEACHER_CODE` หรือ `SESSION_SECRET` ลงใน GitHub
