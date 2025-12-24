# **Hướng dẫn chạy Frontend – SoulSpace**

Tài liệu này hướng dẫn cách chạy **Frontend App (User / Expert)** trên điện thoại bằng **Expo Go** và **Web Admin** trên trình duyệt cho người mới bắt đầu.

---

## **I. Yêu cầu môi trường (Cài trước)**

Trước khi chạy project cần có:

* **Node.js** (khuyến nghị ≥ 18\)

Kiểm tra:

 **node \-v**

**npm** (đi kèm Node.js)

 **npm \-v**

**Git**

 git \--version

* **Điện thoại Android** cài **Expo Go:** Tải trên Google Play hoặc chạy qua máy ảo (LD Player)

---

## **II. Chạy App Mobile (User / Expert)**

### **1\. Chuẩn bị điện thoại Android**

1. Mở **Cài đặt (Settings)**

2. Vào **Thông tin điện thoại (About phone)**

3. Tìm **Số bản dựng (Build number)**

4. Nhấn **7 lần liên tiếp** → Hiện thông báo *“Bạn đã là nhà phát triển”*

5. Quay lại **Cài đặt**

6. Vào **Tùy chọn nhà phát triển (Developer options)**

7. Bật **Gỡ lỗi USB (USB Debugging)**

8. Dùng **cáp USB** kết nối điện thoại với máy tính

**Lưu ý:** Điện thoại và máy tính **phải chung mạng WiFi** để gọi API nội bộ.

---

### **2\. Clone source code**

#### **App User**

https://github.com/Chuyen-d-Mobile-va-Pervasive-Computing/SoulSpace.git  
cd SoulSpace

#### **App Expert**

https://github.com/Chuyen-d-Mobile-va-Pervasive-Computing/SoulSpace-FE-Expert.git  
cd SoulSpace-FE-Expert

---

### **3\. Cài đặt thư viện**

npm install

* npm install dùng để tải toàn bộ thư viện cần thiết cho project

* Chỉ cần chạy **1 lần duy nhất** sau khi clone code

---

### **4\. Tạo file .env**

Tạo file **.env** ở **thư mục gốc** của project.

**Nội dung file .env:**

EXPO\_PUBLIC\_API\_PATH=[http://192.168.1.100:8000](http://192.168.1.100:8000)

* 192.168.1.100 là **IP LAN của máy chạy Backend**

* Thay IP này bằng IP thật của máy (máy thật hoặc máy ảo đều được)  
   (kiểm tra bằng ipconfig hoặc ifconfig)

* Port 8000 là port backend đang chạy

**Cách kiểm tra IP máy:**

* #### **Windows:** Mở Command Prompt hoặc PowerShell và chạy:

  **Ipconfig \-** Lấy địa chỉ **IPv4 Address**

* #### **macOS:** Mở Terminal và chạy:

  **ifconfig**

* #### **Linux:** Mở Terminal và chạy:

  **ip a Hoặc ifconfig**

---

### **5\. Chạy project**

npx expo start

* Lệnh này khởi động Expo Server

* Màn hình sẽ hiện:

  * 1 **QR Code**

  * 1 **đường link**

**Cách mở app trên điện thoại:**

* Mở **Expo Go**

* Quét **QR Code**

* Hoặc nhập link thủ công

---

## **III. Chạy Web Admin**

### **1\. Clone source code**

https://github.com/Chuyen-d-Mobile-va-Pervasive-Computing/SoulSpace-FE-Admin.git  
cd SoulSpace-FE-Admin

---

### **2\. Cài đặt thư viện**

npm install

---

### **3\. Tạo file .env**

Tạo file **.env** ở thư mục gốc:

NEXT\_PUBLIC\_API\_PATH=http://localhost:8000

* Web Admin chạy trên trình duyệt nên gọi API qua localhost

* Backend cần chạy trước ở port 8000

---

### **4\. Chạy Web Admin**

npm run dev

---

### **5\. Mở trình duyệt**

Mở **Chrome / Cốc Cốc** và truy cập:

http://localhost:3000

Đây là **trang Login của Admin**

---

## **V. Lưu ý quan trọng**

* Backend **phải chạy trước**

* Điện thoại & máy tính **chung mạng**

* Nếu không quét được QR:

  * Kiểm tra Firewall

  * Kiểm tra IP trong file .env

* Khi đổi IP backend → **restart Expo**

