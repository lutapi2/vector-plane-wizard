import { Card } from "@/components/ui/card";
import { Lightbulb, Box, Zap, Cog } from "lucide-react";

export const VectorApplications = () => {
  const applications = [
    {
      icon: Lightbulb,
      title: "Tensión en Cables y Vigas",
      description: "Los vectores representan fuerzas en estructuras. La suma vectorial determina la fuerza resultante, mientras que la magnitud indica la tensión en cada cable.",
      example: "Cable A: (30, 40, 50)N → |A| = 70.71N de tensión",
      color: "text-blue-500"
    },
    {
      icon: Box,
      title: "Estructuras Tridimensionales",
      description: "El producto cruz entre dos vectores genera un vector perpendicular, útil para calcular momentos de torsión y analizar estabilidad estructural.",
      example: "A × B = Vector perpendicular al plano formado por A y B",
      color: "text-cyan-500"
    },
    {
      icon: Zap,
      title: "Campos Eléctricos y Magnéticos",
      description: "Los vectores modelan la dirección e intensidad de campos. La magnitud representa la fuerza del campo en un punto del espacio.",
      example: "Campo E: (100, 0, 50)V/m → Intensidad y dirección del campo",
      color: "text-green-500"
    },
    {
      icon: Cog,
      title: "Trayectorias Robóticas",
      description: "La suma de vectores de movimiento determina la posición final. El producto punto ayuda a calcular trabajo realizado y eficiencia energética.",
      example: "Movimiento: v₁ + v₂ + v₃ = Posición final del robot",
      color: "text-amber-500"
    }
  ];

  return (
    <div className="w-full bg-secondary/30 py-12 px-4 mt-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Aplicaciones Prácticas de Vectores
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Los vectores en el espacio tridimensional son fundamentales para resolver problemas reales en ingeniería, física y tecnología
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app, index) => {
            const Icon = app.icon;
            return (
              <Card 
                key={index} 
                className="p-6 bg-card shadow-[var(--shadow-card)] hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`${app.color} mt-1`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {app.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                      {app.description}
                    </p>
                    <div className="bg-secondary/50 rounded-md p-3 border border-border">
                      <p className="text-xs font-mono text-foreground">
                        {app.example}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-accent/10 rounded-lg border border-accent/20">
          <p className="text-sm text-center text-muted-foreground">
            💡 <strong className="text-foreground">Tip:</strong> Usa esta calculadora para experimentar con vectores y visualizar cómo se aplican estos conceptos en problemas reales del mundo profesional.
          </p>
        </div>
      </div>
    </div>
  );
};
