## Learning with <https://www.youtube.com/@anonystick>

## Todo list
- [x] Mongodb
- [x] Caching with redis
- [x] Security with public key, private key, token jwt
- [ ] Unit test
- [ ] RabbitMq
- [ ] Email
- [ ] Cron job
- [ ] Swagger or OpenApi
- [ ] Logger
- [ ] I18n
- [ ] Test benchmark with autocannon
- [ ] Notify with firebase or socketIo
- [ ] Upload file with S3 or MinIO
- [ ] Dockerfile, docker-compose for dev and test
- [ ] Deployment with jenkins or circleCI

## Setup lib project

    - express
    - bcrypt": "^5.1.0",: encrypt, decrypt
    - compression": "^1.7.4",: nen request response
    - dotenv": "^16.0.3",: cau hinh doc file enviroment .env
    - helmet": "^6.0.1",: Che dau thong tin stack phia server, thong tin rieng tu...
    - jsonwebtoken": "^9.0.0",: thu vien jwt
    - lodash": "^4.17.21",
    - mongoose": "^6.9.2",: connect mongodb
    - morgan": "^1.10.0",: thu vien in ra cac log khi mot nguoi dung request xuong
    - nodemon
    - redis: using cache redis

## Mongodb

    - Nhược điểm của cách connect cũ
    - Cách connect mới, khuyên dùng
    - Kiểm tra hệ thống có bao nhiêu connect
    - THông báo khi server quá tải connect
    - Có nên disConnect liên tục hay không?
    - PoolSize là gì? vì sao lại quan trọng?
    - Nếu vượt quá kết nối poolsize?
    - MongoDB Desing pattern
          - Polymorphic pattern
          - Attribute pattern
          - Bucket pattern
          - Outlier pattern
          - Computed pattern
          - Subnet pattern
          - Extended reference pattern
          - Approximation pattern
          - Tree pattern
          - Preallocation pattern
          - Document versioning pattenr
          - Schema versioning pattern

## Course series

    1 - Welcome, welcome, welcome -   

    • Course: Node.js B...  
    2 - Những folders và packages cần thiết khi khởi tạo Project! -
    
    • Section 2: Node.j...  
    3 - Connect MongoDB to Node.js Using Mongoose và 7 điều lưu ý  -
    
    • Section 3: Connec...  
    4 - Cách triển khai env cho các level khác nhau. -
    
    • Section 4: Lịch s...  
    5 - Sign-up Shop (1) -
    
    • Section 5: Api Si...  
    5 - Sign-up Shop (2) -
    
    • Section 5: Reup S...  
    6 - Middleware apikey and permissions -
    
    • Section 6:  Custo...  
    7 - Xử lý ErrorHandler trong API -
    
    • Section 7: Xử lý ...

### Handler auth

### Api key

    `Lưu trữ key cung cấp cho các đối tác được truy cập vào hệ thống`

### Design Schema MongoDB - Polymorphic Pattern

    - 1document 1kb -> 50tr = 50gb

### Fulltext search in mongoDB

    https://anonystick.com/blog-developer/full-text-search-mongodb-chi-mot-bai-viet-khong-can-nhieu-2022012063033379

