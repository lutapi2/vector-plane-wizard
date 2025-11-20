import { Card } from "@/components/ui/card";
import { Vector } from "./VectorInput";
import { Separator } from "@/components/ui/separator";

interface VectorOperationsProps {
  vectors: Vector[];
}

export const VectorOperations = ({ vectors }: VectorOperationsProps) => {
  const calculateMagnitude = (v: Vector) => {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  };

  const calculateSum = () => {
    if (vectors.length === 0) return null;
    return vectors.reduce(
      (acc, v) => ({
        x: acc.x + v.x,
        y: acc.y + v.y,
        z: acc.z + v.z,
      }),
      { x: 0, y: 0, z: 0 }
    );
  };

  const calculateDifference = (v1: Vector, v2: Vector) => {
    return {
      x: v1.x - v2.x,
      y: v1.y - v2.y,
      z: v1.z - v2.z,
    };
  };

  const normalizeVector = (v: Vector) => {
    const mag = calculateMagnitude(v);
    if (mag === 0) return { x: 0, y: 0, z: 0 };
    return {
      x: v.x / mag,
      y: v.y / mag,
      z: v.z / mag,
    };
  };

  const calculateAngleBetween = (v1: Vector, v2: Vector) => {
    const dot = calculateDotProduct(v1, v2);
    const mag1 = calculateMagnitude(v1);
    const mag2 = calculateMagnitude(v2);
    if (mag1 === 0 || mag2 === 0) return { radians: 0, degrees: 0, cosTheta: 0 };
    const cosTheta = dot / (mag1 * mag2);
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosTheta)));
    const angleDeg = (angleRad * 180) / Math.PI;
    return { radians: angleRad, degrees: angleDeg, cosTheta };
  };

  const projectVector = (v1: Vector, v2: Vector) => {
    const dot = calculateDotProduct(v1, v2);
    const mag2Squared = v2.x * v2.x + v2.y * v2.y + v2.z * v2.z;
    if (mag2Squared === 0) return { scalar: 0, vector: { x: 0, y: 0, z: 0 } };
    const scalar = dot / Math.sqrt(mag2Squared);
    const factor = dot / mag2Squared;
    return {
      scalar,
      vector: {
        x: factor * v2.x,
        y: factor * v2.y,
        z: factor * v2.z,
      },
    };
  };

  const calculateDotProduct = (v1: Vector, v2: Vector) => {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  };

  const calculateCrossProduct = (v1: Vector, v2: Vector) => {
    return {
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x,
    };
  };

  const sum = calculateSum();

  return (
    <Card className="p-4 bg-card shadow-[var(--shadow-card)]">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Operaciones</h3>

      {vectors.length === 0 && (
        <p className="text-muted-foreground text-sm">
          Agrega vectores para ver las operaciones
        </p>
      )}

      {vectors.length > 0 && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 text-accent">Magnitudes</h4>
            <div className="space-y-3">
              {vectors.map((v) => {
                const mag = calculateMagnitude(v);
                return (
                  <div key={v.id} className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: v.color }}
                      />
                      <span className="font-medium text-foreground">{v.name}</span>
                    </div>
                    <div className="pl-5 space-y-0.5 text-xs text-muted-foreground font-mono">
                      <div>|{v.name}| = √(x² + y² + z²)</div>
                      <div>|{v.name}| = √(({v.x})² + ({v.y})² + ({v.z})²)</div>
                      <div>|{v.name}| = √({(v.x * v.x).toFixed(2)} + {(v.y * v.y).toFixed(2)} + {(v.z * v.z).toFixed(2)})</div>
                      <div>|{v.name}| = √{(v.x * v.x + v.y * v.y + v.z * v.z).toFixed(2)}</div>
                      <div className="text-foreground font-semibold">|{v.name}| = {mag.toFixed(3)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Separator className="bg-border" />

          {sum && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-accent">Suma de Vectores</h4>
              <div className="space-y-1 text-xs text-muted-foreground font-mono">
                <div>Suma = ({vectors.map(v => v.name).join(" + ")})</div>
                <div>x: {vectors.map(v => v.x).join(" + ")} = {sum.x.toFixed(2)}</div>
                <div>y: {vectors.map(v => v.y).join(" + ")} = {sum.y.toFixed(2)}</div>
                <div>z: {vectors.map(v => v.z).join(" + ")} = {sum.z.toFixed(2)}</div>
                <div className="text-foreground font-semibold pt-1">
                  Resultado: ({sum.x.toFixed(2)}, {sum.y.toFixed(2)}, {sum.z.toFixed(2)})
                </div>
                <div className="text-muted-foreground">
                  Magnitud: {calculateMagnitude(sum as any).toFixed(3)}
                </div>
              </div>
            </div>
          )}

          {vectors.length >= 2 && (
            <>
              <Separator className="bg-border" />
              <div>
                <h4 className="text-sm font-medium mb-2 text-accent">
                  Resta de Vectores ({vectors[0].name} - {vectors[1].name})
                </h4>
                {(() => {
                  const diff = calculateDifference(vectors[0], vectors[1]);
                  return (
                    <div className="space-y-1 text-xs text-muted-foreground font-mono">
                      <div>x: {vectors[0].x} - ({vectors[1].x}) = {diff.x.toFixed(2)}</div>
                      <div>y: {vectors[0].y} - ({vectors[1].y}) = {diff.y.toFixed(2)}</div>
                      <div>z: {vectors[0].z} - ({vectors[1].z}) = {diff.z.toFixed(2)}</div>
                      <div className="text-foreground font-semibold pt-1">
                        Resultado: ({diff.x.toFixed(2)}, {diff.y.toFixed(2)}, {diff.z.toFixed(2)})
                      </div>
                      <div className="text-muted-foreground">
                        Magnitud: {calculateMagnitude(diff as any).toFixed(3)}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <Separator className="bg-border" />
              <div>
                <h4 className="text-sm font-medium mb-2 text-accent">Vectores Normalizados</h4>
                <div className="space-y-3">
                  {vectors.slice(0, 2).map((v) => {
                    const normalized = normalizeVector(v);
                    return (
                      <div key={v.id} className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: v.color }}
                          />
                          <span className="font-medium text-foreground">{v.name} normalizado</span>
                        </div>
                        <div className="pl-5 space-y-0.5 text-xs text-muted-foreground font-mono">
                          <div>{v.name}̂ = {v.name} / |{v.name}|</div>
                          <div className="text-foreground font-semibold">
                            ({normalized.x.toFixed(3)}, {normalized.y.toFixed(3)}, {normalized.z.toFixed(3)})
                          </div>
                          <div className="text-muted-foreground">
                            Magnitud: {calculateMagnitude(normalized as any).toFixed(3)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-border" />
              <div>
                <h4 className="text-sm font-medium mb-2 text-accent">
                  Ángulo entre {vectors[0].name} y {vectors[1].name}
                </h4>
                {(() => {
                  const angle = calculateAngleBetween(vectors[0], vectors[1]);
                  return (
                    <div className="space-y-1 text-xs text-muted-foreground font-mono">
                      <div>cos(θ) = ({vectors[0].name} · {vectors[1].name}) / (|{vectors[0].name}| × |{vectors[1].name}|)</div>
                      <div>cos(θ) = {angle.cosTheta.toFixed(4)}</div>
                      <div className="text-foreground font-semibold pt-1">
                        θ = {angle.degrees.toFixed(2)}° ({angle.radians.toFixed(4)} rad)
                      </div>
                    </div>
                  );
                })()}
              </div>

              <Separator className="bg-border" />
              <div>
                <h4 className="text-sm font-medium mb-2 text-accent">
                  Proyección de {vectors[0].name} sobre {vectors[1].name}
                </h4>
                {(() => {
                  const proj = projectVector(vectors[0], vectors[1]);
                  return (
                    <div className="space-y-1 text-xs text-muted-foreground font-mono">
                      <div>Proyección escalar = ({vectors[0].name} · {vectors[1].name}) / |{vectors[1].name}|</div>
                      <div className="text-foreground font-semibold">
                        Escalar: {proj.scalar.toFixed(3)}
                      </div>
                      <div className="pt-1">Proyección vectorial = (({vectors[0].name} · {vectors[1].name}) / |{vectors[1].name}|²) × {vectors[1].name}</div>
                      <div className="text-foreground font-semibold">
                        Vector: ({proj.vector.x.toFixed(3)}, {proj.vector.y.toFixed(3)}, {proj.vector.z.toFixed(3)})
                      </div>
                      <div className="text-muted-foreground">
                        Magnitud: {calculateMagnitude(proj.vector as any).toFixed(3)}
                      </div>
                    </div>
                  );
                })()}
              </div>

              <Separator className="bg-border" />
              <div>
                <h4 className="text-sm font-medium mb-2 text-accent">
                  Producto Punto ({vectors[0].name} · {vectors[1].name})
                </h4>
                <div className="space-y-1 text-xs text-muted-foreground font-mono">
                  <div>{vectors[0].name} · {vectors[1].name} = x₁·x₂ + y₁·y₂ + z₁·z₂</div>
                  <div>{vectors[0].name} · {vectors[1].name} = ({vectors[0].x})·({vectors[1].x}) + ({vectors[0].y})·({vectors[1].y}) + ({vectors[0].z})·({vectors[1].z})</div>
                  <div>{vectors[0].name} · {vectors[1].name} = {(vectors[0].x * vectors[1].x).toFixed(2)} + {(vectors[0].y * vectors[1].y).toFixed(2)} + {(vectors[0].z * vectors[1].z).toFixed(2)}</div>
                  <div className="text-foreground font-semibold pt-1">
                    {vectors[0].name} · {vectors[1].name} = {calculateDotProduct(vectors[0], vectors[1]).toFixed(3)}
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />
              <div>
                <h4 className="text-sm font-medium mb-2 text-accent">
                  Producto Cruz ({vectors[0].name} × {vectors[1].name})
                </h4>
                {(() => {
                  const cross = calculateCrossProduct(vectors[0], vectors[1]);
                  const v1 = vectors[0];
                  const v2 = vectors[1];
                  return (
                    <div className="space-y-1 text-xs text-muted-foreground font-mono">
                      <div>{v1.name} × {v2.name} = (y₁z₂ - z₁y₂, z₁x₂ - x₁z₂, x₁y₂ - y₁x₂)</div>
                      <div className="space-y-0.5 pl-2">
                        <div>x: ({v1.y})·({v2.z}) - ({v1.z})·({v2.y}) = {(v1.y * v2.z).toFixed(2)} - {(v1.z * v2.y).toFixed(2)} = {cross.x.toFixed(2)}</div>
                        <div>y: ({v1.z})·({v2.x}) - ({v1.x})·({v2.z}) = {(v1.z * v2.x).toFixed(2)} - {(v1.x * v2.z).toFixed(2)} = {cross.y.toFixed(2)}</div>
                        <div>z: ({v1.x})·({v2.y}) - ({v1.y})·({v2.x}) = {(v1.x * v2.y).toFixed(2)} - {(v1.y * v2.x).toFixed(2)} = {cross.z.toFixed(2)}</div>
                      </div>
                      <div className="text-foreground font-semibold pt-1">
                        Resultado: ({cross.x.toFixed(2)}, {cross.y.toFixed(2)}, {cross.z.toFixed(2)})
                      </div>
                      <div className="text-muted-foreground">
                        Magnitud: {calculateMagnitude(cross as any).toFixed(3)}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
};
