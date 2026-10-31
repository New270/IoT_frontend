import { useState, useEffect } from 'react'
import { Lightbulb } from 'lucide-react'
import { apiFetch } from '../../lib/api'

function ActionHistory() {
  const [historyData, setHistoryData] = useState([])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [deviceFilter, setDeviceFilter] = useState('All')
  const [actionFilter, setActionFilter] = useState('All')
  const [resultFilter, setResultFilter] = useState('All')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedDevice, setAppliedDevice] = useState('All')
  const [appliedAction, setAppliedAction] = useState('All')
  const [appliedResult, setAppliedResult] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await apiFetch('/api/history')
        const data = await res.json()
        setHistoryData(data)
      } catch (error) {
        console.error("Lỗi lấy lịch sử:", error)
      }
    }
    fetchHistory()
    const timer = setInterval(fetchHistory, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = () => {
    setAppliedSearch(searchTerm)
    setAppliedDevice(deviceFilter)
    setAppliedAction(actionFilter)
    setAppliedResult(resultFilter)
    setCurrentPage(1)
  }

  const filteredHistory = historyData.filter(row => {
    const query = appliedSearch.toLowerCase()
    const matchSearch = appliedSearch === '' || row.id.toLowerCase().includes(query) || row.device.toLowerCase().includes(query) || row.time.toLowerCase().includes(query)
    const matchDevice = appliedDevice === 'All' || row.device.includes(appliedDevice)
    const matchAction = appliedAction === 'All' || row.action === appliedAction
    const matchResult = appliedResult === 'All' || row.result === appliedResult

    return matchSearch && matchDevice && matchAction && matchResult
  })

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const currentHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, index) => index + 1)
    if (currentPage <= 3) return [1, 2, 3, '...', totalPages]
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage, '...', totalPages]
  }

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
            placeholder="Tìm ID, thiết bị hoặc thời gian..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
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

          <select className="filter-input filter-select" value={resultFilter} onChange={(event) => setResultFilter(event.target.value)}>
            <option value="All">TẤT CẢ KẾT QUẢ</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
            <option value="PENDING">PENDING</option>
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

          <button className="search-btn" onClick={handleSearch}>TÌM KIẾM</button>
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
              {currentHistory.map((row, index) => (
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

        {totalPages > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredHistory.length} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} setItemsPerPage={setItemsPerPage} getPageNumbers={getPageNumbers} />}
      </div>
    </>
  )
}

function Pagination({ currentPage, totalPages, totalItems, itemsPerPage, setCurrentPage, setItemsPerPage, getPageNumbers }) {
  const [pageInput, setPageInput] = useState(String(currentPage))
  useEffect(() => setPageInput(String(currentPage)), [currentPage])

  const buttonStyle = (active = false) => ({ padding: '6px 10px', background: active ? '#00ff83' : '#182333', color: active ? '#000' : '#fff', border: '1px solid #2d3748', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', minWidth: '28px' })
  const goToPage = () => {
    const requestedPage = Number(pageInput)
    if (Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= totalPages) {
      setCurrentPage(requestedPage)
    } else {
      setPageInput(String(currentPage))
    }
  }

  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', padding: '0 4px', flexWrap: 'wrap', gap: '10px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <span style={{ fontSize: '12px', color: '#738096' }}>Trang {currentPage} / {totalPages} (Tổng số: {totalItems} bản ghi)</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '12px', color: '#738096' }}>Page Limit:</span>
        <select value={itemsPerPage} onChange={(event) => { setItemsPerPage(Number(event.target.value)); setCurrentPage(1) }} style={{ padding: '5px 8px', background: '#182333', color: '#fff', border: '1px solid #2d3748', borderRadius: '4px', fontSize: '11px', outline: 'none', cursor: 'pointer' }}>
          {[5, 10, 20, 50].map(value => <option key={value} value={value}>{value} dòng</option>)}
        </select>
        <span style={{ fontSize: '12px', color: '#738096', marginLeft: '6px' }}>Go to page:</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={pageInput}
          onChange={(event) => setPageInput(event.target.value)}
          onKeyDown={(event) => { if (event.key === 'Enter') goToPage() }}
          aria-label="Đi đến trang"
          style={{ width: '64px', padding: '5px 8px', background: '#182333', color: '#fff', border: '1px solid #2d3748', borderRadius: '4px', fontSize: '11px', outline: 'none' }}
        />
        <button onClick={goToPage} style={{ padding: '5px 9px', background: 'rgba(0, 255, 131, 0.05)', color: '#00ff83', border: '1px solid #00ff83', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>GO</button>
      </div>
    </div>
    {totalPages > 1 && <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      <button onClick={() => setCurrentPage(page => Math.max(page - 1, 1))} disabled={currentPage === 1} style={{ ...buttonStyle(), opacity: currentPage === 1 ? 0.5 : 1 }}>&lt;</button>
      {getPageNumbers().map((number, index) => number === '...' ? <span key={index} style={{ color: '#738096', padding: '0 4px', fontSize: '12px' }}>...</span> : <button key={index} onClick={() => setCurrentPage(number)} style={buttonStyle(currentPage === number)}>{number}</button>)}
      <button onClick={() => setCurrentPage(page => Math.min(page + 1, totalPages))} disabled={currentPage === totalPages} style={{ ...buttonStyle(), opacity: currentPage === totalPages ? 0.5 : 1 }}>&gt;</button>
    </div>}
  </div>
}

export default ActionHistory
