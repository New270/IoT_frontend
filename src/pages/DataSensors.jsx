import { useState } from 'react'
import { Search } from 'lucide-react'

function DataSensors() {
  // Dữ liệu mẫu (Mock Data)
  const mockData = [
    { id: 'S001', name: 'Light Sensor', type: 'Light', value: '1002', unit: 'lux', time: '2026-03-30 14:02:09' },
    { id: 'S002', name: 'Humidity Sensor', type: 'Humidity', value: '80.2', unit: '%', time: '2026-03-30 14:02:11' },
    { id: 'S003', name: 'Temperature Sensor', type: 'Temperature', value: '20.4', unit: '°C', time: '2026-03-30 14:02:11' },
    { id: 'S001', name: 'Light Sensor', type: 'Light', value: '1000', unit: 'lux', time: '2026-03-30 14:01:30' },
    { id: 'S002', name: 'Humidity Sensor', type: 'Humidity', value: '79.8', unit: '%', time: '2026-03-30 14:01:41' },
    { id: 'S003', name: 'Temperature Sensor', type: 'Temperature', value: '20.3', unit: '°C', time: '2026-03-30 14:01:41' },
    { id: 'S001', name: 'Light Sensor', type: 'Light', value: '998', unit: 'lux', time: '2026-03-30 14:01:09' },
  ]

  return (
    <>
      <header className="topbar">
        <div>
          <h1>SENSOR DATA REGISTRY</h1>
          <p>QUERY & BROWSE ALL SENSOR TELEMETRY</p>
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
        {/* Thanh công cụ tìm kiếm và lọc */}
        <div className="filter-bar">
          <input 
            type="text" 
            className="filter-input" 
            placeholder="Search by ID or sensor name..." 
          />

          <button className="search-btn">Search</button>
          
          <select className="filter-input filter-select">
            <option>All Sensors</option>
            <option>Temperature</option>
            <option>Humidity</option>
            <option>Light</option>
          </select>
          <select className="filter-input filter-select">
            <option>2026-03-30 — 2026-03-31</option>
          </select>
        </div>

        {/* Bảng dữ liệu */}
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
              {mockData.map((row, index) => (
                <tr key={index}>
                  <td className="td-highlight">{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.type}</td>
                  <td className="td-value">{row.value}</td>
                  <td>{row.unit}</td>
                  <td>{row.time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="pagination">
            <span>SHOWING 1-7 OF 184 ENTRIES</span>
            <div className="page-numbers">
              <button className="page-btn">&lt;</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">...</button>
              <button className="page-btn">10</button>
              <button className="page-btn">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DataSensors