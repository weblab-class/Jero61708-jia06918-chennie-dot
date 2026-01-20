export const RULES = [
  {
    id: "even-sum",
    name: "Even Sum",
    description: "A tile is correct if (row + col) is even.",
    fn: (r, c) => (r + c) % 2 === 0,
  },
  {
    id: "diagonal",
    name: "Diagonal",
    description: "A tile is correct if row === col.",
    fn: (r, c) => r === c,
  },
  {
    id: "border",
    name: "Border",
    description: "A tile is correct if it is on the edge of the grid.",
    fn: (r, c, n) => r === 0 || c === 0 || r === n - 1 || c === n - 1,
  },
];

// Helpful lookup
export function getRuleById(id) {
  return RULES.find((r) => r.id === id) || null;
}
