import { useState, useEffect } from 'react'
import { apiFetch } from '../../lib/api'

function DataSensors() {
  const [sensorData, setSensorData] = useState(() => {
    try {
      const cachedData = JSON.parse(localStorage.getItem('iot_sensor_history_cache'))
      return Array.isArray(cachedData) ? cachedData : []
    } catch (error) {
      return []
    }
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [searchPlaceholder, setSearchPlaceholder] = useState('Tìm theo ID, tên, thời gian hoặc giá trị...')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [appliedType, setAppliedType] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  useEffect(() => {
    const fetchSensorsHistory = async () => {
      try {
        const res = await apiFetch('/api/sensors/history')
        const data = await res.json()
        setSensorData(data)
        localStorage.setItem('iot_sensor_history_cache', JSON.stringify(data))
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error)
      }
    }
    fetchSensorsHistory()
    const timer = setInterval(fetchSensorsHistory, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleSelectChange = (event) => {
    const value = event.target.value
    setTypeFilter(value)
    const options = {
      temperature: ['Nhiệt độ', 'Nhập tên hoặc giá trị nhiệt độ...'],
      humidity: ['Độ ẩm', 'Nhập tên hoặc giá trị độ ẩm...'],
      light: ['Ánh sáng', 'Nhập tên hoặc giá trị ánh sáng...'],
      time_mode: ['', 'Nhập thời gian (yyyy-mm-dd hh:mm:ss)...'],
      All: ['', 'Tìm theo ID, tên, thời gian hoặc giá trị...']
    }
    setSearchTerm(options[value][0])
    setSearchPlaceholder(options[value][1])
  }

  const handleSearch = () => {
    setAppliedSearch(searchTerm)
    setAppliedType(typeFilter)
    setCurrentPage(1)
  }

  const filteredSensors = sensorData.filter(row => {
    const query = appliedSearch.toLowerCase()
    const matchSearch = appliedSearch === '' ||
      row.id.toLowerCase().includes(query) ||
      row.name.toLowerCase().includes(query) ||
      row.time.toLowerCase().includes(query) ||
      String(row.value).toLowerCase().includes(query)
    const matchType = appliedType === 'All' || appliedType === '' || row.type === appliedType || appliedType === 'time_mode'

    return matchSearch && matchType
  })

  const totalPages = Math.ceil(filteredSensors.length / itemsPerPage)
  const currentSensors = filteredSensors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
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
          <h1>SENSOR DATA REGISTRY</h1>
          <p>QUERY & BROWSE ALL SENSOR TELEMETRY</p>
        </div>
      </header>

      <div className="page-content">
        <div className="filter-bar">
          <input 
            type="text" 
            className="filter-input" 
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select 
            className="filter-input filter-select"
            value={typeFilter}
            onChange={handleSelectChange}
          >
            <option value="All">TẤT CẢ CẢM BIẾN & THỜI GIAN</option>
            <option value="temperature">Nhiệt độ</option>
            <option value="humidity">Độ ẩm</option>
            <option value="light">Ánh sáng</option>
            <option value="time_mode">Thời gian</option>
          </select>
          <button className="search-btn" onClick={handleSearch}>TÌM KIẾM</button>
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
              {currentSensors.map((row, index) => (
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

        {totalPages > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={filteredSensors.length} itemsPerPage={itemsPerPage} setCurrentPage={setCurrentPage} setItemsPerPage={setItemsPerPage} getPageNumbers={getPageNumbers} />}
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

export default DataSensors
