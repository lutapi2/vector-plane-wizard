import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";

export interface Vector {
  id: string;
  x: number;
  y: number;
  z: number;
  color: string;
  name: string;
}

interface VectorInputProps {
  vectors: Vector[];
  onVectorsChange: (vectors: Vector[]) => void;
}

const COLORS = [
  "#3b82f6", // blue
  "#06b6d4", // cyan
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
];

export const VectorInput = ({ vectors, onVectorsChange }: VectorInputProps) => {
  const [newVector, setNewVector] = useState({ x: "1", y: "1", z: "1" });

  const addVector = () => {
    const x = parseFloat(newVector.x) || 0;
    const y = parseFloat(newVector.y) || 0;
    const z = parseFloat(newVector.z) || 0;

    const newVec: Vector = {
      id: crypto.randomUUID(),
      x,
      y,
      z,
      color: COLORS[vectors.length % COLORS.length],
      name: `v${vectors.length + 1}`,
    };

    onVectorsChange([...vectors, newVec]);
    setNewVector({ x: "1", y: "1", z: "1" });
  };

  const removeVector = (id: string) => {
    onVectorsChange(vectors.filter((v) => v.id !== id));
  };

  const updateVector = (id: string, axis: "x" | "y" | "z", value: string) => {
    onVectorsChange(
      vectors.map((v) =>
        v.id === id ? { ...v, [axis]: parseFloat(value) || 0 } : v
      )
    );
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-card shadow-[var(--shadow-card)]">
        <h3 className="text-lg font-semibold mb-3 text-foreground">Agregar Vector</h3>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div>
            <Label htmlFor="new-x" className="text-sm text-muted-foreground">X</Label>
            <Input
              id="new-x"
              type="number"
              step="0.1"
              value={newVector.x}
              onChange={(e) => setNewVector({ ...newVector, x: e.target.value })}
              className="bg-input border-border"
            />
          </div>
          <div>
            <Label htmlFor="new-y" className="text-sm text-muted-foreground">Y</Label>
            <Input
              id="new-y"
              type="number"
              step="0.1"
              value={newVector.y}
              onChange={(e) => setNewVector({ ...newVector, y: e.target.value })}
              className="bg-input border-border"
            />
          </div>
          <div>
            <Label htmlFor="new-z" className="text-sm text-muted-foreground">Z</Label>
            <Input
              id="new-z"
              type="number"
              step="0.1"
              value={newVector.z}
              onChange={(e) => setNewVector({ ...newVector, z: e.target.value })}
              className="bg-input border-border"
            />
          </div>
        </div>
        <Button onClick={addVector} className="w-full bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Agregar Vector
        </Button>
      </Card>

      <div className="space-y-2">
        {vectors.map((vector) => (
          <Card key={vector.id} className="p-3 bg-card shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: vector.color }}
                />
                <span className="font-semibold text-foreground">{vector.name}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeVector(vector.id)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                step="0.1"
                value={vector.x}
                onChange={(e) => updateVector(vector.id, "x", e.target.value)}
                className="bg-input border-border text-sm"
              />
              <Input
                type="number"
                step="0.1"
                value={vector.y}
                onChange={(e) => updateVector(vector.id, "y", e.target.value)}
                className="bg-input border-border text-sm"
              />
              <Input
                type="number"
                step="0.1"
                value={vector.z}
                onChange={(e) => updateVector(vector.id, "z", e.target.value)}
                className="bg-input border-border text-sm"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
