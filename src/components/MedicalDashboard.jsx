// // Dashboard.js - Enhanced with Comprehensive ML Suggestions for All Parameters
// import React, { useState, useEffect, useRef } from 'react';
// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getDatabase, ref, onValue, update } from 'firebase/database';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
// import './MedicalDashboard.css';

// // Firebase Configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAhLCi6JBT5ELkAFxTplKBBDdRdpATzQxI",
//   authDomain: "smart-medicine-vending-machine.firebaseapp.com",
//   databaseURL: "https://smart-medicine-vending-machine-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "smart-medicine-vending-machine",
//   storageBucket: "smart-medicine-vending-machine.firebasestorage.app",
//   messagingSenderId: "705021997077",
//   appId: "1:705021997077:web:5af9ec0b267e597e1d5e1c",
//   measurementId: "G-PH0XLJSYVS"
// };

// // Initialize Firebase with unique app name
// const appName = 'medical-dashboard-app';
// let app;
// try {
//   app = getApp(appName);
// } catch {
//   app = initializeApp(firebaseConfig, appName);
// }
// const database = getDatabase(app);

// // ---- Enhanced KNN Health Dataset with Comprehensive Scenarios ----
// const healthDataset = [
//   // Normal cases
//   { features: [36.8, 72, 115, 75, 98, 45, 0, 0], suggestion: { 
//     type: 'success', category: 'Wellness', 
//     message: 'All vital signs are normal. Maintain a healthy lifestyle with regular exercise and balanced nutrition.', 
//     priority: 'low' 
//   }},
//   { features: [37.1, 78, 118, 78, 97, 50, 0, 0], suggestion: { 
//     type: 'success', category: 'Wellness', 
//     message: 'Excellent vital signs. Continue your current healthy habits and stay hydrated.', 
//     priority: 'low' 
//   }},
  
//   // Temperature-related cases
//   { features: [38.2, 85, 125, 82, 96, 55, 0, 0], suggestion: { 
//     type: 'warning', category: 'Temperature Management', 
//     message: 'Mild fever detected. Rest, stay hydrated (8-10 glasses water), monitor temperature every 2-4 hours, and consider paracetamol if needed.', 
//     priority: 'medium' 
//   }},
//   { features: [39.1, 105, 135, 88, 94, 60, 0, 0], suggestion: { 
//     type: 'critical', category: 'Temperature Management', 
//     message: 'High fever with elevated heart rate. Seek medical attention immediately, use cooling measures (cool cloths, lukewarm bath), and stay hydrated.', 
//     priority: 'high' 
//   }},
//   { features: [35.8, 58, 110, 70, 98, 45, 0, 0], suggestion: { 
//     type: 'warning', category: 'Temperature Management', 
//     message: 'Low body temperature detected. Keep warm with blankets, monitor closely, and consult healthcare provider if symptoms persist.', 
//     priority: 'medium' 
//   }},
  
//   // Heart Rate variations
//   { features: [37.0, 110, 120, 78, 97, 50, 0, 0], suggestion: { 
//     type: 'warning', category: 'Heart Rate Management', 
//     message: 'Elevated heart rate detected. Practice deep breathing, avoid caffeine and stimulants, rest in quiet environment, and monitor for palpitations.', 
//     priority: 'medium' 
//   }},
//   { features: [36.8, 55, 115, 75, 98, 45, 0, 0], suggestion: { 
//     type: 'info', category: 'Heart Rate Management', 
//     message: 'Low heart rate detected. If experiencing dizziness, fatigue, or weakness, consult healthcare provider. Monitor for syncope episodes.', 
//     priority: 'medium' 
//   }},
//   { features: [37.2, 130, 140, 90, 96, 55, 0, 0], suggestion: { 
//     type: 'critical', category: 'Heart Rate Management', 
//     message: 'Very high heart rate detected. Seek immediate medical attention, sit down, practice deep breathing, and avoid any physical exertion.', 
//     priority: 'high' 
//   }},
  
//   // Blood Pressure conditions
//   { features: [37.0, 80, 150, 95, 98, 45, 0, 0], suggestion: { 
//     type: 'warning', category: 'Blood Pressure Management', 
//     message: 'High blood pressure detected. Reduce sodium intake, practice deep breathing exercises, limit alcohol, take prescribed medications, and monitor regularly.', 
//     priority: 'medium' 
//   }},
//   { features: [37.2, 85, 180, 110, 97, 50, 0, 0], suggestion: { 
//     type: 'critical', category: 'Blood Pressure Management', 
//     message: 'Hypertensive crisis detected. Go to emergency room immediately. Rest in upright position, avoid strenuous activities, and take prescribed emergency medications.', 
//     priority: 'high' 
//   }},
//   { features: [36.9, 75, 90, 55, 98, 45, 0, 0], suggestion: { 
//     type: 'info', category: 'Blood Pressure Management', 
//     message: 'Low blood pressure detected. Stay hydrated, avoid sudden position changes, eat small frequent meals, and monitor for dizziness or fainting.', 
//     priority: 'low' 
//   }},
  
//   // Oxygen Saturation issues
//   { features: [36.9, 92, 125, 80, 92, 55, 0, 0], suggestion: { 
//     type: 'warning', category: 'Oxygen Saturation Management', 
//     message: 'Low oxygen saturation detected. Practice deep breathing exercises, ensure good posture, use supplemental oxygen if prescribed, and monitor closely.', 
//     priority: 'medium' 
//   }},
//   { features: [37.2, 95, 130, 85, 89, 60, 0, 1], suggestion: { 
//     type: 'critical', category: 'Oxygen Saturation Management', 
//     message: 'Critical oxygen levels with high CO₂. Seek immediate medical attention, improve ventilation, use rescue medications, and call emergency services.', 
//     priority: 'high' 
//   }},
//   { features: [37.5, 100, 135, 88, 87, 65, 0, 1], suggestion: { 
//     type: 'critical', category: 'Oxygen Saturation Management', 
//     message: 'Severe hypoxia detected. Call emergency services immediately. Use supplemental oxygen, maintain upright position, and prepare for emergency transport.', 
//     priority: 'high' 
//   }},
  
//   // Environmental factors
//   { features: [37.0, 85, 125, 82, 94, 85, 0, 1], suggestion: { 
//     type: 'warning', category: 'Environmental Management', 
//     message: 'High humidity and CO₂ levels detected. Improve ventilation immediately, use dehumidifier, consider air purification, and move to well-ventilated area.', 
//     priority: 'medium' 
//   }},
//   { features: [36.9, 80, 120, 78, 96, 90, 0, 1], suggestion: { 
//     type: 'warning', category: 'Environmental Management', 
//     message: 'Poor air quality detected. Move to well-ventilated area, use air purifier, avoid outdoor activities during high pollution, and consider wearing mask.', 
//     priority: 'medium' 
//   }},
//   { features: [37.1, 78, 118, 78, 97, 95, 0, 1], suggestion: { 
//     type: 'critical', category: 'Environmental Management', 
//     message: 'Very high humidity with elevated CO₂. Immediate ventilation needed. Risk of respiratory complications - seek fresh air environment immediately.', 
//     priority: 'high' 
//   }},
  
//   // Alcohol-related cases
//   { features: [37.2, 88, 130, 85, 96, 55, 2, 0], suggestion: { 
//     type: 'info', category: 'Substance Management', 
//     message: 'Moderate alcohol detected. Stay hydrated with water, avoid driving, monitor vital signs, eat food, and avoid additional alcohol consumption.', 
//     priority: 'low' 
//   }},
//   { features: [37.5, 95, 140, 90, 94, 60, 4, 0], suggestion: { 
//     type: 'warning', category: 'Substance Management', 
//     message: 'High alcohol levels with elevated vitals. Seek assistance from someone sober, avoid further alcohol, stay hydrated, and consider medical evaluation.', 
//     priority: 'medium' 
//   }},
//   { features: [38.1, 108, 155, 98, 92, 65, 5, 0], suggestion: { 
//     type: 'critical', category: 'Substance Management', 
//     message: 'Dangerous alcohol levels with multiple elevated vitals. Seek immediate medical attention for alcohol poisoning risk. Do not leave person alone.', 
//     priority: 'high' 
//   }},
  
//   // Multiple conditions
//   { features: [38.8, 110, 160, 100, 91, 70, 0, 1], suggestion: { 
//     type: 'critical', category: 'Multiple Conditions', 
//     message: 'Multiple critical readings: fever, tachycardia, hypertension, hypoxia, and poor air quality. Seek emergency medical care immediately.', 
//     priority: 'high' 
//   }},
//   { features: [38.5, 105, 155, 98, 93, 65, 1, 0], suggestion: { 
//     type: 'critical', category: 'Multiple Conditions', 
//     message: 'Fever, high BP, and low oxygen with alcohol detected. Avoid alcohol, seek medical attention, improve ventilation, and monitor closely.', 
//     priority: 'high' 
//   }},
  
//   // Respiratory-focused cases (for cough, TB, asthma scenarios)
//   { features: [37.8, 95, 128, 82, 94, 60, 0, 0], suggestion: { 
//     type: 'warning', category: 'Respiratory Health', 
//     message: 'Mild respiratory symptoms pattern. Stay hydrated, use humidifier (40-60% humidity), avoid smoke and irritants, practice breathing exercises, and monitor symptoms.', 
//     priority: 'medium' 
//   }},
//   { features: [38.3, 102, 135, 85, 91, 70, 0, 1], suggestion: { 
//     type: 'critical', category: 'Respiratory Health', 
//     message: 'Concerning respiratory pattern with fever and low oxygen. Seek medical evaluation for potential respiratory infection, use prescribed medications, and isolate if infectious.', 
//     priority: 'high' 
//   }},
//   { features: [37.5, 88, 125, 80, 93, 75, 0, 1], suggestion: { 
//     type: 'warning', category: 'Respiratory Health', 
//     message: 'Respiratory symptoms with environmental factors. Improve air quality, use bronchodilators if prescribed, practice pursed-lip breathing, and avoid triggers.', 
//     priority: 'medium' 
//   }}
// ];

// // ---- KNN Implementation ----
// class HealthKNN {
//   constructor(dataset, k = 3) {
//     this.dataset = dataset;
//     this.k = k;
//     this.featureRanges = [
//       [35, 42],    // temperature range (°C)
//       [50, 150],   // heart rate range (BPM)
//       [80, 200],   // systolic BP range (mmHg)
//       [50, 120],   // diastolic BP range (mmHg)
//       [80, 100],   // SpO2 range (%)
//       [20, 100],   // humidity range (%)
//       [0, 5],      // alcohol range
//       [0, 1]       // CO2 range (boolean)
//     ];
    
//     // Feature weights (higher = more important)
//     this.featureWeights = [1.5, 1.2, 2.0, 2.0, 2.5, 0.5, 1.0, 1.8];
//   }

//   normalizeFeatures(features) {
//     return features.map((feature, idx) => {
//       const [min, max] = this.featureRanges[idx];
//       const normalized = (feature - min) / (max - min);
//       return Math.max(0, Math.min(1, normalized));
//     });
//   }

//   calculateDistance(features1, features2) {
//     const normalized1 = this.normalizeFeatures(features1);
//     const normalized2 = this.normalizeFeatures(features2);
    
//     return Math.sqrt(
//       normalized1.reduce((sum, val, idx) => 
//         sum + this.featureWeights[idx] * Math.pow(val - normalized2[idx], 2), 0
//       )
//     );
//   }

//   findKNearestNeighbors(currentFeatures) {
//     const distances = this.dataset.map(data => ({
//       ...data,
//       distance: this.calculateDistance(currentFeatures, data.features)
//     }));

//     return distances
//       .sort((a, b) => a.distance - b.distance)
//       .slice(0, this.k);
//   }

//   generateSuggestions(currentFeatures) {
//     const neighbors = this.findKNearestNeighbors(currentFeatures);
    
//     const maxDistance = Math.max(...neighbors.map(n => n.distance));
    
//     const weightedSuggestions = neighbors.map(neighbor => {
//       const weight = 1 / (neighbor.distance + 0.001);
//       const confidence = Math.round((1 - (neighbor.distance / (maxDistance + 0.001))) * 100);
      
//       return {
//         ...neighbor.suggestion,
//         weight,
//         confidence: Math.max(10, Math.min(100, confidence)),
//         distance: neighbor.distance
//       };
//     });

//     const suggestionGroups = {};
//     weightedSuggestions.forEach(suggestion => {
//       const category = suggestion.category;
//       if (!suggestionGroups[category] || 
//           suggestionGroups[category].weight < suggestion.weight) {
//         suggestionGroups[category] = suggestion;
//       }
//     });

//     return Object.values(suggestionGroups)
//       .sort((a, b) => {
//         const priorityOrder = { high: 3, medium: 2, low: 1 };
//         const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
//         if (priorityDiff === 0) {
//           return b.confidence - a.confidence;
//         }
//         return priorityDiff;
//       })
//       .slice(0, 5);
//   }
// }

// // ---- helpers ----
// const isActiveFlag = (v) => v === 1 || v === '1' || v === true;

// const toNumber = (v) => {
//   if (v === null || v === undefined || v === '' || v === 'null' || v === 'undefined') return NaN;
//   const n = Number(v);
//   return Number.isFinite(n) ? n : NaN;
// };

// // Helper function to check if CO₂ is high (handles string "1", number 1, or boolean true)
// const isCO2High = (co2Value) => {
//   return co2Value === "1" || co2Value === 1 || co2Value === true;
// };

// // Initialize KNN model
// const healthKNN = new HealthKNN(healthDataset, 3);

// const Dashboard = () => {
//   const [patientData, setPatientData] = useState(null);
//   const [alerts, setAlerts] = useState([]);
//   const [showAlert, setShowAlert] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('connecting');
//   const [historicalData, setHistoricalData] = useState([]);
//   const maxDataPoints = 20;
//   const lastWriteRef = useRef({}); 
//   const writingRef = useRef(false);

//   useEffect(() => {
//     const nodePath = 'KS5160_Lung_Heart';
//     const dataRef = ref(database, nodePath);

//     const unsub = onValue(
//       dataRef,
//       (snap) => {
//         const data = snap.val();
//         if (data) {
//           setPatientData(data);
//           setConnectionStatus('connected');
//           checkForAlerts(data);
//           addToHistoricalData(data);
//           maybeTriggerAutoNotifications(data, nodePath);
//         }
//       },
//       (err) => {
//         console.error('Firebase connection error:', err);
//         setConnectionStatus('error');
//       }
//     );

//     return () => unsub();
//   }, []);

//   const addToHistoricalData = (data) => {
//     const sensorData = data['1_Sensor_Data'] || {};
//     const timestamp = new Date();
//     const timeString = timestamp.toLocaleTimeString();
    
//     const bpData = sensorData['5_bp'] || {};
//     const systolic = toNumber(bpData['2_systolic']);
//     const diastolic = toNumber(bpData['1_diastolic']);
    
//     // Handle CO₂ value (can be "1", 1, or true for high)
//     const co2Value = sensorData['1_co2'];
//     const co2Numeric = isCO2High(co2Value) ? 1 : 0;
    
//     const newDataPoint = {
//       time: timeString,
//       timestamp: timestamp.getTime(),
//       temperature: toNumber(sensorData['3_temp']) || null,
//       heartRate: toNumber(sensorData['6_hr']) || null,
//       systolic: Number.isFinite(systolic) ? systolic : null,
//       diastolic: Number.isFinite(diastolic) ? diastolic : null,
//       spo2: toNumber(sensorData['7_spo2']) || null,
//       humidity: toNumber(sensorData['4_hum']) || null,
//       alcohol: toNumber(sensorData['2_alcohol']) || null,
//       soundLevel: toNumber(sensorData['8_sound']) || null,
//       co2: co2Numeric
//     };

//     setHistoricalData(prev => {
//       const updated = [...prev, newDataPoint];
//       return updated.slice(-maxDataPoints);
//     });
//   };

//   const checkForAlerts = (data) => {
//     const newAlerts = [];
//     const sensorData = data['1_Sensor_Data'];
//     const notificationData = data['2_Notification'];

//     if (sensorData) {
//       const temp = toNumber(sensorData['3_temp']);
//       if (Number.isFinite(temp) && temp > 38) {
//         newAlerts.push({
//           id: `temp-${Date.now()}`,
//           type: 'critical',
//           message: `High Temperature: ${temp}°C`,
//           timestamp: new Date().toLocaleTimeString()
//         });
//       }

//       const hr = toNumber(sensorData['6_hr']);
//       if (Number.isFinite(hr) && hr > 100) {
//         newAlerts.push({
//           id: `hr-${Date.now()}`,
//           type: 'warning',
//           message: `High Heart Rate: ${hr} BPM`,
//           timestamp: new Date().toLocaleTimeString()
//         });
//       }

//       const spo2 = toNumber(sensorData['7_spo2']);
//       if (Number.isFinite(spo2) && spo2 < 95) {
//         newAlerts.push({
//           id: `spo2-${Date.now()}`,
//           type: 'critical',
//           message: `Low SpO₂: ${spo2}%`,
//           timestamp: new Date().toLocaleTimeString()
//         });
//       }

//       // Updated CO₂ alert logic to handle string "1"
//       if (isCO2High(sensorData['1_co2'])) {
//         newAlerts.push({
//           id: `co2-${Date.now()}`,
//           type: 'warning',
//           message: 'High CO₂ Level Detected',
//           timestamp: new Date().toLocaleTimeString()
//         });
//       }

//       const alcohol = toNumber(sensorData['2_alcohol']);
//       if (Number.isFinite(alcohol) && alcohol > 0) {
//         newAlerts.push({
//           id: `alcohol-${Date.now()}`,
//           type: 'info',
//           message: `Alcohol Detected: Level ${alcohol}`,
//           timestamp: new Date().toLocaleTimeString()
//         });
//       }
//     }

//     if (data['2_Notification']) {
//       const n = data['2_Notification'];
      
//       if (n['1_Alert']) {
//         const alertType = n['1_Alert'].toLowerCase();
        
//         if (alertType === 'cough') {
//           newAlerts.push({
//             id: `cough-${Date.now()}`,
//             type: 'info',
//             message: 'Cough Alert Detected',
//             timestamp: new Date().toLocaleTimeString()
//           });
//         }
        
//         if (alertType === 'tb') {
//           newAlerts.push({
//             id: `tb-${Date.now()}`,
//             type: 'critical',
//             message: 'TB Risk Alert Detected',
//             timestamp: new Date().toLocaleTimeString()
//           });
//         }
        
//         if (alertType === 'asthma') {
//           newAlerts.push({
//             id: `asthma-${Date.now()}`,
//             type: 'warning',
//             message: 'Asthma Alert Detected',
//             timestamp: new Date().toLocaleTimeString()
//           });
//         }
//       }
      
//       const bpObj = sensorData['5_bp'] || {};
//       const systolic = toNumber(bpObj['2_systolic']);
//       const diastolic = toNumber(bpObj['1_diastolic']);
//       const isBPHigh = (Number.isFinite(systolic) && systolic > 120) || (Number.isFinite(diastolic) && diastolic > 80);
      
//       if (isActiveFlag(n['4_hypertension']) && isBPHigh) {
//         newAlerts.push({
//           id: `hypertension-${Date.now()}`,
//           type: 'critical',
//           message: 'Hypertension Alert',
//           timestamp: new Date().toLocaleTimeString()
//         });
//       }
//     }

//     if (newAlerts.length > 0) {
//       setAlerts((prev) => [...newAlerts, ...prev.slice(0, 4)]);
//       setShowAlert(true);
//       setTimeout(() => setShowAlert(false), 8000);
//     }
//   };

//   const maybeTriggerAutoNotifications = async (data, nodePath) => {
//     const sensor = data?.['1_Sensor_Data'] || {};
//     const notif = data?.['2_Notification'] || {};
//     const sound = toNumber(sensor['8_sound']);
//     const bpObj = sensor['5_bp'] || {};
//     const sys = toNumber(bpObj['2_systolic']);
//     const dia = toNumber(bpObj['1_diastolic']);
//     const toSet = {};

//     if (sound === 1) {
//       toSet['1_Alert'] = 'cough';
//     } else if (sound === 2) {
//       toSet['1_Alert'] = 'tb';
//     } else if (sound === 3) {
//       toSet['1_Alert'] = 'asthma';
//     } else if (sound === 0) {
//       if (notif['1_Alert']) toSet['1_Alert'] = '';
//     }

//     if ((Number.isFinite(sys) && sys > 120) || (Number.isFinite(dia) && dia > 80)) {
//       if (!isActiveFlag(notif['4_hypertension'])) toSet['4_hypertension'] = 1;
//     }

//     if (Object.keys(toSet).length === 0 || writingRef.current) return;
//     const already = Object.entries(toSet).every(([k, v]) => lastWriteRef.current[k] === v);
//     if (already) return;

//     try {
//       writingRef.current = true;
//       await update(ref(database, `${nodePath}/2_Notification`), toSet);
//       lastWriteRef.current = { ...lastWriteRef.current, ...toSet };
//       writingRef.current = false;
//     } catch (e) {
//       console.error('Failed to update notifications:', e);
//       writingRef.current = false;
//     }
//   };

//   // Enhanced ML Suggestions Generator with comprehensive suggestions for all parameters
//   const generateMLSuggestions = () => {
//     const sensorData = patientData?.['1_Sensor_Data'] || {};
//     const notificationData = patientData?.['2_Notification'] || {};
    
//     // Extract current features for KNN
//     const bpObj = sensorData['5_bp'] || {};
//     const co2Value = sensorData['1_co2'];
//     const co2Feature = isCO2High(co2Value) ? 1 : 0;
    
//     const currentFeatures = [
//       toNumber(sensorData['3_temp']) || 37.0,
//       toNumber(sensorData['6_hr']) || 75,
//       toNumber(bpObj['2_systolic']) || 120,
//       toNumber(bpObj['1_diastolic']) || 80,
//       toNumber(sensorData['7_spo2']) || 98,
//       toNumber(sensorData['4_hum']) || 45,
//       toNumber(sensorData['2_alcohol']) || 0,
//       co2Feature
//     ];

//     // Get KNN-based suggestions
//     let knnSuggestions = healthKNN.generateSuggestions(currentFeatures);

//     // Add comprehensive respiratory condition suggestions
//     if (notificationData['1_Alert']) {
//       const alertType = notificationData['1_Alert'].toLowerCase();
      
//       if (alertType === 'cough') {
//         knnSuggestions.push({
//           type: 'info',
//           category: 'Cough Management',
//           message: 'Cough detected by sound analysis. Stay hydrated (warm water, herbal teas), use humidifier (40-60% humidity), avoid smoking and irritants, try honey or throat lozenges, gargle with salt water, and monitor for fever or blood in sputum.',
//           priority: 'low',
//           confidence: 88
//         });
//       } else if (alertType === 'asthma') {
//         knnSuggestions.push({
//           type: 'warning',
//           category: 'Asthma Management',
//           message: 'Asthma symptoms detected by sound analysis. Use prescribed rescue inhaler (albuterol) immediately, sit upright, practice pursed-lip breathing, remove from triggers (dust, allergens, cold air), use spacer device, and seek medical attention if no improvement in 15-20 minutes.',
//           priority: 'medium',
//           confidence: 92
//         });
//       } else if (alertType === 'tb') {
//         knnSuggestions.push({
//           type: 'critical',
//           category: 'TB Risk Management',
//           message: 'TB risk indicators detected by sound analysis. Seek immediate medical evaluation for TB testing (chest X-ray, sputum test), isolate from others until cleared, wear N95 mask in public, improve nutrition with protein-rich foods, ensure adequate ventilation, and follow all medical instructions strictly.',
//           priority: 'high',
//           confidence: 95
//         });
//       }
//     }

//     // Add parameter-specific suggestions based on current readings
//     const temp = toNumber(sensorData['3_temp']);
//     if (Number.isFinite(temp)) {
//       if (temp > 39) {
//         knnSuggestions.push({
//           type: 'critical',
//           category: 'Fever Management',
//           message: `High fever (${temp}°C) requires immediate attention. Use cooling measures (cool cloths on forehead, lukewarm bath), take prescribed fever reducers (paracetamol/ibuprofen), stay hydrated with electrolyte solutions, rest in cool environment, and seek medical care if temperature exceeds 40°C or persists over 3 days.`,
//           priority: 'high',
//           confidence: 94
//         });
//       } else if (temp > 38) {
//         knnSuggestions.push({
//           type: 'warning',
//           category: 'Fever Management',
//           message: `Moderate fever (${temp}°C) detected. Rest adequately, increase fluid intake (water, clear broths), use paracetamol if needed, monitor temperature every 2-4 hours, avoid alcohol, and consult healthcare provider if fever persists over 48 hours or worsens.`,
//           priority: 'medium',
//           confidence: 89
//         });
//       } else if (temp < 36) {
//         knnSuggestions.push({
//           type: 'warning',
//           category: 'Temperature Management',
//           message: `Low body temperature (${temp}°C) detected. Keep warm with blankets, drink warm fluids, avoid cold environments, check for other symptoms (confusion, shivering), and seek medical attention if temperature continues dropping or symptoms worsen.`,
//           priority: 'medium',
//           confidence: 87
//         });
//       }
//     }

//     const hr = toNumber(sensorData['6_hr']);
//     if (Number.isFinite(hr)) {
//       if (hr > 120) {
//         knnSuggestions.push({
//           type: 'critical',
//           category: 'Heart Rate Management',
//           message: `Very high heart rate (${hr} BPM). Sit down immediately, practice deep diaphragmatic breathing (4-7-8 technique), avoid caffeine and stimulants, stay hydrated, check blood pressure, and seek immediate medical attention if accompanied by chest pain, dizziness, or shortness of breath.`,
//           priority: 'high',
//           confidence: 91
//         });
//       } else if (hr > 100) {
//         knnSuggestions.push({
//           type: 'warning',
//           category: 'Heart Rate Management',
//           message: `Elevated heart rate (${hr} BPM). Practice relaxation techniques (meditation, yoga), avoid caffeine and energy drinks, ensure adequate hydration, check for fever, limit physical activity, and monitor for palpitations or irregular heartbeat.`,
//           priority: 'medium',
//           confidence: 86
//         });
//       } else if (hr < 60) {
//         knnSuggestions.push({
//           type: 'info',
//           category: 'Heart Rate Management',
//           message: `Low heart rate (${hr} BPM) detected. Monitor for dizziness, fatigue, weakness, or fainting. If symptomatic or if rate drops below 50 BPM, consult healthcare provider immediately. Avoid sudden position changes.`,
//           priority: 'medium',
//           confidence: 83
//         });
//       }
//     }

//     const systolic = toNumber(bpObj['2_systolic']);
//     const diastolic = toNumber(bpObj['1_diastolic']);
//     if (Number.isFinite(systolic) && Number.isFinite(diastolic)) {
//       if (systolic > 180 || diastolic > 110) {
//         knnSuggestions.push({
//           type: 'critical',
//           category: 'Blood Pressure Crisis',
//           message: `Hypertensive crisis (${systolic}/${diastolic}). Seek emergency medical care immediately. Rest in upright position, practice slow deep breathing, take prescribed emergency medications, avoid strenuous activities, and do not drive. This requires urgent medical intervention.`,
//           priority: 'high',
//           confidence: 96
//         });
//       } else if (systolic > 140 || diastolic > 90) {
//         knnSuggestions.push({
//           type: 'warning',
//           category: 'Blood Pressure Management',
//           message: `High blood pressure (${systolic}/${diastolic}). Reduce sodium intake (<2300mg/day), practice DASH diet, limit alcohol consumption, take prescribed medications, practice stress reduction techniques, exercise regularly (with doctor approval), and monitor BP daily.`,
//           priority: 'medium',
//           confidence: 88
//         });
//       } else if (systolic < 90 || diastolic < 60) {
//         knnSuggestions.push({
//           type: 'info',
//           category: 'Blood Pressure Management',
//           message: `Low blood pressure (${systolic}/${diastolic}). Stay well hydrated, eat small frequent meals, avoid prolonged standing, rise slowly from sitting/lying positions, increase salt intake moderately (if not contraindicated), and monitor for dizziness or fainting.`,
//           priority: 'low',
//           confidence: 84
//         });
//       }
//     }

//     const spo2 = toNumber(sensorData['7_spo2']);
//     if (Number.isFinite(spo2)) {
//       if (spo2 < 88) {
//         knnSuggestions.push({
//           type: 'critical',
//           category: 'Oxygen Management',
//           message: `Critical oxygen saturation (${spo2}%). Call emergency services immediately. Use supplemental oxygen if available, maintain upright position, practice pursed-lip breathing, use rescue medications, and prepare for emergency transport. This is life-threatening.`,
//           priority: 'high',
//           confidence: 97
//         });
//       } else if (spo2 < 95) {
//         knnSuggestions.push({
//           type: 'warning',
//           category: 'Oxygen Management',
//           message: `Low oxygen saturation (${spo2}%). Practice deep breathing exercises, use bronchodilators if prescribed, maintain good posture, avoid smoking, consider supplemental oxygen, and seek medical evaluation if persistent or worsening.`,
//           priority: 'medium',
//           confidence: 90
//         });
//       }
//     }

//     const humidity = toNumber(sensorData['4_hum']);
//     if (Number.isFinite(humidity)) {
//       if (humidity > 85) {
//         knnSuggestions.push({
//           type: 'warning',
//           category: 'Environmental Management',
//           message: `Very high humidity (${humidity}%). Use dehumidifier to maintain 40-60% humidity, improve ventilation, prevent mold growth, consider air conditioning, monitor for respiratory symptoms, and avoid prolonged exposure to high humidity environments.`,
//           priority: 'medium',
//           confidence: 82
//         });
//       } else if (humidity < 30) {
//         knnSuggestions.push({
//           type: 'info',
//           category: 'Environmental Management',
//           message: `Low humidity (${humidity}%). Use humidifier to prevent dry air effects, stay hydrated, use saline nasal sprays, consider adding plants indoors, avoid over-heating rooms, and monitor for dry skin or respiratory irritation.`,
//           priority: 'low',
//           confidence: 78
//         });
//       }
//     }

//     const alcohol = toNumber(sensorData['2_alcohol']);
//     if (Number.isFinite(alcohol) && alcohol > 0) {
//       if (alcohol >= 4) {
//         knnSuggestions.push({
//           type: 'critical',
//           category: 'Substance Safety',
//           message: `High alcohol level (${alcohol}) detected. Do not drive or operate machinery. Seek assistance from sober person, stay hydrated with water, eat food if possible, avoid additional alcohol, monitor for alcohol poisoning signs, and consider medical evaluation.`,
//           priority: 'high',
//           confidence: 93
//         });
//       } else if (alcohol >= 2) {
//         knnSuggestions.push({
//           type: 'warning',
//           category: 'Substance Safety',
//           message: `Moderate alcohol level (${alcohol}) detected. Avoid driving, stay hydrated with water and electrolytes, eat food, avoid additional alcohol, monitor vital signs, and have someone supervise if symptoms worsen.`,
//           priority: 'medium',
//           confidence: 85
//         });
//       } else {
//         knnSuggestions.push({
//           type: 'info',
//           category: 'Substance Safety',
//           message: `Low alcohol level (${alcohol}) detected. Stay hydrated, avoid driving until sober, eat food, monitor for any changes in condition, and avoid additional alcohol consumption.`,
//           priority: 'low',
//           confidence: 80
//         });
//       }
//     }

//     // CO₂ specific suggestions
//     if (isCO2High(sensorData['1_co2'])) {
//       knnSuggestions.push({
//         type: 'warning',
//         category: 'Air Quality Management',
//         message: 'High CO₂ levels detected. Improve ventilation immediately by opening windows/doors, move to fresh air environment, check HVAC systems, avoid enclosed spaces, use air purifiers if available, and monitor for headaches or drowsiness.',
//         priority: 'medium',
//         confidence: 89
//       });
//     }

//     // Sort by priority and confidence
//     const priorityOrder = { high: 3, medium: 2, low: 1 };
//     return knnSuggestions
//       .sort((a, b) => {
//         const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
//         if (priorityDiff === 0) {
//           return (b.confidence || 0) - (a.confidence || 0);
//         }
//         return priorityDiff;
//       })
//       .slice(0, 8); // Increased to show more comprehensive suggestions
//   };

//   // [Rest of the component methods remain the same...]
//   const dismissAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));

//   const getAlertIcon = (type) => {
//     switch (type) {
//       case 'critical': return '!';
//       case 'warning': return '!';
//       case 'info': return 'i';
//       default: return '*';
//     }
//   };

//   const getVitalStatus = (value, type) => {
//     if (value === null || value === undefined || value === "") return 'normal';
//     const numValue = parseFloat(value);
//     switch (type) {
//       case 'temp':
//         if (numValue > 38) return 'critical';
//         if (numValue > 37.5) return 'warning';
//         return 'normal';
//       case 'hr':
//         if (numValue > 100 || numValue < 60) return 'warning';
//         return 'normal';
//       case 'bp':
//         if (numValue > 180) return 'critical';
//         if (numValue > 140) return 'warning';
//         return 'normal';
//       case 'spo2':
//         if (numValue < 90) return 'critical';
//         if (numValue < 95) return 'warning';
//         return 'normal';
//       default:
//         return 'normal';
//     }
//   };

//   const getSensorValue = (sensorKey, defaultValue = 'N/A') => {
//     const sensorData = patientData?.['1_Sensor_Data'];
//     if (!sensorData) return defaultValue;
//     const value = sensorData[sensorKey];
//     if (value === null || value === undefined || value === "") return defaultValue;
//     return value;
//   };

//   const getSoundLevelDisplay = () => {
//     const soundValue = getSensorValue('8_sound', 0);
//     const numValue = toNumber(soundValue);
    
//     switch (numValue) {
//       case 1: return 'Cough';
//       case 2: return 'TB';
//       case 3: return 'Asthma';
//       case 0: return 'Normal';
//       default: return 'Normal';
//     }
//   };

//   const getSoundLevelStatus = () => {
//     const soundValue = getSensorValue('8_sound', 0);
//     const numValue = toNumber(soundValue);
    
//     if (numValue === 1 || numValue === 2 || numValue === 3) {
//       return 'Detected';
//     }
//     return 'Normal';
//   };

//   const getBloodPressureDisplay = () => {
//     const sensorData = patientData?.['1_Sensor_Data'];
//     if (!sensorData || !sensorData['5_bp']) {
//       return { display: 'No Data', status: 'normal', statusText: 'No Data' };
//     }
//     const bpData = sensorData['5_bp'];
//     let systolic = bpData['2_systolic'];
//     let diastolic = bpData['1_diastolic'];
//     if (systolic === null || systolic === undefined) systolic = "";
//     if (diastolic === null || diastolic === undefined) diastolic = "";
//     systolic = String(systolic).trim();
//     diastolic = String(diastolic).trim();

//     if ((systolic === "" || systolic === "null" || systolic === "undefined") &&
//         (diastolic === "" || diastolic === "null" || diastolic === "undefined")) {
//       return { display: 'Awaiting Data', status: 'normal', statusText: 'Pending' };
//     }

//     const sysDisplay = (systolic === "" || systolic === "null" || systolic === "undefined") ? "--" : systolic;
//     const diaDisplay = (diastolic === "" || diastolic === "null" || diastolic === "undefined") ? "--" : diastolic;
//     const displayText = `${sysDisplay}/${diaDisplay}`;

//     let status = 'normal';
//     let statusText = 'Normal';
//     if (systolic && systolic !== "null" && systolic !== "undefined" && !isNaN(Number(systolic))) {
//       const sysNum = Number(systolic);
//       if (sysNum >= 180) { status = 'critical'; statusText = 'Critical'; }
//       else if (sysNum >= 140) { status = 'warning'; statusText = 'High'; }
//       else if (sysNum < 90) { status = 'warning'; statusText = 'Low'; }
//     }
//     return { display: displayText, status, statusText };
//   };

//   // Custom tooltip for charts
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div style={{
//           backgroundColor: 'rgba(255, 255, 255, 0.95)',
//           padding: '10px',
//           border: '1px solid #ccc',
//           borderRadius: '5px',
//           boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
//         }}>
//           <p style={{ margin: 0, fontWeight: 'bold' }}>{`Time: ${label}`}</p>
//           {payload.map((entry, index) => (
//             <p key={index} style={{ margin: '2px 0', color: entry.color }}>
//               {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'temperature' ? '°C' : 
//                 entry.dataKey === 'heartRate' ? ' BPM' : 
//                 entry.dataKey.includes('spo2') ? '%' : 
//                 entry.dataKey.includes('systolic') || entry.dataKey.includes('diastolic') ? ' mmHg' : 
//                 entry.dataKey === 'humidity' ? '%' : ''}`}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   if (!patientData && connectionStatus === 'connecting') {
//     return (
//       <div className="loading">
//         <div className="loading-spinner"></div>
//         <p>Loading patient data...</p>
//       </div>
//     );
//   }

//   if (connectionStatus === 'error') {
//     return (
//       <div className="error-screen">
//         <div className="error-icon">X</div>
//         <h2>Connection Error</h2>
//         <p>Unable to connect to Firebase database. Please check your connection.</p>
//       </div>
//     );
//   }

//   const sensorData = patientData?.['1_Sensor_Data'] || {};
//   const notificationData = patientData?.['2_Notification'] || {};
//   const bpInfo = getBloodPressureDisplay();

//   return (
//     <div className="health-dashboard">
//       <header className="health-dashboard-header">
//         <h1>Health Monitoring Dashboard</h1>
//       </header>

//       {/* Alert Notifications (toasts) */}
//       <div className={`alert-container ${showAlert ? 'show' : ''}`}>
//         {alerts.map(alert => (
//           <div key={alert.id} className={`alert alert-${alert.type}`}>
//             <span className="alert-icon">{getAlertIcon(alert.type)}</span>
//             <div className="alert-content">
//               <div className="alert-message">{alert.message}</div>
//               <div className="alert-time">{alert.timestamp}</div>
//             </div>
//             <button className="alert-dismiss" onClick={() => dismissAlert(alert.id)}>×</button>
//           </div>
//         ))}
//       </div>

//       <div className="health-dashboard-content">
//         {/* Vital Signs Cards */}
//         <div className="cards-grid">
//           <div className="card">
//             <div className="card-header"><h3>Temperature</h3><span className="card-icon">🌡️</span></div>
//             <div className="card-value">{getSensorValue('3_temp')}°C</div>
//             <div className={`card-status ${getVitalStatus(getSensorValue('3_temp', 0), 'temp')}`}>
//               {getSensorValue('3_temp', 0) > 38 ? 'High' : getSensorValue('3_temp', 0) < 36 ? 'Low' : 'Normal'}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>Heart Rate</h3><span className="card-icon">💓</span></div>
//             <div className="card-value">{getSensorValue('6_hr')} BPM</div>
//             <div className={`card-status ${getVitalStatus(getSensorValue('6_hr', 0), 'hr')}`}>
//               {getSensorValue('6_hr', 0) > 100 ? 'High' : getSensorValue('6_hr', 0) < 60 ? 'Low' : 'Normal'}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>Blood Pressure</h3><span className="card-icon">🩺</span></div>
//             <div className="card-value">
//               {bpInfo.display}
//               {bpInfo.display !== 'No Data' && bpInfo.display !== 'Awaiting Data' && bpInfo.display !== '--/--' && !bpInfo.display.includes('--') ? ' mmHg' : ''}
//             </div>
//             <div className={`card-status ${bpInfo.status}`}>{bpInfo.statusText}</div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>SpO2</h3><span className="card-icon">🫁</span></div>
//             <div className="card-value">{getSensorValue('7_spo2')}%</div>
//             <div className={`card-status ${getVitalStatus(getSensorValue('7_spo2', 100), 'spo2')}`}>
//               {getSensorValue('7_spo2', 100) < 95 ? 'Low' : 'Normal'}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>Humidity</h3><span className="card-icon">💧</span></div>
//             <div className="card-value">{getSensorValue('4_hum')}%</div>
//             <div className="card-status normal">
//               {getSensorValue('4_hum', 0) > 80 ? 'High' : 'Normal'}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>Alcohol Level</h3><span className="card-icon">🍺</span></div>
//             <div className="card-value">{getSensorValue('2_alcohol')}</div>
//             <div className="card-status normal">
//               {toNumber(getSensorValue('2_alcohol', 0)) > 0 ? 'Detected' : 'Normal'}
//             </div>
//           </div>

//           {/* Updated CO₂ Card */}
//           <div className="card">
//             <div className="card-header"><h3>CO₂ Level</h3><span className="card-icon">🌬️</span></div>
//             <div className="card-value">
//               {isCO2High(getSensorValue('1_co2')) ? 'High' : 'Normal'}
//             </div>
//             <div className={`card-status ${isCO2High(getSensorValue('1_co2')) ? 'warning' : 'normal'}`}>
//               {isCO2High(getSensorValue('1_co2')) ? 'High' : 'Normal'}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>Disease</h3><span className="card-icon">🔊</span></div>
//             <div className="card-value">{getSoundLevelDisplay()}</div>
//             <div className="card-status normal">
//               {getSoundLevelStatus()}
//             </div>
//           </div>
//         </div>

//         {/* Charts Section */}
//         {historicalData.length > 0 && (
//           <div className="charts-section">
//             <h2>Vital Signs Trends</h2>
            
//             <div className="charts-grid">
//               <div className="chart-container">
//                 <h3>Temperature Over Time</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <AreaChart data={historicalData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Area 
//                       type="monotone" 
//                       dataKey="temperature" 
//                       stroke="#ff6b6b" 
//                       fill="#ff6b6b" 
//                       fillOpacity={0.6}
//                       connectNulls={false}
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="chart-container">
//                 <h3>Heart Rate Over Time</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={historicalData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Line 
//                       type="monotone" 
//                       dataKey="heartRate" 
//                       stroke="#4ecdc4" 
//                       strokeWidth={3}
//                       dot={{ fill: '#4ecdc4', strokeWidth: 2, r: 4 }}
//                       connectNulls={false}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="chart-container">
//                 <h3>Blood Pressure Over Time</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={historicalData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend />
//                     <Line 
//                       type="monotone" 
//                       dataKey="systolic" 
//                       stroke="#e74c3c" 
//                       strokeWidth={2}
//                       dot={{ fill: '#e74c3c', strokeWidth: 2, r: 3 }}
//                       name="Systolic"
//                       connectNulls={false}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="diastolic" 
//                       stroke="#3498db" 
//                       strokeWidth={2}
//                       dot={{ fill: '#3498db', strokeWidth: 2, r: 3 }}
//                       name="Diastolic"
//                       connectNulls={false}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="chart-container">
//                 <h3>SpO₂ Over Time</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <AreaChart data={historicalData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis domain={['dataMin - 5', 'dataMax + 2']} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Area 
//                       type="monotone" 
//                       dataKey="spo2" 
//                       stroke="#9b59b6" 
//                       fill="#9b59b6" 
//                       fillOpacity={0.6}
//                       connectNulls={false}
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="chart-container">
//                 <h3>Sound Level Over Time</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={historicalData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Bar dataKey="soundLevel" fill="#f39c12" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="chart-container">
//                 <h3>Environmental Factors</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={historicalData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend />
//                     <Line 
//                       type="monotone" 
//                       dataKey="humidity" 
//                       stroke="#27ae60" 
//                       strokeWidth={2}
//                       name="Humidity (%)"
//                       connectNulls={false}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="co2" 
//                       stroke="#e67e22" 
//                       strokeWidth={2}
//                       name="CO₂ Level"
//                       connectNulls={false}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Enhanced KNN-based AI Health Recommendations */}
//         <div className="ml-suggestions-panel">
//           <h3>🤖 Comprehensive AI Health Recommendations</h3>
//           <p className="disclaimer">
//             These are AI-generated wellness suggestions based on K-Nearest Neighbors analysis of your current readings compared to similar health patterns. Includes specific guidance for cough, TB, asthma, and all vital parameters. Always consult healthcare professionals for medical advice.
//           </p>
//           <div className="suggestions-grid">
//             {generateMLSuggestions().map((suggestion, index) => (
//               <div key={index} className={`suggestion-item ${suggestion.type}`}>
//                 <div className="suggestion-header">
//                   <span className="suggestion-category">{suggestion.category}</span>
//                   <div className="suggestion-badges">
//                     <span className={`suggestion-priority priority-${suggestion.priority}`}>
//                       {suggestion.priority.toUpperCase()}
//                     </span>
//                     {suggestion.confidence && (
//                       <span className="suggestion-confidence">
//                         {suggestion.confidence}% match
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="suggestion-message">{suggestion.message}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .charts-section {
//           margin: 2rem 0;
//           padding: 1.5rem;
//           background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
//           border-radius: 15px;
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
//         }
        
//         .charts-section h2 {
//           text-align: center;
//           color: #2c3e50;
//           margin-bottom: 2rem;
//           font-size: 1.8rem;
//           font-weight: bold;
//         }
        
//         .charts-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
//           gap: 2rem;
//         }
        
//         .chart-container {
//           background: white;
//           padding: 1.5rem;
//           border-radius: 12px;
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
//           border: 1px solid #e1e8ed;
//         }
        
//         .chart-container h3 {
//           margin: 0 0 1rem 0;
//           color: #34495e;
//           font-size: 1.2rem;
//           font-weight: 600;
//           text-align: center;
//         }
        
//         .ml-suggestions-panel {
//           background: rgba(255, 255, 255, 0.95);
//           padding: 1.5rem;
//           border-radius: 15px;
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
//           backdrop-filter: blur(10px);
//           margin: 2rem 0;
//         }
        
//         .ml-suggestions-panel h3 {
//           margin: 0 0 0.5rem 0;
//           color: #2c3e50;
//           font-size: 1.3rem;
//           display: flex;
//           align-items: center;
//         }
        
//         .disclaimer {
//           font-size: 0.85rem;
//           color: #7f8c8d;
//           margin-bottom: 1.5rem;
//           font-style: italic;
//           padding: 0.75rem;
//           background: #f8f9fa;
//           border-radius: 8px;
//           border-left: 4px solid #3498db;
//         }
        
//         .suggestions-grid {
//           display: grid;
//           gap: 1rem;
//         }
        
//         .suggestion-item {
//           padding: 1rem;
//           border-radius: 10px;
//           border-left: 4px solid #3498db;
//           background: #f8f9fa;
//           transition: transform 0.2s ease, box-shadow 0.2s ease;
//         }
        
//         .suggestion-item:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         }
        
//         .suggestion-item.critical {
//           border-left-color: #e74c3c;
//           background: #fdf2f2;
//         }
        
//         .suggestion-item.warning {
//           border-left-color: #f39c12;
//           background: #fefbf3;
//         }
        
//         .suggestion-item.info {
//           border-left-color: #3498db;
//           background: #f3f9ff;
//         }
        
//         .suggestion-item.success {
//           border-left-color: #27ae60;
//           background: #f0fdf4;
//         }
        
//         .suggestion-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 0.5rem;
//         }
        
//         .suggestion-category {
//           font-weight: 600;
//           color: #2c3e50;
//           font-size: 0.9rem;
//         }
        
//         .suggestion-badges {
//           display: flex;
//           gap: 0.5rem;
//           align-items: center;
//         }
        
//         .suggestion-priority {
//           padding: 0.2rem 0.5rem;
//           border-radius: 12px;
//           font-size: 0.7rem;
//           font-weight: bold;
//           text-transform: uppercase;
//         }
        
//         .suggestion-confidence {
//           padding: 0.2rem 0.5rem;
//           border-radius: 12px;
//           font-size: 0.7rem;
//           background: #34495e;
//           color: white;
//           font-weight: bold;
//         }
        
//         .priority-high {
//           background: #e74c3c;
//           color: white;
//         }
        
//         .priority-medium {
//           background: #f39c12;
//           color: white;
//         }
        
//         .priority-low {
//           background: #95a5a6;
//           color: white;
//         }
        
//         .suggestion-message {
//           color: #34495e;
//           line-height: 1.4;
//           font-size: 0.9rem;
//         }
        
//         .loading {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 100vh;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//         }
        
//         .loading-spinner {
//           width: 50px;
//           height: 50px;
//           border: 4px solid rgba(255, 255, 255, 0.3);
//           border-top: 4px solid white;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin-bottom: 1rem;
//         }
        
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
        
//         .error-screen {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 100vh;
//           background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
//           color: white;
//           text-align: center;
//         }
        
//         .error-icon {
//           font-size: 4rem;
//           margin-bottom: 1rem;
//         }
        
//         .health-dashboard {
//           min-height: 100vh;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           font-family: 'Arial', sans-serif;
//         }
        
//         .health-dashboard-header {
//           background: rgba(255, 255, 255, 0.95);
//           padding: 1.5rem;
//           box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
//           backdrop-filter: blur(10px);
//         }
        
//         .health-dashboard-header h1 {
//           margin: 0;
//           color: #2c3e50;
//           font-size: 2rem;
//           font-weight: bold;
//         }
        
//         .health-dashboard-content {
//           padding: 2rem;
//         }
        
//         .cards-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//           gap: 1.5rem;
//           margin-bottom: 2rem;
//         }
        
//         .card {
//           background: rgba(255, 255, 255, 0.95);
//           padding: 1.5rem;
//           border-radius: 15px;
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//         }
        
//         .card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
//         }
        
//         .card-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 1rem;
//         }
        
//         .card-header h3 {
//           margin: 0;
//           color: #34495e;
//           font-size: 1.1rem;
//         }
        
//         .card-icon {
//           font-size: 1.5rem;
//         }
        
//         .card-value {
//           font-size: 2rem;
//           font-weight: bold;
//           color: #2c3e50;
//           margin-bottom: 0.5rem;
//         }
        
//         .card-status {
//           padding: 0.3rem 0.8rem;
//           border-radius: 20px;
//           font-size: 0.85rem;
//           font-weight: 600;
//           text-transform: uppercase;
//         }
        
//         .card-status.normal {
//           background: #d5f4e6;
//           color: #27ae60;
//         }
        
//         .card-status.warning {
//           background: #fef9e7;
//           color: #f39c12;
//         }
        
//         .card-status.critical {
//           background: #fadbd8;
//           color: #e74c3c;
//         }
        
//         .alert-container {
//           position: fixed;
//           top: 20px;
//           right: 20px;
//           z-index: 1000;
//           opacity: 0;
//           transform: translateX(100%);
//           transition: all 0.3s ease;
//         }
        
//         .alert-container.show {
//           opacity: 1;
//           transform: translateX(0);
//         }
        
//         .alert {
//           display: flex;
//           align-items: center;
//           margin-bottom: 0.5rem;
//           padding: 1rem;
//           border-radius: 8px;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//           min-width: 300px;
//           max-width: 400px;
//         }
        
//         .alert-critical {
//           background: #fadbd8;
//           border-left: 4px solid #e74c3c;
//         }
        
//         .alert-warning {
//           background: #fef9e7;
//           border-left: 4px solid #f39c12;
//         }
        
//         .alert-info {
//           background: #d6eaf8;
//           border-left: 4px solid #3498db;
//         }
        
//         .alert-icon {
//           background: #e74c3c;
//           color: white;
//           width: 24px;
//           height: 24px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: bold;
//           margin-right: 1rem;
//           font-size: 0.8rem;
//         }
        
//         .alert-content {
//           flex: 1;
//         }
        
//         .alert-message {
//           font-weight: 600;
//           margin-bottom: 0.2rem;
//         }
        
//         .alert-time {
//           font-size: 0.8rem;
//           color: #7f8c8d;
//         }
        
//         .alert-dismiss {
//           background: none;
//           border: none;
//           font-size: 1.2rem;
//           cursor: pointer;
//           color: #7f8c8d;
//           padding: 0;
//           margin-left: 0.5rem;
//         }
        
//         .alert-dismiss:hover {
//           color: #2c3e50;
//         }
        
//         @media (max-width: 768px) {
//           .health-dashboard-content {
//             padding: 1rem;
//           }
          
//           .cards-grid, .charts-grid {
//             grid-template-columns: 1fr;
//           }
          
//           .alert-container {
//             right: 10px;
//             left: 10px;
//           }
          
//           .alert {
//             min-width: auto;
//           }
          
//           .chart-container {
//             min-width: 300px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Dashboard;



// // Dashboard.js - Enhanced with Early Warning System and Comprehensive ML Suggestions
// import React, { useState, useEffect, useRef } from 'react';
// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getDatabase, ref, onValue, update } from 'firebase/database';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
// import './MedicalDashboard.css';

// // Firebase Configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAhLCi6JBT5ELkAFxTplKBBDdRdpATzQxI",
//   authDomain: "smart-medicine-vending-machine.firebaseapp.com",
//   databaseURL: "https://smart-medicine-vending-machine-default-rtdb.asia-southeast1.firebasedatabase.app",
//   projectId: "smart-medicine-vending-machine",
//   storageBucket: "smart-medicine-vending-machine.firebasestorage.app",
//   messagingSenderId: "705021997077",
//   appId: "1:705021997077:web:5af9ec0b267e597e1d5e1c",
//   measurementId: "G-PH0XLJSYVS"
// };

// // Initialize Firebase with unique app name
// const appName = 'medical-dashboard-app';
// let app;
// try {
//   app = getApp(appName);
// } catch {
//   app = initializeApp(firebaseConfig, appName);
// }
// const database = getDatabase(app);

// // Enhanced KNN Health Dataset with Comprehensive Scenarios
// const healthDataset = [
//   // Normal cases
//   { features: [36.8, 72, 115, 75, 98, 45, 0, 0], suggestion: { 
//     type: 'success', category: 'Wellness', 
//     message: 'All vital signs are normal. Maintain a healthy lifestyle with regular exercise and balanced nutrition.', 
//     priority: 'low' 
//   }},
//   { features: [37.1, 78, 118, 78, 97, 50, 0, 0], suggestion: { 
//     type: 'success', category: 'Wellness', 
//     message: 'Excellent vital signs. Continue your current healthy habits and stay hydrated.', 
//     priority: 'low' 
//   }},
  
//   // Temperature-related cases
//   { features: [38.2, 85, 125, 82, 96, 55, 0, 0], suggestion: { 
//     type: 'warning', category: 'Temperature Management', 
//     message: 'Mild fever detected. Rest, stay hydrated (8-10 glasses water), monitor temperature every 2-4 hours, and consider paracetamol if needed.', 
//     priority: 'medium' 
//   }},
//   { features: [39.1, 105, 135, 88, 94, 60, 0, 0], suggestion: { 
//     type: 'critical', category: 'Temperature Management', 
//     message: 'High fever with elevated heart rate. Seek medical attention immediately, use cooling measures (cool cloths, lukewarm bath), and stay hydrated.', 
//     priority: 'high' 
//   }},
//   { features: [35.8, 58, 110, 70, 98, 45, 0, 0], suggestion: { 
//     type: 'warning', category: 'Temperature Management', 
//     message: 'Low body temperature detected. Keep warm with blankets, monitor closely, and consult healthcare provider if symptoms persist.', 
//     priority: 'medium' 
//   }},
  
//   // Heart Rate variations
//   { features: [37.0, 110, 120, 78, 97, 50, 0, 0], suggestion: { 
//     type: 'warning', category: 'Heart Rate Management', 
//     message: 'Elevated heart rate detected. Practice deep breathing, avoid caffeine and stimulants, rest in quiet environment, and monitor for palpitations.', 
//     priority: 'medium' 
//   }},
//   { features: [36.8, 55, 115, 75, 98, 45, 0, 0], suggestion: { 
//     type: 'info', category: 'Heart Rate Management', 
//     message: 'Low heart rate detected. If experiencing dizziness, fatigue, or weakness, consult healthcare provider. Monitor for syncope episodes.', 
//     priority: 'medium' 
//   }},
//   { features: [37.2, 130, 140, 90, 96, 55, 0, 0], suggestion: { 
//     type: 'critical', category: 'Heart Rate Management', 
//     message: 'Very high heart rate detected. Seek immediate medical attention, sit down, practice deep breathing, and avoid any physical exertion.', 
//     priority: 'high' 
//   }},
  
//   // Blood Pressure conditions
//   { features: [37.0, 80, 150, 95, 98, 45, 0, 0], suggestion: { 
//     type: 'warning', category: 'Blood Pressure Management', 
//     message: 'High blood pressure detected. Reduce sodium intake, practice deep breathing exercises, limit alcohol, take prescribed medications, and monitor regularly.', 
//     priority: 'medium' 
//   }},
//   { features: [37.2, 85, 180, 110, 97, 50, 0, 0], suggestion: { 
//     type: 'critical', category: 'Blood Pressure Management', 
//     message: 'Hypertensive crisis detected. Go to emergency room immediately. Rest in upright position, avoid strenuous activities, and take prescribed emergency medications.', 
//     priority: 'high' 
//   }},
//   { features: [36.9, 75, 90, 55, 98, 45, 0, 0], suggestion: { 
//     type: 'info', category: 'Blood Pressure Management', 
//     message: 'Low blood pressure detected. Stay hydrated, avoid sudden position changes, eat small frequent meals, and monitor for dizziness or fainting.', 
//     priority: 'low' 
//   }},
  
//   // Oxygen Saturation issues
//   { features: [36.9, 92, 125, 80, 92, 55, 0, 0], suggestion: { 
//     type: 'warning', category: 'Oxygen Saturation Management', 
//     message: 'Low oxygen saturation detected. Practice deep breathing exercises, ensure good posture, use supplemental oxygen if prescribed, and monitor closely.', 
//     priority: 'medium' 
//   }},
//   { features: [37.2, 95, 130, 85, 89, 60, 0, 1], suggestion: { 
//     type: 'critical', category: 'Oxygen Saturation Management', 
//     message: 'Critical oxygen levels with high CO₂. Seek immediate medical attention, improve ventilation, use rescue medications, and call emergency services.', 
//     priority: 'high' 
//   }},
//   { features: [37.5, 100, 135, 88, 87, 65, 0, 1], suggestion: { 
//     type: 'critical', category: 'Oxygen Saturation Management', 
//     message: 'Severe hypoxia detected. Call emergency services immediately. Use supplemental oxygen, maintain upright position, and prepare for emergency transport.', 
//     priority: 'high' 
//   }},
  
//   // Environmental factors
//   { features: [37.0, 85, 125, 82, 94, 85, 0, 1], suggestion: { 
//     type: 'warning', category: 'Environmental Management', 
//     message: 'High humidity and CO₂ levels detected. Improve ventilation immediately, use dehumidifier, consider air purification, and move to well-ventilated area.', 
//     priority: 'medium' 
//   }},
//   { features: [36.9, 80, 120, 78, 96, 90, 0, 1], suggestion: { 
//     type: 'warning', category: 'Environmental Management', 
//     message: 'Poor air quality detected. Move to well-ventilated area, use air purifier, avoid outdoor activities during high pollution, and consider wearing mask.', 
//     priority: 'medium' 
//   }},
//   { features: [37.1, 78, 118, 78, 97, 95, 0, 1], suggestion: { 
//     type: 'critical', category: 'Environmental Management', 
//     message: 'Very high humidity with elevated CO₂. Immediate ventilation needed. Risk of respiratory complications - seek fresh air environment immediately.', 
//     priority: 'high' 
//   }},
  
//   // Alcohol-related cases
//   { features: [37.2, 88, 130, 85, 96, 55, 2, 0], suggestion: { 
//     type: 'info', category: 'Substance Management', 
//     message: 'Moderate alcohol detected. Stay hydrated with water, avoid driving, monitor vital signs, eat food, and avoid additional alcohol consumption.', 
//     priority: 'low' 
//   }},
//   { features: [37.5, 95, 140, 90, 94, 60, 4, 0], suggestion: { 
//     type: 'warning', category: 'Substance Management', 
//     message: 'High alcohol levels with elevated vitals. Seek assistance from someone sober, avoid further alcohol, stay hydrated, and consider medical evaluation.', 
//     priority: 'medium' 
//   }},
//   { features: [38.1, 108, 155, 98, 92, 65, 5, 0], suggestion: { 
//     type: 'critical', category: 'Substance Management', 
//     message: 'Dangerous alcohol levels with multiple elevated vitals. Seek immediate medical attention for alcohol poisoning risk. Do not leave person alone.', 
//     priority: 'high' 
//   }},
  
//   // Multiple conditions
//   { features: [38.8, 110, 160, 100, 91, 70, 0, 1], suggestion: { 
//     type: 'critical', category: 'Multiple Conditions', 
//     message: 'Multiple critical readings: fever, tachycardia, hypertension, hypoxia, and poor air quality. Seek emergency medical care immediately.', 
//     priority: 'high' 
//   }},
//   { features: [38.5, 105, 155, 98, 93, 65, 1, 0], suggestion: { 
//     type: 'critical', category: 'Multiple Conditions', 
//     message: 'Fever, high BP, and low oxygen with alcohol detected. Avoid alcohol, seek medical attention, improve ventilation, and monitor closely.', 
//     priority: 'high' 
//   }},
  
//   // Respiratory-focused cases (for cough, TB, asthma scenarios)
//   { features: [37.8, 95, 128, 82, 94, 60, 0, 0], suggestion: { 
//     type: 'warning', category: 'Respiratory Health', 
//     message: 'Mild respiratory symptoms pattern. Stay hydrated, use humidifier (40-60% humidity), avoid smoke and irritants, practice breathing exercises, and monitor symptoms.', 
//     priority: 'medium' 
//   }},
//   { features: [38.3, 102, 135, 85, 91, 70, 0, 1], suggestion: { 
//     type: 'critical', category: 'Respiratory Health', 
//     message: 'Concerning respiratory pattern with fever and low oxygen. Seek medical evaluation for potential respiratory infection, use prescribed medications, and isolate if infectious.', 
//     priority: 'high' 
//   }},
//   { features: [37.5, 88, 125, 80, 93, 75, 0, 1], suggestion: { 
//     type: 'warning', category: 'Respiratory Health', 
//     message: 'Respiratory symptoms with environmental factors. Improve air quality, use bronchodilators if prescribed, practice pursed-lip breathing, and avoid triggers.', 
//     priority: 'medium' 
//   }}
// ];

// // KNN Implementation
// class HealthKNN {
//   constructor(dataset, k = 3) {
//     this.dataset = dataset;
//     this.k = k;
//     this.featureRanges = [
//       [35, 42],    // temperature range (°C)
//       [50, 150],   // heart rate range (BPM)
//       [80, 200],   // systolic BP range (mmHg)
//       [50, 120],   // diastolic BP range (mmHg)
//       [80, 100],   // SpO2 range (%)
//       [20, 100],   // humidity range (%)
//       [0, 5],      // alcohol range
//       [0, 1]       // CO2 range (boolean)
//     ];
    
//     // Feature weights (higher = more important)
//     this.featureWeights = [1.5, 1.2, 2.0, 2.0, 2.5, 0.5, 1.0, 1.8];
//   }

//   normalizeFeatures(features) {
//     return features.map((feature, idx) => {
//       const [min, max] = this.featureRanges[idx];
//       const normalized = (feature - min) / (max - min);
//       return Math.max(0, Math.min(1, normalized));
//     });
//   }

//   calculateDistance(features1, features2) {
//     const normalized1 = this.normalizeFeatures(features1);
//     const normalized2 = this.normalizeFeatures(features2);
    
//     return Math.sqrt(
//       normalized1.reduce((sum, val, idx) => 
//         sum + this.featureWeights[idx] * Math.pow(val - normalized2[idx], 2), 0
//       )
//     );
//   }

//   findKNearestNeighbors(currentFeatures) {
//     const distances = this.dataset.map(data => ({
//       ...data,
//       distance: this.calculateDistance(currentFeatures, data.features)
//     }));

//     return distances
//       .sort((a, b) => a.distance - b.distance)
//       .slice(0, this.k);
//   }

//   generateSuggestions(currentFeatures) {
//     const neighbors = this.findKNearestNeighbors(currentFeatures);
    
//     const maxDistance = Math.max(...neighbors.map(n => n.distance));
    
//     const weightedSuggestions = neighbors.map(neighbor => {
//       const weight = 1 / (neighbor.distance + 0.001);
//       const confidence = Math.round((1 - (neighbor.distance / (maxDistance + 0.001))) * 100);
      
//       return {
//         ...neighbor.suggestion,
//         weight,
//         confidence: Math.max(10, Math.min(100, confidence)),
//         distance: neighbor.distance
//       };
//     });

//     const suggestionGroups = {};
//     weightedSuggestions.forEach(suggestion => {
//       const category = suggestion.category;
//       if (!suggestionGroups[category] || 
//           suggestionGroups[category].weight < suggestion.weight) {
//         suggestionGroups[category] = suggestion;
//       }
//     });

//     return Object.values(suggestionGroups)
//       .sort((a, b) => {
//         const priorityOrder = { high: 3, medium: 2, low: 1 };
//         const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
//         if (priorityDiff === 0) {
//           return b.confidence - a.confidence;
//         }
//         return priorityDiff;
//       })
//       .slice(0, 5);
//   }
// }

// // Helper functions
// const isActiveFlag = (v) => v === 1 || v === '1' || v === true;

// const toNumber = (v) => {
//   if (v === null || v === undefined || v === '' || v === 'null' || v === 'undefined') return NaN;
//   const n = Number(v);
//   return Number.isFinite(n) ? n : NaN;
// };

// const isCO2High = (co2Value) => {
//   return co2Value === "1" || co2Value === 1 || co2Value === true;
// };

// // Initialize KNN model
// const healthKNN = new HealthKNN(healthDataset, 3);

// const Dashboard = () => {
//   const [patientData, setPatientData] = useState(null);
//   const [alerts, setAlerts] = useState([]);
//   const [showAlert, setShowAlert] = useState(false);
//   const [connectionStatus, setConnectionStatus] = useState('connecting');
//   const [historicalData, setHistoricalData] = useState([]);
//   const maxDataPoints = 20;
//   const lastWriteRef = useRef({}); 
//   const writingRef = useRef(false);

//   useEffect(() => {
//     const nodePath = 'KS5160_Lung_Heart';
//     const dataRef = ref(database, nodePath);

//     const unsub = onValue(
//       dataRef,
//       (snap) => {
//         const data = snap.val();
//         if (data) {
//           setPatientData(data);
//           setConnectionStatus('connected');
//           checkForAlerts(data);
//           addToHistoricalData(data);
//           maybeTriggerAutoNotifications(data, nodePath);
//         }
//       },
//       (err) => {
//         console.error('Firebase connection error:', err);
//         setConnectionStatus('error');
//       }
//     );

//     return () => unsub();
//   }, []);

//   const addToHistoricalData = (data) => {
//     const sensorData = data['1_Sensor_Data'] || {};
//     const timestamp = new Date();
//     const timeString = timestamp.toLocaleTimeString();
    
//     const bpData = sensorData['5_bp'] || {};
//     const systolic = toNumber(bpData['2_systolic']);
//     const diastolic = toNumber(bpData['1_diastolic']);
    
//     const co2Value = sensorData['1_co2'];
//     const co2Numeric = isCO2High(co2Value) ? 1 : 0;
    
//     const newDataPoint = {
//       time: timeString,
//       timestamp: timestamp.getTime(),
//       temperature: toNumber(sensorData['3_temp']) || null,
//       heartRate: toNumber(sensorData['6_hr']) || null,
//       systolic: Number.isFinite(systolic) ? systolic : null,
//       diastolic: Number.isFinite(diastolic) ? diastolic : null,
//       spo2: toNumber(sensorData['7_spo2']) || null,
//       humidity: toNumber(sensorData['4_hum']) || null,
//       alcohol: toNumber(sensorData['2_alcohol']) || null,
//       soundLevel: toNumber(sensorData['8_sound']) || null,
//       co2: co2Numeric
//     };

//     setHistoricalData(prev => {
//       const updated = [...prev, newDataPoint];
//       return updated.slice(-maxDataPoints);
//     });
//   };

//   // Enhanced alert system with early warning thresholds
//   const checkForAlerts = (data) => {
//     const newAlerts = [];
//     const sensorData = data['1_Sensor_Data'];
//     const notificationData = data['2_Notification'];

//     if (sensorData) {
//       // Enhanced Temperature Monitoring with Early Warning
//       const temp = toNumber(sensorData['3_temp']);
//       if (Number.isFinite(temp)) {
//         if (temp >= 39.5) {
//           newAlerts.push({
//             id: `temp-critical-${Date.now()}`,
//             type: 'critical',
//             message: `CRITICAL: Very High Temperature: ${temp}°C - Seek emergency medical attention immediately!`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (temp >= 38.5) {
//           newAlerts.push({
//             id: `temp-high-${Date.now()}`,
//             type: 'critical',
//             message: `HIGH FEVER: Temperature: ${temp}°C - Medical attention required!`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (temp >= 37.8) {
//           newAlerts.push({
//             id: `temp-approaching-${Date.now()}`,
//             type: 'warning',
//             message: `WARNING: Temperature Rising: ${temp}°C - Monitor closely, approaching fever range. Stay hydrated and rest.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (temp <= 35.5) {
//           newAlerts.push({
//             id: `temp-low-critical-${Date.now()}`,
//             type: 'critical',
//             message: `CRITICAL: Very Low Temperature: ${temp}°C - Hypothermia risk! Seek immediate medical attention.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (temp <= 36.0) {
//           newAlerts.push({
//             id: `temp-low-${Date.now()}`,
//             type: 'warning',
//             message: `WARNING: Low Temperature: ${temp}°C - Keep warm and monitor closely.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         }
//       }

//       // Enhanced Heart Rate Monitoring
//       const hr = toNumber(sensorData['6_hr']);
//       if (Number.isFinite(hr)) {
//         if (hr >= 130) {
//           newAlerts.push({
//             id: `hr-critical-${Date.now()}`,
//             type: 'critical',
//             message: `CRITICAL: Very High Heart Rate: ${hr} BPM - Seek immediate medical attention!`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (hr >= 110) {
//           newAlerts.push({
//             id: `hr-high-${Date.now()}`,
//             type: 'warning',
//             message: `WARNING: High Heart Rate: ${hr} BPM - Rest immediately and avoid stimulants.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (hr >= 90) {
//           newAlerts.push({
//             id: `hr-approaching-${Date.now()}`,
//             type: 'info',
//             message: `NOTICE: Heart Rate Elevated: ${hr} BPM - Consider relaxation techniques and monitor.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (hr <= 45) {
//           newAlerts.push({
//             id: `hr-low-critical-${Date.now()}`,
//             type: 'critical',
//             message: `CRITICAL: Very Low Heart Rate: ${hr} BPM - Bradycardia detected! Seek immediate medical attention.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (hr <= 55) {
//           newAlerts.push({
//             id: `hr-low-${Date.now()}`,
//             type: 'warning',
//             message: `WARNING: Low Heart Rate: ${hr} BPM - Monitor for dizziness or weakness.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         }
//       }

//       // Enhanced Blood Pressure Monitoring
//       const bpObj = sensorData['5_bp'] || {};
//       const systolic = toNumber(bpObj['2_systolic']);
//       const diastolic = toNumber(bpObj['1_diastolic']);
      
//       if (Number.isFinite(systolic) && Number.isFinite(diastolic)) {
//         if (systolic >= 180 || diastolic >= 110) {
//           newAlerts.push({
//             id: `bp-crisis-${Date.now()}`,
//             type: 'critical',
//             message: `HYPERTENSIVE CRISIS: BP ${systolic}/${diastolic} - Call emergency services immediately!`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (systolic >= 160 || diastolic >= 100) {
//           newAlerts.push({
//             id: `bp-severe-${Date.now()}`,
//             type: 'critical',
//             message: `SEVERE HYPERTENSION: BP ${systolic}/${diastolic} - Seek immediate medical attention!`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (systolic >= 140 || diastolic >= 90) {
//           newAlerts.push({
//             id: `bp-high-${Date.now()}`,
//             type: 'warning',
//             message: `HIGH BLOOD PRESSURE: BP ${systolic}/${diastolic} - Monitor closely and consult doctor.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (systolic >= 130 || diastolic >= 85) {
//           newAlerts.push({
//             id: `bp-approaching-${Date.now()}`,
//             type: 'info',
//             message: `ELEVATED BP: ${systolic}/${diastolic} - Approaching high range. Practice relaxation and reduce sodium.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (systolic <= 80 || diastolic <= 50) {
//           newAlerts.push({
//             id: `bp-low-severe-${Date.now()}`,
//             type: 'critical',
//             message: `SEVERE HYPOTENSION: BP ${systolic}/${diastolic} - Risk of shock! Seek immediate medical attention.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (systolic <= 90 || diastolic <= 60) {
//           newAlerts.push({
//             id: `bp-low-${Date.now()}`,
//             type: 'warning',
//             message: `LOW BLOOD PRESSURE: BP ${systolic}/${diastolic} - Stay hydrated and avoid sudden movements.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         }
//       }

//       // Enhanced SpO2 Monitoring
//       const spo2 = toNumber(sensorData['7_spo2']);
//       if (Number.isFinite(spo2)) {
//         if (spo2 <= 85) {
//           newAlerts.push({
//             id: `spo2-critical-${Date.now()}`,
//             type: 'critical',
//             message: `SpO₂ ${spo2}% - Call emergency services immediately!`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (spo2 <= 90) {
//           newAlerts.push({
//             id: `spo2-severe-${Date.now()}`,
//             type: 'critical',
//             message: `SEVERE LOW OXYGEN: SpO₂ ${spo2}% - Seek immediate medical attention!`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (spo2 <= 94) {
//           newAlerts.push({
//             id: `spo2-low-${Date.now()}`,
//             type: 'warning',
//             message: `LOW OXYGEN: SpO₂ ${spo2}% - Use breathing exercises and monitor closely.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (spo2 <= 96) {
//           newAlerts.push({
//             id: `spo2-approaching-${Date.now()}`,
//             type: 'info',
//             message: `OXYGEN DECLINING: SpO₂ ${spo2}% - Approaching low range. Practice deep breathing.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         }
//       }

//       // Enhanced Humidity Monitoring
//       const humidity = toNumber(sensorData['4_hum']);
//       if (Number.isFinite(humidity)) {
//         if (humidity >= 90) {
//           newAlerts.push({
//             id: `humidity-critical-${Date.now()}`,
//             type: 'warning',
//             message: `CRITICAL HUMIDITY: ${humidity}% - Immediate ventilation needed! Risk of respiratory issues.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (humidity >= 80) {
//           newAlerts.push({
//             id: `humidity-high-${Date.now()}`,
//             type: 'info',
//             message: `HIGH HUMIDITY: ${humidity}% - Approaching uncomfortable levels. Use dehumidifier.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (humidity <= 20) {
//           newAlerts.push({
//             id: `humidity-low-${Date.now()}`,
//             type: 'info',
//             message: `VERY LOW HUMIDITY: ${humidity}% - Risk of respiratory irritation. Use humidifier.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         }
//       }

//       // Enhanced Alcohol Monitoring
//       const alcohol = toNumber(sensorData['2_alcohol']);
//       if (Number.isFinite(alcohol)) {
//         if (alcohol >= 4) {
//           newAlerts.push({
//             id: `alcohol-dangerous-${Date.now()}`,
//             type: 'critical',
//             message: `DANGEROUS ALCOHOL LEVEL: ${alcohol} - Risk of alcohol poisoning! Seek immediate help.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (alcohol >= 3) {
//           newAlerts.push({
//             id: `alcohol-high-${Date.now()}`,
//             type: 'warning',
//             message: `HIGH ALCOHOL LEVEL: ${alcohol} - Severely impaired. Get assistance immediately.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (alcohol >= 2) {
//           newAlerts.push({
//             id: `alcohol-moderate-${Date.now()}`,
//             type: 'warning',
//             message: `MODERATE ALCOHOL LEVEL: ${alcohol} - Impaired judgment. Avoid driving and get supervision.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         } else if (alcohol >= 1) {
//           newAlerts.push({
//             id: `alcohol-detected-${Date.now()}`,
//             type: 'info',
//             message: `ALCOHOL DETECTED: Level ${alcohol} - Avoid driving and monitor condition.`,
//             timestamp: new Date().toLocaleTimeString()
//           });
//         }
//       }

//       // CO₂ alert logic
//       if (isCO2High(sensorData['1_co2'])) {
//         newAlerts.push({
//           id: `co2-${Date.now()}`,
//           type: 'warning',
//           message: 'HIGH CO₂ LEVEL: Poor air quality detected! Improve ventilation immediately.',
//           timestamp: new Date().toLocaleTimeString()
//         });
//       }
//     }

//     // Disease Detection Alerts
//     if (data['2_Notification']) {
//       const n = data['2_Notification'];
      
//       if (n['1_Alert']) {
//         const alertType = n['1_Alert'].toLowerCase();
        
//         if (alertType === 'cough') {
//           newAlerts.push({
//             id: `cough-${Date.now()}`,
//             type: 'info',
//             message: 'COUGH DETECTED: Sound analysis indicates coughing. Monitor symptoms and stay hydrated.',
//             timestamp: new Date().toLocaleTimeString()
//           });
//         }
        
//         if (alertType === 'tb') {
//           newAlerts.push({
//             id: `tb-${Date.now()}`,
//             type: 'critical',
//             message: 'TB RISK DETECTED: Sound analysis indicates TB symptoms. Seek immediate medical evaluation!',
//             timestamp: new Date().toLocaleTimeString()
//           });
//         }
        
//         if (alertType === 'asthma') {
//           newAlerts.push({
//             id: `asthma-${Date.now()}`,
//             type: 'warning',
//             message: 'ASTHMA SYMPTOMS: Sound analysis indicates breathing difficulties. Use rescue inhaler if available.',
//             timestamp: new Date().toLocaleTimeString()
//           });
//         }
//       }
      
//       const bpObj = sensorData['5_bp'] || {};
//       const systolic = toNumber(bpObj['2_systolic']);
//       const diastolic = toNumber(bpObj['1_diastolic']);
//       const isBPHigh = (Number.isFinite(systolic) && systolic > 120) || (Number.isFinite(diastolic) && diastolic > 80);
      
//       if (isActiveFlag(n['4_hypertension']) && isBPHigh) {
//         newAlerts.push({
//           id: `hypertension-${Date.now()}`,
//           type: 'critical',
//           message: 'HYPERTENSION ALERT: Sustained high blood pressure detected!',
//           timestamp: new Date().toLocaleTimeString()
//         });
//       }
//     }

//     if (newAlerts.length > 0) {
//       setAlerts((prev) => [...newAlerts, ...prev.slice(0, 4)]);
//       setShowAlert(true);
//       setTimeout(() => setShowAlert(false), 12000); // Longer display time for multiple alerts
//     }
//   };

//   const maybeTriggerAutoNotifications = async (data, nodePath) => {
//     const sensor = data?.['1_Sensor_Data'] || {};
//     const notif = data?.['2_Notification'] || {};
//     const sound = toNumber(sensor['8_sound']);
//     const bpObj = sensor['5_bp'] || {};
//     const sys = toNumber(bpObj['2_systolic']);
//     const dia = toNumber(bpObj['1_diastolic']);
//     const toSet = {};

//     if (sound === 1) {
//       toSet['1_Alert'] = 'cough';
//     } else if (sound === 2) {
//       toSet['1_Alert'] = 'tb';
//     } else if (sound === 3) {
//       toSet['1_Alert'] = 'asthma';
//     } else if (sound === 0) {
//       if (notif['1_Alert']) toSet['1_Alert'] = '';
//     }

//     if ((Number.isFinite(sys) && sys > 120) || (Number.isFinite(dia) && dia > 80)) {
//       if (!isActiveFlag(notif['4_hypertension'])) toSet['4_hypertension'] = 1;
//     }

//     if (Object.keys(toSet).length === 0 || writingRef.current) return;
//     const already = Object.entries(toSet).every(([k, v]) => lastWriteRef.current[k] === v);
//     if (already) return;

//     try {
//       writingRef.current = true;
//       await update(ref(database, `${nodePath}/2_Notification`), toSet);
//       lastWriteRef.current = { ...lastWriteRef.current, ...toSet };
//       writingRef.current = false;
//     } catch (e) {
//       console.error('Failed to update notifications:', e);
//       writingRef.current = false;
//     }
//   };

//   // Enhanced status determination with early warning levels
//   const getVitalStatus = (value, type) => {
//     if (value === null || value === undefined || value === "") return 'normal';
//     const numValue = parseFloat(value);
    
//     switch (type) {
//       case 'temp':
//         if (numValue >= 39.5) return 'critical';
//         if (numValue >= 38.5) return 'critical';
//         if (numValue >= 37.8) return 'warning';
//         if (numValue <= 35.5) return 'critical';
//         if (numValue <= 36.0) return 'warning';
//         return 'normal';
//       case 'hr':
//         if (numValue >= 130 || numValue <= 45) return 'critical';
//         if (numValue >= 110 || numValue <= 55) return 'warning';
//         if (numValue >= 90) return 'approaching';
//         return 'normal';
//       case 'bp_sys':
//         if (numValue >= 180) return 'critical';
//         if (numValue >= 160) return 'critical';
//         if (numValue >= 140) return 'warning';
//         if (numValue >= 130) return 'approaching';
//         if (numValue <= 80) return 'critical';
//         if (numValue <= 90) return 'warning';
//         return 'normal';
//       case 'bp_dia':
//         if (numValue >= 110) return 'critical';
//         if (numValue >= 100) return 'critical';
//         if (numValue >= 90) return 'warning';
//         if (numValue >= 85) return 'approaching';
//         if (numValue <= 50) return 'critical';
//         if (numValue <= 60) return 'warning';
//         return 'normal';
//       case 'spo2':
//         if (numValue <= 85) return 'critical';
//         if (numValue <= 90) return 'critical';
//         if (numValue <= 94) return 'warning';
//         if (numValue <= 96) return 'approaching';
//         return 'normal';
//       case 'humidity':
//         if (numValue >= 90) return 'warning';
//         if (numValue >= 80) return 'approaching';
//         if (numValue <= 20) return 'approaching';
//         return 'normal';
//       case 'alcohol':
//         if (numValue >= 4) return 'critical';
//         if (numValue >= 3) return 'warning';
//         if (numValue >= 2) return 'warning';
//         if (numValue >= 1) return 'approaching';
//         return 'normal';
//       default:
//         return 'normal';
//     }
//   };

//   // Enhanced status text with specific guidance
//   const getVitalStatusText = (value, type) => {
//     if (value === null || value === undefined || value === "") return 'No Data';
//     const numValue = parseFloat(value);
    
//     switch (type) {
//       case 'temp':
//         if (numValue >= 39.5) return 'CRITICAL - Emergency!';
//         if (numValue >= 38.5) return 'High Fever';
//         if (numValue >= 37.8) return 'Approaching Fever';
//         if (numValue <= 35.5) return 'CRITICAL - Hypothermia!';
//         if (numValue <= 36.0) return 'Low Temperature';
//         return 'Normal';
//       case 'hr':
//         if (numValue >= 130) return 'CRITICAL - Very High!';
//         if (numValue <= 45) return 'CRITICAL - Very Low!';
//         if (numValue >= 110) return 'High';
//         if (numValue <= 55) return 'Low';
//         if (numValue >= 90) return 'Elevated';
//         return 'Normal';
//       case 'bp':
//         const bpInfo = getBloodPressureDisplay();
//         return bpInfo.statusText;
//       case 'spo2':
//         if (numValue <= 85) return 'CRITICAL - Emergency!';
//         if (numValue <= 90) return 'Severe Low';
//         if (numValue <= 94) return 'Low';
//         if (numValue <= 96) return 'Declining';
//         return 'Normal';
//       case 'humidity':
//         if (numValue >= 90) return 'Very High';
//         if (numValue >= 80) return 'High';
//         if (numValue <= 20) return 'Very Low';
//         return 'Normal';
//       case 'alcohol':
//         if (numValue >= 4) return 'DANGEROUS';
//         if (numValue >= 3) return 'Very High';
//         if (numValue >= 2) return 'High';
//         if (numValue >= 1) return 'Detected';
//         return 'Normal';
//       default:
//         return 'Normal';
//     }
//   };

//   // Generate enhanced ML suggestions with early warning context
//   const generateMLSuggestions = () => {
//     const sensorData = patientData?.['1_Sensor_Data'] || {};
//     const notificationData = patientData?.['2_Notification'] || {};
    
//     const bpObj = sensorData['5_bp'] || {};
//     const co2Value = sensorData['1_co2'];
//     const co2Feature = isCO2High(co2Value) ? 1 : 0;
    
//     const currentFeatures = [
//       toNumber(sensorData['3_temp']) || 37.0,
//       toNumber(sensorData['6_hr']) || 75,
//       toNumber(bpObj['2_systolic']) || 120,
//       toNumber(bpObj['1_diastolic']) || 80,
//       toNumber(sensorData['7_spo2']) || 98,
//       toNumber(sensorData['4_hum']) || 45,
//       toNumber(sensorData['2_alcohol']) || 0,
//       co2Feature
//     ];

//     let knnSuggestions = healthKNN.generateSuggestions(currentFeatures);

//     // Add comprehensive early warning suggestions
//     const temp = toNumber(sensorData['3_temp']);
//     if (Number.isFinite(temp)) {
//       if (temp >= 37.8 && temp < 38.5) {
//         knnSuggestions.push({
//           type: 'warning',
//           category: 'Early Warning - Temperature',
//           message: `Temperature approaching fever range (${temp}°C). Start preventive measures: increase fluid intake, rest, monitor every hour, and prepare fever-reducing medications. Contact healthcare provider if it continues rising.`,
//           priority: 'medium',
//           confidence: 85
//         });
//       }
//     }

//     const hr = toNumber(sensorData['6_hr']);
//     if (Number.isFinite(hr)) {
//       if (hr >= 90 && hr < 110) {
//         knnSuggestions.push({
//           type: 'info',
//           category: 'Early Warning - Heart Rate',
//           message: `Heart rate elevated (${hr} BPM) and approaching concerning levels. Practice deep breathing exercises, avoid caffeine, sit down and relax. Monitor closely and seek medical advice if it continues rising above 100 BPM.`,
//           priority: 'medium',
//           confidence: 82
//         });
//       }
//     }

//     const systolic = toNumber(bpObj['2_systolic']);
//     const diastolic = toNumber(bpObj['1_diastolic']);
//     if (Number.isFinite(systolic) && Number.isFinite(diastolic)) {
//       if ((systolic >= 130 && systolic < 140) || (diastolic >= 85 && diastolic < 90)) {
//         knnSuggestions.push({
//           type: 'info',
//           category: 'Early Warning - Blood Pressure',
//           message: `Blood pressure elevated (${systolic}/${diastolic}) and approaching high range. Reduce sodium intake immediately, practice relaxation techniques, avoid stress, and monitor regularly. Contact your doctor if readings consistently stay elevated.`,
//           priority: 'medium',
//           confidence: 88
//         });
//       }
//     }

//     const spo2 = toNumber(sensorData['7_spo2']);
//     if (Number.isFinite(spo2)) {
//       if (spo2 <= 96 && spo2 > 94) {
//         knnSuggestions.push({
//           type: 'info',
//           category: 'Early Warning - Oxygen',
//           message: `Oxygen saturation declining (${spo2}%) and approaching concerning levels. Practice deep breathing exercises, ensure good posture, check for airway obstructions, and monitor closely. Consult your doctor immediately if levels drop below 95% or you experience shortness of breath.`,
//           priority: 'medium',
//           confidence: 90
//         });
//       }
//     }

//     // Add respiratory condition suggestions
//     if (notificationData['1_Alert']) {
//       const alertType = notificationData['1_Alert'].toLowerCase();
      
//       if (alertType === 'cough') {
//         knnSuggestions.push({
//           type: 'info',
//           category: 'Cough Management',
//           message: 'Cough detected by sound analysis. Stay hydrated (warm water, herbal teas), use humidifier (40-60% humidity), avoid smoking and irritants, try honey or throat lozenges, gargle with salt water, and monitor for fever or blood in sputum.',
//           priority: 'low',
//           confidence: 88
//         });
//       } else if (alertType === 'asthma') {
//         knnSuggestions.push({
//           type: 'warning',
//           category: 'Asthma Management',
//           message: 'Asthma symptoms detected by sound analysis. Use prescribed rescue inhaler (albuterol) immediately, sit upright, practice pursed-lip breathing, remove from triggers (dust, allergens, cold air), use spacer device, and seek medical attention if no improvement in 15-20 minutes.',
//           priority: 'medium',
//           confidence: 92
//         });
//       } else if (alertType === 'tb') {
//         knnSuggestions.push({
//           type: 'critical',
//           category: 'TB Risk Management',
//           message: 'TB risk indicators detected by sound analysis. Seek immediate medical evaluation for TB testing (chest X-ray, sputum test), isolate from others until cleared, wear N95 mask in public, improve nutrition with protein-rich foods, ensure adequate ventilation, and follow all medical instructions strictly.',
//           priority: 'high',
//           confidence: 95
//         });
//       }
//     }

//     // Sort by priority and confidence
//     const priorityOrder = { high: 3, medium: 2, low: 1 };
//     return knnSuggestions
//       .sort((a, b) => {
//         const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
//         if (priorityDiff === 0) {
//           return (b.confidence || 0) - (a.confidence || 0);
//         }
//         return priorityDiff;
//       })
//       .slice(0, 8);
//   };

//   // Rest of the component methods remain the same
//   const dismissAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));

//   const getAlertIcon = (type) => {
//     switch (type) {
//       case 'critical': return '!';
//       case 'warning': return '!';
//       case 'info': return 'i';
//       default: return '*';
//     }
//   };

//   const getSensorValue = (sensorKey, defaultValue = 'N/A') => {
//     const sensorData = patientData?.['1_Sensor_Data'];
//     if (!sensorData) return defaultValue;
//     const value = sensorData[sensorKey];
//     if (value === null || value === undefined || value === "") return defaultValue;
//     return value;
//   };

//   const getSoundLevelDisplay = () => {
//     const soundValue = getSensorValue('8_sound', 0);
//     const numValue = toNumber(soundValue);
    
//     switch (numValue) {
//       case 1: return 'Cough';
//       case 2: return 'TB';
//       case 3: return 'Asthma';
//       case 0: return 'Normal';
//       default: return 'Normal';
//     }
//   };

//   const getSoundLevelStatus = () => {
//     const soundValue = getSensorValue('8_sound', 0);
//     const numValue = toNumber(soundValue);
    
//     if (numValue === 1 || numValue === 2 || numValue === 3) {
//       return 'Detected';
//     }
//     return 'Normal';
//   };

//   const getBloodPressureDisplay = () => {
//     const sensorData = patientData?.['1_Sensor_Data'];
//     if (!sensorData || !sensorData['5_bp']) {
//       return { display: 'No Data', status: 'normal', statusText: 'No Data' };
//     }
//     const bpData = sensorData['5_bp'];
//     let systolic = bpData['2_systolic'];
//     let diastolic = bpData['1_diastolic'];
//     if (systolic === null || systolic === undefined) systolic = "";
//     if (diastolic === null || diastolic === undefined) diastolic = "";
//     systolic = String(systolic).trim();
//     diastolic = String(diastolic).trim();

//     if ((systolic === "" || systolic === "null" || systolic === "undefined") &&
//         (diastolic === "" || diastolic === "null" || diastolic === "undefined")) {
//       return { display: 'Awaiting Data', status: 'normal', statusText: 'Pending' };
//     }

//     const sysDisplay = (systolic === "" || systolic === "null" || systolic === "undefined") ? "--" : systolic;
//     const diaDisplay = (diastolic === "" || diastolic === "null" || diastolic === "undefined") ? "--" : diastolic;
//     const displayText = `${sysDisplay}/${diaDisplay}`;

//     let status = 'normal';
//     let statusText = 'Normal';
    
//     const sysNum = Number(systolic);
//     const diaNum = Number(diastolic);
    
//     // Enhanced status determination
//     if ((systolic && !isNaN(sysNum) && sysNum >= 180) || (diastolic && !isNaN(diaNum) && diaNum >= 110)) {
//       status = 'critical'; statusText = 'CRISIS - Emergency!';
//     } else if ((systolic && !isNaN(sysNum) && sysNum >= 160) || (diastolic && !isNaN(diaNum) && diaNum >= 100)) {
//       status = 'critical'; statusText = 'Severe High';
//     } else if ((systolic && !isNaN(sysNum) && sysNum >= 140) || (diastolic && !isNaN(diaNum) && diaNum >= 90)) {
//       status = 'warning'; statusText = 'High';
//     } else if ((systolic && !isNaN(sysNum) && sysNum >= 130) || (diastolic && !isNaN(diaNum) && diaNum >= 85)) {
//       status = 'approaching'; statusText = 'Elevated';
//     } else if ((systolic && !isNaN(sysNum) && sysNum <= 80) || (diastolic && !isNaN(diaNum) && diaNum <= 50)) {
//       status = 'critical'; statusText = 'Severe Low';
//     } else if ((systolic && !isNaN(sysNum) && sysNum <= 90) || (diastolic && !isNaN(diaNum) && diaNum <= 60)) {
//       status = 'warning'; statusText = 'Low';
//     }
    
//     return { display: displayText, status, statusText };
//   };

//   // Custom tooltip for charts
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div style={{
//           backgroundColor: 'rgba(255, 255, 255, 0.95)',
//           padding: '10px',
//           border: '1px solid #ccc',
//           borderRadius: '5px',
//           boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
//         }}>
//           <p style={{ margin: 0, fontWeight: 'bold' }}>{`Time: ${label}`}</p>
//           {payload.map((entry, index) => (
//             <p key={index} style={{ margin: '2px 0', color: entry.color }}>
//               {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'temperature' ? '°C' : 
//                 entry.dataKey === 'heartRate' ? ' BPM' : 
//                 entry.dataKey.includes('spo2') ? '%' : 
//                 entry.dataKey.includes('systolic') || entry.dataKey.includes('diastolic') ? ' mmHg' : 
//                 entry.dataKey === 'humidity' ? '%' : ''}`}
//             </p>
//           ))}
//         </div>
//       );
//     }
//     return null;
//   };

//   if (!patientData && connectionStatus === 'connecting') {
//     return (
//       <div className="loading">
//         <div className="loading-spinner"></div>
//         <p>Loading patient data...</p>
//       </div>
//     );
//   }

//   if (connectionStatus === 'error') {
//     return (
//       <div className="error-screen">
//         <div className="error-icon">X</div>
//         <h2>Connection Error</h2>
//         <p>Unable to connect to Firebase database. Please check your connection.</p>
//       </div>
//     );
//   }

//   const sensorData = patientData?.['1_Sensor_Data'] || {};
//   const notificationData = patientData?.['2_Notification'] || {};
//   const bpInfo = getBloodPressureDisplay();

//   return (
//     <div className="health-dashboard">
//       <header className="health-dashboard-header">
//         <h1>Advanced Health Monitoring Dashboard</h1>
//         <p>Real-time monitoring with early warning system</p>
//       </header>

//       {/* Enhanced Alert Notifications */}
//       <div className={`alert-container ${showAlert ? 'show' : ''}`}>
//         {alerts.map(alert => (
//           <div key={alert.id} className={`alert alert-${alert.type}`}>
//             <span className="alert-icon">{getAlertIcon(alert.type)}</span>
//             <div className="alert-content">
//               <div className="alert-message">{alert.message}</div>
//               <div className="alert-time">{alert.timestamp}</div>
//             </div>
//             <button className="alert-dismiss" onClick={() => dismissAlert(alert.id)}>×</button>
//           </div>
//         ))}
//       </div>

//       <div className="health-dashboard-content">
//         {/* Enhanced Vital Signs Cards */}
//         <div className="cards-grid">
//           <div className="card">
//             <div className="card-header"><h3>Temperature</h3><span className="card-icon">🌡️</span></div>
//             <div className="card-value">{getSensorValue('3_temp')}°C</div>
//             <div className={`card-status ${getVitalStatus(getSensorValue('3_temp', 0), 'temp')}`}>
//               {getVitalStatusText(getSensorValue('3_temp', 0), 'temp')}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>Heart Rate</h3><span className="card-icon">💓</span></div>
//             <div className="card-value">{getSensorValue('6_hr')} BPM</div>
//             <div className={`card-status ${getVitalStatus(getSensorValue('6_hr', 0), 'hr')}`}>
//               {getVitalStatusText(getSensorValue('6_hr', 0), 'hr')}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>Blood Pressure</h3><span className="card-icon">🩺</span></div>
//             <div className="card-value">
//               {bpInfo.display}
//               {bpInfo.display !== 'No Data' && bpInfo.display !== 'Awaiting Data' && bpInfo.display !== '--/--' && !bpInfo.display.includes('--') ? ' mmHg' : ''}
//             </div>
//             <div className={`card-status ${bpInfo.status}`}>{bpInfo.statusText}</div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>SpO2</h3><span className="card-icon">🫁</span></div>
//             <div className="card-value">{getSensorValue('7_spo2')}%</div>
//             <div className={`card-status ${getVitalStatus(getSensorValue('7_spo2', 100), 'spo2')}`}>
//               {getVitalStatusText(getSensorValue('7_spo2', 100), 'spo2')}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>Humidity</h3><span className="card-icon">💧</span></div>
//             <div className="card-value">{getSensorValue('4_hum')}%</div>
//             <div className={`card-status ${getVitalStatus(getSensorValue('4_hum', 0), 'humidity')}`}>
//               {getVitalStatusText(getSensorValue('4_hum', 0), 'humidity')}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>Alcohol Level</h3><span className="card-icon">🍺</span></div>
//             <div className="card-value">{getSensorValue('2_alcohol')}</div>
//             <div className={`card-status ${getVitalStatus(getSensorValue('2_alcohol', 0), 'alcohol')}`}>
//               {getVitalStatusText(getSensorValue('2_alcohol', 0), 'alcohol')}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>CO₂ Level</h3><span className="card-icon">🌬️</span></div>
//             <div className="card-value">
//               {isCO2High(getSensorValue('1_co2')) ? 'High' : 'Normal'}
//             </div>
//             <div className={`card-status ${isCO2High(getSensorValue('1_co2')) ? 'warning' : 'normal'}`}>
//               {isCO2High(getSensorValue('1_co2')) ? 'High' : 'Normal'}
//             </div>
//           </div>

//           <div className="card">
//             <div className="card-header"><h3>Disease Detection</h3><span className="card-icon">🔊</span></div>
//             <div className="card-value">{getSoundLevelDisplay()}</div>
//             <div className="card-status normal">
//               {getSoundLevelStatus()}
//             </div>
//           </div>
//         </div>

//         {/* Charts Section */}
//         {historicalData.length > 0 && (
//           <div className="charts-section">
//             <h2>Vital Signs Trends</h2>
            
//             <div className="charts-grid">
//               <div className="chart-container">
//                 <h3>Temperature Over Time</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <AreaChart data={historicalData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Area 
//                       type="monotone" 
//                       dataKey="temperature" 
//                       stroke="#ff6b6b" 
//                       fill="#ff6b6b" 
//                       fillOpacity={0.6}
//                       connectNulls={false}
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="chart-container">
//                 <h3>Heart Rate Over Time</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={historicalData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Line 
//                       type="monotone" 
//                       dataKey="heartRate" 
//                       stroke="#4ecdc4" 
//                       strokeWidth={3}
//                       dot={{ fill: '#4ecdc4', strokeWidth: 2, r: 4 }}
//                       connectNulls={false}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="chart-container">
//                 <h3>Blood Pressure Over Time</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={historicalData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend />
//                     <Line 
//                       type="monotone" 
//                       dataKey="systolic" 
//                       stroke="#e74c3c" 
//                       strokeWidth={2}
//                       dot={{ fill: '#e74c3c', strokeWidth: 2, r: 3 }}
//                       name="Systolic"
//                       connectNulls={false}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="diastolic" 
//                       stroke="#3498db" 
//                       strokeWidth={2}
//                       dot={{ fill: '#3498db', strokeWidth: 2, r: 3 }}
//                       name="Diastolic"
//                       connectNulls={false}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="chart-container">
//                 <h3>SpO₂ Over Time</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <AreaChart data={historicalData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis domain={['dataMin - 5', 'dataMax + 2']} />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Area 
//                       type="monotone" 
//                       dataKey="spo2" 
//                       stroke="#9b59b6" 
//                       fill="#9b59b6" 
//                       fillOpacity={0.6}
//                       connectNulls={false}
//                     />
//                   </AreaChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="chart-container">
//                 <h3>Sound Level Over Time</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={historicalData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Bar dataKey="soundLevel" fill="#f39c12" />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>

//               <div className="chart-container">
//                 <h3>Environmental Factors</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <LineChart data={historicalData}>
//                     <CartesianGrid strokeDasharray="3 3" />
//                     <XAxis dataKey="time" />
//                     <YAxis />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend />
//                     <Line 
//                       type="monotone" 
//                       dataKey="humidity" 
//                       stroke="#27ae60" 
//                       strokeWidth={2}
//                       name="Humidity (%)"
//                       connectNulls={false}
//                     />
//                     <Line 
//                       type="monotone" 
//                       dataKey="co2" 
//                       stroke="#e67e22" 
//                       strokeWidth={2}
//                       name="CO₂ Level"
//                       connectNulls={false}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Enhanced AI Health Recommendations */}
//         <div className="ml-suggestions-panel">
//           <h3>🤖 Advanced AI Health Recommendations with Early Warning System</h3>
//           <p className="disclaimer">
//             Our enhanced AI system now includes early warning alerts when your vitals approach critical ranges. This provides preventive guidance before reaching dangerous levels. Includes comprehensive analysis for all parameters including respiratory conditions. Always consult healthcare professionals for medical advice.
//           </p>
//           <div className="suggestions-grid">
//             {generateMLSuggestions().map((suggestion, index) => (
//               <div key={index} className={`suggestion-item ${suggestion.type}`}>
//                 <div className="suggestion-header">
//                   <span className="suggestion-category">{suggestion.category}</span>
//                   <div className="suggestion-badges">
//                     <span className={`suggestion-priority priority-${suggestion.priority}`}>
//                       {suggestion.priority.toUpperCase()}
//                     </span>
//                     {suggestion.confidence && (
//                       <span className="suggestion-confidence">
//                         {suggestion.confidence}% match
//                       </span>
//                     )}
//                   </div>
//                 </div>
//                 <div className="suggestion-message">{suggestion.message}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       <style jsx>{`
//         .health-dashboard-header p {
//           margin: 0.5rem 0 0 0;
//           color: #7f8c8d;
//           font-size: 1rem;
//         }
        
//         .card-status.approaching {
//           background: #fff3cd;
//           color: #856404;
//         }
        
//         .charts-section {
//           margin: 2rem 0;
//           padding: 1.5rem;
//           background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
//           border-radius: 15px;
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
//         }
        
//         .charts-section h2 {
//           text-align: center;
//           color: #2c3e50;
//           margin-bottom: 2rem;
//           font-size: 1.8rem;
//           font-weight: bold;
//         }
        
//         .charts-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
//           gap: 2rem;
//         }
        
//         .chart-container {
//           background: white;
//           padding: 1.5rem;
//           border-radius: 12px;
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
//           border: 1px solid #e1e8ed;
//         }
        
//         .chart-container h3 {
//           margin: 0 0 1rem 0;
//           color: #34495e;
//           font-size: 1.2rem;
//           font-weight: 600;
//           text-align: center;
//         }
        
//         .ml-suggestions-panel {
//           background: rgba(255, 255, 255, 0.95);
//           padding: 1.5rem;
//           border-radius: 15px;
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
//           backdrop-filter: blur(10px);
//           margin: 2rem 0;
//         }
        
//         .ml-suggestions-panel h3 {
//           margin: 0 0 0.5rem 0;
//           color: #2c3e50;
//           font-size: 1.3rem;
//           display: flex;
//           align-items: center;
//         }
        
//         .disclaimer {
//           font-size: 0.85rem;
//           color: #7f8c8d;
//           margin-bottom: 1.5rem;
//           font-style: italic;
//           padding: 0.75rem;
//           background: #f8f9fa;
//           border-radius: 8px;
//           border-left: 4px solid #3498db;
//         }
        
//         .suggestions-grid {
//           display: grid;
//           gap: 1rem;
//         }
        
//         .suggestion-item {
//           padding: 1rem;
//           border-radius: 10px;
//           border-left: 4px solid #3498db;
//           background: #f8f9fa;
//           transition: transform 0.2s ease, box-shadow 0.2s ease;
//         }
        
//         .suggestion-item:hover {
//           transform: translateY(-2px);
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
//         }
        
//         .suggestion-item.critical {
//           border-left-color: #e74c3c;
//           background: #fdf2f2;
//         }
        
//         .suggestion-item.warning {
//           border-left-color: #f39c12;
//           background: #fefbf3;
//         }
        
//         .suggestion-item.info {
//           border-left-color: #3498db;
//           background: #f3f9ff;
//         }
        
//         .suggestion-item.success {
//           border-left-color: #27ae60;
//           background: #f0fdf4;
//         }
        
//         .suggestion-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 0.5rem;
//         }
        
//         .suggestion-category {
//           font-weight: 600;
//           color: #2c3e50;
//           font-size: 0.9rem;
//         }
        
//         .suggestion-badges {
//           display: flex;
//           gap: 0.5rem;
//           align-items: center;
//         }
        
//         .suggestion-priority {
//           padding: 0.2rem 0.5rem;
//           border-radius: 12px;
//           font-size: 0.7rem;
//           font-weight: bold;
//           text-transform: uppercase;
//         }
        
//         .suggestion-confidence {
//           padding: 0.2rem 0.5rem;
//           border-radius: 12px;
//           font-size: 0.7rem;
//           background: #34495e;
//           color: white;
//           font-weight: bold;
//         }
        
//         .priority-high {
//           background: #e74c3c;
//           color: white;
//         }
        
//         .priority-medium {
//           background: #f39c12;
//           color: white;
//         }
        
//         .priority-low {
//           background: #95a5a6;
//           color: white;
//         }
        
//         .suggestion-message {
//           color: #34495e;
//           line-height: 1.4;
//           font-size: 0.9rem;
//         }
        
//         .loading {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 100vh;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           color: white;
//         }
        
//         .loading-spinner {
//           width: 50px;
//           height: 50px;
//           border: 4px solid rgba(255, 255, 255, 0.3);
//           border-top: 4px solid white;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//           margin-bottom: 1rem;
//         }
        
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
        
//         .error-screen {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           height: 100vh;
//           background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
//           color: white;
//           text-align: center;
//         }
        
//         .error-icon {
//           font-size: 4rem;
//           margin-bottom: 1rem;
//         }
        
//         .health-dashboard {
//           min-height: 100vh;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           font-family: 'Arial', sans-serif;
//         }
        
//         .health-dashboard-header {
//           background: rgba(255, 255, 255, 0.95);
//           padding: 1.5rem;
//           box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
//           backdrop-filter: blur(10px);
//         }
        
//         .health-dashboard-header h1 {
//           margin: 0;
//           color: #2c3e50;
//           font-size: 2rem;
//           font-weight: bold;
//         }
        
//         .health-dashboard-content {
//           padding: 2rem;
//         }
        
//         .cards-grid {
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//           gap: 1.5rem;
//           margin-bottom: 2rem;
//         }
        
//         .card {
//           background: rgba(255, 255, 255, 0.95);
//           padding: 1.5rem;
//           border-radius: 15px;
//           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
//           backdrop-filter: blur(10px);
//           border: 1px solid rgba(255, 255, 255, 0.2);
//           transition: transform 0.3s ease, box-shadow 0.3s ease;
//         }
        
//         .card:hover {
//           transform: translateY(-5px);
//           box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
//         }
        
//         .card-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 1rem;
//         }
        
//         .card-header h3 {
//           margin: 0;
//           color: #34495e;
//           font-size: 1.1rem;
//         }
        
//         .card-icon {
//           font-size: 1.5rem;
//         }
        
//         .card-value {
//           font-size: 2rem;
//           font-weight: bold;
//           color: #2c3e50;
//           margin-bottom: 0.5rem;
//         }
        
//         .card-status {
//           padding: 0.3rem 0.8rem;
//           border-radius: 20px;
//           font-size: 0.85rem;
//           font-weight: 600;
//           text-transform: uppercase;
//         }
        
//         .card-status.normal {
//           background: #d5f4e6;
//           color: #27ae60;
//         }
        
//         .card-status.warning {
//           background: #fef9e7;
//           color: #f39c12;
//         }
        
//         .card-status.critical {
//           background: #fadbd8;
//           color: #e74c3c;
//           animation: pulse 2s infinite;
//         }
        
//         @keyframes pulse {
//           0% { opacity: 1; }
//           50% { opacity: 0.7; }
//           100% { opacity: 1; }
//         }
        
//         .alert-container {
//           position: fixed;
//           top: 20px;
//           right: 20px;
//           z-index: 1000;
//           opacity: 0;
//           transform: translateX(100%);
//           transition: all 0.3s ease;
//           max-width: 450px;
//         }
        
//         .alert-container.show {
//           opacity: 1;
//           transform: translateX(0);
//         }
        
//         .alert {
//           display: flex;
//           align-items: center;
//           margin-bottom: 0.5rem;
//           padding: 1rem;
//           border-radius: 8px;
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
//           min-width: 300px;
//           max-width: 450px;
//         }
        
//         .alert-critical {
//           background: #fadbd8;
//           border-left: 4px solid #e74c3c;
//           animation: alertPulse 1s infinite;
//         }
        
//         @keyframes alertPulse {
//           0% { border-left-color: #e74c3c; }
//           50% { border-left-color: #c0392b; }
//           100% { border-left-color: #e74c3c; }
//         }
        
//         .alert-warning {
//           background: #fef9e7;
//           border-left: 4px solid #f39c12;
//         }
        
//         .alert-info {
//           background: #d6eaf8;
//           border-left: 4px solid #3498db;
//         }
        
//         .alert-icon {
//           background: #e74c3c;
//           color: white;
//           width: 24px;
//           height: 24px;
//           border-radius: 50%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           font-weight: bold;
//           margin-right: 1rem;
//           font-size: 0.8rem;
//         }
        
//         .alert-content {
//           flex: 1;
//         }
        
//         .alert-message {
//           font-weight: 600;
//           margin-bottom: 0.2rem;
//           font-size: 0.9rem;
//         }
        
//         .alert-time {
//           font-size: 0.8rem;
//           color: #7f8c8d;
//         }
        
//         .alert-dismiss {
//           background: none;
//           border: none;
//           font-size: 1.2rem;
//           cursor: pointer;
//           color: #7f8c8d;
//           padding: 0;
//           margin-left: 0.5rem;
//         }
        
//         .alert-dismiss:hover {
//           color: #2c3e50;
//         }
        
//         @media (max-width: 768px) {
//           .health-dashboard-content {
//             padding: 1rem;
//           }
          
//           .cards-grid, .charts-grid {
//             grid-template-columns: 1fr;
//           }
          
//           .alert-container {
//             right: 10px;
//             left: 10px;
//           }
          
//           .alert {
//             min-width: auto;
//           }
          
//           .chart-container {
//             min-width: 300px;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Dashboard;











// Dashboard.js - Enhanced with Early Warning System, ML Suggestions, and Automatic Alert Sound
import React, { useState, useEffect, useRef } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import './MedicalDashboard.css';

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAhLCi6JBT5ELkAFxTplKBBDdRdpATzQxI",
  authDomain: "smart-medicine-vending-machine.firebaseapp.com",
  databaseURL: "https://smart-medicine-vending-machine-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-medicine-vending-machine",
  storageBucket: "smart-medicine-vending-machine.firebasestorage.app",
  messagingSenderId: "705021997077",
  appId: "1:705021997077:web:5af9ec0b267e597e1d5e1c",
  measurementId: "G-PH0XLJSYVS"
};

// Initialize Firebase with unique app name
const appName = 'medical-dashboard-app';
let app;
try {
  app = getApp(appName);
} catch {
  app = initializeApp(firebaseConfig, appName);
}
const database = getDatabase(app);

// ======== Audio helpers (Web Audio beep) ========
const useAlertSound = () => {
  const [audioEnabled, setAudioEnabled] = useState(false);
  const audioCtxRef = useRef(null);
  const playingRef = useRef(false);

  const enableAudio = async () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        alert('Web Audio API not supported in this browser.');
        return;
      }
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
      setAudioEnabled(true);
    } catch (e) {
      console.error('Failed to enable audio:', e);
    }
  };

  const playTone = (freq = 880, durationMs = 220, gain = 0.15, whenDelayMs = 0) => {
    const ctx = audioCtxRef.current;
    if (!ctx || ctx.state !== 'running') return;
    const when = ctx.currentTime + whenDelayMs / 1000;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(gain, when + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, when + durationMs / 1000);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, when);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(when);
    osc.stop(when + durationMs / 1000 + 0.02);
  };

  // Distinct patterns per severity
  const playAlertPattern = (severity = 'info') => {
    if (!audioEnabled || playingRef.current) return;
    playingRef.current = true;

    if (severity === 'critical') {
      playTone(920, 180, 0.2, 0);
      playTone(920, 180, 0.2, 220);
      playTone(920, 180, 0.2, 440);
      setTimeout(() => { playingRef.current = false; }, 700);
    } else if (severity === 'warning') {
      playTone(740, 220, 0.18, 0);
      playTone(740, 220, 0.18, 280);
      setTimeout(() => { playingRef.current = false; }, 600);
    } else {
      playTone(560, 240, 0.16, 0);
      setTimeout(() => { playingRef.current = false; }, 350);
    }
  };

  return { audioEnabled, enableAudio, playAlertPattern, setAudioEnabled };
};

// Enhanced KNN Health Dataset with Comprehensive Scenarios
const healthDataset = [
  // Normal cases
  { features: [36.8, 72, 115, 75, 98, 45, 0, 0], suggestion: { 
    type: 'success', category: 'Wellness', 
    message: 'All vital signs are normal. Maintain a healthy lifestyle with regular exercise and balanced nutrition.', 
    priority: 'low' 
  }},
  { features: [37.1, 78, 118, 78, 97, 50, 0, 0], suggestion: { 
    type: 'success', category: 'Wellness', 
    message: 'Excellent vital signs. Continue your current healthy habits and stay hydrated.', 
    priority: 'low' 
  }},
  
  // Temperature-related cases
  { features: [38.2, 85, 125, 82, 96, 55, 0, 0], suggestion: { 
    type: 'warning', category: 'Temperature Management', 
    message: 'Mild fever detected. Rest, stay hydrated (8-10 glasses water), monitor temperature every 2-4 hours, and consider paracetamol if needed.', 
    priority: 'medium' 
  }},
  { features: [39.1, 105, 135, 88, 94, 60, 0, 0], suggestion: { 
    type: 'critical', category: 'Temperature Management', 
    message: 'High fever with elevated heart rate. Seek medical attention immediately, use cooling measures (cool cloths, lukewarm bath), and stay hydrated.', 
    priority: 'high' 
  }},
  { features: [35.8, 58, 110, 70, 98, 45, 0, 0], suggestion: { 
    type: 'warning', category: 'Temperature Management', 
    message: 'Low body temperature detected. Keep warm with blankets, monitor closely, and consult healthcare provider if symptoms persist.', 
    priority: 'medium' 
  }},
  
  // Heart Rate variations
  { features: [37.0, 110, 120, 78, 97, 50, 0, 0], suggestion: { 
    type: 'warning', category: 'Heart Rate Management', 
    message: 'Elevated heart rate detected. Practice deep breathing, avoid caffeine and stimulants, rest in quiet environment, and monitor for palpitations.', 
    priority: 'medium' 
  }},
  { features: [36.8, 55, 115, 75, 98, 45, 0, 0], suggestion: { 
    type: 'info', category: 'Heart Rate Management', 
    message: 'Low heart rate detected. If experiencing dizziness, fatigue, or weakness, consult healthcare provider. Monitor for syncope episodes.', 
    priority: 'medium' 
  }},
  { features: [37.2, 130, 140, 90, 96, 55, 0, 0], suggestion: { 
    type: 'critical', category: 'Heart Rate Management', 
    message: 'Very high heart rate detected. Seek immediate medical attention, sit down, practice deep breathing, and avoid any physical exertion.', 
    priority: 'high' 
  }},
  
  // Blood Pressure conditions
  { features: [37.0, 80, 150, 95, 98, 45, 0, 0], suggestion: { 
    type: 'warning', category: 'Blood Pressure Management', 
    message: 'High blood pressure detected. Reduce sodium intake, practice deep breathing exercises, limit alcohol, take prescribed medications, and monitor regularly.', 
    priority: 'medium' 
  }},
  { features: [37.2, 85, 180, 110, 97, 50, 0, 0], suggestion: { 
    type: 'critical', category: 'Blood Pressure Management', 
    message: 'Hypertensive crisis detected. Go to emergency room immediately. Rest in upright position, avoid strenuous activities, and take prescribed emergency medications.', 
    priority: 'high' 
  }},
  { features: [36.9, 75, 90, 55, 98, 45, 0, 0], suggestion: { 
    type: 'info', category: 'Blood Pressure Management', 
    message: 'Low blood pressure detected. Stay hydrated, avoid sudden position changes, eat small frequent meals, and monitor for dizziness or fainting.', 
    priority: 'low' 
  }},
  
  // Oxygen Saturation issues
  { features: [36.9, 92, 125, 80, 92, 55, 0, 0], suggestion: { 
    type: 'warning', category: 'Oxygen Saturation Management', 
    message: 'Low oxygen saturation detected. Practice deep breathing exercises, ensure good posture, use supplemental oxygen if prescribed, and monitor closely.', 
    priority: 'medium' 
  }},
  { features: [37.2, 95, 130, 85, 89, 60, 0, 1], suggestion: { 
    type: 'critical', category: 'Oxygen Saturation Management', 
    message: 'Critical oxygen levels with high CO₂. Seek immediate medical attention, improve ventilation, use rescue medications, and call emergency services.', 
    priority: 'high' 
  }},
  { features: [37.5, 100, 135, 88, 87, 65, 0, 1], suggestion: { 
    type: 'critical', category: 'Oxygen Saturation Management', 
    message: 'Severe hypoxia detected. Call emergency services immediately. Use supplemental oxygen, maintain upright position, and prepare for emergency transport.', 
    priority: 'high' 
  }},
  
  // Environmental factors
  { features: [37.0, 85, 125, 82, 94, 85, 0, 1], suggestion: { 
    type: 'warning', category: 'Environmental Management', 
    message: 'High humidity and CO₂ levels detected. Improve ventilation immediately, use dehumidifier, consider air purification, and move to well-ventilated area.', 
    priority: 'medium' 
  }},
  { features: [36.9, 80, 120, 78, 96, 90, 0, 1], suggestion: { 
    type: 'warning', category: 'Environmental Management', 
    message: 'Poor air quality detected. Move to well-ventilated area, use air purifier, avoid outdoor activities during high pollution, and consider wearing mask.', 
    priority: 'medium' 
  }},
  { features: [37.1, 78, 118, 78, 97, 95, 0, 1], suggestion: { 
    type: 'critical', category: 'Environmental Management', 
    message: 'Very high humidity with elevated CO₂. Immediate ventilation needed. Risk of respiratory complications - seek fresh air environment immediately.', 
    priority: 'high' 
  }},
  
  // Alcohol-related cases
  { features: [37.2, 88, 130, 85, 96, 55, 2, 0], suggestion: { 
    type: 'info', category: 'Substance Management', 
    message: 'Moderate alcohol detected. Stay hydrated with water, avoid driving, monitor vital signs, eat food, and avoid additional alcohol consumption.', 
    priority: 'low' 
  }},
  { features: [37.5, 95, 140, 90, 94, 60, 4, 0], suggestion: { 
    type: 'warning', category: 'Substance Management', 
    message: 'High alcohol levels with elevated vitals. Seek assistance from someone sober, avoid further alcohol, stay hydrated, and consider medical evaluation.', 
    priority: 'medium' 
  }},
  { features: [38.1, 108, 155, 98, 92, 65, 5, 0], suggestion: { 
    type: 'critical', category: 'Substance Management', 
    message: 'Dangerous alcohol levels with multiple elevated vitals. Seek immediate medical attention for alcohol poisoning risk. Do not leave person alone.', 
    priority: 'high' 
  }},
  
  // Multiple conditions
  { features: [38.8, 110, 160, 100, 91, 70, 0, 1], suggestion: { 
    type: 'critical', category: 'Multiple Conditions', 
    message: 'Multiple critical readings: fever, tachycardia, hypertension, hypoxia, and poor air quality. Seek emergency medical care immediately.', 
    priority: 'high' 
  }},
  { features: [38.5, 105, 155, 98, 93, 65, 1, 0], suggestion: { 
    type: 'critical', category: 'Multiple Conditions', 
    message: 'Fever, high BP, and low oxygen with alcohol detected. Avoid alcohol, seek medical attention, improve ventilation, and monitor closely.', 
    priority: 'high' 
  }},
  
  // Respiratory-focused cases
  { features: [37.8, 95, 128, 82, 94, 60, 0, 0], suggestion: { 
    type: 'warning', category: 'Respiratory Health', 
    message: 'Mild respiratory symptoms pattern. Stay hydrated, use humidifier (40-60% humidity), avoid smoke and irritants, practice breathing exercises, and monitor symptoms.', 
    priority: 'medium' 
  }},
  { features: [38.3, 102, 135, 85, 91, 70, 0, 1], suggestion: { 
    type: 'critical', category: 'Respiratory Health', 
    message: 'Concerning respiratory pattern with fever and low oxygen. Seek medical evaluation for potential respiratory infection, use prescribed medications, and isolate if infectious.', 
    priority: 'high' 
  }},
  { features: [37.5, 88, 125, 80, 93, 75, 0, 1], suggestion: { 
    type: 'warning', category: 'Respiratory Health', 
    message: 'Respiratory symptoms with environmental factors. Improve air quality, use bronchodilators if prescribed, practice pursed-lip breathing, and avoid triggers.', 
    priority: 'medium' 
  }}
];

// KNN Implementation
class HealthKNN {
  constructor(dataset, k = 3) {
    this.dataset = dataset;
    this.k = k;
    this.featureRanges = [
      [35, 42],    // temperature range (°C)
      [50, 150],   // heart rate range (BPM)
      [80, 200],   // systolic BP range (mmHg)
      [50, 120],   // diastolic BP range (mmHg)
      [80, 100],   // SpO2 range (%)
      [20, 100],   // humidity range (%)
      [0, 5],      // alcohol range
      [0, 1]       // CO2 range (boolean)
    ];
    this.featureWeights = [1.5, 1.2, 2.0, 2.0, 2.5, 0.5, 1.0, 1.8];
  }

  normalizeFeatures(features) {
    return features.map((feature, idx) => {
      const [min, max] = this.featureRanges[idx];
      const normalized = (feature - min) / (max - min);
      return Math.max(0, Math.min(1, normalized));
    });
  }

  calculateDistance(features1, features2) {
    const normalized1 = this.normalizeFeatures(features1);
    const normalized2 = this.normalizeFeatures(features2);
    
    return Math.sqrt(
      normalized1.reduce((sum, val, idx) => 
        sum + this.featureWeights[idx] * Math.pow(val - normalized2[idx], 2), 0
      )
    );
  }

  findKNearestNeighbors(currentFeatures) {
    const distances = this.dataset.map(data => ({
      ...data,
      distance: this.calculateDistance(currentFeatures, data.features)
    }));

    return distances
      .sort((a, b) => a.distance - b.distance)
      .slice(0, this.k);
  }

  generateSuggestions(currentFeatures) {
    const neighbors = this.findKNearestNeighbors(currentFeatures);
    const maxDistance = Math.max(...neighbors.map(n => n.distance));
    const weightedSuggestions = neighbors.map(neighbor => {
      const weight = 1 / (neighbor.distance + 0.001);
      const confidence = Math.round((1 - (neighbor.distance / (maxDistance + 0.001))) * 100);
      return {
        ...neighbor.suggestion,
        weight,
        confidence: Math.max(10, Math.min(100, confidence)),
        distance: neighbor.distance
      };
    });

    const suggestionGroups = {};
    weightedSuggestions.forEach(suggestion => {
      const category = suggestion.category;
      if (!suggestionGroups[category] || 
          suggestionGroups[category].weight < suggestion.weight) {
        suggestionGroups[category] = suggestion;
      }
    });

    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return Object.values(suggestionGroups)
      .sort((a, b) => {
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff === 0) {
          return b.confidence - a.confidence;
        }
        return priorityDiff;
      })
      .slice(0, 5);
  }
}

// Helper functions
const isActiveFlag = (v) => v === 1 || v === '1' || v === true;

const toNumber = (v) => {
  if (v === null || v === undefined || v === '' || v === 'null' || v === 'undefined') return NaN;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

const isCO2High = (co2Value) => {
  return co2Value === "1" || co2Value === 1 || co2Value === true;
};

// Initialize KNN model
const healthKNN = new HealthKNN(healthDataset, 3);

const Dashboard = () => {
  const [patientData, setPatientData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [historicalData, setHistoricalData] = useState([]);
  const maxDataPoints = 20;
  const lastWriteRef = useRef({}); 
  const writingRef = useRef(false);

  // Sound hook
  const { audioEnabled, enableAudio, playAlertPattern, setAudioEnabled } = useAlertSound();

  // Keep latest values accessible from static Firebase callback
  const audioEnabledRef = useRef(false);
  const playAlertPatternRef = useRef(() => {});
  useEffect(() => { audioEnabledRef.current = audioEnabled; }, [audioEnabled]);
  useEffect(() => { playAlertPatternRef.current = playAlertPattern; }, [playAlertPattern]);

  useEffect(() => {
    const nodePath = 'KS5160_Lung_Heart';
    const dataRef = ref(database, nodePath);

    const unsub = onValue(
      dataRef,
      (snap) => {
        const data = snap.val();
        if (data) {
          setPatientData(data);
          setConnectionStatus('connected');
          checkForAlerts(data);       // will trigger sound
          addToHistoricalData(data);
          maybeTriggerAutoNotifications(data, nodePath);
        }
      },
      (err) => {
        console.error('Firebase connection error:', err);
        setConnectionStatus('error');
      }
    );

    return () => unsub();
  }, []);

  const addToHistoricalData = (data) => {
    const sensorData = data['1_Sensor_Data'] || {};
    const timestamp = new Date();
    const timeString = timestamp.toLocaleTimeString();
    
    const bpData = sensorData['5_bp'] || {};
    const systolic = toNumber(bpData['2_systolic']);
    const diastolic = toNumber(bpData['1_diastolic']);
    
    const co2Value = sensorData['1_co2'];
    const co2Numeric = isCO2High(co2Value) ? 1 : 0;
    
    const newDataPoint = {
      time: timeString,
      timestamp: timestamp.getTime(),
      temperature: toNumber(sensorData['3_temp']) || null,
      heartRate: toNumber(sensorData['6_hr']) || null,
      systolic: Number.isFinite(systolic) ? systolic : null,
      diastolic: Number.isFinite(diastolic) ? diastolic : null,
      spo2: toNumber(sensorData['7_spo2']) || null,
      humidity: toNumber(sensorData['4_hum']) || null,
      alcohol: toNumber(sensorData['2_alcohol']) || null,
      soundLevel: toNumber(sensorData['8_sound']) || null,
      co2: co2Numeric
    };

    setHistoricalData(prev => {
      const updated = [...prev, newDataPoint];
      return updated.slice(-maxDataPoints);
    });
  };

  // Enhanced alert system with early warning thresholds
  const checkForAlerts = (data) => {
    const newAlerts = [];
    const sensorData = data['1_Sensor_Data'];
    const notificationData = data['2_Notification'];

    if (sensorData) {
      // Enhanced Temperature Monitoring with Early Warning
      const temp = toNumber(sensorData['3_temp']);
      if (Number.isFinite(temp)) {
        if (temp >= 39.5) {
          newAlerts.push({
            id: `temp-critical-${Date.now()}`,
            type: 'critical',
            message: `CRITICAL: Very High Temperature: ${temp}°C - Seek emergency medical attention immediately!`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (temp >= 38.5) {
          newAlerts.push({
            id: `temp-high-${Date.now()}`,
            type: 'critical',
            message: `HIGH FEVER: Temperature: ${temp}°C - Medical attention required!`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (temp >= 37.8) {
          newAlerts.push({
            id: `temp-approaching-${Date.now()}`,
            type: 'warning',
            message: `WARNING: Temperature Rising: ${temp}°C - Monitor closely, approaching fever range. Stay hydrated and rest.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (temp <= 35.5) {
          newAlerts.push({
            id: `temp-low-critical-${Date.now()}`,
            type: 'critical',
            message: `CRITICAL: Very Low Temperature: ${temp}°C - Hypothermia risk! Seek immediate medical attention.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (temp <= 36.0) {
          newAlerts.push({
            id: `temp-low-${Date.now()}`,
            type: 'warning',
            message: `WARNING: Low Temperature: ${temp}°C - Keep warm and monitor closely.`,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }

      // Enhanced Heart Rate Monitoring
      const hr = toNumber(sensorData['6_hr']);
      if (Number.isFinite(hr)) {
        if (hr >= 130) {
          newAlerts.push({
            id: `hr-critical-${Date.now()}`,
            type: 'critical',
            message: `CRITICAL: Very High Heart Rate: ${hr} BPM - Seek immediate medical attention!`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (hr >= 110) {
          newAlerts.push({
            id: `hr-high-${Date.now()}`,
            type: 'warning',
            message: `WARNING: High Heart Rate: ${hr} BPM - Rest immediately and avoid stimulants.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (hr >= 90) {
          newAlerts.push({
            id: `hr-approaching-${Date.now()}`,
            type: 'info',
            message: `NOTICE: Heart Rate Elevated: ${hr} BPM - Consider relaxation techniques and monitor.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (hr <= 45) {
          newAlerts.push({
            id: `hr-low-critical-${Date.now()}`,
            type: 'critical',
            message: `CRITICAL: Very Low Heart Rate: ${hr} BPM - Bradycardia detected! Seek immediate medical attention.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (hr <= 55) {
          newAlerts.push({
            id: `hr-low-${Date.now()}`,
            type: 'warning',
            message: `WARNING: Low Heart Rate: ${hr} BPM - Monitor for dizziness or weakness.`,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }

      // Enhanced Blood Pressure Monitoring
      const bpObj = sensorData['5_bp'] || {};
      const systolic = toNumber(bpObj['2_systolic']);
      const diastolic = toNumber(bpObj['1_diastolic']);
      
      if (Number.isFinite(systolic) && Number.isFinite(diastolic)) {
        if (systolic >= 180 || diastolic >= 110) {
          newAlerts.push({
            id: `bp-crisis-${Date.now()}`,
            type: 'critical',
            message: `HYPERTENSIVE CRISIS: BP ${systolic}/${diastolic} - Call emergency services immediately!`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (systolic >= 160 || diastolic >= 100) {
          newAlerts.push({
            id: `bp-severe-${Date.now()}`,
            type: 'critical',
            message: `SEVERE HYPERTENSION: BP ${systolic}/${diastolic} - Seek immediate medical attention!`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (systolic >= 140 || diastolic >= 90) {
          newAlerts.push({
            id: `bp-high-${Date.now()}`,
            type: 'warning',
            message: `HIGH BLOOD PRESSURE: BP ${systolic}/${diastolic} - Monitor closely and consult doctor.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (systolic >= 130 || diastolic >= 85) {
          newAlerts.push({
            id: `bp-approaching-${Date.now()}`,
            type: 'info',
            message: `ELEVATED BP: ${systolic}/${diastolic} - Approaching high range. Practice relaxation and reduce sodium.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (systolic <= 80 || diastolic <= 50) {
          newAlerts.push({
            id: `bp-low-severe-${Date.now()}`,
            type: 'critical',
            message: `SEVERE HYPOTENSION: BP ${systolic}/${diastolic} - Risk of shock! Seek immediate medical attention.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (systolic <= 90 || diastolic <= 60) {
          newAlerts.push({
            id: `bp-low-${Date.now()}`,
            type: 'warning',
            message: `LOW BLOOD PRESSURE: BP ${systolic}/${diastolic} - Stay hydrated and avoid sudden movements.`,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }

      // Enhanced SpO2 Monitoring
      const spo2 = toNumber(sensorData['7_spo2']);
      if (Number.isFinite(spo2)) {
        if (spo2 <= 85) {
          newAlerts.push({
            id: `spo2-critical-${Date.now()}`,
            type: 'critical',
            message: `CRITICAL HYPOXIA: SpO₂ ${spo2}% - Call emergency services immediately!`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (spo2 <= 90) {
          newAlerts.push({
            id: `spo2-severe-${Date.now()}`,
            type: 'critical',
            message: `SEVERE LOW OXYGEN: SpO₂ ${spo2}% - Seek immediate medical attention!`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (spo2 <= 94) {
          newAlerts.push({
            id: `spo2-low-${Date.now()}`,
            type: 'warning',
            message: `LOW OXYGEN: SpO₂ ${spo2}% - Use breathing exercises and monitor closely.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (spo2 <= 96) {
          newAlerts.push({
            id: `spo2-approaching-${Date.now()}`,
            type: 'info',
            message: `OXYGEN DECLINING: SpO₂ ${spo2}% - Approaching low range. Practice deep breathing.`,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }

      // Enhanced Humidity Monitoring
      const humidity = toNumber(sensorData['4_hum']);
      if (Number.isFinite(humidity)) {
        if (humidity >= 90) {
          newAlerts.push({
            id: `humidity-critical-${Date.now()}`,
            type: 'warning',
            message: `CRITICAL HUMIDITY: ${humidity}% - Immediate ventilation needed! Risk of respiratory issues.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (humidity >= 80) {
          newAlerts.push({
            id: `humidity-high-${Date.now()}`,
            type: 'info',
            message: `HIGH HUMIDITY: ${humidity}% - Approaching uncomfortable levels. Use dehumidifier.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (humidity <= 20) {
          newAlerts.push({
            id: `humidity-low-${Date.now()}`,
            type: 'info',
            message: `VERY LOW HUMIDITY: ${humidity}% - Risk of respiratory irritation. Use humidifier.`,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }

      // Enhanced Alcohol Monitoring
      const alcohol = toNumber(sensorData['2_alcohol']);
      if (Number.isFinite(alcohol)) {
        if (alcohol >= 4) {
          newAlerts.push({
            id: `alcohol-dangerous-${Date.now()}`,
            type: 'critical',
            message: `DANGEROUS ALCOHOL LEVEL: ${alcohol} - Risk of alcohol poisoning! Seek immediate help.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (alcohol >= 3) {
          newAlerts.push({
            id: `alcohol-high-${Date.now()}`,
            type: 'warning',
            message: `HIGH ALCOHOL LEVEL: ${alcohol} - Severely impaired. Get assistance immediately.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (alcohol >= 2) {
          newAlerts.push({
            id: `alcohol-moderate-${Date.now()}`,
            type: 'warning',
            message: `MODERATE ALCOHOL LEVEL: ${alcohol} - Impaired judgment. Avoid driving and get supervision.`,
            timestamp: new Date().toLocaleTimeString()
          });
        } else if (alcohol >= 1) {
          newAlerts.push({
            id: `alcohol-detected-${Date.now()}`,
            type: 'info',
            message: `ALCOHOL DETECTED: Level ${alcohol} - Avoid driving and monitor condition.`,
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }

      // CO₂ alert logic
      if (isCO2High(sensorData['1_co2'])) {
        newAlerts.push({
          id: `co2-${Date.now()}`,
          type: 'warning',
          message: 'HIGH CO₂ LEVEL: Poor air quality detected! Improve ventilation immediately.',
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }

    // Disease Detection Alerts
    if (notificationData) {
      const n = notificationData;
      
      if (n['1_Alert']) {
        const alertType = n['1_Alert'].toLowerCase();
        
        if (alertType === 'cough') {
          newAlerts.push({
            id: `cough-${Date.now()}`,
            type: 'info',
            message: 'COUGH DETECTED: Sound analysis indicates coughing. Monitor symptoms and stay hydrated.',
            timestamp: new Date().toLocaleTimeString()
          });
        }
        
        if (alertType === 'tb') {
          newAlerts.push({
            id: `tb-${Date.now()}`,
            type: 'critical',
            message: 'TB RISK DETECTED: Sound analysis indicates TB symptoms. Seek immediate medical evaluation!',
            timestamp: new Date().toLocaleTimeString()
          });
        }
        
        if (alertType === 'asthma') {
          newAlerts.push({
            id: `asthma-${Date.now()}`,
            type: 'warning',
            message: 'ASTHMA SYMPTOMS: Sound analysis indicates breathing difficulties. Use rescue inhaler if available.',
            timestamp: new Date().toLocaleTimeString()
          });
        }
      }
      
      const bpObj2 = sensorData?.['5_bp'] || {};
      const sys = toNumber(bpObj2['2_systolic']);
      const dia = toNumber(bpObj2['1_diastolic']);
      const isBPHigh = (Number.isFinite(sys) && sys > 120) || (Number.isFinite(dia) && dia > 80);
      
      if (isActiveFlag(n['4_hypertension']) && isBPHigh) {
        newAlerts.push({
          id: `hypertension-${Date.now()}`,
          type: 'critical',
          message: 'HYPERTENSION ALERT: Sustained high blood pressure detected!',
          timestamp: new Date().toLocaleTimeString()
        });
      }
    }

    if (newAlerts.length > 0) {
      setAlerts((prev) => [...newAlerts, ...prev.slice(0, 4)]);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 12000); // Longer display time for multiple alerts

      // Pick highest severity in this batch and play one pattern using refs
      const hasCritical = newAlerts.some(a => a.type === 'critical');
      const hasWarning = newAlerts.some(a => a.type === 'warning');
      const severity = hasCritical ? 'critical' : hasWarning ? 'warning' : 'info';

      if (audioEnabledRef.current && typeof playAlertPatternRef.current === 'function') {
        playAlertPatternRef.current(severity);
      }
    }
  };

  const maybeTriggerAutoNotifications = async (data, nodePath) => {
    const sensor = data?.['1_Sensor_Data'] || {};
    const notif = data?.['2_Notification'] || {};
    const sound = toNumber(sensor['8_sound']);
    const bpObj = sensor['5_bp'] || {};
    const sys = toNumber(bpObj['2_systolic']);
    const dia = toNumber(bpObj['1_diastolic']);
    const toSet = {};

    if (sound === 1) {
      toSet['1_Alert'] = 'cough';
    } else if (sound === 2) {
      toSet['1_Alert'] = 'tb';
    } else if (sound === 3) {
      toSet['1_Alert'] = 'asthma';
    } else if (sound === 0) {
      if (notif['1_Alert']) toSet['1_Alert'] = '';
    }

    if ((Number.isFinite(sys) && sys > 120) || (Number.isFinite(dia) && dia > 80)) {
      if (!isActiveFlag(notif['4_hypertension'])) toSet['4_hypertension'] = 1;
    }

    if (Object.keys(toSet).length === 0 || writingRef.current) return;
    const already = Object.entries(toSet).every(([k, v]) => lastWriteRef.current[k] === v);
    if (already) return;

    try {
      writingRef.current = true;
      await update(ref(database, `${nodePath}/2_Notification`), toSet);
      lastWriteRef.current = { ...lastWriteRef.current, ...toSet };
      writingRef.current = false;
    } catch (e) {
      console.error('Failed to update notifications:', e);
      writingRef.current = false;
    }
  };

  // Enhanced status determination with early warning levels
  const getVitalStatus = (value, type) => {
    if (value === null || value === undefined || value === "") return 'normal';
    const numValue = parseFloat(value);
    
    switch (type) {
      case 'temp':
        if (numValue >= 39.5) return 'critical';
        if (numValue >= 38.5) return 'critical';
        if (numValue >= 37.8) return 'warning';
        if (numValue <= 35.5) return 'critical';
        if (numValue <= 36.0) return 'warning';
        return 'normal';
      case 'hr':
        if (numValue >= 130 || numValue <= 45) return 'critical';
        if (numValue >= 110 || numValue <= 55) return 'warning';
        if (numValue >= 90) return 'approaching';
        return 'normal';
      case 'bp_sys':
        if (numValue >= 180) return 'critical';
        if (numValue >= 160) return 'critical';
        if (numValue >= 140) return 'warning';
        if (numValue >= 130) return 'approaching';
        if (numValue <= 80) return 'critical';
        if (numValue <= 90) return 'warning';
        return 'normal';
      case 'bp_dia':
        if (numValue >= 110) return 'critical';
        if (numValue >= 100) return 'critical';
        if (numValue >= 90) return 'warning';
        if (numValue >= 85) return 'approaching';
        if (numValue <= 50) return 'critical';
        if (numValue <= 60) return 'warning';
        return 'normal';
      case 'spo2':
        if (numValue <= 85) return 'critical';
        if (numValue <= 90) return 'critical';
        if (numValue <= 94) return 'warning';
        if (numValue <= 96) return 'approaching';
        return 'normal';
      case 'humidity':
        if (numValue >= 90) return 'warning';
        if (numValue >= 80) return 'approaching';
        if (numValue <= 20) return 'approaching';
        return 'normal';
      case 'alcohol':
        if (numValue >= 4) return 'critical';
        if (numValue >= 3) return 'warning';
        if (numValue >= 2) return 'warning';
        if (numValue >= 1) return 'approaching';
        return 'normal';
      default:
        return 'normal';
    }
  };

  // Enhanced status text with specific guidance
  const getVitalStatusText = (value, type) => {
    if (value === null || value === undefined || value === "") return 'No Data';
    const numValue = parseFloat(value);
    
    switch (type) {
      case 'temp':
        if (numValue >= 39.5) return 'CRITICAL - Emergency!';
        if (numValue >= 38.5) return 'High Fever';
        if (numValue >= 37.8) return 'Approaching Fever';
        if (numValue <= 35.5) return 'CRITICAL - Hypothermia!';
        if (numValue <= 36.0) return 'Low Temperature';
        return 'Normal';
      case 'hr':
        if (numValue >= 130) return 'CRITICAL - Very High!';
        if (numValue <= 45) return 'CRITICAL - Very Low!';
        if (numValue >= 110) return 'High';
        if (numValue <= 55) return 'Low';
        if (numValue >= 90) return 'Elevated';
        return 'Normal';
      case 'bp':
        const bpInfo = getBloodPressureDisplay();
        return bpInfo.statusText;
      case 'spo2':
        if (numValue <= 85) return 'CRITICAL - Emergency!';
        if (numValue <= 90) return 'Severe Low';
        if (numValue <= 94) return 'Low';
        if (numValue <= 96) return 'Declining';
        return 'Normal';
      case 'humidity':
        if (numValue >= 90) return 'Very High';
        if (numValue >= 80) return 'High';
        if (numValue <= 20) return 'Very Low';
        return 'Normal';
      case 'alcohol':
        if (numValue >= 4) return 'DANGEROUS';
        if (numValue >= 3) return 'Very High';
        if (numValue >= 2) return 'High';
        if (numValue >= 1) return 'Detected';
        return 'Normal';
      default:
        return 'Normal';
    }
  };

  // Generate enhanced ML suggestions with early warning context
  const generateMLSuggestions = () => {
    const sensorData = patientData?.['1_Sensor_Data'] || {};
    const notificationData = patientData?.['2_Notification'] || {};
    
    const bpObj = sensorData['5_bp'] || {};
    const co2Value = sensorData['1_co2'];
    const co2Feature = isCO2High(co2Value) ? 1 : 0;
    
    const currentFeatures = [
      toNumber(sensorData['3_temp']) || 37.0,
      toNumber(sensorData['6_hr']) || 75,
      toNumber(bpObj['2_systolic']) || 120,
      toNumber(bpObj['1_diastolic']) || 80,
      toNumber(sensorData['7_spo2']) || 98,
      toNumber(sensorData['4_hum']) || 45,
      toNumber(sensorData['2_alcohol']) || 0,
      co2Feature
    ];

    let knnSuggestions = healthKNN.generateSuggestions(currentFeatures);

    // Early warning additions
    const temp = toNumber(sensorData['3_temp']);
    if (Number.isFinite(temp)) {
      if (temp >= 37.8 && temp < 38.5) {
        knnSuggestions.push({
          type: 'warning',
          category: 'Early Warning - Temperature',
          message: `Temperature approaching fever range (${temp}°C). Start preventive measures: increase fluid intake, rest, monitor every hour, and prepare fever-reducing medications. Contact healthcare provider if it continues rising.`,
          priority: 'medium',
          confidence: 85
        });
      }
    }

    const hr = toNumber(sensorData['6_hr']);
    if (Number.isFinite(hr)) {
      if (hr >= 90 && hr < 110) {
        knnSuggestions.push({
          type: 'info',
          category: 'Early Warning - Heart Rate',
          message: `Heart rate elevated (${hr} BPM) and approaching concerning levels. Practice deep breathing exercises, avoid caffeine, sit down and relax. Monitor closely and seek medical advice if it continues rising above 100 BPM.`,
          priority: 'medium',
          confidence: 82
        });
      }
    }

    const systolic = toNumber(bpObj['2_systolic']);
    const diastolic = toNumber(bpObj['1_diastolic']);
    if (Number.isFinite(systolic) && Number.isFinite(diastolic)) {
      if ((systolic >= 130 && systolic < 140) || (diastolic >= 85 && diastolic < 90)) {
        knnSuggestions.push({
          type: 'info',
          category: 'Early Warning - Blood Pressure',
          message: `Blood pressure elevated (${systolic}/${diastolic}) and approaching high range. Reduce sodium intake immediately, practice relaxation techniques, avoid stress, and monitor regularly. Contact your doctor if readings consistently stay elevated.`,
          priority: 'medium',
          confidence: 88
        });
      }
    }

    const spo2 = toNumber(sensorData['7_spo2']);
    if (Number.isFinite(spo2)) {
      if (spo2 <= 96 && spo2 > 94) {
        knnSuggestions.push({
          type: 'info',
          category: 'Early Warning - Oxygen',
          message: `Oxygen saturation declining (${spo2}%) and approaching concerning levels. Practice deep breathing exercises, ensure good posture, check for airway obstructions, and monitor closely. Consult your doctor immediately if levels drop below 95% or you experience shortness of breath.`,
          priority: 'medium',
          confidence: 90
        });
      }
    }

    // Respiratory condition suggestions
    if (notificationData?.['1_Alert']) {
      const alertType = notificationData['1_Alert'].toLowerCase();
      
      if (alertType === 'cough') {
        knnSuggestions.push({
          type: 'info',
          category: 'Cough Management',
          message: 'Cough detected by sound analysis. Stay hydrated (warm water, herbal teas), use humidifier (40-60% humidity), avoid smoking and irritants, try honey or throat lozenges, gargle with salt water, and monitor for fever or blood in sputum.',
          priority: 'low',
          confidence: 88
        });
      } else if (alertType === 'asthma') {
        knnSuggestions.push({
          type: 'warning',
          category: 'Asthma Management',
          message: 'Asthma symptoms detected by sound analysis. Use prescribed rescue inhaler (albuterol) immediately, sit upright, practice pursed-lip breathing, remove from triggers (dust, allergens, cold air), use spacer device, and seek medical attention if no improvement in 15-20 minutes.',
          priority: 'medium',
          confidence: 92
        });
      } else if (alertType === 'tb') {
        knnSuggestions.push({
          type: 'critical',
          category: 'TB Risk Management',
          message: 'TB risk indicators detected by sound analysis. Seek immediate medical evaluation for TB testing (chest X-ray, sputum test), isolate from others until cleared, wear N95 mask in public, improve nutrition with protein-rich foods, ensure adequate ventilation, and follow all medical instructions strictly.',
          priority: 'high',
          confidence: 95
        });
      }
    }

    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return knnSuggestions
      .sort((a, b) => {
        const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
        if (priorityDiff === 0) {
          return (b.confidence || 0) - (a.confidence || 0);
        }
        return priorityDiff;
      })
      .slice(0, 8);
  };

  // Rest of the component methods remain the same
  const dismissAlert = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return '!';
      case 'warning': return '!';
      case 'info': return 'i';
      default: return '*';
    }
  };

  const getSensorValue = (sensorKey, defaultValue = 'N/A') => {
    const sensorData = patientData?.['1_Sensor_Data'];
    if (!sensorData) return defaultValue;
    const value = sensorData[sensorKey];
    if (value === null || value === undefined || value === "") return defaultValue;
    return value;
  };

  const getSoundLevelDisplay = () => {
    const soundValue = getSensorValue('8_sound', 0);
    const numValue = toNumber(soundValue);
    
    switch (numValue) {
      case 1: return 'Cough';
      case 2: return 'TB';
      case 3: return 'Asthma';
      case 0: return 'Normal';
      default: return 'Normal';
    }
  };

  const getSoundLevelStatus = () => {
    const soundValue = getSensorValue('8_sound', 0);
    const numValue = toNumber(soundValue);
    
    if (numValue === 1 || numValue === 2 || numValue === 3) {
      return 'Detected';
    }
    return 'Normal';
  };

  const getBloodPressureDisplay = () => {
    const sensorData = patientData?.['1_Sensor_Data'];
    if (!sensorData || !sensorData['5_bp']) {
      return { display: 'No Data', status: 'normal', statusText: 'No Data' };
    }
    const bpData = sensorData['5_bp'];
    let systolic = bpData['2_systolic'];
    let diastolic = bpData['1_diastolic'];
    if (systolic === null || systolic === undefined) systolic = "";
    if (diastolic === null || diastolic === undefined) diastolic = "";
    systolic = String(systolic).trim();
    diastolic = String(diastolic).trim();

    if ((systolic === "" || systolic === "null" || systolic === "undefined") &&
        (diastolic === "" || diastolic === "null" || diastolic === "undefined")) {
      return { display: 'Awaiting Data', status: 'normal', statusText: 'Pending' };
    }

    const sysDisplay = (systolic === "" || systolic === "null" || systolic === "undefined") ? "--" : systolic;
    const diaDisplay = (diastolic === "" || diastolic === "null" || diastolic === "undefined") ? "--" : diastolic;
    const displayText = `${sysDisplay}/${diaDisplay}`;

    let status = 'normal';
    let statusText = 'Normal';
    
    const sysNum = Number(systolic);
    const diaNum = Number(diastolic);
    
    // Enhanced status determination
    if ((systolic && !isNaN(sysNum) && sysNum >= 180) || (diastolic && !isNaN(diaNum) && diaNum >= 110)) {
      status = 'critical'; statusText = 'CRISIS - Emergency!';
    } else if ((systolic && !isNaN(sysNum) && sysNum >= 160) || (diastolic && !isNaN(diaNum) && diaNum >= 100)) {
      status = 'critical'; statusText = 'Severe High';
    } else if ((systolic && !isNaN(sysNum) && sysNum >= 140) || (diastolic && !isNaN(diaNum) && diaNum >= 90)) {
      status = 'warning'; statusText = 'High';
    } else if ((systolic && !isNaN(sysNum) && sysNum >= 130) || (diastolic && !isNaN(diaNum) && diaNum >= 85)) {
      status = 'approaching'; statusText = 'Elevated';
    } else if ((systolic && !isNaN(sysNum) && sysNum <= 80) || (diastolic && !isNaN(diaNum) && diaNum <= 50)) {
      status = 'critical'; statusText = 'Severe Low';
    } else if ((systolic && !isNaN(sysNum) && sysNum <= 90) || (diastolic && !isNaN(diaNum) && diaNum <= 60)) {
      status = 'warning'; statusText = 'Low';
    }
    
    return { display: displayText, status, statusText };
  };

  // Custom tooltip for charts (fixed JSX)
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{`Time: ${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '2px 0', color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'temperature' ? '°C' : 
                entry.dataKey === 'heartRate' ? ' BPM' : 
                entry.dataKey.includes('spo2') ? '%' : 
                entry.dataKey.includes('systolic') || entry.dataKey.includes('diastolic') ? ' mmHg' : 
                entry.dataKey === 'humidity' ? '%' : ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (!patientData && connectionStatus === 'connecting') {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading patient data...</p>
      </div>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <div className="error-screen">
        <div className="error-icon">X</div>
        <h2>Connection Error</h2>
        <p>Unable to connect to Firebase database. Please check your connection.</p>
      </div>
    );
  }

  const sensorData = patientData?.['1_Sensor_Data'] || {};
  const notificationData = patientData?.['2_Notification'] || {};
  const bpInfo = getBloodPressureDisplay();

  return (
    <div className="health-dashboard">
      <header className="health-dashboard-header">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap'}}>
          <div>
            <h1>Advanced Health Monitoring Dashboard</h1>
            <p>Real-time monitoring with early warning system</p>
          </div>
          {/* Alert sound controls */}
          <div style={{display:'flex', gap:'0.5rem', alignItems:'center'}}>
            <button
              className="audio-toggle"
              onClick={() => (audioEnabled ? setAudioEnabled(false) : enableAudio())}
              title={audioEnabled ? 'Turn off alert sound' : 'Enable alert sound'}
            >
              {audioEnabled ? 'Sound: On' : 'Enable Alert Sound'}
            </button>
            {audioEnabled && (
              <button className="audio-test" onClick={() => playAlertPattern('info')} title="Play test beep">
                Test
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Enhanced Alert Notifications */}
      <div className={`alert-container ${showAlert ? 'show' : ''}`}>
        {alerts.map(alert => (
          <div key={alert.id} className={`alert alert-${alert.type}`}>
            <span className="alert-icon">{getAlertIcon(alert.type)}</span>
            <div className="alert-content">
              <div className="alert-message">{alert.message}</div>
              <div className="alert-time">{alert.timestamp}</div>
            </div>
            <button className="alert-dismiss" onClick={() => dismissAlert(alert.id)}>×</button>
          </div>
        ))}
      </div>

      <div className="health-dashboard-content">
        {/* Enhanced Vital Signs Cards */}
        <div className="cards-grid">
          <div className="card">
            <div className="card-header"><h3>Temperature</h3><span className="card-icon">T</span></div>
            <div className="card-value">{getSensorValue('3_temp')}°C</div>
            <div className={`card-status ${getVitalStatus(getSensorValue('3_temp', 0), 'temp')}`}>
              {getVitalStatusText(getSensorValue('3_temp', 0), 'temp')}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Heart Rate</h3><span className="card-icon">HR</span></div>
            <div className="card-value">{getSensorValue('6_hr')} BPM</div>
            <div className={`card-status ${getVitalStatus(getSensorValue('6_hr', 0), 'hr')}`}>
              {getVitalStatusText(getSensorValue('6_hr', 0), 'hr')}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Blood Pressure</h3><span className="card-icon">BP</span></div>
            <div className="card-value">
              {bpInfo.display}
              {bpInfo.display !== 'No Data' && bpInfo.display !== 'Awaiting Data' && bpInfo.display !== '--/--' && !bpInfo.display.includes('--') ? ' mmHg' : ''}
            </div>
            <div className={`card-status ${bpInfo.status}`}>{bpInfo.statusText}</div>
          </div>

          <div className="card">
            <div className="card-header"><h3>SpO2</h3><span className="card-icon">O2</span></div>
            <div className="card-value">{getSensorValue('7_spo2')}%</div>
            <div className={`card-status ${getVitalStatus(getSensorValue('7_spo2', 100), 'spo2')}`}>
              {getVitalStatusText(getSensorValue('7_spo2', 100), 'spo2')}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Humidity</h3><span className="card-icon">H</span></div>
            <div className="card-value">{getSensorValue('4_hum')}%</div>
            <div className={`card-status ${getVitalStatus(getSensorValue('4_hum', 0), 'humidity')}`}>
              {getVitalStatusText(getSensorValue('4_hum', 0), 'humidity')}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Alcohol Level</h3><span className="card-icon">ALC</span></div>
            <div className="card-value">{getSensorValue('2_alcohol')}</div>
            <div className={`card-status ${getVitalStatus(getSensorValue('2_alcohol', 0), 'alcohol')}`}>
              {getVitalStatusText(getSensorValue('2_alcohol', 0), 'alcohol')}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>CO₂ Level</h3><span className="card-icon">CO2</span></div>
            <div className="card-value">
              {isCO2High(getSensorValue('1_co2')) ? 'High' : 'Normal'}
            </div>
            <div className={`card-status ${isCO2High(getSensorValue('1_co2')) ? 'warning' : 'normal'}`}>
              {isCO2High(getSensorValue('1_co2')) ? 'High' : 'Normal'}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h3>Disease Detection</h3><span className="card-icon">SND</span></div>
            <div className="card-value">{getSoundLevelDisplay()}</div>
            <div className="card-status normal">
              {getSoundLevelStatus()}
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {historicalData.length > 0 && (
          <div className="charts-section">
            <h2>Vital Signs Trends</h2>
            
            <div className="charts-grid">
              <div className="chart-container">
                <h3>Temperature Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="temperature" 
                      stroke="#ff6b6b" 
                      fill="#ff6b6b" 
                      fillOpacity={0.6}
                      connectNulls={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Heart Rate Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="heartRate" 
                      stroke="#4ecdc4" 
                      strokeWidth={3}
                      dot={{ fill: '#4ecdc4', strokeWidth: 2, r: 4 }}
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Blood Pressure Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['dataMin - 20', 'dataMax + 20']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="systolic" 
                      stroke="#e74c3c" 
                      strokeWidth={2}
                      dot={{ fill: '#e74c3c', strokeWidth: 2, r: 3 }}
                      name="Systolic"
                      connectNulls={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="diastolic" 
                      stroke="#3498db" 
                      strokeWidth={2}
                      dot={{ fill: '#3498db', strokeWidth: 2, r: 3 }}
                      name="Diastolic"
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>SpO₂ Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis domain={['dataMin - 5', 'dataMax + 2']} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="spo2" 
                      stroke="#9b59b6" 
                      fill="#9b59b6" 
                      fillOpacity={0.6}
                      connectNulls={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Sound Level Over Time</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="soundLevel" fill="#f39c12" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-container">
                <h3>Environmental Factors</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="humidity" 
                      stroke="#27ae60" 
                      strokeWidth={2}
                      name="Humidity (%)"
                      connectNulls={false}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="co2" 
                      stroke="#e67e22" 
                      strokeWidth={2}
                      name="CO₂ Level"
                      connectNulls={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced AI Health Recommendations */}
        <div className="ml-suggestions-panel">
          <h3>Advanced AI Health Recommendations with Early Warning System</h3>
          <p className="disclaimer">
            The AI system includes early warning alerts when your vitals approach critical ranges. This provides preventive guidance before reaching dangerous levels. Includes comprehensive analysis for all parameters including respiratory conditions. Always consult healthcare professionals for medical advice.
          </p>
          <div className="suggestions-grid">
            {generateMLSuggestions().map((suggestion, index) => (
              <div key={index} className={`suggestion-item ${suggestion.type}`}>
                <div className="suggestion-header">
                  <span className="suggestion-category">{suggestion.category}</span>
                  <div className="suggestion-badges">
                    <span className={`suggestion-priority priority-${suggestion.priority}`}>
                      {suggestion.priority.toUpperCase()}
                    </span>
                    {suggestion.confidence && (
                      <span className="suggestion-confidence">
                        {suggestion.confidence}% match
                      </span>
                    )}
                  </div>
                </div>
                <div className="suggestion-message">{suggestion.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .health-dashboard-header p {
          margin: 0.5rem 0 0 0;
          color: #7f8c8d;
          font-size: 1rem;
        }
        
        .audio-toggle, .audio-test {
          appearance: none;
          border: 0;
          padding: 0.6rem 0.9rem;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .audio-toggle {
          background: #2c3e50;
          color: #fff;
        }
        .audio-test {
          background: #3498db;
          color: #fff;
        }
        .audio-toggle:hover, .audio-test:hover { opacity: 0.92; }

        .card-status.approaching {
          background: #fff3cd;
          color: #856404;
        }
        
        .charts-section {
          margin: 2rem 0;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }
        
        .charts-section h2 {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 2rem;
          font-size: 1.8rem;
          font-weight: bold;
        }
        
        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 2rem;
        }
        
        .chart-container {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e1e8ed;
        }
        
        .chart-container h3 {
          margin: 0 0 1rem 0;
          color: #34495e;
          font-size: 1.2rem;
          font-weight: 600;
          text-align: center;
        }
        
        .ml-suggestions-panel {
          background: rgba(255, 255, 255, 0.95);
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          margin: 2rem 0;
        }
        
        .ml-suggestions-panel h3 {
          margin: 0 0 0.5rem 0;
          color: #2c3e50;
          font-size: 1.3rem;
          display: flex;
          align-items: center;
        }
        
        .disclaimer {
          font-size: 0.85rem;
          color: #7f8c8d;
          margin-bottom: 1.5rem;
          font-style: italic;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #3498db;
        }
        
        .suggestions-grid {
          display: grid;
          gap: 1rem;
        }
        
        .suggestion-item {
          padding: 1rem;
          border-radius: 10px;
          border-left: 4px solid #3498db;
          background: #f8f9fa;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .suggestion-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .suggestion-item.critical {
          border-left-color: #e74c3c;
          background: #fdf2f2;
        }
        
        .suggestion-item.warning {
          border-left-color: #f39c12;
          background: #fefbf3;
        }
        
        .suggestion-item.info {
          border-left-color: #3498db;
          background: #f3f9ff;
        }
        
        .suggestion-item.success {
          border-left-color: #27ae60;
          background: #f0fdf4;
        }
        
        .suggestion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        
        .suggestion-category {
          font-weight: 600;
          color: #2c3e50;
          font-size: 0.9rem;
        }
        
        .suggestion-badges {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        
        .suggestion-priority {
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: bold;
          text-transform: uppercase;
        }
        
        .suggestion-confidence {
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          background: #34495e;
          color: white;
          font-weight: bold;
        }
        
        .priority-high {
          background: #e74c3c;
          color: white;
        }
        
        .priority-medium {
          background: #f39c12;
          color: white;
        }
        
        .priority-low {
          background: #95a5a6;
          color: white;
        }
        
        .suggestion-message {
          color: #34495e;
          line-height: 1.4;
          font-size: 0.9rem;
        }
        
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .error-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
          color: white;
          text-align: center;
        }
        
        .error-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        
        .health-dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Arial', sans-serif;
        }
        
        .health-dashboard-header {
          background: rgba(255, 255, 255, 0.95);
          padding: 1.5rem;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
        }
        
        .health-dashboard-header h1 {
          margin: 0;
          color: #2c3e50;
          font-size: 2rem;
          font-weight: bold;
        }
        
        .health-dashboard-content {
          padding: 2rem;
        }
        
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .card {
          background: rgba(255, 255, 255, 0.95);
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        
        .card-header h3 {
          margin: 0;
          color: #34495e;
          font-size: 1.1rem;
        }
        
        .card-icon {
          font-size: 1rem;
          font-weight: 700;
          color: #95a5a6;
        }
        
        .card-value {
          font-size: 2rem;
          font-weight: bold;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }
        
        .card-status {
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .card-status.normal {
          background: #d5f4e6;
          color: #27ae60;
        }
        
        .card-status.warning {
          background: #fef9e7;
          color: #f39c12;
        }
        
        .card-status.critical {
          background: #fadbd8;
          color: #e74c3c;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
        
        .alert-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          opacity: 0;
          transform: translateX(100%);
          transition: all 0.3s ease;
          max-width: 450px;
        }
        
        .alert-container.show {
          opacity: 1;
          transform: translateX(0);
        }
        
        .alert {
          display: flex;
          align-items: center;
          margin-bottom: 0.5rem;
          padding: 1rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 300px;
          max-width: 450px;
        }
        
        .alert-critical {
          background: #fadbd8;
          border-left: 4px solid #e74c3c;
          animation: alertPulse 1s infinite;
        }
        
        @keyframes alertPulse {
          0% { border-left-color: #e74c3c; }
          50% { border-left-color: #c0392b; }
          100% { border-left-color: #e74c3c; }
        }
        
        .alert-warning {
          background: #fef9e7;
          border-left: 4px solid #f39c12;
        }
        
        .alert-info {
          background: #d6eaf8;
          border-left: 4px solid #3498db;
        }
        
        .alert-icon {
          background: #e74c3c;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          margin-right: 1rem;
          font-size: 0.8rem;
        }
        
        .alert-content {
          flex: 1;
        }
        
        .alert-message {
          font-weight: 600;
          margin-bottom: 0.2rem;
          font-size: 0.9rem;
        }
        
        .alert-time {
          font-size: 0.8rem;
          color: #7f8c8d;
        }
        
        .alert-dismiss {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #7f8c8d;
          padding: 0;
          margin-left: 0.5rem;
        }
        
        .alert-dismiss:hover {
          color: #2c3e50;
        }
        
        @media (max-width: 768px) {
          .health-dashboard-content {
            padding: 1rem;
          }
          
          .cards-grid, .charts-grid {
            grid-template-columns: 1fr;
          }
          
          .alert-container {
            right: 10px;
            left: 10px;
          }
          
          .alert {
            min-width: auto;
          }
          
          .chart-container {
            min-width: 300px;
          }
          
          .audio-toggle {
            padding: 0.5rem 0.75rem;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
