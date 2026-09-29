import { useState } from 'react'
import { LayoutDashboard, Database, History, UserCircle } from 'lucide-react'

import Dashboard from './pages/Dashboard'
import DataSensors from './pages/DataSensors'
import ActionHistory from './pages/ActionHistory'
import Profile from './pages/Profile'

function App() {
  // Lấy user từ localStorage nếu có, nếu không thì null
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('iot_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  
  const [usernameInput, setUsernameInput] = useState('')
  const [currentPage, setCurrentPage] = useState(() => {
      const savedPage = localStorage.getItem('iot_page')
      return savedPage ? savedPage : 'dashboard'
  })

  const handleLogin = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput })
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data); 
        // LƯU VÀO LOCAL STORAGE SAU KHI ĐĂNG NHẬP
        localStorage.setItem('iot_user', JSON.stringify(data));
      } else {
        alert(data.error);
      }
    } catch (e) { alert('Lỗi kết nối Backend!'); }
  }

  // HÀM ĐĂNG XUẤT MỚI: Xóa localStorage khi thoát
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('iot_user');
  }

  const handleRegister = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Đăng ký thành công! Bấm Đăng nhập để vào.');
      } else {
        alert(data.error);
      }
    } catch (e) { alert('Lỗi kết nối Backend!'); }
  }

  // --- GIAO DIỆN ĐĂNG NHẬP ---
  if (!user) {
    return (
      <div className="app" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ background: '#101722', padding: '40px', borderRadius: '12px', width: '380px', border: '1px solid #1e2a3a' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#00ff83', fontSize: '24px', fontWeight: 'bold' }}>SMART HOME IOT</h2>
          <p style={{ textAlign: 'center', color: '#657286', marginBottom: '20px', fontSize: '13px' }}>Vui lòng đăng nhập để điều khiển hệ thống</p>
          <input 
            value={usernameInput} 
            onChange={e => setUsernameInput(e.target.value)} 
            placeholder="Nhập tên đăng nhập (VD: admin)..." 
            style={{ width: '100%', padding: '14px', marginBottom: '16px', background: '#080d15', border: '1px solid #1b293a', color: 'white', borderRadius: '6px', fontSize: '14px' }}
          />
          <button onClick={handleLogin} style={{ width: '100%', padding: '14px', background: '#00ff83', color: '#080d15', border: 'none', borderRadius: '6px', fontWeight: 'bold', marginBottom: '12px', cursor: 'pointer', fontSize: '14px' }}>ĐĂNG NHẬP</button>
          <button onClick={handleRegister} style={{ width: '100%', padding: '14px', background: 'transparent', color: '#00ff83', border: '1px solid #00ff83', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>ĐĂNG KÝ TÀI KHOẢN MỚI</button>
        </div>
      </div>
    )
  }

  // --- GIAO DIỆN DASHBOARD CHÍNH ---
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
      default: return <Dashboard user={user} /> // Truyền user xuống Dashboard
    }
  }

  return (
    <div className="app">
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
                  setCurrentPage(item.id);
                  localStorage.setItem('iot_page', item.id); // DÒNG QUAN TRỌNG NHẤT NẰM Ở ĐÂY
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
          <button onClick={handleLogout} style={{marginTop:'12px', width:'100%', padding:'6px', fontSize:'11px', background:'transparent', color:'#ff4651', border:'1px solid #ff4651', borderRadius:'4px', cursor:'pointer'}}>ĐĂNG XUẤT</button>
        </div>
      </aside>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App