import { useState } from 'react'

function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false)
  const [fullName, setFullName] = useState(user.full_name || user.username)
  const [email, setEmail] = useState(user.email || '')

  const handleSaveOrEdit = () => {
    if (isEditing) alert('Đã cập nhật thông tin thành công!')
    setIsEditing(!isEditing)
  }

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
        
        <div className="profile-header-card">
          <div className="profile-avatar">{user.username.charAt(0).toUpperCase()}</div>
          <div className="profile-details">
            <h2>{fullName}</h2>
            <p>IoT System Operator <span>|</span> {email}</p>
          </div>
          <div className="profile-meta">
            <div>
              <span>USERNAME</span>
              <strong>{user.username}</strong>
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

        <div className="profile-grid">
          <div className="profile-card">
            <div className="profile-card-header">
              <h3>ACCOUNT INFORMATION</h3>
              <p>USER CREDENTIALS & ROLE ASSIGNMENT</p>
            </div>
            <div className="profile-list">
              <div className="profile-list-item">
                <span>FULL NAME</span>
                {isEditing ? <input type="text" value={fullName} onChange={(event) => setFullName(event.target.value)} style={{ background: '#121824', color: '#fff', border: '1px solid #00ff83', padding: '4px 8px', borderRadius: '4px' }} /> : <strong>{fullName}</strong>}
              </div>
              <div className="profile-list-item">
                <span>USERNAME</span>
                <strong>{user.username}</strong>
              </div>
              <div className="profile-list-item">
                <span>EMAIL ADDRESS</span>
                {isEditing ? <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} style={{ background: '#121824', color: '#fff', border: '1px solid #00ff83', padding: '4px 8px', borderRadius: '4px' }} /> : <strong>{email}</strong>}
              </div>
              <div className="profile-list-item">
                <span>ASSIGNED ROLE</span>
                <strong>IoT System Operator</strong>
              </div>
            </div>
            <button className="btn-outline" onClick={handleSaveOrEdit}>{isEditing ? 'SAVE CHANGES' : 'EDIT PROFILE'}</button>
          </div>

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
