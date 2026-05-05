import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Sparkles, MousePointer2, Calculator, History } from "lucide-react";

export const WelcomeBanner = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("welcome_seen");
    if (!seen) setOpen(true);
  }, []);

  const dismiss = () => {
    localStorage.setItem("welcome_seen", "1");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <Card className="mb-4 p-4 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-primary/30 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent flex-shrink-0">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">
            ¡Bienvenido! Aprende en 3 pasos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground mt-2">
            <div className="flex items-start gap-2">
              <Calculator className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span><strong className="text-foreground">1.</strong> Agrega vectores con coordenadas X, Y, Z</span>
            </div>
            <div className="flex items-start gap-2">
              <MousePointer2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
              <span><strong className="text-foreground">2.</strong> Rota el plano 3D arrastrando con el mouse</span>
            </div>
            <div className="flex items-start gap-2">
              <History className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span><strong className="text-foreground">3.</strong> Elige una operación en las pestañas</span>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={dismiss}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};
