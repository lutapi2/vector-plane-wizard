import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MousePointer2, ZoomIn, Move3d, X, HelpCircle } from "lucide-react";
import { Vector } from "./VectorInput";

interface CanvasGuideProps {
  vectors: Vector[];
}

export const CanvasGuide = ({ vectors }: CanvasGuideProps) => {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Axis legend - top left */}
      <div className="absolute top-3 left-3 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg animate-fade-in">
        <div className="text-xs font-semibold text-muted-foreground mb-2">Ejes</div>
        <div className="space-y-1 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-red-500" /> <span className="text-red-500 font-bold">X</span>
            <span className="text-muted-foreground">→ horizontal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-green-500" /> <span className="text-green-500 font-bold">Y</span>
            <span className="text-muted-foreground">→ vertical</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 bg-blue-500" /> <span className="text-blue-500 font-bold">Z</span>
            <span className="text-muted-foreground">→ profundidad</span>
          </div>
        </div>
      </div>

      {/* Vector list - top right */}
      {vectors.length > 0 && (
        <div className="absolute top-[3.75rem] right-3 z-10 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg max-w-[200px] animate-fade-in">
          <div className="text-xs font-semibold text-muted-foreground mb-2">
            Vectores activos ({vectors.length})
          </div>
          <div className="space-y-1">
            {vectors.map((v) => (
              <div key={v.id} className="flex items-center gap-2 text-xs font-mono">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: v.color }}
                />
                <span className="text-foreground font-semibold">{v.name}</span>
                <span className="text-muted-foreground truncate">
                  ({v.x},{v.y},{v.z})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Controls help - bottom */}
      {open ? (
        <Card className="absolute bottom-3 left-3 right-3 z-10 p-3 bg-card/85 backdrop-blur-sm border-primary/30 animate-fade-in">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="text-xs font-semibold text-primary mb-2 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                Cómo interactuar con el plano 3D
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MousePointer2 className="w-4 h-4 text-accent flex-shrink-0" />
                  <span><strong className="text-foreground">Clic + arrastrar:</strong> rotar vista</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ZoomIn className="w-4 h-4 text-accent flex-shrink-0" />
                  <span><strong className="text-foreground">Rueda del mouse:</strong> acercar/alejar</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Move3d className="w-4 h-4 text-accent flex-shrink-0" />
                  <span><strong className="text-foreground">Clic derecho:</strong> desplazar</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={() => setOpen(false)}
            >
              <X className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-3 right-3 z-10 bg-card/80 backdrop-blur-sm"
          onClick={() => setOpen(true)}
        >
          <HelpCircle className="w-4 h-4 mr-1" />
          Ayuda
        </Button>
      )}
    </>
  );
};
