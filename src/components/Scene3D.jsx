import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import './Scene3D.css';

// Room component
function Room({ template }) {
  const roomDimensions = { width: 80, height: 30, depth: 80 };
  const wallMaterialProps = {
    color: '#ffffff',
    roughness: 0.75,
    metalness: 0.05,
    envMapIntensity: 0.2,
    side: THREE.DoubleSide
  };

  return (
    <group>
      {/* Room shell */}
      <mesh position={[0, roomDimensions.height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[roomDimensions.width, roomDimensions.height, roomDimensions.depth]} />
        <meshStandardMaterial {...wallMaterialProps} />
      </mesh>

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.95} metalness={0} />
      </mesh>
    </group>
  );
}

// Furniture placeholder components
function Chair({ position, model, onClick, isSelected }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (isSelected && meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + position[1];
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      castShadow
    >
      <boxGeometry args={[0.8, 1.2, 0.8]} />
      <meshStandardMaterial 
        color={isSelected ? "#4299e1" : "#8B4513"} 
        emissive={isSelected ? "#2b6cb0" : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

function Sofa({ position, model, onClick, isSelected }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (isSelected && meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + position[1];
    }
  });

  return (
    <group ref={meshRef} position={position} onClick={onClick}>
      {/* Sofa base */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2.5, 0.8, 1]} />
        <meshStandardMaterial 
          color={isSelected ? "#4299e1" : "#4A5568"} 
          emissive={isSelected ? "#2b6cb0" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      {/* Sofa back */}
      <mesh position={[0, 1, -0.4]} castShadow>
        <boxGeometry args={[2.5, 1, 0.2]} />
        <meshStandardMaterial 
          color={isSelected ? "#4299e1" : "#4A5568"}
          emissive={isSelected ? "#2b6cb0" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
    </group>
  );
}

function Table({ position, model, onClick, isSelected }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (isSelected && meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 + position[1];
    }
  });

  return (
    <group ref={meshRef} position={position} onClick={onClick}>
      {/* Table top */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[2, 0.1, 1.2]} />
        <meshStandardMaterial 
          color={isSelected ? "#4299e1" : "#8B4513"}
          emissive={isSelected ? "#2b6cb0" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      {/* Table legs */}
      {[[-0.8, -0.8], [0.8, -0.8], [-0.8, 0.8], [0.8, 0.8]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.4, pos[1] * 0.5]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial 
            color={isSelected ? "#4299e1" : "#654321"}
            emissive={isSelected ? "#2b6cb0" : "#000000"}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

function Light({ position, model, onClick, isSelected }) {
  return (
    <group position={position} onClick={onClick}>
      <pointLight intensity={isSelected ? 1.5 : 1} distance={10} color="#fff5e6" />
      <mesh castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial 
          color={isSelected ? "#FFD700" : "#FFA500"}
          emissive="#FFA500"
          emissiveIntensity={isSelected ? 1 : 0.5}
        />
      </mesh>
    </group>
  );
}

function Rug({ position, model, onClick, isSelected }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (isSelected && meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 + position[1];
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={onClick}
      receiveShadow
    >
      <planeGeometry args={[3, 2]} />
      <meshStandardMaterial 
        color={isSelected ? "#4299e1" : "#8B0000"}
        emissive={isSelected ? "#2b6cb0" : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

// Scene content component
function SceneContent({ objects, onObjectClick, selectedObject }) {
  const renderObject = (key, obj) => {
    const commonProps = {
      position: obj.position,
      model: obj.model,
      onClick: (e) => {
        e.stopPropagation();
        onObjectClick(key);
      },
      isSelected: selectedObject === key
    };

    const category = obj.model.split('_')[0];
    
    switch (category) {
      case 'chair':
        return <Chair key={key} {...commonProps} />;
      case 'sofa':
        return <Sofa key={key} {...commonProps} />;
      case 'table':
      case 'desk':
      case 'nightstand':
      case 'dining':
        return <Table key={key} {...commonProps} />;
      case 'light':
        return <Light key={key} {...commonProps} />;
      case 'rug':
        return <Rug key={key} {...commonProps} />;
      default:
        return <Chair key={key} {...commonProps} />;
    }
  };

  return (
    <>
      <Room />
      {objects && Object.entries(objects).map(([key, obj]) => renderObject(key, obj))}
    </>
  );
}

const Scene3D = ({ template, onObjectSelect, selectedObject, objects }) => {
  const [cameraPosition, setCameraPosition] = useState([8, 8, 8]);
  const [isRotating, setIsRotating] = useState(false);

  const handleObjectClick = (objectKey) => {
    onObjectSelect(objectKey);
  };

  const resetCamera = () => {
    setCameraPosition([8, 8, 8]);
  };

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  return (
    <div className="scene3d-container">
      <div className="scene3d-header">
        <h2>3D View: {template?.name || 'Room'}</h2>
        <div className="scene3d-controls">
          <button onClick={resetCamera} className="control-btn" title="Reset Camera">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button 
            onClick={toggleRotation} 
            className={`control-btn ${isRotating ? 'active' : ''}`}
            title="Toggle Auto-Rotate"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>

      <div className="canvas-wrapper">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={cameraPosition} fov={50} />
          
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <directionalLight position={[-10, 10, -5]} intensity={0.3} />

          {/* Scene Content */}
          <SceneContent 
            objects={objects || template?.objects}
            onObjectClick={handleObjectClick}
            selectedObject={selectedObject}
          />

          {/* Contact Shadows */}
          <ContactShadows 
            position={[0, 0, 0]} 
            opacity={0.5} 
            scale={20} 
            blur={2} 
            far={10} 
          />

          {/* Grid Helper */}
          <Grid 
            args={[20, 20]} 
            cellSize={1} 
            cellThickness={0.5} 
            cellColor="#6f6f6f"
            sectionSize={5}
            sectionThickness={1}
            sectionColor="#9d4b4b"
            fadeDistance={25}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={false}
            position={[0, -0.01, 0]}
          />

          {/* Controls */}
          <OrbitControls 
            enableDamping
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={30}
            maxPolarAngle={Math.PI / 2}
            autoRotate={isRotating}
            autoRotateSpeed={1}
          />

          {/* Environment */}
          <Environment preset="apartment" />
        </Canvas>
      </div>

      <div className="scene3d-info">
        <p className="info-text">
          {selectedObject 
            ? `Selected: ${selectedObject.charAt(0).toUpperCase() + selectedObject.slice(1)}` 
            : 'Click on objects to select them'}
        </p>
      </div>
    </div>
  );
};

export default Scene3D;
