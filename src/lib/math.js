const PI = Math.PI;
const sin = Math.sin;
const sqrt = Math.sqrt;
const random = Math.random;
const exp = Math.exp;
const pow = Math.pow;

export function calculateSineGraphByMinMax(max, min, angle) {
    return ((max - min) / 2) * sin(angle) + (max + min) / 2;
}

/**
 * Normal Distribution between 0 and 1
 * @return number between 0 and 1
 */
export function randomNormaldistributionBM() {
    let u = 0,
        v = 0;
    while (u === 0) u = random();
    while (v === 0) v = random();
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    num = num / 10 + 0.5;
    if (num > 1 || num < 0) return randomNormaldistributionBM();
    return num;
}
