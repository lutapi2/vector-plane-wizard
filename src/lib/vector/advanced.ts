// Advanced vector algebra built on top of core.ts
import { Vec3, dot, cross, sub, scale, mag, normalize, isZero, add } from "./core";

/** Vector projection of a onto b. Returns the projected vector + scalar component. */
export const projection = (a: Vec3, b: Vec3): { vector: Vec3; scalar: number } => {
  const bb = dot(b, b);
  if (bb === 0) return { vector: { x: 0, y: 0, z: 0 }, scalar: 0 };
  const k = dot(a, b) / bb;
  return { vector: scale(b, k), scalar: dot(a, b) / mag(b) };
};

/** Component of a orthogonal to b (rejection). */
export const rejection = (a: Vec3, b: Vec3): Vec3 => sub(a, projection(a, b).vector);

/** Gram-Schmidt orthogonalization. Optionally normalized (orthonormal). */
export const gramSchmidt = (vectors: Vec3[], normalized = false): Vec3[] => {
  const out: Vec3[] = [];
  for (const v of vectors) {
    let w: Vec3 = { ...v };
    for (const u of out) {
      const uu = dot(u, u);
      if (uu === 0) continue;
      w = sub(w, scale(u, dot(v, u) / uu));
    }
    out.push(normalized ? normalize(w) : w);
  }
  return out;
};

export type Relation = "parallel" | "antiparallel" | "perpendicular" | "general" | "degenerate";

/** Compare two vectors: parallel / antiparallel / perpendicular / general. */
export const relation = (a: Vec3, b: Vec3, eps = 1e-6): Relation => {
  if (isZero(a) || isZero(b)) return "degenerate";
  const c = cross(a, b);
  const d = dot(a, b);
  if (isZero(c, eps)) return d > 0 ? "parallel" : "antiparallel";
  if (Math.abs(d) < eps) return "perpendicular";
  return "general";
};

/** Are three vectors coplanar? (scalar triple product ≈ 0) */
export const tripleProduct = (a: Vec3, b: Vec3, c: Vec3): number => dot(a, cross(b, c));
export const areCoplanar = (a: Vec3, b: Vec3, c: Vec3, eps = 1e-6): boolean =>
  Math.abs(tripleProduct(a, b, c)) < eps;

/** Parametric line through point p with direction d: r(t) = p + t·d */
export interface ParametricLine {
  point: Vec3;
  direction: Vec3;
}
export const lineThrough = (p: Vec3, q: Vec3): ParametricLine => ({
  point: p,
  direction: sub(q, p),
});

/** Plane spanned by vectors u, v through a point. Normal = u × v. */
export interface PlaneDef {
  point: Vec3;
  u: Vec3;
  v: Vec3;
  normal: Vec3;
  /** Coefficients of ax + by + cz = d */
  a: number;
  b: number;
  c: number;
  d: number;
}
export const planeFromVectors = (u: Vec3, v: Vec3, point: Vec3 = { x: 0, y: 0, z: 0 }): PlaneDef => {
  const n = cross(u, v);
  return {
    point,
    u,
    v,
    normal: n,
    a: n.x,
    b: n.y,
    c: n.z,
    d: dot(n, point),
  };
};

export { add };
