# mypace-application-api
rest api with mongoose

**เมื่อ clone ไปยังคอมพิวเตอร์ ให้ใช้คำสั่ง `npm install` เพื่อติดตั้ง node_modules**

**คำสั่งสำหรับการ run server**

`node server` หรือ `nodemon server`

**ควรใช้ API ควบคู่กับ Postman**
**สำหรับการ CRUD สามารถใช้ API เส้นเดียวกันได้ แต่ให้เลือก Method ตามความเหมาะสม**

📍 **API สำหรับ collection users**
```http://localhost:9000/users```

**ข้อมูลตัวอย่างสำหรับการ POST**
**สำหรับ Password นั้น ให้ทำการ hash ด้วย md5 ก่อน https://www.md5.cz/**
```json
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

📍 **API สำหรับ collection ผู้ใช้**
```http://localhost:9000/paces```

**ข้อมูลตัวอย่างสำหรับการ POST**

```json
{
    "userId": "635541bd018be42ab4056b92",
    "date": "2022-10-23T20:33:15.000Z",
    "details": {
        "pace": 5749,
        "kcal": 298.14,
        "distance": 2456,
        "mins": 152
    }
}
```

📍 **API สำหรับการดูประวัติการเดินของแต่ละผู้ใช้**
```http://localhost:9000/userPaces```

**ข้อมูลตัวอย่างที่ได้จากการ GET**
```json
[
    {
        "_id": "635541bd018be42ab4056b92",
        "username": "Ambatukam",
        "email": "imbouttocum@gmail.com",
        "password": "643386d42d7fae5f043d400a69d0f203",
        "information": {
            "age": 31,
            "height": 189,
            "weight": 85,
            "gender": "Male"
        },
        "createdAt": "2022-10-23T13:29:33.331Z",
        "updatedAt": "2022-10-23T13:31:44.447Z",
        "history": [
            {
                "_id": "635542f4018be42ab4056b97",
                "userId": "635541bd018be42ab4056b92",
                "date": "2022-10-23T20:33:15.000Z",
                "details": {
                    "paces": 5749,
                    "kcal": 298.14,
                    "distance": 2456,
                    "mins": 152
                },
                "createdAt": "2022-10-23T13:34:44.496Z",
                "updatedAt": "2022-10-23T13:34:44.496Z"
            }
        ]
    }
]
```
