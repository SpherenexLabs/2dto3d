import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import './BatteryManagement.css'
// Firebase configuration
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

function MotorControlDashboard() {
  const [currentCommand, setCurrentCommand] = useState('-');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Listen for changes in Firebase
    const commandRef = ref(database, '5_Battery_Management/Motor_Commands');
    const unsubscribe = onValue(commandRef, (snapshot) => {
      const data = snapshot.val();
      setCurrentCommand(data || '-');
    });

    return () => unsubscribe();
  }, []);

  const sendCommand = async (command) => {
    try {
      const commandRef = ref(database, '5_Battery_Management/Motor_Commands');
      await set(commandRef, command);
      setMessage(`Command ${command} sent successfully!`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="dashboard">
      <h1>Battery Management Dashboard</h1>
      
      {/* <div className="status">
        Current Command: <strong>{currentCommand}</strong>
      </div> */}
      
      <div className="control-grid">
        <button onClick={() => sendCommand('F')}>⬆️ Forward</button>
        <button onClick={() => sendCommand('L')}>⬅️ Left</button>
        <button onClick={() => sendCommand('S')}>🛑 Stop</button>
        <button onClick={() => sendCommand('R')}>➡️ Right</button>
        <button onClick={() => sendCommand('B')}>⬇️ Backward</button>
      </div>
      
      {/* {message && <div className="message">{message}</div>} */}
    </div>
  );
}

export default MotorControlDashboard;




// import React, { useState, useEffect } from 'react';
// import { initializeApp, getApps } from 'firebase/app';
// import { getDatabase, ref, set,update, push } from 'firebase/database';
// import './Batterymanagement.css';

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBtZRJF29XjraxqGiNc9ssvUKj48JpjhAE",
//   authDomain: "bosch-robot.firebaseapp.com",
//   databaseURL: "https://bosch-robot-default-rtdb.firebaseio.com",
//   projectId: "bosch-robot",
//   storageBucket: "bosch-robot.firebasestorage.app",
//   messagingSenderId: "922197757066",
//   appId: "1:922197757066:web:f48aa73a1ddb4377b1b173",
//   measurementId: "G-F6EW4HMYGG"
// };

// // Initialize Firebase only if it hasn't been initialized
// const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
// const database = getDatabase(app);

// const RobotControl = () => {
//   const [status, setStatus] = useState('Ready to send commands');
//   const [isError, setIsError] = useState(false);
//   const [lastCommand, setLastCommand] = useState('');

// const sendCommand = async (command) => {
//   setStatus(`Sending command: ${command}`);
//   setIsError(false);
  
//   try {
//     // Use update instead of set
//     const updates = {};
//     updates['1_BOSCH/Movements'] = command;
//     updates['1_BOSCH/LastUpdate'] = Date.now();
    
//     await update(ref(database), updates);
    
//     console.log('Firebase update successful!');
//     setStatus(`Command "${command}" sent successfully!`);
//     setLastCommand(command);
    
//     setTimeout(() => {
//       setStatus('Ready to send commands');
//     }, 3000);
    
//   } catch (error) {
//     console.error('Detailed Firebase error:', error);
//     setStatus(`Error: ${error.message}`);
//     setIsError(true);
//   }
// };
//   // Test function to verify Firebase connection
//   const testFirebaseConnection = async () => {
//     try {
//       const testRef = ref(database, 'test');
//       await set(testRef, {
//         message: 'Connection test',
//         timestamp: new Date().toISOString()
//       });
//       console.log('Test write successful!');
//       setStatus('Firebase connection test successful!');
//     } catch (error) {
//       console.error('Test write failed:', error);
//       setStatus(`Connection test failed: ${error.message}`);
//       setIsError(true);
//     }
//   };

//   // Keyboard support
//   useEffect(() => {
//     const handleKeyPress = (event) => {
//       // Prevent default for space key to avoid page scroll
//       if (event.key === ' ') {
//         event.preventDefault();
//       }
      
//       switch(event.key.toLowerCase()) {
//         case 'arrowup':
//         case 'w':
//           sendCommand('F');
//           break;
//         case 'arrowdown':
//         case 's':
//           sendCommand('B');
//           break;
//         case 'arrowleft':
//         case 'a':
//           sendCommand('L');
//           break;
//         case 'arrowright':
//         case 'd':
//           sendCommand('R');
//           break;
//         case ' ':
//           sendCommand('S');
//           break;
//         default:
//           break;
//       }
//     };

//     document.addEventListener('keydown', handleKeyPress);
//     return () => {
//       document.removeEventListener('keydown', handleKeyPress);
//     };
//   }, []);

//   return (
//     <div className="control-container">
//       <h1>🤖 Bosch Robot Control</h1>
      
//       {/* Test Connection Button */}
//       <button 
//         onClick={testFirebaseConnection}
//         style={{
//           marginBottom: '20px',
//           padding: '10px 20px',
//           backgroundColor: '#6c757d',
//           color: 'white',
//           border: 'none',
//           borderRadius: '5px',
//           cursor: 'pointer'
//         }}
//       >
//         Test Firebase Connection
//       </button>
      
//       <div className="control-grid">
//         <button 
//           className="control-btn forward" 
//           onClick={() => sendCommand('F')}
//         >
//           ↑<br />Forward
//         </button>
        
//         <button 
//           className="control-btn left" 
//           onClick={() => sendCommand('L')}
//         >
//           ←<br />Left
//         </button>
        
//         <button 
//           className="control-btn stop" 
//           onClick={() => sendCommand('S')}
//         >
//           ⏹<br />Stop
//         </button>
        
//         <button 
//           className="control-btn right" 
//           onClick={() => sendCommand('R')}
//         >
//           →<br />Right
//         </button>
        
//         <button 
//           className="control-btn backward" 
//           onClick={() => sendCommand('B')}
//         >
//           ↓<br />Backward
//         </button>
//       </div>
      
//       <div className={`status ${isError ? 'error' : ''}`}>
//         {status}
//       </div>
      
//       {lastCommand && (
//         <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
//           Last command sent: <strong>{lastCommand}</strong>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RobotControl;
