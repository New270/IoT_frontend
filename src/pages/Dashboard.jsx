import { useEffect, useState } from 'react'
import { Thermometer, Droplets, Sun, Lightbulb, Power } from 'lucide-react'

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
        const res = await fetch('http://127.0.0.1:5000/api/sensors/latest')
        const data = await res.json()
        setTemperature(data.temperature)
        setHumidity(data.humidity)
        setLight(data.light)
        setPoints((old) => [...old.slice(1), { temp: data.temperature, humidity: data.humidity, light: data.light }])
      } catch (e) {}
    }

    const fetchDeviceStatus = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5000/api/devices/status')
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
      const response = await fetch(`http://127.0.0.1:5000/api/devices/${deviceCode}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: action, user_id: user.user_id }),
      });
      
      if (response.ok) {
        setTimeout(async () => {
          const statusRes = await fetch('http://127.0.0.1:5000/api/devices/status');
          const statusData = await statusRes.json();
          
          if (statusData[deviceCode] !== action) {
             alert(`Lệnh gạt ${deviceCode} THẤT BẠI (Timeout)! Không có kết nối tới mạch ESP32.`);
             await fetch(`http://127.0.0.1:5000/api/devices/${deviceCode}/fail`, { method: 'POST' });
          }
          setPending(prev => ({ ...prev, [deviceCode]: false }));
        }, 1500); 
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
      const response = await fetch(`http://127.0.0.1:5000/api/devices/bulk_control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands: commands, user_id: user.user_id }),
      });

      if (response.ok) {
        setTimeout(async () => {
          const statusRes = await fetch('http://127.0.0.1:5000/api/devices/status');
          const statusData = await statusRes.json();
          let failedDevices = [];
          
          for (let cmd of commands) {
            if (statusData[cmd.device_code] !== actionType) {
              failedDevices.push(cmd.device_code);
              await fetch(`http://127.0.0.1:5000/api/devices/${cmd.device_code}/fail`, { method: 'POST' });
            }
          }

          if (failedDevices.length > 0) {
             alert(`Lệnh gạt nhiều thiết bị THẤT BẠI đối với: ${failedDevices.join(', ')} (Timeout)!`);
          }
          setPending({ LED1: false, LED2: false, LED3: false });
        }, 1500);
      }
    } catch (error) {
       alert("Lỗi server Backend khi điều khiển hàng loạt!");
       setPending({ LED1: false, LED2: false, LED3: false });
    }
  };

  const [points, setPoints] = useState(Array(8).fill({ temp: 0, humidity: 0, light: 0 }))

  return (
    <>
      <header className="topbar">
        <div>
          <h1>IoT MONITORING DASHBOARD</h1>
          <p>ENVIRONMENTAL DATA & ACTUATOR CONTROLS ACTIVE</p>
        </div>
      </header>

      <div className="dashboard-content">
        <section className="sensor-cards">
          <SensorCard title="TEMPERATURE" value={temperature} unit="°C" icon={<Thermometer size={19} />} type="temperature" />
          <SensorCard title="HUMIDITY" value={humidity} unit="%" icon={<Droplets size={19} />} type="humidity" />
          <SensorCard title="ILLUMINANCE" value={light} unit="lux" icon={<Sun size={19} />} type="light" />
        </section>

        <section className="monitor-grid">
          <div className="chart-card">
            
            {/* ĐÃ BỔ SUNG CHÚ THÍCH (LEGEND) CHO BIỂU ĐỒ */}
            <div className="card-heading">
              <h2>Real-Time Sensor Monitoring</h2>
              <div className="legend">
                <span><i className="legend-temp"></i> Temperature</span>
                <span><i className="legend-humidity"></i> Humidity</span>
                <span><i className="legend-light"></i> Light</span>
              </div>
            </div>

            <SensorChart points={points} />
          </div>

          <div className="device-card">
            
            {/* ĐÃ BỔ SUNG NÚT ĐIỀU KHIỂN BẬT/TẮT TẤT CẢ */}
            <div className="device-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h2>Device Control</h2>
               <div style={{ display: 'flex', gap: '8px' }}>
                 <button onClick={() => handleBulkControl('ON')} style={{ padding: '6px 12px', background: 'rgba(0, 255, 131, 0.1)', color: '#00ff83', border: '1px solid #00ff83', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                   <Power size={12}/> TURN ALL ON
                 </button>
                 <button onClick={() => handleBulkControl('OFF')} style={{ padding: '6px 12px', background: 'rgba(255, 70, 81, 0.1)', color: '#ff4651', border: '1px solid #ff4651', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
        <div className="device-icon"><Lightbulb size={19} /></div>
        <div>
          <strong>{name}</strong>
          <span style={{ color: isPending ? '#ffd400' : '' }}>
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
  const width = 700, height = 280, paddingLeft = 50, paddingRight = 50, paddingTop = 20, paddingBottom = 40;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getCoord = (index, value, maxValue) => {
    const x = paddingLeft + (index / (points.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - (value / maxValue) * chartHeight;
    return { x, y };
  };

  const makePoints = (key, maxValue) => points.map((p, i) => {
    const {x, y} = getCoord(i, p[key], maxValue);
    return `${x},${y}`;
  }).join(' ');

  const makeAreaPoints = (key, maxValue) => {
    const pts = makePoints(key, maxValue);
    return `${paddingLeft},${height - paddingBottom} ${pts} ${width - paddingRight},${height - paddingBottom}`;
  };

  return (
    <div className="chart-wrapper">
      <svg className="sensor-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          {/* ĐÃ GIẢM ĐỘ MỜ XUỐNG 0.15 CHO ĐẸP VÀ THANH THOÁT HƠN */}
          <linearGradient id="grad-temp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff4651" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ff4651" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="grad-hum" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00d9ff" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#00d9ff" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="grad-light" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffd400" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ffd400" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <line x1={paddingLeft} y1={height - paddingBottom} x2={width - paddingRight} y2={height - paddingBottom} stroke="#687587" strokeWidth="1.5" />
        <line x1={paddingLeft} y1={paddingTop} x2={paddingLeft} y2={height - paddingBottom} stroke="#687587" strokeWidth="1.5" />
        <line x1={width - paddingRight} y1={paddingTop} x2={width - paddingRight} y2={height - paddingBottom} stroke="#687587" strokeWidth="1.5" />

        {[0, 25, 50, 75, 100].map((value) => {
          const y = paddingTop + chartHeight - (value / 100) * chartHeight;
          const lightValue = value * 10; 
          return (
            <g key={value}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#182333" strokeDasharray="4 4" />
              <text x={paddingLeft - 10} y={y + 4} fill="#687587" fontSize="11" textAnchor="end">{value}</text>
              <text x={width - paddingRight + 10} y={y + 4} fill="#687587" fontSize="11" textAnchor="start">{lightValue}</text>
            </g>
          );
        })}

        {points.map((_, i) => {
          const x = paddingLeft + (i / (points.length - 1)) * chartWidth;
          return (
            <g key={i}>
              <line x1={x} y1={height - paddingBottom} x2={x} y2={height - paddingBottom + 5} stroke="#687587" strokeWidth="1.5" />
              <text x={x} y={height - paddingBottom + 20} fill="#687587" fontSize="10" textAnchor="middle">T-{i+1}</text>
            </g>
          );
        })}

        <polygon points={makeAreaPoints('temp', 100)} fill="url(#grad-temp)" />
        <polygon points={makeAreaPoints('humidity', 100)} fill="url(#grad-hum)" />
        <polygon points={makeAreaPoints('light', 1000)} fill="url(#grad-light)" />

        <polyline points={makePoints('temp', 100)} fill="none" stroke="#ff4651" strokeWidth="2.5" />
        <polyline points={makePoints('humidity', 100)} fill="none" stroke="#00d9ff" strokeWidth="2.5" />
        <polyline points={makePoints('light', 1000)} fill="none" stroke="#ffd400" strokeWidth="2.5" />

        {points.map((p, i) => {
          const t = getCoord(i, p.temp, 100);
          const h = getCoord(i, p.humidity, 100);
          const l = getCoord(i, p.light, 1000);
          return (
            <g key={i}>
              <circle cx={t.x} cy={t.y} r="3.5" fill="#0d141f" stroke="#ff4651" strokeWidth="2" />
              <circle cx={h.x} cy={h.y} r="3.5" fill="#0d141f" stroke="#00d9ff" strokeWidth="2" />
              <circle cx={l.x} cy={l.y} r="3.5" fill="#0d141f" stroke="#ffd400" strokeWidth="2" />
            </g>
          );
        })}
      </svg>
    </div>
  )
}
export default Dashboard