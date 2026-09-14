import { useState } from 'react'
import {
  LayoutDashboard,
  Database,
  History,
  UserCircle,
  Activity,
  Wifi,
  Thermometer,
  Droplets,
  Sun,
  Lightbulb,
  Search,
  Bell,
  ChevronDown,
} from 'lucide-react'

import Dashboard from './pages/Dashboard'
import DataSensors from './pages/DataSensors'
import ActionHistory from './pages/ActionHistory'
import Profile from './pages/Profile'

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const navigation = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'sensors',
      label: 'Data Sensors',
      icon: Database,
    },
    {
      id: 'history',
      label: 'Action History',
      icon: History,
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: UserCircle,
    },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case 'sensors':
        return <DataSensors />
      case 'history':
        return <ActionHistory />
      case 'profile':
        return <Profile />
      default:
        return <Dashboard />
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
                className={`nav-item ${
                  currentPage === item.id ? 'active' : ''
                }`}
                onClick={() => setCurrentPage(item.id)}
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
            <span className="online">
              <span className="status-dot"></span>
              ONLINE
            </span>
          </div>

          <div className="user-name">Student</div>

          <div className="host-name">
            HOST: university-node-01
          </div>
        </div>
      </aside>

      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  )
}

export default App