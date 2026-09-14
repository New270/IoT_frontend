import { useState } from 'react'
import { Search, Lightbulb } from 'lucide-react'

function ActionHistory() {
  // Dữ liệu mẫu (Mock Data)
  const mockData = [
    { id: 'ACT-4022', device: 'LED 1', action: 'ON', result: 'SUCCESS', time: '2026-03-31 14:32:00' },
    { id: 'ACT-3199', device: 'LED 2', action: 'OFF', result: 'SUCCESS', time: '2026-03-31 14:15:22' },
    { id: 'ACT-3061', device: 'LED 1', action: 'OFF', result: 'FAILED', time: '2026-03-31 13:58:10' },
    { id: 'ACT-2874', device: 'LED 2', action: 'ON', result: 'SUCCESS', time: '2026-03-31 13:22:45' },
    { id: 'ACT-2821', device: 'LED 1', action: 'OFF', result: 'SUCCESS', time: '2026-03-31 12:45:11' },
    { id: 'ACT-2190', device: 'LED 2', action: 'ON', result: 'SUCCESS', time: '2026-03-31 12:12:03' },
    { id: 'ACT-1930', device: 'LED 2', action: 'OFF', result: 'FAILED', time: '2026-03-31 11:15:19' },
  ]

  return (
    <>
      <header className="topbar">
        <div>
          <h1>ACTION HISTORY</h1>
          <p>AUDIT TRAIL OF DEVICE COMMANDS & RESULTS</p>
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
            placeholder="Search by device or action..." 
          />

            <button className="search-btn">Search</button>

          <select className="filter-input filter-select">
            <option>DEVICE: All</option>
            <option>LED 1</option>
            <option>LED 2</option>
            <option>LED 3</option>
          </select>
          <select className="filter-input filter-select">
            <option>ACTION: All</option>
            <option>ON</option>
            <option>OFF</option>
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
                <th>ACTION ID</th>
                <th>DEVICE</th>
                <th>ACTION</th>
                <th>RESULT</th>
                <th>TIMESTAMP (UTC)</th>
              </tr>
            </thead>
            <tbody>
              {mockData.map((row, index) => (
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
                    <div className={`badge ${row.result === 'SUCCESS' ? 'badge-success' : 'badge-failed'}`}>
                      <span className="badge-dot"></span>
                      {row.result}
                    </div>
                  </td>
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

export default ActionHistory