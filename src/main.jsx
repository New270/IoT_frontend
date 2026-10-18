import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Điểm vào của ứng dụng: React gắn toàn bộ giao diện App vào thẻ <div id="root"> trong index.html.
// StrictMode chỉ hỗ trợ phát hiện lỗi khi phát triển, không tạo thêm thành phần hiển thị cho người dùng.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
