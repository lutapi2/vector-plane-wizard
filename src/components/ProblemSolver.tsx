import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lightbulb, Box, Zap, Cog } from "lucide-react";
import { useSaveCalculation } from "@/hooks/useSaveCalculation";

interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export const ProblemSolver = () => {
  const { saveCalculation } = useSaveCalculation();

  // Tensión en cables - 3 vectores
  const [cables, setCables] = useState<Vector3D[]>([
    { x: 30, y: 40, z: 50 },
    { x: -20, y: 35, z: 45 },
    { x: 15, y: -25, z: 60 }
  ]);
  const [cableResult, setCableResult] = useState<any>(null);

  // Estructuras - 2 vectores
  const [structVectors, setStructVectors] = useState<Vector3D[]>([
    { x: 5, y: 3, z: 2 },
    { x: 2, y: -4, z: 1 }
  ]);
  const [structResult, setStructResult] = useState<any>(null);

  // Campos electromagnéticos - 1 vector
  const [fieldVector, setFieldVector] = useState<Vector3D>({ x: 100, y: 0, z: 50 });
  const [fieldResult, setFieldResult] = useState<any>(null);

  // Trayectorias robóticas - 3 vectores
  const [robotVectors, setRobotVectors] = useState<Vector3D[]>([
    { x: 10, y: 5, z: 0 },
    { x: -5, y: 10, z: 5 },
    { x: 8, y: -3, z: 10 }
  ]);
  const [robotResult, setRobotResult] = useState<any>(null);

  const calculateMagnitude = (v: Vector3D) => {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  };

  const calculateSum = (vectors: Vector3D[]) => {
    return vectors.reduce(
      (acc, v) => ({
        x: acc.x + v.x,
        y: acc.y + v.y,
        z: acc.z + v.z
      }),
      { x: 0, y: 0, z: 0 }
    );
  };

  const calculateCross = (v1: Vector3D, v2: Vector3D) => {
    return {
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x
    };
  };

  const calculateDot = (v1: Vector3D, v2: Vector3D) => {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  };

  const solveCableTension = () => {
    const resultante = calculateSum(cables);
    const magnitudes = cables.map(c => calculateMagnitude(c));
    const magResultante = calculateMagnitude(resultante);

    const result = {
      resultante,
      magnitudes,
      magResultante
    };

    setCableResult(result);
    saveCalculation("cable_tension", { cables }, result);
  };

  const solveStructure = () => {
    const cross = calculateCross(structVectors[0], structVectors[1]);
    const magCross = calculateMagnitude(cross);
    const mag1 = calculateMagnitude(structVectors[0]);
    const mag2 = calculateMagnitude(structVectors[1]);

    const result = {
      cross,
      magCross,
      mag1,
      mag2
    };

    setStructResult(result);
    saveCalculation("structure_analysis", { vectors: structVectors }, result);
  };

  const solveField = () => {
    const magnitude = calculateMagnitude(fieldVector);
    const normalized = {
      x: fieldVector.x / magnitude,
      y: fieldVector.y / magnitude,
      z: fieldVector.z / magnitude
    };

    const result = {
      magnitude,
      normalized
    };

    setFieldResult(result);
    saveCalculation("field_analysis", { fieldVector }, result);
  };

  const solveRobot = () => {
    const finalPosition = calculateSum(robotVectors);
    const totalDistance = robotVectors.reduce((sum, v) => sum + calculateMagnitude(v), 0);
    const displacement = calculateMagnitude(finalPosition);
    const work = robotVectors.slice(0, -1).reduce((sum, v, i) => {
      if (i < robotVectors.length - 1) {
        return sum + calculateDot(v, robotVectors[i + 1]);
      }
      return sum;
    }, 0);

    const result = {
      finalPosition,
      totalDistance,
      displacement,
      work
    };

    setRobotResult(result);
    saveCalculation("robot_trajectory", { vectors: robotVectors }, result);
  };

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Resuelve Problemas Prácticos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ingresa los datos en cada apartado y obtén la solución paso a paso
          </p>
        </div>

        <Tabs defaultValue="cables" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cables" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Cables</span>
            </TabsTrigger>
            <TabsTrigger value="structure" className="flex items-center gap-2">
              <Box className="w-4 h-4" />
              <span className="hidden sm:inline">Estructuras</span>
            </TabsTrigger>
            <TabsTrigger value="field" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span className="hidden sm:inline">Campos</span>
            </TabsTrigger>
            <TabsTrigger value="robot" className="flex items-center gap-2">
              <Cog className="w-4 h-4" />
              <span className="hidden sm:inline">Robótica</span>
            </TabsTrigger>
          </TabsList>

          {/* Tensión en Cables */}
          <TabsContent value="cables">
            <Card className="p-6 bg-card shadow-[var(--shadow-card)]">
              <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-500" />
                Cálculo de Tensión en Cables
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ingresa las fuerzas de 3 cables en Newtons (N)
              </p>

              {cables.map((cable, i) => (
                <div key={i} className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Cable {String.fromCharCode(65 + i)}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      placeholder="X"
                      value={cable.x}
                      onChange={(e) => {
                        const newCables = [...cables];
                        newCables[i].x = parseFloat(e.target.value) || 0;
                        setCables(newCables);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Y"
                      value={cable.y}
                      onChange={(e) => {
                        const newCables = [...cables];
                        newCables[i].y = parseFloat(e.target.value) || 0;
                        setCables(newCables);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Z"
                      value={cable.z}
                      onChange={(e) => {
                        const newCables = [...cables];
                        newCables[i].z = parseFloat(e.target.value) || 0;
                        setCables(newCables);
                      }}
                    />
                  </div>
                </div>
              ))}

              <Button onClick={solveCableTension} className="w-full mb-4">
                Calcular Tensión
              </Button>

              {cableResult && (
                <div className="bg-secondary/30 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-accent">Resultados:</h4>
                  
                  <div className="space-y-2 text-sm font-mono">
                    <div className="text-muted-foreground">Tensiones individuales:</div>
                    {cableResult.magnitudes.map((mag: number, i: number) => (
                      <div key={i} className="pl-4">
                        |Cable {String.fromCharCode(65 + i)}| = {mag.toFixed(2)} N
                      </div>
                    ))}
                    
                    <div className="text-muted-foreground pt-2">Fuerza resultante:</div>
                    <div className="pl-4">
                      R = ({cableResult.resultante.x.toFixed(2)}, {cableResult.resultante.y.toFixed(2)}, {cableResult.resultante.z.toFixed(2)}) N
                    </div>
                    
                    <div className="text-foreground font-semibold pt-2">
                      Magnitud resultante: {cableResult.magResultante.toFixed(2)} N
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Estructuras */}
          <TabsContent value="structure">
            <Card className="p-6 bg-card shadow-[var(--shadow-card)]">
              <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Box className="w-5 h-5 text-cyan-500" />
                Análisis de Estructuras 3D
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ingresa 2 vectores para calcular el momento de torsión (producto cruz)
              </p>

              {structVectors.map((vec, i) => (
                <div key={i} className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Vector {i + 1}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      placeholder="X"
                      value={vec.x}
                      onChange={(e) => {
                        const newVecs = [...structVectors];
                        newVecs[i].x = parseFloat(e.target.value) || 0;
                        setStructVectors(newVecs);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Y"
                      value={vec.y}
                      onChange={(e) => {
                        const newVecs = [...structVectors];
                        newVecs[i].y = parseFloat(e.target.value) || 0;
                        setStructVectors(newVecs);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Z"
                      value={vec.z}
                      onChange={(e) => {
                        const newVecs = [...structVectors];
                        newVecs[i].z = parseFloat(e.target.value) || 0;
                        setStructVectors(newVecs);
                      }}
                    />
                  </div>
                </div>
              ))}

              <Button onClick={solveStructure} className="w-full mb-4">
                Calcular Momento de Torsión
              </Button>

              {structResult && (
                <div className="bg-secondary/30 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-accent">Resultados:</h4>
                  
                  <div className="space-y-2 text-sm font-mono">
                    <div className="text-muted-foreground">Magnitudes:</div>
                    <div className="pl-4">|v₁| = {structResult.mag1.toFixed(2)}</div>
                    <div className="pl-4">|v₂| = {structResult.mag2.toFixed(2)}</div>
                    
                    <div className="text-muted-foreground pt-2">Producto cruz (v₁ × v₂):</div>
                    <div className="pl-4">
                      ({structResult.cross.x.toFixed(2)}, {structResult.cross.y.toFixed(2)}, {structResult.cross.z.toFixed(2)})
                    </div>
                    
                    <div className="text-foreground font-semibold pt-2">
                      Magnitud del momento: {structResult.magCross.toFixed(2)}
                    </div>
                    
                    <div className="text-xs text-muted-foreground pt-2">
                      El vector resultante es perpendicular al plano formado por v₁ y v₂
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Campos Electromagnéticos */}
          <TabsContent value="field">
            <Card className="p-6 bg-card shadow-[var(--shadow-card)]">
              <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500" />
                Campo Eléctrico o Magnético
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ingresa el vector del campo (V/m o T)
              </p>

              <div className="mb-4">
                <Label className="text-sm font-medium mb-2 block">Vector Campo</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Input
                    type="number"
                    placeholder="X"
                    value={fieldVector.x}
                    onChange={(e) => setFieldVector({ ...fieldVector, x: parseFloat(e.target.value) || 0 })}
                  />
                  <Input
                    type="number"
                    placeholder="Y"
                    value={fieldVector.y}
                    onChange={(e) => setFieldVector({ ...fieldVector, y: parseFloat(e.target.value) || 0 })}
                  />
                  <Input
                    type="number"
                    placeholder="Z"
                    value={fieldVector.z}
                    onChange={(e) => setFieldVector({ ...fieldVector, z: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <Button onClick={solveField} className="w-full mb-4">
                Analizar Campo
              </Button>

              {fieldResult && (
                <div className="bg-secondary/30 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-accent">Resultados:</h4>
                  
                  <div className="space-y-2 text-sm font-mono">
                    <div className="text-muted-foreground">Vector campo:</div>
                    <div className="pl-4">
                      E = ({fieldVector.x}, {fieldVector.y}, {fieldVector.z})
                    </div>
                    
                    <div className="text-foreground font-semibold pt-2">
                      Intensidad del campo: {fieldResult.magnitude.toFixed(2)} unidades
                    </div>
                    
                    <div className="text-muted-foreground pt-2">Vector normalizado (dirección):</div>
                    <div className="pl-4">
                      û = ({fieldResult.normalized.x.toFixed(3)}, {fieldResult.normalized.y.toFixed(3)}, {fieldResult.normalized.z.toFixed(3)})
                    </div>
                    
                    <div className="text-xs text-muted-foreground pt-2">
                      El vector normalizado indica la dirección pura del campo
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Robótica */}
          <TabsContent value="robot">
            <Card className="p-6 bg-card shadow-[var(--shadow-card)]">
              <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Cog className="w-5 h-5 text-amber-500" />
                Trayectorias Robóticas
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Ingresa 3 vectores de movimiento consecutivos (metros)
              </p>

              {robotVectors.map((vec, i) => (
                <div key={i} className="mb-4">
                  <Label className="text-sm font-medium mb-2 block">Movimiento {i + 1}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      placeholder="X"
                      value={vec.x}
                      onChange={(e) => {
                        const newVecs = [...robotVectors];
                        newVecs[i].x = parseFloat(e.target.value) || 0;
                        setRobotVectors(newVecs);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Y"
                      value={vec.y}
                      onChange={(e) => {
                        const newVecs = [...robotVectors];
                        newVecs[i].y = parseFloat(e.target.value) || 0;
                        setRobotVectors(newVecs);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Z"
                      value={vec.z}
                      onChange={(e) => {
                        const newVecs = [...robotVectors];
                        newVecs[i].z = parseFloat(e.target.value) || 0;
                        setRobotVectors(newVecs);
                      }}
                    />
                  </div>
                </div>
              ))}

              <Button onClick={solveRobot} className="w-full mb-4">
                Calcular Trayectoria
              </Button>

              {robotResult && (
                <div className="bg-secondary/30 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold text-accent">Resultados:</h4>
                  
                  <div className="space-y-2 text-sm font-mono">
                    <div className="text-muted-foreground">Posición final:</div>
                    <div className="pl-4">
                      ({robotResult.finalPosition.x.toFixed(2)}, {robotResult.finalPosition.y.toFixed(2)}, {robotResult.finalPosition.z.toFixed(2)}) m
                    </div>
                    
                    <div className="text-muted-foreground pt-2">Distancia total recorrida:</div>
                    <div className="pl-4 text-foreground font-semibold">
                      {robotResult.totalDistance.toFixed(2)} m
                    </div>
                    
                    <div className="text-muted-foreground pt-2">Desplazamiento neto:</div>
                    <div className="pl-4 text-foreground font-semibold">
                      {robotResult.displacement.toFixed(2)} m
                    </div>
                    
                    <div className="text-muted-foreground pt-2">Trabajo realizado (aproximado):</div>
                    <div className="pl-4 text-foreground font-semibold">
                      {robotResult.work.toFixed(2)} J
                    </div>
                    
                    <div className="text-xs text-muted-foreground pt-2">
                      Desplazamiento = distancia en línea recta del origen al punto final
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
