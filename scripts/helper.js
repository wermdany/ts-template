import path from "path";

export const ROOT_PATH = path.resolve(__filename, "../");

export function resolve(p) {
  return path.resolve(ROOT_PATH, p);
}

export function join(p) {
  return path.join(p);
}
