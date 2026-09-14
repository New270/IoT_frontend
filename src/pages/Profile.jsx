import { UserCircle } from 'lucide-react'

function Profile() {
  return (
    <>
      <header className="topbar">
        <div>
          <h1>USER PROFILE</h1>
          <p>ACCOUNT & SYSTEM ACCESS INFORMATION</p>
        </div>

        <div className="system-info">
          <div>
            <span>SERVER UPTIME</span>
            <strong>124h 42m 18s</strong>
          </div>
          <div>
            <span>MESH CONNECTION</span>
            <strong className="connection">
              EXCELLENT (-98.4 dBm)
            </strong>
          </div>
        </div>
      </header>

      <div className="page-content">
        
        {/* Khung User Info chính */}
        <div className="profile-header-card">
          <div className="profile-avatar">S</div>
          <div className="profile-details">
            <h2>Student</h2>
            <p>IoT System Operator <span>|</span> student@university.local</p>
          </div>
          <div className="profile-meta">
            <div>
              <span>USERNAME</span>
              <strong>student</strong>
            </div>
            <div>
              <span>ACCOUNT CREATED</span>
              <strong>2026-03-01</strong>
            </div>
            <div>
              <span>STATUS</span>
              <strong className="connection">
                <span className="badge-dot"></span> ONLINE
              </strong>
            </div>
          </div>
        </div>

        {/* Khung chia 2 cột */}
        <div className="profile-grid">
          
          {/* Cột trái: Account Information */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>ACCOUNT INFORMATION</h3>
              <p>USER CREDENTIALS & ROLE ASSIGNMENT</p>
            </div>
            <div className="profile-list">
              <div className="profile-list-item">
                <span>FULL NAME</span>
                <strong>Student</strong>
              </div>
              <div className="profile-list-item">
                <span>USERNAME</span>
                <strong>student</strong>
              </div>
              <div className="profile-list-item">
                <span>EMAIL ADDRESS</span>
                <strong>student@university.local</strong>
              </div>
              <div className="profile-list-item">
                <span>ASSIGNED ROLE</span>
                <strong>IoT System Operator</strong>
              </div>
            </div>
            <button className="btn-outline">EDIT PROFILE</button>
          </div>

          {/* Cột phải: System Access */}
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>SYSTEM ACCESS</h3>
              <p>MODULE AUTHORIZATION STATUS</p>
            </div>
            <div className="profile-list">
              <div className="profile-list-item">
                <span>DASHBOARD</span>
                <div className="badge badge-success"><span className="badge-dot"></span> AUTHORIZED</div>
              </div>
              <div className="profile-list-item">
                <span>DATA SENSORS</span>
                <div className="badge badge-success"><span className="badge-dot"></span> AUTHORIZED</div>
              </div>
              <div className="profile-list-item">
                <span>DEVICE CONTROL</span>
                <div className="badge badge-success"><span className="badge-dot"></span> AUTHORIZED</div>
              </div>
              <div className="profile-list-item">
                <span>ACTION HISTORY</span>
                <div className="badge badge-success"><span className="badge-dot"></span> AUTHORIZED</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Profile