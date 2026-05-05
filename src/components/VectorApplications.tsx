import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Box, Zap, Cog } from "lucide-react";

export const VectorApplications = () => {
  const applications = [
    {
      icon: Lightbulb,
      title: "Tensión en un Cable",
      analogy: "🪢 Imagina una lámpara colgando de un cable. El vector apunta en la dirección del cable y su tamaño dice cuánta fuerza soporta.",
      steps: [
        "Escribe la fuerza como vector (x, y, z)",
        "Calcula la magnitud: |F| = √(x² + y² + z²)",
        "Ese número es la tensión total del cable",
      ],
      example: "Cable: (3, 4, 0) N  →  |F| = √(9+16) = 5 N",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Box,
      title: "Estructuras 3D (vigas)",
      analogy: "📦 Piensa en una caja sostenida por dos vigas. El producto cruz te da una flecha perpendicular que indica hacia dónde 'empuja' la estructura.",
      steps: [
        "Toma dos vectores (las dos vigas)",
        "Haz el producto cruz A × B",
        "El resultado señala la dirección perpendicular (estabilidad)",
      ],
      example: "A=(1,0,0), B=(0,1,0)  →  A×B = (0,0,1) hacia arriba",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      icon: Zap,
      title: "Campos Eléctricos",
      analogy: "⚡ Un campo eléctrico es como el viento: tiene dirección (hacia dónde sopla) y fuerza (qué tan fuerte sopla). Eso es justo un vector.",
      steps: [
        "Cada componente (x, y, z) dice cuánto empuja en esa dirección",
        "La magnitud = qué tan fuerte es el campo",
        "La dirección = hacia dónde se mueven las cargas",
      ],
      example: "E = (100, 0, 0) V/m  →  empuja 100 hacia la derecha",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      icon: Cog,
      title: "Movimiento de un Robot",
      analogy: "🤖 Un robot da varios pasos en distintas direcciones. Sumando todos sus vectores de movimiento sabes exactamente dónde terminó.",
      steps: [
        "Anota cada paso como un vector",
        "Suma todos: paso1 + paso2 + paso3",
        "El resultado es la posición final del robot",
      ],
      example: "(2,0,0)+(0,3,0)+(0,0,1) = (2,3,1) → llegó ahí",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="w-full bg-secondary/30 py-12 px-4 mt-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-3">Aprende con ejemplos reales</Badge>
          <h2 className="text-3xl font-bold text-foreground mb-3">
            ¿Para qué sirven los vectores?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cada tarjeta explica una aplicación con una analogía simple y 3 pasos fáciles de seguir
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app, index) => {
            const Icon = app.icon;
            return (
              <Card
                key={index}
                className="p-6 bg-card shadow-[var(--shadow-card)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`${app.bg} ${app.color} p-3 rounded-lg flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">
                      {app.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {app.analogy}
                    </p>

                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">Pasos sencillos:</p>
                      <ol className="space-y-1.5">
                        {app.steps.map((step, i) => (
                          <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                            <span className={`${app.color} font-bold flex-shrink-0`}>{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div className="bg-secondary/50 rounded-md p-3 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Ejemplo:</p>
                      <p className="text-sm font-mono text-foreground">{app.example}</p>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-accent/10 rounded-lg border border-accent/20">
          <p className="text-sm text-center text-muted-foreground">
            💡 <strong className="text-foreground">Tip:</strong> Prueba estos ejemplos arriba — agrega los vectores y mira cómo se ven en el plano 3D.
          </p>
        </div>
      </div>
    </div>
  );
};
