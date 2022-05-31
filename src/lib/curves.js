export function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}

export function getLineProgress(a, b, t) {
    return {
        x: lerp(a.x, b.x, t),
        y: lerp(a.y, b.y, t)
    }
}

export function getQuadraticCurveProgress(a, cp, b, t) {
    const p1 = getLineProgress(a, cp, t);
    const p2 = getLineProgress(cp, b, t);

    const res = getLineProgress(p1, p2, t);
    return res;
}

export function getQuadraticCurveTangent(a, cp, b, t) {
    return {
        x: getQuadraticPointTangent(a.x, cp.x, b.x, t),
        y: getQuadraticPointTangent(a.y, cp.y, b.y, t)
    }
}

export function getQuadraticPointTangent(a, cp, b, t) {
    return 2 * (1 - t) * (cp - a) + 2 * (b - cp) * t;
}
