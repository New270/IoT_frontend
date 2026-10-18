import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Cấu hình Vite: kích hoạt plugin React để biên dịch JSX và hỗ trợ Fast Refresh khi chạy dev.
export default defineConfig({
  plugins: [react()],
})
