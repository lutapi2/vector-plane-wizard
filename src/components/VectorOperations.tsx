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
            <div className="space-y-1">
              {vectors.map((v) => (
                <div key={v.id} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: v.color }}
                  />
                  <span className="text-foreground">
                    |{v.name}| = {calculateMagnitude(v).toFixed(3)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          {sum && (
            <div>
              <h4 className="text-sm font-medium mb-2 text-accent">Suma de Vectores</h4>
              <p className="text-sm text-foreground font-mono">
                ({sum.x.toFixed(2)}, {sum.y.toFixed(2)}, {sum.z.toFixed(2)})
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Magnitud: {calculateMagnitude(sum as any).toFixed(3)}
              </p>
            </div>
          )}

          {vectors.length >= 2 && (
            <>
              <Separator className="bg-border" />
              <div>
                <h4 className="text-sm font-medium mb-2 text-accent">
                  Producto Punto ({vectors[0].name} · {vectors[1].name})
                </h4>
                <p className="text-sm text-foreground font-mono">
                  {calculateDotProduct(vectors[0], vectors[1]).toFixed(3)}
                </p>
              </div>

              <Separator className="bg-border" />
              <div>
                <h4 className="text-sm font-medium mb-2 text-accent">
                  Producto Cruz ({vectors[0].name} × {vectors[1].name})
                </h4>
                {(() => {
                  const cross = calculateCrossProduct(vectors[0], vectors[1]);
                  return (
                    <>
                      <p className="text-sm text-foreground font-mono">
                        ({cross.x.toFixed(2)}, {cross.y.toFixed(2)}, {cross.z.toFixed(2)})
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Magnitud: {calculateMagnitude(cross as any).toFixed(3)}
                      </p>
                    </>
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
