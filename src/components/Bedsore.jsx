// import React, { useState, useEffect } from 'react';
// import { initializeApp } from 'firebase/app';
// import { getDatabase, ref, onValue, off } from 'firebase/database';
// import {
//   LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
//   AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
//   Legend, ResponsiveContainer
// } from 'recharts';
// import './Bedsore.css';

// // Firebase Configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCaoBfsLk80kr1iukDbIWYVwGSFINNU2Tk",
//   authDomain: "bedsore-prediction.firebaseapp.com",
//   databaseURL: "https://bedsore-prediction-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "bedsore-prediction",
//   storageBucket: "bedsore-prediction.firebasestorage.app",
//   messagingSenderId: "231922592711",
//   appId: "1:231922592711:web:6ac24cf05bea77a36207e2",
//   measurementId: "G-V0ZVKJQ94S"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// function App() {
//   const [realtimeData, setRealtimeData] = useState({});
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState(null);

//   useEffect(() => {
//     // Reference to your database root or specific path
//     const dataRef = ref(database, '/');

//     // Set up real-time listener
//     const unsubscribe = onValue(dataRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();
//         setRealtimeData(data);
        
//         // Transform data for charts
//         const transformedData = transformDataForCharts(data);
//         setChartData(transformedData);
//         setLastUpdate(new Date().toLocaleString());
//         setLoading(false);
//       } else {
//         console.log("No data available");
//         setLoading(false);
//       }
//     }, (error) => {
//       console.error("Error fetching data:", error);
//       setLoading(false);
//     });

//     // Cleanup listener on unmount
//     return () => {
//       off(dataRef);
//     };
//   }, []);

//   // Transform Firebase data into chart-friendly format
//   const transformDataForCharts = (data) => {
//     if (!data) return [];
    
//     // Example transformation - adjust based on your data structure
//     const chartArray = [];
//     Object.keys(data).forEach((key) => {
//       if (typeof data[key] === 'object') {
//         chartArray.push({
//           name: key,
//           value: Object.keys(data[key]).length || 0,
//           ...data[key]
//         });
//       } else {
//         chartArray.push({
//           name: key,
//           value: data[key]
//         });
//       }
//     });
//     return chartArray;
//   };

//   if (loading) {
//     return (
//       <div className="loading">
//         <h2>Loading Real-Time Data...</h2>
//       </div>
//     );
//   }

//   return (
//     <div className="App">
//       <header className="dashboard-header">
//         <h1>Bedsore Prediction - Real-Time Dashboard</h1>
//         <p className="last-update">Last Updated: {lastUpdate}</p>
//         <div className="status-indicator">
//           <span className="status-dot"></span>
//           <span>Live Connection Active</span>
//         </div>
//       </header>

//       <div className="dashboard-container">
//         {/* Raw Data Display */}
//         <section className="data-section">
//           <h2>📊 Raw Data</h2>
//           <div className="data-display">
//             <pre>{JSON.stringify(realtimeData, null, 2)}</pre>
//           </div>
//         </section>

//         {/* Charts Section */}
//         <section className="charts-section">
//           <h2>📈 Data Visualizations</h2>

//           {/* Line Chart */}
//           <div className="chart-container">
//             <h3>Line Chart - Trend Analysis</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <LineChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Line 
//                   type="monotone" 
//                   dataKey="value" 
//                   stroke="#8884d8" 
//                   strokeWidth={2}
//                   dot={{ r: 4 }}
//                   activeDot={{ r: 6 }}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Bar Chart */}
//           <div className="chart-container">
//             <h3>Bar Chart - Comparison</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="value" fill="#82ca9d" />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Area Chart */}
//           <div className="chart-container">
//             <h3>Area Chart - Distribution</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <AreaChart data={chartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Area 
//                   type="monotone" 
//                   dataKey="value" 
//                   stroke="#8884d8" 
//                   fill="#8884d8" 
//                   fillOpacity={0.6}
//                 />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>

//           {/* Pie Chart */}
//           <div className="chart-container">
//             <h3>Pie Chart - Proportions</h3>
//             <ResponsiveContainer width="100%" height={300}>
//               <PieChart>
//                 <Pie
//                   data={chartData}
//                   cx="50%"
//                   cy="50%"
//                   labelLine={false}
//                   label={({ name, percent }) => 
//                     `${name}: ${(percent * 100).toFixed(0)}%`
//                   }
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                 >
//                   {chartData.map((entry, index) => (
//                     <Cell 
//                       key={`cell-${index}`} 
//                       fill={COLORS[index % COLORS.length]} 
//                     />
//                   ))}
//                 </Pie>
//                 <Tooltip />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

// export default App;





import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Bedsore.css';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaoBfsLk80kr1iukDbIWYVwGSFINNU2Tk",
  authDomain: "bedsore-prediction.firebaseapp.com",
  databaseURL: "https://bedsore-prediction-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bedsore-prediction",
  storageBucket: "bedsore-prediction.firebasestorage.app",
  messagingSenderId: "231922592711",
  appId: "1:231922592711:web:6ac24cf05bea77a36207e2",
  measurementId: "G-V0ZVKJQ94S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function Bedsore() {
  const [realtimeData, setRealtimeData] = useState({});
  const [dataCards, setDataCards] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    const dataRef = ref(database, '/');

    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRealtimeData(data);
        
        // Transform data for cards
        const cards = extractDataForCards(data);
        setDataCards(cards);
        
        // Transform data for charts
        const transformedData = transformDataForCharts(data);
        setChartData(transformedData);
        
        setLastUpdate(new Date().toLocaleString());
        setLoading(false);
      } else {
        console.log("No data available");
        setLoading(false);
      }
    }, (error) => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });

    return () => {
      off(dataRef);
    };
  }, []);

  // Extract data for individual cards
  const extractDataForCards = (data) => {
    if (!data) return [];
    
    const cards = [];
    
    // Recursively extract values
    const extractValues = (obj, parentKey = '') => {
      Object.keys(obj).forEach((key) => {
        const fullKey = parentKey ? `${parentKey} > ${key}` : key;
        
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          // If it's an object, recurse
          extractValues(obj[key], fullKey);
        } else {
          // If it's a primitive value, add as card
          cards.push({
            id: cards.length,
            title: key.replace(/_/g, ' ').toUpperCase(),
            value: obj[key],
            category: parentKey || 'General',
            icon: getIconForKey(key),
            color: getColorForIndex(cards.length)
          });
        }
      });
    };
    
    extractValues(data);
    return cards;
  };

  // Get icon based on key name
  const getIconForKey = (key) => {
    const keyLower = key.toLowerCase();
    if (keyLower.includes('temp') || keyLower.includes('temperature')) return '🌡️';
    if (keyLower.includes('pressure')) return '💉';
    if (keyLower.includes('humidity')) return '💧';
    if (keyLower.includes('patient')) return '👤';
    if (keyLower.includes('status')) return '📊';
    if (keyLower.includes('alert') || keyLower.includes('warning')) return '⚠️';
    if (keyLower.includes('time') || keyLower.includes('date')) return '⏰';
    if (keyLower.includes('score') || keyLower.includes('risk')) return '📈';
    return '📋';
  };

  // Get color based on index
  const getColorForIndex = (index) => {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#4facfe',
      '#43e97b', '#fa709a', '#fee140', '#30cfd0',
      '#a8edea', '#fed6e3', '#c3cfe2', '#f38181'
    ];
    return colors[index % colors.length];
  };

  // Transform data for charts
  const transformDataForCharts = (data) => {
    if (!data) return [];
    
    const chartArray = [];
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'object') {
        chartArray.push({
          name: key,
          value: Object.keys(data[key]).length || 0,
        });
      } else if (typeof data[key] === 'number') {
        chartArray.push({
          name: key,
          value: data[key]
        });
      }
    });
    return chartArray;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <h2>Loading Real-Time Data...</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="dashboard-header">
        <h1>🏥 Bedsore Prediction Dashboard</h1>
        <p className="last-update">Last Updated: {lastUpdate}</p>
        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>Live Connection Active</span>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Data Cards Section */}
        <section className="cards-section">
          <h2>📊 Real-Time Data Metrics</h2>
          <div className="cards-grid">
            {dataCards.map((card) => (
              <div 
                className="data-card" 
                key={card.id}
                style={{ 
                  borderTop: `4px solid ${card.color}`,
                }}
              >
                <div className="card-header">
                  <span className="card-icon">{card.icon}</span>
                  <span className="card-category">{card.category}</span>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-value">{card.value}</p>
                </div>
                <div className="card-footer">
                  <span className="live-badge">● LIVE</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Charts Section */}
        {chartData.length > 0 && (
          <section className="charts-section">
            <h2>📈 Data Visualizations</h2>

            <div className="charts-grid">
              {/* Line Chart */}
              <div className="chart-card">
                <h3>📉 Trend Analysis</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#667eea" 
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="chart-card">
                <h3>📊 Comparison View</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#43e97b" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Area Chart */}
              <div className="chart-card">
                <h3>📈 Distribution Analysis</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#f093fb" 
                      fill="#f093fb" 
                      fillOpacity={0.6}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default Bedsore;
