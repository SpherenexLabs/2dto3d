import { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, ContactShadows } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import './Scene3DEnhanced.css';
import {
  Wall, Door, Window, Floor, Ceiling,
  ModernSofa, DiningTable, ModernChair, Bed, CeilingLight, AreaRug
} from './RealisticFurniture';

// GLB Model Loader Component with placeholder tags (currently disabled - using fallback geometry)
function GLBModel({ modelPath, position, rotation, scale, onClick, isSelected, objectId }) {
  // Note: GLB loading is disabled until actual model files are added
  // This function is kept for future implementation
  return null;
}

// Placeholder furniture components (fallback when GLB not available)
function Chair({ position, model, onClick, onPointerDown, onPointerMove, onPointerUp, isSelected }) {
  const meshRef = useRef();
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (meshRef.current && !hasAnimated) {
      // Set initial scale to 1 immediately to ensure visibility
      meshRef.current.scale.set(1, 1, 1);
      
      // Sequential animation
      gsap.from(meshRef.current.position, {
        y: position[1] + 3,
        duration: 0.8,
        ease: 'bounce.out',
        delay: 0.2
      });
      gsap.from(meshRef.current.scale, {
        x: 0, y: 0, z: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 0.2,
        onComplete: () => setHasAnimated(true)
      });
    }
  }, [position, hasAnimated]);
  
  useFrame((state) => {
    if (isSelected && meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerMissed={() => {}}
      castShadow
    >
      <boxGeometry args={[1.5, 1.8, 1.5]} />
      <meshStandardMaterial 
        color={isSelected ? "#4299e1" : "#D2691E"} 
        emissive={isSelected ? "#2b6cb0" : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}

function Sofa({ position, model, onClick, onPointerDown, onPointerMove, onPointerUp, isSelected }) {
  const groupRef = useRef();
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (groupRef.current && !hasAnimated) {
      // Set initial scale to 1 immediately to ensure visibility
      groupRef.current.scale.set(1, 1, 1);
      
      gsap.from(groupRef.current.position, {
        y: position[1] + 3,
        duration: 0.8,
        ease: 'bounce.out',
        delay: 0.4
      });
      gsap.from(groupRef.current.scale, {
        x: 0, y: 0, z: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 0.4,
        onComplete: () => setHasAnimated(true)
      });
    }
  }, [position, hasAnimated]);
  
  useFrame((state) => {
    if (isSelected && groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      {/* Sofa base */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[4.0, 1.0, 2.0]} />
        <meshStandardMaterial 
          color={isSelected ? "#4299e1" : "#708090"} 
          emissive={isSelected ? "#2b6cb0" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      {/* Sofa back */}
      <mesh position={[0, 1.4, -0.85]} castShadow>
        <boxGeometry args={[4.0, 1.6, 0.4]} />
        <meshStandardMaterial 
          color={isSelected ? "#4299e1" : "#708090"}
          emissive={isSelected ? "#2b6cb0" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function Table({ position, model, onClick, onPointerDown, onPointerMove, onPointerUp, isSelected }) {
  const groupRef = useRef();
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (groupRef.current && !hasAnimated) {
      // Set initial scale to 1 immediately to ensure visibility
      groupRef.current.scale.set(1, 1, 1);
      
      gsap.from(groupRef.current.position, {
        y: position[1] + 3,
        duration: 0.8,
        ease: 'bounce.out',
        delay: 0.6
      });
      gsap.from(groupRef.current.scale, {
        x: 0, y: 0, z: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 0.6,
        onComplete: () => setHasAnimated(true)
      });
    }
  }, [position, hasAnimated]);
  
  useFrame((state) => {
    if (isSelected && groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position} onClick={onClick} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      {/* Table top */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[2.5, 0.15, 1.8]} />
        <meshStandardMaterial 
          color={isSelected ? "#cd853f" : "#deb887"} 
          emissive={isSelected ? "#b8860b" : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      {/* Table legs */}
      {[[-0.6, -0.4], [0.6, -0.4], [-0.6, 0.4], [0.6, 0.4]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.35, pos[1]]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.7]} />
          <meshStandardMaterial 
            color={isSelected ? "#4299e1" : "#8B4513"}
            emissive={isSelected ? "#2b6cb0" : "#000000"}
            emissiveIntensity={isSelected ? 0.3 : 0}
            roughness={0.7}
          />
        </mesh>
      ))}
    </group>
  );
}

function Light({ position, model, onClick, onPointerDown, onPointerMove, onPointerUp, isSelected }) {
  const groupRef = useRef();
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (groupRef.current && !hasAnimated) {
      // Set initial scale to 1 immediately to ensure visibility
      groupRef.current.scale.set(1, 1, 1);
      
      gsap.from(groupRef.current.position, {
        y: position[1] - 3,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.8
      });
      gsap.from(groupRef.current.scale, {
        x: 0, y: 0, z: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 0.8,
        onComplete: () => setHasAnimated(true)
      });
    }
  }, [position, hasAnimated]);

  return (
    <group ref={groupRef} position={position} onClick={onClick} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <pointLight intensity={isSelected ? 1.5 : 1} distance={10} color="#fff5e6" />
      <mesh castShadow>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial 
          color={isSelected ? "#FFD700" : "#FFA500"}
          emissive="#FFA500"
          emissiveIntensity={isSelected ? 1 : 0.5}
        />
      </mesh>
    </group>
  );
}

function Rug({ position, model, onClick, onPointerDown, onPointerMove, onPointerUp, isSelected }) {
  const meshRef = useRef();
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    if (meshRef.current && !hasAnimated) {
      // Set initial scale to 1 immediately to ensure visibility
      meshRef.current.scale.set(1, 1, 1);
      
      gsap.from(meshRef.current.scale, {
        x: 0, y: 0, z: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 1.0,
        onComplete: () => setHasAnimated(true)
      });
    }
  }, [position, hasAnimated]);
  
  useFrame((state) => {
    if (isSelected && meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      receiveShadow
    >
      <planeGeometry args={[5.0, 3.5]} />
      <meshStandardMaterial 
        color={isSelected ? "#4299e1" : "#8B0000"}
        emissive={isSelected ? "#2b6cb0" : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
}

// Animated Room with fade-in walls
function Room({ template }) {
  const floorRef = useRef();
  const roomRef = useRef();
  const wallMaterialProps = {
    color: '#ffffff',
    roughness: 0.7,
    metalness: 0.05,
    envMapIntensity: 0.25,
    side: THREE.DoubleSide
  };
  const roomDimensions = { width: 90, height: 34, depth: 90 };

  useEffect(() => {
    // Fade in floor
    if (floorRef.current) {
      gsap.from(floorRef.current.material, {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut'
      });
    }

    if (roomRef.current) {
      roomRef.current.scale.set(0.85, 0.85, 0.85);
      gsap.to(roomRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.45
      });

      gsap.from(roomRef.current.material, {
        opacity: 0,
        duration: 0.9,
        delay: 0.45,
        ease: 'power1.out'
      });
    }
  }, []);

  return (
    <group>
      {/* Room shell */}
      <mesh
        ref={roomRef}
        position={[0, roomDimensions.height / 2, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[roomDimensions.width, roomDimensions.height, roomDimensions.depth]} />
        <meshStandardMaterial {...wallMaterialProps} transparent />
      </mesh>

      {/* Floor */}
      <mesh ref={floorRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.95} metalness={0} transparent />
      </mesh>
    </group>
  );
}

// Scene content with dynamic object replacement
function SceneContent({ objects, onObjectClick, selectedObject, onMoveObject }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    if (objects) {
      console.log('Scene objects:', objects);
      console.log('Number of objects:', Object.keys(objects).length);
    }
  }, [objects]);

  // Keyboard movement controls
  useEffect(() => {
    if (!selectedObject || !objects[selectedObject]) return;

    const handleKeyDown = (e) => {
      const moveDistance = e.shiftKey ? 0.5 : 0.2;
      const currentPos = objects[selectedObject].position;
      let newPos = [...currentPos];

      switch(e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          newPos[2] -= moveDistance;
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          newPos[2] += moveDistance;
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          newPos[0] -= moveDistance;
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          newPos[0] += moveDistance;
          break;
        default:
          return;
      }

      e.preventDefault();
      onMoveObject(selectedObject, newPos);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObject, objects, onMoveObject]);

  const renderObject = (key, obj) => {
    if (!obj) {
      console.warn(`Invalid object data for ${key}:`, obj);
      return null;
    }

    const component = obj.component;
    const objType = obj.type;

    // Handle architectural elements (walls, doors, windows, floors, ceilings)
    if (component === 'Wall' && obj.start && obj.end) {
      return (
        <Wall
          key={key}
          start={obj.start}
          end={obj.end}
          height={obj.height || 2.8}
          thickness={obj.thickness || 0.2}
          material={obj.material || 'drywall'}
        />
      );
    }

    if (component === 'Door' && obj.position) {
      return (
        <Door
          key={key}
          position={obj.position}
          rotation={obj.rotation || 0}
          width={obj.width || 0.9}
          height={obj.height || 2.1}
        />
      );
    }

    if (component === 'Window' && obj.position) {
      return (
        <Window
          key={key}
          position={obj.position}
          rotation={obj.rotation || 0}
          width={obj.width || 1.2}
          height={obj.height || 1.5}
        />
      );
    }

    if (component === 'Floor' && obj.position) {
      return (
        <Floor
          key={key}
          position={obj.position}
          width={obj.width || 20}
          depth={obj.depth || 20}
          material={obj.material || 'wood'}
        />
      );
    }

    if (component === 'Ceiling' && obj.position) {
      return (
        <Ceiling
          key={key}
          width={obj.width || 20}
          depth={obj.depth || 20}
          height={obj.position[1] || 2.8}
        />
      );
    }

    // Handle furniture - these need interaction
    if (!obj.position) {
      console.warn(`No position data for ${key}:`, obj);
      return null;
    }

    const handleDragStart = (e) => {
      if (selectedObject !== key) return;
      e.stopPropagation();
      setIsDragging(true);
      setDragStart({ x: e.point.x, z: e.point.z, objPos: [...obj.position] });
      gl.domElement.style.cursor = 'grabbing';
    };

    const handleDragMove = (e) => {
      if (!isDragging || !dragStart || selectedObject !== key) return;
      e.stopPropagation();
      
      const deltaX = e.point.x - dragStart.x;
      const deltaZ = e.point.z - dragStart.z;
      const newPos = [
        dragStart.objPos[0] + deltaX,
        dragStart.objPos[1],
        dragStart.objPos[2] + deltaZ
      ];
      onMoveObject(key, newPos);
    };

    const handleDragEnd = (e) => {
      if (isDragging) {
        e.stopPropagation();
        setIsDragging(false);
        setDragStart(null);
        gl.domElement.style.cursor = 'grab';
      }
    };

    const handleClick = (e) => {
      e.stopPropagation();
      onObjectClick(key);
    };

    const isSelected = selectedObject === key;

    // Render based on component type
    switch (component) {
      case 'ModernSofa':
        return (
          <group key={key} onClick={handleClick} onPointerDown={handleDragStart} onPointerMove={handleDragMove} onPointerUp={handleDragEnd}>
            <ModernSofa
              position={obj.position}
              rotation={obj.rotation || [0, 0, 0]}
              color={obj.color || '#4a5568'}
              scale={obj.scale?.[0] || 1}
            />
          </group>
        );
      
      case 'DiningTable':
        return (
          <group key={key} onClick={handleClick} onPointerDown={handleDragStart} onPointerMove={handleDragMove} onPointerUp={handleDragEnd}>
            <DiningTable
              position={obj.position}
              rotation={obj.rotation || [0, 0, 0]}
              color={obj.color || '#8B4513'}
              scale={obj.scale?.[0] || 1}
            />
          </group>
        );
      
      case 'ModernChair':
        return (
          <group key={key} onClick={handleClick} onPointerDown={handleDragStart} onPointerMove={handleDragMove} onPointerUp={handleDragEnd}>
            <ModernChair
              position={obj.position}
              rotation={obj.rotation || [0, 0, 0]}
              color={obj.color || '#2d3748'}
              scale={obj.scale?.[0] || 1}
            />
          </group>
        );
      
      case 'Bed':
        return (
          <group key={key} onClick={handleClick} onPointerDown={handleDragStart} onPointerMove={handleDragMove} onPointerUp={handleDragEnd}>
            <Bed
              position={obj.position}
              rotation={obj.rotation || [0, 0, 0]}
              color={obj.color || '#f5f5dc'}
              scale={obj.scale?.[0] || 1}
            />
          </group>
        );
      
      case 'CeilingLight':
        return (
          <CeilingLight
            key={key}
            position={obj.position}
            intensity={obj.intensity || 1}
            color={obj.color || '#fff5e6'}
          />
        );
      
      case 'AreaRug':
        return (
          <group key={key} onClick={handleClick} onPointerDown={handleDragStart} onPointerMove={handleDragMove} onPointerUp={handleDragEnd}>
            <AreaRug
              position={obj.position}
              width={obj.width || 3}
              depth={obj.depth || 2}
              color={obj.color || '#8B0000'}
            />
          </group>
        );
      
      default:
        // Fallback to old placeholder components for backward compatibility
        let category = objType || key.replace(/\d+$/, '');
        
        if (!category || category === key) {
          const model = obj.model || '';
          if (model.includes('chair')) category = 'chair';
          else if (model.includes('sofa')) category = 'sofa';
          else if (model.includes('table') || model.includes('desk')) category = 'table';
          else if (model.includes('light')) category = 'light';
          else if (model.includes('rug')) category = 'rug';
        }
        
        console.log(`Rendering ${key} as fallback category: ${category}`);
        
        const commonProps = {
          position: obj.position,
          model: obj.model,
          onClick: handleClick,
          onPointerDown: handleDragStart,
          onPointerMove: handleDragMove,
          onPointerUp: handleDragEnd,
          isSelected: isSelected
        };
        
        switch (category) {
          case 'chair':
            return <Chair key={key} {...commonProps} />;
          case 'sofa':
            return <Sofa key={key} {...commonProps} />;
          case 'table':
          case 'desk':
          case 'nightstand':
            return <Table key={key} {...commonProps} />;
          case 'light':
            return <Light key={key} {...commonProps} />;
          case 'rug':
            return <Rug key={key} {...commonProps} />;
          default:
            console.warn(`Unknown category: ${category} for key: ${key}, using Chair fallback`);
            return <Chair key={key} {...commonProps} />;
        }
    }
  };

  return (
    <>
      {/* Removed Room component - walls, floors, ceilings now rendered from objects */}
      {objects && Object.entries(objects).map(([key, obj]) => renderObject(key, obj))}
    </>
  );
}

const Scene3DEnhanced = ({ template, onObjectSelect, selectedObject, objects, onSaveScene, onDeleteObject, onMoveObject }) => {
  const [cameraPosition, setCameraPosition] = useState([12, 8, 12]);
  const [isRotating, setIsRotating] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    // Scene initialization animation
    setTimeout(() => setSceneReady(true), 100);
  }, []);

  useEffect(() => {
    // Log when template or objects change
    console.log('Template:', template?.name);
    console.log('Objects received:', objects);
    if (objects) {
      console.log('Object keys:', Object.keys(objects));
    }
  }, [template, objects]);

  useEffect(() => {
    // Handle keyboard delete
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedObject && onDeleteObject) {
        e.preventDefault();
        onDeleteObject(selectedObject);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedObject, onDeleteObject]);

  const handleObjectClick = (objectKey) => {
    onObjectSelect(objectKey);
  };

  const resetCamera = () => {
    setCameraPosition([10, 10, 10]);
  };

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  const handleSave = async () => {
    const sceneData = {
      template_id: template.id,
      template_name: template.name,
      objects: objects,
      camera: {
        position: cameraPosition
      },
      lighting: {
        ambientIntensity: 0.4
      }
    };
    
    if (onSaveScene) {
      onSaveScene(sceneData);
    }
  };

  return (
    <div className="scene3d-container">
      <div className="scene3d-header">
        <h2>3D View: {template?.name || 'Room'}</h2>
        <div className="scene3d-controls">
          {selectedObject && (
            <button 
              onClick={() => onDeleteObject && onDeleteObject(selectedObject)} 
              className="control-btn delete-btn" 
              title="Delete Selected Object"
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
          <button onClick={handleSave} className="control-btn save-btn" title="Save Scene">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
          </button>
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
        {sceneReady && (
          <Canvas shadows camera={{ position: cameraPosition, fov: 70 }}>
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <directionalLight position={[-10, 10, -5]} intensity={0.4} />
            <pointLight position={[0, 5, 0]} intensity={0.5} />

            {/* Scene Content */}
            <SceneContent 
              objects={objects || template?.objects}
              onObjectClick={handleObjectClick}
              selectedObject={selectedObject}
              onMoveObject={onMoveObject}
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
              maxPolarAngle={Math.PI / 2 - 0.1}
              autoRotate={isRotating}
              autoRotateSpeed={1}
              target={[0, 0, 0]}
            />

            {/* Environment */}
            <Environment preset="apartment" />
          </Canvas>
        )}
      </div>

      <div className="scene3d-info">
        <p className="info-text">
          {selectedObject 
            ? `✓ Selected: ${selectedObject.charAt(0).toUpperCase() + selectedObject.slice(1)} | Use Arrow Keys/WASD to move • Drag to reposition • Click inventory to replace • Press Delete to remove` 
            : '💡 Click objects to select • Click inventory items to add new furniture'}
        </p>
      </div>
    </div>
  );
};

export default Scene3DEnhanced;
