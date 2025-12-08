import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import './HybridPowerDashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
    apiKey: "AIzaSyB9ererNsNonAzH0zQo_GS79XPOyCoMxr4",
    authDomain: "waterdtection.firebaseapp.com",
    databaseURL: "https://waterdtection-default-rtdb.firebaseio.com",
    projectId: "waterdtection",
    storageBucket: "waterdtection.firebasestorage.app",
    messagingSenderId: "690886375729",
    appId: "1:690886375729:web:172c3a47dda6585e4e1810",
    measurementId: "G-TXF33Y6XY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const HybridPowerDashboard = () => {
  const [hybridData, setHybridData] = useState({
    Battery_Percent: 0,
    Car_Current: 0,
    Car_Voltage: 0,
    Wired: 0,
    Wired_Volatge: 0,
    Wireless: 0,
    Wireless_Voltage: 0
  });

  const [historicalData, setHistoricalData] = useState({
    timestamps: [],
    batteryHistory: [],
    carVoltageHistory: [],
    carCurrentHistory: [],
    wiredVoltageHistory: [],
    wirelessVoltageHistory: []
  });

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const hybridRef = ref(database, 'Hybrid_Power');
    
    // Set up real-time listener
    const unsubscribe = onValue(hybridRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setHybridData(data);
        setIsConnected(true);
        
        // Update historical data
        const now = new Date().toLocaleTimeString();
        setHistoricalData(prev => {
          const newTimestamps = [...prev.timestamps, now].slice(-20); // Keep last 20 data points
          const newBatteryHistory = [...prev.batteryHistory, parseInt(data.Battery_Percent) || 0].slice(-20);
          const newCarVoltageHistory = [...prev.carVoltageHistory, parseFloat(data.Car_Voltage) || 0].slice(-20);
          const newCarCurrentHistory = [...prev.carCurrentHistory, parseFloat(data.Car_Current) || 0].slice(-20);
          const newWiredVoltageHistory = [...prev.wiredVoltageHistory, parseFloat(data.Wired_Volatge) || 0].slice(-20);
          const newWirelessVoltageHistory = [...prev.wirelessVoltageHistory, parseFloat(data.Wireless_Voltage) || 0].slice(-20);
          
          return {
            timestamps: newTimestamps,
            batteryHistory: newBatteryHistory,
            carVoltageHistory: newCarVoltageHistory,
            carCurrentHistory: newCarCurrentHistory,
            wiredVoltageHistory: newWiredVoltageHistory,
            wirelessVoltageHistory: newWirelessVoltageHistory
          };
        });
      } else {
        setIsConnected(false);
      }
    }, (error) => {
      console.error("Firebase connection error:", error);
      setIsConnected(false);
    });

    // Cleanup listener on component unmount
    return () => off(hybridRef);
  }, []);

  // Chart configurations
  const batteryTrendChart = {
    labels: historicalData.timestamps,
    datasets: [
      {
        label: 'Battery Percentage',
        data: historicalData.batteryHistory,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const voltageComparisonChart = {
    labels: historicalData.timestamps,
    datasets: [
      {
        label: 'Car Voltage',
        data: historicalData.carVoltageHistory,
        backgroundColor: '#FF5722',
        borderColor: '#D84315',
      },
      {
        label: 'Wired Voltage',
        data: historicalData.wiredVoltageHistory,
        backgroundColor: '#2196F3',
        borderColor: '#1976D2',
      },
      {
        label: 'Wireless Voltage',
        data: historicalData.wirelessVoltageHistory,
        backgroundColor: '#FF9800',
        borderColor: '#F57C00',
      }
    ]
  };

  const currentTrendChart = {
    labels: historicalData.timestamps,
    datasets: [
      {
        label: 'Car Current (A)',
        data: historicalData.carCurrentHistory,
        borderColor: '#607D8B',
        backgroundColor: 'rgba(96, 125, 139, 0.1)',
        tension: 0.3,
        fill: true
      }
    ]
  };

  const powerDistributionChart = {
    labels: ['Wired Power', 'Wireless Power', 'Car Power'],
    datasets: [
      {
        data: [
          hybridData.Wired, 
          hybridData.Wireless, 
          (parseFloat(hybridData.Car_Voltage) * parseFloat(hybridData.Car_Current)) || 0
        ],
        backgroundColor: ['#2196F3', '#FF9800', '#FF5722'],
        borderColor: ['#1976D2', '#F57C00', '#D84315'],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Hybrid Power System Dashboard</h1>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="status-indicator"></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </header>

      {/* Real-time Data Cards */}
      <div className="metrics-grid">
        <div className="metric-card battery">
          <div className="metric-icon">🔋</div>
          <div className="metric-content">
            <h3>Battery Level</h3>
            <div className="metric-value">{hybridData.Battery_Percent}%</div>
            <div className={`battery-indicator ${hybridData.Battery_Percent > 50 ? 'high' : hybridData.Battery_Percent > 20 ? 'medium' : 'low'}`}>
              <div className="battery-fill" style={{ width: `${hybridData.Battery_Percent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="metric-card car-voltage">
          <div className="metric-icon">⚡</div>
          <div className="metric-content">
            <h3>Car Voltage</h3>
            <div className="metric-value">{hybridData.Car_Voltage || 0}V</div>
            <div className="metric-subtext">Electrical System</div>
          </div>
        </div>

        <div className="metric-card car-current">
          <div className="metric-icon">🔌</div>
          <div className="metric-content">
            <h3>Car Current</h3>
            <div className="metric-value">{hybridData.Car_Current || 0}A</div>
            <div className="metric-subtext">Power Draw</div>
          </div>
        </div>

        <div className="metric-card wired">
          <div className="metric-icon">🔗</div>
          <div className="metric-content">
            <h3>Wired Power</h3>
            <div className="metric-value">{hybridData.Wired}</div>
            <div className="metric-subtext">Voltage: {hybridData.Wired_Volatge}V</div>
          </div>
        </div>

        <div className="metric-card wireless">
          <div className="metric-icon">📶</div>
          <div className="metric-content">
            <h3>Wireless Power</h3>
            <div className="metric-value">{hybridData.Wireless}</div>
            <div className="metric-subtext">Voltage: {hybridData.Wireless_Voltage}V</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Battery Level Trend</h3>
          <div className="chart-container">
            <Line data={batteryTrendChart} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Voltage Comparison</h3>
          <div className="chart-container">
            <Bar data={voltageComparisonChart} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Car Current Trend</h3>
          <div className="chart-container">
            <Line data={currentTrendChart} options={chartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <h3>Power Distribution</h3>
          <div className="chart-container">
            <Doughnut data={powerDistributionChart} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="data-table-card">
        <h3>Real-time Data Overview</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
              <th>Unit</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Battery Percentage</td>
              <td>{hybridData.Battery_Percent}</td>
              <td>%</td>
              <td className={`status ${hybridData.Battery_Percent > 50 ? 'good' : hybridData.Battery_Percent > 20 ? 'warning' : 'critical'}`}>
                {hybridData.Battery_Percent > 50 ? 'Good' : hybridData.Battery_Percent > 20 ? 'Warning' : 'Critical'}
              </td>
            </tr>
            <tr>
              <td>Car Voltage</td>
              <td>{hybridData.Car_Voltage || 0}</td>
              <td>V</td>
              <td className={`status ${hybridData.Car_Voltage > 12 ? 'good' : hybridData.Car_Voltage > 10 ? 'warning' : 'critical'}`}>
                {hybridData.Car_Voltage > 12 ? 'Good' : hybridData.Car_Voltage > 10 ? 'Warning' : 'Critical'}
              </td>
            </tr>
            <tr>
              <td>Car Current</td>
              <td>{hybridData.Car_Current || 0}</td>
              <td>A</td>
              <td className="status good">Normal</td>
            </tr>
            <tr>
              <td>Car Power</td>
              <td>{((parseFloat(hybridData.Car_Voltage) * parseFloat(hybridData.Car_Current)) || 0).toFixed(2)}</td>
              <td>W</td>
              <td className="status good">Calculated</td>
            </tr>
            <tr>
              <td>Wired Power</td>
              <td>{hybridData.Wired}</td>
              <td>-</td>
              <td className={`status ${hybridData.Wired > 0 ? 'good' : 'inactive'}`}>
                {hybridData.Wired > 0 ? 'Active' : 'Inactive'}
              </td>
            </tr>
            <tr>
              <td>Wired Voltage</td>
              <td>{hybridData.Wired_Volatge}</td>
              <td>V</td>
              <td className="status good">Normal</td>
            </tr>
            <tr>
              <td>Wireless Power</td>
              <td>{hybridData.Wireless}</td>
              <td>-</td>
              <td className={`status ${hybridData.Wireless > 0 ? 'good' : 'inactive'}`}>
                {hybridData.Wireless > 0 ? 'Active' : 'Inactive'}
              </td>
            </tr>
            <tr>
              <td>Wireless Voltage</td>
              <td>{hybridData.Wireless_Voltage}</td>
              <td>V</td>
              <td className="status good">Normal</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HybridPowerDashboard;
