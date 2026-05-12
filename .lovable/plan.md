## Objetivo
Agregar una mini calculadora interactiva debajo de cada una de las 4 tarjetas en `VectorApplications.tsx`, usando exactamente la fórmula explicada en esa tarjeta.

## Calculadoras por aplicación

**1. Tensión en un Cable** — Magnitud
- Inputs: `x`, `y`, `z` (componentes de la fuerza)
- Fórmula: `|F| = √(x² + y² + z²)`
- Output: tensión total en N

**2. Estructuras 3D (vigas)** — Producto Cruz
- Inputs: vector A (Ax, Ay, Az) y vector B (Bx, By, Bz)
- Fórmula: `A × B`
- Output: vector perpendicular `(x, y, z)`

**3. Campos Eléctricos** — Magnitud + dirección dominante
- Inputs: `Ex`, `Ey`, `Ez`
- Output: magnitud `|E|` en V/m + eje dominante (hacia dónde empuja más)

**4. Movimiento de un Robot** — Suma de vectores
- Inputs: hasta 3 pasos (x, y, z) con botón "agregar paso" opcional (mantener simple: 3 pasos fijos)
- Fórmula: `paso1 + paso2 + paso3`
- Output: posición final `(x, y, z)`

## Diseño UI
- Componente reutilizable `MiniCalculator` dentro del mismo archivo, o renderizado inline por tipo (`magnitude` | `cross` | `field` | `sum`).
- Aparece debajo del bloque "Ejemplo:" en cada tarjeta, separado por un divisor sutil.
- Inputs numéricos compactos (`Input` shadcn, `type="number"`, ancho pequeño con label x/y/z arriba).
- Resultado destacado en una caja con el color de la tarjeta (`app.color` / `app.bg`) y fuente monoespaciada.
- Cálculo en vivo (`useState` + cálculo derivado, sin botón "calcular").
- Valores iniciales = los del ejemplo de cada tarjeta, para que el usuario vea el resultado coincidiendo con el ejemplo apenas carga.

## Detalles técnicos
- Solo cambios de frontend en `src/components/VectorApplications.tsx`.
- Usar tokens semánticos de Tailwind (sin colores hardcodeados nuevos).
- Sin tocar lógica de negocio, ni backend, ni el componente `VectorOperations`.
- Resultados formateados a 2 decimales con un helper local.
