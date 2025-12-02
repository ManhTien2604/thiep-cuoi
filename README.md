
# Thiệp cưới online – Mẫu tuỳ chỉnh (Việt hoá)

Một trang thiệp cưới một-page, responsive, dễ tuỳ chỉnh chỉ bằng file `config.json`. Không cần sửa HTML.

## Cấu trúc
```
thiep-cuoi-online/
├── index.html        # khung trang, tải config và sinh nội dung
├── styles.css        # giao diện, màu sắc, font
├── script.js         # logic: đếm ngược, RSVP, chia sẻ, v.v.
├── config.json       # NỘI DUNG tuỳ chỉnh
└── assets/           # ảnh bìa, ảnh gallery
```

## Tuỳ chỉnh nhanh
Mở `config.json` và sửa các trường:
- `couple.bride_name`, `couple.groom_name`
- `date` (định dạng `YYYY-MM-DD`), `time` (`HH:MM`)
- `invite_text` – lời mời
- `venue.name`, `venue.address`, `venue.map_url` – liên kết Google Maps
- `schedule` – các mốc thời gian và tiêu đề
- `gallery` – đường dẫn ảnh trong thư mục `assets/`
- `rsvp.method` – chọn `mailto`, `google_form`, hoặc `formspree`
  - Nếu `mailto`: đặt địa chỉ email ở `rsvp.mailto` và (tuỳ chọn) `rsvp.phone`
  - Nếu `google_form`: đặt `rsvp.google_form_url`
  - Nếu `formspree`: đặt `rsvp.formspree_endpoint` (ví dụ `https://formspree.io/f/xxxxx`)
- `theme.primary_color`, `theme.background`, `theme.font_heading`, `theme.font_body`
- `hosted_by` – ví dụ: `Gia đình hai bên`

## Chạy thử trên máy
Do trình duyệt chặn `fetch` khi mở file trực tiếp, hãy chạy một server tĩnh:

### Cách 1: Python (có sẵn)
```bash
cd thiep-cuoi-online
python -m http.server 8000
```
Mở trình duyệt: http://localhost:8000

### Cách 2: VS Code – Live Server
Cài extension Live Server, bấm "Go Live" trong thư mục dự án.

## Triển khai (deploy)
- **GitHub Pages**: Push repo lên GitHub, bật Pages (Source: `main`, Root: `/`).
- **Netlify**: Drag & drop thư mục lên app.netlify.com hoặc kết nối repo; thiết lập domain tuỳ thích.
- **Vercel**: `vercel` với dự án tĩnh.

## Mẹo tuỳ biến
- Thay ảnh bìa: đặt ảnh vào `assets/cover.jpg`.
- Ảnh gallery: thêm vào `assets/` và cập nhật danh sách `gallery`.
- Màu chủ đạo: đổi `theme.primary_color`.
- Font: dùng Playfair cho tiêu đề và Inter cho nội dung (có thể đổi sang font Google khác).

## Tính năng
- Đếm ngược tới ngày cưới
- Lịch trình linh hoạt
- Liên kết bản đồ
- RSVP qua email/Google Form/Formspree
- Chia sẻ liên kết (Web Share API / copy clipboard)
- Responsive, hỗ trợ thiết bị di động
- Truy cập & SEO cơ bản (Open Graph)

## Góp ý & mở rộng
- Thêm nhạc nền (audio) + nút bật/tắt
- Thêm nút "Thêm vào lịch" (ICS/Google Calendar)
- Tạo QR code cho bản đồ/RSVP

Chúc bạn có một thiệp cưới thật đẹp và dễ dùng! 💍
