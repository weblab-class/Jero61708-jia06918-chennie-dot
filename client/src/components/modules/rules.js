/*Helpers*/
const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

const isFibonacci = (n) => {
  const isSquare = (x) => Number.isInteger(Math.sqrt(x));
  return isSquare(5 * n * n + 4) || isSquare(5 * n * n - 4);
};

/*EASY (5x5)*/
export const EASY_RULES = [
  { id: "even-sum", name: "Even Sum", description: "Correct if (row + column) is even.", fn: (r, c) => ((r+1)+(c+1)) % 2 === 0 },
  { id: "odd-row", name: "Odd Row", description: "Correct if row number is odd.", fn: (r) => (r+1) % 2 === 1 },
  { id: "odd-column", name: "Odd Column", description: "Correct if column number is odd.", fn: (_, c) => (c+1) % 2 === 1 },
  { id: "border", name: "Border", description: "Correct if tile is on the edge.", fn: (r, c, n) => r===0||c===0||r===n-1||c===n-1 },
  { id: "main-diagonal", name: "Main Diagonal", description: "Correct if row equals column.", fn: (r, c) => r === c },
  { id: "anti-diagonal", name: "Anti Diagonal", description: "Correct if row + column equals grid size - 1.", fn: (r, c, n) => r + c === n - 1 },
  { id: "center-tile", name: "Center Tile", description: "Correct if tile is the center (for odd-sized grids).", fn: (r, c, n) => r===Math.floor(n/2)&&c===Math.floor(n/2) },
  { id: "top-half", name: "Top Half", description: "Correct if tile is in the top half.", fn: (r, _, n) => r < Math.floor(n/2) },
  { id: "left-half", name: "Left Half", description: "Correct if tile is in the left half.", fn: (_, c, n) => c < Math.floor(n/2) },
  { id: "row-multiple-3", name: "Row Multiple of 3", description: "Correct if row number is a multiple of 3.", fn: (r) => (r+1) % 3 === 0 },
  { id: "col-multiple-3", name: "Column Multiple of 3", description: "Correct if column number is a multiple of 3.", fn: (_, c) => (c+1) % 3 === 0 },
  { id: "corner-tiles", name: "Corners", description: "Correct if tile is in a corner.", fn: (r, c, n) => (r===0&&c===0)||(r===0&&c===n-1)||(r===n-1&&c===0)||(r===n-1&&c===n-1) },
  { id: "sum-less-than-6", name: "Small Sum", description: "Correct if row+column < 6.", fn: (r, c) => (r+1)+(c+1) < 6 },
  { id: "checkerboard", name: "Checkerboard", description: "Alternating tiles like a checkerboard.", fn: (r, c) => (r+c) % 2 === 0 },
];

/*MEDIUM (6x6)*/
export const MEDIUM_RULES = [
  { id: "even-row", name: "Even Row", description: "Correct if row number is even.", fn: (r) => (r+1) % 2 === 0 },
  { id: "even-column", name: "Even Column", description: "Correct if column number is even.", fn: (_, c) => (c+1) % 2 === 0 },
  { id: "row-greater", name: "Row > Column", description: "Correct if row number is greater than column number.", fn: (r, c) => r+1 > c+1 },
  { id: "upper-triangle", name: "Upper Triangle", description: "Correct if tile is above main diagonal.", fn: (r, c) => r < c },
  { id: "lower-triangle", name: "Lower Triangle", description: "Correct if tile is below main diagonal.", fn: (r, c) => r > c },
  { id: "near-diagonal", name: "Near Diagonal", description: "Correct if tile is on or near the main diagonal.", fn: (r, c) => Math.abs(r-c) <= 1 },
  { id: "outer-ring", name: "Outer Ring", description: "Correct if tile is on the outer ring.", fn: (r, c, n) => r===0||c===0||r===n-1||c===n-1 },
  { id: "inner-ring", name: "Inner Ring", description: "Correct if tile is one step in from the outer ring.", fn: (r, c, n) => r===1||c===1||r===n-2||c===n-2 },
  { id: "sum-multiple-3", name: "Sum Multiple of 3", description: "Correct if row+column divisible by 3.", fn: (r, c) => ((r+1)+(c+1)) % 3 === 0 },
  { id: "sum-multiple-4", name: "Sum Multiple of 4", description: "Correct if row+column divisible by 4.", fn: (r, c) => ((r+1)+(c+1)) % 4 === 0 },
  { id: "prime-row", name: "Prime Row", description: "Correct if row number is prime.", fn: (r) => isPrime(r+1) },
  { id: "prime-column", name: "Prime Column", description: "Correct if column number is prime.", fn: (_, c) => isPrime(c+1) },
  { id: "2x2-checker", name: "2×2 Blocks", description: "Checkerboard pattern in 2x2 blocks.", fn: (r, c) => Math.floor(r/2) % 2 === Math.floor(c/2) % 2 },
  { id: "row-col-parity", name: "Same Parity", description: "Correct if row and column have the same parity.", fn: (r, c) => (r+1)%2 === (c+1)%2 },
  { id: "distance-2", name: "Distance ≥ 2", description: "Correct if row and column differ by at least 2.", fn: (r, c) => Math.abs(r-c) >= 2 },
];

/*HARD (7x7)*/
export const HARD_RULES = [
  { id: "prime-sum", name: "Prime Sum", description: "Correct if row+column is prime.", fn: (r, c) => isPrime((r+1)+(c+1)) },
  { id: "fibonacci-sum", name: "Fibonacci Sum", description: "Correct if row+column is Fibonacci.", fn: (r, c) => isFibonacci((r+1)+(c+1)) },
  { id: "coprime", name: "Coprime", description: "Correct if row and column are coprime.", fn: (r, c) => gcd(r+1,c+1) === 1 },
  { id: "center-cross", name: "Center Cross", description: "Correct if tile is in center row or column.", fn: (r, c, n) => r===Math.floor(n/2)||c===Math.floor(n/2) },
  { id: "diamond", name: "Diamond", description: "Correct if tile is in a diamond shape from center.", fn: (r, c, n) => Math.abs(r-Math.floor(n/2))+Math.abs(c-Math.floor(n/2)) <= 2 },
  { id: "manhattan-3", name: "Manhattan = 3", description: "Correct if Manhattan distance from center is 3.", fn: (r, c, n) => Math.abs(r-Math.floor(n/2))+Math.abs(c-Math.floor(n/2)) === 3 },
  { id: "xor-parity", name: "XOR Parity", description: "Correct if row and column have opposite parity.", fn: (r, c) => ((r+1)%2) !== ((c+1)%2) },
  { id: "row-mod-4", name: "Row mod 4", description: "Correct if row mod 4 equals column mod 4.", fn: (r, c) => (r+1)%4 === (c+1)%4 },
  { id: "outer-two-rings", name: "Outer Two Rings", description: "Correct if tile is in the two outermost rings.", fn: (r, c, n) => r<=1||c<=1||r>=n-2||c>=n-2 },
  { id: "center-square", name: "Center 3×3", description: "Correct if tile is in the 3x3 center square.", fn: (r, c, n) => Math.abs(r-Math.floor(n/2))<=1 && Math.abs(c-Math.floor(n/2))<=1 },
  { id: "sum-greater-10", name: "Large Sum", description: "Correct if row+column > 10.", fn: (r, c) => (r+1)+(c+1) > 10 },
  { id: "row-times-col-even", name: "Product Even", description: "Correct if row*column is even.", fn: (r, c) => ((r+1)*(c+1)) % 2 === 0 },
  { id: "row-times-col-prime", name: "Product Prime", description: "Correct if row*column is prime.", fn: (r, c) => isPrime((r+1)*(c+1)) },
  { id: "knight-like", name: "Knight-ish", description: "Correct if |row-col| = 2.", fn: (r, c) => Math.abs((r+1)-(c+1)) === 2 },
  { id: "mod-3-opposite", name: "Opposite mod 3", description: "Correct if (row mod 3 + col mod 3) = 3.", fn: (r, c) => ((r+1)%3+(c+1)%3) === 3 },
];

/*Combined export*/
export const RULES = [...EASY_RULES, ...MEDIUM_RULES, ...HARD_RULES];

export function getRuleById(id) {
  return RULES.find((r) => r.id === id) || null;
}
