import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  PerspectiveCamera, 
  OrbitControls, 
  RoundedBox, 
  Html, 
  Environment, 
  ContactShadows,
  Float,
  Sky,
  Stars,
  Cloud,
  Clouds,
  Text,
  useKeyboardControls,
  KeyboardControls
} from "@react-three/drei";
import { motion } from "motion/react";
import { X, Users, MessageSquare, BarChart2, MousePointer2, Map as MapIcon, Navigation, Car as CarIcon } from "lucide-react";
import { useRef, useMemo, useState, useEffect } from "react";
import * as THREE from "three";

// --- Types & Constants ---

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  brake = "brake",
}

// --- Components ---

const Car = ({ position, rotation = [0, 0, 0], color = "#3b82f6", braking = false }: any) => (
  <group position={position} rotation={rotation}>
    {/* Body */}
    <RoundedBox args={[1.2, 0.5, 2.2]} radius={0.1} position={[0, 0.4, 0]} castShadow>
      <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} />
    </RoundedBox>
    {/* Cabin */}
    <RoundedBox args={[1, 0.4, 1.2]} radius={0.1} position={[0, 0.8, -0.2]} castShadow>
      <meshStandardMaterial color="#1e293b" roughness={0.1} transparent opacity={0.8} />
    </RoundedBox>
    {/* Wheels */}
    {[[-0.6, 0.2, 0.7], [0.6, 0.2, 0.7], [-0.6, 0.2, -0.7], [0.6, 0.2, -0.7]].map((pos, i) => (
      <mesh key={i} position={pos as any} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    ))}
    {/* Headlights */}
    <mesh position={[-0.4, 0.4, 1.1]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2} />
    </mesh>
    <mesh position={[0.4, 0.4, 1.1]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2} />
    </mesh>
    {/* Brake Lights */}
    <mesh position={[-0.4, 0.4, -1.1]}>
      <boxGeometry args={[0.3, 0.1, 0.05]} />
      <meshStandardMaterial color="#7f1d1d" emissive="#ef4444" emissiveIntensity={braking ? 5 : 0.5} />
    </mesh>
    <mesh position={[0.4, 0.4, -1.1]}>
      <boxGeometry args={[0.3, 0.1, 0.05]} />
      <meshStandardMaterial color="#7f1d1d" emissive="#ef4444" emissiveIntensity={braking ? 5 : 0.5} />
    </mesh>
  </group>
);

const PlayerCar = ({ onUpdate, buildings }: { onUpdate: (pos: THREE.Vector3) => void, buildings: any[] }) => {
  const carRef = useRef<THREE.Group>(null);
  const [, getKeys] = useKeyboardControls();
  
  // Physics State
  const speed = useRef(0);
  const rotation = useRef(0);
  const velocityVec = useRef(new THREE.Vector3(0, 0, 0));
  const [isBraking, setIsBraking] = useState(false);

  // Constants
  const ACCEL = 35;
  const DECEL = 15;
  const BRAKE_FORCE = 60;
  const MAX_SPEED = 35;
  const MAX_REVERSE_SPEED = -15;
  const DRAG = 0.05;
  const TIRE_GRIP = 4.5; // Lower = more drift/slip

  useFrame((state, delta) => {
    if (!carRef.current) return;

    const { forward, back, left, right, brake } = getKeys();
    const braking = brake || (forward && speed.current < -0.1) || (back && speed.current > 0.1);
    setIsBraking(braking);

    // 1. Handle Acceleration & Braking
    if (braking) {
      const brakeDir = speed.current > 0 ? -1 : 1;
      speed.current += brakeDir * BRAKE_FORCE * delta;
      if (Math.abs(speed.current) < 1) speed.current = 0;
    } else {
      if (forward) {
        // Non-linear acceleration (harder to accelerate at high speeds)
        const accelFactor = 1 - (speed.current / MAX_SPEED);
        speed.current += ACCEL * accelFactor * delta;
      } else if (back) {
        const revFactor = 1 - (speed.current / MAX_REVERSE_SPEED);
        speed.current -= DECEL * revFactor * delta;
      } else {
        // Natural coasting friction
        speed.current *= (1 - DRAG * delta * 10);
      }
    }

    // Speed caps
    speed.current = Math.max(MAX_REVERSE_SPEED, Math.min(MAX_SPEED, speed.current));

    // 2. Handle Steering
    // Steering sensitivity decreases slightly at very high speeds
    const steerSpeedFactor = Math.min(1, Math.abs(speed.current) / 5);
    const highSpeedSteerFactor = 1 - (Math.abs(speed.current) / (MAX_SPEED * 1.5));
    const steerAmount = delta * 3.5 * steerSpeedFactor * highSpeedSteerFactor;

    if (Math.abs(speed.current) > 0.1) {
      const steerDir = speed.current > 0 ? 1 : -1;
      if (left) rotation.current += steerAmount * steerDir;
      if (right) rotation.current -= steerAmount * steerDir;
    }

    // 3. Calculate Movement with Tire Friction (Lateral Slip)
    const forwardVec = new THREE.Vector3(Math.sin(rotation.current), 0, Math.cos(rotation.current));
    const targetVelocity = forwardVec.clone().multiplyScalar(speed.current);

    // Lerp actual velocity towards target velocity to simulate tire grip/slip
    // This creates the "drifting" effect where the car slides before catching grip
    velocityVec.current.lerp(targetVelocity, TIRE_GRIP * delta);

    const nextX = carRef.current.position.x + velocityVec.current.x * delta;
    const nextZ = carRef.current.position.z + velocityVec.current.z * delta;

    // 4. Collision Detection
    let collision = false;
    for (const b of buildings) {
      const dx = Math.abs(nextX - b.x);
      const dz = Math.abs(nextZ - b.z);
      if (dx < b.w / 2 + 1.2 && dz < b.d / 2 + 1.2) {
        collision = true;
        break;
      }
    }

    if (!collision) {
      carRef.current.rotation.y = rotation.current;
      carRef.current.position.x = nextX;
      carRef.current.position.z = nextZ;
    } else {
      // Impact physics
      speed.current *= -0.4;
      velocityVec.current.multiplyScalar(-0.4);
    }

    onUpdate(carRef.current.position);
  });

  return (
    <group ref={carRef} position={[0, 0, 10]}>
      <Car color="#ef4444" braking={isBraking} />
      <Html position={[0, 1.8, 0]} center>
        <div className="flex flex-col items-center gap-1">
          <div className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[8px] font-bold whitespace-nowrap shadow-lg uppercase tracking-widest">
            You (Driver)
          </div>
          <div className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded text-[7px] text-white font-mono">
            {Math.abs(Math.round(speed.current * 3))} KM/H
          </div>
        </div>
      </Html>
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#ffffff" distance={10} />
    </group>
  );
};

const NPCCar = ({ startPos, direction, color }: { startPos: [number, number, number], direction: "x" | "z", color: string }) => {
  const carRef = useRef<THREE.Group>(null);
  const speed = useRef(5 + Math.random() * 5);
  const dir = useRef(Math.random() > 0.5 ? 1 : -1);

  useFrame((state, delta) => {
    if (!carRef.current) return;
    if (direction === "x") {
      carRef.current.position.x += speed.current * delta * dir.current;
      if (Math.abs(carRef.current.position.x) > 100) dir.current *= -1;
      carRef.current.rotation.y = dir.current > 0 ? Math.PI / 2 : -Math.PI / 2;
    } else {
      carRef.current.position.z += speed.current * delta * dir.current;
      if (Math.abs(carRef.current.position.z) > 100) dir.current *= -1;
      carRef.current.rotation.y = dir.current > 0 ? 0 : Math.PI;
    }
  });

  return (
    <group ref={carRef} position={startPos}>
      <Car color={color} />
    </group>
  );
};

const Roads = () => {
  return (
    <group position={[0, -0.05, 0]}>
      {/* Main Grid Roads */}
      {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((x) => (
        <mesh key={`rx-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0, 0]} receiveShadow>
          <planeGeometry args={[8, 200]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}
      {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((z) => (
        <mesh key={`rz-${z}`} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0, z]} receiveShadow>
          <planeGeometry args={[8, 200]} />
          <meshStandardMaterial color="#1e293b" />
        </mesh>
      ))}
      {/* Road Lines */}
      {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((x) => (
        <group key={`lines-x-${x}`} position={[x, 0.01, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.2, 200]} />
            <meshStandardMaterial color="#fde047" transparent opacity={0.6} />
          </mesh>
          {/* Dashed lines */}
          {Array.from({ length: 20 }).map((_, i) => (
            <mesh key={`dash-x-${x}-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -100 + i * 10]}>
              <planeGeometry args={[0.1, 4]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
            </mesh>
          ))}
        </group>
      ))}
      {[-80, -60, -40, -20, 0, 20, 40, 60, 80].map((z) => (
        <group key={`lines-z-${z}`} position={[0, 0.01, z]} rotation={[0, Math.PI / 2, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.2, 200]} />
            <meshStandardMaterial color="#fde047" transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Building = ({ position, size = [2, 1.5, 2], color = "#ffffff", rotation = [0, 0, 0], type = "standard" }: any) => (
  <group position={position} rotation={rotation}>
    <RoundedBox args={size as any} radius={0.2} smoothness={4} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.3} />
    </RoundedBox>
    <mesh position={[0, -0.2, size[2]/2 + 0.01]}>
      <planeGeometry args={[0.8, 1]} />
      <meshStandardMaterial color="#e2e8f0" />
    </mesh>
    {type === "tower" && (
      <mesh position={[0, size[1]/2 + 0.5, 0]}>
        <cylinderGeometry args={[0.5, 0.8, 1, 4]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
    )}
    <mesh position={[0, size[1]/2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size[0] - 0.2, size[2] - 0.2]} />
      <meshStandardMaterial color="#f1f5f9" />
    </mesh>
  </group>
);

const Tree = ({ position, scale = 1, type = "round" }: any) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0.5, 0]} castShadow>
      <cylinderGeometry args={[0.08, 0.12, 1]} />
      <meshStandardMaterial color="#78350f" />
    </mesh>
    {type === "round" ? (
      <mesh position={[0, 1.2, 0]} castShadow>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial color="#a0c49d" />
      </mesh>
    ) : (
      <mesh position={[0, 1.4, 0]} castShadow>
        <coneGeometry args={[0.7, 1.8, 8]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
    )}
  </group>
);

const StreetLight = ({ position }: any) => (
  <group position={position}>
    <mesh position={[0, 1.5, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 3]} />
      <meshStandardMaterial color="#475569" />
    </mesh>
    <mesh position={[0.3, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.05, 0.05, 0.6]} />
      <meshStandardMaterial color="#475569" />
    </mesh>
    <mesh position={[0.6, 2.9, 0]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={2} />
    </mesh>
    <pointLight position={[0.6, 2.9, 0]} intensity={0.5} distance={5} color="#fef08a" />
  </group>
);

const Bench = ({ position, rotation = [0, 0, 0] }: any) => (
  <group position={position} rotation={rotation}>
    <mesh position={[0, 0.2, 0]} castShadow>
      <boxGeometry args={[1.5, 0.1, 0.6]} />
      <meshStandardMaterial color="#92400e" />
    </mesh>
    <mesh position={[0, 0.4, -0.3]} rotation={[Math.PI / 8, 0, 0]} castShadow>
      <boxGeometry args={[1.5, 0.5, 0.1]} />
      <meshStandardMaterial color="#92400e" />
    </mesh>
    {/* Legs */}
    <mesh position={[-0.6, 0.1, 0.2]} castShadow><boxGeometry args={[0.1, 0.2, 0.1]} /><meshStandardMaterial color="#1e293b" /></mesh>
    <mesh position={[0.6, 0.1, 0.2]} castShadow><boxGeometry args={[0.1, 0.2, 0.1]} /><meshStandardMaterial color="#1e293b" /></mesh>
    <mesh position={[-0.6, 0.1, -0.2]} castShadow><boxGeometry args={[0.1, 0.2, 0.1]} /><meshStandardMaterial color="#1e293b" /></mesh>
    <mesh position={[0.6, 0.1, -0.2]} castShadow><boxGeometry args={[0.1, 0.2, 0.1]} /><meshStandardMaterial color="#1e293b" /></mesh>
  </group>
);

const Person = ({ position, color = "#f472b6", label }: any) => (
  <group position={position}>
    <mesh position={[0, 0.4, 0]} castShadow>
      <capsuleGeometry args={[0.15, 0.4, 4, 8]} />
      <meshStandardMaterial color={color} />
    </mesh>
    <mesh position={[0, 0.85, 0]} castShadow>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial color="#ffe4e6" />
    </mesh>
    {label && (
      <Html position={[0, 1.2, 0]} center distanceFactor={10}>
        <div className="bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[8px] font-bold whitespace-nowrap shadow-lg">
          {label}
        </div>
      </Html>
    )}
  </group>
);

const FloatingInterface = ({ position, title, icon: Icon, content, color = "blue" }: any) => {
  const bgColor = color === "blue" ? "bg-blue-500" : color === "green" ? "bg-green-500" : "bg-amber-500";
  const barColor = color === "blue" ? "bg-blue-400" : color === "green" ? "bg-green-400" : "bg-amber-400";

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Html transform distanceFactor={8} occlude="blending">
          <div className="w-64 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-2xl pointer-events-none select-none">
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 ${bgColor} rounded-lg text-white`}>
                <Icon size={14} />
              </div>
              <span className="text-xs font-bold text-slate-800">{title}</span>
            </div>
            <div className="space-y-2">
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className={`h-full ${barColor} w-2/3`} />
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                {content}
              </p>
            </div>
          </div>
        </Html>
      </Float>
    </group>
  );
};

// --- World Generation ---

const World = ({ onBuildingsGenerated }: { onBuildingsGenerated: (buildings: any[]) => void }) => {
  const elements = useMemo(() => {
    const items: any[] = [];
    const buildingData: any[] = [];
    const seed = 12345;
    const random = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    // Generate Clusters
    for (let i = 0; i < 25; i++) {
      const clusterX = (random(seed + i) - 0.5) * 160;
      const clusterZ = (random(seed + i * 2) - 0.5) * 160;
      
      // Buildings in cluster
      for (let j = 0; j < 4; j++) {
        const bx = clusterX + (random(seed + i + j) - 0.5) * 15;
        const bz = clusterZ + (random(seed + i + j * 2) - 0.5) * 15;
        
        // Don't build on roads (Roads are at 20m intervals, 8m wide)
        if (Math.abs(bx % 20) < 6 || Math.abs(bz % 20) < 6) continue;

        const size: [number, number, number] = [
          2 + random(seed + i + j) * 3,
          1.5 + random(seed + i + j * 3) * 5,
          2 + random(seed + i + j * 4) * 3
        ];
        
        buildingData.push({ x: bx, z: bz, w: size[0], d: size[2] });

        items.push(
          <Building 
            key={`b-${i}-${j}`} 
            position={[bx, size[1]/2, bz]} 
            size={size} 
            color={random(seed + i + j) > 0.5 ? "#ffffff" : "#f8fafc"}
            type={size[1] > 4 ? "tower" : "standard"}
            rotation={[0, random(seed + i + j) * Math.PI, 0]}
          />
        );
      }

      // Trees in cluster
      for (let k = 0; k < 10; k++) {
        const tx = clusterX + (random(seed + i + k * 5) - 0.5) * 30;
        const tz = clusterZ + (random(seed + i + k * 6) - 0.5) * 30;
        if (Math.abs(tx % 20) < 5 || Math.abs(tz % 20) < 5) continue;
        items.push(
          <Tree 
            key={`t-${i}-${k}`} 
            position={[tx, 0, tz]} 
            scale={0.8 + random(seed + i + k) * 1}
            type={random(seed + i + k) > 0.7 ? "pine" : "round"}
          />
        );
      }

      // Streetlights
      if (random(seed + i) > 0.2) {
        items.push(<StreetLight key={`l-${i}`} position={[clusterX + 4.5, 0, clusterZ + 4.5]} />);
      }

      // Benches
      if (random(seed + i) > 0.4) {
        items.push(<Bench key={`bn-${i}`} position={[clusterX - 4.5, 0, clusterZ - 4.5]} rotation={[0, random(seed + i) * Math.PI, 0]} />);
      }
    }

    onBuildingsGenerated(buildingData);
    return items;
  }, [onBuildingsGenerated]);

  return <group>{elements}</group>;
};

const CameraFollow = ({ target }: { target: THREE.Vector3 | null }) => {
  const { camera } = useThree();
  useFrame(() => {
    if (target) {
      const idealOffset = new THREE.Vector3(15, 15, 15);
      idealOffset.add(target);
      camera.position.lerp(idealOffset, 0.1);
      camera.lookAt(target);
    }
  });
  return null;
};

export default function VillageWorld({ onExit }: { onExit: () => void }) {
  const [viewMode, setViewMode] = useState<"explorer" | "map" | "drive">("explorer");
  const [carPos, setCarPos] = useState<THREE.Vector3 | null>(null);
  const [buildings, setBuildings] = useState<any[]>([]);

  const keyMap = useMemo(() => [
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
    { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.brake, keys: ["Space"] },
  ], []);

  const npcCars = useMemo(() => {
    const cars = [];
    const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];
    for (let i = 0; i < 12; i++) {
      const isX = Math.random() > 0.5;
      const coord = [-60, -40, -20, 20, 40, 60][Math.floor(Math.random() * 6)];
      const startPos: [number, number, number] = isX ? [coord, 0, (Math.random() - 0.5) * 160] : [(Math.random() - 0.5) * 160, 0, coord];
      cars.push(<NPCCar key={`npc-${i}`} startPos={startPos} direction={isX ? "z" : "x"} color={colors[i % colors.length]} />);
    }
    return cars;
  }, []);

  return (
    <KeyboardControls map={keyMap}>
      <div className="fixed inset-0 z-[100] bg-[#f0f4f8] flex flex-col overflow-hidden">
        {/* UI Overlay */}
        <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
          <button 
            onClick={onExit}
            className="p-3 bg-white rounded-2xl shadow-lg hover:bg-slate-50 transition-colors group"
          >
            <X className="w-6 h-6 text-slate-600 group-hover:text-slate-900" />
          </button>
          <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white/50">
            <h2 className="text-sm font-bold text-slate-800">NexusVillage Metropolis</h2>
            <p className="text-[10px] text-slate-500 font-medium tracking-tight">
              {viewMode === "drive" ? "Driving Mode • Use Arrow Keys" : "Vast World Explorer • 25 Active Clusters"}
            </p>
          </div>
        </div>

        {/* Navigation HUD */}
        <div className="absolute top-6 right-6 z-10 flex gap-2">
          <button 
            onClick={() => setViewMode("drive")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg border border-white/50 backdrop-blur-md transition-all ${
              viewMode === "drive" ? "bg-red-600 text-white" : "bg-white text-slate-600"
            }`}
          >
            <CarIcon size={16} />
            <span className="text-xs font-bold">Drive Car</span>
          </button>
          <button 
            onClick={() => setViewMode(viewMode === "map" ? "explorer" : "map")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg border border-white/50 backdrop-blur-md transition-all ${
              viewMode === "map" ? "bg-blue-600 text-white" : "bg-white text-slate-600"
            }`}
          >
            {viewMode === "map" ? <Navigation size={16} /> : <MapIcon size={16} />}
            <span className="text-xs font-bold">{viewMode === "map" ? "Explorer View" : "Map View"}</span>
          </button>
        </div>

        {/* 3D Canvas */}
        <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera 
              makeDefault 
              position={[25, 25, 25]} 
              fov={viewMode === "map" ? 60 : 45}
            />
            {viewMode !== "drive" && (
              <OrbitControls 
                enablePan={true} 
                enableZoom={true} 
                maxPolarAngle={viewMode === "map" ? 0.1 : Math.PI / 2.2} 
                minPolarAngle={viewMode === "map" ? 0 : Math.PI / 6}
                makeDefault
              />
            )}
            
            {viewMode === "drive" && <CameraFollow target={carPos} />}

            <ambientLight intensity={0.5} />
            <directionalLight 
              position={[50, 100, 50]} 
              intensity={1.5} 
              castShadow 
              shadow-mapSize={[4096, 4096]}
              shadow-camera-left={-100}
              shadow-camera-right={100}
              shadow-camera-top={100}
              shadow-camera-bottom={-100}
            />
            <Environment preset="sunset" />
            <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
            <fog attach="fog" args={["#f0f4f8", 20, 200]} />

            {/* Ground & Roads */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
              <circleGeometry args={[200, 64]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.9} />
            </mesh>
            <Roads />
            
            <ContactShadows 
              position={[0, -0.05, 0]} 
              opacity={0.3} 
              scale={300} 
              blur={1} 
              far={20} 
            />

            {/* World Content */}
            <World onBuildingsGenerated={setBuildings} />
            <PlayerCar onUpdate={(pos) => setCarPos(pos.clone())} buildings={buildings} />
            {npcCars}

            {/* Central Hub */}
            <group position={[0, 0, 0]}>
              <Building position={[0, 6, 0]} size={[8, 12, 8]} color="#ffffff" type="tower" />
              <Tree position={[10, 0, 10]} scale={2.5} />
              <Tree position={[-10, 0, -10]} scale={2.5} />
              <Person position={[4, 0, 4]} color="#60a5fa" label="Admin Alex" />
              <Person position={[-4, 0, -4]} color="#f472b6" label="Community Sarah" />
              
              <FloatingInterface 
                position={[0, 18, 0]} 
                title="Metropolis Core" 
                icon={Navigation}
                color="blue"
                content="Central hub for all 25 village clusters. Population: 2,450 active users."
              />
            </group>

            {/* Environment Additions */}
            <Clouds material={THREE.MeshStandardMaterial}>
              <Cloud segments={40} bounds={[150, 10, 150]} volume={60} color="white" position={[0, 50, 0]} />
            </Clouds>
            <Stars radius={400} depth={100} count={15000} factor={7} saturation={0} fade speed={1} />
          </Canvas>
        </div>

        {/* Bottom Controls Hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/10 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-900/5 flex items-center gap-3"
          >
            <MousePointer2 className="w-3 h-3 text-slate-400" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {viewMode === "drive" ? "Use Arrow Keys or WASD to Drive" : viewMode === "map" ? "Drag to Pan • Scroll to Zoom" : "Drag to Rotate • Scroll to Zoom • Right Click to Pan"}
            </p>
          </motion.div>
        </div>
      </div>
    </KeyboardControls>
  );
}
