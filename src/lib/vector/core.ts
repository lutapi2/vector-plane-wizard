// Pure 3D vector math engine — no React, fully testable.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const add = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z });

export const sub = (a: Vec3, b: Vec3): Vec3 => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });

export const scale = (a: Vec3, k: number): Vec3 => ({ x: a.x * k, y: a.y * k, z: a.z * k });

export const dot = (a: Vec3, b: Vec3): number => a.x * b.x + a.y * b.y + a.z * b.z;

export const cross = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});

export const mag = (a: Vec3): number => Math.sqrt(dot(a, a));

export const normalize = (a: Vec3): Vec3 => {
  const m = mag(a);
  if (m === 0) return { x: 0, y: 0, z: 0 };
  return scale(a, 1 / m);
};

export const distance = (a: Vec3, b: Vec3): number => mag(sub(a, b));

/** Angle between two vectors in radians (0..π). */
export const angleRad = (a: Vec3, b: Vec3): number => {
  const ma = mag(a);
  const mb = mag(b);
  if (ma === 0 || mb === 0) return 0;
  const c = Math.max(-1, Math.min(1, dot(a, b) / (ma * mb)));
  return Math.acos(c);
};

export const angleDeg = (a: Vec3, b: Vec3): number => (angleRad(a, b) * 180) / Math.PI;

export const isZero = (a: Vec3, eps = 1e-9): boolean =>
  Math.abs(a.x) < eps && Math.abs(a.y) < eps && Math.abs(a.z) < eps;
