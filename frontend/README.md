# Prompt Share Frontend

## Cấu hình biến môi trường

Ứng dụng sử dụng các biến môi trường để cấu hình. Bạn có thể tạo các file sau trong thư mục gốc:

- `.env.local`: Biến môi trường cho môi trường local
- `.env.development`: Biến môi trường cho môi trường development
- `.env.production`: Biến môi trường cho môi trường production

### Các biến môi trường cần thiết

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# JWT settings
NEXT_PUBLIC_TOKEN_EXPIRE_MINUTES=30
NEXT_PUBLIC_REFRESH_TOKEN_EXPIRE_DAYS=7

# App settings
NEXT_PUBLIC_APP_NAME=Prompt Share
```

## Chạy ứng dụng

### Môi trường phát triển

```bash
npm run dev
```

### Môi trường production

```bash
npm run build
npm run start
```

## Quản lý Authentication

Ứng dụng sử dụng JWT token được lưu trong cookie để xác thực người dùng. Các token bao gồm:

- `access_token`: Thời hạn ngắn (mặc định 30 phút)
- `refresh_token`: Thời hạn dài (mặc định 7 ngày)

Thông tin người dùng được lưu trong localStorage và được khôi phục khi reload page.
