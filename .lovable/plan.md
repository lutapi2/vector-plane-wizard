## VectorLab — Plataforma profesional de álgebra vectorial 3D

Transformación de la "Calculadora de Vectores 3D" en una herramienta educativa de nivel universitario, con dirección visual **Académico Limpio** (azul confiable sobre fondo claro, modo oscuro/claro), exportación 100% en navegador y entrega **por fases**.

### Dirección visual
- **Paleta** (tokens HSL en `index.css`, light + dark): fondo `#fafbfc`, superficies `#e8ecf1`, primario `#3b82f6`, tinta profunda `#0f1b3d`. Ejes con código fijo (X rojo, Y verde, Z azul) para convención matemática.
- **Tipografía**: `@fontsource/outfit` (títulos) + `@fontsource/figtree` (cuerpo) + `@fontsource/jetbrains-mono` (fórmulas/coordenadas). Sin Google Fonts CDN.
- **Estilo**: tarjetas limpias, bordes suaves, radios 0.75rem, animaciones sutiles (`fade-in`, `scale-in`), foco visible para teclado.

### Arquitectura recomendada (modular y escalable)
```text
src/
  lib/vector/           # motor matemático puro (sin React, testeable)
    core.ts             # add, sub, dot, cross, mag, normalize, distance, angle
    advanced.ts         # projection, gram-schmidt, parametric line, plane from vectors
    format.ts           # formateo numérico + pasos LaTeX-like
  lib/export/           # pdf.ts (jspdf), excel.ts (xlsx), capture.ts (canvas WebGL)
  hooks/                # useTheme, useVectorStore (Zustand), useSaveCalculation
  components/
    scene/              # Vector3DCanvas + subcomponentes 3D
    panels/             # paneles de entrada/operaciones/historial
    operations/         # una operación por archivo
    learn/              # tutorial, ejemplos, modo ingeniería
    ui/                 # shadcn (existente)
```
Estado global ligero con **Zustand** para vectores, resultados y ajustes de escena (cuadrícula, planos, escala) → evita prop-drilling y permite que la escena reaccione a operaciones.

### Roadmap por fases

**Fase 1 — Fundamentos visuales + motor 3D (la implemento primero tras aprobar)**
- Tokens de color light/dark + tipografías; `ThemeProvider` con toggle (persistencia en localStorage).
- Layout responsive móvil/tablet/escritorio; navegación por teclado y `aria-label`.
- Motor 3D mejorado: planos XY/XZ/YZ conmutables, cuadrícula configurable, escalas numéricas en ejes, etiquetas dinámicas de coordenadas en puntas de vectores, captura de escena (PNG).
- Extracción del motor matemático a `lib/vector/`.

**Fase 2 — Álgebra vectorial avanzada**
- Vector unitario, proyección de A sobre B (con visualización), distancia entre puntos, ángulo (ya existe, mejorado), comparación avanzada (paralelos/perpendiculares/coplanares).
- Ecuación paramétrica de rectas y generación de planos por dos vectores (render del plano en 3D).
- Ortogonalización **Gram-Schmidt** con pasos.
- Todos los resultados se dibujan en la escena (resultantes destacadas; cruz en rojo).

**Fase 3 — Animaciones educativas paso a paso**
- Reproductor de pasos (play/pausa/siguiente) para suma, resta, punto y cruz, animando flechas en la escena con `requestAnimationFrame`.
- Panel sincronizado fórmula ↔ animación.

**Fase 4 — Aprendizaje e ingeniería**
- Sistema de ejemplos interactivos (cargan vectores + operación).
- Tutorial guiado (onboarding paso a paso sobre la UI real).
- Modo ingeniería con aplicaciones reales (reusa/expande `VectorApplications`).

**Fase 5 — Productividad y exportación**
- Historial avanzado con filtros (por tipo, fecha, búsqueda) sobre la tabla `calculation_history` existente.
- Exportación profesional a **PDF** (jspdf + autotable, incluye captura 3D) y **Excel** (xlsx), todo en cliente.
- Optimización: memoización, lazy-load de la escena, code-splitting de paneles de aprendizaje.

### Priorización (impacto vs. dificultad)
| Prioridad | Característica | Impacto | Dificultad |
|---|---|---|---|
| P0 | Modo oscuro/claro + responsive + a11y | Alto | Baja |
| P0 | Planos, cuadrícula, escalas, etiquetas 3D | Alto | Media |
| P1 | Unitario, proyección, distancia, comparación | Alto | Baja |
| P1 | Gram-Schmidt, recta/plano paramétrico | Alto | Media |
| P2 | Animaciones paso a paso | Alto | Alta |
| P2 | Captura 3D + export PDF/Excel | Alto | Media |
| P3 | Ejemplos + tutorial guiado | Medio | Media |
| P3 | Historial avanzado con filtros | Medio | Baja |

### Nuevos componentes (Fase 1)
- `ThemeProvider` + `ThemeToggle`
- `scene/Vector3DCanvas` (reescrito) con `CoordinatePlanes`, `ConfigurableGrid`, `AxisScales`, `VectorLabel`, `SceneControls` (panel flotante de ajustes)
- `lib/vector/core.ts` y `lib/export/capture.ts`

### Código de ejemplo (funcionalidades clave)

Motor matemático puro:
```ts
// lib/vector/advanced.ts
export const projection = (a: V, b: V) => {
  const k = dot(a, b) / dot(b, b);
  return { x: b.x*k, y: b.y*k, z: b.z*k, scalar: k };
};
export const gramSchmidt = (vs: V[]): V[] => {
  const out: V[] = [];
  for (const v of vs) {
    let w = { ...v };
    for (const u of out) {
      const k = dot(v, u) / dot(u, u);
      w = { x: w.x-u.x*k, y: w.y-u.y*k, z: w.z-u.z*k };
    }
    out.push(w);
  }
  return out;
};
```

Captura de la escena WebGL (clave: `preserveDrawingBuffer`):
```tsx
<Canvas gl={{ preserveDrawingBuffer: true }} onCreated={({gl}) => glRef.current = gl}>
// capture.ts
export const captureScene = (canvas: HTMLCanvasElement, name = "escena.png") => {
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
};
```

Plano coordenado conmutable:
```tsx
const CoordinatePlane = ({ axis, size }: {axis:"xy"|"xz"|"yz"; size:number}) => (
  <mesh rotation={axis==="xz" ? [-Math.PI/2,0,0] : axis==="yz" ? [0,Math.PI/2,0] : [0,0,0]}>
    <planeGeometry args={[size, size]} />
    <meshBasicMaterial color="#3b82f6" transparent opacity={0.06} side={THREE.DoubleSide} />
  </mesh>
);
```

### Notas técnicas
- Mantengo `@react-three/fiber@^8`, `@react-three/drei@^9`, `three` (compatibles con React 18).
- Nuevas dependencias: `zustand`, `jspdf`, `jspdf-autotable`, `xlsx`, `@fontsource/*`.
- No se toca `client.ts`/`types.ts`; el historial sigue usando la tabla `calculation_history` actual (con filtros en cliente).
- Sin backend nuevo: export y captura corren en el navegador.

Tras tu aprobación implemento **Fase 1** completa y te muestro el resultado antes de seguir.