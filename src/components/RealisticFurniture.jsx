import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

// Wall component with thickness and proper materials
export function Wall({ start, end, height = 2.8, thickness = 0.2, material = 'concrete' }) {
  const wallRef = useRef();
  
  // Calculate wall dimensions and position
  const dx = end[0] - start[0];
  const dz = end[2] - start[2];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  
  const centerX = (start[0] + end[0]) / 2;
  const centerZ = (start[2] + end[2]) / 2;
  
  const materialProps = {
    concrete: { color: '#f5f5f5', roughness: 0.8, metalness: 0.1 },
    brick: { color: '#c9a27c', roughness: 0.9, metalness: 0 },
    drywall: { color: '#ffffff', roughness: 0.7, metalness: 0 }
  };
  
  const props = materialProps[material] || materialProps.concrete;
  
  useEffect(() => {
    if (wallRef.current) {
      gsap.from(wallRef.current.scale, {
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: Math.random() * 0.3
      });
    }
  }, []);
  
  return (
    <mesh
      ref={wallRef}
      position={[centerX, height / 2, centerZ]}
      rotation={[0, angle, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[length, height, thickness]} />
      <meshStandardMaterial {...props} />
    </mesh>
  );
}

// Door component
export function Door({ position, rotation = 0, width = 0.9, height = 2.1, isOpen = false }) {
  const doorRef = useRef();
  
  useEffect(() => {
    if (doorRef.current) {
      gsap.from(doorRef.current.scale, {
        x: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
        delay: 0.3
      });
    }
  }, []);
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Door frame */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width + 0.1, height, 0.15]} />
        <meshStandardMaterial color="#8B4513" roughness={0.6} />
      </mesh>
      
      {/* Door panel */}
      <mesh 
        ref={doorRef}
        position={[isOpen ? width / 2 : 0, height / 2, 0.08]} 
        castShadow
      >
        <boxGeometry args={[width, height - 0.1, 0.05]} />
        <meshStandardMaterial color="#A0522D" roughness={0.4} metalness={0.1} />
      </mesh>
      
      {/* Door handle */}
      <mesh position={[width * 0.4, height * 0.5, 0.12]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
        <meshStandardMaterial color="#FFD700" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  );
}

// Window component
export function Window({ position, rotation = 0, width = 1.2, height = 1.5 }) {
  const windowRef = useRef();
  
  useEffect(() => {
    if (windowRef.current) {
      gsap.from(windowRef.current.scale, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
        delay: 0.4
      });
    }
  }, []);
  
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Window frame */}
      <mesh castShadow>
        <boxGeometry args={[width + 0.1, height + 0.1, 0.1]} />
        <meshStandardMaterial color="#654321" roughness={0.5} />
      </mesh>
      
      {/* Glass pane */}
      <mesh ref={windowRef} position={[0, 0, 0.05]} castShadow>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          color="#b3d9ff"
          transparent
          opacity={0.4}
          roughness={0.1}
          metalness={0.1}
          transmission={0.9}
          thickness={0.5}
        />
      </mesh>
      
      {/* Window divider */}
      <mesh position={[0, 0, 0.06]} castShadow>
        <boxGeometry args={[0.02, height, 0.02]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      <mesh position={[0, 0, 0.06]} castShadow>
        <boxGeometry args={[width, 0.02, 0.02]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  );
}

// Enhanced Floor with realistic texture
export function Floor({ width = 20, depth = 20, position = [0, 0, 0], material = 'wood' }) {
  const floorRef = useRef();
  
  const materials = {
    wood: { color: '#d2b48c', roughness: 0.7, metalness: 0 },
    tile: { color: '#e8e8e8', roughness: 0.3, metalness: 0.2 },
    carpet: { color: '#c8b8a0', roughness: 0.9, metalness: 0 },
    marble: { color: '#f8f8f8', roughness: 0.2, metalness: 0.3 }
  };
  
  const props = materials[material] || materials.wood;
  
  useEffect(() => {
    if (floorRef.current) {
      gsap.from(floorRef.current.material, {
        opacity: 0,
        duration: 1,
        ease: 'power2.inOut'
      });
    }
  }, []);
  
  return (
    <mesh 
      ref={floorRef}
      rotation={[-Math.PI / 2, 0, 0]} 
      position={position} 
      receiveShadow
    >
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial {...props} transparent />
    </mesh>
  );
}

// Ceiling with recessed lighting
export function Ceiling({ width = 20, depth = 20, height = 2.8 }) {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]} receiveShadow>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color="#ffffff" roughness={0.9} />
    </mesh>
  );
}

// Realistic furniture components
export function ModernSofa({ position, rotation = [0, 0, 0], color = '#4a5568', scale = 1 }) {
  const sofaRef = useRef();
  
  useEffect(() => {
    if (sofaRef.current) {
      gsap.from(sofaRef.current.position, {
        y: position[1] + 3,
        duration: 0.8,
        ease: 'bounce.out',
        delay: 0.3
      });
    }
  }, [position]);
  
  return (
    <group ref={sofaRef} position={position} rotation={rotation} scale={scale}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[2.5, 0.4, 1]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      
      {/* Backrest */}
      <mesh position={[0, 0.6, -0.4]} castShadow>
        <boxGeometry args={[2.5, 0.8, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      
      {/* Armrests */}
      <mesh position={[-1.15, 0.5, 0]} castShadow>
        <boxGeometry args={[0.2, 0.6, 1]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      <mesh position={[1.15, 0.5, 0]} castShadow>
        <boxGeometry args={[0.2, 0.6, 1]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      
      {/* Cushions */}
      <mesh position={[-0.6, 0.45, 0.1]} castShadow>
        <boxGeometry args={[0.7, 0.15, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.6, 0.45, 0.1]} castShadow>
        <boxGeometry args={[0.7, 0.15, 0.7]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

export function DiningTable({ position, rotation = [0, 0, 0], color = '#8B4513', scale = 1 }) {
  const tableRef = useRef();
  
  useEffect(() => {
    if (tableRef.current) {
      gsap.from(tableRef.current.position, {
        y: position[1] - 2,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.4
      });
    }
  }, [position]);
  
  return (
    <group ref={tableRef} position={position} rotation={rotation} scale={scale}>
      {/* Tabletop */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      </mesh>
      
      {/* Legs */}
      {[[-0.85, 0, -0.5], [0.85, 0, -0.5], [-0.85, 0, 0.5], [0.85, 0, 0.5]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.375, pos[2]]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.75, 8]} />
          <meshStandardMaterial color={color} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export function ModernChair({ position, rotation = [0, 0, 0], color = '#2d3748', scale = 1 }) {
  const chairRef = useRef();
  
  useEffect(() => {
    if (chairRef.current) {
      gsap.from(chairRef.current.position, {
        y: position[1] + 2,
        duration: 0.6,
        ease: 'bounce.out',
        delay: 0.5
      });
    }
  }, [position]);
  
  return (
    <group ref={chairRef} position={position} rotation={rotation} scale={scale}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      
      {/* Backrest */}
      <mesh position={[0, 0.8, -0.2]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.1]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      
      {/* Legs */}
      {[[-0.2, 0, -0.2], [0.2, 0, -0.2], [-0.2, 0, 0.2], [0.2, 0, 0.2]].map((pos, i) => (
        <mesh key={i} position={[pos[0], 0.225, pos[2]]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.45, 8]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

export function Bed({ position, rotation = [0, 0, 0], color = '#f5f5dc', scale = 1 }) {
  const bedRef = useRef();
  
  useEffect(() => {
    if (bedRef.current) {
      gsap.from(bedRef.current.position, {
        y: position[1] - 3,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.3
      });
    }
  }, [position]);
  
  return (
    <group ref={bedRef} position={position} rotation={rotation} scale={scale}>
      {/* Mattress */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.4, 1.8]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      
      {/* Headboard */}
      <mesh position={[0, 0.9, -0.85]} castShadow>
        <boxGeometry args={[2, 1, 0.1]} />
        <meshStandardMaterial color="#8B4513" roughness={0.6} />
      </mesh>
      
      {/* Bed frame */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[2.1, 0.2, 1.9]} />
        <meshStandardMaterial color="#654321" roughness={0.5} />
      </mesh>
      
      {/* Pillows */}
      <mesh position={[-0.4, 0.65, -0.6]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      <mesh position={[0.4, 0.65, -0.6]} castShadow>
        <boxGeometry args={[0.5, 0.15, 0.4]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
    </group>
  );
}

export function CeilingLight({ position, intensity = 1, color = '#fff5e6' }) {
  return (
    <group position={position}>
      {/* Light fixture */}
      <mesh castShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.2, 16]} />
        <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Light bulb glow */}
      <mesh position={[0, -0.15, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={1}
        />
      </mesh>
      
      {/* Point light */}
      <pointLight 
        position={[0, -0.2, 0]} 
        intensity={intensity} 
        distance={15} 
        color={color}
        castShadow
      />
    </group>
  );
}

export function AreaRug({ position, width = 3, depth = 2, color = '#8B0000', pattern = 'persian' }) {
  const rugRef = useRef();
  
  useEffect(() => {
    if (rugRef.current) {
      gsap.from(rugRef.current.scale, {
        x: 0,
        z: 0,
        duration: 0.6,
        ease: 'back.out(1.7)',
        delay: 0.6
      });
    }
  }, []);
  
  return (
    <mesh
      ref={rugRef}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[position[0], position[1] + 0.01, position[2]]}
      receiveShadow
    >
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color={color} roughness={0.95} />
    </mesh>
  );
}
