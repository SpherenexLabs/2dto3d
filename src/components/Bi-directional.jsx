// // // Import Firebase modules and Recharts at the top
// // import React, { useState, useEffect } from 'react';
// // import { initializeApp, getApps, getApp } from 'firebase/app';
// // import { getDatabase, ref, onValue, off } from 'firebase/database';
// // import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// // const FirebaseANPRDashboard = () => {
// //   const [anprData, setAnprData] = useState({
// //     CAR: {
// //       Battery: "0",
// //       Charging: "IDLE",
// //       Current: "0",
// //       Power: "0",
// //       Voltage: "0",
// //       sample: 0,
// //       ts_ms: 0,
// //       writer: ""
// //     },
// //     Charging_Station: {
// //       Current: "0 mA",
// //       Power: "0.00 W",
// //       Source: "Grid",
// //       Station_1: "OFF",
// //       Station_2: "OFF",
// //       Voltage: "0.00 V"
// //     }
// //   });

// //   const [connectionStatus, setConnectionStatus] = useState('Connecting...');
// //   const [lastUpdated, setLastUpdated] = useState(null);
// //   const [error, setError] = useState(null);
  
// //   // Chart data state - store last 20 data points
// //   const [chartData, setChartData] = useState([]);
// //   const [maxDataPoints] = useState(20);

// //   useEffect(() => {
// //     // Firebase configuration - Replace with your actual config
// //     const firebaseConfig = {
// //       apiKey: "AIzaSyB9ererNsNonAzH0zQo_GS79XPOyCoMxr4",
// //             authDomain: "waterdtection.firebaseapp.com",
// //             databaseURL: "https://waterdtection-default-rtdb.firebaseio.com",
// //             projectId: "waterdtection",
// //             storageBucket: "waterdtection.firebasestorage.app",
// //             messagingSenderId: "690886375729",
// //             appId: "1:690886375729:web:172c3a47dda6585e4e1810",
// //             measurementId: "G-TXF33Y6XY0"
// //     };

// //     let unsubscribe = null;

// //     try {
// //       // Check if Firebase app is already initialized
// //       let app;
// //       if (getApps().length === 0) {
// //         // Initialize Firebase only if no app exists
// //         app = initializeApp(firebaseConfig);
// //         console.log('Firebase initialized');
// //       } else {
// //         // Use existing Firebase app
// //         app = getApp();
// //         console.log('Using existing Firebase app');
// //       }
      
// //       const database = getDatabase(app);
      
// //       // Reference to ANPR data
// //       const anprRef = ref(database, 'ANPR');
      
// //       // Listen for real-time updates
// //       unsubscribe = onValue(anprRef, (snapshot) => {
// //         const data = snapshot.val();
        
// //         if (data) {
// //           console.log('Firebase data received:', data);
// //           setAnprData(data);
// //           setConnectionStatus('Connected');
// //           const now = new Date();
// //           setLastUpdated(now);
// //           setError(null);
          
// //           // Add data point to chart
// //           const chartPoint = {
// //             time: now.toLocaleTimeString(),
// //             timestamp: now.getTime(),
// //             carCurrent: parseFloat(data.CAR?.Current || 0),
// //             carVoltage: parseFloat(data.CAR?.Voltage || 0),
// //             carPower: parseFloat(data.CAR?.Power || 0),
// //             stationCurrent: parseFloat(data.Charging_Station?.Current?.replace(' mA', '') || 0) / 1000, // Convert mA to A
// //             stationVoltage: parseFloat(data.Charging_Station?.Voltage?.replace(' V', '') || 0),
// //             stationPower: parseFloat(data.Charging_Station?.Power?.replace(' W', '') || 0)
// //           };
          
// //           setChartData(prevData => {
// //             const newData = [...prevData, chartPoint];
// //             // Keep only the last maxDataPoints
// //             return newData.slice(-maxDataPoints);
// //           });
// //         } else {
// //           console.log('No data available');
// //           setConnectionStatus('No Data Available');
// //         }
// //       }, (error) => {
// //         console.error('Firebase error:', error);
// //         setConnectionStatus('Connection Error');
// //         setError(error.message);
// //       });

// //     } catch (err) {
// //       console.error('Firebase initialization error:', err);
// //       setConnectionStatus('Initialization Error');
// //       setError(err.message);
// //     }

// //     // Cleanup function
// //     return () => {
// //       if (unsubscribe) {
// //         unsubscribe();
// //       }
// //     };
// //   }, []);

// //   const getStatusColor = (status) => {
// //     switch (status.toLowerCase()) {
// //       case 'charging': return '#4CAF50';
// //       case 'idle': return '#FF9800';
// //       case 'on': return '#4CAF50';
// //       case 'off': return '#F44336';
// //       default: return '#9E9E9E';
// //     }
// //   };

// //   const formatTimestamp = (timestamp) => {
// //     if (!timestamp) return 'Never';
// //     return timestamp.toLocaleTimeString();
// //   };

// //   return (
// //     <div style={styles.dashboard}>
// //       <div style={styles.header}>
// //         <h1 style={styles.title}>ANPR Real-time Dashboard</h1>
// //         <div style={styles.statusBar}>
// //           <div style={{
// //             ...styles.statusIndicator,
// //             backgroundColor: connectionStatus.includes('Connected') ? '#4CAF50' : '#F44336'
// //           }}>
// //             {connectionStatus}
// //           </div>
// //           <div style={styles.lastUpdated}>
// //             Last Updated: {formatTimestamp(lastUpdated)}
// //           </div>
// //         </div>
        
// //         {error && (
// //           <div style={styles.errorMessage}>
// //             <strong>Error:</strong> {error}
// //           </div>
// //         )}
// //       </div>

// //       <div style={styles.gridContainer}>
// //         {/* CAR Section */}
// //         <div style={styles.card}>
// //           <div style={styles.cardHeader}>
// //             <h2 style={styles.cardTitle}>🚗 CAR</h2>
// //           </div>
// //           <div style={styles.cardContent}>
// //             <div style={styles.dataGrid}>
// //               <div style={styles.dataItem}>
// //                 <span style={styles.dataLabel}>Battery:</span>
// //                 <span style={{
// //                   ...styles.dataValue,
// //                   color: parseInt(anprData.CAR.Battery) > 20 ? '#4CAF50' : '#F44336'
// //                 }}>
// //                   {anprData.CAR.Battery}%
// //                 </span>
// //               </div>
              
// //               <div style={styles.dataItem}>
// //                 <span style={styles.dataLabel}>Charging:</span>
// //                 <span style={{
// //                   ...styles.dataValue,
// //                   ...styles.statusBadge,
// //                   backgroundColor: getStatusColor(anprData.CAR.Charging)
// //                 }}>
// //                   {anprData.CAR.Charging}
// //                 </span>
// //               </div>
              
// //               <div style={styles.dataItem}>
// //                 <span style={styles.dataLabel}>Current:</span>
// //                 <span style={styles.dataValue}>{anprData.CAR.Current} A</span>
// //               </div>
              
// //               <div style={styles.dataItem}>
// //                 <span style={styles.dataLabel}>Power:</span>
// //                 <span style={styles.dataValue}>{anprData.CAR.Power} W</span>
// //               </div>
              
// //               <div style={styles.dataItem}>
// //                 <span style={styles.dataLabel}>Voltage:</span>
// //                 <span style={styles.dataValue}>{anprData.CAR.Voltage} V</span>
// //               </div>
              
// //               <div style={styles.dataItem}>
// //                 <span style={styles.dataLabel}>Sample:</span>
// //                 <span style={styles.dataValue}>{anprData.CAR.sample}</span>
// //               </div>
              
// //               <div style={styles.dataItem}>
// //                 <span style={styles.dataLabel}>Writer ID:</span>
// //                 <span style={styles.dataValue}>{anprData.CAR.writer}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Charging Station Section */}
// //         <div style={styles.card}>
// //           <div style={styles.cardHeader}>
// //             <h2 style={styles.cardTitle}>⚡ Charging Station</h2>
// //           </div>
// //           <div style={styles.cardContent}>
// //             <div style={styles.dataGrid}>
// //               <div style={styles.dataItem}>
// //                 <span style={styles.dataLabel}>Current:</span>
// //                 <span style={styles.dataValue}>{anprData.Charging_Station.Current}</span>
// //               </div>
              
// //               <div style={styles.dataItem}>
// //                 <span style={styles.dataLabel}>Power:</span>
// //                 <span style={styles.dataValue}>{anprData.Charging_Station.Power}</span>
// //               </div>
              
// //               <div style={styles.dataItem}>
// //                 <span style={styles.dataLabel}>Source:</span>
// //                 <span style={styles.dataValue}>{anprData.Charging_Station.Source}</span>
// //               </div>
              
// //               <div style={styles.dataItem}>
// //                 <span style={styles.dataLabel}>Station 1:</span>
// //                 <span style={{
// //                   ...styles.dataValue,
// //                   ...styles.statusBadge,
// //                   backgroundColor: getStatusColor(anprData.Charging_Station.Station_1)
// //                 }}>
// //                   {anprData.Charging_Station.Station_1}
// //                 </span>
// //               </div>
              
// //               <div style={styles.dataItem}>
// //                 <span style={styles.dataLabel}>Station 2:</span>
// //                 <span style={{
// //                   ...styles.dataValue,
// //                   ...styles.statusBadge,
// //                   backgroundColor: getStatusColor(anprData.Charging_Station.Station_2)
// //                 }}>
// //                   {anprData.Charging_Station.Station_2}
// //                 </span>
// //               </div>
              
// //               <div style={styles.dataItem}>
// //                 <span style={styles.dataLabel}>Voltage:</span>
// //                 <span style={styles.dataValue}>{anprData.Charging_Station.Voltage}</span>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Charts Section */}
// //       <div style={styles.chartsSection}>
// //         {/* Car Charts */}
// //         <div style={styles.chartSection}>
// //           <h2 style={styles.sectionTitle}>🚗 Car Metrics</h2>
// //           <div style={styles.chartsGrid}>
// //             {/* Car Current Chart */}
// //             <div style={styles.chartCard}>
// //               <h3 style={styles.chartTitle}>Current (A)</h3>
// //               <div style={styles.chartContainer}>
// //                 <ResponsiveContainer width="100%" height={250}>
// //                   <LineChart data={chartData}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
// //                     <XAxis 
// //                       dataKey="time" 
// //                       stroke="#666"
// //                       fontSize={12}
// //                       interval="preserveStartEnd"
// //                     />
// //                     <YAxis stroke="#666" fontSize={12} />
// //                     <Tooltip 
// //                       labelStyle={{ color: '#333' }}
// //                       contentStyle={{ 
// //                         backgroundColor: '#fff', 
// //                         border: '1px solid #ddd',
// //                         borderRadius: '8px'
// //                       }}
// //                     />
// //                     <Line 
// //                       type="monotone" 
// //                       dataKey="carCurrent" 
// //                       stroke="#2196F3" 
// //                       strokeWidth={3}
// //                       dot={{ fill: '#2196F3', strokeWidth: 2, r: 5 }}
// //                       activeDot={{ r: 7, stroke: '#2196F3', strokeWidth: 2 }}
// //                     />
// //                   </LineChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </div>

// //             {/* Car Voltage Chart */}
// //             <div style={styles.chartCard}>
// //               <h3 style={styles.chartTitle}>Voltage (V)</h3>
// //               <div style={styles.chartContainer}>
// //                 <ResponsiveContainer width="100%" height={250}>
// //                   <LineChart data={chartData}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
// //                     <XAxis 
// //                       dataKey="time" 
// //                       stroke="#666"
// //                       fontSize={12}
// //                       interval="preserveStartEnd"
// //                     />
// //                     <YAxis stroke="#666" fontSize={12} />
// //                     <Tooltip 
// //                       labelStyle={{ color: '#333' }}
// //                       contentStyle={{ 
// //                         backgroundColor: '#fff', 
// //                         border: '1px solid #ddd',
// //                         borderRadius: '8px'
// //                       }}
// //                     />
// //                     <Line 
// //                       type="monotone" 
// //                       dataKey="carVoltage" 
// //                       stroke="#4CAF50" 
// //                       strokeWidth={3}
// //                       dot={{ fill: '#4CAF50', strokeWidth: 2, r: 5 }}
// //                       activeDot={{ r: 7, stroke: '#4CAF50', strokeWidth: 2 }}
// //                     />
// //                   </LineChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </div>

// //             {/* Car Power Chart */}
// //             <div style={styles.chartCard}>
// //               <h3 style={styles.chartTitle}>Power (W)</h3>
// //               <div style={styles.chartContainer}>
// //                 <ResponsiveContainer width="100%" height={250}>
// //                   <LineChart data={chartData}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
// //                     <XAxis 
// //                       dataKey="time" 
// //                       stroke="#666"
// //                       fontSize={12}
// //                       interval="preserveStartEnd"
// //                     />
// //                     <YAxis stroke="#666" fontSize={12} />
// //                     <Tooltip 
// //                       labelStyle={{ color: '#333' }}
// //                       contentStyle={{ 
// //                         backgroundColor: '#fff', 
// //                         border: '1px solid #ddd',
// //                         borderRadius: '8px'
// //                       }}
// //                     />
// //                     <Line 
// //                       type="monotone" 
// //                       dataKey="carPower" 
// //                       stroke="#F44336" 
// //                       strokeWidth={3}
// //                       dot={{ fill: '#F44336', strokeWidth: 2, r: 5 }}
// //                       activeDot={{ r: 7, stroke: '#F44336', strokeWidth: 2 }}
// //                     />
// //                   </LineChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Charging Station Charts */}
// //         <div style={styles.chartSection}>
// //           <h2 style={styles.sectionTitle}>⚡ Charging Station Metrics</h2>
// //           <div style={styles.chartsGrid}>
// //             {/* Station Current Chart */}
// //             <div style={styles.chartCard}>
// //               <h3 style={styles.chartTitle}>Current (A)</h3>
// //               <div style={styles.chartContainer}>
// //                 <ResponsiveContainer width="100%" height={250}>
// //                   <LineChart data={chartData}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
// //                     <XAxis 
// //                       dataKey="time" 
// //                       stroke="#666"
// //                       fontSize={12}
// //                       interval="preserveStartEnd"
// //                     />
// //                     <YAxis stroke="#666" fontSize={12} />
// //                     <Tooltip 
// //                       labelStyle={{ color: '#333' }}
// //                       contentStyle={{ 
// //                         backgroundColor: '#fff', 
// //                         border: '1px solid #ddd',
// //                         borderRadius: '8px'
// //                       }}
// //                     />
// //                     <Line 
// //                       type="monotone" 
// //                       dataKey="stationCurrent" 
// //                       stroke="#FF9800" 
// //                       strokeWidth={3}
// //                       dot={{ fill: '#FF9800', strokeWidth: 2, r: 5 }}
// //                       activeDot={{ r: 7, stroke: '#FF9800', strokeWidth: 2 }}
// //                     />
// //                   </LineChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </div>

// //             {/* Station Voltage Chart */}
// //             <div style={styles.chartCard}>
// //               <h3 style={styles.chartTitle}>Voltage (V)</h3>
// //               <div style={styles.chartContainer}>
// //                 <ResponsiveContainer width="100%" height={250}>
// //                   <LineChart data={chartData}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
// //                     <XAxis 
// //                       dataKey="time" 
// //                       stroke="#666"
// //                       fontSize={12}
// //                       interval="preserveStartEnd"
// //                     />
// //                     <YAxis stroke="#666" fontSize={12} />
// //                     <Tooltip 
// //                       labelStyle={{ color: '#333' }}
// //                       contentStyle={{ 
// //                         backgroundColor: '#fff', 
// //                         border: '1px solid #ddd',
// //                         borderRadius: '8px'
// //                       }}
// //                     />
// //                     <Line 
// //                       type="monotone" 
// //                       dataKey="stationVoltage" 
// //                       stroke="#9C27B0" 
// //                       strokeWidth={3}
// //                       dot={{ fill: '#9C27B0', strokeWidth: 2, r: 5 }}
// //                       activeDot={{ r: 7, stroke: '#9C27B0', strokeWidth: 2 }}
// //                     />
// //                   </LineChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </div>

// //             {/* Station Power Chart */}
// //             <div style={styles.chartCard}>
// //               <h3 style={styles.chartTitle}>Power (W)</h3>
// //               <div style={styles.chartContainer}>
// //                 <ResponsiveContainer width="100%" height={250}>
// //                   <LineChart data={chartData}>
// //                     <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
// //                     <XAxis 
// //                       dataKey="time" 
// //                       stroke="#666"
// //                       fontSize={12}
// //                       interval="preserveStartEnd"
// //                     />
// //                     <YAxis stroke="#666" fontSize={12} />
// //                     <Tooltip 
// //                       labelStyle={{ color: '#333' }}
// //                       contentStyle={{ 
// //                         backgroundColor: '#fff', 
// //                         border: '1px solid #ddd',
// //                         borderRadius: '8px'
// //                       }}
// //                     />
// //                     <Line 
// //                       type="monotone" 
// //                       dataKey="stationPower" 
// //                       stroke="#00BCD4" 
// //                       strokeWidth={3}
// //                       dot={{ fill: '#00BCD4', strokeWidth: 2, r: 5 }}
// //                       activeDot={{ r: 7, stroke: '#00BCD4', strokeWidth: 2 }}
// //                     />
// //                   </LineChart>
// //                 </ResponsiveContainer>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const styles = {
// //   dashboard: {
// //     minHeight: '100vh',
// //     backgroundColor: '#f5f5f5',
// //     padding: '20px',
// //     fontFamily: 'Arial, sans-serif'
// //   },
// //   header: {
// //     marginBottom: '30px'
// //   },
// //   title: {
// //     color: '#333',
// //     textAlign: 'center',
// //     marginBottom: '20px',
// //     fontSize: '2.5rem',
// //     fontWeight: 'bold'
// //   },
// //   statusBar: {
// //     display: 'flex',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     gap: '20px',
// //     flexWrap: 'wrap'
// //   },
// //   statusIndicator: {
// //     padding: '8px 16px',
// //     borderRadius: '20px',
// //     color: 'white',
// //     fontWeight: 'bold',
// //     fontSize: '14px'
// //   },
// //   lastUpdated: {
// //     color: '#666',
// //     fontSize: '14px'
// //   },
// //   errorMessage: {
// //     backgroundColor: '#ffebee',
// //     border: '1px solid #f44336',
// //     borderRadius: '8px',
// //     padding: '12px',
// //     margin: '10px auto',
// //     maxWidth: '600px',
// //     color: '#c62828',
// //     textAlign: 'center'
// //   },
// //   gridContainer: {
// //     display: 'grid',
// //     gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
// //     gap: '30px',
// //     maxWidth: '1200px',
// //     margin: '0 auto'
// //   },
// //   card: {
// //     backgroundColor: 'white',
// //     borderRadius: '12px',
// //     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
// //     overflow: 'hidden',
// //     transition: 'transform 0.2s ease, box-shadow 0.2s ease'
// //   },
// //   cardHeader: {
// //     backgroundColor: '#2196F3',
// //     padding: '20px',
// //     borderBottom: '1px solid #eee'
// //   },
// //   cardTitle: {
// //     margin: 0,
// //     color: 'white',
// //     fontSize: '1.5rem',
// //     fontWeight: 'bold'
// //   },
// //   cardContent: {
// //     padding: '25px'
// //   },
// //   dataGrid: {
// //     display: 'grid',
// //     gap: '16px'
// //   },
// //   dataItem: {
// //     display: 'flex',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     padding: '12px 0',
// //     borderBottom: '1px solid #f0f0f0'
// //   },
// //   dataLabel: {
// //     fontWeight: '600',
// //     color: '#555',
// //     fontSize: '16px'
// //   },
// //   dataValue: {
// //     fontWeight: 'bold',
// //     color: '#333',
// //     fontSize: '16px'
// //   },
// //   statusBadge: {
// //     color: 'white',
// //     padding: '6px 12px',
// //     borderRadius: '16px',
// //     fontSize: '14px',
// //     minWidth: '60px',
// //     textAlign: 'center'
// //   },
// //   chartsSection: {
// //     marginTop: '40px',
// //     maxWidth: '1400px',
// //     margin: '40px auto 0'
// //   },
// //   chartSection: {
// //     marginBottom: '50px'
// //   },
// //   sectionTitle: {
// //     textAlign: 'center',
// //     color: '#333',
// //     fontSize: '1.8rem',
// //     marginBottom: '30px',
// //     fontWeight: 'bold',
// //     padding: '15px',
// //     borderRadius: '12px',
// //     backgroundColor: '#f8f9fa',
// //     border: '2px solid #e9ecef'
// //   },
// //   chartsGrid: {
// //     display: 'grid',
// //     gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
// //     gap: '25px'
// //   },
// //   chartCard: {
// //     backgroundColor: 'white',
// //     borderRadius: '12px',
// //     boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
// //     padding: '20px',
// //     transition: 'transform 0.2s ease, box-shadow 0.2s ease',
// //     border: '1px solid #f0f0f0'
// //   },
// //   chartTitle: {
// //     margin: '0 0 20px 0',
// //     color: '#333',
// //     fontSize: '1.2rem',
// //     fontWeight: 'bold',
// //     textAlign: 'center',
// //     borderBottom: '2px solid #f0f0f0',
// //     paddingBottom: '10px'
// //   },
// //   chartContainer: {
// //     width: '100%',
// //     height: '250px'
// //   }
// // };

// // export default FirebaseANPRDashboard;




// // Import Firebase modules and Recharts at the top
// import React, { useState, useEffect } from 'react';
// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getDatabase, ref, onValue, off } from 'firebase/database';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// const FirebaseANPRDashboard = () => {
//   const [anprData, setAnprData] = useState({
//     CAR: {
//       Battery: "0",
//       Charging: "IDLE",
//       Current: "0",
//       Power: "0",
//       Voltage: "0",
//       sample: 0,
//       ts_ms: 0,
//       writer: ""
//     },
//     Charging_Station: {
//       Current: "0 mA",
//       Power: "0.00 W",
//       Source: "Grid",
//       Station_1: "OFF",
//       Station_2: "OFF",
//       Voltage: "0.00 V"
//     }
//   });

//   const [connectionStatus, setConnectionStatus] = useState('Connecting...');
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const [error, setError] = useState(null);
  
//   // Chart data state - store last 20 data points
//   const [chartData, setChartData] = useState([]);
//   const [maxDataPoints] = useState(20);

//   useEffect(() => {
//     // Firebase configuration - Replace with your actual config
//     const firebaseConfig = {
//       apiKey: "your-api-key", // Replace with your API key
//       authDomain: "your-project.firebaseapp.com", // Replace with your domain
//       databaseURL: "https://waterdetection-default-rtdb.firebaseto.com/", // Your Firebase URL
//       projectId: "your-project-id", // Replace with your project ID
//       storageBucket: "your-project.appspot.com", // Replace with your storage bucket
//       messagingSenderId: "123456789", // Replace with your sender ID
//       appId: "your-app-id" // Replace with your app ID
//     };

//     let unsubscribe = null;

//     try {
//       // Check if Firebase app is already initialized
//       let app;
//       if (getApps().length === 0) {
//         // Initialize Firebase only if no app exists
//         app = initializeApp(firebaseConfig);
//         console.log('Firebase initialized');
//       } else {
//         // Use existing Firebase app
//         app = getApp();
//         console.log('Using existing Firebase app');
//       }
      
//       const database = getDatabase(app);
      
//       // Reference to ANPR data
//       const anprRef = ref(database, 'ANPR');
      
//       // Listen for real-time updates
//       unsubscribe = onValue(anprRef, (snapshot) => {
//         const data = snapshot.val();
        
//         if (data) {
//           console.log('Firebase data received:', data);
//           setAnprData(data);
//           setConnectionStatus('Connected');
//           const now = new Date();
//           setLastUpdated(now);
//           setError(null);
          
//           // Add data point to chart
//           const chartPoint = {
//             time: now.toLocaleTimeString(),
//             timestamp: now.getTime(),
//             carCurrent: parseFloat(data.CAR?.Current || 0),
//             carVoltage: parseFloat(data.CAR?.Voltage || 0),
//             carPower: parseFloat(data.CAR?.Power || 0),
//             stationCurrent: parseFloat(data.Charging_Station?.Current?.replace(' mA', '') || 0) / 1000, // Convert mA to A
//             stationVoltage: parseFloat(data.Charging_Station?.Voltage?.replace(' V', '') || 0),
//             stationPower: parseFloat(data.Charging_Station?.Power?.replace(' W', '') || 0)
//           };
          
//           setChartData(prevData => {
//             const newData = [...prevData, chartPoint];
//             // Keep only the last maxDataPoints
//             return newData.slice(-maxDataPoints);
//           });
//         } else {
//           console.log('No data available');
//           setConnectionStatus('No Data Available');
//         }
//       }, (error) => {
//         console.error('Firebase error:', error);
//         setConnectionStatus('Connection Error');
//         setError(error.message);
//       });

//     } catch (err) {
//       console.error('Firebase initialization error:', err);
//       setConnectionStatus('Initialization Error');
//       setError(err.message);
//     }

//     // Cleanup function
//     return () => {
//       if (unsubscribe) {
//         unsubscribe();
//       }
//     };
//   }, []);

//   const getStatusColor = (status) => {
//     switch (status.toLowerCase()) {
//       case 'charging': return { bg: '#10B981', glow: '0 0 20px rgba(16, 185, 129, 0.5)' };
//       case 'idle': return { bg: '#F59E0B', glow: '0 0 20px rgba(245, 158, 11, 0.5)' };
//       case 'on': return { bg: '#10B981', glow: '0 0 20px rgba(16, 185, 129, 0.5)' };
//       case 'off': return { bg: '#EF4444', glow: '0 0 20px rgba(239, 68, 68, 0.5)' };
//       default: return { bg: '#6B7280', glow: '0 0 20px rgba(107, 114, 128, 0.5)' };
//     }
//   };

//   const formatTimestamp = (timestamp) => {
//     if (!timestamp) return 'Never';
//     return timestamp.toLocaleTimeString();
//   };

//   const getBatteryLevel = () => {
//     const level = parseInt(anprData.CAR.Battery);
//     if (level > 80) return { color: '#10B981', width: level };
//     if (level > 50) return { color: '#F59E0B', width: level };
//     if (level > 20) return { color: '#F97316', width: level };
//     return { color: '#EF4444', width: level };
//   };

//   return (
//     <div style={styles.dashboard}>
//       {/* Animated Background */}
//       <div style={styles.backgroundAnimation}></div>
      
//       {/* Header Section */}
//       <div style={styles.header}>
//         <div style={styles.titleContainer}>
//           <h1 style={styles.title}>
//             <span style={styles.titleIcon}>⚡</span>
//             Bi-directional Power Grid and Monitoring System
//             <span style={styles.titleSubtext}>Advanced Monitoring System</span>
//           </h1>
//         </div>
        
//         <div style={styles.statusBar}>
//           <div style={{
//             ...styles.statusIndicator,
//             backgroundColor: connectionStatus.includes('Connected') ? '#10B981' : '#EF4444',
//             boxShadow: connectionStatus.includes('Connected') 
//               ? '0 0 20px rgba(16, 185, 129, 0.5)' 
//               : '0 0 20px rgba(239, 68, 68, 0.5)'
//           }}>
//             <span style={styles.statusDot}></span>
//             {connectionStatus}
//           </div>
//           <div style={styles.lastUpdated}>
//             <span style={styles.updateIcon}>🕒</span>
//             Last Updated: {formatTimestamp(lastUpdated)}
//           </div>
//         </div>
        
//         {error && (
//           <div style={styles.errorMessage}>
//             <span style={styles.errorIcon}>⚠️</span>
//             <strong>Connection Error:</strong> {error}
//           </div>
//         )}
//       </div>

//       {/* Overview Cards */}
//       <div style={styles.overviewSection}>
//         {/* Car Overview Card */}
//         <div style={styles.overviewCard}>
//           <div style={styles.cardHeader}>
//             <span style={styles.cardIcon}>🚗</span>
//             <h3 style={styles.cardTitle}>Vehicle Status</h3>
//           </div>
//           <div style={styles.cardContent}>
//             <div style={styles.batteryContainer}>
//               <div style={styles.batteryLabel}>Battery Level</div>
//               <div style={styles.batteryBar}>
//                 <div style={{
//                   ...styles.batteryFill,
//                   width: `${getBatteryLevel().width}%`,
//                   backgroundColor: getBatteryLevel().color,
//                   boxShadow: `0 0 10px ${getBatteryLevel().color}50`
//                 }}></div>
//                 <span style={styles.batteryText}>{anprData.CAR.Battery}%</span>
//               </div>
//             </div>
            
//             <div style={styles.statusGrid}>
//               <div style={styles.statusItem}>
//                 <span style={styles.statusLabel}>Status</span>
//                 <span style={{
//                   ...styles.statusBadge,
//                   ...getStatusColor(anprData.CAR.Charging),
//                   backgroundColor: getStatusColor(anprData.CAR.Charging).bg,
//                   boxShadow: getStatusColor(anprData.CAR.Charging).glow
//                 }}>
//                   {anprData.CAR.Charging}
//                 </span>
//               </div>
              
//               <div style={styles.metricCard}>
//                 <span style={styles.metricValue}>{anprData.CAR.Current}</span>
//                 <span style={styles.metricUnit}>Amps</span>
//               </div>
              
//               <div style={styles.metricCard}>
//                 <span style={styles.metricValue}>{anprData.CAR.Voltage}</span>
//                 <span style={styles.metricUnit}>Volts</span>
//               </div>
              
//               <div style={styles.metricCard}>
//                 <span style={styles.metricValue}>{anprData.CAR.Power}</span>
//                 <span style={styles.metricUnit}>Watts</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charging Station Overview Card */}
//         <div style={styles.overviewCard}>
//           <div style={styles.cardHeader}>
//             <span style={styles.cardIcon}>⚡</span>
//             <h3 style={styles.cardTitle}>Charging Station</h3>
//           </div>
//           <div style={styles.cardContent}>
//             <div style={styles.stationGrid}>
//               <div style={styles.stationItem}>
//                 <div style={styles.stationLabel}>Station 1</div>
//                 <div style={{
//                   ...styles.stationStatus,
//                   ...getStatusColor(anprData.Charging_Station.Station_1),
//                   backgroundColor: getStatusColor(anprData.Charging_Station.Station_1).bg,
//                   boxShadow: getStatusColor(anprData.Charging_Station.Station_1).glow
//                 }}>
//                   {anprData.Charging_Station.Station_1}
//                 </div>
//               </div>
              
//               <div style={styles.stationItem}>
//                 <div style={styles.stationLabel}>Station 2</div>
//                 <div style={{
//                   ...styles.stationStatus,
//                   ...getStatusColor(anprData.Charging_Station.Station_2),
//                   backgroundColor: getStatusColor(anprData.Charging_Station.Station_2).bg,
//                   boxShadow: getStatusColor(anprData.Charging_Station.Station_2).glow
//                 }}>
//                   {anprData.Charging_Station.Station_2}
//                 </div>
//               </div>
//             </div>
            
//             <div style={styles.statusGrid}>
//               <div style={styles.metricCard}>
//                 <span style={styles.metricValue}>{anprData.Charging_Station.Current.replace(' mA', '')}</span>
//                 <span style={styles.metricUnit}>mA</span>
//               </div>
              
//               <div style={styles.metricCard}>
//                 <span style={styles.metricValue}>{anprData.Charging_Station.Voltage.replace(' V', '')}</span>
//                 <span style={styles.metricUnit}>Volts</span>
//               </div>
              
//               <div style={styles.metricCard}>
//                 <span style={styles.metricValue}>{anprData.Charging_Station.Power.replace(' W', '')}</span>
//                 <span style={styles.metricUnit}>Watts</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div style={styles.chartsSection}>
//         {/* Car Charts */}
//         <div style={styles.chartSection}>
//           <h2 style={styles.sectionTitle}>
//             <span style={styles.sectionIcon}>🚗</span>
//             Vehicle Metrics
//             <div style={styles.titleUnderline}></div>
//           </h2>
//           <div style={styles.chartsGrid}>
//             {/* Car Current Chart */}
//             <div style={styles.chartCard}>
//               <div style={styles.chartHeader}>
//                 <h3 style={styles.chartTitle}>Current Flow</h3>
//                 <div style={styles.chartBadge}>Amperes</div>
//               </div>
//               <div style={styles.chartContainer}>
//                 <ResponsiveContainer width="100%" height={220}>
//                   <LineChart data={chartData}>
//                     <defs>
//                       <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
//                         <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                     <XAxis 
//                       dataKey="time" 
//                       stroke="#94A3B8"
//                       fontSize={10}
//                       interval="preserveStartEnd"
//                     />
//                     <YAxis stroke="#94A3B8" fontSize={10} />
//                     <Tooltip 
//                       contentStyle={{ 
//                         backgroundColor: 'rgba(15, 23, 42, 0.95)', 
//                         border: '1px solid rgba(59, 130, 246, 0.3)',
//                         borderRadius: '12px',
//                         color: '#F1F5F9',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="carCurrent" 
//                       stroke="#3B82F6" 
//                       strokeWidth={3}
//                       dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
//                       activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
//                       fill="url(#currentGradient)"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Car Voltage Chart */}
//             <div style={styles.chartCard}>
//               <div style={styles.chartHeader}>
//                 <h3 style={styles.chartTitle}>Voltage Level</h3>
//                 <div style={styles.chartBadge}>Volts</div>
//               </div>
//               <div style={styles.chartContainer}>
//                 <ResponsiveContainer width="100%" height={220}>
//                   <LineChart data={chartData}>
//                     <defs>
//                       <linearGradient id="voltageGradient" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
//                         <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                     <XAxis 
//                       dataKey="time" 
//                       stroke="#94A3B8"
//                       fontSize={10}
//                       interval="preserveStartEnd"
//                     />
//                     <YAxis stroke="#94A3B8" fontSize={10} />
//                     <Tooltip 
//                       contentStyle={{ 
//                         backgroundColor: 'rgba(15, 23, 42, 0.95)', 
//                         border: '1px solid rgba(16, 185, 129, 0.3)',
//                         borderRadius: '12px',
//                         color: '#F1F5F9',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="carVoltage" 
//                       stroke="#10B981" 
//                       strokeWidth={3}
//                       dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
//                       activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
//                       fill="url(#voltageGradient)"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Car Power Chart */}
//             <div style={styles.chartCard}>
//               <div style={styles.chartHeader}>
//                 <h3 style={styles.chartTitle}>Power Consumption</h3>
//                 <div style={styles.chartBadge}>Watts</div>
//               </div>
//               <div style={styles.chartContainer}>
//                 <ResponsiveContainer width="100%" height={220}>
//                   <LineChart data={chartData}>
//                     <defs>
//                       <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
//                         <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                     <XAxis 
//                       dataKey="time" 
//                       stroke="#94A3B8"
//                       fontSize={10}
//                       interval="preserveStartEnd"
//                     />
//                     <YAxis stroke="#94A3B8" fontSize={10} />
//                     <Tooltip 
//                       contentStyle={{ 
//                         backgroundColor: 'rgba(15, 23, 42, 0.95)', 
//                         border: '1px solid rgba(245, 158, 11, 0.3)',
//                         borderRadius: '12px',
//                         color: '#F1F5F9',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="carPower" 
//                       stroke="#F59E0B" 
//                       strokeWidth={3}
//                       dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
//                       activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2, fill: '#fff' }}
//                       fill="url(#powerGradient)"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Charging Station Charts */}
//         <div style={styles.chartSection}>
//           <h2 style={styles.sectionTitle}>
//             <span style={styles.sectionIcon}>⚡</span>
//             Charging Station Metrics
//             <div style={styles.titleUnderline}></div>
//           </h2>
//           <div style={styles.chartsGrid}>
//             {/* Station Current Chart */}
//             <div style={styles.chartCard}>
//               <div style={styles.chartHeader}>
//                 <h3 style={styles.chartTitle}>Output Current</h3>
//                 <div style={styles.chartBadge}>Amperes</div>
//               </div>
//               <div style={styles.chartContainer}>
//                 <ResponsiveContainer width="100%" height={220}>
//                   <LineChart data={chartData}>
//                     <defs>
//                       <linearGradient id="stationCurrentGradient" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
//                         <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                     <XAxis 
//                       dataKey="time" 
//                       stroke="#94A3B8"
//                       fontSize={10}
//                       interval="preserveStartEnd"
//                     />
//                     <YAxis stroke="#94A3B8" fontSize={10} />
//                     <Tooltip 
//                       contentStyle={{ 
//                         backgroundColor: 'rgba(15, 23, 42, 0.95)', 
//                         border: '1px solid rgba(139, 92, 246, 0.3)',
//                         borderRadius: '12px',
//                         color: '#F1F5F9',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="stationCurrent" 
//                       stroke="#8B5CF6" 
//                       strokeWidth={3}
//                       dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
//                       activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: '#fff' }}
//                       fill="url(#stationCurrentGradient)"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Station Voltage Chart */}
//             <div style={styles.chartCard}>
//               <div style={styles.chartHeader}>
//                 <h3 style={styles.chartTitle}>Output Voltage</h3>
//                 <div style={styles.chartBadge}>Volts</div>
//               </div>
//               <div style={styles.chartContainer}>
//                 <ResponsiveContainer width="100%" height={220}>
//                   <LineChart data={chartData}>
//                     <defs>
//                       <linearGradient id="stationVoltageGradient" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
//                         <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                     <XAxis 
//                       dataKey="time" 
//                       stroke="#94A3B8"
//                       fontSize={10}
//                       interval="preserveStartEnd"
//                     />
//                     <YAxis stroke="#94A3B8" fontSize={10} />
//                     <Tooltip 
//                       contentStyle={{ 
//                         backgroundColor: 'rgba(15, 23, 42, 0.95)', 
//                         border: '1px solid rgba(236, 72, 153, 0.3)',
//                         borderRadius: '12px',
//                         color: '#F1F5F9',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="stationVoltage" 
//                       stroke="#EC4899" 
//                       strokeWidth={3}
//                       dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
//                       activeDot={{ r: 6, stroke: '#EC4899', strokeWidth: 2, fill: '#fff' }}
//                       fill="url(#stationVoltageGradient)"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Station Power Chart */}
//             <div style={styles.chartCard}>
//               <div style={styles.chartHeader}>
//                 <h3 style={styles.chartTitle}>Power Output</h3>
//                 <div style={styles.chartBadge}>Watts</div>
//               </div>
//               <div style={styles.chartContainer}>
//                 <ResponsiveContainer width="100%" height={220}>
//                   <LineChart data={chartData}>
//                     <defs>
//                       <linearGradient id="stationPowerGradient" x1="0" y1="0" x2="0" y2="1">
//                         <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
//                         <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
//                       </linearGradient>
//                     </defs>
//                     <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
//                     <XAxis 
//                       dataKey="time" 
//                       stroke="#94A3B8"
//                       fontSize={10}
//                       interval="preserveStartEnd"
//                     />
//                     <YAxis stroke="#94A3B8" fontSize={10} />
//                     <Tooltip 
//                       contentStyle={{ 
//                         backgroundColor: 'rgba(15, 23, 42, 0.95)', 
//                         border: '1px solid rgba(6, 182, 212, 0.3)',
//                         borderRadius: '12px',
//                         color: '#F1F5F9',
//                         backdropFilter: 'blur(10px)'
//                       }}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="stationPower" 
//                       stroke="#06B6D4" 
//                       strokeWidth={3}
//                       dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
//                       activeDot={{ r: 6, stroke: '#06B6D4', strokeWidth: 2, fill: '#fff' }}
//                       fill="url(#stationPowerGradient)"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   dashboard: {
//     minHeight: '100vh',
//     background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
//     padding: '20px',
//     fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
//     position: 'relative',
//     overflow: 'hidden'
//   },
//   backgroundAnimation: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     background: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
//     animation: 'float 20s ease-in-out infinite',
//     zIndex: 0
//   },
//   header: {
//     position: 'relative',
//     zIndex: 1,
//     marginBottom: '40px',
//     textAlign: 'center'
//   },
//   titleContainer: {
//     marginBottom: '30px'
//   },
//   title: {
//     background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899)',
//     WebkitBackgroundClip: 'text',
//     WebkitTextFillColor: 'transparent',
//     backgroundClip: 'text',
//     fontSize: '3.5rem',
//     fontWeight: '800',
//     margin: '0',
//     textAlign: 'center',
//     letterSpacing: '-0.02em',
//     lineHeight: '1.1',
//     position: 'relative',
//     animation: 'glow 3s ease-in-out infinite alternate'
//   },
//   titleIcon: {
//     display: 'block',
//     fontSize: '2rem',
//     marginBottom: '10px',
//     animation: 'pulse 2s ease-in-out infinite'
//   },
//   titleSubtext: {
//     display: 'block',
//     fontSize: '1.2rem',
//     fontWeight: '400',
//     marginTop: '10px',
//     color: '#94A3B8',
//     letterSpacing: '0.05em'
//   },
//   statusBar: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: '30px',
//     flexWrap: 'wrap',
//     marginBottom: '20px'
//   },
//   statusIndicator: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//     padding: '12px 24px',
//     borderRadius: '50px',
//     color: 'white',
//     fontWeight: '600',
//     fontSize: '14px',
//     backdropFilter: 'blur(10px)',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     transition: 'all 0.3s ease',
//     animation: 'pulse 2s ease-in-out infinite'
//   },
//   statusDot: {
//     width: '8px',
//     height: '8px',
//     borderRadius: '50%',
//     backgroundColor: 'currentColor',
//     animation: 'blink 1.5s ease-in-out infinite'
//   },
//   lastUpdated: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     color: '#94A3B8',
//     fontSize: '14px',
//     padding: '8px 16px',
//     backgroundColor: 'rgba(15, 23, 42, 0.6)',
//     borderRadius: '25px',
//     backdropFilter: 'blur(10px)',
//     border: '1px solid rgba(255, 255, 255, 0.1)'
//   },
//   updateIcon: {
//     fontSize: '16px'
//   },
//   errorMessage: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: '10px',
//     backgroundColor: 'rgba(239, 68, 68, 0.1)',
//     border: '1px solid rgba(239, 68, 68, 0.3)',
//     borderRadius: '12px',
//     padding: '16px',
//     margin: '10px auto',
//     maxWidth: '600px',
//     color: '#FCA5A5',
//     backdropFilter: 'blur(10px)'
//   },
//   errorIcon: {
//     fontSize: '20px'
//   },
//   overviewSection: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
//     gap: '30px',
//     maxWidth: '1400px',
//     margin: '0 auto 50px',
//     position: 'relative',
//     zIndex: 1
//   },
//   overviewCard: {
//     background: 'rgba(15, 23, 42, 0.8)',
//     backdropFilter: 'blur(20px)',
//     borderRadius: '24px',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
//     overflow: 'hidden',
//     transition: 'all 0.3s ease',
//     position: 'relative'
//   },
//   cardHeader: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '15px',
//     padding: '25px 30px 20px',
//     background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
//     borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
//   },
//   cardIcon: {
//     fontSize: '2rem',
//     filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
//   },
//   cardTitle: {
//     color: '#F1F5F9',
//     fontSize: '1.5rem',
//     fontWeight: '700',
//     margin: 0
//   },
//   cardContent: {
//     padding: '30px'
//   },
//   batteryContainer: {
//     marginBottom: '25px'
//   },
//   batteryLabel: {
//     color: '#94A3B8',
//     fontSize: '14px',
//     fontWeight: '600',
//     marginBottom: '10px',
//     textTransform: 'uppercase',
//     letterSpacing: '0.05em'
//   },
//   batteryBar: {
//     position: 'relative',
//     width: '100%',
//     height: '12px',
//     backgroundColor: 'rgba(15, 23, 42, 0.8)',
//     borderRadius: '6px',
//     overflow: 'hidden',
//     border: '1px solid rgba(255, 255, 255, 0.1)'
//   },
//   batteryFill: {
//     height: '100%',
//     borderRadius: '6px',
//     transition: 'all 0.5s ease',
//     position: 'relative'
//   },
//   batteryText: {
//     position: 'absolute',
//     right: '10px',
//     top: '-2px',
//     color: '#F1F5F9',
//     fontSize: '12px',
//     fontWeight: '700'
//   },
//   statusGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
//     gap: '15px'
//   },
//   statusItem: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '8px'
//   },
//   statusLabel: {
//     color: '#94A3B8',
//     fontSize: '12px',
//     fontWeight: '600',
//     textTransform: 'uppercase',
//     letterSpacing: '0.05em'
//   },
//   statusBadge: {
//     color: 'white',
//     padding: '8px 16px',
//     borderRadius: '20px',
//     fontSize: '13px',
//     fontWeight: '700',
//     textAlign: 'center',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//     backdropFilter: 'blur(10px)',
//     transition: 'all 0.3s ease'
//   },
//   metricCard: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     padding: '15px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     borderRadius: '16px',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     backdropFilter: 'blur(10px)',
//     transition: 'all 0.3s ease'
//   },
//   metricValue: {
//     color: '#F1F5F9',
//     fontSize: '1.5rem',
//     fontWeight: '700',
//     lineHeight: '1'
//   },
//   metricUnit: {
//     color: '#94A3B8',
//     fontSize: '11px',
//     fontWeight: '600',
//     textTransform: 'uppercase',
//     letterSpacing: '0.05em',
//     marginTop: '4px'
//   },
//   stationGrid: {
//     display: 'grid',
//     gridTemplateColumns: '1fr 1fr',
//     gap: '20px',
//     marginBottom: '25px'
//   },
//   stationItem: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px',
//     alignItems: 'center'
//   },
//   stationLabel: {
//     color: '#94A3B8',
//     fontSize: '14px',
//     fontWeight: '600',
//     textTransform: 'uppercase',
//     letterSpacing: '0.05em'
//   },
//   stationStatus: {
//     color: 'white',
//     padding: '10px 20px',
//     borderRadius: '25px',
//     fontSize: '14px',
//     fontWeight: '700',
//     border: '1px solid rgba(255, 255, 255, 0.2)',
//     backdropFilter: 'blur(10px)',
//     transition: 'all 0.3s ease',
//     minWidth: '80px',
//     textAlign: 'center'
//   },
//   chartsSection: {
//     position: 'relative',
//     zIndex: 1,
//     maxWidth: '1600px',
//     margin: '0 auto'
//   },
//   chartSection: {
//     marginBottom: '60px'
//   },
//   sectionTitle: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     textAlign: 'center',
//     color: '#F1F5F9',
//     fontSize: '2.2rem',
//     marginBottom: '40px',
//     fontWeight: '700',
//     position: 'relative'
//   },
//   sectionIcon: {
//     fontSize: '2.5rem',
//     marginBottom: '15px',
//     filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))',
//     animation: 'float 3s ease-in-out infinite'
//   },
//   titleUnderline: {
//     width: '60px',
//     height: '4px',
//     background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
//     borderRadius: '2px',
//     marginTop: '15px',
//     boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
//   },
//   chartsGrid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
//     gap: '30px'
//   },
//   chartCard: {
//     background: 'rgba(15, 23, 42, 0.8)',
//     backdropFilter: 'blur(20px)',
//     borderRadius: '20px',
//     border: '1px solid rgba(255, 255, 255, 0.1)',
//     boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
//     overflow: 'hidden',
//     transition: 'all 0.3s ease',
//     position: 'relative'
//   },
//   chartHeader: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: '20px 25px',
//     background: 'rgba(255, 255, 255, 0.05)',
//     borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
//   },
//   chartTitle: {
//     color: '#F1F5F9',
//     fontSize: '1.1rem',
//     fontWeight: '600',
//     margin: 0
//   },
//   chartBadge: {
//     color: '#94A3B8',
//     fontSize: '11px',
//     fontWeight: '600',
//     textTransform: 'uppercase',
//     letterSpacing: '0.05em',
//     padding: '4px 8px',
//     backgroundColor: 'rgba(255, 255, 255, 0.1)',
//     borderRadius: '8px'
//   },
//   chartContainer: {
//     padding: '20px',
//     width: '100%',
//     height: '220px'
//   }
// };

// // Add keyframes for animations (these would typically go in a CSS file)
// if (typeof document !== 'undefined') {
//   const style = document.createElement('style');
//   style.textContent = `
//     @keyframes glow {
//       0%, 100% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3); }
//       50% { text-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.5); }
//     }
//     @keyframes pulse {
//       0%, 100% { transform: scale(1); opacity: 1; }
//       50% { transform: scale(1.05); opacity: 0.8; }
//     }
//     @keyframes blink {
//       0%, 100% { opacity: 1; }
//       50% { opacity: 0.3; }
//     }
//     @keyframes float {
//       0%, 100% { transform: translateY(0px) rotate(0deg); }
//       33% { transform: translateY(-20px) rotate(1deg); }
//       66% { transform: translateY(-10px) rotate(-1deg); }
//     }
//   `;
//   document.head.appendChild(style);
// }

// export default FirebaseANPRDashboard;








// Import Firebase modules and Recharts at the top
import React, { useState, useEffect } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue, off } from 'firebase/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const FirebaseANPRDashboard = () => {
  const [anprData, setAnprData] = useState({
    CAR: {
      Battery: "0",
      Charging: "IDLE",
      Current: "0",
      Power: "0",
      Voltage: "0",
      sample: 0,
      ts_ms: 0,
      writer: ""
    },
    Charging_Station: {
      Current: "0 mA",
      Power: "0.00 W",
      Source: "Grid",
      Station_1: "OFF",
      Station_2: "OFF",
      Voltage: "0.00 V"
    }
  });

  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);
  
  // Chart data state - store last 20 data points
  const [chartData, setChartData] = useState([]);
  const [maxDataPoints] = useState(20);

  useEffect(() => {
    // Firebase configuration - Replace with your actual config
    const firebaseConfig = {
      apiKey: "your-api-key", // Replace with your API key
      authDomain: "your-project.firebaseapp.com", // Replace with your domain
      databaseURL: "https://waterdetection-default-rtdb.firebaseto.com/", // Your Firebase URL
      projectId: "your-project-id", // Replace with your project ID
      storageBucket: "your-project.appspot.com", // Replace with your storage bucket
      messagingSenderId: "123456789", // Replace with your sender ID
      appId: "your-app-id" // Replace with your app ID
    };

    let unsubscribe = null;

    try {
      // Check if Firebase app is already initialized
      let app;
      if (getApps().length === 0) {
        // Initialize Firebase only if no app exists
        app = initializeApp(firebaseConfig);
        console.log('Firebase initialized');
      } else {
        // Use existing Firebase app
        app = getApp();
        console.log('Using existing Firebase app');
      }
      
      const database = getDatabase(app);
      
      // Reference to ANPR data
      const anprRef = ref(database, 'ANPR');
      
      // Listen for real-time updates
      unsubscribe = onValue(anprRef, (snapshot) => {
        const data = snapshot.val();
        
        if (data) {
          console.log('Firebase data received:', data);
          setAnprData(data);
          setConnectionStatus('Connected');
          const now = new Date();
          setLastUpdated(now);
          setError(null);
          
          // Add data point to chart
          const chartPoint = {
            time: now.toLocaleTimeString(),
            timestamp: now.getTime(),
            carCurrent: parseFloat(data.CAR?.Current || 0),
            carVoltage: parseFloat(data.CAR?.Voltage || 0),
            carPower: parseFloat(data.CAR?.Power || 0),
            stationCurrent: parseFloat(data.Charging_Station?.Current?.replace(' mA', '') || 0) / 1000, // Convert mA to A
            stationVoltage: parseFloat(data.Charging_Station?.Voltage?.replace(' V', '') || 0),
            stationPower: parseFloat(data.Charging_Station?.Power?.replace(' W', '') || 0)
          };
          
          setChartData(prevData => {
            const newData = [...prevData, chartPoint];
            // Keep only the last maxDataPoints
            return newData.slice(-maxDataPoints);
          });
        } else {
          console.log('No data available');
          setConnectionStatus('No Data Available');
        }
      }, (error) => {
        console.error('Firebase error:', error);
        setConnectionStatus('Connection Error');
        setError(error.message);
      });

    } catch (err) {
      console.error('Firebase initialization error:', err);
      setConnectionStatus('Initialization Error');
      setError(err.message);
    }

    // Cleanup function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'charging': return { bg: '#10B981', glow: '0 0 20px rgba(16, 185, 129, 0.5)' };
      case 'idle': return { bg: '#F59E0B', glow: '0 0 20px rgba(245, 158, 11, 0.5)' };
      case 'on': return { bg: '#10B981', glow: '0 0 20px rgba(16, 185, 129, 0.5)' };
      case 'off': return { bg: '#EF4444', glow: '0 0 20px rgba(239, 68, 68, 0.5)' };
      default: return { bg: '#6B7280', glow: '0 0 20px rgba(107, 114, 128, 0.5)' };
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    return timestamp.toLocaleTimeString();
  };

  const getBatteryLevel = () => {
    const level = parseInt(anprData.CAR.Battery);
    if (level > 80) return { color: '#10B981', width: level };
    if (level > 50) return { color: '#F59E0B', width: level };
    if (level > 20) return { color: '#F97316', width: level };
    return { color: '#EF4444', width: level };
  };

  return (
    <div style={styles.dashboard}>
      {/* Animated Background */}
      <div style={styles.backgroundAnimation}></div>
      
      {/* Header Section */}
      <div style={styles.header}>
        <div style={styles.titleContainer}>
          <h1 style={styles.title}>
            <span style={styles.titleIcon}>⚡</span>
           Bi-directional Power Grid and Monitoring System
            <span style={styles.titleSubtext}>Advanced Monitoring System</span>
          </h1>
        </div>
        
        <div style={styles.statusBar}>
          <div style={{
            ...styles.statusIndicator,
            backgroundColor: connectionStatus.includes('Connected') ? '#10B981' : '#EF4444',
            boxShadow: connectionStatus.includes('Connected') 
              ? '0 0 20px rgba(16, 185, 129, 0.5)' 
              : '0 0 20px rgba(239, 68, 68, 0.5)'
          }}>
            <span style={styles.statusDot}></span>
            {connectionStatus}
          </div>
          <div style={styles.lastUpdated}>
            <span style={styles.updateIcon}>🕒</span>
            Last Updated: {formatTimestamp(lastUpdated)}
          </div>
        </div>
        
        {error && (
          <div style={styles.errorMessage}>
            <span style={styles.errorIcon}>⚠️</span>
            <strong>Connection Error:</strong> {error}
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <div style={styles.overviewSection}>
        {/* Car Overview Card */}
        <div style={styles.overviewCard}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>🚗</span>
            <h3 style={styles.cardTitle}>Vehicle Status</h3>
          </div>
          <div style={styles.cardContent}>
            <div style={styles.batteryContainer}>
              <div style={styles.batteryLabel}>Battery Level</div>
              <div style={styles.batteryBar}>
                <div style={{
                  ...styles.batteryFill,
                  width: `${getBatteryLevel().width}%`,
                  backgroundColor: getBatteryLevel().color,
                  boxShadow: `0 0 10px ${getBatteryLevel().color}50`
                }}></div>
                <span style={styles.batteryText}>{anprData.CAR.Battery}%</span>
              </div>
            </div>
            
            <div style={styles.statusGrid}>
              <div style={styles.statusItem}>
                <span style={styles.statusLabel}>Status</span>
                <span style={{
                  ...styles.statusBadge,
                  ...getStatusColor(anprData.CAR.Charging),
                  backgroundColor: getStatusColor(anprData.CAR.Charging).bg,
                  boxShadow: getStatusColor(anprData.CAR.Charging).glow
                }}>
                  {anprData.CAR.Charging}
                </span>
              </div>
              
              <div style={styles.metricCard}>
                <span style={styles.metricValue}>{anprData.CAR.Current}</span>
                <span style={styles.metricUnit}>Amps</span>
              </div>
              
              <div style={styles.metricCard}>
                <span style={styles.metricValue}>{anprData.CAR.Voltage}</span>
                <span style={styles.metricUnit}>Volts</span>
              </div>
              
              <div style={styles.metricCard}>
                <span style={styles.metricValue}>{anprData.CAR.Power}</span>
                <span style={styles.metricUnit}>Watts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charging Station Overview Card */}
        <div style={styles.overviewCard}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>⚡</span>
            <h3 style={styles.cardTitle}>Charging Station</h3>
          </div>
          <div style={styles.cardContent}>
            {/* Power Source Section */}
            <div style={styles.sourceContainer}>
              <div style={styles.sourceLabel}>Power Source</div>
              <div style={styles.sourceIndicator}>
                <span style={styles.sourceIcon}>
                  {anprData.Charging_Station.Source === 'Grid' ? '🔌' : 
                   anprData.Charging_Station.Source === 'Solar' ? '☀️' : 
                   anprData.Charging_Station.Source === 'Battery' ? '🔋' : '⚡'}
                </span>
                <span style={styles.sourceName}>{anprData.Charging_Station.Source}</span>
                <div style={styles.sourceStatus}>ACTIVE</div>
              </div>
            </div>

            <div style={styles.stationGrid}>
              <div style={styles.stationItem}>
                <div style={styles.stationLabel}>Station 1</div>
                <div style={{
                  ...styles.stationStatus,
                  ...getStatusColor(anprData.Charging_Station.Station_1),
                  backgroundColor: getStatusColor(anprData.Charging_Station.Station_1).bg,
                  boxShadow: getStatusColor(anprData.Charging_Station.Station_1).glow
                }}>
                  {anprData.Charging_Station.Station_1}
                </div>
              </div>
              
              <div style={styles.stationItem}>
                <div style={styles.stationLabel}>Station 2</div>
                <div style={{
                  ...styles.stationStatus,
                  ...getStatusColor(anprData.Charging_Station.Station_2),
                  backgroundColor: getStatusColor(anprData.Charging_Station.Station_2).bg,
                  boxShadow: getStatusColor(anprData.Charging_Station.Station_2).glow
                }}>
                  {anprData.Charging_Station.Station_2}
                </div>
              </div>
            </div>
            
            <div style={styles.statusGrid}>
              <div style={styles.metricCard}>
                <span style={styles.metricValue}>{anprData.Charging_Station.Current.replace(' mA', '')}</span>
                <span style={styles.metricUnit}>mA</span>
              </div>
              
              <div style={styles.metricCard}>
                <span style={styles.metricValue}>{anprData.Charging_Station.Voltage.replace(' V', '')}</span>
                <span style={styles.metricUnit}>Volts</span>
              </div>
              
              <div style={styles.metricCard}>
                <span style={styles.metricValue}>{anprData.Charging_Station.Power.replace(' W', '')}</span>
                <span style={styles.metricUnit}>Watts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={styles.chartsSection}>
        {/* Car Charts */}
        <div style={styles.chartSection}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>🚗</span>
            Vehicle Metrics
            <div style={styles.titleUnderline}></div>
          </h2>
          <div style={styles.chartsGrid}>
            {/* Car Current Chart */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Current Flow</h3>
                <div style={styles.chartBadge}>Amperes</div>
              </div>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#94A3B8"
                      fontSize={10}
                      interval="preserveStartEnd"
                    />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '12px',
                        color: '#F1F5F9',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="carCurrent" 
                      stroke="#3B82F6" 
                      strokeWidth={3}
                      dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2, fill: '#fff' }}
                      fill="url(#currentGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Car Voltage Chart */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Voltage Level</h3>
                <div style={styles.chartBadge}>Volts</div>
              </div>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="voltageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#94A3B8"
                      fontSize={10}
                      interval="preserveStartEnd"
                    />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '12px',
                        color: '#F1F5F9',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="carVoltage" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: '#fff' }}
                      fill="url(#voltageGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Car Power Chart */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Power Consumption</h3>
                <div style={styles.chartBadge}>Watts</div>
              </div>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#94A3B8"
                      fontSize={10}
                      interval="preserveStartEnd"
                    />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '12px',
                        color: '#F1F5F9',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="carPower" 
                      stroke="#F59E0B" 
                      strokeWidth={3}
                      dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2, fill: '#fff' }}
                      fill="url(#powerGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Charging Station Charts */}
        <div style={styles.chartSection}>
          <h2 style={styles.sectionTitle}>
            <span style={styles.sectionIcon}>⚡</span>
            Charging Station Metrics
            <div style={styles.titleUnderline}></div>
          </h2>
          <div style={styles.chartsGrid}>
            {/* Station Current Chart */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Output Current</h3>
                <div style={styles.chartBadge}>Amperes</div>
              </div>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="stationCurrentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#94A3B8"
                      fontSize={10}
                      interval="preserveStartEnd"
                    />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        borderRadius: '12px',
                        color: '#F1F5F9',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stationCurrent" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#8B5CF6', strokeWidth: 2, fill: '#fff' }}
                      fill="url(#stationCurrentGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Station Voltage Chart */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Output Voltage</h3>
                <div style={styles.chartBadge}>Volts</div>
              </div>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="stationVoltageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#94A3B8"
                      fontSize={10}
                      interval="preserveStartEnd"
                    />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(236, 72, 153, 0.3)',
                        borderRadius: '12px',
                        color: '#F1F5F9',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stationVoltage" 
                      stroke="#EC4899" 
                      strokeWidth={3}
                      dot={{ fill: '#EC4899', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#EC4899', strokeWidth: 2, fill: '#fff' }}
                      fill="url(#stationVoltageGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Station Power Chart */}
            <div style={styles.chartCard}>
              <div style={styles.chartHeader}>
                <h3 style={styles.chartTitle}>Power Output</h3>
                <div style={styles.chartBadge}>Watts</div>
              </div>
              <div style={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <defs>
                      <linearGradient id="stationPowerGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis 
                      dataKey="time" 
                      stroke="#94A3B8"
                      fontSize={10}
                      interval="preserveStartEnd"
                    />
                    <YAxis stroke="#94A3B8" fontSize={10} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                        border: '1px solid rgba(6, 182, 212, 0.3)',
                        borderRadius: '12px',
                        color: '#F1F5F9',
                        backdropFilter: 'blur(10px)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="stationPower" 
                      stroke="#06B6D4" 
                      strokeWidth={3}
                      dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: '#06B6D4', strokeWidth: 2, fill: '#fff' }}
                      fill="url(#stationPowerGradient)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  dashboard: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
    padding: '20px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    position: 'relative',
    overflow: 'hidden'
  },
  backgroundAnimation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
    animation: 'float 20s ease-in-out infinite',
    zIndex: 0
  },
  header: {
    position: 'relative',
    zIndex: 1,
    marginBottom: '40px',
    textAlign: 'center'
  },
  titleContainer: {
    marginBottom: '30px'
  },
  title: {
    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #EC4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: '3.5rem',
    fontWeight: '800',
    margin: '0',
    textAlign: 'center',
    letterSpacing: '-0.02em',
    lineHeight: '1.1',
    position: 'relative',
    animation: 'glow 3s ease-in-out infinite alternate'
  },
  titleIcon: {
    display: 'block',
    fontSize: '2rem',
    marginBottom: '10px',
    animation: 'pulse 2s ease-in-out infinite'
  },
  titleSubtext: {
    display: 'block',
    fontSize: '1.2rem',
    fontWeight: '400',
    marginTop: '10px',
    color: '#94A3B8',
    letterSpacing: '0.05em'
  },
  statusBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '30px',
    flexWrap: 'wrap',
    marginBottom: '20px'
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    borderRadius: '50px',
    color: 'white',
    fontWeight: '600',
    fontSize: '14px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    animation: 'pulse 2s ease-in-out infinite'
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'currentColor',
    animation: 'blink 1.5s ease-in-out infinite'
  },
  lastUpdated: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#94A3B8',
    fontSize: '14px',
    padding: '8px 16px',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: '25px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  updateIcon: {
    fontSize: '16px'
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    margin: '10px auto',
    maxWidth: '600px',
    color: '#FCA5A5',
    backdropFilter: 'blur(10px)'
  },
  errorIcon: {
    fontSize: '20px'
  },
  overviewSection: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
    gap: '30px',
    maxWidth: '1400px',
    margin: '0 auto 50px',
    position: 'relative',
    zIndex: 1
  },
  overviewCard: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    position: 'relative'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '25px 30px 20px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  cardIcon: {
    fontSize: '2rem',
    filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))'
  },
  cardTitle: {
    color: '#F1F5F9',
    fontSize: '1.5rem',
    fontWeight: '700',
    margin: 0
  },
  cardContent: {
    padding: '30px'
  },
  batteryContainer: {
    marginBottom: '25px'
  },
  batteryLabel: {
    color: '#94A3B8',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  batteryBar: {
    position: 'relative',
    width: '100%',
    height: '12px',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: '6px',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  },
  batteryFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'all 0.5s ease',
    position: 'relative'
  },
  batteryText: {
    position: 'absolute',
    right: '10px',
    top: '-2px',
    color: '#F1F5F9',
    fontSize: '12px',
    fontWeight: '700'
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '15px'
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  statusLabel: {
    color: '#94A3B8',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  statusBadge: {
    color: 'white',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '700',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease'
  },
  metricCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease'
  },
  metricValue: {
    color: '#F1F5F9',
    fontSize: '1.5rem',
    fontWeight: '700',
    lineHeight: '1'
  },
  metricUnit: {
    color: '#94A3B8',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginTop: '4px'
  },
  sourceContainer: {
    marginBottom: '25px',
    padding: '20px',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
    borderRadius: '16px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
    textAlign: 'center'
  },
  sourceLabel: {
    color: '#94A3B8',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '15px'
  },
  sourceIndicator: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  sourceIcon: {
    fontSize: '2rem',
    filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.5))',
    animation: 'pulse 2s ease-in-out infinite'
  },
  sourceName: {
    color: '#F1F5F9',
    fontSize: '1.4rem',
    fontWeight: '700',
    letterSpacing: '0.02em'
  },
  sourceStatus: {
    color: '#10B981',
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    padding: '4px 12px',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: '12px',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.3)',
    animation: 'blink 2s ease-in-out infinite'
  },
  stationGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '25px'
  },
  stationItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    alignItems: 'center'
  },
  stationLabel: {
    color: '#94A3B8',
    fontSize: '14px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  stationStatus: {
    color: 'white',
    padding: '10px 20px',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: '700',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    minWidth: '80px',
    textAlign: 'center'
  },
  chartsSection: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '1600px',
    margin: '0 auto'
  },
  chartSection: {
    marginBottom: '60px'
  },
  sectionTitle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    color: '#F1F5F9',
    fontSize: '2.2rem',
    marginBottom: '40px',
    fontWeight: '700',
    position: 'relative'
  },
  sectionIcon: {
    fontSize: '2.5rem',
    marginBottom: '15px',
    filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.5))',
    animation: 'float 3s ease-in-out infinite'
  },
  titleUnderline: {
    width: '60px',
    height: '4px',
    background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    borderRadius: '2px',
    marginTop: '15px',
    boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '30px'
  },
  chartCard: {
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    position: 'relative'
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 25px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
  },
  chartTitle: {
    color: '#F1F5F9',
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: 0
  },
  chartBadge: {
    color: '#94A3B8',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '4px 8px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px'
  },
  chartContainer: {
    padding: '20px',
    width: '100%',
    height: '220px'
  }
};

// Add keyframes for animations (these would typically go in a CSS file)
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes glow {
      0%, 100% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3); }
      50% { text-shadow: 0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(139, 92, 246, 0.5); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.05); opacity: 0.8; }
    }
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      33% { transform: translateY(-20px) rotate(1deg); }
      66% { transform: translateY(-10px) rotate(-1deg); }
    }
  `;
  document.head.appendChild(style);
}

export default FirebaseANPRDashboard;