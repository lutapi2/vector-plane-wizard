import { Vec3 } from "./core";

export const fmt = (n: number, decimals = 2): string => {
  if (Object.is(n, -0)) n = 0;
  return n.toFixed(decimals);
};

export const fmtVec = (v: Vec3, decimals = 2): string =>
  `(${fmt(v.x, decimals)}, ${fmt(v.y, decimals)}, ${fmt(v.z, decimals)})`;

export interface SolutionStep {
  label: string;
  expression: string;
}
