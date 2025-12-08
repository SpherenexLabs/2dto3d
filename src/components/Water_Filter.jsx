import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBi4imuMT5imCT-8IBULdyFqj-ZZtl68Do",
  authDomain: "regal-welder-453313-d6.firebaseapp.com",
  databaseURL: "https://regal-welder-453313-d6-default-rtdb.firebaseio.com",
  projectId: "regal-welder-453313-d6",
  storageBucket: "regal-welder-453313-d6.firebasestorage.app",
  messagingSenderId: "981360128010",
  appId: "1:981360128010:web:5176a72c013f26b8dbeff3",
  measurementId: "G-T67CCEJ8LW"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const WaterFilterDashboard = () => {
  const [waterData, setWaterData] = useState({
    Gas: 0,
    Ph: 0,
    Reason: "",
    Safe: false,
    TDS: 0,
    Turb: 0
  });

  const [historyData, setHistoryData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const waterRef = ref(database, 'Water_filter');
    
    const unsubscribe = onValue(waterRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const newData = {
          Gas: parseFloat(data.Gas) || 0,
          Ph: parseFloat(data.Ph) || 0,
          Reason: data.Reason || "",
          Safe: data.Safe === true || data.Safe === "true",
          TDS: parseFloat(data.TDS) || 0,
          Turb: parseFloat(data.Turb) || 0
        };
        
        setWaterData(newData);

        // Update history
        const timestamp = new Date().toLocaleTimeString();
        setHistoryData(prev => {
          const updated = [...prev, {
            time: timestamp,
            Gas: newData.Gas,
            Ph: newData.Ph,
            TDS: newData.TDS,
            Turb: newData.Turb
          }];
          return updated.slice(-20);
        });

        // Generate alerts based on water quality
        generateAlerts(newData);
      }
    });

    return () => unsubscribe();
  }, []);

  const generateAlerts = (data) => {
    let newAlerts = [];
    const timestamp = new Date().toLocaleString('en-IN');

    // pH alerts
    if (data.Ph < 6.5 || data.Ph > 8.5) {
      newAlerts.push({
        type: 'danger',
        icon: '⚠️',
        title: 'pH Level Critical!',
        message: `pH level is ${data.Ph.toFixed(2)}. Safe drinking water pH should be between 6.5-8.5. ${data.Ph < 6.5 ? 'Water is too acidic!' : 'Water is too alkaline!'}`,
        timestamp: timestamp
      });
    } else if (data.Ph < 7 || data.Ph > 8) {
      newAlerts.push({
        type: 'warning',
        icon: '📊',
        title: 'pH Level Suboptimal',
        message: `pH level is ${data.Ph.toFixed(2)}. While acceptable, ideal pH is 7.0-8.0 for drinking water.`,
        timestamp: timestamp
      });
    }

    // TDS alerts
    if (data.TDS > 500) {
      newAlerts.push({
        type: 'danger',
        icon: '💧',
        title: 'High TDS Level!',
        message: `TDS is ${data.TDS.toFixed(2)} ppm. Exceeds safe limit of 500 ppm. Water may contain excessive dissolved solids. Replace filter immediately!`,
        timestamp: timestamp
      });
    } else if (data.TDS > 300) {
      newAlerts.push({
        type: 'warning',
        icon: '💧',
        title: 'Elevated TDS Level',
        message: `TDS is ${data.TDS.toFixed(2)} ppm. Above optimal range. Consider filter replacement soon.`,
        timestamp: timestamp
      });
    }

    // Turbidity alerts
    if (data.Turb > 100) {
      newAlerts.push({
        type: 'danger',
        icon: '🌊',
        title: 'High Turbidity Alert!',
        message: `Turbidity is ${data.Turb} NTU. Water is cloudy/unclear. Filter needs immediate replacement!`,
        timestamp: timestamp
      });
    } else if (data.Turb > 50) {
      newAlerts.push({
        type: 'warning',
        icon: '🌊',
        title: 'Turbidity Warning',
        message: `Turbidity is ${data.Turb} NTU. Water clarity is decreasing. Monitor filter condition.`,
        timestamp: timestamp
      });
    }

    // Gas sensor alerts
    if (data.Gas > 2) {
      newAlerts.push({
        type: 'danger',
        icon: '☁️',
        title: 'Gas Detection Alert!',
        message: `Gas level is ${data.Gas.toFixed(2)}. Elevated gas levels detected. Check for contamination!`,
        timestamp: timestamp
      });
    }

    // Overall safety alert
    if (!data.Safe) {
      newAlerts.push({
        type: 'critical',
        icon: '🚨',
        title: 'WATER NOT SAFE TO DRINK!',
        message: `Reason: ${data.Reason}. Do not consume this water until issues are resolved!`,
        timestamp: timestamp
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => {
        const combined = [...newAlerts, ...prev];
        const unique = combined.filter((item, index, self) =>
          index === self.findIndex((t) => t.title === item.title)
        );
        return unique.slice(0, 10);
      });
    }
  };

  const getStatusColor = (safe) => {
    return safe ? '#4CAF50' : '#F44336';
  };

  const getQualityLevel = (value, type) => {
    switch(type) {
      case 'pH':
        if (value >= 7.0 && value <= 8.0) return { level: 'Excellent', color: '#4CAF50' };
        if (value >= 6.5 && value <= 8.5) return { level: 'Good', color: '#8BC34A' };
        if (value >= 6.0 && value <= 9.0) return { level: 'Fair', color: '#FF9800' };
        return { level: 'Poor', color: '#F44336' };
      
      case 'TDS':
        if (value < 150) return { level: 'Excellent', color: '#4CAF50' };
        if (value < 300) return { level: 'Good', color: '#8BC34A' };
        if (value < 500) return { level: 'Fair', color: '#FF9800' };
        return { level: 'Poor', color: '#F44336' };
      
      case 'Turb':
        if (value < 25) return { level: 'Excellent', color: '#4CAF50' };
        if (value < 50) return { level: 'Good', color: '#8BC34A' };
        if (value < 100) return { level: 'Fair', color: '#FF9800' };
        return { level: 'Poor', color: '#F44336' };
      
      default:
        return { level: 'Unknown', color: '#9E9E9E' };
    }
  };

  const getAlertStyle = (type) => {
    switch(type) {
      case 'critical':
        return { backgroundColor: '#d32f2f', borderColor: '#b71c1c' };
      case 'danger':
        return { backgroundColor: '#f44336', borderColor: '#d32f2f' };
      case 'warning':
        return { backgroundColor: '#ff9800', borderColor: '#f57c00' };
      default:
        return { backgroundColor: '#2196F3', borderColor: '#1976D2' };
    }
  };

  const phQuality = getQualityLevel(waterData.Ph, 'pH');
  const tdsQuality = getQualityLevel(waterData.TDS, 'TDS');
  const turbQuality = getQualityLevel(waterData.Turb, 'Turb');

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
          min-height: 100vh;
        }

        .dashboard-container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 20px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background: white;
          padding: 20px 30px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .dashboard-header h1 {
          color: #333;
          font-size: 28px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #4CAF50;
          font-weight: 600;
        }

        .live-dot {
          width: 12px;
          height: 12px;
          background: #4CAF50;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        .alerts-container {
          margin-bottom: 30px;
        }

        .alert-card {
          background: white;
          border-radius: 15px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          border-left: 6px solid;
          animation: slideIn 0.5s ease-out;
          transition: all 0.3s ease;
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .alert-card:hover {
          transform: translateX(10px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .alert-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 10px;
        }

        .alert-icon {
          font-size: 32px;
          animation: bounce 1s infinite;
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .alert-title {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }

        .alert-message {
          font-size: 16px;
          color: #555;
          line-height: 1.6;
          margin-left: 47px;
        }

        .alert-timestamp {
          font-size: 12px;
          color: #888;
          margin-left: 47px;
          margin-top: 5px;
        }

        .status-banner {
          background: white;
          border-radius: 15px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          text-align: center;
        }

        .status-icon {
          font-size: 80px;
          margin-bottom: 15px;
        }

        .status-text {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .status-reason {
          font-size: 18px;
          color: #666;
          font-style: italic;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .metric-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .metric-label {
          font-size: 14px;
          color: #888;
          font-weight: 600;
          text-transform: uppercase;
        }

        .quality-badge {
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          color: white;
        }

        .metric-value {
          font-size: 48px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }

        .metric-unit {
          font-size: 16px;
          color: #888;
        }

        .metric-description {
          font-size: 13px;
          color: #666;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #f0f0f0;
        }

        .chart-card {
          background: white;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          margin-bottom: 20px;
        }

        .chart-title {
          color: #333;
          font-size: 22px;
          font-weight: 600;
          margin-bottom: 20px;
          text-align: center;
          border-bottom: 3px solid #1e88e5;
          padding-bottom: 10px;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 15px;
          }
          
          .metrics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>
            <span>💧</span>
            Water Filter Monitoring Dashboard
          </h1>
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span>Live</span>
          </div>
        </div>

        {/* Water Safety Status Banner */}
        <div className="status-banner" style={{ backgroundColor: waterData.Safe ? '#E8F5E9' : '#FFEBEE' }}>
          <div className="status-icon">{waterData.Safe ? '✅' : '❌'}</div>
          <div className="status-text" style={{ color: getStatusColor(waterData.Safe) }}>
            {waterData.Safe ? 'WATER IS SAFE TO DRINK' : 'WATER IS NOT SAFE'}
          </div>
          {waterData.Reason && (
            <div className="status-reason">Reason: {waterData.Reason}</div>
          )}
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="alerts-container">
            {alerts.map((alert, index) => (
              <div 
                key={index} 
                className="alert-card" 
                style={getAlertStyle(alert.type)}
              >
                <div className="alert-header">
                  <span className="alert-icon">{alert.icon}</span>
                  <span className="alert-title">{alert.title}</span>
                </div>
                <p className="alert-message">{alert.message}</p>
                <p className="alert-timestamp">{alert.timestamp}</p>
              </div>
            ))}
          </div>
        )}

        {/* Water Quality Metrics */}
        <div className="metrics-grid">
          {/* pH Level */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">pH Level</span>
              <span className="quality-badge" style={{ backgroundColor: phQuality.color }}>
                {phQuality.level}
              </span>
            </div>
            <div className="metric-value">
              {waterData.Ph.toFixed(2)}
              <span className="metric-unit"> pH</span>
            </div>
            <div className="metric-description">
              Optimal range: 7.0 - 8.0 pH<br/>
              Safe range: 6.5 - 8.5 pH
            </div>
          </div>

          {/* TDS Level */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">TDS Level</span>
              <span className="quality-badge" style={{ backgroundColor: tdsQuality.color }}>
                {tdsQuality.level}
              </span>
            </div>
            <div className="metric-value">
              {waterData.TDS.toFixed(2)}
              <span className="metric-unit"> ppm</span>
            </div>
            <div className="metric-description">
              Total Dissolved Solids<br/>
              Safe limit: &lt; 500 ppm
            </div>
          </div>

          {/* Turbidity Level */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Turbidity</span>
              <span className="quality-badge" style={{ backgroundColor: turbQuality.color }}>
                {turbQuality.level}
              </span>
            </div>
            <div className="metric-value">
              {waterData.Turb}
              <span className="metric-unit"> NTU</span>
            </div>
            <div className="metric-description">
              Water clarity measurement<br/>
              Lower is better
            </div>
          </div>

          {/* Gas Sensor */}
          <div className="metric-card">
            <div className="metric-header">
              <span className="metric-label">Gas Sensor</span>
              <span className="quality-badge" style={{ backgroundColor: waterData.Gas < 2 ? '#4CAF50' : '#F44336' }}>
                {waterData.Gas < 2 ? 'Normal' : 'Alert'}
              </span>
            </div>
            <div className="metric-value">
              {waterData.Gas.toFixed(2)}
              <span className="metric-unit"> ppm</span>
            </div>
            <div className="metric-description">
              Detects volatile compounds<br/>
              Safe level: &lt; 2.0 ppm
            </div>
          </div>
        </div>

        {/* pH Level History Chart */}
        <div className="chart-card">
          <h3 className="chart-title">📊 pH Level Over Time</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8BC34A" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8BC34A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{fontSize: 12}} />
              <YAxis domain={[0, 14]} label={{ value: 'pH Level', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Ph" stroke="#8BC34A" fillOpacity={1} fill="url(#colorPh)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* TDS Level History Chart */}
        <div className="chart-card">
          <h3 className="chart-title">💧 TDS Level Over Time</h3>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{fontSize: 12}} />
              <YAxis label={{ value: 'TDS (ppm)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="TDS" stroke="#2196F3" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Turbidity History Chart */}
        <div className="chart-card">
          <h3 className="chart-title">🌊 Turbidity Over Time</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{fontSize: 12}} />
              <YAxis label={{ value: 'Turbidity (NTU)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Turb" fill="#FF9800" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gas Sensor History Chart */}
        <div className="chart-card">
          <h3 className="chart-title">☁️ Gas Level Over Time</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={historyData}>
              <defs>
                <linearGradient id="colorGas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9C27B0" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#9C27B0" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{fontSize: 12}} />
              <YAxis label={{ value: 'Gas (ppm)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Gas" stroke="#9C27B0" fillOpacity={1} fill="url(#colorGas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* All Parameters Combined */}
        <div className="chart-card">
          <h3 className="chart-title">📈 All Water Quality Parameters</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{fontSize: 12}} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Ph" stroke="#8BC34A" strokeWidth={2} dot={false} name="pH" />
              <Line type="monotone" dataKey="TDS" stroke="#2196F3" strokeWidth={2} dot={false} name="TDS (ppm)" />
              <Line type="monotone" dataKey="Gas" stroke="#9C27B0" strokeWidth={2} dot={false} name="Gas (ppm)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default WaterFilterDashboard;
