# mypace-application-api
rest api with mongoose

**เมื่อ clone ไปยังคอมพิวเตอร์ ให้ใช้คำสั่ง `npm install` เพื่อติดตั้ง node_modules**

**คำสั่งสำหรับการ run server**

`node server` หรือ `nodemon server`

**ควรใช้ API ควบคู่กับ Postman**
**สำหรับการ CRUD สามารถใช้ API เส้นเดียวกันได้ แต่ให้เลือก Method ตามความเหมาะสม**

🔰 API : `http://localhost:3000`

🔰 API : `https://drab-gold-quail-wig.cyclic.app`

<hr />
📍 **API สำหรับการเพิ่มคำแนะนำ**

**[POST]** `http://localhost:3000/advices` หรือ `https://drab-gold-quail-wig.cyclic.app/advices`

**โครงสร้างข้อมูลคำแนะนำ**
```json
{
    "message": "ข้อความ"
}
```
<hr />
📍 **API สำหรับการดึงคำแนะนำ**

**[GET]** `http://localhost:3000/advices` หรือ `https://drab-gold-quail-wig.cyclic.app/advices`
<hr />
📍 **API สำหรับการสุ่มคำแนะนำ**

**[GET]** `http://localhost:3000/advice` หรือ `https://drab-gold-quail-wig.cyclic.app/advice`
