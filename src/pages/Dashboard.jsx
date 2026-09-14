import { useEffect, useState } from 'react'
import {
  Thermometer,
  Droplets,
  Sun,
  Lightbulb,
  Wifi,
} from 'lucide-react'

function Dashboard() {
  const [temperature, setTemperature] = useState(20.4)
  const [humidity, setHumidity] = useState(80.2)
  const [light, setLight] = useState(1002)

  const [led1, setLed1] = useState(true)
  const [led2, setLed2] = useState(false)
  const [led3, setLed3] = useState(false)

  const [points, setPoints] = useState([
    { temp: 37, humidity: 24, light: 80 },
    { temp: 39, humidity: 20, light: 84 },
    { temp: 35, humidity: 28, light: 74 },
    { temp: 46, humidity: 26, light: 72 },
    { temp: 50, humidity: 32, light: 62 },
    { temp: 48, humidity: 41, light: 67 },
    { temp: 61, humidity: 38, light: 56 },
    { temp: 60, humidity: 40, light: 51 },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setTemperature((value) => {
        const next = value + (Math.random() - 0.5) * 0.4
        return Number(next.toFixed(1))
      })

      setHumidity((value) => {
        const next = value + (Math.random() - 0.5) * 0.8
        return Number(next.toFixed(1))
      })

      setLight((value) => {
        const next = value + Math.round((Math.random() - 0.5) * 8)
        return next
      })

      setPoints((oldPoints) => {
        const last = oldPoints[oldPoints.length - 1]

        const next = {
          temp: Math.max(
            10,
            Math.min(90, last.temp + (Math.random() - 0.5) * 8)
          ),
          humidity: Math.max(
            10,
            Math.min(90, last.humidity + (Math.random() - 0.5) * 8)
          ),
          light: Math.max(
            10,
            Math.min(90, last.light + (Math.random() - 0.5) * 10)
          ),
        }

        return [...oldPoints.slice(1), next]
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [])

  return (
    <>
      <header className="topbar">
        <div>
          <h1>IoT MONITORING DASHBOARD</h1>
          <p>ENVIRONMENTAL DATA & ACTUATOR CONTROLS ACTIVE</p>
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

      <div className="dashboard-content">
        <section className="sensor-cards">
          <SensorCard
            title="TEMPERATURE"
            value={temperature}
            unit="°C"
            icon={<Thermometer size={19} />}
            type="temperature"
          />

          <SensorCard
            title="HUMIDITY"
            value={humidity}
            unit="%"
            icon={<Droplets size={19} />}
            type="humidity"
          />

          <SensorCard
            title="ILLUMINANCE LEVEL"
            value={light}
            unit="lux"
            icon={<Sun size={19} />}
            type="light"
          />
        </section>

        <section className="monitor-grid">
          <div className="chart-card">
            <div className="card-heading">
              <h2>Real-Time Sensor Monitoring</h2>

              <div className="legend">
                <span>
                  <i className="legend-temp"></i>
                  TEMP (°C)
                </span>

                <span>
                  <i className="legend-humidity"></i>
                  HUMIDITY (%)
                </span>

                <span>
                  <i className="legend-light"></i>
                  LIGHT (lux)
                </span>
              </div>
            </div>

            <SensorChart points={points} />
          </div>

          <div className="device-card">
            <div className="device-heading">
              <h2>Device Control</h2>
              <p>DIRECT SMART HOME RELAYS</p>
            </div>

           <DeviceControl
                name="LED 1"
                active={led1}
                onToggle={() => setLed1(!led1)}
            />

            <DeviceControl
            name="LED 2"
            active={led2}
            onToggle={() => setLed2(!led2)}
            />

            <DeviceControl
            name="LED 3"
            active={led3}
            onToggle={() => setLed3(!led3)}
            />
            
          </div>
        </section>
      </div>
    </>
  )
}

function SensorCard({ title, value, unit, icon, type }) {
  return (
    <div className={`sensor-card ${type}`}>
      <div className="sensor-card-top">
        <span>{title}</span>
        <div className="sensor-icon">{icon}</div>
      </div>

      <div className="sensor-value">
        {value} <small>{unit}</small>
      </div>

      <div className="normal-status">
        <span></span>
        NORMAL
      </div>
    </div>
  )
}

function DeviceControl({ name, active, onToggle }) {
  return (
    <div className={`device-item ${active ? 'device-active' : ''}`}>
      <div className="device-name">
        <div className="device-icon">
          <Lightbulb size={19} />
        </div>

        <div>
          <strong>{name}</strong>
          <span>
            {active ? 'ACTIVE // ON' : 'STANDBY // OFF'}
          </span>
        </div>
      </div>

      <button
        className={`toggle ${active ? 'on' : ''}`}
        onClick={onToggle}
        aria-label={`Toggle ${name}`}
      >
        <span></span>
      </button>
    </div>
  )
}

function SensorChart({ points }) {
  const width = 700
  const height = 260
  const paddingLeft = 45
  const paddingRight = 55
  const paddingTop = 20
  const paddingBottom = 38

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom

  const makePoints = (key) => {
    return points
      .map((point, index) => {
        const x =
          paddingLeft +
          (index / (points.length - 1)) * chartWidth

        const y =
          paddingTop +
          chartHeight -
          (point[key] / 100) * chartHeight

        return `${x},${y}`
      })
      .join(' ')
  }

  return (
    <div className="chart-wrapper">
      <svg
        className="sensor-chart"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        {[0, 25, 50, 75, 100].map((value) => {
          const y =
            paddingTop +
            chartHeight -
            (value / 100) * chartHeight

          return (
            <g key={value}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                className="grid-line"
              />

              <text
                x="12"
                y={y + 4}
                className="axis-text"
              >
                {value}
              </text>
            </g>
          )
        })}

        {points.map((_, index) => {
          const x =
            paddingLeft +
            (index / (points.length - 1)) * chartWidth

          return (
            <line
              key={index}
              x1={x}
              y1={paddingTop}
              x2={x}
              y2={height - paddingBottom}
              className="vertical-grid"
            />
          )
        })}

        <polyline
          points={makePoints('temp')}
          className="chart-temp"
        />

        <polyline
          points={makePoints('humidity')}
          className="chart-humidity"
        />

        <polyline
          points={makePoints('light')}
          className="chart-light"
        />

        <line
          x1="485"
          y1={paddingTop}
          x2="485"
          y2={height - paddingBottom}
          className="chart-marker"
        />

        <text x="44" y="245" className="axis-text">
          14:00
        </text>

        <text x="215" y="245" className="axis-text">
          14:01
        </text>

        <text x="385" y="245" className="axis-text">
          14:02
        </text>

        <text x="555" y="245" className="axis-text">
          14:03
        </text>

        <text
          x="655"
          y="30"
          className="lux-axis"
        >
          1200 lx
        </text>

        <text
          x="655"
          y="70"
          className="lux-axis"
        >
          1100 lx
        </text>

        <text
          x="655"
          y="110"
          className="lux-axis"
        >
          1000 lx
        </text>

        <text
          x="655"
          y="150"
          className="lux-axis"
        >
          900 lx
        </text>

        <text
          x="655"
          y="190"
          className="lux-axis"
        >
          800 lx
        </text>
      </svg>

      <div className="chart-tooltip">
        <span>T: 14:02:11</span>
        <b>TEMP: 20.4°C</b>
        <b>HUMID: 80.2%</b>
        <b>LIGHT: 1002 lx</b>
      </div>
    </div>
  )
}

export default Dashboard