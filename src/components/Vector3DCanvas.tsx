import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Text } from "@react-three/drei";
import { Vector } from "./VectorInput";
import * as THREE from "three";

interface Vector3DCanvasProps {
  vectors: Vector[];
}

const VectorArrow = ({ vector }: { vector: Vector }) => {
  const origin = new THREE.Vector3(0, 0, 0);
  const direction = new THREE.Vector3(vector.x, vector.y, vector.z);
  const length = direction.length();
  const arrowHelper = new THREE.ArrowHelper(
    direction.normalize(),
    origin,
    length,
    vector.color,
    length * 0.2,
    length * 0.1
  );

  return <primitive object={arrowHelper} />;
};

const AxisLabels = () => {
  return (
    <>
      <Text position={[5.5, 0, 0]} fontSize={0.5} color="#ef4444">
        X
      </Text>
      <Text position={[0, 5.5, 0]} fontSize={0.5} color="#10b981">
        Y
      </Text>
      <Text position={[0, 0, 5.5]} fontSize={0.5} color="#3b82f6">
        Z
      </Text>
    </>
  );
};

export const Vector3DCanvas = ({ vectors }: Vector3DCanvasProps) => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted shadow-[var(--shadow-card)]">
      <Canvas camera={{ position: [8, 8, 8], fov: 50 }}>
        <color attach="background" args={["hsl(215, 30%, 8%)"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#1e293b"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#334155"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
        />

        {/* Axes */}
        <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 5, 0xef4444]} />
        <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 5, 0x10b981]} />
        <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 5, 0x3b82f6]} />

        <AxisLabels />

        {vectors.map((vector) => (
          <VectorArrow key={vector.id} vector={vector} />
        ))}

        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={30}
        />
      </Canvas>
    </div>
  );
};
