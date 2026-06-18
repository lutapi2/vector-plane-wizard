import { useRef, useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Text, Line, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { Vector } from "./VectorInput";
import { useTheme } from "@/hooks/useTheme";
import { captureCanvas } from "@/lib/export/capture";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Camera, Settings2, Tag, Grid3x3, SquareStack } from "lucide-react";

export interface ExtraVector {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
  name: string;
  dashed?: boolean;
}

interface Vector3DCanvasProps {
  vectors: Vector[];
  extraVectors?: ExtraVector[];
}

const AXIS = {
  x: "#ef4444",
  y: "#22c55e",
  z: "#3b82f6",
};

interface SceneTheme {
  bg: string;
  grid: string;
  gridMajor: string;
  text: string;
  textMuted: string;
}

const VectorArrow = ({
  vector,
  showLabel,
  textColor,
}: {
  vector: Vector | ExtraVector;
  showLabel: boolean;
  textColor: string;
}) => {
  const dir = new THREE.Vector3(vector.x, vector.y, vector.z);
  const length = dir.length();
  if (length === 0) return null;
  const normalized = dir.clone().normalize();

  const arrow = useMemo(() => {
    const a = new THREE.ArrowHelper(
      normalized,
      new THREE.Vector3(0, 0, 0),
      length,
      vector.color,
      Math.min(length * 0.2, 0.8),
      Math.min(length * 0.12, 0.4)
    );
    return a;
  }, [vector.x, vector.y, vector.z, vector.color]);

  const dashed = "dashed" in vector && vector.dashed;

  return (
    <group>
      {dashed ? (
        <Line
          points={[
            [0, 0, 0],
            [vector.x, vector.y, vector.z],
          ]}
          color={vector.color}
          lineWidth={2}
          dashed
          dashScale={3}
        />
      ) : (
        <primitive object={arrow} />
      )}
      {showLabel && (
        <Billboard position={[vector.x * 1.08, vector.y * 1.08, vector.z * 1.08]}>
          <Text fontSize={0.34} color={vector.color} anchorX="left" anchorY="bottom" outlineWidth={0.012} outlineColor={textColor === "#ffffff" ? "#000000" : "#ffffff"}>
            {`${vector.name} (${vector.x}, ${vector.y}, ${vector.z})`}
          </Text>
        </Billboard>
      )}
    </group>
  );
};

const CoordinatePlane = ({
  plane,
  size,
  color,
}: {
  plane: "xy" | "xz" | "yz";
  size: number;
  color: string;
}) => {
  const rotation: [number, number, number] =
    plane === "xy" ? [0, 0, 0] : plane === "xz" ? [-Math.PI / 2, 0, 0] : [0, Math.PI / 2, 0];
  return (
    <mesh rotation={rotation}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
};

const AxisScales = ({ length, color }: { length: number; color: string }) => {
  const ticks = [];
  for (let i = -length; i <= length; i++) {
    if (i === 0) continue;
    ticks.push(
      <Text key={`x${i}`} position={[i, -0.35, 0]} fontSize={0.22} color={color} anchorX="center">
        {i}
      </Text>
    );
    ticks.push(
      <Text key={`y${i}`} position={[-0.35, i, 0]} fontSize={0.22} color={color} anchorX="center">
        {i}
      </Text>
    );
    ticks.push(
      <Text key={`z${i}`} position={[0, -0.35, i]} fontSize={0.22} color={color} anchorX="center">
        {i}
      </Text>
    );
  }
  return <>{ticks}</>;
};

const Axes = ({ length, textColor }: { length: number; textColor: string }) => (
  <>
    <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), length, AXIS.x, 0.5, 0.25]} />
    <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), length, AXIS.y, 0.5, 0.25]} />
    <arrowHelper args={[new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), length, AXIS.z, 0.5, 0.25]} />
    <Text position={[length + 0.5, 0, 0]} fontSize={0.5} color={AXIS.x}>X</Text>
    <Text position={[0, length + 0.5, 0]} fontSize={0.5} color={AXIS.y}>Y</Text>
    <Text position={[0, 0, length + 0.5]} fontSize={0.5} color={AXIS.z}>Z</Text>
  </>
);

export const Vector3DCanvas = ({ vectors, extraVectors = [] }: Vector3DCanvasProps) => {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [showGrid, setShowGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showScale, setShowScale] = useState(true);
  const [planes, setPlanes] = useState({ xy: false, xz: false, yz: false });
  const [axisLength, setAxisLength] = useState(6);

  const sceneTheme: SceneTheme =
    theme === "dark"
      ? { bg: "#0d1424", grid: "#1f2a44", gridMajor: "#33415c", text: "#ffffff", textMuted: "#94a3b8" }
      : { bg: "#f5f8fc", grid: "#d3dded", gridMajor: "#a8bcd6", text: "#0f172a", textMuted: "#475569" };

  const planeSize = axisLength * 2;

  return (
    <div className="relative w-full h-full">
      <Canvas
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{ position: [8, 7, 9], fov: 50 }}
        onCreated={({ gl }) => {
          canvasRef.current = gl.domElement;
        }}
      >
        <color attach="background" args={[sceneTheme.bg]} />
        <ambientLight intensity={0.7} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.3} />

        {showGrid && (
          <Grid
            args={[planeSize, planeSize]}
            cellSize={1}
            cellThickness={0.5}
            cellColor={sceneTheme.grid}
            sectionSize={5}
            sectionThickness={1}
            sectionColor={sceneTheme.gridMajor}
            fadeDistance={40}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={false}
          />
        )}

        {planes.xy && <CoordinatePlane plane="xy" size={planeSize} color={AXIS.z} />}
        {planes.xz && <CoordinatePlane plane="xz" size={planeSize} color={AXIS.y} />}
        {planes.yz && <CoordinatePlane plane="yz" size={planeSize} color={AXIS.x} />}

        <Axes length={axisLength} textColor={sceneTheme.text} />
        {showScale && <AxisScales length={axisLength} color={sceneTheme.textMuted} />}

        {vectors.map((v) => (
          <VectorArrow key={v.id} vector={v} showLabel={showLabels} textColor={sceneTheme.text} />
        ))}
        {extraVectors.map((v) => (
          <VectorArrow key={v.id} vector={v} showLabel={showLabels} textColor={sceneTheme.text} />
        ))}

        <OrbitControls enableDamping dampingFactor={0.05} minDistance={3} maxDistance={40} makeDefault />
      </Canvas>

      {/* Floating controls */}
      <div className="absolute top-3 right-3 z-30 flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary" size="icon" aria-label="Ajustes de la escena" className="shadow-md">
              <Settings2 className="w-4 h-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 space-y-4">
            <p className="text-sm font-semibold flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-primary" /> Ajustes de la escena
            </p>

            <div className="flex items-center justify-between">
              <label htmlFor="grid-sw" className="text-sm flex items-center gap-2">
                <Grid3x3 className="w-4 h-4 text-muted-foreground" /> Cuadrícula
              </label>
              <Switch id="grid-sw" checked={showGrid} onCheckedChange={setShowGrid} />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="lbl-sw" className="text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-muted-foreground" /> Etiquetas
              </label>
              <Switch id="lbl-sw" checked={showLabels} onCheckedChange={setShowLabels} />
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="scale-sw" className="text-sm">Escala numérica</label>
              <Switch id="scale-sw" checked={showScale} onCheckedChange={setShowScale} />
            </div>

            <div className="space-y-2 pt-1 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-2 pt-2">
                <SquareStack className="w-3.5 h-3.5" /> Planos coordenados
              </p>
              <div className="flex items-center justify-between">
                <label htmlFor="xy-sw" className="text-sm">Plano XY</label>
                <Switch id="xy-sw" checked={planes.xy} onCheckedChange={(v) => setPlanes((p) => ({ ...p, xy: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="xz-sw" className="text-sm">Plano XZ</label>
                <Switch id="xz-sw" checked={planes.xz} onCheckedChange={(v) => setPlanes((p) => ({ ...p, xz: v }))} />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="yz-sw" className="text-sm">Plano YZ</label>
                <Switch id="yz-sw" checked={planes.yz} onCheckedChange={(v) => setPlanes((p) => ({ ...p, yz: v }))} />
              </div>
            </div>

            <div className="space-y-2 pt-1 border-t border-border">
              <label className="text-xs font-medium text-muted-foreground pt-2 block">
                Tamaño de ejes: {axisLength}
              </label>
              <Slider
                value={[axisLength]}
                min={3}
                max={12}
                step={1}
                onValueChange={(v) => setAxisLength(v[0])}
                aria-label="Tamaño de los ejes"
              />
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="secondary"
          size="icon"
          aria-label="Capturar escena como imagen PNG"
          className="shadow-md"
          onClick={() => captureCanvas(canvasRef.current)}
        >
          <Camera className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
