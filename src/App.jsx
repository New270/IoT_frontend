import { useState } from 'react'
import { LayoutDashboard, Database, History, UserCircle } from 'lucide-react'

import Dashboard from './pages/Dashboard'
import DataSensors from './pages/DataSensors'
import ActionHistory from './pages/ActionHistory'
import Profile from './pages/Profile'

function App() {
  
  const [user, setUser] = useState({ user_id: 1, username: 'admin (Demo)' })
  
  // Lưu trang đang mở; lần tải lại sau sẽ quay về đúng trang người dùng xem gần nhất.
  const [currentPage, setCurrentPage] = useState(() => {
      const savedPage = localStorage.getItem('iot_page')
      return savedPage ? savedPage : 'dashboard'
  })

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sensors', label: 'Data Sensors', icon: Database },
    { id: 'history', label: 'Action History', icon: History },
    { id: 'profile', label: 'Profile', icon: UserCircle },
  ]


  const renderPage = () => {
    switch (currentPage) {
      case 'sensors': return <DataSensors />
      case 'history': return <ActionHistory />
      case 'profile': return <Profile />
      default: return <Dashboard user={user} />
    }
  }

  return (
    <div className="app">
      {/* Sidebar cố định: hiển thị thương hiệu, nút chuyển trang và trạng thái tài khoản demo. */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">U</div>
          <div>
            <div className="brand-name">Smart Home IoT</div>
            <div className="brand-subtitle">ACADEMIC NODE</div>
          </div>
        </div>

        <nav className="navigation">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => {
                  // Cập nhật giao diện ngay và ghi lựa chọn trang vào localStorage.
                  setCurrentPage(item.id);
                  localStorage.setItem('iot_page', item.id);
                }}
              >
                <Icon size={17} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="user-status">
          <div className="status-header">
            <span>USER</span>
            <span className="online"><span className="status-dot"></span> ONLINE</span>
          </div>
          <div className="user-name">{user.username}</div>
          <div style={{marginTop:'12px', textAlign:'center', padding:'4px', fontSize:'10px', color:'#00ff83', border:'1px dashed #00ff83', borderRadius:'4px'}}>
            FRONTEND DEMO MODE
          </div>
        </div>
      </aside>
      {/* Vùng nội dung bên phải: chỉ hiển thị một trang do renderPage() trả về. */}
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App
