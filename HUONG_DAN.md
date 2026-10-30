# Sổ Thuê Bao — bản offline cho PC (exe) và Android (apk)

## Build bằng GitHub Actions
1. Tạo một repo mới trên GitHub (VD: `SoThueBao`), tải toàn bộ nội dung thư mục này lên nhánh `main`
   (giữ nguyên thư mục `.github`).
2. Vào tab **Actions** → workflow **Build SoThueBao (exe + apk)** tự chạy (hoặc bấm **Run workflow**).
3. Chạy xong (~5–10 phút), mở lượt chạy → mục **Artifacts** tải về:
   - `SoThueBao-exe` → bên trong có `SoThueBao.exe`
   - `SoThueBao-apk` → bên trong có `SoThueBao.apk`

## Dùng trên PC
- Chạy `SoThueBao.exe` (không cần cài). Lần đầu app hỏi **nơi lưu dữ liệu**, mặc định là thư mục
  `SoThueBao_DuLieu` cạnh file exe. Bấm **Chọn thư mục…** để đổi, rồi bấm **OK**.
- Trong thư mục dữ liệu:
  - `thuebao.json` — toàn bộ dữ liệu thuê bao (có bản sao lưu `thuebao.json.bak`)
  - `TepDaNhap\` — bản sao các file Excel đã nhập
  - `BaoCao\` — các file Excel xuất ra
- **Chuyển sang máy khác:** copy `SoThueBao.exe` và thư mục `SoThueBao_DuLieu` vào cùng một chỗ
  (hoặc copy exe vào bên trong thư mục dữ liệu). Mở exe là app tự nhận dữ liệu, không hỏi lại.
- Windows SmartScreen có thể cảnh báo vì exe chưa ký số: bấm **More info → Run anyway**.

## Dùng trên Android
- Cài `SoThueBao.apk` (cho phép "Cài ứng dụng không rõ nguồn gốc" nếu máy hỏi).
- Lần đầu mở, bấm **Chọn thư mục…** → vào **Documents** (hoặc nơi khác) → tạo/chọn thư mục `SoThueBao`
  → **Sử dụng thư mục này** → **Cho phép** → **OK**.
- **Chuyển sang máy mới:** copy cả thư mục `SoThueBao` (có `thuebao.json`) sang máy mới, cài apk,
  rồi chọn đúng thư mục đó ở lần mở đầu tiên — app dùng tiếp dữ liệu cũ.
- Có thể dùng chung dữ liệu giữa PC và điện thoại bằng cách copy `thuebao.json` qua lại
  (cùng định dạng).

Toàn bộ app chạy offline, không cần mạng.
