# mypace-application-api
rest api with mongoose

**คำสั่งสำหรับการ run server**

`node server`

**ควรใช้ API ควบคู่กับ Postman**
**สำหรับการ CRUD สามารถใช้ API เส้นเดียวกันได้ แต่ให้เลือก Method ตามความเหมาะสม**
```http://localhost:9000/users/```

**ข้อมูลตัวอย่างสำหรับการ POST**
**สำหรับ Password นั้น ให้ทำการ hash ด้วย md5 ก่อน https://www.md5.cz/**
```
{
    "information": {
        "age": 21,
        "height": 170,
        "weight": 69,
        "gender": "Male"
    },
    "username": "taworn",
    "email": "tawornsaelim@gmail.com",
    "password": "54b93d6e18da549b93a882661d44b07d",
}
```
