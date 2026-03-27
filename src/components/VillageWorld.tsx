import { Canvas, useFrame } from "@react-three/fiber";
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
  Text
} from "@react-three/drei";
import { motion } from "motion/react";
import { X, Users, MessageSquare, BarChart2, MousePointer2, Map as MapIcon, Navigation } from "lucide-react";
import { useRef, useMemo, useState } from "react";
import * as THREE from "three";

// --- Components ---

const Building = ({ position, size = [2, 1.5, 2], color = "#ffffff", rotation = [0, 0, 0], type = "standard" }: any) => (
  <group position={position} rotation={rotation}>
    <RoundedBox args={size as any} radius={0.2} smoothness={4} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={0.3} />
    </RoundedBox>
    {/* Window/Door detail */}
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
    {/* Roof detail */}
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

const World = () => {
  const elements = useMemo(() => {
    const items: any[] = [];
    const seed = 12345;
    const random = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    // Generate Clusters
    for (let i = 0; i < 15; i++) {
      const clusterX = (random(seed + i) - 0.5) * 80;
      const clusterZ = (random(seed + i * 2) - 0.5) * 80;
      
      // Buildings in cluster
      for (let j = 0; j < 3; j++) {
        const bx = clusterX + (random(seed + i + j) - 0.5) * 10;
        const bz = clusterZ + (random(seed + i + j * 2) - 0.5) * 10;
        const size: [number, number, number] = [
          1.5 + random(seed + i + j) * 2,
          1 + random(seed + i + j * 3) * 3,
          1.5 + random(seed + i + j * 4) * 2
        ];
        items.push(
          <Building 
            key={`b-${i}-${j}`} 
            position={[bx, size[1]/2, bz]} 
            size={size} 
            color={random(seed + i + j) > 0.5 ? "#ffffff" : "#f8fafc"}
            type={size[1] > 3 ? "tower" : "standard"}
            rotation={[0, random(seed + i + j) * Math.PI, 0]}
          />
        );
      }

      // Trees in cluster
      for (let k = 0; k < 8; k++) {
        const tx = clusterX + (random(seed + i + k * 5) - 0.5) * 20;
        const tz = clusterZ + (random(seed + i + k * 6) - 0.5) * 20;
        items.push(
          <Tree 
            key={`t-${i}-${k}`} 
            position={[tx, 0, tz]} 
            scale={0.8 + random(seed + i + k) * 0.7}
            type={random(seed + i + k) > 0.7 ? "pine" : "round"}
          />
        );
      }

      // Streetlights
      if (random(seed + i) > 0.3) {
        items.push(<StreetLight key={`l-${i}`} position={[clusterX + 2, 0, clusterZ + 2]} />);
      }

      // Benches
      if (random(seed + i) > 0.5) {
        items.push(<Bench key={`bn-${i}`} position={[clusterX - 2, 0, clusterZ - 2]} rotation={[0, random(seed + i) * Math.PI, 0]} />);
      }
    }

    return items;
  }, []);

  return <group>{elements}</group>;
};

export default function VillageWorld({ onExit }: { onExit: () => void }) {
  const [viewMode, setViewMode] = useState<"explorer" | "map">("explorer");

  return (
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
          <p className="text-[10px] text-slate-500 font-medium tracking-tight">Vast World Explorer • 15 Active Clusters</p>
        </div>
      </div>

      {/* Navigation HUD */}
      <div className="absolute top-6 right-6 z-10 flex gap-2">
        <button 
          onClick={() => setViewMode(viewMode === "explorer" ? "map" : "explorer")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow-lg border border-white/50 backdrop-blur-md transition-all ${
            viewMode === "map" ? "bg-blue-600 text-white" : "bg-white text-slate-600"
          }`}
        >
          {viewMode === "map" ? <Navigation size={16} /> : <MapIcon size={16} />}
          <span className="text-xs font-bold">{viewMode === "map" ? "Explorer View" : "Map View"}</span>
        </button>
      </div>

      <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-3">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 w-48">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Users</span>
            <span className="text-[10px] font-bold text-green-500">LIVE</span>
          </div>
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                <img src={`https://picsum.photos/seed/user${i}/32/32`} alt="user" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 w-full h-full cursor-grab active:cursor-grabbing">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera 
            makeDefault 
            position={viewMode === "map" ? [0, 100, 0] : [25, 25, 25]} 
            fov={viewMode === "map" ? 60 : 45}
          />
          <OrbitControls 
            enablePan={true} 
            enableZoom={true} 
            maxPolarAngle={viewMode === "map" ? 0.1 : Math.PI / 2.2} 
            minPolarAngle={viewMode === "map" ? 0 : Math.PI / 6}
            makeDefault
          />
          
          {/* Lighting & Atmosphere */}
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
          <fog attach="fog" args={["#f0f4f8", 20, 150]} />

          {/* Ground */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
            <circleGeometry args={[150, 64]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.9} />
          </mesh>
          <ContactShadows 
            position={[0, -0.05, 0]} 
            opacity={0.3} 
            scale={200} 
            blur={1} 
            far={20} 
          />

          {/* World Content */}
          <World />

          {/* Central Hub */}
          <group position={[0, 0, 0]}>
            <Building position={[0, 4, 0]} size={[6, 8, 6]} color="#ffffff" type="tower" />
            <Tree position={[6, 0, 6]} scale={2} />
            <Tree position={[-6, 0, -6]} scale={2} />
            <Person position={[2, 0, 2]} color="#60a5fa" label="Admin Alex" />
            <Person position={[-2, 0, -2]} color="#f472b6" label="Community Sarah" />
            
            <FloatingInterface 
              position={[0, 10, 0]} 
              title="Metropolis Core" 
              icon={Navigation}
              color="blue"
              content="Central hub for all 15 village clusters. Population: 1,240 active users."
            />
          </group>

          {/* Environment Additions */}
          <Clouds material={THREE.MeshStandardMaterial}>
            <Cloud segments={40} bounds={[100, 10, 100]} volume={50} color="white" position={[0, 40, 0]} />
          </Clouds>
          <Stars radius={300} depth={100} count={10000} factor={6} saturation={0} fade speed={1} />
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
            {viewMode === "map" ? "Drag to Pan • Scroll to Zoom" : "Drag to Rotate • Scroll to Zoom • Right Click to Pan"}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
