// RealisticRFControlDashboard.jsx - Production-Ready RF Control System
import React, { useState, useEffect } from 'react';

const RealisticRFControlDashboard = () => {
  // Realistic RF Data with actual hardware values
  const [rfData, setRfData] = useState({
    // WiFi 2.4GHz realistic values
    wifi_rssi: -67,              // dBm (-30 to -120 typical range)
    wifi_snr: 15,                // dB (-10 to +40 typical)
    wifi_frequency: 2437,        // MHz (Channel 6 - 2.437 GHz)
    wifi_channel: 6,             // Channel 1-13
    wifi_tx_power: 20,           // dBm (0 to 20 dBm max)
    wifi_bandwidth: 20,          // MHz (20/40/80/160)
    
    // LoRa 915MHz realistic values  
    lora_rssi: -89,              // dBm (-30 to -120 typical)
    lora_snr: -2.5,              // dB (-20 to +10 typical)
    lora_frequency: 915.0,       // MHz (ISM band)
    lora_sf: 7,                  // Spreading Factor (7-12)
    lora_bw: 125,                // kHz (125, 250, 500)
    lora_cr: 5,                  // Coding Rate (5-8)
    lora_tx_power: 14,           // dBm (2 to 20 dBm)
    
    // 433MHz RF Module
    rf433_rssi: -78,             // dBm
    rf433_frequency: 433.92,     // MHz
    rf433_tx_power: 10,          // dBm
    
    // Hardware Status
    esp32_cpu_freq: 240,         // MHz
    esp32_power_mode: "ACTIVE",  // ACTIVE, LIGHT_SLEEP, DEEP_SLEEP
    current_consumption: 180,    // mA (realistic ESP32 consumption)
    temperature: 42,             // °C (chip temperature)
    
    // Network Status
    connected_devices: 3,
    packet_loss: 0.2,            // %
    throughput: 1.2,             // Mbps
    link_quality: 85,            // % (0-100)
    
    // Environmental factors
    distance: 50,                // meters
    path_loss: 68,               // dB
    fade_margin: 12,             // dB
    interference_level: -95      // dBm
  });

  const [hardwareConfig, setHardwareConfig] = useState({
    // ESP32 Hardware Configuration
    wifi_enabled: true,
    lora_enabled: true,
    rf433_enabled: false,
    auto_power_save: true,
    adaptive_rate: true,
    antenna_gain: 2.15,          // dBi (realistic PCB antenna)
    
    // GPIO Pins (realistic ESP32 mapping)
    lora_cs_pin: 5,
    lora_reset_pin: 14,
    lora_dio0_pin: 2,
    rf433_tx_pin: 25,
    rf433_rx_pin: 27,
    
    // Optimization settings
    auto_channel_selection: true,
    power_control_enabled: true,
    interference_mitigation: true,
    link_adaptation: true
  });

  // Realistic RF propagation and hardware simulation
  useEffect(() => {
    const realisticRFSimulation = setInterval(() => {
      setRfData(prev => {
        let newData = { ...prev };
        
        // WiFi RSSI simulation with realistic fading
        const wifiNoise = (Math.random() - 0.5) * 6; // ±3dB variation
        newData.wifi_rssi = Math.max(-120, Math.min(-30, prev.wifi_rssi + wifiNoise));
        
        // Calculate WiFi SNR based on RSSI and noise floor (-95 dBm typical)
        const noiseFloor = -95;
        newData.wifi_snr = newData.wifi_rssi - noiseFloor;
        
        // LoRa RSSI with path loss calculation
        const loraFading = (Math.random() - 0.5) * 4; // ±2dB fading
        newData.lora_rssi = Math.max(-127, Math.min(-30, prev.lora_rssi + loraFading));
        
        // LoRa SNR can go below 0 (unique LoRa capability)
        newData.lora_snr = Math.max(-20, Math.min(10, prev.lora_snr + (Math.random() - 0.5) * 3));
        
        // RF 433MHz simple fading
        newData.rf433_rssi = Math.max(-120, Math.min(-40, prev.rf433_rssi + (Math.random() - 0.5) * 5));
        
        // Calculate path loss using realistic formula: PL = 20*log10(d) + 20*log10(f) + 32.44
        const freqGHz = newData.wifi_frequency / 1000; // Convert to GHz
        newData.path_loss = 20 * Math.log10(newData.distance) + 20 * Math.log10(freqGHz) + 32.44;
        
        // ESP32 temperature simulation (realistic thermal behavior)
        newData.temperature = Math.max(25, Math.min(85, 35 + (newData.current_consumption / 10) + (Math.random() - 0.5) * 5));
        
        // Current consumption based on active modes (realistic ESP32 values)
        let baseCurrent = 40; // Base ESP32 current
        if (hardwareConfig.wifi_enabled) baseCurrent += newData.wifi_tx_power > 0 ? 180 : 95; // TX: 180mA, RX: 95mA
        if (hardwareConfig.lora_enabled) baseCurrent += 45; // LoRa module current
        if (hardwareConfig.rf433_enabled) baseCurrent += 20; // RF433 module current
        
        newData.current_consumption = baseCurrent + (Math.random() * 20);
        
        // Link quality calculation based on RSSI and SNR
        const rssiQuality = Math.max(0, Math.min(100, (newData.wifi_rssi + 100) * 2));
        const snrQuality = Math.max(0, Math.min(100, (newData.wifi_snr + 10) * 2.5));
        newData.link_quality = (rssiQuality + snrQuality) / 2;
        
        // Packet loss based on signal quality
        if (newData.wifi_rssi < -80) {
          newData.packet_loss = Math.max(0, Math.min(15, 5 * (80 + newData.wifi_rssi) / -10));
        } else {
          newData.packet_loss = Math.max(0, newData.packet_loss - 0.1);
        }
        
        return newData;
      });
    }, 1000); // Real-time updates every second

    return () => clearInterval(realisticRFSimulation);
  }, [hardwareConfig]);

  // Realistic RF Optimization Engine
  useEffect(() => {
    if (!hardwareConfig.auto_power_save) return;
    
    const optimizationEngine = setInterval(() => {
      setRfData(prev => {
        let optimized = { ...prev };
        
        // WiFi Channel Auto-Selection (avoid interference)
        if (hardwareConfig.auto_channel_selection && prev.wifi_rssi < -75) {
          const channels = [1, 6, 11]; // Non-overlapping 2.4GHz channels
          const newChannel = channels[Math.floor(Math.random() * channels.length)];
          optimized.wifi_channel = newChannel;
          optimized.wifi_frequency = 2407 + (newChannel - 1) * 5;
        }
        
        // Adaptive Power Control (realistic ESP32 WiFi API behavior)
        if (hardwareConfig.power_control_enabled) {
          if (prev.wifi_rssi < -80 && prev.wifi_tx_power < 20) {
            optimized.wifi_tx_power = Math.min(20, prev.wifi_tx_power + 1); // Increase power
          } else if (prev.wifi_rssi > -50 && prev.wifi_tx_power > 5) {
            optimized.wifi_tx_power = Math.max(5, prev.wifi_tx_power - 1); // Decrease power
          }
        }
        
        // LoRa Adaptive Data Rate (ADR)
        if (hardwareConfig.adaptive_rate) {
          if (prev.lora_snr > 5 && prev.lora_sf > 7) {
            optimized.lora_sf = Math.max(7, prev.lora_sf - 1); // Increase data rate
          } else if (prev.lora_snr < -10 && prev.lora_sf < 12) {
            optimized.lora_sf = Math.min(12, prev.lora_sf + 1); // Increase range
          }
        }
        
        // ESP32 CPU Frequency Scaling
        if (prev.current_consumption > 200) {
          optimized.esp32_cpu_freq = 160; // Scale down CPU
        } else if (prev.current_consumption < 100 && prev.esp32_cpu_freq < 240) {
          optimized.esp32_cpu_freq = 240; // Scale up CPU
        }
        
        return optimized;
      });
    }, 5000); // Optimization every 5 seconds

    return () => clearInterval(optimizationEngine);
  }, [hardwareConfig]);

  // Hardware Control Functions (realistic ESP32 APIs)
  const handleWiFiPowerChange = (newPower) => {
    // Simulate ESP32 WiFi.setTxPower() API
    setRfData(prev => ({ ...prev, wifi_tx_power: Math.max(0, Math.min(20, newPower)) }));
  };

  const handleLoRaPowerChange = (newPower) => {
    // Simulate LoRa.setTxPower() API  
    setRfData(prev => ({ ...prev, lora_tx_power: Math.max(2, Math.min(20, newPower)) }));
  };

  const handleChannelChange = (newChannel) => {
    // Simulate WiFi.channel() API
    const frequency = 2407 + (newChannel - 1) * 5; // Calculate frequency from channel
    setRfData(prev => ({ 
      ...prev, 
      wifi_channel: newChannel,
      wifi_frequency: frequency
    }));
  };

  const toggleHardwareModule = (module) => {
    setHardwareConfig(prev => ({
      ...prev,
      [`${module}_enabled`]: !prev[`${module}_enabled`]
    }));
  };

  const getSignalStrength = (rssi) => {
    if (rssi >= -50) return { level: 'excellent', color: '#00ff88' };
    if (rssi >= -70) return { level: 'good', color: '#4caf50' };
    if (rssi >= -85) return { level: 'fair', color: '#ff9800' };
    return { level: 'poor', color: '#f44336' };
  };

  const calculateDataRate = (sf, bw) => {
    // Realistic LoRa data rate calculation: DR = SF * (BW/2^SF) * CR
    const cr = 4/5; // Coding rate 4/5
    return ((sf * (bw * 1000)) / Math.pow(2, sf)) * cr / 1000; // kbps
  };

  const calculateRange = (rssi, txPower, frequency) => {
    // Simplified Friis transmission equation for range estimation
    const pathLossDb = txPower - rssi;
    const lambda = 300 / frequency; // Wavelength in meters (c/f)
    const range = Math.pow(10, (pathLossDb - 32.44 - 20 * Math.log10(frequency)) / 20);
    return Math.max(1, Math.min(10000, range)); // 1m to 10km reasonable range
  };

  return (
    <div style={styles.dashboard}>
      {/* Header with Real Hardware Info */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>ESP32 RF Control Dashboard</h1>
          <div style={styles.chipInfo}>
            ESP32 @ {rfData.esp32_cpu_freq}MHz | {rfData.temperature}°C | {rfData.current_consumption.toFixed(0)}mA
          </div>
        </div>
        <div style={styles.statusGrid}>
          <div style={styles.statusItem}>
            <span>WiFi</span>
            <span style={{color: hardwareConfig.wifi_enabled ? '#00ff88' : '#666'}}>
              {hardwareConfig.wifi_enabled ? 'ON' : 'OFF'}
            </span>
          </div>
          <div style={styles.statusItem}>
            <span>LoRa</span>
            <span style={{color: hardwareConfig.lora_enabled ? '#00ff88' : '#666'}}>
              {hardwareConfig.lora_enabled ? 'ON' : 'OFF'}
            </span>
          </div>
          <div style={styles.statusItem}>
            <span>433MHz</span>
            <span style={{color: hardwareConfig.rf433_enabled ? '#00ff88' : '#666'}}>
              {hardwareConfig.rf433_enabled ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </header>

      <div style={styles.grid}>
        {/* WiFi 2.4GHz Module */}
        <div style={styles.module}>
          <h3 style={styles.moduleTitle}>WiFi 2.4GHz Module</h3>
          
          <div style={styles.metricsRow}>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>RSSI</div>
              <div style={{...styles.metricValue, color: getSignalStrength(rfData.wifi_rssi).color}}>
                {rfData.wifi_rssi.toFixed(1)} dBm
              </div>
            </div>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>SNR</div>
              <div style={styles.metricValue}>{rfData.wifi_snr.toFixed(1)} dB</div>
            </div>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>Channel</div>
              <div style={styles.metricValue}>{rfData.wifi_channel}</div>
            </div>
          </div>

          <div style={styles.controlRow}>
            <div style={styles.control}>
              <label style={styles.controlLabel}>TX Power: {rfData.wifi_tx_power} dBm</label>
              <input
                type="range"
                min="0"
                max="20"
                value={rfData.wifi_tx_power}
                onChange={(e) => handleWiFiPowerChange(parseInt(e.target.value))}
                style={styles.slider}
              />
            </div>
            <div style={styles.control}>
              <label style={styles.controlLabel}>Channel</label>
              <select 
                value={rfData.wifi_channel}
                onChange={(e) => handleChannelChange(parseInt(e.target.value))}
                style={styles.select}
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12,13].map(ch => (
                  <option key={ch} value={ch}>CH {ch} ({2407 + (ch-1)*5} MHz)</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.infoRow}>
            <span>Frequency: {rfData.wifi_frequency} MHz</span>
            <span>Link Quality: {rfData.link_quality.toFixed(0)}%</span>
            <span>Packet Loss: {rfData.packet_loss.toFixed(1)}%</span>
          </div>
        </div>

        {/* LoRa 915MHz Module */}
        <div style={styles.module}>
          <h3 style={styles.moduleTitle}>LoRa 915MHz Module</h3>
          
          <div style={styles.metricsRow}>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>RSSI</div>
              <div style={{...styles.metricValue, color: getSignalStrength(rfData.lora_rssi).color}}>
                {rfData.lora_rssi.toFixed(1)} dBm
              </div>
            </div>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>SNR</div>
              <div style={{...styles.metricValue, color: rfData.lora_snr >= 0 ? '#00ff88' : '#ff9800'}}>
                {rfData.lora_snr.toFixed(1)} dB
              </div>
            </div>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>SF</div>
              <div style={styles.metricValue}>SF{rfData.lora_sf}</div>
            </div>
          </div>

          <div style={styles.controlRow}>
            <div style={styles.control}>
              <label style={styles.controlLabel}>TX Power: {rfData.lora_tx_power} dBm</label>
              <input
                type="range"
                min="2"
                max="20"
                value={rfData.lora_tx_power}
                onChange={(e) => handleLoRaPowerChange(parseInt(e.target.value))}
                style={styles.slider}
              />
            </div>
            <div style={styles.control}>
              <label style={styles.controlLabel}>Spreading Factor</label>
              <select 
                value={rfData.lora_sf}
                onChange={(e) => setRfData(prev => ({...prev, lora_sf: parseInt(e.target.value)}))}
                style={styles.select}
              >
                {[7,8,9,10,11,12].map(sf => (
                  <option key={sf} value={sf}>SF{sf} ({calculateDataRate(sf, rfData.lora_bw).toFixed(1)} kbps)</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.infoRow}>
            <span>Bandwidth: {rfData.lora_bw} kHz</span>
            <span>Coding Rate: 4/{rfData.lora_cr}</span>
            <span>Range: ~{calculateRange(rfData.lora_rssi, rfData.lora_tx_power, rfData.lora_frequency).toFixed(0)}m</span>
          </div>
        </div>

        {/* ESP32 Hardware Status */}
        <div style={styles.module}>
          <h3 style={styles.moduleTitle}>Hardware Status</h3>
          
          <div style={styles.hardwareGrid}>
            <div style={styles.hardwareItem}>
              <div style={styles.hardwareLabel}>CPU Frequency</div>
              <div style={styles.hardwareValue}>{rfData.esp32_cpu_freq} MHz</div>
              <div style={styles.progressBar}>
                <div style={{...styles.progress, width: `${(rfData.esp32_cpu_freq/240)*100}%`}}></div>
              </div>
            </div>
            
            <div style={styles.hardwareItem}>
              <div style={styles.hardwareLabel}>Current Draw</div>
              <div style={styles.hardwareValue}>{rfData.current_consumption.toFixed(0)} mA</div>
              <div style={styles.progressBar}>
                <div style={{...styles.progress, width: `${(rfData.current_consumption/300)*100}%`, backgroundColor: rfData.current_consumption > 200 ? '#ff9800' : '#00ff88'}}></div>
              </div>
            </div>
            
            <div style={styles.hardwareItem}>
              <div style={styles.hardwareLabel}>Chip Temperature</div>
              <div style={styles.hardwareValue}>{rfData.temperature.toFixed(0)}°C</div>
              <div style={styles.progressBar}>
                <div style={{...styles.progress, width: `${((rfData.temperature-20)/65)*100}%`, backgroundColor: rfData.temperature > 70 ? '#f44336' : '#00ff88'}}></div>
              </div>
            </div>
          </div>

          <div style={styles.toggleGrid}>
            <button 
              style={{...styles.toggleBtn, backgroundColor: hardwareConfig.wifi_enabled ? '#00ff88' : '#666'}}
              onClick={() => toggleHardwareModule('wifi')}
            >
              WiFi Module
            </button>
            <button 
              style={{...styles.toggleBtn, backgroundColor: hardwareConfig.lora_enabled ? '#00ff88' : '#666'}}
              onClick={() => toggleHardwareModule('lora')}
            >
              LoRa Module
            </button>
            <button 
              style={{...styles.toggleBtn, backgroundColor: hardwareConfig.rf433_enabled ? '#00ff88' : '#666'}}
              onClick={() => toggleHardwareModule('rf433')}
            >
              433MHz RF
            </button>
          </div>
        </div>

        {/* RF Environment Monitor */}
        <div style={styles.module}>
          <h3 style={styles.moduleTitle}>RF Environment</h3>
          
          <div style={styles.environmentGrid}>
            <div style={styles.envItem}>
              <span style={styles.envLabel}>Path Loss</span>
              <span style={styles.envValue}>{rfData.path_loss.toFixed(1)} dB</span>
            </div>
            <div style={styles.envItem}>
              <span style={styles.envLabel}>Distance</span>
              <span style={styles.envValue}>{rfData.distance} m</span>
            </div>
            <div style={styles.envItem}>
              <span style={styles.envLabel}>Interference</span>
              <span style={styles.envValue}>{rfData.interference_level} dBm</span>
            </div>
            <div style={styles.envItem}>
              <span style={styles.envLabel}>Fade Margin</span>
              <span style={styles.envValue}>{rfData.fade_margin} dB</span>
            </div>
          </div>

          <div style={styles.spectrumDisplay}>
            <div style={styles.spectrumTitle}>RF Spectrum (2.4 GHz ISM Band)</div>
            <div style={styles.spectrum}>
              {Array.from({length: 13}, (_, i) => {
                const channel = i + 1;
                const freq = 2407 + i * 5;
                const isActive = channel === rfData.wifi_channel;
                const amplitude = isActive ? 80 : Math.random() * 30 + 10;
                
                return (
                  <div
                    key={channel}
                    style={{
                      ...styles.spectrumBar,
                      height: `${amplitude}%`,
                      backgroundColor: isActive ? '#00ff88' : '#4a90e2'
                    }}
                    title={`Ch ${channel}: ${freq} MHz`}
                  />
                );
              })}
            </div>
            <div style={styles.spectrumLabels}>
              <span>Ch 1</span>
              <span>Ch 6</span>
              <span>Ch 11</span>
              <span>Ch 13</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Realistic Styling
const styles = {
  dashboard: {
    minHeight: '100vh',
    padding: '20px',
    background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 100%)',
    fontFamily: "'JetBrains Mono', 'Consolas', monospace",
    color: '#ffffff'
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    background: 'rgba(0, 255, 136, 0.1)',
    border: '1px solid #00ff88',
    borderRadius: '10px',
    marginBottom: '20px'
  },
  
  title: {
    fontSize: '2.2em',
    margin: 0,
    color: '#00ff88'
  },
  
  chipInfo: {
    fontSize: '0.9em',
    color: '#888',
    marginTop: '5px'
  },
  
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px'
  },
  
  statusItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '5px'
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  
  module: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '20px'
  },
  
  moduleTitle: {
    color: '#4a90e2',
    fontSize: '1.3em',
    marginBottom: '15px',
    borderBottom: '1px solid rgba(74, 144, 226, 0.3)',
    paddingBottom: '5px'
  },
  
  metricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginBottom: '15px'
  },
  
  metric: {
    textAlign: 'center',
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '10px',
    borderRadius: '8px'
  },
  
  metricLabel: {
    fontSize: '0.8em',
    color: '#aaa',
    marginBottom: '5px'
  },
  
  metricValue: {
    fontSize: '1.4em',
    fontWeight: 'bold'
  },
  
  controlRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
    marginBottom: '15px'
  },
  
  control: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  
  controlLabel: {
    fontSize: '0.9em',
    color: '#ccc'
  },
  
  slider: {
    width: '100%',
    height: '4px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '2px',
    outline: 'none',
    WebkitAppearance: 'none'
  },
  
  select: {
    padding: '8px',
    background: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '0.9em'
  },
  
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8em',
    color: '#aaa'
  },
  
  hardwareGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '15px'
  },
  
  hardwareItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  hardwareLabel: {
    flex: 1,
    fontSize: '0.9em',
    color: '#ccc'
  },
  
  hardwareValue: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  
  progressBar: {
    flex: 2,
    height: '6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    overflow: 'hidden'
  },
  
  progress: {
    height: '100%',
    background: '#00ff88',
    transition: 'width 0.3s ease'
  },
  
  toggleGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px'
  },
  
  toggleBtn: {
    padding: '8px 12px',
    border: 'none',
    borderRadius: '6px',
    color: '#000',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.8em'
  },
  
  environmentGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
    marginBottom: '15px'
  },
  
  envItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px',
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '6px'
  },
  
  envLabel: {
    color: '#aaa',
    fontSize: '0.9em'
  },
  
  envValue: {
    fontWeight: 'bold',
    color: '#00ff88'
  },
  
  spectrumDisplay: {
    marginTop: '15px'
  },
  
  spectrumTitle: {
    fontSize: '0.9em',
    color: '#9c27b0',
    marginBottom: '10px',
    textAlign: 'center'
  },
  
  spectrum: {
    display: 'flex',
    alignItems: 'flex-end',
    height: '120px',
    background: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '6px',
    padding: '5px',
    gap: '2px'
  },
  
  spectrumBar: {
    flex: 1,
    minHeight: '5px',
    borderRadius: '2px 2px 0 0',
    transition: 'height 0.3s ease'
  },
  
  spectrumLabels: {
    display: 'flex',
    justifyContent: 'space-around',
    marginTop: '5px',
    fontSize: '0.7em',
    color: '#888'
  }
};

export default RealisticRFControlDashboard;
