import { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Firebase configuration embedded
const firebaseConfig = {
  apiKey: "AIzaSyAZTQgZ9qVd5vGqT_Mx-vYJ7qTOCsH1234",
  authDomain: "self-balancing-7a9fe-default-rtdb.firebaseio.com",
  databaseURL: "https://self-balancing-7a9fe-default-rtdb.firebaseio.com",
  projectId: "self-balancing-7a9fe",
  storageBucket: "self-balancing-7a9fe.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const RFJammer = () => {
  // State for channel data (from receiver - bulbs/LEDs)
  const [channelData, setChannelData] = useState({
    Channel1: 0,
    Channel2: 0,
    Channel3: 0,
    Channel4: 0
  });
  
  const [rssi, setRssi] = useState(-45);
  const [fault, setFault] = useState(0);
  const [currentStatus, setCurrentStatus] = useState('Normal Operation');
  const [noneValue, setNoneValue] = useState(0); // AI optimization toggle
  
  // Channel change indicator state
  const [channelChangeIndicator, setChannelChangeIndicator] = useState(null);
  
  // AI Optimization workflow state
  const [aiStatus, setAiStatus] = useState('idle'); // idle, detecting, analyzing, optimizing, restored
  const [aiRecommendation, setAiRecommendation] = useState('');
  
  // Problem log state - includes transmitter button presses and AI actions
  const [problemLog, setProblemLog] = useState([]);
  
  // Waveform data state
  const [waveformData, setWaveformData] = useState({
    signalStrength: [],
    jammingIntensity: [],
    timestamps: []
  });
  
  // Interference type counts
  const [interferenceTypes, setInterferenceTypes] = useState({
    jamming: 0,
    signalLoss: 0,
    noiseBurst: 0,
    modulationDistortion: 0
  });
  
  // Transmitter button panel state (LED indicators)
  const [activeInterference, setActiveInterference] = useState(0); // 0=None, 1=Jamming, 2=Signal Loss, 3=Noise Burst, 4=Modulation Distortion
  
  // Active problems tracking
  const [activeProblems, setActiveProblems] = useState([]);
  
  // Track previous channel values to detect changes
  const prevChannelDataRef = useRef({
    Channel1: 0,
    Channel2: 0,
    Channel3: 0,
    Channel4: 0
  });
  
  // Animation state
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Map channel values to interference types (from transmitter button panel)
  const getInterferenceType = (value) => {
    switch (value) {
      case 1:
        return 'Jamming';
      case 2:
        return 'Signal Loss';
      case 3:
        return 'Noise Burst';
      case 4:
        return 'Modulation Distortion';
      default:
        return 'Normal';
    }
  };

  // Get AI optimization recommendation based on interference type
  const getAIOptimization = (interferenceType) => {
    switch (interferenceType) {
      case 'Jamming':
        return 'Frequency Shift to 2.5GHz + Signal Boosting';
      case 'Signal Loss':
        return 'Power Amplification + Antenna Realignment';
      case 'Noise Burst':
        return 'Noise Filter Application + Error Correction';
      case 'Modulation Distortion':
        return 'Re-modulation + Carrier Frequency Adjustment';
      default:
        return 'No action required';
    }
  };

  // Firebase realtime listener
  useEffect(() => {
    const currentRef = ref(database, '42_RF_Jammer/Current');
    
    const unsubscribe = onValue(currentRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        // Update channel data (receiver bulbs/LEDs)
        // Firebase has "Channel" field (not Channel1, Channel2, etc.)
        // The value in "Channel" determines which channel and problem type
        const channelValue = data.Channel || 0;
        
        const newChannelData = {
          Channel1: channelValue, // Use the single "Channel" field value for Channel1
          Channel2: 0,
          Channel3: 0,
          Channel4: 0
        };
        
        setChannelData(newChannelData);
        
        // Update RSSI, Fault, and None
        if (data.RSSI !== undefined) setRssi(data.RSSI);
        if (data.Fault !== undefined) setFault(data.Fault);
        if (data.None !== undefined) {
          setNoneValue(data.None);
          
          // When None becomes 1, AI has optimized the process
          if (data.None === 1) {
            setAiStatus('restored');
            setCurrentStatus('✅ AI Optimization Complete - System Optimized');
            
            // Show success indicator
            setChannelChangeIndicator({
              channel: 'ALL',
              status: '✅ AI Optimization Applied Successfully',
              timestamp: Date.now()
            });
            
            // Clear indicator after 5 seconds
            setTimeout(() => setChannelChangeIndicator(null), 5000);
            
            // Add to log
            const optimizationCompleteLog = {
              time: new Date().toLocaleTimeString(),
              type: 'AI Optimization Complete',
              channel: 'All Channels',
              action: '✅ System optimized and stabilized',
              id: Date.now()
            };
            setProblemLog(prev => [optimizationCompleteLog, ...prev].slice(0, 50));
            
            // Reset to idle after 3 seconds
            setTimeout(() => {
              setAiStatus('idle');
              setCurrentStatus('Normal Operation - AI Optimized');
            }, 3000);
          }
          // When None becomes 0, system is back to normal monitoring
          else if (data.None === 0) {
            setCurrentStatus('Normal Operation');
          }
        }
        
        // Detect changes in channel values
        const prevData = prevChannelDataRef.current;
        const changesDetected = [];
        
        Object.keys(newChannelData).forEach((channel) => {
          const newValue = newChannelData[channel];
          const oldValue = prevData[channel];
          
          // Detect when a channel value changes (any change, including 0 to problem, problem to problem, or problem to 0)
          if (newValue !== oldValue) {
            if (newValue !== 0) {
              // Problem detected or changed
              const interferenceType = getInterferenceType(newValue);
              changesDetected.push({
                channel: channel,
                channelNum: channel.replace('Channel', ''),
                type: interferenceType,
                value: newValue,
                isNew: oldValue === 0
              });
            }
          }
        });
        
        // Update previous values reference
        prevChannelDataRef.current = newChannelData;
        
        // Track active problems based on current channel values
        const problems = [];
        Object.keys(newChannelData).forEach((channel) => {
          const value = newChannelData[channel];
          if (value !== 0) {
            const interferenceType = getInterferenceType(value);
            problems.push({
              channel: channel.replace('Channel', ''),
              type: interferenceType,
              value: value
            });
          }
        });
        
        // Update active problems
        setActiveProblems(problems);
        
        // Update status immediately based on active problems
        if (problems.length > 0) {
          const firstProblem = problems[0];
          if (changesDetected.length === 0) {
            // Problem already exists, just update status
            setCurrentStatus(`⚠️ Active: ${firstProblem.type} on Channel ${firstProblem.channel}`);
          }
        }
        
        // Update interference type counts based on CURRENT active problems (not just changes)
        // This ensures charts reflect real-time Firebase state
        const currentCounts = {
          jamming: 0,
          signalLoss: 0,
          noiseBurst: 0,
          modulationDistortion: 0
        };
        
        problems.forEach(problem => {
          const key = problem.type.toLowerCase().replace(' ', '');
          if (key === 'jamming') currentCounts.jamming++;
          else if (key === 'signalloss') currentCounts.signalLoss++;
          else if (key === 'noiseburst') currentCounts.noiseBurst++;
          else if (key === 'modulationdistortion') currentCounts.modulationDistortion++;
        });
        
        // Update the state with current counts (this will update the charts immediately)
        setInterferenceTypes(currentCounts);
        
        // Process detected changes (new problems)
        if (changesDetected.length > 0) {
          changesDetected.forEach((change, index) => {
            // Update active interference (transmitter LED indicator)
            setActiveInterference(change.value);
            
            // Show channel change indicator for detected/changed problem
            setTimeout(() => {
              setChannelChangeIndicator({
                channel: change.channelNum,
                status: change.isNew ? `⚠️ ${change.type} Detected` : `🔄 Changed to ${change.type}`,
                timestamp: Date.now()
              });
              
              // Clear indicator after 3 seconds
              setTimeout(() => setChannelChangeIndicator(null), 3000);
            }, index * 100);
            
            // Add to problem log
            const problemLogEntry = {
              time: new Date().toLocaleTimeString(),
              type: `${change.type} (Value ${change.value})`,
              channel: change.channel,
              action: change.isNew ? '⚠️ New interference detected' : '🔄 Interference type changed',
              id: Date.now() + index
            };
            setProblemLog(prev => [problemLogEntry, ...prev].slice(0, 50));
            
            // Start AI workflow
            setTimeout(() => {
              setAiStatus('detecting');
              setCurrentStatus(`⚠️ Problem detected: ${change.type} on Channel ${change.channelNum}`);
              
              // STEP 2: AI analysis in progress
              setTimeout(() => {
                setAiStatus('analyzing');
                setCurrentStatus('🤖 AI analysis in progress...');
                
                const aiAnalysisLog = {
                  time: new Date().toLocaleTimeString(),
                  type: 'AI Analysis',
                  channel: change.channel,
                  action: '🤖 Classification and pattern detection',
                  id: Date.now() + 1000
                };
                setProblemLog(prev => [aiAnalysisLog, ...prev].slice(0, 50));
              }, 1000);
              
              // STEP 3: AI optimization recommendation
              setTimeout(() => {
                setAiStatus('optimizing');
                const optimization = getAIOptimization(change.type);
                setAiRecommendation(optimization);
                setCurrentStatus(`🔧 Optimization: ${optimization}`);
                
                const optimizationLog = {
                  time: new Date().toLocaleTimeString(),
                  type: 'AI Optimization',
                  channel: change.channel,
                  action: `🔧 ${optimization}`,
                  id: Date.now() + 2000
                };
                setProblemLog(prev => [optimizationLog, ...prev].slice(0, 50));
              }, 3000);
              
              // STEP 4: Signal restoration - Bulb turns back ON
              setTimeout(() => {
                setAiStatus('restored');
                setCurrentStatus('✅ Problem Resolved by AI - Channel Restored');
                
                // Show channel restoration indicator
                setChannelChangeIndicator({
                  channel: change.channelNum,
                  status: '✅ AI Resolved - Channel Restored',
                  timestamp: Date.now()
                });
                
                // Clear indicator after 3 seconds
                setTimeout(() => setChannelChangeIndicator(null), 3000);
                
                const restorationLog = {
                  time: new Date().toLocaleTimeString(),
                  type: 'Signal Restored',
                  channel: change.channel,
                  action: '✅ Channel restored - Bulb turned ON',
                  id: Date.now() + 3000
                };
                setProblemLog(prev => [restorationLog, ...prev].slice(0, 50));
                
                // Reset to idle after showing success
                setTimeout(() => {
                  setAiStatus('idle');
                  setCurrentStatus('Normal Operation');
                }, 2000);
              }, 5000);
            }, index * 50); // Slight delay for each channel
          });
        } else {
          // All channels normal
          setActiveInterference(0);
          setAiStatus('idle');
          setCurrentStatus('Normal Operation');
        }
        
        // Update waveform data
        setWaveformData(prev => {
          const now = new Date().toLocaleTimeString();
          const signalStrength = Math.max(-100, rssi + Math.random() * 10 - 5);
          const jammingIntensity = Object.values(newChannelData).reduce((a, b) => a + b, 0) * 25;
          
          return {
            signalStrength: [...prev.signalStrength, signalStrength].slice(-20),
            jammingIntensity: [...prev.jammingIntensity, jammingIntensity].slice(-20),
            timestamps: [...prev.timestamps, now].slice(-20)
          };
        });
      }
    });
    
    return () => unsubscribe();
  }, [rssi]);

  // Toggle AI Optimization (None field)
  const toggleAIOptimization = async () => {
    try {
      const newValue = noneValue === 0 ? 1 : 0;
      const noneRef = ref(database, '42_RF_Jammer/Current/None');
      await set(noneRef, newValue);
      
      // Add log entry for manual toggle
      const toggleLog = {
        time: new Date().toLocaleTimeString(),
        type: newValue === 1 ? 'AI Optimization Triggered' : 'AI Optimization Reset',
        channel: 'System',
        action: newValue === 1 ? '🚀 Manual AI optimization triggered' : '🔄 System reset to normal',
        id: Date.now()
      };
      setProblemLog(prev => [toggleLog, ...prev].slice(0, 50));
    } catch (error) {
      console.error('Error toggling AI optimization:', error);
    }
  };

  // Canvas animation for RF simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width = 600;
    const height = canvas.height = 300;
    
    let particles = [];
    let jammingWaves = [];
    
    // Initialize particles for normal RF signals
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        size: Math.random() * 3 + 1
      });
    }
    
    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 30, 0.1)';
      ctx.fillRect(0, 0, width, height);
      
      // Draw normal RF signals
      ctx.fillStyle = '#00ff88';
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw jamming waves when interference detected
      const activeChannels = Object.values(channelData).filter(v => v !== 0).length;
      
      if (activeChannels > 0) {
        // Add new jamming wave
        if (Math.random() < 0.1) {
          jammingWaves.push({
            x: width / 2,
            y: height / 2,
            radius: 0,
            maxRadius: 150,
            alpha: 1
          });
        }
        
        // Draw and update jamming waves
        jammingWaves = jammingWaves.filter(wave => {
          wave.radius += 3;
          wave.alpha -= 0.02;
          
          ctx.strokeStyle = `rgba(255, 50, 50, ${wave.alpha})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
          ctx.stroke();
          
          return wave.alpha > 0 && wave.radius < wave.maxRadius;
        });
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [channelData]);

  // Chart configurations
  const waveformChartData = {
    labels: waveformData.timestamps,
    datasets: [
      {
        label: 'Signal Strength (dBm)',
        data: waveformData.signalStrength,
        borderColor: '#00ff88',
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Jamming Intensity',
        data: waveformData.jammingIntensity,
        borderColor: '#ff3344',
        backgroundColor: 'rgba(255, 51, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const interferenceChartData = {
    labels: ['Jamming', 'Signal Loss', 'Noise Burst', 'Modulation Distortion'],
    datasets: [
      {
        label: 'Interference Events',
        data: [
          interferenceTypes.jamming,
          interferenceTypes.signalLoss,
          interferenceTypes.noiseBurst,
          interferenceTypes.modulationDistortion
        ],
        backgroundColor: ['#ff3344', '#ffaa33', '#ff66ff', '#3388ff']
      }
    ]
  };

  const pieChartData = {
    labels: ['Jamming', 'Signal Loss', 'Noise Burst', 'Modulation Distortion'],
    datasets: [
      {
        data: [
          interferenceTypes.jamming,
          interferenceTypes.signalLoss,
          interferenceTypes.noiseBurst,
          interferenceTypes.modulationDistortion
        ],
        backgroundColor: ['#ff3344', '#ffaa33', '#ff66ff', '#3388ff']
      }
    ]
  };

  // Channel status component (Receiver Bulbs/LEDs)
  const ChannelStatus = ({ channel, value }) => {
    const interferenceType = getInterferenceType(value);
    const isActive = value !== 0;
    
    // Bulb fails to glow when problem is active, glows when normal
    const bulbColor = isActive ? '#333333' : '#00ff88'; // OFF when problem, ON when normal
    const bulbShadow = isActive 
      ? '0 0 5px #333333' // dim when OFF
      : '0 0 20px #00ff88, 0 0 40px #00ff88'; // bright glow when ON
    
    return (
      <div style={styles.channelCard}>
        <div
          style={{
            ...styles.bulb,
            backgroundColor: bulbColor,
            boxShadow: bulbShadow,
            border: isActive ? '2px solid #ff3344' : '2px solid #00ff88'
          }}
        />
        <div style={styles.channelInfo}>
          <h3 style={styles.channelName}>{channel}</h3>
          {isActive && (
            <div style={{
              backgroundColor: 'rgba(255, 51, 68, 0.1)',
              padding: '8px',
              borderRadius: '4px',
              marginBottom: '8px',
              border: '1px solid #ff3344'
            }}>
              <div style={{ fontSize: '11px', color: '#ff3344', fontWeight: 'bold' }}>
                Received Value: {value}
              </div>
            </div>
          )}
          <p style={{
            ...styles.channelStatus,
            color: isActive ? '#ff3344' : '#00ff88',
            fontWeight: 'bold',
            fontSize: '15px'
          }}>
            {isActive ? `❌ ${interferenceType}` : '✅ Normal'}
          </p>
          <p style={{ fontSize: '12px', color: '#888', margin: '5px 0 0 0' }}>
            {isActive ? 'Bulb: OFF (Problem detected)' : 'Bulb: ON (Signal good)'}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
              transform: scale(1);
            }
            50% {
              opacity: 0.9;
              transform: scale(1.02);
            }
          }
        `}
      </style>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>RF Jammer Detection & AI Optimization System</h1>
          <div style={styles.statusBadge}>
            <span style={styles.statusText}>{currentStatus}</span>
          </div>
        </div>

      {/* Active Interference Alert Banner */}
      {activeProblems.length > 0 ? (
        <div style={{
          backgroundColor: '#ff3344',
          border: '3px solid #ff6b6b',
          borderRadius: '12px',
          padding: '20px',
          margin: '20px 0',
          boxShadow: '0 8px 24px rgba(255, 51, 68, 0.4)',
          animation: 'pulse 2s infinite'
        }}>
          <h2 style={{ 
            margin: '0 0 15px 0', 
            fontSize: '28px', 
            color: '#fff',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            🚨 ALERT: INTERFERENCE DETECTED 🚨
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {activeProblems.map((problem, idx) => (
              <div key={idx} style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 6px 16px rgba(0,0,0,0.3)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: '12px'
                }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#000' }}>
                    📡 Channel {problem.channel}
                  </div>
                  <div style={{
                    backgroundColor: '#ff3344',
                    color: '#fff',
                    padding: '5px 15px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    Value: {problem.value}
                  </div>
                </div>
                <div style={{
                  fontSize: '26px',
                  fontWeight: 'bold',
                  color: '#ff3344',
                  textAlign: 'center',
                  padding: '15px',
                  backgroundColor: 'rgba(255, 51, 68, 0.1)',
                  borderRadius: '8px',
                  border: '2px solid #ff3344'
                }}>
                  {problem.value === 1 && '🔴 1. JAMMING'}
                  {problem.value === 2 && '🟠 2. SIGNAL LOSS'}
                  {problem.value === 3 && '🟣 3. NOISE BURST'}
                  {problem.value === 4 && '🔵 4. MODULATION DISTORTION'}
                </div>
                <div style={{
                  marginTop: '10px',
                  fontSize: '14px',
                  color: '#666',
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}>
                  ⚠️ Problem Detected - AI Analyzing...
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '16px',
            color: '#fff',
            fontWeight: 'bold',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            padding: '12px',
            borderRadius: '8px'
          }}>
            🤖 AI Optimization System is working to resolve the interference...
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#2a2a3e',
          border: '2px solid #444',
          borderRadius: '8px',
          padding: '15px',
          margin: '20px 0',
          textAlign: 'center',
          color: '#888',
          fontSize: '16px'
        }}>
          ✅ No interference detected - All channels operating normally
        </div>
      )}

      {/* Transmitter Button Panel Simulation */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🎛️ RF Signal Generation Module (Transmitter Side)</h2>
        <div style={styles.transmitterPanel}>
          <div style={styles.transmitterInfo}>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
              <strong>Status:</strong> Simulates 4-button panel on transmitter
            </p>
            <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
              <strong>Frequency:</strong> 433MHz / 2.4GHz
            </p>
            <p style={{ margin: '0', fontSize: '14px' }}>
              <strong>Active Interference:</strong> {getInterferenceType(activeInterference)}
            </p>
          </div>
          
          <div style={styles.ledIndicatorPanel}>
            <div style={styles.ledRow}>
              <span style={styles.ledLabel}>Jamming:</span>
              <div style={{
                ...styles.ledIndicator,
                backgroundColor: activeInterference === 1 ? '#ff3344' : '#333',
                boxShadow: activeInterference === 1 ? '0 0 15px #ff3344' : 'none'
              }} />
            </div>
            <div style={styles.ledRow}>
              <span style={styles.ledLabel}>Signal Loss:</span>
              <div style={{
                ...styles.ledIndicator,
                backgroundColor: activeInterference === 2 ? '#ffaa33' : '#333',
                boxShadow: activeInterference === 2 ? '0 0 15px #ffaa33' : 'none'
              }} />
            </div>
            <div style={styles.ledRow}>
              <span style={styles.ledLabel}>Noise Burst:</span>
              <div style={{
                ...styles.ledIndicator,
                backgroundColor: activeInterference === 3 ? '#ff66ff' : '#333',
                boxShadow: activeInterference === 3 ? '0 0 15px #ff66ff' : 'none'
              }} />
            </div>
            <div style={styles.ledRow}>
              <span style={styles.ledLabel}>Modulation Distortion:</span>
              <div style={{
                ...styles.ledIndicator,
                backgroundColor: activeInterference === 4 ? '#3388ff' : '#333',
                boxShadow: activeInterference === 4 ? '0 0 15px #3388ff' : 'none'
              }} />
            </div>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '15px', fontStyle: 'italic' }}>
          💡 Each button press injects specific interference into transmitted signal. LED shows active type.
        </p>
      </div>

      {/* AI Optimization Control */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🤖 AI Optimization Control</h2>
        <div style={{
          backgroundColor: '#1a1a2e',
          border: '2px solid #16213e',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <p style={{ fontSize: '14px', color: '#aaa', marginBottom: '20px' }}>
            Manually trigger AI optimization to resolve all active problems and stabilize the system
          </p>
          <button
            onClick={toggleAIOptimization}
            style={{
              padding: '15px 40px',
              fontSize: '16px',
              fontWeight: 'bold',
              backgroundColor: noneValue === 1 ? '#ff6b6b' : '#00ff88',
              color: '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              boxShadow: noneValue === 1 ? '0 4px 15px rgba(255, 107, 107, 0.5)' : '0 4px 15px rgba(0, 255, 136, 0.5)',
              transition: 'all 0.3s ease',
              transform: 'scale(1)',
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            {noneValue === 1 ? '🔄 Reset System' : '🚀 Trigger AI Optimization'}
          </button>
          <div style={{ 
            marginTop: '15px', 
            padding: '10px',
            backgroundColor: noneValue === 1 ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            borderRadius: '4px',
            fontSize: '14px',
            color: noneValue === 1 ? '#00ff88' : '#888'
          }}>
            <strong>Status:</strong> {noneValue === 1 ? '✅ AI Optimization Active' : '⏸️ Normal Operation'}
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '15px', fontStyle: 'italic' }}>
          🎯 When activated (None = 1), AI applies optimizations to resolve interference problems automatically
        </p>
      </div>

      {/* Channel Change Indicator */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>� Channel Activity Monitor</h2>
        <div style={{
          backgroundColor: '#1a1a2e',
          border: '2px solid #16213e',
          borderRadius: '8px',
          padding: '20px',
          minHeight: '150px'
        }}>
          {channelChangeIndicator && (
            <div style={{
              backgroundColor: '#ffd60a',
              color: '#000',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px',
              animation: 'pulse 0.5s ease-in-out',
              fontWeight: 'bold',
              fontSize: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(255, 214, 10, 0.4)'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔄</div>
              <div>Channel {channelChangeIndicator.channel} Status Changed!</div>
              <div style={{ fontSize: '14px', marginTop: '8px', fontWeight: 'normal' }}>
                {channelChangeIndicator.status}
              </div>
            </div>
          )}
          
          <div style={{ fontSize: '14px', color: '#aaa' }}>
            {activeProblems.length > 0 ? (
              <div>
                <div style={{ color: '#ff6b6b', marginBottom: '12px', fontSize: '16px', fontWeight: 'bold' }}>
                  ⚠️ Active Issues: {activeProblems.length}
                </div>
                {activeProblems.map((p, idx) => (
                  <div key={idx} style={{ 
                    marginLeft: '15px', 
                    marginTop: '8px', 
                    color: '#ff6b6b',
                    padding: '8px',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderLeft: '3px solid #ff6b6b',
                    borderRadius: '4px'
                  }}>
                    • Channel {p.channel}: {p.type}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                color: '#51cf66', 
                textAlign: 'center', 
                fontSize: '18px',
                padding: '20px',
                backgroundColor: 'rgba(81, 207, 102, 0.1)',
                borderRadius: '8px'
              }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>✓</div>
                <div>All channels operating normally</div>
              </div>
            )}
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '15px', fontStyle: 'italic' }}>
          � Real-time channel status changes and active problem tracking
        </p>
      </div>

      {/* AI Optimization Workflow */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>🤖 AI-Based Optimization & Problem Solving</h2>
        <div style={styles.aiWorkflow}>
          <div style={{
            ...styles.aiStep,
            backgroundColor: aiStatus === 'detecting' ? 'rgba(255, 170, 51, 0.2)' : 'rgba(255,255,255,0.05)',
            border: aiStatus === 'detecting' ? '2px solid #ffaa33' : '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={styles.aiStepNumber}>1</div>
            <div style={styles.aiStepContent}>
              <h4 style={styles.aiStepTitle}>Problem Detection</h4>
              <p style={styles.aiStepDesc}>Signal pattern analyzed</p>
            </div>
          </div>
          
          <div style={{
            ...styles.aiStep,
            backgroundColor: aiStatus === 'analyzing' ? 'rgba(51, 136, 255, 0.2)' : 'rgba(255,255,255,0.05)',
            border: aiStatus === 'analyzing' ? '2px solid #3388ff' : '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={styles.aiStepNumber}>2</div>
            <div style={styles.aiStepContent}>
              <h4 style={styles.aiStepTitle}>AI Classification</h4>
              <p style={styles.aiStepDesc}>Problem type identified</p>
            </div>
          </div>
          
          <div style={{
            ...styles.aiStep,
            backgroundColor: aiStatus === 'optimizing' ? 'rgba(255, 102, 255, 0.2)' : 'rgba(255,255,255,0.05)',
            border: aiStatus === 'optimizing' ? '2px solid #ff66ff' : '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={styles.aiStepNumber}>3</div>
            <div style={styles.aiStepContent}>
              <h4 style={styles.aiStepTitle}>Optimization</h4>
              <p style={styles.aiStepDesc}>{aiRecommendation || 'Standby...'}</p>
            </div>
          </div>
          
          <div style={{
            ...styles.aiStep,
            backgroundColor: aiStatus === 'restored' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255,255,255,0.05)',
            border: aiStatus === 'restored' ? '2px solid #00ff88' : '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={styles.aiStepNumber}>4</div>
            <div style={styles.aiStepContent}>
              <h4 style={styles.aiStepTitle}>Signal Restoration</h4>
              <p style={styles.aiStepDesc}>Channel restored</p>
            </div>
          </div>
        </div>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '15px', fontStyle: 'italic' }}>
          🔄 AI sends optimization commands via Firebase/Flask → Bulb turns back ON when resolved
        </p>
      </div>

      {/* Live Channel Status (Receiver Bulbs/LEDs) */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>� Channel Status Monitor</h2>
        <div style={styles.channelGrid}>
          <ChannelStatus channel="Channel 1" value={channelData.Channel1} />
          <ChannelStatus channel="Channel 2" value={channelData.Channel2} />
          <ChannelStatus channel="Channel 3" value={channelData.Channel3} />
          <ChannelStatus channel="Channel 4" value={channelData.Channel4} />
        </div>
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ fontSize: '14px', color: '#00ff88', marginBottom: '12px', fontWeight: 'bold' }}>
            📋 Interference Type Reference:
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '13px' }}>
            <div style={{ padding: '8px', backgroundColor: 'rgba(255, 51, 68, 0.1)', borderLeft: '3px solid #ff3344', borderRadius: '4px' }}>
              <strong style={{ color: '#ff3344' }}>Value 1:</strong> <span style={{ color: '#fff' }}>Jamming</span>
            </div>
            <div style={{ padding: '8px', backgroundColor: 'rgba(255, 170, 51, 0.1)', borderLeft: '3px solid #ffaa33', borderRadius: '4px' }}>
              <strong style={{ color: '#ffaa33' }}>Value 2:</strong> <span style={{ color: '#fff' }}>Signal Loss</span>
            </div>
            <div style={{ padding: '8px', backgroundColor: 'rgba(255, 102, 255, 0.1)', borderLeft: '3px solid #ff66ff', borderRadius: '4px' }}>
              <strong style={{ color: '#ff66ff' }}>Value 3:</strong> <span style={{ color: '#fff' }}>Noise Burst</span>
            </div>
            <div style={{ padding: '8px', backgroundColor: 'rgba(51, 136, 255, 0.1)', borderLeft: '3px solid #3388ff', borderRadius: '4px' }}>
              <strong style={{ color: '#3388ff' }}>Value 4:</strong> <span style={{ color: '#fff' }}>Modulation Distortion</span>
            </div>
          </div>
        </div>
      </div>

      {/* RF Metrics */}
      <div style={styles.section}>
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>RSSI</span>
            <span style={styles.metricValue}>{rssi} dBm</span>
          </div>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Fault Status</span>
            <span style={styles.metricValue}>{fault === 0 ? 'No Fault' : 'Fault Detected'}</span>
          </div>
          <div style={styles.metricCard}>
            <span style={styles.metricLabel}>Active Threats</span>
            <span style={styles.metricValue}>
              {Object.values(channelData).filter(v => v !== 0).length}
            </span>
          </div>
        </div>
      </div>

      {/* Waveform Graph */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Live Waveform Analysis</h2>
        <div style={styles.chartContainer}>
          <Line 
            data={waveformChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { 
                  display: true,
                  labels: { color: '#ffffff' }
                }
              },
              scales: {
                x: { 
                  ticks: { color: '#888' },
                  grid: { color: 'rgba(255,255,255,0.1)' }
                },
                y: { 
                  ticks: { color: '#888' },
                  grid: { color: 'rgba(255,255,255,0.1)' }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Interference Charts */}
      <div style={styles.chartsRow}>
        <div style={{ ...styles.section, flex: 1 }}>
          <h2 style={styles.sectionTitle}>Interference Type Distribution (Bar)</h2>
          <div style={styles.chartContainer}>
            <Bar
              data={interferenceChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  x: { 
                    ticks: { color: '#888' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                  },
                  y: { 
                    ticks: { color: '#888' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div style={{ ...styles.section, flex: 1 }}>
          <h2 style={styles.sectionTitle}>Interference Type Distribution (Pie)</h2>
          <div style={styles.chartContainer}>
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right',
                    labels: { color: '#ffffff' }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Simulation View */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>RF Simulation View</h2>
        <div style={styles.simulationContainer}>
          <canvas ref={canvasRef} style={styles.canvas} />
          <div style={styles.simulationLegend}>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendDot, backgroundColor: '#00ff88' }} />
              <span>Normal RF Signals</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{ ...styles.legendDot, backgroundColor: '#ff3344' }} />
              <span>Jamming Waves</span>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Log */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>📋 Problem Log (Transmitter → AI → Resolution)</h2>
        <div style={styles.logContainer}>
          {problemLog.length === 0 ? (
            <p style={styles.noProblems}>No problems detected - All channels operating normally</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Time</th>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Affected Channel</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {problemLog.map(problem => (
                  <tr key={problem.id} style={styles.tr}>
                    <td style={styles.td}>{problem.time}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.problemType,
                        backgroundColor: problem.type.includes('AI') 
                          ? 'rgba(51, 136, 255, 0.2)' 
                          : problem.type.includes('Restored')
                          ? 'rgba(0, 255, 136, 0.2)'
                          : 'rgba(255, 51, 68, 0.2)',
                        color: problem.type.includes('AI') 
                          ? '#3388ff' 
                          : problem.type.includes('Restored')
                          ? '#00ff88'
                          : '#ff3344'
                      }}>
                        {problem.type}
                      </span>
                    </td>
                    <td style={styles.td}>{problem.channel}</td>
                    <td style={styles.td}>{problem.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a1e',
    color: '#ffffff',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '10px'
  },
  title: {
    fontSize: '32px',
    margin: 0,
    background: 'linear-gradient(135deg, #00ff88 0%, #00aaff 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  statusBadge: {
    padding: '10px 20px',
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    borderRadius: '20px',
    border: '2px solid #00ff88'
  },
  statusText: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#00ff88'
  },
  section: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  sectionTitle: {
    fontSize: '20px',
    marginBottom: '20px',
    color: '#00ff88'
  },
  channelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  channelCard: {
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  bulb: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    marginRight: '20px',
    transition: 'all 0.3s ease'
  },
  channelInfo: {
    flex: 1
  },
  channelName: {
    fontSize: '18px',
    margin: '0 0 10px 0'
  },
  channelStatus: {
    fontSize: '14px',
    margin: 0,
    color: '#888'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  metricCard: {
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  metricLabel: {
    display: 'block',
    fontSize: '14px',
    color: '#888',
    marginBottom: '10px'
  },
  metricValue: {
    display: 'block',
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#00ff88'
  },
  chartContainer: {
    height: '300px',
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px'
  },
  chartsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  simulationContainer: {
    position: 'relative'
  },
  canvas: {
    width: '100%',
    height: '300px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  simulationLegend: {
    display: 'flex',
    gap: '30px',
    marginTop: '15px',
    justifyContent: 'center'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '14px'
  },
  legendDot: {
    width: '15px',
    height: '15px',
    borderRadius: '50%'
  },
  logContainer: {
    maxHeight: '400px',
    overflowY: 'auto',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    padding: '10px'
  },
  noProblems: {
    textAlign: 'center',
    padding: '40px',
    color: '#888'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    borderBottom: '2px solid rgba(255,255,255,0.1)',
    color: '#00ff88',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.05)'
  },
  td: {
    padding: '15px',
    fontSize: '14px'
  },
  problemType: {
    padding: '5px 10px',
    backgroundColor: 'rgba(255, 51, 68, 0.2)',
    borderRadius: '5px',
    color: '#ff3344',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  transmitterPanel: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    padding: '20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px'
  },
  transmitterInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    color: '#fff'
  },
  ledIndicatorPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: '20px',
    borderRadius: '10px',
    border: '2px solid rgba(255,255,255,0.1)'
  },
  ledRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  ledLabel: {
    fontSize: '14px',
    color: '#aaa',
    fontWeight: 'bold'
  },
  ledIndicator: {
    width: '25px',
    height: '25px',
    borderRadius: '50%',
    border: '2px solid #555',
    transition: 'all 0.3s ease'
  },
  aiWorkflow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    padding: '10px'
  },
  aiStep: {
    padding: '20px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'all 0.3s ease'
  },
  aiStepNumber: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 255, 136, 0.2)',
    border: '2px solid #00ff88',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#00ff88',
    flexShrink: 0
  },
  aiStepContent: {
    flex: 1
  },
  aiStepTitle: {
    margin: '0 0 5px 0',
    fontSize: '16px',
    color: '#fff'
  },
  aiStepDesc: {
    margin: 0,
    fontSize: '12px',
    color: '#aaa'
  }
};

export default RFJammer;
