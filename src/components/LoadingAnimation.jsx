import { useEffect, useState } from 'react';
import './LoadingAnimation.css';

const LoadingAnimation = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('analyzing');

  const stages = [
    { key: 'analyzing', label: 'Analyzing 2D Layout', duration: 1000 },
    { key: 'processing', label: 'Processing Image Data', duration: 1200 },
    { key: 'generating', label: 'Generating 3D Model', duration: 1500 },
    { key: 'rendering', label: 'Rendering Scene', duration: 1000 },
    { key: 'finalizing', label: 'Finalizing Details', duration: 800 }
  ];

  useEffect(() => {
    let currentStage = 0;
    let currentProgress = 0;
    const totalDuration = stages.reduce((sum, stage) => sum + stage.duration, 0);
    
    const interval = setInterval(() => {
      currentProgress += 2;
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 500);
        return;
      }

      setProgress(currentProgress);

      // Update stage based on progress
      let accumulatedDuration = 0;
      for (let i = 0; i < stages.length; i++) {
        accumulatedDuration += (stages[i].duration / totalDuration) * 100;
        if (currentProgress < accumulatedDuration) {
          setStage(stages[i].key);
          break;
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  const currentStageData = stages.find(s => s.key === stage);

  return (
    <div className="loading-animation-overlay">
      <div className="loading-animation-container">
        <div className="animation-content">
          {/* 2D to 3D Transition Animation */}
          <div className="transformation-visual">
            <div className={`shape-2d ${stage !== 'analyzing' ? 'fade-out' : ''}`}>
              <div className="grid-lines">
                {[...Array(5)].map((_, i) => (
                  <div key={`h-${i}`} className="grid-line horizontal" style={{ top: `${i * 25}%` }} />
                ))}
                {[...Array(5)].map((_, i) => (
                  <div key={`v-${i}`} className="grid-line vertical" style={{ left: `${i * 25}%` }} />
                ))}
              </div>
            </div>

            <div className={`shape-3d ${stage === 'generating' || stage === 'rendering' || stage === 'finalizing' ? 'active' : ''}`}>
              <div className="cube">
                <div className="cube-face front"></div>
                <div className="cube-face back"></div>
                <div className="cube-face right"></div>
                <div className="cube-face left"></div>
                <div className="cube-face top"></div>
                <div className="cube-face bottom"></div>
              </div>
            </div>

            {/* Particles effect */}
            <div className="particles">
              {[...Array(20)].map((_, i) => (
                <div 
                  key={i} 
                  className="particle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: `${2 + Math.random() * 2}s`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Progress Info */}
          <div className="progress-info">
            <h2>Converting 2D to 3D</h2>
            <p className="stage-label">{currentStageData?.label}</p>
            
            {/* Progress Bar */}
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                >
                  <div className="progress-shine"></div>
                </div>
              </div>
              <span className="progress-percentage">{Math.round(progress)}%</span>
            </div>

            {/* Stage Indicators */}
            <div className="stage-indicators">
              {stages.map((s, index) => (
                <div 
                  key={s.key} 
                  className={`stage-indicator ${stage === s.key ? 'active' : ''} ${
                    stages.findIndex(st => st.key === stage) > index ? 'completed' : ''
                  }`}
                  title={s.label}
                >
                  <div className="indicator-dot"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
