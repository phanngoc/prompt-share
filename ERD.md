Dưới đây là mô hình ERD (Entity Relationship Diagram) cho một website bán prompt AI, bao gồm các bảng chính:  

1. **Users** – Lưu thông tin người dùng.  
2. **Prompts** – Lưu thông tin các prompt AI.  
3. **Categories** – Danh mục phân loại prompt.  
4. **Orders** – Ghi lại các giao dịch mua prompt.  
5. **Payments** – Thông tin thanh toán.  
6. **Reviews** – Đánh giá và phản hồi từ người dùng.  
7. **Subscriptions** – Quản lý các gói thành viên.  
8. **Prompt_Usage** – Theo dõi lịch sử sử dụng prompt.  

---

### **Mô tả quan hệ giữa các bảng:**
- **Users** có thể mua nhiều **Prompts** qua bảng **Orders**.  
- **Prompts** thuộc một hoặc nhiều **Categories**.  
- **Users** có thể đăng ký **Subscriptions** để truy cập prompt theo gói.  
- **Payments** gắn với **Orders** để xác thực giao dịch.  
- **Users** có thể để lại **Reviews** cho từng prompt đã mua.  
- **Prompt_Usage** lưu lịch sử sử dụng prompt của người dùng.  

---

### **ERD (Mô hình quan hệ thực thể)**  
```plaintext
Users (id, name, email, password, role, created_at, updated_at)
  |-- (1:N) --> Orders (id, user_id, total_price, status, created_at, updated_at)
  |       |-- (1:N) --> Payments (id, order_id, payment_method, transaction_id, status, created_at)
  |
  |-- (1:N) --> Reviews (id, user_id, prompt_id, rating, comment, created_at)
  |
  |-- (1:N) --> Subscriptions (id, user_id, plan, price, start_date, end_date, status)

Prompts (id, title, description, price, category_id, created_by, created_at, updated_at)
  |-- (1:N) --> Reviews (id, user_id, prompt_id, rating, comment, created_at)
  |
  |-- (N:M) --> Categories (id, name, description, created_at)
  |
  |-- (1:N) --> Prompt_Usage (id, user_id, prompt_id, usage_count, last_used_at)
```

---

### **Chi tiết bảng**
#### **1. Users**
Lưu thông tin người dùng.  
```sql
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### **2. Prompts**
Chứa thông tin về các prompt AI.  
```sql
CREATE TABLE Prompts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    category_id INT,
    created_by INT REFERENCES Users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### **3. Categories**
Chứa danh mục prompt.  
```sql
CREATE TABLE Categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **4. Orders**
Lưu các giao dịch mua prompt.  
```sql
CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### **5. Payments**
Quản lý thanh toán.  
```sql
CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES Orders(id),
    payment_method ENUM('momo', 'zalopay', 'stripe', 'bank_transfer'),
    transaction_id VARCHAR(255) UNIQUE NOT NULL,
    status ENUM('pending', 'successful', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **6. Reviews**
Cho phép người dùng đánh giá prompt.  
```sql
CREATE TABLE Reviews (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    prompt_id INT REFERENCES Prompts(id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### **7. Subscriptions**
Quản lý gói thành viên.  
```sql
CREATE TABLE Subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    plan ENUM('basic', 'pro', 'enterprise') NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active'
);
```

#### **8. Prompt_Usage**
Theo dõi lịch sử sử dụng prompt.  
```sql
CREATE TABLE Prompt_Usage (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES Users(id),
    prompt_id INT REFERENCES Prompts(id),
    usage_count INT DEFAULT 0,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### **Tóm tắt**
✔ **Tối ưu dữ liệu**: Chuẩn hóa theo mô hình quan hệ.  
✔ **Hỗ trợ mở rộng**: Dễ dàng thêm tính năng mới (ví dụ: Marketplace cho seller).  
✔ **Bảo mật & hiệu suất**: Mã hóa mật khẩu, chuẩn hóa quan hệ, chỉ mục.  

Đây là thiết kế phù hợp để xây dựng nền tảng bán prompt AI có thể mở rộng tại Việt Nam. 🚀