# 🔍 Log Tracker - Ứng dụng theo dõi Logs API

Ứng dụng web hiện đại để theo dõi và phân tích logs API một cách hiệu quả, được xây dựng với React và Material-UI.

## ✨ Tính năng chính

### 📊 Dashboard thống kê
- Tổng số logs, thành công, lỗi
- Tỷ lệ thành công
- Phân tích theo Gateway và API type
- Biểu đồ realtime

### 🔍 Tìm kiếm và lọc mạnh mẽ
- **Debounced search** - Tìm kiếm thông minh với delay 500ms
- Lọc theo Gateway, API, Status code
- Lọc theo khoảng thời gian
- Bộ lọc có thể thu gọn/mở rộng

### 📋 Hiển thị logs đẹp mắt
- **Card layout responsive** cho mọi thiết bị
- **Color coding** theo loại API và status
- Preview request/response JSON
- Hiển thị thông tin client và session
- **Virtual scrolling** cho danh sách lớn (>100 items)

### 🔍 Chi tiết log đầy đủ
- Modal xem chi tiết với tabs
- Tab riêng cho Request, Response, Comment, Images
- **Copy và download JSON** với 1 click
- **Image gallery** xem ảnh trực tiếp
- Formatted JSON với syntax highlighting

### ⚡ Performance Optimization
- **Caching** với TTL 5 phút
- **Request deduplication** - không gửi request trùng
- **Retry mechanism** với exponential backoff
- **Virtual scrolling** cho danh sách lớn
- **Debounced search** giảm API calls
- **Memoization** ngăn re-render không cần thiết

### 🌐 Network & Offline Support
- **Offline detection** và fallback data
- **Request timeout** và error handling
- **Automatic retry** khi request fail
- **Cache extension** cho offline mode

## 🚀 Cài đặt và chạy

### Prerequisites
- Node.js >= 18
- npm hoặc yarn

### Cài đặt
```bash
# Clone repository
git clone <repository-url>
cd my-logs

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## 🔧 Cấu hình API

### Cấu hình hiện tại

Ứng dụng đã được cấu hình để sử dụng **API thực**:

```
API Endpoint: https://register-ekyc-b-api.hsc.com.vn/banking-services/v2/logs
Start Date: 2024-01-14
Gateway: REGISTER
API Key: AHDUWND72KD826S5E7NG93HE7SK27H4F
```

### Environment Variables

Để thay đổi cấu hình, tạo file `.env` từ `env.example`:

```bash
cp env.example .env
```

Nội dung file `.env`:

```env
# API Configuration
VITE_API_BASE_URL=https://register-ekyc-b-api.hsc.com.vn
VITE_API_KEY=AHDUWND72KD826S5E7NG93HE7SK27H4F
VITE_API_GATEWAY=REGISTER

# Performance Settings
VITE_API_TIMEOUT=30000
VITE_ENABLE_CACHE=true
VITE_CACHE_DURATION=300000

# Development Mode (bật để dùng mock data)
VITE_FORCE_MOCK_DATA=false
```

### API Integration

API endpoint hiện tại:
```
GET https://register-ekyc-b-api.hsc.com.vn/banking-services/v2/logs?startDate=2024-01-14&key=AHDUWND72KD826S5E7NG93HE7SK27H4F&gateway=REGISTER
```

Ứng dụng sẽ tự động fallback về mock data nếu API không khả dụng.

## 📱 Sử dụng

### 1. Dashboard
- Xem thống kê tổng quan
- Phân tích hiệu suất API
- Tracking theo thời gian thực

### 2. Tìm kiếm và lọc
- **Search box**: Tìm theo ID, session, nội dung request/response
- **Gateway filter**: Lọc theo PUBLIC, ONE, REGISTER
- **API filter**: Lọc theo LOG, OCR, LIVENESS, FACE_MATCHING
- **Status filter**: Lọc theo mã trạng thái HTTP
- **Date range**: Lọc theo khoảng thời gian

### 3. Virtual Scrolling
- Tự động bật cho danh sách >100 items
- Toggle thủ công bằng switch "Virtual Scroll"
- Hiệu suất cao cho hàng nghìn logs

### 4. Chi tiết log
- Click vào log card để xem chi tiết
- **Request tab**: JSON formatted, copy/download
- **Response tab**: JSON formatted, copy/download
- **Images tab**: Gallery với click để mở fullsize
- **Comment tab**: Metadata và ghi chú

## 🎯 Performance Tuning

### Cho danh sách lớn (>1000 items)

1. **Bật Virtual Scrolling**
   ```jsx
   // Tự động bật hoặc toggle switch
   setUseVirtualization(true)
   ```

2. **Tối ưu Search**
   ```jsx
   // Debounced search với 500ms delay
   const debouncedSearch = useDebounce(searchValue, 500)
   ```

3. **Caching Strategy**
   ```jsx
   // Cache 5 phút, extend cho offline
   VITE_CACHE_DURATION=300000
   ```

4. **Pagination Smart**
   ```jsx
   // Tăng items per page cho ít API calls
   itemsPerPage: 100
   ```

### Memory Optimization

- Virtual scrolling chỉ render visible items
- Memoization với React.memo và useMemo
- Lazy loading images trong log detail
- Cache cleanup tự động

## 🔧 Development

### Scripts
```bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # ESLint checking
```

### Project Structure
```
src/
├── components/          # React components
│   ├── LogTracker.jsx   # Main component
│   ├── LogFilter.jsx    # Search & filters
│   ├── LogCard.jsx      # Log display card
│   ├── LogDetail.jsx    # Detail modal
│   └── VirtualizedLogList.jsx # Virtual scroll
├── services/           # API services
│   └── apiService.js   # Enhanced API client
├── config/            # Configuration
│   └── api.js         # API config & cache
├── hooks/             # Custom hooks
│   └── useDebounce.js # Debounced state
├── utils/             # Utilities
│   ├── logUtils.js    # Log processing
│   └── mockData.js    # Fallback data
└── index.css          # Global styles
```

## 🐛 Troubleshooting

### CORS Error khi gọi API
**Triệu chứng**: Console hiển thị "blocked by CORS policy"

**Giải pháp**:
1. **Sử dụng Mock Data Mode** (Khuyến nghị cho development):
   ```env
   # Trong file .env.local
   VITE_FORCE_MOCK_DATA=true
   ```

2. **Proxy Configuration** (Đã setup sẵn):
   ```bash
   # Restart dev server
   npm run dev
   ```
   API sẽ được proxy qua `/api` để tránh CORS

3. **Production Deploy**:
   - Deploy lên cùng domain với API
   - Hoặc config CORS trên server

### API không hoạt động
- **Check Console**: Xem error messages chi tiết
- **Verify Credentials**: Kiểm tra API key và client code
- **Network Tab**: Check request/response trong Dev Tools
- **Auto Fallback**: Ứng dụng tự động dùng mock data

### Performance chậm
- **Virtual Scrolling**: Bật cho >100 items
- **Cache Settings**: Giảm duration nếu cần
- **Debounce Delay**: Tăng cho search (500ms → 1000ms)
- **Items Per Page**: Giảm xuống 10-20

### Memory issues
- **Clear Cache**: `apiService.clearCache()` trong console
- **Restart App**: Refresh trang
- **Virtual Mode**: Bật để giảm DOM nodes
- **Reduce Data**: Filter logs theo thời gian ngắn hơn

### Development Tips
```bash
# Force mock data mode
echo "VITE_FORCE_MOCK_DATA=true" >> .env.local

# Enable debug logging
echo "VITE_DEBUG=true" >> .env.local

# Restart with clean cache
npm run dev -- --force
```

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push và create Pull Request

---

**Phát triển bởi**: Ứng dụng Log Tracking Team
**Phiên bản**: 1.0.0
**Cập nhật**: December 2024
