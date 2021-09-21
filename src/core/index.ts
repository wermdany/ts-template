export function add(a: number, b: number): number {
  return a + b;
}

export function str(m: string): string {
  const a = { a: 1, b: 2 };
  const keys = Object.keys(a);
  return `aaa${m}${keys.join(".")}`;
}
