import { useState, useEffect } from 'react'

function DataSensors() {
  const [sensorData, setSensorData] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    const fetchSensorsHistory = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/sensors/history')
        const data = await res.json()
        setSensorData(data)
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error)
      }
    }
    fetchSensorsHistory()
  }, [])

  const filteredSensors = sensorData.filter(row => {
    const matchSearch = row.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        row.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = typeFilter === 'All' || row.type === typeFilter
    const matchDate = dateFilter === '' || row.time.startsWith(dateFilter)

    return matchSearch && matchType && matchDate
  })

  return (
    <>
      <header className="topbar">
        <div>
          <h1>SENSOR DATA REGISTRY</h1>
          <p>QUERY & BROWSE ALL SENSOR TELEMETRY</p>
        </div>
      </header>

      <div className="page-content">
        <div className="filter-bar">
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Tìm theo ID hoặc tên cảm biến..." 
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
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">TẤT CẢ CẢM BIẾN</option>
            <option value="temperature">Chỉ Nhiệt độ</option>
            <option value="humidity">Chỉ Độ ẩm</option>
            <option value="light">Chỉ Ánh sáng</option>
          </select>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>SENSOR ID</th>
                <th>SENSOR NAME</th>
                <th>SENSOR TYPE</th>
                <th>TELEMETRY VALUE</th>
                <th>UNIT</th>
                <th>RECORDED TIMESTAMP (UTC)</th>
              </tr>
            </thead>
            <tbody>
              {filteredSensors.map((row, index) => (
                <tr key={index}>
                  <td className="td-highlight">{row.id}</td>
                  <td>{row.name}</td>
                  <td style={{textTransform: 'capitalize'}}>{row.type}</td>
                  <td className="td-value">{row.value}</td>
                  <td>{row.unit}</td>
                  <td>{row.time}</td>
                </tr>
              ))}

              {filteredSensors.length === 0 && (
                 <tr><td colSpan="6" style={{textAlign: 'center', padding: '20px'}}>Không tìm thấy kết quả nào phù hợp.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default DataSensors