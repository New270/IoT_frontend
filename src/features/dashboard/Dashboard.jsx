import { useEffect, useState } from 'react'
import { Thermometer, Droplets, Sun, Lightbulb, Power, Cpu } from 'lucide-react'
import { apiFetch } from '../../lib/api'

function Dashboard({ user }) {
  const [temperature, setTemperature] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [light, setLight] = useState(0)

  const [led1, setLed1] = useState(false)
  const [led2, setLed2] = useState(false)
  const [led3, setLed3] = useState(false)

  const [pending, setPending] = useState({ LED1: false, LED2: false, LED3: false })

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const res = await apiFetch('/api/sensors/latest')
        const data = await res.json()
        setTemperature(data.temperature)
        setHumidity(data.humidity)
        setLight(data.light)
        setPoints((old) => [...old.slice(1), {
          temp: data.temperature,
          humidity: data.humidity,
          light: data.light,
          time: new Date().toTimeString().substring(0, 8)
        }])
      } catch (e) {}
    }

    const fetchDeviceStatus = async () => {
      try {
        const res = await apiFetch('/api/devices/status')
        const data = await res.json()
        setPending(prevPending => {
            if (!prevPending.LED1) setLed1(data.LED1 === 'ON');
            if (!prevPending.LED2) setLed2(data.LED2 === 'ON');
            if (!prevPending.LED3) setLed3(data.LED3 === 'ON');
            return prevPending;
        });
      } catch (e) {}
    }

    fetchSensors(); fetchDeviceStatus();
    const timer = setInterval(() => { fetchSensors(); fetchDeviceStatus(); }, 2000)
    return () => clearInterval(timer)
  }, [])

  const handleToggleDevice = async (deviceCode, currentState) => {
    const action = currentState ? 'OFF' : 'ON'; 
    setPending(prev => ({ ...prev, [deviceCode]: true }));

    try {
      const response = await apiFetch(`/api/devices/${deviceCode}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      if (response.ok) {
        // Backend tự xác nhận SUCCESS hoặc chuyển lệnh sang FAILED sau 4 giây.
        // Frontend chỉ hiển thị trạng thái đang chờ trong khoảng thời gian này.
        setTimeout(() => {
          setPending(prev => ({ ...prev, [deviceCode]: false }));
        }, 4000);
      }
    } catch (error) {
      alert("Lỗi server Backend!");
      setPending(prev => ({ ...prev, [deviceCode]: false }));
    }
  };

  const handleBulkControl = async (actionType) => {
    const commands = [
      { device_code: 'LED1', action: actionType },
      { device_code: 'LED2', action: actionType },
      { device_code: 'LED3', action: actionType }
    ];

    setPending({ LED1: true, LED2: true, LED3: true });

    try {
      const response = await apiFetch('/api/devices/bulk_control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands }),
      });

      if (response.ok) {
        // Kết quả từng lệnh do backend xử lý và hiển thị ở Action History.
        setTimeout(() => {
          setPending({ LED1: false, LED2: false, LED3: false });
        }, 4000);
      }
    } catch (error) {
       alert("Lỗi server Backend khi điều khiển hàng loạt!");
       setPending({ LED1: false, LED2: false, LED3: false });
    }
  };

  const [points, setPoints] = useState(() => {
    try {
      const savedPoints = JSON.parse(localStorage.getItem('iot_chart_points'))
      if (Array.isArray(savedPoints) && savedPoints.length > 0) return savedPoints.slice(-12)
    } catch (error) {
      console.warn('Không thể khôi phục dữ liệu biểu đồ:', error)
    }

    return Array.from({ length: 12 }, (_, index) => {
      const time = new Date(Date.now() - (11 - index) * 2000)
      return { temp: 0, humidity: 0, light: 0, time: time.toTimeString().substring(0, 8) }
    })
  })

  useEffect(() => {
    localStorage.setItem('iot_chart_points', JSON.stringify(points))
  }, [points])
  const isAllOn = led1 && led2 && led3
  const isAllOff = !led1 && !led2 && !led3

  return (
    <>
      <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>IoT MONITORING DASHBOARD</h1>
          <p>ENVIRONMENTAL DATA & ACTUATOR CONTROLS ACTIVE</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', borderRadius: '6px', background: 'rgba(0, 255, 131, 0.1)', border: '1px solid #00ff83' }}>
          <Cpu size={16} color="#00ff83" />
          <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#00ff83', letterSpacing: '0.5px' }}>NODE MCU: ONLINE</span>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="sensor-cards">
          <SensorCard title="TEMPERATURE" value={temperature} unit="°C" icon={<Thermometer size={19} />} type="temperature" />
          <SensorCard title="HUMIDITY" value={humidity} unit="%" icon={<Droplets size={19} />} type="humidity" />
          <SensorCard title="ILLUMINANCE" value={light} unit="lux" icon={<Sun size={19} />} type="light" />
        </section>

        <section className="monitor-grid">
          <div className="chart-card" style={{ width: '100%' }}>
            <div className="card-heading">
              <h2>Real-Time Sensor Monitoring (Dual-Axis)</h2>
              <div className="legend">
                <span><i className="legend-temp"></i> Temperature (°C)</span>
                <span><i className="legend-humidity"></i> Humidity (%)</span>
                <span><i className="legend-light"></i> Light (lux)</span>
              </div>
            </div>

            <SensorChart points={points} />
          </div>

          <div className="device-card" style={{ width: '100%', marginTop: '20px' }}>
            <div className="device-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2>Device Control</h2>
               <div style={{ display: 'flex', gap: '8px' }}>
                 <button onClick={() => handleBulkControl('ON')} style={{ padding: '6px 12px', background: isAllOn ? '#00ff83' : 'rgba(0, 255, 131, 0.1)', color: isAllOn ? '#000' : '#00ff83', border: '1px solid #00ff83', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: isAllOn ? '0 0 10px rgba(0, 255, 131, 0.5)' : 'none', transition: '0.3s' }}>
                   <Power size={12}/> TURN ALL ON
                 </button>
                 <button onClick={() => handleBulkControl('OFF')} style={{ padding: '6px 12px', background: isAllOff ? '#ff4651' : 'rgba(255, 70, 81, 0.1)', color: isAllOff ? '#fff' : '#ff4651', border: '1px solid #ff4651', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: isAllOff ? '0 0 10px rgba(255, 70, 81, 0.5)' : 'none', transition: '0.3s' }}>
                   <Power size={12}/> TURN ALL OFF
                 </button>
               </div>
            </div>
            
            <DeviceControl name="LED Trắng (1)" active={led1} isPending={pending.LED1} onToggle={() => handleToggleDevice('LED1', led1)} />
            <DeviceControl name="LED Xanh dương (2)" active={led2} isPending={pending.LED2} onToggle={() => handleToggleDevice('LED2', led2)} />
            <DeviceControl name="LED Xanh lá (3)" active={led3} isPending={pending.LED3} onToggle={() => handleToggleDevice('LED3', led3)} />
          </div>
        </section>
      </div>
    </>
  )
}

function SensorCard({ title, value, unit, icon, type }) {
  return (
    <div className={`sensor-card ${type}`}>
      <div className="sensor-card-top"><span>{title}</span><div className="sensor-icon">{icon}</div></div>
      <div className="sensor-value">{value} <small>{unit}</small></div>
    </div>
  )
}

function DeviceControl({ name, active, isPending, onToggle }) {
  return (
    <div className={`device-item ${active ? 'device-active' : ''}`} style={{ opacity: isPending ? 0.6 : 1, transition: '0.3s' }}>
      <div className="device-name">
        <div className="device-icon" style={{ color: active ? '#ffd400' : '#738096', filter: active ? 'drop-shadow(0 0 8px #ffd400)' : 'none', transition: '0.3s' }}><Lightbulb size={19} /></div>
        <div>
          <strong>{name}</strong>
          <span style={{ color: isPending ? '#ffd400' : (active ? '#00ff83' : '') }}>
            {isPending ? 'PENDING...' : (active ? 'ACTIVE // ON' : 'STANDBY // OFF')}
          </span>
        </div>
      </div>
      <button className={`toggle ${active ? 'on' : ''}`} onClick={onToggle} disabled={isPending} style={{ cursor: isPending ? 'wait' : 'pointer'}}>
        <span></span>
      </button>
    </div>
  )
}

function SensorChart({ points }) {
  const width = 700, height = 280, paddingLeft = 55, paddingRight = 55, paddingTop = 20, paddingBottom = 45;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const maxLeftValue = 100
  // Tự mở rộng trục ánh sáng theo dữ liệu, với mốc tối thiểu là 1000 lux.
  const highestLight = Math.max(0, ...points.map((point) => Number(point.light) || 0))
  const maxRightValue = Math.max(1000, Math.ceil(highestLight / 1000) * 1000)
  const getLeftCoord = (index, value) => {
    const x = paddingLeft + (index / (points.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (value / maxLeftValue) * chartHeight;
    return { x, y };
  };
  const getRightCoord = (index, value) => {
    const x = paddingLeft + (index / (points.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (value / maxRightValue) * chartHeight;
    return { x, y };
  };
  const makeLeftPoints = (key) => points.map((p, i) => {
    const {x, y} = getLeftCoord(i, p[key]);
    return `${x},${y}`;
  }).join(' ');
  const makeRightPoints = (key) => points.map((p, i) => {
    const {x, y} = getRightCoord(i, p[key]);
    return `${x},${y}`;
  }).join(' ');
  const makeAreaPoints = (key) => {
    const pts = makeLeftPoints(key);
    return `${paddingLeft},${height - paddingBottom} ${pts} ${width - paddingRight},${height - paddingBottom}`;
  };

  return (
    <div className="chart-wrapper">
      <svg className="sensor-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad-temp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff4651" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ff4651" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="grad-hum" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#00d9ff" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="grad-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd400" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#ffd400" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#687587" strokeWidth="1" />
        <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="#687587" strokeWidth="1" />
        <line x1={width - paddingRight} y1={paddingTop} x2={width - paddingRight} y2={height - paddingBottom} stroke="#687587" strokeWidth="1" />

        {[0, 20, 40, 60, 80, 100].map((value) => {
          const y = paddingTop + chartHeight - (value / maxLeftValue) * chartHeight;
          return (
            <g key={`left-${value}`}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#182333" strokeDasharray="3 3" />
              <text x={paddingLeft - 8} y={y + 3} fill="#687587" fontSize="9" textAnchor="end">{value}</text>
            </g>
          );
        })}
        {Array.from({ length: 6 }, (_, index) => (maxRightValue / 5) * index).map((value) => {
          const y = paddingTop + chartHeight - (value / maxRightValue) * chartHeight;
          return <text key={`right-${value}`} x={width - paddingRight + 8} y={y + 3} fill="#687587" fontSize="9" textAnchor="start">{Math.round(value)}</text>
        })}

        {points.map((point, i) => {
          const x = paddingLeft + (i / (points.length - 1)) * chartWidth;
          return (
            <g key={i}>
              <line x1={x} y1={height - paddingBottom} x2={x} y2={height - paddingBottom + 4} stroke="#687587" strokeWidth="1" />
              <text x={x} y={height - paddingBottom + 18} fill="#687587" fontSize="8" textAnchor="middle" transform={`rotate(-15, ${x}, ${height - paddingBottom + 18})`}>{point.time}</text>
            </g>
          );
        })}

        <polygon points={makeAreaPoints('temp')} fill="url(#grad-temp)" />
        <polygon points={makeAreaPoints('humidity')} fill="url(#grad-hum)" />
        <polyline points={makeLeftPoints('temp')} fill="none" stroke="#ff4651" strokeWidth="1.5" />
        <polyline points={makeLeftPoints('humidity')} fill="none" stroke="#00d9ff" strokeWidth="1.5" />
        <polyline points={makeRightPoints('light')} fill="none" stroke="#ffd400" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
export default Dashboard
