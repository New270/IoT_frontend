import { useState, useEffect } from 'react'
import { Lightbulb } from 'lucide-react'

function ActionHistory() {
  const [historyData, setHistoryData] = useState([])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [deviceFilter, setDeviceFilter] = useState('All')
  const [actionFilter, setActionFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('') // State chọn ngày

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/history')
        const data = await res.json()
        setHistoryData(data)
      } catch (error) {
        console.error("Lỗi lấy lịch sử:", error)
      }
    }
    fetchHistory()
  }, [])

  const filteredHistory = historyData.filter(row => {
    const matchSearch = row.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        row.device.toLowerCase().includes(searchTerm.toLowerCase())
    const matchDevice = deviceFilter === 'All' || row.device.includes(deviceFilter)
    const matchAction = actionFilter === 'All' || row.action === actionFilter
    
    // Lọc theo ngày (YYYY-MM-DD). Cắt chuỗi time để so khớp với ngày được chọn.
    const matchDate = dateFilter === '' || row.time.startsWith(dateFilter)

    return matchSearch && matchDevice && matchAction && matchDate
  })

  return (
    <>
      <header className="topbar">
        <div>
          <h1>ACTION HISTORY</h1>
          <p>AUDIT TRAIL OF DEVICE COMMANDS & RESULTS</p>
        </div>
      </header>

      <div className="page-content">
        <div className="filter-bar">
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Tìm ID hoặc tên thiết bị..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />

          <input 
            type="date" 
            className="filter-input" 
            style={{ flex: 'none', width: '165px', cursor: 'pointer' }}
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)} 
          />
          
          <select 
            className="filter-input filter-select"
            value={deviceFilter}
            onChange={(e) => setDeviceFilter(e.target.value)}
          >
            <option value="All">TẤT CẢ THIẾT BỊ</option>
            <option value="LED Trắng">LED Trắng</option>
            <option value="LED Xanh dương">LED Xanh dương</option>
            <option value="LED Xanh lá">LED Xanh lá</option>
          </select>

          <select 
            className="filter-input filter-select"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="All">TẤT CẢ HÀNH ĐỘNG</option>
            <option value="ON">Chỉ báo ON</option>
            <option value="OFF">Chỉ báo OFF</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ACTION ID</th>
                <th>DEVICE</th>
                <th>ACTION</th>
                <th>RESULT</th>
                <th>TIMESTAMP (UTC)</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((row, index) => (
                <tr key={index}>
                  <td className="td-highlight">{row.id}</td>
                  <td>
                    <div className="td-device">
                      <Lightbulb size={16} color="#738096" />
                      {row.device}
                    </div>
                  </td>
                  <td>
                    <span className={`action-badge ${row.action === 'OFF' ? 'off' : ''}`}>
                      {row.action}
                    </span>
                  </td>
                  <td>
                    <div className={`badge ${row.result === 'SUCCESS' ? 'badge-success' : (row.result === 'FAILED' ? 'badge-failed' : 'badge-pending')}`}>
                      <span className="badge-dot"></span>
                      {row.result}
                    </div>
                  </td>
                  <td>{row.time}</td>
                </tr>
              ))}
              
              {filteredHistory.length === 0 && (
                 <tr><td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>Không tìm thấy kết quả nào phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default ActionHistory