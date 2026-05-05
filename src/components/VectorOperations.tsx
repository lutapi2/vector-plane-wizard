import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Vector } from "./VectorInput";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Ruler, Plus, Minus, Sigma, Compass, Triangle, ArrowRight, Info } from "lucide-react";

interface VectorOperationsProps {
  vectors: Vector[];
}

const mag = (v: { x: number; y: number; z: number }) =>
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

const dot = (a: Vector, b: Vector) => a.x * b.x + a.y * b.y + a.z * b.z;

const cross = (a: Vector, b: Vector) => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

const fmt = (n: number) => n.toFixed(2);

const ResultBox = ({ label, value, hint }: { label: string; value: string; hint?: string }) => (
  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
    <div className="text-xs text-muted-foreground mb-1">{label}</div>
    <div className="font-mono text-base text-foreground font-semibold break-all">{value}</div>
    {hint && <div className="text-xs text-muted-foreground mt-1">{hint}</div>}
  </div>
);

const Step = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs font-mono text-muted-foreground">{children}</div>
);

const VectorPicker = ({
  label,
  value,
  onChange,
  vectors,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  vectors: Vector[];
}) => (
  <div className="flex-1">
    <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="bg-input">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {vectors.map((v) => (
          <SelectItem key={v.id} value={v.id}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }} />
              {v.name} ({v.x}, {v.y}, {v.z})
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
);

export const VectorOperations = ({ vectors }: VectorOperationsProps) => {
  const [aId, setAId] = useState<string>("");
  const [bId, setBId] = useState<string>("");

  if (vectors.length === 0) {
    return (
      <Card className="p-6 bg-card text-center">
        <Sigma className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Agrega al menos un vector para comenzar a operar
        </p>
      </Card>
    );
  }

  const a = vectors.find((v) => v.id === aId) || vectors[0];
  const b = vectors.find((v) => v.id === bId) || vectors[1] || vectors[0];
  const hasTwo = vectors.length >= 2;

  return (
    <TooltipProvider>
      <Card className="p-4 bg-card shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sigma className="w-5 h-5 text-primary" />
            Operaciones Interactivas
          </h3>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              Selecciona los vectores y la operación. Cada pestaña explica el procedimiento paso a paso.
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Vector pickers */}
        <div className="flex gap-2 mb-4 p-3 rounded-lg bg-muted/40">
          <VectorPicker label="Vector A" value={a.id} onChange={setAId} vectors={vectors} />
          {hasTwo && (
            <VectorPicker label="Vector B" value={b.id} onChange={setBId} vectors={vectors} />
          )}
        </div>

        <Tabs defaultValue="magnitud" className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-1 h-auto bg-muted/40 p-1">
            <TabsTrigger value="magnitud" className="text-xs flex flex-col gap-1 py-2">
              <Ruler className="w-4 h-4" />
              Magnitud
            </TabsTrigger>
            <TabsTrigger value="suma" className="text-xs flex flex-col gap-1 py-2" disabled={!hasTwo}>
              <Plus className="w-4 h-4" />
              Suma
            </TabsTrigger>
            <TabsTrigger value="resta" className="text-xs flex flex-col gap-1 py-2" disabled={!hasTwo}>
              <Minus className="w-4 h-4" />
              Resta
            </TabsTrigger>
            <TabsTrigger value="dot" className="text-xs flex flex-col gap-1 py-2" disabled={!hasTwo}>
              <Sigma className="w-4 h-4" />
              Punto
            </TabsTrigger>
            <TabsTrigger value="cross" className="text-xs flex flex-col gap-1 py-2" disabled={!hasTwo}>
              <Triangle className="w-4 h-4" />
              Cruz
            </TabsTrigger>
            <TabsTrigger value="angulo" className="text-xs flex flex-col gap-1 py-2" disabled={!hasTwo}>
              <Compass className="w-4 h-4" />
              Ángulo
            </TabsTrigger>
          </TabsList>

          {/* Magnitud */}
          <TabsContent value="magnitud" className="mt-4 space-y-3">
            <Badge variant="secondary" className="mb-1">📐 Longitud del vector A</Badge>
            <Step>|{a.name}| = √(x² + y² + z²)</Step>
            <Step>= √(({a.x})² + ({a.y})² + ({a.z})²)</Step>
            <Step>= √({fmt(a.x * a.x + a.y * a.y + a.z * a.z)})</Step>
            <ResultBox
              label={`Magnitud de ${a.name}`}
              value={`|${a.name}| = ${fmt(mag(a))}`}
              hint="Representa la longitud del vector en el espacio"
            />
          </TabsContent>

          {/* Suma */}
          {hasTwo && (
            <TabsContent value="suma" className="mt-4 space-y-3">
              <Badge variant="secondary">➕ A + B</Badge>
              {(() => {
                const r = { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
                return (
                  <>
                    <Step>x: {a.x} + ({b.x}) = {fmt(r.x)}</Step>
                    <Step>y: {a.y} + ({b.y}) = {fmt(r.y)}</Step>
                    <Step>z: {a.z} + ({b.z}) = {fmt(r.z)}</Step>
                    <ResultBox
                      label={`${a.name} + ${b.name}`}
                      value={`(${fmt(r.x)}, ${fmt(r.y)}, ${fmt(r.z)})`}
                      hint={`Magnitud resultante: ${fmt(mag(r))}`}
                    />
                  </>
                );
              })()}
            </TabsContent>
          )}

          {/* Resta */}
          {hasTwo && (
            <TabsContent value="resta" className="mt-4 space-y-3">
              <Badge variant="secondary">➖ A − B</Badge>
              {(() => {
                const r = { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
                return (
                  <>
                    <Step>x: {a.x} − ({b.x}) = {fmt(r.x)}</Step>
                    <Step>y: {a.y} − ({b.y}) = {fmt(r.y)}</Step>
                    <Step>z: {a.z} − ({b.z}) = {fmt(r.z)}</Step>
                    <ResultBox
                      label={`${a.name} − ${b.name}`}
                      value={`(${fmt(r.x)}, ${fmt(r.y)}, ${fmt(r.z)})`}
                      hint={`Distancia entre vectores: ${fmt(mag(r))}`}
                    />
                  </>
                );
              })()}
            </TabsContent>
          )}

          {/* Dot */}
          {hasTwo && (
            <TabsContent value="dot" className="mt-4 space-y-3">
              <Badge variant="secondary">• Producto Punto (escalar)</Badge>
              <Step>A · B = x₁x₂ + y₁y₂ + z₁z₂</Step>
              <Step>= ({a.x})({b.x}) + ({a.y})({b.y}) + ({a.z})({b.z})</Step>
              <Step>= {fmt(a.x * b.x)} + {fmt(a.y * b.y)} + {fmt(a.z * b.z)}</Step>
              <ResultBox
                label={`${a.name} · ${b.name}`}
                value={`${fmt(dot(a, b))}`}
                hint={
                  dot(a, b) > 0
                    ? "Positivo → ángulo menor a 90° (similar dirección)"
                    : dot(a, b) < 0
                    ? "Negativo → ángulo mayor a 90° (sentidos opuestos)"
                    : "Cero → vectores perpendiculares"
                }
              />
            </TabsContent>
          )}

          {/* Cross */}
          {hasTwo && (
            <TabsContent value="cross" className="mt-4 space-y-3">
              <Badge variant="secondary">× Producto Cruz (vector perpendicular)</Badge>
              {(() => {
                const c = cross(a, b);
                return (
                  <>
                    <Step>x: ({a.y})({b.z}) − ({a.z})({b.y}) = {fmt(c.x)}</Step>
                    <Step>y: ({a.z})({b.x}) − ({a.x})({b.z}) = {fmt(c.y)}</Step>
                    <Step>z: ({a.x})({b.y}) − ({a.y})({b.x}) = {fmt(c.z)}</Step>
                    <ResultBox
                      label={`${a.name} × ${b.name}`}
                      value={`(${fmt(c.x)}, ${fmt(c.y)}, ${fmt(c.z)})`}
                      hint={`Magnitud (área del paralelogramo): ${fmt(mag(c))}`}
                    />
                  </>
                );
              })()}
            </TabsContent>
          )}

          {/* Ángulo */}
          {hasTwo && (
            <TabsContent value="angulo" className="mt-4 space-y-3">
              <Badge variant="secondary">📐 Ángulo entre A y B</Badge>
              {(() => {
                const d = dot(a, b);
                const ma = mag(a);
                const mb = mag(b);
                const cosT = ma && mb ? d / (ma * mb) : 0;
                const rad = Math.acos(Math.max(-1, Math.min(1, cosT)));
                const deg = (rad * 180) / Math.PI;
                return (
                  <>
                    <Step>cos(θ) = (A · B) / (|A| × |B|)</Step>
                    <Step>cos(θ) = {fmt(d)} / ({fmt(ma)} × {fmt(mb)}) = {cosT.toFixed(4)}</Step>
                    <ResultBox
                      label="Ángulo"
                      value={`θ = ${fmt(deg)}°`}
                      hint={`${rad.toFixed(4)} radianes`}
                    />
                  </>
                );
              })()}
            </TabsContent>
          )}
        </Tabs>

        {/* Footer with all magnitudes */}
        <div className="mt-4 pt-3 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2">Resumen de vectores:</div>
          <div className="flex flex-wrap gap-2">
            {vectors.map((v) => (
              <Badge key={v.id} variant="outline" className="font-mono text-xs">
                <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: v.color }} />
                {v.name} → |{fmt(mag(v))}|
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};
