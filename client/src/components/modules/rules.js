// ==========================
// EASY RULES (starter / visual / simple)
// ==========================
export const EASY_RULES = [
  {
    id: "even-sum",
    name: "Even Sum",
    description: "Correct if (row + col) is even.",
    fn: (r, c) => (r + c) % 2 === 0,
  },
  {
    id: "odd-sum",
    name: "Odd Sum",
    description: "Correct if (row + col) is odd.",
    fn: (r, c) => (r + c) % 2 === 1,
  },
  {
    id: "even-row",
    name: "Even Row",
    description: "Correct if the row index is even.",
    fn: (r) => r % 2 === 0,
  },
  {
    id: "even-col",
    name: "Even Column",
    description: "Correct if the column index is even.",
    fn: (_, c) => c % 2 === 0,
  },
  {
    id: "top-half",
    name: "Top Half",
    description: "Correct if the tile is in the top half.",
    fn: (r, _, n) => r < n / 2,
  },
  {
    id: "left-half",
    name: "Left Half",
    description: "Correct if the tile is in the left half.",
    fn: (_, c, n) => c < n / 2,
  },
  {
    id: "border",
    name: "Border",
    description: "Correct if the tile is on the edge.",
    fn: (r, c, n) => r === 0 || c === 0 || r === n - 1 || c === n - 1,
  },
  {
    id: "center-tile",
    name: "Center Tile",
    description: "Correct if the tile is the center (odd-sized grid).",
    fn: (r, c, n) => n % 2 === 1 && r === Math.floor(n / 2) && c === Math.floor(n / 2),
  },
  {
    id: "row-less-col",
    name: "Row < Col",
    description: "Correct if row index is less than column index.",
    fn: (r, c) => r < c,
  },
  {
    id: "row-greater-col",
    name: "Row > Col",
    description: "Correct if row index is greater than column index.",
    fn: (r, c) => r > c,
  },
  {
    id: "row-zero",
    name: "Top Row",
    description: "Correct if tile is in the top row.",
    fn: (r) => r === 0,
  },
  {
    id: "col-zero",
    name: "Left Column",
    description: "Correct if tile is in the left column.",
    fn: (_, c) => c === 0,
  },
  {
    id: "row-even-col-even",
    name: "Even Row & Column",
    description: "Correct if both row and column are even.",
    fn: (r, c) => r % 2 === 0 && c % 2 === 0,
  },
  {
    id: "row-odd-col-odd",
    name: "Odd Row & Column",
    description: "Correct if both row and column are odd.",
    fn: (r, c) => r % 2 === 1 && c % 2 === 1,
  },
  {
    id: "main-diagonal",
    name: "Main Diagonal",
    description: "Correct if row equals column.",
    fn: (r, c) => r === c,
  },
];


// ==========================
// MEDIUM RULES (positional + basic shapes)
// ==========================
export const MEDIUM_RULES = [
  {
    id: "anti-diagonal",
    name: "Anti-Diagonal",
    description: "Correct if row + col equals grid size - 1.",
    fn: (r, c, n) => r + c === n - 1,
  },
  {
    id: "inner-square",
    name: "Inner Square",
    description: "Correct if not on the border.",
    fn: (r, c, n) => r > 0 && c > 0 && r < n - 1 && c < n - 1,
  },
  {
    id: "middle-row",
    name: "Middle Row",
    description: "Correct if tile is in the middle row.",
    fn: (r, _, n) => r === Math.floor(n / 2),
  },
  {
    id: "middle-column",
    name: "Middle Column",
    description: "Correct if tile is in the middle column.",
    fn: (_, c, n) => c === Math.floor(n / 2),
  },
  {
    id: "quadrant-1",
    name: "Top-Left Quadrant",
    description: "Correct if in the top-left quadrant.",
    fn: (r, c, n) => r < n / 2 && c < n / 2,
  },
  {
    id: "quadrant-2",
    name: "Top-Right Quadrant",
    description: "Correct if in the top-right quadrant.",
    fn: (r, c, n) => r < n / 2 && c >= n / 2,
  },
  {
    id: "checkerboard",
    name: "Checkerboard",
    description: "Alternating tiles like a chessboard.",
    fn: (r, c) => (r + c) % 2 === 0,
  },
  {
    id: "diamond",
    name: "Diamond",
    description: "Correct if Manhattan distance from center is small.",
    fn: (r, c, n) =>
      Math.abs(r - Math.floor(n / 2)) + Math.abs(c - Math.floor(n / 2)) <= Math.floor(n / 2),
  },
  {
    id: "cross",
    name: "Cross",
    description: "Correct if tile is in middle row or column.",
    fn: (r, c, n) => r === Math.floor(n / 2) || c === Math.floor(n / 2),
  },
  {
    id: "frame",
    name: "Frame",
    description: "Correct if tile is one step in from the border.",
    fn: (r, c, n) => r === 1 || c === 1 || r === n - 2 || c === n - 2,
  },
  {
    id: "row-plus-col-divisible-3",
    name: "Sum Divisible by 3",
    description: "Correct if row + col is divisible by 3.",
    fn: (r, c) => (r + c) % 3 === 0,
  },
  {
    id: "row-times-col-even",
    name: "Product Even",
    description: "Correct if row × col is even.",
    fn: (r, c) => (r * c) % 2 === 0,
  },
  {
    id: "distance-from-center-even",
    name: "Even Distance",
    description: "Correct if distance from center is even.",
    fn: (r, c, n) =>
      (Math.abs(r - Math.floor(n / 2)) + Math.abs(c - Math.floor(n / 2))) % 2 === 0,
  },
  {
    id: "row-mod-3",
    name: "Row mod 3 = 0",
    description: "Correct if row index is divisible by 3.",
    fn: (r) => r % 3 === 0,
  },
  {
    id: "col-mod-3",
    name: "Column mod 3 = 0",
    description: "Correct if column index is divisible by 3.",
    fn: (_, c) => c % 3 === 0,
  },
];


// ==========================
// HARD RULES (math, logic, complex shapes)
// ==========================
const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const isFibonacci = (n) => {
  const isPerfectSquare = (x) => Number.isInteger(Math.sqrt(x));
  return isPerfectSquare(5 * n * n + 4) || isPerfectSquare(5 * n * n - 4);
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

export const HARD_RULES = [
  {
    id: "sum-prime",
    name: "Prime Sum",
    description: "Correct if row + col is a prime number.",
    fn: (r, c) => isPrime(r + c),
  },
  {
    id: "product-prime",
    name: "Prime Product",
    description: "Correct if row × col is prime.",
    fn: (r, c) => isPrime(r * c),
  },
  {
    id: "sum-fibonacci",
    name: "Fibonacci Sum",
    description: "Correct if row + col is a Fibonacci number.",
    fn: (r, c) => isFibonacci(r + c),
  },
  {
    id: "coprime",
    name: "Coprime Coordinates",
    description: "Correct if row and column are coprime.",
    fn: (r, c) => gcd(r, c) === 1,
  },
  {
    id: "distance-prime",
    name: "Prime Distance",
    description: "Correct if distance from center is prime.",
    fn: (r, c, n) =>
      isPrime(Math.abs(r - Math.floor(n / 2)) + Math.abs(c - Math.floor(n / 2))),
  },
  {
    id: "xor-even",
    name: "XOR Parity",
    description: "Correct if exactly one of row or column is even.",
    fn: (r, c) => (r % 2 === 0) !== (c % 2 === 0),
  },
  {
    id: "sum-square",
    name: "Perfect Square Sum",
    description: "Correct if row + col is a perfect square.",
    fn: (r, c) => Number.isInteger(Math.sqrt(r + c)),
  },
  {
    id: "row-power-of-two",
    name: "Row Power of Two",
    description: "Correct if row index is a power of two.",
    fn: (r) => (r & (r - 1)) === 0 && r !== 0,
  },
  {
    id: "col-power-of-two",
    name: "Column Power of Two",
    description: "Correct if column index is a power of two.",
    fn: (_, c) => (c & (c - 1)) === 0 && c !== 0,
  },
  {
    id: "distance-fibonacci",
    name: "Fibonacci Distance",
    description: "Correct if distance from center is Fibonacci.",
    fn: (r, c, n) =>
      isFibonacci(Math.abs(r - Math.floor(n / 2)) + Math.abs(c - Math.floor(n / 2))),
  },
  {
    id: "row-equals-col-plus-one",
    name: "Row = Col + 1",
    description: "Correct if row is exactly one more than column.",
    fn: (r, c) => r === c + 1,
  },
  {
    id: "col-equals-row-plus-one",
    name: "Col = Row + 1",
    description: "Correct if column is exactly one more than row.",
    fn: (r, c) => c === r + 1,
  },
  {
    id: "sum-multiple-of-5",
    name: "Sum Multiple of 5",
    description: "Correct if row + col is divisible by 5.",
    fn: (r, c) => (r + c) % 5 === 0,
  },
  {
    id: "checkerboard-inverse",
    name: "Inverse Checkerboard",
    description: "Opposite of the standard checkerboard.",
    fn: (r, c) => (r + c) % 2 === 1,
  },
  {
    id: "distance-greater-than-half",
    name: "Far From Center",
    description: "Correct if tile is far from the center.",
    fn: (r, c, n) =>
      Math.abs(r - Math.floor(n / 2)) + Math.abs(c - Math.floor(n / 2)) > Math.floor(n / 2),
  },
];

// ==========================
// Combined export if needed
// ==========================
export const RULES = [...EASY_RULES, ...MEDIUM_RULES, ...HARD_RULES];

export function getRuleById(id) {
  return RULES.find((r) => r.id === id) || null;
}
