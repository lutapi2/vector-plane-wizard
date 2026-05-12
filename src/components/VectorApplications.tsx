import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Lightbulb, Box, Zap, Cog, Calculator } from "lucide-react";

const fmt = (n: number) => (Number.isFinite(n) ? n.toFixed(2) : "0.00");

type NumField = { key: string; label: string };

const NumInputs = ({
  fields,
  values,
  onChange,
  accent,
}: {
  fields: NumField[];
  values: Record<string, number>;
  onChange: (k: string, v: number) => void;
  accent: string;
}) => (
  <div className="grid grid-cols-3 gap-2">
    {fields.map((f) => (
      <div key={f.key}>
        <label className={`text-[10px] font-semibold uppercase tracking-wide ${accent} block mb-1`}>
          {f.label}
        </label>
        <Input
          type="number"
          step="any"
          value={Number.isNaN(values[f.key]) ? "" : values[f.key]}
          onChange={(e) => onChange(f.key, parseFloat(e.target.value) || 0)}
          className="h-8 text-sm font-mono"
        />
      </div>
    ))}
  </div>
);

const ResultBar = ({
  label,
  value,
  bg,
  accent,
}: {
  label: string;
  value: string;
  bg: string;
  accent: string;
}) => (
  <div className={`mt-2 rounded-md ${bg} border border-border p-2 flex items-center justify-between gap-2`}>
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className={`font-mono text-sm font-bold ${accent} text-right break-all`}>{value}</span>
  </div>
);

// 1. Magnitud (Tensión)
const MagnitudeCalc = ({ accent, bg }: { accent: string; bg: string }) => {
  const [v, setV] = useState({ x: 3, y: 4, z: 0 });
  const m = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
  return (
    <>
      <NumInputs
        fields={[{ key: "x", label: "Fx" }, { key: "y", label: "Fy" }, { key: "z", label: "Fz" }]}
        values={v}
        onChange={(k, val) => setV({ ...v, [k]: val })}
        accent={accent}
      />
      <ResultBar label="|F| = √(x²+y²+z²)" value={`${fmt(m)} N`} bg={bg} accent={accent} />
    </>
  );
};

// 2. Producto Cruz (Estructuras)
const CrossCalc = ({ accent, bg }: { accent: string; bg: string }) => {
  const [a, setA] = useState({ x: 1, y: 0, z: 0 });
  const [b, setB] = useState({ x: 0, y: 1, z: 0 });
  const c = {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
  return (
    <div className="space-y-2">
      <div>
        <p className={`text-[10px] font-semibold mb-1 ${accent}`}>Vector A (viga 1)</p>
        <NumInputs
          fields={[{ key: "x", label: "Ax" }, { key: "y", label: "Ay" }, { key: "z", label: "Az" }]}
          values={a}
          onChange={(k, val) => setA({ ...a, [k]: val })}
          accent={accent}
        />
      </div>
      <div>
        <p className={`text-[10px] font-semibold mb-1 ${accent}`}>Vector B (viga 2)</p>
        <NumInputs
          fields={[{ key: "x", label: "Bx" }, { key: "y", label: "By" }, { key: "z", label: "Bz" }]}
          values={b}
          onChange={(k, val) => setB({ ...b, [k]: val })}
          accent={accent}
        />
      </div>
      <ResultBar
        label="A × B (perpendicular)"
        value={`(${fmt(c.x)}, ${fmt(c.y)}, ${fmt(c.z)})`}
        bg={bg}
        accent={accent}
      />
    </div>
  );
};

// 3. Campo Eléctrico
const FieldCalc = ({ accent, bg }: { accent: string; bg: string }) => {
  const [v, setV] = useState({ x: 100, y: 0, z: 0 });
  const m = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
  const axes = [
    { name: "X", val: Math.abs(v.x) },
    { name: "Y", val: Math.abs(v.y) },
    { name: "Z", val: Math.abs(v.z) },
  ];
  const dom = axes.reduce((a, b) => (b.val > a.val ? b : a));
  return (
    <>
      <NumInputs
        fields={[{ key: "x", label: "Ex" }, { key: "y", label: "Ey" }, { key: "z", label: "Ez" }]}
        values={v}
        onChange={(k, val) => setV({ ...v, [k]: val })}
        accent={accent}
      />
      <ResultBar label="|E|" value={`${fmt(m)} V/m`} bg={bg} accent={accent} />
      <ResultBar
        label="Empuja más en eje"
        value={dom.val === 0 ? "—" : dom.name}
        bg={bg}
        accent={accent}
      />
    </>
  );
};

// 4. Suma de pasos (Robot)
const SumCalc = ({ accent, bg }: { accent: string; bg: string }) => {
  const [s, setS] = useState({
    p1x: 2, p1y: 0, p1z: 0,
    p2x: 0, p2y: 3, p2z: 0,
    p3x: 0, p3y: 0, p3z: 1,
  });
  const set = (k: string, val: number) => setS({ ...s, [k]: val });
  const r = {
    x: s.p1x + s.p2x + s.p3x,
    y: s.p1y + s.p2y + s.p3y,
    z: s.p1z + s.p2z + s.p3z,
  };
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <p className={`text-[10px] font-semibold mb-1 ${accent}`}>Paso {i}</p>
          <NumInputs
            fields={[
              { key: `p${i}x`, label: "x" },
              { key: `p${i}y`, label: "y" },
              { key: `p${i}z`, label: "z" },
            ]}
            values={s as unknown as Record<string, number>}
            onChange={set}
            accent={accent}
          />
        </div>
      ))}
      <ResultBar
        label="Posición final"
        value={`(${fmt(r.x)}, ${fmt(r.y)}, ${fmt(r.z)})`}
        bg={bg}
        accent={accent}
      />
    </div>
  );
};

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
      Calc: MagnitudeCalc,
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
      Calc: CrossCalc,
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
      Calc: FieldCalc,
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
      Calc: SumCalc,
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
            Cada tarjeta explica una aplicación con una analogía simple y trae su propia mini calculadora
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app, index) => {
            const Icon = app.icon;
            const Calc = app.Calc;
            return (
              <Card
                key={index}
                className="p-6 bg-card shadow-[var(--shadow-card)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`${app.bg} ${app.color} p-3 rounded-lg flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 space-y-3 min-w-0">
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

                    <div className="rounded-lg border border-dashed border-border p-3 bg-background/40">
                      <div className={`flex items-center gap-2 mb-3 ${app.color}`}>
                        <Calculator className="w-4 h-4" />
                        <p className="text-xs font-semibold uppercase tracking-wide">
                          Pruébalo tú
                        </p>
                      </div>
                      <Calc accent={app.color} bg={app.bg} />
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-accent/10 rounded-lg border border-accent/20">
          <p className="text-sm text-center text-muted-foreground">
            💡 <strong className="text-foreground">Tip:</strong> Cambia los números en cada calculadora y mira cómo cambia el resultado al instante.
          </p>
        </div>
      </div>
    </div>
  );
};
