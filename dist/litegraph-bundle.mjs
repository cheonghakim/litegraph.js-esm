var Be = Object.defineProperty;
var ke = (e, t, r) =>
    t in e
        ? Be(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
        : (e[t] = r);
var k = (e, t, r) => ke(e, typeof t != "symbol" ? t + "" : t, r);
function earcut(e, t, r = 2) {
    const n = t && t.length,
        s = n ? t[0] * r : e.length;
    let a = linkedList(e, 0, s, r, !0);
    const o = [];
    if (!a || a.next === a.prev) return o;
    let l, c, u;
    if ((n && (a = eliminateHoles(e, t, a, r)), e.length > 80 * r)) {
        (l = 1 / 0), (c = 1 / 0);
        let h = -1 / 0,
            f = -1 / 0;
        for (let d = r; d < s; d += r) {
            const p = e[d],
                _ = e[d + 1];
            p < l && (l = p),
                _ < c && (c = _),
                p > h && (h = p),
                _ > f && (f = _);
        }
        (u = Math.max(h - l, f - c)), (u = u !== 0 ? 32767 / u : 0);
    }
    return earcutLinked(a, o, r, l, c, u, 0), o;
}
function linkedList(e, t, r, n, s) {
    let a;
    if (s === signedArea(e, t, r, n) > 0)
        for (let o = t; o < r; o += n)
            a = insertNode((o / n) | 0, e[o], e[o + 1], a);
    else
        for (let o = r - n; o >= t; o -= n)
            a = insertNode((o / n) | 0, e[o], e[o + 1], a);
    return a && equals$6(a, a.next) && (removeNode(a), (a = a.next)), a;
}
function filterPoints(e, t) {
    if (!e) return e;
    t || (t = e);
    let r = e,
        n;
    do
        if (
            ((n = !1),
            !r.steiner &&
                (equals$6(r, r.next) || area(r.prev, r, r.next) === 0))
        ) {
            if ((removeNode(r), (r = t = r.prev), r === r.next)) break;
            n = !0;
        } else r = r.next;
    while (n || r !== t);
    return t;
}
function earcutLinked(e, t, r, n, s, a, o) {
    if (!e) return;
    !o && a && indexCurve(e, n, s, a);
    let l = e;
    for (; e.prev !== e.next; ) {
        const c = e.prev,
            u = e.next;
        if (a ? isEarHashed(e, n, s, a) : isEar(e)) {
            t.push(c.i, e.i, u.i), removeNode(e), (e = u.next), (l = u.next);
            continue;
        }
        if (((e = u), e === l)) {
            o
                ? o === 1
                    ? ((e = cureLocalIntersections(filterPoints(e), t)),
                      earcutLinked(e, t, r, n, s, a, 2))
                    : o === 2 && splitEarcut(e, t, r, n, s, a)
                : earcutLinked(filterPoints(e), t, r, n, s, a, 1);
            break;
        }
    }
}
function isEar(e) {
    const t = e.prev,
        r = e,
        n = e.next;
    if (area(t, r, n) >= 0) return !1;
    const s = t.x,
        a = r.x,
        o = n.x,
        l = t.y,
        c = r.y,
        u = n.y,
        h = Math.min(s, a, o),
        f = Math.min(l, c, u),
        d = Math.max(s, a, o),
        p = Math.max(l, c, u);
    let _ = n.next;
    for (; _ !== t; ) {
        if (
            _.x >= h &&
            _.x <= d &&
            _.y >= f &&
            _.y <= p &&
            pointInTriangleExceptFirst(s, l, a, c, o, u, _.x, _.y) &&
            area(_.prev, _, _.next) >= 0
        )
            return !1;
        _ = _.next;
    }
    return !0;
}
function isEarHashed(e, t, r, n) {
    const s = e.prev,
        a = e,
        o = e.next;
    if (area(s, a, o) >= 0) return !1;
    const l = s.x,
        c = a.x,
        u = o.x,
        h = s.y,
        f = a.y,
        d = o.y,
        p = Math.min(l, c, u),
        _ = Math.min(h, f, d),
        E = Math.max(l, c, u),
        m = Math.max(h, f, d),
        b = zOrder(p, _, t, r, n),
        L = zOrder(E, m, t, r, n);
    let T = e.prevZ,
        g = e.nextZ;
    for (; T && T.z >= b && g && g.z <= L; ) {
        if (
            (T.x >= p &&
                T.x <= E &&
                T.y >= _ &&
                T.y <= m &&
                T !== s &&
                T !== o &&
                pointInTriangleExceptFirst(l, h, c, f, u, d, T.x, T.y) &&
                area(T.prev, T, T.next) >= 0) ||
            ((T = T.prevZ),
            g.x >= p &&
                g.x <= E &&
                g.y >= _ &&
                g.y <= m &&
                g !== s &&
                g !== o &&
                pointInTriangleExceptFirst(l, h, c, f, u, d, g.x, g.y) &&
                area(g.prev, g, g.next) >= 0)
        )
            return !1;
        g = g.nextZ;
    }
    for (; T && T.z >= b; ) {
        if (
            T.x >= p &&
            T.x <= E &&
            T.y >= _ &&
            T.y <= m &&
            T !== s &&
            T !== o &&
            pointInTriangleExceptFirst(l, h, c, f, u, d, T.x, T.y) &&
            area(T.prev, T, T.next) >= 0
        )
            return !1;
        T = T.prevZ;
    }
    for (; g && g.z <= L; ) {
        if (
            g.x >= p &&
            g.x <= E &&
            g.y >= _ &&
            g.y <= m &&
            g !== s &&
            g !== o &&
            pointInTriangleExceptFirst(l, h, c, f, u, d, g.x, g.y) &&
            area(g.prev, g, g.next) >= 0
        )
            return !1;
        g = g.nextZ;
    }
    return !0;
}
function cureLocalIntersections(e, t) {
    let r = e;
    do {
        const n = r.prev,
            s = r.next.next;
        !equals$6(n, s) &&
            intersects(n, r, r.next, s) &&
            locallyInside(n, s) &&
            locallyInside(s, n) &&
            (t.push(n.i, r.i, s.i),
            removeNode(r),
            removeNode(r.next),
            (r = e = s)),
            (r = r.next);
    } while (r !== e);
    return filterPoints(r);
}
function splitEarcut(e, t, r, n, s, a) {
    let o = e;
    do {
        let l = o.next.next;
        for (; l !== o.prev; ) {
            if (o.i !== l.i && isValidDiagonal(o, l)) {
                let c = splitPolygon(o, l);
                (o = filterPoints(o, o.next)),
                    (c = filterPoints(c, c.next)),
                    earcutLinked(o, t, r, n, s, a, 0),
                    earcutLinked(c, t, r, n, s, a, 0);
                return;
            }
            l = l.next;
        }
        o = o.next;
    } while (o !== e);
}
function eliminateHoles(e, t, r, n) {
    const s = [];
    for (let a = 0, o = t.length; a < o; a++) {
        const l = t[a] * n,
            c = a < o - 1 ? t[a + 1] * n : e.length,
            u = linkedList(e, l, c, n, !1);
        u === u.next && (u.steiner = !0), s.push(getLeftmost(u));
    }
    s.sort(compareXYSlope);
    for (let a = 0; a < s.length; a++) r = eliminateHole(s[a], r);
    return r;
}
function compareXYSlope(e, t) {
    let r = e.x - t.x;
    if (r === 0 && ((r = e.y - t.y), r === 0)) {
        const n = (e.next.y - e.y) / (e.next.x - e.x),
            s = (t.next.y - t.y) / (t.next.x - t.x);
        r = n - s;
    }
    return r;
}
function eliminateHole(e, t) {
    const r = findHoleBridge(e, t);
    if (!r) return t;
    const n = splitPolygon(r, e);
    return filterPoints(n, n.next), filterPoints(r, r.next);
}
function findHoleBridge(e, t) {
    let r = t;
    const n = e.x,
        s = e.y;
    let a = -1 / 0,
        o;
    if (equals$6(e, r)) return r;
    do {
        if (equals$6(e, r.next)) return r.next;
        if (s <= r.y && s >= r.next.y && r.next.y !== r.y) {
            const f = r.x + ((s - r.y) * (r.next.x - r.x)) / (r.next.y - r.y);
            if (
                f <= n &&
                f > a &&
                ((a = f), (o = r.x < r.next.x ? r : r.next), f === n)
            )
                return o;
        }
        r = r.next;
    } while (r !== t);
    if (!o) return null;
    const l = o,
        c = o.x,
        u = o.y;
    let h = 1 / 0;
    r = o;
    do {
        if (
            n >= r.x &&
            r.x >= c &&
            n !== r.x &&
            pointInTriangle(s < u ? n : a, s, c, u, s < u ? a : n, s, r.x, r.y)
        ) {
            const f = Math.abs(s - r.y) / (n - r.x);
            locallyInside(r, e) &&
                (f < h ||
                    (f === h &&
                        (r.x > o.x ||
                            (r.x === o.x && sectorContainsSector(o, r))))) &&
                ((o = r), (h = f));
        }
        r = r.next;
    } while (r !== l);
    return o;
}
function sectorContainsSector(e, t) {
    return area(e.prev, e, t.prev) < 0 && area(t.next, e, e.next) < 0;
}
function indexCurve(e, t, r, n) {
    let s = e;
    do
        s.z === 0 && (s.z = zOrder(s.x, s.y, t, r, n)),
            (s.prevZ = s.prev),
            (s.nextZ = s.next),
            (s = s.next);
    while (s !== e);
    (s.prevZ.nextZ = null), (s.prevZ = null), sortLinked(s);
}
function sortLinked(e) {
    let t,
        r = 1;
    do {
        let n = e,
            s;
        e = null;
        let a = null;
        for (t = 0; n; ) {
            t++;
            let o = n,
                l = 0;
            for (let u = 0; u < r && (l++, (o = o.nextZ), !!o); u++);
            let c = r;
            for (; l > 0 || (c > 0 && o); )
                l !== 0 && (c === 0 || !o || n.z <= o.z)
                    ? ((s = n), (n = n.nextZ), l--)
                    : ((s = o), (o = o.nextZ), c--),
                    a ? (a.nextZ = s) : (e = s),
                    (s.prevZ = a),
                    (a = s);
            n = o;
        }
        (a.nextZ = null), (r *= 2);
    } while (t > 1);
    return e;
}
function zOrder(e, t, r, n, s) {
    return (
        (e = ((e - r) * s) | 0),
        (t = ((t - n) * s) | 0),
        (e = (e | (e << 8)) & 16711935),
        (e = (e | (e << 4)) & 252645135),
        (e = (e | (e << 2)) & 858993459),
        (e = (e | (e << 1)) & 1431655765),
        (t = (t | (t << 8)) & 16711935),
        (t = (t | (t << 4)) & 252645135),
        (t = (t | (t << 2)) & 858993459),
        (t = (t | (t << 1)) & 1431655765),
        e | (t << 1)
    );
}
function getLeftmost(e) {
    let t = e,
        r = e;
    do (t.x < r.x || (t.x === r.x && t.y < r.y)) && (r = t), (t = t.next);
    while (t !== e);
    return r;
}
function pointInTriangle(e, t, r, n, s, a, o, l) {
    return (
        (s - o) * (t - l) >= (e - o) * (a - l) &&
        (e - o) * (n - l) >= (r - o) * (t - l) &&
        (r - o) * (a - l) >= (s - o) * (n - l)
    );
}
function pointInTriangleExceptFirst(e, t, r, n, s, a, o, l) {
    return !(e === o && t === l) && pointInTriangle(e, t, r, n, s, a, o, l);
}
function isValidDiagonal(e, t) {
    return (
        e.next.i !== t.i &&
        e.prev.i !== t.i &&
        !intersectsPolygon(e, t) && // doesn't intersect other edges
        ((locallyInside(e, t) &&
            locallyInside(t, e) &&
            middleInside(e, t) && // locally visible
            (area(e.prev, e, t.prev) || area(e, t.prev, t))) || // does not create opposite-facing sectors
            (equals$6(e, t) &&
                area(e.prev, e, e.next) > 0 &&
                area(t.prev, t, t.next) > 0))
    );
}
function area(e, t, r) {
    return (t.y - e.y) * (r.x - t.x) - (t.x - e.x) * (r.y - t.y);
}
function equals$6(e, t) {
    return e.x === t.x && e.y === t.y;
}
function intersects(e, t, r, n) {
    const s = sign(area(e, t, r)),
        a = sign(area(e, t, n)),
        o = sign(area(r, n, e)),
        l = sign(area(r, n, t));
    return !!(
        (s !== a && o !== l) ||
        (s === 0 && onSegment(e, r, t)) ||
        (a === 0 && onSegment(e, n, t)) ||
        (o === 0 && onSegment(r, e, n)) ||
        (l === 0 && onSegment(r, t, n))
    );
}
function onSegment(e, t, r) {
    return (
        t.x <= Math.max(e.x, r.x) &&
        t.x >= Math.min(e.x, r.x) &&
        t.y <= Math.max(e.y, r.y) &&
        t.y >= Math.min(e.y, r.y)
    );
}
function sign(e) {
    return e > 0 ? 1 : e < 0 ? -1 : 0;
}
function intersectsPolygon(e, t) {
    let r = e;
    do {
        if (
            r.i !== e.i &&
            r.next.i !== e.i &&
            r.i !== t.i &&
            r.next.i !== t.i &&
            intersects(r, r.next, e, t)
        )
            return !0;
        r = r.next;
    } while (r !== e);
    return !1;
}
function locallyInside(e, t) {
    return area(e.prev, e, e.next) < 0
        ? area(e, t, e.next) >= 0 && area(e, e.prev, t) >= 0
        : area(e, t, e.prev) < 0 || area(e, e.next, t) < 0;
}
function middleInside(e, t) {
    let r = e,
        n = !1;
    const s = (e.x + t.x) / 2,
        a = (e.y + t.y) / 2;
    do
        r.y > a != r.next.y > a &&
            r.next.y !== r.y &&
            s < ((r.next.x - r.x) * (a - r.y)) / (r.next.y - r.y) + r.x &&
            (n = !n),
            (r = r.next);
    while (r !== e);
    return n;
}
function splitPolygon(e, t) {
    const r = createNode(e.i, e.x, e.y),
        n = createNode(t.i, t.x, t.y),
        s = e.next,
        a = t.prev;
    return (
        (e.next = t),
        (t.prev = e),
        (r.next = s),
        (s.prev = r),
        (n.next = r),
        (r.prev = n),
        (a.next = n),
        (n.prev = a),
        n
    );
}
function insertNode(e, t, r, n) {
    const s = createNode(e, t, r);
    return (
        n
            ? ((s.next = n.next), (s.prev = n), (n.next.prev = s), (n.next = s))
            : ((s.prev = s), (s.next = s)),
        s
    );
}
function removeNode(e) {
    (e.next.prev = e.prev),
        (e.prev.next = e.next),
        e.prevZ && (e.prevZ.nextZ = e.nextZ),
        e.nextZ && (e.nextZ.prevZ = e.prevZ);
}
function createNode(e, t, r) {
    return {
        i: e,
        // vertex index in coordinates array
        x: t,
        y: r,
        // vertex coordinates
        prev: null,
        // previous and next vertex nodes in a polygon ring
        next: null,
        z: 0,
        // z-order curve value
        prevZ: null,
        // previous and next nodes in z-order
        nextZ: null,
        steiner: !1,
        // indicates whether this is a steiner point
    };
}
function signedArea(e, t, r, n) {
    let s = 0;
    for (let a = t, o = r - n; a < r; a += n)
        (s += (e[o] - e[a]) * (e[a + 1] + e[o + 1])), (o = a);
    return s;
}
var EPSILON = 1e-6,
    ARRAY_TYPE = typeof Float32Array < "u" ? Float32Array : Array,
    RANDOM = Math.random;
Math.hypot ||
    (Math.hypot = function () {
        for (var e = 0, t = arguments.length; t--; )
            e += arguments[t] * arguments[t];
        return Math.sqrt(e);
    });
function create$5() {
    var e = new ARRAY_TYPE(9);
    return (
        ARRAY_TYPE != Float32Array &&
            ((e[1] = 0),
            (e[2] = 0),
            (e[3] = 0),
            (e[5] = 0),
            (e[6] = 0),
            (e[7] = 0)),
        (e[0] = 1),
        (e[4] = 1),
        (e[8] = 1),
        e
    );
}
function fromMat4(e, t) {
    return (
        (e[0] = t[0]),
        (e[1] = t[1]),
        (e[2] = t[2]),
        (e[3] = t[4]),
        (e[4] = t[5]),
        (e[5] = t[6]),
        (e[6] = t[8]),
        (e[7] = t[9]),
        (e[8] = t[10]),
        e
    );
}
function clone$5(e) {
    var t = new ARRAY_TYPE(9);
    return (
        (t[0] = e[0]),
        (t[1] = e[1]),
        (t[2] = e[2]),
        (t[3] = e[3]),
        (t[4] = e[4]),
        (t[5] = e[5]),
        (t[6] = e[6]),
        (t[7] = e[7]),
        (t[8] = e[8]),
        t
    );
}
function copy$5(e, t) {
    return (
        (e[0] = t[0]),
        (e[1] = t[1]),
        (e[2] = t[2]),
        (e[3] = t[3]),
        (e[4] = t[4]),
        (e[5] = t[5]),
        (e[6] = t[6]),
        (e[7] = t[7]),
        (e[8] = t[8]),
        e
    );
}
function fromValues$5(e, t, r, n, s, a, o, l, c) {
    var u = new ARRAY_TYPE(9);
    return (
        (u[0] = e),
        (u[1] = t),
        (u[2] = r),
        (u[3] = n),
        (u[4] = s),
        (u[5] = a),
        (u[6] = o),
        (u[7] = l),
        (u[8] = c),
        u
    );
}
function set$5(e, t, r, n, s, a, o, l, c, u) {
    return (
        (e[0] = t),
        (e[1] = r),
        (e[2] = n),
        (e[3] = s),
        (e[4] = a),
        (e[5] = o),
        (e[6] = l),
        (e[7] = c),
        (e[8] = u),
        e
    );
}
function identity$2(e) {
    return (
        (e[0] = 1),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = 1),
        (e[5] = 0),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = 1),
        e
    );
}
function transpose$1(e, t) {
    if (e === t) {
        var r = t[1],
            n = t[2],
            s = t[5];
        (e[1] = t[3]),
            (e[2] = t[6]),
            (e[3] = r),
            (e[5] = t[7]),
            (e[6] = n),
            (e[7] = s);
    } else
        (e[0] = t[0]),
            (e[1] = t[3]),
            (e[2] = t[6]),
            (e[3] = t[1]),
            (e[4] = t[4]),
            (e[5] = t[7]),
            (e[6] = t[2]),
            (e[7] = t[5]),
            (e[8] = t[8]);
    return e;
}
function invert$2(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = t[3],
        o = t[4],
        l = t[5],
        c = t[6],
        u = t[7],
        h = t[8],
        f = h * o - l * u,
        d = -h * a + l * c,
        p = u * a - o * c,
        _ = r * f + n * d + s * p;
    return _
        ? ((_ = 1 / _),
          (e[0] = f * _),
          (e[1] = (-h * n + s * u) * _),
          (e[2] = (l * n - s * o) * _),
          (e[3] = d * _),
          (e[4] = (h * r - s * c) * _),
          (e[5] = (-l * r + s * a) * _),
          (e[6] = p * _),
          (e[7] = (-u * r + n * c) * _),
          (e[8] = (o * r - n * a) * _),
          e)
        : null;
}
function adjoint$1(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = t[3],
        o = t[4],
        l = t[5],
        c = t[6],
        u = t[7],
        h = t[8];
    return (
        (e[0] = o * h - l * u),
        (e[1] = s * u - n * h),
        (e[2] = n * l - s * o),
        (e[3] = l * c - a * h),
        (e[4] = r * h - s * c),
        (e[5] = s * a - r * l),
        (e[6] = a * u - o * c),
        (e[7] = n * c - r * u),
        (e[8] = r * o - n * a),
        e
    );
}
function determinant$1(e) {
    var t = e[0],
        r = e[1],
        n = e[2],
        s = e[3],
        a = e[4],
        o = e[5],
        l = e[6],
        c = e[7],
        u = e[8];
    return t * (u * a - o * c) + r * (-u * s + o * l) + n * (c * s - a * l);
}
function multiply$5(e, t, r) {
    var n = t[0],
        s = t[1],
        a = t[2],
        o = t[3],
        l = t[4],
        c = t[5],
        u = t[6],
        h = t[7],
        f = t[8],
        d = r[0],
        p = r[1],
        _ = r[2],
        E = r[3],
        m = r[4],
        b = r[5],
        L = r[6],
        T = r[7],
        g = r[8];
    return (
        (e[0] = d * n + p * o + _ * u),
        (e[1] = d * s + p * l + _ * h),
        (e[2] = d * a + p * c + _ * f),
        (e[3] = E * n + m * o + b * u),
        (e[4] = E * s + m * l + b * h),
        (e[5] = E * a + m * c + b * f),
        (e[6] = L * n + T * o + g * u),
        (e[7] = L * s + T * l + g * h),
        (e[8] = L * a + T * c + g * f),
        e
    );
}
function translate$1(e, t, r) {
    var n = t[0],
        s = t[1],
        a = t[2],
        o = t[3],
        l = t[4],
        c = t[5],
        u = t[6],
        h = t[7],
        f = t[8],
        d = r[0],
        p = r[1];
    return (
        (e[0] = n),
        (e[1] = s),
        (e[2] = a),
        (e[3] = o),
        (e[4] = l),
        (e[5] = c),
        (e[6] = d * n + p * o + u),
        (e[7] = d * s + p * l + h),
        (e[8] = d * a + p * c + f),
        e
    );
}
function rotate$2(e, t, r) {
    var n = t[0],
        s = t[1],
        a = t[2],
        o = t[3],
        l = t[4],
        c = t[5],
        u = t[6],
        h = t[7],
        f = t[8],
        d = Math.sin(r),
        p = Math.cos(r);
    return (
        (e[0] = p * n + d * o),
        (e[1] = p * s + d * l),
        (e[2] = p * a + d * c),
        (e[3] = p * o - d * n),
        (e[4] = p * l - d * s),
        (e[5] = p * c - d * a),
        (e[6] = u),
        (e[7] = h),
        (e[8] = f),
        e
    );
}
function scale$5(e, t, r) {
    var n = r[0],
        s = r[1];
    return (
        (e[0] = n * t[0]),
        (e[1] = n * t[1]),
        (e[2] = n * t[2]),
        (e[3] = s * t[3]),
        (e[4] = s * t[4]),
        (e[5] = s * t[5]),
        (e[6] = t[6]),
        (e[7] = t[7]),
        (e[8] = t[8]),
        e
    );
}
function fromTranslation$1(e, t) {
    return (
        (e[0] = 1),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = 1),
        (e[5] = 0),
        (e[6] = t[0]),
        (e[7] = t[1]),
        (e[8] = 1),
        e
    );
}
function fromRotation$1(e, t) {
    var r = Math.sin(t),
        n = Math.cos(t);
    return (
        (e[0] = n),
        (e[1] = r),
        (e[2] = 0),
        (e[3] = -r),
        (e[4] = n),
        (e[5] = 0),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = 1),
        e
    );
}
function fromScaling$1(e, t) {
    return (
        (e[0] = t[0]),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = t[1]),
        (e[5] = 0),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = 1),
        e
    );
}
function fromMat2d(e, t) {
    return (
        (e[0] = t[0]),
        (e[1] = t[1]),
        (e[2] = 0),
        (e[3] = t[2]),
        (e[4] = t[3]),
        (e[5] = 0),
        (e[6] = t[4]),
        (e[7] = t[5]),
        (e[8] = 1),
        e
    );
}
function fromQuat$1(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = t[3],
        o = r + r,
        l = n + n,
        c = s + s,
        u = r * o,
        h = n * o,
        f = n * l,
        d = s * o,
        p = s * l,
        _ = s * c,
        E = a * o,
        m = a * l,
        b = a * c;
    return (
        (e[0] = 1 - f - _),
        (e[3] = h - b),
        (e[6] = d + m),
        (e[1] = h + b),
        (e[4] = 1 - u - _),
        (e[7] = p - E),
        (e[2] = d - m),
        (e[5] = p + E),
        (e[8] = 1 - u - f),
        e
    );
}
function normalFromMat4(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = t[3],
        o = t[4],
        l = t[5],
        c = t[6],
        u = t[7],
        h = t[8],
        f = t[9],
        d = t[10],
        p = t[11],
        _ = t[12],
        E = t[13],
        m = t[14],
        b = t[15],
        L = r * l - n * o,
        T = r * c - s * o,
        g = r * u - a * o,
        A = n * c - s * l,
        G = n * u - a * l,
        M = s * u - a * c,
        N = h * E - f * _,
        I = h * m - d * _,
        B = h * b - p * _,
        O = f * m - d * E,
        F = f * b - p * E,
        P = d * b - p * m,
        C = L * P - T * F + g * O + A * B - G * I + M * N;
    return C
        ? ((C = 1 / C),
          (e[0] = (l * P - c * F + u * O) * C),
          (e[1] = (c * B - o * P - u * I) * C),
          (e[2] = (o * F - l * B + u * N) * C),
          (e[3] = (s * F - n * P - a * O) * C),
          (e[4] = (r * P - s * B + a * I) * C),
          (e[5] = (n * B - r * F - a * N) * C),
          (e[6] = (E * M - m * G + b * A) * C),
          (e[7] = (m * g - _ * M - b * T) * C),
          (e[8] = (_ * G - E * g + b * L) * C),
          e)
        : null;
}
function projection(e, t, r) {
    return (
        (e[0] = 2 / t),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = -2 / r),
        (e[5] = 0),
        (e[6] = -1),
        (e[7] = 1),
        (e[8] = 1),
        e
    );
}
function str$5(e) {
    return (
        "mat3(" +
        e[0] +
        ", " +
        e[1] +
        ", " +
        e[2] +
        ", " +
        e[3] +
        ", " +
        e[4] +
        ", " +
        e[5] +
        ", " +
        e[6] +
        ", " +
        e[7] +
        ", " +
        e[8] +
        ")"
    );
}
function frob$1(e) {
    return Math.hypot(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8]);
}
function add$5(e, t, r) {
    return (
        (e[0] = t[0] + r[0]),
        (e[1] = t[1] + r[1]),
        (e[2] = t[2] + r[2]),
        (e[3] = t[3] + r[3]),
        (e[4] = t[4] + r[4]),
        (e[5] = t[5] + r[5]),
        (e[6] = t[6] + r[6]),
        (e[7] = t[7] + r[7]),
        (e[8] = t[8] + r[8]),
        e
    );
}
function subtract$4(e, t, r) {
    return (
        (e[0] = t[0] - r[0]),
        (e[1] = t[1] - r[1]),
        (e[2] = t[2] - r[2]),
        (e[3] = t[3] - r[3]),
        (e[4] = t[4] - r[4]),
        (e[5] = t[5] - r[5]),
        (e[6] = t[6] - r[6]),
        (e[7] = t[7] - r[7]),
        (e[8] = t[8] - r[8]),
        e
    );
}
function multiplyScalar$1(e, t, r) {
    return (
        (e[0] = t[0] * r),
        (e[1] = t[1] * r),
        (e[2] = t[2] * r),
        (e[3] = t[3] * r),
        (e[4] = t[4] * r),
        (e[5] = t[5] * r),
        (e[6] = t[6] * r),
        (e[7] = t[7] * r),
        (e[8] = t[8] * r),
        e
    );
}
function multiplyScalarAndAdd$1(e, t, r, n) {
    return (
        (e[0] = t[0] + r[0] * n),
        (e[1] = t[1] + r[1] * n),
        (e[2] = t[2] + r[2] * n),
        (e[3] = t[3] + r[3] * n),
        (e[4] = t[4] + r[4] * n),
        (e[5] = t[5] + r[5] * n),
        (e[6] = t[6] + r[6] * n),
        (e[7] = t[7] + r[7] * n),
        (e[8] = t[8] + r[8] * n),
        e
    );
}
function exactEquals$5(e, t) {
    return (
        e[0] === t[0] &&
        e[1] === t[1] &&
        e[2] === t[2] &&
        e[3] === t[3] &&
        e[4] === t[4] &&
        e[5] === t[5] &&
        e[6] === t[6] &&
        e[7] === t[7] &&
        e[8] === t[8]
    );
}
function equals$5(e, t) {
    var r = e[0],
        n = e[1],
        s = e[2],
        a = e[3],
        o = e[4],
        l = e[5],
        c = e[6],
        u = e[7],
        h = e[8],
        f = t[0],
        d = t[1],
        p = t[2],
        _ = t[3],
        E = t[4],
        m = t[5],
        b = t[6],
        L = t[7],
        T = t[8];
    return (
        Math.abs(r - f) <= EPSILON * Math.max(1, Math.abs(r), Math.abs(f)) &&
        Math.abs(n - d) <= EPSILON * Math.max(1, Math.abs(n), Math.abs(d)) &&
        Math.abs(s - p) <= EPSILON * Math.max(1, Math.abs(s), Math.abs(p)) &&
        Math.abs(a - _) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(_)) &&
        Math.abs(o - E) <= EPSILON * Math.max(1, Math.abs(o), Math.abs(E)) &&
        Math.abs(l - m) <= EPSILON * Math.max(1, Math.abs(l), Math.abs(m)) &&
        Math.abs(c - b) <= EPSILON * Math.max(1, Math.abs(c), Math.abs(b)) &&
        Math.abs(u - L) <= EPSILON * Math.max(1, Math.abs(u), Math.abs(L)) &&
        Math.abs(h - T) <= EPSILON * Math.max(1, Math.abs(h), Math.abs(T))
    );
}
var mul$5 = multiply$5,
    sub$4 = subtract$4;
const mat3$1 = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
        {
            __proto__: null,
            add: add$5,
            adjoint: adjoint$1,
            clone: clone$5,
            copy: copy$5,
            create: create$5,
            determinant: determinant$1,
            equals: equals$5,
            exactEquals: exactEquals$5,
            frob: frob$1,
            fromMat2d,
            fromMat4,
            fromQuat: fromQuat$1,
            fromRotation: fromRotation$1,
            fromScaling: fromScaling$1,
            fromTranslation: fromTranslation$1,
            fromValues: fromValues$5,
            identity: identity$2,
            invert: invert$2,
            mul: mul$5,
            multiply: multiply$5,
            multiplyScalar: multiplyScalar$1,
            multiplyScalarAndAdd: multiplyScalarAndAdd$1,
            normalFromMat4,
            projection,
            rotate: rotate$2,
            scale: scale$5,
            set: set$5,
            str: str$5,
            sub: sub$4,
            subtract: subtract$4,
            translate: translate$1,
            transpose: transpose$1,
        },
        Symbol.toStringTag,
        { value: "Module" }
    )
);
function create$4() {
    var e = new ARRAY_TYPE(16);
    return (
        ARRAY_TYPE != Float32Array &&
            ((e[1] = 0),
            (e[2] = 0),
            (e[3] = 0),
            (e[4] = 0),
            (e[6] = 0),
            (e[7] = 0),
            (e[8] = 0),
            (e[9] = 0),
            (e[11] = 0),
            (e[12] = 0),
            (e[13] = 0),
            (e[14] = 0)),
        (e[0] = 1),
        (e[5] = 1),
        (e[10] = 1),
        (e[15] = 1),
        e
    );
}
function clone$4(e) {
    var t = new ARRAY_TYPE(16);
    return (
        (t[0] = e[0]),
        (t[1] = e[1]),
        (t[2] = e[2]),
        (t[3] = e[3]),
        (t[4] = e[4]),
        (t[5] = e[5]),
        (t[6] = e[6]),
        (t[7] = e[7]),
        (t[8] = e[8]),
        (t[9] = e[9]),
        (t[10] = e[10]),
        (t[11] = e[11]),
        (t[12] = e[12]),
        (t[13] = e[13]),
        (t[14] = e[14]),
        (t[15] = e[15]),
        t
    );
}
function copy$4(e, t) {
    return (
        (e[0] = t[0]),
        (e[1] = t[1]),
        (e[2] = t[2]),
        (e[3] = t[3]),
        (e[4] = t[4]),
        (e[5] = t[5]),
        (e[6] = t[6]),
        (e[7] = t[7]),
        (e[8] = t[8]),
        (e[9] = t[9]),
        (e[10] = t[10]),
        (e[11] = t[11]),
        (e[12] = t[12]),
        (e[13] = t[13]),
        (e[14] = t[14]),
        (e[15] = t[15]),
        e
    );
}
function fromValues$4(e, t, r, n, s, a, o, l, c, u, h, f, d, p, _, E) {
    var m = new ARRAY_TYPE(16);
    return (
        (m[0] = e),
        (m[1] = t),
        (m[2] = r),
        (m[3] = n),
        (m[4] = s),
        (m[5] = a),
        (m[6] = o),
        (m[7] = l),
        (m[8] = c),
        (m[9] = u),
        (m[10] = h),
        (m[11] = f),
        (m[12] = d),
        (m[13] = p),
        (m[14] = _),
        (m[15] = E),
        m
    );
}
function set$4(e, t, r, n, s, a, o, l, c, u, h, f, d, p, _, E, m) {
    return (
        (e[0] = t),
        (e[1] = r),
        (e[2] = n),
        (e[3] = s),
        (e[4] = a),
        (e[5] = o),
        (e[6] = l),
        (e[7] = c),
        (e[8] = u),
        (e[9] = h),
        (e[10] = f),
        (e[11] = d),
        (e[12] = p),
        (e[13] = _),
        (e[14] = E),
        (e[15] = m),
        e
    );
}
function identity$1(e) {
    return (
        (e[0] = 1),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = 0),
        (e[5] = 1),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = 0),
        (e[9] = 0),
        (e[10] = 1),
        (e[11] = 0),
        (e[12] = 0),
        (e[13] = 0),
        (e[14] = 0),
        (e[15] = 1),
        e
    );
}
function transpose(e, t) {
    if (e === t) {
        var r = t[1],
            n = t[2],
            s = t[3],
            a = t[6],
            o = t[7],
            l = t[11];
        (e[1] = t[4]),
            (e[2] = t[8]),
            (e[3] = t[12]),
            (e[4] = r),
            (e[6] = t[9]),
            (e[7] = t[13]),
            (e[8] = n),
            (e[9] = a),
            (e[11] = t[14]),
            (e[12] = s),
            (e[13] = o),
            (e[14] = l);
    } else
        (e[0] = t[0]),
            (e[1] = t[4]),
            (e[2] = t[8]),
            (e[3] = t[12]),
            (e[4] = t[1]),
            (e[5] = t[5]),
            (e[6] = t[9]),
            (e[7] = t[13]),
            (e[8] = t[2]),
            (e[9] = t[6]),
            (e[10] = t[10]),
            (e[11] = t[14]),
            (e[12] = t[3]),
            (e[13] = t[7]),
            (e[14] = t[11]),
            (e[15] = t[15]);
    return e;
}
function invert$1(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = t[3],
        o = t[4],
        l = t[5],
        c = t[6],
        u = t[7],
        h = t[8],
        f = t[9],
        d = t[10],
        p = t[11],
        _ = t[12],
        E = t[13],
        m = t[14],
        b = t[15],
        L = r * l - n * o,
        T = r * c - s * o,
        g = r * u - a * o,
        A = n * c - s * l,
        G = n * u - a * l,
        M = s * u - a * c,
        N = h * E - f * _,
        I = h * m - d * _,
        B = h * b - p * _,
        O = f * m - d * E,
        F = f * b - p * E,
        P = d * b - p * m,
        C = L * P - T * F + g * O + A * B - G * I + M * N;
    return C
        ? ((C = 1 / C),
          (e[0] = (l * P - c * F + u * O) * C),
          (e[1] = (s * F - n * P - a * O) * C),
          (e[2] = (E * M - m * G + b * A) * C),
          (e[3] = (d * G - f * M - p * A) * C),
          (e[4] = (c * B - o * P - u * I) * C),
          (e[5] = (r * P - s * B + a * I) * C),
          (e[6] = (m * g - _ * M - b * T) * C),
          (e[7] = (h * M - d * g + p * T) * C),
          (e[8] = (o * F - l * B + u * N) * C),
          (e[9] = (n * B - r * F - a * N) * C),
          (e[10] = (_ * G - E * g + b * L) * C),
          (e[11] = (f * g - h * G - p * L) * C),
          (e[12] = (l * I - o * O - c * N) * C),
          (e[13] = (r * O - n * I + s * N) * C),
          (e[14] = (E * T - _ * A - m * L) * C),
          (e[15] = (h * A - f * T + d * L) * C),
          e)
        : null;
}
function adjoint(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = t[3],
        o = t[4],
        l = t[5],
        c = t[6],
        u = t[7],
        h = t[8],
        f = t[9],
        d = t[10],
        p = t[11],
        _ = t[12],
        E = t[13],
        m = t[14],
        b = t[15];
    return (
        (e[0] =
            l * (d * b - p * m) - f * (c * b - u * m) + E * (c * p - u * d)),
        (e[1] = -(
            n * (d * b - p * m) -
            f * (s * b - a * m) +
            E * (s * p - a * d)
        )),
        (e[2] =
            n * (c * b - u * m) - l * (s * b - a * m) + E * (s * u - a * c)),
        (e[3] = -(
            n * (c * p - u * d) -
            l * (s * p - a * d) +
            f * (s * u - a * c)
        )),
        (e[4] = -(
            o * (d * b - p * m) -
            h * (c * b - u * m) +
            _ * (c * p - u * d)
        )),
        (e[5] =
            r * (d * b - p * m) - h * (s * b - a * m) + _ * (s * p - a * d)),
        (e[6] = -(
            r * (c * b - u * m) -
            o * (s * b - a * m) +
            _ * (s * u - a * c)
        )),
        (e[7] =
            r * (c * p - u * d) - o * (s * p - a * d) + h * (s * u - a * c)),
        (e[8] =
            o * (f * b - p * E) - h * (l * b - u * E) + _ * (l * p - u * f)),
        (e[9] = -(
            r * (f * b - p * E) -
            h * (n * b - a * E) +
            _ * (n * p - a * f)
        )),
        (e[10] =
            r * (l * b - u * E) - o * (n * b - a * E) + _ * (n * u - a * l)),
        (e[11] = -(
            r * (l * p - u * f) -
            o * (n * p - a * f) +
            h * (n * u - a * l)
        )),
        (e[12] = -(
            o * (f * m - d * E) -
            h * (l * m - c * E) +
            _ * (l * d - c * f)
        )),
        (e[13] =
            r * (f * m - d * E) - h * (n * m - s * E) + _ * (n * d - s * f)),
        (e[14] = -(
            r * (l * m - c * E) -
            o * (n * m - s * E) +
            _ * (n * c - s * l)
        )),
        (e[15] =
            r * (l * d - c * f) - o * (n * d - s * f) + h * (n * c - s * l)),
        e
    );
}
function determinant(e) {
    var t = e[0],
        r = e[1],
        n = e[2],
        s = e[3],
        a = e[4],
        o = e[5],
        l = e[6],
        c = e[7],
        u = e[8],
        h = e[9],
        f = e[10],
        d = e[11],
        p = e[12],
        _ = e[13],
        E = e[14],
        m = e[15],
        b = t * o - r * a,
        L = t * l - n * a,
        T = t * c - s * a,
        g = r * l - n * o,
        A = r * c - s * o,
        G = n * c - s * l,
        M = u * _ - h * p,
        N = u * E - f * p,
        I = u * m - d * p,
        B = h * E - f * _,
        O = h * m - d * _,
        F = f * m - d * E;
    return b * F - L * O + T * B + g * I - A * N + G * M;
}
function multiply$4(e, t, r) {
    var n = t[0],
        s = t[1],
        a = t[2],
        o = t[3],
        l = t[4],
        c = t[5],
        u = t[6],
        h = t[7],
        f = t[8],
        d = t[9],
        p = t[10],
        _ = t[11],
        E = t[12],
        m = t[13],
        b = t[14],
        L = t[15],
        T = r[0],
        g = r[1],
        A = r[2],
        G = r[3];
    return (
        (e[0] = T * n + g * l + A * f + G * E),
        (e[1] = T * s + g * c + A * d + G * m),
        (e[2] = T * a + g * u + A * p + G * b),
        (e[3] = T * o + g * h + A * _ + G * L),
        (T = r[4]),
        (g = r[5]),
        (A = r[6]),
        (G = r[7]),
        (e[4] = T * n + g * l + A * f + G * E),
        (e[5] = T * s + g * c + A * d + G * m),
        (e[6] = T * a + g * u + A * p + G * b),
        (e[7] = T * o + g * h + A * _ + G * L),
        (T = r[8]),
        (g = r[9]),
        (A = r[10]),
        (G = r[11]),
        (e[8] = T * n + g * l + A * f + G * E),
        (e[9] = T * s + g * c + A * d + G * m),
        (e[10] = T * a + g * u + A * p + G * b),
        (e[11] = T * o + g * h + A * _ + G * L),
        (T = r[12]),
        (g = r[13]),
        (A = r[14]),
        (G = r[15]),
        (e[12] = T * n + g * l + A * f + G * E),
        (e[13] = T * s + g * c + A * d + G * m),
        (e[14] = T * a + g * u + A * p + G * b),
        (e[15] = T * o + g * h + A * _ + G * L),
        e
    );
}
function translate(e, t, r) {
    var n = r[0],
        s = r[1],
        a = r[2],
        o,
        l,
        c,
        u,
        h,
        f,
        d,
        p,
        _,
        E,
        m,
        b;
    return (
        t === e
            ? ((e[12] = t[0] * n + t[4] * s + t[8] * a + t[12]),
              (e[13] = t[1] * n + t[5] * s + t[9] * a + t[13]),
              (e[14] = t[2] * n + t[6] * s + t[10] * a + t[14]),
              (e[15] = t[3] * n + t[7] * s + t[11] * a + t[15]))
            : ((o = t[0]),
              (l = t[1]),
              (c = t[2]),
              (u = t[3]),
              (h = t[4]),
              (f = t[5]),
              (d = t[6]),
              (p = t[7]),
              (_ = t[8]),
              (E = t[9]),
              (m = t[10]),
              (b = t[11]),
              (e[0] = o),
              (e[1] = l),
              (e[2] = c),
              (e[3] = u),
              (e[4] = h),
              (e[5] = f),
              (e[6] = d),
              (e[7] = p),
              (e[8] = _),
              (e[9] = E),
              (e[10] = m),
              (e[11] = b),
              (e[12] = o * n + h * s + _ * a + t[12]),
              (e[13] = l * n + f * s + E * a + t[13]),
              (e[14] = c * n + d * s + m * a + t[14]),
              (e[15] = u * n + p * s + b * a + t[15])),
        e
    );
}
function scale$4(e, t, r) {
    var n = r[0],
        s = r[1],
        a = r[2];
    return (
        (e[0] = t[0] * n),
        (e[1] = t[1] * n),
        (e[2] = t[2] * n),
        (e[3] = t[3] * n),
        (e[4] = t[4] * s),
        (e[5] = t[5] * s),
        (e[6] = t[6] * s),
        (e[7] = t[7] * s),
        (e[8] = t[8] * a),
        (e[9] = t[9] * a),
        (e[10] = t[10] * a),
        (e[11] = t[11] * a),
        (e[12] = t[12]),
        (e[13] = t[13]),
        (e[14] = t[14]),
        (e[15] = t[15]),
        e
    );
}
function rotate$1(e, t, r, n) {
    var s = n[0],
        a = n[1],
        o = n[2],
        l = Math.hypot(s, a, o),
        c,
        u,
        h,
        f,
        d,
        p,
        _,
        E,
        m,
        b,
        L,
        T,
        g,
        A,
        G,
        M,
        N,
        I,
        B,
        O,
        F,
        P,
        C,
        U;
    return l < EPSILON
        ? null
        : ((l = 1 / l),
          (s *= l),
          (a *= l),
          (o *= l),
          (c = Math.sin(r)),
          (u = Math.cos(r)),
          (h = 1 - u),
          (f = t[0]),
          (d = t[1]),
          (p = t[2]),
          (_ = t[3]),
          (E = t[4]),
          (m = t[5]),
          (b = t[6]),
          (L = t[7]),
          (T = t[8]),
          (g = t[9]),
          (A = t[10]),
          (G = t[11]),
          (M = s * s * h + u),
          (N = a * s * h + o * c),
          (I = o * s * h - a * c),
          (B = s * a * h - o * c),
          (O = a * a * h + u),
          (F = o * a * h + s * c),
          (P = s * o * h + a * c),
          (C = a * o * h - s * c),
          (U = o * o * h + u),
          (e[0] = f * M + E * N + T * I),
          (e[1] = d * M + m * N + g * I),
          (e[2] = p * M + b * N + A * I),
          (e[3] = _ * M + L * N + G * I),
          (e[4] = f * B + E * O + T * F),
          (e[5] = d * B + m * O + g * F),
          (e[6] = p * B + b * O + A * F),
          (e[7] = _ * B + L * O + G * F),
          (e[8] = f * P + E * C + T * U),
          (e[9] = d * P + m * C + g * U),
          (e[10] = p * P + b * C + A * U),
          (e[11] = _ * P + L * C + G * U),
          t !== e &&
              ((e[12] = t[12]),
              (e[13] = t[13]),
              (e[14] = t[14]),
              (e[15] = t[15])),
          e);
}
function rotateX$2(e, t, r) {
    var n = Math.sin(r),
        s = Math.cos(r),
        a = t[4],
        o = t[5],
        l = t[6],
        c = t[7],
        u = t[8],
        h = t[9],
        f = t[10],
        d = t[11];
    return (
        t !== e &&
            ((e[0] = t[0]),
            (e[1] = t[1]),
            (e[2] = t[2]),
            (e[3] = t[3]),
            (e[12] = t[12]),
            (e[13] = t[13]),
            (e[14] = t[14]),
            (e[15] = t[15])),
        (e[4] = a * s + u * n),
        (e[5] = o * s + h * n),
        (e[6] = l * s + f * n),
        (e[7] = c * s + d * n),
        (e[8] = u * s - a * n),
        (e[9] = h * s - o * n),
        (e[10] = f * s - l * n),
        (e[11] = d * s - c * n),
        e
    );
}
function rotateY$2(e, t, r) {
    var n = Math.sin(r),
        s = Math.cos(r),
        a = t[0],
        o = t[1],
        l = t[2],
        c = t[3],
        u = t[8],
        h = t[9],
        f = t[10],
        d = t[11];
    return (
        t !== e &&
            ((e[4] = t[4]),
            (e[5] = t[5]),
            (e[6] = t[6]),
            (e[7] = t[7]),
            (e[12] = t[12]),
            (e[13] = t[13]),
            (e[14] = t[14]),
            (e[15] = t[15])),
        (e[0] = a * s - u * n),
        (e[1] = o * s - h * n),
        (e[2] = l * s - f * n),
        (e[3] = c * s - d * n),
        (e[8] = a * n + u * s),
        (e[9] = o * n + h * s),
        (e[10] = l * n + f * s),
        (e[11] = c * n + d * s),
        e
    );
}
function rotateZ$2(e, t, r) {
    var n = Math.sin(r),
        s = Math.cos(r),
        a = t[0],
        o = t[1],
        l = t[2],
        c = t[3],
        u = t[4],
        h = t[5],
        f = t[6],
        d = t[7];
    return (
        t !== e &&
            ((e[8] = t[8]),
            (e[9] = t[9]),
            (e[10] = t[10]),
            (e[11] = t[11]),
            (e[12] = t[12]),
            (e[13] = t[13]),
            (e[14] = t[14]),
            (e[15] = t[15])),
        (e[0] = a * s + u * n),
        (e[1] = o * s + h * n),
        (e[2] = l * s + f * n),
        (e[3] = c * s + d * n),
        (e[4] = u * s - a * n),
        (e[5] = h * s - o * n),
        (e[6] = f * s - l * n),
        (e[7] = d * s - c * n),
        e
    );
}
function fromTranslation(e, t) {
    return (
        (e[0] = 1),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = 0),
        (e[5] = 1),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = 0),
        (e[9] = 0),
        (e[10] = 1),
        (e[11] = 0),
        (e[12] = t[0]),
        (e[13] = t[1]),
        (e[14] = t[2]),
        (e[15] = 1),
        e
    );
}
function fromScaling(e, t) {
    return (
        (e[0] = t[0]),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = 0),
        (e[5] = t[1]),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = 0),
        (e[9] = 0),
        (e[10] = t[2]),
        (e[11] = 0),
        (e[12] = 0),
        (e[13] = 0),
        (e[14] = 0),
        (e[15] = 1),
        e
    );
}
function fromRotation(e, t, r) {
    var n = r[0],
        s = r[1],
        a = r[2],
        o = Math.hypot(n, s, a),
        l,
        c,
        u;
    return o < EPSILON
        ? null
        : ((o = 1 / o),
          (n *= o),
          (s *= o),
          (a *= o),
          (l = Math.sin(t)),
          (c = Math.cos(t)),
          (u = 1 - c),
          (e[0] = n * n * u + c),
          (e[1] = s * n * u + a * l),
          (e[2] = a * n * u - s * l),
          (e[3] = 0),
          (e[4] = n * s * u - a * l),
          (e[5] = s * s * u + c),
          (e[6] = a * s * u + n * l),
          (e[7] = 0),
          (e[8] = n * a * u + s * l),
          (e[9] = s * a * u - n * l),
          (e[10] = a * a * u + c),
          (e[11] = 0),
          (e[12] = 0),
          (e[13] = 0),
          (e[14] = 0),
          (e[15] = 1),
          e);
}
function fromXRotation(e, t) {
    var r = Math.sin(t),
        n = Math.cos(t);
    return (
        (e[0] = 1),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = 0),
        (e[5] = n),
        (e[6] = r),
        (e[7] = 0),
        (e[8] = 0),
        (e[9] = -r),
        (e[10] = n),
        (e[11] = 0),
        (e[12] = 0),
        (e[13] = 0),
        (e[14] = 0),
        (e[15] = 1),
        e
    );
}
function fromYRotation(e, t) {
    var r = Math.sin(t),
        n = Math.cos(t);
    return (
        (e[0] = n),
        (e[1] = 0),
        (e[2] = -r),
        (e[3] = 0),
        (e[4] = 0),
        (e[5] = 1),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = r),
        (e[9] = 0),
        (e[10] = n),
        (e[11] = 0),
        (e[12] = 0),
        (e[13] = 0),
        (e[14] = 0),
        (e[15] = 1),
        e
    );
}
function fromZRotation(e, t) {
    var r = Math.sin(t),
        n = Math.cos(t);
    return (
        (e[0] = n),
        (e[1] = r),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = -r),
        (e[5] = n),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = 0),
        (e[9] = 0),
        (e[10] = 1),
        (e[11] = 0),
        (e[12] = 0),
        (e[13] = 0),
        (e[14] = 0),
        (e[15] = 1),
        e
    );
}
function fromRotationTranslation(e, t, r) {
    var n = t[0],
        s = t[1],
        a = t[2],
        o = t[3],
        l = n + n,
        c = s + s,
        u = a + a,
        h = n * l,
        f = n * c,
        d = n * u,
        p = s * c,
        _ = s * u,
        E = a * u,
        m = o * l,
        b = o * c,
        L = o * u;
    return (
        (e[0] = 1 - (p + E)),
        (e[1] = f + L),
        (e[2] = d - b),
        (e[3] = 0),
        (e[4] = f - L),
        (e[5] = 1 - (h + E)),
        (e[6] = _ + m),
        (e[7] = 0),
        (e[8] = d + b),
        (e[9] = _ - m),
        (e[10] = 1 - (h + p)),
        (e[11] = 0),
        (e[12] = r[0]),
        (e[13] = r[1]),
        (e[14] = r[2]),
        (e[15] = 1),
        e
    );
}
function fromQuat2(e, t) {
    var r = new ARRAY_TYPE(3),
        n = -t[0],
        s = -t[1],
        a = -t[2],
        o = t[3],
        l = t[4],
        c = t[5],
        u = t[6],
        h = t[7],
        f = n * n + s * s + a * a + o * o;
    return (
        f > 0
            ? ((r[0] = ((l * o + h * n + c * a - u * s) * 2) / f),
              (r[1] = ((c * o + h * s + u * n - l * a) * 2) / f),
              (r[2] = ((u * o + h * a + l * s - c * n) * 2) / f))
            : ((r[0] = (l * o + h * n + c * a - u * s) * 2),
              (r[1] = (c * o + h * s + u * n - l * a) * 2),
              (r[2] = (u * o + h * a + l * s - c * n) * 2)),
        fromRotationTranslation(e, t, r),
        e
    );
}
function getTranslation(e, t) {
    return (e[0] = t[12]), (e[1] = t[13]), (e[2] = t[14]), e;
}
function getScaling(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = t[4],
        o = t[5],
        l = t[6],
        c = t[8],
        u = t[9],
        h = t[10];
    return (
        (e[0] = Math.hypot(r, n, s)),
        (e[1] = Math.hypot(a, o, l)),
        (e[2] = Math.hypot(c, u, h)),
        e
    );
}
function getRotation(e, t) {
    var r = new ARRAY_TYPE(3);
    getScaling(r, t);
    var n = 1 / r[0],
        s = 1 / r[1],
        a = 1 / r[2],
        o = t[0] * n,
        l = t[1] * s,
        c = t[2] * a,
        u = t[4] * n,
        h = t[5] * s,
        f = t[6] * a,
        d = t[8] * n,
        p = t[9] * s,
        _ = t[10] * a,
        E = o + h + _,
        m = 0;
    return (
        E > 0
            ? ((m = Math.sqrt(E + 1) * 2),
              (e[3] = 0.25 * m),
              (e[0] = (f - p) / m),
              (e[1] = (d - c) / m),
              (e[2] = (l - u) / m))
            : o > h && o > _
            ? ((m = Math.sqrt(1 + o - h - _) * 2),
              (e[3] = (f - p) / m),
              (e[0] = 0.25 * m),
              (e[1] = (l + u) / m),
              (e[2] = (d + c) / m))
            : h > _
            ? ((m = Math.sqrt(1 + h - o - _) * 2),
              (e[3] = (d - c) / m),
              (e[0] = (l + u) / m),
              (e[1] = 0.25 * m),
              (e[2] = (f + p) / m))
            : ((m = Math.sqrt(1 + _ - o - h) * 2),
              (e[3] = (l - u) / m),
              (e[0] = (d + c) / m),
              (e[1] = (f + p) / m),
              (e[2] = 0.25 * m)),
        e
    );
}
function fromRotationTranslationScale(e, t, r, n) {
    var s = t[0],
        a = t[1],
        o = t[2],
        l = t[3],
        c = s + s,
        u = a + a,
        h = o + o,
        f = s * c,
        d = s * u,
        p = s * h,
        _ = a * u,
        E = a * h,
        m = o * h,
        b = l * c,
        L = l * u,
        T = l * h,
        g = n[0],
        A = n[1],
        G = n[2];
    return (
        (e[0] = (1 - (_ + m)) * g),
        (e[1] = (d + T) * g),
        (e[2] = (p - L) * g),
        (e[3] = 0),
        (e[4] = (d - T) * A),
        (e[5] = (1 - (f + m)) * A),
        (e[6] = (E + b) * A),
        (e[7] = 0),
        (e[8] = (p + L) * G),
        (e[9] = (E - b) * G),
        (e[10] = (1 - (f + _)) * G),
        (e[11] = 0),
        (e[12] = r[0]),
        (e[13] = r[1]),
        (e[14] = r[2]),
        (e[15] = 1),
        e
    );
}
function fromRotationTranslationScaleOrigin(e, t, r, n, s) {
    var a = t[0],
        o = t[1],
        l = t[2],
        c = t[3],
        u = a + a,
        h = o + o,
        f = l + l,
        d = a * u,
        p = a * h,
        _ = a * f,
        E = o * h,
        m = o * f,
        b = l * f,
        L = c * u,
        T = c * h,
        g = c * f,
        A = n[0],
        G = n[1],
        M = n[2],
        N = s[0],
        I = s[1],
        B = s[2],
        O = (1 - (E + b)) * A,
        F = (p + g) * A,
        P = (_ - T) * A,
        C = (p - g) * G,
        U = (1 - (d + b)) * G,
        X = (m + L) * G,
        z = (_ + T) * M,
        q = (m - L) * M,
        Y = (1 - (d + E)) * M;
    return (
        (e[0] = O),
        (e[1] = F),
        (e[2] = P),
        (e[3] = 0),
        (e[4] = C),
        (e[5] = U),
        (e[6] = X),
        (e[7] = 0),
        (e[8] = z),
        (e[9] = q),
        (e[10] = Y),
        (e[11] = 0),
        (e[12] = r[0] + N - (O * N + C * I + z * B)),
        (e[13] = r[1] + I - (F * N + U * I + q * B)),
        (e[14] = r[2] + B - (P * N + X * I + Y * B)),
        (e[15] = 1),
        e
    );
}
function fromQuat(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = t[3],
        o = r + r,
        l = n + n,
        c = s + s,
        u = r * o,
        h = n * o,
        f = n * l,
        d = s * o,
        p = s * l,
        _ = s * c,
        E = a * o,
        m = a * l,
        b = a * c;
    return (
        (e[0] = 1 - f - _),
        (e[1] = h + b),
        (e[2] = d - m),
        (e[3] = 0),
        (e[4] = h - b),
        (e[5] = 1 - u - _),
        (e[6] = p + E),
        (e[7] = 0),
        (e[8] = d + m),
        (e[9] = p - E),
        (e[10] = 1 - u - f),
        (e[11] = 0),
        (e[12] = 0),
        (e[13] = 0),
        (e[14] = 0),
        (e[15] = 1),
        e
    );
}
function frustum(e, t, r, n, s, a, o) {
    var l = 1 / (r - t),
        c = 1 / (s - n),
        u = 1 / (a - o);
    return (
        (e[0] = a * 2 * l),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = 0),
        (e[5] = a * 2 * c),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = (r + t) * l),
        (e[9] = (s + n) * c),
        (e[10] = (o + a) * u),
        (e[11] = -1),
        (e[12] = 0),
        (e[13] = 0),
        (e[14] = o * a * 2 * u),
        (e[15] = 0),
        e
    );
}
function perspectiveNO(e, t, r, n, s) {
    var a = 1 / Math.tan(t / 2),
        o;
    return (
        (e[0] = a / r),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = 0),
        (e[5] = a),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = 0),
        (e[9] = 0),
        (e[11] = -1),
        (e[12] = 0),
        (e[13] = 0),
        (e[15] = 0),
        s != null && s !== 1 / 0
            ? ((o = 1 / (n - s)),
              (e[10] = (s + n) * o),
              (e[14] = 2 * s * n * o))
            : ((e[10] = -1), (e[14] = -2 * n)),
        e
    );
}
var perspective = perspectiveNO;
function perspectiveZO(e, t, r, n, s) {
    var a = 1 / Math.tan(t / 2),
        o;
    return (
        (e[0] = a / r),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = 0),
        (e[5] = a),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = 0),
        (e[9] = 0),
        (e[11] = -1),
        (e[12] = 0),
        (e[13] = 0),
        (e[15] = 0),
        s != null && s !== 1 / 0
            ? ((o = 1 / (n - s)), (e[10] = s * o), (e[14] = s * n * o))
            : ((e[10] = -1), (e[14] = -n)),
        e
    );
}
function perspectiveFromFieldOfView(e, t, r, n) {
    var s = Math.tan((t.upDegrees * Math.PI) / 180),
        a = Math.tan((t.downDegrees * Math.PI) / 180),
        o = Math.tan((t.leftDegrees * Math.PI) / 180),
        l = Math.tan((t.rightDegrees * Math.PI) / 180),
        c = 2 / (o + l),
        u = 2 / (s + a);
    return (
        (e[0] = c),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = 0),
        (e[5] = u),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = -((o - l) * c * 0.5)),
        (e[9] = (s - a) * u * 0.5),
        (e[10] = n / (r - n)),
        (e[11] = -1),
        (e[12] = 0),
        (e[13] = 0),
        (e[14] = (n * r) / (r - n)),
        (e[15] = 0),
        e
    );
}
function orthoNO(e, t, r, n, s, a, o) {
    var l = 1 / (t - r),
        c = 1 / (n - s),
        u = 1 / (a - o);
    return (
        (e[0] = -2 * l),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = 0),
        (e[5] = -2 * c),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = 0),
        (e[9] = 0),
        (e[10] = 2 * u),
        (e[11] = 0),
        (e[12] = (t + r) * l),
        (e[13] = (s + n) * c),
        (e[14] = (o + a) * u),
        (e[15] = 1),
        e
    );
}
var ortho = orthoNO;
function orthoZO(e, t, r, n, s, a, o) {
    var l = 1 / (t - r),
        c = 1 / (n - s),
        u = 1 / (a - o);
    return (
        (e[0] = -2 * l),
        (e[1] = 0),
        (e[2] = 0),
        (e[3] = 0),
        (e[4] = 0),
        (e[5] = -2 * c),
        (e[6] = 0),
        (e[7] = 0),
        (e[8] = 0),
        (e[9] = 0),
        (e[10] = u),
        (e[11] = 0),
        (e[12] = (t + r) * l),
        (e[13] = (s + n) * c),
        (e[14] = a * u),
        (e[15] = 1),
        e
    );
}
function lookAt(e, t, r, n) {
    var s,
        a,
        o,
        l,
        c,
        u,
        h,
        f,
        d,
        p,
        _ = t[0],
        E = t[1],
        m = t[2],
        b = n[0],
        L = n[1],
        T = n[2],
        g = r[0],
        A = r[1],
        G = r[2];
    return Math.abs(_ - g) < EPSILON &&
        Math.abs(E - A) < EPSILON &&
        Math.abs(m - G) < EPSILON
        ? identity$1(e)
        : ((h = _ - g),
          (f = E - A),
          (d = m - G),
          (p = 1 / Math.hypot(h, f, d)),
          (h *= p),
          (f *= p),
          (d *= p),
          (s = L * d - T * f),
          (a = T * h - b * d),
          (o = b * f - L * h),
          (p = Math.hypot(s, a, o)),
          p
              ? ((p = 1 / p), (s *= p), (a *= p), (o *= p))
              : ((s = 0), (a = 0), (o = 0)),
          (l = f * o - d * a),
          (c = d * s - h * o),
          (u = h * a - f * s),
          (p = Math.hypot(l, c, u)),
          p
              ? ((p = 1 / p), (l *= p), (c *= p), (u *= p))
              : ((l = 0), (c = 0), (u = 0)),
          (e[0] = s),
          (e[1] = l),
          (e[2] = h),
          (e[3] = 0),
          (e[4] = a),
          (e[5] = c),
          (e[6] = f),
          (e[7] = 0),
          (e[8] = o),
          (e[9] = u),
          (e[10] = d),
          (e[11] = 0),
          (e[12] = -(s * _ + a * E + o * m)),
          (e[13] = -(l * _ + c * E + u * m)),
          (e[14] = -(h * _ + f * E + d * m)),
          (e[15] = 1),
          e);
}
function targetTo(e, t, r, n) {
    var s = t[0],
        a = t[1],
        o = t[2],
        l = n[0],
        c = n[1],
        u = n[2],
        h = s - r[0],
        f = a - r[1],
        d = o - r[2],
        p = h * h + f * f + d * d;
    p > 0 && ((p = 1 / Math.sqrt(p)), (h *= p), (f *= p), (d *= p));
    var _ = c * d - u * f,
        E = u * h - l * d,
        m = l * f - c * h;
    return (
        (p = _ * _ + E * E + m * m),
        p > 0 && ((p = 1 / Math.sqrt(p)), (_ *= p), (E *= p), (m *= p)),
        (e[0] = _),
        (e[1] = E),
        (e[2] = m),
        (e[3] = 0),
        (e[4] = f * m - d * E),
        (e[5] = d * _ - h * m),
        (e[6] = h * E - f * _),
        (e[7] = 0),
        (e[8] = h),
        (e[9] = f),
        (e[10] = d),
        (e[11] = 0),
        (e[12] = s),
        (e[13] = a),
        (e[14] = o),
        (e[15] = 1),
        e
    );
}
function str$4(e) {
    return (
        "mat4(" +
        e[0] +
        ", " +
        e[1] +
        ", " +
        e[2] +
        ", " +
        e[3] +
        ", " +
        e[4] +
        ", " +
        e[5] +
        ", " +
        e[6] +
        ", " +
        e[7] +
        ", " +
        e[8] +
        ", " +
        e[9] +
        ", " +
        e[10] +
        ", " +
        e[11] +
        ", " +
        e[12] +
        ", " +
        e[13] +
        ", " +
        e[14] +
        ", " +
        e[15] +
        ")"
    );
}
function frob(e) {
    return Math.hypot(
        e[0],
        e[1],
        e[2],
        e[3],
        e[4],
        e[5],
        e[6],
        e[7],
        e[8],
        e[9],
        e[10],
        e[11],
        e[12],
        e[13],
        e[14],
        e[15]
    );
}
function add$4(e, t, r) {
    return (
        (e[0] = t[0] + r[0]),
        (e[1] = t[1] + r[1]),
        (e[2] = t[2] + r[2]),
        (e[3] = t[3] + r[3]),
        (e[4] = t[4] + r[4]),
        (e[5] = t[5] + r[5]),
        (e[6] = t[6] + r[6]),
        (e[7] = t[7] + r[7]),
        (e[8] = t[8] + r[8]),
        (e[9] = t[9] + r[9]),
        (e[10] = t[10] + r[10]),
        (e[11] = t[11] + r[11]),
        (e[12] = t[12] + r[12]),
        (e[13] = t[13] + r[13]),
        (e[14] = t[14] + r[14]),
        (e[15] = t[15] + r[15]),
        e
    );
}
function subtract$3(e, t, r) {
    return (
        (e[0] = t[0] - r[0]),
        (e[1] = t[1] - r[1]),
        (e[2] = t[2] - r[2]),
        (e[3] = t[3] - r[3]),
        (e[4] = t[4] - r[4]),
        (e[5] = t[5] - r[5]),
        (e[6] = t[6] - r[6]),
        (e[7] = t[7] - r[7]),
        (e[8] = t[8] - r[8]),
        (e[9] = t[9] - r[9]),
        (e[10] = t[10] - r[10]),
        (e[11] = t[11] - r[11]),
        (e[12] = t[12] - r[12]),
        (e[13] = t[13] - r[13]),
        (e[14] = t[14] - r[14]),
        (e[15] = t[15] - r[15]),
        e
    );
}
function multiplyScalar(e, t, r) {
    return (
        (e[0] = t[0] * r),
        (e[1] = t[1] * r),
        (e[2] = t[2] * r),
        (e[3] = t[3] * r),
        (e[4] = t[4] * r),
        (e[5] = t[5] * r),
        (e[6] = t[6] * r),
        (e[7] = t[7] * r),
        (e[8] = t[8] * r),
        (e[9] = t[9] * r),
        (e[10] = t[10] * r),
        (e[11] = t[11] * r),
        (e[12] = t[12] * r),
        (e[13] = t[13] * r),
        (e[14] = t[14] * r),
        (e[15] = t[15] * r),
        e
    );
}
function multiplyScalarAndAdd(e, t, r, n) {
    return (
        (e[0] = t[0] + r[0] * n),
        (e[1] = t[1] + r[1] * n),
        (e[2] = t[2] + r[2] * n),
        (e[3] = t[3] + r[3] * n),
        (e[4] = t[4] + r[4] * n),
        (e[5] = t[5] + r[5] * n),
        (e[6] = t[6] + r[6] * n),
        (e[7] = t[7] + r[7] * n),
        (e[8] = t[8] + r[8] * n),
        (e[9] = t[9] + r[9] * n),
        (e[10] = t[10] + r[10] * n),
        (e[11] = t[11] + r[11] * n),
        (e[12] = t[12] + r[12] * n),
        (e[13] = t[13] + r[13] * n),
        (e[14] = t[14] + r[14] * n),
        (e[15] = t[15] + r[15] * n),
        e
    );
}
function exactEquals$4(e, t) {
    return (
        e[0] === t[0] &&
        e[1] === t[1] &&
        e[2] === t[2] &&
        e[3] === t[3] &&
        e[4] === t[4] &&
        e[5] === t[5] &&
        e[6] === t[6] &&
        e[7] === t[7] &&
        e[8] === t[8] &&
        e[9] === t[9] &&
        e[10] === t[10] &&
        e[11] === t[11] &&
        e[12] === t[12] &&
        e[13] === t[13] &&
        e[14] === t[14] &&
        e[15] === t[15]
    );
}
function equals$4(e, t) {
    var r = e[0],
        n = e[1],
        s = e[2],
        a = e[3],
        o = e[4],
        l = e[5],
        c = e[6],
        u = e[7],
        h = e[8],
        f = e[9],
        d = e[10],
        p = e[11],
        _ = e[12],
        E = e[13],
        m = e[14],
        b = e[15],
        L = t[0],
        T = t[1],
        g = t[2],
        A = t[3],
        G = t[4],
        M = t[5],
        N = t[6],
        I = t[7],
        B = t[8],
        O = t[9],
        F = t[10],
        P = t[11],
        C = t[12],
        U = t[13],
        X = t[14],
        z = t[15];
    return (
        Math.abs(r - L) <= EPSILON * Math.max(1, Math.abs(r), Math.abs(L)) &&
        Math.abs(n - T) <= EPSILON * Math.max(1, Math.abs(n), Math.abs(T)) &&
        Math.abs(s - g) <= EPSILON * Math.max(1, Math.abs(s), Math.abs(g)) &&
        Math.abs(a - A) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(A)) &&
        Math.abs(o - G) <= EPSILON * Math.max(1, Math.abs(o), Math.abs(G)) &&
        Math.abs(l - M) <= EPSILON * Math.max(1, Math.abs(l), Math.abs(M)) &&
        Math.abs(c - N) <= EPSILON * Math.max(1, Math.abs(c), Math.abs(N)) &&
        Math.abs(u - I) <= EPSILON * Math.max(1, Math.abs(u), Math.abs(I)) &&
        Math.abs(h - B) <= EPSILON * Math.max(1, Math.abs(h), Math.abs(B)) &&
        Math.abs(f - O) <= EPSILON * Math.max(1, Math.abs(f), Math.abs(O)) &&
        Math.abs(d - F) <= EPSILON * Math.max(1, Math.abs(d), Math.abs(F)) &&
        Math.abs(p - P) <= EPSILON * Math.max(1, Math.abs(p), Math.abs(P)) &&
        Math.abs(_ - C) <= EPSILON * Math.max(1, Math.abs(_), Math.abs(C)) &&
        Math.abs(E - U) <= EPSILON * Math.max(1, Math.abs(E), Math.abs(U)) &&
        Math.abs(m - X) <= EPSILON * Math.max(1, Math.abs(m), Math.abs(X)) &&
        Math.abs(b - z) <= EPSILON * Math.max(1, Math.abs(b), Math.abs(z))
    );
}
var mul$4 = multiply$4,
    sub$3 = subtract$3;
const mat4$1 = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
        {
            __proto__: null,
            add: add$4,
            adjoint,
            clone: clone$4,
            copy: copy$4,
            create: create$4,
            determinant,
            equals: equals$4,
            exactEquals: exactEquals$4,
            frob,
            fromQuat,
            fromQuat2,
            fromRotation,
            fromRotationTranslation,
            fromRotationTranslationScale,
            fromRotationTranslationScaleOrigin,
            fromScaling,
            fromTranslation,
            fromValues: fromValues$4,
            fromXRotation,
            fromYRotation,
            fromZRotation,
            frustum,
            getRotation,
            getScaling,
            getTranslation,
            identity: identity$1,
            invert: invert$1,
            lookAt,
            mul: mul$4,
            multiply: multiply$4,
            multiplyScalar,
            multiplyScalarAndAdd,
            ortho,
            orthoNO,
            orthoZO,
            perspective,
            perspectiveFromFieldOfView,
            perspectiveNO,
            perspectiveZO,
            rotate: rotate$1,
            rotateX: rotateX$2,
            rotateY: rotateY$2,
            rotateZ: rotateZ$2,
            scale: scale$4,
            set: set$4,
            str: str$4,
            sub: sub$3,
            subtract: subtract$3,
            targetTo,
            translate,
            transpose,
        },
        Symbol.toStringTag,
        { value: "Module" }
    )
);
function create$3() {
    var e = new ARRAY_TYPE(3);
    return (
        ARRAY_TYPE != Float32Array && ((e[0] = 0), (e[1] = 0), (e[2] = 0)), e
    );
}
function clone$3(e) {
    var t = new ARRAY_TYPE(3);
    return (t[0] = e[0]), (t[1] = e[1]), (t[2] = e[2]), t;
}
function length$3(e) {
    var t = e[0],
        r = e[1],
        n = e[2];
    return Math.hypot(t, r, n);
}
function fromValues$3(e, t, r) {
    var n = new ARRAY_TYPE(3);
    return (n[0] = e), (n[1] = t), (n[2] = r), n;
}
function copy$3(e, t) {
    return (e[0] = t[0]), (e[1] = t[1]), (e[2] = t[2]), e;
}
function set$3(e, t, r, n) {
    return (e[0] = t), (e[1] = r), (e[2] = n), e;
}
function add$3(e, t, r) {
    return (e[0] = t[0] + r[0]), (e[1] = t[1] + r[1]), (e[2] = t[2] + r[2]), e;
}
function subtract$2(e, t, r) {
    return (e[0] = t[0] - r[0]), (e[1] = t[1] - r[1]), (e[2] = t[2] - r[2]), e;
}
function multiply$3(e, t, r) {
    return (e[0] = t[0] * r[0]), (e[1] = t[1] * r[1]), (e[2] = t[2] * r[2]), e;
}
function divide$2(e, t, r) {
    return (e[0] = t[0] / r[0]), (e[1] = t[1] / r[1]), (e[2] = t[2] / r[2]), e;
}
function ceil$2(e, t) {
    return (
        (e[0] = Math.ceil(t[0])),
        (e[1] = Math.ceil(t[1])),
        (e[2] = Math.ceil(t[2])),
        e
    );
}
function floor$2(e, t) {
    return (
        (e[0] = Math.floor(t[0])),
        (e[1] = Math.floor(t[1])),
        (e[2] = Math.floor(t[2])),
        e
    );
}
function min$2(e, t, r) {
    return (
        (e[0] = Math.min(t[0], r[0])),
        (e[1] = Math.min(t[1], r[1])),
        (e[2] = Math.min(t[2], r[2])),
        e
    );
}
function max$2(e, t, r) {
    return (
        (e[0] = Math.max(t[0], r[0])),
        (e[1] = Math.max(t[1], r[1])),
        (e[2] = Math.max(t[2], r[2])),
        e
    );
}
function round$2(e, t) {
    return (
        (e[0] = Math.round(t[0])),
        (e[1] = Math.round(t[1])),
        (e[2] = Math.round(t[2])),
        e
    );
}
function scale$3(e, t, r) {
    return (e[0] = t[0] * r), (e[1] = t[1] * r), (e[2] = t[2] * r), e;
}
function scaleAndAdd$2(e, t, r, n) {
    return (
        (e[0] = t[0] + r[0] * n),
        (e[1] = t[1] + r[1] * n),
        (e[2] = t[2] + r[2] * n),
        e
    );
}
function distance$2(e, t) {
    var r = t[0] - e[0],
        n = t[1] - e[1],
        s = t[2] - e[2];
    return Math.hypot(r, n, s);
}
function squaredDistance$2(e, t) {
    var r = t[0] - e[0],
        n = t[1] - e[1],
        s = t[2] - e[2];
    return r * r + n * n + s * s;
}
function squaredLength$3(e) {
    var t = e[0],
        r = e[1],
        n = e[2];
    return t * t + r * r + n * n;
}
function negate$2(e, t) {
    return (e[0] = -t[0]), (e[1] = -t[1]), (e[2] = -t[2]), e;
}
function inverse$2(e, t) {
    return (e[0] = 1 / t[0]), (e[1] = 1 / t[1]), (e[2] = 1 / t[2]), e;
}
function normalize$3(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = r * r + n * n + s * s;
    return (
        a > 0 && (a = 1 / Math.sqrt(a)),
        (e[0] = t[0] * a),
        (e[1] = t[1] * a),
        (e[2] = t[2] * a),
        e
    );
}
function dot$3(e, t) {
    return e[0] * t[0] + e[1] * t[1] + e[2] * t[2];
}
function cross$2(e, t, r) {
    var n = t[0],
        s = t[1],
        a = t[2],
        o = r[0],
        l = r[1],
        c = r[2];
    return (
        (e[0] = s * c - a * l),
        (e[1] = a * o - n * c),
        (e[2] = n * l - s * o),
        e
    );
}
function lerp$3(e, t, r, n) {
    var s = t[0],
        a = t[1],
        o = t[2];
    return (
        (e[0] = s + n * (r[0] - s)),
        (e[1] = a + n * (r[1] - a)),
        (e[2] = o + n * (r[2] - o)),
        e
    );
}
function hermite(e, t, r, n, s, a) {
    var o = a * a,
        l = o * (2 * a - 3) + 1,
        c = o * (a - 2) + a,
        u = o * (a - 1),
        h = o * (3 - 2 * a);
    return (
        (e[0] = t[0] * l + r[0] * c + n[0] * u + s[0] * h),
        (e[1] = t[1] * l + r[1] * c + n[1] * u + s[1] * h),
        (e[2] = t[2] * l + r[2] * c + n[2] * u + s[2] * h),
        e
    );
}
function bezier(e, t, r, n, s, a) {
    var o = 1 - a,
        l = o * o,
        c = a * a,
        u = l * o,
        h = 3 * a * l,
        f = 3 * c * o,
        d = c * a;
    return (
        (e[0] = t[0] * u + r[0] * h + n[0] * f + s[0] * d),
        (e[1] = t[1] * u + r[1] * h + n[1] * f + s[1] * d),
        (e[2] = t[2] * u + r[2] * h + n[2] * f + s[2] * d),
        e
    );
}
function random$3(e, t) {
    t = t || 1;
    var r = RANDOM() * 2 * Math.PI,
        n = RANDOM() * 2 - 1,
        s = Math.sqrt(1 - n * n) * t;
    return (
        (e[0] = Math.cos(r) * s), (e[1] = Math.sin(r) * s), (e[2] = n * t), e
    );
}
function transformMat4$2(e, t, r) {
    var n = t[0],
        s = t[1],
        a = t[2],
        o = r[3] * n + r[7] * s + r[11] * a + r[15];
    return (
        (o = o || 1),
        (e[0] = (r[0] * n + r[4] * s + r[8] * a + r[12]) / o),
        (e[1] = (r[1] * n + r[5] * s + r[9] * a + r[13]) / o),
        (e[2] = (r[2] * n + r[6] * s + r[10] * a + r[14]) / o),
        e
    );
}
function transformMat3$1(e, t, r) {
    var n = t[0],
        s = t[1],
        a = t[2];
    return (
        (e[0] = n * r[0] + s * r[3] + a * r[6]),
        (e[1] = n * r[1] + s * r[4] + a * r[7]),
        (e[2] = n * r[2] + s * r[5] + a * r[8]),
        e
    );
}
function transformQuat$1(e, t, r) {
    var n = r[0],
        s = r[1],
        a = r[2],
        o = r[3],
        l = t[0],
        c = t[1],
        u = t[2],
        h = s * u - a * c,
        f = a * l - n * u,
        d = n * c - s * l,
        p = s * d - a * f,
        _ = a * h - n * d,
        E = n * f - s * h,
        m = o * 2;
    return (
        (h *= m),
        (f *= m),
        (d *= m),
        (p *= 2),
        (_ *= 2),
        (E *= 2),
        (e[0] = l + h + p),
        (e[1] = c + f + _),
        (e[2] = u + d + E),
        e
    );
}
function rotateX$1(e, t, r, n) {
    var s = [],
        a = [];
    return (
        (s[0] = t[0] - r[0]),
        (s[1] = t[1] - r[1]),
        (s[2] = t[2] - r[2]),
        (a[0] = s[0]),
        (a[1] = s[1] * Math.cos(n) - s[2] * Math.sin(n)),
        (a[2] = s[1] * Math.sin(n) + s[2] * Math.cos(n)),
        (e[0] = a[0] + r[0]),
        (e[1] = a[1] + r[1]),
        (e[2] = a[2] + r[2]),
        e
    );
}
function rotateY$1(e, t, r, n) {
    var s = [],
        a = [];
    return (
        (s[0] = t[0] - r[0]),
        (s[1] = t[1] - r[1]),
        (s[2] = t[2] - r[2]),
        (a[0] = s[2] * Math.sin(n) + s[0] * Math.cos(n)),
        (a[1] = s[1]),
        (a[2] = s[2] * Math.cos(n) - s[0] * Math.sin(n)),
        (e[0] = a[0] + r[0]),
        (e[1] = a[1] + r[1]),
        (e[2] = a[2] + r[2]),
        e
    );
}
function rotateZ$1(e, t, r, n) {
    var s = [],
        a = [];
    return (
        (s[0] = t[0] - r[0]),
        (s[1] = t[1] - r[1]),
        (s[2] = t[2] - r[2]),
        (a[0] = s[0] * Math.cos(n) - s[1] * Math.sin(n)),
        (a[1] = s[0] * Math.sin(n) + s[1] * Math.cos(n)),
        (a[2] = s[2]),
        (e[0] = a[0] + r[0]),
        (e[1] = a[1] + r[1]),
        (e[2] = a[2] + r[2]),
        e
    );
}
function angle$1(e, t) {
    var r = e[0],
        n = e[1],
        s = e[2],
        a = t[0],
        o = t[1],
        l = t[2],
        c = Math.sqrt(r * r + n * n + s * s),
        u = Math.sqrt(a * a + o * o + l * l),
        h = c * u,
        f = h && dot$3(e, t) / h;
    return Math.acos(Math.min(Math.max(f, -1), 1));
}
function zero$2(e) {
    return (e[0] = 0), (e[1] = 0), (e[2] = 0), e;
}
function str$3(e) {
    return "vec3(" + e[0] + ", " + e[1] + ", " + e[2] + ")";
}
function exactEquals$3(e, t) {
    return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function equals$3(e, t) {
    var r = e[0],
        n = e[1],
        s = e[2],
        a = t[0],
        o = t[1],
        l = t[2];
    return (
        Math.abs(r - a) <= EPSILON * Math.max(1, Math.abs(r), Math.abs(a)) &&
        Math.abs(n - o) <= EPSILON * Math.max(1, Math.abs(n), Math.abs(o)) &&
        Math.abs(s - l) <= EPSILON * Math.max(1, Math.abs(s), Math.abs(l))
    );
}
var sub$2 = subtract$2,
    mul$3 = multiply$3,
    div$2 = divide$2,
    dist$2 = distance$2,
    sqrDist$2 = squaredDistance$2,
    len$3 = length$3,
    sqrLen$3 = squaredLength$3,
    forEach$2 = (function () {
        var e = create$3();
        return function (t, r, n, s, a, o) {
            var l, c;
            for (
                r || (r = 3),
                    n || (n = 0),
                    s ? (c = Math.min(s * r + n, t.length)) : (c = t.length),
                    l = n;
                l < c;
                l += r
            )
                (e[0] = t[l]),
                    (e[1] = t[l + 1]),
                    (e[2] = t[l + 2]),
                    a(e, e, o),
                    (t[l] = e[0]),
                    (t[l + 1] = e[1]),
                    (t[l + 2] = e[2]);
            return t;
        };
    })();
const vec3$1 = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
        {
            __proto__: null,
            add: add$3,
            angle: angle$1,
            bezier,
            ceil: ceil$2,
            clone: clone$3,
            copy: copy$3,
            create: create$3,
            cross: cross$2,
            dist: dist$2,
            distance: distance$2,
            div: div$2,
            divide: divide$2,
            dot: dot$3,
            equals: equals$3,
            exactEquals: exactEquals$3,
            floor: floor$2,
            forEach: forEach$2,
            fromValues: fromValues$3,
            hermite,
            inverse: inverse$2,
            len: len$3,
            length: length$3,
            lerp: lerp$3,
            max: max$2,
            min: min$2,
            mul: mul$3,
            multiply: multiply$3,
            negate: negate$2,
            normalize: normalize$3,
            random: random$3,
            rotateX: rotateX$1,
            rotateY: rotateY$1,
            rotateZ: rotateZ$1,
            round: round$2,
            scale: scale$3,
            scaleAndAdd: scaleAndAdd$2,
            set: set$3,
            sqrDist: sqrDist$2,
            sqrLen: sqrLen$3,
            squaredDistance: squaredDistance$2,
            squaredLength: squaredLength$3,
            str: str$3,
            sub: sub$2,
            subtract: subtract$2,
            transformMat3: transformMat3$1,
            transformMat4: transformMat4$2,
            transformQuat: transformQuat$1,
            zero: zero$2,
        },
        Symbol.toStringTag,
        { value: "Module" }
    )
);
function create$2() {
    var e = new ARRAY_TYPE(4);
    return (
        ARRAY_TYPE != Float32Array &&
            ((e[0] = 0), (e[1] = 0), (e[2] = 0), (e[3] = 0)),
        e
    );
}
function clone$2(e) {
    var t = new ARRAY_TYPE(4);
    return (t[0] = e[0]), (t[1] = e[1]), (t[2] = e[2]), (t[3] = e[3]), t;
}
function fromValues$2(e, t, r, n) {
    var s = new ARRAY_TYPE(4);
    return (s[0] = e), (s[1] = t), (s[2] = r), (s[3] = n), s;
}
function copy$2(e, t) {
    return (e[0] = t[0]), (e[1] = t[1]), (e[2] = t[2]), (e[3] = t[3]), e;
}
function set$2(e, t, r, n, s) {
    return (e[0] = t), (e[1] = r), (e[2] = n), (e[3] = s), e;
}
function add$2(e, t, r) {
    return (
        (e[0] = t[0] + r[0]),
        (e[1] = t[1] + r[1]),
        (e[2] = t[2] + r[2]),
        (e[3] = t[3] + r[3]),
        e
    );
}
function subtract$1(e, t, r) {
    return (
        (e[0] = t[0] - r[0]),
        (e[1] = t[1] - r[1]),
        (e[2] = t[2] - r[2]),
        (e[3] = t[3] - r[3]),
        e
    );
}
function multiply$2(e, t, r) {
    return (
        (e[0] = t[0] * r[0]),
        (e[1] = t[1] * r[1]),
        (e[2] = t[2] * r[2]),
        (e[3] = t[3] * r[3]),
        e
    );
}
function divide$1(e, t, r) {
    return (
        (e[0] = t[0] / r[0]),
        (e[1] = t[1] / r[1]),
        (e[2] = t[2] / r[2]),
        (e[3] = t[3] / r[3]),
        e
    );
}
function ceil$1(e, t) {
    return (
        (e[0] = Math.ceil(t[0])),
        (e[1] = Math.ceil(t[1])),
        (e[2] = Math.ceil(t[2])),
        (e[3] = Math.ceil(t[3])),
        e
    );
}
function floor$1(e, t) {
    return (
        (e[0] = Math.floor(t[0])),
        (e[1] = Math.floor(t[1])),
        (e[2] = Math.floor(t[2])),
        (e[3] = Math.floor(t[3])),
        e
    );
}
function min$1(e, t, r) {
    return (
        (e[0] = Math.min(t[0], r[0])),
        (e[1] = Math.min(t[1], r[1])),
        (e[2] = Math.min(t[2], r[2])),
        (e[3] = Math.min(t[3], r[3])),
        e
    );
}
function max$1(e, t, r) {
    return (
        (e[0] = Math.max(t[0], r[0])),
        (e[1] = Math.max(t[1], r[1])),
        (e[2] = Math.max(t[2], r[2])),
        (e[3] = Math.max(t[3], r[3])),
        e
    );
}
function round$1(e, t) {
    return (
        (e[0] = Math.round(t[0])),
        (e[1] = Math.round(t[1])),
        (e[2] = Math.round(t[2])),
        (e[3] = Math.round(t[3])),
        e
    );
}
function scale$2(e, t, r) {
    return (
        (e[0] = t[0] * r),
        (e[1] = t[1] * r),
        (e[2] = t[2] * r),
        (e[3] = t[3] * r),
        e
    );
}
function scaleAndAdd$1(e, t, r, n) {
    return (
        (e[0] = t[0] + r[0] * n),
        (e[1] = t[1] + r[1] * n),
        (e[2] = t[2] + r[2] * n),
        (e[3] = t[3] + r[3] * n),
        e
    );
}
function distance$1(e, t) {
    var r = t[0] - e[0],
        n = t[1] - e[1],
        s = t[2] - e[2],
        a = t[3] - e[3];
    return Math.hypot(r, n, s, a);
}
function squaredDistance$1(e, t) {
    var r = t[0] - e[0],
        n = t[1] - e[1],
        s = t[2] - e[2],
        a = t[3] - e[3];
    return r * r + n * n + s * s + a * a;
}
function length$2(e) {
    var t = e[0],
        r = e[1],
        n = e[2],
        s = e[3];
    return Math.hypot(t, r, n, s);
}
function squaredLength$2(e) {
    var t = e[0],
        r = e[1],
        n = e[2],
        s = e[3];
    return t * t + r * r + n * n + s * s;
}
function negate$1(e, t) {
    return (e[0] = -t[0]), (e[1] = -t[1]), (e[2] = -t[2]), (e[3] = -t[3]), e;
}
function inverse$1(e, t) {
    return (
        (e[0] = 1 / t[0]),
        (e[1] = 1 / t[1]),
        (e[2] = 1 / t[2]),
        (e[3] = 1 / t[3]),
        e
    );
}
function normalize$2(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = t[3],
        o = r * r + n * n + s * s + a * a;
    return (
        o > 0 && (o = 1 / Math.sqrt(o)),
        (e[0] = r * o),
        (e[1] = n * o),
        (e[2] = s * o),
        (e[3] = a * o),
        e
    );
}
function dot$2(e, t) {
    return e[0] * t[0] + e[1] * t[1] + e[2] * t[2] + e[3] * t[3];
}
function cross$1(e, t, r, n) {
    var s = r[0] * n[1] - r[1] * n[0],
        a = r[0] * n[2] - r[2] * n[0],
        o = r[0] * n[3] - r[3] * n[0],
        l = r[1] * n[2] - r[2] * n[1],
        c = r[1] * n[3] - r[3] * n[1],
        u = r[2] * n[3] - r[3] * n[2],
        h = t[0],
        f = t[1],
        d = t[2],
        p = t[3];
    return (
        (e[0] = f * u - d * c + p * l),
        (e[1] = -(h * u) + d * o - p * a),
        (e[2] = h * c - f * o + p * s),
        (e[3] = -(h * l) + f * a - d * s),
        e
    );
}
function lerp$2(e, t, r, n) {
    var s = t[0],
        a = t[1],
        o = t[2],
        l = t[3];
    return (
        (e[0] = s + n * (r[0] - s)),
        (e[1] = a + n * (r[1] - a)),
        (e[2] = o + n * (r[2] - o)),
        (e[3] = l + n * (r[3] - l)),
        e
    );
}
function random$2(e, t) {
    t = t || 1;
    var r, n, s, a, o, l;
    do (r = RANDOM() * 2 - 1), (n = RANDOM() * 2 - 1), (o = r * r + n * n);
    while (o >= 1);
    do (s = RANDOM() * 2 - 1), (a = RANDOM() * 2 - 1), (l = s * s + a * a);
    while (l >= 1);
    var c = Math.sqrt((1 - o) / l);
    return (
        (e[0] = t * r),
        (e[1] = t * n),
        (e[2] = t * s * c),
        (e[3] = t * a * c),
        e
    );
}
function transformMat4$1(e, t, r) {
    var n = t[0],
        s = t[1],
        a = t[2],
        o = t[3];
    return (
        (e[0] = r[0] * n + r[4] * s + r[8] * a + r[12] * o),
        (e[1] = r[1] * n + r[5] * s + r[9] * a + r[13] * o),
        (e[2] = r[2] * n + r[6] * s + r[10] * a + r[14] * o),
        (e[3] = r[3] * n + r[7] * s + r[11] * a + r[15] * o),
        e
    );
}
function transformQuat(e, t, r) {
    var n = t[0],
        s = t[1],
        a = t[2],
        o = r[0],
        l = r[1],
        c = r[2],
        u = r[3],
        h = u * n + l * a - c * s,
        f = u * s + c * n - o * a,
        d = u * a + o * s - l * n,
        p = -o * n - l * s - c * a;
    return (
        (e[0] = h * u + p * -o + f * -c - d * -l),
        (e[1] = f * u + p * -l + d * -o - h * -c),
        (e[2] = d * u + p * -c + h * -l - f * -o),
        (e[3] = t[3]),
        e
    );
}
function zero$1(e) {
    return (e[0] = 0), (e[1] = 0), (e[2] = 0), (e[3] = 0), e;
}
function str$2(e) {
    return "vec4(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")";
}
function exactEquals$2(e, t) {
    return e[0] === t[0] && e[1] === t[1] && e[2] === t[2] && e[3] === t[3];
}
function equals$2(e, t) {
    var r = e[0],
        n = e[1],
        s = e[2],
        a = e[3],
        o = t[0],
        l = t[1],
        c = t[2],
        u = t[3];
    return (
        Math.abs(r - o) <= EPSILON * Math.max(1, Math.abs(r), Math.abs(o)) &&
        Math.abs(n - l) <= EPSILON * Math.max(1, Math.abs(n), Math.abs(l)) &&
        Math.abs(s - c) <= EPSILON * Math.max(1, Math.abs(s), Math.abs(c)) &&
        Math.abs(a - u) <= EPSILON * Math.max(1, Math.abs(a), Math.abs(u))
    );
}
var sub$1 = subtract$1,
    mul$2 = multiply$2,
    div$1 = divide$1,
    dist$1 = distance$1,
    sqrDist$1 = squaredDistance$1,
    len$2 = length$2,
    sqrLen$2 = squaredLength$2,
    forEach$1 = (function () {
        var e = create$2();
        return function (t, r, n, s, a, o) {
            var l, c;
            for (
                r || (r = 4),
                    n || (n = 0),
                    s ? (c = Math.min(s * r + n, t.length)) : (c = t.length),
                    l = n;
                l < c;
                l += r
            )
                (e[0] = t[l]),
                    (e[1] = t[l + 1]),
                    (e[2] = t[l + 2]),
                    (e[3] = t[l + 3]),
                    a(e, e, o),
                    (t[l] = e[0]),
                    (t[l + 1] = e[1]),
                    (t[l + 2] = e[2]),
                    (t[l + 3] = e[3]);
            return t;
        };
    })();
const vec4$1 = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
        {
            __proto__: null,
            add: add$2,
            ceil: ceil$1,
            clone: clone$2,
            copy: copy$2,
            create: create$2,
            cross: cross$1,
            dist: dist$1,
            distance: distance$1,
            div: div$1,
            divide: divide$1,
            dot: dot$2,
            equals: equals$2,
            exactEquals: exactEquals$2,
            floor: floor$1,
            forEach: forEach$1,
            fromValues: fromValues$2,
            inverse: inverse$1,
            len: len$2,
            length: length$2,
            lerp: lerp$2,
            max: max$1,
            min: min$1,
            mul: mul$2,
            multiply: multiply$2,
            negate: negate$1,
            normalize: normalize$2,
            random: random$2,
            round: round$1,
            scale: scale$2,
            scaleAndAdd: scaleAndAdd$1,
            set: set$2,
            sqrDist: sqrDist$1,
            sqrLen: sqrLen$2,
            squaredDistance: squaredDistance$1,
            squaredLength: squaredLength$2,
            str: str$2,
            sub: sub$1,
            subtract: subtract$1,
            transformMat4: transformMat4$1,
            transformQuat,
            zero: zero$1,
        },
        Symbol.toStringTag,
        { value: "Module" }
    )
);
function create$1() {
    var e = new ARRAY_TYPE(4);
    return (
        ARRAY_TYPE != Float32Array && ((e[0] = 0), (e[1] = 0), (e[2] = 0)),
        (e[3] = 1),
        e
    );
}
function identity(e) {
    return (e[0] = 0), (e[1] = 0), (e[2] = 0), (e[3] = 1), e;
}
function setAxisAngle(e, t, r) {
    r = r * 0.5;
    var n = Math.sin(r);
    return (
        (e[0] = n * t[0]),
        (e[1] = n * t[1]),
        (e[2] = n * t[2]),
        (e[3] = Math.cos(r)),
        e
    );
}
function getAxisAngle(e, t) {
    var r = Math.acos(t[3]) * 2,
        n = Math.sin(r / 2);
    return (
        n > EPSILON
            ? ((e[0] = t[0] / n), (e[1] = t[1] / n), (e[2] = t[2] / n))
            : ((e[0] = 1), (e[1] = 0), (e[2] = 0)),
        r
    );
}
function getAngle(e, t) {
    var r = dot$1(e, t);
    return Math.acos(2 * r * r - 1);
}
function multiply$1(e, t, r) {
    var n = t[0],
        s = t[1],
        a = t[2],
        o = t[3],
        l = r[0],
        c = r[1],
        u = r[2],
        h = r[3];
    return (
        (e[0] = n * h + o * l + s * u - a * c),
        (e[1] = s * h + o * c + a * l - n * u),
        (e[2] = a * h + o * u + n * c - s * l),
        (e[3] = o * h - n * l - s * c - a * u),
        e
    );
}
function rotateX(e, t, r) {
    r *= 0.5;
    var n = t[0],
        s = t[1],
        a = t[2],
        o = t[3],
        l = Math.sin(r),
        c = Math.cos(r);
    return (
        (e[0] = n * c + o * l),
        (e[1] = s * c + a * l),
        (e[2] = a * c - s * l),
        (e[3] = o * c - n * l),
        e
    );
}
function rotateY(e, t, r) {
    r *= 0.5;
    var n = t[0],
        s = t[1],
        a = t[2],
        o = t[3],
        l = Math.sin(r),
        c = Math.cos(r);
    return (
        (e[0] = n * c - a * l),
        (e[1] = s * c + o * l),
        (e[2] = a * c + n * l),
        (e[3] = o * c - s * l),
        e
    );
}
function rotateZ(e, t, r) {
    r *= 0.5;
    var n = t[0],
        s = t[1],
        a = t[2],
        o = t[3],
        l = Math.sin(r),
        c = Math.cos(r);
    return (
        (e[0] = n * c + s * l),
        (e[1] = s * c - n * l),
        (e[2] = a * c + o * l),
        (e[3] = o * c - a * l),
        e
    );
}
function calculateW(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2];
    return (
        (e[0] = r),
        (e[1] = n),
        (e[2] = s),
        (e[3] = Math.sqrt(Math.abs(1 - r * r - n * n - s * s))),
        e
    );
}
function exp(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = t[3],
        o = Math.sqrt(r * r + n * n + s * s),
        l = Math.exp(a),
        c = o > 0 ? (l * Math.sin(o)) / o : 0;
    return (
        (e[0] = r * c),
        (e[1] = n * c),
        (e[2] = s * c),
        (e[3] = l * Math.cos(o)),
        e
    );
}
function ln(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = t[3],
        o = Math.sqrt(r * r + n * n + s * s),
        l = o > 0 ? Math.atan2(o, a) / o : 0;
    return (
        (e[0] = r * l),
        (e[1] = n * l),
        (e[2] = s * l),
        (e[3] = 0.5 * Math.log(r * r + n * n + s * s + a * a)),
        e
    );
}
function pow(e, t, r) {
    return ln(e, t), scale$1(e, e, r), exp(e, e), e;
}
function slerp(e, t, r, n) {
    var s = t[0],
        a = t[1],
        o = t[2],
        l = t[3],
        c = r[0],
        u = r[1],
        h = r[2],
        f = r[3],
        d,
        p,
        _,
        E,
        m;
    return (
        (p = s * c + a * u + o * h + l * f),
        p < 0 && ((p = -p), (c = -c), (u = -u), (h = -h), (f = -f)),
        1 - p > EPSILON
            ? ((d = Math.acos(p)),
              (_ = Math.sin(d)),
              (E = Math.sin((1 - n) * d) / _),
              (m = Math.sin(n * d) / _))
            : ((E = 1 - n), (m = n)),
        (e[0] = E * s + m * c),
        (e[1] = E * a + m * u),
        (e[2] = E * o + m * h),
        (e[3] = E * l + m * f),
        e
    );
}
function random$1(e) {
    var t = RANDOM(),
        r = RANDOM(),
        n = RANDOM(),
        s = Math.sqrt(1 - t),
        a = Math.sqrt(t);
    return (
        (e[0] = s * Math.sin(2 * Math.PI * r)),
        (e[1] = s * Math.cos(2 * Math.PI * r)),
        (e[2] = a * Math.sin(2 * Math.PI * n)),
        (e[3] = a * Math.cos(2 * Math.PI * n)),
        e
    );
}
function invert(e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = t[3],
        o = r * r + n * n + s * s + a * a,
        l = o ? 1 / o : 0;
    return (e[0] = -r * l), (e[1] = -n * l), (e[2] = -s * l), (e[3] = a * l), e;
}
function conjugate(e, t) {
    return (e[0] = -t[0]), (e[1] = -t[1]), (e[2] = -t[2]), (e[3] = t[3]), e;
}
function fromMat3(e, t) {
    var r = t[0] + t[4] + t[8],
        n;
    if (r > 0)
        (n = Math.sqrt(r + 1)),
            (e[3] = 0.5 * n),
            (n = 0.5 / n),
            (e[0] = (t[5] - t[7]) * n),
            (e[1] = (t[6] - t[2]) * n),
            (e[2] = (t[1] - t[3]) * n);
    else {
        var s = 0;
        t[4] > t[0] && (s = 1), t[8] > t[s * 3 + s] && (s = 2);
        var a = (s + 1) % 3,
            o = (s + 2) % 3;
        (n = Math.sqrt(t[s * 3 + s] - t[a * 3 + a] - t[o * 3 + o] + 1)),
            (e[s] = 0.5 * n),
            (n = 0.5 / n),
            (e[3] = (t[a * 3 + o] - t[o * 3 + a]) * n),
            (e[a] = (t[a * 3 + s] + t[s * 3 + a]) * n),
            (e[o] = (t[o * 3 + s] + t[s * 3 + o]) * n);
    }
    return e;
}
function fromEuler(e, t, r, n) {
    var s = (0.5 * Math.PI) / 180;
    (t *= s), (r *= s), (n *= s);
    var a = Math.sin(t),
        o = Math.cos(t),
        l = Math.sin(r),
        c = Math.cos(r),
        u = Math.sin(n),
        h = Math.cos(n);
    return (
        (e[0] = a * c * h - o * l * u),
        (e[1] = o * l * h + a * c * u),
        (e[2] = o * c * u - a * l * h),
        (e[3] = o * c * h + a * l * u),
        e
    );
}
function str$1(e) {
    return "quat(" + e[0] + ", " + e[1] + ", " + e[2] + ", " + e[3] + ")";
}
var clone$1 = clone$2,
    fromValues$1 = fromValues$2,
    copy$1 = copy$2,
    set$1 = set$2,
    add$1 = add$2,
    mul$1 = multiply$1,
    scale$1 = scale$2,
    dot$1 = dot$2,
    lerp$1 = lerp$2,
    length$1 = length$2,
    len$1 = length$1,
    squaredLength$1 = squaredLength$2,
    sqrLen$1 = squaredLength$1,
    normalize$1 = normalize$2,
    exactEquals$1 = exactEquals$2,
    equals$1 = equals$2,
    rotationTo = (function () {
        var e = create$3(),
            t = fromValues$3(1, 0, 0),
            r = fromValues$3(0, 1, 0);
        return function (n, s, a) {
            var o = dot$3(s, a);
            return o < -0.999999
                ? (cross$2(e, t, s),
                  len$3(e) < 1e-6 && cross$2(e, r, s),
                  normalize$3(e, e),
                  setAxisAngle(n, e, Math.PI),
                  n)
                : o > 0.999999
                ? ((n[0] = 0), (n[1] = 0), (n[2] = 0), (n[3] = 1), n)
                : (cross$2(e, s, a),
                  (n[0] = e[0]),
                  (n[1] = e[1]),
                  (n[2] = e[2]),
                  (n[3] = 1 + o),
                  normalize$1(n, n));
        };
    })(),
    sqlerp = (function () {
        var e = create$1(),
            t = create$1();
        return function (r, n, s, a, o, l) {
            return (
                slerp(e, n, o, l),
                slerp(t, s, a, l),
                slerp(r, e, t, 2 * l * (1 - l)),
                r
            );
        };
    })(),
    setAxes = (function () {
        var e = create$5();
        return function (t, r, n, s) {
            return (
                (e[0] = n[0]),
                (e[3] = n[1]),
                (e[6] = n[2]),
                (e[1] = s[0]),
                (e[4] = s[1]),
                (e[7] = s[2]),
                (e[2] = -r[0]),
                (e[5] = -r[1]),
                (e[8] = -r[2]),
                normalize$1(t, fromMat3(t, e))
            );
        };
    })();
const quat$1 = /* @__PURE__ */ Object.freeze(
    /* @__PURE__ */ Object.defineProperty(
        {
            __proto__: null,
            add: add$1,
            calculateW,
            clone: clone$1,
            conjugate,
            copy: copy$1,
            create: create$1,
            dot: dot$1,
            equals: equals$1,
            exactEquals: exactEquals$1,
            exp,
            fromEuler,
            fromMat3,
            fromValues: fromValues$1,
            getAngle,
            getAxisAngle,
            identity,
            invert,
            len: len$1,
            length: length$1,
            lerp: lerp$1,
            ln,
            mul: mul$1,
            multiply: multiply$1,
            normalize: normalize$1,
            pow,
            random: random$1,
            rotateX,
            rotateY,
            rotateZ,
            rotationTo,
            scale: scale$1,
            set: set$1,
            setAxes,
            setAxisAngle,
            slerp,
            sqlerp,
            sqrLen: sqrLen$1,
            squaredLength: squaredLength$1,
            str: str$1,
        },
        Symbol.toStringTag,
        { value: "Module" }
    )
);
function create() {
    var e = new ARRAY_TYPE(2);
    return ARRAY_TYPE != Float32Array && ((e[0] = 0), (e[1] = 0)), e;
}
function clone(e) {
    var t = new ARRAY_TYPE(2);
    return (t[0] = e[0]), (t[1] = e[1]), t;
}
function fromValues(e, t) {
    var r = new ARRAY_TYPE(2);
    return (r[0] = e), (r[1] = t), r;
}
function copy(e, t) {
    return (e[0] = t[0]), (e[1] = t[1]), e;
}
function set(e, t, r) {
    return (e[0] = t), (e[1] = r), e;
}
function add(e, t, r) {
    return (e[0] = t[0] + r[0]), (e[1] = t[1] + r[1]), e;
}
function subtract(e, t, r) {
    return (e[0] = t[0] - r[0]), (e[1] = t[1] - r[1]), e;
}
function multiply(e, t, r) {
    return (e[0] = t[0] * r[0]), (e[1] = t[1] * r[1]), e;
}
function divide(e, t, r) {
    return (e[0] = t[0] / r[0]), (e[1] = t[1] / r[1]), e;
}
function ceil(e, t) {
    return (e[0] = Math.ceil(t[0])), (e[1] = Math.ceil(t[1])), e;
}
function floor(e, t) {
    return (e[0] = Math.floor(t[0])), (e[1] = Math.floor(t[1])), e;
}
function min(e, t, r) {
    return (e[0] = Math.min(t[0], r[0])), (e[1] = Math.min(t[1], r[1])), e;
}
function max(e, t, r) {
    return (e[0] = Math.max(t[0], r[0])), (e[1] = Math.max(t[1], r[1])), e;
}
function round(e, t) {
    return (e[0] = Math.round(t[0])), (e[1] = Math.round(t[1])), e;
}
function scale(e, t, r) {
    return (e[0] = t[0] * r), (e[1] = t[1] * r), e;
}
function scaleAndAdd(e, t, r, n) {
    return (e[0] = t[0] + r[0] * n), (e[1] = t[1] + r[1] * n), e;
}
function distance(e, t) {
    var r = t[0] - e[0],
        n = t[1] - e[1];
    return Math.hypot(r, n);
}
function squaredDistance(e, t) {
    var r = t[0] - e[0],
        n = t[1] - e[1];
    return r * r + n * n;
}
function length(e) {
    var t = e[0],
        r = e[1];
    return Math.hypot(t, r);
}
function squaredLength(e) {
    var t = e[0],
        r = e[1];
    return t * t + r * r;
}
function negate(e, t) {
    return (e[0] = -t[0]), (e[1] = -t[1]), e;
}
function inverse(e, t) {
    return (e[0] = 1 / t[0]), (e[1] = 1 / t[1]), e;
}
function normalize(e, t) {
    var r = t[0],
        n = t[1],
        s = r * r + n * n;
    return (
        s > 0 && (s = 1 / Math.sqrt(s)), (e[0] = t[0] * s), (e[1] = t[1] * s), e
    );
}
function dot(e, t) {
    return e[0] * t[0] + e[1] * t[1];
}
function cross(e, t, r) {
    var n = t[0] * r[1] - t[1] * r[0];
    return (e[0] = e[1] = 0), (e[2] = n), e;
}
function lerp(e, t, r, n) {
    var s = t[0],
        a = t[1];
    return (e[0] = s + n * (r[0] - s)), (e[1] = a + n * (r[1] - a)), e;
}
function random(e, t) {
    t = t || 1;
    var r = RANDOM() * 2 * Math.PI;
    return (e[0] = Math.cos(r) * t), (e[1] = Math.sin(r) * t), e;
}
function transformMat2(e, t, r) {
    var n = t[0],
        s = t[1];
    return (e[0] = r[0] * n + r[2] * s), (e[1] = r[1] * n + r[3] * s), e;
}
function transformMat2d(e, t, r) {
    var n = t[0],
        s = t[1];
    return (
        (e[0] = r[0] * n + r[2] * s + r[4]),
        (e[1] = r[1] * n + r[3] * s + r[5]),
        e
    );
}
function transformMat3(e, t, r) {
    var n = t[0],
        s = t[1];
    return (
        (e[0] = r[0] * n + r[3] * s + r[6]),
        (e[1] = r[1] * n + r[4] * s + r[7]),
        e
    );
}
function transformMat4(e, t, r) {
    var n = t[0],
        s = t[1];
    return (
        (e[0] = r[0] * n + r[4] * s + r[12]),
        (e[1] = r[1] * n + r[5] * s + r[13]),
        e
    );
}
function rotate(e, t, r, n) {
    var s = t[0] - r[0],
        a = t[1] - r[1],
        o = Math.sin(n),
        l = Math.cos(n);
    return (e[0] = s * l - a * o + r[0]), (e[1] = s * o + a * l + r[1]), e;
}
function angle(e, t) {
    var r = e[0],
        n = e[1],
        s = t[0],
        a = t[1],
        o = Math.sqrt(r * r + n * n) * Math.sqrt(s * s + a * a),
        l = o && (r * s + n * a) / o;
    return Math.acos(Math.min(Math.max(l, -1), 1));
}
function zero(e) {
    return (e[0] = 0), (e[1] = 0), e;
}
function str(e) {
    return "vec2(" + e[0] + ", " + e[1] + ")";
}
function exactEquals(e, t) {
    return e[0] === t[0] && e[1] === t[1];
}
function equals(e, t) {
    var r = e[0],
        n = e[1],
        s = t[0],
        a = t[1];
    return (
        Math.abs(r - s) <= EPSILON * Math.max(1, Math.abs(r), Math.abs(s)) &&
        Math.abs(n - a) <= EPSILON * Math.max(1, Math.abs(n), Math.abs(a))
    );
}
var len = length,
    sub = subtract,
    mul = multiply,
    div = divide,
    dist = distance,
    sqrDist = squaredDistance,
    sqrLen = squaredLength,
    forEach = (function () {
        var e = create();
        return function (t, r, n, s, a, o) {
            var l, c;
            for (
                r || (r = 2),
                    n || (n = 0),
                    s ? (c = Math.min(s * r + n, t.length)) : (c = t.length),
                    l = n;
                l < c;
                l += r
            )
                (e[0] = t[l]),
                    (e[1] = t[l + 1]),
                    a(e, e, o),
                    (t[l] = e[0]),
                    (t[l + 1] = e[1]);
            return t;
        };
    })();
const vec2$1 = /* @__PURE__ */ Object.freeze(
        /* @__PURE__ */ Object.defineProperty(
            {
                __proto__: null,
                add,
                angle,
                ceil,
                clone,
                copy,
                create,
                cross,
                dist,
                distance,
                div,
                divide,
                dot,
                equals,
                exactEquals,
                floor,
                forEach,
                fromValues,
                inverse,
                len,
                length,
                lerp,
                max,
                min,
                mul,
                multiply,
                negate,
                normalize,
                random,
                rotate,
                round,
                scale,
                scaleAndAdd,
                set,
                sqrDist,
                sqrLen,
                squaredDistance,
                squaredLength,
                str,
                sub,
                subtract,
                transformMat2,
                transformMat2d,
                transformMat3,
                transformMat4,
                zero,
            },
            Symbol.toStringTag,
            { value: "Module" }
        )
    ),
    vec2 = Object.assign({}, vec2$1),
    vec3 = Object.assign({}, vec3$1),
    vec4 = Object.assign({}, vec4$1),
    quat = Object.assign({}, quat$1),
    mat3 = Object.assign({}, mat3$1),
    mat4 = Object.assign({}, mat4$1),
    global = typeof window < "u" ? window : typeof self < "u" ? self : global,
    GL$1 = (global.GL = global.LiteGL = {});
global.requestAnimationFrame =
    global.requestAnimationFrame ||
    global.mozRequestAnimationFrame ||
    global.webkitRequestAnimationFrame ||
    function (e) {
        setTimeout(e, 1e3 / 60);
    };
GL$1.blockable_keys = { Up: !0, Down: !0, Left: !0, Right: !0 };
GL$1.reverse = null;
GL$1.LEFT_MOUSE_BUTTON = 0;
GL$1.MIDDLE_MOUSE_BUTTON = 1;
GL$1.RIGHT_MOUSE_BUTTON = 2;
GL$1.LEFT_MOUSE_BUTTON_MASK = 1;
GL$1.RIGHT_MOUSE_BUTTON_MASK = 2;
GL$1.MIDDLE_MOUSE_BUTTON_MASK = 4;
GL$1.last_context_id = 0;
GL$1.COLOR_BUFFER_BIT = 16384;
GL$1.DEPTH_BUFFER_BIT = 256;
GL$1.STENCIL_BUFFER_BIT = 1024;
GL$1.TEXTURE_2D = 3553;
GL$1.TEXTURE_CUBE_MAP = 34067;
GL$1.TEXTURE_3D = 32879;
GL$1.TEXTURE_MAG_FILTER = 10240;
GL$1.TEXTURE_MIN_FILTER = 10241;
GL$1.TEXTURE_WRAP_S = 10242;
GL$1.TEXTURE_WRAP_T = 10243;
GL$1.BYTE = 5120;
GL$1.UNSIGNED_BYTE = 5121;
GL$1.SHORT = 5122;
GL$1.UNSIGNED_SHORT = 5123;
GL$1.INT = 5124;
GL$1.UNSIGNED_INT = 5125;
GL$1.FLOAT = 5126;
GL$1.HALF_FLOAT_OES = 36193;
GL$1.HALF_FLOAT = 5131;
GL$1.DEPTH_COMPONENT16 = 33189;
GL$1.DEPTH_COMPONENT24 = 33190;
GL$1.DEPTH_COMPONENT32F = 36012;
GL$1.FLOAT_VEC2 = 35664;
GL$1.FLOAT_VEC3 = 35665;
GL$1.FLOAT_VEC4 = 35666;
GL$1.INT_VEC2 = 35667;
GL$1.INT_VEC3 = 35668;
GL$1.INT_VEC4 = 35669;
GL$1.BOOL = 35670;
GL$1.BOOL_VEC2 = 35671;
GL$1.BOOL_VEC3 = 35672;
GL$1.BOOL_VEC4 = 35673;
GL$1.FLOAT_MAT2 = 35674;
GL$1.FLOAT_MAT3 = 35675;
GL$1.FLOAT_MAT4 = 35676;
GL$1.TYPE_LENGTH = {};
GL$1.TYPE_LENGTH[GL$1.FLOAT] =
    GL$1.TYPE_LENGTH[GL$1.INT] =
    GL$1.TYPE_LENGTH[GL$1.BYTE] =
    GL$1.TYPE_LENGTH[GL$1.BOOL] =
        1;
GL$1.TYPE_LENGTH[GL$1.FLOAT_VEC2] =
    GL$1.TYPE_LENGTH[GL$1.INT_VEC2] =
    GL$1.TYPE_LENGTH[GL$1.BOOL_VEC2] =
        2;
GL$1.TYPE_LENGTH[GL$1.FLOAT_VEC3] =
    GL$1.TYPE_LENGTH[GL$1.INT_VEC3] =
    GL$1.TYPE_LENGTH[GL$1.BOOL_VEC3] =
        3;
GL$1.TYPE_LENGTH[GL$1.FLOAT_VEC4] =
    GL$1.TYPE_LENGTH[GL$1.INT_VEC4] =
    GL$1.TYPE_LENGTH[GL$1.BOOL_VEC4] =
        4;
GL$1.TYPE_LENGTH[GL$1.FLOAT_MAT3] = 9;
GL$1.TYPE_LENGTH[GL$1.FLOAT_MAT4] = 16;
GL$1.SAMPLER_2D = 35678;
GL$1.SAMPLER_3D = 35679;
GL$1.SAMPLER_CUBE = 35680;
GL$1.INT_SAMPLER_2D = 36298;
GL$1.INT_SAMPLER_3D = 36299;
GL$1.INT_SAMPLER_CUBE = 36300;
GL$1.UNSIGNED_INT_SAMPLER_2D = 36306;
GL$1.UNSIGNED_INT_SAMPLER_3D = 36307;
GL$1.UNSIGNED_INT_SAMPLER_CUBE = 36308;
GL$1.DEPTH_COMPONENT = 6402;
GL$1.ALPHA = 6406;
GL$1.RGB = 6407;
GL$1.RGBA = 6408;
GL$1.LUMINANCE = 6409;
GL$1.LUMINANCE_ALPHA = 6410;
GL$1.DEPTH_STENCIL = 34041;
GL$1.UNSIGNED_INT_24_8 = GL$1.UNSIGNED_INT_24_8_WEBGL = 34042;
GL$1.R8 = 33321;
GL$1.R16F = 33325;
GL$1.R32F = 33326;
GL$1.R8UI = 33330;
GL$1.RG8 = 33323;
GL$1.RG16F = 33327;
GL$1.RG32F = 33328;
GL$1.RGB8 = 32849;
GL$1.SRGB8 = 35905;
GL$1.RGB565 = 36194;
GL$1.R11F_G11F_B10F = 35898;
GL$1.RGB9_E5 = 35901;
GL$1.RGB16F = 34843;
GL$1.RGB32F = 34837;
GL$1.RGB8UI = 36221;
GL$1.RGBA8 = 32856;
GL$1.RGB5_A1 = 32855;
GL$1.RGBA16F = 34842;
GL$1.RGBA32F = 34836;
GL$1.RGBA8UI = 36220;
GL$1.RGBA16I = 36232;
GL$1.RGBA16UI = 36214;
GL$1.RGBA32I = 36226;
GL$1.RGBA32UI = 36208;
GL$1.DEPTH24_STENCIL8 = 35056;
GL$1.NEAREST = 9728;
GL$1.LINEAR = 9729;
GL$1.NEAREST_MIPMAP_NEAREST = 9984;
GL$1.LINEAR_MIPMAP_NEAREST = 9985;
GL$1.NEAREST_MIPMAP_LINEAR = 9986;
GL$1.LINEAR_MIPMAP_LINEAR = 9987;
GL$1.REPEAT = 10497;
GL$1.CLAMP_TO_EDGE = 33071;
GL$1.MIRRORED_REPEAT = 33648;
GL$1.ZERO = 0;
GL$1.ONE = 1;
GL$1.SRC_COLOR = 768;
GL$1.ONE_MINUS_SRC_COLOR = 769;
GL$1.SRC_ALPHA = 770;
GL$1.ONE_MINUS_SRC_ALPHA = 771;
GL$1.DST_ALPHA = 772;
GL$1.ONE_MINUS_DST_ALPHA = 773;
GL$1.DST_COLOR = 774;
GL$1.ONE_MINUS_DST_COLOR = 775;
GL$1.SRC_ALPHA_SATURATE = 776;
GL$1.CONSTANT_COLOR = 32769;
GL$1.ONE_MINUS_CONSTANT_COLOR = 32770;
GL$1.CONSTANT_ALPHA = 32771;
GL$1.ONE_MINUS_CONSTANT_ALPHA = 32772;
GL$1.VERTEX_SHADER = 35633;
GL$1.FRAGMENT_SHADER = 35632;
GL$1.FRONT = 1028;
GL$1.BACK = 1029;
GL$1.FRONT_AND_BACK = 1032;
GL$1.NEVER = 512;
GL$1.LESS = 513;
GL$1.EQUAL = 514;
GL$1.LEQUAL = 515;
GL$1.GREATER = 516;
GL$1.NOTEQUAL = 517;
GL$1.GEQUAL = 518;
GL$1.ALWAYS = 519;
GL$1.KEEP = 7680;
GL$1.REPLACE = 7681;
GL$1.INCR = 7682;
GL$1.DECR = 7683;
GL$1.INCR_WRAP = 34055;
GL$1.DECR_WRAP = 34056;
GL$1.INVERT = 5386;
GL$1.STREAM_DRAW = 35040;
GL$1.STATIC_DRAW = 35044;
GL$1.DYNAMIC_DRAW = 35048;
GL$1.ARRAY_BUFFER = 34962;
GL$1.ELEMENT_ARRAY_BUFFER = 34963;
GL$1.POINTS = 0;
GL$1.LINES = 1;
GL$1.LINE_LOOP = 2;
GL$1.LINE_STRIP = 3;
GL$1.TRIANGLES = 4;
GL$1.TRIANGLE_STRIP = 5;
GL$1.TRIANGLE_FAN = 6;
GL$1.CW = 2304;
GL$1.CCW = 2305;
GL$1.CULL_FACE = 2884;
GL$1.DEPTH_TEST = 2929;
GL$1.BLEND = 3042;
GL$1.temp_vec3 = vec3.create();
GL$1.temp2_vec3 = vec3.create();
GL$1.temp_vec4 = vec4.create();
GL$1.temp_quat = quat.create();
GL$1.temp_mat3 = mat3.create();
GL$1.temp_mat4 = mat4.create();
global.DEG2RAD = 0.0174532925;
global.RAD2DEG = 57.295779578552306;
global.EPSILON = 1e-6;
global.isPowerOfTwo = GL$1.isPowerOfTwo = function (t) {
    return (Math.log(t) / Math.log(2)) % 1 == 0;
};
global.nearestPowerOfTwo = GL$1.nearestPowerOfTwo = function (t) {
    return Math.pow(2, Math.round(Math.log(t) / Math.log(2)));
};
global.nextPowerOfTwo = GL$1.nextPowerOfTwo = function (t) {
    return Math.pow(2, Math.ceil(Math.log(t) / Math.log(2)));
};
var typed_arrays = [
    Uint8Array,
    Int8Array,
    Uint16Array,
    Int16Array,
    Uint32Array,
    Int32Array,
    Float32Array,
    Float64Array,
];
function typedToArray() {
    return Array.prototype.slice.call(this);
}
typed_arrays.forEach(function (e) {
    e.prototype.toJSON ||
        Object.defineProperty(e.prototype, "toJSON", {
            value: typedToArray,
            enumerable: !1,
            configurable: !0,
            writable: !0,
        });
});
typeof performance < "u"
    ? (global.getTime = performance.now.bind(performance))
    : (global.getTime = Date.now.bind(Date));
GL$1.getTime = global.getTime;
global.isFunction = function (t) {
    return !!(t && t.constructor && t.call && t.apply);
};
global.isArray = function (t) {
    return t && t.constructor === Array;
};
global.isNumber = function (t) {
    return t != null && t.constructor === Number;
};
global.getClassName = function (t) {
    if (t) {
        if (t.name) return t.name;
        if (t.toString) {
            var r = t.toString().match(/function\s*(\w+)/);
            if (r && r.length == 2) return r[1];
        }
    }
};
global.cloneObject = GL$1.cloneObject = function (e, t) {
    if (e.constructor !== Object)
        throw "cloneObject only can clone pure javascript objects, not classes";
    t = t || {};
    for (var r in e) {
        var n = e[r];
        if (n === null) {
            t[r] = null;
            continue;
        }
        switch (n.constructor) {
            case Int8Array:
            case Uint8Array:
            case Int16Array:
            case Uint16Array:
            case Int32Array:
            case Uint32Array:
            case Float32Array:
            case Float64Array:
                t[r] = new n.constructor(n);
                break;
            case Boolean:
            case Number:
            case String:
                t[r] = n;
                break;
            case Array:
                t[r] = n.concat();
                break;
            case Object:
                t[r] = GL$1.cloneObject(n);
                break;
        }
    }
    return t;
};
global.regexMap = function (t, r, n) {
    for (var s; (s = t.exec(r)) != null; ) n(s);
};
global.createCanvas = GL$1.createCanvas = function (t, r) {
    var n = document.createElement("canvas");
    return (n.width = t), (n.height = r), n;
};
global.cloneCanvas = GL$1.cloneCanvas = function (t) {
    var r = document.createElement("canvas");
    (r.width = t.width), (r.height = t.height);
    var n = r.getContext("2d");
    return n.drawImage(t, 0, 0), r;
};
typeof Image < "u" &&
    (Image.prototype.getPixels = function () {
        var e = document.createElement("canvas");
        (e.width = this.width), (e.height = this.height);
        var t = e.getContext("2d");
        return (
            t.drawImage(this, 0, 0),
            t.getImageData(0, 0, this.width, this.height).data
        );
    });
Object.prototype.hasOwnProperty.call(String.prototype, "replaceAll") ||
    Object.defineProperty(String.prototype, "replaceAll", {
        value: function (e) {
            var t = this;
            for (var r in e) t = t.split(r).join(e[r]);
            return t;
        },
        enumerable: !1,
    });
Object.prototype.hasOwnProperty.call(String.prototype, "hashCode") ||
    Object.defineProperty(String.prototype, "hashCode", {
        value: function () {
            var e = 0,
                t,
                r,
                n;
            if (this.length == 0) return e;
            for (t = 0, n = this.length; t < n; ++t)
                (r = this.charCodeAt(t)), (e = (e << 5) - e + r), (e |= 0);
            return e;
        },
        enumerable: !1,
    });
Object.prototype.hasOwnProperty.call(Array.prototype, "clone") ||
    Object.defineProperty(Array.prototype, "clone", {
        value: Array.prototype.concat,
        enumerable: !1,
    });
Object.prototype.hasOwnProperty.call(Float32Array.prototype, "clone") ||
    Object.defineProperty(Float32Array.prototype, "clone", {
        value: function () {
            return new Float32Array(this);
        },
        enumerable: !1,
    });
global.wipeObject = function (t) {
    for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && delete t[r];
};
global.extendClass = GL$1.extendClass = function (t, r) {
    for (var n in r)
        Object.prototype.hasOwnProperty.call(t, n) || (t[n] = r[n]);
    if (r.prototype)
        for (
            var s = Object.getOwnPropertyNames(r.prototype), n = 0;
            n < s.length;
            ++n
        ) {
            var a = s[n];
            Object.prototype.hasOwnProperty.call(t, a) ||
                (r.prototype.__lookupGetter__(a)
                    ? t.prototype.__defineGetter__(
                          a,
                          r.prototype.__lookupGetter__(a)
                      )
                    : (t.prototype[a] = r.prototype[a]),
                r.prototype.__lookupSetter__(a) &&
                    t.prototype.__defineSetter__(
                        a,
                        r.prototype.__lookupSetter__(a)
                    ));
        }
    Object.prototype.hasOwnProperty.call(t, "superclass") ||
        Object.defineProperty(t, "superclass", {
            get: function () {
                return r;
            },
            enumerable: !1,
        });
};
global.HttpRequest = GL$1.request = function (t, r, n, s, a) {
    var o = !0;
    if (((a = a || {}), a.async !== void 0 && (o = a.async), r)) {
        var l = null,
            c = [];
        for (var u in r) c.push(u + "=" + r[u]);
        (l = c.join("&")), (t = t + "?" + l);
    }
    var h = new XMLHttpRequest();
    if (
        (h.open("GET", t, o),
        (h.responseType = a.responseType || "text"),
        (h.onload = function (f) {
            if (
                (this.response,
                this.getResponseHeader("Content-Type"),
                this.status != 200)
            ) {
                LEvent.trigger(h, "fail", this.status), s && s(this.status);
                return;
            }
            LEvent.trigger(h, "done", this.response), n && n(this.response);
        }),
        (h.onerror = function (f) {
            LEvent.trigger(h, "fail", f);
        }),
        a)
    ) {
        for (var u in a) h[u] = a[u];
        a.binary && (h.responseType = "arraybuffer");
    }
    return h.send(), h;
};
global.XMLHttpRequest &&
    (Object.prototype.hasOwnProperty.call(XMLHttpRequest.prototype, "done") ||
        Object.defineProperty(XMLHttpRequest.prototype, "done", {
            enumerable: !1,
            value: function (e) {
                return (
                    LEvent.bind(this, "done", function (t, r) {
                        e(r);
                    }),
                    this
                );
            },
        }),
    Object.prototype.hasOwnProperty.call(XMLHttpRequest.prototype, "fail") ||
        Object.defineProperty(XMLHttpRequest.prototype, "fail", {
            enumerable: !1,
            value: function (e) {
                return (
                    LEvent.bind(this, "fail", function (t, r) {
                        e(r);
                    }),
                    this
                );
            },
        }));
global.getFileExtension = function (t) {
    var r = t.indexOf("?");
    r != -1 && (t = t.substr(0, r));
    var n = t.lastIndexOf(".");
    return n == -1 ? "" : t.substr(n + 1).toLowerCase();
};
global.loadFileAtlas = GL$1.loadFileAtlas = function (t, r, n) {
    var s = null;
    return (
        global.HttpRequest(
            t,
            null,
            function (a) {
                var o = GL$1.processFileAtlas(a);
                r && r(o), s && s(o);
            },
            alert,
            n
        ),
        {
            done: function (a) {
                s = a;
            },
        }
    );
};
global.processFileAtlas = GL$1.processFileAtlas = function (e, t) {
    for (
        var r = e.split(`
`),
            n = {},
            s = [],
            a = "",
            o = 0,
            l = r.length;
        o < l;
        o++
    ) {
        var c = t ? r[o] : r[o].trim();
        if (c.length) {
            if (c[0] != "\\") {
                s.push(c);
                continue;
            }
            s.length &&
                (n[a] = s.join(`
`)),
                (s.length = 0),
                (a = c.substr(1));
        }
    }
    return (
        s.length &&
            (n[a] = s.join(`
`)),
        n
    );
};
global.typedArrayToArray = function (e) {
    var t = [];
    t.length = e.length;
    for (var r = 0; r < e.length; r++) t[r] = e[r];
    return t;
};
global.RGBToHex = function (e, t, r) {
    return (
        (e = Math.min(255, e * 255) | 0),
        (t = Math.min(255, t * 255) | 0),
        (r = Math.min(255, r * 255) | 0),
        "#" + ((1 << 24) + (e << 16) + (t << 8) + r).toString(16).slice(1)
    );
};
global.HUEToRGB = function (e, t, r) {
    return (
        r < 0 && (r += 1),
        r > 1 && (r -= 1),
        r < 1 / 6
            ? e + (t - e) * 6 * r
            : r < 1 / 2
            ? t
            : r < 2 / 3
            ? e + (t - e) * (2 / 3 - r) * 6
            : e
    );
};
global.HSLToRGB = function (e, t, r, n) {
    var s, a, o;
    if (((n = n || vec3.create()), t == 0)) s = a = o = r;
    else {
        var l = r < 0.5 ? r * (1 + t) : r + t - r * t,
            c = 2 * r - l;
        (s = global.HUEToRGB(c, l, e + 1 / 3)),
            (a = global.HUEToRGB(c, l, e)),
            (o = global.HUEToRGB(c, l, e - 1 / 3));
    }
    return (n[0] = s), (n[1] = a), (n[2] = o), n;
};
global.hexColorToRGBA = /* @__PURE__ */ (function () {
    var e = {
        white: [1, 1, 1],
        black: [0, 0, 0],
        gray: [0.501960813999176, 0.501960813999176, 0.501960813999176],
        red: [1, 0, 0],
        orange: [1, 0.6470588445663452, 0],
        pink: [1, 0.7529411911964417, 0.7960784435272217],
        green: [0, 0.501960813999176, 0],
        lime: [0, 1, 0],
        blue: [0, 0, 1],
        violet: [0.9333333373069763, 0.5098039507865906, 0.9333333373069763],
        magenta: [1, 0, 1],
        cyan: [0, 1, 1],
        yellow: [1, 1, 0],
        brown: [0.6470588445663452, 0.16470588743686676, 0.16470588743686676],
        silver: [0.7529411911964417, 0.7529411911964417, 0.7529411911964417],
        gold: [1, 0.843137264251709, 0],
        transparent: [0, 0, 0, 0],
    };
    return function (t, r, n) {
        if (
            ((n = n === void 0 ? 1 : n),
            (r = r || new Float32Array(4)),
            (r[3] = n),
            typeof t != "string")
        )
            return r;
        var s = e[t];
        if (s !== void 0)
            return r.set(s), r.length == 3 ? (r[3] = n) : (r[3] *= n), r;
        var o = t.indexOf("rgba(");
        if (o != -1) {
            var a = t.substr(5, t.length - 2);
            return (
                (a = a.split(",")),
                (r[0] = parseInt(a[0]) / 255),
                (r[1] = parseInt(a[1]) / 255),
                (r[2] = parseInt(a[2]) / 255),
                (r[3] = parseFloat(a[3]) * n),
                r
            );
        }
        var o = t.indexOf("hsla(");
        if (o != -1) {
            var a = t.substr(5, t.length - 2);
            return (
                (a = a.split(",")),
                global.HSLToRGB(
                    parseInt(a[0]) / 360,
                    parseInt(a[1]) / 100,
                    parseInt(a[2]) / 100,
                    r
                ),
                (r[3] = parseFloat(a[3]) * n),
                r
            );
        }
        r[3] = n;
        var o = t.indexOf("rgb(");
        if (o != -1) {
            var a = t.substr(4, t.length - 2);
            return (
                (a = a.split(",")),
                (r[0] = parseInt(a[0]) / 255),
                (r[1] = parseInt(a[1]) / 255),
                (r[2] = parseInt(a[2]) / 255),
                r
            );
        }
        var o = t.indexOf("hsl(");
        if (o != -1) {
            var a = t.substr(4, t.length - 2);
            return (
                (a = a.split(",")),
                global.HSLToRGB(
                    parseInt(a[0]) / 360,
                    parseInt(a[1]) / 100,
                    parseInt(a[2]) / 100,
                    r
                ),
                r
            );
        }
        var l = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        t = t.replace(l, function (u, h, f, d) {
            return h + h + f + f + d + d;
        });
        var c = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
        return (
            c &&
                ((r[0] = parseInt(c[1], 16) / 255),
                (r[1] = parseInt(c[2], 16) / 255),
                (r[2] = parseInt(c[3], 16) / 255)),
            r
        );
    };
})();
global.toHalfFloat = (function () {
    var e = new Float32Array(1),
        t = new Int32Array(e.buffer);
    return function (n) {
        e[0] = n;
        var s = t[0],
            a = (s >> 16) & 32768,
            o = (s & 2147483647) + 4096;
        return o >= 1199570944
            ? (s & 2147483647) >= 1199570944
                ? o < 2139095040
                    ? a | 31744
                    : a |
                      31744 | // remains +/-Inf or NaN
                      ((s & 8388607) >> 13)
                : a | 31743
            : o >= 947912704
            ? a | ((o - 939524096) >> 13)
            : o < 855638016
            ? a
            : ((o = (s & 2147483647) >> 23),
              a |
                  ((((s & 8388607) | 8388608) + // add subnormal bit
                      (8388608 >>> (o - 102))) >> // round depending on cut off
                      (126 - o)));
    };
})();
var DDS = (function () {
    var e = 542327876,
        t = 131072,
        r = 512,
        n = 4;
    function s(O) {
        return (
            O.charCodeAt(0) +
            (O.charCodeAt(1) << 8) +
            (O.charCodeAt(2) << 16) +
            (O.charCodeAt(3) << 24)
        );
    }
    function a(O) {
        return String.fromCharCode(
            O & 255,
            (O >> 8) & 255,
            (O >> 16) & 255,
            (O >> 24) & 255
        );
    }
    var o = s("DXT1"),
        l = s("DXT3"),
        c = s("DXT5"),
        u = 31,
        h = 0,
        f = 1,
        d = 2,
        p = 3,
        _ = 4,
        E = 7,
        m = 20,
        b = 21,
        L = 27;
    function T(O, F, P, C) {
        for (
            var U = new Uint16Array(4),
                X = new Uint16Array(P * C),
                z = 0,
                q = 0,
                Y = 0,
                H = 0,
                Z = 0,
                oe = 0,
                he = 0,
                ce = 0,
                ie = 0,
                de = P / 4,
                fe = C / 4,
                _e = 0;
            _e < fe;
            _e++
        )
            for (var Te = 0; Te < de; Te++)
                (Y = F + 4 * (_e * de + Te)),
                    (U[0] = O[Y]),
                    (U[1] = O[Y + 1]),
                    (H = U[0] & 31),
                    (Z = U[0] & 2016),
                    (oe = U[0] & 63488),
                    (he = U[1] & 31),
                    (ce = U[1] & 2016),
                    (ie = U[1] & 63488),
                    (U[2] =
                        ((5 * H + 3 * he) >> 3) |
                        (((5 * Z + 3 * ce) >> 3) & 2016) |
                        (((5 * oe + 3 * ie) >> 3) & 63488)),
                    (U[3] =
                        ((5 * he + 3 * H) >> 3) |
                        (((5 * ce + 3 * Z) >> 3) & 2016) |
                        (((5 * ie + 3 * oe) >> 3) & 63488)),
                    (z = O[Y + 2]),
                    (q = _e * 4 * P + Te * 4),
                    (X[q] = U[z & 3]),
                    (X[q + 1] = U[(z >> 2) & 3]),
                    (X[q + 2] = U[(z >> 4) & 3]),
                    (X[q + 3] = U[(z >> 6) & 3]),
                    (q += P),
                    (X[q] = U[(z >> 8) & 3]),
                    (X[q + 1] = U[(z >> 10) & 3]),
                    (X[q + 2] = U[(z >> 12) & 3]),
                    (X[q + 3] = U[z >> 14]),
                    (z = O[Y + 3]),
                    (q += P),
                    (X[q] = U[z & 3]),
                    (X[q + 1] = U[(z >> 2) & 3]),
                    (X[q + 2] = U[(z >> 4) & 3]),
                    (X[q + 3] = U[(z >> 6) & 3]),
                    (q += P),
                    (X[q] = U[(z >> 8) & 3]),
                    (X[q + 1] = U[(z >> 10) & 3]),
                    (X[q + 2] = U[(z >> 12) & 3]),
                    (X[q + 3] = U[z >> 14]);
        return X;
    }
    function g(O) {
        for (var F = 0, P = O.length, C = 0; F < P; F += 4)
            (C = O[F]), (O[F] = O[F + 2]), (O[F + 2] = C);
    }
    function A(O, F, P, C) {
        var U = new Int32Array(P, 0, u),
            X,
            z,
            q,
            Y,
            H,
            Z,
            oe,
            he,
            ce,
            ie,
            de,
            fe,
            _e;
        if (U[h] != e)
            return console.error("Invalid magic number in DDS header"), 0;
        if (!U[m] & n)
            return (
                console.error("Unsupported format, must contain a FourCC code"),
                0
            );
        switch (((X = U[b]), X)) {
            case o:
                (z = 8), (q = F ? F.COMPRESSED_RGB_S3TC_DXT1_EXT : null);
                break;
            /*
               case FOURCC_DXT1:
                   blockBytes = 8;
                   internalFormat = ext ? ext.COMPRESSED_RGBA_S3TC_DXT1_EXT : null;
                   break;
      */
            case l:
                (z = 16), (q = F ? F.COMPRESSED_RGBA_S3TC_DXT3_EXT : null);
                break;
            case c:
                (z = 16), (q = F ? F.COMPRESSED_RGBA_S3TC_DXT5_EXT : null);
                break;
            default:
                (z = 4), (X = null), (q = O.RGBA);
        }
        if (
            ((de = 1),
            U[d] & t && C !== !1 && (de = Math.max(1, U[E])),
            (Y = U[_]),
            (H = U[p]),
            (oe = U[f] + 4),
            (he = !!(U[L + 1] & r)),
            he)
        )
            for (_e = 0; _e < 6; ++_e) {
                (Y = U[_]), (H = U[p]);
                for (var fe = 0; fe < de; ++fe)
                    X
                        ? ((Z =
                              (((Math.max(4, Y) / 4) * Math.max(4, H)) / 4) *
                              z),
                          (ie = new Uint8Array(P, oe, Z)),
                          O.compressedTexImage2D(
                              O.TEXTURE_CUBE_MAP_POSITIVE_X + _e,
                              fe,
                              q,
                              Y,
                              H,
                              0,
                              ie
                          ))
                        : (O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL, !1),
                          (Z = Y * H * z),
                          (ie = new Uint8Array(P, oe, Z)),
                          g(ie),
                          O.texImage2D(
                              O.TEXTURE_CUBE_MAP_POSITIVE_X + _e,
                              fe,
                              q,
                              Y,
                              H,
                              0,
                              O.RGBA,
                              O.UNSIGNED_BYTE,
                              ie
                          )),
                        (oe += Z),
                        (Y *= 0.5),
                        (H *= 0.5);
            }
        else if (F) {
            O.pixelStorei(O.UNPACK_FLIP_Y_WEBGL, !0);
            for (var fe = 0; fe < de; ++fe)
                X
                    ? ((Z = (((Math.max(4, Y) / 4) * Math.max(4, H)) / 4) * z),
                      (ie = new Uint8Array(P, oe, Z)),
                      O.compressedTexImage2D(O.TEXTURE_2D, fe, q, Y, H, 0, ie))
                    : ((Z = Y * H * z),
                      (ie = new Uint8Array(P, oe, Z)),
                      g(ie),
                      O.texImage2D(
                          O.TEXTURE_2D,
                          fe,
                          q,
                          Y,
                          H,
                          0,
                          q,
                          O.UNSIGNED_BYTE,
                          ie
                      )),
                    (oe += Z),
                    (Y *= 0.5),
                    (H *= 0.5);
        } else if (X == o)
            (Z = (((Math.max(4, Y) / 4) * Math.max(4, H)) / 4) * z),
                (ie = new Uint16Array(P)),
                (ce = T(ie, oe / 2, Y, H)),
                O.texImage2D(
                    O.TEXTURE_2D,
                    0,
                    O.RGB,
                    Y,
                    H,
                    0,
                    O.RGB,
                    O.UNSIGNED_SHORT_5_6_5,
                    ce
                ),
                C && O.generateMipmap(O.TEXTURE_2D);
        else
            return (
                console.error(
                    "No manual decoder for",
                    a(X),
                    "and no native support"
                ),
                0
            );
        return de;
    }
    function G(O, F, P) {
        var C = new Int32Array(O, 0, u),
            U,
            X,
            z,
            q,
            Y,
            H,
            Z,
            oe,
            he,
            ce,
            ie,
            de;
        if (C[h] != e)
            return console.error("Invalid magic number in DDS header"), 0;
        if (!C[m] & n)
            return (
                console.error("Unsupported format, must contain a FourCC code"),
                0
            );
        switch (((U = C[b]), U)) {
            case o:
                (X = 8), (z = "COMPRESSED_RGB_S3TC_DXT1_EXT");
                break;
            case l:
                (X = 16), (z = "COMPRESSED_RGBA_S3TC_DXT3_EXT");
                break;
            case c:
                (X = 16), (z = "COMPRESSED_RGBA_S3TC_DXT5_EXT");
                break;
            default:
                (X = 4), (z = "RGBA");
        }
        (ce = 1),
            C[d] & t && P !== !1 && (ce = Math.max(1, C[E])),
            (q = C[_]),
            (Y = C[p]),
            (Z = C[f] + 4),
            (oe = !!(C[L + 1] & r));
        var fe = [];
        if (oe)
            for (var de = 0; de < 6; ++de) {
                (q = C[_]), (Y = C[p]);
                for (var ie = 0; ie < ce; ++ie)
                    U
                        ? ((H =
                              (((Math.max(4, q) / 4) * Math.max(4, Y)) / 4) *
                              X),
                          (he = new Uint8Array(O, Z, H)),
                          fe.push({
                              tex: "TEXTURE_CUBE_MAP",
                              face: de,
                              mipmap: ie,
                              internalFormat: z,
                              width: q,
                              height: Y,
                              offset: 0,
                              dataOffset: Z,
                              dataLength: H,
                          }))
                        : ((H = q * Y * X),
                          (he = new Uint8Array(O, Z, H)),
                          g(he),
                          fe.push({
                              tex: "TEXTURE_CUBE_MAP",
                              face: de,
                              mipmap: ie,
                              internalFormat: z,
                              width: q,
                              height: Y,
                              offset: 0,
                              type: "UNSIGNED_BYTE",
                              dataOffset: Z,
                              dataLength: H,
                          })),
                        (Z += H),
                        (q *= 0.5),
                        (Y *= 0.5);
            }
        else
            for (var ie = 0; ie < ce; ++ie)
                (H = (((Math.max(4, q) / 4) * Math.max(4, Y)) / 4) * X),
                    (he = new Uint8Array(O, Z, H)),
                    fe.push({
                        tex: "TEXTURE_2D",
                        mipmap: ie,
                        internalFormat: z,
                        width: q,
                        height: Y,
                        offset: 0,
                        type: "UNSIGNED_BYTE",
                        dataOffset: Z,
                        dataLength: H,
                    }),
                    (Z += H),
                    (q *= 0.5),
                    (Y *= 0.5);
        return fe;
    }
    function M(O, F, P, C, U, X) {
        var z = new XMLHttpRequest();
        return (
            z.open("GET", P, !0),
            (z.responseType = "arraybuffer"),
            (z.onload = function () {
                if (this.status == 200) {
                    var q = new Int32Array(this.response, 0, u),
                        Y = !!(q[L + 1] & r),
                        H = Y ? O.TEXTURE_CUBE_MAP : O.TEXTURE_2D;
                    O.bindTexture(H, C);
                    var Z = A(O, F, this.response, U);
                    O.texParameteri(H, O.TEXTURE_MAG_FILTER, O.LINEAR),
                        O.texParameteri(
                            H,
                            O.TEXTURE_MIN_FILTER,
                            Z > 1 ? O.LINEAR_MIPMAP_LINEAR : O.LINEAR
                        ),
                        O.bindTexture(H, null),
                        (C.texture_type = H),
                        (C.width = q[_]),
                        (C.height = q[p]);
                }
                X && X(C);
            }),
            z.send(null),
            C
        );
    }
    function N(O, F, P, C, U) {
        var X = new Int32Array(P, 0, u),
            z = !!(X[L + 1] & r),
            q = z ? O.TEXTURE_CUBE_MAP : O.TEXTURE_2D;
        C.handler, O.bindTexture(q, C.handler);
        var Y = A(O, F, P, U);
        return (
            O.texParameteri(q, O.TEXTURE_MAG_FILTER, O.LINEAR),
            O.texParameteri(
                q,
                O.TEXTURE_MIN_FILTER,
                Y > 1 ? O.LINEAR_MIPMAP_LINEAR : O.LINEAR
            ),
            z &&
                (O.texParameteri(q, O.TEXTURE_WRAP_S, O.CLAMP_TO_EDGE),
                O.texParameteri(q, O.TEXTURE_WRAP_T, O.CLAMP_TO_EDGE)),
            O.bindTexture(q, null),
            C.handler &&
                ((C.texture_type = q), (C.width = X[_]), (C.height = X[p])),
            C
        );
    }
    function I(O) {
        var F = new Int32Array(O, 0, u),
            P = !!(F[L + 1] & r),
            C = P ? "TEXTURE_CUBE_MAP" : "TEXTURE_2D",
            U = G(O),
            X = {
                type: C,
                buffers: U,
                data: O,
                width: F[_],
                height: F[p],
            };
        return X;
    }
    function B(O, X, P, C) {
        var U = O.createTexture(),
            X = O.getExtension("WEBGL_compressed_texture_s3tc");
        return M(O, X, P, U, !0, C), U;
    }
    return {
        dxtToRgb565: T,
        uploadDDSLevels: A,
        loadDDSTextureEx: M,
        loadDDSTexture: B,
        loadDDSTextureFromMemoryEx: N,
        getDDSTextureFromMemoryEx: I,
    };
})();
typeof global < "u" && (global.DDS = DDS);
if (
    typeof glMatrix > "u" &&
    typeof exports < "u" &&
    typeof process < "u" &&
    exports.vec3
)
    for (var i in exports) global[i] = exports[i];
Math.clamp = function (e, t, r) {
    return t > e ? t : r < e ? r : e;
};
Math.lerp = function (e, t, r) {
    return e * (1 - r) + t * r;
};
Math.lerp01 = function (e, t, r) {
    return Math.clamp(e * (1 - r) + t * r, 0, 1);
};
Math.iLerp = function (e, t, r) {
    return (r - e) / (t - e);
};
Math.remap = function (e, t, r, n, s) {
    return Math.lerp(n, s, Math.iLerp(t, r, e));
};
vec3.create;
vec3.create;
vec3.ZERO = vec3.fromValues(0, 0, 0);
vec3.FRONT = vec3.fromValues(0, 0, -1);
vec3.UP = vec3.fromValues(0, 1, 0);
vec3.RIGHT = vec3.fromValues(1, 0, 0);
vec2.rotate = function (e, t, r) {
    var n = t[0],
        s = t[1],
        a = Math.cos(r),
        o = Math.sin(r);
    return (e[0] = n * a - s * o), (e[1] = n * o + s * a), e;
};
vec3.zero = function (e) {
    return (e[0] = e[1] = 0), e;
};
vec2.perpdot = function (e, t) {
    return e[1] * t[0] + -e[0] * t[1];
};
vec2.computeSignedAngle = function (e, t) {
    return Math.atan2(vec2.perpdot(e, t), vec2.dot(e, t));
};
vec2.random = function (e, t) {
    return (
        (t = t || 1), (e[0] = Math.random() * t), (e[1] = Math.random() * t), e
    );
};
vec3.zero = function (e) {
    return (e[0] = e[1] = e[2] = 0), e;
};
vec3.minValue = function (e) {
    return e[0] < e[1] && e[0] < e[2] ? e[0] : e[1] < e[2] ? e[1] : e[2];
};
vec3.maxValue = function (e) {
    return e[0] > e[1] && e[0] > e[2] ? e[0] : e[1] > e[2] ? e[1] : e[2];
};
vec3.minValue = function (e) {
    return e[0] < e[1] && e[0] < e[2] ? e[0] : e[1] < e[2] ? e[1] : e[2];
};
vec3.addValue = function (e, t, r) {
    (e[0] = t[0] + r), (e[1] = t[1] + r), (e[2] = t[2] + r);
};
vec3.subValue = function (e, t, r) {
    (e[0] = t[0] - r), (e[1] = t[1] - r), (e[2] = t[2] - r);
};
vec3.toArray = function (e) {
    return [e[0], e[1], e[2]];
};
vec3.rotateX = function (e, t, r) {
    var n = t[1],
        s = t[2],
        a = Math.cos(r),
        o = Math.sin(r);
    return (e[0] = t[0]), (e[1] = n * a - s * o), (e[2] = n * o + s * a), e;
};
vec3.rotateY = function (e, t, r) {
    var n = t[0],
        s = t[2],
        a = Math.cos(r),
        o = Math.sin(r);
    return (e[0] = n * a - s * o), (e[1] = t[1]), (e[2] = n * o + s * a), e;
};
vec3.rotateZ = function (e, t, r) {
    var n = t[0],
        s = t[1],
        a = Math.cos(r),
        o = Math.sin(r);
    return (e[0] = n * a - s * o), (e[1] = n * o + s * a), (e[2] = t[2]), e;
};
vec3.angle = function (e, t) {
    return Math.acos(vec3.dot(e, t));
};
vec3.signedAngle = function (e, t, r) {
    var n = vec3.angle(e, t),
        s = e[1] * t[2] - e[2] * t[1],
        a = e[2] * t[0] - e[0] * t[2],
        o = e[0] * t[1] - e[1] * t[0],
        l = Math.sign(r[0] * s + r[1] * a + r[2] * o);
    return n * l;
};
vec3.random = function (e, t) {
    return (
        (t = t || 1),
        (e[0] = Math.random() * t),
        (e[1] = Math.random() * t),
        (e[2] = Math.random() * t),
        e
    );
};
vec3.cartesianToPolar = function (e, t) {
    e = e || vec3.create();
    var r = t[0],
        n = t[1],
        s = t[2];
    return (
        (e[0] = Math.sqrt(r * r + n * n + s * s)),
        (e[1] = Math.asin(n / e[0])),
        (e[2] = Math.atan2(r, s)),
        e
    );
};
vec3.polarToCartesian = function (e, t) {
    var r = t[0],
        n = t[1],
        s = t[2];
    return (
        (e[0] = r * Math.cos(n) * Math.sin(s)),
        (e[1] = r * Math.sin(n)),
        (e[2] = r * Math.cos(n) * Math.cos(s)),
        e
    );
};
vec3.reflect = function (e, t, r) {
    var n = t[0],
        s = t[1],
        a = t[2];
    return (
        vec3.scale(e, r, -2 * vec3.dot(t, r)),
        (e[0] += n),
        (e[1] += s),
        (e[2] += a),
        e
    );
};
vec4.random = function (e, t) {
    return (
        (t = t || 1),
        (e[0] = Math.random() * t),
        (e[1] = Math.random() * t),
        (e[2] = Math.random() * t),
        (e[3] = Math.random() * t),
        e
    );
};
vec4.toArray = function (e) {
    return [e[0], e[1], e[2], e[3]];
};
mat3.IDENTITY = mat3.create();
mat4.IDENTITY = mat4.create();
mat4.toArray = function (e) {
    return [
        e[0],
        e[1],
        e[2],
        e[3],
        e[4],
        e[5],
        e[6],
        e[7],
        e[8],
        e[9],
        e[10],
        e[11],
        e[12],
        e[13],
        e[14],
        e[15],
    ];
};
mat4.setUpAndOrthonormalize = function (e, t, r) {
    t != e && mat4.copy(e, t);
    var n = e.subarray(0, 3);
    vec3.normalize(e.subarray(4, 7), r);
    var s = e.subarray(8, 11);
    vec3.cross(n, r, s),
        vec3.normalize(n, n),
        vec3.cross(s, n, r),
        vec3.normalize(s, s);
};
mat4.multiplyVec3 = function (e, t, r) {
    var n = r[0],
        s = r[1],
        a = r[2];
    return (
        (e[0] = t[0] * n + t[4] * s + t[8] * a + t[12]),
        (e[1] = t[1] * n + t[5] * s + t[9] * a + t[13]),
        (e[2] = t[2] * n + t[6] * s + t[10] * a + t[14]),
        e
    );
};
mat4.projectVec3 = function (e, t, r) {
    var n = r[0],
        s = r[1],
        a = r[2],
        o = t[0] * n + t[4] * s + t[8] * a + t[12],
        l = t[1] * n + t[5] * s + t[9] * a + t[13],
        c = t[2] * n + t[6] * s + t[10] * a + t[14],
        u = t[3] * n + t[7] * s + t[11] * a + t[15];
    return (
        (e[0] = (o / u + 1) / 2),
        (e[1] = (l / u + 1) / 2),
        (e[2] = (c / u + 1) / 2),
        e
    );
};
vec3.project = function (e, t, r, n) {
    n = n || gl.viewport_data;
    var s = r,
        a = t[0],
        o = t[1],
        l = t[2],
        c = s[0] * a + s[4] * o + s[8] * l + s[12],
        u = s[1] * a + s[5] * o + s[9] * l + s[13],
        h = s[2] * a + s[6] * o + s[10] * l + s[14],
        f = s[3] * a + s[7] * o + s[11] * l + s[15],
        d = (c / f + 1) / 2,
        p = 1 - (u / f + 1) / 2,
        _ = (h / f + 1) / 2;
    return (e[0] = d * n[2] + n[0]), (e[1] = p * n[3] + n[1]), (e[2] = _), e;
};
var unprojectMat = mat4.create(),
    unprojectVec = vec4.create();
vec3.unproject = function (e, t, r, n) {
    var s = unprojectMat,
        a = unprojectVec;
    return (
        (a[0] = ((t[0] - n[0]) * 2) / n[2] - 1),
        (a[1] = ((t[1] - n[1]) * 2) / n[3] - 1),
        (a[2] = 2 * t[2] - 1),
        (a[3] = 1),
        !mat4.invert(s, r) || (vec4.transformMat4(a, a, s), a[3] === 0)
            ? null
            : ((e[0] = a[0] / a[3]),
              (e[1] = a[1] / a[3]),
              (e[2] = a[2] / a[3]),
              e)
    );
};
mat4.rotateVec3 = function (e, t, r) {
    var n = r[0],
        s = r[1],
        a = r[2];
    return (
        (e[0] = t[0] * n + t[4] * s + t[8] * a),
        (e[1] = t[1] * n + t[5] * s + t[9] * a),
        (e[2] = t[2] * n + t[6] * s + t[10] * a),
        e
    );
};
mat4.fromTranslationFrontTop = function (e, t, r, n) {
    return (
        vec3.cross(e.subarray(0, 3), r, n),
        e.set(n, 4),
        e.set(r, 8),
        e.set(t, 12),
        e
    );
};
mat4.translationMatrix = function (e) {
    var t = mat4.create();
    return (t[12] = e[0]), (t[13] = e[1]), (t[14] = e[2]), t;
};
mat4.setTranslation = function (e, t) {
    return (e[12] = t[0]), (e[13] = t[1]), (e[14] = t[2]), e;
};
mat4.getTranslation = function (e, t) {
    return (e[0] = t[12]), (e[1] = t[13]), (e[2] = t[14]), e;
};
mat4.toRotationMat4 = function (e, t) {
    return mat4.copy(e, t), (e[12] = e[13] = e[14] = 0), e;
};
mat4.swapRows = function (e, t, r, n, s) {
    if (e != t)
        return (
            mat4.copy(e, t),
            (e[4 * r] = t[4 * n]),
            (e[4 * r + 1] = t[4 * n + 1]),
            (e[4 * r + 2] = t[4 * n + 2]),
            (e[4 * r + 3] = t[4 * n + 3]),
            (e[4 * n] = t[4 * r]),
            (e[4 * n + 1] = t[4 * r + 1]),
            (e[4 * n + 2] = t[4 * r + 2]),
            (e[4 * n + 3] = t[4 * r + 3]),
            e
        );
    var a = new Float32Array(s.subarray(r * 4, r * 5));
    return s.set(s.subarray(n * 4, n * 5), r * 4), s.set(a, n * 4), e;
};
mat4.scaleAndAdd = function (e, t, r, n) {
    return (
        (e[0] = t[0] + r[0] * n),
        (e[1] = t[1] + r[1] * n),
        (e[2] = t[2] + r[2] * n),
        (e[3] = t[3] + r[3] * n),
        (e[4] = t[4] + r[4] * n),
        (e[5] = t[5] + r[5] * n),
        (e[6] = t[6] + r[6] * n),
        (e[7] = t[7] + r[7] * n),
        (e[8] = t[8] + r[8] * n),
        (e[9] = t[9] + r[9] * n),
        (e[10] = t[10] + r[10] * n),
        (e[11] = t[11] + r[11] * n),
        (e[12] = t[12] + r[12] * n),
        (e[13] = t[13] + r[13] * n),
        (e[14] = t[14] + r[14] * n),
        (e[15] = t[15] + r[15] * n),
        e
    );
};
quat.fromAxisAngle = function (e, t) {
    var r = quat.create();
    t = t * 0.5;
    var n = Math.sin(t);
    return (
        (r[0] = n * e[0]),
        (r[1] = n * e[1]),
        (r[2] = n * e[2]),
        (r[3] = Math.cos(t)),
        r
    );
};
quat.lookRotation = (function () {
    var e = vec3.create(),
        t = vec3.create(),
        r = vec3.create();
    return function (n, s, a) {
        vec3.normalize(e, s),
            vec3.cross(t, a, e),
            vec3.normalize(t, t),
            vec3.cross(r, e, t);
        var o = t[0],
            l = t[1],
            c = t[2],
            u = r[0],
            h = r[1],
            f = r[2],
            d = e[0],
            p = e[1],
            _ = e[2],
            E = o + h + _;
        if (E > 0) {
            var m = Math.sqrt(E + 1);
            return (
                (n[3] = m * 0.5),
                (m = 0.5 / m),
                (n[0] = (f - p) * m),
                (n[1] = (d - c) * m),
                (n[2] = (l - u) * m),
                n
            );
        }
        if (o >= h && o >= _) {
            var b = Math.sqrt(1 + o - h - _),
                L = 0.5 / b;
            return (
                (n[0] = 0.5 * b),
                (n[1] = (l + u) * L),
                (n[2] = (c + d) * L),
                (n[3] = (f - p) * L),
                n
            );
        }
        if (h > _) {
            var T = Math.sqrt(1 + h - o - _),
                g = 0.5 / T;
            return (
                (n[0] = (u + l) * g),
                (n[1] = 0.5 * T),
                (n[2] = (p + f) * g),
                (n[3] = (d - c) * g),
                n
            );
        }
        var A = Math.sqrt(1 + _ - o - h),
            G = 0.5 / A;
        return (
            (n[0] = (d + c) * G),
            (n[1] = (p + f) * G),
            (n[2] = 0.5 * A),
            (n[3] = (l - u) * G),
            n
        );
    };
})();
quat.toEuler = function (e, t) {
    var r = Math.atan2(
            2 * t[1] * t[3] - 2 * t[0] * t[2],
            1 - 2 * t[1] * t[1] - 2 * t[2] * t[2]
        ),
        n = Math.asin(2 * t[0] * t[1] + 2 * t[2] * t[3]),
        s = Math.atan2(
            2 * t[0] * t[3] - 2 * t[1] * t[2],
            1 - 2 * t[0] * t[0] - 2 * t[2] * t[2]
        );
    return e || (e = vec3.create()), vec3.set(e, r, n, s), e;
};
quat.fromEuler = function (e, t) {
    var r = t[0],
        n = t[1],
        s = t[2],
        a = Math.cos(r),
        o = Math.cos(n),
        l = Math.cos(s),
        c = Math.sin(r),
        u = Math.sin(n),
        h = Math.sin(s),
        f = Math.sqrt(1 + a * o + a * l - c * u * h + o * l) * 0.5;
    f == 0 && (f = 1e-6);
    var d = (o * h + a * h + c * u * l) / (4 * f),
        p = (c * o + c * l + a * u * h) / (4 * f),
        _ = (-c * h + a * u * l + u) / (4 * f);
    return quat.set(e, d, p, _, f), quat.normalize(e, e), e;
};
quat.fromMat4 = function (e, t) {
    var r = t[0] + t[5] + t[10];
    if (r > 0) {
        var n = Math.sqrt(r + 1);
        e[3] = n * 0.5;
        var s = 0.5 / n;
        (e[0] = (t[9] - t[6]) * s),
            (e[1] = (t[8] - t[2]) * s),
            (e[2] = (t[4] - t[1]) * s);
    } else {
        var a = 0;
        t[5] > t[0] && (a = 1), t[10] > t[a * 4 + a] && (a = 2);
        var o = (a + 1) % 3,
            l = (o + 1) % 3,
            n = Math.sqrt(t[a * 4 + a] - t[o * 4 + o] - t[l * 4 + l] + 1);
        e[a] = 0.5 * n;
        var s = 0.5 / n;
        (e[3] = (t[l * 4 + o] - t[o * 4 + l]) * s),
            (e[o] = (t[o * 4 + a] + t[a * 4 + o]) * s),
            (e[l] = (t[l * 4 + a] + t[a * 4 + l]) * s);
    }
    quat.normalize(e, e);
};
vec3.getMat3Column = function (e, t, r) {
    return (e[0] = t[r * 3]), (e[1] = t[r * 3 + 1]), (e[2] = t[r * 3 + 2]), e;
};
mat3.setColumn = function (e, t, r) {
    return (e[r * 3] = t[0]), (e[r * 3 + 1] = t[1]), (e[r * 3 + 2] = t[2]), e;
};
quat.fromMat3AndQuat = (function () {
    var e = mat3.create(),
        t = quat.create(),
        r = vec3.create(),
        n = vec3.create(),
        s = vec3.create(),
        a = vec3.create(),
        o = vec3.create(),
        l = vec3.create(),
        c = vec3.create(),
        u = vec3.create(),
        h = vec3.create(),
        f = vec3.create();
    return (
        mat3.create(),
        function (d, p, _) {
            _ = _ || 25;
            for (var E = 0; E < _; ++E) {
                var m = mat3.fromQuat(e, d);
                vec3.getMat3Column(r, m, 0),
                    vec3.getMat3Column(n, m, 1),
                    vec3.getMat3Column(s, m, 2),
                    vec3.getMat3Column(a, p, 0),
                    vec3.getMat3Column(o, p, 1),
                    vec3.getMat3Column(l, p, 2),
                    vec3.cross(c, r, a),
                    vec3.cross(u, n, o),
                    vec3.cross(h, s, l),
                    vec3.add(f, c, u),
                    vec3.add(f, f, h);
                var b =
                    1 /
                        Math.abs(
                            vec3.dot(r, a) + vec3.dot(n, o) + vec3.dot(s, l)
                        ) +
                    1e-9;
                vec3.scale(f, f, b);
                var L = vec3.length(f);
                if (L < 1e-9) break;
                vec3.scale(f, f, 1 / L),
                    quat.setAxisAngle(t, f, L),
                    quat.mul(d, t, d),
                    quat.normalize(d, d);
            }
            return d;
        }
    );
})();
quat.rotateToFrom = (function () {
    var e = vec3.create();
    return function (t, r, n) {
        t = t || quat.create();
        var s = vec3.cross(e, r, n),
            a = vec3.dot(r, n);
        return a < -1 + 0.01
            ? ((t[0] = 0), (t[1] = 1), (t[2] = 0), (t[3] = 0), t)
            : ((t[0] = s[0] * 0.5),
              (t[1] = s[1] * 0.5),
              (t[2] = s[2] * 0.5),
              (t[3] = (1 + a) * 0.5),
              quat.normalize(t, t),
              t);
    };
})();
quat.lookAt = (function () {
    var e = vec3.create();
    return function (t, r, n) {
        var s = vec3.dot(vec3.FRONT, r);
        if (Math.abs(s - -1) < 1e-6) return t.set(vec3.UP), (t[3] = Math.PI), t;
        if (Math.abs(s - 1) < 1e-6) return quat.identity(t);
        var a = Math.acos(s);
        return (
            vec3.cross(e, vec3.FRONT, r),
            vec3.normalize(e, e),
            quat.setAxisAngle(t, e, a),
            t
        );
    };
})();
GL$1.Indexer = function () {
    (this.unique = []), (this.indices = []), (this.map = {});
};
GL$1.Indexer.prototype = {
    add: function (e) {
        var t = JSON.stringify(e);
        return (
            t in this.map ||
                ((this.map[t] = this.unique.length), this.unique.push(e)),
            this.map[t]
        );
    },
};
GL$1.Buffer = function (t, r, n, s, a) {
    GL$1.debug && console.log("GL.Buffer created"),
        a !== null && (a = a || global.gl),
        (this.gl = a),
        (this.buffer = null),
        (this.target = t),
        (this.attribute = null),
        (this.normalize = !1),
        (this.data = r),
        (this.spacing = n || 3),
        this.data && this.gl && this.upload(s);
};
GL$1.Buffer.prototype.bind = function (e, t) {
    (t = t || this.gl),
        t.bindBuffer(t.ARRAY_BUFFER, this.buffer),
        t.enableVertexAttribArray(e),
        t.vertexAttribPointer(
            e,
            this.spacing,
            this.buffer.gl_type,
            this.normalize || !1,
            0,
            0
        );
};
GL$1.Buffer.prototype.unbind = function (e, t) {
    (t = t || this.gl), t.disableVertexAttribArray(e);
};
GL$1.Buffer.prototype.forEach = function (e) {
    for (
        var t = this.data, r = 0, n = this.spacing, s = t.length;
        r < s;
        r += n
    )
        e(t.subarray(r, r + n), r);
    return this;
};
GL$1.Buffer.prototype.applyTransform = function (e) {
    for (
        var t = this.data, r = 0, n = this.spacing, s = t.length;
        r < s;
        r += n
    ) {
        var a = t.subarray(r, r + n);
        vec3.transformMat4(a, a, e);
    }
    return this;
};
GL$1.Buffer.prototype.upload = function (e) {
    var t = this.spacing || 3,
        r = this.gl;
    if (r) {
        if (!this.data) throw "No data supplied";
        var n = this.data;
        if (!n.buffer) throw "Buffers must be typed arrays";
        if (((this.buffer = this.buffer || r.createBuffer()), !!this.buffer)) {
            switch (
                ((this.buffer.length = n.length),
                (this.buffer.spacing = t),
                n.constructor)
            ) {
                case Int8Array:
                    this.buffer.gl_type = r.BYTE;
                    break;
                case Uint8ClampedArray:
                case Uint8Array:
                    this.buffer.gl_type = r.UNSIGNED_BYTE;
                    break;
                case Int16Array:
                    this.buffer.gl_type = r.SHORT;
                    break;
                case Uint16Array:
                    this.buffer.gl_type = r.UNSIGNED_SHORT;
                    break;
                case Int32Array:
                    this.buffer.gl_type = r.INT;
                    break;
                case Uint32Array:
                    this.buffer.gl_type = r.UNSIGNED_INT;
                    break;
                case Float32Array:
                    this.buffer.gl_type = r.FLOAT;
                    break;
                default:
                    throw "unsupported buffer type";
            }
            this.target == r.ARRAY_BUFFER &&
                (this.buffer.gl_type == r.INT ||
                    this.buffer.gl_type == r.UNSIGNED_INT) &&
                (console.warn(
                    "WebGL does not support UINT32 or INT32 as vertex buffer types, converting to FLOAT"
                ),
                (this.buffer.gl_type = r.FLOAT),
                (n = new Float32Array(n))),
                r.bindBuffer(this.target, this.buffer),
                r.bufferData(
                    this.target,
                    n,
                    e || this.stream_type || r.STATIC_DRAW
                );
        }
    }
};
GL$1.Buffer.prototype.compile = GL$1.Buffer.prototype.upload;
GL$1.Buffer.prototype.setData = function (e, t) {
    if (!e.buffer) throw "Data must be typed array";
    if (((t = t || 0), this.data)) {
        if (this.data.length < e.length)
            throw "buffer is not big enough, you cannot set data to a smaller buffer";
    } else {
        (this.data = e), this.upload();
        return;
    }
    if (this.data != e) {
        if (this.data.length == e.length) {
            this.data.set(e), this.upload();
            return;
        }
        var r = new Uint8Array(
                e.buffer,
                e.buffer.byteOffset,
                e.buffer.byteLength
            ),
            n = new Uint8Array(this.data.buffer);
        n.set(r, t), this.uploadRange(t, r.length);
    }
};
GL$1.Buffer.prototype.uploadRange = function (e, t) {
    if (!this.data) throw "No data stored in this buffer";
    var r = this.data;
    if (!r.buffer) throw "Buffers must be typed arrays";
    var n = new Uint8Array(this.data.buffer, e, t),
        s = this.gl;
    s.bindBuffer(this.target, this.buffer), s.bufferSubData(this.target, e, n);
};
GL$1.Buffer.prototype.clone = function (e) {
    var t = new GL$1.Buffer();
    if (e) for (var r in this) t[r] = this[r];
    else
        this.target && (t.target = this.target),
            this.gl && (t.gl = this.gl),
            this.spacing && (t.spacing = this.spacing),
            this.data &&
                ((t.data = new global[this.data.constructor](this.data)),
                t.upload());
    return t;
};
GL$1.Buffer.prototype.toJSON = function () {
    return this.data
        ? {
              data_type: global.getClassName(this.data),
              data: this.data.toJSON(),
              target: this.target,
              attribute: this.attribute,
              spacing: this.spacing,
          }
        : (console.error("cannot serialize a mesh without data"), null);
};
GL$1.Buffer.prototype.fromJSON = function (e) {
    var t = global[e.data_type] || Float32Array;
    (this.data = new t(e.data)),
        (this.target = e.target),
        (this.spacing = e.spacing || 3),
        (this.attribute = e.attribute),
        this.upload(GL$1.STATIC_DRAW);
};
GL$1.Buffer.prototype.delete = function () {
    var e = this.gl;
    e.deleteBuffer(this.buffer), (this.buffer = null);
};
global.Mesh = GL$1.Mesh = function (t, r, n, s) {
    if (
        (GL$1.debug && console.log("GL.Mesh created"),
        s !== null && ((s = s || global.gl), (this.gl = s)),
        this.gl && (this._context_id = this.gl.context_id),
        (this.vertexBuffers = {}),
        (this.indexBuffers = {}),
        (this.info = {
            groups: [],
        }),
        (this._bounding = global.BBox.create()),
        (t || r) && this.addBuffers(t, r, n ? n.stream_type : null),
        n)
    )
        for (var a in n) this[a] = n[a];
};
Mesh.common_buffers = {
    vertices: { spacing: 3, attribute: "a_vertex" },
    vertices2D: { spacing: 2, attribute: "a_vertex2D" },
    normals: { spacing: 3, attribute: "a_normal", normalize: !0 },
    coords: { spacing: 2, attribute: "a_coord" },
    coords1: { spacing: 2, attribute: "a_coord1" },
    coords2: { spacing: 2, attribute: "a_coord2" },
    colors: { spacing: 4, attribute: "a_color", normalize: !0 },
    // cant use Uint8Array, dont know how as data comes in another format
    tangents: { spacing: 3, attribute: "a_tangent" },
    bone_indices: { spacing: 4, attribute: "a_bone_indices", type: Uint8Array },
    weights: { spacing: 4, attribute: "a_weights", normalize: !0 },
    // cant use Uint8Array, dont know how
    extra: { spacing: 1, attribute: "a_extra" },
    extra2: { spacing: 2, attribute: "a_extra2" },
    extra3: { spacing: 3, attribute: "a_extra3" },
    extra4: { spacing: 4, attribute: "a_extra4" },
};
Mesh.default_datatype = Float32Array;
Object.defineProperty(Mesh.prototype, "bounding", {
    set: function (e) {
        if (e) {
            if (e.length < 13)
                throw "Bounding must use the BBox bounding format of 13 floats: center, halfsize, min, max, radius";
            this._bounding.set(e);
        }
    },
    get: function () {
        return this._bounding;
    },
});
Mesh.prototype.addBuffer = function (e, t) {
    if (
        (t.target == gl.ARRAY_BUFFER
            ? (this.vertexBuffers[e] = t)
            : (this.indexBuffers[e] = t),
        !t.attribute)
    ) {
        var r = GL$1.Mesh.common_buffers[e];
        r && (t.attribute = r.attribute);
    }
};
Mesh.prototype.addBuffers = function (e, t, r) {
    var n = 0;
    this.vertexBuffers.vertices &&
        (n = this.vertexBuffers.vertices.data.length / 3);
    for (var s in e) {
        var a = e[s];
        if (a) {
            if (a.constructor == GL$1.Buffer || a.data) a = a.data;
            else if (typeof a[0] != "number") {
                for (var o = [], l = 0, c = 1e4; l < a.length; l += c)
                    o = Array.prototype.concat.apply(o, a.slice(l, l + c));
                a = o;
            }
            var u = GL$1.Mesh.common_buffers[s];
            if (a.constructor === Array) {
                var h = GL$1.Mesh.default_datatype;
                u && u.type && (h = u.type), (a = new h(a));
            }
            s == "vertices" && (n = a.length / 3);
            var f = a.length / n;
            u && u.spacing && (f = u.spacing);
            var d = "a_" + s;
            u && u.attribute && (d = u.attribute),
                this.vertexBuffers[s]
                    ? this.updateVertexBuffer(s, d, f, a, r)
                    : this.createVertexBuffer(s, d, f, a, r);
        }
    }
    if (t)
        for (var s in t) {
            var a = t[s];
            if (a) {
                if (
                    ((a.constructor == GL$1.Buffer || a.data) && (a = a.data),
                    typeof a[0] != "number")
                ) {
                    o = [];
                    for (var s = 0, c = 1e4; s < a.length; s += c)
                        o = Array.prototype.concat.apply(o, a.slice(s, s + c));
                    a = o;
                }
                if (a.constructor === Array) {
                    var h = Uint16Array;
                    n > 256 * 256 && (h = Uint32Array), (a = new h(a));
                }
                this.createIndexBuffer(s, a);
            }
        }
};
Mesh.prototype.createVertexBuffer = function (e, t, r, n, s) {
    var a = GL$1.Mesh.common_buffers[e];
    if ((!t && a && (t = a.attribute), !t))
        throw "Buffer added to mesh without attribute name";
    if ((!r && a && (a && a.spacing ? (r = a.spacing) : (r = 3)), !n)) {
        var o = this.getNumVertices();
        if (!o)
            throw "Cannot create an empty buffer in a mesh without vertices (vertices are needed to know the size)";
        n = new GL$1.Mesh.default_datatype(o * r);
    }
    if (!n.buffer) throw "Buffer data MUST be typed array";
    var l = (this.vertexBuffers[e] = new GL$1.Buffer(
        GL$1.ARRAY_BUFFER,
        n,
        r,
        s,
        this.gl
    ));
    return (
        (l.name = e),
        (l.attribute = t),
        (n.constructor == Uint8Array ||
            n.constructor == Int8Array ||
            n.constructor == Uint16Array ||
            n.constructor == Int16Array ||
            n.constructor == Uint32Array ||
            n.constructor == Int32Array) &&
            a &&
            a.normalize &&
            (l.normalize = !0),
        l
    );
};
Mesh.prototype.updateVertexBuffer = function (e, t, r, n, s) {
    var a = this.vertexBuffers[e];
    if (!a) {
        console.log("buffer not found: ", e);
        return;
    }
    n.length && ((a.attribute = t), (a.spacing = r), (a.data = n), a.upload(s));
};
Mesh.prototype.removeVertexBuffer = function (e, t) {
    var r = this.vertexBuffers[e];
    r && (t && r.delete(), delete this.vertexBuffers[e]);
};
Mesh.prototype.getVertexBuffer = function (e) {
    return this.vertexBuffers[e];
};
Mesh.prototype.createIndexBuffer = function (e, t, r) {
    if (t.constructor === Array) {
        var n = Uint16Array,
            s = this.vertexBuffers.vertices;
        if (s) {
            var a = s.data.length / 3;
            a > 256 * 256 && (n = Uint32Array), (t = new n(t));
        }
    }
    var o = (this.indexBuffers[e] = new GL$1.Buffer(
        GL$1.ELEMENT_ARRAY_BUFFER,
        t,
        0,
        r,
        this.gl
    ));
    return o;
};
Mesh.prototype.getBuffer = function (e) {
    return this.vertexBuffers[e];
};
Mesh.prototype.getIndexBuffer = function (e) {
    return this.indexBuffers[e];
};
Mesh.prototype.removeIndexBuffer = function (e, t) {
    var r = this.indexBuffers[e];
    r && (t && r.delete(), delete this.indexBuffers[e]);
};
Mesh.prototype.upload = function (e) {
    for (var t in this.vertexBuffers) {
        var r = this.vertexBuffers[t];
        r.upload(e);
    }
    for (var n in this.indexBuffers) {
        var r = this.indexBuffers[n];
        r.upload();
    }
};
Mesh.prototype.compile = Mesh.prototype.upload;
Mesh.prototype.deleteBuffers = function () {
    for (var e in this.vertexBuffers) {
        var t = this.vertexBuffers[e];
        t.delete();
    }
    this.vertexBuffers = {};
    for (var e in this.indexBuffers) {
        var t = this.indexBuffers[e];
        t.delete();
    }
    this.indexBuffers = {};
};
Mesh.prototype.delete = Mesh.prototype.deleteBuffers;
Mesh.prototype.bindBuffers = function (e) {
    for (var t in this.vertexBuffers) {
        var r = this.vertexBuffers[t],
            n = r.attribute || t,
            s = e.attributes[n];
        s == null ||
            !r.buffer ||
            (gl.bindBuffer(gl.ARRAY_BUFFER, r.buffer),
            gl.enableVertexAttribArray(s),
            gl.vertexAttribPointer(
                s,
                r.buffer.spacing,
                r.buffer.gl_type,
                r.normalize || !1,
                0,
                0
            ));
    }
};
Mesh.prototype.unbindBuffers = function (e) {
    for (var t in this.vertexBuffers) {
        var r = this.vertexBuffers[t],
            n = r.attribute || t,
            s = e.attributes[n];
        s == null || !r.buffer || gl.disableVertexAttribArray(e.attributes[n]);
    }
};
Mesh.prototype.clone = function (t) {
    var t = t || global.gl,
        r = {},
        n = {};
    for (var s in this.vertexBuffers) {
        var a = this.vertexBuffers[s];
        r[s] = new a.data.constructor(a.data);
    }
    for (var s in this.indexBuffers) {
        var a = this.indexBuffers[s];
        n[s] = new a.data.constructor(a.data);
    }
    return new GL$1.Mesh(r, n, void 0, t);
};
Mesh.prototype.cloneShared = function (t) {
    var t = t || global.gl;
    return new GL$1.Mesh(this.vertexBuffers, this.indexBuffers, void 0, t);
};
Mesh.prototype.toObject = function () {
    var e = {},
        t = {};
    for (var r in this.vertexBuffers) {
        var n = this.vertexBuffers[r];
        e[r] = {
            spacing: n.spacing,
            data: new n.data.constructor(n.data),
            //clone
        };
    }
    for (var r in this.indexBuffers) {
        var n = this.indexBuffers[r];
        t[r] = {
            data: new n.data.constructor(n.data),
            //clone
        };
    }
    return {
        vertexBuffers: e,
        indexBuffers: t,
        info: this.info ? global.cloneObject(this.info) : null,
        bounding: this._bounding.toJSON(),
    };
};
Mesh.prototype.toJSON = function () {
    var e = {
        vertexBuffers: {},
        indexBuffers: {},
        info: this.info ? global.cloneObject(this.info) : null,
        bounding: this._bounding.toJSON(),
    };
    for (var t in this.vertexBuffers)
        e.vertexBuffers[t] = this.vertexBuffers[t].toJSON();
    for (var t in this.indexBuffers)
        e.indexBuffers[t] = this.indexBuffers[t].toJSON();
    return e;
};
Mesh.prototype.fromJSON = function (e) {
    (this.vertexBuffers = {}), (this.indexBuffers = {});
    for (var t in e.vertexBuffers)
        if (e.vertexBuffers[t]) {
            var r = new GL$1.Buffer();
            r.fromJSON(e.vertexBuffers[t]),
                !r.attribute &&
                    GL$1.Mesh.common_buffers[t] &&
                    (r.attribute = GL$1.Mesh.common_buffers[t].attribute),
                (this.vertexBuffers[t] = r);
        }
    for (var t in e.indexBuffers)
        if (e.indexBuffers[t]) {
            var r = new GL$1.Buffer();
            r.fromJSON(e.indexBuffers[t]), (this.indexBuffers[t] = r);
        }
    e.info && (this.info = global.cloneObject(e.info)),
        e.bounding && (this.bounding = e.bounding);
};
Mesh.prototype.generateMetadata = function () {
    var e = {},
        t = this.vertexBuffers.vertices.data,
        r = this.indexBuffers.triangles.data;
    (e.vertices = t.length / 3),
        r ? (e.faces = r.length / 3) : (e.faces = t.length / 9),
        (e.indexed = !!this.metadata.faces),
        (this.metadata = e);
};
Mesh.prototype.computeWireframe = function () {
    var e = this.indexBuffers.triangles,
        t = this.vertexBuffers.vertices.data,
        r = t.length / 3;
    if (e) {
        for (
            var o = e.data, l = new GL$1.Indexer(), a = 0;
            a < o.length;
            a += 3
        )
            for (var c = o.subarray(a, a + 3), u = 0; u < c.length; u++) {
                var h = c[u],
                    f = c[(u + 1) % c.length];
                l.add([Math.min(h, f), Math.max(h, f)]);
            }
        for (
            var d = l.unique,
                s =
                    r > 256 * 256
                        ? new Uint32Array(d.length * 2)
                        : new Uint16Array(d.length * 2),
                a = 0,
                p = d.length;
            a < p;
            ++a
        )
            s.set(d[a], a * 2);
    } else
        for (
            var n = r / 3,
                s =
                    r > 256 * 256
                        ? new Uint32Array(n * 6)
                        : new Uint16Array(n * 6),
                a = 0;
            a < r;
            a += 3
        )
            (s[a * 2] = a),
                (s[a * 2 + 1] = a + 1),
                (s[a * 2 + 2] = a + 1),
                (s[a * 2 + 3] = a + 2),
                (s[a * 2 + 4] = a + 2),
                (s[a * 2 + 5] = a);
    return this.createIndexBuffer("wireframe", s), this;
};
Mesh.prototype.flipNormals = function (e) {
    var t = this.vertexBuffers.normals;
    if (t) {
        for (var s = t.data, a = s.length, r = 0; r < a; ++r) s[r] *= -1;
        t.upload(e), this.indexBuffers.triangles || this.computeIndices();
        for (
            var n = this.indexBuffers.triangles,
                s = n.data,
                a = s.length,
                r = 0;
            r < a;
            r += 3
        ) {
            var o = s[r];
            (s[r] = s[r + 1]), (s[r + 1] = o);
        }
        n.upload(e);
    }
};
Mesh.prototype.computeIndices = function () {
    var e = [],
        t = [],
        r = [],
        n = [],
        s = this.vertexBuffers.vertices,
        a = this.vertexBuffers.normals,
        o = this.vertexBuffers.coords,
        l = s.data,
        c = null;
    a && (c = a.data);
    var u = null;
    o && (u = o.data);
    for (var h = {}, f = l.length / 3, d = 0; d < f; ++d) {
        var p = l.subarray(d * 3, (d + 1) * 3),
            _ = (p[0] * 1e3) | 0,
            E = 0,
            m = h[_];
        if (m)
            for (var b = m.length; E < b; E++) {
                var L = e[m[E]];
                if (vec3.sqrDist(p, L) < 0.01) {
                    n.push(E);
                    break;
                }
            }
        if (!(m && E != b)) {
            var T = E;
            e.push(p),
                h[_] ? h[_].push(T) : (h[_] = [T]),
                c && t.push(c.subarray(d * 3, (d + 1) * 3)),
                u && r.push(u.subarray(d * 2, (d + 1) * 2)),
                n.push(T);
        }
    }
    (this.vertexBuffers = {}),
        this.createVertexBuffer(
            "vertices",
            GL$1.Mesh.common_buffers.vertices.attribute,
            3,
            linearizeArray(e)
        ),
        c &&
            this.createVertexBuffer(
                "normals",
                GL$1.Mesh.common_buffers.normals.attribute,
                3,
                linearizeArray(t)
            ),
        u &&
            this.createVertexBuffer(
                "coords",
                GL$1.Mesh.common_buffers.coords.attribute,
                2,
                linearizeArray(r)
            ),
        this.createIndexBuffer("triangles", n);
};
Mesh.prototype.explodeIndices = function (e) {
    e = e || "triangles";
    var t = this.getIndexBuffer(e);
    if (t) {
        var r = t.data,
            n = {};
        for (var s in this.vertexBuffers) {
            var a = GL$1.Mesh.common_buffers[s];
            n[s] = new (a.type || Float32Array)(a.spacing * r.length);
        }
        for (var s = 0, o = r.length; s < o; ++s) {
            var l = r[s];
            for (var c in this.vertexBuffers) {
                var u = this.vertexBuffers[c],
                    a = GL$1.Mesh.common_buffers[c],
                    h = u.spacing || a.spacing,
                    f = n[c];
                f.set(u.data.subarray(l * h, l * h + h), s * h);
            }
        }
        for (var s in n) {
            var d = this.vertexBuffers[s];
            this.createVertexBuffer(s, d.attribute, d.spacing, n[s]);
        }
        delete this.indexBuffers[e];
    }
};
Mesh.prototype.computeNormals = function (e) {
    var t = this.vertexBuffers.vertices;
    if (!t)
        return console.error(
            "Cannot compute normals of a mesh without vertices"
        );
    var r = this.vertexBuffers.vertices.data;
    r.length / 3;
    var n = new Float32Array(r.length),
        s = null;
    this.indexBuffers.triangles && (s = this.indexBuffers.triangles.data);
    for (
        var a = GL$1.temp_vec3,
            o = GL$1.temp2_vec3,
            l,
            c,
            u,
            h,
            f,
            d,
            p,
            _,
            E,
            m = s ? s.length : r.length,
            b = 0;
        b < m;
        b += 3
    )
        s
            ? ((l = s[b]),
              (c = s[b + 1]),
              (u = s[b + 2]),
              (h = r.subarray(l * 3, l * 3 + 3)),
              (f = r.subarray(c * 3, c * 3 + 3)),
              (d = r.subarray(u * 3, u * 3 + 3)),
              (p = n.subarray(l * 3, l * 3 + 3)),
              (_ = n.subarray(c * 3, c * 3 + 3)),
              (E = n.subarray(u * 3, u * 3 + 3)))
            : ((h = r.subarray(b * 3, b * 3 + 3)),
              (f = r.subarray(b * 3 + 3, b * 3 + 6)),
              (d = r.subarray(b * 3 + 6, b * 3 + 9)),
              (p = n.subarray(b * 3, b * 3 + 3)),
              (_ = n.subarray(b * 3 + 3, b * 3 + 6)),
              (E = n.subarray(b * 3 + 6, b * 3 + 9))),
            vec3.sub(a, f, h),
            vec3.sub(o, d, h),
            vec3.cross(a, a, o),
            vec3.normalize(a, a),
            vec3.add(p, p, a),
            vec3.add(_, _, a),
            vec3.add(E, E, a);
    if (s)
        for (var b = 0, m = n.length; b < m; b += 3) {
            var L = n.subarray(b, b + 3);
            vec3.normalize(L, L);
        }
    var T = this.vertexBuffers.normals;
    if (T) (T.data = n), T.upload(e);
    else
        return this.createVertexBuffer(
            "normals",
            GL$1.Mesh.common_buffers.normals.attribute,
            3,
            n
        );
    return T;
};
Mesh.prototype.computeTangents = function () {
    var e = this.vertexBuffers.vertices;
    if (!e)
        return console.error(
            "Cannot compute tangents of a mesh without vertices"
        );
    var t = this.vertexBuffers.normals;
    if (!t)
        return console.error(
            "Cannot compute tangents of a mesh without normals"
        );
    var r = this.vertexBuffers.coords;
    if (!r)
        return console.error("Cannot compute tangents of a mesh without uvs");
    var n = this.indexBuffers.triangles;
    if (!n)
        return console.error(
            "Cannot compute tangents of a mesh without indices"
        );
    var s = e.data,
        a = t.data,
        o = r.data,
        l = n.data;
    if (!(!s || !a || !o)) {
        var c = s.length / 3,
            u = new Float32Array(c * 4),
            h = new Float32Array(c * 3 * 2),
            f = h.subarray(c * 3),
            d,
            p,
            _ = vec3.create(),
            E = vec3.create(),
            m = vec3.create(),
            b = vec3.create();
        for (d = 0, p = l.length; d < p; d += 3) {
            var L = l[d],
                T = l[d + 1],
                g = l[d + 2],
                A = s.subarray(L * 3, L * 3 + 3),
                G = s.subarray(T * 3, T * 3 + 3),
                M = s.subarray(g * 3, g * 3 + 3),
                N = o.subarray(L * 2, L * 2 + 2),
                I = o.subarray(T * 2, T * 2 + 2),
                B = o.subarray(g * 2, g * 2 + 2),
                O = G[0] - A[0],
                F = M[0] - A[0],
                P = G[1] - A[1],
                C = M[1] - A[1],
                U = G[2] - A[2],
                X = M[2] - A[2],
                z = I[0] - N[0],
                q = B[0] - N[0],
                Y = I[1] - N[1],
                H = B[1] - N[1],
                Z,
                oe = z * H - q * Y;
            Math.abs(oe) < 1e-9 ? (Z = 0) : (Z = 1 / oe),
                vec3.copy(_, [
                    (H * O - Y * F) * Z,
                    (H * P - Y * C) * Z,
                    (H * U - Y * X) * Z,
                ]),
                vec3.copy(E, [
                    (z * F - q * O) * Z,
                    (z * C - q * P) * Z,
                    (z * X - q * U) * Z,
                ]),
                vec3.add(
                    h.subarray(L * 3, L * 3 + 3),
                    h.subarray(L * 3, L * 3 + 3),
                    _
                ),
                vec3.add(
                    h.subarray(T * 3, T * 3 + 3),
                    h.subarray(T * 3, T * 3 + 3),
                    _
                ),
                vec3.add(
                    h.subarray(g * 3, g * 3 + 3),
                    h.subarray(g * 3, g * 3 + 3),
                    _
                ),
                vec3.add(
                    f.subarray(L * 3, L * 3 + 3),
                    f.subarray(L * 3, L * 3 + 3),
                    E
                ),
                vec3.add(
                    f.subarray(T * 3, T * 3 + 3),
                    f.subarray(T * 3, T * 3 + 3),
                    E
                ),
                vec3.add(
                    f.subarray(g * 3, g * 3 + 3),
                    f.subarray(g * 3, g * 3 + 3),
                    E
                );
        }
        for (d = 0, p = s.length; d < p; d += 3) {
            var he = a.subarray(d, d + 3),
                ce = h.subarray(d, d + 3);
            vec3.subtract(m, ce, vec3.scale(m, he, vec3.dot(he, ce))),
                vec3.normalize(m, m);
            var ie =
                vec3.dot(vec3.cross(b, he, ce), f.subarray(d, d + 3)) < 0
                    ? -1
                    : 1;
            u.set([m[0], m[1], m[2], ie], (d / 3) * 4);
        }
        this.createVertexBuffer(
            "tangents",
            Mesh.common_buffers.tangents.attribute,
            4,
            u
        );
    }
};
Mesh.prototype.computeTextureCoordinates = function (e) {
    var t = this.vertexBuffers.vertices;
    if (!t)
        return console.error("Cannot compute uvs of a mesh without vertices");
    this.explodeIndices("triangles");
    var r = t.data,
        n = r.length / 3,
        s = this.vertexBuffers.coords,
        a = new Float32Array(n * 2),
        o = this.indexBuffers.triangles,
        l = null;
    o && (l = o.data);
    var c = vec3.create(),
        u = vec3.create(),
        h = vec3.create(),
        f = this.getBoundingBox(),
        d = global.BBox.getCenter(f),
        p = vec3.create();
    p.set(global.BBox.getHalfsize(f)), vec3.scale(p, p, 2);
    for (var _ = l ? l.length : r.length / 3, E = 0; E < _; E += 3) {
        if (l)
            var m = l[E],
                b = l[E + 1],
                L = l[E + 2],
                T = r.subarray(m * 3, m * 3 + 3),
                g = r.subarray(b * 3, b * 3 + 3),
                A = r.subarray(L * 3, L * 3 + 3),
                G = a.subarray(m * 2, m * 2 + 2),
                M = a.subarray(b * 2, b * 2 + 2),
                N = a.subarray(L * 2, L * 2 + 2);
        else
            var T = r.subarray(E * 3, E * 3 + 3),
                g = r.subarray((E + 1) * 3, (E + 1) * 3 + 3),
                A = r.subarray((E + 2) * 3, (E + 2) * 3 + 3),
                G = a.subarray(E * 2, E * 2 + 2),
                M = a.subarray((E + 1) * 2, (E + 1) * 2 + 2),
                N = a.subarray((E + 2) * 2, (E + 2) * 2 + 2);
        vec3.sub(u, T, g),
            vec3.sub(h, T, A),
            vec3.cross(c, u, h),
            (c[0] = Math.abs(c[0])),
            (c[1] = Math.abs(c[1])),
            (c[2] = Math.abs(c[2])),
            c[0] > c[1] && c[0] > c[2]
                ? ((G[0] = (T[2] - d[2]) / p[2]),
                  (G[1] = (T[1] - d[1]) / p[1]),
                  (M[0] = (g[2] - d[2]) / p[2]),
                  (M[1] = (g[1] - d[1]) / p[1]),
                  (N[0] = (A[2] - d[2]) / p[2]),
                  (N[1] = (A[1] - d[1]) / p[1]))
                : c[1] > c[2]
                ? ((G[0] = (T[0] - d[0]) / p[0]),
                  (G[1] = (T[2] - d[2]) / p[2]),
                  (M[0] = (g[0] - d[0]) / p[0]),
                  (M[1] = (g[2] - d[2]) / p[2]),
                  (N[0] = (A[0] - d[0]) / p[0]),
                  (N[1] = (A[2] - d[2]) / p[2]))
                : ((G[0] = (T[0] - d[0]) / p[0]),
                  (G[1] = (T[1] - d[1]) / p[1]),
                  (M[0] = (g[0] - d[0]) / p[0]),
                  (M[1] = (g[1] - d[1]) / p[1]),
                  (N[0] = (A[0] - d[0]) / p[0]),
                  (N[1] = (A[1] - d[1]) / p[1]));
    }
    s
        ? ((s.data = a), s.upload(e))
        : this.createVertexBuffer(
              "coords",
              Mesh.common_buffers.coords.attribute,
              2,
              a
          );
};
Mesh.prototype.getNumVertices = function () {
    var e = this.vertexBuffers.vertices;
    return e ? e.data.length / e.spacing : 0;
};
Mesh.prototype.getNumTriangles = function () {
    var e = this.getIndexBuffer("triangles");
    return e ? e.data.length / 3 : this.getNumVertices() / 3;
};
Mesh.computeBoundingBox = function (e, t, r) {
    if (e) {
        var n = 0;
        if (r) {
            for (var s = 0; s < r.length; ++s)
                if (r[s]) {
                    n = s;
                    break;
                }
            if (n == r.length) {
                console.warn("mask contains only zeros, no vertices marked");
                return;
            }
        }
        for (
            var a = vec3.clone(e.subarray(n * 3, n * 3 + 3)),
                o = vec3.clone(e.subarray(n * 3, n * 3 + 3)),
                l,
                s = n * 3;
            s < e.length;
            s += 3
        )
            (r && !r[s / 3]) ||
                ((l = e.subarray(s, s + 3)),
                vec3.min(a, l, a),
                vec3.max(o, l, o));
        (isNaN(a[0]) ||
            isNaN(a[1]) ||
            isNaN(a[2]) ||
            isNaN(o[0]) ||
            isNaN(o[1]) ||
            isNaN(o[2])) &&
            ((a[0] = a[1] = a[2] = 0),
            (o[0] = o[1] = o[2] = 0),
            console.warn("Warning: GL.Mesh has NaN values in vertices"));
        var c = vec3.add(vec3.create(), a, o);
        vec3.scale(c, c, 0.5);
        var u = vec3.subtract(vec3.create(), o, c);
        return global.BBox.setCenterHalfsize(t || global.BBox.create(), c, u);
    }
};
Mesh.prototype.getBoundingBox = function () {
    return this._bounding
        ? this._bounding
        : (this.updateBoundingBox(), this._bounding);
};
Mesh.prototype.updateBoundingBox = function () {
    var e = this.vertexBuffers.vertices;
    e &&
        (GL$1.Mesh.computeBoundingBox(e.data, this._bounding),
        this.info &&
            this.info.groups &&
            this.info.groups.length &&
            this.computeGroupsBoundingBoxes());
};
Mesh.prototype.computeGroupsBoundingBoxes = function () {
    var e = null,
        t = this.getIndexBuffer("triangles");
    t && (e = t.data);
    var r = this.getVertexBuffer("vertices");
    if (!r) return !1;
    var n = r.data;
    if (!n.length) return !1;
    var s = this.info.groups;
    if (s) {
        for (var a = 0; a < s.length; ++a) {
            var o = s[a];
            o.bounding = o.bounding || global.BBox.create();
            var l = null;
            if (e) {
                for (
                    var c = new Uint8Array(n.length / 3),
                        u = o.start,
                        h = 0,
                        f = o.length;
                    h < f;
                    h += 3
                )
                    (c[e[u + h]] = 1),
                        (c[e[u + h + 1]] = 1),
                        (c[e[u + h + 2]] = 1);
                GL$1.Mesh.computeBoundingBox(n, o.bounding, c);
            } else
                (l = n.subarray(o.start * 3, (o.start + o.length) * 3)),
                    GL$1.Mesh.computeBoundingBox(l, o.bounding);
        }
        return !0;
    }
};
Mesh.prototype.setBoundingBox = function (e, t) {
    global.BBox.setCenterHalfsize(this._bounding, e, t);
};
Mesh.prototype.freeData = function () {
    for (var e in this.vertexBuffers)
        (this.vertexBuffers[e].data = null),
            delete this[this.vertexBuffers[e].name];
    for (var t in this.indexBuffers)
        (this.indexBuffers[t].data = null),
            delete this[this.indexBuffers[t].name];
};
Mesh.prototype.configure = function (e, t) {
    var r = {},
        n = {};
    t = t || {};
    for (var s in e)
        if (e[s]) {
            if (s == "vertexBuffers" || s == "vertex_buffers") {
                for (a in e[s]) r[a] = e[s][a];
                continue;
            }
            if (s == "indexBuffers" || s == "index_buffers") {
                for (a in e[s]) n[a] = e[s][a];
                continue;
            }
            s == "indices" ||
            s == "lines" ||
            s == "wireframe" ||
            s == "triangles"
                ? (n[s] = e[s])
                : GL$1.Mesh.common_buffers[s]
                ? (r[s] = e[s])
                : (t[s] = e[s]);
        }
    this.addBuffers(r, n, t.stream_type);
    for (var a in t) this[a] = t[a];
    t.bounding || this.updateBoundingBox();
};
Mesh.prototype.totalMemory = function () {
    var e = 0;
    for (var t in this.vertexBuffers)
        e += this.vertexBuffers[t].data.buffer.byteLength;
    for (var t in this.indexBuffers)
        e += this.indexBuffers[t].data.buffer.byteLength;
    return e;
};
Mesh.prototype.slice = function (e, t) {
    var r = {},
        n = this.indexBuffers.triangles;
    if (!n)
        return console.warn("splice in not indexed not supported yet"), null;
    var s = n.data,
        a = [],
        o = new Int32Array(s.length);
    o.fill(-1);
    var l = e + t;
    l >= s.length && (l = s.length);
    for (var c = 0, u = e; u < l; ++u) {
        var h = s[u];
        if (o[h] != -1) {
            a.push(o[h]);
            continue;
        }
        var f = c++;
        (o[h] = f), a.push(f);
        for (var d in this.vertexBuffers) {
            var p = this.vertexBuffers[d],
                _ = p.data,
                E = p.spacing;
            r[d] || (r[d] = []);
            for (var m = r[d], b = 0; b < E; ++b) m.push(_[b + h * E]);
        }
    }
    var L = new GL$1.Mesh(r, { triangles: a }, null, gl);
    return L.updateBoundingBox(), L;
};
Mesh.prototype.simplify = function () {
    var e = this.getBoundingBox(),
        t = global.BBox.getMin(e),
        r = global.BBox.getHalfsize(e),
        n = vec3.scale(vec3.create(), r, 2),
        s = new GL$1.Mesh(),
        a = vec3.create();
    for (var o in this.vertexBuffers) {
        var l = this.vertexBuffers[o],
            c = l.data,
            u = new Float32Array(c.length);
        if (o == "vertices")
            for (var h = 0, f = c.length; h < f; h += 3) {
                var d = c.subarray(h, h + 3);
                vec3.sub(a, d, t),
                    vec3.div(a, a, n),
                    (a[0] = Math.round(a[0] * 256) / 256),
                    (a[1] = Math.round(a[1] * 256) / 256),
                    (a[2] = Math.round(a[2] * 256) / 256),
                    vec3.mul(a, a, n),
                    vec3.add(a, a, t),
                    u.set(a, h);
            }
        s.addBuffer();
    }
};
Mesh.load = function (e, t, r, n) {
    (t = t || {}), t.no_gl && (n = null);
    var s = r || new GL$1.Mesh(null, null, null, n);
    return s.configure(e, t), s;
};
Mesh.mergeMeshes = function (e, t) {
    t = t || {};
    for (
        var r = {},
            n = {},
            s = {},
            a = [],
            o = 0,
            l = 0,
            c = [],
            u = [],
            h = {},
            f = 0,
            d = null,
            p = 0;
        p < e.length;
        ++p
    ) {
        var _ = e[p],
            E = _.mesh,
            m = o;
        a.push(m);
        var b = E.vertexBuffers.vertices.data.length / 3;
        o += b;
        for (var L in E.vertexBuffers)
            r[L]
                ? (r[L] += E.vertexBuffers[L].data.length)
                : (r[L] = E.vertexBuffers[L].data.length);
        for (var L in E.indexBuffers)
            n[L]
                ? (n[L] += E.indexBuffers[L].data.length)
                : (n[L] = E.indexBuffers[L].data.length);
        var T = {
            name: "mesh_" + p,
            start: m,
            length: b,
            material: "",
        };
        if (E.bones) {
            for (var g = {}, L = 0; L < E.bones.length; ++L) {
                var A = E.bones[L];
                h[A[0]] || ((h[A[0]] = u.length), u.push(A)), (g[L] = h[A[0]]);
            }
            for (
                var G = E.vertexBuffers.bone_indices.data, L = 0;
                L < G.length;
                L += 1
            )
                G[L] = g[G[L]];
        } else if (u.length)
            throw "cannot merge meshes, one contains bones, the other doesnt";
        if ((c.push(T), E.morphs)) {
            var M = Object.values(E.morphs).length;
            if (f == 0) f = M;
            else if (f !== M)
                throw "cannot merge meshes with and without morph targets";
        }
    }
    for (var L in r) {
        var N = t[L];
        if (N === null) {
            delete r[L];
            continue;
        }
        if (!N) {
            var I = E.vertexBuffers[L];
            I &&
                (I.data && (I = I.data),
                I.constructor !== Array && (N = I.constructor)),
                N || (N = Float32Array);
        }
        (r[L] = new N(r[L])),
            (s[L] = 0),
            L === "vertices" && (l = r[L].length / 3);
    }
    if (f) {
        d = [];
        for (var p = 0; p < f; ++p) {
            var B = e[0].mesh,
                O = {
                    name: B.morphs[p].name,
                    weight: B.morphs[p].weight,
                    buffers: {
                        vertices: new Float32Array(l * 3),
                        normals: new Float32Array(l * 3),
                    },
                };
            d.push(O);
        }
    }
    for (var L in n) {
        var N = o < 65536 ? Uint16Array : Uint32Array;
        (n[L] = new N(n[L])), (s[L] = 0);
    }
    for (var p = 0; p < e.length; ++p) {
        var _ = e[p],
            E = _.mesh,
            m = s.vertices,
            b = 0;
        for (var L in E.vertexBuffers)
            if (r[L]) {
                if (
                    (L == "vertices" &&
                        (b = E.vertexBuffers[L].data.length / 3),
                    r[L].set(E.vertexBuffers[L].data, s[L]),
                    _[L + "_matrix"])
                ) {
                    var F = _[L + "_matrix"];
                    F.length == 16
                        ? U(r[L], s[L], E.vertexBuffers[L].data.length, F)
                        : F.length == 9 &&
                          X(r[L], s[L], E.vertexBuffers[L].data.length, F);
                }
                s[L] += E.vertexBuffers[L].data.length;
            }
        for (var L in E.indexBuffers)
            n[L].set(E.indexBuffers[L].data, s[L]),
                z(n[L], s[L], E.indexBuffers[L].data.length, a[p]),
                (s[L] += E.indexBuffers[L].data.length);
        if (f)
            for (var L = 0; L < E.morphs.length; ++L) {
                var P = E.morphs[L];
                for (var C in P.buffers) {
                    var O = P.buffers[C];
                    d[L].buffers[C].set(O, m);
                }
            }
    }
    function U(Y, H, Z, oe) {
        for (var he = H + Z, ce = H; ce < he; ce += 3) {
            var ie = Y.subarray(ce, ce + 3);
            vec3.transformMat4(ie, ie, oe);
        }
    }
    function X(Y, H, Z, oe) {
        for (var he = H + Z, ce = H; ce < he; ce += 2) {
            var ie = Y.subarray(ce, ce + 2);
            vec2.transformMat3(ie, ie, oe);
        }
    }
    function z(Y, H, Z, oe) {
        if (oe) for (var he = H + Z, ce = H; ce < he; ++ce) Y[ce] += oe;
    }
    var q = { info: { groups: c } };
    if ((u.length && (q.bones = u), !t.only_data)) {
        var E = new GL$1.Mesh(r, n, q);
        return E.updateBoundingBox(), d && (E.morphs = d), E;
    }
    return {
        vertexBuffers: r,
        indexBuffers: n,
        info: { groups: c },
        morphs: d,
    };
};
Mesh.parsers = {};
Mesh.encoders = {};
Mesh.binary_file_formats = {};
Mesh.compressors = {};
Mesh.decompressors = {};
Mesh.fromURL = function (e, t, r, n) {
    (n = n || {}), (r = r || global.gl);
    var s = e.lastIndexOf("."),
        a = e.substr(s + 1).toLowerCase();
    n.extension && (a = n.extension);
    var o = GL$1.Mesh.parsers[a.toLowerCase()];
    if (!o)
        return (
            console.error(
                "No parser available in litegl to parse mesh of type",
                a
            ),
            null
        );
    var l = new GL$1.Mesh(void 0, void 0, void 0, r);
    return (
        (l.ready = !1),
        (n.binary = Mesh.binary_file_formats[a]),
        global.HttpRequest(
            e,
            null,
            function (c) {
                l.parse(c, a, n), delete l.ready, t && t.call(l, l, e, n);
            },
            function (c) {
                t && t(null);
            },
            n
        ),
        l
    );
};
Mesh.prototype.parse = function (e, t, r) {
    (r = r || {}), (r.mesh = this), (t = t.toLowerCase());
    var n = GL$1.Mesh.parsers[t];
    if (n) return n.call(null, e, r);
    throw "GL.Mesh.parse: no parser found for format " + t;
};
Mesh.prototype.encode = function (e, t) {
    e = e.toLowerCase();
    var r = GL$1.Mesh.encoders[e];
    if (r) return r.call(null, this, t);
    throw "GL.Mesh.encode: no encoder found for format " + e;
};
Mesh.getScreenQuad = function (e) {
    e = e || global.gl;
    var t = e.meshes[":screen_quad"];
    if (t) return t;
    var r = new Float32Array([
            0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0,
        ]),
        n = new Float32Array([0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1]);
    return (
        (t = new GL$1.Mesh({ vertices: r, coords: n }, void 0, void 0, e)),
        (e.meshes[":screen_quad"] = t)
    );
};
function linearizeArray(e, t) {
    if (e.constructor === t) return e;
    if (e.constructor !== Array) return (t = t || Float32Array), new t(e);
    t = t || Float32Array;
    for (
        var r = e[0].length, n = e.length * r, s = new t(n), a = 0;
        a < e.length;
        ++a
    )
        for (var o = 0; o < r; ++o) s[a * r + o] = e[a][o];
    return s;
}
GL$1.linearizeArray = linearizeArray;
GL$1.Mesh.EXTENSION = "wbin";
GL$1.Mesh.enable_wbin_compression = !0;
function DynamicMesh(e, t, r, n, s) {
    (e = e || 1024),
        GL$1.debug && console.log("GL.Mesh created"),
        s !== null && ((s = s || global.gl), (this.gl = s)),
        (this.normals = t),
        (this.coords = r),
        (this._context_id = s.context_id),
        (this.vertexBuffers = {}),
        (this.indexBuffers = {}),
        (this.info = {
            groups: [],
        }),
        (this._bounding = global.BBox.create()),
        this.resize(e);
}
DynamicMesh.DEFAULT_NORMAL = vec3.fromValues(0, 1, 0);
DynamicMesh.DEFAULT_COORD = vec2.fromValues(0.5, 0.5);
DynamicMesh.DEFAULT_COLOR = vec4.fromValues(1, 1, 1, 1);
DynamicMesh.prototype.resize = function (e) {
    var t = {};
    (this._vertex_data = new Float32Array(e * 3)),
        (t.vertices = this._vertex_data),
        this.normals &&
            (t.normals = this._normal_data = new Float32Array(e * 3)),
        this.coords && (t.coords = this._coord_data = new Float32Array(e * 2)),
        this.colors && (t.colors = this._color_data = new Float32Array(e * 4)),
        this.addBuffers(t),
        (this.current_pos = 0),
        (this.max_size = e),
        (this._must_update = !0);
};
DynamicMesh.prototype.clear = function () {
    this.current_pos = 0;
};
DynamicMesh.prototype.addPoint = function (e, t, r, n) {
    if (s >= this.max_size)
        return console.warn("DynamicMesh: not enough space, reserve more"), !1;
    var s = this.current_pos++;
    return (
        this._vertex_data.set(e, s * 3),
        this._normal_data &&
            this._normal_data.set(t || DynamicMesh.DEFAULT_NORMAL, s * 3),
        this._coord_data &&
            this._coord_data.set(r || DynamicMesh.DEFAULT_COORD, s * 2),
        this._color_data &&
            this._color_data.set(n || DynamicMesh.DEFAULT_COLOR, s * 4),
        (this._must_update = !0),
        !0
    );
};
DynamicMesh.prototype.update = function (e) {
    return !this._must_update && !e
        ? this.current_pos
        : ((this._must_update = !1),
          this.getBuffer("vertices").upload(gl.STREAM_DRAW),
          this._normal_data && this.getBuffer("normal").upload(gl.STREAM_DRAW),
          this._coord_data && this.getBuffer("coord").upload(gl.STREAM_DRAW),
          this._color_data && this.getBuffer("color").upload(gl.STREAM_DRAW),
          this.current_pos);
};
global.extendClass(DynamicMesh, Mesh);
Mesh.plane = function (e, t) {
    (e = e || {}), (e.triangles = []);
    var r = e.detailX || e.detail || 1,
        n = e.detailY || e.detail || 1,
        s = e.width || e.size || 1,
        a = e.height || e.size || 1,
        o = e.xz;
    (s *= 0.5), (a *= 0.5);
    var l = [],
        c = [],
        u = [],
        h = [],
        f = vec3.fromValues(0, 0, 1);
    o && f.set([0, 1, 0]);
    for (var d = 0; d <= n; d++)
        for (var p = d / n, _ = 0; _ <= r; _++) {
            var E = _ / r;
            if (
                (o
                    ? c.push((2 * E - 1) * s, 0, -(2 * p - 1) * a)
                    : c.push((2 * E - 1) * s, (2 * p - 1) * a, 0),
                u.push(E, p),
                h.push(f[0], f[1], f[2]),
                _ < r && d < n)
            ) {
                var m = _ + d * (r + 1);
                o
                    ? (l.push(m + 1, m + r + 1, m),
                      l.push(m + 1, m + r + 2, m + r + 1))
                    : (l.push(m, m + 1, m + r + 1),
                      l.push(m + r + 1, m + 1, m + r + 2));
            }
        }
    var b = global.BBox.fromCenterHalfsize(
            [0, 0, 0],
            o ? [s, 0, a] : [s, a, 0]
        ),
        L = {
            vertices: c,
            normals: h,
            coords: u,
            triangles: l,
        };
    return GL$1.Mesh.load(L, { bounding: b }, t);
};
Mesh.plane2D = function (e, t) {
    var r = new Float32Array([-1, 1, 1, -1, 1, 1, -1, 1, -1, -1, 1, -1]),
        n = new Float32Array([0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0]);
    if (e && e.size)
        for (var s = e.size * 0.5, a = 0; a < r.length; ++a) r[a] *= s;
    return new GL$1.Mesh({ vertices2D: r, coords: n }, null, t);
};
Mesh.point = function (e) {
    return new GL$1.Mesh({ vertices: [0, 0, 0] });
};
Mesh.cube = function (e, t) {
    e = e || {};
    var r = (e.size || 1) * 0.5,
        n = {};
    n.vertices = new Float32Array([
        -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1,
        -1, 1, 1, 1, 1, -1, 1, 1, 1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, 1, -1,
        1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1,
        -1, -1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, -1, -1,
        1, -1, -1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, -1,
        1, -1, 1, -1, -1, 1,
    ]);
    for (var s = 0, a = n.vertices.length; s < a; ++s) n.vertices[s] *= r;
    return (
        (n.normals = new Float32Array([
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
            -1, 0, 0, -1, 0, 0, -1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
        ])),
        (n.coords = new Float32Array([
            0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1,
            0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0,
            1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0,
            0, 1, 0,
        ])),
        e.wireframe &&
            (n.wireframe = new Uint16Array([
                0, 2, 2, 5, 5, 4, 4, 0, 6, 7, 7, 10, 10, 11, 11, 6, 0, 6, 2, 7,
                5, 10, 4, 11,
            ])),
        (e.bounding = global.BBox.fromCenterHalfsize([0, 0, 0], [r, r, r])),
        GL$1.Mesh.load(n, e, t)
    );
};
Mesh.box = function (e, t) {
    e = e || {};
    var r = e.sizex || 1,
        n = e.sizey || 1,
        s = e.sizez || 1;
    (r *= 0.5), (n *= 0.5), (s *= 0.5);
    var a = {};
    a.vertices = new Float32Array([
        -1, 1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, 1, 1,
        -1, 1, 1, 1, 1, -1, 1, 1, 1, -1, 1, -1, 1, 1, -1, -1, -1, 1, 1, 1, -1,
        1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1,
        -1, -1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, -1, -1,
        1, -1, -1, 1, 1, 1, 1, 1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, -1,
        1, -1, 1, -1, -1, 1,
    ]);
    for (var o = 0, l = a.vertices.length; o < l; o += 3)
        (a.vertices[o] *= r),
            (a.vertices[o + 1] *= n),
            (a.vertices[o + 2] *= s);
    return (
        (a.normals = new Float32Array([
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0,
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
            -1, 0, 0, -1, 0, 0, -1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
        ])),
        (a.coords = new Float32Array([
            0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1,
            0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0,
            1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 0,
            0, 1, 0,
        ])),
        e.wireframe &&
            (a.wireframe = new Uint16Array([
                0, 2, 2, 5, 5, 4, 4, 0, 6, 7, 7, 10, 10, 11, 11, 6, 0, 6, 2, 7,
                5, 10, 4, 11,
            ])),
        (e.bounding = global.BBox.fromCenterHalfsize([0, 0, 0], [r, n, s])),
        GL$1.Mesh.load(a, e, t)
    );
};
Mesh.circle = function (e, t) {
    e = e || {};
    var r = e.size || e.radius || 1,
        n = Math.ceil(e.slices || 24),
        s = e.xz || !1,
        a = e.empty || !1;
    n < 3 && (n = 3);
    var o = (2 * Math.PI) / n,
        l = vec3.create(),
        c = vec3.create(),
        u = vec3.fromValues(0, 0, 1),
        h = vec2.fromValues(0.5, 0.5),
        f = vec2.create();
    s && u.set([0, 1, 0]);
    var d = s ? 2 : 1,
        p = new Float32Array(3 * (n + 1)),
        _ = new Float32Array(3 * (n + 1)),
        E = new Float32Array(2 * (n + 1)),
        m = null;
    p.set(l, 0), _.set(u, 0), E.set(h, 0);
    for (var b = 0, L = 0, T = 0; T < n; ++T)
        (b = Math.sin(o * T)),
            (L = Math.cos(o * T)),
            (c[0] = b * r),
            (c[d] = L * r),
            (f[0] = b * 0.5 + 0.5),
            (f[1] = L * 0.5 + 0.5),
            p.set(c, T * 3 + 3),
            _.set(u, T * 3 + 3),
            E.set(f, T * 2 + 2);
    if (a)
        (p = p.subarray(3)),
            (_ = p.subarray(3)),
            (E = p.subarray(2)),
            (m = null);
    else {
        var m = new Uint16Array(3 * n),
            g = 2,
            A = 1;
        s && ((g = 1), (A = 2));
        for (var T = 0; T < n - 1; ++T)
            (m[T * 3] = 0), (m[T * 3 + 1] = T + g), (m[T * 3 + 2] = T + A);
        (m[T * 3] = 0),
            s
                ? ((m[T * 3 + 1] = T + 1), (m[T * 3 + 2] = 1))
                : ((m[T * 3 + 1] = 1), (m[T * 3 + 2] = T + 1));
    }
    e.bounding = global.BBox.fromCenterHalfsize(
        [0, 0, 0],
        s ? [r, 0, r] : [r, r, 0]
    );
    var G = {
        vertices: p,
        normals: _,
        coords: E,
        triangles: m,
    };
    if (e.wireframe) {
        for (var M = new Uint16Array(n * 2), T = 0; T < n; T++)
            (M[T * 2] = T), (M[T * 2 + 1] = T + 1);
        (M[0] = n), (G.wireframe = M);
    }
    return GL$1.Mesh.load(G, e, t);
};
Mesh.ring = function (e, t) {
    e = e || {};
    var r = e.size || e.radius || 1,
        n = e.thickness || r * 0.1,
        s = Math.ceil(e.slices || 24),
        a = e.xz || !1,
        o = e.empty || !1;
    s < 3 && (s = 3);
    var l = (2 * Math.PI) / s;
    vec3.create();
    var c = vec3.create(),
        u = vec3.create(),
        h = vec3.fromValues(0, 0, 1);
    vec2.fromValues(0.5, 0.5);
    var f = vec2.create();
    a && h.set([0, 1, 0]);
    for (
        var d = a ? 2 : 1,
            p = new Float32Array(3 * (s * 2 + 2)),
            _ = new Float32Array(3 * (s * 2 + 2)),
            E = new Float32Array(2 * (s * 2 + 2)),
            m = null,
            b = 0,
            L = 0,
            T = 0;
        T <= s;
        ++T
    )
        (b = Math.sin(l * T)),
            (L = Math.cos(l * T)),
            (c[0] = b * (r - n)),
            (c[d] = L * (r - n)),
            (f[0] = T / s),
            (f[1] = 0),
            p.set(c, T * 6),
            _.set(h, T * 6),
            E.set(f, T * 4),
            (u[0] = b * (r + n)),
            (u[d] = L * (r + n)),
            (f[1] = 1),
            p.set(u, T * 6 + 3),
            _.set(h, T * 6 + 3),
            E.set(f, T * 4 + 2);
    if (o)
        (p = p.subarray(3)),
            (_ = p.subarray(3)),
            (E = p.subarray(2)),
            (m = null);
    else {
        var m = new Uint16Array(6 * s),
            g = 2,
            A = 1;
        a && ((g = 1), (A = 2));
        for (var T = 0; T < s; ++T)
            (m[T * 6] = T * 2),
                (m[T * 6 + 1] = T * 2 + g),
                (m[T * 6 + 2] = T * 2 + A),
                (m[T * 6 + 3] = T * 2 + A),
                (m[T * 6 + 4] = T * 2 + g),
                (m[T * 6 + 5] = T * 2 + 3);
    }
    e.bounding = global.BBox.fromCenterHalfsize(
        [0, 0, 0],
        a ? [r + n, 0, r + n] : [r + n, r + n, 0]
    );
    var G = {
        vertices: p,
        normals: _,
        coords: E,
        triangles: m,
    };
    if (e.wireframe) {
        for (var M = new Uint16Array(s * 4), T = 0; T < s; T++)
            (M[T * 4] = T * 2),
                (M[T * 4 + 1] = T * 2 + 2),
                (M[T * 4 + 2] = T * 2 + 1),
                (M[T * 4 + 3] = T * 2 + 3);
        G.wireframe = M;
    }
    return GL$1.Mesh.load(G, e, t);
};
Mesh.cylinder = function (e, t) {
    e = e || {};
    for (
        var r = e.radius || e.size || 1,
            n = e.height || e.size || 2,
            s = e.subdivisions || 64,
            a = new Float32Array(s * 6 * 3 * 2),
            o = new Float32Array(s * 6 * 3 * 2),
            l = new Float32Array(s * 6 * 2 * 2),
            c = (2 * Math.PI) / s,
            u = null,
            h = 0;
        h < s;
        ++h
    ) {
        var f = h * c;
        (u = [Math.sin(f), 0, Math.cos(f)]),
            a.set([u[0] * r, n * 0.5, u[2] * r], h * 6 * 3),
            o.set(u, h * 6 * 3),
            l.set([h / s, 1], h * 6 * 2),
            (u = [Math.sin(f), 0, Math.cos(f)]),
            a.set([u[0] * r, n * -0.5, u[2] * r], h * 6 * 3 + 3),
            o.set(u, h * 6 * 3 + 3),
            l.set([h / s, 0], h * 6 * 2 + 2),
            (u = [Math.sin(f + c), 0, Math.cos(f + c)]),
            a.set([u[0] * r, n * -0.5, u[2] * r], h * 6 * 3 + 6),
            o.set(u, h * 6 * 3 + 6),
            l.set([(h + 1) / s, 0], h * 6 * 2 + 4),
            (u = [Math.sin(f + c), 0, Math.cos(f + c)]),
            a.set([u[0] * r, n * 0.5, u[2] * r], h * 6 * 3 + 9),
            o.set(u, h * 6 * 3 + 9),
            l.set([(h + 1) / s, 1], h * 6 * 2 + 6),
            (u = [Math.sin(f), 0, Math.cos(f)]),
            a.set([u[0] * r, n * 0.5, u[2] * r], h * 6 * 3 + 12),
            o.set(u, h * 6 * 3 + 12),
            l.set([h / s, 1], h * 6 * 2 + 8),
            (u = [Math.sin(f + c), 0, Math.cos(f + c)]),
            a.set([u[0] * r, n * -0.5, u[2] * r], h * 6 * 3 + 15),
            o.set(u, h * 6 * 3 + 15),
            l.set([(h + 1) / s, 0], h * 6 * 2 + 10);
    }
    var d = h * 6 * 3,
        p = h * 6 * 2,
        _ = d;
    if (e.caps === !1)
        (a = a.subarray(0, d)), (o = o.subarray(0, d)), (l = l.subarray(0, p));
    else
        for (
            var E = vec3.fromValues(0, n * 0.5, 0),
                m = vec3.fromValues(0, n * -0.5, 0),
                b = vec3.fromValues(0, 1, 0),
                L = vec3.fromValues(0, -1, 0),
                h = 0;
            h < s;
            ++h
        ) {
            var f = h * c,
                T = vec3.fromValues(Math.sin(f), 0, Math.cos(f)),
                g = vec3.fromValues(Math.sin(f + c), 0, Math.cos(f + c));
            a.set([T[0] * r, n * 0.5, T[2] * r], d + h * 6 * 3),
                o.set(b, d + h * 6 * 3),
                l.set([-T[0] * 0.5 + 0.5, T[2] * 0.5 + 0.5], p + h * 6 * 2),
                a.set([g[0] * r, n * 0.5, g[2] * r], d + h * 6 * 3 + 3),
                o.set(b, d + h * 6 * 3 + 3),
                l.set([-g[0] * 0.5 + 0.5, g[2] * 0.5 + 0.5], p + h * 6 * 2 + 2),
                a.set(E, d + h * 6 * 3 + 6),
                o.set(b, d + h * 6 * 3 + 6),
                l.set([0.5, 0.5], p + h * 6 * 2 + 4),
                a.set([g[0] * r, n * -0.5, g[2] * r], d + h * 6 * 3 + 9),
                o.set(L, d + h * 6 * 3 + 9),
                l.set([g[0] * 0.5 + 0.5, g[2] * 0.5 + 0.5], p + h * 6 * 2 + 6),
                a.set([T[0] * r, n * -0.5, T[2] * r], d + h * 6 * 3 + 12),
                o.set(L, d + h * 6 * 3 + 12),
                l.set([T[0] * 0.5 + 0.5, T[2] * 0.5 + 0.5], p + h * 6 * 2 + 8),
                a.set(m, d + h * 6 * 3 + 15),
                o.set(L, d + h * 6 * 3 + 15),
                l.set([0.5, 0.5], p + h * 6 * 2 + 10);
        }
    var A = {
        vertices: a,
        normals: o,
        coords: l,
    };
    return (
        (e.bounding = global.BBox.fromCenterHalfsize(
            [0, 0, 0],
            [r, n * 0.5, r]
        )),
        (e.info = { groups: [] }),
        e.caps !== !1 &&
            (e.info.groups.push({
                name: "side",
                start: 0,
                length: _ / 3,
            }),
            e.info.groups.push({
                name: "caps",
                start: _ / 3,
                length: (a.length - _) / 3,
            })),
        Mesh.load(A, e, t)
    );
};
Mesh.cone = function (e, t) {
    e = e || {};
    for (
        var r = e.radius || e.size || 1,
            n = e.height || e.size || 2,
            s = e.subdivisions || 64,
            a = new Float32Array(s * 3 * 3 * 2),
            o = new Float32Array(s * 3 * 3 * 2),
            l = new Float32Array(s * 2 * 3 * 2),
            c = (2 * Math.PI) / s,
            u = null,
            h = r / n,
            f = 0;
        f < s;
        ++f
    ) {
        var d = f * c;
        (u = [Math.sin(d + c * 0.5), h, Math.cos(d + c * 0.5)]),
            vec3.normalize(u, u),
            a.set([0, n, 0], f * 6 * 3),
            o.set(u, f * 6 * 3),
            l.set([f / s, 1], f * 6 * 2),
            (u = [Math.sin(d), h, Math.cos(d)]),
            a.set([u[0] * r, 0, u[2] * r], f * 6 * 3 + 3),
            vec3.normalize(u, u),
            o.set(u, f * 6 * 3 + 3),
            l.set([f / s, 0], f * 6 * 2 + 2),
            (u = [Math.sin(d + c), h, Math.cos(d + c)]),
            a.set([u[0] * r, 0, u[2] * r], f * 6 * 3 + 6),
            vec3.normalize(u, u),
            o.set(u, f * 6 * 3 + 6),
            l.set([(f + 1) / s, 0], f * 6 * 2 + 4);
    }
    for (
        var p = 0,
            _ = 0,
            E = vec3.fromValues(0, 0, 0),
            m = vec3.fromValues(0, -1, 0),
            f = 0;
        f < s;
        ++f
    ) {
        var d = f * c,
            b = vec3.fromValues(Math.sin(d), 0, Math.cos(d)),
            L = vec3.fromValues(Math.sin(d + c), 0, Math.cos(d + c));
        a.set([L[0] * r, 0, L[2] * r], p + f * 6 * 3 + 9),
            o.set(m, p + f * 6 * 3 + 9),
            l.set([L[0] * 0.5 + 0.5, L[2] * 0.5 + 0.5], _ + f * 6 * 2 + 6),
            a.set([b[0] * r, 0, b[2] * r], p + f * 6 * 3 + 12),
            o.set(m, p + f * 6 * 3 + 12),
            l.set([b[0] * 0.5 + 0.5, b[2] * 0.5 + 0.5], _ + f * 6 * 2 + 8),
            a.set(E, p + f * 6 * 3 + 15),
            o.set(m, p + f * 6 * 3 + 15),
            l.set([0.5, 0.5], _ + f * 6 * 2 + 10);
    }
    var T = {
        vertices: a,
        normals: o,
        coords: l,
    };
    return (
        (e.bounding = global.BBox.fromCenterHalfsize(
            [0, n * 0.5, 0],
            [r, n * 0.5, r]
        )),
        Mesh.load(T, e, t)
    );
};
Mesh.torus = function (e, t) {
    e = e || {};
    var r = e.outerradius || e.radius || 1,
        n = Math.ceil(e.outerslices || e.slices || 24),
        s = e.innerradius || r * 0.1,
        a = Math.ceil(e.innerslices || n),
        o = e.angle || Math.PI * 2,
        l = (Math.PI * 2) / a,
        c = o / n,
        u = 1;
    vec3.create();
    var h = vec3.create(),
        f = vec3.fromValues(0, 0, 1);
    vec2.fromValues(0.5, 0.5);
    for (
        var d = vec2.create(),
            p = o == Math.PI * 2,
            _ = new Float32Array(3 * a),
            E = new Float32Array(3 * a),
            g = 0,
            A = 0,
            m = 0;
        m < a;
        ++m
    )
        (g = Math.sin(l * m)),
            (A = Math.cos(l * m)),
            (h[0] = g * s),
            (h[u] = A * s),
            (d[0] = g * 0.5 + 0.5),
            (d[1] = A * 0.5 + 0.5),
            _.set(h, m * 3),
            vec3.normalize(f, h),
            E.set(f, m * 3);
    var b = new Float32Array(3 * n * a),
        L = new Float32Array(3 * n * a),
        T = new Float32Array(2 * n * a),
        I = null,
        g = 0,
        A = 0,
        G = mat4.create(),
        M = vec3.fromValues(-r, 0, 0),
        N = vec3.fromValues(0, 1, 0);
    vec3.create();
    for (var I = [], B = a, m = 0; m < n; ++m) {
        mat4.identity(G), mat4.rotate(G, G, m * c, N), mat4.translate(G, G, M);
        var O = m * a,
            B = a;
        m >= n - 1 && ((B = (n - 1) * -a), p || (B = 0));
        for (var F = 0; F < a; ++F) {
            var P = _.subarray(F * 3, F * 3 + 3),
                C = E.subarray(F * 3, F * 3 + 3);
            mat4.multiplyVec3(h, G, P),
                mat4.rotateVec3(f, G, C),
                b.set(h, F * 3 + m * 3 * a),
                L.set(f, F * 3 + m * 3 * a),
                T.set([m / n, F / a], F * 2 + m * 2 * a);
            var U = O + F,
                X = O + ((F + 1) % a);
            I.push(X, U, U + B, X, U + B, X + B);
        }
    }
    var z = s + r;
    e.bounding = global.BBox.fromCenterHalfsize([0, 0, 0], [z, z, s]);
    var q = {
        vertices: b,
        normals: L,
        coords: T,
        triangles: I,
    };
    return GL$1.Mesh.load(q, e, t);
};
Mesh.sphere = function (e, t) {
    e = e || {};
    for (
        var r = e.radius || e.size || 1,
            n = e.lat || e.subdivisions || 16,
            s = e.long || e.subdivisions || 16,
            a = new Float32Array((n + 1) * (s + 1) * 3),
            o = new Float32Array((n + 1) * (s + 1) * 3),
            l = new Float32Array((n + 1) * (s + 1) * 2),
            c = new Uint16Array(n * s * 6),
            u = e.hemi ? Math.PI * 0.5 : Math.PI,
            h = 0,
            f = 0,
            d = 0;
        d <= n;
        d++
    )
        for (
            var p = (d * u) / n, _ = Math.sin(p), E = Math.cos(p), m = 0;
            m <= s;
            m++
        ) {
            var b = (m * 2 * Math.PI) / s,
                L = Math.sin(b),
                T = Math.cos(b),
                g = T * _,
                A = E,
                G = L * _,
                M = 1 - m / s,
                N = 1 - d / n;
            a.set([r * g, r * A, r * G], h),
                o.set([g, A, G], h),
                l.set([M, N], f),
                (h += 3),
                (f += 2);
        }
    h = 0;
    for (var d = 0; d < n; d++)
        for (var m = 0; m < s; m++) {
            var I = d * (s + 1) + m,
                B = I + s + 1;
            c.set([B, I, I + 1], h), c.set([B + 1, B, I + 1], h + 3), (h += 6);
        }
    var O = {
        vertices: a,
        normals: o,
        coords: l,
        triangles: c,
    };
    if (e.wireframe) {
        for (var F = new Uint16Array(s * n * 4), P = 0, h = 0; h < n; h++) {
            for (var C = 0; C < s; C++)
                (F[P] = h * (s + 1) + C),
                    (F[P + 1] = h * (s + 1) + C + 1),
                    (P += 2);
            F[P - s * 2] = h * (s + 1) + C;
        }
        for (var h = 0; h < s; h++)
            for (var C = 0; C < n; C++)
                (F[P] = C * (s + 1) + h),
                    (F[P + 1] = (C + 1) * (s + 1) + h),
                    (P += 2);
        O.wireframe = F;
    }
    return (
        e.hemi
            ? (e.bounding = global.BBox.fromCenterHalfsize(
                  [0, r * 0.5, 0],
                  [r, r * 0.5, r],
                  r
              ))
            : (e.bounding = global.BBox.fromCenterHalfsize(
                  [0, 0, 0],
                  [r, r, r],
                  r
              )),
        GL$1.Mesh.load(O, e, t)
    );
};
Mesh.grid = function (e, t) {
    e = e || {};
    var r = e.lines || 11;
    r < 0 && (r = 1);
    for (
        var n = e.size || 10,
            s = new Float32Array(r * 2 * 2 * 3),
            a = n * 0.5,
            o = 0,
            l = -a,
            c = n / (r - 1),
            u = 0;
        u < r;
        u++
    )
        (s[o] = l),
            (s[o + 2] = -a),
            (s[o + 3] = l),
            (s[o + 5] = a),
            (s[o + 6] = a),
            (s[o + 8] = l),
            (s[o + 9] = -a),
            (s[o + 11] = l),
            (l += c),
            (o += 12);
    return new GL$1.Mesh({ vertices: s }, e, t);
};
Mesh.icosahedron = function (e, t) {
    e = e || {};
    var r = e.radius || e.size || 1,
        n = e.subdivisions === void 0 ? 0 : e.subdivisions;
    n > 6 && (n = 6);
    for (
        var s = (1 + Math.sqrt(5)) / 2,
            a = [
                -1,
                s,
                0,
                1,
                s,
                0,
                -1,
                -s,
                0,
                1,
                -s,
                0,
                0,
                -1,
                s,
                0,
                1,
                s,
                0,
                -1,
                -s,
                0,
                1,
                -s,
                s,
                0,
                -1,
                s,
                0,
                1,
                -s,
                0,
                -1,
                -s,
                0,
                1,
            ],
            o = [],
            l = [],
            c = [
                0, 11, 5, 0, 5, 1, 0, 1, 7, 0, 7, 10, 0, 10, 11, 1, 5, 9, 5, 11,
                4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3, 9, 4, 3, 4, 2, 3, 2, 6, 3,
                6, 8, 3, 8, 9, 4, 9, 5, 2, 4, 11, 6, 2, 10, 8, 6, 7, 9, 8, 1,
            ],
            u = a.length,
            h = 0;
        h < u;
        h += 3
    ) {
        var f = Math.sqrt(
                a[h] * a[h] + a[h + 1] * a[h + 1] + a[h + 2] * a[h + 2]
            ),
            d = a[h] / f,
            p = a[h + 1] / f,
            _ = a[h + 2] / f;
        o.push(d, p, _),
            l.push(Math.atan2(d, _), Math.acos(p)),
            (a[h] *= r / f),
            (a[h + 1] *= r / f),
            (a[h + 2] *= r / f);
    }
    var E = {};
    function m(G, M) {
        var N = c[G] < c[M] ? c[G] + ":" + c[M] : c[M] + ":" + c[G],
            I = E[N];
        if (I) return I;
        var B = a.length / 3;
        a.push(
            (a[c[G] * 3] + a[c[M] * 3]) * 0.5,
            (a[c[G] * 3 + 1] + a[c[M] * 3 + 1]) * 0.5,
            (a[c[G] * 3 + 2] + a[c[M] * 3 + 2]) * 0.5
        );
        var O = Math.sqrt(
                a[B * 3] * a[B * 3] +
                    a[B * 3 + 1] * a[B * 3 + 1] +
                    a[B * 3 + 2] * a[B * 3 + 2]
            ),
            F = a[B * 3] / O,
            P = a[B * 3 + 1] / O,
            C = a[B * 3 + 2] / O;
        return (
            o.push(F, P, C),
            l.push((Math.atan2(F, C) / Math.PI) * 0.5, Math.acos(P) / Math.PI),
            (a[B * 3] *= r / O),
            (a[B * 3 + 1] *= r / O),
            (a[B * 3 + 2] *= r / O),
            (E[N] = B),
            B
        );
    }
    for (var b = 0; b < n; ++b) {
        for (var L = [], u = c.length, h = 0; h < u; h += 3) {
            var T = m(h, h + 1),
                g = m(h + 1, h + 2),
                A = m(h + 2, h);
            L.push(c[h], T, A),
                L.push(c[h + 1], g, T),
                L.push(c[h + 2], A, g),
                L.push(T, g, A);
        }
        c = L;
    }
    return (
        (e.bounding = global.BBox.fromCenterHalfsize([0, 0, 0], [r, r, r], r)),
        new GL$1.Mesh.load(
            {
                vertices: a,
                coords: l,
                normals: o,
                triangles: c,
            },
            e,
            t
        )
    );
};
Mesh.shape = function (e, t, r) {
    if (((t = t || {}), typeof earcut > "u"))
        throw "To use GL.Mesh.shape you must download and include earcut.js (do not link it directly!): https://raw.githubusercontent.com/mapbox/earcut/master/src/earcut.js";
    if (!e || !e.length || e.length % 2 == 1)
        throw "GL.Mesh.shape line missing, must be an array of 2D vertices";
    var n = t.extrude || 0;
    e[0].constructor === Array && (e = earcut.flatten(e));
    var s = earcut(e).reverse();
    console.log(s);
    for (
        var a = [], o = [], l = [], c = [e[0], e[1]], u = [e[0], e[1]], h = 0;
        h < e.length;
        h += 2
    )
        (c[0] = Math.min(c[0], e[h])),
            (c[1] = Math.max(c[1], e[h])),
            (u[0] = Math.min(u[0], e[h + 1])),
            (u[1] = Math.max(u[1], e[h + 1]));
    var f = c[1] - c[0],
        d = u[1] - u[0],
        p = [],
        _ = null;
    if (n) {
        _ = [];
        for (var E = vec3.create(), m = e.length, h = 0; h < e.length; h += 2) {
            var b = e[h],
                L = e[h + 1],
                T = e[(h + 2) % m],
                g = e[(h + 3) % m],
                A = a.length / 3;
            a.push(b, n * 0.5, L),
                a.push(b, n * -0.5, L),
                a.push(T, n * 0.5, g),
                a.push(T, n * -0.5, g),
                vec3.normalize(E, vec3.cross(E, [0, 1, 0], [T - b, 0, g - L])),
                o.push(
                    E[0],
                    E[1],
                    E[2],
                    E[0],
                    E[1],
                    E[2],
                    E[0],
                    E[1],
                    E[2],
                    E[0],
                    E[1],
                    E[2]
                );
            var G = (b - c[0]) / f,
                M = (L - u[0]) / d,
                N = (T - c[0]) / f,
                I = (g - u[0]) / d;
            l.push(G, M, G, M, N, I, N, I),
                _.push(A, A + 2, A + 1, A + 2, A + 3, A + 1);
        }
        p.push({ name: "side", start: 0, length: _.length });
        for (var B = a.length / 3, O = _.length, h = 0; h < e.length; h += 2) {
            var b = e[h],
                L = e[h + 1],
                G = (b - c[0]) / f,
                M = (L - u[0]) / d;
            a.push(b, n * 0.5, L),
                a.push(b, n * -0.5, L),
                o.push(0, 1, 0, 0, -1, 0),
                l.push(G, M, G, M);
        }
        for (var h = 0; h < s.length; h += 3)
            _.push(B + s[h] * 2, B + s[h + 1] * 2, B + s[h + 2] * 2),
                _.push(
                    B + s[h] * 2 + 1,
                    B + s[h + 2] * 2 + 1,
                    B + s[h + 1] * 2 + 1
                );
        p.push({ name: "caps", start: O, length: _.length }),
            (t.bounding = global.BBox.fromCenterHalfsize(
                [(c[0] + c[1]) * 0.5, 0, (u[0] + u[1]) * 0.5],
                [f * 0.5, n * 0.5, d * 0.5],
                vec2.len([f * 0.5, n * 0.5, d * 0.5])
            ));
    } else {
        for (var h = 0; h < e.length; h += 2)
            a.push(e[h], 0, e[h + 1]),
                o.push(0, 1, 0),
                l.push((e[h] - c[0]) / f, (e[h + 1] - u[0]) / d);
        (_ = s),
            p.push({ name: "side", start: 0, length: _.length }),
            (t.bounding = global.BBox.fromCenterHalfsize(
                [(c[0] + c[1]) * 0.5, 0, (u[0] + u[1]) * 0.5],
                [f * 0.5, 0, d * 0.5],
                vec2.len([f * 0.5, 0, d * 0.5])
            ));
    }
    if (t.xy) {
        for (var h = 0; h < a.length; h += 3) F(a, h), F(o, h);
        n
            ? (t.bounding = global.BBox.fromCenterHalfsize(
                  [(c[0] + c[1]) * 0.5, (u[0] + u[1]) * 0.5, 0],
                  [f * 0.5, d * 0.5, n * 0.5],
                  vec2.len([f * 0.5, d * 0.5, n * 0.5])
              ))
            : (t.bounding = global.BBox.fromCenterHalfsize(
                  [(c[0] + c[1]) * 0.5, (u[0] + u[1]) * 0.5, 0],
                  [f * 0.5, d * 0.5, 0],
                  vec2.len([f * 0.5, d * 0.5, 0])
              ));
    }
    return (
        (t.info = { groups: p }),
        new GL$1.Mesh.load(
            {
                vertices: a,
                coords: l,
                normals: o,
                triangles: _,
            },
            t,
            r
        )
    );
    function F(P, C) {
        var U = P[C + 1];
        (P[C + 1] = P[C + 2]), (P[C + 2] = -U);
    }
};
global.Texture = GL$1.Texture = function e(t, r, n, s) {
    if (
        ((n = n || {}),
        (s = s || global.gl),
        (this.gl = s),
        (this._context_id = s.context_id),
        (t = parseInt(t)),
        (r = parseInt(r)),
        GL$1.debug && console.log("GL.Texture created: ", t, r),
        (this.handler = s.createTexture()),
        (this.width = t),
        (this.height = r),
        n.depth && (this.depth = n.depth),
        (this.texture_type = n.texture_type || s.TEXTURE_2D),
        (this.format = n.format || e.DEFAULT_FORMAT),
        (this.internalFormat = n.internalFormat),
        (this.type = n.type || e.DEFAULT_TYPE),
        (this.magFilter = n.magFilter || n.filter || e.DEFAULT_MAG_FILTER),
        (this.minFilter = n.minFilter || n.filter || e.DEFAULT_MIN_FILTER),
        (this.wrapS = n.wrap || n.wrapS || e.DEFAULT_WRAP_S),
        (this.wrapT = n.wrap || n.wrapT || e.DEFAULT_WRAP_T),
        (this.data = null),
        e.MAX_TEXTURE_IMAGE_UNITS ||
            (e.MAX_TEXTURE_IMAGE_UNITS = s.getParameter(
                s.MAX_TEXTURE_IMAGE_UNITS
            )),
        (this.has_mipmaps = !1),
        this.format == s.DEPTH_COMPONENT &&
            s.webgl_version == 1 &&
            !s.extensions.WEBGL_depth_texture)
    )
        throw "Depth Texture not supported";
    if (
        this.type == s.FLOAT &&
        !s.extensions.OES_texture_float &&
        s.webgl_version == 1
    )
        throw "Float Texture not supported";
    if (this.type == s.HALF_FLOAT_OES) {
        if (!s.extensions.OES_texture_half_float && s.webgl_version == 1)
            throw "Half Float Texture extension not supported.";
        s.webgl_version > 1 &&
            (console.warn(
                "using HALF_FLOAT_OES in WebGL2 is deprecated, suing HALF_FLOAT instead"
            ),
            (this.type = this.format == s.RGB ? s.RGB16F : s.RGBA16F));
    }
    if (
        (!isPowerOfTwo(this.width) || !isPowerOfTwo(this.height)) && //non power of two
        ((this.minFilter != s.NEAREST && this.minFilter != s.LINEAR) || //uses mipmaps
            this.wrapS != s.CLAMP_TO_EDGE ||
            this.wrapT != s.CLAMP_TO_EDGE)
    )
        if (n.ignore_pot)
            (this.minFilter = this.magFilter = s.LINEAR),
                (this.wrapS = this.wrapT = s.CLAMP_TO_EDGE);
        else
            throw "Cannot use texture-wrap or mipmaps in Non-Power-of-Two textures";
    if (!t || !r) return;
    this.internalFormat || this.computeInternalFormat(),
        s.activeTexture(s.TEXTURE0 + e.MAX_TEXTURE_IMAGE_UNITS - 1),
        s.bindTexture(this.texture_type, this.handler),
        s.texParameteri(
            this.texture_type,
            s.TEXTURE_MAG_FILTER,
            this.magFilter
        ),
        s.texParameteri(
            this.texture_type,
            s.TEXTURE_MIN_FILTER,
            this.minFilter
        ),
        s.texParameteri(this.texture_type, s.TEXTURE_WRAP_S, this.wrapS),
        s.texParameteri(this.texture_type, s.TEXTURE_WRAP_T, this.wrapT),
        n.anisotropic &&
            s.extensions.EXT_texture_filter_anisotropic &&
            s.texParameterf(
                GL$1.TEXTURE_2D,
                s.extensions.EXT_texture_filter_anisotropic
                    .TEXTURE_MAX_ANISOTROPY_EXT,
                n.anisotropic
            );
    var a = this.type,
        o = n.pixel_data;
    if (o && !o.buffer) {
        if (this.texture_type == GL$1.TEXTURE_CUBE_MAP)
            if (o[0].constructor === Number)
                (o = c(o)), (o = [o, o, o, o, o, o]);
            else for (var l = 0; l < o.length; ++l) o[l] = c(o[l]);
        else o = c(o);
        this.data = o;
    }
    function c(f) {
        return f.constructor !== Array
            ? f
            : a == GL$1.FLOAT
            ? new Float32Array(f)
            : a == GL$1.HALF_FLOAT_OES
            ? new Uint16Array(f)
            : new Uint8Array(f);
    }
    if ((e.setUploadOptions(n), this.texture_type == GL$1.TEXTURE_2D))
        s.texImage2D(
            GL$1.TEXTURE_2D,
            0,
            this.internalFormat,
            t,
            r,
            0,
            this.format,
            this.type,
            o || null
        ),
            GL$1.isPowerOfTwo(t) &&
                GL$1.isPowerOfTwo(r) &&
                n.minFilter &&
                n.minFilter != s.NEAREST &&
                n.minFilter != s.LINEAR &&
                (s.generateMipmap(this.texture_type), (this.has_mipmaps = !0));
    else if (this.texture_type == GL$1.TEXTURE_CUBE_MAP)
        for (
            var u = t * t * (this.format == GL$1.RGBA ? 4 : 3), l = 0;
            l < 6;
            ++l
        ) {
            var h = o;
            h &&
                (h.constructor === Array
                    ? (h = h[l])
                    : h.subarray(u * l, u * (l + 1))),
                s.texImage2D(
                    s.TEXTURE_CUBE_MAP_POSITIVE_X + l,
                    0,
                    this.internalFormat,
                    this.width,
                    this.height,
                    0,
                    this.format,
                    this.type,
                    h || null
                );
        }
    else if (this.texture_type == GL$1.TEXTURE_3D) {
        if (this.gl.webgl_version == 1)
            throw "TEXTURE_3D not supported in WebGL 1. Enable WebGL 2 in the context by passing webgl2:true to the context";
        if (!n.depth) throw "3d texture depth must be set in the options.depth";
        s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
            s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL, !1),
            s.texImage3D(
                GL$1.TEXTURE_3D,
                0,
                this.internalFormat,
                t,
                r,
                n.depth,
                0,
                this.format,
                this.type,
                o || null
            );
    }
    s.bindTexture(this.texture_type, null), s.activeTexture(s.TEXTURE0);
};
GL$1.Texture.DEFAULT_TYPE = GL$1.UNSIGNED_BYTE;
GL$1.Texture.DEFAULT_FORMAT = GL$1.RGBA;
GL$1.Texture.DEFAULT_MAG_FILTER = GL$1.LINEAR;
GL$1.Texture.DEFAULT_MIN_FILTER = GL$1.LINEAR;
GL$1.Texture.DEFAULT_WRAP_S = GL$1.CLAMP_TO_EDGE;
GL$1.Texture.DEFAULT_WRAP_T = GL$1.CLAMP_TO_EDGE;
GL$1.Texture.EXTENSION = "png";
GL$1.Texture.framebuffer = null;
GL$1.Texture.renderbuffer = null;
GL$1.Texture.loading_color = new Uint8Array([0, 0, 0, 0]);
GL$1.Texture.use_renderbuffer_pool = !0;
GL$1.Texture.CROSS_ORIGIN_CREDENTIALS = "Anonymous";
GL$1.Texture.prototype.computeInternalFormat = function () {
    if (
        ((this.internalFormat = this.format),
        gl.webgl_version == 1
            ? this.type == GL$1.HALF_FLOAT &&
              (console.warn(
                  "webgl 1 does not use HALF_FLOAT, converting to HALF_FLOAT_OES"
              ),
              (this.type = GL$1.HALF_FLOAT_OES))
            : this.type == GL$1.HALF_FLOAT_OES &&
              (console.warn(
                  "webgl 2 does not use HALF_FLOAT_OES, converting to HALF_FLOAT"
              ),
              (this.type = GL$1.HALF_FLOAT)),
        this.format == GL$1.DEPTH_COMPONENT ||
            this.format === GL$1.DEPTH_STENCIL)
    ) {
        if (((this.minFilter = GL$1.NEAREST), gl.webgl_version == 2))
            if (
                this.type === GL$1.UNSIGNED_INT_24_8 &&
                this.format === GL$1.DEPTH_STENCIL
            )
                this.internalFormat = GL$1.DEPTH24_STENCIL8;
            else if (
                this.type === GL$1.FLOAT &&
                this.format === GL$1.DEPTH_STENCIL
            )
                this.internalFormat = gl.FLOAT_32_UNSIGNED_INT_24_8_REV;
            else if (this.type == GL$1.UNSIGNED_SHORT)
                this.internalFormat = GL$1.DEPTH_COMPONENT16;
            else if (this.type == GL$1.UNSIGNED_INT)
                this.internalFormat = GL$1.DEPTH_COMPONENT24;
            else if (this.type == GL$1.FLOAT)
                this.internalFormat = GL$1.DEPTH_COMPONENT32F;
            else throw "unsupported type for a depth texture";
        else if (gl.webgl_version == 1) {
            if (this.type == GL$1.FLOAT)
                throw "WebGL 1.0 does not support float depth textures";
            this.internalFormat = GL$1.DEPTH_COMPONENT;
        }
    } else if (this.format == gl.RGBA)
        gl.webgl_version == 2 &&
            (this.type == GL$1.FLOAT
                ? (this.internalFormat = GL$1.RGBA32F)
                : this.type == GL$1.HALF_FLOAT &&
                  (this.internalFormat = GL$1.RGBA16F));
    else if (this.format == gl.RGB && gl.webgl_version == 2) {
        if (this.type == GL$1.FLOAT) this.internalFormat = GL$1.RGB32F;
        else if (this.type == GL$1.HALF_FLOAT)
            throw "GL.RGB HALF_FLOAT is not supported, use RGBA instead";
    }
};
GL$1.Texture.prototype.delete = function () {
    gl.deleteTexture(this.handler), (this.handler = null);
};
GL$1.Texture.prototype.getProperties = function () {
    return {
        width: this.width,
        height: this.height,
        type: this.type,
        format: this.format,
        texture_type: this.texture_type,
        magFilter: this.magFilter,
        minFilter: this.minFilter,
        wrapS: this.wrapS,
        wrapT: this.wrapT,
    };
};
GL$1.Texture.prototype.hasSameProperties = function (e) {
    return e
        ? e.width == this.width &&
              e.height == this.height &&
              e.type == this.type &&
              e.format == this.format &&
              e.texture_type == this.texture_type
        : !1;
};
GL$1.Texture.prototype.hasSameSize = function (e) {
    return e ? e.width == this.width && e.height == this.height : !1;
};
GL$1.Texture.prototype.toJSON = function () {
    return "";
};
GL$1.Texture.isDepthSupported = function () {
    return gl.extensions.WEBGL_depth_texture != null;
};
GL$1.Texture.prototype.bind = function (e) {
    e == null && (e = 0);
    var t = this.gl;
    return (
        t.activeTexture(t.TEXTURE0 + e),
        t.bindTexture(this.texture_type, this.handler),
        e
    );
};
GL$1.Texture.prototype.unbind = function (e) {
    e === void 0 && (e = 0);
    var t = this.gl;
    t.activeTexture(t.TEXTURE0 + e), t.bindTexture(this.texture_type, null);
};
GL$1.Texture.prototype.setParameter = function (e, t) {
    switch ((this.bind(0), this.gl.texParameteri(this.texture_type, e, t), e)) {
        case this.gl.TEXTURE_MAG_FILTER:
            this.magFilter = t;
            break;
        case this.gl.TEXTURE_MIN_FILTER:
            this.minFilter = t;
            break;
        case this.gl.TEXTURE_WRAP_S:
            this.wrapS = t;
            break;
        case this.gl.TEXTURE_WRAP_T:
            this.wrapT = t;
            break;
    }
};
GL$1.Texture.setUploadOptions = function (e, t) {
    (t = t || global.gl),
        GL$1.Texture.disable_deprecated ||
            (e
                ? (t.pixelStorei(
                      t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
                      !!e.premultiply_alpha
                  ),
                  t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !e.no_flip))
                : (t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
                  t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL, !0))),
        t.pixelStorei(t.UNPACK_ALIGNMENT, 1);
};
GL$1.Texture.flipYData = function (e, t, r, n) {
    for (
        var s = new e.constructor(t * n),
            a = 0,
            o = t * (r - 1) * n,
            l = Math.floor(r * 0.5),
            c = 0;
        c < l;
        ++c
    ) {
        var u = e.subarray(a, a + t * n),
            h = e.subarray(o, o + t * n);
        if ((s.set(u), u.set(h), h.set(s), (a += t * n), (o -= t * n), a > o))
            break;
    }
};
GL$1.Texture.prototype.uploadImage = function (e, t) {
    this.bind();
    var r = this.gl;
    if (!e) throw "uploadImage parameter must be Image";
    GL$1.Texture.setUploadOptions(t, r);
    try {
        if (t && t.subimage)
            r.webgl_version == 1
                ? r.texSubImage2D(
                      r.TEXTURE_2D,
                      0,
                      0,
                      0,
                      this.format,
                      this.type,
                      e
                  )
                : r.texSubImage2D(
                      r.TEXTURE_2D,
                      0,
                      0,
                      0,
                      e.videoWidth || e.width,
                      e.videoHeight || e.height,
                      this.format,
                      this.type,
                      e
                  );
        else {
            var n = e.videoWidth || e.width,
                s = e.videoHeight || e.height;
            (n != this.width || s != this.height) &&
                this.width != 1 &&
                this.height != 1 &&
                console.warn(
                    "image uploaded has a different size than texture, resizing it."
                ),
                r.texImage2D(
                    r.TEXTURE_2D,
                    0,
                    this.format,
                    this.format,
                    this.type,
                    e
                ),
                (this.width = n),
                (this.height = s);
        }
        this.data = e;
    } catch (a) {
        throw (
            (console.error(a),
            location.protocol == "file:"
                ? 'image not loaded for security reasons (serve this page over "http://" instead)'
                : "image not loaded for security reasons (image must originate from the same domain as this page or use Cross-Origin Resource Sharing)")
        );
    }
    this.minFilter &&
        this.minFilter != r.NEAREST &&
        this.minFilter != r.LINEAR &&
        (r.generateMipmap(this.texture_type), (this.has_mipmaps = !0)),
        r.bindTexture(this.texture_type, null);
};
GL$1.Texture.prototype.uploadData = function (e, t, r) {
    if (((t = t || {}), !e)) throw "no data passed";
    var n = this.gl;
    this.bind(), GL$1.Texture.setUploadOptions(t, n);
    var s = t.mipmap_level || 0,
        a = this.width,
        o = this.height;
    (a = a >> s), (o = o >> s);
    var l = this.internalFormat || this.format;
    if (
        (this.type == GL$1.HALF_FLOAT_OES &&
            e.constructor === Float32Array &&
            console.warn(
                "cannot uploadData to a HALF_FLOAT texture from a Float32Array, must be Uint16Array. To upload it we recomment to create a FLOAT texture, upload data there and copy to your HALF_FLOAT."
            ),
        this.texture_type == GL$1.TEXTURE_2D)
    )
        n.webgl_version == 1
            ? e.buffer && e.buffer.constructor == ArrayBuffer
                ? n.texImage2D(
                      this.texture_type,
                      s,
                      l,
                      a,
                      o,
                      0,
                      this.format,
                      this.type,
                      e
                  )
                : n.texImage2D(
                      this.texture_type,
                      s,
                      l,
                      this.format,
                      this.type,
                      e
                  )
            : n.webgl_version == 2 &&
              (e.buffer && e.buffer.constructor == ArrayBuffer
                  ? n.texImage2D(
                        this.texture_type,
                        s,
                        l,
                        a,
                        o,
                        0,
                        this.format,
                        this.type,
                        e
                    )
                  : n.texImage2D(
                        this.texture_type,
                        s,
                        l,
                        a,
                        o,
                        0,
                        this.format,
                        this.type,
                        e
                    ));
    else if (this.texture_type == GL$1.TEXTURE_3D)
        n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
            n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL, !1),
            n.texImage3D(
                this.texture_type,
                s,
                l,
                a,
                o,
                this.depth >> s,
                0,
                this.format,
                this.type,
                e
            );
    else if (this.texture_type == GL$1.TEXTURE_CUBE_MAP)
        n.texImage2D(
            n.TEXTURE_CUBE_MAP_POSITIVE_X + (t.cubemap_face || 0),
            s,
            l,
            a,
            o,
            0,
            this.format,
            this.type,
            e
        );
    else throw "cannot uploadData for this texture type";
    (this.data = e),
        !r &&
            this.minFilter &&
            this.minFilter != n.NEAREST &&
            this.minFilter != n.LINEAR &&
            (n.generateMipmap(this.texture_type), (this.has_mipmaps = !0)),
        n.bindTexture(this.texture_type, null);
};
GL$1.Texture.cubemap_camera_parameters = [
    {
        type: "posX",
        dir: vec3.fromValues(1, 0, 0),
        up: vec3.fromValues(0, 1, 0),
        right: vec3.fromValues(0, 0, -1),
    },
    {
        type: "negX",
        dir: vec3.fromValues(-1, 0, 0),
        up: vec3.fromValues(0, 1, 0),
        right: vec3.fromValues(0, 0, 1),
    },
    {
        type: "posY",
        dir: vec3.fromValues(0, 1, 0),
        up: vec3.fromValues(0, 0, -1),
        right: vec3.fromValues(1, 0, 0),
    },
    {
        type: "negY",
        dir: vec3.fromValues(0, -1, 0),
        up: vec3.fromValues(0, 0, 1),
        right: vec3.fromValues(1, 0, 0),
    },
    {
        type: "posZ",
        dir: vec3.fromValues(0, 0, 1),
        up: vec3.fromValues(0, 1, 0),
        right: vec3.fromValues(1, 0, 0),
    },
    {
        type: "negZ",
        dir: vec3.fromValues(0, 0, -1),
        up: vec3.fromValues(0, 1, 0),
        right: vec3.fromValues(-1, 0, 0),
    },
];
GL$1.Texture.prototype.drawTo = function (e, t) {
    var r = this.gl,
        n = r.getViewport(),
        s = GL$1.getTime(),
        a = r.getParameter(r.FRAMEBUFFER_BINDING),
        o = (r._framebuffer = r._framebuffer || r.createFramebuffer());
    r.bindFramebuffer(r.FRAMEBUFFER, o);
    var l = null;
    if (GL$1.Texture.use_renderbuffer_pool) {
        r._renderbuffers_pool || (r._renderbuffers_pool = {});
        var c = this.width + ":" + this.height;
        r._renderbuffers_pool[c]
            ? ((l = r._renderbuffers_pool[c]),
              (l.time = s),
              r.bindRenderbuffer(r.RENDERBUFFER, l))
            : ((r._renderbuffers_pool[c] = l = r.createRenderbuffer()),
              (l.time = s),
              (l.width = this.width),
              (l.height = this.height),
              r.bindRenderbuffer(r.RENDERBUFFER, l),
              setTimeout(u.bind(l), 1e3 * 60));
    } else
        (l = r._renderbuffer = r._renderbuffer || r.createRenderbuffer()),
            (l.width = this.width),
            (l.height = this.height),
            r.bindRenderbuffer(r.RENDERBUFFER, l);
    this.format === r.DEPTH_COMPONENT
        ? r.renderbufferStorage(
              r.RENDERBUFFER,
              r.RGBA4,
              this.width,
              this.height
          )
        : r.renderbufferStorage(
              r.RENDERBUFFER,
              r.DEPTH_COMPONENT16,
              this.width,
              this.height
          );
    function u() {
        GL$1.getTime() - this.time >= 1e3 * 60
            ? (r.deleteRenderbuffer(r._renderbuffers_pool[c]),
              delete r._renderbuffers_pool[c])
            : setTimeout(u.bind(this), 1e3 * 60);
    }
    if (
        (r.viewport(0, 0, this.width, this.height),
        (r._current_texture_drawto = this),
        (r._current_fbo_color = o),
        (r._current_fbo_depth = l),
        this.texture_type == r.TEXTURE_2D)
    )
        this.format !== r.DEPTH_COMPONENT
            ? (r.framebufferTexture2D(
                  r.FRAMEBUFFER,
                  r.COLOR_ATTACHMENT0,
                  r.TEXTURE_2D,
                  this.handler,
                  0
              ),
              r.framebufferRenderbuffer(
                  r.FRAMEBUFFER,
                  r.DEPTH_ATTACHMENT,
                  r.RENDERBUFFER,
                  l
              ))
            : (r.framebufferRenderbuffer(
                  r.FRAMEBUFFER,
                  r.COLOR_ATTACHMENT0,
                  r.RENDERBUFFER,
                  l
              ),
              r.framebufferTexture2D(
                  r.FRAMEBUFFER,
                  r.DEPTH_ATTACHMENT,
                  r.TEXTURE_2D,
                  this.handler,
                  0
              )),
            e(this, t);
    else if (this.texture_type == r.TEXTURE_CUBE_MAP) {
        this.format !== r.DEPTH_COMPONENT
            ? r.framebufferRenderbuffer(
                  r.FRAMEBUFFER,
                  r.DEPTH_ATTACHMENT,
                  r.RENDERBUFFER,
                  l
              )
            : r.framebufferRenderbuffer(
                  r.FRAMEBUFFER,
                  r.COLOR_ATTACHMENT0,
                  r.RENDERBUFFER,
                  l
              );
        for (var h = 0; h < 6; h++)
            this.format !== r.DEPTH_COMPONENT
                ? r.framebufferTexture2D(
                      r.FRAMEBUFFER,
                      r.COLOR_ATTACHMENT0,
                      r.TEXTURE_CUBE_MAP_POSITIVE_X + h,
                      this.handler,
                      0
                  )
                : r.framebufferTexture2D(
                      r.FRAMEBUFFER,
                      r.DEPTH_ATTACHMENT,
                      r.TEXTURE_CUBE_MAP_POSITIVE_X + h,
                      this.handler,
                      0
                  ),
                e(this, h, t);
    }
    return (
        (this.data = null),
        (r._current_texture_drawto = null),
        (r._current_fbo_color = null),
        (r._current_fbo_depth = null),
        r.bindFramebuffer(r.FRAMEBUFFER, a),
        r.bindRenderbuffer(r.RENDERBUFFER, null),
        r.viewport(n[0], n[1], n[2], n[3]),
        this
    );
};
GL$1.Texture.prototype.copyTo = function (e, t, r) {
    var n = this.gl;
    if (!e) throw "target_texture required";
    var s = n.getParameter(n.FRAMEBUFFER_BINDING),
        a = n.getViewport();
    t ||
        (t =
            this.texture_type == n.TEXTURE_2D
                ? GL$1.Shader.getScreenShader()
                : GL$1.Shader.getCubemapCopyShader()),
        n.disable(n.BLEND),
        n.disable(n.DEPTH_TEST),
        t && r && t.uniforms(r);
    var o = n.__copy_fbo;
    if (
        (o || (o = n.__copy_fbo = n.createFramebuffer()),
        n.bindFramebuffer(n.FRAMEBUFFER, o),
        n.viewport(0, 0, e.width, e.height),
        this.texture_type == n.TEXTURE_2D)
    )
        if (
            this.format !== n.DEPTH_COMPONENT &&
            this.format !== n.DEPTH_STENCIL
        )
            n.framebufferTexture2D(
                n.FRAMEBUFFER,
                n.COLOR_ATTACHMENT0,
                n.TEXTURE_2D,
                e.handler,
                0
            ),
                this.toViewport(t);
        else {
            var l = (n._color_renderbuffer =
                    n._color_renderbuffer || n.createRenderbuffer()),
                c = (l.width = e.width),
                u = (l.height = e.height);
            n.bindRenderbuffer(n.RENDERBUFFER, l),
                n.renderbufferStorage(n.RENDERBUFFER, n.RGBA4, c, u),
                n.framebufferRenderbuffer(
                    n.FRAMEBUFFER,
                    n.COLOR_ATTACHMENT0,
                    n.RENDERBUFFER,
                    l
                );
            var h =
                e.format == n.DEPTH_STENCIL
                    ? n.DEPTH_STENCIL_ATTACHMENT
                    : n.DEPTH_ATTACHMENT;
            n.framebufferTexture2D(
                n.FRAMEBUFFER,
                h,
                n.TEXTURE_2D,
                e.handler,
                0
            );
            var f = n.checkFramebufferStatus(n.FRAMEBUFFER);
            if (f !== n.FRAMEBUFFER_COMPLETE) throw "FBO not complete: " + f;
            n.enable(n.DEPTH_TEST),
                n.depthFunc(n.ALWAYS),
                n.colorMask(!1, !1, !1, !1),
                (t = GL$1.Shader.getCopyDepthShader()),
                this.toViewport(t),
                n.colorMask(!0, !0, !0, !0),
                n.disable(n.DEPTH_TEST),
                n.depthFunc(n.LEQUAL),
                n.framebufferRenderbuffer(
                    n.FRAMEBUFFER,
                    n.COLOR_ATTACHMENT0,
                    n.RENDERBUFFER,
                    null
                ),
                n.framebufferTexture2D(n.FRAMEBUFFER, h, n.TEXTURE_2D, null, 0);
        }
    else if (this.texture_type == n.TEXTURE_CUBE_MAP) {
        t.uniforms({ u_texture: 0 });
        for (var d = GL$1.temp_mat3, p = 0; p < 6; p++) {
            n.framebufferTexture2D(
                n.FRAMEBUFFER,
                n.COLOR_ATTACHMENT0,
                n.TEXTURE_CUBE_MAP_POSITIVE_X + p,
                e.handler,
                0
            );
            var _ = GL$1.Texture.cubemap_camera_parameters[p];
            mat3.identity(d),
                d.set(_.right, 0),
                d.set(_.up, 3),
                d.set(_.dir, 6),
                this.toViewport(t, { u_rotation: d });
        }
    }
    return (
        n.setViewport(a),
        n.bindFramebuffer(n.FRAMEBUFFER, s),
        e.minFilter &&
            e.minFilter != n.NEAREST &&
            e.minFilter != n.LINEAR &&
            (e.bind(), n.generateMipmap(e.texture_type), (e.has_mipmaps = !0)),
        (e.data = null),
        n.bindTexture(e.texture_type, null),
        this
    );
};
GL$1.Texture.prototype.blit = (function () {
    var e = new Float32Array(4);
    return function (t, r, n) {
        var s = this.gl;
        if (
            this.texture_type != s.TEXTURE_2D ||
            this.format === s.DEPTH_COMPONENT ||
            this.format === s.DEPTH_STENCIL
        )
            throw "blit only support TEXTURE_2D of RGB or RGBA. use copyTo instead";
        var a = s.getParameter(s.FRAMEBUFFER_BINDING);
        e.set(s.viewport_data),
            (r = r || GL$1.Shader.getScreenShader()),
            r && n && r.uniforms(n);
        var o = s.__copy_fbo;
        return (
            o || (o = s.__copy_fbo = s.createFramebuffer()),
            s.bindFramebuffer(s.FRAMEBUFFER, o),
            s.viewport(0, 0, t.width, t.height),
            s.framebufferTexture2D(
                s.FRAMEBUFFER,
                s.COLOR_ATTACHMENT0,
                s.TEXTURE_2D,
                t.handler,
                0
            ),
            this.bind(0),
            r.draw(GL$1.Mesh.getScreenQuad(), s.TRIANGLES),
            s.setViewport(e),
            s.bindFramebuffer(s.FRAMEBUFFER, a),
            (t.data = null),
            s.bindTexture(t.texture_type, null),
            this
        );
    };
})();
GL$1.Texture.prototype.toViewport = function (e, t) {
    e = e || Shader.getScreenShader();
    var r = Mesh.getScreenQuad();
    this.bind(0), t && e.uniforms(t), e.draw(r, gl.TRIANGLES);
};
GL$1.Texture.prototype.fill = function (e, t) {
    if (e.constructor === GL$1.Shader) {
        var r = e;
        this.drawTo(function () {
            r.toViewport();
        });
    } else {
        var n = e,
            s = gl.getParameter(gl.COLOR_CLEAR_VALUE);
        gl.clearColor(n[0], n[1], n[2], n[3]),
            this.drawTo(function () {
                gl.clear(gl.COLOR_BUFFER_BIT);
            }),
            gl.clearColor(s[0], s[1], s[2], s[3]);
    }
    !t &&
        this.minFilter &&
        this.minFilter != gl.NEAREST &&
        this.minFilter != gl.LINEAR &&
        (this.bind(),
        gl.generateMipmap(this.texture_type),
        (this.has_mipmaps = !0));
};
GL$1.Texture.prototype.renderQuad = (function () {
    var e = mat3.create(),
        t = vec2.create(),
        r = vec2.create(),
        n = vec4.fromValues(1, 1, 1, 1);
    return function (s, a, o, l, c, u) {
        (t[0] = s),
            (t[1] = a),
            (r[0] = o),
            (r[1] = l),
            (c = c || Shader.getQuadShader(this.gl));
        var h = Mesh.getScreenQuad(this.gl);
        this.bind(0),
            c.uniforms({
                u_texture: 0,
                u_position: t,
                u_color: n,
                u_size: r,
                u_viewport: gl.viewport_data.subarray(2, 4),
                u_transform: e,
            }),
            u && c.uniforms(u),
            c.draw(h, gl.TRIANGLES);
    };
})();
GL$1.Texture.prototype.applyBlur = function (e, t, r, n, s) {
    var a = this.gl;
    e === void 0 && (e = 1),
        t === void 0 && (t = 1),
        a.disable(a.DEPTH_TEST),
        a.disable(a.BLEND),
        (n = n || this);
    var o = !s;
    if (s === n)
        throw "cannot use applyBlur in a texture using as temporary itself";
    if (n && this.texture_type !== n.texture_type)
        throw "cannot use applyBlur with textures of different texture_type";
    var l = a.getParameter(a.FRAMEBUFFER_BINDING),
        c = a.getViewport(),
        u = a.__copy_fbo;
    if (
        (u || (u = a.__copy_fbo = a.createFramebuffer()),
        a.bindFramebuffer(a.FRAMEBUFFER, u),
        a.viewport(0, 0, this.width, this.height),
        this.texture_type === a.TEXTURE_2D)
    ) {
        var h = GL$1.Shader.getBlurShader();
        s || (s = GL$1.Texture.getTemporary(this.width, this.height, this)),
            a.framebufferTexture2D(
                a.FRAMEBUFFER,
                a.COLOR_ATTACHMENT0,
                a.TEXTURE_2D,
                s.handler,
                0
            ),
            this.toViewport(h, {
                u_texture: 0,
                u_intensity: r,
                u_offset: [0, t / this.height],
            }),
            a.framebufferTexture2D(
                a.FRAMEBUFFER,
                a.COLOR_ATTACHMENT0,
                a.TEXTURE_2D,
                n.handler,
                0
            ),
            a.viewport(0, 0, n.width, n.height),
            s.toViewport(h, {
                u_intensity: r,
                u_offset: [e / s.width, 0],
            }),
            o && GL$1.Texture.releaseTemporary(s);
    } else if (this.texture_type === a.TEXTURE_CUBE_MAP) {
        var h = GL$1.Shader.getCubemapBlurShader();
        h.uniforms({
            u_texture: 0,
            u_intensity: r,
            u_offset: [e / this.width, t / this.height],
        }),
            this.bind(0);
        var f = Mesh.getScreenQuad();
        f.bindBuffers(h), h.bind();
        var d = null;
        !s && n == this
            ? (d = s = GL$1.Texture.getTemporary(n.width, n.height, n))
            : (d = n);
        for (var p = GL$1.temp_mat3, _ = 0; _ < 6; ++_) {
            a.framebufferTexture2D(
                a.FRAMEBUFFER,
                a.COLOR_ATTACHMENT0,
                a.TEXTURE_CUBE_MAP_POSITIVE_X + _,
                d.handler,
                0
            );
            var E = GL$1.Texture.cubemap_camera_parameters[_];
            mat3.identity(p),
                p.set(E.right, 0),
                p.set(E.up, 3),
                p.set(E.dir, 6),
                h._setUniform("u_rotation", p),
                a.drawArrays(a.TRIANGLES, 0, 6);
        }
        f.unbindBuffers(h),
            s && s.copyTo(n),
            s && o && GL$1.Texture.releaseTemporary(s);
    }
    a.setViewport(c),
        a.bindFramebuffer(a.FRAMEBUFFER, l),
        (n.data = null),
        n.minFilter &&
            n.minFilter != a.NEAREST &&
            n.minFilter != a.LINEAR &&
            (n.bind(), a.generateMipmap(n.texture_type), (n.has_mipmaps = !0)),
        a.bindTexture(n.texture_type, null);
};
GL$1.Texture.fromURL = function (e, t, r, n) {
    (n = n || global.gl), (t = t || {}), (t = Object.create(t));
    var s = t.texture || new GL$1.Texture(1, 1, t, n);
    e.length < 64 && (s.url = e), s.bind();
    var a = t.temp_color || GL$1.Texture.loading_color;
    n.pixelStorei(n.UNPACK_ALIGNMENT, 4);
    var o = t.type == n.FLOAT ? new Float32Array(a) : new Uint8Array(a);
    n.texImage2D(
        n.TEXTURE_2D,
        0,
        s.format,
        s.width,
        s.height,
        0,
        s.format,
        s.type,
        o
    ),
        n.bindTexture(s.texture_type, null),
        (s.ready = !1);
    var l = null;
    if ((t.extension && (l = t.extension), !l && e.length < 512)) {
        var c = e,
            u = e.indexOf("?");
        u != -1 && (c = e.substr(0, u)),
            (u = c.lastIndexOf(".")),
            u != -1 && (l = c.substr(u + 1).toLowerCase());
    }
    if (l == "dds") {
        var l =
                n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc") ||
                n.getExtension("WEBGL_compressed_texture_s3tc"),
            h = new GL$1.Texture(0, 0, t, n);
        DDS.loadDDSTextureEx(n, l, e, h.handler, !0, function (p) {
            (s.texture_type = p.texture_type),
                (s.handler = p),
                delete s.ready,
                r && r(s, e);
        });
    } else if (l == "tga")
        global.HttpRequest(
            e,
            null,
            function (d) {
                var p = GL$1.Texture.parseTGA(d);
                p &&
                    ((t.texture = s),
                    p.flipY && (t.no_flip = !0),
                    p.format == "RGB" && (s.format = n.RGB),
                    (s = GL$1.Texture.fromMemory(
                        p.width,
                        p.height,
                        p.pixels,
                        t
                    )),
                    delete s.ready,
                    r && r(s, e));
            },
            null,
            { binary: !0 }
        );
    else {
        var f = new Image();
        (f.src = e),
            (f.crossOrigin = GL$1.Texture.CROSS_ORIGIN_CREDENTIALS),
            (f.onload = function () {
                (t.texture = s),
                    GL$1.Texture.fromImage(this, t),
                    delete s.ready,
                    r && r(s, e);
            }),
            (f.onerror = function () {
                r && r(null);
            });
    }
    return s;
};
GL$1.Texture.parseTGA = function (e) {
    if (!e || e.constructor !== ArrayBuffer)
        throw "TGA: data must be ArrayBuffer";
    e = new Uint8Array(e);
    for (
        var t = new Uint8Array([0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0]),
            r = e.subarray(0, 12),
            n = 0;
        n < r.length;
        n++
    )
        if (t[n] != r[n]) return console.error("TGA header is not valid"), null;
    var s = e.subarray(12, 18),
        a = {};
    (a.width = s[1] * 256 + s[0]),
        (a.height = s[3] * 256 + s[2]),
        (a.bpp = s[4]),
        (a.bytesPerPixel = a.bpp / 8),
        (a.imageSize = a.width * a.height * a.bytesPerPixel),
        (a.pixels = e.subarray(18, 18 + a.imageSize)),
        (a.pixels = new Uint8Array(a.pixels)),
        (a.flipY = (s[5] & 32) == 0);
    for (var n = 0; n < a.imageSize; n += a.bytesPerPixel) {
        var o = a.pixels[n];
        (a.pixels[n] = a.pixels[n + 2]), (a.pixels[n + 2] = o);
    }
    return (a.format = a.bpp == 32 ? "RGBA" : "RGB"), a;
};
GL$1.Texture.fromImage = function (e, t) {
    t = t || {};
    var r = t.texture || new GL$1.Texture(e.width, e.height, t);
    return (
        r.uploadImage(e, t),
        r.bind(),
        gl.texParameteri(
            r.texture_type,
            gl.TEXTURE_MAG_FILTER,
            r.magFilter || GL$1.Texture.DEFAULT_MAG_FILTER
        ),
        gl.texParameteri(
            r.texture_type,
            gl.TEXTURE_MIN_FILTER,
            r.minFilter || GL$1.Texture.DEFAULT_MIN_FILTER
        ),
        gl.texParameteri(
            r.texture_type,
            gl.TEXTURE_WRAP_S,
            r.wrapS || GL$1.Texture.DEFAULT_WRAP_S
        ),
        gl.texParameteri(
            r.texture_type,
            gl.TEXTURE_WRAP_T,
            r.wrapT || GL$1.Texture.DEFAULT_WRAP_T
        ),
        (GL$1.isPowerOfTwo(r.width) && GL$1.isPowerOfTwo(r.height)) ||
        gl.webgl_version > 1
            ? t.minFilter &&
              t.minFilter != gl.NEAREST &&
              t.minFilter != gl.LINEAR &&
              (r.bind(),
              gl.generateMipmap(r.texture_type),
              (r.has_mipmaps = !0))
            : (gl.texParameteri(
                  r.texture_type,
                  gl.TEXTURE_MIN_FILTER,
                  GL$1.LINEAR
              ),
              gl.texParameteri(
                  r.texture_type,
                  gl.TEXTURE_WRAP_S,
                  GL$1.CLAMP_TO_EDGE
              ),
              gl.texParameteri(
                  r.texture_type,
                  gl.TEXTURE_WRAP_T,
                  GL$1.CLAMP_TO_EDGE
              ),
              (r.has_mipmaps = !1)),
        gl.bindTexture(r.texture_type, null),
        (r.data = e),
        t.keep_image && (r.img = e),
        r
    );
};
GL$1.Texture.fromVideo = function (e, t) {
    t = t || {};
    var r = t.texture || new GL$1.Texture(e.videoWidth, e.videoHeight, t);
    return (
        r.bind(),
        r.uploadImage(e, t),
        t.minFilter &&
            t.minFilter != gl.NEAREST &&
            t.minFilter != gl.LINEAR &&
            (r.bind(),
            gl.generateMipmap(r.texture_type),
            (r.has_mipmaps = !0),
            (r.data = e)),
        gl.bindTexture(r.texture_type, null),
        r
    );
};
GL$1.Texture.fromTexture = function (e, t) {
    t = t || {};
    var r = new GL$1.Texture(e.width, e.height, t);
    return e.copyTo(r), r;
};
GL$1.Texture.prototype.clone = function (e) {
    var t = this.getProperties();
    if (e) for (var r in e) t[r] = e[r];
    return GL$1.Texture.fromTexture(this, t);
};
GL$1.Texture.fromMemory = function (e, t, r, n) {
    n = n || {};
    var s = n.texture || new GL$1.Texture(e, t, n);
    return (
        GL$1.Texture.setUploadOptions(n),
        s.bind(),
        r.constructor === Array &&
            (n.type == gl.FLOAT
                ? (r = new Float32Array(r))
                : n.type == GL$1.HALF_FLOAT || n.type == GL$1.HALF_FLOAT_OES
                ? (r = new Uint16Array(r))
                : (r = new Uint8Array(r))),
        gl.texImage2D(gl.TEXTURE_2D, 0, s.format, e, t, 0, s.format, s.type, r),
        (s.width = e),
        (s.height = t),
        (s.data = r),
        n.minFilter &&
            n.minFilter != gl.NEAREST &&
            n.minFilter != gl.LINEAR &&
            (gl.generateMipmap(gl.TEXTURE_2D), (s.has_mipmaps = !0)),
        gl.bindTexture(s.texture_type, null),
        s
    );
};
GL$1.Texture.fromDDSInMemory = function (e, t) {
    t = t || {};
    var r = t.texture || new GL$1.Texture(0, 0, t);
    GL$1.Texture.setUploadOptions(t), r.bind();
    var n =
        gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc") ||
        gl.getExtension("WEBGL_compressed_texture_s3tc");
    return (
        DDS.loadDDSTextureFromMemoryEx(gl, n, e, r, !0),
        gl.bindTexture(r.texture_type, null),
        r
    );
};
GL$1.Texture.fromShader = function (e, t, r, n) {
    n = n || {};
    var s = new GL$1.Texture(e, t, n);
    return (
        s.drawTo(function () {
            gl.disable(gl.BLEND),
                gl.disable(gl.DEPTH_TEST),
                gl.disable(gl.CULL_FACE);
            var a = Mesh.getScreenQuad();
            r.draw(a);
        }),
        s
    );
};
GL$1.Texture.cubemapFromImages = function (e, t) {
    if (((t = t || {}), e.length != 6))
        throw "missing images to create cubemap";
    var r = e[0].width,
        n = e[0].height;
    t.texture_type = gl.TEXTURE_CUBE_MAP;
    var s = null;
    t.texture
        ? ((s = t.texture), (s.width = r), (s.height = n))
        : (s = new GL$1.Texture(r, n, t)),
        GL$1.Texture.setUploadOptions(t),
        s.bind();
    try {
        for (var a = 0; a < 6; a++)
            gl.texImage2D(
                gl.TEXTURE_CUBE_MAP_POSITIVE_X + a,
                0,
                s.format,
                s.format,
                s.type,
                e[a]
            );
        s.data = e;
    } catch {
        throw location.protocol == "file:"
            ? 'image not loaded for security reasons (serve this page over "http://" instead)'
            : "image not loaded for security reasons (image must originate from the same domain as this page or use Cross-Origin Resource Sharing)";
    }
    return (
        t.minFilter &&
            t.minFilter != gl.NEAREST &&
            t.minFilter != gl.LINEAR &&
            (gl.generateMipmap(gl.TEXTURE_CUBE_MAP), (s.has_mipmaps = !0)),
        s.unbind(),
        s
    );
};
GL$1.Texture.cubemapFromImage = function (e, t) {
    if (
        ((t = t || {}),
        e.width != e.height / 6 && e.height % 6 != 0 && !t.faces && !t.is_polar)
    )
        return (
            console.error(
                "Cubemap image not valid, only 1x6 (vertical) or 6x3 (cross) formats. Check size:",
                e.width,
                e.height
            ),
            null
        );
    var r = e.width,
        n = e.height;
    if (t.is_polar) {
        var f = t.size || GL$1.nearestPowerOfTwo(e.height),
            s = GL$1.Texture.fromImage(e, {
                ignore_pot: !0,
                wrap: gl.REPEAT,
                filter: gl.LINEAR,
            }),
            a = new GL$1.Texture(f, f, {
                texture_type: gl.TEXTURE_CUBE_MAP,
                format: gl.RGBA,
            });
        if (t.texture) {
            var o = t.texture;
            for (var l in a) o[l] = a[l];
            a = o;
        }
        var c = mat3.create(),
            u = { u_texture: 0, u_rotation: c };
        gl.disable(gl.DEPTH_TEST), gl.disable(gl.BLEND);
        var h = GL$1.Shader.getPolarToCubemapShader();
        return (
            a.drawTo(function (b, L) {
                var T = GL$1.Texture.cubemap_camera_parameters[L];
                mat3.identity(c),
                    c.set(T.right, 0),
                    c.set(T.up, 3),
                    c.set(T.dir, 6),
                    s.toViewport(h, u);
            }),
            t.keep_image && (a.img = e),
            a
        );
    } else
        t.is_cross !== void 0
            ? ((t.faces = GL$1.Texture.generateCubemapCrossFacesInfo(
                  e.width,
                  t.is_cross
              )),
              (r = n = e.width / 4))
            : t.faces
            ? ((r = t.width || t.faces[0].width),
              (n = t.height || t.faces[0].height))
            : (n /= 6);
    if (r != n)
        return (
            console.log(
                "Texture not valid, width and height for every face must be square"
            ),
            null
        );
    var f = r;
    t.no_flip = !0;
    for (var d = [], l = 0; l < 6; l++) {
        var p = createCanvas(f, f),
            _ = p.getContext("2d");
        t.faces
            ? _.drawImage(
                  e,
                  t.faces[l].x,
                  t.faces[l].y,
                  t.faces[l].width || f,
                  t.faces[l].height || f,
                  0,
                  0,
                  f,
                  f
              )
            : _.drawImage(e, 0, n * l, r, n, 0, 0, f, f),
            d.push(p);
    }
    var E = GL$1.Texture.cubemapFromImages(d, t);
    return t.keep_image && (E.img = e), E;
};
GL$1.Texture.generateCubemapCrossFacesInfo = function (e, t) {
    t === void 0 && (t = 1);
    var r = e / 4;
    return [
        { x: 2 * r, y: r, width: r, height: r },
        //+x
        { x: 0, y: r, width: r, height: r },
        //-x
        { x: t * r, y: 0, width: r, height: r },
        //+y
        { x: t * r, y: 2 * r, width: r, height: r },
        //-y
        { x: r, y: r, width: r, height: r },
        //+z
        { x: 3 * r, y: r, width: r, height: r },
        //-z
    ];
};
GL$1.Texture.cubemapFromURL = function (e, t, r) {
    (t = t || {}),
        (t = Object.create(t)),
        (t.texture_type = gl.TEXTURE_CUBE_MAP);
    var n = t.texture || new GL$1.Texture(1, 1, t);
    n.bind(), GL$1.Texture.setUploadOptions(t);
    for (
        var s = t.temp_color || [0, 0, 0, 255],
            a = t.type == gl.FLOAT ? new Float32Array(s) : new Uint8Array(s),
            o = 0;
        o < 6;
        o++
    )
        gl.texImage2D(
            gl.TEXTURE_CUBE_MAP_POSITIVE_X + o,
            0,
            n.format,
            1,
            1,
            0,
            n.format,
            n.type,
            a
        );
    gl.bindTexture(n.texture_type, null), (n.ready = !1);
    var l = new Image();
    return (
        (l.src = e),
        (l.onload = function () {
            (t.texture = n),
                (n = GL$1.Texture.cubemapFromImage(this, t)),
                n && delete n.ready,
                r && r(n);
        }),
        n
    );
};
GL$1.Texture.prototype.getPixels = function (e, t) {
    t = t || 0;
    var r = this.gl,
        n = r.getViewport(),
        s = r.getParameter(r.FRAMEBUFFER_BINDING);
    if (this.format == r.DEPTH_COMPONENT)
        throw "cannot use getPixels in depth textures";
    r.disable(r.DEPTH_TEST);
    var a = r.__copy_fbo;
    a || (a = r.__copy_fbo = r.createFramebuffer()),
        r.bindFramebuffer(r.FRAMEBUFFER, a);
    var o = null,
        l = this.width >> t,
        c = this.height >> t;
    r.viewport(0, 0, l, c),
        this.texture_type == r.TEXTURE_2D
            ? r.framebufferTexture2D(
                  r.FRAMEBUFFER,
                  r.COLOR_ATTACHMENT0,
                  r.TEXTURE_2D,
                  this.handler,
                  t
              )
            : this.texture_type == r.TEXTURE_CUBE_MAP &&
              r.framebufferTexture2D(
                  r.FRAMEBUFFER,
                  r.COLOR_ATTACHMENT0,
                  r.TEXTURE_CUBE_MAP_POSITIVE_X + (e || 0),
                  this.handler,
                  t
              );
    var u = this.format == r.RGB ? 3 : 4;
    u = 4;
    var h = this.type;
    return (
        h == r.UNSIGNED_BYTE
            ? (o = new Uint8Array(l * c * u))
            : h == GL$1.HALF_FLOAT || h == GL$1.HALF_FLOAT_OES
            ? (o = new Uint16Array(l * c * u))
            : (o = new Float32Array(l * c * u)),
        r.readPixels(0, 0, l, c, u == 3 ? r.RGB : r.RGBA, h, o),
        r.bindFramebuffer(r.FRAMEBUFFER, s),
        r.viewport(n[0], n[1], n[2], n[3]),
        o
    );
};
GL$1.Texture.prototype.setPixels = function (e, t, r, n) {
    var s = { no_flip: t };
    n && (s.cubemap_face = n), this.uploadData(e, s, r);
};
GL$1.Texture.prototype.getCubemapPixels = function () {
    if (this.texture_type !== gl.TEXTURE_CUBE_MAP)
        throw "this texture is not a cubemap";
    return [
        this.getPixels(0),
        this.getPixels(1),
        this.getPixels(2),
        this.getPixels(3),
        this.getPixels(4),
        this.getPixels(5),
    ];
};
GL$1.Texture.prototype.setCubemapPixels = function (e, t) {
    if (this.texture_type !== gl.TEXTURE_CUBE_MAP)
        throw "this texture is not a cubemap, it should be created with { texture_type: gl.TEXTURE_CUBE_MAP }";
    for (var r = 0; r < 6; ++r) this.setPixels(e[r], t, r != 5, r);
};
GL$1.Texture.prototype.toCanvas = function (e, t, r) {
    r = r || 8192;
    var n = this.gl,
        s = Math.min(this.width, r),
        a = Math.min(this.height, r);
    this.texture_type == n.TEXTURE_CUBE_MAP && ((s = s * 4), (a = a * 3)),
        (e = e || createCanvas(s, a)),
        e.width != s && (e.width = s),
        e.height != a && (e.height = a);
    var o = null;
    if (this.texture_type == n.TEXTURE_2D) {
        if (
            this.width != s ||
            this.height != a ||
            this.type != n.UNSIGNED_BYTE
        ) {
            var l = new GL$1.Texture(s, a, {
                format: n.RGBA,
                filter: n.NEAREST,
            });
            this.copyTo(l), (o = l.getPixels());
        } else o = this.getPixels();
        var c = e.getContext("2d"),
            u = c.getImageData(0, 0, s, a);
        if ((u.data.set(o), c.putImageData(u, 0, 0), t)) {
            var l = createCanvas(s, a),
                h = l.getContext("2d");
            h.translate(0, l.height),
                h.scale(1, -1),
                h.drawImage(e, 0, 0, l.width, l.height),
                c.clearRect(0, 0, c.canvas.width, c.canvas.height),
                c.drawImage(l, 0, 0);
        }
    } else if (this.texture_type == n.TEXTURE_CUBE_MAP) {
        var f = createCanvas(this.width, this.height),
            h = f.getContext("2d"),
            d = GL$1.Texture.generateCubemapCrossFacesInfo(e.width, 1),
            c = e.getContext("2d");
        (c.fillStyle = "black"), c.fillRect(0, 0, e.width, e.height);
        var p = this;
        this.type != n.UNSIGNED_BYTE &&
            ((p = new GL$1.Texture(this.width, this.height, {
                format: n.RGBA,
                texture_type: n.TEXTURE_CUBE_MAP,
                filter: n.NEAREST,
                type: n.UNSIGNED_BYTE,
            })),
            this.copyTo(p));
        for (var _ = 0; _ < 6; _++) {
            var u = h.getImageData(0, 0, f.width, f.height);
            (o = p.getPixels(_)),
                u.data.set(o),
                h.putImageData(u, 0, 0),
                c.drawImage(f, d[_].x, d[_].y, f.width, f.height);
        }
    }
    return e;
};
GL$1.Texture.binary_extension = "png";
GL$1.Texture.prototype.toBinary = function (e, t) {
    for (
        var r = this.toCanvas(null, e),
            n = r.toDataURL(t),
            s = n.indexOf(","),
            a = n.substr(s + 1),
            o = atob(a),
            l = o.length,
            c = new Uint8Array(l),
            u = 0;
        u < l;
        ++u
    )
        c[u] = o.charCodeAt(u);
    return c;
};
GL$1.Texture.prototype.toBlob = function (e, t) {
    var r = this.toBinary(e),
        n = new Blob([r], { type: t || "image/png" });
    return n;
};
GL$1.Texture.prototype.toBlobAsync = function (e, t, r) {
    var n = this.toCanvas(null, e);
    if (n.toBlob) {
        n.toBlob(r, t);
        return;
    }
    var s = this.toBlob(e, t);
    r && r(s);
};
GL$1.Texture.prototype.toBase64 = function (e) {
    var t = this.width,
        r = this.height,
        n = this.getPixels(),
        s = createCanvas(t, r),
        a = s.getContext("2d"),
        o = a.getImageData(0, 0, t, r);
    if ((o.data.set(n), a.putImageData(o, 0, 0), e)) {
        var l = createCanvas(t, r),
            c = l.getContext("2d");
        c.translate(0, r), c.scale(1, -1), c.drawImage(s, 0, 0), (s = l);
    }
    var u = s.toDataURL("image/png");
    return u;
};
GL$1.Texture.prototype.generateMetadata = function () {
    var e = {};
    (e.width = this.width), (e.height = this.height), (this.metadata = e);
};
GL$1.Texture.compareFormats = function (e, t) {
    return !e || !t
        ? !1
        : e == t
        ? !0
        : !(
              e.width != t.width ||
              e.height != t.height ||
              e.type != t.type || //gl.UNSIGNED_BYTE
              e.format != t.format || //gl.RGB
              e.texture_type != t.texture_type
          );
};
GL$1.Texture.blend = function (e, t, r, n) {
    if (!e || !t) return !1;
    if (e == t) return n ? e.copyTo(n) : e.toViewport(), !0;
    gl.disable(gl.BLEND), gl.disable(gl.DEPTH_TEST), gl.disable(gl.CULL_FACE);
    var s = GL$1.Shader.getBlendShader(),
        a = GL$1.Mesh.getScreenQuad();
    return (
        t.bind(1),
        s.uniforms({ u_texture: 0, u_texture2: 1, u_factor: r }),
        n
            ? (n.drawTo(function () {
                  if (e == n || t == n)
                      throw "Blend output cannot be the same as the input";
                  e.bind(0), s.draw(a, gl.TRIANGLES);
              }),
              !0)
            : (e.bind(0), s.draw(a, gl.TRIANGLES), !0)
    );
};
GL$1.Texture.cubemapToTexture2D = function (e, t, r, n, s) {
    if (!e || e.texture_type != gl.TEXTURE_CUBE_MAP)
        throw "No cubemap in convert";
    t = t || e.width;
    var a = n ? e.type : gl.UNSIGNED_BYTE;
    (s = s || 0),
        r ||
            (r = new GL$1.Texture(t * 2, t, {
                minFilter: gl.NEAREST,
                type: a,
            }));
    var o = gl.shaders.cubemap_to_texture2D;
    return (
        o ||
            (o = gl.shaders.cubemap_to_texture2D =
                new GL$1.Shader(
                    GL$1.Shader.SCREEN_VERTEX_SHADER,
                    `		precision mediump float;
		#define PI 3.14159265358979323846264
		uniform samplerCube texture;		varying vec2 v_coord;		uniform float u_yaw;
		void main() {			float alpha = ((1.0 - v_coord.x) * 2.0) * PI + u_yaw;			float beta = (v_coord.y * 2.0 - 1.0) * PI * 0.5;			vec3 N = vec3( -cos(alpha) * cos(beta), sin(beta), sin(alpha) * cos(beta) );			gl_FragColor = textureCube(texture,N);		}`
                )),
        o.setUniform("u_yaw", s),
        r.drawTo(function () {
            gl.disable(gl.DEPTH_TEST),
                gl.disable(gl.CULL_FACE),
                gl.disable(gl.BLEND),
                e.toViewport(o);
        }),
        r
    );
};
GL$1.Texture.getWhiteTexture = function (e) {
    e = e || global.gl;
    var t = e.textures[":white"];
    if (t) return t;
    var r = new Uint8Array([255, 255, 255, 255]);
    return (e.textures[":white"] = new GL$1.Texture(1, 1, {
        pixel_data: r,
    }));
};
GL$1.Texture.getBlackTexture = function (e) {
    e = e || global.gl;
    var t = e.textures[":black"];
    if (t) return t;
    var r = new Uint8Array([0, 0, 0, 255]);
    return (e.textures[":black"] = new GL$1.Texture(1, 1, {
        pixel_data: r,
    }));
};
GL$1.Texture.getTemporary = function (e, t, r, n) {
    (n = n || global.gl), n._texture_pool || (n._texture_pool = []);
    var s = GL$1.TEXTURE_2D,
        a = GL$1.Texture.DEFAULT_TYPE,
        o = GL$1.Texture.DEFAULT_FORMAT;
    r &&
        (r.texture_type && (s = r.texture_type),
        r.type && (a = r.type),
        r.format && (o = r.format));
    for (
        var l = s + ":" + a + ":" + e + "x" + t + ":" + o,
            c = n._texture_pool,
            u = 0;
        u < c.length;
        ++u
    ) {
        var h = c[u];
        if (h._key == l) return c.splice(u, 1), (h._pool = 0), h;
    }
    var h = new GL$1.Texture(e, t, {
        type: a,
        texture_type: s,
        format: o,
        filter: n.LINEAR,
    });
    return (h._key = l), (h._pool = 0), h;
};
GL$1.Texture.releaseTemporary = function (e, t) {
    (t = t || global.gl),
        t._texture_pool || (t._texture_pool = []),
        e._pool > 0 &&
            console.warn("this texture is already in the textures pool");
    var r = t._texture_pool;
    if (
        (r || (r = t._texture_pool = []),
        (e._pool = global.getTime()),
        r.push(e),
        r.length > 20)
    ) {
        r.sort(function (s, a) {
            return a._pool - s._pool;
        });
        var e = r.pop();
        (e._pool = 0), e.delete();
    }
};
GL$1.Texture.nextPOT = function (e) {
    return Math.pow(2, Math.ceil(Math.log(e) / Math.log(2)));
};
function FBO(e, t, r, n) {
    if (
        ((n = n || global.gl),
        (this.gl = n),
        (this._context_id = n.context_id),
        e && e.constructor !== Array)
    )
        throw "FBO textures must be an Array";
    (this.handler = null),
        (this.width = -1),
        (this.height = -1),
        (this.color_textures = []),
        (this.depth_texture = null),
        (this.stencil = !!r),
        (this._stencil_enabled = !1),
        (this._num_binded_textures = 0),
        (this.order = null),
        ((e && e.length) || t) && this.setTextures(e, t),
        (this._old_fbo_handler = null),
        (this._old_viewport = new Float32Array(4));
}
GL$1.FBO = FBO;
FBO.prototype.setTextures = function (e, t, r) {
    if (t && t.constructor === GL$1.Texture) {
        if (
            t.format !== GL$1.DEPTH_COMPONENT &&
            t.format !== GL$1.DEPTH_STENCIL &&
            t.format !== GL$1.DEPTH_COMPONENT16 &&
            t.format !== GL$1.DEPTH_COMPONENT24 &&
            t.format !== GL$1.DEPTH_COMPONENT32F
        )
            throw "FBO Depth texture must be of format: gl.DEPTH_COMPONENT, gl.DEPTH_STENCIL or gl.DEPTH_COMPONENT16/24/32F (only in webgl2)";
        if (
            t.type != GL$1.UNSIGNED_SHORT &&
            t.type != GL$1.UNSIGNED_INT &&
            t.type != GL$1.UNSIGNED_INT_24_8_WEBGL &&
            t.type != GL$1.FLOAT
        )
            throw "FBO Depth texture must be of type: gl.UNSIGNED_SHORT, gl.UNSIGNED_INT, gl.UNSIGNED_INT_24_8_WEBGL";
    }
    var n = this.depth_texture == t;
    if (n && e) {
        if (e.constructor !== Array)
            throw "FBO: color_textures parameter must be an array containing all the textures to be binded in the color";
        if (e.length == this.color_textures.length) {
            for (var s = 0; s < e.length; ++s)
                if (e[s] != this.color_textures[s]) {
                    n = !1;
                    break;
                }
        } else n = !1;
    }
    if ((this._stencil_enabled !== this.stencil && (n = !1), !n)) {
        if (((this.color_textures.length = e ? e.length : 0), e))
            for (var s = 0; s < e.length; ++s) this.color_textures[s] = e[s];
        (this.depth_texture = t), this.update(r);
    }
};
FBO.prototype.update = function (e) {
    (this._old_fbo_handler = gl.getParameter(gl.FRAMEBUFFER_BINDING)),
        this.handler || (this.handler = gl.createFramebuffer());
    var t = -1,
        r = -1,
        n = null,
        s = null,
        a = this.color_textures,
        o = this.depth_texture;
    if (a && a.length)
        for (var l = 0; l < a.length; l++) {
            var c = a[l];
            if (c.constructor !== GL$1.Texture)
                throw "FBO can only bind instances of GL.Texture";
            if (t == -1) t = c.width;
            else if (t != c.width)
                throw "Cannot bind textures with different dimensions";
            if (r == -1) r = c.height;
            else if (r != c.height)
                throw "Cannot bind textures with different dimensions";
            if (n == null) (n = c.type), (s = c.format);
            else if (n != c.type)
                throw "Cannot bind textures to a FBO with different pixel formats";
            if (c.texture_type != gl.TEXTURE_2D)
                throw "Cannot bind a Cubemap to a FBO";
        }
    else (t = o.width), (r = o.height);
    (this.width = t),
        (this.height = r),
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.handler);
    var u = gl.extensions.WEBGL_draw_buffers;
    if (gl.webgl_version == 1 && !u && a && a.length > 1)
        throw "Rendering to several textures not supported by your browser";
    var h = gl.webgl_version == 1 ? gl.FRAMEBUFFER : gl.DRAW_FRAMEBUFFER;
    if (
        (gl.framebufferRenderbuffer(
            h,
            gl.DEPTH_ATTACHMENT,
            gl.RENDERBUFFER,
            null
        ),
        gl.framebufferRenderbuffer(
            h,
            gl.DEPTH_STENCIL_ATTACHMENT,
            gl.RENDERBUFFER,
            null
        ),
        o && o.constructor === GL$1.Texture)
    ) {
        if (gl.webgl_version == 1 && !gl.extensions.WEBGL_depth_texture)
            throw "Rendering to depth texture not supported by your browser";
        this.stencil &&
            o.format !== gl.DEPTH_STENCIL &&
            console.warn(
                "Stencil cannot be enabled if there is a depth texture with a DEPTH_STENCIL format"
            ),
            o.format == gl.DEPTH_STENCIL
                ? gl.framebufferTexture2D(
                      h,
                      gl.DEPTH_STENCIL_ATTACHMENT,
                      gl.TEXTURE_2D,
                      o.handler,
                      0
                  )
                : gl.framebufferTexture2D(
                      h,
                      gl.DEPTH_ATTACHMENT,
                      gl.TEXTURE_2D,
                      o.handler,
                      0
                  );
    } else {
        var f = null;
        o &&
        o.constructor === WebGLRenderbuffer &&
        o.width == t &&
        o.height == r
            ? (f = this._depth_renderbuffer = o)
            : ((f = this._depth_renderbuffer =
                  this._depth_renderbuffer || gl.createRenderbuffer()),
              (f.width = t),
              (f.height = r)),
            gl.bindRenderbuffer(gl.RENDERBUFFER, f),
            this.stencil
                ? (gl.renderbufferStorage(
                      gl.RENDERBUFFER,
                      gl.DEPTH_STENCIL,
                      t,
                      r
                  ),
                  gl.framebufferRenderbuffer(
                      h,
                      gl.DEPTH_STENCIL_ATTACHMENT,
                      gl.RENDERBUFFER,
                      f
                  ))
                : (gl.renderbufferStorage(
                      gl.RENDERBUFFER,
                      gl.DEPTH_COMPONENT16,
                      t,
                      r
                  ),
                  gl.framebufferRenderbuffer(
                      h,
                      gl.DEPTH_ATTACHMENT,
                      gl.RENDERBUFFER,
                      f
                  ));
    }
    if (a && a.length) {
        this.order = [];
        for (var l = 0; l < a.length; l++) {
            var c = a[l];
            gl.framebufferTexture2D(
                h,
                gl.COLOR_ATTACHMENT0 + l,
                gl.TEXTURE_2D,
                c.handler,
                0
            ),
                this.order.push(gl.COLOR_ATTACHMENT0 + l);
        }
    } else {
        var d = (this._color_renderbuffer =
            this._color_renderbuffer || gl.createRenderbuffer());
        (d.width = t),
            (d.height = r),
            gl.bindRenderbuffer(gl.RENDERBUFFER, d),
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA4, t, r),
            gl.framebufferRenderbuffer(
                h,
                gl.COLOR_ATTACHMENT0,
                gl.RENDERBUFFER,
                d
            );
    }
    for (var p = a ? a.length : 0, l = p; l < this._num_binded_textures; ++l)
        gl.framebufferTexture2D(
            h,
            gl.COLOR_ATTACHMENT0 + l,
            gl.TEXTURE_2D,
            null,
            0
        );
    (this._num_binded_textures = p),
        (this._stencil_enabled = this.stencil),
        a &&
            a.length > 1 &&
            (u ? u.drawBuffersWEBGL(this.order) : gl.drawBuffers(this.order));
    var _ = gl.checkFramebufferStatus(h);
    if (_ !== gl.FRAMEBUFFER_COMPLETE)
        throw (
            (s == GL$1.RGB &&
                (n == GL$1.FLOAT || n == GL$1.HALF_FLOAT_OES) &&
                console.error(
                    "Tip: Firefox does not support RGB channel float/half_float textures, you must use RGBA"
                ),
            "FBO not complete: " + _)
        );
    gl.bindTexture(gl.TEXTURE_2D, null),
        gl.bindRenderbuffer(gl.RENDERBUFFER, null),
        e || gl.bindFramebuffer(h, this._old_fbo_handler);
};
FBO.prototype.bind = function (e) {
    if (this.multi_sample) {
        (this._old_fbo_handler = gl.getParameter(gl.FRAMEBUFFER_BINDING)),
            this._old_viewport.set(gl.viewport_data),
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.handler),
            gl.framebufferRenderbuffer(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0,
                gl.RENDERBUFFER,
                this.colorRenderbuffer
            ),
            gl.framebufferRenderbuffer(
                gl.FRAMEBUFFER,
                gl.DEPTH_ATTACHMENT,
                gl.RENDERBUFFER,
                this.depthRenderbuffer
            ),
            gl.viewport(0, 0, this.width, this.height),
            (FBO.current = this);
        return;
    }
    if (!this.color_textures.length && !this.depth_texture)
        throw "FBO: no textures attached to FBO";
    this._old_viewport.set(gl.viewport_data),
        e
            ? (this._old_fbo_handler = gl.getParameter(gl.FRAMEBUFFER_BINDING))
            : (this._old_fbo_handler = null),
        this._old_fbo_handler != this.handler &&
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.handler);
    for (var t = 0; t < this.color_textures.length; ++t)
        this.color_textures[t]._in_current_fbo = !0;
    this.depth_texture && (this.depth_texture._in_current_fbo = !0),
        gl.viewport(0, 0, this.width, this.height),
        (FBO.current = this);
};
FBO.prototype.unbind = function () {
    gl.bindFramebuffer(gl.FRAMEBUFFER, this._old_fbo_handler),
        (this._old_fbo_handler = null),
        gl.setViewport(this._old_viewport);
    for (var e = 0; e < this.color_textures.length; ++e)
        this.color_textures[e]._in_current_fbo = !1;
    this.depth_texture && (this.depth_texture._in_current_fbo = !1),
        (FBO.current = null);
};
FBO.prototype.switchTo = function (e) {
    (e._old_fbo_handler = this._old_fbo_handler),
        e._old_viewport.set(this._old_viewport),
        gl.bindFramebuffer(gl.FRAMEBUFFER, e.handler),
        (this._old_fbo_handler = null),
        gl.viewport(0, 0, this.width, this.height);
    for (var t = 0; t < this.color_textures.length; ++t)
        this.color_textures[t]._in_current_fbo = !1;
    this.depth_texture && (this.depth_texture._in_current_fbo = !1);
    for (var t = 0; t < e.color_textures.length; ++t)
        e.color_textures[t]._in_current_fbo = !0;
    e.depth_texture && (e.depth_texture._in_current_fbo = !0),
        (FBO.current = e);
};
FBO.prototype.delete = function () {
    gl.deleteFramebuffer(this.handler), (this.handler = null);
};
FBO.supported = {};
FBO.testSupport = function (e, t) {
    var r = e + ":" + t;
    if (FBO.supported[r] != null) return FBO.supported[r];
    var n = new GL$1.Texture(1, 1, { format: t, type: e });
    try {
        var s = new GL$1.FBO([n]);
    } catch {
        return (
            console.warn(
                "This browser WEBGL implementation doesn't support this FBO format: " +
                    GL$1.reverse[e] +
                    " " +
                    GL$1.reverse[t]
            ),
            (FBO.supported[r] = !1)
        );
    }
    return (FBO.supported[r] = !0), !0;
};
FBO.prototype.toSingle = function (e) {
    if (((e = e || 0), !(this.color_textures.length < 2))) {
        var t = gl.extensions.WEBGL_draw_buffers;
        t
            ? t.drawBuffersWEBGL([this.order[e]])
            : gl.drawBuffers([this.order[e]]);
    }
};
FBO.prototype.toMulti = function () {
    if (!(this.color_textures.length < 2)) {
        var e = gl.extensions.WEBGL_draw_buffers;
        e ? e.drawBuffersWEBGL(this.order) : gl.drawBuffers(this.order);
    }
};
FBO.prototype.clearSecondary = function (e) {
    if (!(!this.order || this.order.length < 2)) {
        for (
            var t = gl.extensions.WEBGL_draw_buffers, r = [gl.NONE], n = 1;
            n < this.order.length;
            ++n
        )
            r.push(this.order[n]);
        t ? t.drawBuffersWEBGL(r) : gl.drawBuffers(r),
            gl.clearColor(e[0], e[1], e[2], e[3]),
            gl.clear(gl.COLOR_BUFFER_BIT),
            t ? t.drawBuffersWEBGL(this.order) : gl.drawBuffers(this.order);
    }
};
FBO.prototype.makeMultiSample = function (e, t, r, n) {
    if (this.gl.webgl_version == 1)
        throw "cannot use makeMultiSample in webgl 1.0";
    (this.width = e), (this.height = t), (r = r || 4), (n = n || {});
    var s = n.format || gl.RGBA8,
        a = gl.DEPTH_COMPONENT16;
    (this._old_fbo_handler = gl.getParameter(gl.FRAMEBUFFER_BINDING)),
        (this.handler = gl.createFramebuffer()),
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.handler),
        (this.colorRenderbuffer = gl.createRenderbuffer()),
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.colorRenderbuffer),
        gl.renderbufferStorageMultisample(
            gl.RENDERBUFFER,
            r,
            s,
            this.width,
            this.height
        ),
        (this.depthRenderbuffer = gl.createRenderbuffer()),
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthRenderbuffer),
        gl.renderbufferStorageMultisample(
            gl.RENDERBUFFER,
            r,
            a,
            this.width,
            this.height
        ),
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.handler),
        gl.framebufferRenderbuffer(
            gl.FRAMEBUFFER,
            gl.COLOR_ATTACHMENT0,
            gl.RENDERBUFFER,
            this.colorRenderbuffer
        ),
        gl.framebufferRenderbuffer(
            gl.FRAMEBUFFER,
            gl.DEPTH_ATTACHMENT,
            gl.RENDERBUFFER,
            this.depthRenderbuffer
        ),
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._old_fbo_handler),
        (this._old_fbo_handler = null),
        (this.multi_sample = !0);
};
FBO.prototype.blitMultisample = function (e) {
    if (!e || e.constructor !== GL$1.FBO) throw "parameter must be GL.FBO";
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.handler),
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, e.handler),
        gl.blitFramebuffer(
            0,
            0,
            this.width,
            this.height,
            0,
            0,
            this.width,
            this.height,
            gl.COLOR_BUFFER_BIT,
            gl.LINEAR
        ),
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null),
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null),
        gl.bindFramebuffer(gl.FRAMEBUFFER, this._old_fbo_handler),
        (this._old_fbo_handler = null),
        gl.setViewport(this._old_viewport);
};
global.Shader = GL$1.Shader = function e(t, r, n) {
    if ((GL$1.debug && console.log("GL.Shader created"), !t || !r))
        throw "GL.Shader source code parameter missing";
    this._context_id = global.gl.context_id;
    var s = (this.gl = global.gl),
        a = e.expandMacros(n),
        o = t.constructor === String ? e.injectCode(a, t, s) : t,
        l = r.constructor === String ? e.injectCode(a, r, s) : r;
    this.program = s.createProgram();
    var c =
            t.constructor === String
                ? GL$1.Shader.compileSource(s.VERTEX_SHADER, o)
                : t,
        u =
            r.constructor === String
                ? GL$1.Shader.compileSource(s.FRAGMENT_SHADER, l)
                : r;
    s.attachShader(this.program, c, s),
        s.attachShader(this.program, u, s),
        s.linkProgram(this.program),
        (this.vs_shader = c),
        (this.fs_shader = u),
        (this.attributes = {}),
        (this.uniformInfo = {}),
        (this.samplers = {}),
        e.use_async ? (this._first_use = !0) : this.checkLink();
};
Shader.use_async = !0;
Shader.expandMacros = function (e) {
    var t = "";
    if (e)
        for (var r in e)
            t +=
                "#define " +
                r +
                " " +
                (e[r] ? e[r] : "") +
                `
`;
    return t;
};
Shader.injectCode = function (e, t, r) {
    var n = t.indexOf(`
`),
        s = r
            ? "#define WEBGL" +
              r.webgl_version +
              `
`
            : "",
        a = t.substr(0, n).trim();
    return a.indexOf("#version") == -1
        ? s + e + t
        : a +
              `
` +
              s +
              e +
              t.substr(n);
};
Shader.compileSource = function (e, t, r, n) {
    return (
        (r = r || global.gl),
        (n = n || r.createShader(e)),
        r.shaderSource(n, t),
        r.compileShader(n),
        n
    );
};
Shader.parseError = function (e, t, r) {
    if (!e) return null;
    var n = e.split(" "),
        s = n[5].split(":");
    return {
        type: n[0],
        line_number: parseInt(s[1]),
        line_pos: parseInt(s[0]),
        line_code: (n[0] == "Fragment" ? r : t).split(`
`)[parseInt(s[1])],
        err: e,
    };
};
Shader.prototype.delete = function () {
    this.program && this.gl.deleteProgram(this.program),
        this.vs_shader && this.gl.deleteShader(this.vs_shader),
        this.fs_shader && this.gl.deleteShader(this.fs_shader),
        (this.gl = null),
        (this.attributes = {}),
        (this.uniformInfo = {}),
        (this.samplers = {});
};
Shader.prototype.updateShader = function (e, t, r) {
    var n = this.gl || global.gl,
        s = Shader.expandMacros(r);
    this.program
        ? (n.detachShader(this.program, this.vs_shader),
          n.detachShader(this.program, this.fs_shader))
        : (this.program = n.createProgram());
    var s = Shader.expandMacros(r),
        a = e.constructor === String ? Shader.injectCode(s, e, n) : e,
        o = t.constructor === String ? Shader.injectCode(s, t, n) : t,
        l =
            e.constructor === String
                ? GL$1.Shader.compileSource(n.VERTEX_SHADER, a)
                : e,
        c =
            t.constructor === String
                ? GL$1.Shader.compileSource(n.FRAGMENT_SHADER, o)
                : t;
    n.attachShader(this.program, l, n),
        n.attachShader(this.program, c, n),
        n.linkProgram(this.program),
        (this.vs_shader = l),
        (this.fs_shader = c),
        (this.attributes = {}),
        (this.uniformInfo = {}),
        (this.samplers = {}),
        Shader.use_async ? (this._first_use = !0) : this.checkLink();
};
Shader.prototype.extractShaderInfo = function () {
    for (
        var e = this.gl,
            t = e.getProgramParameter(this.program, e.ACTIVE_UNIFORMS),
            r = 0;
        r < t;
        ++r
    ) {
        var n = e.getActiveUniform(this.program, r);
        if (!n) break;
        var s = n.name,
            a = s.indexOf("[");
        if (a != -1) {
            var o = s.indexOf("].");
            o == -1 && (s = s.substr(0, a));
        }
        (n.type == GL$1.SAMPLER_2D ||
            n.type == GL$1.SAMPLER_CUBE ||
            n.type == GL$1.SAMPLER_3D ||
            n.type == GL$1.INT_SAMPLER_2D ||
            n.type == GL$1.INT_SAMPLER_CUBE ||
            n.type == GL$1.INT_SAMPLER_3D ||
            n.type == GL$1.UNSIGNED_INT_SAMPLER_2D ||
            n.type == GL$1.UNSIGNED_INT_SAMPLER_CUBE ||
            n.type == GL$1.UNSIGNED_INT_SAMPLER_3D) &&
            (this.samplers[s] = n.type);
        var l = Shader.getUniformFunc(n),
            c = !1;
        (n.type == e.FLOAT_MAT2 ||
            n.type == e.FLOAT_MAT3 ||
            n.type == e.FLOAT_MAT4) &&
            (c = !0);
        var u = GL$1.TYPE_LENGTH[n.type] || 1;
        this.uniformInfo[s] = {
            type: n.type,
            func: l,
            size: n.size,
            type_length: u,
            is_matrix: c,
            loc: e.getUniformLocation(this.program, s),
            data: new Float32Array(u * n.size),
            //prealloc space to assign uniforms that are not typed
        };
    }
    for (
        var r = 0, t = e.getProgramParameter(this.program, e.ACTIVE_ATTRIBUTES);
        r < t;
        ++r
    ) {
        var n = e.getActiveAttrib(this.program, r);
        if (!n) break;
        var l = Shader.getUniformFunc(n),
            u = GL$1.TYPE_LENGTH[n.type] || 1;
        (this.uniformInfo[n.name] = {
            type: n.type,
            func: l,
            type_length: u,
            size: n.size,
            loc: null,
        }),
            n.name !== "gl_VertexID" &&
                (this.attributes[n.name] = e.getAttribLocation(
                    this.program,
                    n.name
                ));
    }
};
Shader.prototype.hasUniform = function (e) {
    return this.uniformInfo[e];
};
Shader.prototype.hasAttribute = function (e) {
    return this.attributes[e];
};
Shader.getUniformFunc = function (e) {
    var t = null;
    switch (e.type) {
        case GL$1.FLOAT:
            e.size == 1 ? (t = gl.uniform1f) : (t = gl.uniform1fv);
            break;
        case GL$1.FLOAT_MAT2:
            t = gl.uniformMatrix2fv;
            break;
        case GL$1.FLOAT_MAT3:
            t = gl.uniformMatrix3fv;
            break;
        case GL$1.FLOAT_MAT4:
            t = gl.uniformMatrix4fv;
            break;
        case GL$1.FLOAT_VEC2:
            t = gl.uniform2fv;
            break;
        case GL$1.FLOAT_VEC3:
            t = gl.uniform3fv;
            break;
        case GL$1.FLOAT_VEC4:
            t = gl.uniform4fv;
            break;
        case GL$1.UNSIGNED_INT:
        case GL$1.INT:
            e.size == 1 ? (t = gl.uniform1i) : (t = gl.uniform1iv);
            break;
        case GL$1.INT_VEC2:
            t = gl.uniform2iv;
            break;
        case GL$1.INT_VEC3:
            t = gl.uniform3iv;
            break;
        case GL$1.INT_VEC4:
            t = gl.uniform4iv;
            break;
        case GL$1.SAMPLER_2D:
        case GL$1.SAMPLER_3D:
        case GL$1.SAMPLER_CUBE:
        case GL$1.INT_SAMPLER_2D:
        case GL$1.INT_SAMPLER_3D:
        case GL$1.INT_SAMPLER_CUBE:
        case GL$1.UNSIGNED_INT_SAMPLER_2D:
        case GL$1.UNSIGNED_INT_SAMPLER_3D:
        case GL$1.UNSIGNED_INT_SAMPLER_CUBE:
            t = gl.uniform1i;
            break;
        default:
            t = gl.uniform1f;
            break;
    }
    return t;
};
Shader.fromURL = function (e, t, r) {
    var n = `
			precision highp float;
			attribute vec3 a_vertex;
			attribute mat4 u_mvp;
			void main() { 
				gl_Position = u_mvp * vec4(a_vertex,1.0); 
			}
		`,
        s = `
			precision highp float;
			void main() {
				gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
			}
			`,
        a = new GL$1.Shader(n, s);
    a.ready = !1;
    var o = null,
        l = null;
    global.HttpRequest(e, null, function (u) {
        (o = u), l && c();
    }),
        global.HttpRequest(t, null, function (u) {
            (l = u), o && c();
        });
    function c() {
        var u = new GL$1.Shader(o, l);
        for (var h in u) a[h] = u[h];
        a.ready = !0;
    }
    return a;
};
Shader.prototype.checkLink = function () {
    if (
        ((this._first_use = !1),
        !gl.getShaderParameter(this.vs_shader, gl.COMPILE_STATUS))
    )
        throw (
            "Vertex shader compile error: " +
            gl.getShaderInfoLog(this.vs_shader)
        );
    if (!gl.getShaderParameter(this.fs_shader, gl.COMPILE_STATUS))
        throw (
            "Fragment shader compile error: " +
            gl.getShaderInfoLog(this.fs_shader)
        );
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
        throw "link error: " + gl.getProgramInfoLog(this.program);
    this.extractShaderInfo();
};
Shader.prototype.bind = function () {
    var e = this.gl;
    Shader.use_async &&
        this._first_use &&
        (this.checkLink(), (this._first_use = !1)),
        e.useProgram(this.program),
        (e._current_shader = this);
};
Shader.prototype.getLocation = function (e) {
    var t = this.uniformInfo[e];
    return t ? this.uniformInfo[e].loc : null;
};
Shader._temp_uniform = new Float32Array(16);
Shader.prototype.uniforms = function (e) {
    var t = this.gl;
    this._first_use && this.checkLink(),
        t.useProgram(this.program),
        (t._current_shader = this);
    for (var r in e) {
        var n = this.uniformInfo[r];
        n && this._setUniform(r, e[r]);
    }
    return this;
};
Shader.prototype.uniformsArray = function (e) {
    var t = this.gl;
    this._first_use && this.checkLink(),
        t.useProgram(this.program),
        (t._current_shader = this);
    for (var r = 0, n = e.length; r < n; ++r) {
        var s = e[r];
        for (var a in s) this._setUniform(a, s[a]);
    }
    return this;
};
Shader.prototype.setUniform = /* @__PURE__ */ (function () {
    return function (e, t) {
        this.gl._current_shader != this && this.bind();
        var r = this.uniformInfo[e];
        r &&
            r.loc !== null &&
            t != null &&
            (t.constructor === Array && (r.data.set(t), (t = r.data)),
            r.is_matrix
                ? r.func.call(this.gl, r.loc, !1, t)
                : r.func.call(this.gl, r.loc, t));
    };
})();
Shader.prototype._setUniform = /* @__PURE__ */ (function () {
    return function (e, t) {
        this._first_use && this.checkLink();
        var r = this.uniformInfo[e];
        r &&
            r.loc !== null &&
            t != null &&
            (t.constructor === Array && (r.data.set(t), (t = r.data)),
            r.is_matrix
                ? r.func.call(this.gl, r.loc, !1, t)
                : r.func.call(this.gl, r.loc, t));
    };
})();
Shader.prototype.draw = function (e, t, r) {
    (r = r === void 0 ? (t == gl.LINES ? "lines" : "triangles") : r),
        this.drawBuffers(
            e.vertexBuffers,
            r ? e.indexBuffers[r] : null,
            arguments.length < 2 ? gl.TRIANGLES : t
        );
};
Shader.prototype.drawRange = function (e, t, r, n, s) {
    (s = s === void 0 ? (t == gl.LINES ? "lines" : "triangles") : s),
        this.drawBuffers(
            e.vertexBuffers,
            s ? e.indexBuffers[s] : null,
            t,
            r,
            n
        );
};
var temp_attribs_array = new Uint8Array(16),
    temp_attribs_array_zero = new Uint8Array(16);
Shader.prototype.drawBuffers = function (e, t, r, n, s) {
    if (s != 0) {
        var a = this.gl;
        this._first_use && this.checkLink(), a.useProgram(this.program);
        var o = 0,
            l = temp_attribs_array;
        l.set(temp_attribs_array_zero);
        for (var c in e) {
            var u = e[c],
                h = u.attribute || c,
                f = this.attributes[h];
            f == null ||
                !u.buffer ||
                ((l[f] = 1),
                a.bindBuffer(a.ARRAY_BUFFER, u.buffer),
                a.enableVertexAttribArray(f),
                a.vertexAttribPointer(
                    f,
                    u.buffer.spacing,
                    u.buffer.gl_type,
                    u.normalize,
                    0,
                    0
                ),
                (o = u.buffer.length / u.buffer.spacing));
        }
        var d = 0;
        n > 0 && (d = n),
            t && (o = t.buffer.length - d),
            s > 0 && s < o && (o = s);
        var p = t && t.data ? t.data.constructor.BYTES_PER_ELEMENT : 1;
        d *= p;
        for (var h in this.attributes) {
            var f = this.attributes[h];
            l[f] || a.disableVertexAttribArray(this.attributes[h]);
        }
        return (
            o &&
                (!t || t.buffer) &&
                (t
                    ? (a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, t.buffer),
                      a.drawElements(r, o, t.buffer.gl_type, d),
                      a.bindBuffer(a.ELEMENT_ARRAY_BUFFER, null))
                    : a.drawArrays(r, d, o),
                a.draw_calls++),
            this
        );
    }
};
Shader._instancing_arrays = [];
Shader.prototype.drawInstanced = function (e, t, r, n, s, a, o) {
    if (a !== 0) {
        var l = this.gl;
        if (l.webgl_version == 1 && !l.extensions.ANGLE_instanced_arrays)
            throw "instancing not supported";
        this._first_use && this.checkLink(), l.useProgram(this.program);
        var c = 0,
            u = temp_attribs_array;
        u.set(temp_attribs_array_zero);
        var h = e.vertexBuffers;
        for (var f in h) {
            var d = h[f],
                p = d.attribute || f,
                _ = this.attributes[p];
            _ == null ||
                !d.buffer ||
                ((u[_] = 1),
                l.bindBuffer(l.ARRAY_BUFFER, d.buffer),
                l.enableVertexAttribArray(_),
                l.vertexAttribPointer(
                    _,
                    d.buffer.spacing,
                    d.buffer.gl_type,
                    d.normalize,
                    0,
                    0
                ),
                (c = d.buffer.length / d.buffer.spacing));
        }
        var E = null;
        r &&
            (r.constructor === String
                ? (E = e.getIndexBuffer(r))
                : r.constructor === GL$1.Buffer && (E = r));
        var m = 0;
        s > 0 && (m = s),
            E && (c = E.buffer.length - m),
            a > 0 && a < c && (c = a);
        var b = E && E.data ? E.data.constructor.BYTES_PER_ELEMENT : 1;
        m *= b;
        for (var p in this.attributes) {
            var _ = this.attributes[p];
            u[_] || l.disableVertexAttribArray(this.attributes[p]);
        }
        var L = l.extensions.ANGLE_instanced_arrays,
            T = 0,
            g = 0;
        for (var A in n) {
            var G = n[A];
            T = G.length;
            var M = this.attributes[A];
            if (M == null) return;
            var N = 0,
                I = 0;
            G.constructor === Array
                ? ((N = G[0].constructor === Number ? 1 : G[0].length),
                  (I = N * G.length))
                : ((N = this.uniformInfo[A].type_length),
                  (I = G.length),
                  (T = I / N));
            var B = Shader._instancing_arrays[g];
            if (
                ((!B || B.data.length < I) &&
                    (B = Shader._instancing_arrays[g] =
                        {
                            data: new Float32Array(I),
                            buffer: l.createBuffer(),
                        }),
                (B.uniform = A),
                (B.element_size = N),
                G.constructor === Array)
            )
                for (var O = 0; O < G.length; ++O) B.data.set(G[O], O * N);
            else B.data.set(G);
            if (
                (l.bindBuffer(l.ARRAY_BUFFER, B.buffer),
                l.bufferData(l.ARRAY_BUFFER, B.data, l.STREAM_DRAW),
                N == 16)
            )
                for (var F = 0; F < 4; ++F)
                    l.enableVertexAttribArray(M + F),
                        l.vertexAttribPointer(
                            M + F,
                            4,
                            l.FLOAT,
                            !1,
                            16 * 4,
                            F * 4 * 4
                        ),
                        L
                            ? L.vertexAttribDivisorANGLE(M + F, 1)
                            : l.vertexAttribDivisor(M + F, 1);
            else
                l.enableVertexAttribArray(M),
                    l.vertexAttribPointer(M, N, l.FLOAT, !1, N * 4, 0),
                    L
                        ? L.vertexAttribDivisorANGLE(M, 1)
                        : l.vertexAttribDivisor(M, 1);
            g += 1;
        }
        o && (T = o),
            L
                ? E
                    ? (l.bindBuffer(l.ELEMENT_ARRAY_BUFFER, E.buffer),
                      L.drawElementsInstancedANGLE(
                          t,
                          c,
                          E.buffer.gl_type,
                          m,
                          T
                      ),
                      l.bindBuffer(l.ELEMENT_ARRAY_BUFFER, null))
                    : L.drawArraysInstancedANGLE(t, m, c, T)
                : E
                ? (l.bindBuffer(l.ELEMENT_ARRAY_BUFFER, E.buffer),
                  l.drawElementsInstanced(t, c, E.buffer.gl_type, m, T),
                  l.bindBuffer(l.ELEMENT_ARRAY_BUFFER, null))
                : l.drawArraysInstanced(t, m, c, T);
        for (var P = 0; P < g; ++P) {
            var C = Shader._instancing_arrays[P],
                M = this.attributes[C.uniform],
                N = C.element_size;
            if (N == 16)
                for (var F = 0; F < 4; ++F)
                    l.disableVertexAttribArray(M + F),
                        L
                            ? L.vertexAttribDivisorANGLE(M + F, 0)
                            : l.vertexAttribDivisor(M + F, 0);
            else
                l.enableVertexAttribArray(M),
                    L
                        ? L.vertexAttribDivisorANGLE(M, 0)
                        : l.vertexAttribDivisor(M, 0);
        }
        return this;
    }
};
Shader.expandImports = function (e, t) {
    t = t || Shader.files;
    var r = {};
    if (!t) throw "Shader.files not initialized, assign files there";
    var n = function (s) {
        var a = s.split('"'),
            o = a[1];
        if (r[o])
            return (
                "//already imported: " +
                o +
                `
`
            );
        var l = t[o];
        return (
            (r[o] = !0),
            l
                ? l +
                  `
`
                : "//import code not found: " +
                  o +
                  `
`
        );
    };
    return e.replace(/#import\s+"([a-zA-Z0-9_.]+)"\s*\n/g, n);
};
Shader.dumpErrorToConsole = function (e, t, r) {
    console.error(e), e.msg;
    var n = null;
    e.indexOf("Fragment") != -1 ? (n = r) : (n = t);
    var s = n.split(`
`);
    for (var a in s) s[a] = a + "| " + s[a];
    console.groupCollapsed("Shader code"),
        console.log(
            s.join(`
`)
        ),
        console.groupEnd();
};
Shader.convertTo100 = function (e, t) {};
Shader.convertTo300 = function (e, t) {};
Shader.validateValue = function (e, t) {
    if (e == null) return !1;
    switch (t.type) {
        //used to validate shaders
        case GL$1.INT:
        case GL$1.FLOAT:
        case GL$1.SAMPLER_2D:
        case GL$1.SAMPLER_3D:
        case GL$1.SAMPLER_CUBE:
        case GL$1.INT_SAMPLER_2D:
        case GL$1.INT_SAMPLER_3D:
        case GL$1.INT_SAMPLER_CUBE:
        case GL$1.UNSIGNED_INT_SAMPLER_2D:
        case GL$1.UNSIGNED_INT_SAMPLER_3D:
        case GL$1.UNSIGNED_INT_SAMPLER_CUBE:
            return global.isNumber(e);
        case GL$1.INT_VEC2:
        case GL$1.FLOAT_VEC2:
            return e.length === 2;
        case GL$1.INT_VEC3:
        case GL$1.FLOAT_VEC3:
            return e.length === 3;
        case GL$1.INT_VEC4:
        case GL$1.FLOAT_VEC4:
        case GL$1.FLOAT_MAT2:
            return e.length === 4;
        case GL$1.FLOAT_MAT3:
            return e.length === 8;
        case GL$1.FLOAT_MAT4:
            return e.length === 16;
    }
    return !0;
};
Shader.DEFAULT_VERTEX_SHADER = `
			precision highp float;
			attribute vec3 a_vertex;
			attribute vec3 a_normal;
			attribute vec2 a_coord;
			varying vec3 v_position;
			varying vec3 v_normal;
			varying vec2 v_coord;
			uniform mat4 u_model;
			uniform mat4 u_mvp;
			void main() {
				v_position = (u_model * vec4(a_vertex,1.0)).xyz;
				v_normal = (u_model * vec4(a_normal,0.0)).xyz;
				v_coord = a_coord;
				gl_Position = u_mvp * vec4(a_vertex,1.0);
			}
			`;
Shader.SCREEN_VERTEX_SHADER = `
			precision highp float;
			attribute vec3 a_vertex;
			attribute vec2 a_coord;
			varying vec2 v_coord;
			void main() { 
				v_coord = a_coord; 
				gl_Position = vec4(a_coord * 2.0 - 1.0, 0.0, 1.0); 
			}
			`;
Shader.SCREEN_300_VERTEX_SHADER = `#version 300 es
			precision highp float;
			in vec3 a_vertex;
			in vec2 a_coord;
			out vec2 v_coord;
			void main() { 
				v_coord = a_coord; 
				gl_Position = vec4(a_coord * 2.0 - 1.0, 0.0, 1.0); 
			}
			`;
Shader.SCREEN_FRAGMENT_SHADER = `
			precision highp float;
			uniform sampler2D u_texture;
			varying vec2 v_coord;
			void main() {
				gl_FragColor = texture2D(u_texture, v_coord);
			}
			`;
Shader.SCREEN_FRAGMENT_FX = `
			precision highp float;
			uniform sampler2D u_texture;
			varying vec2 v_coord;
			#ifdef FX_UNIFORMS
				FX_UNIFORMS
			#endif
			void main() {
				vec2 uv = v_coord;
				vec4 color = texture2D(u_texture, uv);
				#ifdef FX_CODE
					FX_CODE ;
				#endif
				gl_FragColor = color;
			}
			`;
Shader.SCREEN_COLORED_FRAGMENT_SHADER = `
			precision highp float;
			uniform sampler2D u_texture;
			uniform vec4 u_color;
			varying vec2 v_coord;
			void main() {
				gl_FragColor = u_color * texture2D(u_texture, v_coord);
			}
			`;
Shader.BLEND_FRAGMENT_SHADER = `
			precision highp float;
			uniform sampler2D u_texture;
			uniform sampler2D u_texture2;
			uniform float u_factor;
			varying vec2 v_coord;
			void main() {
				gl_FragColor = mix( texture2D(u_texture, v_coord), texture2D(u_texture2, v_coord), u_factor);
			}
			`;
Shader.QUAD_VERTEX_SHADER = `
			precision highp float;
			attribute vec3 a_vertex;
			attribute vec2 a_coord;
			varying vec2 v_coord;
			uniform vec2 u_position;
			uniform vec2 u_size;
			uniform vec2 u_viewport;
			uniform mat3 u_transform;
			void main() { 
				vec3 pos = vec3(u_position + vec2(a_coord.x,1.0 - a_coord.y)  * u_size, 1.0);
				v_coord = a_coord; 
				pos = u_transform * pos;
				pos.z = 0.0;
				//normalize
				pos.x = (2.0 * pos.x / u_viewport.x) - 1.0;
				pos.y = -((2.0 * pos.y / u_viewport.y) - 1.0);
				gl_Position = vec4(pos, 1.0); 
			}
			`;
Shader.QUAD_FRAGMENT_SHADER = `
			precision highp float;
			uniform sampler2D u_texture;
			uniform vec4 u_color;
			varying vec2 v_coord;
			void main() {
				gl_FragColor = u_color * texture2D(u_texture, v_coord);
			}
			`;
Shader.QUAD2_FRAGMENT_SHADER = `
			precision highp float;
			uniform sampler2D u_texture;
			uniform vec4 u_color;
			uniform vec4 u_texture_area;
			varying vec2 v_coord;
			void main() {
			    vec2 uv = vec2( mix(u_texture_area.x, u_texture_area.z, v_coord.x), 1.0 - mix(u_texture_area.w, u_texture_area.y, v_coord.y) );
				gl_FragColor = u_color * texture2D(u_texture, uv);
			}
			`;
Shader.PRIMITIVE2D_VERTEX_SHADER = `
			precision highp float;
			attribute vec3 a_vertex;
			uniform vec2 u_viewport;
			uniform mat3 u_transform;
			void main() { 
				vec3 pos = a_vertex;
				pos = u_transform * pos;
				pos.z = 0.0;
				//normalize
				pos.x = (2.0 * pos.x / u_viewport.x) - 1.0;
				pos.y = -((2.0 * pos.y / u_viewport.y) - 1.0);
				gl_Position = vec4(pos, 1.0); 
			}
			`;
Shader.FLAT_VERTEX_SHADER = `
			precision highp float;
			attribute vec3 a_vertex;
			uniform mat4 u_mvp;
			void main() { 
				gl_Position = u_mvp * vec4(a_vertex,1.0); 
			}
			`;
Shader.FLAT_FRAGMENT_SHADER = `
			precision highp float;
			uniform vec4 u_color;
			void main() {
				gl_FragColor = u_color;
			}
			`;
Shader.SCREEN_FLAT_FRAGMENT_SHADER = Shader.FLAT_FRAGMENT_SHADER;
Shader.createFX = function (e, t, r) {
    (e = GL$1.Shader.removeComments(e, !0)),
        (t = GL$1.Shader.removeComments(t, !0));
    var n = {
        FX_CODE: e,
        FX_UNIFORMS: t || "",
    };
    return r
        ? (r.updateShader(
              GL$1.Shader.SCREEN_VERTEX_SHADER,
              GL$1.Shader.SCREEN_FRAGMENT_FX,
              n
          ),
          r)
        : new GL$1.Shader(
              GL$1.Shader.SCREEN_VERTEX_SHADER,
              GL$1.Shader.SCREEN_FRAGMENT_FX,
              n
          );
};
Shader.replaceCodeUsingContext = function (e, t) {
    return e.replace(/\{\{[a-zA-Z0-9_]*\}\}/g, function (r) {
        return (r = r.replace(/[{}]/g, "")), t[r] || "";
    });
};
Shader.removeComments = function (n, t) {
    if (!n) return "";
    for (
        var r = /(\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\/)|(\/\/.*)/g,
            n = n.replace(r, ""),
            s = n.split(`
`),
            a = [],
            o = 0;
        o < s.length;
        ++o
    ) {
        var l = s[o],
            c = l.indexOf("//");
        c != -1 && (l = s[o].substr(0, c)),
            (l = l.trim()),
            l.length && a.push(l);
    }
    return a.join(
        t
            ? ""
            : `
`
    );
};
Shader.prototype.toViewport = function (e) {
    var t = GL$1.Mesh.getScreenQuad();
    e && this.uniforms(e), this.draw(t);
};
Shader.getScreenShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":screen"];
    return (
        t ||
        ((t = e.shaders[":screen"] =
            new GL$1.Shader(
                Shader.SCREEN_VERTEX_SHADER,
                Shader.SCREEN_FRAGMENT_SHADER
            )),
        t.uniforms({ u_texture: 0 }))
    );
};
Shader.getFlatScreenShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":flat_screen"];
    return (
        t ||
        ((t = e.shaders[":flat_screen"] =
            new GL$1.Shader(
                Shader.SCREEN_VERTEX_SHADER,
                Shader.FLAT_FRAGMENT_SHADER
            )),
        t.uniforms({ u_color: [1, 1, 1, 1] }))
    );
};
Shader.getColoredScreenShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":colored_screen"];
    return (
        t ||
        ((t = e.shaders[":colored_screen"] =
            new GL$1.Shader(
                Shader.SCREEN_VERTEX_SHADER,
                Shader.SCREEN_COLORED_FRAGMENT_SHADER
            )),
        t.uniforms({
            u_texture: 0,
            u_color: vec4.fromValues(1, 1, 1, 1),
        }))
    );
};
Shader.getQuadShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":quad"];
    return (
        t ||
        (e.shaders[":quad"] = new GL$1.Shader(
            Shader.QUAD_VERTEX_SHADER,
            Shader.QUAD_FRAGMENT_SHADER
        ))
    );
};
Shader.getPartialQuadShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":quad2"];
    return (
        t ||
        (e.shaders[":quad2"] = new GL$1.Shader(
            Shader.QUAD_VERTEX_SHADER,
            Shader.QUAD2_FRAGMENT_SHADER
        ))
    );
};
Shader.getBlendShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":blend"];
    return (
        t ||
        (e.shaders[":blend"] = new GL$1.Shader(
            Shader.SCREEN_VERTEX_SHADER,
            Shader.BLEND_FRAGMENT_SHADER
        ))
    );
};
Shader.getBlurShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":blur"];
    if (t) return t;
    var t = new GL$1.Shader(
        Shader.SCREEN_VERTEX_SHADER,
        `
			precision highp float;
			varying vec2 v_coord;
			uniform sampler2D u_texture;
			uniform vec2 u_offset;
			uniform float u_intensity;
			void main() {
			   vec4 sum = vec4(0.0);
			   sum += texture2D(u_texture, v_coord + u_offset * -4.0) * 0.05/0.98;
			   sum += texture2D(u_texture, v_coord + u_offset * -3.0) * 0.09/0.98;
			   sum += texture2D(u_texture, v_coord + u_offset * -2.0) * 0.12/0.98;
			   sum += texture2D(u_texture, v_coord + u_offset * -1.0) * 0.15/0.98;
			   sum += texture2D(u_texture, v_coord) * 0.16/0.98;
			   sum += texture2D(u_texture, v_coord + u_offset * 4.0) * 0.05/0.98;
			   sum += texture2D(u_texture, v_coord + u_offset * 3.0) * 0.09/0.98;
			   sum += texture2D(u_texture, v_coord + u_offset * 2.0) * 0.12/0.98;
			   sum += texture2D(u_texture, v_coord + u_offset * 1.0) * 0.15/0.98;
			   gl_FragColor = u_intensity * sum;
			}
			`
    );
    return (e.shaders[":blur"] = t);
};
Shader.getCopyDepthShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":copy_depth"];
    if (t) return t;
    var t = new GL$1.Shader(
        Shader.SCREEN_VERTEX_SHADER,
        `
			#extension GL_EXT_frag_depth : enable
			precision highp float;
			varying vec2 v_coord;
			uniform sampler2D u_texture;
			void main() {
			   gl_FragDepthEXT = texture2D( u_texture, v_coord ).x;
			   gl_FragColor = vec4(1.0);
			}
			`
    );
    return (e.shaders[":copy_depth"] = t);
};
Shader.getCubemapShowShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":show_cubemap"];
    if (t) return t;
    var t = new GL$1.Shader(
        Shader.DEFAULT_VERTEX_SHADER,
        `
			precision highp float;
			varying vec3 v_normal;
			uniform samplerCube u_texture;
			void main() {
			   gl_FragColor = textureCube( u_texture, v_normal );
			}
			`
    );
    return t.uniforms({ u_texture: 0 }), (e.shaders[":show_cubemap"] = t);
};
Shader.getPolarToCubemapShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":polar_to_cubemap"];
    if (t) return t;
    var t = new GL$1.Shader(
        Shader.SCREEN_VERTEX_SHADER,
        `
			precision highp float;
			varying vec2 v_coord;
			uniform sampler2D u_texture;
			uniform mat3 u_rotation;
			void main() {
				vec2 uv = vec2( v_coord.x, 1.0 - v_coord.y );
				vec3 dir = normalize( vec3( uv - vec2(0.5), 0.5 ));
				dir = u_rotation * dir;
				float u = atan(dir.x,dir.z) / 6.28318531;
				float v = (asin(dir.y) / 1.57079633) * 0.5 + 0.5;
				u = mod(u,1.0);
				v = mod(v,1.0);
			   gl_FragColor = texture2D( u_texture, vec2(u,v) );
			}
			`
    );
    return (e.shaders[":polar_to_cubemap"] = t);
};
Shader.getCubemapCopyShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":copy_cubemap"];
    if (t) return t;
    var t = new GL$1.Shader(
        Shader.SCREEN_VERTEX_SHADER,
        `
			precision highp float;
			varying vec2 v_coord;
			uniform samplerCube u_texture;
			uniform mat3 u_rotation;
			void main() {
				vec2 uv = vec2( v_coord.x, 1.0 - v_coord.y );
				vec3 dir = vec3( uv - vec2(0.5), 0.5 );
				dir = u_rotation * dir;
			   gl_FragColor = textureCube( u_texture, dir );
			}
			`
    );
    return (e.shaders[":copy_cubemap"] = t);
};
Shader.getCubemapBlurShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":blur_cubemap"];
    if (t) return t;
    var t = new GL$1.Shader(
        Shader.SCREEN_VERTEX_SHADER,
        `
			#ifndef NUM_SAMPLES
				#define NUM_SAMPLES 4
			#endif
			
			precision highp float;
			varying vec2 v_coord;
			uniform samplerCube u_texture;
			uniform mat3 u_rotation;
			uniform vec2 u_offset;
			uniform float u_intensity;
			void main() {
				vec4 sum = vec4(0.0);
				vec2 uv = vec2( v_coord.x, 1.0 - v_coord.y ) - vec2(0.5);
				vec3 dir = vec3(0.0);
				vec4 color = vec4(0.0);
				for( int x = -2; x <= 2; x++ )
				{
					for( int y = -2; y <= 2; y++ )
					{
						dir.xy = uv + vec2( u_offset.x * float(x), u_offset.y * float(y)) * 0.5;
						dir.z = 0.5;
						dir = u_rotation * dir;
						color = textureCube( u_texture, dir );
						color.xyz = color.xyz * color.xyz;/*linearize*/
						sum += color;
					}
				}
				sum /= 25.0;
			   gl_FragColor = vec4( sqrt( sum.xyz ), sum.w ) ;
			}
			`
    );
    return (e.shaders[":blur_cubemap"] = t);
};
Shader.FXAA_FUNC = `
	uniform vec2 u_viewportSize;
	uniform vec2 u_iViewportSize;
	#define FXAA_REDUCE_MIN   (1.0/ 128.0)
	#define FXAA_REDUCE_MUL   (1.0 / 8.0)
	#define FXAA_SPAN_MAX     8.0
	
	/* from mitsuhiko/webgl-meincraft based on the code on geeks3d.com */
	/* fragCoord MUST BE IN PIXELS */
	vec4 applyFXAA(sampler2D tex, vec2 fragCoord)
	{
		vec4 color = vec4(0.0);
		/*vec2 u_iViewportSize = vec2(1.0 / u_viewportSize.x, 1.0 / u_viewportSize.y);*/
		vec3 rgbNW = texture2D(tex, (fragCoord + vec2(-1.0, -1.0)) * u_iViewportSize).xyz;
		vec3 rgbNE = texture2D(tex, (fragCoord + vec2(1.0, -1.0)) * u_iViewportSize).xyz;
		vec3 rgbSW = texture2D(tex, (fragCoord + vec2(-1.0, 1.0)) * u_iViewportSize).xyz;
		vec3 rgbSE = texture2D(tex, (fragCoord + vec2(1.0, 1.0)) * u_iViewportSize).xyz;
		vec3 rgbM  = texture2D(tex, fragCoord  * u_iViewportSize).xyz;
		vec3 luma = vec3(0.299, 0.587, 0.114);
		float lumaNW = dot(rgbNW, luma);
		float lumaNE = dot(rgbNE, luma);
		float lumaSW = dot(rgbSW, luma);
		float lumaSE = dot(rgbSE, luma);
		float lumaM  = dot(rgbM,  luma);
		float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
		float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));
		
		vec2 dir;
		dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
		dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));
		
		float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
		
		float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
		dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX), max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), dir * rcpDirMin)) * u_iViewportSize;
		
		vec3 rgbA = 0.5 * (texture2D(tex, fragCoord * u_iViewportSize + dir * (1.0 / 3.0 - 0.5)).xyz + 
			texture2D(tex, fragCoord * u_iViewportSize + dir * (2.0 / 3.0 - 0.5)).xyz);
		vec3 rgbB = rgbA * 0.5 + 0.25 * (texture2D(tex, fragCoord * u_iViewportSize + dir * -0.5).xyz + 
			texture2D(tex, fragCoord * u_iViewportSize + dir * 0.5).xyz);
		
		//return vec4(rgbA,1.0);
		float lumaB = dot(rgbB, luma);
		if ((lumaB < lumaMin) || (lumaB > lumaMax))
			color = vec4(rgbA, 1.0);
		else
			color = vec4(rgbB, 1.0);
		return color;
	}
`;
Shader.getFXAAShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":fxaa"];
    if (t) return t;
    var t = new GL$1.Shader(
            Shader.SCREEN_VERTEX_SHADER,
            `
			precision highp float;
			varying vec2 v_coord;
			uniform sampler2D u_texture;
			` +
                Shader.FXAA_FUNC +
                `
			
			void main() {
			   gl_FragColor = applyFXAA( u_texture, v_coord * u_viewportSize) ;
			}
			`
        ),
        r = vec2.fromValues(e.viewport_data[2], e.viewport_data[3]),
        n = vec2.fromValues(1 / e.viewport_data[2], 1 / e.viewport_data[3]);
    return (
        (t.setup = function () {
            (r[0] = e.viewport_data[2]),
                (r[1] = e.viewport_data[3]),
                (n[0] = 1 / e.viewport_data[2]),
                (n[1] = 1 / e.viewport_data[3]),
                this.uniforms({ u_viewportSize: r, u_iViewportSize: n });
        }),
        (e.shaders[":fxaa"] = t)
    );
};
Shader.getFlatShader = function (e) {
    e = e || global.gl;
    var t = e.shaders[":flat"];
    if (t) return t;
    var t = new GL$1.Shader(
        Shader.FLAT_VERTEX_SHADER,
        Shader.FLAT_FRAGMENT_SHADER
    );
    return t.uniforms({ u_color: [1, 1, 1, 1] }), (e.shaders[":flat"] = t);
};
GL$1.create = function (e) {
    e = e || {};
    var t = null;
    if (e.canvas)
        if (typeof e.canvas == "string") {
            if (((t = document.getElementById(e.canvas)), !t))
                throw "Canvas element not found: " + e.canvas;
        } else t = e.canvas;
    else {
        var r = null;
        if (
            (e.container &&
                (r =
                    e.container.constructor === String
                        ? document.querySelector(e.container)
                        : e.container),
            r && !e.width)
        ) {
            var n = r.getBoundingClientRect();
            (e.width = n.width), (e.height = n.height);
        }
        (t = createCanvas(e.width || 800, e.height || 600)),
            r && r.appendChild(t);
    }
    "alpha" in e || (e.alpha = !1);
    var s = null,
        a = null;
    if (
        (e.version == 2
            ? (a = ["webgl2", "experimental-webgl2"])
            : e.version == 1 || e.version === void 0
            ? (a = ["webgl", "experimental-webgl"])
            : e.version === 0 &&
              (a = [
                  "webgl2",
                  "experimental-webgl2",
                  "webgl",
                  "experimental-webgl",
              ]),
        !a)
    )
        throw "Incorrect WebGL version, must be 1 or 2";
    for (
        var o = {
                alpha: e.alpha === void 0 ? !0 : e.alpha,
                depth: e.depth === void 0 ? !0 : e.depth,
                stencil: e.stencil === void 0 ? !0 : e.stencil,
                antialias: e.antialias === void 0 ? !0 : e.antialias,
                premultipliedAlpha:
                    e.premultipliedAlpha === void 0 ? !0 : e.premultipliedAlpha,
                preserveDrawingBuffer:
                    e.preserveDrawingBuffer === void 0
                        ? !0
                        : e.preserveDrawingBuffer,
            },
            l = 0;
        l < a.length;
        ++l
    ) {
        try {
            s = t.getContext(a[l], o);
        } catch {}
        if (s) break;
    }
    if (!s)
        throw t.getContext("webgl")
            ? "WebGL supported but not with those parameters"
            : "WebGL not supported";
    (s.webgl_version = s.constructor.name === "WebGL2RenderingContext" ? 2 : 1),
        (global.gl = s),
        (t.is_webgl = !0),
        (t.gl = s),
        (s.context_id = this.last_context_id++),
        (s.extensions = {});
    for (var c = s.getSupportedExtensions(), l = 0; l < c.length; ++l)
        s.extensions[c[l]] = s.getExtension(c[l]);
    if (
        (s.webgl_version == 1
            ? (s.HIGH_PRECISION_FORMAT = s.extensions.OES_texture_half_float
                  ? GL$1.HALF_FLOAT_OES
                  : s.extensions.OES_texture_float
                  ? GL$1.FLOAT
                  : GL$1.UNSIGNED_BYTE)
            : (s.HIGH_PRECISION_FORMAT = GL$1.HALF_FLOAT_OES),
        (s.max_texture_units = s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS)),
        s._viewport_func
            ? console.warn("Creating LiteGL context over the same canvas twice")
            : ((s._viewport_func = s.viewport),
              (s.viewport_data = new Float32Array([
                  0,
                  0,
                  s.canvas.width,
                  s.canvas.height,
              ])),
              (s.viewport = function (g, A, G, M) {
                  var N = this.viewport_data;
                  (N[0] = g | 0),
                      (N[1] = A | 0),
                      (N[2] = G | 0),
                      (N[3] = M | 0),
                      this._viewport_func(g, A, G, M);
              }),
              (s.getViewport = function (g) {
                  return g
                      ? ((g[0] = s.viewport_data[0]),
                        (g[1] = s.viewport_data[1]),
                        (g[2] = s.viewport_data[2]),
                        (g[3] = s.viewport_data[3]),
                        g)
                      : new Float32Array(s.viewport_data);
              }),
              (s.setViewport = function (g, A) {
                  s.viewport_data.set(g),
                      A &&
                          (s.viewport_data[1] =
                              this.drawingBufferHeight - g[1] - g[3]),
                      this._viewport_func(g[0], s.viewport_data[1], g[2], g[3]);
              })),
        !GL$1.reverse)
    ) {
        GL$1.reverse = {};
        for (var l in s)
            s[l] && s[l].constructor === Number && (GL$1.reverse[s[l]] = l);
    }
    if (window.glMatrix == null)
        throw "glMatrix not found, LiteGL requires glMatrix to be included";
    var u = 0;
    (s.shaders = {}),
        (s.textures = {}),
        (s.meshes = {}),
        (s.draw_calls = 0),
        (s.makeCurrent = function () {
            global.gl = this;
        }),
        (s.execute = function (g) {
            var A = global.gl;
            (global.gl = this), g(), (global.gl = A);
        }),
        (s.animate = function (g) {
            if (g === !1) {
                global.cancelAnimationFrame(this._requestFrame_id),
                    (this._requestFrame_id = null);
                return;
            }
            var A = global.requestAnimationFrame,
                G = global.getTime(),
                M = this,
                N = 0;
            function I() {
                if (!s.destroyed) {
                    M._requestFrame_id = A(I);
                    var B = global.getTime(),
                        O = (B - G) * 1e-3;
                    if (
                        (M.mouse && (M.mouse.last_buttons = N),
                        (N = M.mouse.buttons),
                        M.onupdate && M.onupdate(O),
                        LEvent.trigger(M, "update", O),
                        M.ondraw)
                    ) {
                        var F = global.gl;
                        (global.gl = M),
                            M.ondraw(),
                            LEvent.trigger(M, "draw"),
                            (global.gl = F);
                    }
                    G = B;
                }
            }
            this._requestFrame_id = A(I);
        }),
        (s.destroy = function () {
            m &&
                (document.removeEventListener("keydown", m),
                document.removeEventListener("keyup", m)),
                d &&
                    (this.canvas.removeEventListener("mousedown", d),
                    this.canvas.removeEventListener("mousemove", d),
                    this.canvas.removeEventListener("mouseup", d),
                    this.canvas.addEventListener("drag", d),
                    this.canvas.addEventListener("dragstart", d),
                    this.canvas.addEventListener("wheel", d));
            for (var g in this.shaders)
                this.shaders[g].delete(), (this.shaders[g] = null);
            this.shaders = {};
            for (var g in this.meshes)
                this.meshes[g].deleteBuffers(), (this.meshes[g] = null);
            this.meshes = {};
            for (var g in this.textures)
                this.textures[g].delete(), (this.textures[g] = null);
            (this.textures = {}),
                this.canvas.parentNode &&
                    this.canvas.parentNode.removeChild(this.canvas),
                (this.destroyed = !0),
                global.gl == this && (global.gl = null);
        });
    var h = (s.mouse = {
        buttons: 0,
        //this should always be up-to-date with mouse state
        last_buttons: 0,
        //button state in the previous frame
        left_button: !1,
        middle_button: !1,
        right_button: !1,
        position: new Float32Array(2),
        x: 0,
        //in canvas coordinates
        y: 0,
        deltax: 0,
        deltay: 0,
        clientx: 0,
        //in client coordinates
        clienty: 0,
        isInsideRect: function (g, A, G, M, N) {
            var I = this.y;
            return (
                N && (I = s.canvas.height - I),
                this.x > g && this.x < g + G && I > A && I < A + M
            );
        },
        /**
         * returns true if button num is pressed (where num could be GL.LEFT_MOUSE_BUTTON, GL.RIGHT_MOUSE_BUTTON, GL.MIDDLE_MOUSE_BUTTON
         * @method captureMouse
         * @param {boolean} capture_wheel capture also the mouse wheel
         */
        isButtonPressed: function (g) {
            if (g == GL$1.LEFT_MOUSE_BUTTON)
                return this.buttons & GL$1.LEFT_MOUSE_BUTTON_MASK;
            if (g == GL$1.MIDDLE_MOUSE_BUTTON)
                return this.buttons & GL$1.MIDDLE_MOUSE_BUTTON_MASK;
            if (g == GL$1.RIGHT_MOUSE_BUTTON)
                return this.buttons & GL$1.RIGHT_MOUSE_BUTTON_MASK;
        },
        wasButtonPressed: function (g) {
            var A = 0;
            return (
                g == GL$1.LEFT_MOUSE_BUTTON
                    ? (A = GL$1.LEFT_MOUSE_BUTTON_MASK)
                    : g == GL$1.MIDDLE_MOUSE_BUTTON
                    ? (A = GL$1.MIDDLE_MOUSE_BUTTON_MASK)
                    : g == GL$1.RIGHT_MOUSE_BUTTON &&
                      (A = GL$1.RIGHT_MOUSE_BUTTON_MASK),
                this.buttons & A && !(this.last_buttons & A)
            );
        },
    });
    s.captureMouse = function (g, A) {
        t.addEventListener("mousedown", f),
            t.addEventListener("mousemove", f),
            t.addEventListener("drag", f),
            t.addEventListener("dragstart", f),
            g &&
                (t.addEventListener("mousewheel", f, !1),
                t.addEventListener("wheel", f, !1)),
            t.addEventListener("contextmenu", function (G) {
                return G.preventDefault(), !1;
            }),
            A && this.captureTouch(!0);
    };
    function f(g) {
        if (!s.ignore_events) {
            var A = s.mouse.buttons;
            GL$1.augmentEvent(g, t), (g.eventType = g.eventType || g.type);
            var G = global.getTime();
            if (
                ((h.dragging = g.dragging),
                (h.position[0] = g.canvasx),
                (h.position[1] = g.canvasy),
                (h.x = g.canvasx),
                (h.y = g.canvasy),
                (h.mousex = g.mousex),
                (h.mousey = g.mousey),
                (h.canvasx = g.canvasx),
                (h.canvasy = g.canvasy),
                (h.clientx = g.mousex),
                (h.clienty = g.mousey),
                (h.buttons = g.buttons),
                (h.left_button = !!(h.buttons & GL$1.LEFT_MOUSE_BUTTON_MASK)),
                (h.middle_button = !!(
                    h.buttons & GL$1.MIDDLE_MOUSE_BUTTON_MASK
                )),
                (h.right_button = !!(h.buttons & GL$1.RIGHT_MOUSE_BUTTON_MASK)),
                g.eventType == "mousedown")
            ) {
                if (A == 0) {
                    t.removeEventListener("mousemove", f);
                    var M = t.ownerDocument;
                    M.addEventListener("mousemove", f),
                        M.addEventListener("mouseup", f);
                }
                (u = G),
                    s.onmousedown && s.onmousedown(g),
                    LEvent.trigger(s, "mousedown");
            } else if (g.eventType == "mousemove")
                s.onmousemove && s.onmousemove(g),
                    LEvent.trigger(s, "mousemove", g);
            else if (g.eventType == "mouseup") {
                if (s.mouse.buttons == 0) {
                    t.addEventListener("mousemove", f);
                    var M = t.ownerDocument;
                    M.removeEventListener("mousemove", f),
                        M.removeEventListener("mouseup", f);
                }
                (g.click_time = G - u),
                    s.onmouseup && s.onmouseup(g),
                    LEvent.trigger(s, "mouseup", g);
            } else
                g.eventType == "mousewheel" ||
                g.eventType == "wheel" ||
                g.eventType == "DOMMouseScroll"
                    ? ((g.eventType = "mousewheel"),
                      g.type == "wheel"
                          ? (g.wheel = -g.deltaY)
                          : (g.wheel =
                                g.wheelDeltaY != null
                                    ? g.wheelDeltaY
                                    : g.detail * -60),
                      (g.delta =
                          g.wheelDelta !== void 0
                              ? g.wheelDelta / 40
                              : g.deltaY
                              ? -g.deltaY / 3
                              : 0),
                      s.onmousewheel && s.onmousewheel(g),
                      LEvent.trigger(s, "mousewheel", g))
                    : g.eventType == "dragstart" &&
                      (s.ondragstart && s.ondragstart(g),
                      LEvent.trigger(s, "dragstart", g));
            if ((s.onmouse && s.onmouse(g), !g.skip_preventDefault))
                return (
                    g.eventType != "mousemove" && g.stopPropagation(),
                    g.preventDefault(),
                    !1
                );
        }
    }
    var d = f,
        p = !1;
    s.captureTouch = function (g) {
        (p = g),
            t.addEventListener("touchstart", _, !0),
            t.addEventListener("touchmove", _, !0),
            t.addEventListener("touchend", _, !0),
            t.addEventListener("touchcancel", _, !0),
            t.addEventListener("gesturestart", E),
            t.addEventListener("gesturechange", E),
            t.addEventListener("gestureend", E);
    };
    function _(g) {
        var A = g.changedTouches,
            G = A[0],
            M = "";
        if (
            !(s.ontouch && s.ontouch(g) === !0) &&
            LEvent.trigger(s, g.type, g) !== !0 &&
            p &&
            !(
                g.touches.length &&
                g.changedTouches[0].identifier !== g.touches[0].identifier
            ) &&
            !(A > 1)
        ) {
            switch (g.type) {
                case "touchstart":
                    M = "mousedown";
                    break;
                case "touchmove":
                    M = "mousemove";
                    break;
                case "touchend":
                    M = "mouseup";
                    break;
                default:
                    return;
            }
            var N = document.createEvent("MouseEvent");
            N.initMouseEvent(
                M,
                !0,
                !0,
                window,
                1,
                G.screenX,
                G.screenY,
                G.clientX,
                G.clientY,
                !1,
                !1,
                !1,
                !1,
                0,
                null
            ),
                (N.originalEvent = N),
                (N.is_touch = !0),
                G.target.dispatchEvent(N),
                g.preventDefault();
        }
    }
    function E(g) {
        (g.eventType = g.type),
            !(s.ongesture && s.ongesture(g) === !1) &&
                LEvent.trigger(s, g.type, g) !== !1 &&
                g.preventDefault();
    }
    s.keys = {};
    var m = null;
    s.captureKeys = function (g, A) {
        if (m) return;
        (s.keys = {}),
            A && s.canvas,
            document.addEventListener("keydown", G),
            document.addEventListener("keyup", G);
        function G(M) {
            b(M, g);
        }
        m = G;
    };
    function b(g, A) {
        g.eventType = g.type;
        var G = g.target.nodeName.toLowerCase();
        if (
            !(
                G === "input" ||
                G === "textarea" ||
                G === "select" ||
                g.target.contentEditable === "true"
            )
        ) {
            g.character = String.fromCharCode(g.keyCode).toLowerCase();
            var M = !1,
                N = GL$1.mapKeyCode(g.keyCode);
            N || (N = g.character);
            var I = g.altKey || g.ctrlKey || g.metaKey;
            I ||
                (N && (s.keys[N] = g.type == "keydown"),
                (M = s.keys[g.keyCode]),
                (s.keys[g.keyCode] = g.type == "keydown")),
                (M != s.keys[g.keyCode] || I) &&
                    (g.type == "keydown" && s.onkeydown
                        ? s.onkeydown(g)
                        : g.type == "keyup" && s.onkeyup && s.onkeyup(g),
                    LEvent.trigger(s, g.type, g)),
                s.onkey && s.onkey(g),
                A &&
                    (g.isChar ||
                        GL$1.blockable_keys[g.keyIdentifier || g.key]) &&
                    g.preventDefault();
        }
    }
    (s.gamepads = null),
        (s.captureGamepads = function () {
            var g =
                navigator.getGamepads ||
                navigator.webkitGetGamepads ||
                navigator.mozGetGamepads;
            g && (this.gamepads = g.call(navigator));
        }),
        (s.getGamepads = function (g) {
            var A =
                navigator.getGamepads ||
                navigator.webkitGetGamepads ||
                navigator.mozGetGamepads;
            if (A) {
                var G = A.call(navigator);
                this.gamepads || (this.gamepads = []);
                for (var M = 0; M < 4; M++) {
                    var N = G[M];
                    if ((N && !g && L(N), N && !N.prev_buttons)) {
                        N.prev_buttons = new Uint8Array(32);
                        var I = new CustomEvent("gamepadconnected");
                        (I.eventType = I.type),
                            (I.gamepad = N),
                            this.ongamepadconnected &&
                                this.ongamepadconnected(I),
                            LEvent.trigger(s, "gamepadconnected", I);
                    }
                    if (N)
                        for (var B = 0; B < N.buttons.length; ++B) {
                            var O = N.buttons[B];
                            if (
                                ((O.was_pressed = !1),
                                O.pressed && !N.prev_buttons[B])
                            ) {
                                O.was_pressed = !0;
                                var I = new CustomEvent("gamepadButtonDown");
                                (I.eventType = I.type),
                                    (I.button = O),
                                    (I.which = B),
                                    (I.gamepad = N),
                                    s.onbuttondown && s.onbuttondown(I),
                                    LEvent.trigger(s, "buttondown", I);
                            } else if (!O.pressed && N.prev_buttons[B]) {
                                var I = new CustomEvent("gamepadButtonUp");
                                (I.eventType = I.type),
                                    (I.button = O),
                                    (I.which = B),
                                    (I.gamepad = N),
                                    s.onbuttondown && s.onbuttondown(I),
                                    LEvent.trigger(s, "buttonup", I);
                            }
                            N.prev_buttons[B] = O.pressed ? 1 : 0;
                        }
                }
                return (this.gamepads = G), G;
            }
        });
    function L(g) {
        var A = g.xbox || { axes: [], buttons: {}, hat: "" };
        (A.axes.lx = g.axes[0]),
            (A.axes.ly = g.axes[1]),
            (A.axes.rx = g.axes[2]),
            (A.axes.ry = g.axes[3]),
            (A.axes.triggers = g.axes[4]);
        for (var G = 0; G < g.buttons.length; G++)
            switch (G) {
                case 0:
                    A.buttons.a = g.buttons[G].pressed;
                    break;
                case 1:
                    A.buttons.b = g.buttons[G].pressed;
                    break;
                case 2:
                    A.buttons.x = g.buttons[G].pressed;
                    break;
                case 3:
                    A.buttons.y = g.buttons[G].pressed;
                    break;
                case 4:
                    A.buttons.lb = g.buttons[G].pressed;
                    break;
                case 5:
                    A.buttons.rb = g.buttons[G].pressed;
                    break;
                case 6:
                    A.buttons.lt = g.buttons[G].pressed;
                    break;
                case 7:
                    A.buttons.rt = g.buttons[G].pressed;
                    break;
                case 8:
                    A.buttons.back = g.buttons[G].pressed;
                    break;
                case 9:
                    A.buttons.start = g.buttons[G].pressed;
                    break;
                case 10:
                    A.buttons.ls = g.buttons[G].pressed;
                    break;
                case 11:
                    A.buttons.rs = g.buttons[G].pressed;
                    break;
                case 12:
                    g.buttons[G].pressed && (A.hat += "up");
                    break;
                case 13:
                    g.buttons[G].pressed && (A.hat += "down");
                    break;
                case 14:
                    g.buttons[G].pressed && (A.hat += "left");
                    break;
                case 15:
                    g.buttons[G].pressed && (A.hat += "right");
                    break;
                case 16:
                    A.buttons.home = g.buttons[G].pressed;
                    break;
            }
        g.xbox = A;
    }
    (s.fullscreen = function () {
        var g = this.canvas;
        g.requestFullScreen
            ? g.requestFullScreen()
            : g.webkitRequestFullScreen
            ? g.webkitRequestFullScreen()
            : g.mozRequestFullScreen
            ? g.mozRequestFullScreen()
            : console.error("Fullscreen not supported");
    }),
        (s.snapshot = function (g, A, G, M, N) {
            var I = createCanvas(G, M),
                P = I.getContext("2d"),
                B = P.getImageData(0, 0, I.width, I.height),
                O = new Uint8Array(G * M * 4);
            if (
                (s.readPixels(
                    g,
                    A,
                    I.width,
                    I.height,
                    s.RGBA,
                    s.UNSIGNED_BYTE,
                    O
                ),
                B.data.set(O),
                P.putImageData(B, 0, 0),
                N)
            )
                return I;
            var F = createCanvas(G, M),
                P = F.getContext("2d");
            return P.translate(0, M), P.scale(1, -1), P.drawImage(I, 0, 0), F;
        });
    var T = {};
    return (
        (s.loadTexture = function (g, A, G) {
            if (this.textures[g]) return this.textures[g];
            if (T[g]) return null;
            var M = new Image();
            return (
                (M.url = g),
                (M.onload = function () {
                    var N = GL$1.Texture.fromImage(this, A);
                    (N.img = this),
                        (s.textures[this.url] = N),
                        delete T[this.url],
                        G && G(N);
                }),
                (M.src = g),
                (T[g] = !0),
                null
            );
        }),
        (s.drawTexture = (function () {
            var g = mat3.create(),
                A = vec2.create(),
                G = vec2.create(),
                M = vec4.create(),
                N = vec4.fromValues(1, 1, 1, 1),
                I = vec2.create(),
                B = {
                    u_texture: 0,
                    u_position: A,
                    u_color: N,
                    u_size: G,
                    u_texture_area: M,
                    u_viewport: I,
                    u_transform: g,
                };
            return function (O, F, P, C, U, X, z, q, Y, H, Z) {
                (A[0] = F),
                    (A[1] = P),
                    C === void 0 && (C = O.width),
                    U === void 0 && (U = O.height),
                    (G[0] = C),
                    (G[1] = U),
                    X === void 0 && (X = 0),
                    z === void 0 && (z = 0),
                    q === void 0 && (q = O.width),
                    Y === void 0 && (Y = O.height),
                    (M[0] = X / O.width),
                    (M[1] = z / O.height),
                    (M[2] = (X + q) / O.width),
                    (M[3] = (z + Y) / O.height),
                    (I[0] = this.viewport_data[2]),
                    (I[1] = this.viewport_data[3]),
                    (H = H || Shader.getPartialQuadShader(this));
                var oe = Mesh.getScreenQuad(this);
                O.bind(0),
                    H.uniforms(B),
                    Z && H.uniforms(Z),
                    H.draw(oe, s.TRIANGLES);
            };
        })()),
        s.canvas.addEventListener(
            "webglcontextlost",
            function (g) {
                g.preventDefault(),
                    (s.context_lost = !0),
                    s.onlosecontext && s.onlosecontext(g);
            },
            !1
        ),
        (s.reset = function () {
            s.viewport(0, 0, this.canvas.width, this.canvas.height),
                s.disable(s.BLEND),
                s.disable(s.CULL_FACE),
                s.disable(s.DEPTH_TEST),
                s.frontFace(s.CCW),
                (s._current_texture_drawto = null),
                (s._current_fbo_color = null),
                (s._current_fbo_depth = null);
        }),
        (s.dump = function () {
            console.log("userAgent: ", navigator.userAgent),
                console.log("Supported extensions:");
            var g = s.getSupportedExtensions();
            console.log(g.join(","));
            var A = [
                "VENDOR",
                "VERSION",
                "MAX_VERTEX_ATTRIBS",
                "MAX_VARYING_VECTORS",
                "MAX_VERTEX_UNIFORM_VECTORS",
                "MAX_VERTEX_TEXTURE_IMAGE_UNITS",
                "MAX_FRAGMENT_UNIFORM_VECTORS",
                "MAX_TEXTURE_SIZE",
                "MAX_TEXTURE_IMAGE_UNITS",
            ];
            console.log("WebGL info:");
            for (var G in A)
                console.log(" * " + A[G] + ": " + s.getParameter(s[A[G]]));
            console.log("*************************************************");
        }),
        s.reset(),
        s
    );
};
GL$1.mapKeyCode = function (e) {
    var t = {
        8: "BACKSPACE",
        9: "TAB",
        13: "ENTER",
        16: "SHIFT",
        17: "CTRL",
        27: "ESCAPE",
        32: "SPACE",
        33: "PAGEUP",
        34: "PAGEDOWN",
        35: "END",
        36: "HOME",
        37: "LEFT",
        38: "UP",
        39: "RIGHT",
        40: "DOWN",
    };
    return t[e] || (e >= 65 && e <= 90 ? String.fromCharCode(e) : null);
};
GL$1.dragging = !1;
GL$1.last_pos = [0, 0];
GL$1.augmentEvent = function (e, t) {
    var r = null;
    (t = t || e.target || gl.canvas),
        (r = t.getBoundingClientRect()),
        (e.mousex = e.clientX - r.left),
        (e.mousey = e.clientY - r.top),
        (e.canvasx = e.mousex),
        (e.canvasy = r.height - e.mousey),
        (e.deltax = 0),
        (e.deltay = 0),
        e.is_touch && (gl.mouse.buttons = e.which),
        document.pointerLockElement === t &&
            ((e.canvasx = e.mousex = r.width * 0.5),
            (e.canvasy = e.mousey = r.height * 0.5)),
        e.type == "mousedown"
            ? (this.dragging = !0)
            : e.type == "mousemove" ||
              (e.type == "mouseup" && e.buttons == 0 && (this.dragging = !1)),
        e.movementX !== void 0 && !e.is_touch && !GL$1.isMobile()
            ? ((e.deltax = e.movementX), (e.deltay = e.movementY))
            : ((e.deltax = e.mousex - this.last_pos[0]),
              (e.deltay = e.mousey - this.last_pos[1])),
        (this.last_pos[0] = e.mousex),
        (this.last_pos[1] = e.mousey),
        (e.dragging = this.dragging),
        (e.leftButton = !!(gl.mouse.buttons & GL$1.LEFT_MOUSE_BUTTON_MASK)),
        (e.middleButton = !!(gl.mouse.buttons & GL$1.MIDDLE_MOUSE_BUTTON_MASK)),
        (e.rightButton = !!(gl.mouse.buttons & GL$1.RIGHT_MOUSE_BUTTON_MASK)),
        (e.buttons_mask = 0),
        e.leftButton && (e.buttons_mask = 1),
        e.middleButton && (e.buttons_mask |= 2),
        e.rightButton && (e.buttons_mask |= 4),
        (e.isButtonPressed = function (n) {
            return this.buttons_mask & (1 << n);
        });
};
GL$1.isMobile = function () {
    return this.mobile !== void 0
        ? this.mobile
        : global.navigator
        ? navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/SamsungBrowser/i) ||
          navigator.userAgent.match(/Mobile VR/i) ||
          navigator.userAgent.match(/Android/i)
            ? (this.mobile = !0)
            : (this.mobile = !1)
        : (this.mobile = !1);
};
var LEvent =
    (global.LEvent =
    GL$1.LEvent =
        {
            /**
             * Binds an event to an instance
             * @method LEvent.bind
             * @param {Object} instance where to attach the event
             * @param {String} event_name string defining the event name
             * @param {function} callback function to call when the event is triggered
             * @param {Object} target_instance [Optional] instance to call the function (use this instead of .bind method to help removing events)
             **/
            bind: function (e, t, r, n) {
                if (!e) throw "cannot bind event to null";
                if (!r) throw "cannot bind to null callback";
                if (e.constructor === String)
                    throw "cannot bind event to a string";
                (this.target_instance = n),
                    (this.callback = r),
                    (this.instance = e);
                var s = e.__levents;
                s ||
                    (Object.defineProperty(e, "__levents", {
                        value: {},
                        enumerable: !1,
                    }),
                    (s = e.__levents)),
                    Object.prototype.hasOwnProperty.call(s, t)
                        ? s[t].push([r, n])
                        : (s[t] = [[r, n]]),
                    e.onLEventBinded && e.onLEventBinded(t, r, n);
            },
            /**
             * Unbinds an event from an instance
             * @method LEvent.unbind
             * @param {Object} instance where the event is binded
             * @param {String} event_name string defining the event name
             * @param {function} callback function that was binded
             * @param {Object} target_instance [Optional] target_instance that was binded
             **/
            unbind: function (e, t, r, n) {
                if (!e) throw "cannot unbind event to null";
                if (!r) throw "cannot unbind from null callback";
                if (e.constructor === String)
                    throw "cannot bind event to a string";
                var s = e.__levents;
                if (s && Object.prototype.hasOwnProperty.call(s, t)) {
                    for (var a = 0, o = s[t].length; a < o; ++a) {
                        var l = s[t][a];
                        if (l[0] === r && l[1] === n) {
                            s[t].splice(a, 1);
                            break;
                        }
                    }
                    s[t].length == 0 && delete s[t],
                        e.onLEventUnbinded && e.onLEventUnbinded(t, r, n);
                }
            },
            /**
             * Unbinds all events from an instance (or the ones that match certain target_instance)
             * @method LEvent.unbindAll
             * @param {Object} instance where the events are binded
             * @param {Object} target_instance [Optional] target_instance of the events to remove
             **/
            unbindAll: function (e, t, r) {
                if (!e) throw "cannot unbind events in null";
                var n = e.__levents;
                if (n) {
                    if (
                        (e.onLEventUnbindAll && e.onLEventUnbindAll(t, r), !t)
                    ) {
                        delete e.__levents;
                        return;
                    }
                    for (var s in n)
                        for (var a = n[s], o = a.length - 1; o >= 0; --o)
                            a[o][1] != t ||
                                (r && r !== a[o][0]) ||
                                a.splice(o, 1);
                }
            },
            /**
             * Unbinds all callbacks associated to one specific event from this instance
             * @method LEvent.unbindAll
             * @param {Object} instance where the events are binded
             * @param {String} event name of the event you want to remove all binds
             **/
            unbindAllEvent: function (e, t) {
                if (!e) throw "cannot unbind events in null";
                var r = e.__levents;
                r &&
                    (delete r[t],
                    e.onLEventUnbindAll &&
                        e.onLEventUnbindAll(
                            t,
                            this.target_instance,
                            this.callback
                        ));
            },
            /**
             * Tells if there is a binded callback that matches the criteria
             * @method LEvent.isBind
             * @param {Object} instance where the are the events binded
             * @param {String} event_name string defining the event name
             * @param {function} callback the callback
             * @param {Object} target_instance [Optional] instance binded to callback
             **/
            isBind: function (e, t, r, n) {
                if (!e) throw "LEvent cannot have null as instance";
                var s = e.__levents;
                if (s) {
                    if (!Object.prototype.hasOwnProperty.call(s, t)) return !1;
                    for (var a = 0, o = s[t].length; a < o; ++a) {
                        var l = s[t][a];
                        if (l[0] === r && l[1] === n) return !0;
                    }
                    return !1;
                }
            },
            /**
             * Tells if there is any callback binded to this event
             * @method LEvent.hasBind
             * @param {Object} instance where the are the events binded
             * @param {String} event_name string defining the event name
             * @return {boolean} true is there is at least one
             **/
            hasBind: function (e, t) {
                if (!e) throw "LEvent cannot have null as instance";
                var r = e.__levents;
                return !(
                    !r ||
                    !Object.prototype.hasOwnProperty.call(r, t) ||
                    !r[t].length
                );
            },
            /**
             * Tells if there is any callback binded to this object pointing to a method in the target object
             * @method LEvent.hasBindTo
             * @param {Object} instance where there are the events binded
             * @param {Object} target instance to check to
             * @return {boolean} true is there is at least one
             **/
            hasBindTo: function (e, t) {
                if (!e) throw "LEvent cannot have null as instance";
                var r = e.__levents;
                if (!r) return !1;
                for (var n in r)
                    for (var s = r[n], a = 0; a < s.length; ++a)
                        if (s[a][1] === t) return !0;
                return !1;
            },
            /**
             * Triggers and event in an instance
             * If the callback returns true then it will stop the propagation and return true
             * @method LEvent.trigger
             * @param {Object} instance that triggers the event
             * @param {String} event_name string defining the event name
             * @param {*} parameters that will be received by the binded function
             * @param {bool} reverse_order trigger in reverse order (binded last get called first)
             * @param {bool} expand_parameters parameters are passed not as one single parameter, but as many
             * return {bool} true if the event passed was blocked by any binded callback
             **/
            trigger: function (e, t, r, n, s) {
                if (!e) throw "cannot trigger event from null";
                if (e.constructor === String)
                    throw "cannot bind event to a string";
                var a = e.__levents;
                if (!a || !Object.prototype.hasOwnProperty.call(a, t))
                    return !1;
                var o = a[t];
                if (n)
                    for (var l = o.length - 1; l >= 0; --l) {
                        var c = o[l];
                        if (s) {
                            if (c && c[0].apply(c[1], r) === !0) return !0;
                        } else if (c && c[0].call(c[1], t, r) === !0) return !0;
                    }
                else
                    for (var l = 0, u = o.length; l < u; ++l) {
                        var c = o[l];
                        if (s) {
                            if (c && c[0].apply(c[1], r) === !0) return !0;
                        } else if (c && c[0].call(c[1], t, r) === !0) return !0;
                    }
                return !1;
            },
            /**
             * Triggers and event to every element in an array.
             * If the event returns true, it must be intercepted
             * @method LEvent.triggerArray
             * @param {Array} array contains all instances to triggers the event
             * @param {String} event_name string defining the event name
             * @param {*} parameters that will be received by the binded function
             * @param {bool} reverse_order trigger in reverse order (binded last get called first)
             * @param {bool} expand_parameters parameters are passed not as one single parameter, but as many
             * return {bool} false
             **/
            triggerArray: function (e, t, r, n, s) {
                for (var a = !1, o = 0, l = e.length; o < l; ++o) {
                    var c = e[o];
                    if (!c) throw "cannot trigger event from null";
                    if (c.constructor === String)
                        throw "cannot bind event to a string";
                    var u = c.__levents;
                    if (!(!u || !Object.prototype.hasOwnProperty.call(u, t)))
                        if (n)
                            for (var h = u[t].length - 1; h >= 0; --h) {
                                var f = u[t][h];
                                if (s) {
                                    if (f[0].apply(f[1], r) === !0) {
                                        a = !0;
                                        break;
                                    }
                                } else if (f[0].call(f[1], t, r) === !0) {
                                    a = !0;
                                    break;
                                }
                            }
                        else
                            for (var h = 0, d = u[t].length; h < d; ++h) {
                                var f = u[t][h];
                                if (s) {
                                    if (f[0].apply(f[1], r) === !0) {
                                        a = !0;
                                        break;
                                    }
                                } else if (f[0].call(f[1], t, r) === !0) {
                                    a = !0;
                                    break;
                                }
                            }
                }
                return a;
            },
            extendObject: function (e) {
                (e.bind = function (t, r, n) {
                    return LEvent.bind(this, t, r, n);
                }),
                    (e.trigger = function (t, r) {
                        return LEvent.trigger(this, t, r);
                    }),
                    (e.unbind = function (t, r, n) {
                        return LEvent.unbind(this, t, r, this.instance);
                    }),
                    (e.unbindAll = function (t, r) {
                        return LEvent.unbindAll(this, t, r);
                    });
            },
            /**
             * Adds the methods to bind, trigger and unbind to this class prototype
             * @method LEvent.extendClass
             * @param {Object} constructor
             **/
            extendClass: function (e) {
                this.extendObject(e.prototype);
            },
        });
global.CLIP_INSIDE = GL$1.CLIP_INSIDE = 0;
global.CLIP_OUTSIDE = GL$1.CLIP_OUTSIDE = 1;
global.CLIP_OVERLAP = GL$1.CLIP_OVERLAP = 2;
global.geo = {
    last_t: -1,
    /**
     * Returns a float4 containing the info about a plane with normal N and that passes through point P
     * @method createPlane
     * @param {vec3} P
     * @param {vec3} N
     * @return {vec4} plane values
     */
    createPlane: function (e, t) {
        return new Float32Array([t[0], t[1], t[2], -vec3.dot(e, t)]);
    },
    /**
     * assigns a float4 containing the info about a plane that passes the three vertices
     * @method planeFromTriangle
     * @param {vec3} out
     * @param {vec3} A
     * @param {vec3} B
     * @param {vec3} C
     * @return {vec4} plane values
     */
    planeFromTriangle: (function () {
        var e = vec3.create(),
            t = vec3.create(),
            r = vec3.create();
        return function (n, s, a, o) {
            return (
                vec3.sub(e, a, s),
                vec3.sub(t, o, s),
                vec3.cross(r, e, t),
                vec3.normalize(r, r),
                (n[0] = r[0]),
                (n[1] = r[1]),
                (n[2] = r[2]),
                (n[3] = -vec3.dot(s, r)),
                n
            );
        };
    })(),
    /**
     * computes the normal of a triangle
     * @method computeTriangleNormal
     * @param {vec3} out
     * @param {vec3} A
     * @param {vec3} B
     * @param {vec3} C
     * @return {vec4} plane values
     */
    computeTriangleNormal: (function () {
        var e = vec3.create(),
            t = vec3.create(),
            r = vec3.create();
        return function (n, s, a, o) {
            return (
                vec3.sub(e, a, s),
                vec3.sub(t, o, s),
                vec3.cross(r, e, t),
                vec3.normalize(r, r),
                (n[0] = r[0]),
                (n[1] = r[1]),
                (n[2] = r[2]),
                n
            );
        };
    })(),
    /**
     * Computes the distance between the point and the plane
     * @method distancePointToPlane
     * @param {vec3} point
     * @param {vec4} plane
     * @return {Number} distance
     */
    distancePointToPlane: function (e, t) {
        return (
            (vec3.dot(e, t) + t[3]) /
            Math.sqrt(t[0] * t[0] + t[1] * t[1] + t[2] * t[2])
        );
    },
    /**
     * Computes the square distance between the point and the plane
     * @method distance2PointToPlane
     * @param {vec3} point
     * @param {vec4} plane
     * @return {Number} distance*distance
     */
    distance2PointToPlane: function (e, t) {
        return (
            (vec3.dot(e, t) + t[3]) / (t[0] * t[0] + t[1] * t[1] + t[2] * t[2])
        );
    },
    /**
     * Projects a 3D point on a 3D infinite line
     * @method projectPointOnLine
     * @param {vec3} P
     * @param {vec3} A line start
     * @param {vec3} B line end
     * @param {vec3} result to store result (optional)
     * @return {vec3} projectec point
     */
    projectPointOnLine: (function () {
        var e = vec3.create(),
            t = vec3.create();
        return function (r, n, s, a) {
            (a = a || vec3.create()), vec3.sub(e, r, n), vec3.sub(t, s, n);
            var o = vec3.dot(e, t) / vec3.dot(t, t);
            return (
                (a[0] = n[0] + o * t[0]),
                (a[1] = n[1] + o * t[1]),
                (a[2] = n[2] + o * t[2]),
                a
            );
        };
    })(),
    /**
     * Projects a 2D point on a 2D infinite line
     * @method project2DPointOnLine
     * @param {vec2} P
     * @param {vec2} A line start
     * @param {vec2} B line end
     * @param {vec2} result to store result (optional)
     * @return {vec2} projectec point
     */
    project2DPointOnLine: function (e, t, r, n) {
        n = n || vec2.create();
        var s = vec2.fromValues(e[0] - t[0], e[1] - t[1]),
            a = vec2.fromValues(r[0] - t[0], r[1] - t[1]),
            o = vec2.dot(s, a) / vec2.dot(a, a);
        return (n[0] = t[0] + o * a[0]), (n[1] = t[1] + o * a[1]), n;
    },
    /**
     * returns the closest point to a 3D segment
     * @method closestPointToSegment
     * @param {vec3} P
     * @param {vec3} A line start
     * @param {vec3} B line end
     * @param {vec3} result to store result (optional)
     * @return {vec3} projectec point
     */
    closestPointToSegment: (function () {
        var e = vec3.create(),
            t = vec3.create();
        return function (r, n, s, a) {
            (a = a || vec3.create()), vec3.sub(e, r, n), vec3.sub(t, s, n);
            var o = vec3.dot(e, t) / vec3.dot(t, t);
            return (
                (o = Math.min(1, Math.max(0, o))),
                (a[0] = n[0] + o * t[0]),
                (a[1] = n[1] + o * t[1]),
                (a[2] = n[2] + o * t[2]),
                a
            );
        };
    })(),
    /**
     * Projects point on plane
     * @method projectPointOnPlane
     * @param {vec3} point
     * @param {vec3} P plane point
     * @param {vec3} N plane normal
     * @param {vec3} result to store result (optional)
     * @return {vec3} projectec point
     */
    projectPointOnPlane: (function () {
        var e = vec3.create();
        return function (t, r, n, s) {
            (s = s || vec3.create()), vec3.sub(e, t, r);
            var a = vec3.dot(e, n);
            return vec3.scale(e, n, a), vec3.sub(s, t, e);
        };
    })(),
    /**
     * Tells if a coplanar point is inside the triangle
     * @method isPointInsideTriangle
     * @param {vec3} point
     * @param {vec3} A
     * @param {vec3} B
     * @param {vec3} C
     * @return {boolean}
     */
    isPointInsideTriangle: (function () {
        var e = vec3.create(),
            t = vec3.create(),
            r = vec3.create(),
            n = vec3.create(),
            s = vec3.create(),
            a = vec3.create();
        return function (o, l, c, u) {
            return (
                vec3.sub(e, l, o),
                vec3.sub(t, c, o),
                vec3.sub(r, u, o),
                vec3.cross(n, t, r),
                vec3.cross(s, r, e),
                vec3.cross(a, e, t),
                !(vec3.dot(n, s) < 0 || vec3.dot(n, a) < 0)
            );
        };
    })(),
    /**
     * Finds the reflected point over a plane (useful for reflecting camera position when rendering reflections)
     * @method reflectPointInPlane
     * @param {vec3} point point to reflect
     * @param {vec3} P point where the plane passes
     * @param {vec3} N normal of the plane
     * @return {vec3} reflected point
     */
    reflectPointInPlane: function (e, t, r) {
        var n = -1 * (t[0] * r[0] + t[1] * r[1] + t[2] * r[2]),
            s =
                -(n + r[0] * e[0] + r[1] * e[1] + r[2] * e[2]) /
                (r[0] * r[0] + r[1] * r[1] + r[2] * r[2]);
        return vec3.fromValues(
            e[0] + s * r[0] * 2,
            e[1] + s * r[1] * 2,
            e[2] + s * r[2] * 2
        );
    },
    /**
     * test a ray plane collision and retrieves the collision point
     * @method testRayPlane
     * @param {vec3} start ray start
     * @param {vec3} direction ray direction
     * @param {vec3} P point where the plane passes
     * @param {vec3} N normal of the plane
     * @param {vec3} result collision position
     * @return {boolean} returns if the ray collides the plane or the ray is parallel to the plane
     */
    testRayPlane: function (e, t, r, n, s) {
        var a = vec3.dot(r, n),
            o = a - vec3.dot(n, e),
            l = vec3.dot(n, t);
        if (Math.abs(l) < global.EPSILON) return !1;
        var c = (this.last_t = o / l);
        return c < 0 ? !1 : (s && vec3.add(s, e, vec3.scale(s, t, c)), !0);
    },
    /**
     * test collision between segment and plane and retrieves the collision point
     * @method testSegmentPlane
     * @param {vec3} start segment start
     * @param {vec3} end segment end
     * @param {vec3} P point where the plane passes
     * @param {vec3} N normal of the plane
     * @param {vec3} result collision position
     * @return {boolean} returns if the segment collides the plane or it is parallel to the plane
     */
    testSegmentPlane: (function () {
        var e = vec3.create();
        return function (t, r, n, s, a) {
            var o = vec3.dot(n, s),
                l = o - vec3.dot(s, t),
                c = vec3.sub(e, r, t),
                u = vec3.dot(s, c);
            if (Math.abs(u) < global.EPSILON) return !1;
            var h = (this.last_t = l / u);
            return h < 0 || h > 1
                ? !1
                : (a && vec3.add(a, t, vec3.scale(a, c, h)), !0);
        };
    })(),
    /**
     * test a ray sphere collision and retrieves the collision point
     * @method testRaySphere
     * @param {vec3} start ray start
     * @param {vec3} direction ray direction (normalized)
     * @param {vec3} center center of the sphere
     * @param {number} radius radius of the sphere
     * @param {vec3} result [optional] collision position
     * @param {number} max_dist not fully tested
     * @return {boolean} returns if the ray collides the sphere
     */
    testRaySphere: (function () {
        var e = vec3.create();
        return function (t, r, n, s, a, o) {
            var l = vec3.subtract(e, t, n),
                c = r[0] * r[0] + r[1] * r[1] + r[2] * r[2],
                u = 2 * l[0] * r[0] + 2 * l[1] * r[1] + 2 * l[2] * r[2],
                h = l[0] * l[0] + l[1] * l[1] + l[2] * l[2] - s * s,
                f = u * u - 4 * c * h;
            if (f < 0) return !1;
            if (a) {
                var d = Math.sqrt(f),
                    p = 1 / (2 * c),
                    _ = (-u + d) * p,
                    E = (-u - d) * p,
                    m = _ < E ? _ : E;
                if (o !== void 0 && m > o) return !1;
                (this.last_t = m), vec3.add(a, t, vec3.scale(a, r, m));
            }
            return !0;
        };
    })(),
    //NOT TESTED!
    hitTestTriangle: (function () {
        var e = vec3.create(),
            t = vec3.create(),
            r = vec3.create(),
            n = vec3.create(),
            s = vec3.create();
        return function (a, o, l, c, u, h) {
            vec3.subtract(e, c, l),
                vec3.subtract(t, u, l),
                vec3.cross(r, e, t),
                vec3.normalize(r, r);
            var f = vec3.dot(r, vec3.subtract(n, l, a)) / vec3.dot(r, o);
            if (f > 0) {
                vec3.add(s, a, vec3.scale(n, o, f));
                var d = vec3.subtract(n, n, l),
                    p = vec3.dot(t, t),
                    _ = vec3.dot(t, e),
                    E = vec3.dot(t, d),
                    m = vec3.dot(e, e),
                    b = vec3.dot(e, d),
                    L = p * m - _ * _,
                    T = (m * E - _ * b) / L,
                    g = (p * b - _ * E) / L;
                if (T >= 0 && g >= 0 && T + g <= 1)
                    return (
                        (this.last_t = f),
                        h && vec3.add(h, a, vec3.scale(n, o, f)),
                        !0
                    );
            }
            return !1;
        };
    })(),
    /**
     * test a ray cylinder collision (only vertical cylinders) and retrieves the collision point [not fully tested]
     * @method testRayCylinder
     * @param {vec3} start ray start
     * @param {vec3} direction ray direction
     * @param {vec3} p center of the cylinder
     * @param {number} q height of the cylinder
     * @param {number} r radius of the cylinder
     * @param {vec3} result collision position
     * @return {boolean} returns if the ray collides the cylinder
     */
    testRayCylinder: function (e, t, r, n, s, a) {
        var o = vec3.clone(e),
            l = vec3.add(vec3.create(), e, vec3.scale(vec3.create(), t, 1e5)),
            c = 0,
            u = vec3.subtract(vec3.create(), n, r),
            h = vec3.subtract(vec3.create(), o, r),
            f = vec3.subtract(vec3.create(), l, o),
            d = vec3.dot(h, u),
            p = vec3.dot(f, u),
            _ = vec3.dot(u, u);
        if ((d < 0 && d + p < 0) || (d > _ && d + p > _)) return !1;
        var E = vec3.dot(f, f),
            m = vec3.dot(h, f),
            b = _ * E - p * p,
            L = vec3.dot(h, h) - s * s,
            T = _ * L - d * d;
        if (Math.abs(b) < global.EPSILON)
            return T > 0
                ? !1
                : (d < 0 ? (c = -m / E) : d > _ ? (c = (p - m) / E) : (c = 0),
                  a && vec3.add(a, o, vec3.scale(a, f, c)),
                  !0);
        var g = _ * m - p * d,
            A = g * g - b * T;
        return A < 0 || ((c = (-g - Math.sqrt(A)) / b), c < 0 || c > 1)
            ? !1
            : d + c * p < 0
            ? p <= 0
                ? !1
                : ((c = -d / p),
                  a && vec3.add(a, o, vec3.scale(a, f, c)),
                  L + 2 * c * (m + c * E) <= 0)
            : d + c * p > _
            ? p >= 0
                ? !1
                : ((c = (_ - d) / p),
                  a && vec3.add(a, o, vec3.scale(a, f, c)),
                  L + _ - 2 * d + c * (2 * (m - p) + c * E) <= 0)
            : ((this.last_t = c), a && vec3.add(a, o, vec3.scale(a, f, c)), !0);
    },
    /**
     * test a ray bounding-box collision and retrieves the collision point, the BB must be Axis Aligned
     * @method testRayBox
     * @param {vec3} start ray start
     * @param {vec3} direction ray direction
     * @param {vec3} minB minimum position of the bounding box
     * @param {vec3} maxB maximim position of the bounding box
     * @param {vec3} result collision position
     * @return {boolean} returns if the ray collides the box
     */
    testRayBox: (function () {
        var e = new Float32Array(3),
            t = new Float32Array(3),
            r = new Float32Array(3);
        return function (n, s, a, o, l, c) {
            c = c || Number.MAX_VALUE;
            var u = !0,
                h = 0,
                f;
            for (e.fill(0), r.fill(0), t.fill(0), h = 0; h < 3; ++h)
                n[h] < a[h]
                    ? ((e[h] = 1), (t[h] = a[h]), (u = !1))
                    : n[h] > o[h]
                    ? ((e[h] = 0), (t[h] = o[h]), (u = !1))
                    : (e[h] = 2);
            if (u) return (this.last_t = 0), l && vec3.copy(l, n), !0;
            for (h = 0; h < 3; ++h)
                e[h] != 2 && s[h] != 0
                    ? (r[h] = (t[h] - n[h]) / s[h])
                    : (r[h] = -1);
            for (f = 0, h = 1; h < 3; h++) r[f] < r[h] && (f = h);
            if (r[f] < 0 || r[f] > c) return !1;
            for (this.last_t = r[f], h = 0; h < 3; ++h)
                if (f != h) {
                    var d = n[h] + r[f] * s[h];
                    if (d < a[h] || d > o[h]) return !1;
                    l && (l[h] = d);
                } else l && (l[h] = t[h]);
            return !0;
        };
    })(),
    /**
     * test a ray bounding-box collision, it uses the  BBox class and allows to use non-axis aligned bbox
     * @method testRayBBox
     * @param {vec3} origin ray origin
     * @param {vec3} direction ray direction
     * @param {BBox} box in BBox format
     * @param {mat4} model transformation of the BBox [optional]
     * @param {vec3} result collision position in world space unless in_local is true
     * @return {boolean} returns if the ray collides the box
     */
    testRayBBox: (function () {
        var e = mat4.create(),
            t = vec3.create(),
            r = vec3.create();
        return function (n, s, a, o, l, c, u) {
            if (!n || !s || !a) throw "parameters missing";
            o &&
                (mat4.invert(e, o),
                vec3.add(t, n, s),
                (n = vec3.transformMat4(r, n, e)),
                vec3.transformMat4(t, t, e),
                vec3.sub(t, t, n),
                (s = vec3.normalize(t, t)));
            var h = this.testRayBox(
                n,
                s,
                a.subarray(6, 9),
                a.subarray(9, 12),
                l,
                c
            );
            return !u && o && l && vec3.transformMat4(l, l, o), h;
        };
    })(),
    /**
     * test if a 3d point is inside a BBox
     * @method testPointBBox
     * @param {vec3} point
     * @param {BBox} bbox
     * @return {boolean} true if it is inside
     */
    testPointBBox: function (e, t) {
        return !(
            e[0] < t[6] ||
            e[0] > t[9] ||
            e[1] < t[7] ||
            e[0] > t[10] ||
            e[2] < t[8] ||
            e[0] > t[11]
        );
    },
    /**
     * test if a BBox overlaps another BBox
     * @method testBBoxBBox
     * @param {BBox} a
     * @param {BBox} b
     * @return {boolean} true if it overlaps
     */
    testBBoxBBox: function (e, t) {
        var r = Math.abs(t[0] - e[0]);
        if (r > e[3] + t[3]) return !1;
        var n = Math.abs(t[1] - e[1]);
        if (n > e[4] + t[4]) return !1;
        var s = Math.abs(t[2] - e[2]);
        if (s > e[5] + t[5]) return !1;
        var a = global.BBox.getMin(t);
        if (global.geo.testPointBBox(a, e)) {
            var o = global.BBox.getMax(t);
            if (global.geo.testPointBBox(o, e)) return !0;
        }
        return !0;
    },
    /**
     * test if a sphere overlaps a BBox
     * @method testSphereBBox
     * @param {vec3} point
     * @param {float} radius
     * @param {BBox} bounding_box
     * @return {boolean} true if it overlaps
     */
    testSphereBBox: function (e, t, r) {
        for (
            var n,
                s = 0,
                a = global.BBox.getMin(r),
                o = global.BBox.getMax(r),
                l = 0;
            l < 3;
            ++l
        )
            e[l] < a[l]
                ? ((n = e[l] - a[l]), (s += n * n))
                : e[l] > o[l] && ((n = e[l] - o[l]), (s += n * n));
        var c = t * t;
        return s <= c;
    },
    closestPointBetweenLines: function (e, t, r, n, s, a) {
        var o = vec3.subtract(vec3.create(), t, e),
            l = vec3.subtract(vec3.create(), n, r),
            c = vec3.subtract(vec3.create(), e, r),
            u = vec3.dot(o, o),
            h = vec3.dot(o, l),
            f = vec3.dot(l, l),
            d = vec3.dot(o, c),
            p = vec3.dot(l, c),
            _ = u * f - h * h,
            E,
            m;
        _ < global.EPSILON
            ? ((E = 0), (m = h > f ? d / h : p / f))
            : ((E = (h * p - f * d) / _), (m = (u * p - h * d) / _)),
            s && vec3.add(s, e, vec3.scale(vec3.create(), o, E)),
            a && vec3.add(a, r, vec3.scale(vec3.create(), l, m));
        var b = vec3.add(
            vec3.create(),
            c,
            vec3.subtract(
                vec3.create(),
                vec3.scale(vec3.create(), o, E),
                vec3.scale(vec3.create(), l, m)
            )
        );
        return vec3.length(b);
    },
    /**
     * extract frustum planes given a view-projection matrix
     * @method extractPlanes
     * @param {mat4} viewprojection matrix
     * @return {Float32Array} returns all 6 planes in a float32array[24]
     */
    extractPlanes: function (e, r) {
        var r = r || new Float32Array(24);
        return (
            r.set([e[3] - e[0], e[7] - e[4], e[11] - e[8], e[15] - e[12]], 0),
            n(0),
            r.set([e[3] + e[0], e[7] + e[4], e[11] + e[8], e[15] + e[12]], 4),
            n(4),
            r.set([e[3] + e[1], e[7] + e[5], e[11] + e[9], e[15] + e[13]], 8),
            n(8),
            r.set([e[3] - e[1], e[7] - e[5], e[11] - e[9], e[15] - e[13]], 12),
            n(12),
            r.set([e[3] - e[2], e[7] - e[6], e[11] - e[10], e[15] - e[14]], 16),
            n(16),
            r.set([e[3] + e[2], e[7] + e[6], e[11] + e[10], e[15] + e[14]], 20),
            n(20),
            r
        );
        function n(s) {
            var a = r.subarray(s, s + 3),
                o = vec3.length(a);
            o !== 0 &&
                ((o = 1 / o),
                (r[s] *= o),
                (r[s + 1] *= o),
                (r[s + 2] *= o),
                (r[s + 3] *= o));
        }
    },
    /**
     * test a BBox against the frustum
     * @method frustumTestBox
     * @param {Float32Array} planes frustum planes
     * @param {BBox} boundindbox in BBox format
     * @return {enum} CLIP_INSIDE, CLIP_OVERLAP, CLIP_OUTSIDE
     */
    frustumTestBox: function (e, t) {
        var r = 0,
            n = 0;
        return (
            (r = global.planeBoxOverlap(e.subarray(0, 4), t)),
            r == global.CLIP_OUTSIDE ||
            ((n += r),
            (r = global.planeBoxOverlap(e.subarray(4, 8), t)),
            r == global.CLIP_OUTSIDE) ||
            ((n += r),
            (r = global.planeBoxOverlap(e.subarray(8, 12), t)),
            r == global.CLIP_OUTSIDE) ||
            ((n += r),
            (r = global.planeBoxOverlap(e.subarray(12, 16), t)),
            r == global.CLIP_OUTSIDE) ||
            ((n += r),
            (r = global.planeBoxOverlap(e.subarray(16, 20), t)),
            r == global.CLIP_OUTSIDE) ||
            ((n += r),
            (r = global.planeBoxOverlap(e.subarray(20, 24), t)),
            r == global.CLIP_OUTSIDE)
                ? global.CLIP_OUTSIDE
                : ((n += r), n == 0 ? global.CLIP_INSIDE : global.CLIP_OVERLAP)
        );
    },
    /**
     * test a Sphere against the frustum
     * @method frustumTestSphere
     * @param {vec3} center sphere center
     * @param {number} radius sphere radius
     * @return {enum} CLIP_INSIDE, CLIP_OVERLAP, global.CLIP_OUTSIDE
     */
    frustumTestSphere: function (e, t, r) {
        var n,
            s = !1;
        return (
            (n = global.distanceToPlane(e.subarray(0, 4), t)),
            n < -r ||
            (n >= -r && n <= r && (s = !0),
            (n = global.distanceToPlane(e.subarray(4, 8), t)),
            n < -r) ||
            (n >= -r && n <= r && (s = !0),
            (n = global.distanceToPlane(e.subarray(8, 12), t)),
            n < -r) ||
            (n >= -r && n <= r && (s = !0),
            (n = global.distanceToPlane(e.subarray(12, 16), t)),
            n < -r) ||
            (n >= -r && n <= r && (s = !0),
            (n = global.distanceToPlane(e.subarray(16, 20), t)),
            n < -r) ||
            (n >= -r && n <= r && (s = !0),
            (n = global.distanceToPlane(e.subarray(20, 24), t)),
            n < -r)
                ? global.CLIP_OUTSIDE
                : (n >= -r && n <= r && (s = !0),
                  s ? global.CLIP_OVERLAP : global.CLIP_INSIDE)
        );
    },
    /**
     * test if a 2d point is inside a 2d polygon
     * @method testPoint2DInPolygon
     * @param {Array} poly array of 2d points
     * @param {vec2} point
     * @return {boolean} true if it is inside
     */
    testPoint2DInPolygon: function (e, t) {
        for (var r = !1, n = -1, s = e.length, a = s - 1; ++n < s; a = n)
            ((e[n][1] <= t[1] && t[1] < e[a][1]) ||
                (e[a][1] <= t[1] && t[1] < e[n][1])) &&
                t[0] <
                    ((e[a][0] - e[n][0]) * (t[1] - e[n][1])) /
                        (e[a][1] - e[n][1]) +
                        e[n][0] &&
                (r = !r);
        return r;
    },
};
global.BBox = GL$1.BBox = {
    center: 0,
    halfsize: 3,
    min: 6,
    max: 9,
    radius: 12,
    data_length: 13,
    //corners: new Float32Array([1,1,1,  1,1,-1,  1,-1,1,  1,-1,-1,  -1,1,1,  -1,1,-1,  -1,-1,1,  -1,-1,-1 ]),
    corners: [
        vec3.fromValues(1, 1, 1),
        vec3.fromValues(1, 1, -1),
        vec3.fromValues(1, -1, 1),
        vec3.fromValues(1, -1, -1),
        vec3.fromValues(-1, 1, 1),
        vec3.fromValues(-1, 1, -1),
        vec3.fromValues(-1, -1, 1),
        vec3.fromValues(-1, -1, -1),
    ],
    /**
     * create an empty bbox
     * @method create
     * @return {BBox} returns a float32array with the bbox
     */
    create: function () {
        return new Float32Array(13);
    },
    /**
     * create an bbox copy from another one
     * @method clone
     * @return {BBox} returns a float32array with the bbox
     */
    clone: function (e) {
        return new Float32Array(e);
    },
    /**
     * copy one bbox into another
     * @method copy
     * @param {BBox} out where to store the result
     * @param {BBox} where to read the bbox
     * @return {BBox} returns out
     */
    copy: function (e, t) {
        return e.set(t), e;
    },
    /**
     * create a bbox from one point
     * @method fromPoint
     * @param {vec3} point
     * @return {BBox} returns a float32array with the bbox
     */
    fromPoint: function (e) {
        var t = this.create();
        return t.set(e, 0), t.set(e, 6), t.set(e, 9), t;
    },
    /**
     * create a bbox from min and max points
     * @method fromMinMax
     * @param {vec3} min
     * @param {vec3} max
     * @return {BBox} returns a float32array with the bbox
     */
    fromMinMax: function (e, t) {
        var r = this.create();
        return this.setMinMax(r, e, t), r;
    },
    /**
     * create a bbox from center and halfsize
     * @method fromCenterHalfsize
     * @param {vec3} center
     * @param {vec3} halfsize
     * @return {BBox} returns a float32array with the bbox
     */
    fromCenterHalfsize: function (e, t) {
        var r = this.create();
        return this.setCenterHalfsize(r, e, t), r;
    },
    /**
     * create a bbox from a typed-array containing points
     * @method fromPoints
     * @param {Float32Array} points
     * @return {BBox} returns a float32array with the bbox
     */
    fromPoints: function (e) {
        var t = this.create();
        return this.setFromPoints(t, e), t;
    },
    /**
     * set the values to a BB from a set of points
     * @method setFromPoints
     * @param {BBox} out where to store the result
     * @param {Float32Array} points
     * @return {BBox} returns a float32array with the bbox
     */
    setFromPoints: function (e, t) {
        var r = e.subarray(6, 9),
            n = e.subarray(9, 12);
        (r[0] = t[0]), (r[1] = t[1]), (r[2] = t[2]), n.set(r);
        for (var s = 3, a = t.length; s < a; s += 3) {
            var o = t[s],
                l = t[s + 1],
                c = t[s + 2];
            o < r[0] ? (r[0] = o) : o > n[0] && (n[0] = o),
                l < r[1] ? (r[1] = l) : l > n[1] && (n[1] = l),
                c < r[2] ? (r[2] = c) : c > n[2] && (n[2] = c);
        }
        return (
            (e[0] = (r[0] + n[0]) * 0.5),
            (e[1] = (r[1] + n[1]) * 0.5),
            (e[2] = (r[2] + n[2]) * 0.5),
            (e[3] = n[0] - e[0]),
            (e[4] = n[1] - e[1]),
            (e[5] = n[2] - e[2]),
            (e[12] = Math.sqrt(e[3] * e[3] + e[4] * e[4] + e[5] * e[5])),
            e
        );
    },
    /**
     * set the values to a BB from min and max
     * @method setMinMax
     * @param {BBox} out where to store the result
     * @param {vec3} min
     * @param {vec3} max
     * @return {BBox} returns out
     */
    setMinMax: function (e, t, r) {
        (e[6] = t[0]),
            (e[7] = t[1]),
            (e[8] = t[2]),
            (e[9] = r[0]),
            (e[10] = r[1]),
            (e[11] = r[2]);
        var n = e.subarray(3, 6);
        return (
            vec3.sub(n, r, t),
            vec3.scale(n, n, 0.5),
            (e[0] = r[0] - n[0]),
            (e[1] = r[1] - n[1]),
            (e[2] = r[2] - n[2]),
            (e[12] = vec3.length(e.subarray(3, 6))),
            e
        );
    },
    /**
     * set the values to a BB from center and halfsize
     * @method setCenterHalfsize
     * @param {BBox} out where to store the result
     * @param {vec3} min
     * @param {vec3} max
     * @param {number} radius [optional] (the minimum distance from the center to the further point)
     * @return {BBox} returns out
     */
    setCenterHalfsize: function (e, t, r, n) {
        return (
            (e[0] = t[0]),
            (e[1] = t[1]),
            (e[2] = t[2]),
            (e[3] = r[0]),
            (e[4] = r[1]),
            (e[5] = r[2]),
            (e[6] = e[0] - e[3]),
            (e[7] = e[1] - e[4]),
            (e[8] = e[2] - e[5]),
            (e[9] = e[0] + e[3]),
            (e[10] = e[1] + e[4]),
            (e[11] = e[2] + e[5]),
            n ? (e[12] = n) : (e[12] = vec3.length(r)),
            e
        );
    },
    /**
     * Apply a matrix transformation to the BBox (applies to every corner and recomputes the BB)
     * @method transformMat4
     * @param {BBox} out where to store the result
     * @param {BBox} bb bbox you want to transform
     * @param {mat4} mat transformation
     * @return {BBox} returns out
     */
    transformMat4: (function () {
        for (
            var e = 0, t = 0, r = 0, n = new Float32Array(8 * 3), s = [], a = 0;
            a < 24;
            a += 3
        )
            s.push(n.subarray(a, a + 3));
        return function (o, l, c) {
            var u = l[0],
                h = l[1],
                f = l[2];
            (e = l[3]), (t = l[4]), (r = l[5]);
            for (var d = this.corners, p = 0; p < 8; ++p) {
                var _ = d[p],
                    E = s[p];
                (E[0] = e * _[0] + u),
                    (E[1] = t * _[1] + h),
                    (E[2] = r * _[2] + f),
                    mat4.multiplyVec3(E, c, E);
            }
            return this.setFromPoints(o, n);
        };
    })(),
    /**
     * Computes the eight corners of the BBox and returns it
     * @method getCorners
     * @param {BBox} bb the bounding box
     * @param {Float32Array} result optional, should be 8 * 3
     * @return {Float32Array} returns the 8 corners
     */
    getCorners: function (e, t) {
        var r = e,
            n = e.subarray(3, 6),
            s = null;
        t
            ? (t.set(this.corners), (s = t))
            : (s = new Float32Array(this.corners));
        for (var a = 0; a < 8; ++a) {
            var o = s.subarray(a * 3, a * 3 + 3);
            vec3.multiply(o, n, o), vec3.add(o, o, r);
        }
        return s;
    },
    merge: function (e, t, r) {
        var n = e.subarray(6, 9),
            s = e.subarray(9, 12);
        return (
            vec3.min(n, t.subarray(6, 9), r.subarray(6, 9)),
            vec3.max(s, t.subarray(9, 12), r.subarray(9, 12)),
            global.BBox.setMinMax(e, n, s)
        );
    },
    extendToPoint: function (e, t) {
        t[0] < e[6] ? (e[6] = t[0]) : t[0] > e[9] && (e[9] = t[0]),
            t[1] < e[7] ? (e[7] = t[1]) : t[1] > e[10] && (e[10] = t[1]),
            t[2] < e[8] ? (e[8] = t[2]) : t[2] > e[11] && (e[11] = t[2]);
        var r = e.subarray(6, 9),
            n = e.subarray(9, 12),
            s = vec3.add(e.subarray(0, 3), r, n);
        return (
            vec3.scale(s, s, 0.5),
            vec3.subtract(e.subarray(3, 6), n, s),
            (e[12] = vec3.length(e.subarray(3, 6))),
            e
        );
    },
    clampPoint: function (e, t, r) {
        (e[0] = Math.clamp(r[0], t[0] - t[3], t[0] + t[3])),
            (e[1] = Math.clamp(r[1], t[1] - t[4], t[1] + t[4])),
            (e[2] = Math.clamp(r[2], t[2] - t[5], t[2] + t[5]));
    },
    isPointInside: function (e, t) {
        return !(
            e[0] - e[3] > t[0] ||
            e[1] - e[4] > t[1] ||
            e[2] - e[5] > t[2] ||
            e[0] + e[3] < t[0] ||
            e[1] + e[4] < t[1] ||
            e[2] + e[5] < t[2]
        );
    },
    getCenter: function (e) {
        return e.subarray(0, 3);
    },
    getHalfsize: function (e) {
        return e.subarray(3, 6);
    },
    getMin: function (e) {
        return e.subarray(6, 9);
    },
    getMax: function (e) {
        return e.subarray(9, 12);
    },
    getRadius: function (e) {
        return e[12];
    },
    //setCenter,setHalfsize not coded, too much work to update all
};
global.distanceToPlane = GL$1.distanceToPlane = function (t, r) {
    return vec3.dot(t, r) + t[3];
};
global.planeBoxOverlap = GL$1.planeBoxOverlap = function (t, r) {
    var n = t,
        s = t[3],
        a = r,
        o = r,
        l =
            Math.abs(o[3] * n[0]) +
            Math.abs(o[4] * n[1]) +
            Math.abs(o[5] * n[2]),
        c = vec3.dot(n, a) + s;
    return c <= -l
        ? global.CLIP_OUTSIDE
        : c <= l
        ? global.CLIP_OVERLAP
        : global.CLIP_INSIDE;
};
class OctreeNode {
    //children
    constructor(t, r) {
        k(this, "min", null);
        k(this, "max", null);
        k(this, "size", null);
        k(this, "faces", null);
        //[ Float32Array[10], ... ]
        k(this, "inside", 0);
        k(this, "c", null);
        (this.min = t),
            (this.max = r),
            (this.size = vec3.sub(vec3.create(), r, t));
    }
}
class Octree {
    constructor(t, r, n) {
        (this.root = null),
            (this.total_depth = 0),
            (this.total_nodes = 0),
            t && this.buildFromMesh(t, r, n);
    }
}
global.Octree = GL$1.Octree = Octree;
Octree.MAX_NODE_TRIANGLES_RATIO = 0.05;
Octree.MAX_OCTREE_DEPTH = 8;
Octree.OCTREE_MARGIN_RATIO = 0.01;
Octree.OCTREE_MIN_MARGIN = 0.1;
Octree.NEAREST = 0;
Octree.FIRST = 1;
Octree.ALL = 2;
Octree.prototype.buildFromMesh = function (e, t, r) {
    (this.total_depth = 0), (this.total_nodes = 0), (t = t || 0);
    var n = e.getBuffer("vertices").data,
        s = e.getIndexBuffer("triangles");
    s && (s = s.data), r || (r = s ? s.length : n.length / 3);
    var a;
    s
        ? (a = this.computeAABBFromIndices(n, s, t, r))
        : (a = this.computeAABB(n));
    var o = new OctreeNode(a.min, a.max);
    (this.root = o),
        (this.total_nodes = 1),
        (this.total_triangles = s ? s.length / 3 : n.length / 9),
        (this.max_node_triangles =
            this.total_triangles * Octree.MAX_NODE_TRIANGLES_RATIO);
    var l = vec3.create();
    vec3.scale(l, o.size, Octree.OCTREE_MARGIN_RATIO),
        l[0] < Octree.OCTREE_MIN_MARGIN && (l[0] = Octree.OCTREE_MIN_MARGIN),
        l[1] < Octree.OCTREE_MIN_MARGIN && (l[1] = Octree.OCTREE_MIN_MARGIN),
        l[2] < Octree.OCTREE_MIN_MARGIN && (l[2] = Octree.OCTREE_MIN_MARGIN),
        vec3.sub(o.min, o.min, l),
        vec3.add(o.max, o.max, l),
        (o.faces = []);
    var c = t + r;
    if (s)
        for (var u = t; u < c; u += 3) {
            var h = new Float32Array([
                n[s[u] * 3],
                n[s[u] * 3 + 1],
                n[s[u] * 3 + 2],
                n[s[u + 1] * 3],
                n[s[u + 1] * 3 + 1],
                n[s[u + 1] * 3 + 2],
                n[s[u + 2] * 3],
                n[s[u + 2] * 3 + 1],
                n[s[u + 2] * 3 + 2],
                u / 3,
            ]);
            Octree.isValidFace(h) && this.addToNode(h, o, 0);
        }
    else
        for (var u = t * 3; u < r * 3; u += 9) {
            var h = new Float32Array(10);
            h.set(n.subarray(u, u + 9)),
                (h[9] = u / 9),
                Octree.isValidFace(h) && this.addToNode(h, o, 0);
        }
    return (this.total_nodes = this.trim()), o;
};
Octree.isValidFace = (function () {
    var e = vec3.create(),
        t = vec3.create(),
        r = vec3.create();
    return function (n) {
        var s = n.subarray(0, 3),
            a = n.subarray(3, 6),
            o = n.subarray(6, 9);
        return (
            vec3.sub(e, a, s),
            vec3.sub(t, o, s),
            vec3.cross(r, e, t),
            vec3.length(r) > 0
        );
    };
})();
Octree.prototype.addToNode = function (e, t, r) {
    if (((t.inside += 1), t.c)) {
        for (var n = this.computeAABB(e), s = !1, a = 0; a < t.c.length; ++a) {
            var o = t.c[a];
            if (Octree.isInsideAABB(n, o)) {
                this.addToNode(e, o, r + 1), (s = !0);
                break;
            }
        }
        s || (t.faces == null && (t.faces = []), t.faces.push(e));
    } else if (
        (t.faces == null && (t.faces = []),
        t.faces.push(e),
        t.faces.length > this.max_node_triangles && r < Octree.MAX_OCTREE_DEPTH)
    ) {
        this.splitNode(t),
            this.total_depth < r + 1 && (this.total_depth = r + 1);
        var l = t.faces;
        t.faces = null;
        for (var a = 0; a < l.length; ++a) {
            for (
                var e = l[a], n = this.computeAABB(e), s = !1, c = 0;
                c < t.c.length;
                ++c
            ) {
                var o = t.c[c];
                if (Octree.isInsideAABB(n, o)) {
                    this.addToNode(e, o, r + 1), (s = !0);
                    break;
                }
            }
            s || (t.faces == null && (t.faces = []), t.faces.push(e));
        }
    }
};
Octree.prototype.octree_pos_ref = [
    [0, 0, 0],
    [0, 0, 1],
    [0, 1, 0],
    [0, 1, 1],
    [1, 0, 0],
    [1, 0, 1],
    [1, 1, 0],
    [1, 1, 1],
];
Octree.prototype.splitNode = function (e) {
    e.c = [];
    for (
        var t = [
                (e.max[0] - e.min[0]) * 0.5,
                (e.max[1] - e.min[1]) * 0.5,
                (e.max[2] - e.min[2]) * 0.5,
            ],
            r = 0;
        r < this.octree_pos_ref.length;
        ++r
    ) {
        var n = this.octree_pos_ref[r],
            s = [
                e.min[0] + t[0] * n[0],
                e.min[1] + t[1] * n[1],
                e.min[2] + t[2] * n[2],
            ],
            a = [s[0] + t[0], s[1] + t[1], s[2] + t[2]],
            o = new OctreeNode(s, a);
        (this.total_nodes += 1), (o.faces = null), (o.inside = 0), e.c.push(o);
    }
};
Octree.prototype.computeAABB = function (e) {
    for (
        var t = new Float32Array([e[0], e[1], e[2]]),
            r = new Float32Array(t),
            n = 3;
        n < e.length - 1;
        n += 3
    )
        for (var s = 0; s < 3; s++)
            t[s] > e[n + s] && (t[s] = e[n + s]),
                r[s] < e[n + s] && (r[s] = e[n + s]);
    return { min: t, max: r };
};
Octree.prototype.computeAABBFromIndices = function (e, t, r, n) {
    (r = r || 0), (n = n || t.length);
    for (
        var s = t[r],
            a = new Float32Array([e[s * 3], e[s * 3 + 1], e[s * 3 + 2]]),
            o = new Float32Array([e[s * 3], e[s * 3 + 1], e[s * 3 + 2]]),
            l = r + 1;
        l < r + n;
        ++l
    )
        for (var s = t[l] * 3, c = 0; c < 3; c++)
            a[c] > e[s + c] && (a[c] = e[s + c]),
                o[c] < e[s + c] && (o[c] = e[s + c]);
    return { min: a, max: o };
};
Octree.prototype.trim = function (e) {
    if (((e = e || this.root), !e.c)) return 1;
    for (var t = 1, r = [], n = e.c, s = 0; s < n.length; ++s)
        n[s].inside && (r.push(n[s]), (t += this.trim(n[s])));
    return (e.c = r), t;
};
Octree.prototype.testRay = (function () {
    var e = vec3.create(),
        t = vec3.create(),
        r = vec3.create(),
        n = vec3.create();
    return function (s, a, o, l, c, u) {
        if (((u = u || Octree.NEAREST), !this.root))
            throw "Error: octree not build";
        e.set(s), t.set(a), r.set(this.root.min), n.set(this.root.max);
        var h = Octree.hitTestBox(e, t, r, n);
        if (!h) return null;
        var h = Octree.testRayInNode(this.root, e, t, c, u);
        if (h == null) return null;
        if (u == Octree.ALL) return h;
        var f = vec3.scale(vec3.create(), a, h.t);
        return vec3.add(f, f, s), (h.pos = f), h;
    };
})();
Octree.testRayInNode = function (e, t, r, n, s) {
    var a = null,
        o = null;
    if (e.faces)
        for (var l = 0, c = e.faces.length; l < c; ++l) {
            var u = e.faces[l];
            if (
                ((a = Octree.hitTestTriangle(
                    t,
                    r,
                    u.subarray(0, 3),
                    u.subarray(3, 6),
                    u.subarray(6, 9),
                    n
                )),
                a != null)
            ) {
                if (((a.index = u[9]), s == Octree.FIRST)) return a;
                s == Octree.ALL
                    ? (o || (o = []), o.push(a))
                    : ((a.face = u), o ? o.mergeWith(a) : (o = a));
            }
        }
    var h = vec3.create(),
        f = vec3.create(),
        d;
    if (e.c) {
        for (var l = 0; l < e.c.length; ++l)
            if (
                ((d = e.c[l]),
                h.set(d.min),
                f.set(d.max),
                (a = Octree.hitTestBox(t, r, h, f)),
                a != null &&
                    !(s != Octree.ALL && o && a.t > o.t) &&
                    ((a = Octree.testRayInNode(d, t, r, n, s)), a != null))
            ) {
                if (s == Octree.FIRST) return a;
                s == Octree.ALL
                    ? (o || (o = []), o.push(a))
                    : o
                    ? o.mergeWith(a)
                    : (o = a);
            }
    }
    return o;
};
Octree.prototype.testSphere = function (e, t) {
    if (((e = vec3.clone(e)), !this.root)) throw "Error: octree not build";
    var r = t * t;
    return Octree.testSphereBox(
        e,
        r,
        vec3.clone(this.root.min),
        vec3.clone(this.root.max)
    )
        ? Octree.testSphereInNode(this.root, e, r)
        : !1;
};
Octree.testSphereInNode = function (e, t, r) {
    if (e.faces)
        for (var n = 0, s = e.faces.length; n < s; ++n) {
            var a = e.faces[n];
            if (
                Octree.testSphereTriangle(
                    t,
                    r,
                    a.subarray(0, 3),
                    a.subarray(3, 6),
                    a.subarray(6, 9)
                )
            )
                return !0;
        }
    var o = vec3.create(),
        l = vec3.create(),
        c;
    if (e.c) {
        for (var n = 0; n < e.c.length; ++n)
            if (
                ((c = e.c[n]),
                o.set(c.min),
                l.set(c.max),
                !!Octree.testSphereBox(t, r, o, l) &&
                    Octree.testSphereInNode(c, t, r))
            )
                return !0;
    }
    return !1;
};
Octree.prototype.findNearestPoint = function (e, t, r, n) {
    if (((r = r || 1 / 0), e === t))
        throw "findNearestPoint input point and output cannot be the same";
    return Octree.nearestInNode(this.root, e, t, r, n);
};
Octree.nearestInNode = function (e, t, r, n, s) {
    var a = vec3.create(),
        o;
    if ((s && (o = vec3.create()), e.faces))
        for (var l = 0, c = e.faces.length; l < c; ++l) {
            var u = e.faces[l],
                h = u.subarray(0, 3),
                f = u.subarray(3, 6),
                d = u.subarray(6, 9);
            Octree.closestPointOnTriangle(t, h, f, d, a);
            var p = vec3.dist(a, t);
            p < n &&
                ((n = p),
                vec3.copy(r, a),
                s && global.geo.computeTriangleNormal(s, h, f, d));
        }
    if (!e.c) return n;
    for (var l = 0; l < e.c.length; ++l) {
        var _ = e.c[l],
            E = Octree.distanceToBox(t, _.min, _.max);
        if (!(E > n)) {
            var p = Octree.nearestInNode(_, t, a, n, o);
            p < n && ((n = p), vec3.copy(r, a), s && vec3.copy(s, o));
        }
    }
    return n;
};
Octree.closestPointOnTriangle = (function () {
    var e = new Float32Array(4),
        t = vec3.create(),
        r = vec3.create(),
        n = vec3.create(),
        s = vec3.create();
    return function (a, o, l, c, u) {
        if (
            (global.geo.planeFromTriangle(e, o, l, c),
            vec3.length(e) > 1e-8 &&
                (global.geo.projectPointOnPlane(a, o, e, t),
                global.geo.isPointInsideTriangle(t, o, l, c)))
        )
            return vec3.copy(u, t), u;
        global.geo.closestPointToSegment(t, o, l, r),
            global.geo.closestPointToSegment(t, l, c, n),
            global.geo.closestPointToSegment(t, c, o, s);
        var h = vec3.sqrDist(t, r),
            f = vec3.sqrDist(t, n),
            d = vec3.sqrDist(t, s),
            p = Math.min(h, f, d);
        return (
            p === h
                ? vec3.copy(u, r)
                : p === f
                ? vec3.copy(u, n)
                : vec3.copy(u, s),
            u
        );
    };
})();
Octree.isInsideAABB = function (e, t) {
    return !(
        e.min[0] < t.min[0] ||
        e.min[1] < t.min[1] ||
        e.min[2] < t.min[2] ||
        e.max[0] > t.max[0] ||
        e.max[1] > t.max[1] ||
        e.max[2] > t.max[2]
    );
};
Octree.distanceToBox = function (e, t, r) {
    var n = (r[0] + t[0]) * 0.5,
        s = (r[1] + t[1]) * 0.5,
        a = (r[2] + t[2]) * 0.5,
        o = r[0] - n,
        l = r[1] - s,
        c = r[2] - a,
        u = Math.abs(e[0] - n) - o,
        h = Math.abs(e[1] - s) - l,
        f = Math.abs(e[2] - a) - c,
        d = Math.min(Math.max(u, h, f), 0);
    return (
        (u = Math.max(u, 0)),
        (h = Math.max(h, 0)),
        (f = Math.max(f, 0)),
        Math.sqrt(u * u + h * h + f * f) + d
    );
};
Octree.hitTestBox = (function () {
    var e = vec3.create(),
        t = vec3.create(),
        r = vec3.create(),
        n = vec3.create(),
        s = vec3.create(),
        a = vec3.create(),
        o = 1e-6,
        l = vec3.fromValues(o, o, o);
    return function (c, u, h, f) {
        if (
            (vec3.subtract(e, h, c),
            vec3.subtract(t, f, c),
            vec3.maxValue(e) < 0 && vec3.minValue(t) > 0)
        )
            return new HitTest(0, c, u);
        (r[0] = 1 / u[0]),
            (r[1] = 1 / u[1]),
            (r[2] = 1 / u[2]),
            vec3.multiply(e, e, r),
            vec3.multiply(t, t, r),
            vec3.min(n, e, t),
            vec3.max(s, e, t);
        var d = vec3.maxValue(n),
            p = vec3.minValue(s);
        if (d > 0 && d < p) {
            var _ = vec3.add(vec3.create(), vec3.scale(a, u, d), c);
            return (
                vec3.add(h, h, l),
                vec3.subtract(h, h, l),
                new HitTest(
                    d,
                    _,
                    vec3.fromValues(
                        (_[0] > f[0]) - (_[0] < h[0]),
                        (_[1] > f[1]) - (_[1] < h[1]),
                        (_[2] > f[2]) - (_[2] < h[2])
                    )
                )
            );
        }
        return null;
    };
})();
Octree.hitTestTriangle = (function () {
    var e = vec3.create(),
        t = vec3.create(),
        r = vec3.create(),
        n = vec3.create();
    return function (s, a, o, l, c, u) {
        vec3.subtract(e, l, o), vec3.subtract(t, c, o);
        var h = vec3.cross(vec3.create(), e, t);
        if ((vec3.normalize(h, h), !u && vec3.dot(h, a) > 0)) return null;
        var f = vec3.dot(h, vec3.subtract(n, o, s)) / vec3.dot(h, a);
        if (f > 0) {
            var d = vec3.scale(vec3.create(), a, f);
            vec3.add(d, d, s), vec3.subtract(r, d, o);
            var p = vec3.dot(t, t),
                _ = vec3.dot(t, e),
                E = vec3.dot(t, r),
                m = vec3.dot(e, e),
                b = vec3.dot(e, r),
                L = p * m - _ * _,
                T = (m * E - _ * b) / L,
                g = (p * b - _ * E) / L;
            if (T >= 0 && g >= 0 && T + g <= 1) return new HitTest(f, d, h);
        }
        return null;
    };
})();
Octree.testSphereTriangle = (function () {
    var e = vec3.create(),
        t = vec3.create(),
        r = vec3.create(),
        n = vec3.create(),
        s = vec3.create(),
        a = vec3.create(),
        o = vec3.create(),
        l = vec3.create();
    return function (c, u, h, f, d) {
        vec3.sub(e, h, c),
            vec3.sub(t, f, c),
            vec3.sub(r, d, c),
            vec3.sub(n, t, e),
            vec3.sub(s, r, e),
            vec3.cross(l, n, s);
        var p = vec3.dot(e, l),
            _ = vec3.dot(l, l),
            E = p * p > u * _,
            m = vec3.dot(e, e),
            b = vec3.dot(e, t),
            L = vec3.dot(e, r),
            T = vec3.dot(t, t),
            g = vec3.dot(t, r),
            A = vec3.dot(r, r),
            G = (m > u) & (b > m) & (L > m),
            M = (T > u) & (b > T) & (g > T),
            N = (A > u) & (L > A) & (g > A),
            I = b - m,
            B = g - T,
            O = L - A;
        vec3.sub(a, r, t), vec3.sub(o, e, r);
        var F = vec3.dot(n, n),
            P = vec3.dot(a, a),
            C = vec3.dot(o, o),
            U = vec3.scale(vec3.create(), e, F);
        vec3.sub(U, U, vec3.scale(vec3.create(), n, I));
        var X = vec3.scale(vec3.create(), t, P);
        vec3.sub(X, X, vec3.scale(vec3.create(), a, B));
        var z = vec3.scale(vec3.create(), r, C);
        vec3.sub(z, z, vec3.scale(vec3.create(), o, O));
        var q = vec3.scale(vec3.create(), r, F);
        q = vec3.sub(q, q, U);
        var Y = vec3.scale(vec3.create(), e, P);
        Y = vec3.sub(Y, Y, X);
        var H = vec3.scale(vec3.create(), t, C);
        H = vec3.sub(H, H, z);
        var Z = (vec3.dot(U, U) > u * F * F) & (vec3.dot(U, q) > 0),
            oe = (vec3.dot(X, X) > u * P * P) & (vec3.dot(X, Y) > 0),
            he = (vec3.dot(z, z) > u * C * C) & (vec3.dot(z, H) > 0),
            ce = E | G | M | N | Z | oe | he;
        return !ce;
    };
})();
Octree.testSphereBox = function (e, t, r, n) {
    for (var s, a = 0, o = 0; o < 3; ++o)
        e[o] < r[o]
            ? ((s = e[o] - r[o]), (a += s * s))
            : e[o] > n[o] && ((s = e[o] - n[o]), (a += s * s));
    return a <= t;
};
class HitTest {
    constructor(t, r, n, s) {
        (this.t = arguments.length ? t : Number.MAX_VALUE),
            (this.hit = r),
            (this.normal = n),
            (this.face = null),
            (this.index = s);
    }
}
global.HitTest = GL$1.HitTest = HitTest;
HitTest.prototype.mergeWith = function (e) {
    e.t > 0 &&
        e.t < this.t &&
        ((this.t = e.t),
        (this.hit = e.hit),
        (this.normal = e.normal),
        (this.face = e.face),
        (this.index = e.index));
};
global.Ray = GL$1.Ray = function (t, r) {
    (this.origin = vec3.create()),
        (this.direction = vec3.create()),
        (this.collision_point = vec3.create()),
        (this.t = -1),
        t && this.origin.set(t),
        r && this.direction.set(r);
};
GL$1.Ray.prototype.testPlane = function (e, t) {
    var r = global.geo.testRayPlane(
        this.origin,
        this.direction,
        e,
        t,
        this.collision_point
    );
    return (this.t = global.geo.last_t), r;
};
GL$1.Ray.prototype.testSphere = function (e, t, r) {
    var n = global.geo.testRaySphere(
        this.origin,
        this.direction,
        e,
        t,
        this.collision_point,
        r
    );
    return (this.t = global.geo.last_t), n;
};
GL$1.Ray.prototype.testBBox = function (e, t, r, n) {
    var s = global.geo.testRayBBox(
        this.origin,
        this.direction,
        e,
        r,
        this.collision_point,
        t,
        n
    );
    return (this.t = global.geo.last_t), s;
};
global.Raytracer = GL$1.Raytracer = function (t, r) {
    (this.viewport = vec4.create()),
        (this.ray00 = vec3.create()),
        (this.ray10 = vec3.create()),
        (this.ray01 = vec3.create()),
        (this.ray11 = vec3.create()),
        (this.eye = vec3.create()),
        this.setup(t, r);
};
GL$1.Raytracer.prototype.setup = function (e, t) {
    (t = t || gl.viewport_data), this.viewport.set(t);
    var r = t[0],
        n = r + t[2],
        s = t[1],
        a = s + t[3];
    vec3.set(this.ray00, r, s, 1),
        vec3.set(this.ray10, n, s, 1),
        vec3.set(this.ray01, r, a, 1),
        vec3.set(this.ray11, n, a, 1),
        vec3.unproject(this.ray00, this.ray00, e, t),
        vec3.unproject(this.ray10, this.ray10, e, t),
        vec3.unproject(this.ray01, this.ray01, e, t),
        vec3.unproject(this.ray11, this.ray11, e, t);
    var o = this.eye;
    vec3.unproject(o, o, e, t),
        vec3.subtract(this.ray00, this.ray00, o),
        vec3.subtract(this.ray10, this.ray10, o),
        vec3.subtract(this.ray01, this.ray01, o),
        vec3.subtract(this.ray11, this.ray11, o);
};
GL$1.Raytracer.prototype.getRayForPixel = (function () {
    var e = vec3.create(),
        t = vec3.create();
    return function (r, n, s) {
        return (
            (s = s || vec3.create()),
            (r = (r - this.viewport[0]) / this.viewport[2]),
            (n = 1 - (n - this.viewport[1]) / this.viewport[3]),
            vec3.lerp(e, this.ray00, this.ray10, r),
            vec3.lerp(t, this.ray01, this.ray11, r),
            vec3.lerp(s, e, t, n),
            vec3.normalize(s, s)
        );
    };
})();
var _hittest_inv = mat4.create();
GL$1.Raytracer.hitTestBox = function (e, t, r, n, s) {
    var a = new Float32Array(30);
    if (s) {
        var o = mat4.invert(_hittest_inv, s);
        (e = mat4.multiplyVec3(a.subarray(3, 6), o, e)),
            (t = mat4.rotateVec3(a.subarray(6, 9), o, t));
    }
    var l = vec3.subtract(a.subarray(9, 12), r, e);
    vec3.divide(l, l, t);
    var c = vec3.subtract(a.subarray(12, 15), n, e);
    vec3.divide(c, c, t);
    var u = vec3.min(a.subarray(15, 18), l, c),
        h = vec3.max(a.subarray(18, 21), l, c),
        f = vec3.maxValue(u),
        d = vec3.minValue(h);
    if (f > 0 && f <= d) {
        var p = 1e-6,
            _ = vec3.scale(a.subarray(21, 24), t, f);
        return (
            vec3.add(_, e, _),
            vec3.addValue(a.subarray(24, 27), r, p),
            vec3.subValue(a.subarray(27, 30), n, p),
            new HitTest(
                f,
                _,
                vec3.fromValues(
                    (_[0] > n[0]) - (_[0] < r[0]),
                    (_[1] > n[1]) - (_[1] < r[1]),
                    (_[2] > n[2]) - (_[2] < r[2])
                )
            )
        );
    }
    return null;
};
GL$1.Raytracer.hitTestSphere = function (e, t, r, n) {
    var s = vec3.subtract(vec3.create(), e, r),
        a = vec3.dot(t, t),
        o = 2 * vec3.dot(t, s),
        l = vec3.dot(s, s) - n * n,
        c = o * o - 4 * a * l;
    if (c > 0) {
        var u = (-o - Math.sqrt(c)) / (2 * a),
            h = vec3.add(vec3.create(), e, vec3.scale(vec3.create(), t, u));
        return new HitTest(
            u,
            h,
            vec3.scale(vec3.create(), vec3.subtract(vec3.create(), h, r), 1 / n)
        );
    }
    return null;
};
GL$1.Raytracer.hitTestTriangle = function (e, t, r, n, s) {
    var a = vec3.subtract(vec3.create(), n, r),
        o = vec3.subtract(vec3.create(), s, r),
        l = vec3.cross(vec3.create(), a, o);
    vec3.normalize(l, l);
    var c = vec3.dot(l, vec3.subtract(vec3.create(), r, e)) / vec3.dot(l, t);
    if (c > 0) {
        var u = vec3.add(vec3.create(), e, vec3.scale(vec3.create(), t, c)),
            h = vec3.subtract(vec3.create(), u, r),
            f = vec3.dot(o, o),
            d = vec3.dot(o, a),
            p = vec3.dot(o, h),
            _ = vec3.dot(a, a),
            E = vec3.dot(a, h),
            m = f * _ - d * d,
            b = (_ * p - d * E) / m,
            L = (f * E - d * p) / m;
        if (b >= 0 && L >= 0 && b + L <= 1) return new HitTest(c, u, l);
    }
    return null;
};
Mesh.parseOBJ = function (e, t) {
    t = t || {};
    var r = t.matextension || "",
        n = [],
        s = [],
        a = [],
        o = [],
        l = [],
        c = [],
        u = [],
        h = {},
        f = null,
        d = Te(),
        p = /* @__PURE__ */ new Map(),
        _ = 0,
        E = 1;
    t.scale && (E = t.scale);
    for (
        var m = 1,
            b = 2,
            L = 3,
            T = 4,
            g = 5,
            A = 6,
            G = 7,
            M = 8,
            N = {
                v: m,
                vt: b,
                vn: L,
                f: T,
                g,
                o: A,
                usemtl: G,
                mtllib: M,
            },
            I,
            B,
            O,
            F = e.split(`
`),
            P = F.length,
            C = 0;
        C < P;
        ++C
    ) {
        var U = F[C];
        if (
            ((U = U.replace(/[ \t]+/g, " ").replace(/\s\s*$/, "")),
            U[U.length - 1] == "\\")
        ) {
            C += 1;
            var X = F[C].replace(/[ \t]+/g, " ").replace(/\s\s*$/, "");
            U = (U.substr(0, U.length - 1) + X)
                .replace(/[ \t]+/g, " ")
                .replace(/\s\s*$/, "");
        }
        if (U[0] != "#" && U != "") {
            var z = U.split(" "),
                q = N[z[0]];
            switch (
                (q <= L &&
                    ((I = parseFloat(z[1])),
                    (B = parseFloat(z[2])),
                    q != b && (O = parseFloat(z[3]))),
                q)
            ) {
                case m:
                    (I *= E), (B *= E), (O *= E), n.push(I, B, O);
                    break;
                case b:
                    a.push(I, B);
                    break;
                case L:
                    s.push(I, B, O);
                    break;
                case T:
                    if (z.length < 4) continue;
                    for (var Y = [], H = 1; H < z.length; ++H) Y.push(_e(z[H]));
                    d.indices.push(Y[0], Y[1], Y[2]);
                    for (var H = 2; H < Y.length - 1; ++H)
                        d.indices.push(Y[0], Y[H], Y[H + 1]);
                    break;
                case g:
                case A:
                    var Z = z[1];
                    (f = Z), d.name ? ((h = {}), (d = Te(Z))) : (d.name = Z);
                    break;
                case G:
                    De(z[1]);
                    break;
                case M:
                    z[1];
                    break;
            }
        }
    }
    for (var oe = [], he = 0, ce = [], H = 0; H < u.length; ++H) {
        var d = u[H];
        d.indices &&
            ((d.start = he),
            (d.length = d.indices.length),
            (oe = oe.concat(d.indices)),
            delete d.indices,
            (he += d.length),
            ce.push(d));
    }
    u = ce;
    var ie = {};
    if (!n.length) return console.error("mesh without vertices"), null;
    if (t.flip_normals && l.length)
        for (var s = l, H = 0; H < s.length; ++H) s[H] *= -1;
    (ie.vertices = new Float32Array(o)),
        l.length && (ie.normals = new Float32Array(l)),
        c.length && (ie.coords = new Float32Array(c)),
        oe &&
            oe.length > 0 &&
            (ie.triangles = new (he > 256 * 256 ? Uint32Array : Uint16Array)(
                oe
            )),
        (ie.bounding = GL$1.Mesh.computeBoundingBox(ie.vertices));
    var de = {};
    if ((u.length > 1 && (de.groups = u), (ie.info = de), !ie.bounding))
        return console.log("empty mesh"), null;
    if (t.only_data) return ie;
    var fe = null;
    return (fe = Mesh.load(ie, null, t.mesh)), fe;
    function _e(pe) {
        var ue,
            me,
            ye,
            Ee,
            S = !1;
        if (pe.indexOf("-") == -1) {
            var D = p.get(pe);
            if (D !== void 0) return D;
        } else S = !0;
        if ((Ee || (Ee = pe.split("/")), Ee.length == 1))
            (ue = parseInt(Ee[0])), (me = ue), (ye = ue);
        else if (Ee.length == 2)
            (ue = parseInt(Ee[0])), (me = parseInt(Ee[1])), (ye = ue);
        else if (Ee.length == 3)
            (ue = parseInt(Ee[0])),
                (me = parseInt(Ee[1])),
                (ye = parseInt(Ee[2]));
        else
            return (
                console.log(
                    "Problem parsing: unknown number of values per face"
                ),
                -1
            );
        if (
            (ue < 0 && (ue = n.length / 3 + ue + 1),
            ye < 0 && (ye = s.length / 2 + ye + 1),
            me < 0 && (me = a.length / 2 + me + 1),
            S)
        ) {
            pe = ue + "/" + me + "/" + ye;
            var D = p.get(pe);
            if (D !== void 0) return D;
        }
        (ue -= 1),
            (me -= 1),
            (ye -= 1),
            o.push(n[ue * 3 + 0], n[ue * 3 + 1], n[ue * 3 + 2]),
            a.length && c.push(a[me * 2 + 0], a[me * 2 + 1]),
            s.length && l.push(s[ye * 3 + 0], s[ye * 3 + 1], s[ye * 3 + 2]);
        var D = _;
        return p.set(pe, D), ++_, D;
    }
    function Te(pe) {
        var ue = {
            name: pe || "",
            material: "",
            start: -1,
            length: -1,
            indices: [],
        };
        return u.push(ue), ue;
    }
    function De(pe) {
        if (!d.material) return (d.material = pe + r), (h[pe] = d), d;
        var ue = h[pe];
        return (
            ue ||
                ((ue = Te(f + "_" + pe)), (ue.material = pe + r), (h[pe] = ue)),
            (d = ue),
            ue
        );
    }
};
Mesh.parsers.obj = Mesh.parseOBJ;
Mesh.encoders.obj = function (e, t) {
    var r = e.getBuffer("vertices");
    if (!r) return null;
    var n = [];
    n.push(`# Generated with liteGL.js by Javi Agenjo
`);
    for (var s = r.data, a = 0; a < s.length; a += 3)
        n.push(
            "v " +
                s[a].toFixed(4) +
                " " +
                s[a + 1].toFixed(4) +
                " " +
                s[a + 2].toFixed(4)
        );
    var o = e.getBuffer("normals");
    if (o) {
        n.push("");
        for (var l = o.data, a = 0; a < l.length; a += 3)
            n.push(
                "vn " +
                    l[a].toFixed(4) +
                    " " +
                    l[a + 1].toFixed(4) +
                    " " +
                    l[a + 2].toFixed(4)
            );
    }
    var c = e.getBuffer("coords");
    if (c) {
        n.push("");
        for (var u = c.data, a = 0; a < u.length; a += 2)
            n.push(
                "vt " + u[a].toFixed(4) + " " + u[a + 1].toFixed(4) + "  0.0000"
            );
    }
    var h = e.info.groups,
        f = e.getIndexBuffer("triangles");
    if (f) {
        var d = f.data;
        (!h || !h.length) &&
            (h = [{ start: 0, length: d.length, name: "mesh" }]);
        for (var p = 0; p < h.length; ++p) {
            var _ = h[p];
            n.push("g " + _.name);
            var E = _.material || "mat_" + p;
            E.indexOf(".json") != -1 && (E = E.substr(0, E.indexOf(".json"))),
                n.push("usemtl " + E);
            for (var m = _.start, b = m + _.length, a = m; a < b; a += 3)
                n.push(
                    "f " +
                        (d[a] + 1) +
                        "/" +
                        (d[a] + 1) +
                        "/" +
                        (d[a] + 1) +
                        " " +
                        (d[a + 1] + 1) +
                        "/" +
                        (d[a + 1] + 1) +
                        "/" +
                        (d[a + 1] + 1) +
                        " " +
                        (d[a + 2] + 1) +
                        "/" +
                        (d[a + 2] + 1) +
                        "/" +
                        (d[a + 2] + 1)
                );
        }
    } else {
        (!h || !h.length) &&
            (h = [{ start: 0, length: s.length / 3, name: "mesh" }]);
        for (var p = 0; p < h.length; ++p) {
            var _ = h[p];
            n.push("g " + _.name),
                n.push("usemtl " + (_.material || "mat_" + p));
            for (var m = _.start, b = m + _.length, a = m; a < b; a += 3)
                n.push(
                    "f " +
                        (a + 1) +
                        "/" +
                        (a + 1) +
                        "/" +
                        (a + 1) +
                        " " +
                        (a + 2) +
                        "/" +
                        (a + 2) +
                        "/" +
                        (a + 2) +
                        " " +
                        (a + 3) +
                        "/" +
                        (a + 3) +
                        "/" +
                        (a + 3)
                );
        }
    }
    return n.join(`
`);
};
Mesh.parsers.mesh = function (e, t) {
    for (
        var r = {},
            n = e.split(`
`),
            s = 0;
        s < n.length;
        ++s
    ) {
        var a = n[s],
            o = a[0],
            l = a.substr(1).split(","),
            c = l[0];
        if (o == "-") {
            var u = 1,
                h = Float32Array;
            (c == "weights" || c == "bone_indices") && (h = Uint8Array),
                c == "weights" && (u = 255);
            for (var f = new h(Number(l[1])), d = 0; d < f.length; ++d)
                f[d] = Number(l[d + 2]) * u;
            r[c] = f;
        } else if (o == "*") {
            var h = Uint16Array;
            Number(l[1]) > 256 * 256 && (h = Uint32Array);
            for (var f = new h(Number(l[1])), d = 0; d < f.length; ++d)
                f[d] = Number(l[d + 2]);
            r[c] = f;
        } else if (o == "@") {
            if (c == "bones") {
                for (var p = [], _ = Number(l[1]), d = 0; d < _; ++d) {
                    var E = l
                        .slice(3 + d * 17, 3 + (d + 1) * 17 - 1)
                        .map(Number);
                    p.push([l[2 + d * 17], E]);
                }
                r.bones = p;
            } else if (c == "bind_matrix")
                r.bind_matrix = l.slice(1, 17).map(Number);
            else if (c == "groups") {
                r.info = { groups: [] };
                for (var m = Number(l[1]), d = 0; d < m; ++d) {
                    var b = {
                        name: l[2 + d * 4],
                        material: l[2 + d * 4 + 1],
                        start: Number(l[2 + d * 4 + 2]),
                        length: Number(l[2 + d * 4 + 3]),
                    };
                    r.info.groups.push(b);
                }
            }
        } else console.warn("type unknown: " + l[0]);
    }
    if (t.only_data) return r;
    var L = null;
    return (L = Mesh.load(r, null, t.mesh)), L.updateBoundingBox(), L;
};
Mesh.encoders.mesh = function (e, t) {
    var r = [];
    for (var n in e.vertexBuffers) {
        var s = e.vertexBuffers[n],
            a = global.typedArrayToArray(s.data);
        if (s.normalize && s.data.constructor == Uint8Array)
            for (var o = 0; o < a.length; ++o) a[o] /= 255;
        var l = ["-" + n, s.data.length, s.data, a];
        r.push(l.join(","));
    }
    for (var n in e.indexBuffers) {
        var s = e.indexBuffers[n],
            a = global.typedArrayToArray(s.data),
            l = ["*" + n, s.data.length, s.data, a];
        r.push(l.join(","));
    }
    if (
        (e.bounding &&
            r.push(
                [
                    "@bounding",
                    global.typedArrayToArray(e.bounding.subarray(0, 6)),
                ].join(",")
            ),
        e.info && e.info.groups)
    ) {
        for (var c = [], o = 0; o < e.info.groups.length; ++o) {
            var u = e.info.groups[o];
            c.push(u.name, u.material, u.start, u.length);
        }
        r.push(["@groups", e.info.groups.length].concat(c).join(","));
    }
    return (
        e.bones && r.push(["@bones", e.bones.length, e.bones.flat()].join(",")),
        e.bind_matrix &&
            r.push(
                ["@bind_matrix", global.typedArrayToArray(e.bind_matrix)].join(
                    ","
                )
            ),
        r.join(`
`)
    );
};
global.WBin && (global.WBin.classes.Mesh = Mesh);
Mesh.binary_file_formats.wbin = !0;
Mesh.parsers.wbin = Mesh.fromBinary = function (e, t) {
    t = t || {};
    var r = null;
    if (e.constructor == ArrayBuffer) {
        if (!global.WBin)
            throw "To use binary meshes you need to install WBin.js from https://github.com/jagenjo/litescene.js/blob/master/src/utils/wbin.js ";
        r = global.WBin.load(e, !0);
    } else r = e;
    r.info ||
        console.warn(
            "This WBin doesn't seem to contain a mesh. Classname: ",
            r["@classname"]
        ),
        r.format && GL$1.Mesh.decompress(r);
    var n = {};
    if (r.vertex_buffers)
        for (var s in r.vertex_buffers)
            n[r.vertex_buffers[s]] = r[r.vertex_buffers[s]];
    else
        r.vertices && (n.vertices = r.vertices),
            r.normals && (n.normals = r.normals),
            r.coords && (n.coords = r.coords),
            r.weights && (n.weights = r.weights),
            r.bone_indices && (n.bone_indices = r.bone_indices);
    var a = {};
    if (r.index_buffers)
        for (var s in r.index_buffers)
            a[r.index_buffers[s]] = r[r.index_buffers[s]];
    else
        r.triangles && (a.triangles = r.triangles),
            r.wireframe && (a.wireframe = r.wireframe);
    var o = {
        vertex_buffers: n,
        index_buffers: a,
        bounding: r.bounding,
        info: r.info,
    };
    if (r.bones) {
        o.bones = r.bones;
        for (var s = 0; s < o.bones.length; ++s)
            o.bones[s][1] = mat4.clone(o.bones[s][1]);
        r.bind_matrix && (o.bind_matrix = mat4.clone(r.bind_matrix));
    }
    if ((r.morph_targets && (o.morph_targets = r.morph_targets), t.only_data))
        return o;
    var l = t.mesh || new GL$1.Mesh();
    return l.configure(o), l;
};
Mesh.encoders.wbin = function (e, t) {
    return e.updateBoundingBox(), e.toBinary(t);
};
Mesh.prototype.toBinary = function (e) {
    if (!global.WBin)
        throw "to use Mesh.toBinary you need to have WBin included. Check the repository for wbin.js";
    this.info || (this.info = {});
    var t = {
        object_class: "Mesh",
        info: this.info,
        groups: this.groups,
    };
    if (this.bones) {
        for (var r = [], n = 0; n < this.bones.length; ++n)
            r.push([this.bones[n][0], mat4.toArray(this.bones[n][1])]);
        (t.bones = r), this.bind_matrix && (t.bind_matrix = this.bind_matrix);
    }
    this.bounding || this.updateBoundingBox(), (t.bounding = this.bounding);
    var s = [],
        a = [];
    for (var n in this.vertexBuffers) {
        var o = this.vertexBuffers[n];
        (t[o.name] = o.data),
            s.push(o.name),
            o.name == "vertices" && (t.info.num_vertices = o.data.length / 3);
    }
    for (var n in this.indexBuffers) {
        var o = this.indexBuffers[n];
        (t[n] = o.data), a.push(n);
    }
    (t.vertex_buffers = s),
        (t.index_buffers = a),
        GL$1.Mesh.enable_wbin_compression && GL$1.Mesh.compress(t);
    var l = global.WBin.create(t, "Mesh");
    return l;
};
Mesh.compress = function (e, t) {
    (t = t || "bounding_compressed"),
        (e.format = {
            type: t,
        });
    var r = Mesh.compressors[t];
    if (!r) throw "compression format not supported:" + t;
    return r(e);
};
Mesh.decompress = function (e) {
    if (e.format) {
        var t = Mesh.decompressors[e.format.type];
        if (!t) throw "decompression format not supported:" + e.format.type;
        return t(e);
    }
};
Mesh.compressors.bounding_compressed = function (e) {
    if (!e.vertex_buffers) throw "buffers not found";
    for (
        var t = global.BBox.getMin(e.bounding),
            r = global.BBox.getMax(e.bounding),
            n = vec3.sub(vec3.create(), r, t),
            s = e.vertices,
            a = new Uint16Array(s.length),
            o = 0;
        o < s.length;
        o += 3
    )
        (a[o] = ((s[o] - t[0]) / n[0]) * 65535),
            (a[o + 1] = ((s[o + 1] - t[1]) / n[1]) * 65535),
            (a[o + 2] = ((s[o + 2] - t[2]) / n[2]) * 65535);
    if (((e.vertices = a), e.normals)) {
        for (
            var l = e.normals,
                c = new Uint8Array(l.length),
                u = c.constructor == Uint8Array ? 255 : 65535,
                o = 0;
            o < l.length;
            o += 3
        )
            (c[o] = (l[o] * 0.5 + 0.5) * u),
                (c[o + 1] = (l[o + 1] * 0.5 + 0.5) * u),
                (c[o + 2] = (l[o + 2] * 0.5 + 0.5) * u);
        e.normals = c;
    }
    if (e.coords) {
        for (
            var h = e.coords, f = [1e4, 1e4, -1e4, -1e4], o = 0;
            o < h.length;
            o += 2
        ) {
            var d = h[o];
            f[0] > d ? (f[0] = d) : f[2] < d && (f[2] = d);
            var p = h[o + 1];
            f[1] > p ? (f[1] = p) : f[3] < p && (f[3] = p);
        }
        e.format.uvs_bounding = f;
        for (
            var _ = new Uint16Array(h.length),
                n = [f[2] - f[0], f[3] - f[1]],
                o = 0;
            o < h.length;
            o += 2
        )
            (_[o] = ((h[o] - f[0]) / n[0]) * 65535),
                (_[o + 1] = ((h[o + 1] - f[1]) / n[1]) * 65535);
        e.coords = _;
    }
    if (e.weights) {
        for (
            var E = e.weights,
                m = new Uint16Array(E.length),
                b = m.constructor == Uint8Array ? 255 : 65535,
                o = 0;
            o < E.length;
            o += 4
        )
            (m[o] = E[o] * b),
                (m[o + 1] = E[o + 1] * b),
                (m[o + 2] = E[o + 2] * b),
                (m[o + 3] = E[o + 3] * b);
        e.weights = m;
    }
};
Mesh.decompressors.bounding_compressed = function (e) {
    var t = e.bounding;
    if (!t)
        throw "error in mesh decompressing data: bounding not found, cannot use the bounding decompression.";
    for (
        var r = global.BBox.getMin(t),
            n = global.BBox.getMax(t),
            s = vec3.sub(vec3.create(), n, r),
            a = e.format,
            o = 1 / 255,
            l = 1 / 65535,
            c = e.vertices,
            u = new Float32Array(c.length),
            h = 0,
            f = c.length;
        h < f;
        h += 3
    )
        (u[h] = c[h] * l * s[0] + r[0]),
            (u[h + 1] = c[h + 1] * l * s[1] + r[1]),
            (u[h + 2] = c[h + 2] * l * s[2] + r[2]);
    if (
        ((e.vertices = u), e.normals && e.normals.constructor != Float32Array)
    ) {
        for (
            var d = e.normals,
                p = new Float32Array(d.length),
                _ = d.constructor == Uint8Array ? o : l,
                h = 0,
                f = d.length;
            h < f;
            h += 3
        ) {
            (p[h] = d[h] * _ * 2 - 1),
                (p[h + 1] = d[h + 1] * _ * 2 - 1),
                (p[h + 2] = d[h + 2] * _ * 2 - 1);
            var E = p.subarray(h, h + 3);
            vec3.normalize(E, E);
        }
        e.normals = p;
    }
    if (e.coords && a.uvs_bounding && e.coords.constructor != Float32Array) {
        for (
            var m = e.coords,
                b = a.uvs_bounding,
                s = [b[2] - b[0], b[3] - b[1]],
                L = new Float32Array(m.length),
                h = 0,
                f = m.length;
            h < f;
            h += 2
        )
            (L[h] = m[h] * l * s[0] + b[0]),
                (L[h + 1] = m[h + 1] * l * s[1] + b[1]);
        e.coords = L;
    }
    if (e.weights && e.weights.constructor != Float32Array) {
        for (
            var T = e.weights,
                g = new Float32Array(T.length),
                A = T.constructor == Uint8Array ? o : l,
                h = 0,
                f = T.length;
            h < f;
            h += 4
        )
            (g[h] = T[h] * A),
                (g[h + 1] = T[h + 1] * A),
                (g[h + 2] = T[h + 2] * A),
                (g[h + 3] = T[h + 3] * A);
        e.weights = g;
    }
};
const { hexColorToRGBA } = global;
if (typeof GL$1 > "u")
    throw "litegl.js must be included to use enableWebGLCanvas";
function enableWebGLCanvas(e, t) {
    var r;
    if (((t = t || {}), e.is_webgl)) r = e.gl;
    else {
        (t.canvas = e), (t.alpha = !0), (t.stencil = !0);
        try {
            r = GL$1.create(t);
        } catch {
            return (
                console.log(
                    "This canvas cannot be used as WebGL, maybe WebGL is not supported or this canvas has already a 2D context associated"
                ),
                (r = e.getContext("2d", t)),
                r
            );
        }
    }
    const n = r.getError();
    if (
        (n !== r.NO_ERROR && console.error("WebGL error:", n),
        e.canvas2DtoWebGL_enabled)
    )
        return r;
    var s = 50,
        a = 1e4,
        o = 1e3;
    e.canvas2DtoWebGL_enabled = !0;
    var l = null,
        c = (e.ctx = r);
    (c.WebGLCanvas = {}), fromValues$2(1, 1, 1, 1);
    var u = 0,
        h = new Float32Array(a * 3),
        f = new GL$1.Mesh(),
        d = f.createVertexBuffer("vertices", null, null, h, r.STREAM_DRAW),
        p = GL$1.Mesh.getScreenQuad(),
        _ = GL$1.Mesh.circle({ size: 1 }),
        E = create$4(),
        m = t.anisotropic !== void 0 ? t.anisotropic : 2,
        b = {
            u_texture: 0,
        },
        L = {};
    t.allow3D && (L.EXTRA_PROJECTION = "");
    var T = (r.WebGLCanvas.textures_atlas = {});
    r.WebGLCanvas.clearAtlas = function () {
        T = r.WebGLCanvas.textures_atlas = {};
    };
    var g = null,
        A = null,
        G = null,
        M = null,
        N = null,
        I = null,
        B = null,
        O = null,
        F = null,
        P = null;
    (r.WebGLCanvas.set3DMatrix = function (S) {
        S ? E.set(S) : identity$1(E),
            L.EXTRA_PROJECTION == null &&
                ((L.EXTRA_PROJECTION = ""), C(), (b.u_projection = E)),
            (b.u_projection_enabled = !!S);
    }),
        C();
    function C() {
        (g = `
				precision highp float;
				attribute vec3 a_vertex;
				uniform vec2 u_viewport;
				uniform mat3 u_transform;
				#ifdef EXTRA_PROJECTION
					uniform bool u_projection_enabled;
					uniform mat4 u_projection;
				#endif
				varying float v_visible;
				void main() { 
					vec3 pos = a_vertex;
					v_visible = pos.z;
					pos = u_transform * vec3(pos.xy,1.0);
					pos.z = 0.0;
					#ifdef EXTRA_PROJECTION
						if(u_projection_enabled)
						{
							gl_Position = u_projection * vec4(pos.xy,0.0,1.0);
							return;
						}
					#endif
					//normalize
					pos.x = (2.0 * pos.x / u_viewport.x) - 1.0;
					pos.y = -((2.0 * pos.y / u_viewport.y) - 1.0);
					gl_Position = vec4(pos, 1.0); 
				}
				`),
            (A = `
			precision highp float;
			attribute vec3 a_vertex;
			attribute vec2 a_coord;
			varying vec2 v_coord;
			uniform vec2 u_position;
			uniform vec2 u_size;
			uniform vec2 u_viewport;
			uniform mat3 u_transform;
			#ifdef EXTRA_PROJECTION
				uniform bool u_projection_enabled;
				uniform mat4 u_projection;
			#endif
			void main() { 
				vec3 pos = vec3(u_position + vec2(a_coord.x,1.0 - a_coord.y)  * u_size, 1.0);
				v_coord = a_coord; 
				pos = u_transform * pos;
				pos.z = 0.0;
				#ifdef EXTRA_PROJECTION
					if(u_projection_enabled)
					{
						gl_Position = u_projection * vec4(pos.xy,0.0,1.0);
						return;
					}
				#endif
				//normalize
				pos.x = (2.0 * pos.x / u_viewport.x) - 1.0;
				pos.y = -((2.0 * pos.y / u_viewport.y) - 1.0);
				gl_Position = vec4(pos, 1.0); 
			}
		`),
            (G = new GL$1.Shader(
                A,
                `
				precision highp float;
				uniform vec4 u_color;
				void main() {
					gl_FragColor = u_color;
				}
			`,
                L
            )),
            (M = new GL$1.Shader(
                A,
                `
				precision highp float;
				varying vec2 v_coord;
				uniform vec4 u_color;
				uniform sampler2D u_texture;
				void main() {
					gl_FragColor = u_color * texture2D( u_texture, v_coord );
				}
			`,
                L
            )),
            (N = new GL$1.Shader(
                A,
                `
				precision highp float;
				varying vec2 v_coord;
				uniform vec4 u_color;
				uniform sampler2D u_texture;
				void main() {
					vec4 color = u_color * texture2D( u_texture, v_coord );
					if(color.a <= 0.0)
						discard;
					gl_FragColor = color;
				}
			`,
                L
            )),
            (I = new GL$1.Shader(
                g,
                `
				precision highp float;
				varying float v_visible;
				uniform vec4 u_color;
				void main() {
					if (v_visible == 0.0)
						discard;
					gl_FragColor = u_color;
				}
			`,
                L
            )),
            (B = new GL$1.Shader(
                GL$1.Shader.QUAD_VERTEX_SHADER,
                `
				precision highp float;
				uniform sampler2D u_texture;
				uniform vec4 u_color;
				uniform vec4 u_texture_transform;
				varying vec2 v_coord;
				void main() {
					vec2 uv = v_coord * u_texture_transform.zw + vec2(u_texture_transform.x,0.0);
					uv.y = uv.y - u_texture_transform.y + (1.0 - u_texture_transform.w);
					uv = clamp(uv,vec2(0.0),vec2(1.0));
					gl_FragColor = u_color * texture2D(u_texture, uv);
				}
			`,
                L
            )),
            (O = new GL$1.Shader(
                g,
                `
				precision highp float;
				varying float v_visible;
				uniform vec4 u_color;
				uniform sampler2D u_texture;
				uniform vec4 u_texture_transform;
				uniform vec2 u_viewport;
				uniform mat3 u_itransform;
				void main() {
					vec2 pos = (u_itransform * vec3( gl_FragCoord.s, u_viewport.y - gl_FragCoord.t,1.0)).xy;
					pos *= vec2( (u_viewport.x * u_texture_transform.z), (u_viewport.y * u_texture_transform.w) );
					vec2 uv = fract(pos / u_viewport) + u_texture_transform.xy;
					uv.y = 1.0 - uv.y;
					gl_FragColor = u_color * texture2D( u_texture, uv);
				}
			`,
                L
            )),
            (F = new GL$1.Shader(
                g,
                `
				precision highp float;
				varying float v_visible;
				uniform vec4 u_color;
				uniform sampler2D u_texture;
				uniform vec4 u_gradient;
				uniform vec2 u_viewport;
				uniform mat3 u_itransform;
				void main() {
					vec2 pos = (u_itransform * vec3( gl_FragCoord.s, u_viewport.y - gl_FragCoord.t,1.0)).xy;
					//vec2 pos = vec2( gl_FragCoord.s, u_viewport.y - gl_FragCoord.t);
					vec2 AP = pos - u_gradient.xy;
					vec2 AB = u_gradient.zw - u_gradient.xy;
					float dotAPAB = dot(AP,AB);
					float dotABAB = dot(AB,AB);
					float x = dotAPAB / dotABAB;
					vec2 uv = vec2( x, 0.0 );
					gl_FragColor = u_color * texture2D( u_texture, uv );
				}
			`,
                L
            ));
        var S = `
			precision highp float;
			attribute vec3 a_vertex;
			attribute vec2 a_coord;
			varying vec2 v_coord;
			uniform vec2 u_viewport;
			uniform mat3 u_transform;
			#ifdef EXTRA_PROJECTION
				uniform bool u_projection_enabled;
				uniform mat4 u_projection;
			#endif
			uniform float u_pointSize;
			void main() { 
				vec3 pos = a_vertex;
				pos = u_transform * pos;
				pos.z = 0.0;
				#ifdef EXTRA_PROJECTION
					if(u_projection_enabled)
					{
						gl_Position = u_projection * vec4(pos.xy,0.0,1.0);
						return;
					}
				#endif
				//normalize
				pos.x = (2.0 * pos.x / u_viewport.x) - 1.0;
				pos.y = -((2.0 * pos.y / u_viewport.y) - 1.0);
				gl_Position = vec4(pos, 1.0); 
				gl_PointSize = ceil(u_pointSize);
				v_coord = a_coord;
			}
			`,
            D = `
			precision highp float;
			uniform sampler2D u_texture;
			uniform float u_iCharSize;
			uniform vec4 u_color;
			uniform float u_pointSize;
			uniform vec2 u_viewport;
			uniform vec2 u_angle_sincos;
			varying vec2 v_coord;
			void main() {
				vec2 uv = vec2(1.0 - gl_PointCoord.s, gl_PointCoord.t);
				uv = vec2( ((uv.y - 0.5) * u_angle_sincos.y - (uv.x - 0.5) * u_angle_sincos.x) + 0.5, ((uv.x - 0.5) * u_angle_sincos.y + (uv.y - 0.5) * u_angle_sincos.x) + 0.5);
				uv = v_coord - uv * u_iCharSize + vec2(u_iCharSize*0.5);
				uv.y = 1.0 - uv.y;
				gl_FragColor = vec4(u_color.xyz, u_color.a * texture2D(u_texture, uv, -1.0  ).a);
      }
			`;
        P = new GL$1.Shader(S, D, L);
    }
    (c.createImageShader = function (S) {
        return new GL$1.Shader(
            GL$1.Shader.QUAD_VERTEX_SHADER,
            `
			precision highp float;
			uniform sampler2D u_texture;
			uniform vec4 u_color;
			uniform vec4 u_texture_transform;
			uniform vec2 u_viewport;
			varying vec2 v_coord;
			void main() {
				vec2 uv = v_coord * u_texture_transform.zw + vec2(u_texture_transform.x,0.0);
				uv.y = uv.y - u_texture_transform.y + (1.0 - u_texture_transform.w);
				uv = clamp(uv,vec2(0.0),vec2(1.0));
				vec4 color = u_color * texture2D(u_texture, uv);
				` +
                S +
                `;
				gl_FragColor = color;
			}
		`,
            L
        );
    }),
        (c.WebGLCanvas.vertex_shader = g),
        (c._matrix = create$5());
    var U = create$5(),
        X = create(),
        z = create$2(),
        q = create$2(),
        Y = create();
    (c._stack = []), (c._stack_size = 0);
    var H = 0,
        Z = c.viewport_data.subarray(2, 4);
    (c.translate = function (S, D) {
        (X[0] = S), (X[1] = D), translate$1(this._matrix, this._matrix, X);
    }),
        (c.rotate = function (S) {
            rotate$2(this._matrix, this._matrix, S), (H += S);
        }),
        (c.scale = function (S, D) {
            (X[0] = S), (X[1] = D), scale$5(this._matrix, this._matrix, X);
        }),
        (c.resetTransform = function () {
            (r._stack_size = 0),
                this._matrix.set([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                (H = 0);
        }),
        (c.save = function () {
            if (!(this._stack_size >= 32)) {
                var S = null;
                this._stack_size == this._stack.length
                    ? (S = this._stack[this._stack_size] =
                          {
                              matrix: create$5(),
                              fillColor: create$2(),
                              strokeColor: create$2(),
                              shadowColor: create$2(),
                              globalAlpha: 1,
                              font: "",
                              fontFamily: "",
                              fontSize: 14,
                              fontMode: "",
                              textAlign: "",
                              clip_level: 0,
                          })
                    : (S = this._stack[this._stack_size]),
                    this._stack_size++,
                    S.matrix.set(this._matrix),
                    S.fillColor.set(this._fillcolor),
                    S.strokeColor.set(this._strokecolor),
                    S.shadowColor.set(this._shadowcolor),
                    (S.globalAlpha = this._globalAlpha),
                    (S.font = this._font),
                    (S.fontFamily = this._font_family),
                    (S.fontSize = this._font_size),
                    (S.fontMode = this._font_mode),
                    (S.textAlign = this.textAlign),
                    (S.clip_level = this.clip_level);
            }
        }),
        (c.restore = function () {
            if (this._stack_size == 0) {
                identity$2(this._matrix), (H = 0);
                return;
            }
            this._stack_size--;
            var S = this._stack[this._stack_size];
            this._matrix.set(S.matrix),
                this._fillcolor.set(S.fillColor),
                this._strokecolor.set(S.strokeColor),
                this._shadowcolor.set(S.shadowColor),
                (this._globalAlpha = S.globalAlpha),
                (this._font = S.font),
                (this._font_family = S.fontFamily),
                (this._font_size = parseInt(S.fontSize)),
                (this._font_mode = S.fontMode),
                (this.textAlign = S.textAlign);
            var D = this.clip_level;
            (this.clip_level = S.clip_level),
                (H = Math.atan2(this._matrix[3], this._matrix[4])),
                D == this.clip_level ||
                    (this.clip_level == 0
                        ? (r.enable(r.STENCIL_TEST),
                          r.clearStencil(0),
                          r.clear(r.STENCIL_BUFFER_BIT),
                          r.disable(r.STENCIL_TEST))
                        : (r.stencilFunc(r.LEQUAL, this.clip_level, 255),
                          r.stencilOp(r.KEEP, r.KEEP, r.KEEP)));
        }),
        (c.clip = function () {
            this.clip_level == 0,
                this.clip_level++,
                r.colorMask(!1, !1, !1, !1),
                r.depthMask(!1),
                r.enable(r.STENCIL_TEST),
                r.stencilFunc(r.EQUAL, this.clip_level - 1, 255),
                r.stencilOp(r.KEEP, r.KEEP, r.INCR),
                this.fill(),
                r.colorMask(!0, !0, !0, !0),
                r.depthMask(!0),
                r.stencilFunc(r.EQUAL, this.clip_level, 255),
                r.stencilOp(r.KEEP, r.KEEP, r.KEEP);
        }),
        (c.clipImage = function (S, D, V, $, W) {
            this.clip_level++,
                r.colorMask(!1, !1, !1, !1),
                r.depthMask(!1),
                r.enable(r.STENCIL_TEST),
                r.stencilFunc(r.EQUAL, this.clip_level - 1, 255),
                r.stencilOp(r.KEEP, r.KEEP, r.INCR),
                this.drawImage(S, D, V, $, W, N),
                r.colorMask(!0, !0, !0, !0),
                r.depthMask(!0),
                r.stencilFunc(r.EQUAL, this.clip_level, 255),
                r.stencilOp(r.KEEP, r.KEEP, r.KEEP);
        }),
        (c.transform = function (S, D, V, $, W, J) {
            var K = U;
            (K[0] = S),
                (K[1] = D),
                (K[2] = 0),
                (K[3] = V),
                (K[4] = $),
                (K[5] = 0),
                (K[6] = W),
                (K[7] = J),
                (K[8] = 1),
                multiply$5(this._matrix, this._matrix, K),
                (H = Math.atan2(this._matrix[0], this._matrix[1]));
        }),
        (c.setTransform = function (S, D, V, $, W, J) {
            var K = this._matrix;
            (K[0] = S),
                (K[1] = D),
                (K[2] = 0),
                (K[3] = V),
                (K[4] = $),
                (K[5] = 0),
                (K[6] = W),
                (K[7] = J),
                (K[8] = 1),
                (H = Math.atan2(this._matrix[0], this._matrix[1]));
        });
    function oe(S) {
        var D = null;
        if (S.constructor === GL$1.Texture)
            return S._context_id == r.context_id ? S : null;
        if ((S.gl || (S.gl = {}), S.src)) {
            var V = r.REPEAT;
            return (
                (D = S.gl[r.context_id]),
                D
                    ? (S.mustUpdate && (D.uploadData(S), (S.mustUpdate = !1)),
                      D)
                    : (S.gl[r.context_id] = GL$1.Texture.fromImage(S, {
                          magFilter: r.LINEAR,
                          minFilter: r.LINEAR_MIPMAP_LINEAR,
                          wrap: V,
                          ignore_pot: !0,
                          premultipliedAlpha: !0,
                          anisotropic: m,
                      }))
            );
        } else
            return (
                (D = S.gl[r.context_id]),
                D
                    ? (S.mustUpdate && (D.uploadData(S), (S.mustUpdate = !1)),
                      D)
                    : (S.gl[r.context_id] = GL$1.Texture.fromImage(S, {
                          minFilter: r.LINEAR,
                          magFilter: r.LINEAR,
                          anisotropic: m,
                      }))
            );
    }
    (c.drawImage = function (S, D, V, $, W, J) {
        if (S) {
            var K = S.videoWidth || S.width,
                ne = S.videoHeight || S.height;
            if (!(K == 0 || ne == 0)) {
                var j = oe(S);
                j &&
                    (arguments.length == 9
                        ? (q.set([D / K, V / ne, $ / K, W / ne]),
                          (D = arguments[5]),
                          (V = arguments[6]),
                          ($ = arguments[7]),
                          (W = arguments[8]),
                          (J = B))
                        : q.set([0, 0, 1, 1]),
                    (X[0] = D),
                    (X[1] = V),
                    (Y[0] = $ === void 0 ? j.width : $),
                    (Y[1] = W === void 0 ? j.height : W),
                    j.bind(0),
                    j !== S &&
                        r.texParameteri(
                            r.TEXTURE_2D,
                            r.TEXTURE_MAG_FILTER,
                            this.imageSmoothingEnabled ? r.LINEAR : r.NEAREST
                        ),
                    this.tintImages ||
                        ((z[0] = z[1] = z[2] = 1), (z[3] = this._globalAlpha)),
                    (b.u_color = this.tintImages ? this._fillcolor : z),
                    (b.u_position = X),
                    (b.u_size = Y),
                    (b.u_transform = this._matrix),
                    (b.u_texture_transform = q),
                    (b.u_viewport = Z),
                    (J = J || M),
                    J.uniforms(b).draw(p),
                    (E[14] -= 1e-3));
            }
        }
    }),
        (c.createPattern = function (S) {
            return oe(S);
        });
    function he(S, D, V, $) {
        (this.id = c._last_gradient_id++ % c._max_gradients),
            (this.points = new Float32Array([S, D, V, $])),
            (this.stops = []),
            (this._must_update = !0);
    }
    (c._last_gradient_id = 0),
        (c._max_gradients = 16),
        (c._gradients_pool = []),
        (he.prototype.addColorStop = function (S, D) {
            var V = hexColorToRGBA(D),
                $ = new Uint8Array(4);
            ($[0] = Math.clamp(V[0], 0, 1) * 255),
                ($[1] = Math.clamp(V[1], 0, 1) * 255),
                ($[2] = Math.clamp(V[2], 0, 1) * 255),
                ($[3] = Math.clamp(V[3], 0, 1) * 255),
                this.stops.push([S, $]),
                this.stops.sort(function (W, J) {
                    return W[0] > J[0] ? 1 : J[0] > W[0] ? -1 : 0;
                }),
                (this._must_update = !0);
        }),
        (he.prototype.toTexture = function () {
            if (
                (this._texture ||
                    (this.id != -1 &&
                        (this._texture = c._gradients_pool[this.id]),
                    this._texture ||
                        ((this._texture = new GL$1.Texture(128, 1, {
                            format: r.RGBA,
                            magFilter: r.LINEAR,
                            wrap: r.CLAMP_TO_EDGE,
                            minFilter: r.NEAREST,
                        })),
                        this.id != -1 &&
                            (c._gradients_pool[this.id] = this._texture))),
                !this._must_update)
            )
                return this._texture;
            if (((this._must_update = !1), this.stops.length < 1))
                return this._texture;
            if (this.stops.length < 2)
                return this._texture.fill(this.stops[0][1]), this._texture;
            for (
                var S = 0,
                    D = this.stops[S],
                    V = this.stops[S + 1],
                    $ = new Uint8Array(128 * 4),
                    W = 0;
                W < 128;
                W += 1
            ) {
                var J = $.subarray(W * 4, W * 4 + 4),
                    K = W / 128;
                if (D[0] > K)
                    if (S == 0) J.set(D[1]);
                    else {
                        if (
                            ((S += 1),
                            (D = this.stops[S]),
                            (V = this.stops[S + 1]),
                            !V)
                        )
                            break;
                        W -= 1;
                    }
                else if (D[0] <= K && K < V[0]) {
                    var ne = (K - D[0]) / (V[0] - D[0]);
                    lerp$2(J, D[1], V[1], ne);
                } else if (V[0] <= K) {
                    if (
                        ((S += 1),
                        (D = this.stops[S]),
                        (V = this.stops[S + 1]),
                        !V)
                    )
                        break;
                    W -= 1;
                }
            }
            if (W < 128) for (var j = W; j < 128; j += 1) $.set(D[1], j * 4);
            return this._texture.uploadData($), this._texture;
        }),
        (c.createLinearGradient = function (S, D, V, $) {
            return new he(S, D, V, $);
        }),
        (c.beginPath = function () {
            u = 0;
        }),
        (c.closePath = function () {
            u < 3 ||
                ((h[u] = h[0]), (h[u + 1] = h[1]), (h[u + 2] = 1), (u += 3));
        }),
        (c.moveTo = function (S, D) {
            u == 0
                ? ((h[u] = S), (h[u + 1] = D), (h[u + 2] = 1), (u += 3))
                : ((h[u] = h[u - 3]),
                  (h[u + 1] = h[u - 2]),
                  (h[u + 2] = 0),
                  (u += 3),
                  (h[u] = S),
                  (h[u + 1] = D),
                  (h[u + 2] = 0),
                  (u += 3));
        }),
        (c.lineTo = function (S, D) {
            (h[u] = S), (h[u + 1] = D), (h[u + 2] = 1), (u += 3);
        }),
        (c.bezierCurveTo = function (S, D, V, $, W, J) {
            if (!(u < 3))
                for (
                    var K = [h[u - 3], h[u - 2]],
                        ne = [K, [S, D], [V, $], [W, J]],
                        j = 0;
                    j <= s;
                    j++
                ) {
                    var Q = j / s,
                        te,
                        ee,
                        se,
                        ae,
                        le,
                        ve,
                        be,
                        Le;
                    (se = 3 * (ne[1][0] - ne[0][0])),
                        (ee = 3 * (ne[2][0] - ne[1][0]) - se),
                        (te = ne[3][0] - ne[0][0] - se - ee),
                        (ve = 3 * (ne[1][1] - ne[0][1])),
                        (le = 3 * (ne[2][1] - ne[1][1]) - ve),
                        (ae = ne[3][1] - ne[0][1] - ve - le),
                        (be = Q * Q),
                        (Le = be * Q);
                    var Me = te * Le + ee * be + se * Q + ne[0][0],
                        xe = ae * Le + le * be + ve * Q + ne[0][1];
                    (h[u] = Me), (h[u + 1] = xe), (h[u + 2] = 1), (u += 3);
                }
        }),
        (c.quadraticCurveTo = function (S, D, V, $) {
            if (!(u < 3))
                for (var W = h[u - 3], J = h[u - 2], K = 0; K <= s; K++) {
                    var ne = K / s,
                        j = 1 - ne,
                        Q = W * j + S * ne,
                        te = J * j + D * ne,
                        ee = S * j + V * ne,
                        se = D * j + $ * ne;
                    (h[u] = Q * j + ee * ne),
                        (h[u + 1] = te * j + se * ne),
                        (h[u + 2] = 1),
                        (u += 3);
                }
        }),
        (c.fill = function () {
            if (!(u < 9)) {
                d.uploadRange(0, u * 4), (b.u_viewport = Z);
                var S = I;
                this._shadowcolor[3] > 0 &&
                    ((b.u_color = this._shadowcolor),
                    this.save(),
                    this.translate(this.shadowOffsetX, this.shadowOffsetY),
                    S.uniforms(b).drawRange(f, r.TRIANGLE_FAN, 0, u / 3),
                    this.restore()),
                    (b.u_color = this._fillcolor),
                    (b.u_transform = this._matrix);
                var D = this._fillStyle;
                if (D.constructor === he) {
                    var V = D,
                        $ = V.toTexture();
                    (b.u_color = [1, 1, 1, this.globalAlpha]),
                        (b.u_gradient = V.points),
                        (b.u_texture = 0),
                        (b.u_itransform = invert$2(U, this._matrix)),
                        $.bind(0),
                        (S = F);
                } else if (D.constructor === GL$1.Texture) {
                    var $ = D;
                    (b.u_color = [1, 1, 1, this._globalAlpha]),
                        (b.u_texture = 0),
                        z.set([0, 0, 1 / $.width, 1 / $.height]),
                        (b.u_texture_transform = z),
                        (b.u_itransform = invert$2(U, this._matrix)),
                        $.bind(0),
                        (S = O);
                }
                S.uniforms(b).drawRange(f, r.TRIANGLE_FAN, 0, u / 3),
                    (E[14] -= 1e-3);
            }
        }),
        (c.strokeThin = function () {
            u < 6 ||
                (d.uploadRange(0, u * 4),
                r.setLineWidth(this.lineWidth),
                (b.u_color = this._strokecolor),
                (b.u_transform = this._matrix),
                (b.u_viewport = Z),
                I.uniforms(b).drawRange(f, r.LINE_STRIP, 0, u / 3));
        });
    var ce = new Float32Array(a * 3),
        ie = new GL$1.Mesh(),
        de = ie.createVertexBuffer("vertices", null, null, ce, r.STREAM_DRAW);
    (c.stroke = function () {
        if (!(u < 6)) {
            if (
                ((X[0] = this._matrix[0]),
                (X[1] = this._matrix[1]),
                this.lineWidth * length(X) <= 1)
            )
                return this.strokeThin();
            var S = ce,
                D = u,
                V = this.lineWidth * 0.5,
                $ = h,
                W = 0,
                J = 0,
                K = 0,
                ne = 0,
                j = 0,
                Q = 0,
                te = 0,
                ee = 0;
            if ($[0] == $[u - 3] && $[1] == $[u - 2]) {
                (W = $[u - 3] - $[u - 6]), (J = $[u - 2] - $[u - 5]);
                var se = Math.sqrt(W * W + J * J);
                se != 0 && ((W = W / se), (J = J / se));
            }
            var ae,
                le = 0;
            for (ae = 0; ae < D - 3; ae += 3) {
                (K = W),
                    (ne = J),
                    (W = $[ae + 3] - $[ae]),
                    (J = $[ae + 4] - $[ae + 1]);
                var se = Math.sqrt(W * W + J * J);
                se != 0 && ((W = W / se), (J = J / se)),
                    ae == 0 && ((te = W), (ee = J)),
                    (j = W + K),
                    (Q = J + ne);
                var se = Math.sqrt(j * j + Q * Q);
                se != 0 && ((j = j / se), (Q = Q / se)),
                    (S[le + 0] = $[ae] - Q * V),
                    (S[le + 1] = $[ae + 1] + j * V),
                    (S[le + 2] = 1),
                    (S[le + 3] = $[ae] + Q * V),
                    (S[le + 4] = $[ae + 1] - j * V),
                    (S[le + 5] = 1),
                    (le += 6);
            }
            if ($[0] == $[u - 3] && $[1] == $[u - 2]) {
                (j = W + te), (Q = J + ee);
                var se = Math.sqrt(j * j + Q * Q);
                se != 0 && ((j = j / se), (Q = Q / se)),
                    (S[le + 0] = $[ae] - Q * V),
                    (S[le + 1] = $[ae + 1] + j * V),
                    (S[le + 2] = 1),
                    (S[le + 3] = $[ae] + Q * V),
                    (S[le + 4] = $[ae + 1] - j * V),
                    (S[le + 5] = 1);
            } else {
                var se = Math.sqrt(W * W + J * J);
                se != 0 && ((j = W / se), (Q = J / se)),
                    (S[le + 0] = $[ae] - (Q - j) * V),
                    (S[le + 1] = $[ae + 1] + (j + Q) * V),
                    (S[le + 2] = 1),
                    (S[le + 3] = $[ae] + (Q + j) * V),
                    (S[le + 4] = $[ae + 1] - (j - Q) * V),
                    (S[le + 5] = 1);
            }
            (le += 6),
                de.upload(r.STREAM_DRAW),
                de.uploadRange(0, le * 4),
                (b.u_transform = this._matrix),
                (b.u_viewport = Z),
                this._shadowcolor[3] > 0 &&
                    ((b.u_color = this._shadowcolor),
                    this.save(),
                    this.translate(this.shadowOffsetX, this.shadowOffsetY),
                    I.uniforms(b).drawRange(f, r.TRIANGLE_STRIP, 0, le / 3),
                    this.restore()),
                (b.u_color = this._strokecolor),
                I.uniforms(b).drawRange(ie, r.TRIANGLE_STRIP, 0, le / 3),
                (E[14] -= 1e-3);
        }
    }),
        (c.rect = function (S, D, V, $) {
            (h[u] = S),
                (h[u + 1] = D),
                (h[u + 2] = 1),
                (h[u + 3] = S + V),
                (h[u + 4] = D),
                (h[u + 5] = 1),
                (h[u + 6] = S + V),
                (h[u + 7] = D + $),
                (h[u + 8] = 1),
                (h[u + 9] = S),
                (h[u + 10] = D + $),
                (h[u + 11] = 1),
                (h[u + 12] = S),
                (h[u + 13] = D),
                (h[u + 14] = 1),
                (u += 15);
        }),
        (c.roundRect = function (S, D, V, $, W, J) {
            var K = 0,
                ne = 0,
                j = 0,
                Q = 0;
            if (W === 0) {
                this.rect(S, D, V, $);
                return;
            }
            if ((J === void 0 && (J = W), W != null && W.constructor === Array))
                if (W.length == 1) K = ne = j = Q = W[0];
                else if (W.length == 2) (K = Q = W[0]), (ne = j = W[1]);
                else if (W.length == 4)
                    (K = W[0]), (ne = W[1]), (j = W[2]), (Q = W[3]);
                else return;
            else (K = W || 0), (ne = W || 0), (j = J || 0), (Q = J || 0);
            var te = h,
                ee = u;
            if (K > 0)
                for (var se = 0; se < 10; ++se) {
                    var ae = (se / 10) * Math.PI * 0.5;
                    (te[ee] = S + K * (1 - Math.cos(ae))),
                        (te[ee + 1] = D + K * (1 - Math.sin(ae))),
                        (te[ee + 2] = 1),
                        (ee += 3);
                }
            if (
                ((te[ee + 0] = S + K),
                (te[ee + 1] = D),
                (te[ee + 2] = 1),
                (te[ee + 3] = S + V - ne),
                (te[ee + 4] = D),
                (te[ee + 5] = 1),
                (ee += 6),
                ne > 0)
            )
                for (var se = 0; se < 10; ++se) {
                    var ae = (se / 10) * Math.PI * 0.5;
                    (te[ee + 0] = S + V - ne * (1 - Math.sin(ae))),
                        (te[ee + 1] = D + ne * (1 - Math.cos(ae))),
                        (te[ee + 2] = 1),
                        (ee += 3);
                }
            if (
                ((te[ee + 0] = S + V),
                (te[ee + 1] = D + ne),
                (te[ee + 2] = 1),
                (te[ee + 3] = S + V),
                (te[ee + 4] = D + $ - Q),
                (te[ee + 5] = 1),
                (ee += 6),
                Q > 0)
            )
                for (var se = 0; se < 10; ++se) {
                    var ae = (se / 10) * Math.PI * 0.5;
                    (te[ee + 0] = S + V - Q * (1 - Math.cos(ae))),
                        (te[ee + 1] = D + $ - Q * (1 - Math.sin(ae))),
                        (te[ee + 2] = 1),
                        (ee += 3);
                }
            if (
                ((te[ee + 0] = S + V - Q),
                (te[ee + 1] = D + $),
                (te[ee + 2] = 1),
                (te[ee + 3] = S + j),
                (te[ee + 4] = D + $),
                (te[ee + 5] = 1),
                (ee += 6),
                j > 0)
            )
                for (var se = 0; se < 10; ++se) {
                    var ae = (se / 10) * Math.PI * 0.5;
                    (te[ee + 0] = S + j * (1 - Math.sin(ae))),
                        (te[ee + 1] = D + $ - j * (1 - Math.cos(ae))),
                        (te[ee + 2] = 1),
                        (ee += 3);
                }
            (te[ee + 0] = S),
                (te[ee + 1] = D + K),
                (te[ee + 2] = 1),
                (u = ee + 3);
        }),
        (c.arc = function (S, D, V, $, W) {
            var J = Math.max(
                    Math.abs(this._matrix[0]),
                    Math.abs(this._matrix[1]),
                    Math.abs(this._matrix[3]),
                    Math.abs(this._matrix[4])
                ),
                K = Math.ceil(V * 2 * J + 1);
            if (!(K < 1)) {
                (K = Math.min(K, 1024)),
                    ($ = $ === void 0 ? 0 : $),
                    (W = W === void 0 ? Math.PI * 2 : W);
                for (var ne = (W - $) / K, j = 0; j <= K; j++) {
                    var Q = $ + j * ne;
                    this.lineTo(S + Math.cos(Q) * V, D + Math.sin(Q) * V);
                }
            }
        }),
        (c.strokeRect = function (S, D, V, $) {
            this.beginPath(), this.rect(S, D, V, $), this.stroke();
        }),
        (c.fillRect = function (S, D, V, $) {
            if (
                ((u = 0),
                this._fillStyle.constructor == GL$1.Texture ||
                    this._fillStyle.constructor === he)
            ) {
                this.beginPath(), this.rect(S, D, V, $), this.fill();
                return;
            }
            (b.u_color = this._fillcolor),
                (X[0] = S),
                (X[1] = D),
                (Y[0] = V),
                (Y[1] = $),
                (b.u_position = X),
                (b.u_size = Y),
                (b.u_transform = this._matrix),
                (b.u_viewport = Z),
                G.uniforms(b).draw(p),
                (E[14] -= 1e-3);
        }),
        (c.clearRect = function (S, D, V, $) {
            (S != 0 || D != 0 || V != e.width || $ != e.height) &&
                (r.enable(r.SCISSOR_TEST), r.scissor(S, D, V, $)),
                r.clear(r.COLOR_BUFFER_BIT);
            var W = r.viewport_data;
            r.scissor(W[0], W[1], W[2], W[3]), r.disable(r.SCISSOR_TEST);
        }),
        (c.fillCircle = function (S, D, V) {
            if (
                ((u = 0),
                this._fillStyle.constructor == GL$1.Texture ||
                    this._fillStyle.constructor === he)
            ) {
                this.beginPath(),
                    this.arc(S, D, V, 0, Math.PI * 2),
                    this.fill();
                return;
            }
            (b.u_color = this._fillcolor),
                (X[0] = S),
                (X[1] = D),
                (Y[0] = V),
                (Y[1] = V),
                (b.u_position = X),
                (b.u_size = Y),
                (b.u_transform = this._matrix),
                (b.u_viewport = Z),
                G.uniforms(b).draw(_),
                (E[14] -= 1e-3);
        }),
        (c.start2D = function () {
            (l = window.gl), (window.gl = this);
            var S = this;
            S.disable(S.CULL_FACE),
                S.disable(S.DEPTH_TEST),
                S.disable(S.STENCIL_TEST),
                S.enable(S.BLEND),
                S.blendFunc(S.SRC_ALPHA, S.ONE_MINUS_SRC_ALPHA),
                S.blendEquation(S.FUNC_ADD),
                (S.lineWidth = 1),
                (u = 0),
                identity$1(E),
                (this.clip_level = 0);
        }),
        (c.finish2D = function () {
            (u = 0),
                (r.lineWidth = 1),
                (window.gl = l),
                r.disable(r.STENCIL_TEST);
        });
    var fe = new Float32Array(o * 3),
        _e = new Float32Array(o * 2),
        Te = new GL$1.Mesh(),
        De = Te.createVertexBuffer("vertices", null, null, fe, r.STREAM_DRAW),
        pe = Te.createVertexBuffer("coords", null, null, _e, r.STREAM_DRAW);
    (c.fillText = c.strokeText =
        function (S, D, V) {
            if (S == null) return;
            S.constructor !== String && (S = String(S));
            let $ = 0;
            const { textures: W, info: J } = ue.call(
                    this,
                    this._font_family,
                    this._font_mode
                ),
                K = fe,
                ne = _e;
            let j = this._font_size * 1.1;
            j < 1 && (j = 1);
            let Q = 0,
                te = 0;
            const ee = S.length,
                se = J.spacing,
                ae = J.kernings;
            let le = !0,
                ve = 0,
                be = 0,
                Le = -1;
            function Me() {
                if (ve === 0 || be === 0 || Le === -1) return;
                De.uploadRange(0, ve * 4),
                    pe.uploadRange(0, be * 4),
                    (b.u_color = this._fillcolor),
                    (b.u_pointSize = j * length(this._matrix)),
                    (b.u_iCharSize = J.char_size / $),
                    (b.u_transform = this._matrix),
                    (b.u_viewport = Z),
                    b.u_angle_sincos || (b.u_angle_sincos = create());
                const re = H;
                (H = 0),
                    (b.u_angle_sincos[1] = Math.sin(-H)),
                    (b.u_angle_sincos[0] = -Math.cos(-H)),
                    (H = re),
                    P.uniforms(b).drawRange(Te, r.POINTS, 0, ve / 3),
                    (ve = 0),
                    (be = 0);
            }
            for (let re = 0; re < ee; re++) {
                const we = S.charCodeAt(re),
                    ge = J.pages[we];
                if (!ge) {
                    we === 10
                        ? ((Q = 0), (te += j), (le = !0))
                        : (Q += j * 0.5);
                    continue;
                }
                const [Se, Ne, Ge, Pe] = ge;
                if (Ge !== Le)
                    if ((Me.call(this), (Le = Ge), W[Ge]))
                        W[Ge].bind(0), ($ = W[Ge].width);
                    else {
                        console.error(`Page ${Ge} not found in textures.`);
                        continue;
                    }
                const Oe = ae[S[re]];
                le &&
                    ((Q -= j * ((Oe == null ? void 0 : Oe.nwidth) || 0) * 0.25),
                    (le = !1)),
                    (K[ve + 0] = D + Q + j * 0.5),
                    (K[ve + 1] = V + te - j * 0.25),
                    (K[ve + 2] = 1),
                    (ve += 3),
                    (ne[be + 0] = Se),
                    (ne[be + 1] = Ne),
                    (be += 2);
                const Ce = ae[S[re + 1]]
                    ? ae[S[re + 1]].nwidth
                    : se / J.char_size;
                Q += j * Ce;
            }
            Me.call(this);
            let xe = 0;
            if (
                (this.textAlign === "right"
                    ? (xe = Q + j * 0.5)
                    : this.textAlign === "center" && (xe = (Q + j * 0.5) * 0.5),
                xe)
            )
                for (let re = 0; re < ve; re += 3) K[re] -= xe;
            return { x: Q, y: te };
        }),
        (c.measureText = function (S) {
            const { info: D } = ue.call(
                    this,
                    this._font_family,
                    this._font_mode
                ),
                V = Math.ceil(this._font_size * (D.line_height || 1));
            let $ = 0;
            const W = V * (D.spacing / D.char_size);
            for (let J = 0; J < S.length; ++J) {
                const K = D.kernings[S[J]];
                K ? ($ += K.nwidth) : ($ += W);
            }
            return ($ *= V), { width: $, height: V };
        }),
        (c.cacheFontAtlas = function (S = "monospace", D = "normal", V = !1) {
            const $ = `:font_${S}:${D}:${enableWebGLCanvas.useInternationalFont}`;
            if (!V && T[$]) return T[$];
            const W = ue.call(this, S, D, V);
            return (T[$] = W), W;
        }),
        (c.loadCachedTextures = async function () {
            const S = await getAllData();
            if (S && (S == null ? void 0 : S.length) > 0)
                for (let D in S) {
                    const V = S[D];
                    T[V.name] = V;
                }
        });
    function ue(S = "monospace", D = "normal", V = !1) {
        const $ = `:font_${S}:${D}:${enableWebGLCanvas.useInternationalFont}`;
        if (!V && T[$]) return T[$];
        const W = enableWebGLCanvas.useInternationalFont;
        let J = 1024,
            K = 10,
            ne = 200;
        W && ((ne = 55203), (K = 20), (J = 2048));
        const j = this.imageSmoothingEnabled,
            Q = Math.floor(J / K),
            te = Math.floor(Q * 0.95);
        let ee = 0.5,
            se = te * -0.15;
        const ae = [],
            le = {
                font_size: te,
                char_size: Q,
                spacing: Q * 0.6,
                space: null,
                kernings: {},
                pages: [],
            },
            ve = (re) =>
                (re >= 32 && re <= 47) || // !"#$%&'()*+,-./
                (re >= 58 && re <= 64) || // :;<=>?@
                (re >= 91 && re <= 96) || // [\]^_`
                (re >= 123 && re <= 126),
            be = (re) =>
                // 영어 대소문자
                (re >= 65 && re <= 90) || // A-Z
                (re >= 97 && re <= 122) || // a-z
                // 숫자
                (re >= 48 && re <= 57) || // 0-9
                // 특수기호
                (re >= 32 && re <= 47) || // !"#$%&'()*+,-./
                (re >= 58 && re <= 64) || // :;<=>?@
                (re >= 91 && re <= 96) || // [\]^_`
                (re >= 123 && re <= 126) || // {|}~
                // 한글
                (re >= 44032 && re <= 55203) || // 한글 음절
                // 이모지
                (re >= 127744 && re <= 128767),
            Le = [];
        for (let re = 32; re <= ne; re++) be(re) && Le.push(re);
        const Me = Math.ceil(Le.length / (K * K));
        for (let re = 0; re < Me; re++) {
            const we = createCanvas(J, J),
                ge = we.getContext("2d");
            (ge.fillStyle = "white"),
                (ge.imageSmoothingEnabled = j),
                ge.clearRect(0, 0, we.width, we.height),
                (ge.font = `${D} ${te}px ${S}`),
                (ge.textAlign = "center");
            let Se = 0,
                Ne = 0;
            const Ge = re * K * K,
                Pe = Math.min(Le.length, Ge + K * K);
            for (let Ce = Ge; Ce < Pe; Ce++) {
                const Fe = Le[Ce],
                    Re = String.fromCharCode(Fe);
                let Ie = ge.measureText(Re).width;
                ve(Fe) && Ie < 50 && (Ie *= 1.8),
                    (le.kernings[Re] = {
                        width: Ie,
                        nwidth: Ie / te,
                    }),
                    (le.pages[Fe] = [
                        (Se + Q * 0.5) / we.width,
                        (Ne + Q * 0.5) / we.height,
                        re,
                        Re,
                    ]),
                    ge.save(),
                    ge.beginPath(),
                    ge.rect(
                        Math.floor(Se) + 0.5,
                        Math.floor(Ne) + 0.5,
                        Q - 2,
                        Q - 2
                    ),
                    ge.clip(),
                    ge.fillText(
                        Re,
                        Math.floor(Se + Q * ee),
                        Math.floor(Ne + Q + se),
                        Q
                    ),
                    ge.restore(),
                    (Se += Q),
                    Se + Q > we.width && ((Se = 0), (Ne += Q));
            }
            const Oe = GL$1.Texture.fromImage(we, {
                format: r.RGBA,
                magFilter: r.LINEAR,
                minFilter: r.LINEAR_MIPMAP_LINEAR,
                premultiply_alpha: !1,
                anisotropic: 1,
            });
            ae.push(Oe);
        }
        le.space = le.kernings[" "] ? le.kernings[" "].width / te : 0;
        const xe = {
            textures: ae,
            info: le,
            name: $,
        };
        return (T[$] = xe), saveComplexData(xe, 1), T[$];
    }
    (c.getImageData = function (S, D, V, $) {
        var W = new Uint8Array(V * $ * 4);
        return (
            r.readPixels(S, D, V, $, r.RGBA, r.UNSIGNED_BYTE, W),
            { data: W, width: V, height: $, resolution: 1 }
        );
    }),
        (c.putImageData = function (S, D, V) {
            var $ = new GL$1.Texture(S.width, S.height, {
                filter: r.NEAREST,
                pixel_data: S.data,
            });
            $.renderQuad(D, V, $.width, $.height);
        }),
        Object.defineProperty(r, "fillStyle", {
            get: function () {
                return this._fillStyle;
            },
            set: function (S) {
                S &&
                    ((this._fillStyle = S),
                    hexColorToRGBA(S, this._fillcolor, this._globalAlpha));
            },
        }),
        Object.defineProperty(r, "strokeStyle", {
            get: function () {
                return this._strokeStyle;
            },
            set: function (S) {
                S &&
                    ((this._strokeStyle = S),
                    hexColorToRGBA(S, this._strokecolor, this._globalAlpha));
            },
        }),
        Object.defineProperty(r, "fillColor", {
            get: function () {
                return this._fillcolor;
            },
            set: function (S) {
                S &&
                    (S.length < 5
                        ? this._fillcolor.set(S)
                        : console.error(
                              "fillColor value has more than 4 components"
                          ));
            },
        }),
        Object.defineProperty(r, "strokeColor", {
            get: function () {
                return this._strokecolor;
            },
            set: function (S) {
                S &&
                    (S.length < 5
                        ? this._strokecolor.set(S)
                        : console.error(
                              "strokeColor value has more than 4 components"
                          ));
            },
        }),
        Object.defineProperty(r, "shadowColor", {
            get: function () {
                return this._shadowcolor;
            },
            set: function (S) {
                S && hexColorToRGBA(S, this._shadowcolor, this._globalAlpha);
            },
        }),
        Object.defineProperty(r, "globalAlpha", {
            get: function () {
                return this._globalAlpha;
            },
            set: function (S) {
                (this._globalAlpha = S),
                    (this._strokecolor[3] = this._fillcolor[3] = S);
            },
        }),
        Object.defineProperty(r, "globalCompositeOperation", {
            get: function () {
                return this._globalCompositeOperation;
            },
            set: function (S) {
                switch (
                    ((this._globalCompositeOperation = S),
                    r.blendEquation(r.FUNC_ADD),
                    S)
                ) {
                    case "source-over":
                        r.blendFunc(r.SRC_ALPHA, r.ONE_MINUS_SRC_ALPHA);
                        break;
                    case "difference":
                        r.blendFunc(r.SRC_ALPHA, r.ONE_MINUS_SRC_ALPHA),
                            r.blendEquation(r.FUNC_REVERSE_SUBTRACT);
                        break;
                }
            },
        }),
        Object.defineProperty(r, "font", {
            get: function () {
                return this._font;
            },
            set: function (S) {
                this._font = S;
                var D = S.split(" ");
                D.length >= 3
                    ? ((this._font_mode = D[0]),
                      (this._font_size = parseFloat(D[1])),
                      Number.isNaN(this._font_size) && (this._font_size = 14),
                      this._font_size < 5 && (this._font_size = 5),
                      (this._font_family = D[2]))
                    : D.length == 2
                    ? ((this._font_mode = "normal"),
                      (this._font_size = parseFloat(D[0])),
                      Number.isNaN(this._font_size) && (this._font_size = 14),
                      this._font_size < 5 && (this._font_size = 5),
                      (this._font_family = D[1]))
                    : ((this._font_mode = "normal"),
                      (this._font_family = D[0]));
            },
        }),
        (c._fillcolor = fromValues$2(0, 0, 0, 1)),
        (c._strokecolor = fromValues$2(0, 0, 0, 1)),
        (c._shadowcolor = fromValues$2(0, 0, 0, 0)),
        (c._globalAlpha = 1),
        (c._font = "14px monospace"),
        (c._font_family = "monospace"),
        (c._font_size = "14px"),
        (c._font_mode = "normal"),
        (c.clip_level = 0),
        (c.strokeStyle = "rgba(0,0,0,1)"),
        (c.fillStyle = "rgba(0,0,0,1)"),
        (c.shadowColor = "transparent"),
        (c.shadowOffsetX = c.shadowOffsetY = 0),
        (c.globalAlpha = 1),
        (c.globalCompositeOperation = "source-over"),
        (c.setLineWidth = c.lineWidth),
        (c.lineWidth = 4),
        (c.imageSmoothingEnabled = !0),
        (c.tintImages = !1);
    var me = ["arcTo", "isPointInPath", "createImageData"],
        ye = function () {};
    for (var Ee in me) c[me[Ee]] = ye;
    return c;
}
function openDatabase() {
    return new Promise((e, t) => {
        const r = indexedDB.open("WebglContextDB", 2);
        (r.onupgradeneeded = function (n) {
            var a;
            const s = n.target.result;
            ((a = s.objectStoreNames) != null && a.contains("fontTexture")) ||
                s.createObjectStore("fontTexture", { keyPath: "name" });
        }),
            (r.onsuccess = function (n) {
                e(n.target.result);
            }),
            (r.onerror = function (n) {
                t(n.target.error);
            });
    });
}
async function makeTexture(e) {
    const t = base64ToBlob(e.data),
        r = await blobToImage(t),
        n = GL$1.Texture.fromImage(r);
    return (
        (n.wrapS = e.wrapS || n.gl.CLAMP_TO_EDGE),
        (n.wrapT = e.wrapT || n.gl.CLAMP_TO_EDGE),
        (n.minFilter = e.minFilter || n.gl.LINEAR),
        (n.magFilter = e.magFilter || n.gl.LINEAR),
        (n.format = e.format || n.format),
        (n.internalFormat = e.internalFormat || n.internalFormat),
        (n.type = e.type || n.type),
        (n.texture_type = e.texture_type || n.texture_type),
        (n.width = e.width || n.width),
        (n.height = e.height || n.height),
        (e = n),
        e
    );
}
function base64ToBlob(e) {
    const t = atob(e.split(",")[1]),
        r = e.split(",")[0].split(":")[1].split(";")[0],
        n = new Array(t.length);
    for (let a = 0; a < t.length; a++) n[a] = t.charCodeAt(a);
    const s = new Uint8Array(n);
    return new Blob([s], { type: r });
}
function blobToImage(e) {
    return new Promise((t, r) => {
        const n = new Image();
        (n.onload = () => t(n)),
            (n.onerror = r),
            (n.src = URL.createObjectURL(e));
    });
}
function textureToBase64(e) {
    const t = e.gl,
        r = e.handler,
        n = e.width,
        s = e.height,
        a = t.createFramebuffer();
    if (
        (t.bindFramebuffer(t.FRAMEBUFFER, a),
        t.framebufferTexture2D(
            t.FRAMEBUFFER,
            t.COLOR_ATTACHMENT0,
            t.TEXTURE_2D,
            r,
            // WebGL 텍스처 바인딩
            0
        ),
        t.checkFramebufferStatus(t.FRAMEBUFFER) !== t.FRAMEBUFFER_COMPLETE)
    )
        return (
            console.error("Framebuffer is not complete."),
            t.bindFramebuffer(t.FRAMEBUFFER, null),
            t.deleteFramebuffer(a),
            null
        );
    const o = new Uint8Array(n * s * 4),
        l = e.format || t.RGBA,
        c = e.type || t.UNSIGNED_BYTE;
    try {
        t.readPixels(0, 0, n, s, l, c, o);
    } catch (p) {
        return console.error("Error reading pixels from framebuffer:", p), null;
    }
    const u = document.createElement("canvas");
    (u.width = n), (u.height = s);
    const h = u.getContext("2d"),
        f = h.createImageData(n, s);
    for (let p = 0; p < s; p++) {
        const _ = p * n * 4,
            E = (s - p - 1) * n * 4;
        f.data.set(o.subarray(_, _ + n * 4), E);
    }
    h.putImageData(f, 0, 0);
    const d = u.toDataURL("image/png");
    return t.bindFramebuffer(t.FRAMEBUFFER, null), t.deleteFramebuffer(a), d;
}
async function saveComplexData(e, t = 1) {
    var r;
    try {
        const a = (await openDatabase())
                .transaction("fontTexture", "readwrite")
                .objectStore("fontTexture"),
            l =
                (r = e.textures) == null
                    ? void 0
                    : r.map((f) => {
                          const {
                                  width: d,
                                  height: p,
                                  format: _,
                                  internalFormat: E,
                                  type: m,
                                  wrapS: b,
                                  wrapT: L,
                                  minFilter: T,
                                  magFilter: g,
                                  has_mipmaps: A,
                                  texture_type: G,
                              } = f,
                              M = textureToBase64(f);
                          return {
                              width: d,
                              height: p,
                              format: _,
                              internalFormat: E,
                              type: m,
                              wrapS: b,
                              wrapT: L,
                              minFilter: T,
                              magFilter: g,
                              has_mipmaps: A,
                              texture_type: G,
                              data: M,
                              // 텍스처 데이터
                          };
                      }),
            c = /* @__PURE__ */ new Date();
        c.setDate(c.getDate() + t);
        const u = {
                info: e.info,
                textures: l,
                // Null 값 제거
                name: e.name,
                expiresAt: c.toISOString(),
            },
            h = a.put(u);
        (h.onsuccess = function () {}),
            (h.onerror = function (f) {
                console.error("Error saving data:", f);
            });
    } catch (n) {
        console.error("Error in saveComplexData:", n);
    }
}
async function getAllData() {
    const e = await openDatabase();
    return new Promise((t, r) => {
        const s = e
                .transaction("fontTexture", "readwrite")
                .objectStore("fontTexture"),
            a = s.getAll();
        (a.onsuccess = async function (o) {
            const c = o.target.result.filter((u) => {
                const h = /* @__PURE__ */ new Date(),
                    f = new Date(u.expiresAt);
                return h < f ? !0 : (s.delete(u.name), !1);
            });
            if ((c == null ? void 0 : c.length) === 0) {
                t([]);
                return;
            }
            for (const u of c)
                u.textures = await Promise.all(
                    u.textures.map(async (h) => makeTexture(h))
                );
            t(c);
        }),
            (a.onerror = function (o) {
                console.error("Error retrieving data:", o.target.error),
                    r(o.target.error);
            });
    });
}
enableWebGLCanvas.useInternationalFont = !0;
enableWebGLCanvas.fontOffsetY = 0;
const R = class R {
    constructor() {}
    static distance(t, r) {
        return Math.sqrt(
            (r[0] - t[0]) * (r[0] - t[0]) + (r[1] - t[1]) * (r[1] - t[1])
        );
    }
    static isInsideRectangle(t, r, n, s, a, o) {
        return n < t && n + a > t && s < r && s + o > r;
    }
    static closeAllContextMenus(t) {
        t = t || window;
        let r = t.document.querySelectorAll(".litecontextmenu");
        if (!r.length) return;
        let n = [];
        for (let s = 0; s < r.length; s++) n.push(r[s]);
        for (let s = 0; s < n.length; s++)
            n[s].close
                ? n[s].close()
                : n[s].parentNode && n[s].parentNode.removeChild(n[s]);
    }
    static extendClass(t, r) {
        var n, s, a, o;
        for (const l in r)
            Object.prototype.hasOwnProperty.call(t, l) || (t[l] = r[l]);
        if (r.prototype)
            for (const l in r.prototype) {
                if (
                    !Object.prototype.hasOwnProperty.call(r.prototype, l) ||
                    Object.prototype.hasOwnProperty.call(t.prototype, l)
                )
                    continue;
                const c =
                        (s = (n = r.prototype).__lookupGetter__) == null
                            ? void 0
                            : s.call(n, l),
                    u =
                        (o = (a = r.prototype).__lookupSetter__) == null
                            ? void 0
                            : o.call(a, l);
                c
                    ? t.prototype.__defineGetter__(l, c)
                    : (t.prototype[l] = r.prototype[l]),
                    u && t.prototype.__defineSetter__(l, u);
            }
    }
    //used to create nodes from wrapping functions
    static getParameterNames(t) {
        return (t + "")
            .replace(/[/][/].*$/gm, "")
            .replace(/\s+/g, "")
            .replace(/[/][*][^/*]*[*][/]/g, "")
            .split("){", 1)[0]
            .replace(/^[^(]*[(]/, "")
            .replace(/=[^,]+/g, "")
            .split(",")
            .filter(Boolean);
    }
    /* helper for interaction: pointer, touch, mouse Listeners
          used by LGraphCanvas DragAndScale ContextMenu*/
    static pointerListenerAdd(t, r, n, s = !1) {
        if (!t || !t.addEventListener || !r || typeof n != "function") return;
        let a = R.pointerevents_method,
            o = r;
        if (a === "pointer" && !window.PointerEvent) {
            console.warn(
                "PointerEvent not supported. Converting to touch event."
            );
            const c = {
                down: "start",
                move: "move",
                up: "end",
                cancel: "cancel",
            };
            c[o]
                ? ((a = "touch"), (o = c[o]))
                : o === "enter"
                ? console.log("debug: Should I send a move event?")
                : console.warn(`Event ${o} will not be called`);
        }
        if (
            [
                "down",
                "up",
                "move",
                "over",
                "out",
                "enter",
                "leave",
                "cancel",
                "gotpointercapture",
                "lostpointercapture",
            ].includes(o) &&
            (a !== "mouse" ||
                ["down", "up", "move", "over", "out", "enter"].includes(o))
        ) {
            t.addEventListener(a + o, n, s);
            return;
        }
        t.addEventListener(o, n, s);
    }
    static pointerListenerRemove(t, r, n, s = !1) {
        if (!t || !t.removeEventListener || !r || typeof n != "function")
            return;
        const a = R.pointerevents_method,
            o = ["down", "up", "move", "over", "out", "enter"],
            l = ["leave", "cancel", "gotpointercapture", "lostpointercapture"];
        if (o.includes(r) && (a === "pointer" || a === "mouse")) {
            t.removeEventListener(a + r, n, s);
            return;
        }
        if (l.includes(r) && a === "pointer") {
            t.removeEventListener(a + r, n, s);
            return;
        }
        t.removeEventListener(r, n, s);
    }
    //bounding overlap, format: [ startx, starty, width, height ]
    static overlapBounding(t, r) {
        let n = t[0] + t[2],
            s = t[1] + t[3],
            a = r[0] + r[2],
            o = r[1] + r[3];
        return !(t[0] > a || t[1] > o || n < r[0] || s < r[1]);
    }
    /**
     * Register a node class so it can be listed when the user wants to create a new one
     * @method registerNodeType
     * @param {String} type name of the node and path
     * @param {Class} base_class class containing the structure of a node
     */
    static registerNodeType(t, r) {
        if (!r.prototype)
            throw "Cannot register a simple object, it must be a class with a prototype";
        (r.type = t), R.debug && console.log("Node registered: " + t);
        const n = r.name,
            s = t.lastIndexOf("/");
        (r.category = t.substring(0, s)), r.title || (r.title = n);
        for (let o in LGraphNode.prototype)
            r.prototype[o] || (r.prototype[o] = LGraphNode.prototype[o]);
        const a = R.registered_node_types[t];
        if (
            (a && console.log("replacing node type: " + t),
            !Object.prototype.hasOwnProperty.call(r.prototype, "shape") &&
                (Object.defineProperty(r.prototype, "shape", {
                    set: function (o) {
                        switch (o) {
                            case "default":
                                delete this._shape;
                                break;
                            case "box":
                                this._shape = R.BOX_SHAPE;
                                break;
                            case "round":
                                this._shape = R.ROUND_SHAPE;
                                break;
                            case "circle":
                                this._shape = R.CIRCLE_SHAPE;
                                break;
                            case "card":
                                this._shape = R.CARD_SHAPE;
                                break;
                            default:
                                this._shape = o;
                        }
                    },
                    get: function () {
                        return this._shape;
                    },
                    enumerable: !0,
                    configurable: !0,
                }),
                r.supported_extensions))
        )
            for (let o in r.supported_extensions) {
                const l = r.supported_extensions[o];
                l &&
                    l.constructor === String &&
                    (this.node_types_by_file_extension[l.toLowerCase()] = r);
            }
        (R.registered_node_types[t] = r),
            r.constructor.name && (this.Nodes[n] = r),
            R.onNodeTypeRegistered && R.onNodeTypeRegistered(t, r),
            a && R.onNodeTypeReplaced && R.onNodeTypeReplaced(t, r, a),
            r.prototype.onPropertyChange &&
                console.warn(
                    "LiteGraph node class " +
                        t +
                        " has onPropertyChange method, it must be called onPropertyChanged with d at the end"
                ),
            this.auto_load_slot_types && new r(r.title || "tmpnode");
    }
    /**
     * removes a node type from the system
     * @method unregisterNodeType
     * @param {String|Object} type name of the node or the node constructor itself
     */
    static unregisterNodeType(t) {
        const r = t.constructor === String ? R.registered_node_types[t] : t;
        if (!r) throw "node type not found: " + t;
        delete R.registered_node_types[r.type],
            r.constructor.name && delete this.Nodes[r.constructor.name];
    }
    /**
     * Save a slot type and his node
     * @method registerSlotType
     * @param {String|Object} type name of the node or the node constructor itself
     * @param {String} slot_type name of the slot type (letiable type), eg. string, number, array, boolean, ..
     */
    static registerNodeAndSlotType(t, r, n) {
        n = n || !1;
        const a = (
            t.constructor === String &&
            R.registered_node_types[t] !== "anonymous"
                ? R.registered_node_types[t]
                : t
        ).constructor.type;
        let o = [];
        typeof r == "string"
            ? (o = r.split(","))
            : r == this.EVENT || r == this.ACTION
            ? (o = ["_event_"])
            : (o = ["*"]);
        for (let l = 0; l < o.length; ++l) {
            let c = o[l];
            c === "" && (c = "*");
            const u = n
                ? "registered_slot_out_types"
                : "registered_slot_in_types";
            this[u][c] === void 0 && (this[u][c] = { nodes: [] }),
                this[u][c].nodes.includes(a) || this[u][c].nodes.push(a),
                n
                    ? this.slot_types_out.includes(c.toLowerCase()) ||
                      (this.slot_types_out.push(c.toLowerCase()),
                      this.slot_types_out.sort())
                    : this.slot_types_in.includes(c.toLowerCase()) ||
                      (this.slot_types_in.push(c.toLowerCase()),
                      this.slot_types_in.sort());
        }
    }
    /**
     * Create a new nodetype by passing an object with some properties
     * like onCreate, inputs:Array, outputs:Array, properties, onExecute
     * @method buildNodeClassFromObject
     * @param {String} name node name with namespace (p.e.: 'math/sum')
     * @param {Object} object methods expected onCreate, inputs, outputs, properties, onExecute
     */
    static buildNodeClassFromObject(t, r) {
        let n = "";
        if (r.inputs)
            for (let a = 0; a < r.inputs.length; ++a) {
                let o = r.inputs[a][0],
                    l = r.inputs[a][1];
                l && l.constructor === String && (l = '"' + l + '"'),
                    (n +=
                        "this.addInput('" +
                        o +
                        "'," +
                        l +
                        `);
`);
            }
        if (r.outputs)
            for (let a = 0; a < r.outputs.length; ++a) {
                let o = r.outputs[a][0],
                    l = r.outputs[a][1];
                l && l.constructor === String && (l = '"' + l + '"'),
                    (n +=
                        "this.addOutput('" +
                        o +
                        "'," +
                        l +
                        `);
`);
            }
        if (r.properties)
            for (let a in r.properties) {
                let o = r.properties[a];
                o && o.constructor === String && (o = '"' + o + '"'),
                    (n +=
                        "this.addProperty('" +
                        a +
                        "'," +
                        o +
                        `);
`);
            }
        n += "if(this.onCreate)this.onCreate()";
        let s = Function(n);
        for (let a in r)
            a != "inputs" &&
                a != "outputs" &&
                a != "properties" &&
                (s.prototype[a] = r[a]);
        return (
            (s.title = r.title || t.split("/").pop()),
            (s.desc = r.desc || "Generated from object"),
            R.registerNodeType(t, s),
            s
        );
    }
    /**
     * Create a new nodetype by passing a function, it wraps it with a proper class and generates inputs according to the parameters of the function.
     * Useful to wrap simple methods that do not require properties, and that only process some input to generate an output.
     * @method wrapFunctionAsNode
     * @param {String} name node name with namespace (p.e.: 'math/sum')
     * @param {Function} func
     * @param {Array} param_types [optional] an array containing the type of every parameter, otherwise parameters will accept any type
     * @param {String} return_type [optional] string with the return type, otherwise it will be generic
     * @param {Object} properties [optional] properties to be configurable
     */
    static wrapFunctionAsNode(t, r, n, s, a) {
        let o = Array(r.length),
            l = "";
        if (n !== null) {
            let u = R.getParameterNames(r);
            for (let h = 0; h < u.length; ++h) {
                let f = 0;
                n &&
                    (n[h] != null && n[h].constructor === String
                        ? (f = "'" + n[h] + "'")
                        : n[h] != null && (f = n[h])),
                    (l +=
                        "this.addInput('" +
                        u[h] +
                        "'," +
                        f +
                        `);
`);
            }
        }
        s !== null &&
            (l +=
                "this.addOutput('out'," +
                (s != null
                    ? s.constructor === String
                        ? "'" + s + "'"
                        : s
                    : 0) +
                `);
`),
            a &&
                (l +=
                    "this.properties = " +
                    JSON.stringify(a) +
                    `;
`);
        let c = Function(l);
        return (
            (c.title = t.split("/").pop()),
            (c.desc = "Generated from " + r.name),
            (c.prototype.onExecute = function () {
                for (let f = 0; f < o.length; ++f) o[f] = this.getInputData(f);
                let h = r.apply(this, o);
                this.setOutputData(0, h);
            }),
            this.registerNodeType(t, c),
            c
        );
    }
    /**
     * Removes all previously registered node's types
     */
    static clearRegisteredTypes() {
        (R.registered_node_types = {}),
            (this.node_types_by_file_extension = {}),
            (this.Nodes = {}),
            (this.searchbox_extras = {});
    }
    /**
     * Adds this method to all nodetypes, existing and to be created
     * (You can add it to LGraphNode.prototype but then existing node types wont have it)
     * @method addNodeMethod
     * @param {Function} func
     */
    static addNodeMethod(t, r) {
        LGraphNode.prototype[t] = r;
        for (let n in R.registered_node_types) {
            let s = R.registered_node_types[n];
            s.prototype[t] && (s.prototype["_" + t] = s.prototype[t]),
                (s.prototype[t] = r);
        }
    }
    /**
     * Create a node of a given type with a name. The node is not attached to any graph yet.
     * @method createNode
     * @param {String} type full name of the node class. p.e. "math/sin"
     * @param {String} name a name to distinguish from other nodes
     * @param {Object} options to set options
     */
    static createNode(t, r, n) {
        let s = R.registered_node_types[t];
        if (!s)
            return (
                R.debug &&
                    console.log('GraphNode type "' + t + '" not registered.'),
                null
            );
        s.prototype, (r = r || s.title || t);
        let a = null;
        if (R.catch_exceptions)
            try {
                a = new s(r);
            } catch (o) {
                return console.error(o), null;
            }
        else a = new s(r);
        if (
            ((a.type = t),
            !a.title && r && (a.title = r),
            a.properties || (a.properties = {}),
            a.properties_info || (a.properties_info = []),
            a.flags || (a.flags = {}),
            a.size || (a.size = a.computeSize()),
            a.pos || (a.pos = R.DEFAULT_POSITION.concat()),
            a.mode || (a.mode = R.ALWAYS),
            n)
        )
            for (let o in n) a[o] = n[o];
        return a.onNodeCreated && a.onNodeCreated(), a;
    }
    /**
     * Returns a registered node type with a given name
     * @method getNodeType
     * @param {String} type full name of the node class. p.e. "math/sin"
     * @return {Class} the node class
     */
    static getNodeType(t) {
        return R.registered_node_types[t];
    }
    /**
     * Returns a list of node types matching one category
     * @method getNodeType
     * @param {String} category category name
     * @return {Array} array with all the node classes
     */
    static getNodeTypesInCategory(t, r) {
        let n = [];
        for (let s in R.registered_node_types) {
            let a = R.registered_node_types[s];
            a.filter == r &&
                (t == ""
                    ? a.category == null && n.push(a)
                    : a.category == t && n.push(a));
        }
        return (
            this.auto_sort_node_types &&
                n.sort(function (s, a) {
                    return s.title.localeCompare(a.title);
                }),
            n
        );
    }
    /**
     * Returns a list with all the node type categories
     * @method getNodeTypesCategories
     * @param {String} filter only nodes with ctor.filter equal can be shown
     * @return {Array} array with all the names of the categories
     */
    static getNodeTypesCategories(t) {
        let r = { "": 1 };
        for (let s in R.registered_node_types) {
            let a = R.registered_node_types[s];
            if (a.category && !a.skip_list) {
                if (a.filter != t) continue;
                r[a.category] = 1;
            }
        }
        let n = [];
        for (let s in r) n.push(s);
        return this.auto_sort_node_types ? n.sort() : n;
    }
    //debug purposes: reloads all the js scripts that matches a wildcard
    static reloadNodes(t) {
        let r = document.getElementsByTagName("script"),
            n = [];
        for (let a = 0; a < r.length; a++) n.push(r[a]);
        let s = document.getElementsByTagName("head")[0];
        t = document.location.href + t;
        for (let a = 0; a < n.length; a++) {
            let o = n[a].src;
            if (!(!o || o.substr(0, t.length) != t))
                try {
                    R.debug && console.log("Reloading: " + o);
                    let l = document.createElement("script");
                    (l.type = "text/javascript"),
                        (l.src = o),
                        s.appendChild(l),
                        s.removeChild(n[a]);
                } catch (l) {
                    if (R.throw_errors) throw l;
                    R.debug && console.log("Error while reloading " + o);
                }
        }
        R.debug && console.log("Nodes reloaded");
    }
    //separated just to improve if it doesn't work
    static cloneObject(t, r) {
        if (t == null) return null;
        let n = JSON.parse(JSON.stringify(t));
        if (!r) return n;
        for (let s in n) r[s] = n[s];
        return r;
    }
    /*
     * https://gist.github.com/jed/982883?permalink_comment_id=852670#gistcomment-852670
     */
    static uuidv4() {
        return ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, (t) =>
            (t ^ ((Math.random() * 16) >> (t / 4))).toString(16)
        );
    }
    /**
     * Returns if the types of two slots are compatible (taking into account wildcards, etc)
     * @method isValidConnection
     * @param {String} type_a
     * @param {String} type_b
     * @return {Boolean} true if they can be connected
     */
    static isValidConnection(t, r) {
        if (
            ((t == "" || t === "*") && (t = 0),
            (r == "" || r === "*") && (r = 0),
            !t || //generic output
                !r || // generic input
                t == r || //same type (is valid for triggers)
                (t == R.EVENT && r == R.ACTION))
        )
            return !0;
        if (
            ((t = String(t)),
            (r = String(r)),
            (t = t.toLowerCase()),
            (r = r.toLowerCase()),
            t.indexOf(",") == -1 && r.indexOf(",") == -1)
        )
            return t == r;
        let n = t.split(","),
            s = r.split(",");
        for (let a = 0; a < n.length; ++a)
            for (let o = 0; o < s.length; ++o)
                if (this.isValidConnection(n[a], s[o])) return !0;
        return !1;
    }
    /**
     * Register a string in the search box so when the user types it it will recommend this node
     * @method registerSearchboxExtra
     * @param {String} node_type the node recommended
     * @param {String} description text to show next to it
     * @param {Object} data it could contain info of how the node should be configured
     * @return {Boolean} true if they can be connected
     */
    static registerSearchboxExtra(t, r, n) {
        this.searchbox_extras[r.toLowerCase()] = {
            type: t,
            desc: r,
            data: n,
        };
    }
    /**
     * Wrapper to load files (from url using fetch or from file using FileReader)
     * @method fetchFile
     * @param {String|File|Blob} url the url of the file (or the file itself)
     * @param {String} type an string to know how to fetch it: "text","arraybuffer","json","blob"
     * @param {Function} on_complete callback(data)
     * @param {Function} on_error in case of an error
     * @return {FileReader|Promise} returns the object used to
     */
    static fetchFile(t, r, n, s) {
        if (!t) return null;
        if (((r = r || "text"), t.constructor === String))
            return (
                t.substr(0, 4) == "http" &&
                    R.proxy &&
                    (t = R.proxy + t.substr(t.indexOf(":") + 3)),
                fetch(t)
                    .then(function (a) {
                        if (!a.ok) throw new Error("File not found");
                        if (r == "arraybuffer") return a.arrayBuffer();
                        if (r == "text" || r == "string") return a.text();
                        if (r == "json") return a.json();
                        if (r == "blob") return a.blob();
                    })
                    .then(function (a) {
                        n && n(a);
                    })
                    .catch(function (a) {
                        console.error("error fetching file:", t), s && s(a);
                    })
            );
        if (t.constructor === File || t.constructor === Blob) {
            let a = new FileReader();
            if (
                ((a.onload = function (o) {
                    let l = o.target.result;
                    r == "json" && (l = JSON.parse(l)), n && n(l);
                }),
                r == "arraybuffer")
            )
                return a.readAsArrayBuffer(t);
            if (r == "text" || r == "json") return a.readAsText(t);
            if (r == "blob") return a.readAsBinaryString(t);
        }
        return null;
    }
};
k(R, "VERSION", 0.4),
    k(R, "CANVAS_GRID_SIZE", 10),
    k(R, "NODE_TITLE_HEIGHT", 30),
    k(R, "NODE_TITLE_TEXT_Y", 20),
    k(R, "NODE_SLOT_HEIGHT", 20),
    k(R, "NODE_WIDGET_HEIGHT", 20),
    k(R, "NODE_WIDTH", 140),
    k(R, "NODE_MIN_WIDTH", 50),
    k(R, "NODE_COLLAPSED_RADIUS", 10),
    k(R, "NODE_COLLAPSED_WIDTH", 80),
    k(R, "NODE_TITLE_COLOR", "#999"),
    k(R, "NODE_SELECTED_TITLE_COLOR", "#FFF"),
    k(R, "NODE_TEXT_SIZE", 14),
    k(R, "NODE_TEXT_COLOR", "#AAA"),
    k(R, "NODE_SUBTEXT_SIZE", 12),
    k(R, "NODE_DEFAULT_COLOR", "#333"),
    k(R, "NODE_DEFAULT_BGCOLOR", "#353535"),
    k(R, "NODE_DEFAULT_BOXCOLOR", "#666"),
    k(R, "NODE_DEFAULT_SHAPE", "box"),
    k(R, "NODE_BOX_OUTLINE_COLOR", "#FFF"),
    k(R, "DEFAULT_SHADOW_COLOR", "rgba(0,0,0,0.5)"),
    k(R, "DEFAULT_GROUP_FONT", 24),
    k(R, "WIDGET_BGCOLOR", "#222"),
    k(R, "WIDGET_OUTLINE_COLOR", "#666"),
    k(R, "WIDGET_TEXT_COLOR", "#DDD"),
    k(R, "WIDGET_SECONDARY_TEXT_COLOR", "#999"),
    k(R, "LINK_COLOR", "#9A9"),
    k(R, "EVENT_LINK_COLOR", "#A86"),
    k(R, "CONNECTING_LINK_COLOR", "#AFA"),
    k(R, "MAX_NUMBER_OF_NODES", 1e3), //avoid infinite loops
    k(R, "DEFAULT_POSITION", [100, 100]), //default node position
    k(R, "VALID_SHAPES", ["default", "box", "round", "card"]), //,"circle"
    //shapes are used for nodes but also for slots
    k(R, "BOX_SHAPE", 1),
    k(R, "ROUND_SHAPE", 2),
    k(R, "CIRCLE_SHAPE", 3),
    k(R, "CARD_SHAPE", 4),
    k(R, "ARROW_SHAPE", 5),
    k(R, "GRID_SHAPE", 6), // intended for slot arrays
    //enums
    k(R, "INPUT", 1),
    k(R, "OUTPUT", 2),
    k(R, "EVENT", -1), //for outputs
    k(R, "ACTION", -1), //for inputs
    k(R, "NODE_MODES", ["Always", "On Event", "Never", "On Trigger"]), // helper, will add "On Request" and more in the future
    k(R, "NODE_MODES_COLORS", ["#666", "#422", "#333", "#224", "#626"]), // use with node_box_coloured_by_mode
    k(R, "ALWAYS", 0),
    k(R, "ON_EVENT", 1),
    k(R, "NEVER", 2),
    k(R, "ON_TRIGGER", 3),
    k(R, "UP", 1),
    k(R, "DOWN", 2),
    k(R, "LEFT", 3),
    k(R, "RIGHT", 4),
    k(R, "CENTER", 5),
    k(R, "LINK_RENDER_MODES", ["Straight", "Linear", "Spline"]), // helper
    k(R, "STRAIGHT_LINK", 0),
    k(R, "LINEAR_LINK", 1),
    k(R, "SPLINE_LINK", 2),
    k(R, "NORMAL_TITLE", 0),
    k(R, "NO_TITLE", 1),
    k(R, "TRANSPARENT_TITLE", 2),
    k(R, "AUTOHIDE_TITLE", 3),
    k(R, "VERTICAL_LAYOUT", "vertical"), // arrange nodes vertically
    k(R, "proxy", null), //used to redirect calls
    k(R, "node_images_path", ""),
    k(R, "debug", !1),
    k(R, "catch_exceptions", !0),
    k(R, "throw_errors", !0),
    k(R, "allow_scripts", !1), //if set to true some nodes like Formula would be allowed to evaluate code that comes from unsafe sources (like node configuration), which could lead to exploits
    k(R, "use_deferred_actions", !0), //executes actions during the graph execution flow
    k(R, "registered_node_types", {}), //nodetypes by string
    k(R, "node_types_by_file_extension", {}), //used for dropping files in the canvas
    k(R, "Nodes", {}), //node types by classname
    k(R, "Globals", {}), //used to store lets between graphs
    k(R, "searchbox_extras", {}), //used to add extra features to the search box
    k(R, "auto_sort_node_types", !1), // [true!] If set to true, will automatically sort node types / categories in the context menus
    k(R, "node_box_coloured_when_on", !1), // [true!] this make the nodes box (top left circle) coloured when triggered (execute/action), visual feedback
    k(R, "node_box_coloured_by_mode", !1), // [true!] nodebox based on node mode, visual feedback
    k(R, "dialog_close_on_mouse_leave", !0), // [false on mobile] better true if not touch device, TODO add an helper/listener to close if false
    k(R, "dialog_close_on_mouse_leave_delay", 500),
    k(R, "shift_click_do_break_link_from", !1), // [false!] prefer false if results too easy to break links - implement with ALT or TODO custom keys
    k(R, "click_do_break_link_to", !1), // [false!]prefer false, way too easy to break links
    k(R, "search_hide_on_mouse_leave", !0), // [false on mobile] better true if not touch device, TODO add an helper/listener to close if false
    k(R, "search_filter_enabled", !1), // [true!] enable filtering slots type in the search widget, !requires auto_load_slot_types or manual set registered_slot_[in/out]_types and slot_types_[in/out]
    k(R, "search_show_all_on_open", !0), // [true!] opens the results list when opening the search widget
    k(R, "auto_load_slot_types", !1), // [if want false, use true, run, get lets values to be statically set, than disable] nodes types and nodeclass association with node types need to be calculated, if dont want this, calculate once and set registered_slot_[in/out]_types and slot_types_[in/out]
    // set these values if not using auto_load_slot_types
    k(R, "registered_slot_in_types", {}), // slot types for nodeclass
    k(R, "registered_slot_out_types", {}), // slot types for nodeclass
    k(R, "slot_types_in", []), // slot types IN
    k(R, "slot_types_out", []), // slot types OUT
    k(R, "slot_types_default_in", []), // specify for each IN slot type a(/many) default node(s), use single string, array, or object (with node, title, parameters, ..) like for search
    k(R, "slot_types_default_out", []), // specify for each OUT slot type a(/many) default node(s), use single string, array, or object (with node, title, parameters, ..) like for search
    k(R, "alt_drag_do_clone_nodes", !1), // [true!] very handy, ALT click to clone and drag the new node
    k(R, "do_add_triggers_slots", !1), // [true!] will create and connect event slots when using action/events connections, !WILL CHANGE node mode when using onTrigger (enable mode colors), onExecuted does not need this
    k(R, "allow_multi_output_for_events", !0), // [false!] being events, it is strongly reccomended to use them sequentially, one by one
    k(R, "middle_click_slot_add_default_node", !1), //[true!] allows to create and connect a ndoe clicking with the third button (wheel)
    k(R, "release_link_on_empty_shows_menu", !1), //[true!] dragging a link to empty space will open a menu, add from list, search or defaults
    k(R, "pointerevents_method", "mouse"), // "mouse"|"pointer" use mouse for retrocompatibility issues? (none found @ now)
    // TODO implement pointercancel, gotpointercapture, lostpointercapture, (pointerover, pointerout if necessary)
    k(R, "ctrl_shift_v_paste_connect_unselected_outputs", !1), //[true!] allows ctrl + shift + v to paste nodes with the outputs of the unselected nodes connected with the inputs of the newly pasted nodes
    // if true, all newly created nodes/links will use string UUIDs for their id fields instead of integers.
    // use this if you must have node IDs that are unique across all graphs and subgraphs.
    k(R, "use_uuids", !1);
let LiteGraph = R;
typeof performance < "u"
    ? (LiteGraph.getTime = performance.now.bind(performance))
    : typeof Date < "u" && Date.now
    ? (LiteGraph.getTime = Date.now.bind(Date))
    : typeof process < "u"
    ? (LiteGraph.getTime = function () {
          let e = process.hrtime();
          return e[0] * 1e-3 + e[1] * 1e-6;
      })
    : (LiteGraph.getTime = function () {
          return /* @__PURE__ */ new Date().getTime();
      });
const Ae = class Ae {
    constructor(t) {
        LiteGraph.debug && console.log("Graph created"),
            (this.list_of_graphcanvas = null),
            this.clear(),
            t && this.configure(t);
    }
    /**
     * Removes all nodes from this graph
     * @method clear
     */
    clear() {
        if (
            (this.stop(),
            (this.status = Ae.STATUS_STOPPED),
            (this.last_node_id = 0),
            (this.last_link_id = 0),
            (this._version = -1),
            this._nodes)
        )
            for (let t = 0; t < this._nodes.length; ++t) {
                const r = this._nodes[t];
                r.onRemoved && r.onRemoved();
            }
        (this._nodes = []),
            (this._nodes_by_id = {}),
            (this._nodes_in_order = []),
            (this._nodes_executable = null),
            (this._groups = []),
            (this.links = {}),
            (this.iteration = 0),
            (this.config = {}),
            (this.consts = {}),
            (this.extra = {}),
            (this.globaltime = 0),
            (this.runningtime = 0),
            (this.fixedtime = 0),
            (this.fixedtime_lapse = 0.01),
            (this.elapsed_time = 0.01),
            (this.last_update_time = 0),
            (this.starttime = 0),
            (this.catch_errors = !0),
            (this.nodes_executing = []),
            (this.nodes_actioning = []),
            (this.nodes_executedAction = []),
            (this.inputs = {}),
            (this.outputs = {}),
            this.change(),
            this.sendActionToCanvas("clear");
    }
    /**
     * Attach Canvas to this graph
     * @method attachCanvas
     * @param {GraphCanvas} graph_canvas
     */
    attachCanvas(t) {
        if (t.constructor != LGraphCanvas)
            throw "attachCanvas expects a LGraphCanvas instance";
        t.graph && t.graph != this && t.graph.detachCanvas(t),
            (t.graph = this),
            this.list_of_graphcanvas || (this.list_of_graphcanvas = []),
            this.list_of_graphcanvas.push(t);
    }
    /**
     * Detach Canvas from this graph
     * @method detachCanvas
     * @param {GraphCanvas} graph_canvas
     */
    detachCanvas(t) {
        if (!this.list_of_graphcanvas) return;
        const r = this.list_of_graphcanvas.indexOf(t);
        r != -1 && ((t.graph = null), this.list_of_graphcanvas.splice(r, 1));
    }
    /**
     * Starts running this graph every interval milliseconds.
     * @method start
     * @param {number} interval amount of milliseconds between executions, if 0 then it renders to the monitor refresh rate
     */
    start(t) {
        if (this.status == Ae.STATUS_RUNNING) return;
        (this.status = Ae.STATUS_RUNNING),
            this.onPlayEvent && this.onPlayEvent(),
            this.sendEventToAllNodes("onStart"),
            (this.starttime = LiteGraph.getTime()),
            (this.last_update_time = this.starttime),
            (t = t || 0);
        const r = this;
        if (t == 0 && typeof window < "u" && window.requestAnimationFrame) {
            let n = function () {
                r.execution_timer_id == -1 &&
                    (window.requestAnimationFrame(n),
                    r.onBeforeStep && r.onBeforeStep(),
                    r.runStep(1, !r.catch_errors),
                    r.onAfterStep && r.onAfterStep());
            };
            (this.execution_timer_id = -1), n();
        } else
            this.execution_timer_id = setInterval(function () {
                r.onBeforeStep && r.onBeforeStep(),
                    r.runStep(1, !r.catch_errors),
                    r.onAfterStep && r.onAfterStep();
            }, t);
    }
    /**
     * Stops the execution loop of the graph
     * @method stop execution
     */
    stop() {
        this.status != Ae.STATUS_STOPPED &&
            ((this.status = Ae.STATUS_STOPPED),
            this.onStopEvent && this.onStopEvent(),
            this.execution_timer_id != null &&
                (this.execution_timer_id != -1 &&
                    clearInterval(this.execution_timer_id),
                (this.execution_timer_id = null)),
            this.sendEventToAllNodes("onStop"));
    }
    /**
     * Run N steps (cycles) of the graph
     * @method runStep
     * @param {number} num number of steps to run, default is 1
     * @param {Boolean} do_not_catch_errors [optional] if you want to try/catch errors
     * @param {number} limit max number of nodes to execute (used to execute from start to a node)
     */
    runStep(t, r, n) {
        t = t || 1;
        const s = LiteGraph.getTime();
        this.globaltime = 1e-3 * (s - this.starttime);
        const a = this._nodes_executable ? this._nodes_executable : this._nodes;
        if (!a) return;
        if (((n = n || a.length), r)) {
            for (let c = 0; c < t; c++) {
                for (let u = 0; u < n; ++u) {
                    const h = a[u];
                    LiteGraph.use_deferred_actions &&
                        h._waiting_actions &&
                        h._waiting_actions.length &&
                        h.executePendingActions(),
                        h.mode == LiteGraph.ALWAYS &&
                            h.onExecute &&
                            h.doExecute();
                }
                (this.fixedtime += this.fixedtime_lapse),
                    this.onExecuteStep && this.onExecuteStep();
            }
            this.onAfterExecute && this.onAfterExecute();
        } else
            try {
                for (let c = 0; c < t; c++) {
                    for (let u = 0; u < n; ++u) {
                        const h = a[u];
                        LiteGraph.use_deferred_actions &&
                            h._waiting_actions &&
                            h._waiting_actions.length &&
                            h.executePendingActions(),
                            h.mode == LiteGraph.ALWAYS &&
                                h.onExecute &&
                                h.onExecute();
                    }
                    (this.fixedtime += this.fixedtime_lapse),
                        this.onExecuteStep && this.onExecuteStep();
                }
                this.onAfterExecute && this.onAfterExecute(),
                    (this.errors_in_execution = !1);
            } catch (c) {
                if (((this.errors_in_execution = !0), LiteGraph.throw_errors))
                    throw c;
                LiteGraph.debug && console.log("Error during execution: " + c),
                    this.stop();
            }
        const o = LiteGraph.getTime();
        let l = o - s;
        l == 0 && (l = 1),
            (this.execution_time = 1e-3 * l),
            (this.globaltime += 1e-3 * l),
            (this.iteration += 1),
            (this.elapsed_time = (o - this.last_update_time) * 1e-3),
            (this.last_update_time = o),
            (this.nodes_executing = []),
            (this.nodes_actioning = []),
            (this.nodes_executedAction = []);
    }
    /**
     * Updates the graph execution order according to relevance of the nodes (nodes with only outputs have more relevance than
     * nodes with only inputs.
     * @method updateExecutionOrder
     */
    updateExecutionOrder() {
        (this._nodes_in_order = this.computeExecutionOrder(!1)),
            (this._nodes_executable = []);
        for (let t = 0; t < this._nodes_in_order.length; ++t)
            this._nodes_in_order[t].onExecute &&
                this._nodes_executable.push(this._nodes_in_order[t]);
    }
    //This is more internal, it computes the executable nodes in order and returns it
    computeExecutionOrder(t, r) {
        let n = [],
            s = [],
            a = {};
        const o = {},
            l = {};
        for (let u = 0, h = this._nodes.length; u < h; ++u) {
            const f = this._nodes[u];
            if (t && !f.onExecute) continue;
            a[f.id] = f;
            let d = 0;
            if (f.inputs)
                for (let p = 0, _ = f.inputs.length; p < _; p++)
                    f.inputs[p] && f.inputs[p].link != null && (d += 1);
            d == 0
                ? (s.push(f), r && (f._level = 1))
                : (r && (f._level = 0), (l[f.id] = d));
        }
        for (; s.length != 0; ) {
            const u = s.shift();
            if ((n.push(u), delete a[u.id], !!u.outputs))
                for (let h = 0; h < u.outputs.length; h++) {
                    const f = u.outputs[h];
                    if (!(f == null || f.links == null || f.links.length == 0))
                        for (let d = 0; d < f.links.length; d++) {
                            const p = f.links[d],
                                _ = this.links[p];
                            if (!_ || o[_.id]) continue;
                            const E = this.getNodeById(_.target_id);
                            if (E == null) {
                                o[_.id] = !0;
                                continue;
                            }
                            r &&
                                (!E._level || E._level <= u._level) &&
                                (E._level = u._level + 1),
                                (o[_.id] = !0),
                                (l[E.id] -= 1),
                                l[E.id] == 0 && s.push(E);
                        }
                }
        }
        for (const u in a) n.push(a[u]);
        n.length != this._nodes.length &&
            LiteGraph.debug &&
            console.warn("something went wrong, nodes missing");
        const c = n.length;
        for (let u = 0; u < c; ++u) n[u].order = u;
        n = n.sort(function (u, h) {
            const f = u.constructor.priority || u.priority || 0,
                d = h.constructor.priority || h.priority || 0;
            return f == d ? u.order - h.order : f - d;
        });
        for (let u = 0; u < c; ++u) n[u].order = u;
        return n;
    }
    /**
     * Returns all the nodes that could affect this one (ancestors) by crawling all the inputs recursively.
     * It doesn't include the node itself
     * @method getAncestors
     * @return {Array} an array with all the LGraphNodes that affect this node, in order of execution
     */
    getAncestors(t) {
        const r = [],
            n = [t],
            s = {};
        for (; n.length; ) {
            const a = n.shift();
            if (a.inputs) {
                !s[a.id] && a != t && ((s[a.id] = !0), r.push(a));
                for (let o = 0; o < a.inputs.length; ++o) {
                    const l = a.getInputNode(o);
                    l && r.indexOf(l) == -1 && n.push(l);
                }
            }
        }
        return (
            r.sort(function (a, o) {
                return a.order - o.order;
            }),
            r
        );
    }
    /**
     * Positions every node in a more readable manner
     * @method arrange
     */
    arrange(t, r) {
        t = t || 100;
        const n = this.computeExecutionOrder(!1, !0),
            s = [];
        for (let o = 0; o < n.length; ++o) {
            const l = n[o],
                c = l._level || 1;
            s[c] || (s[c] = []), s[c].push(l);
        }
        let a = t;
        for (let o = 0; o < s.length; ++o) {
            const l = s[o];
            if (!l) continue;
            let c = 100,
                u = t + LiteGraph.NODE_TITLE_HEIGHT;
            for (let h = 0; h < l.length; ++h) {
                const f = l[h];
                (f.pos[0] = r == LiteGraph.VERTICAL_LAYOUT ? u : a),
                    (f.pos[1] = r == LiteGraph.VERTICAL_LAYOUT ? a : u);
                const d = r == LiteGraph.VERTICAL_LAYOUT ? 1 : 0;
                f.size[d] > c && (c = f.size[d]);
                const p = r == LiteGraph.VERTICAL_LAYOUT ? 0 : 1;
                u += f.size[p] + t + LiteGraph.NODE_TITLE_HEIGHT;
            }
            a += c + t;
        }
        this.setDirtyCanvas(!0, !0);
    }
    /**
     * Returns the amount of time the graph has been running in milliseconds
     * @method getTime
     * @return {number} number of milliseconds the graph has been running
     */
    getTime() {
        return this.globaltime;
    }
    /**
     * Returns the amount of time accumulated using the fixedtime_lapse const. This is used in context where the time increments should be constant
     * @method getFixedTime
     * @return {number} number of milliseconds the graph has been running
     */
    getFixedTime() {
        return this.fixedtime;
    }
    /**
     * Returns the amount of time it took to compute the latest iteration. Take into account that this number could be not correct
     * if the nodes are using graphical actions
     * @method getElapsedTime
     * @return {number} number of milliseconds it took the last cycle
     */
    getElapsedTime() {
        return this.elapsed_time;
    }
    /**
     * Sends an event to all the nodes, useful to trigger stuff
     * @method sendEventToAllNodes
     * @param {String} eventname the name of the event (function to be called)
     * @param {Array} params parameters in array format
     */
    sendEventToAllNodes(t, r, n) {
        n = n || LiteGraph.ALWAYS;
        const s = this._nodes_in_order ? this._nodes_in_order : this._nodes;
        if (s)
            for (let a = 0, o = s.length; a < o; ++a) {
                const l = s[a];
                if (l.constructor === LiteGraph.Subgraph && t != "onExecute") {
                    l.mode == n && l.sendEventToAllNodes(t, r, n);
                    continue;
                }
                !l[t] ||
                    l.mode != n ||
                    (r === void 0
                        ? l[t]()
                        : r && r.constructor === Array
                        ? l[t].apply(l, r)
                        : l[t](r));
            }
    }
    sendActionToCanvas(t, r) {
        if (this.list_of_graphcanvas)
            for (let n = 0; n < this.list_of_graphcanvas.length; ++n) {
                const s = this.list_of_graphcanvas[n];
                s[t] && s[t].apply(s, r);
            }
    }
    /**
     * Adds a new node instance to this graph
     * @method add
     * @param {LGraphNode} node the instance of the node
     */
    add(t, r) {
        if (t) {
            if (t.constructor === LGraphGroup) {
                this._groups.push(t),
                    this.setDirtyCanvas(!0),
                    this.change(),
                    (t.graph = this),
                    this._version++;
                return;
            }
            if (
                (t.id != -1 &&
                    this._nodes_by_id[t.id] != null &&
                    (console.warn(
                        "LiteGraph: there is already a node with this ID, changing it"
                    ),
                    LiteGraph.use_uuids
                        ? (t.id = LiteGraph.uuidv4())
                        : (t.id = ++this.last_node_id)),
                this._nodes.length >= LiteGraph.MAX_NUMBER_OF_NODES)
            )
                throw "LiteGraph: max number of nodes in a graph reached";
            return (
                LiteGraph.use_uuids
                    ? (t.id == null || t.id == -1) &&
                      (t.id = LiteGraph.uuidv4())
                    : t.id == null || t.id == -1
                    ? (t.id = ++this.last_node_id)
                    : this.last_node_id < t.id && (this.last_node_id = t.id),
                (t.graph = this),
                this._version++,
                this._nodes.push(t),
                (this._nodes_by_id[t.id] = t),
                t.onAdded && t.onAdded(this),
                this.config.align_to_grid && t.alignToGrid(),
                r || this.updateExecutionOrder(),
                this.onNodeAdded && this.onNodeAdded(t),
                this.setDirtyCanvas(!0),
                this.change(),
                t
            );
        }
    }
    /**
     * Removes a node from the graph
     * @method remove
     * @param {LGraphNode} node the instance of the node
     */
    remove(t) {
        if (t.constructor === LiteGraph.LGraphGroup) {
            const n = this._groups.indexOf(t);
            n != -1 && this._groups.splice(n, 1),
                (t.graph = null),
                this._version++,
                this.setDirtyCanvas(!0, !0),
                this.change();
            return;
        }
        if (this._nodes_by_id[t.id] == null || t.ignore_remove) return;
        if ((this.beforeChange(), t.inputs))
            for (let n = 0; n < t.inputs.length; n++)
                t.inputs[n].link != null && t.disconnectInput(n);
        if (t.outputs)
            for (let n = 0; n < t.outputs.length; n++) {
                const s = t.outputs[n];
                s.links != null && s.links.length && t.disconnectOutput(n);
            }
        if (
            (t.onRemoved && t.onRemoved(),
            (t.graph = null),
            this._version++,
            this.list_of_graphcanvas)
        )
            for (let n = 0; n < this.list_of_graphcanvas.length; ++n) {
                const s = this.list_of_graphcanvas[n];
                s.selected_nodes[t.id] && delete s.selected_nodes[t.id],
                    s.node_dragged == t && (s.node_dragged = null);
            }
        const r = this._nodes.indexOf(t);
        r != -1 && this._nodes.splice(r, 1),
            delete this._nodes_by_id[t.id],
            this.onNodeRemoved && this.onNodeRemoved(t),
            this.sendActionToCanvas("checkPanels"),
            this.setDirtyCanvas(!0, !0),
            this.afterChange(),
            this.change(),
            this.updateExecutionOrder();
    }
    /**
     * Returns a node by its id.
     * @method getNodeById
     * @param {Number} id
     */
    getNodeById(t) {
        return t == null ? null : this._nodes_by_id[t];
    }
    /**
     * Returns a list of nodes that matches a class
     * @method findNodesByClass
     * @param {Class} classObject the class itself (not an string)
     * @return {Array} a list with all the nodes of this type
     */
    findNodesByClass(t, r) {
        (r = r || []), (r.length = 0);
        for (let n = 0, s = this._nodes.length; n < s; ++n)
            this._nodes[n].constructor === t && r.push(this._nodes[n]);
        return r;
    }
    /**
     * Returns a list of nodes that matches a type
     * @method findNodesByType
     * @param {String} type the name of the node type
     * @return {Array} a list with all the nodes of this type
     */
    findNodesByType(t, r) {
        const n = t.toLowerCase();
        (r = r || []), (r.length = 0);
        for (let s = 0, a = this._nodes.length; s < a; ++s)
            this._nodes[s].type.toLowerCase() == n && r.push(this._nodes[s]);
        return r;
    }
    /**
     * Returns the first node that matches a name in its title
     * @method findNodeByTitle
     * @param {String} name the name of the node to search
     * @return {Node} the node or null
     */
    findNodeByTitle(t) {
        for (let r = 0, n = this._nodes.length; r < n; ++r)
            if (this._nodes[r].title == t) return this._nodes[r];
        return null;
    }
    /**
     * Returns a list of nodes that matches a name
     * @method findNodesByTitle
     * @param {String} name the name of the node to search
     * @return {Array} a list with all the nodes with this name
     */
    findNodesByTitle(t) {
        const r = [];
        for (let n = 0, s = this._nodes.length; n < s; ++n)
            this._nodes[n].title == t && r.push(this._nodes[n]);
        return r;
    }
    /**
     * Returns the top-most node in this position of the canvas
     * @method getNodeOnPos
     * @param {number} x the x coordinate in canvas space
     * @param {number} y the y coordinate in canvas space
     * @param {Array} nodes_list a list with all the nodes to search from, by default is all the nodes in the graph
     * @return {LGraphNode} the node at this position or null
     */
    getNodeOnPos(t, r, n, s) {
        n = n || this._nodes;
        const a = null;
        for (let o = n.length - 1; o >= 0; o--) {
            const l = n[o];
            if (l.isPointInside(t, r, s)) return l;
        }
        return a;
    }
    /**
     * Returns the top-most group in that position
     * @method getGroupOnPos
     * @param {number} x the x coordinate in canvas space
     * @param {number} y the y coordinate in canvas space
     * @return {LGraphGroup} the group or null
     */
    getGroupOnPos(t, r) {
        for (let n = this._groups.length - 1; n >= 0; n--) {
            const s = this._groups[n];
            if (s.isPointInside(t, r, 2, !0)) return s;
        }
        return null;
    }
    /**
     * Checks that the node type matches the node type registered, used when replacing a nodetype by a newer version during execution
     * this replaces the ones using the old version with the new version
     * @method checkNodeTypes
     */
    checkNodeTypes() {
        for (let t = 0; t < this._nodes.length; t++) {
            const r = this._nodes[t],
                n = LiteGraph.registered_node_types[r.type];
            if (r.constructor == n) continue;
            console.log("node being replaced by newer version: " + r.type);
            const s = LiteGraph.createNode(r.type);
            (this._nodes[t] = s),
                s.configure(r.serialize()),
                (s.graph = this),
                (this._nodes_by_id[s.id] = s),
                r.inputs && (s.inputs = r.inputs.concat()),
                r.outputs && (s.outputs = r.outputs.concat());
        }
        this.updateExecutionOrder();
    }
    // ********** GLOBALS *****************
    onAction(t, r, n) {
        this._input_nodes = this.findNodesByClass(
            LiteGraph.GraphInput,
            this._input_nodes
        );
        for (let s = 0; s < this._input_nodes.length; ++s) {
            const a = this._input_nodes[s];
            if (a.properties.name == t) {
                a.actionDo(t, r, n);
                break;
            }
        }
    }
    trigger(t, r) {
        this.onTrigger && this.onTrigger(t, r);
    }
    /**
     * Tell this graph it has a global graph input of this type
     * @method addGlobalInput
     * @param {String} name
     * @param {String} type
     * @param {*} value [optional]
     */
    addInput(t, r, n) {
        this.inputs[t] ||
            (this.beforeChange(),
            (this.inputs[t] = { name: t, type: r, value: n }),
            this._version++,
            this.afterChange(),
            this.onInputAdded && this.onInputAdded(t, r),
            this.onInputsOutputsChange && this.onInputsOutputsChange());
    }
    /**
     * Assign a data to the global graph input
     * @method setGlobalInputData
     * @param {String} name
     * @param {*} data
     */
    setInputData(t, r) {
        const n = this.inputs[t];
        n && (n.value = r);
    }
    /**
     * Returns the current value of a global graph input
     * @method getInputData
     * @param {String} name
     * @return {*} the data
     */
    getInputData(t) {
        const r = this.inputs[t];
        return r ? r.value : null;
    }
    /**
     * Changes the name of a global graph input
     * @method renameInput
     * @param {String} old_name
     * @param {String} new_name
     */
    renameInput(t, r) {
        if (r != t) {
            if (!this.inputs[t]) return !1;
            if (this.inputs[r])
                return (
                    console.error("there is already one input with that name"),
                    !1
                );
            (this.inputs[r] = this.inputs[t]),
                delete this.inputs[t],
                this._version++,
                this.onInputRenamed && this.onInputRenamed(t, r),
                this.onInputsOutputsChange && this.onInputsOutputsChange();
        }
    }
    /**
     * Changes the type of a global graph input
     * @method changeInputType
     * @param {String} name
     * @param {String} type
     */
    changeInputType(t, r) {
        if (!this.inputs[t]) return !1;
        (this.inputs[t].type &&
            String(this.inputs[t].type).toLowerCase() ==
                String(r).toLowerCase()) ||
            ((this.inputs[t].type = r),
            this._version++,
            this.onInputTypeChanged && this.onInputTypeChanged(t, r));
    }
    /**
     * Removes a global graph input
     * @method removeInput
     * @param {String} name
     * @param {String} type
     */
    removeInput(t) {
        return this.inputs[t]
            ? (delete this.inputs[t],
              this._version++,
              this.onInputRemoved && this.onInputRemoved(t),
              this.onInputsOutputsChange && this.onInputsOutputsChange(),
              !0)
            : !1;
    }
    /**
     * Creates a global graph output
     * @method addOutput
     * @param {String} name
     * @param {String} type
     * @param {*} value
     */
    addOutput(t, r, n) {
        (this.outputs[t] = { name: t, type: r, value: n }),
            this._version++,
            this.onOutputAdded && this.onOutputAdded(t, r),
            this.onInputsOutputsChange && this.onInputsOutputsChange();
    }
    /**
     * Assign a data to the global output
     * @method setOutputData
     * @param {String} name
     * @param {String} value
     */
    setOutputData(t, r) {
        const n = this.outputs[t];
        n && (n.value = r);
    }
    /**
     * Returns the current value of a global graph output
     * @method getOutputData
     * @param {String} name
     * @return {*} the data
     */
    getOutputData(t) {
        const r = this.outputs[t];
        return r ? r.value : null;
    }
    /**
     * Renames a global graph output
     * @method renameOutput
     * @param {String} old_name
     * @param {String} new_name
     */
    renameOutput(t, r) {
        if (!this.outputs[t]) return !1;
        if (this.outputs[r])
            return (
                console.error("there is already one output with that name"), !1
            );
        (this.outputs[r] = this.outputs[t]),
            delete this.outputs[t],
            this._version++,
            this.onOutputRenamed && this.onOutputRenamed(t, r),
            this.onInputsOutputsChange && this.onInputsOutputsChange();
    }
    /**
     * Changes the type of a global graph output
     * @method changeOutputType
     * @param {String} name
     * @param {String} type
     */
    changeOutputType(t, r) {
        if (!this.outputs[t]) return !1;
        (this.outputs[t].type &&
            String(this.outputs[t].type).toLowerCase() ==
                String(r).toLowerCase()) ||
            ((this.outputs[t].type = r),
            this._version++,
            this.onOutputTypeChanged && this.onOutputTypeChanged(t, r));
    }
    /**
     * Removes a global graph output
     * @method removeOutput
     * @param {String} name
     */
    removeOutput(t) {
        return this.outputs[t]
            ? (delete this.outputs[t],
              this._version++,
              this.onOutputRemoved && this.onOutputRemoved(t),
              this.onInputsOutputsChange && this.onInputsOutputsChange(),
              !0)
            : !1;
    }
    triggerInput(t, r) {
        const n = this.findNodesByTitle(t);
        for (let s = 0; s < n.length; ++s) n[s].onTrigger(r);
    }
    setCallback(t, r) {
        const n = this.findNodesByTitle(t);
        for (let s = 0; s < n.length; ++s) n[s].setTrigger(r);
    }
    //used for undo, called before any change is made to the graph
    beforeChange(t) {
        this.onBeforeChange && this.onBeforeChange(this, t),
            this.sendActionToCanvas("onBeforeChange", this);
    }
    //used to resend actions, called after any change is made to the graph
    afterChange(t) {
        this.onAfterChange && this.onAfterChange(this, t),
            this.sendActionToCanvas("onAfterChange", this);
    }
    connectionChange(t, r) {
        this.updateExecutionOrder(),
            this.onConnectionChange && this.onConnectionChange(t),
            this._version++,
            this.sendActionToCanvas("onConnectionChange");
    }
    /**
     * returns if the graph is in live mode
     * @method isLive
     */
    isLive() {
        if (!this.list_of_graphcanvas) return !1;
        for (let t = 0; t < this.list_of_graphcanvas.length; ++t)
            if (this.list_of_graphcanvas[t].live_mode) return !0;
        return !1;
    }
    /**
     * clears the triggered slot animation in all links (stop visual animation)
     * @method clearTriggeredSlots
     */
    clearTriggeredSlots() {
        for (const t in this.links) {
            const r = this.links[t];
            r && r._last_time && (r._last_time = 0);
        }
    }
    /* Called when something visually changed (not the graph!) */
    change() {
        LiteGraph.debug && console.log("Graph changed"),
            this.sendActionToCanvas("setDirty", [!0, !0]),
            this.on_change && this.on_change(this);
    }
    setDirtyCanvas(t, r) {
        this.sendActionToCanvas("setDirty", [t, r]);
    }
    /**
     * Destroys a link
     * @method removeLink
     * @param {Number} link_id
     */
    removeLink(t) {
        const r = this.links[t];
        if (!r) return;
        const n = this.getNodeById(r.target_id);
        n && n.disconnectInput(r.target_slot);
    }
    //save and recover app state ***************************************
    /**
     * Creates a Object containing all the info about this graph, it can be serialized
     * @method serialize
     * @return {Object} value of the node
     */
    serialize() {
        const t = [];
        for (let a = 0, o = this._nodes.length; a < o; ++a)
            t.push(this._nodes[a].serialize());
        const r = [];
        for (const a in this.links) {
            let o = this.links[a];
            if (!o.serialize) {
                console.warn(
                    "weird LLink bug, link info is not a LLink but a regular object"
                );
                const l = new LLink();
                for (const c in o) l[c] = o[c];
                (this.links[a] = l), (o = l);
            }
            r.push(o.serialize());
        }
        const n = [];
        for (let a = 0; a < this._groups.length; ++a)
            n.push(this._groups[a].serialize());
        const s = {
            last_node_id: this.last_node_id,
            last_link_id: this.last_link_id,
            nodes: t,
            links: r,
            groups: n,
            config: this.config,
            extra: this.extra,
            version: LiteGraph.VERSION,
        };
        return this.onSerialize && this.onSerialize(s), s;
    }
    /**
     * Configure a graph from a JSON string
     * @method configure
     * @param {String} str configure a graph from a JSON string
     * @param {Boolean} returns if there was any error parsing
     */
    configure(t, r) {
        if (!t) return;
        r || this.clear();
        const n = t.nodes;
        if (t.links && t.links.constructor === Array) {
            const a = [];
            for (let o = 0; o < t.links.length; ++o) {
                const l = t.links[o];
                if (!l) {
                    console.warn(
                        "serialized graph link data contains errors, skipping."
                    );
                    continue;
                }
                const c = new LLink();
                c.configure(l), (a[c.id] = c);
            }
            t.links = a;
        }
        for (const a in t) a == "nodes" || a == "groups" || (this[a] = t[a]);
        let s = !1;
        if (((this._nodes = []), n)) {
            for (let a = 0, o = n.length; a < o; ++a) {
                const l = n[a];
                let c = LiteGraph.createNode(l.type, l.title);
                c ||
                    (LiteGraph.debug &&
                        console.log("Node not found or has errors: " + l.type),
                    (c = new LGraphNode()),
                    (c.last_serialization = l),
                    (c.has_errors = !0),
                    (s = !0)),
                    (c.id = l.id),
                    this.add(c, !0);
            }
            for (let a = 0, o = n.length; a < o; ++a) {
                const l = n[a],
                    c = this.getNodeById(l.id);
                c && c.configure(l);
            }
        }
        if (((this._groups.length = 0), t.groups))
            for (let a = 0; a < t.groups.length; ++a) {
                const o = new LGraphGroup();
                o.configure(t.groups[a]), this.add(o);
            }
        return (
            this.updateExecutionOrder(),
            (this.extra = t.extra || {}),
            this.onConfigure && this.onConfigure(t),
            this._version++,
            this.setDirtyCanvas(!0, !0),
            s
        );
    }
    load(t, r) {
        const n = this;
        if (t.constructor === File || t.constructor === Blob) {
            const a = new FileReader();
            a.addEventListener("load", function (o) {
                const l = JSON.parse(o.target.result);
                n.configure(l), r && r();
            }),
                a.readAsText(t);
            return;
        }
        const s = new XMLHttpRequest();
        s.open("GET", t, !0),
            s.send(null),
            (s.onload = function (a) {
                if (s.status !== 200) {
                    console.error("Error loading graph:", s.status, s.response);
                    return;
                }
                const o = JSON.parse(s.response);
                n.configure(o), r && r();
            }),
            (s.onerror = function (a) {
                console.error("Error loading graph:", a);
            });
    }
    onNodeTrace(t, r, n) {}
    getSupportedTypes() {
        return this.supported_types || Ae.supported_types;
    }
};
//default supported types
k(Ae, "supported_types", ["number", "string", "boolean"]), //used to know which types of connections support this graph (some graphs do not allow certain types)
    k(Ae, "STATUS_STOPPED", 1),
    k(Ae, "STATUS_RUNNING", 2);
let LGraph = Ae;
class LLink {
    constructor(t, r, n, s, a, o) {
        (this.id = t),
            (this.type = r),
            (this.origin_id = n),
            (this.origin_slot = s),
            (this.target_id = a),
            (this.target_slot = o),
            (this._data = null),
            (this._pos = new Float32Array(2));
    }
    configure(t) {
        t.constructor === Array
            ? ((this.id = t[0]),
              (this.origin_id = t[1]),
              (this.origin_slot = t[2]),
              (this.target_id = t[3]),
              (this.target_slot = t[4]),
              (this.type = t[5]))
            : ((this.id = t.id),
              (this.type = t.type),
              (this.origin_id = t.origin_id),
              (this.origin_slot = t.origin_slot),
              (this.target_id = t.target_id),
              (this.target_slot = t.target_slot));
    }
    serialize() {
        return [
            this.id,
            this.origin_id,
            this.origin_slot,
            this.target_id,
            this.target_slot,
            this.type,
        ];
    }
}
class LGraphNode {
    constructor(t) {
        this._ctor(t);
    }
    _ctor(t) {
        (this.title = t || "Unnamed"),
            (this.size = [LiteGraph.NODE_WIDTH, 60]),
            (this.graph = null),
            (this._pos = new Float32Array(10, 10)),
            Object.defineProperty(this, "pos", {
                set: function (r) {
                    !r ||
                        r.length < 2 ||
                        ((this._pos[0] = r[0]), (this._pos[1] = r[1]));
                },
                get: function () {
                    return this._pos;
                },
                enumerable: !0,
            }),
            LiteGraph.use_uuids
                ? (this.id = LiteGraph.uuidv4())
                : (this.id = -1),
            (this.type = null),
            (this.inputs = []),
            (this.outputs = []),
            (this.connections = []),
            (this.properties = {}),
            (this.properties_info = []),
            (this.flags = {});
    }
    /**
     * configure a node from an object containing the serialized info
     * @method configure
     */
    configure(t) {
        this.graph && this.graph._version++;
        for (const r in t) {
            if (r == "properties") {
                for (const n in t.properties)
                    (this.properties[n] = t.properties[n]),
                        this.onPropertyChanged &&
                            this.onPropertyChanged(n, t.properties[n]);
                continue;
            }
            t[r] != null &&
                (typeof t[r] == "object"
                    ? this[r] && this[r].configure
                        ? this[r].configure(t[r])
                        : (this[r] = LiteGraph.cloneObject(t[r], this[r]))
                    : (this[r] = t[r]));
        }
        if ((t.title || (this.title = this.constructor.title), this.inputs))
            for (let r = 0; r < this.inputs.length; ++r) {
                const n = this.inputs[r],
                    s = this.graph ? this.graph.links[n.link] : null;
                this.onConnectionsChange &&
                    this.onConnectionsChange(LiteGraph.INPUT, r, !0, s, n),
                    this.onInputAdded && this.onInputAdded(n);
            }
        if (this.outputs)
            for (let r = 0; r < this.outputs.length; ++r) {
                const n = this.outputs[r];
                if (n.links) {
                    for (let s = 0; s < n.links.length; ++s) {
                        const a = this.graph
                            ? this.graph.links[n.links[s]]
                            : null;
                        this.onConnectionsChange &&
                            this.onConnectionsChange(
                                LiteGraph.OUTPUT,
                                r,
                                !0,
                                a,
                                n
                            );
                    }
                    this.onOutputAdded && this.onOutputAdded(n);
                }
            }
        if (this.widgets) {
            for (let r = 0; r < this.widgets.length; ++r) {
                const n = this.widgets[r];
                n &&
                    n.options &&
                    n.options.property &&
                    this.properties[n.options.property] != null &&
                    (n.value = JSON.parse(
                        JSON.stringify(this.properties[n.options.property])
                    ));
            }
            if (t.widgets_values)
                for (let r = 0; r < t.widgets_values.length; ++r)
                    this.widgets[r] &&
                        (this.widgets[r].value = t.widgets_values[r]);
        }
        this.onConfigure && this.onConfigure(t);
    }
    /**
     * serialize the content
     * @method serialize
     */
    serialize() {
        const t = {
            id: this.id,
            type: this.type,
            pos: this.pos,
            size: this.size,
            flags: LiteGraph.cloneObject(this.flags),
            order: this.order,
            mode: this.mode,
        };
        if (this.constructor === LGraphNode && this.last_serialization)
            return this.last_serialization;
        if ((this.inputs && (t.inputs = this.inputs), this.outputs)) {
            for (let r = 0; r < this.outputs.length; r++)
                delete this.outputs[r]._data;
            t.outputs = this.outputs;
        }
        if (
            (this.title &&
                this.title != this.constructor.title &&
                (t.title = this.title),
            this.properties &&
                (t.properties = LiteGraph.cloneObject(this.properties)),
            this.widgets && this.serialize_widgets)
        ) {
            t.widgets_values = [];
            for (let r = 0; r < this.widgets.length; ++r)
                this.widgets[r]
                    ? (t.widgets_values[r] = this.widgets[r].value)
                    : (t.widgets_values[r] = null);
        }
        return (
            t.type || (t.type = this.constructor.type),
            this.color && (t.color = this.color),
            this.bgcolor && (t.bgcolor = this.bgcolor),
            this.boxcolor && (t.boxcolor = this.boxcolor),
            this.shape && (t.shape = this.shape),
            this.onSerialize &&
                this.onSerialize(t) &&
                console.warn(
                    "node onSerialize shouldnt return anything, data should be stored in the object pass in the first parameter"
                ),
            t
        );
    }
    /* Creates a clone of this node */
    clone() {
        const t = LiteGraph.createNode(this.type);
        if (!t) return null;
        const r = LiteGraph.cloneObject(this.serialize());
        if (r.inputs)
            for (let n = 0; n < r.inputs.length; ++n) r.inputs[n].link = null;
        if (r.outputs)
            for (let n = 0; n < r.outputs.length; ++n)
                r.outputs[n].links && (r.outputs[n].links.length = 0);
        return (
            delete r.id,
            LiteGraph.use_uuids && (r.id = LiteGraph.uuidv4()),
            t.configure(r),
            t
        );
    }
    /**
     * serialize and stringify
     * @method toString
     */
    toString() {
        return JSON.stringify(this.serialize());
    }
    //deserialize (info) {} //this cannot be done from within, must be done in LiteGraph
    /**
     * get the title string
     * @method getTitle
     */
    getTitle() {
        return this.title || this.constructor.title;
    }
    /**
     * sets the value of a property
     * @method setProperty
     * @param {String} name
     * @param {*} value
     */
    setProperty(t, r) {
        if (
            (this.properties || (this.properties = {}),
            r === this.properties[t])
        )
            return;
        const n = this.properties[t];
        if (
            ((this.properties[t] = r),
            this.onPropertyChanged &&
                this.onPropertyChanged(t, r, n) === !1 &&
                (this.properties[t] = n),
            this.widgets)
        )
            for (let s = 0; s < this.widgets.length; ++s) {
                const a = this.widgets[s];
                if (a && a.options.property == t) {
                    a.value = r;
                    break;
                }
            }
    }
    // Execution *************************
    /**
     * sets the output data
     * @method setOutputData
     * @param {number} slot
     * @param {*} data
     */
    setOutputData(t, r) {
        if (!this.outputs || t == -1 || t >= this.outputs.length) return;
        const n = this.outputs[t];
        if (n && ((n._data = r), this.outputs[t].links))
            for (let s = 0; s < this.outputs[t].links.length; s++) {
                const a = this.outputs[t].links[s],
                    o = this.graph.links[a];
                o && (o.data = r);
            }
    }
    /**
     * sets the output data type, useful when you want to be able to overwrite the data type
     * @method setOutputDataType
     * @param {number} slot
     * @param {String} datatype
     */
    setOutputDataType(t, r) {
        if (!this.outputs || t == -1 || t >= this.outputs.length) return;
        const n = this.outputs[t];
        if (n && ((n.type = r), this.outputs[t].links))
            for (let s = 0; s < this.outputs[t].links.length; s++) {
                const a = this.outputs[t].links[s];
                this.graph.links[a].type = r;
            }
    }
    /**
     * Retrieves the input data (data traveling through the connection) from one slot
     * @method getInputData
     * @param {number} slot
     * @param {boolean} force_update if set to true it will force the connected node of this slot to output data into this link
     * @return {*} data or if it is not connected returns undefined
     */
    getInputData(t, r) {
        if (
            !this.inputs ||
            t >= this.inputs.length ||
            this.inputs[t].link == null
        )
            return;
        const n = this.inputs[t].link,
            s = this.graph.links[n];
        if (!s) return null;
        if (!r) return s.data;
        const a = this.graph.getNodeById(s.origin_id);
        return (
            a &&
                (a.updateOutputData
                    ? a.updateOutputData(s.origin_slot)
                    : a.onExecute && a.onExecute()),
            s.data
        );
    }
    /**
     * Retrieves the input data type (in case this supports multiple input types)
     * @method getInputDataType
     * @param {number} slot
     * @return {String} datatype in string format
     */
    getInputDataType(t) {
        if (
            !this.inputs ||
            t >= this.inputs.length ||
            this.inputs[t].link == null
        )
            return null;
        const r = this.inputs[t].link,
            n = this.graph.links[r];
        if (!n) return null;
        const s = this.graph.getNodeById(n.origin_id);
        if (!s) return n.type;
        const a = s.outputs[n.origin_slot];
        return a ? a.type : null;
    }
    /**
     * Retrieves the input data from one slot using its name instead of slot number
     * @method getInputDataByName
     * @param {String} slot_name
     * @param {boolean} force_update if set to true it will force the connected node of this slot to output data into this link
     * @return {*} data or if it is not connected returns null
     */
    getInputDataByName(t, r) {
        const n = this.findInputSlot(t);
        return n == -1 ? null : this.getInputData(n, r);
    }
    /**
     * tells you if there is a connection in one input slot
     * @method isInputConnected
     * @param {number} slot
     * @return {boolean}
     */
    isInputConnected(t) {
        return this.inputs
            ? t < this.inputs.length && this.inputs[t].link != null
            : !1;
    }
    /**
     * tells you info about an input connection (which node, type, etc)
     * @method getInputInfo
     * @param {number} slot
     * @return {Object} object or null { link: id, name: string, type: string or 0 }
     */
    getInputInfo(t) {
        return this.inputs && t < this.inputs.length ? this.inputs[t] : null;
    }
    /**
     * Returns the link info in the connection of an input slot
     * @method getInputLink
     * @param {number} slot
     * @return {LLink} object or null
     */
    getInputLink(t) {
        if (!this.inputs) return null;
        if (t < this.inputs.length) {
            const r = this.inputs[t];
            return this.graph.links[r.link];
        }
        return null;
    }
    /**
     * returns the node connected in the input slot
     * @method getInputNode
     * @param {number} slot
     * @return {LGraphNode} node or null
     */
    getInputNode(t) {
        if (!this.inputs || t >= this.inputs.length) return null;
        const r = this.inputs[t];
        if (!r || r.link === null) return null;
        const n = this.graph.links[r.link];
        return n ? this.graph.getNodeById(n.origin_id) : null;
    }
    /**
     * returns the value of an input with this name, otherwise checks if there is a property with that name
     * @method getInputOrProperty
     * @param {string} name
     * @return {*} value
     */
    getInputOrProperty(t) {
        if (!this.inputs || !this.inputs.length)
            return this.properties ? this.properties[t] : null;
        for (let r = 0, n = this.inputs.length; r < n; ++r) {
            const s = this.inputs[r];
            if (t == s.name && s.link != null) {
                const a = this.graph.links[s.link];
                if (a) return a.data;
            }
        }
        return this.properties[t];
    }
    /**
     * tells you the last output data that went in that slot
     * @method getOutputData
     * @param {number} slot
     * @return {Object}  object or null
     */
    getOutputData(t) {
        return !this.outputs || t >= this.outputs.length
            ? null
            : this.outputs[t]._data;
    }
    /**
     * tells you info about an output connection (which node, type, etc)
     * @method getOutputInfo
     * @param {number} slot
     * @return {Object}  object or null { name: string, type: string, links: [ ids of links in number ] }
     */
    getOutputInfo(t) {
        return this.outputs && t < this.outputs.length ? this.outputs[t] : null;
    }
    /**
     * tells you if there is a connection in one output slot
     * @method isOutputConnected
     * @param {number} slot
     * @return {boolean}
     */
    isOutputConnected(t) {
        return this.outputs
            ? t < this.outputs.length &&
                  this.outputs[t].links &&
                  this.outputs[t].links.length
            : !1;
    }
    /**
     * tells you if there is any connection in the output slots
     * @method isAnyOutputConnected
     * @return {boolean}
     */
    isAnyOutputConnected() {
        if (!this.outputs) return !1;
        for (let t = 0; t < this.outputs.length; ++t)
            if (this.outputs[t].links && this.outputs[t].links.length)
                return !0;
        return !1;
    }
    /**
     * retrieves all the nodes connected to this output slot
     * @method getOutputNodes
     * @param {number} slot
     * @return {array}
     */
    getOutputNodes(t) {
        if (
            !this.outputs ||
            this.outputs.length == 0 ||
            t >= this.outputs.length
        )
            return null;
        const r = this.outputs[t];
        if (!r.links || r.links.length == 0) return null;
        const n = [];
        for (let s = 0; s < r.links.length; s++) {
            const a = r.links[s],
                o = this.graph.links[a];
            if (o) {
                const l = this.graph.getNodeById(o.target_id);
                l && n.push(l);
            }
        }
        return n;
    }
    addOnTriggerInput() {
        const t = this.findInputSlot("onTrigger");
        if (t == -1) {
            //!trigS ||
            return (
                this.addInput("onTrigger", LiteGraph.EVENT, {
                    optional: !0,
                    nameLocked: !0,
                }),
                this.findInputSlot("onTrigger")
            );
        }
        return t;
    }
    addOnExecutedOutput() {
        const t = this.findOutputSlot("onExecuted");
        if (t == -1) {
            //!trigS ||
            return (
                this.addOutput("onExecuted", LiteGraph.ACTION, {
                    optional: !0,
                    nameLocked: !0,
                }),
                this.findOutputSlot("onExecuted")
            );
        }
        return t;
    }
    onAfterExecuteNode(t, r) {
        const n = this.findOutputSlot("onExecuted");
        n != -1 && this.triggerSlot(n, t, null, r);
    }
    changeMode(t) {
        switch (t) {
            case LiteGraph.ON_EVENT:
                break;
            case LiteGraph.ON_TRIGGER:
                this.addOnTriggerInput(), this.addOnExecutedOutput();
                break;
            case LiteGraph.NEVER:
                break;
            case LiteGraph.ALWAYS:
                break;
            case LiteGraph.ON_REQUEST:
                break;
            default:
                return !1;
        }
        return (this.mode = t), !0;
    }
    /**
     * Triggers the execution of actions that were deferred when the action was triggered
     * @method executePendingActions
     */
    executePendingActions() {
        if (!(!this._waiting_actions || !this._waiting_actions.length)) {
            for (let t = 0; t < this._waiting_actions.length; ++t) {
                const r = this._waiting_actions[t];
                this.onAction(r[0], r[1], r[2], r[3], r[4]);
            }
            this._waiting_actions.length = 0;
        }
    }
    /**
     * Triggers the node code execution, place a boolean/counter to mark the node as being executed
     * @method doExecute
     * @param {*} param
     * @param {*} options
     */
    doExecute(t, r) {
        (r = r || {}),
            this.onExecute &&
                (r.action_call ||
                    (r.action_call =
                        this.id + "_exec_" + Math.floor(Math.random() * 9999)),
                (this.graph.nodes_executing[this.id] = !0),
                this.onExecute(t, r),
                (this.graph.nodes_executing[this.id] = !1),
                (this.exec_version = this.graph.iteration),
                r &&
                    r.action_call &&
                    ((this.action_call = r.action_call),
                    (this.graph.nodes_executedAction[this.id] =
                        r.action_call))),
            (this.execute_triggered = 2),
            this.onAfterExecuteNode && this.onAfterExecuteNode(t, r);
    }
    /**
     * Triggers an action, wrapped by logics to control execution flow
     * @method actionDo
     * @param {String} action name
     * @param {*} param
     */
    actionDo(t, r, n, s) {
        (n = n || {}),
            this.onAction &&
                (n.action_call ||
                    (n.action_call =
                        this.id +
                        "_" +
                        (t || "action") +
                        "_" +
                        Math.floor(Math.random() * 9999)),
                (this.graph.nodes_actioning[this.id] = t || "actioning"),
                this.onAction(t, r, n, s),
                (this.graph.nodes_actioning[this.id] = !1),
                n &&
                    n.action_call &&
                    ((this.action_call = n.action_call),
                    (this.graph.nodes_executedAction[this.id] =
                        n.action_call))),
            (this.action_triggered = 2),
            this.onAfterExecuteNode && this.onAfterExecuteNode(r, n);
    }
    /**
     * Triggers an event in this node, this will trigger any output with the same name
     * @method trigger
     * @param {String} event name ( "on_play", ... ) if action is equivalent to false then the event is send to all
     * @param {*} param
     */
    trigger(t, r, n) {
        if (!(!this.outputs || !this.outputs.length)) {
            this.graph && (this.graph._last_trigger_time = LiteGraph.getTime());
            for (let s = 0; s < this.outputs.length; ++s) {
                const a = this.outputs[s];
                !a ||
                    a.type !== LiteGraph.EVENT ||
                    (t && a.name != t) ||
                    this.triggerSlot(s, r, null, n);
            }
        }
    }
    /**
     * Triggers a slot event in this node: cycle output slots and launch execute/action on connected nodes
     * @method triggerSlot
     * @param {Number} slot the index of the output slot
     * @param {*} param
     * @param {Number} link_id [optional] in case you want to trigger and specific output link in a slot
     */
    triggerSlot(t, r, n, s) {
        if (((s = s || {}), !this.outputs)) return;
        if (t == null) {
            console.error("slot must be a number");
            return;
        }
        t.constructor !== Number &&
            console.warn(
                "slot must be a number, use node.trigger('name') if you want to use a string"
            );
        const a = this.outputs[t];
        if (!a) return;
        const o = a.links;
        if (!(!o || !o.length)) {
            this.graph && (this.graph._last_trigger_time = LiteGraph.getTime());
            for (let l = 0; l < o.length; ++l) {
                const c = o[l];
                if (n != null && n != c) continue;
                const u = this.graph.links[o[l]];
                if (!u) continue;
                u._last_time = LiteGraph.getTime();
                const h = this.graph.getNodeById(u.target_id);
                if (h) {
                    if (
                        (h.inputs[u.target_slot],
                        h.mode === LiteGraph.ON_TRIGGER)
                    )
                        s.action_call ||
                            (s.action_call =
                                this.id +
                                "_trigg_" +
                                Math.floor(Math.random() * 9999)),
                            h.onExecute && h.doExecute(r, s);
                    else if (h.onAction) {
                        s.action_call ||
                            (s.action_call =
                                this.id +
                                "_act_" +
                                Math.floor(Math.random() * 9999));
                        const f = h.inputs[u.target_slot];
                        LiteGraph.use_deferred_actions && h.onExecute
                            ? (h._waiting_actions || (h._waiting_actions = []),
                              h._waiting_actions.push([
                                  f.name,
                                  r,
                                  s,
                                  u.target_slot,
                              ]))
                            : h.actionDo(f.name, r, s, u.target_slot);
                    }
                }
            }
        }
    }
    /**
     * clears the trigger slot animation
     * @method clearTriggeredSlot
     * @param {Number} slot the index of the output slot
     * @param {Number} link_id [optional] in case you want to trigger and specific output link in a slot
     */
    clearTriggeredSlot(t, r) {
        if (!this.outputs) return;
        const n = this.outputs[t];
        if (!n) return;
        const s = n.links;
        if (!(!s || !s.length))
            for (let a = 0; a < s.length; ++a) {
                const o = s[a];
                if (r != null && r != o) continue;
                const l = this.graph.links[s[a]];
                l && (l._last_time = 0);
            }
    }
    /**
     * changes node size and triggers callback
     * @method setSize
     * @param {vec2} size
     */
    setSize(t) {
        (this.size = t), this.onResize && this.onResize(this.size);
    }
    /**
     * add a new property to this node
     * @method addProperty
     * @param {string} name
     * @param {*} default_value
     * @param {string} type string defining the output type ("vec3","number",...)
     * @param {Object} extra_info this can be used to have special properties of the property (like values, etc)
     */
    addProperty(t, r, n, s) {
        const a = { name: t, type: n, default_value: r };
        if (s) for (const o in s) a[o] = s[o];
        return (
            this.properties_info || (this.properties_info = []),
            this.properties_info.push(a),
            this.properties || (this.properties = {}),
            (this.properties[t] = r),
            a
        );
    }
    //connections
    /**
     * add a new output slot to use in this node
     * @method addOutput
     * @param {string} name
     * @param {string} type string defining the output type ("vec3","number",...)
     * @param {Object} extra_info this can be used to have special properties of an output (label, special color, position, etc)
     */
    addOutput(t, r, n) {
        const s = { name: t, type: r, links: null };
        if (n) for (const a in n) s[a] = n[a];
        return (
            this.outputs || (this.outputs = []),
            this.outputs.push(s),
            this.onOutputAdded && this.onOutputAdded(s),
            LiteGraph.auto_load_slot_types &&
                LiteGraph.registerNodeAndSlotType(this, r, !0),
            this.setSize(this.computeSize()),
            this.setDirtyCanvas(!0, !0),
            s
        );
    }
    /**
     * add a new output slot to use in this node
     * @method addOutputs
     * @param {Array} array of triplets like [[name,type,extra_info],[...]]
     */
    addOutputs(t) {
        for (let r = 0; r < t.length; ++r) {
            const n = t[r],
                s = { name: n[0], type: n[1], link: null };
            if (t[2]) for (const a in n[2]) s[a] = n[2][a];
            this.outputs || (this.outputs = []),
                this.outputs.push(s),
                this.onOutputAdded && this.onOutputAdded(s),
                LiteGraph.auto_load_slot_types &&
                    LiteGraph.registerNodeAndSlotType(this, n[1], !0);
        }
        this.setSize(this.computeSize()), this.setDirtyCanvas(!0, !0);
    }
    /**
     * remove an existing output slot
     * @method removeOutput
     * @param {number} slot
     */
    removeOutput(t) {
        this.disconnectOutput(t), this.outputs.splice(t, 1);
        for (let r = t; r < this.outputs.length; ++r) {
            if (!this.outputs[r] || !this.outputs[r].links) continue;
            const n = this.outputs[r].links;
            for (let s = 0; s < n.length; ++s) {
                const a = this.graph.links[n[s]];
                a && (a.origin_slot -= 1);
            }
        }
        this.setSize(this.computeSize()),
            this.onOutputRemoved && this.onOutputRemoved(t),
            this.setDirtyCanvas(!0, !0);
    }
    /**
     * add a new input slot to use in this node
     * @method addInput
     * @param {string} name
     * @param {string} type string defining the input type ("vec3","number",...), it its a generic one use 0
     * @param {Object} extra_info this can be used to have special properties of an input (label, color, position, etc)
     */
    addInput(t, r, n) {
        r = r || 0;
        const s = { name: t, type: r, link: null };
        if (n) for (const a in n) s[a] = n[a];
        return (
            this.inputs || (this.inputs = []),
            this.inputs.push(s),
            this.setSize(this.computeSize()),
            this.onInputAdded && this.onInputAdded(s),
            LiteGraph.registerNodeAndSlotType(this, r),
            this.setDirtyCanvas(!0, !0),
            s
        );
    }
    /**
     * add several new input slots in this node
     * @method addInputs
     * @param {Array} array of triplets like [[name,type,extra_info],[...]]
     */
    addInputs(t) {
        for (let r = 0; r < t.length; ++r) {
            const n = t[r],
                s = { name: n[0], type: n[1], link: null };
            if (t[2]) for (const a in n[2]) s[a] = n[2][a];
            this.inputs || (this.inputs = []),
                this.inputs.push(s),
                this.onInputAdded && this.onInputAdded(s),
                LiteGraph.registerNodeAndSlotType(this, n[1]);
        }
        this.setSize(this.computeSize()), this.setDirtyCanvas(!0, !0);
    }
    /**
     * remove an existing input slot
     * @method removeInput
     * @param {number} slot
     */
    removeInput(t) {
        this.disconnectInput(t);
        const r = this.inputs.splice(t, 1);
        for (let n = t; n < this.inputs.length; ++n) {
            if (!this.inputs[n]) continue;
            const s = this.graph.links[this.inputs[n].link];
            s && (s.target_slot -= 1);
        }
        this.setSize(this.computeSize()),
            this.onInputRemoved && this.onInputRemoved(t, r[0]),
            this.setDirtyCanvas(!0, !0);
    }
    /**
     * add an special connection to this node (used for special kinds of graphs)
     * @method addConnection
     * @param {string} name
     * @param {string} type string defining the input type ("vec3","number",...)
     * @param {[x,y]} pos position of the connection inside the node
     * @param {string} direction if is input or output
     */
    addConnection(t, r, n, s) {
        const a = {
            name: t,
            type: r,
            pos: n,
            direction: s,
            links: null,
        };
        return this.connections.push(a), a;
    }
    /**
     * computes the minimum size of a node according to its inputs and output slots
     * @method computeSize
     * @param {vec2} minHeight
     * @return {vec2} the total size
     */
    computeSize(t) {
        if (this.constructor.size) return this.constructor.size.concat();
        let r = Math.max(
            this.inputs ? this.inputs.length : 1,
            this.outputs ? this.outputs.length : 1
        );
        const n = t || new Float32Array([0, 0]);
        r = Math.max(r, 1);
        const s = LiteGraph.NODE_TEXT_SIZE,
            a = u(this.title);
        let o = 0,
            l = 0;
        if (this.inputs)
            for (let h = 0, f = this.inputs.length; h < f; ++h) {
                const d = this.inputs[h],
                    p = d.label || d.name || "",
                    _ = u(p);
                o < _ && (o = _);
            }
        if (this.outputs)
            for (let h = 0, f = this.outputs.length; h < f; ++h) {
                const d = this.outputs[h],
                    p = d.label || d.name || "",
                    _ = u(p);
                l < _ && (l = _);
            }
        (n[0] = Math.max(o + l + 10, a)),
            (n[0] = Math.max(n[0], LiteGraph.NODE_WIDTH)),
            this.widgets &&
                this.widgets.length &&
                (n[0] = Math.max(n[0], LiteGraph.NODE_WIDTH * 1.5)),
            (n[1] =
                (this.constructor.slot_start_y || 0) +
                r * LiteGraph.NODE_SLOT_HEIGHT);
        let c = 0;
        if (this.widgets && this.widgets.length) {
            for (let h = 0, f = this.widgets.length; h < f; ++h)
                this.widgets[h].computeSize
                    ? (c += this.widgets[h].computeSize(n[0])[1] + 4)
                    : (c += LiteGraph.NODE_WIDGET_HEIGHT + 4);
            c += 8;
        }
        this.widgets_up
            ? (n[1] = Math.max(n[1], c))
            : this.widgets_start_y != null
            ? (n[1] = Math.max(n[1], c + this.widgets_start_y))
            : (n[1] += c);
        function u(h) {
            return h ? s * h.length * 0.6 : 0;
        }
        return (
            this.constructor.min_height &&
                n[1] < this.constructor.min_height &&
                (n[1] = this.constructor.min_height),
            (n[1] += 6),
            n
        );
    }
    /**
     * returns all the info available about a property of this node.
     *
     * @method getPropertyInfo
     * @param {String} property name of the property
     * @return {Object} the object with all the available info
     */
    getPropertyInfo(t) {
        let r = null;
        if (this.properties_info) {
            for (let n = 0; n < this.properties_info.length; ++n)
                if (this.properties_info[n].name == t) {
                    r = this.properties_info[n];
                    break;
                }
        }
        return (
            this.constructor["@" + t] && (r = this.constructor["@" + t]),
            this.constructor.widgets_info &&
                this.constructor.widgets_info[t] &&
                (r = this.constructor.widgets_info[t]),
            !r && this.onGetPropertyInfo && (r = this.onGetPropertyInfo(t)),
            r || (r = {}),
            r.type || (r.type = typeof this.properties[t]),
            r.widget == "combo" && (r.type = "enum"),
            r
        );
    }
    /**
     * Defines a widget inside the node, it will be rendered on top of the node, you can control lots of properties
     *
     * @method addWidget
     * @param {String} type the widget type (could be "number","string","combo"
     * @param {String} name the text to show on the widget
     * @param {String} value the default value
     * @param {Function|String} callback function to call when it changes (optionally, it can be the name of the property to modify)
     * @param {Object} options the object that contains special properties of this widget
     * @return {Object} the created widget object
     */
    addWidget(t, r, n, s, a) {
        this.widgets || (this.widgets = []),
            !a && s && s.constructor === Object && ((a = s), (s = null)),
            a && a.constructor === String && (a = { property: a }),
            s &&
                s.constructor === String &&
                (a || (a = {}), (a.property = s), (s = null)),
            s &&
                s.constructor !== Function &&
                (console.warn("addWidget: callback must be a function"),
                (s = null));
        const o = {
            type: t.toLowerCase(),
            name: r,
            value: n,
            callback: s,
            options: a || {},
        };
        if (
            (o.options.y !== void 0 && (o.y = o.options.y),
            !s &&
                !o.options.callback &&
                !o.options.property &&
                console.warn(
                    "LiteGraph addWidget(...) without a callback or property assigned"
                ),
            t == "combo" && !o.options.values)
        )
            throw "LiteGraph addWidget('combo',...) requires to pass values in options: { values:['red','blue'] }";
        return this.widgets.push(o), this.setSize(this.computeSize()), o;
    }
    addCustomWidget(t) {
        return this.widgets || (this.widgets = []), this.widgets.push(t), t;
    }
    /**
     * returns the bounding of the object, used for rendering purposes
     * @method getBounding
     * @param out {Float32Array[4]?} [optional] a place to store the output, to free garbage
     * @param compute_outer {boolean?} [optional] set to true to include the shadow and connection points in the bounding calculation
     * @return {Float32Array[4]} the bounding box in format of [topleft_cornerx, topleft_cornery, width, height]
     */
    getBounding(t, r) {
        t = t || new Float32Array(4);
        const n = this.pos,
            s = this.flags.collapsed,
            a = this.size;
        let o = 0,
            l = 1,
            c = 0,
            u = 0;
        return (
            r && ((o = 4), (l = 6 + o), (c = 4), (u = 5 + c)),
            (t[0] = n[0] - o),
            (t[1] = n[1] - LiteGraph.NODE_TITLE_HEIGHT - c),
            (t[2] = s
                ? (this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH) + l
                : a[0] + l),
            (t[3] = s
                ? LiteGraph.NODE_TITLE_HEIGHT + u
                : a[1] + LiteGraph.NODE_TITLE_HEIGHT + u),
            this.onBounding && this.onBounding(t),
            t
        );
    }
    /**
     * checks if a point is inside the shape of a node
     * @method isPointInside
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isPointInside(t, r, n, s) {
        n = n || 0;
        let a =
            this.graph && this.graph.isLive() ? 0 : LiteGraph.NODE_TITLE_HEIGHT;
        if ((s && (a = 0), this.flags && this.flags.collapsed)) {
            if (
                LiteGraph.isInsideRectangle(
                    t,
                    r,
                    this.pos[0] - n,
                    this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT - n,
                    (this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH) +
                        2 * n,
                    LiteGraph.NODE_TITLE_HEIGHT + 2 * n
                )
            )
                return !0;
        } else if (
            this.pos[0] - 4 - n < t &&
            this.pos[0] + this.size[0] + 4 + n > t &&
            this.pos[1] - a - n < r &&
            this.pos[1] + this.size[1] + n > r
        )
            return !0;
        return !1;
    }
    /**
     * checks if a point is inside a node slot, and returns info about which slot
     * @method getSlotInPosition
     * @param {number} x
     * @param {number} y
     * @return {Object} if found the object contains { input|output: slot object, slot: number, link_pos: [x,y] }
     */
    getSlotInPosition(t, r) {
        const n = new Float32Array(2);
        if (this.inputs)
            for (let s = 0, a = this.inputs.length; s < a; ++s) {
                const o = this.inputs[s];
                if (
                    (this.getConnectionPos(!0, s, n),
                    LiteGraph.isInsideRectangle(
                        t,
                        r,
                        n[0] - 10,
                        n[1] - 5,
                        20,
                        10
                    ))
                )
                    return { input: o, slot: s, link_pos: n };
            }
        if (this.outputs)
            for (let s = 0, a = this.outputs.length; s < a; ++s) {
                const o = this.outputs[s];
                if (
                    (this.getConnectionPos(!1, s, n),
                    LiteGraph.isInsideRectangle(
                        t,
                        r,
                        n[0] - 10,
                        n[1] - 5,
                        20,
                        10
                    ))
                )
                    return { output: o, slot: s, link_pos: n };
            }
        return null;
    }
    /**
     * returns the input slot with a given name (used for dynamic slots), -1 if not found
     * @method findInputSlot
     * @param {string} name the name of the slot
     * @param {boolean} returnObj if the obj itself wanted
     * @return {number_or_object} the slot (-1 if not found)
     */
    findInputSlot(t, r) {
        if (!this.inputs) return -1;
        for (let n = 0, s = this.inputs.length; n < s; ++n)
            if (t == this.inputs[n].name) return r ? this.inputs[n] : n;
        return -1;
    }
    /**
     * returns the output slot with a given name (used for dynamic slots), -1 if not found
     * @method findOutputSlot
     * @param {string} name the name of the slot
     * @param {boolean} returnObj if the obj itself wanted
     * @return {number_or_object} the slot (-1 if not found)
     */
    findOutputSlot(t, r) {
        if (((r = r || !1), !this.outputs)) return -1;
        for (let n = 0, s = this.outputs.length; n < s; ++n)
            if (t == this.outputs[n].name) return r ? this.outputs[n] : n;
        return -1;
    }
    // TODO refactor: USE SINGLE findInput/findOutput functions! :: merge options
    /**
     * returns the first free input slot
     * @method findInputSlotFree
     * @param {object} options
     * @return {number_or_object} the slot (-1 if not found)
     */
    findInputSlotFree(t) {
        const s = Object.assign(
            { returnObj: !1, typesNotAccepted: [] },
            t || {}
        );
        if (!this.inputs) return -1;
        for (let a = 0, o = this.inputs.length; a < o; ++a)
            if (
                !(this.inputs[a].link && this.inputs[a].link != null) &&
                !(
                    s.typesNotAccepted &&
                    s.typesNotAccepted.includes &&
                    s.typesNotAccepted.includes(this.inputs[a].type)
                )
            )
                return s.returnObj ? this.inputs[a] : a;
        return -1;
    }
    /**
     * returns the first output slot free
     * @method findOutputSlotFree
     * @param {object} options
     * @return {number_or_object} the slot (-1 if not found)
     */
    findOutputSlotFree(t) {
        const s = Object.assign(
            { returnObj: !1, typesNotAccepted: [] },
            t || {}
        );
        if (!this.outputs) return -1;
        for (let a = 0, o = this.outputs.length; a < o; ++a)
            if (
                !(this.outputs[a].links && this.outputs[a].links != null) &&
                !(
                    s.typesNotAccepted &&
                    s.typesNotAccepted.includes &&
                    s.typesNotAccepted.includes(this.outputs[a].type)
                )
            )
                return s.returnObj ? this.outputs[a] : a;
        return -1;
    }
    /**
     * findSlotByType for INPUTS
     */
    findInputSlotByType(t, r, n, s) {
        return this.findSlotByType(!0, t, r, n, s);
    }
    /**
     * findSlotByType for OUTPUTS
     */
    findOutputSlotByType(t, r, n, s) {
        return this.findSlotByType(!1, t, r, n, s);
    }
    /**
     * returns the output (or input) slot with a given type, -1 if not found
     * @method findSlotByType
     * @param {boolean} input uise inputs instead of outputs
     * @param {string} type the type of the slot
     * @param {boolean} returnObj if the obj itself wanted
     * @param {boolean} preferFreeSlot if we want a free slot (if not found, will return the first of the type anyway)
     * @return {number_or_object} the slot (-1 if not found)
     */
    findSlotByType(t, r, n, s, a) {
        (t = t || !1), (n = n || !1), (s = s || !1), (a = a || !1);
        const o = t ? this.inputs : this.outputs;
        if (!o) return -1;
        (r == "" || r == "*") && (r = 0);
        for (let l = 0, c = o.length; l < c; ++l) {
            const u = (r + "").toLowerCase().split(",");
            let h = o[l].type == "0" || o[l].type == "*" ? "0" : o[l].type;
            h = (h + "").toLowerCase().split(",");
            for (let f = 0; f < u.length; f++)
                for (let d = 0; d < h.length; d++)
                    if (
                        (u[f] == "_event_" && (u[f] = LiteGraph.EVENT),
                        h[f] == "_event_" && (h[f] = LiteGraph.EVENT),
                        u[f] == "*" && (u[f] = 0),
                        h[f] == "*" && (h[f] = 0),
                        u[f] == h[d])
                    ) {
                        if (s && o[l].links && o[l].links !== null) continue;
                        return n ? o[l] : l;
                    }
        }
        if (s && !a)
            for (let l = 0, c = o.length; l < c; ++l) {
                const u = (r + "").toLowerCase().split(",");
                let h = o[l].type == "0" || o[l].type == "*" ? "0" : o[l].type;
                h = (h + "").toLowerCase().split(",");
                for (let f = 0; f < u.length; f++)
                    for (let d = 0; d < h.length; d++)
                        if (
                            (u[f] == "*" && (u[f] = 0),
                            h[f] == "*" && (h[f] = 0),
                            u[f] == h[d])
                        )
                            return n ? o[l] : l;
            }
        return -1;
    }
    /**
     * connect this node output to the input of another node BY TYPE
     * @method connectByType
     * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
     * @param {LGraphNode} node the target node
     * @param {string} target_type the input slot type of the target node
     * @return {Object} the link_info is created, otherwise null
     */
    connectByType(t, r, n, s) {
        const l = Object.assign(
            {
                createEventInCase: !0,
                firstFreeIfOutputGeneralInCase: !0,
                generalTypeInCase: !0,
            },
            s || {}
        );
        r && r.constructor === Number && (r = this.graph.getNodeById(r));
        const c = r.findInputSlotByType(n, !1, !0);
        if (c >= 0 && c !== null) return this.connect(t, r, c);
        if (l.createEventInCase && n == LiteGraph.EVENT)
            return this.connect(t, r, -1);
        if (l.generalTypeInCase) {
            const u = r.findInputSlotByType(0, !1, !0, !0);
            if (u >= 0) return this.connect(t, r, u);
        }
        if (
            l.firstFreeIfOutputGeneralInCase &&
            (n == 0 || n == "*" || n == "")
        ) {
            const u = r.findInputSlotFree({
                typesNotAccepted: [LiteGraph.EVENT],
            });
            if (u >= 0) return this.connect(t, r, u);
        }
        return (
            console.debug("no way to connect type: ", n, " to targetNODE ", r),
            null
        );
    }
    /**
     * connect this node input to the output of another node BY TYPE
     * @method connectByType
     * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
     * @param {LGraphNode} node the target node
     * @param {string} target_type the output slot type of the target node
     * @return {Object} the link_info is created, otherwise null
     */
    connectByTypeOutput(t, r, n, s) {
        const l = Object.assign(
            {
                createEventInCase: !0,
                firstFreeIfInputGeneralInCase: !0,
                generalTypeInCase: !0,
            },
            s || {}
        );
        r && r.constructor === Number && (r = this.graph.getNodeById(r));
        const c = r.findOutputSlotByType(n, !1, !0);
        if (c >= 0 && c !== null) return r.connect(c, this, t);
        if (l.generalTypeInCase) {
            const u = r.findOutputSlotByType(0, !1, !0, !0);
            if (u >= 0) return r.connect(u, this, t);
        }
        if (
            l.createEventInCase &&
            n == LiteGraph.EVENT &&
            LiteGraph.do_add_triggers_slots
        ) {
            const u = r.addOnExecutedOutput();
            return r.connect(u, this, t);
        }
        if (
            l.firstFreeIfInputGeneralInCase &&
            (n == 0 || n == "*" || n == "")
        ) {
            const u = r.findOutputSlotFree({
                typesNotAccepted: [LiteGraph.EVENT],
            });
            if (u >= 0) return r.connect(u, this, t);
        }
        return (
            console.debug(
                "no way to connect byOUT type: ",
                n,
                " to sourceNODE ",
                r
            ),
            null
        );
    }
    /**
     * connect this node output to the input of another node
     * @method connect
     * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
     * @param {LGraphNode} node the target node
     * @param {number_or_string} target_slot the input slot of the target node (could be the number of the slot or the string with the name of the slot, or -1 to connect a trigger)
     * @return {Object} the link_info is created, otherwise null
     */
    connect(t, r, n) {
        if (((n = n || 0), !this.graph))
            return (
                console.log(
                    "Connect: Error, node doesn't belong to any graph. Nodes must be added first to a graph before connecting them."
                ),
                null
            );
        if (t.constructor === String) {
            if (((t = this.findOutputSlot(t)), t == -1))
                return (
                    LiteGraph.debug &&
                        console.log("Connect: Error, no slot of name " + t),
                    null
                );
        } else if (!this.outputs || t >= this.outputs.length)
            return (
                LiteGraph.debug &&
                    console.log("Connect: Error, slot number not found"),
                null
            );
        if (
            (r && r.constructor === Number && (r = this.graph.getNodeById(r)),
            !r)
        )
            throw "target node is null";
        if (r == this) return null;
        if (n.constructor === String) {
            if (((n = r.findInputSlot(n)), n == -1))
                return (
                    LiteGraph.debug &&
                        console.log("Connect: Error, no slot of name " + n),
                    null
                );
        } else if (n === LiteGraph.EVENT)
            if (LiteGraph.do_add_triggers_slots)
                r.changeMode(LiteGraph.ON_TRIGGER),
                    (n = r.findInputSlot("onTrigger"));
            else return null;
        else if (!r.inputs || n >= r.inputs.length)
            return (
                LiteGraph.debug &&
                    console.log("Connect: Error, slot number not found"),
                null
            );
        let s = !1;
        const a = r.inputs[n];
        let o = null;
        const l = this.outputs[t];
        if (!this.outputs[t]) return null;
        if (
            (r.onBeforeConnectInput && (n = r.onBeforeConnectInput(n)),
            n === !1 ||
                n === null ||
                !LiteGraph.isValidConnection(l.type, a.type))
        )
            return (
                this.setDirtyCanvas(!1, !0),
                s && this.graph.connectionChange(this, o),
                null
            );
        if (
            (r.onConnectInput &&
                r.onConnectInput(n, l.type, l, this, t) === !1) ||
            (this.onConnectOutput &&
                this.onConnectOutput(t, a.type, a, r, n) === !1)
        )
            return null;
        if (
            (r.inputs[n] &&
                r.inputs[n].link != null &&
                (this.graph.beforeChange(),
                r.disconnectInput(n, {
                    doProcessChange: !1,
                }),
                (s = !0)),
            l.links !== null && l.links.length)
        )
            switch (l.type) {
                case LiteGraph.EVENT:
                    LiteGraph.allow_multi_output_for_events ||
                        (this.graph.beforeChange(),
                        this.disconnectOutput(t, !1, {
                            doProcessChange: !1,
                        }),
                        (s = !0));
                    break;
            }
        let c;
        return (
            LiteGraph.use_uuids
                ? (c = LiteGraph.uuidv4())
                : (c = ++this.graph.last_link_id),
            (o = new LLink(c, a.type || l.type, this.id, t, r.id, n)),
            (this.graph.links[o.id] = o),
            l.links == null && (l.links = []),
            l.links.push(o.id),
            (r.inputs[n].link = o.id),
            this.graph && this.graph._version++,
            this.onConnectionsChange &&
                this.onConnectionsChange(LiteGraph.OUTPUT, t, !0, o, l),
            r.onConnectionsChange &&
                r.onConnectionsChange(LiteGraph.INPUT, n, !0, o, a),
            this.graph &&
                this.graph.onNodeConnectionChange &&
                (this.graph.onNodeConnectionChange(
                    LiteGraph.INPUT,
                    r,
                    n,
                    this,
                    t
                ),
                this.graph.onNodeConnectionChange(
                    LiteGraph.OUTPUT,
                    this,
                    t,
                    r,
                    n
                )),
            this.setDirtyCanvas(!1, !0),
            this.graph.afterChange(),
            this.graph.connectionChange(this, o),
            o
        );
    }
    /**
     * disconnect one output to an specific node
     * @method disconnectOutput
     * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
     * @param {LGraphNode} target_node the target node to which this slot is connected [Optional, if not target_node is specified all nodes will be disconnected]
     * @return {boolean} if it was disconnected successfully
     */
    disconnectOutput(t, r) {
        if (t.constructor === String) {
            if (((t = this.findOutputSlot(t)), t == -1))
                return (
                    LiteGraph.debug &&
                        console.log("Connect: Error, no slot of name " + t),
                    !1
                );
        } else if (!this.outputs || t >= this.outputs.length)
            return (
                LiteGraph.debug &&
                    console.log("Connect: Error, slot number not found"),
                !1
            );
        const n = this.outputs[t];
        if (!n || !n.links || n.links.length == 0) return !1;
        if (r) {
            if (
                (r.constructor === Number && (r = this.graph.getNodeById(r)),
                !r)
            )
                throw "Target Node not found";
            for (let s = 0, a = n.links.length; s < a; s++) {
                const o = n.links[s],
                    l = this.graph.links[o];
                if (l.target_id == r.id) {
                    n.links.splice(s, 1);
                    const c = r.inputs[l.target_slot];
                    (c.link = null),
                        delete this.graph.links[o],
                        this.graph && this.graph._version++,
                        r.onConnectionsChange &&
                            r.onConnectionsChange(
                                LiteGraph.INPUT,
                                l.target_slot,
                                !1,
                                l,
                                c
                            ),
                        this.onConnectionsChange &&
                            this.onConnectionsChange(
                                LiteGraph.OUTPUT,
                                t,
                                !1,
                                l,
                                n
                            ),
                        this.graph &&
                            this.graph.onNodeConnectionChange &&
                            this.graph.onNodeConnectionChange(
                                LiteGraph.OUTPUT,
                                this,
                                t
                            ),
                        this.graph &&
                            this.graph.onNodeConnectionChange &&
                            (this.graph.onNodeConnectionChange(
                                LiteGraph.OUTPUT,
                                this,
                                t
                            ),
                            this.graph.onNodeConnectionChange(
                                LiteGraph.INPUT,
                                r,
                                l.target_slot
                            ));
                    break;
                }
            }
        } else {
            for (let s = 0, a = n.links.length; s < a; s++) {
                const o = n.links[s],
                    l = this.graph.links[o];
                if (!l) continue;
                const c = this.graph.getNodeById(l.target_id);
                let u = null;
                this.graph && this.graph._version++,
                    c &&
                        ((u = c.inputs[l.target_slot]),
                        (u.link = null),
                        c.onConnectionsChange &&
                            c.onConnectionsChange(
                                LiteGraph.INPUT,
                                l.target_slot,
                                !1,
                                l,
                                u
                            ),
                        this.graph &&
                            this.graph.onNodeConnectionChange &&
                            this.graph.onNodeConnectionChange(
                                LiteGraph.INPUT,
                                c,
                                l.target_slot
                            )),
                    delete this.graph.links[o],
                    this.onConnectionsChange &&
                        this.onConnectionsChange(LiteGraph.OUTPUT, t, !1, l, n),
                    this.graph &&
                        this.graph.onNodeConnectionChange &&
                        (this.graph.onNodeConnectionChange(
                            LiteGraph.OUTPUT,
                            this,
                            t
                        ),
                        this.graph.onNodeConnectionChange(
                            LiteGraph.INPUT,
                            c,
                            l.target_slot
                        ));
            }
            n.links = null;
        }
        return (
            this.setDirtyCanvas(!1, !0), this.graph.connectionChange(this), !0
        );
    }
    /**
     * disconnect one input
     * @method disconnectInput
     * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
     * @return {boolean} if it was disconnected successfully
     */
    disconnectInput(t) {
        if (t.constructor === String) {
            if (((t = this.findInputSlot(t)), t == -1))
                return (
                    LiteGraph.debug &&
                        console.log("Connect: Error, no slot of name " + t),
                    !1
                );
        } else if (!this.inputs || t >= this.inputs.length)
            return (
                LiteGraph.debug &&
                    console.log("Connect: Error, slot number not found"),
                !1
            );
        const r = this.inputs[t];
        if (!r) return !1;
        const n = this.inputs[t].link;
        if (n != null) {
            this.inputs[t].link = null;
            const s = this.graph.links[n];
            if (s) {
                const a = this.graph.getNodeById(s.origin_id);
                if (!a) return !1;
                const o = a.outputs[s.origin_slot];
                if (!o || !o.links || o.links.length == 0) return !1;
                let l = null;
                for (let c = 0, u = o.links.length; c < u; c++)
                    if (((l = c), o.links[c] == n)) {
                        o.links.splice(c, 1);
                        break;
                    }
                delete this.graph.links[n],
                    this.graph && this.graph._version++,
                    this.onConnectionsChange &&
                        this.onConnectionsChange(LiteGraph.INPUT, t, !1, s, r),
                    a.onConnectionsChange &&
                        a.onConnectionsChange(LiteGraph.OUTPUT, l, !1, s, o),
                    this.graph &&
                        this.graph.onNodeConnectionChange &&
                        (this.graph.onNodeConnectionChange(
                            LiteGraph.OUTPUT,
                            a,
                            l
                        ),
                        this.graph.onNodeConnectionChange(
                            LiteGraph.INPUT,
                            this,
                            t
                        ));
            }
        }
        return (
            this.setDirtyCanvas(!1, !0),
            this.graph && this.graph.connectionChange(this),
            !0
        );
    }
    /**
     * returns the center of a connection point in canvas coords
     * @method getConnectionPos
     * @param {boolean} is_input true if if a input slot, false if it is an output
     * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
     * @param {vec2} out [optional] a place to store the output, to free garbage
     * @return {[x,y]} the position
     **/
    getConnectionPos(t, r, n) {
        n = n || new Float32Array(2);
        let s = 0;
        t && this.inputs && (s = this.inputs.length),
            !t && this.outputs && (s = this.outputs.length);
        const a = LiteGraph.NODE_SLOT_HEIGHT * 0.5;
        if (this.flags.collapsed) {
            const o = this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH;
            return (
                this.horizontal
                    ? ((n[0] = this.pos[0] + o * 0.5),
                      t
                          ? (n[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT)
                          : (n[1] = this.pos[1]))
                    : (t ? (n[0] = this.pos[0]) : (n[0] = this.pos[0] + o),
                      (n[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT * 0.5)),
                n
            );
        }
        return t && r == -1
            ? ((n[0] = this.pos[0] + LiteGraph.NODE_TITLE_HEIGHT * 0.5),
              (n[1] = this.pos[1] + LiteGraph.NODE_TITLE_HEIGHT * 0.5),
              n)
            : t && s > r && this.inputs[r].pos
            ? ((n[0] = this.pos[0] + this.inputs[r].pos[0]),
              (n[1] = this.pos[1] + this.inputs[r].pos[1]),
              n)
            : !t && s > r && this.outputs[r].pos
            ? ((n[0] = this.pos[0] + this.outputs[r].pos[0]),
              (n[1] = this.pos[1] + this.outputs[r].pos[1]),
              n)
            : this.horizontal
            ? ((n[0] = this.pos[0] + (r + 0.5) * (this.size[0] / s)),
              t
                  ? (n[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT)
                  : (n[1] = this.pos[1] + this.size[1]),
              n)
            : (t
                  ? (n[0] = this.pos[0] + a)
                  : (n[0] = this.pos[0] + this.size[0] + 1 - a),
              (n[1] =
                  this.pos[1] +
                  (r + 0.7) * LiteGraph.NODE_SLOT_HEIGHT +
                  (this.constructor.slot_start_y || 0)),
              n);
    }
    /* Force align to grid */
    alignToGrid() {
        (this.pos[0] =
            LiteGraph.CANVAS_GRID_SIZE *
            Math.round(this.pos[0] / LiteGraph.CANVAS_GRID_SIZE)),
            (this.pos[1] =
                LiteGraph.CANVAS_GRID_SIZE *
                Math.round(this.pos[1] / LiteGraph.CANVAS_GRID_SIZE));
    }
    /* Console output */
    trace(t) {
        this.console || (this.console = []),
            this.console.push(t),
            this.console.length > LGraphNode.MAX_CONSOLE &&
                this.console.shift(),
            this.graph.onNodeTrace && this.graph.onNodeTrace(this, t);
    }
    /* Forces to redraw or the main canvas (LGraphNode) or the bg canvas (links) */
    setDirtyCanvas(t, r) {
        this.graph && this.graph.sendActionToCanvas("setDirty", [t, r]);
    }
    loadImage(t) {
        const r = new Image();
        (r.src = LiteGraph.node_images_path + t), (r.ready = !1);
        const n = this;
        return (
            (r.onload = function () {
                (this.ready = !0), n.setDirtyCanvas(!0);
            }),
            r
        );
    }
    //safe LGraphNode action execution (not sure if safe)
    /*
  executeAction (action)
  {
  if(action == "") return false;
  
  if( action.indexOf(";") != -1 || action.indexOf("}") != -1)
  {
      this.trace("Error: Action contains unsafe characters");
      return false;
  }
  
  const tokens = action.split("(");
  const func_name = tokens[0];
  if( typeof(this[func_name]) != "function")
  {
      this.trace("Error: Action not found on node: " + func_name);
      return false;
  }
  
  const code = action;
  
  try
  {
      const _foo = eval;
      eval = null;
      (new Function("with(this) { " + code + "}")).call(this);
      eval = _foo;
  }
  catch (err)
  {
      this.trace("Error executing action {" + action + "} :" + err);
      return false;
  }
  
  return true;
  }
  */
    /* Allows to get onMouseMove and onMouseUp events even if the mouse is out of focus */
    captureInput(t) {
        if (!this.graph || !this.graph.list_of_graphcanvas) return;
        const r = this.graph.list_of_graphcanvas;
        for (let n = 0; n < r.length; ++n) {
            const s = r[n];
            (!t && s.node_capturing_input != this) ||
                (s.node_capturing_input = t ? this : null);
        }
    }
    /**
     * Collapse the node to make it smaller on the canvas
     * @method collapse
     **/
    collapse(t) {
        this.graph._version++,
            !(this.constructor.collapsable === !1 && !t) &&
                (this.flags.collapsed
                    ? (this.flags.collapsed = !1)
                    : (this.flags.collapsed = !0),
                this.setDirtyCanvas(!0, !0));
    }
    /**
     * Forces the node to do not move or realign on Z
     * @method pin
     **/
    pin(t) {
        this.graph._version++,
            t === void 0
                ? (this.flags.pinned = !this.flags.pinned)
                : (this.flags.pinned = t);
    }
    localToScreen(t, r, n) {
        return [
            (t + this.pos[0]) * n.scale + n.offset[0],
            (r + this.pos[1]) * n.scale + n.offset[1],
        ];
    }
}
class LGraphGroup {
    constructor(t) {
        this._ctor(t);
    }
    _ctor(t) {
        (this.title = t || "Group"),
            (this.font_size = 24),
            (this.color = LGraphCanvas.node_colors.pale_blue
                ? LGraphCanvas.node_colors.pale_blue.groupcolor
                : "#AAA"),
            (this._bounding = new Float32Array([10, 10, 140, 80])),
            (this._pos = this._bounding.subarray(0, 2)),
            (this._size = this._bounding.subarray(2, 4)),
            (this._nodes = []),
            (this.graph = null),
            (this.id = LiteGraph.uuidv4()),
            (this.group_id = null),
            Object.defineProperty(this, "pos", {
                set: function (r) {
                    !r ||
                        r.length < 2 ||
                        ((this._pos[0] = Math.round(r[0])),
                        (this._pos[1] = Math.round(r[1])));
                },
                get: function () {
                    return this._pos;
                },
                enumerable: !0,
            }),
            Object.defineProperty(this, "size", {
                set: function (r) {
                    !r ||
                        r.length < 2 ||
                        ((this._size[0] = Math.max(140, Math.round(r[0]))),
                        (this._size[1] = Math.max(80, r[1])));
                },
                get: function () {
                    return this._size;
                },
                enumerable: !0,
            });
    }
    configure(t) {
        (this.title = t.title),
            this._bounding.set(t.bounding),
            (this.color = t.color),
            (this.font_size = t.font_size),
            (this.id = t.id),
            (this.group_id = t.group_id),
            (this.status = t.status);
    }
    serialize() {
        let t = this._bounding;
        return {
            title: this.title,
            bounding: [
                Math.round(t[0]),
                Math.round(t[1]),
                Math.round(t[2]),
                Math.round(t[3]),
            ],
            color: this.color,
            font_size: this.font_size,
            id: this.id,
            status: this.status,
            group_id: this.group_id,
        };
    }
    move(t, r, n) {
        if (((this._pos[0] += t), (this._pos[1] += r), !n))
            for (let s = 0; s < this._nodes.length; ++s) {
                let a = this._nodes[s];
                (a.pos[0] += t), (a.pos[1] += r);
            }
    }
    recomputeInsideNodes() {
        this._nodes.length = 0;
        let t = this.graph._nodes,
            r = new Float32Array(4);
        for (let n = 0; n < t.length; ++n) {
            let s = t[n];
            s.getBounding(r),
                LiteGraph.overlapBounding(this._bounding, r) &&
                    this._nodes.push(s);
        }
    }
    isPointInside(t, r, n, s) {
        n = n || 0;
        let a =
            this.graph && this.graph.isLive() ? 0 : LiteGraph.NODE_TITLE_HEIGHT;
        if ((s && (a = 0), this.flags && this.flags.collapsed)) {
            if (
                LiteGraph.isInsideRectangle(
                    t,
                    r,
                    this.pos[0] - n,
                    this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT - n,
                    (this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH) +
                        2 * n,
                    LiteGraph.NODE_TITLE_HEIGHT + 2 * n
                )
            )
                return !0;
        } else if (
            this.pos[0] - 4 - n < t &&
            this.pos[0] + this.size[0] + 4 + n > t &&
            this.pos[1] - a - n < r &&
            this.pos[1] + this.size[1] + n > r
        )
            return !0;
        return !1;
    }
    setDirtyCanvas(t, r) {
        this.graph && this.graph.sendActionToCanvas("setDirty", [t, r]);
    }
}
class DragAndScale {
    constructor(t, r) {
        (this.offset = new Float32Array([0, 0])),
            (this.scale = 1),
            (this.max_scale = 10),
            (this.min_scale = 0.1),
            (this.onredraw = null),
            (this.enabled = !0),
            (this.last_mouse = [0, 0]),
            (this.element = null),
            (this.visible_area = new Float32Array(4)),
            t && ((this.element = t), r || this.bindEvents(t));
    }
    bindEvents(t) {
        (this.last_mouse = new Float32Array(2)),
            (this._binded_mouse_callback = this.onMouse.bind(this)),
            LiteGraph.pointerListenerAdd(
                t,
                "down",
                this._binded_mouse_callback
            ),
            LiteGraph.pointerListenerAdd(
                t,
                "move",
                this._binded_mouse_callback
            ),
            LiteGraph.pointerListenerAdd(t, "up", this._binded_mouse_callback),
            t.addEventListener("mousewheel", this._binded_mouse_callback, !1),
            t.addEventListener("wheel", this._binded_mouse_callback, !1);
    }
    computeVisibleArea(t) {
        if (!this.element) {
            this.visible_area[0] =
                this.visible_area[1] =
                this.visible_area[2] =
                this.visible_area[3] =
                    0;
            return;
        }
        let r = this.element.width,
            n = this.element.height,
            s = -this.offset[0],
            a = -this.offset[1];
        t &&
            ((s += t[0] / this.scale),
            (a += t[1] / this.scale),
            (r = t[2]),
            (n = t[3]));
        const o = s + r / this.scale,
            l = a + n / this.scale;
        (this.visible_area[0] = s),
            (this.visible_area[1] = a),
            (this.visible_area[2] = o - s),
            (this.visible_area[3] = l - a);
    }
    onMouse(t) {
        if (!this.enabled) return;
        const r = this.element,
            n = r.getBoundingClientRect(),
            s = t.clientX - n.left,
            a = t.clientY - n.top;
        (t.canvasx = s), (t.canvasy = a), (t.dragging = this.dragging);
        const o =
            !this.viewport ||
            (this.viewport &&
                s >= this.viewport[0] &&
                s < this.viewport[0] + this.viewport[2] &&
                a >= this.viewport[1] &&
                a < this.viewport[1] + this.viewport[3]);
        let l = !1;
        if (
            (this.onmouse && (l = this.onmouse(t)),
            t.type == LiteGraph.pointerevents_method + "down" && o)
        )
            (this.dragging = !0),
                LiteGraph.pointerListenerRemove(
                    r,
                    "move",
                    this._binded_mouse_callback
                ),
                LiteGraph.pointerListenerAdd(
                    document,
                    "move",
                    this._binded_mouse_callback
                ),
                LiteGraph.pointerListenerAdd(
                    document,
                    "up",
                    this._binded_mouse_callback
                );
        else if (t.type == LiteGraph.pointerevents_method + "move") {
            if (!l) {
                const c = s - this.last_mouse[0],
                    u = a - this.last_mouse[1];
                this.dragging && this.mouseDrag(c, u);
            }
        } else
            t.type == LiteGraph.pointerevents_method + "up"
                ? ((this.dragging = !1),
                  LiteGraph.pointerListenerRemove(
                      document,
                      "move",
                      this._binded_mouse_callback
                  ),
                  LiteGraph.pointerListenerRemove(
                      document,
                      "up",
                      this._binded_mouse_callback
                  ),
                  LiteGraph.pointerListenerAdd(
                      r,
                      "move",
                      this._binded_mouse_callback
                  ))
                : o &&
                  (t.type == "mousewheel" ||
                      t.type == "wheel" ||
                      t.type == "DOMMouseScroll") &&
                  ((t.eventType = "mousewheel"),
                  t.type == "wheel"
                      ? (t.wheel = -t.deltaY)
                      : (t.wheel =
                            t.wheelDeltaY != null
                                ? t.wheelDeltaY
                                : t.detail * -60),
                  (t.delta = t.wheelDelta
                      ? t.wheelDelta / 40
                      : t.deltaY
                      ? -t.deltaY / 3
                      : 0),
                  this.changeDeltaScale(1 + t.delta * 0.05));
        if (((this.last_mouse[0] = s), (this.last_mouse[1] = a), o))
            return t.preventDefault(), t.stopPropagation(), !1;
    }
    toCanvasContext(t) {
        t.scale(this.scale, this.scale),
            t.translate(this.offset[0], this.offset[1]);
    }
    convertOffsetToCanvas(t) {
        return [
            (t[0] + this.offset[0]) * this.scale,
            (t[1] + this.offset[1]) * this.scale,
        ];
    }
    convertCanvasToOffset(t, r) {
        return (
            (r = r || [0, 0]),
            (r[0] = t[0] / this.scale - this.offset[0]),
            (r[1] = t[1] / this.scale - this.offset[1]),
            r
        );
    }
    mouseDrag(t, r) {
        (this.offset[0] += t / this.scale),
            (this.offset[1] += r / this.scale),
            this.onredraw && this.onredraw(this);
    }
    changeScale(t, r) {
        if (
            (t < this.min_scale
                ? (t = this.min_scale)
                : t > this.max_scale && (t = this.max_scale),
            t == this.scale || !this.element)
        )
            return;
        const n = this.element.getBoundingClientRect();
        if (!n) return;
        r = r || [n.width * 0.5, n.height * 0.5];
        const s = this.convertCanvasToOffset(r);
        (this.scale = t), Math.abs(this.scale - 1) < 0.01 && (this.scale = 1);
        const a = this.convertCanvasToOffset(r),
            o = [a[0] - s[0], a[1] - s[1]];
        (this.offset[0] += o[0]),
            (this.offset[1] += o[1]),
            this.onredraw && this.onredraw(this);
    }
    changeDeltaScale(t, r) {
        this.changeScale(this.scale * t, r);
    }
    reset() {
        (this.scale = 1), (this.offset[0] = 0), (this.offset[1] = 0);
    }
}
const _LGraphCanvas = class _LGraphCanvas {
    constructor(e, t, r) {
        // 변경이 생겼을때 스택에 추가
        k(this, "saveUndoStack", async function () {
            var r, n;
            const e = this.graph.serialize(),
                t = this.tempDeepClone(e);
            (((r = this.undoStack) == null ? void 0 : r.length) === 0 ||
                (((n = this.undoStack) == null ? void 0 : n.length) > 0 &&
                    !this.checkObjectEqual(
                        t,
                        this.undoStack[this.undoStack.length - 1]
                    ))) &&
                this.undoStack.push(t),
                this.undoStack.length > this.maxStackSize &&
                    this.undoStack.shift(),
                (this.redoStack.length = 0);
        });
        (this.graph = t),
            (this.options = r = r || {}),
            (this.ALWAYS_FLOW = !1),
            (this.isKeyPressed = !1),
            (this._menus = []),
            (this.maxStackSize = r.maxStackSize || 1e3),
            (this.undoStack = []),
            (this.redoStack = []),
            (this.saveUndoStackEvt = this.debounceTime(
                this.saveUndoStack.bind(this),
                50
            )),
            (this.background_image = _LGraphCanvas.DEFAULT_BACKGROUND_IMAGE),
            e && e.constructor === String && (e = document.querySelector(e)),
            (this.ds = new DragAndScale()),
            (this.zoom_modify_alpha = !0),
            (this.title_text_font = "" + LiteGraph.NODE_TEXT_SIZE + "px Arial"),
            (this.inner_text_font =
                "normal " + LiteGraph.NODE_SUBTEXT_SIZE + "px Arial"),
            (this.node_title_color = LiteGraph.NODE_TITLE_COLOR),
            (this.default_link_color = LiteGraph.LINK_COLOR),
            (this.default_connection_color = {
                input_off: "#778",
                input_on: "#7F7",
                //"#BBD"
                output_off: "#778",
                output_on: "#7F7",
                //"#BBD"
            }),
            (this.default_connection_color_byType = {
                /*number: "#7F7",
            string: "#77F",
            boolean: "#F77",*/
            }),
            (this.default_connection_color_byTypeOff = {
                /*number: "#474",
            string: "#447",
            boolean: "#744",*/
            }),
            (this.highquality_render = !0),
            (this.use_gradients = !1),
            (this.editor_alpha = 1),
            (this.pause_rendering = !1),
            (this.clear_background = !0),
            (this.clear_background_color = "#222"),
            (this.read_only = !1),
            (this.render_only_selected = !0),
            (this.live_mode = !1),
            (this.show_info = !0),
            (this.allow_dragcanvas = !0),
            (this.allow_dragnodes = !0),
            (this.allow_interaction = !0),
            (this.multi_select = !1),
            (this.allow_searchbox = !0),
            (this.allow_reconnect_links = !0),
            (this.align_to_grid = !1),
            (this.drag_mode = !1),
            (this.dragging_rectangle = null),
            (this.filter = null),
            (this.set_canvas_dirty_on_mouse_event = !0),
            (this.always_render_background = !1),
            (this.render_shadows = !0),
            (this.render_canvas_border = !0),
            (this.render_connections_shadows = !1),
            (this.render_connections_border = !0),
            (this.render_curved_connections = !1),
            (this.render_connection_arrows = !1),
            (this.render_collapsed_slots = !0),
            (this.render_execution_order = !1),
            (this.render_title_colored = !0),
            (this.render_link_tooltip = !0),
            (this.links_render_mode = LiteGraph.SPLINE_LINK),
            (this.mouse = [0, 0]),
            (this.graph_mouse = [0, 0]),
            (this.canvas_mouse = this.graph_mouse),
            (this.onSearchBox = null),
            (this.onSearchBoxSelection = null),
            (this.onMouse = null),
            (this.onDrawBackground = null),
            (this.onDrawForeground = null),
            (this.onDrawOverlay = null),
            (this.onDrawLinkTooltip = null),
            (this.onNodeMoved = null),
            (this.onSelectionChange = null),
            (this.onConnectingChange = null),
            (this.onBeforeChange = null),
            (this.onAfterChange = null),
            (this.connections_width = 3),
            (this.round_radius = 8),
            (this.current_node = null),
            (this.node_widget = null),
            (this.over_link_center = null),
            (this.last_mouse_position = [0, 0]),
            (this.visible_area = this.ds.visible_area),
            (this.visible_links = []),
            (this.viewport = r.viewport || null),
            t && t.attachCanvas(this),
            this.clear(),
            (this.autoresize = r.autoresize),
            (this.fps = 0);
    }
    async _init(e) {
        await this.setCanvas(e, this.options.skip_events),
            this.clear(),
            this.options.skip_render || this.startRendering();
    }
    /**
     * clears all the data inside
     *
     * @method clear
     */
    clear() {
        (this.frame = 0),
            (this.last_draw_time = 0),
            (this.render_time = 0),
            (this.fps = 0),
            (this.dragging_rectangle = null),
            (this.selected_nodes = {}),
            (this.selected_group = null),
            (this.visible_nodes = []),
            (this.node_dragged = null),
            (this.node_over = null),
            (this.node_capturing_input = null),
            (this.connecting_node = null),
            (this.highlighted_links = {}),
            (this.dragging_canvas = !1),
            (this.dirty_canvas = !0),
            (this.dirty_bgcanvas = !0),
            (this.dirty_area = null),
            (this.node_in_panel = null),
            (this.node_widget = null),
            (this.last_mouse = [0, 0]),
            (this.last_mouseclick = 0),
            (this.pointer_is_down = !1),
            (this.pointer_is_double = !1),
            this.visible_area.set([0, 0, 0, 0]),
            this.onClear && this.onClear();
    }
    /**
     * assigns a graph, you can reassign graphs to the same canvas
     *
     * @method setGraph
     * @param {LGraph} graph
     */
    setGraph(e, t) {
        if (this.graph != e) {
            if ((t || this.clear(), !e && this.graph)) {
                this.graph.detachCanvas(this);
                return;
            }
            e.attachCanvas(this),
                this._graph_stack && (this._graph_stack = null),
                this.setDirty(!0, !0);
        }
    }
    /**
     * returns the top level graph (in case there are subgraphs open on the canvas)
     *
     * @method getTopGraph
     * @return {LGraph} graph
     */
    getTopGraph() {
        return this._graph_stack.length ? this._graph_stack[0] : this.graph;
    }
    /**
     * opens a graph contained inside a node in the current graph
     *
     * @method openSubgraph
     * @param {LGraph} graph
     */
    openSubgraph(e) {
        if (!e) throw "graph cannot be null";
        if (this.graph == e) throw "graph cannot be the same";
        this.clear(),
            this.graph &&
                (this._graph_stack || (this._graph_stack = []),
                this._graph_stack.push(this.graph)),
            e.attachCanvas(this),
            this.checkPanels(),
            this.setDirty(!0, !0);
    }
    /**
     * closes a subgraph contained inside a node
     *
     * @method closeSubgraph
     * @param {LGraph} assigns a graph
     */
    closeSubgraph() {
        if (!this._graph_stack || this._graph_stack.length == 0) return;
        const e = this.graph._subgraph_node,
            t = this._graph_stack.pop();
        (this.selected_nodes = {}),
            (this.highlighted_links = {}),
            t.attachCanvas(this),
            this.setDirty(!0, !0),
            e && (this.centerOnNode(e), this.selectNodes([e])),
            (this.ds.offset = [0, 0]),
            (this.ds.scale = 1);
    }
    /**
     * returns the visually active graph (in case there are more in the stack)
     * @method getCurrentGraph
     * @return {LGraph} the active graph
     */
    getCurrentGraph() {
        return this.graph;
    }
    /**
     * assigns a canvas
     *
     * @method setCanvas
     * @param {Canvas} assigns a canvas (also accepts the ID of the element (not a selector)
     */
    async setCanvas(e, t) {
        if (
            e &&
            e.constructor === String &&
            ((e = document.getElementById(e)), !e)
        )
            throw "Error creating LiteGraph canvas: Canvas not found";
        if (e === this.canvas) return;
        !e && this.canvas && (t || this.unbindEvents());
        const r = e.parentElement,
            { width: n, height: s } = r.getBoundingClientRect();
        if (
            ((e.width = n),
            (e.height = s),
            (this.canvas = e),
            (this.ds.element = e),
            !!e)
        ) {
            if (
                ((e.className += " lgraphcanvas"),
                (e.data = this),
                (e.tabindex = "1"),
                (this.bgcanvas = null),
                this.bgcanvas ||
                    ((this.bgcanvas = document.createElement("canvas")),
                    (this.bgcanvas.width = this.canvas.width),
                    (this.bgcanvas.height = this.canvas.height)),
                e.getContext == null)
            )
                throw e.localName != "canvas"
                    ? "Element supplied for LGraphCanvas must be a <canvas> element, you passed a " +
                          e.localName
                    : "This browser doesn't support Canvas";
            this.options.useWebgl
                ? await this.enableWebGL()
                : (this.ctx = e.getContext("2d")) == null &&
                  (e.webgl_enabled ||
                      console.warn(
                          "This canvas seems to be WebGL, enabling WebGL renderer"
                      ),
                  await this.enableWebGL()),
                t || this.bindEvents(),
                this.draw(!0, !0);
        }
    }
    //used in some events to capture them
    _doNothing(e) {
        return e.preventDefault(), !1;
    }
    _doReturnTrue(e) {
        return e.preventDefault(), !0;
    }
    /**
     * binds mouse, keyboard, touch and drag events to the canvas
     * @method bindEvents
     **/
    bindEvents() {
        if (this._events_binded) {
            console.warn("LGraphCanvas: events already binded");
            return;
        }
        const e = this.canvas,
            r = this.getCanvasWindow().document;
        (this._mousedown_callback = this.processMouseDown.bind(this)),
            (this._mousewheel_callback = this.processMouseWheel.bind(this)),
            (this._mousemove_callback = this.processMouseMove.bind(this)),
            (this._mouseup_callback = this.processMouseUp.bind(this)),
            LiteGraph.pointerListenerAdd(
                e,
                "down",
                this._mousedown_callback,
                !0
            ),
            e.addEventListener("mousewheel", this._mousewheel_callback, !1),
            LiteGraph.pointerListenerAdd(e, "up", this._mouseup_callback, !0),
            LiteGraph.pointerListenerAdd(e, "move", this._mousemove_callback),
            e.addEventListener("contextmenu", this._doNothing),
            e.addEventListener("DOMMouseScroll", this._mousewheel_callback, !1),
            (this._key_callback = this.processKey.bind(this)),
            e.setAttribute("tabindex", 1),
            e.addEventListener("keydown", this._key_callback, !0),
            r.addEventListener("keyup", this._key_callback, !0),
            (this._ondrop_callback = this.processDrop.bind(this)),
            e.addEventListener("dragover", this._doNothing, !1),
            e.addEventListener("dragend", this._doNothing, !1),
            e.addEventListener("drop", this._ondrop_callback, !1),
            e.addEventListener("dragenter", this._doReturnTrue, !1),
            (this._events_binded = !0);
    }
    /**
     * unbinds mouse events from the canvas
     * @method unbindEvents
     **/
    unbindEvents() {
        if (!this._events_binded) {
            console.warn("LGraphCanvas: no events binded");
            return;
        }
        const t = this.getCanvasWindow().document;
        LiteGraph.pointerListenerRemove(
            this.canvas,
            "move",
            this._mousedown_callback
        ),
            LiteGraph.pointerListenerRemove(
                this.canvas,
                "up",
                this._mousedown_callback
            ),
            LiteGraph.pointerListenerRemove(
                this.canvas,
                "down",
                this._mousedown_callback
            ),
            this.canvas.removeEventListener(
                "mousewheel",
                this._mousewheel_callback
            ),
            this.canvas.removeEventListener(
                "DOMMouseScroll",
                this._mousewheel_callback
            ),
            this.canvas.removeEventListener("keydown", this._key_callback),
            t.removeEventListener("keyup", this._key_callback),
            this.canvas.removeEventListener("contextmenu", this._doNothing),
            this.canvas.removeEventListener("drop", this._ondrop_callback),
            this.canvas.removeEventListener("dragenter", this._doReturnTrue),
            (this._mousedown_callback = null),
            (this._mousewheel_callback = null),
            (this._key_callback = null),
            (this._ondrop_callback = null),
            (this._events_binded = !1);
    }
    static getFileExtension(e) {
        const t = e.indexOf("?");
        t != -1 && (e = e.substr(0, t));
        const r = e.lastIndexOf(".");
        return r == -1 ? "" : e.substr(r + 1).toLowerCase();
    }
    /**
     * this function allows to render the canvas using WebGL instead of Canvas2D
     * this is useful if you plant to render 3D objects inside your nodes, it uses litegl.js for webgl and canvas2DtoWebGL to emulate the Canvas2D calls in webGL
     * @method enableWebGL
     **/
    async enableWebGL() {
        var t;
        if (typeof GL > "u")
            throw "litegl.js must be included to use a WebGL canvas";
        if (typeof enableWebGLCanvas > "u")
            throw "webglCanvas.js must be included to use this feature";
        const e = enableWebGLCanvas(this.canvas);
        e instanceof WebGLRenderingContext &&
            (await e.loadCachedTextures(),
            e.cacheFontAtlas("Arial", "normal"),
            e.cacheFontAtlas("Arial", "Bold")),
            (this.gl = e),
            (this.ctx = e),
            (this.bgctx = e),
            (t = this.gl) == null ||
                t.viewport(0, 0, this.canvas.width, this.canvas.height),
            (this.ctx.webgl = !0),
            (this.bgcanvas = this.canvas),
            (this.canvas.webgl_enabled = !0);
    }
    /**
     * marks as dirty the canvas, this way it will be rendered again
     *
     * @class LGraphCanvas
     * @method setDirty
     * @param {bool} fgcanvas if the foreground canvas is dirty (the one containing the nodes)
     * @param {bool} bgcanvas if the background canvas is dirty (the one containing the wires)
     */
    setDirty(e, t) {
        e && (this.dirty_canvas = !0), t && (this.dirty_bgcanvas = !0);
    }
    /**
     * Used to attach the canvas in a popup
     *
     * @method getCanvasWindow
     * @return {window} returns the window where the canvas is attached (the DOM root node)
     */
    getCanvasWindow() {
        if (!this.canvas) return window;
        const e = this.canvas.ownerDocument;
        return e.defaultView || e.parentWindow;
    }
    /**
     * starts rendering the content of the canvas when needed
     *
     * @method startRendering
     */
    startRendering() {
        if (this.is_rendering) return;
        (this.is_rendering = !0), e.call(this);
        function e() {
            this.pause_rendering || this.draw();
            const t = this.getCanvasWindow();
            this.is_rendering && t.requestAnimationFrame(e.bind(this));
        }
    }
    /**
     * stops rendering the content of the canvas (to save resources)
     *
     * @method stopRendering
     */
    stopRendering() {
        this.is_rendering = !1;
    }
    /* LiteGraphCanvas input */
    //used to block future mouse events (because of im gui)
    blockClick() {
        (this.block_click = !0), (this.last_mouseclick = 0);
    }
    processMouseDown(e) {
        let t = !1;
        if (
            ((this.block_drag_grp = !1),
            this.set_canvas_dirty_on_mouse_event && (this.dirty_canvas = !0),
            !this.graph)
        )
            return;
        this.adjustMouseEvent(e);
        const r = this.getCanvasWindow();
        r.document, (_LGraphCanvas.active_canvas = this);
        const n = e.clientX,
            s = e.clientY;
        this.ds.viewport = this.viewport;
        const a =
            !this.viewport ||
            (this.viewport &&
                n >= this.viewport[0] &&
                n < this.viewport[0] + this.viewport[2] &&
                s >= this.viewport[1] &&
                s < this.viewport[1] + this.viewport[3]);
        if (
            (this.options.skip_events ||
                (LiteGraph.pointerListenerRemove(
                    this.canvas,
                    "move",
                    this._mousemove_callback
                ),
                LiteGraph.pointerListenerAdd(
                    r.document,
                    "move",
                    this._mousemove_callback,
                    !0
                ),
                LiteGraph.pointerListenerAdd(
                    r.document,
                    "up",
                    this._mouseup_callback,
                    !0
                )),
            !a)
        )
            return;
        let o = this.graph.getNodeOnPos(
                e.canvasX,
                e.canvasY,
                this.visible_nodes,
                5
            ),
            l = !1;
        const c = LiteGraph.getTime(),
            u = e.isPrimary === void 0 || !e.isPrimary,
            h = c - this.last_mouseclick < 300 && u;
        if (
            ((this.mouse[0] = e.clientX),
            (this.mouse[1] = e.clientY),
            (this.graph_mouse[0] = e.canvasX),
            (this.graph_mouse[1] = e.canvasY),
            (this.last_click_position = [this.mouse[0], this.mouse[1]]),
            this.pointer_is_down && u
                ? (this.pointer_is_double = !0)
                : (this.pointer_is_double = !1),
            (this.pointer_is_down = !0),
            this.canvas.focus(),
            LiteGraph.closeAllContextMenus(r),
            !(this.onMouse && this.onMouse(e) == !0))
        ) {
            if (
                (o || this.closePanels(),
                e.which == 1 && !this.pointer_is_double)
            ) {
                if (
                    (this.saveUndoStack(),
                    e.ctrlKey &&
                        ((this.dragging_rectangle = new Float32Array(4)),
                        (this.dragging_rectangle[0] = e.canvasX),
                        (this.dragging_rectangle[1] = e.canvasY),
                        (this.dragging_rectangle[2] = 1),
                        (this.dragging_rectangle[3] = 1),
                        (l = !0)),
                    LiteGraph.alt_drag_do_clone_nodes &&
                        e.altKey &&
                        o &&
                        this.allow_interaction &&
                        !l &&
                        !this.read_only)
                ) {
                    let d = o.clone();
                    (d = o.clone()) &&
                        ((d.pos[0] += 5),
                        (d.pos[1] += 5),
                        this.graph.add(d, !1, { doCalcSize: !1 }),
                        (o = d),
                        (l = !0),
                        t ||
                            (this.allow_dragnodes &&
                                (this.graph.beforeChange(),
                                (this.node_dragged = o)),
                            this.selected_nodes[o.id] ||
                                this.processNodeSelected(o, e)));
                }
                let f = !1;
                if (
                    o &&
                    (this.allow_interaction || o.flags.allow_interaction) &&
                    !l &&
                    !this.read_only
                ) {
                    if (
                        (!this.live_mode &&
                            !o.flags.pinned &&
                            this.bringToFront(o),
                        this.allow_interaction &&
                            !this.connecting_node &&
                            !o.flags.collapsed &&
                            !this.live_mode)
                    )
                        if (
                            !l &&
                            o.resizable !== !1 &&
                            LiteGraph.isInsideRectangle(
                                e.canvasX,
                                e.canvasY,
                                o.pos[0] + o.size[0] - 5,
                                o.pos[1] + o.size[1] - 5,
                                10,
                                10
                            )
                        )
                            this.graph.beforeChange(),
                                (this.resizing_node = o),
                                (this.canvas.style.cursor = "se-resize"),
                                (l = !0);
                        else {
                            if (o.outputs)
                                for (
                                    let d = 0, p = o.outputs.length;
                                    d < p;
                                    ++d
                                ) {
                                    const _ = o.outputs[d],
                                        E = o.getConnectionPos(!1, d);
                                    if (
                                        LiteGraph.isInsideRectangle(
                                            e.canvasX,
                                            e.canvasY,
                                            E[0] - 15,
                                            E[1] - 10,
                                            30,
                                            20
                                        )
                                    ) {
                                        (this.connecting_node = o),
                                            (this.connecting_output = _),
                                            (this.connecting_output.slot_index =
                                                d),
                                            (this.connecting_pos =
                                                o.getConnectionPos(!1, d)),
                                            (this.connecting_slot = d),
                                            LiteGraph.shift_click_do_break_link_from &&
                                                e.shiftKey &&
                                                o.disconnectOutput(d),
                                            h
                                                ? o.onOutputDblClick &&
                                                  o.onOutputDblClick(d, e)
                                                : o.onOutputClick &&
                                                  o.onOutputClick(d, e),
                                            (l = !0);
                                        break;
                                    }
                                }
                            if (o.inputs)
                                for (
                                    let d = 0, p = o.inputs.length;
                                    d < p;
                                    ++d
                                ) {
                                    const _ = o.inputs[d],
                                        E = o.getConnectionPos(!0, d);
                                    if (
                                        LiteGraph.isInsideRectangle(
                                            e.canvasX,
                                            e.canvasY,
                                            E[0] - 15,
                                            E[1] - 10,
                                            30,
                                            20
                                        )
                                    ) {
                                        if (
                                            (h
                                                ? o.onInputDblClick &&
                                                  o.onInputDblClick(d, e)
                                                : o.onInputClick &&
                                                  o.onInputClick(d, e),
                                            _.link !== null)
                                        ) {
                                            const m = this.graph.links[_.link];
                                            LiteGraph.click_do_break_link_to &&
                                                (o.disconnectInput(d),
                                                (this.dirty_bgcanvas = !0),
                                                (l = !0)),
                                                (this.allow_reconnect_links || //this.move_destination_link_without_shift ||
                                                    e.shiftKey) &&
                                                    (LiteGraph.click_do_break_link_to ||
                                                        o.disconnectInput(d),
                                                    (this.connecting_node =
                                                        this.graph._nodes_by_id[
                                                            m.origin_id
                                                        ]),
                                                    (this.connecting_slot =
                                                        m.origin_slot),
                                                    (this.connecting_output =
                                                        this.connecting_node.outputs[
                                                            this.connecting_slot
                                                        ]),
                                                    (this.connecting_pos =
                                                        this.connecting_node.getConnectionPos(
                                                            !1,
                                                            this.connecting_slot
                                                        )),
                                                    (this.dirty_bgcanvas = !0),
                                                    (l = !0));
                                        }
                                        l ||
                                            ((this.connecting_node = o),
                                            (this.connecting_input = _),
                                            (this.connecting_input.slot_index =
                                                d),
                                            (this.connecting_pos =
                                                o.getConnectionPos(!0, d)),
                                            (this.connecting_slot = d),
                                            (this.dirty_bgcanvas = !0),
                                            (l = !0));
                                    }
                                }
                        }
                    if (!l) {
                        const d = [e.canvasX - o.pos[0], e.canvasY - o.pos[1]],
                            p = this.processNodeWidgets(o, this.graph_mouse, e);
                        if (
                            (p && ((t = !0), (this.node_widget = [o, p])),
                            this.allow_interaction &&
                                h &&
                                this.selected_nodes[o.id] &&
                                (o.onDblClick && o.onDblClick(e, d, this),
                                this.processNodeDblClicked(o),
                                (t = !0)),
                            o.onMouseDown && o.onMouseDown(e, d, this))
                        )
                            t = !0;
                        else {
                            if (
                                o.subgraph &&
                                !o.skip_subgraph_button &&
                                !o.flags.collapsed &&
                                d[0] >
                                    o.size[0] - LiteGraph.NODE_TITLE_HEIGHT &&
                                d[1] < 0
                            ) {
                                const _ = this;
                                setTimeout(function () {
                                    _.openSubgraph(o.subgraph);
                                }, 10);
                            }
                            this.live_mode && ((f = !0), (t = !0));
                        }
                        t
                            ? o.is_selected || this.processNodeSelected(o, e)
                            : (this.allow_dragnodes &&
                                  (this.graph.beforeChange(),
                                  (this.node_dragged = o)),
                              this.processNodeSelected(o, e)),
                            (this.dirty_canvas = !0);
                    }
                } else if (!l) {
                    if (!this.read_only)
                        for (let d = 0; d < this.visible_links.length; ++d) {
                            const p = this.visible_links[d],
                                _ = p._pos;
                            if (
                                !(
                                    !_ ||
                                    e.canvasX < _[0] - 4 ||
                                    e.canvasX > _[0] + 4 ||
                                    e.canvasY < _[1] - 4 ||
                                    e.canvasY > _[1] + 4
                                )
                            ) {
                                this.showLinkMenu(p, e),
                                    (this.over_link_center = null);
                                break;
                            }
                        }
                    (this.selected_group = this.graph.getGroupOnPos(
                        e.canvasX,
                        e.canvasY
                    )),
                        (this.selected_group_resizing = !1),
                        this.selected_group &&
                            !this.read_only &&
                            h &&
                            (e.preventDefault(),
                            e.stopPropagation(),
                            this.showGrpPanel(this.selected_group),
                            (this.block_drag_grp = !0)),
                        this.selected_group &&
                            !this.read_only &&
                            !h &&
                            ((this.block_drag_grp = !1),
                            e.ctrlKey && (this.dragging_rectangle = null),
                            LiteGraph.distance(
                                [e.canvasX, e.canvasY],
                                [
                                    this.selected_group.pos[0] +
                                        this.selected_group.size[0],
                                    this.selected_group.pos[1] +
                                        this.selected_group.size[1],
                                ]
                            ) *
                                this.ds.scale <
                            10
                                ? (this.selected_group_resizing = !0)
                                : this.selected_group.recomputeInsideNodes()),
                        (f = !0);
                }
                !l && f && this.allow_dragcanvas && (this.dragging_canvas = !0);
            } else if (e.which == 2)
                if (
                    (this.saveUndoStack(),
                    LiteGraph.middle_click_slot_add_default_node)
                ) {
                    if (
                        o &&
                        this.allow_interaction &&
                        !l &&
                        !this.read_only &&
                        !this.connecting_node &&
                        !o.flags.collapsed &&
                        !this.live_mode
                    ) {
                        let f = !1,
                            d = !1,
                            p = !1;
                        if (o.outputs)
                            for (let _ = 0, E = o.outputs.length; _ < E; ++_) {
                                const m = o.outputs[_],
                                    b = o.getConnectionPos(!1, _);
                                if (
                                    LiteGraph.isInsideRectangle(
                                        e.canvasX,
                                        e.canvasY,
                                        b[0] - 15,
                                        b[1] - 10,
                                        30,
                                        20
                                    )
                                ) {
                                    (f = m), (d = _), (p = !0);
                                    break;
                                }
                            }
                        if (o.inputs)
                            for (let _ = 0, E = o.inputs.length; _ < E; ++_) {
                                const m = o.inputs[_],
                                    b = o.getConnectionPos(!0, _);
                                if (
                                    LiteGraph.isInsideRectangle(
                                        e.canvasX,
                                        e.canvasY,
                                        b[0] - 15,
                                        b[1] - 10,
                                        30,
                                        20
                                    )
                                ) {
                                    (f = m), (d = _), (p = !1);
                                    break;
                                }
                            }
                        if (f && d !== !1) {
                            const _ =
                                    0.5 -
                                    (d + 1) /
                                        (p
                                            ? o.outputs.length
                                            : o.inputs.length),
                                E = o.getBounding(),
                                m = [
                                    p ? E[0] + E[2] : E[0],
                                    // + node_bounding[0]/this.canvas.width*150
                                    e.canvasY - 80,
                                    // + node_bounding[0]/this.canvas.width*66 // vertical "derive"
                                ];
                            this.createDefaultNodeForSlot({
                                nodeFrom: p ? o : null,
                                slotFrom: p ? d : null,
                                nodeTo: p ? null : o,
                                slotTo: p ? null : d,
                                position: m,
                                //,e: e
                                nodeType: "AUTO",
                                //nodeNewType
                                posAdd: [p ? 30 : -30, -_ * 130],
                                //-alphaPosY*30]
                                posSizeFix: [p ? 0 : -1, 0],
                                //-alphaPosY*2*/
                            });
                        }
                    }
                } else
                    !l && this.allow_dragcanvas && (this.dragging_canvas = !0);
            else
                (e.which == 3 || this.pointer_is_double) &&
                    (this.saveUndoStack(),
                    this.allow_interaction &&
                        !l &&
                        !this.read_only &&
                        (o &&
                            (Object.keys(this.selected_nodes).length &&
                            (this.selected_nodes[o.id] ||
                                e.shiftKey ||
                                e.ctrlKey ||
                                e.metaKey)
                                ? this.selected_nodes[o.id] ||
                                  this.selectNodes([o], !0)
                                : this.selectNodes([o])),
                        this.processContextMenu(o, e)));
            return (
                (this.last_mouse[0] = e.clientX),
                (this.last_mouse[1] = e.clientY),
                (this.last_mouseclick = LiteGraph.getTime()),
                (this.last_mouse_dragging = !0),
                this.graph.change(),
                (!r.document.activeElement ||
                    (r.document.activeElement.nodeName.toLowerCase() !=
                        "input" &&
                        r.document.activeElement.nodeName.toLowerCase() !=
                            "textarea")) &&
                    e.preventDefault(),
                e.stopPropagation(),
                this.onMouseDown && this.onMouseDown(e),
                !1
            );
        }
    }
    // 그룹 수정 -> 하위 한글로 변경
    getGroupMenuOptions(e) {
        return [
            { content: "제목", callback: this.onShowPropertyEditor },
            {
                content: "그룹 위치",
                property: "그룹 위치",
                type: "Number",
                callback: this.onGrpPositionEditor,
            },
            {
                content: "그룹 사이즈",
                property: "그룹 사이즈",
                type: "Number",
                callback: this.onGrpSizeEditor,
            },
            {
                content: "그룹 색",
                has_submenu: !0,
                callback: _LGraphCanvas.onMenuNodeColors,
            },
            {
                content: "폰트 사이즈",
                property: "font_size",
                type: "Number",
                callback: this.onShowPropertyEditor,
            },
            {
                content: "앞으로",
                property: "font_size",
                type: "Number",
                callback: this.bringGroupToFront.bind(this, e),
            },
            {
                content: "뒤로",
                property: "font_size",
                type: "Number",
                callback: this.sendGroupToBack.bind(this, e),
            },
            null,
            {
                content: "그룹 삭제",
                callback: _LGraphCanvas.onMenuNodeRemove,
            },
        ];
    }
    /**
     * Called when a mouse move event has to be processed
     * @method processMouseMove
     **/
    processMouseMove(e) {
        if (
            (this.autoresize && this.resize(),
            this.set_canvas_dirty_on_mouse_event && (this.dirty_canvas = !0),
            !this.graph)
        )
            return;
        (_LGraphCanvas.active_canvas = this), this.adjustMouseEvent(e);
        const t = [e.clientX, e.clientY];
        (this.mouse[0] = t[0]), (this.mouse[1] = t[1]);
        const r = [t[0] - this.last_mouse[0], t[1] - this.last_mouse[1]];
        if (
            ((this.last_mouse = t),
            (this.graph_mouse[0] = e.canvasX),
            (this.graph_mouse[1] = e.canvasY),
            this.block_click)
        )
            return e.preventDefault(), !1;
        (e.dragging = this.last_mouse_dragging),
            this.node_widget &&
                (this.processNodeWidgets(
                    this.node_widget[0],
                    this.graph_mouse,
                    e,
                    this.node_widget[1]
                ),
                (this.dirty_canvas = !0));
        const n = this.graph.getNodeOnPos(
            e.canvasX,
            e.canvasY,
            this.visible_nodes
        );
        if (this.dragging_rectangle)
            (this.dragging_rectangle[2] =
                e.canvasX - this.dragging_rectangle[0]),
                (this.dragging_rectangle[3] =
                    e.canvasY - this.dragging_rectangle[1]),
                (this.dirty_canvas = !0);
        else if (this.selected_group && !this.read_only) {
            if (this.selected_group_resizing)
                this.selected_group.size = [
                    e.canvasX - this.selected_group.pos[0],
                    e.canvasY - this.selected_group.pos[1],
                ];
            else {
                const s = r[0] / this.ds.scale,
                    a = r[1] / this.ds.scale;
                this.selected_group.move(s, a, e.ctrlKey),
                    this.selected_group._nodes.length &&
                        (this.dirty_canvas = !0);
            }
            this.dirty_bgcanvas = !0;
        } else if (this.dragging_canvas)
            (this.ds.offset[0] += r[0] / this.ds.scale),
                (this.ds.offset[1] += r[1] / this.ds.scale),
                (this.dirty_canvas = !0),
                (this.dirty_bgcanvas = !0);
        else if (
            (this.allow_interaction || (n && n.flags.allow_interaction)) &&
            !this.read_only
        ) {
            this.connecting_node && (this.dirty_canvas = !0);
            for (let s = 0, a = this.graph._nodes.length; s < a; ++s)
                this.graph._nodes[s].mouseOver &&
                    n != this.graph._nodes[s] &&
                    ((this.graph._nodes[s].mouseOver = !1),
                    this.node_over &&
                        this.node_over.onMouseLeave &&
                        this.node_over.onMouseLeave(e),
                    (this.node_over = null),
                    (this.dirty_canvas = !0));
            if (n) {
                if (
                    (n.redraw_on_mouse && (this.dirty_canvas = !0),
                    n.mouseOver ||
                        ((n.mouseOver = !0),
                        (this.node_over = n),
                        (this.dirty_canvas = !0),
                        n.onMouseEnter && n.onMouseEnter(e)),
                    n.onMouseMove &&
                        n.onMouseMove(
                            e,
                            [e.canvasX - n.pos[0], e.canvasY - n.pos[1]],
                            this
                        ),
                    this.connecting_node)
                ) {
                    if (this.connecting_output) {
                        const s = this._highlight_input || [0, 0];
                        if (!this.isOverNodeBox(n, e.canvasX, e.canvasY)) {
                            const a = this.isOverNodeInput(
                                n,
                                e.canvasX,
                                e.canvasY,
                                s
                            );
                            if (a != -1 && n.inputs[a]) {
                                const o = n.inputs[a].type;
                                LiteGraph.isValidConnection(
                                    this.connecting_output.type,
                                    o
                                ) &&
                                    ((this._highlight_input = s),
                                    (this._highlight_input_slot = n.inputs[a]));
                            } else
                                (this._highlight_input = null),
                                    (this._highlight_input_slot = null);
                        }
                    } else if (this.connecting_input) {
                        const s = this._highlight_output || [0, 0];
                        if (!this.isOverNodeBox(n, e.canvasX, e.canvasY)) {
                            const a = this.isOverNodeOutput(
                                n,
                                e.canvasX,
                                e.canvasY,
                                s
                            );
                            if (a != -1 && n.outputs[a]) {
                                const o = n.outputs[a].type;
                                LiteGraph.isValidConnection(
                                    this.connecting_input.type,
                                    o
                                ) && (this._highlight_output = s);
                            } else this._highlight_output = null;
                        }
                    }
                }
                this.canvas &&
                    (LiteGraph.isInsideRectangle(
                        e.canvasX,
                        e.canvasY,
                        n.pos[0] + n.size[0] - 5,
                        n.pos[1] + n.size[1] - 5,
                        5,
                        5
                    )
                        ? (this.canvas.style.cursor = "se-resize")
                        : (this.canvas.style.cursor = "crosshair"));
            } else {
                let s = null;
                for (let a = 0; a < this.visible_links.length; ++a) {
                    const o = this.visible_links[a],
                        l = o._pos;
                    if (
                        !(
                            !l ||
                            e.canvasX < l[0] - 4 ||
                            e.canvasX > l[0] + 4 ||
                            e.canvasY < l[1] - 4 ||
                            e.canvasY > l[1] + 4
                        )
                    ) {
                        s = o;
                        break;
                    }
                }
                s != this.over_link_center &&
                    ((this.over_link_center = s), (this.dirty_canvas = !0)),
                    this.canvas && (this.canvas.style.cursor = "");
            }
            if (
                (this.node_capturing_input &&
                    this.node_capturing_input != n &&
                    this.node_capturing_input.onMouseMove &&
                    this.node_capturing_input.onMouseMove(
                        e,
                        [
                            e.canvasX - this.node_capturing_input.pos[0],
                            e.canvasY - this.node_capturing_input.pos[1],
                        ],
                        this
                    ),
                this.node_dragged && !this.live_mode)
            ) {
                for (const s in this.selected_nodes) {
                    const a = this.selected_nodes[s];
                    (a.pos[0] += r[0] / this.ds.scale),
                        (a.pos[1] += r[1] / this.ds.scale),
                        a.is_selected || this.processNodeSelected(a, e);
                }
                (this.dirty_canvas = !0), (this.dirty_bgcanvas = !0);
            }
            if (this.resizing_node && !this.live_mode) {
                const s = [
                        e.canvasX - this.resizing_node.pos[0],
                        e.canvasY - this.resizing_node.pos[1],
                    ],
                    a = this.resizing_node.computeSize();
                (s[0] = Math.max(a[0], s[0])),
                    (s[1] = Math.max(a[1], s[1])),
                    this.resizing_node.setSize(s),
                    (this.canvas.style.cursor = "se-resize"),
                    (this.dirty_canvas = !0),
                    (this.dirty_bgcanvas = !0);
            }
        }
        return e.preventDefault(), !1;
    }
    /**
     * Called when a mouse up event has to be processed
     * @method processMouseUp
     **/
    processMouseUp(e) {
        const t = e.isPrimary === void 0 || e.isPrimary;
        if (!t) return !1;
        if (
            (this.set_canvas_dirty_on_mouse_event && (this.dirty_canvas = !0),
            !this.graph)
        )
            return;
        const n = this.getCanvasWindow().document;
        (_LGraphCanvas.active_canvas = this),
            this.options.skip_events ||
                (LiteGraph.pointerListenerRemove(
                    n,
                    "move",
                    this._mousemove_callback,
                    !0
                ),
                LiteGraph.pointerListenerAdd(
                    this.canvas,
                    "move",
                    this._mousemove_callback,
                    !0
                ),
                LiteGraph.pointerListenerRemove(
                    n,
                    "up",
                    this._mouseup_callback,
                    !0
                )),
            this.adjustMouseEvent(e);
        const s = LiteGraph.getTime();
        if (
            ((e.click_time = s - this.last_mouseclick),
            (this.last_mouse_dragging = !1),
            (this.last_click_position = null),
            this.block_click && (this.block_click = !1),
            e.which == 1)
        ) {
            if (
                (this.node_widget &&
                    this.processNodeWidgets(
                        this.node_widget[0],
                        this.graph_mouse,
                        e
                    ),
                (this.node_widget = null),
                this.selected_group)
            ) {
                const o =
                        this.selected_group.pos[0] -
                        Math.round(this.selected_group.pos[0]),
                    l =
                        this.selected_group.pos[1] -
                        Math.round(this.selected_group.pos[1]);
                this.selected_group.move(o, l, e.ctrlKey),
                    (this.selected_group.pos[0] = Math.round(
                        this.selected_group.pos[0]
                    )),
                    (this.selected_group.pos[1] = Math.round(
                        this.selected_group.pos[1]
                    )),
                    this.selected_group._nodes.length &&
                        (this.dirty_canvas = !0),
                    (this.selected_group = null);
            }
            this.selected_group_resizing = !1;
            const a = this.graph.getNodeOnPos(
                e.canvasX,
                e.canvasY,
                this.visible_nodes
            );
            if (this.dragging_rectangle) {
                if (this.graph) {
                    const o = this.graph._nodes,
                        l = new Float32Array(4),
                        c = Math.abs(this.dragging_rectangle[2]),
                        u = Math.abs(this.dragging_rectangle[3]),
                        h =
                            this.dragging_rectangle[2] < 0
                                ? this.dragging_rectangle[0] - c
                                : this.dragging_rectangle[0],
                        f =
                            this.dragging_rectangle[3] < 0
                                ? this.dragging_rectangle[1] - u
                                : this.dragging_rectangle[1];
                    if (
                        ((this.dragging_rectangle[0] = h),
                        (this.dragging_rectangle[1] = f),
                        (this.dragging_rectangle[2] = c),
                        (this.dragging_rectangle[3] = u),
                        !a || (c > 10 && u > 10))
                    ) {
                        const d = [];
                        for (let p = 0; p < o.length; ++p) {
                            const _ = o[p];
                            _.getBounding(l),
                                LiteGraph.overlapBounding(
                                    this.dragging_rectangle,
                                    l
                                ) && d.push(_);
                        }
                        d.length && this.selectNodes(d, e.shiftKey);
                    } else this.selectNodes([a], e.shiftKey || e.ctrlKey);
                }
                this.dragging_rectangle = null;
            } else if (this.connecting_node) {
                (this.dirty_canvas = !0), (this.dirty_bgcanvas = !0);
                const l = (this.connecting_output || this.connecting_input)
                    .type;
                if (a) {
                    if (this.connecting_output) {
                        const c = this.isOverNodeInput(a, e.canvasX, e.canvasY);
                        c != -1
                            ? this.connecting_node.connect(
                                  this.connecting_slot,
                                  a,
                                  c
                              )
                            : this.connecting_node.connectByType(
                                  this.connecting_slot,
                                  a,
                                  l
                              );
                    } else if (this.connecting_input) {
                        const c = this.isOverNodeOutput(
                            a,
                            e.canvasX,
                            e.canvasY
                        );
                        c != -1
                            ? a.connect(
                                  c,
                                  this.connecting_node,
                                  this.connecting_slot
                              )
                            : this.connecting_node.connectByTypeOutput(
                                  this.connecting_slot,
                                  a,
                                  l
                              );
                    }
                } else
                    LiteGraph.release_link_on_empty_shows_menu &&
                        (e.shiftKey && this.allow_searchbox
                            ? this.connecting_output
                                ? this.showSearchBox(e, {
                                      node_from: this.connecting_node,
                                      slot_from: this.connecting_output,
                                      type_filter_in:
                                          this.connecting_output.type,
                                  })
                                : this.connecting_input &&
                                  this.showSearchBox(e, {
                                      node_to: this.connecting_node,
                                      slot_from: this.connecting_input,
                                      type_filter_out:
                                          this.connecting_input.type,
                                  })
                            : this.connecting_output
                            ? this.showConnectionMenu({
                                  nodeFrom: this.connecting_node,
                                  slotFrom: this.connecting_output,
                                  e,
                              })
                            : this.connecting_input &&
                              this.showConnectionMenu({
                                  nodeTo: this.connecting_node,
                                  slotTo: this.connecting_input,
                                  e,
                              }));
                (this.connecting_output = null),
                    (this.connecting_input = null),
                    (this.connecting_pos = null),
                    (this.connecting_node = null),
                    (this.connecting_slot = -1);
            } else if (this.resizing_node)
                (this.dirty_canvas = !0),
                    (this.dirty_bgcanvas = !0),
                    this.graph.afterChange(this.resizing_node),
                    (this.resizing_node = null);
            else if (this.node_dragged) {
                const o = this.node_dragged;
                o &&
                    e.click_time < 300 &&
                    LiteGraph.isInsideRectangle(
                        e.canvasX,
                        e.canvasY,
                        o.pos[0],
                        o.pos[1] - LiteGraph.NODE_TITLE_HEIGHT,
                        LiteGraph.NODE_TITLE_HEIGHT,
                        LiteGraph.NODE_TITLE_HEIGHT
                    ) &&
                    o.collapse(),
                    (this.dirty_canvas = !0),
                    (this.dirty_bgcanvas = !0),
                    (this.node_dragged.pos[0] = Math.round(
                        this.node_dragged.pos[0]
                    )),
                    (this.node_dragged.pos[1] = Math.round(
                        this.node_dragged.pos[1]
                    )),
                    (this.graph.config.align_to_grid || this.align_to_grid) &&
                        this.node_dragged.alignToGrid(),
                    this.onNodeMoved && this.onNodeMoved(this.node_dragged),
                    this.graph.afterChange(this.node_dragged),
                    (this.node_dragged = null);
            } else
                !this.graph.getNodeOnPos(
                    e.canvasX,
                    e.canvasY,
                    this.visible_nodes
                ) &&
                    e.click_time < 300 &&
                    this.deselectAllNodes(),
                    (this.dirty_canvas = !0),
                    (this.dragging_canvas = !1),
                    this.node_over &&
                        this.node_over.onMouseUp &&
                        this.node_over.onMouseUp(
                            e,
                            [
                                e.canvasX - this.node_over.pos[0],
                                e.canvasY - this.node_over.pos[1],
                            ],
                            this
                        ),
                    this.node_capturing_input &&
                        this.node_capturing_input.onMouseUp &&
                        this.node_capturing_input.onMouseUp(e, [
                            e.canvasX - this.node_capturing_input.pos[0],
                            e.canvasY - this.node_capturing_input.pos[1],
                        ]);
        } else
            e.which == 2
                ? ((this.dirty_canvas = !0), (this.dragging_canvas = !1))
                : e.which == 3 &&
                  ((this.dirty_canvas = !0), (this.dragging_canvas = !1));
        return (
            t && ((this.pointer_is_down = !1), (this.pointer_is_double = !1)),
            this.graph.change(),
            e.stopPropagation(),
            e.preventDefault(),
            !1
        );
    }
    /**
     * Called when a mouse wheel event has to be processed
     * @method processMouseWheel
     **/
    processMouseWheel(e) {
        if (!this.graph || !this.allow_dragcanvas) return;
        const t = e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * -60;
        this.adjustMouseEvent(e);
        const r = e.clientX,
            n = e.clientY;
        if (
            !(
                !this.viewport ||
                (this.viewport &&
                    r >= this.viewport[0] &&
                    r < this.viewport[0] + this.viewport[2] &&
                    n >= this.viewport[1] &&
                    n < this.viewport[1] + this.viewport[3])
            )
        )
            return;
        let a = this.ds.scale;
        return (
            t > 0 ? (a *= 1.1) : t < 0 && (a *= 1 / 1.1),
            this.ds.changeScale(a, [e.clientX, e.clientY]),
            this.graph.change(),
            e.preventDefault(),
            !1
        );
    }
    /**
     * returns true if a position (in graph space) is on top of a node little corner box
     * @method isOverNodeBox
     **/
    isOverNodeBox(e, t, r) {
        const n = LiteGraph.NODE_TITLE_HEIGHT;
        return !!LiteGraph.isInsideRectangle(
            t,
            r,
            e.pos[0] + 2,
            e.pos[1] + 2 - n,
            n - 4,
            n - 4
        );
    }
    /**
     * returns the INDEX if a position (in graph space) is on top of a node input slot
     * @method isOverNodeInput
     **/
    isOverNodeInput(e, t, r, n) {
        if (e.inputs)
            for (let s = 0, a = e.inputs.length; s < a; ++s) {
                e.inputs[s];
                const o = e.getConnectionPos(!0, s);
                let l = !1;
                if (
                    (e.horizontal
                        ? (l = LiteGraph.isInsideRectangle(
                              t,
                              r,
                              o[0] - 5,
                              o[1] - 10,
                              10,
                              20
                          ))
                        : (l = LiteGraph.isInsideRectangle(
                              t,
                              r,
                              o[0] - 10,
                              o[1] - 5,
                              40,
                              10
                          )),
                    l)
                )
                    return n && ((n[0] = o[0]), (n[1] = o[1])), s;
            }
        return -1;
    }
    /**
     * returns the INDEX if a position (in graph space) is on top of a node output slot
     * @method isOverNodeOuput
     **/
    isOverNodeOutput(e, t, r, n) {
        if (e.outputs)
            for (let s = 0, a = e.outputs.length; s < a; ++s) {
                e.outputs[s];
                const o = e.getConnectionPos(!1, s);
                let l = !1;
                if (
                    (e.horizontal
                        ? (l = LiteGraph.isInsideRectangle(
                              t,
                              r,
                              o[0] - 5,
                              o[1] - 10,
                              10,
                              20
                          ))
                        : (l = LiteGraph.isInsideRectangle(
                              t,
                              r,
                              o[0] - 10,
                              o[1] - 5,
                              40,
                              10
                          )),
                    l)
                )
                    return n && ((n[0] = o[0]), (n[1] = o[1])), s;
            }
        return -1;
    }
    /**
     * process a key event
     * @method processKey
     **/
    processKey(e) {
        if (!this.graph) return;
        let t = !1;
        if (e.target.localName != "input") {
            if (e.type == "keydown") {
                (this.isKeyPressed = !0),
                    e.keyCode == 32 &&
                        (this.saveUndoStack(),
                        (this.dragging_canvas = !0),
                        (t = !0)),
                    e.keyCode == 27 &&
                        (this.saveUndoStack(),
                        this.node_panel && this.node_panel.close(),
                        this.options_panel && this.options_panel.close(),
                        (t = !0)),
                    e.keyCode == 65 &&
                        e.ctrlKey &&
                        (this.saveUndoStack(), this.selectNodes(), (t = !0)),
                    e.keyCode === 67 &&
                        (e.metaKey || e.ctrlKey) &&
                        !e.shiftKey &&
                        this.selected_nodes &&
                        (this.saveUndoStack(),
                        this.copyToClipboard(),
                        (t = !0)),
                    e.keyCode === 86 &&
                        (e.metaKey || e.ctrlKey) &&
                        (this.saveUndoStack(),
                        this.pasteFromClipboard(e.shiftKey));
                const r = (n) => {
                    if (this.selected_nodes && n.key === "ArrowUp") {
                        this.saveUndoStackEvt();
                        for (let s in this.selected_nodes)
                            this.selected_nodes[s].pos[1] -= 1;
                    }
                    if (this.selected_nodes && n.key === "ArrowDown") {
                        this.saveUndoStackEvt();
                        for (let s in this.selected_nodes)
                            this.selected_nodes[s].pos[1] += 1;
                    }
                    if (this.selected_nodes && n.key === "ArrowLeft") {
                        this.saveUndoStackEvt();
                        for (let s in this.selected_nodes)
                            this.selected_nodes[s].pos[0] -= 1;
                    }
                    if (this.selected_nodes && n.key === "ArrowRight") {
                        this.saveUndoStackEvt();
                        for (let s in this.selected_nodes)
                            this.selected_nodes[s].pos[0] += 1;
                    }
                };
                if (
                    (this.isKeyPressed ? r(e) : (this.isKeyPressed = !1),
                    (e.keyCode == 46 || e.keyCode == 8) &&
                        e.target.localName != "input" &&
                        e.target.localName != "textarea" &&
                        (this.saveUndoStack(),
                        this.deleteSelectedNodes(),
                        (t = !0)),
                    this.selected_nodes)
                )
                    for (const n in this.selected_nodes)
                        this.selected_nodes[n].onKeyDown &&
                            this.selected_nodes[n].onKeyDown(e);
            } else if (e.type == "keyup") {
                if (
                    (e.keyCode == 32 && (this.dragging_canvas = !1),
                    this.selected_nodes)
                )
                    for (const r in this.selected_nodes)
                        this.selected_nodes[r].onKeyUp &&
                            this.selected_nodes[r].onKeyUp(e);
                e.ctrlKey && e.key === "z" && !this.read_only && this.undo(),
                    e.ctrlKey &&
                        e.key === "y" &&
                        !this.read_only &&
                        this.redo();
            }
            if ((this.graph.change(), t))
                return e.preventDefault(), e.stopImmediatePropagation(), !1;
        }
    }
    checkObjectEqual(e, t) {
        const r = JSON.stringify(e),
            n = JSON.stringify(t);
        return r === n;
    }
    // 이전 실헹
    undo() {
        if (this.undoStack.length === 0) return;
        const e = this.graph.serialize();
        this.redoStack.push(this.tempDeepClone(e));
        const t = this.undoStack.pop();
        this.graph.configure(this.tempDeepClone(t)), this.draw(!0, !0);
    }
    // 다시 실행
    redo() {
        if (this.redoStack.length === 0) return;
        const e = this.graph.serialize();
        this.undoStack.push(this.tempDeepClone(e));
        const t = this.redoStack.pop();
        this.graph.configure(this.tempDeepClone(t)), this.draw(!0, !0);
    }
    debounceTime(e, t) {
        let r = null;
        return function (...n) {
            const s = this;
            clearTimeout(r), (r = setTimeout(() => e.apply(s, n), t));
        };
    }
    tempDeepClone(e) {
        return JSON.parse(JSON.stringify(e));
    }
    copyToClipboard() {
        const e = {
            nodes: [],
            links: [],
        };
        let t = 0;
        const r = [];
        for (const n in this.selected_nodes) {
            const s = this.selected_nodes[n];
            s.clonable !== !1 && ((s._relative_id = t), r.push(s), (t += 1));
        }
        for (let n = 0; n < r.length; ++n) {
            const s = r[n];
            if (s.clonable === !1) continue;
            const a = s.clone();
            if (!a) {
                console.warn("node type not found: " + s.type);
                continue;
            }
            if ((e.nodes.push(a.serialize()), s.inputs && s.inputs.length))
                for (let o = 0; o < s.inputs.length; ++o) {
                    const l = s.inputs[o];
                    if (!l || l.link == null) continue;
                    const c = this.graph.links[l.link];
                    if (!c) continue;
                    const u = this.graph.getNodeById(c.origin_id);
                    u &&
                        e.links.push([
                            u._relative_id,
                            c.origin_slot,
                            //j,
                            s._relative_id,
                            c.target_slot,
                            u.id,
                        ]);
                }
        }
        localStorage.setItem("litegrapheditor_clipboard", JSON.stringify(e));
    }
    pasteFromClipboard(e = !1) {
        if (!LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs && e)
            return;
        const t = localStorage.getItem("litegrapheditor_clipboard");
        if (!t) return;
        this.graph.beforeChange();
        const r = JSON.parse(t);
        let n = !1,
            s = !1;
        for (let o = 0; o < r.nodes.length; ++o)
            n
                ? (n[0] > r.nodes[o].pos[0] &&
                      ((n[0] = r.nodes[o].pos[0]), (s[0] = o)),
                  n[1] > r.nodes[o].pos[1] &&
                      ((n[1] = r.nodes[o].pos[1]), (s[1] = o)))
                : ((n = [r.nodes[o].pos[0], r.nodes[o].pos[1]]), (s = [o, o]));
        const a = [];
        for (let o = 0; o < r.nodes.length; ++o) {
            const l = r.nodes[o],
                c = LiteGraph.createNode(l.type);
            c &&
                (c.configure(l),
                (c.pos[0] += this.graph_mouse[0] - n[0]),
                (c.pos[1] += this.graph_mouse[1] - n[1]),
                this.graph.add(c, { doProcessChange: !1 }),
                a.push(c));
        }
        for (let o = 0; o < r.links.length; ++o) {
            const l = r.links[o];
            let c;
            const u = l[0];
            if (u != null) c = a[u];
            else if (
                LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs &&
                e
            ) {
                const f = l[4];
                f && (c = this.graph.getNodeById(f));
            }
            const h = a[l[2]];
            c && h
                ? c.connect(l[1], h, l[3])
                : console.warn("Warning, nodes missing on pasting");
        }
        this.selectNodes(a), this.graph.afterChange();
    }
    /**
     * process a item drop event on top the canvas
     * @method processDrop
     **/
    processDrop(e) {
        e.preventDefault(), this.adjustMouseEvent(e);
        const t = e.clientX,
            r = e.clientY;
        if (
            !(
                !this.viewport ||
                (this.viewport &&
                    t >= this.viewport[0] &&
                    t < this.viewport[0] + this.viewport[2] &&
                    r >= this.viewport[1] &&
                    r < this.viewport[1] + this.viewport[3])
            )
        )
            return;
        const s = [e.canvasX, e.canvasY],
            a = this.graph ? this.graph.getNodeOnPos(s[0], s[1]) : null;
        if (!a) {
            let o = null;
            this.onDropItem && (o = this.onDropItem(event)),
                o || this.checkDropItem(e);
            return;
        }
        if (a.onDropFile || a.onDropData) {
            const o = e.dataTransfer.files;
            if (o && o.length)
                for (let l = 0; l < o.length; l++) {
                    const c = e.dataTransfer.files[0],
                        u = c.name;
                    if (
                        (_LGraphCanvas.getFileExtension(u),
                        a.onDropFile && a.onDropFile(c),
                        a.onDropData)
                    ) {
                        const h = new FileReader();
                        h.onload = function (d) {
                            const p = d.target.result;
                            a.onDropData(p, u, c);
                        };
                        const f = c.type.split("/")[0];
                        f == "text" || f == ""
                            ? h.readAsText(c)
                            : f == "image"
                            ? h.readAsDataURL(c)
                            : h.readAsArrayBuffer(c);
                    }
                }
        }
        return a.onDropItem && a.onDropItem(event)
            ? !0
            : this.onDropItem
            ? this.onDropItem(event)
            : !1;
    }
    //called if the graph doesn't have a default drop item behaviour
    checkDropItem(e) {
        if (e.dataTransfer.files.length) {
            const t = e.dataTransfer.files[0],
                r = _LGraphCanvas.getFileExtension(t.name).toLowerCase(),
                n = LiteGraph.node_types_by_file_extension[r];
            if (n) {
                this.graph.beforeChange();
                const s = LiteGraph.createNode(n.type);
                (s.pos = [e.canvasX, e.canvasY]),
                    this.graph.add(s),
                    s.onDropFile && s.onDropFile(t),
                    this.graph.afterChange();
            }
        }
    }
    processNodeDblClicked(e) {
        this.onShowNodePanel
            ? this.onShowNodePanel(e)
            : this.showShowNodePanel(e),
            this.onNodeDblClicked && this.onNodeDblClicked(e),
            this.setDirty(!0);
    }
    processNodeSelected(e, t) {
        this.selectNode(e, t && (t.shiftKey || t.ctrlKey || this.multi_select)),
            this.onNodeSelected && this.onNodeSelected(e);
    }
    /**
     * selects a given node (or adds it to the current selection)
     * @method selectNode
     **/
    selectNode(e, t) {
        e == null ? this.deselectAllNodes() : this.selectNodes([e], t);
    }
    /**
     * selects several nodes (or adds them to the current selection)
     * @method selectNodes
     **/
    selectNodes(e, t) {
        t || this.deselectAllNodes(),
            (e = e || this.graph._nodes),
            typeof e == "string" && (e = [e]);
        for (const r in e) {
            const n = e[r];
            if (n.is_selected) {
                this.deselectNode(n);
                continue;
            }
            if (
                (!n.is_selected && n.onSelected && n.onSelected(),
                (n.is_selected = !0),
                (this.selected_nodes[n.id] = n),
                n.inputs)
            )
                for (let s = 0; s < n.inputs.length; ++s)
                    this.highlighted_links[n.inputs[s].link] = !0;
            if (n.outputs)
                for (let s = 0; s < n.outputs.length; ++s) {
                    const a = n.outputs[s];
                    if (a.links)
                        for (let o = 0; o < a.links.length; ++o)
                            this.highlighted_links[a.links[o]] = !0;
                }
        }
        this.onSelectionChange && this.onSelectionChange(this.selected_nodes),
            this.setDirty(!0);
    }
    /**
     * removes a node from the current selection
     * @method deselectNode
     **/
    deselectNode(e) {
        if (e.is_selected) {
            if (
                (e.onDeselected && e.onDeselected(),
                (e.is_selected = !1),
                this.onNodeDeselected && this.onNodeDeselected(e),
                e.inputs)
            )
                for (let t = 0; t < e.inputs.length; ++t)
                    delete this.highlighted_links[e.inputs[t].link];
            if (e.outputs)
                for (let t = 0; t < e.outputs.length; ++t) {
                    const r = e.outputs[t];
                    if (r.links)
                        for (let n = 0; n < r.links.length; ++n)
                            delete this.highlighted_links[r.links[n]];
                }
        }
    }
    /**
     * removes all nodes from the current selection
     * @method deselectAllNodes
     **/
    deselectAllNodes() {
        if (!this.graph) return;
        const e = this.graph._nodes;
        for (let t = 0, r = e.length; t < r; ++t) {
            const n = e[t];
            n.is_selected &&
                (n.onDeselected && n.onDeselected(),
                (n.is_selected = !1),
                this.onNodeDeselected && this.onNodeDeselected(n));
        }
        (this.selected_nodes = {}),
            (this.current_node = null),
            (this.highlighted_links = {}),
            this.onSelectionChange &&
                this.onSelectionChange(this.selected_nodes),
            this.setDirty(!0);
    }
    /**
     * deletes all nodes in the current selection from the graph
     * @method deleteSelectedNodes
     **/
    deleteSelectedNodes() {
        this.graph.beforeChange();
        for (const e in this.selected_nodes) {
            const t = this.selected_nodes[e];
            if (!t.block_delete) {
                if (
                    t.inputs &&
                    t.inputs.length &&
                    t.outputs &&
                    t.outputs.length &&
                    LiteGraph.isValidConnection(
                        t.inputs[0].type,
                        t.outputs[0].type
                    ) &&
                    t.inputs[0].link &&
                    t.outputs[0].links &&
                    t.outputs[0].links.length
                ) {
                    const r = t.graph.links[t.inputs[0].link],
                        n = t.graph.links[t.outputs[0].links[0]],
                        s = t.getInputNode(0),
                        a = t.getOutputNodes(0)[0];
                    s && a && s.connect(r.origin_slot, a, n.target_slot);
                }
                this.graph.remove(t),
                    this.onNodeDeselected && this.onNodeDeselected(t);
            }
        }
        (this.selected_nodes = {}),
            (this.current_node = null),
            (this.highlighted_links = {}),
            this.setDirty(!0),
            this.graph.afterChange();
    }
    /**
     * centers the camera on a given node
     * @method centerOnNode
     **/
    centerOnNode(e) {
        (this.ds.offset[0] =
            -e.pos[0] -
            e.size[0] * 0.5 +
            (this.canvas.width * 0.5) / this.ds.scale),
            (this.ds.offset[1] =
                -e.pos[1] -
                e.size[1] * 0.5 +
                (this.canvas.height * 0.5) / this.ds.scale),
            this.setDirty(!0, !0);
    }
    /**
     * adds some useful properties to a mouse event, like the position in graph coordinates
     * @method adjustMouseEvent
     **/
    adjustMouseEvent(e) {
        let t = 0,
            r = 0;
        if (this.canvas) {
            const n = this.canvas.getBoundingClientRect();
            (t = e.clientX - n.left), (r = e.clientY - n.top);
        } else (t = e.clientX), (r = e.clientY);
        (this.last_mouse_position[0] = t),
            (this.last_mouse_position[1] = r),
            (e.canvasX = t / this.ds.scale - this.ds.offset[0]),
            (e.canvasY = r / this.ds.scale - this.ds.offset[1]);
    }
    /**
     * changes the zoom level of the graph (default is 1), you can pass also a place used to pivot the zoom
     * @method setZoom
     **/
    setZoom(e, t) {
        this.ds.changeScale(e, t),
            (this.dirty_canvas = !0),
            (this.dirty_bgcanvas = !0);
    }
    /**
     * converts a coordinate from graph coordinates to canvas2D coordinates
     * @method convertOffsetToCanvas
     **/
    convertOffsetToCanvas(e, t) {
        return this.ds.convertOffsetToCanvas(e, t);
    }
    /**
     * converts a coordinate from Canvas2D coordinates to graph space
     * @method convertCanvasToOffset
     **/
    convertCanvasToOffset(e, t) {
        return this.ds.convertCanvasToOffset(e, t);
    }
    //converts event coordinates from canvas2D to graph coordinates
    convertEventToCanvasOffset(e) {
        const t = this.canvas.getBoundingClientRect();
        return this.convertCanvasToOffset([
            e.clientX - t.left,
            e.clientY - t.top,
        ]);
    }
    /**
     * brings a node to front (above all other nodes)
     * @method bringToFront
     **/
    bringToFront(e) {
        const t = this.graph._nodes.indexOf(e);
        t != -1 && (this.graph._nodes.splice(t, 1), this.graph._nodes.push(e));
    }
    /**
     * sends a node to the back (below all other nodes)
     * @method sendToBack
     **/
    sendToBack(e) {
        const t = this.graph._nodes.indexOf(e);
        t != -1 &&
            (this.graph._nodes.splice(t, 1), this.graph._nodes.unshift(e));
    }
    /**
     * checks which nodes are visible (inside the camera area)
     * @method computeVisibleNodes
     **/
    computeVisibleNodes(e, t) {
        const r = new Float32Array(4),
            n = t || [];
        (n.length = 0), (e = e || this.graph._nodes);
        for (let s = 0, a = e.length; s < a; ++s) {
            const o = e[s];
            (this.live_mode && !o.onDrawBackground && !o.onDrawForeground) ||
                (o.getBounding &&
                    LiteGraph.overlapBounding(
                        this.visible_area,
                        o.getBounding(r, !0)
                    ) &&
                    n.push(o));
        }
        return (this.visible_nodes = n), n;
    }
    /**
     * renders the whole canvas content, by rendering in two separated canvas, one containing the background grid and the connections, and one containing the nodes)
     * @method draw
     **/
    draw(e, t) {
        if (!this.canvas || this.canvas.width == 0 || this.canvas.height == 0)
            return;
        const r = LiteGraph.getTime();
        (this.render_time = (r - this.last_draw_time) * 1e-3),
            (this.last_draw_time = r),
            this.graph && this.ds.computeVisibleArea(this.viewport),
            (this.dirty_bgcanvas ||
                t ||
                this.always_render_background ||
                (this.graph &&
                    this.graph._last_trigger_time &&
                    r - this.graph._last_trigger_time < 1e3)) &&
                this.drawBackCanvas(),
            (this.dirty_canvas || e) && this.drawFrontCanvas(),
            (this.fps = this.render_time ? 1 / this.render_time : 0),
            (this.frame += 1);
    }
    /**
     * draws the front canvas (the one containing all the nodes)
     * @method drawFrontCanvas
     **/
    drawFrontCanvas() {
        (this.dirty_canvas = !1),
            this.ctx || (this.ctx = this.bgcanvas.getContext("2d"));
        const e = this.ctx;
        if (!e) return;
        const t = this.canvas;
        e.start2D &&
            !this.viewport &&
            (e.start2D(), e.restore(), e.setTransform(1, 0, 0, 1, 0, 0));
        const r = this.viewport || this.dirty_area;
        if (
            (r &&
                (e.save(),
                e.beginPath(),
                e.rect(r[0], r[1], r[2], r[3]),
                e.clip()),
            this.clear_background &&
                (r
                    ? e.clearRect(r[0], r[1], r[2], r[3])
                    : e.clearRect(0, 0, t.width, t.height)),
            this.bgcanvas == this.canvas
                ? this.drawBackCanvas()
                : e.drawImage(this.bgcanvas, 0, 0),
            this.onRender && this.onRender(t, e),
            this.show_info && this.renderInfo(e, r ? r[0] : 0, r ? r[1] : 0),
            this.graph)
        ) {
            e.save(), this.ds.toCanvasContext(e);
            const n = this.computeVisibleNodes(null, this.visible_nodes);
            for (let s = 0; s < n.length; ++s) {
                const a = n[s];
                e.save(),
                    e.translate(a.pos[0], a.pos[1]),
                    this.drawNode(a, e),
                    e.restore();
            }
            if (
                (this.addNodeGuideLines(e),
                this.render_execution_order && this.drawExecutionOrder(e),
                this.graph.config.links_ontop &&
                    (this.live_mode || this.drawConnections(e)),
                this.connecting_pos != null)
            ) {
                e.lineWidth = this.connections_width;
                let s = null;
                const a = this.connecting_output || this.connecting_input,
                    o = a.type;
                let l = a.dir;
                l == null &&
                    (this.connecting_output
                        ? (l = this.connecting_node.horizontal
                              ? LiteGraph.DOWN
                              : LiteGraph.RIGHT)
                        : (l = this.connecting_node.horizontal
                              ? LiteGraph.UP
                              : LiteGraph.LEFT));
                const c = a.shape;
                switch (o) {
                    case LiteGraph.EVENT:
                        s = LiteGraph.EVENT_LINK_COLOR;
                        break;
                    default:
                        s = LiteGraph.CONNECTING_LINK_COLOR;
                }
                if (
                    (this.renderLink(
                        e,
                        this.connecting_pos,
                        [this.graph_mouse[0], this.graph_mouse[1]],
                        null,
                        !1,
                        null,
                        s,
                        l,
                        LiteGraph.CENTER
                    ),
                    e.beginPath(),
                    o === LiteGraph.EVENT || c === LiteGraph.BOX_SHAPE
                        ? (e.rect(
                              this.connecting_pos[0] - 6 + 0.5,
                              this.connecting_pos[1] - 5 + 0.5,
                              14,
                              10
                          ),
                          e.fill(),
                          e.beginPath(),
                          e.rect(
                              this.graph_mouse[0] - 6 + 0.5,
                              this.graph_mouse[1] - 5 + 0.5,
                              14,
                              10
                          ))
                        : c === LiteGraph.ARROW_SHAPE
                        ? (e.moveTo(
                              this.connecting_pos[0] + 8,
                              this.connecting_pos[1] + 0.5
                          ),
                          e.lineTo(
                              this.connecting_pos[0] - 4,
                              this.connecting_pos[1] + 6 + 0.5
                          ),
                          e.lineTo(
                              this.connecting_pos[0] - 4,
                              this.connecting_pos[1] - 6 + 0.5
                          ),
                          e.closePath())
                        : (e.arc(
                              this.connecting_pos[0],
                              this.connecting_pos[1],
                              4,
                              0,
                              Math.PI * 2
                          ),
                          e.fill(),
                          e.beginPath(),
                          e.arc(
                              this.graph_mouse[0],
                              this.graph_mouse[1],
                              4,
                              0,
                              Math.PI * 2
                          )),
                    e.fill(),
                    (e.fillStyle = "#ffcc00"),
                    this._highlight_input &&
                        (e.beginPath(),
                        this._highlight_input_slot.shape ===
                        LiteGraph.ARROW_SHAPE
                            ? (e.moveTo(
                                  this._highlight_input[0] + 8,
                                  this._highlight_input[1] + 0.5
                              ),
                              e.lineTo(
                                  this._highlight_input[0] - 4,
                                  this._highlight_input[1] + 6 + 0.5
                              ),
                              e.lineTo(
                                  this._highlight_input[0] - 4,
                                  this._highlight_input[1] - 6 + 0.5
                              ),
                              e.closePath())
                            : e.arc(
                                  this._highlight_input[0],
                                  this._highlight_input[1],
                                  6,
                                  0,
                                  Math.PI * 2
                              ),
                        e.fill()),
                    this._highlight_output)
                ) {
                    let u = this._highlight_output.shape;
                    e.beginPath(),
                        u === LiteGraph.ARROW_SHAPE
                            ? (e.moveTo(
                                  this._highlight_output[0] + 8,
                                  this._highlight_output[1] + 0.5
                              ),
                              e.lineTo(
                                  this._highlight_output[0] - 4,
                                  this._highlight_output[1] + 6 + 0.5
                              ),
                              e.lineTo(
                                  this._highlight_output[0] - 4,
                                  this._highlight_output[1] - 6 + 0.5
                              ),
                              e.closePath())
                            : e.arc(
                                  this._highlight_output[0],
                                  this._highlight_output[1],
                                  6,
                                  0,
                                  Math.PI * 2
                              ),
                        e.fill();
                }
            }
            this.dragging_rectangle &&
                ((e.strokeStyle = "#FFF"),
                e.strokeRect(
                    this.dragging_rectangle[0],
                    this.dragging_rectangle[1],
                    this.dragging_rectangle[2],
                    this.dragging_rectangle[3]
                )),
                this.over_link_center && this.render_link_tooltip
                    ? this.drawLinkTooltip(e, this.over_link_center)
                    : this.onDrawLinkTooltip && this.onDrawLinkTooltip(e, null),
                this.onDrawForeground &&
                    this.onDrawForeground(e, this.visible_rect),
                e.restore();
        }
        this._graph_stack &&
            this._graph_stack.length &&
            this.drawSubgraphPanel(e),
            this.onDrawOverlay && this.onDrawOverlay(e),
            this.showPopover && this.drawPopoverLine(e),
            r && e.restore(),
            e.finish2D && e.finish2D();
    }
    /**
     * draws the panel in the corner that shows subgraph properties
     * @method drawSubgraphPanel
     **/
    drawSubgraphPanel(e) {
        const t = this.graph,
            r = t._subgraph_node;
        if (!r) {
            console.warn("subgraph without subnode");
            return;
        }
        this.drawSubgraphPanelLeft(t, r, e),
            this.drawSubgraphPanelRight(t, r, e);
    }
    drawSubgraphPanelLeft(e, t, r) {
        const n = t.inputs ? t.inputs.length : 0,
            s = 200,
            a = Math.floor(LiteGraph.NODE_SLOT_HEIGHT * 1.6);
        if (
            ((r.fillStyle = "#111"),
            (r.globalAlpha = 0.8),
            r.beginPath(),
            r.roundRect(10, 10, s, (n + 1) * a + 50, [8]),
            r.fill(),
            (r.globalAlpha = 1),
            (r.fillStyle = "#888"),
            (r.font = "14px Arial"),
            (r.textAlign = "left"),
            r.fillText("Graph Inputs", 20, 34),
            this.drawButton(s - 20, 20, 20, 20, "X", "#151515"))
        ) {
            this.closeSubgraph();
            return;
        }
        let o = 50;
        if (((r.font = "14px Arial"), t.inputs))
            for (let l = 0; l < t.inputs.length; ++l) {
                const c = t.inputs[l];
                if (!c.not_subgraph_input) {
                    if (this.drawButton(20, o + 2, s - 20, a - 2)) {
                        const u =
                            t.constructor.input_node_type || "graph/input";
                        this.graph.beforeChange();
                        const h = LiteGraph.createNode(u);
                        h
                            ? (e.add(h),
                              (this.block_click = !1),
                              (this.last_click_position = null),
                              this.selectNodes([h]),
                              (this.node_dragged = h),
                              (this.dragging_canvas = !1),
                              h.setProperty("name", c.name),
                              h.setProperty("type", c.type),
                              (this.node_dragged.pos[0] =
                                  this.graph_mouse[0] - 5),
                              (this.node_dragged.pos[1] =
                                  this.graph_mouse[1] - 5),
                              this.graph.afterChange())
                            : console.error("graph input node not found:", u);
                    }
                    (r.fillStyle = "#9C9"),
                        r.beginPath(),
                        r.arc(s - 16, o + a * 0.5, 5, 0, 2 * Math.PI),
                        r.fill(),
                        (r.fillStyle = "#AAA"),
                        r.fillText(c.name, 30, o + a * 0.75),
                        (r.fillStyle = "#777"),
                        r.fillText(c.type, 130, o + a * 0.75),
                        (o += a);
                }
            }
        this.drawButton(20, o + 2, s - 20, a - 2, "+", "#151515", "#222") &&
            this.showSubgraphPropertiesDialog(t);
    }
    drawSubgraphPanelRight(e, t, r) {
        const n = t.outputs ? t.outputs.length : 0,
            s = this.bgcanvas.width,
            a = 200,
            o = Math.floor(LiteGraph.NODE_SLOT_HEIGHT * 1.6);
        (r.fillStyle = "#111"),
            (r.globalAlpha = 0.8),
            r.beginPath(),
            r.roundRect(s - a - 10, 10, a, (n + 1) * o + 50, [8]),
            r.fill(),
            (r.globalAlpha = 1),
            (r.fillStyle = "#888"),
            (r.font = "14px Arial"),
            (r.textAlign = "left");
        const l = "Graph Outputs",
            c = r.measureText(l).width;
        if (
            (r.fillText(l, s - c - 20, 34),
            this.drawButton(s - a, 20, 20, 20, "X", "#151515"))
        ) {
            this.closeSubgraph();
            return;
        }
        let u = 50;
        if (((r.font = "14px Arial"), t.outputs))
            for (let h = 0; h < t.outputs.length; ++h) {
                const f = t.outputs[h];
                if (!f.not_subgraph_input) {
                    if (this.drawButton(s - a, u + 2, a - 20, o - 2)) {
                        const d =
                            t.constructor.output_node_type || "graph/output";
                        this.graph.beforeChange();
                        const p = LiteGraph.createNode(d);
                        p
                            ? (e.add(p),
                              (this.block_click = !1),
                              (this.last_click_position = null),
                              this.selectNodes([p]),
                              (this.node_dragged = p),
                              (this.dragging_canvas = !1),
                              p.setProperty("name", f.name),
                              p.setProperty("type", f.type),
                              (this.node_dragged.pos[0] =
                                  this.graph_mouse[0] - 5),
                              (this.node_dragged.pos[1] =
                                  this.graph_mouse[1] - 5),
                              this.graph.afterChange())
                            : console.error("graph input node not found:", d);
                    }
                    (r.fillStyle = "#9C9"),
                        r.beginPath(),
                        r.arc(s - a + 16, u + o * 0.5, 5, 0, 2 * Math.PI),
                        r.fill(),
                        (r.fillStyle = "#AAA"),
                        r.fillText(f.name, s - a + 30, u + o * 0.75),
                        (r.fillStyle = "#777"),
                        r.fillText(f.type, s - a + 130, u + o * 0.75),
                        (u += o);
                }
            }
        this.drawButton(s - a, u + 2, a - 20, o - 2, "+", "#151515", "#222") &&
            this.showSubgraphPropertiesDialogRight(t);
    }
    //Draws a button into the canvas overlay and computes if it was clicked using the immediate gui paradigm
    drawButton(e, t, r, n, s, a, o, l) {
        const c = this.ctx;
        (a = a || LiteGraph.NODE_DEFAULT_COLOR),
            (o = o || "#555"),
            (l = l || LiteGraph.NODE_TEXT_COLOR);
        let u = this.ds.convertOffsetToCanvas(this.graph_mouse);
        const h = LiteGraph.isInsideRectangle(u[0], u[1], e, t, r, n);
        if (
            ((u = this.last_click_position
                ? [this.last_click_position[0], this.last_click_position[1]]
                : null),
            u)
        ) {
            const p = this.canvas.getBoundingClientRect();
            (u[0] -= p.left), (u[1] -= p.top);
        }
        const f = u && LiteGraph.isInsideRectangle(u[0], u[1], e, t, r, n);
        (c.fillStyle = h ? o : a),
            f && (c.fillStyle = "#AAA"),
            c.beginPath(),
            c.roundRect(e, t, r, n, [4]),
            c.fill(),
            s != null &&
                s.constructor == String &&
                ((c.fillStyle = l),
                (c.textAlign = "center"),
                (c.font = ((n * 0.65) | 0) + "px Arial"),
                c.fillText(s, e + r * 0.5, t + n * 0.75),
                (c.textAlign = "left"));
        const d = f && !this.block_click;
        return f && this.blockClick(), d;
    }
    isAreaClicked(e, t, r, n, s) {
        let a = this.mouse;
        LiteGraph.isInsideRectangle(a[0], a[1], e, t, r, n),
            (a = this.last_click_position);
        const o = a && LiteGraph.isInsideRectangle(a[0], a[1], e, t, r, n),
            l = o && !this.block_click;
        return o && s && this.blockClick(), l;
    }
    /**
     * draws some useful stats in the corner of the canvas
     * @method renderInfo
     **/
    renderInfo(e, t, r) {
        var a, o;
        (t = t || 10), (r = r || this.canvas.height - 80);
        const n = ((a = this.visible_nodes) == null ? void 0 : a.length) || 0,
            s = ((o = this.graph._nodes) == null ? void 0 : o.length) || 0;
        e.save(),
            e.translate(t, r),
            (e.font = "10px Arial"),
            (e.fillStyle = "#888"),
            (e.textAlign = "left"),
            this.graph
                ? (e.fillText(
                      "T: " + this.graph.globaltime.toFixed(2) + "s",
                      5,
                      13 * 1
                  ),
                  e.fillText("I: " + this.graph.iteration, 5, 13 * 2),
                  e.fillText("N: " + s + " [" + n + "]", 5, 13 * 3),
                  e.fillText("V: " + this.graph._version, 5, 13 * 4),
                  e.fillText("FPS:" + this.fps.toFixed(2), 5, 13 * 5))
                : e.fillText("No graph selected", 5, 13 * 1),
            e.restore();
    }
    /**
     * draws the back canvas (the one containing the background and the connections)
     * @method drawBackCanvas
     **/
    drawBackCanvas() {
        const e = this.bgcanvas;
        (e.width != this.canvas.width || e.height != this.canvas.height) &&
            ((e.width = this.canvas.width), (e.height = this.canvas.height)),
            this.bgctx || (this.bgctx = this.bgcanvas.getContext("2d"));
        const t = this.bgctx;
        t.start && t.start();
        const r = this.viewport || [0, 0, t.canvas.width, t.canvas.height];
        if (
            (this.clear_background && t.clearRect(r[0], r[1], r[2], r[3]),
            this._graph_stack && this._graph_stack.length)
        ) {
            t.save(), this._graph_stack[this._graph_stack.length - 1];
            const s = this.graph._subgraph_node;
            (t.strokeStyle = s.bgcolor),
                (t.lineWidth = 10),
                t.strokeRect(1, 1, e.width - 2, e.height - 2),
                (t.lineWidth = 1),
                (t.font = "40px Arial"),
                (t.textAlign = "center"),
                (t.fillStyle = s.bgcolor || "#AAA");
            let a = "";
            for (let o = 1; o < this._graph_stack.length; ++o)
                a += this._graph_stack[o]._subgraph_node.getTitle() + " >> ";
            t.fillText(a + s.getTitle(), e.width * 0.5, 40), t.restore();
        }
        let n = !1;
        if (
            (this.onRenderBackground && (n = this.onRenderBackground(e, t)),
            this.viewport || (t.restore(), t.setTransform(1, 0, 0, 1, 0, 0)),
            (this.visible_links.length = 0),
            this.graph)
        ) {
            if (
                (t.save(),
                this.ds.toCanvasContext(t),
                this.ds.scale < 1.5 &&
                    !n &&
                    this.clear_background_color &&
                    ((t.fillStyle = this.clear_background_color),
                    t.fillRect(
                        this.visible_area[0],
                        this.visible_area[1],
                        this.visible_area[2],
                        this.visible_area[3]
                    )),
                this.background_image && this.ds.scale > 0.5 && !n)
            ) {
                if (
                    (this.zoom_modify_alpha
                        ? (t.globalAlpha =
                              (1 - 0.5 / this.ds.scale) * this.editor_alpha)
                        : (t.globalAlpha = this.editor_alpha),
                    (t.imageSmoothingEnabled = t.imageSmoothingEnabled = !1),
                    !this._bg_img || this._bg_img.name != this.background_image)
                ) {
                    (this._bg_img = new Image()),
                        (this._bg_img.name = this.background_image),
                        (this._bg_img.src = this.background_image);
                    const a = this;
                    this._bg_img.onload = function () {
                        a.draw(!0, !0);
                    };
                }
                let s = null;
                this._pattern == null && this._bg_img.width > 0
                    ? ((s = t.createPattern(this._bg_img, "repeat")),
                      (this._pattern_img = this._bg_img),
                      (this._pattern = s))
                    : (s = this._pattern),
                    s &&
                        ((t.fillStyle = s),
                        t.fillRect(
                            this.visible_area[0],
                            this.visible_area[1],
                            this.visible_area[2],
                            this.visible_area[3]
                        ),
                        (t.fillStyle = "transparent")),
                    (t.globalAlpha = 1),
                    (t.imageSmoothingEnabled = t.imageSmoothingEnabled = !0);
            }
            this.graph._groups.length &&
                !this.live_mode &&
                this.drawGroups(e, t),
                this.onDrawBackground &&
                    this.onDrawBackground(t, this.visible_area),
                this.onBackgroundRender &&
                    (console.error(
                        "WARNING! onBackgroundRender deprecated, now is named onDrawBackground "
                    ),
                    (this.onBackgroundRender = null)),
                this.render_canvas_border &&
                    ((t.strokeStyle = "#235"),
                    t.strokeRect(0, 0, e.width, e.height)),
                this.render_connections_shadows
                    ? ((t.shadowColor = "#000"),
                      (t.shadowOffsetX = 0),
                      (t.shadowOffsetY = 0),
                      (t.shadowBlur = 6))
                    : (t.shadowColor = "rgba(0,0,0,0)"),
                this.live_mode || this.drawConnections(t),
                (t.shadowColor = "rgba(0,0,0,0)"),
                t.restore();
        }
        t.finish && t.finish(),
            (this.dirty_bgcanvas = !1),
            (this.dirty_canvas = !0);
    }
    /**
     * draws the given node inside the canvas
     * @method drawNode
     **/
    drawNode(e, t) {
        var E;
        const r = new Float32Array(2);
        this.current_node = e;
        const n =
            e.color || e.constructor.color || LiteGraph.NODE_DEFAULT_COLOR;
        let s =
            e.bgcolor ||
            e.constructor.bgcolor ||
            LiteGraph.NODE_DEFAULT_BGCOLOR;
        e.mouseOver;
        const a = this.ds.scale < 0.6;
        if (this.live_mode) {
            e.flags.collapsed ||
                ((t.shadowColor = "transparent"),
                e.onDrawForeground && e.onDrawForeground(t, this, this.canvas));
            return;
        }
        const o = this.editor_alpha;
        if (
            ((t.globalAlpha = o),
            this.render_shadows && !a
                ? ((t.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR),
                  (t.shadowOffsetX = 2 * this.ds.scale),
                  (t.shadowOffsetY = 2 * this.ds.scale),
                  (t.shadowBlur = 3 * this.ds.scale))
                : (t.shadowColor = "transparent"),
            e.flags.collapsed &&
                e.onDrawCollapsed &&
                e.onDrawCollapsed(t, this) == !0)
        )
            return;
        const l = e._shape || LiteGraph.BOX_SHAPE,
            c = r;
        r.set(e.size);
        const u = e.horizontal;
        if (e.flags.collapsed) {
            t.font = this.inner_text_font;
            const m = e.getTitle ? e.getTitle() : e.title;
            m != null &&
                ((e._collapsed_width = Math.min(
                    e.size[0],
                    t.measureText(m).width + LiteGraph.NODE_TITLE_HEIGHT * 2
                )),
                (c[0] = e._collapsed_width),
                (c[1] = 0));
        }
        e.clip_area &&
            (t.save(),
            t.beginPath(),
            l == LiteGraph.BOX_SHAPE
                ? t.rect(0, 0, c[0], c[1])
                : l == LiteGraph.ROUND_SHAPE
                ? t.roundRect(0, 0, c[0], c[1], [10])
                : l == LiteGraph.CIRCLE_SHAPE &&
                  t.arc(c[0] * 0.5, c[1] * 0.5, c[0] * 0.5, 0, Math.PI * 2),
            t.clip()),
            e.has_errors && (s = "red"),
            this.drawNodeShape(e, t, c, n, s, e.is_selected, e.mouseOver),
            (t.shadowColor = "transparent"),
            e.onDrawForeground && e.onDrawForeground(t, this, this.canvas),
            (t.textAlign = u ? "center" : "left"),
            (t.font = this.inner_text_font);
        const h = !a,
            f = this.connecting_output,
            d = this.connecting_input;
        t.lineWidth = 1;
        let p = 0;
        const _ = new Float32Array(2);
        if (e.flags.collapsed) {
            if (this.render_collapsed_slots) {
                let m = null,
                    b = null;
                if (e.inputs)
                    for (let L = 0; L < e.inputs.length; L++) {
                        const T = e.inputs[L];
                        if (T.link != null) {
                            m = T;
                            break;
                        }
                    }
                if (e.outputs)
                    for (let L = 0; L < e.outputs.length; L++) {
                        const T = e.outputs[L];
                        T.links && T.links.length && (b = T);
                    }
                if (m) {
                    let L = 0,
                        T = LiteGraph.NODE_TITLE_HEIGHT * -0.5;
                    u &&
                        ((L = e._collapsed_width * 0.5),
                        (T = -LiteGraph.NODE_TITLE_HEIGHT)),
                        (t.fillStyle = "#686"),
                        t.beginPath(),
                        m.type === LiteGraph.EVENT ||
                        m.shape === LiteGraph.BOX_SHAPE
                            ? t.rect(L - 7 + 0.5, T - 4, 14, 8)
                            : m.shape === LiteGraph.ARROW_SHAPE
                            ? (t.moveTo(L + 8, T),
                              t.lineTo(L - 4, T - 4),
                              t.lineTo(L - 4, T + 4),
                              t.closePath())
                            : t.arc(L, T, 4, 0, Math.PI * 2),
                        t.fill();
                }
                if (b) {
                    let L = e._collapsed_width,
                        T = LiteGraph.NODE_TITLE_HEIGHT * -0.5;
                    u && ((L = e._collapsed_width * 0.5), (T = 0)),
                        (t.fillStyle = "#686"),
                        (t.strokeStyle = "black"),
                        t.beginPath(),
                        b.type === LiteGraph.EVENT ||
                        b.shape === LiteGraph.BOX_SHAPE
                            ? t.rect(L - 7 + 0.5, T - 4, 14, 8)
                            : b.shape === LiteGraph.ARROW_SHAPE
                            ? (t.moveTo(L + 6, T),
                              t.lineTo(L - 6, T - 4),
                              t.lineTo(L - 6, T + 4),
                              t.closePath())
                            : t.arc(L, T, 4, 0, Math.PI * 2),
                        t.fill();
                }
            }
        } else {
            if (e.inputs)
                for (let m = 0; m < e.inputs.length; m++) {
                    const b = e.inputs[m],
                        L = b.type;
                    let T = b.shape;
                    (t.globalAlpha = o),
                        this.connecting_output &&
                            !LiteGraph.isValidConnection(b.type, f.type) &&
                            (t.globalAlpha = 0.4 * o),
                        (t.fillStyle =
                            b.link != null
                                ? b.color_on ||
                                  this.default_connection_color_byType[L] ||
                                  this.default_connection_color.input_on
                                : b.color_off ||
                                  this.default_connection_color_byTypeOff[L] ||
                                  this.default_connection_color_byType[L] ||
                                  this.default_connection_color.input_off);
                    const g = e.getConnectionPos(!0, m, _);
                    if (
                        ((g[0] -= e.pos[0]),
                        (g[1] -= e.pos[1]),
                        p < g[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5 &&
                            (p = g[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5),
                        t.beginPath(),
                        L == "array" && (T = LiteGraph.GRID_SHAPE),
                        b.type === LiteGraph.EVENT ||
                        b.shape === LiteGraph.BOX_SHAPE
                            ? u
                                ? t.rect(g[0] - 5 + 0.5, g[1] - 8 + 0.5, 10, 14)
                                : t.rect(g[0] - 6 + 0.5, g[1] - 5 + 0.5, 14, 10)
                            : T === LiteGraph.ARROW_SHAPE
                            ? (t.moveTo(g[0] + 8, g[1] + 0.5),
                              t.lineTo(g[0] - 4, g[1] + 6 + 0.5),
                              t.lineTo(g[0] - 4, g[1] - 6 + 0.5),
                              t.closePath())
                            : T === LiteGraph.GRID_SHAPE
                            ? (t.rect(g[0] - 4, g[1] - 4, 2, 2),
                              t.rect(g[0] - 1, g[1] - 4, 2, 2),
                              t.rect(g[0] + 2, g[1] - 4, 2, 2),
                              t.rect(g[0] - 4, g[1] - 1, 2, 2),
                              t.rect(g[0] - 1, g[1] - 1, 2, 2),
                              t.rect(g[0] + 2, g[1] - 1, 2, 2),
                              t.rect(g[0] - 4, g[1] + 2, 2, 2),
                              t.rect(g[0] - 1, g[1] + 2, 2, 2),
                              t.rect(g[0] + 2, g[1] + 2, 2, 2))
                            : a
                            ? t.rect(g[0] - 4, g[1] - 4, 8, 8)
                            : t.arc(g[0], g[1], 4, 0, Math.PI * 2),
                        t.fill(),
                        h)
                    ) {
                        const A = b.label != null ? b.label : b.name;
                        A &&
                            ((t.fillStyle = LiteGraph.NODE_TEXT_COLOR),
                            u || b.dir == LiteGraph.UP
                                ? t.fillText(A, g[0], g[1] - 10)
                                : this.options.useWebgl
                                ? t.fillText(A, g[0] + 10, g[1] + 2)
                                : t.fillText(A, g[0] + 10, g[1] + 5));
                    }
                }
            if (
                ((t.textAlign = u ? "center" : "right"),
                (t.strokeStyle = "black"),
                e.outputs)
            )
                for (let m = 0; m < e.outputs.length; m++) {
                    const b = e.outputs[m],
                        L = b.type;
                    let T = b.shape;
                    this.connecting_input &&
                        !LiteGraph.isValidConnection(L, d.type) &&
                        (t.globalAlpha = 0.4 * o);
                    const g = e.getConnectionPos(!1, m, _);
                    (g[0] -= e.pos[0]),
                        (g[1] -= e.pos[1]),
                        p < g[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5 &&
                            (p = g[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5),
                        (t.fillStyle =
                            b.links && b.links.length
                                ? b.color_on ||
                                  this.default_connection_color_byType[L] ||
                                  this.default_connection_color.output_on
                                : b.color_off ||
                                  this.default_connection_color_byTypeOff[L] ||
                                  this.default_connection_color_byType[L] ||
                                  this.default_connection_color.output_off),
                        t.beginPath(),
                        L == "array" && (T = LiteGraph.GRID_SHAPE);
                    let A = !0;
                    if (
                        (L === LiteGraph.EVENT || T === LiteGraph.BOX_SHAPE
                            ? u
                                ? t.rect(g[0] - 5 + 0.5, g[1] - 8 + 0.5, 10, 14)
                                : t.rect(g[0] - 6 + 0.5, g[1] - 5 + 0.5, 14, 10)
                            : T === LiteGraph.ARROW_SHAPE
                            ? (t.moveTo(g[0] + 8, g[1] + 0.5),
                              t.lineTo(g[0] - 4, g[1] + 6 + 0.5),
                              t.lineTo(g[0] - 4, g[1] - 6 + 0.5),
                              t.closePath())
                            : T === LiteGraph.GRID_SHAPE
                            ? (t.rect(g[0] - 4, g[1] - 4, 2, 2),
                              t.rect(g[0] - 1, g[1] - 4, 2, 2),
                              t.rect(g[0] + 2, g[1] - 4, 2, 2),
                              t.rect(g[0] - 4, g[1] - 1, 2, 2),
                              t.rect(g[0] - 1, g[1] - 1, 2, 2),
                              t.rect(g[0] + 2, g[1] - 1, 2, 2),
                              t.rect(g[0] - 4, g[1] + 2, 2, 2),
                              t.rect(g[0] - 1, g[1] + 2, 2, 2),
                              t.rect(g[0] + 2, g[1] + 2, 2, 2),
                              (A = !1))
                            : a
                            ? t.rect(g[0] - 4, g[1] - 4, 8, 8)
                            : t.arc(g[0], g[1], 4, 0, Math.PI * 2),
                        t.fill(),
                        !a && A && t.stroke(),
                        h)
                    ) {
                        const G = b.label != null ? b.label : b.name;
                        if (G)
                            if (
                                ((t.fillStyle = LiteGraph.NODE_TEXT_COLOR),
                                u || b.dir == LiteGraph.DOWN)
                            )
                                t.fillText(G, g[0], g[1] - 8);
                            else if (this.options.useWebgl) {
                                t.textBaseline = "middle";
                                const M =
                                    ((E = t.measureText(G)) == null
                                        ? void 0
                                        : E.width) || 0;
                                t.fillText(G, g[0] - M - 10, g[1] + 2);
                            } else t.fillText(G, g[0] - 10, g[1] + 5);
                    }
                }
            if (((t.textAlign = "left"), (t.globalAlpha = 1), e.widgets)) {
                let m = p;
                (u || e.widgets_up) && (m = 2),
                    e.widgets_start_y != null && (m = e.widgets_start_y),
                    this.drawNodeWidgets(
                        e,
                        m,
                        t,
                        this.node_widget && this.node_widget[0] == e
                            ? this.node_widget[1]
                            : null
                    );
            }
        }
        e.clip_area && t.restore(), (t.globalAlpha = 1);
    }
    //used by this.over_link_center
    drawLinkTooltip(e, t) {
        const r = t._pos;
        if (
            ((e.fillStyle = "black"),
            e.beginPath(),
            e.arc(r[0], r[1], 3, 0, Math.PI * 2),
            e.fill(),
            t.data == null ||
                (this.onDrawLinkTooltip &&
                    this.onDrawLinkTooltip(e, t, this) == !0))
        )
            return;
        const n = t.data;
        let s = null;
        if (
            (n.constructor === Number
                ? (s = n.toFixed(2))
                : n.constructor === String
                ? (s = '"' + n + '"')
                : n.constructor === Boolean
                ? (s = String(n))
                : n.toToolTip
                ? (s = n.toToolTip())
                : (s = "[" + n.constructor.name + "]"),
            s == null)
        )
            return;
        (s = s.substr(0, 30)), (e.font = "14px Courier New");
        const o = e.measureText(s).width + 20,
            l = 24;
        (e.shadowColor = "black"),
            (e.shadowOffsetX = 2),
            (e.shadowOffsetY = 2),
            (e.shadowBlur = 3),
            (e.fillStyle = "#454"),
            e.beginPath(),
            e.roundRect(r[0] - o * 0.5, r[1] - 15 - l, o, l, [3]),
            e.moveTo(r[0] - 10, r[1] - 15),
            e.lineTo(r[0] + 10, r[1] - 15),
            e.lineTo(r[0], r[1] - 5),
            e.fill(),
            (e.shadowColor = "transparent"),
            (e.textAlign = "center"),
            (e.fillStyle = "#CEC"),
            e.fillText(s, r[0], r[1] - 15 - l * 0.3);
    }
    /**
     * draws the shape of the given node in the canvas
     * @method drawNodeShape
     **/
    drawNodeShape(e, t, r, n, s, a, o) {
        const l = new Float32Array(4);
        (t.strokeStyle = n), (t.fillStyle = s);
        const c = LiteGraph.NODE_TITLE_HEIGHT,
            u = this.ds.scale < 0.5,
            h = e._shape || e.constructor.shape || LiteGraph.ROUND_SHAPE,
            f = e.constructor.title_mode;
        let d = !0;
        f == LiteGraph.TRANSPARENT_TITLE || f == LiteGraph.NO_TITLE
            ? (d = !1)
            : f == LiteGraph.AUTOHIDE_TITLE && o && (d = !0);
        const p = l;
        (p[0] = 0),
            (p[1] = d ? -c : 0),
            (p[2] = r[0] + 1),
            (p[3] = d ? r[1] + c : r[1]);
        const _ = t.globalAlpha;
        if (
            (t.beginPath(),
            h == LiteGraph.BOX_SHAPE || u
                ? t.fillRect(p[0], p[1], p[2], p[3])
                : h == LiteGraph.ROUND_SHAPE || h == LiteGraph.CARD_SHAPE
                ? t.roundRect(
                      p[0],
                      p[1],
                      p[2],
                      p[3],
                      h == LiteGraph.CARD_SHAPE
                          ? [this.round_radius, this.round_radius, 0, 0]
                          : [this.round_radius]
                  )
                : h == LiteGraph.CIRCLE_SHAPE &&
                  t.arc(r[0] * 0.5, r[1] * 0.5, r[0] * 0.5, 0, Math.PI * 2),
            t.fill(),
            !e.flags.collapsed &&
                d &&
                ((t.shadowColor = "transparent"),
                (t.fillStyle = "rgba(0,0,0,0.2)"),
                t.fillRect(0, -1, p[2], 2)),
            (t.shadowColor = "transparent"),
            e.onDrawBackground &&
                e.onDrawBackground(t, this, this.canvas, this.graph_mouse),
            d || f == LiteGraph.TRANSPARENT_TITLE)
        ) {
            if (e.onDrawTitleBar) e.onDrawTitleBar(t, c, r, this.ds.scale, n);
            else if (
                f != LiteGraph.TRANSPARENT_TITLE &&
                (e.constructor.title_color || this.render_title_colored)
            ) {
                const b = e.constructor.title_color || n;
                if (
                    (e.flags.collapsed &&
                        (t.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR),
                    this.use_gradients)
                ) {
                    let L = _LGraphCanvas.gradients[b];
                    L ||
                        ((L = _LGraphCanvas.gradients[b] =
                            t.createLinearGradient(0, 0, 400, 0)),
                        L.addColorStop(0, b),
                        L.addColorStop(1, "#000")),
                        (t.fillStyle = L);
                } else t.fillStyle = b;
                t.beginPath(),
                    h == LiteGraph.BOX_SHAPE || u
                        ? t.rect(0, -c, r[0] + 1, c)
                        : (h == LiteGraph.ROUND_SHAPE ||
                              h == LiteGraph.CARD_SHAPE) &&
                          t.roundRect(
                              0,
                              -c,
                              r[0] + 1,
                              c,
                              e.flags.collapsed
                                  ? [this.round_radius]
                                  : [this.round_radius, this.round_radius, 0, 0]
                          ),
                    t.fill(),
                    (t.shadowColor = "transparent");
            }
            let E = !1;
            LiteGraph.node_box_coloured_by_mode &&
                LiteGraph.NODE_MODES_COLORS[e.mode] &&
                (E = LiteGraph.NODE_MODES_COLORS[e.mode]),
                LiteGraph.node_box_coloured_when_on &&
                    (E = e.action_triggered
                        ? "#FFF"
                        : e.execute_triggered
                        ? "#AAA"
                        : E);
            const m = 10;
            if (
                (e.onDrawTitleBox
                    ? e.onDrawTitleBox(t, c, r, this.ds.scale)
                    : h == LiteGraph.ROUND_SHAPE ||
                      h == LiteGraph.CIRCLE_SHAPE ||
                      h == LiteGraph.CARD_SHAPE
                    ? (u &&
                          ((t.fillStyle = "black"),
                          t.beginPath(),
                          t.arc(c * 0.5, c * -0.5, m * 0.5 + 1, 0, Math.PI * 2),
                          t.fill()),
                      (t.fillStyle =
                          e.boxcolor || E || LiteGraph.NODE_DEFAULT_BOXCOLOR),
                      u
                          ? t.fillRect(
                                c * 0.5 - m * 0.5,
                                c * -0.5 - m * 0.5,
                                m,
                                m
                            )
                          : (t.beginPath(),
                            t.arc(c * 0.5, c * -0.5, m * 0.5, 0, Math.PI * 2),
                            t.fill()))
                    : (u &&
                          ((t.fillStyle = "black"),
                          t.fillRect(
                              (c - m) * 0.5 - 1,
                              (c + m) * -0.5 - 1,
                              m + 2,
                              m + 2
                          )),
                      (t.fillStyle =
                          e.boxcolor || E || LiteGraph.NODE_DEFAULT_BOXCOLOR),
                      t.fillRect((c - m) * 0.5, (c + m) * -0.5, m, m)),
                (t.globalAlpha = _),
                e.onDrawTitleText &&
                    e.onDrawTitleText(
                        t,
                        c,
                        r,
                        this.ds.scale,
                        this.title_text_font,
                        a
                    ),
                !u)
            ) {
                t.font = this.title_text_font;
                const b = String(e.getTitle());
                b &&
                    (a
                        ? (t.fillStyle = LiteGraph.NODE_SELECTED_TITLE_COLOR)
                        : (t.fillStyle =
                              e.constructor.title_text_color ||
                              this.node_title_color),
                    e.flags.collapsed
                        ? ((t.textAlign = "left"),
                          t.measureText(b),
                          t.fillText(
                              b.substr(0, 20),
                              //avoid urls too long
                              c,
                              // + measure.width * 0.5,
                              LiteGraph.NODE_TITLE_TEXT_Y - c
                          ),
                          (t.textAlign = "left"))
                        : ((t.textAlign = "left"),
                          t.fillText(b, c, LiteGraph.NODE_TITLE_TEXT_Y - c)));
            }
            if (!e.flags.collapsed && e.subgraph && !e.skip_subgraph_button) {
                const b = LiteGraph.NODE_TITLE_HEIGHT,
                    L = e.size[0] - b,
                    T = LiteGraph.isInsideRectangle(
                        this.graph_mouse[0] - e.pos[0],
                        this.graph_mouse[1] - e.pos[1],
                        L + 2,
                        -b + 2,
                        b - 4,
                        b - 4
                    );
                (t.fillStyle = T ? "#888" : "#555"),
                    h == LiteGraph.BOX_SHAPE || u
                        ? t.fillRect(L + 2, -b + 2, b - 4, b - 4)
                        : (t.beginPath(),
                          t.roundRect(L + 2, -b + 2, b - 4, b - 4, [4]),
                          t.fill()),
                    (t.fillStyle = "#333"),
                    t.beginPath(),
                    t.moveTo(L + b * 0.2, -b * 0.6),
                    t.lineTo(L + b * 0.8, -b * 0.6),
                    t.lineTo(L + b * 0.5, -b * 0.3),
                    t.fill();
            }
            e.onDrawTitle && e.onDrawTitle(t);
        }
        a &&
            (e.onBounding && e.onBounding(p),
            f == LiteGraph.TRANSPARENT_TITLE && ((p[1] -= c), (p[3] += c)),
            (t.lineWidth = 1),
            (t.globalAlpha = 0.8),
            t.beginPath(),
            h == LiteGraph.BOX_SHAPE
                ? t.rect(-6 + p[0], -6 + p[1], 12 + p[2], 12 + p[3])
                : h == LiteGraph.ROUND_SHAPE ||
                  (h == LiteGraph.CARD_SHAPE && e.flags.collapsed)
                ? t.roundRect(-6 + p[0], -6 + p[1], 12 + p[2], 12 + p[3], [
                      this.round_radius * 2,
                  ])
                : h == LiteGraph.CARD_SHAPE
                ? t.roundRect(-6 + p[0], -6 + p[1], 12 + p[2], 12 + p[3], [
                      this.round_radius * 2,
                      2,
                      this.round_radius * 2,
                      2,
                  ])
                : h == LiteGraph.CIRCLE_SHAPE &&
                  t.arc(r[0] * 0.5, r[1] * 0.5, r[0] * 0.5 + 6, 0, Math.PI * 2),
            (t.strokeStyle = LiteGraph.NODE_BOX_OUTLINE_COLOR),
            t.stroke(),
            (t.strokeStyle = n),
            (t.globalAlpha = 1)),
            e.execute_triggered > 0 && e.execute_triggered--,
            e.action_triggered > 0 && e.action_triggered--;
    }
    /**
     * draws every connection visible in the canvas
     * OPTIMIZE THIS: pre-catch connections position instead of recomputing them every time
     * @method drawConnections
     **/
    drawConnections(e) {
        const t = new Float32Array(4),
            r = new Float32Array(4),
            n = new Float32Array(2),
            s = new Float32Array(2),
            a = LiteGraph.getTime(),
            o = this.visible_area;
        (t[0] = o[0] - 20),
            (t[1] = o[1] - 20),
            (t[2] = o[2] + 40),
            (t[3] = o[3] + 40),
            (e.lineWidth = this.connections_width),
            (e.fillStyle = "#AAA"),
            (e.strokeStyle = "#AAA"),
            (e.globalAlpha = this.editor_alpha);
        const l = this.graph._nodes;
        for (let c = 0, u = l.length; c < u; ++c) {
            const h = l[c];
            if (!(!h.inputs || !h.inputs.length))
                for (let f = 0; f < h.inputs.length; ++f) {
                    const d = h.inputs[f];
                    if (!d || d.link == null) continue;
                    const p = d.link,
                        _ = this.graph.links[p];
                    if (!_) continue;
                    const E = this.graph.getNodeById(_.origin_id);
                    if (E == null) continue;
                    let m = _.origin_slot,
                        b = null;
                    m == -1
                        ? (b = [E.pos[0] + 10, E.pos[1] + 10])
                        : (b = E.getConnectionPos(!1, m, n));
                    const L = h.getConnectionPos(!0, f, s);
                    if (
                        ((r[0] = b[0]),
                        (r[1] = b[1]),
                        (r[2] = L[0] - b[0]),
                        (r[3] = L[1] - b[1]),
                        r[2] < 0 && ((r[0] += r[2]), (r[2] = Math.abs(r[2]))),
                        r[3] < 0 && ((r[1] += r[3]), (r[3] = Math.abs(r[3]))),
                        !LiteGraph.overlapBounding(r, t))
                    )
                        continue;
                    const T = E.outputs[m],
                        g = h.inputs[f];
                    if (!T || !g) continue;
                    const A =
                            T.dir ||
                            (E.horizontal ? LiteGraph.DOWN : LiteGraph.RIGHT),
                        G =
                            g.dir ||
                            (h.horizontal ? LiteGraph.UP : LiteGraph.LEFT);
                    if (this.ALWAYS_FLOW)
                        this.renderLink(e, b, L, _, !0, 1, "white", A, G);
                    else if (
                        (this.renderLink(e, b, L, _, !1, 0, null, A, G),
                        _ && _._last_time && a - _._last_time < 1e3)
                    ) {
                        const M = 2 - (a - _._last_time) * 2e-3,
                            N = e.globalAlpha;
                        (e.globalAlpha = N * M),
                            this.renderLink(e, b, L, _, !0, M, "white", A, G),
                            (e.globalAlpha = N);
                    }
                }
        }
        e.globalAlpha = 1;
    }
    showGrpPanel(e) {
        this.closePanels();
        const t = this.getCanvasWindow(),
            r = this,
            n = this.createPanel(e.title || "", {
                closable: !0,
                window: t,
                onOpen: function () {
                    r.NODEPANEL_IS_OPEN = !0;
                },
                onClose: function () {
                    (r.NODEPANEL_IS_OPEN = !1), (r.node_panel = null);
                },
            });
        (r.node_panel = n),
            (n.id = "node-panel"),
            (n.node = e),
            n.classList.add("settings");
        function s() {
            (n.content.innerHTML = ""),
                n.addHTML("<h4>속성</h4>", "panel-section");
            const a = (o, l) => {
                switch ((r.graph.beforeChange(e), r.saveUndoStack(), o)) {
                    case "Title":
                        e.title = l;
                        break;
                    case "Color":
                        _LGraphCanvas.node_colors[l]
                            ? (e.color =
                                  _LGraphCanvas.node_colors[l].groupcolor)
                            : console.warn("unexpected color: " + l);
                        break;
                    case "X":
                        e.move(parseInt(l) - e.pos[0], 0);
                        break;
                    case "Y":
                        e.move(0, parseInt(l) - e.pos[1]);
                        break;
                    case "넓이":
                        e.size[0] = parseInt(l);
                        break;
                    case "높이":
                        e.size[1] = parseInt(l);
                        break;
                }
                r.graph.afterChange(), (r.dirty_canvas = !0);
            };
            n.addWidget("string", "Title", e.title, {}, a),
                e.id && n.addWidget("string", "그룹 아이디", e.id, {}, a),
                e.status &&
                    n.addWidget(
                        "string",
                        "상태",
                        e.status,
                        { disabled: !0 },
                        a
                    ),
                n.addWidget("number", "X", e.pos[0], { min: 0 }, a),
                n.addWidget("number", "Y", e.pos[1], { min: 0 }, a),
                n.addWidget("number", "넓이", e.size[0], { min: 0 }, a),
                n.addWidget("number", "높이", e.size[1], { min: 0 }, a),
                n.addSeparator();
        }
        s(), this.canvas.parentNode.appendChild(n);
    }
    drawGuideLines(
        e,
        {
            roundX: t,
            roundY: r,
            roundWidth: n,
            roundHeight: s,
            otherRoundX: a,
            otherRoundY: o,
            otherRoundWidth: l,
            otherRoundHeight: c,
        }
    ) {
        l === n &&
            (e.beginPath(),
            e.moveTo(t, r - 10),
            e.lineTo(t, r + s + 10),
            e.stroke(),
            e.beginPath(),
            e.moveTo(t + +n, r - 10),
            e.lineTo(t + n, r + s + 10),
            e.stroke(),
            e.beginPath(),
            e.moveTo(a, o - 10),
            e.lineTo(a, o + c + 10),
            e.stroke(),
            e.beginPath(),
            e.moveTo(a + l, o - 10),
            e.lineTo(a + l, o + c + 10),
            e.stroke()),
            c === s &&
                (e.beginPath(),
                e.moveTo(t - 10, r),
                e.lineTo(t + n + 10, r),
                e.stroke(),
                e.beginPath(),
                e.moveTo(t - 10, r + s),
                e.lineTo(t + n + 10, r + s),
                e.stroke(),
                e.beginPath(),
                e.moveTo(a - 10, o),
                e.lineTo(a + l + 10, o),
                e.stroke(),
                e.beginPath(),
                e.moveTo(a - 10, o + c),
                e.lineTo(a + l + 10, o + c),
                e.stroke()),
            a === t &&
                (r < o
                    ? (e.beginPath(),
                      e.moveTo(t, r),
                      e.lineTo(a, o + c),
                      e.stroke())
                    : (e.beginPath(),
                      e.moveTo(a, o),
                      e.lineTo(t, r + s),
                      e.stroke())),
            a + l === t + n &&
                (r < o
                    ? (e.beginPath(),
                      e.moveTo(t + n, r),
                      e.lineTo(a + l, o + c),
                      e.stroke())
                    : (e.beginPath(),
                      e.moveTo(a + l, o),
                      e.lineTo(t + n, r + s),
                      e.stroke())),
            o === r &&
                (t < a
                    ? (e.beginPath(),
                      e.moveTo(t, r),
                      e.lineTo(a + l, o),
                      e.stroke())
                    : (e.beginPath(),
                      e.moveTo(a, o),
                      e.lineTo(t + n, r),
                      e.stroke())),
            o + c === r + s &&
                (t < a
                    ? (e.beginPath(),
                      e.moveTo(t, r + s),
                      e.lineTo(a + l, o + c),
                      e.stroke())
                    : (e.beginPath(),
                      e.moveTo(a, o + c),
                      e.lineTo(t + n, r + s),
                      e.stroke()));
    }
    drawGroups(e, t) {
        var n, s, a, o, l;
        if (!this.graph) return;
        const r = this.graph._groups;
        t.save(), (t.globalAlpha = 0.5 * this.editor_alpha);
        for (let c = 0; c < r.length; ++c) {
            const u = r[c];
            if (!LiteGraph.overlapBounding(this.visible_area, u._bounding))
                continue;
            const h = u._pos,
                f = u._size,
                d = u.color || _LGraphCanvas.node_colors.black.groupcolor;
            (t.fillStyle = d), (t.globalAlpha = 0.75), t.beginPath();
            const p = 10;
            (t.fillStyle = d || "#333"),
                t.beginPath(),
                t.moveTo(h[0] + p, h[1]),
                t.lineTo(h[0] + f[0] - p, h[1]),
                t.quadraticCurveTo(h[0] + f[0], h[1], h[0] + f[0], h[1] + p),
                t.lineTo(h[0] + f[0], h[1] + f[1] - p),
                t.quadraticCurveTo(
                    h[0] + f[0],
                    h[1] + f[1],
                    h[0] + f[0] - p,
                    h[1] + f[1]
                ),
                t.lineTo(h[0] + p, h[1] + f[1]),
                t.quadraticCurveTo(h[0], h[1] + f[1], h[0], h[1] + f[1] - p),
                t.lineTo(h[0], h[1] + p),
                t.quadraticCurveTo(h[0], h[1], h[0] + p, h[1]),
                t.closePath(),
                t.fill(),
                this.read_only ||
                    ((t.fillStyle = "#0085FF"),
                    t.beginPath(),
                    t.moveTo(h[0] + f[0] - 7, h[1] + f[1]),
                    t.lineTo(h[0] + f[0], h[1] + f[1]),
                    t.lineTo(h[0] + f[0], h[1] + f[1] - 7),
                    t.closePath(),
                    t.fill());
            const _ = LiteGraph.DEFAULT_GROUP_FONT_SIZE || 20,
                E = u.font_size || _;
            if (
                ((t.fillStyle = "#ffffff"),
                (t.font = "Bold " + E + "px Arial"),
                (t.textAlign = "left"),
                t.fillText(u.title, h[0] + 12, h[1] + E + 8),
                !this.read_only)
            ) {
                const m = u.font_size * 0.6;
                (t.font = `${m}px Arial`), (t.fillStyle = "#c6c6c6");
                const b = `x/y/넓이/높이: ${parseInt(u.pos[0])}/${parseInt(
                    u.pos[1]
                )}/${parseInt(u.size[0])}/${parseInt(u.size[1])}`;
                let L = "";
                for (let T = 0; T < b.length; T++) {
                    const g = L + b[T] + "";
                    if (t.measureText(g).width > u.size[0] - 30 && T > 0) {
                        (L = L.slice(0, L.length - 2)), (L += " ..");
                        break;
                    } else L = g;
                }
                t.fillText(L, h[0] + 10, h[1] + u.size[1] - 12);
            }
            if (
                this.selected_group &&
                (u == null ? void 0 : u.id) !==
                    ((n = this.selected_group) == null ? void 0 : n.id) &&
                !this.read_only
            ) {
                (t.strokeStyle = "#c4c4c4"), (t.lineWidth = 1);
                const m =
                        (s = this.selected_group) == null ? void 0 : s.size[0],
                    b = (a = this.selected_group) == null ? void 0 : a.size[1],
                    L = (o = this.selected_group) == null ? void 0 : o.pos[0],
                    T = (l = this.selected_group) == null ? void 0 : l.pos[1],
                    g = u.size[0],
                    A = u.size[1],
                    G = u.pos[0],
                    M = u.pos[1],
                    N = Math.round(L),
                    I = Math.round(T),
                    B = Math.round(m),
                    O = Math.round(b),
                    F = Math.round(G),
                    P = Math.round(M),
                    C = Math.round(g),
                    U = Math.round(A);
                this.drawGuideLines(t, {
                    roundX: N,
                    roundY: I,
                    roundWidth: B,
                    roundHeight: O,
                    otherRoundX: F,
                    otherRoundY: P,
                    otherRoundWidth: C,
                    otherRoundHeight: U,
                });
            }
        }
        t.restore();
    }
    scaleFit() {
        this.canvas &&
            ((this.ds.scale = 1),
            (this.ds.max_scale = 1),
            (this.ds.min_scale = 1),
            window.innerWidth >= 3840 &&
                ((this.ds.scale = 2),
                (this.ds.max_scale = 2),
                (this.ds.min_scale = 2)));
    }
    /**
     * draws a link between two points
     * @method renderLink
     * @param {vec2} a start pos
     * @param {vec2} b end pos
     * @param {Object} link the link object with all the link info
     * @param {boolean} skip_border ignore the shadow of the link
     * @param {boolean} flow show flow animation (for events)
     * @param {string} color the color for the link
     * @param {number} start_dir the direction enum
     * @param {number} end_dir the direction enum
     * @param {number} num_sublines number of sublines (useful to represent vec3 or rgb)
     **/
    renderLink(e, t, r, n, s, a, o, l, c, u) {
        if (((o = "#3b3b3b"), n)) {
            const d = this.graph.getNodeById(n.origin_id),
                p = this.graph.getNodeById(n.target_id),
                _ = d.properties.status,
                E = p.properties.status,
                m = d.properties.resultIndex;
            typeof m == "number" &&
                n.origin_slot === m &&
                (_ === 1 && E === 1
                    ? (o = "#34c38f")
                    : _ === -1 || E === -1
                    ? (o = "#f46a6a")
                    : (_ === 0 || E === 0) && (o = "#3b3b3b"));
        }
        n && this.visible_links.push(n),
            !o && n && (o = n.color || _LGraphCanvas.link_type_colors[n.type]),
            o || (o = this.default_link_color),
            n != null && this.highlighted_links[n.id] && (o = "#FFF"),
            (l = l || LiteGraph.RIGHT),
            (c = c || LiteGraph.LEFT);
        const h = LiteGraph.distance(t, r);
        this.render_connections_border &&
            this.ds.scale > 0.6 &&
            (e.lineWidth = this.connections_width + 4),
            (e.lineJoin = "round"),
            (u = u || 1),
            u > 1 && (e.lineWidth = 0.5),
            e.beginPath();
        for (let d = 0; d < u; d += 1) {
            const p = (d - (u - 1) * 0.5) * 5;
            if (this.links_render_mode == LiteGraph.SPLINE_LINK) {
                e.moveTo(t[0], t[1] + p);
                let _ = 0,
                    E = 0,
                    m = 0,
                    b = 0;
                switch (l) {
                    case LiteGraph.LEFT:
                        _ = h * -0.25;
                        break;
                    case LiteGraph.RIGHT:
                        _ = h * 0.25;
                        break;
                    case LiteGraph.UP:
                        E = h * -0.25;
                        break;
                    case LiteGraph.DOWN:
                        E = h * 0.25;
                        break;
                }
                switch (c) {
                    case LiteGraph.LEFT:
                        m = h * -0.25;
                        break;
                    case LiteGraph.RIGHT:
                        m = h * 0.25;
                        break;
                    case LiteGraph.UP:
                        b = h * -0.25;
                        break;
                    case LiteGraph.DOWN:
                        b = h * 0.25;
                        break;
                }
                e.bezierCurveTo(
                    t[0] + _,
                    t[1] + E + p,
                    r[0] + m,
                    r[1] + b + p,
                    r[0],
                    r[1] + p
                );
            } else if (this.links_render_mode == LiteGraph.LINEAR_LINK) {
                e.moveTo(t[0], t[1] + p);
                let _ = 0,
                    E = 0,
                    m = 0,
                    b = 0;
                switch (l) {
                    case LiteGraph.LEFT:
                        _ = -1;
                        break;
                    case LiteGraph.RIGHT:
                        _ = 1;
                        break;
                    case LiteGraph.UP:
                        E = -1;
                        break;
                    case LiteGraph.DOWN:
                        E = 1;
                        break;
                }
                switch (c) {
                    case LiteGraph.LEFT:
                        m = -1;
                        break;
                    case LiteGraph.RIGHT:
                        m = 1;
                        break;
                    case LiteGraph.UP:
                        b = -1;
                        break;
                    case LiteGraph.DOWN:
                        b = 1;
                        break;
                }
                const L = 15;
                e.lineTo(t[0] + _ * L, t[1] + E * L + p),
                    e.lineTo(r[0] + m * L, r[1] + b * L + p),
                    e.lineTo(r[0], r[1] + p);
            } else if (this.links_render_mode == LiteGraph.STRAIGHT_LINK) {
                e.moveTo(t[0], t[1]);
                let _ = t[0],
                    E = t[1],
                    m = r[0],
                    b = r[1];
                l == LiteGraph.RIGHT ? (_ += 10) : (E += 10),
                    c == LiteGraph.LEFT ? (m -= 10) : (b -= 10),
                    e.lineTo(_, E),
                    e.lineTo((_ + m) * 0.5, E),
                    e.lineTo((_ + m) * 0.5, b),
                    e.lineTo(m, b),
                    e.lineTo(r[0], r[1]);
            } else return;
        }
        this.render_connections_border &&
            this.ds.scale > 0.6 &&
            !s &&
            ((e.strokeStyle = "rgba(0,0,0,0.5)"), e.stroke()),
            (e.lineWidth = this.connections_width),
            (e.fillStyle = e.strokeStyle = o),
            e.stroke();
        let f = this.computeConnectionPoint(t, r, 0.5, l, c);
        if (
            (n && n._pos && ((n._pos[0] = f[0]), (n._pos[1] = f[1])),
            this.ds.scale >= 0.6 &&
                this.highquality_render &&
                c != LiteGraph.CENTER &&
                !this.read_only)
        ) {
            if (this.render_connection_arrows) {
                const d = this.computeConnectionPoint(t, r, 0.25, l, c),
                    p = this.computeConnectionPoint(t, r, 0.26, l, c),
                    _ = this.computeConnectionPoint(t, r, 0.75, l, c),
                    E = this.computeConnectionPoint(t, r, 0.76, l, c);
                let m = 0,
                    b = 0;
                this.render_curved_connections
                    ? ((m = -Math.atan2(p[0] - d[0], p[1] - d[1])),
                      (b = -Math.atan2(E[0] - _[0], E[1] - _[1])))
                    : (b = m = r[1] > t[1] ? 0 : Math.PI),
                    e.save(),
                    e.translate(d[0], d[1]),
                    e.rotate(m),
                    e.beginPath(),
                    e.moveTo(-5, -3),
                    e.lineTo(0, 7),
                    e.lineTo(5, -3),
                    e.fill(),
                    e.restore(),
                    e.save(),
                    e.translate(_[0], _[1]),
                    e.rotate(b),
                    e.beginPath(),
                    e.moveTo(-5, -3),
                    e.lineTo(0, 7),
                    e.lineTo(5, -3),
                    e.fill(),
                    e.restore();
            }
            e.beginPath(), e.arc(f[0], f[1], 5, 0, Math.PI * 2), e.fill();
        }
        if (a) {
            e.fillStyle = o;
            for (let d = 0; d < 3; ++d) {
                let p = (LiteGraph.getTime() * 2e-4 + d * 0.2) % 1;
                if (this.links_render_mode === LiteGraph.STRAIGHT_LINK) {
                    let _ = t[0],
                        E = t[1],
                        m = r[0],
                        b = r[1];
                    l == LiteGraph.RIGHT
                        ? (_ += 10)
                        : l == LiteGraph.LEFT
                        ? (_ -= 10)
                        : l == LiteGraph.DOWN
                        ? (E += 10)
                        : l == LiteGraph.UP && (E -= 10),
                        c == LiteGraph.LEFT
                            ? (m -= 10)
                            : c == LiteGraph.RIGHT
                            ? (m += 10)
                            : c == LiteGraph.UP
                            ? (b -= 10)
                            : c == LiteGraph.DOWN && (b += 10);
                    const L = (_ + m) * 0.5,
                        T = Math.abs(L - _),
                        g = Math.abs(b - E),
                        A = Math.abs(m - L),
                        G = T + g + A,
                        M = p * G;
                    let N = [_, E];
                    if (M <= T) N = [_ + M * (_ < L ? 1 : -1), E];
                    else if (M <= T + g) {
                        const I = M - T;
                        E < b ? (N = [L, E + I]) : (N = [L, E - I]);
                    } else if (M <= G) {
                        const I = M - (T + g);
                        N = [L + I * (L < m ? 1 : -1), b];
                    }
                    e.beginPath(),
                        e.arc(N[0], N[1], 5, 0, 2 * Math.PI),
                        e.fill();
                } else f = this.computeConnectionPoint(t, r, p, l, c);
                e.beginPath(), e.arc(f[0], f[1], 5, 0, 2 * Math.PI), e.fill();
            }
        }
    }
    //returns the link center point based on curvature
    computeConnectionPoint(e, t, r, n, s) {
        (n = n || LiteGraph.RIGHT), (s = s || LiteGraph.LEFT);
        const a = LiteGraph.distance(e, t),
            o = e,
            l = [e[0], e[1]],
            c = [t[0], t[1]],
            u = t;
        switch (n) {
            case LiteGraph.LEFT:
                l[0] += a * -0.25;
                break;
            case LiteGraph.RIGHT:
                l[0] += a * 0.25;
                break;
            case LiteGraph.UP:
                l[1] += a * -0.25;
                break;
            case LiteGraph.DOWN:
                l[1] += a * 0.25;
                break;
        }
        switch (s) {
            case LiteGraph.LEFT:
                c[0] += a * -0.25;
                break;
            case LiteGraph.RIGHT:
                c[0] += a * 0.25;
                break;
            case LiteGraph.UP:
                c[1] += a * -0.25;
                break;
            case LiteGraph.DOWN:
                c[1] += a * 0.25;
                break;
        }
        const h = (1 - r) * (1 - r) * (1 - r),
            f = 3 * ((1 - r) * (1 - r)) * r,
            d = 3 * (1 - r) * (r * r),
            p = r * r * r,
            _ = h * o[0] + f * l[0] + d * c[0] + p * u[0],
            E = h * o[1] + f * l[1] + d * c[1] + p * u[1];
        return [_, E];
    }
    drawExecutionOrder(e) {
        (e.shadowColor = "transparent"),
            (e.globalAlpha = 0.25),
            (e.textAlign = "center"),
            (e.strokeStyle = "white"),
            (e.globalAlpha = 0.75);
        const t = this.visible_nodes;
        for (let r = 0; r < t.length; ++r) {
            const n = t[r];
            (e.fillStyle = "black"),
                e.fillRect(
                    n.pos[0] - LiteGraph.NODE_TITLE_HEIGHT,
                    n.pos[1] - LiteGraph.NODE_TITLE_HEIGHT,
                    LiteGraph.NODE_TITLE_HEIGHT,
                    LiteGraph.NODE_TITLE_HEIGHT
                ),
                n.order == 0 &&
                    e.strokeRect(
                        n.pos[0] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
                        n.pos[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
                        LiteGraph.NODE_TITLE_HEIGHT,
                        LiteGraph.NODE_TITLE_HEIGHT
                    ),
                (e.fillStyle = "#FFF"),
                e.fillText(
                    n.order,
                    n.pos[0] + LiteGraph.NODE_TITLE_HEIGHT * -0.5,
                    n.pos[1] - 6
                );
        }
        e.globalAlpha = 1;
    }
    /**
     * draws the widgets stored inside a node
     * @method drawNodeWidgets
     **/
    drawNodeWidgets(e, t, r, n) {
        if (!e.widgets || !e.widgets.length) return 0;
        const s = e.size[0],
            a = e.widgets;
        t += 2;
        const o = LiteGraph.NODE_WIDGET_HEIGHT,
            l = this.ds.scale > 0.5;
        r.save(), (r.globalAlpha = this.editor_alpha);
        const c = LiteGraph.WIDGET_OUTLINE_COLOR,
            u = LiteGraph.WIDGET_BGCOLOR,
            h = LiteGraph.WIDGET_TEXT_COLOR,
            f = LiteGraph.WIDGET_SECONDARY_TEXT_COLOR,
            d = 15;
        for (let p = 0; p < a.length; ++p) {
            let _ = a[p],
                E = t;
            _.y && (E = _.y),
                (_.last_y = E),
                (r.strokeStyle = c),
                (r.fillStyle = "#222"),
                (r.textAlign = "left"),
                _.disabled && (r.globalAlpha *= 0.5);
            const m = _.width || s;
            let b = _.options.max - _.options.min,
                L = (_.value - _.options.min) / b;
            switch (_.type) {
                case "button":
                    _.clicked &&
                        ((r.fillStyle = "#AAA"),
                        (_.clicked = !1),
                        (this.dirty_canvas = !0)),
                        r.fillRect(d, E, m - d * 2, o),
                        l && !_.disabled && r.strokeRect(d, E, m - d * 2, o),
                        l &&
                            ((r.textAlign = "center"),
                            (r.fillStyle = h),
                            r.fillText(
                                _.label || _.name,
                                m * 0.5,
                                E + o * 0.7
                            ));
                    break;
                case "toggle":
                    if (
                        ((r.textAlign = "left"),
                        (r.strokeStyle = c),
                        (r.fillStyle = u),
                        r.beginPath(),
                        l
                            ? r.roundRect(d, E, m - d * 2, o, [o * 0.5])
                            : r.rect(d, E, m - d * 2, o),
                        r.fill(),
                        l && !_.disabled && r.stroke(),
                        (r.fillStyle = _.value ? "#89A" : "#333"),
                        r.beginPath(),
                        r.arc(m - d * 2, E + o * 0.5, o * 0.36, 0, Math.PI * 2),
                        r.fill(),
                        l)
                    ) {
                        r.fillStyle = f;
                        const T = _.label || _.name;
                        T != null && r.fillText(T, d * 2, E + o * 0.7),
                            (r.fillStyle = _.value ? h : f),
                            (r.textAlign = "right"),
                            r.fillText(
                                _.value
                                    ? _.options.on || "true"
                                    : _.options.off || "false",
                                m - 40,
                                E + o * 0.7
                            );
                    }
                    break;
                case "slider":
                    if (
                        ((r.fillStyle = u),
                        r.fillRect(d, E, m - d * 2, o),
                        L < 0 && (L = 0),
                        L > 1 && (L = 1),
                        (r.fillStyle = Object.prototype.hasOwnProperty.call(
                            _.options,
                            "slider_color"
                        )
                            ? _.options.slider_color
                            : n == _
                            ? "#89A"
                            : "#678"),
                        r.fillRect(d, E, L * (m - d * 2), o),
                        l && !_.disabled && r.strokeRect(d, E, m - d * 2, o),
                        _.marker)
                    ) {
                        let T = (_.marker - _.options.min) / b;
                        T < 0 && (T = 0),
                            T > 1 && (T = 1),
                            (r.fillStyle = Object.prototype.hasOwnProperty.call(
                                _.options,
                                "marker_color"
                            )
                                ? _.options.marker_color
                                : "#AA9"),
                            r.fillRect(d + T * (m - d * 2), E, 2, o);
                    }
                    l &&
                        ((r.textAlign = "center"),
                        (r.fillStyle = h),
                        r.fillText(
                            _.label ||
                                _.name +
                                    "  " +
                                    Number(_.value).toFixed(
                                        _.options.precision != null
                                            ? _.options.precision
                                            : 3
                                    ),
                            m * 0.5,
                            E + o * 0.7
                        ));
                    break;
                case "number":
                case "combo":
                    if (
                        ((r.textAlign = "left"),
                        (r.strokeStyle = c),
                        (r.fillStyle = u),
                        r.beginPath(),
                        l
                            ? r.roundRect(d, E, m - d * 2, o, [o * 0.5])
                            : r.rect(d, E, m - d * 2, o),
                        r.fill(),
                        l)
                    )
                        if (
                            (_.disabled || r.stroke(),
                            (r.fillStyle = h),
                            _.disabled ||
                                (r.beginPath(),
                                r.moveTo(d + 16, E + 5),
                                r.lineTo(d + 6, E + o * 0.5),
                                r.lineTo(d + 16, E + o - 5),
                                r.fill(),
                                r.beginPath(),
                                r.moveTo(m - d - 16, E + 5),
                                r.lineTo(m - d - 6, E + o * 0.5),
                                r.lineTo(m - d - 16, E + o - 5),
                                r.fill()),
                            (r.fillStyle = f),
                            r.fillText(
                                _.label || _.name,
                                d * 2 + 5,
                                E + o * 0.7
                            ),
                            (r.fillStyle = h),
                            (r.textAlign = "right"),
                            _.type == "number")
                        )
                            r.fillText(
                                Number(_.value).toFixed(
                                    _.options.precision !== void 0
                                        ? _.options.precision
                                        : 3
                                ),
                                m - d * 2 - 20,
                                E + o * 0.7
                            );
                        else {
                            let T = _.value;
                            if (_.options.values) {
                                let g = _.options.values;
                                g.constructor === Function && (g = g()),
                                    g &&
                                        g.constructor !== Array &&
                                        (T = g[_.value]);
                            }
                            r.fillText(T, m - d * 2 - 20, E + o * 0.7);
                        }
                    break;
                case "string":
                case "text":
                    if (
                        ((r.textAlign = "left"),
                        (r.strokeStyle = c),
                        (r.fillStyle = u),
                        r.beginPath(),
                        l
                            ? r.roundRect(d, E, m - d * 2, o, [o * 0.5])
                            : r.rect(d, E, m - d * 2, o),
                        r.fill(),
                        l)
                    ) {
                        _.disabled || r.stroke(),
                            r.save(),
                            r.beginPath(),
                            r.rect(d, E, m - d * 2, o),
                            r.clip(),
                            (r.fillStyle = f);
                        const T = _.label || _.name;
                        T != null && r.fillText(T, d * 2, E + o * 0.7),
                            (r.fillStyle = h),
                            (r.textAlign = "right"),
                            r.fillText(
                                String(_.value).substr(0, 30),
                                m - d * 2,
                                E + o * 0.7
                            ),
                            r.restore();
                    }
                    break;
                default:
                    _.draw && _.draw(r, e, m, E, o);
                    break;
            }
            (t += (_.computeSize ? _.computeSize(m)[1] : o) + 4),
                (r.globalAlpha = this.editor_alpha);
        }
        r.restore(), (r.textAlign = "left");
    }
    /**
     * process an event on widgets
     * @method processNodeWidgets
     **/
    processNodeWidgets(node, pos, event, active_widget) {
        if (
            !node.widgets ||
            !node.widgets.length ||
            (!this.allow_interaction && !node.flags.allow_interaction)
        )
            return null;
        const x = pos[0] - node.pos[0],
            y = pos[1] - node.pos[1],
            width = node.size[0],
            deltaX = event.deltaX || event.deltax || 0,
            that = this,
            ref_window = this.getCanvasWindow();
        for (let i = 0; i < node.widgets.length; ++i) {
            const w = node.widgets[i];
            if (!w || w.disabled) continue;
            const widget_height = w.computeSize
                    ? w.computeSize(width)[1]
                    : LiteGraph.NODE_WIDGET_HEIGHT,
                widget_width = w.width || width;
            if (
                w != active_widget &&
                (x < 6 ||
                    x > widget_width - 12 ||
                    y < w.last_y ||
                    y > w.last_y + widget_height ||
                    w.last_y === void 0)
            )
                continue;
            const old_value = w.value;
            let _old_value = w.value,
                nvalue = clamp((x - 15) / (widget_width - 30), 0, 1);
            switch (w.type) {
                case "button":
                    event.type === LiteGraph.pointerevents_method + "down" &&
                        (w.callback &&
                            setTimeout(function () {
                                w.callback(w, that, node, pos, event);
                            }, 20),
                        (w.clicked = !0),
                        (this.dirty_canvas = !0));
                    break;
                case "slider":
                    if (w.options.read_only) break;
                    (w.value =
                        w.options.min +
                        (w.options.max - w.options.min) * nvalue),
                        _old_value != w.value &&
                            setTimeout(function () {
                                inner_value_change(w, w.value);
                            }, 20),
                        (this.dirty_canvas = !0);
                    break;
                case "number":
                case "combo":
                    if (
                        event.type == LiteGraph.pointerevents_method + "move" &&
                        w.type == "number"
                    )
                        deltaX &&
                            (w.value += deltaX * 0.1 * (w.options.step || 1)),
                            w.options.min != null &&
                                w.value < w.options.min &&
                                (w.value = w.options.min),
                            w.options.max != null &&
                                w.value > w.options.max &&
                                (w.value = w.options.max);
                    else if (
                        event.type ==
                        LiteGraph.pointerevents_method + "down"
                    ) {
                        let e = w.options.values;
                        e &&
                            e.constructor === Function &&
                            (e = w.options.values(w, node));
                        let t = null;
                        w.type != "number" &&
                            (t = e.constructor === Array ? e : Object.keys(e));
                        const r = x < 40 ? -1 : x > widget_width - 40 ? 1 : 0;
                        if (w.type == "number")
                            (w.value += r * 0.1 * (w.options.step || 1)),
                                w.options.min != null &&
                                    w.value < w.options.min &&
                                    (w.value = w.options.min),
                                w.options.max != null &&
                                    w.value > w.options.max &&
                                    (w.value = w.options.max);
                        else if (r) {
                            let n = -1;
                            (this.last_mouseclick = 0),
                                e.constructor === Object
                                    ? (n = t.indexOf(String(w.value)) + r)
                                    : (n = t.indexOf(w.value) + r),
                                n >= t.length && (n = t.length - 1),
                                n < 0 && (n = 0),
                                e.constructor === Array
                                    ? (w.value = e[n])
                                    : (w.value = n);
                        } else {
                            let s = function (a, o, l) {
                                return (
                                    e != t && (a = n.indexOf(a)),
                                    (this.value = a),
                                    inner_value_change(this, a),
                                    (that.dirty_canvas = !0),
                                    !1
                                );
                            };
                            const n = e != t ? Object.values(e) : e;
                            new ContextMenu(
                                n,
                                {
                                    scale: Math.max(1, this.ds.scale),
                                    event,
                                    className: "dark",
                                    callback: s.bind(w),
                                },
                                ref_window
                            );
                        }
                    } else if (
                        event.type == LiteGraph.pointerevents_method + "up" &&
                        w.type == "number"
                    ) {
                        const delta =
                            x < 40 ? -1 : x > widget_width - 40 ? 1 : 0;
                        event.click_time < 200 &&
                            delta == 0 &&
                            this.prompt(
                                "Value",
                                w.value,
                                function (v) {
                                    if (/^[0-9+\-*/()\s]+|\d+\.\d+$/.test(v))
                                        try {
                                            v = eval(v);
                                        } catch (e) {}
                                    (this.value = Number(v)),
                                        inner_value_change(this, this.value);
                                }.bind(w),
                                event
                            );
                    }
                    old_value != w.value &&
                        setTimeout(
                            function () {
                                inner_value_change(this, this.value);
                            }.bind(w),
                            20
                        ),
                        (this.dirty_canvas = !0);
                    break;
                case "toggle":
                    event.type == LiteGraph.pointerevents_method + "down" &&
                        ((w.value = !w.value),
                        setTimeout(function () {
                            inner_value_change(w, w.value);
                        }, 20));
                    break;
                case "string":
                case "text":
                    event.type == LiteGraph.pointerevents_method + "down" &&
                        this.prompt(
                            "Value",
                            w.value,
                            function (e) {
                                inner_value_change(this, e);
                            }.bind(w),
                            event,
                            w.options ? w.options.multiline : !1
                        );
                    break;
                default:
                    w.mouse &&
                        (this.dirty_canvas = w.mouse(event, [x, y], node));
                    break;
            }
            return (
                old_value != w.value &&
                    (node.onWidgetChanged &&
                        node.onWidgetChanged(w.name, w.value, old_value, w),
                    node.graph._version++),
                w
            );
        }
        function inner_value_change(e, t) {
            e.type == "number" && (t = Number(t)),
                (e.value = t),
                e.options &&
                    e.options.property &&
                    node.properties[e.options.property] !== void 0 &&
                    node.setProperty(e.options.property, t),
                e.callback && e.callback(e.value, that, node, pos, event);
        }
        return null;
    }
    /**
     * draws every group area in the background
     * @method drawGroups
     **/
    // drawGroups (canvas, ctx) {
    //     if (!this.graph) {
    //         return;
    //     }
    //     const groups = this.graph._groups;
    //     ctx.save();
    //     ctx.globalAlpha = 0.5 * this.editor_alpha;
    //     for (let i = 0; i < groups.length; ++i) {
    //         const group = groups[i];
    //         if (!LiteGraph.overlapBounding(this.visible_area, group._bounding)) {
    //             continue;
    //         } //out of the visible area
    //         ctx.fillStyle = group.color || "#335";
    //         ctx.strokeStyle = group.color || "#335";
    //         const pos = group._pos;
    //         const size = group._size;
    //         ctx.globalAlpha = 0.25 * this.editor_alpha;
    //         ctx.beginPath();
    //         ctx.rect(pos[0] + 0.5, pos[1] + 0.5, size[0], size[1]);
    //         ctx.fill();
    //         ctx.globalAlpha = this.editor_alpha;
    //         ctx.stroke();
    //         ctx.beginPath();
    //         ctx.moveTo(pos[0] + size[0], pos[1] + size[1]);
    //         ctx.lineTo(pos[0] + size[0] - 10, pos[1] + size[1]);
    //         ctx.lineTo(pos[0] + size[0], pos[1] + size[1] - 10);
    //         ctx.fill();
    //         const font_size =
    //             group.font_size || LiteGraph.DEFAULT_GROUP_FONT_SIZE;
    //         ctx.font = font_size + "px Arial";
    //         ctx.textAlign = "left";
    //         ctx.fillText(group.title, pos[0] + 4, pos[1] + font_size);
    //     }
    //     ctx.restore();
    // };
    adjustNodesSize() {
        const e = this.graph._nodes;
        for (let t = 0; t < e.length; ++t) e[t].size = e[t].computeSize();
        this.setDirty(!0, !0);
    }
    /**
     * resizes the canvas to a given size, if no size is passed, then it tries to fill the parentNode
     * @method resize
     **/
    resize(e, t) {
        if (!e && !t) {
            const r = this.canvas.parentNode;
            (e = r.offsetWidth), (t = r.offsetHeight);
        }
        (this.canvas.width == e && this.canvas.height == t) ||
            ((this.canvas.width = e),
            (this.canvas.height = t),
            (this.bgcanvas.width = this.canvas.width),
            (this.bgcanvas.height = this.canvas.height),
            this.setDirty(!0, !0));
    }
    /**
     * switches to live mode (node shapes are not rendered, only the content)
     * this feature was designed when graphs where meant to create user interfaces
     * @method switchLiveMode
     **/
    switchLiveMode(e) {
        if (!e) {
            (this.live_mode = !this.live_mode),
                (this.dirty_canvas = !0),
                (this.dirty_bgcanvas = !0);
            return;
        }
        const t = this,
            r = this.live_mode ? 1.1 : 0.9;
        this.live_mode && ((this.live_mode = !1), (this.editor_alpha = 0.1));
        const n = setInterval(function () {
            (t.editor_alpha *= r),
                (t.dirty_canvas = !0),
                (t.dirty_bgcanvas = !0),
                r < 1 &&
                    t.editor_alpha < 0.01 &&
                    (clearInterval(n), r < 1 && (t.live_mode = !0)),
                r > 1 &&
                    t.editor_alpha > 0.99 &&
                    (clearInterval(n), (t.editor_alpha = 1));
        }, 1);
    }
    onNodeSelectionChange(e) {}
    /* this is an implementation for touch not in production and not ready
     */
    /*touchHandler(event) {
            //alert("foo");
            const touches = event.changedTouches,
                first = touches[0],
                type = "";
    
            switch (event.type) {
                case "touchstart":
                    type = "mousedown";
                    break;
                case "touchmove":
                    type = "mousemove";
                    break;
                case "touchend":
                    type = "mouseup";
                    break;
                default:
                    return;
            }
    
            //initMouseEvent(type, canBubble, cancelable, view, clickCount,
            //           screenX, screenY, clientX, clientY, ctrlKey,
            //           altKey, shiftKey, metaKey, button, relatedTarget);
    
            // this is eventually a Dom object, get the LGraphCanvas back
            if(typeof this.getCanvasWindow == "undefined"){
                const window = this.lgraphcanvas.getCanvasWindow();
            }else{
                const window = this.getCanvasWindow();
            }
            
            const document = window.document;
    
            const simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(
                type,
                true,
                true,
                window,
                1,
                first.screenX,
                first.screenY,
                first.clientX,
                first.clientY,
                false,
                false,
                false,
                false,
                0, //left
                null
            );
            first.target.dispatchEvent(simulatedEvent);
            event.preventDefault();
        }*/
    /* CONTEXT MENU ********************/
    static onGroupAdd(e, t, r) {
        const n = _LGraphCanvas.active_canvas;
        n.getCanvasWindow();
        const s = new LGraphGroup();
        (s.pos = n.convertEventToCanvasOffset(r)), n.graph.add(s);
    }
    /**
     * Determines the furthest nodes in each direction
     * @param nodes {LGraphNode[]} the nodes to from which boundary nodes will be extracted
     * @return {{left: LGraphNode, top: LGraphNode, right: LGraphNode, bottom: LGraphNode}}
     */
    static getBoundaryNodes(e) {
        let t = null,
            r = null,
            n = null,
            s = null;
        for (const a in e) {
            const o = e[a],
                [l, c] = o.pos,
                [u, h] = o.size;
            (t === null || c < t.pos[1]) && (t = o),
                (r === null || l + u > r.pos[0] + r.size[0]) && (r = o),
                (n === null || c + h > n.pos[1] + n.size[1]) && (n = o),
                (s === null || l < s.pos[0]) && (s = o);
        }
        return {
            top: t,
            right: r,
            bottom: n,
            left: s,
        };
    }
    /**
     * Determines the furthest nodes in each direction for the currently selected nodes
     * @return {{left: LGraphNode, top: LGraphNode, right: LGraphNode, bottom: LGraphNode}}
     */
    boundaryNodesForSelection() {
        return _LGraphCanvas.getBoundaryNodes(
            Object.values(this.selected_nodes)
        );
    }
    /**
     *
     * @param {LGraphNode[]} nodes a list of nodes
     * @param {"top"|"bottom"|"left"|"right"} direction Direction to align the nodes
     * @param {LGraphNode?} align_to Node to align to (if null, align to the furthest node in the given direction)
     */
    static alignNodes(e, t, r) {
        if (!e) return;
        const n = _LGraphCanvas.active_canvas;
        let s = [];
        r === void 0
            ? (s = _LGraphCanvas.getBoundaryNodes(e))
            : (s = {
                  top: r,
                  right: r,
                  bottom: r,
                  left: r,
              });
        for (const [a, o] of Object.entries(n.selected_nodes))
            switch (t) {
                case "right":
                    o.pos[0] = s.right.pos[0] + s.right.size[0] - o.size[0];
                    break;
                case "left":
                    o.pos[0] = s.left.pos[0];
                    break;
                case "top":
                    o.pos[1] = s.top.pos[1];
                    break;
                case "bottom":
                    o.pos[1] = s.bottom.pos[1] + s.bottom.size[1] - o.size[1];
                    break;
            }
        (n.dirty_canvas = !0), (n.dirty_bgcanvas = !0);
    }
    static onNodeAlign(e, t, r, n, s) {
        new ContextMenu(["Top", "Bottom", "Left", "Right"], {
            event: r,
            callback: a,
            parentMenu: n,
        });
        function a(o) {
            _LGraphCanvas.alignNodes(
                _LGraphCanvas.active_canvas.selected_nodes,
                o.toLowerCase(),
                s
            );
        }
    }
    static onGroupAlign(e, t, r, n) {
        new ContextMenu(["Top", "Bottom", "Left", "Right"], {
            event: r,
            callback: s,
            parentMenu: n,
        });
        function s(a) {
            _LGraphCanvas.alignNodes(
                _LGraphCanvas.active_canvas.selected_nodes,
                a.toLowerCase()
            );
        }
    }
    static onMenuAdd(e, t, r, n, s) {
        const a = _LGraphCanvas.active_canvas,
            o = a.getCanvasWindow(),
            l = a.graph;
        if (!l) return;
        function c(u, h) {
            const f = LiteGraph.getNodeTypesCategories(
                    a.filter || l.filter
                ).filter(function (_) {
                    return _.startsWith(u);
                }),
                d = [];
            f.map(function (_) {
                if (!_) return;
                const E = new RegExp("^(" + u + ")"),
                    m = _.replace(E, "").split("/")[0],
                    b = u === "" ? m + "/" : u + m + "/";
                let L = m;
                L.indexOf("::") != -1 && (L = L.split("::")[1]),
                    d.findIndex(function (g) {
                        return g.value === b;
                    }) === -1 &&
                        d.push({
                            value: b,
                            content: L,
                            has_submenu: !0,
                            callback: function (g, A, G, M) {
                                c(g.value, M);
                            },
                        });
            }),
                LiteGraph.getNodeTypesInCategory(
                    u.slice(0, -1),
                    a.filter || l.filter
                ).map(function (_) {
                    if (_.skip_list) return;
                    const E = {
                        value: _.type,
                        content: _.title,
                        has_submenu: !1,
                        callback: function (m, b, L, T) {
                            const g = T.getFirstEvent();
                            a.graph.beforeChange();
                            const A = LiteGraph.createNode(m.value);
                            A &&
                                ((A.pos = a.convertEventToCanvasOffset(g)),
                                a.graph.add(A)),
                                s && s(A),
                                a.graph.afterChange();
                        },
                    };
                    d.push(E);
                }),
                new ContextMenu(d, { event: r, parentMenu: h }, o);
        }
        return c("", n), !1;
    }
    static onMenuCollapseAll() {}
    static onMenuNodeEdit() {}
    static showMenuNodeOptionalInputs(e, t, r, n, s) {
        if (!s) return;
        const a = this,
            l = _LGraphCanvas.active_canvas.getCanvasWindow();
        let c = s.optional_inputs;
        s.onGetInputs && (c = s.onGetInputs());
        let u = [];
        if (c)
            for (let f = 0; f < c.length; f++) {
                const d = c[f];
                if (!d) {
                    u.push(null);
                    continue;
                }
                let p = d[0];
                d[2] || (d[2] = {}),
                    d[2].label && (p = d[2].label),
                    (d[2].removable = !0);
                const _ = { content: p, value: d };
                d[1] == LiteGraph.ACTION && (_.className = "event"), u.push(_);
            }
        if (s.onMenuNodeInputs) {
            const f = s.onMenuNodeInputs(u);
            f && (u = f);
        }
        if (!u.length) {
            console.log("no input entries");
            return;
        }
        new ContextMenu(
            u,
            {
                event: r,
                callback: h,
                parentMenu: n,
                node: s,
            },
            l
        );
        function h(f, d, p) {
            s &&
                (f.callback && f.callback.call(a, s, f, d, p),
                f.value &&
                    (s.graph.beforeChange(),
                    s.addInput(f.value[0], f.value[1], f.value[2]),
                    s.onNodeInputAdd && s.onNodeInputAdd(f.value),
                    s.setDirtyCanvas(!0, !0),
                    s.graph.afterChange()));
        }
        return !1;
    }
    static showMenuNodeOptionalOutputs(e, t, r, n, s) {
        if (!s) return;
        const a = this,
            l = _LGraphCanvas.active_canvas.getCanvasWindow();
        let c = s.optional_outputs;
        s.onGetOutputs && (c = s.onGetOutputs());
        let u = [];
        if (c)
            for (let f = 0; f < c.length; f++) {
                const d = c[f];
                if (!d) {
                    u.push(null);
                    continue;
                }
                if (
                    s.flags &&
                    s.flags.skip_repeated_outputs &&
                    s.findOutputSlot(d[0]) != -1
                )
                    continue;
                let p = d[0];
                d[2] || (d[2] = {}),
                    d[2].label && (p = d[2].label),
                    (d[2].removable = !0);
                const _ = { content: p, value: d };
                d[1] == LiteGraph.EVENT && (_.className = "event"), u.push(_);
            }
        if (
            (this.onMenuNodeOutputs && (u = this.onMenuNodeOutputs(u)),
            LiteGraph.do_add_triggers_slots &&
                s.findOutputSlot("onExecuted") == -1 &&
                u.push({
                    content: "On Executed",
                    value: ["onExecuted", LiteGraph.EVENT, { nameLocked: !0 }],
                    className: "event",
                }),
            s.onMenuNodeOutputs)
        ) {
            const f = s.onMenuNodeOutputs(u);
            f && (u = f);
        }
        if (!u.length) return;
        new ContextMenu(
            u,
            {
                event: r,
                callback: h,
                parentMenu: n,
                node: s,
            },
            l
        );
        function h(f, d, p) {
            if (!s || (f.callback && f.callback.call(a, s, f, d, p), !f.value))
                return;
            const _ = f.value[1];
            if (_ && (_.constructor === Object || _.constructor === Array)) {
                const E = [];
                for (const m in _) E.push({ content: m, value: _[m] });
                return (
                    new ContextMenu(E, {
                        event: d,
                        callback: h,
                        parentMenu: n,
                        node: s,
                    }),
                    !1
                );
            } else
                s.graph.beforeChange(),
                    s.addOutput(f.value[0], f.value[1], f.value[2]),
                    s.onNodeOutputAdd && s.onNodeOutputAdd(f.value),
                    s.setDirtyCanvas(!0, !0),
                    s.graph.afterChange();
        }
        return !1;
    }
    static onShowMenuNodeProperties(e, t, r, n, s) {
        if (!s || !s.properties) return;
        const a = _LGraphCanvas.active_canvas,
            o = a.getCanvasWindow(),
            l = [];
        for (const u in s.properties) {
            let h = s.properties[u] !== void 0 ? s.properties[u] : " ";
            typeof h == "object" && (h = JSON.stringify(h));
            const f = s.getPropertyInfo(u);
            (f.type == "enum" || f.type == "combo") &&
                (h = _LGraphCanvas.getPropertyPrintableValue(h, f.values)),
                (h = _LGraphCanvas.decodeHTML(h)),
                l.push({
                    content:
                        "<span class='property_name'>" +
                        (f.label ? f.label : u) +
                        "</span><span class='property_value'>" +
                        h +
                        "</span>",
                    value: u,
                });
        }
        if (!l.length) return;
        new ContextMenu(
            l,
            {
                event: r,
                callback: c,
                parentMenu: n,
                allow_html: !0,
                node: s,
            },
            o
        );
        function c(u, h, f, d) {
            if (!s) return;
            const p = this.getBoundingClientRect();
            a.showEditPropertyValue(s, u.value, {
                position: [p.left, p.top],
            });
        }
        return !1;
    }
    static decodeHTML(e) {
        const t = document.createElement("div");
        return (t.innerText = e), t.innerHTML;
    }
    static onMenuResizeNode(e, t, r, n, s) {
        if (!s) return;
        const a = function (l) {
                (l.size = l.computeSize()), l.onResize && l.onResize(l.size);
            },
            o = _LGraphCanvas.active_canvas;
        if (!o.selected_nodes || Object.keys(o.selected_nodes).length <= 1)
            a(s);
        else for (const l in o.selected_nodes) a(o.selected_nodes[l]);
        s.setDirtyCanvas(!0, !0);
    }
    static showLinkMenu(e, t) {
        const r = this,
            n = r.graph.getNodeById(e.origin_id),
            s = r.graph.getNodeById(e.target_id);
        let a = !1;
        n &&
            n.outputs &&
            n.outputs[e.origin_slot] &&
            (a = n.outputs[e.origin_slot].type);
        let o = !1;
        s &&
            s.outputs &&
            s.outputs[e.target_slot] &&
            (o = s.inputs[e.target_slot].type);
        const l = ["Add Node", null, "Delete", null],
            c = new ContextMenu(l, {
                event: t,
                title: e.data != null ? e.data.constructor.name : null,
                callback: u,
            });
        function u(h, f, d) {
            switch (h) {
                case "Add Node":
                    _LGraphCanvas.onMenuAdd(null, null, d, c, function (p) {
                        !p.inputs ||
                            !p.inputs.length ||
                            !p.outputs ||
                            !p.outputs.length ||
                            (n.connectByType(e.origin_slot, p, a) &&
                                (p.connectByType(e.target_slot, s, o),
                                (p.pos[0] -= p.size[0] * 0.5)));
                    });
                    break;
                case "Delete":
                    r.graph.removeLink(e.id);
                    break;
            }
        }
        return !1;
    }
    createDefaultNodeForSlot(e) {
        const r = Object.assign(
                {
                    nodeFrom: null,
                    // input
                    slotFrom: null,
                    // input
                    nodeTo: null,
                    // output
                    slotTo: null,
                    // output
                    position: [],
                    // pass the event coords
                    nodeType: null,
                    // choose a nodetype to add, AUTO to set at first good
                    posAdd: [0, 0],
                    // adjust x,y
                    posSizeFix: [0, 0],
                    // alpha, adjust the position x,y based on the new node size w,h
                },
                e || {}
            ),
            n = this,
            s = r.nodeFrom && r.slotFrom !== null,
            a = !s && r.nodeTo && r.slotTo !== null;
        if (!s && !a)
            return (
                console.warn(
                    "No data passed to createDefaultNodeForSlot " +
                        r.nodeFrom +
                        " " +
                        r.slotFrom +
                        " " +
                        r.nodeTo +
                        " " +
                        r.slotTo
                ),
                !1
            );
        if (!r.nodeType)
            return console.warn("No type to createDefaultNodeForSlot"), !1;
        const o = s ? r.nodeFrom : r.nodeTo;
        let l = s ? r.slotFrom : r.slotTo,
            c = !1;
        switch (typeof l) {
            case "string":
                (c = s ? o.findOutputSlot(l, !1) : o.findInputSlot(l, !1)),
                    (l = s ? o.outputs[l] : o.inputs[l]);
                break;
            case "object":
                c = s ? o.findOutputSlot(l.name) : o.findInputSlot(l.name);
                break;
            case "number":
                (c = l), (l = s ? o.outputs[l] : o.inputs[l]);
                break;
            case "undefined":
            default:
                return console.warn("Cant get slot information " + l), !1;
        }
        (l === !1 || c === !1) &&
            console.warn("createDefaultNodeForSlot bad slotX " + l + " " + c);
        const u = l.type == LiteGraph.EVENT ? "_event_" : l.type,
            h = s
                ? LiteGraph.slot_types_default_out
                : LiteGraph.slot_types_default_in;
        if (h && h[u]) {
            l.link;
            let f = !1;
            if (typeof h[u] == "object" || Array.isArray(h[u])) {
                for (const d in h[u])
                    if (r.nodeType == h[u][d] || r.nodeType == "AUTO") {
                        f = h[u][d];
                        break;
                    }
            } else (r.nodeType == h[u] || r.nodeType == "AUTO") && (f = h[u]);
            if (f) {
                let d = !1;
                typeof f == "object" && f.node && ((d = f), (f = f.node));
                const p = LiteGraph.createNode(f);
                if (p) {
                    if (d) {
                        if (d.properties)
                            for (const _ in d.properties)
                                p.addProperty(_, d.properties[_]);
                        if (d.inputs) {
                            p.inputs = [];
                            for (const _ in d.inputs)
                                p.addOutput(d.inputs[_][0], d.inputs[_][1]);
                        }
                        if (d.outputs) {
                            p.outputs = [];
                            for (const _ in d.outputs)
                                p.addOutput(d.outputs[_][0], d.outputs[_][1]);
                        }
                        d.title && (p.title = d.title),
                            d.json && p.configure(d.json);
                    }
                    return (
                        n.graph.add(p),
                        (p.pos = [
                            r.position[0] +
                                r.posAdd[0] +
                                (r.posSizeFix[0]
                                    ? r.posSizeFix[0] * p.size[0]
                                    : 0),
                            r.position[1] +
                                r.posAdd[1] +
                                (r.posSizeFix[1]
                                    ? r.posSizeFix[1] * p.size[1]
                                    : 0),
                        ]),
                        s
                            ? r.nodeFrom.connectByType(c, p, u)
                            : r.nodeTo.connectByTypeOutput(c, p, u),
                        !0
                    );
                } else console.log("failed creating " + f);
            }
        }
        return !1;
    }
    showConnectionMenu(e) {
        const r = Object.assign(
                {
                    nodeFrom: null,
                    // input
                    slotFrom: null,
                    // input
                    nodeTo: null,
                    // output
                    slotTo: null,
                    // output
                    e: null,
                },
                e || {}
            ),
            n = this,
            s = r.nodeFrom && r.slotFrom,
            a = !s && r.nodeTo && r.slotTo;
        if (!s && !a)
            return console.warn("No data passed to showConnectionMenu"), !1;
        const o = s ? r.nodeFrom : r.nodeTo;
        let l = s ? r.slotFrom : r.slotTo,
            c = !1;
        switch (typeof l) {
            case "string":
                (c = s ? o.findOutputSlot(l, !1) : o.findInputSlot(l, !1)),
                    (l = s ? o.outputs[l] : o.inputs[l]);
                break;
            case "object":
                c = s ? o.findOutputSlot(l.name) : o.findInputSlot(l.name);
                break;
            case "number":
                (c = l), (l = s ? o.outputs[l] : o.inputs[l]);
                break;
            default:
                return console.warn("Cant get slot information " + l), !1;
        }
        const u = ["Add Node", null];
        n.allow_searchbox && (u.push("Search"), u.push(null));
        const h = l.type == LiteGraph.EVENT ? "_event_" : l.type,
            f = s
                ? LiteGraph.slot_types_default_out
                : LiteGraph.slot_types_default_in;
        if (f && f[h])
            if (typeof f[h] == "object" || Array.isArray(f[h]))
                for (const _ in f[h]) u.push(f[h][_]);
            else u.push(f[h]);
        const d = new ContextMenu(u, {
            event: r.e,
            title:
                (l && l.name != "" ? l.name + (h ? " | " : "") : "") +
                (l && h ? h : ""),
            callback: p,
        });
        function p(_, E, m) {
            switch (
                (n.createDefaultNodeForSlot(
                    Object.assign(r, {
                        position: [r.e.canvasX, r.e.canvasY],
                        nodeType: _,
                    })
                ),
                _)
            ) {
                case "Add Node":
                    _LGraphCanvas.onMenuAdd(null, null, m, d, function (b) {
                        s
                            ? r.nodeFrom.connectByType(c, b, h)
                            : r.nodeTo.connectByTypeOutput(c, b, h);
                    });
                    break;
                case "Search":
                    s
                        ? n.showSearchBox(m, {
                              node_from: r.nodeFrom,
                              slot_from: l,
                              type_filter_in: h,
                          })
                        : n.showSearchBox(m, {
                              node_to: r.nodeTo,
                              slot_from: l,
                              type_filter_out: h,
                          });
                    break;
            }
        }
        return !1;
    }
    // TODO refactor :: this is used fot title but not for properties!
    static onShowPropertyEditor(e, t, r, n, s) {
        const a = e.property || "title",
            o = s[a],
            l = document.createElement("div");
        (l.is_modified = !1),
            (l.className = "graphdialog"),
            (l.innerHTML =
                "<span class='name'></span><input autofocus type='text' class='value'/><button>OK</button>"),
            (l.close = function () {
                l.parentNode && l.parentNode.removeChild(l);
            });
        const c = l.querySelector(".name");
        c.innerText = a;
        let u = l.querySelector(".value");
        u &&
            ((u.value = o),
            u.addEventListener("blur", function (T) {
                this.focus();
            }),
            u.addEventListener("keydown", function (T) {
                if (((l.is_modified = !0), T.keyCode == 27)) l.close();
                else if (T.keyCode == 13) b();
                else if (T.keyCode != 13 && T.target.localName != "textarea")
                    return;
                T.preventDefault(), T.stopPropagation();
            }));
        const f = _LGraphCanvas.active_canvas.canvas,
            d = f.getBoundingClientRect();
        let p = -20,
            _ = -20;
        d && ((p -= d.left), (_ -= d.top)),
            event
                ? ((l.style.left = event.clientX + p + "px"),
                  (l.style.top = event.clientY + _ + "px"))
                : ((l.style.left = f.width * 0.5 + p + "px"),
                  (l.style.top = f.height * 0.5 + _ + "px")),
            l.querySelector("button").addEventListener("click", b),
            f.parentNode.appendChild(l),
            u && u.focus();
        let m = null;
        l.addEventListener("mouseleave", function (T) {
            LiteGraph.dialog_close_on_mouse_leave &&
                !l.is_modified &&
                LiteGraph.dialog_close_on_mouse_leave &&
                (m = setTimeout(
                    l.close,
                    LiteGraph.dialog_close_on_mouse_leave_delay
                ));
        }),
            l.addEventListener("mouseenter", function (T) {
                LiteGraph.dialog_close_on_mouse_leave && m && clearTimeout(m);
            });
        function b() {
            u && L(u.value);
        }
        function L(T) {
            e.type == "Number"
                ? (T = Number(T))
                : e.type == "Boolean" && (T = !!T),
                (s[a] = T),
                l.parentNode && l.parentNode.removeChild(l),
                s.setDirtyCanvas(!0, !0);
        }
    }
    // refactor: there are different dialogs, some uses createDialog some dont
    prompt(e, t, r, n, s) {
        const a = this;
        e = e || "";
        const o = document.createElement("div");
        (o.is_modified = !1),
            (o.className = "graphdialog rounded"),
            s
                ? (o.innerHTML =
                      "<span class='name'></span> <textarea autofocus class='value'></textarea><button class='rounded'>OK</button>")
                : (o.innerHTML =
                      "<span class='name'></span> <input autofocus type='text' class='value'/><button class='rounded'>OK</button>"),
            (o.close = function () {
                (a.prompt_box = null),
                    o.parentNode && o.parentNode.removeChild(o);
            });
        const c = _LGraphCanvas.active_canvas.canvas;
        c.parentNode.appendChild(o),
            this.ds.scale > 1 &&
                (o.style.transform = "scale(" + this.ds.scale + ")");
        let u = null,
            h = !1;
        LiteGraph.pointerListenerAdd(o, "leave", function (T) {
            h ||
                (LiteGraph.dialog_close_on_mouse_leave &&
                    !o.is_modified &&
                    LiteGraph.dialog_close_on_mouse_leave &&
                    (u = setTimeout(
                        o.close,
                        LiteGraph.dialog_close_on_mouse_leave_delay
                    )));
        }),
            LiteGraph.pointerListenerAdd(o, "enter", function (T) {
                LiteGraph.dialog_close_on_mouse_leave && u && clearTimeout(u);
            });
        const f = o.querySelectorAll("select");
        f &&
            f.forEach(function (T) {
                T.addEventListener("click", function (g) {
                    h++;
                }),
                    T.addEventListener("blur", function (g) {
                        h = 0;
                    }),
                    T.addEventListener("change", function (g) {
                        h = -1;
                    });
            }),
            a.prompt_box && a.prompt_box.close(),
            (a.prompt_box = o);
        const d = o.querySelector(".name");
        d.innerText = e;
        const p = o.querySelector(".value");
        p.value = t;
        const _ = p;
        _.addEventListener("keydown", function (T) {
            if (((o.is_modified = !0), T.keyCode == 27)) o.close();
            else if (T.keyCode == 13 && T.target.localName != "textarea")
                r && r(this.value), o.close();
            else return;
            T.preventDefault(), T.stopPropagation();
        }),
            o.querySelector("button").addEventListener("click", function (T) {
                r && r(_.value), a.setDirty(!0), o.close();
            });
        const m = c.getBoundingClientRect();
        let b = -20,
            L = -20;
        return (
            m && ((b -= m.left), (L -= m.top)),
            n
                ? ((o.style.left = n.clientX + b + "px"),
                  (o.style.top = n.clientY + L + "px"))
                : ((o.style.left = c.width * 0.5 + b + "px"),
                  (o.style.top = c.height * 0.5 + L + "px")),
            setTimeout(function () {
                _.focus();
            }, 10),
            o
        );
    }
    showSearchBox(e, t) {
        const r = {
            slot_from: null,
            node_from: null,
            node_to: null,
            do_type_filter: LiteGraph.search_filter_enabled,
            // TODO check for registered_slot_[in/out]_types not empty // this will be checked for functionality enabled : filter on slot type, in and out
            type_filter_in: !1,
            // these are default: pass to set initially set values
            type_filter_out: !1,
            show_general_if_none_on_typefilter: !0,
            show_general_after_typefiltered: !0,
            hide_on_mouse_leave: LiteGraph.search_hide_on_mouse_leave,
            show_all_if_empty: !0,
            show_all_on_open: LiteGraph.search_show_all_on_open,
        };
        t = Object.assign(r, t || {});
        const n = this,
            s = _LGraphCanvas.active_canvas,
            a = s.canvas,
            o = a.ownerDocument || document,
            l = document.createElement("div");
        (l.className = "litegraph litesearchbox graphdialog rounded"),
            (l.innerHTML =
                "<span class='name'>Search</span> <input autofocus type='text' class='value rounded'/>"),
            t.do_type_filter &&
                ((l.innerHTML +=
                    "<select class='slot_in_type_filter'><option value=''></option></select>"),
                (l.innerHTML +=
                    "<select class='slot_out_type_filter'><option value=''></option></select>")),
            (l.innerHTML += "<div class='helper'></div>"),
            o.fullscreenElement
                ? o.fullscreenElement.appendChild(l)
                : (o.body.appendChild(l), (o.body.style.overflow = "hidden"));
        let c, u;
        if (
            (t.do_type_filter &&
                ((c = l.querySelector(".slot_in_type_filter")),
                (u = l.querySelector(".slot_out_type_filter"))),
            (l.close = function () {
                (n.search_box = null),
                    this.blur(),
                    a.focus(),
                    (o.body.style.overflow = ""),
                    setTimeout(function () {
                        n.canvas.focus();
                    }, 20),
                    l.parentNode && l.parentNode.removeChild(l);
            }),
            this.ds.scale > 1 &&
                (l.style.transform = "scale(" + this.ds.scale + ")"),
            t.hide_on_mouse_leave)
        ) {
            let A = !1,
                G = null;
            LiteGraph.pointerListenerAdd(l, "enter", function (M) {
                G && (clearTimeout(G), (G = null));
            }),
                LiteGraph.pointerListenerAdd(l, "leave", function (M) {
                    A ||
                        (G = setTimeout(function () {
                            l.close();
                        }, 500));
                }),
                t.do_type_filter &&
                    (c.addEventListener("click", function (M) {
                        A++;
                    }),
                    c.addEventListener("blur", function (M) {
                        A = 0;
                    }),
                    c.addEventListener("change", function (M) {
                        A = -1;
                    }),
                    u.addEventListener("click", function (M) {
                        A++;
                    }),
                    u.addEventListener("blur", function (M) {
                        A = 0;
                    }),
                    u.addEventListener("change", function (M) {
                        A = -1;
                    }));
        }
        n.search_box && n.search_box.close(), (n.search_box = l);
        const h = l.querySelector(".helper");
        let f = null,
            d = null,
            p = null,
            _ = l.querySelector("input");
        if (
            (_ &&
                (_.addEventListener("blur", function (A) {
                    n.search_box && this.focus();
                }),
                _.addEventListener("keydown", function (A) {
                    if (A.keyCode == 38) T(!1);
                    else if (A.keyCode == 40) T(!0);
                    else if (A.keyCode == 27) l.close();
                    else if (A.keyCode == 13)
                        g(), p ? L(p.innerHTML) : f ? L(f) : l.close();
                    else {
                        d && clearInterval(d), (d = setTimeout(g, 250));
                        return;
                    }
                    return (
                        A.preventDefault(),
                        A.stopPropagation(),
                        A.stopImmediatePropagation(),
                        !0
                    );
                })),
            t.do_type_filter)
        ) {
            if (c) {
                const A = LiteGraph.slot_types_in,
                    G = A.length;
                (t.type_filter_in == LiteGraph.EVENT ||
                    t.type_filter_in == LiteGraph.ACTION) &&
                    (t.type_filter_in = "_event_");
                for (let M = 0; M < G; M++) {
                    const N = document.createElement("option");
                    (N.value = A[M]),
                        (N.innerHTML = A[M]),
                        c.appendChild(N),
                        t.type_filter_in !== !1 &&
                            (t.type_filter_in + "").toLowerCase() ==
                                (A[M] + "").toLowerCase() &&
                            (N.selected = !0);
                }
                c.addEventListener("change", function () {
                    g();
                });
            }
            if (u) {
                const A = LiteGraph.slot_types_out,
                    G = A.length;
                (t.type_filter_out == LiteGraph.EVENT ||
                    t.type_filter_out == LiteGraph.ACTION) &&
                    (t.type_filter_out = "_event_");
                for (let M = 0; M < G; M++) {
                    const N = document.createElement("option");
                    (N.value = A[M]),
                        (N.innerHTML = A[M]),
                        u.appendChild(N),
                        t.type_filter_out !== !1 &&
                            (t.type_filter_out + "").toLowerCase() ==
                                (A[M] + "").toLowerCase() &&
                            (N.selected = !0);
                }
                u.addEventListener("change", function () {
                    g();
                });
            }
        }
        const E = a.getBoundingClientRect(),
            m = (e ? e.clientX : E.left + E.width * 0.5) - 80,
            b = (e ? e.clientY : E.top + E.height * 0.5) - 20;
        (l.style.left = m + "px"),
            (l.style.top = b + "px"),
            e.layerY > E.height - 200 &&
                (h.style.maxHeight = E.height - e.layerY - 20 + "px"),
            _.focus(),
            t.show_all_on_open && g();
        function L(A) {
            if (A)
                if (n.onSearchBoxSelection) n.onSearchBoxSelection(A, e, s);
                else {
                    const G = LiteGraph.searchbox_extras[A.toLowerCase()];
                    G && (A = G.type), s.graph.beforeChange();
                    const M = LiteGraph.createNode(A);
                    if (
                        (M &&
                            ((M.pos = s.convertEventToCanvasOffset(e)),
                            s.graph.add(M, !1)),
                        G && G.data)
                    ) {
                        if (G.data.properties)
                            for (const N in G.data.properties)
                                M.addProperty(N, G.data.properties[N]);
                        if (G.data.inputs) {
                            M.inputs = [];
                            for (const N in G.data.inputs)
                                M.addOutput(
                                    G.data.inputs[N][0],
                                    G.data.inputs[N][1]
                                );
                        }
                        if (G.data.outputs) {
                            M.outputs = [];
                            for (const N in G.data.outputs)
                                M.addOutput(
                                    G.data.outputs[N][0],
                                    G.data.outputs[N][1]
                                );
                        }
                        G.data.title && (M.title = G.data.title),
                            G.data.json && M.configure(G.data.json);
                    }
                    if (t.node_from) {
                        let N = !1;
                        switch (typeof t.slot_from) {
                            case "string":
                                N = t.node_from.findOutputSlot(t.slot_from);
                                break;
                            case "object":
                                t.slot_from.name
                                    ? (N = t.node_from.findOutputSlot(
                                          t.slot_from.name
                                      ))
                                    : (N = -1),
                                    N == -1 &&
                                        typeof t.slot_from.slot_index < "u" &&
                                        (N = t.slot_from.slot_index);
                                break;
                            case "number":
                                N = t.slot_from;
                                break;
                            default:
                                N = 0;
                        }
                        typeof t.node_from.outputs[N] < "u" &&
                            N !== !1 &&
                            N > -1 &&
                            t.node_from.connectByType(
                                N,
                                M,
                                t.node_from.outputs[N].type
                            );
                    }
                    if (t.node_to) {
                        let N = !1;
                        switch (typeof t.slot_from) {
                            case "string":
                                N = t.node_to.findInputSlot(t.slot_from);
                                break;
                            case "object":
                                t.slot_from.name
                                    ? (N = t.node_to.findInputSlot(
                                          t.slot_from.name
                                      ))
                                    : (N = -1),
                                    N == -1 &&
                                        typeof t.slot_from.slot_index < "u" &&
                                        (N = t.slot_from.slot_index);
                                break;
                            case "number":
                                N = t.slot_from;
                                break;
                            default:
                                N = 0;
                        }
                        typeof t.node_to.inputs[N] < "u" &&
                            N !== !1 &&
                            N > -1 &&
                            t.node_to.connectByTypeOutput(
                                N,
                                M,
                                t.node_to.inputs[N].type
                            );
                    }
                    s.graph.afterChange();
                }
            l.close();
        }
        function T(A) {
            const G = p;
            p && p.classList.remove("selected"),
                p
                    ? ((p = A ? p.nextSibling : p.previousSibling),
                      p || (p = G))
                    : (p = A
                          ? h.childNodes[0]
                          : h.childNodes[h.childNodes.length]),
                p &&
                    (p.classList.add("selected"),
                    p.scrollIntoView({ block: "end", behavior: "smooth" }));
        }
        function g() {
            d = null;
            let A = _.value;
            if (((f = null), (h.innerHTML = ""), !A && !t.show_all_if_empty))
                return;
            if (n.onSearchBox) {
                const M = n.onSearchBox(h, A, s);
                if (M) for (let N = 0; N < M.length; ++N) G(M[N]);
            } else {
                let F = function (P, C) {
                        const z = Object.assign(
                                {
                                    skipFilter: !1,
                                    inTypeOverride: !1,
                                    outTypeOverride: !1,
                                },
                                C || {}
                            ),
                            q = LiteGraph.registered_node_types[P];
                        if (
                            (N && q.filter != N) ||
                            ((!t.show_all_if_empty || A) &&
                                P.toLowerCase().indexOf(A) === -1)
                        )
                            return !1;
                        if (t.do_type_filter && !z.skipFilter) {
                            const Y = P;
                            let H = I.value;
                            if (
                                (z.inTypeOverride !== !1 &&
                                    (H = z.inTypeOverride),
                                I &&
                                    H &&
                                    LiteGraph.registered_slot_in_types[H] &&
                                    LiteGraph.registered_slot_in_types[H]
                                        .nodes &&
                                    LiteGraph.registered_slot_in_types[
                                        H
                                    ].nodes.includes(Y) === !1)
                            )
                                return !1;
                            let Z = B.value;
                            if (
                                (z.outTypeOverride !== !1 &&
                                    (Z = z.outTypeOverride),
                                B &&
                                    Z &&
                                    LiteGraph.registered_slot_out_types[Z] &&
                                    LiteGraph.registered_slot_out_types[Z]
                                        .nodes &&
                                    LiteGraph.registered_slot_out_types[
                                        Z
                                    ].nodes.includes(Y) === !1)
                            )
                                return !1;
                        }
                        return !0;
                    },
                    M = 0;
                A = A.toLowerCase();
                const N = s.filter || s.graph.filter;
                let I = null,
                    B = null;
                t.do_type_filter && n.search_box
                    ? ((I = n.search_box.querySelector(".slot_in_type_filter")),
                      (B = n.search_box.querySelector(".slot_out_type_filter")))
                    : ((I = !1), (B = !1));
                for (const P in LiteGraph.searchbox_extras) {
                    const C = LiteGraph.searchbox_extras[P];
                    if (
                        (!t.show_all_if_empty || A) &&
                        C.desc.toLowerCase().indexOf(A) === -1
                    )
                        continue;
                    const U = LiteGraph.registered_node_types[C.type];
                    if (
                        !(U && U.filter != N) &&
                        F(C.type) &&
                        (G(C.desc, "searchbox_extra"),
                        _LGraphCanvas.search_limit !== -1 &&
                            M++ > _LGraphCanvas.search_limit)
                    )
                        break;
                }
                let O = null;
                if (Array.prototype.filter)
                    O = Object.keys(LiteGraph.registered_node_types).filter(F);
                else {
                    O = [];
                    for (const P in LiteGraph.registered_node_types)
                        F(P) && O.push(P);
                }
                for (
                    let P = 0;
                    P < O.length &&
                    (G(O[P]),
                    !(
                        _LGraphCanvas.search_limit !== -1 &&
                        M++ > _LGraphCanvas.search_limit
                    ));
                    P++
                );
                if (t.show_general_after_typefiltered && (I.value || B.value)) {
                    const P = [];
                    for (const C in LiteGraph.registered_node_types)
                        F(C, {
                            inTypeOverride: I && I.value ? "*" : !1,
                            outTypeOverride: B && B.value ? "*" : !1,
                        }) && P.push(C);
                    for (
                        let C = 0;
                        C < P.length &&
                        (G(P[C], "generic_type"),
                        !(
                            _LGraphCanvas.search_limit !== -1 &&
                            M++ > _LGraphCanvas.search_limit
                        ));
                        C++
                    );
                }
                if (
                    (I.value || B.value) &&
                    h.childNodes.length == 0 &&
                    t.show_general_if_none_on_typefilter
                ) {
                    const P = [];
                    for (const C in LiteGraph.registered_node_types)
                        F(C, { skipFilter: !0 }) && P.push(C);
                    for (
                        let C = 0;
                        C < P.length &&
                        (G(P[C], "not_in_filter"),
                        !(
                            _LGraphCanvas.search_limit !== -1 &&
                            M++ > _LGraphCanvas.search_limit
                        ));
                        C++
                    );
                }
            }
            function G(M, N) {
                const I = document.createElement("div");
                f || (f = M),
                    (I.innerText = M),
                    (I.dataset.type = escape(M)),
                    (I.className = "litegraph lite-search-item"),
                    N && (I.className += " " + N),
                    I.addEventListener("click", function (B) {
                        L(unescape(this.dataset.type));
                    }),
                    h.appendChild(I);
            }
        }
        return l;
    }
    showEditPropertyValue(e, t, r) {
        if (!e || e.properties[t] === void 0) return;
        r = r || {};
        const n = e.getPropertyInfo(t),
            s = n.type;
        let a = "";
        if (s == "string" || s == "number" || s == "array" || s == "object")
            a = "<input autofocus type='text' class='value'/>";
        else if ((s == "enum" || s == "combo") && n.values) {
            a = "<select autofocus type='text' class='value'>";
            for (const f in n.values) {
                let d = f;
                n.values.constructor === Array && (d = n.values[f]),
                    (a +=
                        "<option value='" +
                        d +
                        "' " +
                        (d == e.properties[t] ? "selected" : "") +
                        ">" +
                        n.values[f] +
                        "</option>");
            }
            a += "</select>";
        } else if (s == "boolean" || s == "toggle")
            a =
                "<input autofocus type='checkbox' class='value' " +
                (e.properties[t] ? "checked" : "") +
                "/>";
        else {
            console.warn("unknown type: " + s);
            return;
        }
        const o = this.createDialog(
            "<span class='name'>" +
                (n.label ? n.label : t) +
                "</span>" +
                a +
                "<button>OK</button>",
            r
        );
        let l = !1;
        if ((s == "enum" || s == "combo") && n.values)
            (l = o.querySelector("select")),
                l.addEventListener("change", function (f) {
                    o.modified(), h(f.target.value);
                });
        else if (s == "boolean" || s == "toggle")
            (l = o.querySelector("input")),
                l &&
                    l.addEventListener("click", function (f) {
                        o.modified(), h(!!l.checked);
                    });
        else if (((l = o.querySelector("input")), l)) {
            l.addEventListener("blur", function (d) {
                this.focus();
            });
            let f = e.properties[t] !== void 0 ? e.properties[t] : "";
            s !== "string" && (f = JSON.stringify(f)),
                (l.value = f),
                l.addEventListener("keydown", function (d) {
                    if (d.keyCode == 27) o.close();
                    else if (d.keyCode == 13) u();
                    else if (d.keyCode != 13) {
                        o.modified();
                        return;
                    }
                    d.preventDefault(), d.stopPropagation();
                });
        }
        l && l.focus(), o.querySelector("button").addEventListener("click", u);
        function u() {
            h(l.value);
        }
        function h(f) {
            n &&
                n.values &&
                n.values.constructor === Object &&
                n.values[f] != null &&
                (f = n.values[f]),
                typeof e.properties[t] == "number" && (f = Number(f)),
                (s == "array" || s == "object") && (f = JSON.parse(f)),
                (e.properties[t] = f),
                e.graph && e.graph._version++,
                e.onPropertyChanged && e.onPropertyChanged(t, f),
                r.onclose && r.onclose(),
                o.close(),
                e.setDirtyCanvas(!0, !0);
        }
        return o;
    }
    // TODO refactor, theer are different dialog, some uses createDialog, some dont
    createDialog(e, t) {
        t = Object.assign(
            {
                checkForInput: !1,
                closeOnLeave: !0,
                closeOnLeave_checkModified: !0,
            },
            t || {}
        );
        const n = document.createElement("div");
        (n.className = "graphdialog"), (n.innerHTML = e), (n.is_modified = !1);
        const s = this.canvas.getBoundingClientRect();
        let a = -20,
            o = -20;
        if (
            (s && ((a -= s.left), (o -= s.top)),
            t.position
                ? ((a += t.position[0]), (o += t.position[1]))
                : t.event
                ? ((a += t.event.clientX), (o += t.event.clientY))
                : ((a += this.canvas.width * 0.5),
                  (o += this.canvas.height * 0.5)),
            (n.style.left = a + "px"),
            (n.style.top = o + "px"),
            this.canvas.parentNode.appendChild(n),
            t.checkForInput)
        ) {
            let h = [];
            (h = n.querySelectorAll("input")) &&
                h.forEach(function (f) {
                    f.addEventListener("keydown", function (d) {
                        if ((n.modified(), d.keyCode == 27)) n.close();
                        else if (d.keyCode != 13) return;
                        d.preventDefault(), d.stopPropagation();
                    }),
                        f.focus();
                });
        }
        (n.modified = function () {
            n.is_modified = !0;
        }),
            (n.close = function () {
                n.parentNode && n.parentNode.removeChild(n);
            });
        let l = null,
            c = !1;
        n.addEventListener("mouseleave", function (h) {
            c ||
                ((t.closeOnLeave || LiteGraph.dialog_close_on_mouse_leave) &&
                    !n.is_modified &&
                    LiteGraph.dialog_close_on_mouse_leave &&
                    (l = setTimeout(
                        n.close,
                        LiteGraph.dialog_close_on_mouse_leave_delay
                    )));
        }),
            n.addEventListener("mouseenter", function (h) {
                (t.closeOnLeave || LiteGraph.dialog_close_on_mouse_leave) &&
                    l &&
                    clearTimeout(l);
            });
        const u = n.querySelectorAll("select");
        return (
            u &&
                u.forEach(function (h) {
                    h.addEventListener("click", function (f) {
                        c++;
                    }),
                        h.addEventListener("blur", function (f) {
                            c = 0;
                        }),
                        h.addEventListener("change", function (f) {
                            c = -1;
                        });
                }),
            n
        );
    }
    createPanel(e, t) {
        t = t || {};
        const r = t.window || window,
            n = document.createElement("div");
        if (
            ((n.className = "litegraph dialog"),
            (n.innerHTML =
                "<div class='dialog-header'><span class='dialog-title'></span></div><div class='dialog-content'></div><div style='display:none;' class='dialog-alt-content'></div><div class='dialog-footer'></div>"),
            (n.header = n.querySelector(".dialog-header")),
            t.width &&
                (n.style.width =
                    t.width + (t.width.constructor === Number ? "px" : "")),
            t.height &&
                (n.style.height =
                    t.height + (t.height.constructor === Number ? "px" : "")),
            t.closable)
        ) {
            const s = document.createElement("span");
            (s.innerHTML = "&#10005;"),
                s.classList.add("close"),
                s.addEventListener("click", function () {
                    n.close();
                }),
                n.header.appendChild(s);
        }
        return (
            (n.title_element = n.querySelector(".dialog-title")),
            (n.title_element.innerText = e),
            (n.content = n.querySelector(".dialog-content")),
            (n.alt_content = n.querySelector(".dialog-alt-content")),
            (n.footer = n.querySelector(".dialog-footer")),
            (n.close = () => {
                n.onClose && typeof n.onClose == "function" && n.onClose(),
                    n.parentNode && n.parentNode.removeChild(n),
                    n.parentNode && n.parentNode.removeChild(this);
            }),
            (n.toggleAltContent = (s) => {
                let a, o;
                typeof s < "u"
                    ? ((a = s ? "block" : "none"), (o = s ? "none" : "block"))
                    : ((a =
                          n.alt_content.style.display != "block"
                              ? "block"
                              : "none"),
                      (o =
                          n.alt_content.style.display != "block"
                              ? "none"
                              : "block")),
                    (n.alt_content.style.display = a),
                    (n.content.style.display = o);
            }),
            (n.toggleFooterVisibility = (s) => {
                let a;
                typeof s < "u"
                    ? (a = s ? "block" : "none")
                    : (a =
                          n.footer.style.display != "block" ? "block" : "none"),
                    (n.footer.style.display = a);
            }),
            (n.clear = () => {
                this.content.innerHTML = "";
            }),
            (n.addHTML = (s, a, o) => {
                const l = document.createElement("div");
                return (
                    a && (l.className = a),
                    (l.innerHTML = s),
                    o ? n.footer.appendChild(l) : n.content.appendChild(l),
                    l
                );
            }),
            (n.addButton = (s, a, o) => {
                const l = document.createElement("button");
                return (
                    (l.innerText = s),
                    (l.options = o),
                    l.classList.add("btn"),
                    l.addEventListener("click", a),
                    n.footer.appendChild(l),
                    l
                );
            }),
            (n.addSeparator = () => {
                const s = document.createElement("div");
                (s.className = "separator"), n.content.appendChild(s);
            }),
            (n.addWidget = (s, a, o, l, c) => {
                l = l || {};
                let u = String(o);
                (s = s.toLowerCase()),
                    s == "number" && (u = parseFloat(o).toFixed(3));
                const h = document.createElement("div");
                (h.className = "property"),
                    (h.innerHTML =
                        "<span class='property_name'></span><span class='property_value'></span>"),
                    (h.querySelector(".property_name").innerText =
                        l.label || a);
                const f = h.querySelector(".property_value");
                (f.innerText = u),
                    (h.dataset.property = a),
                    (h.dataset.type = l.type || s),
                    (h.options = l),
                    (h.value = o);
                const d = l.disabled || !1;
                if ((d && f.classList.add("disabled"), s == "code"))
                    h.addEventListener("click", function (_) {
                        _.preventDefault(),
                            !d && n.inner_showCodePad(this.dataset.property);
                    });
                else if (s == "boolean")
                    h.classList.add("boolean"),
                        o && h.classList.add("bool-on"),
                        h.addEventListener("click", function (_) {
                            if ((_.preventDefault(), d)) return;
                            const E = this.dataset.property || a;
                            (this.value = !this.value),
                                this.classList.toggle("bool-on"),
                                (this.querySelector(
                                    ".property_value"
                                ).innerText = this.value ? "true" : "false"),
                                p(E, this.value);
                        });
                else if (s == "string" || s == "number") {
                    const _ = document.createElement("input"),
                        E = s === "string" ? "string" : "number";
                    l.id && _.setAttribute("id", l.id),
                        _.setAttribute("type", E),
                        l.min && _.setAttribute("min", l.min),
                        l.max && _.setAttribute("max", l.max),
                        _.classList.add("property_value_input"),
                        d &&
                            (_.setAttribute("disabled", d),
                            _.classList.add("disabled")),
                        (f.innerText = ""),
                        (_.value = s === "string" ? u : Number(u)),
                        f.appendChild(_),
                        _.addEventListener("input", function (b) {
                            if ((b.preventDefault(), d)) return;
                            const L = n.parentNode.dataset.property || a,
                                T = n.parentNode.dataset.type;
                            let g = b.target.value;
                            T == "number" && (g = Number(g)), p(L, g);
                        });
                } else if (s == "enum" || s == "combo") {
                    const _ = _LGraphCanvas.getPropertyPrintableValue(
                        o,
                        l.values
                    );
                    (f.innerText = _),
                        f.addEventListener("click", (E) => {
                            if ((E.preventDefault(), d)) return;
                            this.closeAllContextmenu();
                            const m = l.values || [],
                                b = n.parentNode.dataset.property || a,
                                L = f,
                                T = new ContextMenu(
                                    m,
                                    {
                                        event: E,
                                        className: "dark",
                                        callback: g,
                                    },
                                    r
                                );
                            this._menus.push(T);
                            function g(A, G, M) {
                                return (L.innerText = A), p(b, A), !1;
                            }
                        });
                } else if (s === "button") {
                    (h.innerHTML = `
                  <span class='property_name'></span>
                  <span class='property_value_img'>
                    <span class="property_img_src"></span>
                    
                  </span>`),
                        (h.querySelector(".property_name").innerText =
                            l.label || a);
                    const _ = h.querySelector(".property_value_img");
                    _.setAttribute("contenteditable", !0),
                        (_.innerText = u),
                        (h.dataset.property = a),
                        (h.dataset.type = l.type || s),
                        (h.options = l),
                        (h.value = o);
                    const E = l.disabled,
                        m = document.createElement("btn");
                    m.classList.add("btn", "btn-save-image"),
                        (m.textContent = "이미지 추가"),
                        m.addEventListener("click", function (b) {
                            if ((b.preventDefault(), E)) return;
                            const L = document.createElement("input");
                            (L.type = "file"),
                                L.setAttribute(
                                    "accept",
                                    ".png,.jpg,.jpeg,.gif,.webp,"
                                ),
                                L.click();
                        }),
                        _.appendChild(m);
                }
                n.content.appendChild(h);
                function p(_, E) {
                    l.callback && l.callback(_, E, l), c && c(_, E, l);
                }
                return h;
            }),
            n.onOpen && typeof n.onOpen == "function" && n.onOpen(),
            n
        );
    }
    static getPropertyPrintableValue(e, t) {
        if (!t || t.constructor === Array) return String(e);
        if (t.constructor === Object) {
            let r = "";
            for (const n in t)
                if (t[n] == e) {
                    r = n;
                    break;
                }
            return String(e) + " (" + r + ")";
        }
    }
    closePanels() {
        const e = document.querySelector("#node-panel");
        e && e.close();
        const t = document.querySelector("#option-panel");
        t && t.close();
    }
    showShowGraphOptionsPanel(e, t, r, n) {
        let s = document.querySelector("#node-panel"),
            a;
        if (this.constructor && this.constructor.name == "HTMLDivElement") {
            if (
                !t ||
                !t.event ||
                !t.event.target ||
                !t.event.target.lgraphcanvas
            ) {
                console.warn("Canvas not found");
                return;
            }
            a = t.event.target.lgraphcanvas;
        } else a = this;
        a.closePanels();
        const o = a.getCanvasWindow();
        (s = a.createPanel("Options", {
            closable: !0,
            window: o,
            onOpen: function () {
                a.OPTIONPANEL_IS_OPEN = !0;
            },
            onClose: function () {
                (a.OPTIONPANEL_IS_OPEN = !1), (a.options_panel = null);
            },
        })),
            (a.options_panel = s),
            (s.id = "option-panel"),
            s.classList.add("settings");
        function l() {
            s.content.innerHTML = "";
            const c = function (h, f, d) {
                    d && d.key && (h = d.key),
                        d.values && (f = Object.values(d.values).indexOf(f)),
                        (a[h] = f);
                },
                u = LiteGraph.availableCanvasOptions;
            u.sort();
            for (const h in u) {
                const f = u[h];
                s.addWidget(
                    "boolean",
                    f,
                    a[f],
                    { key: f, on: "True", off: "False" },
                    c
                );
            }
            a.links_render_mode,
                s.addWidget(
                    "combo",
                    "Render mode",
                    LiteGraph.LINK_RENDER_MODES[a.links_render_mode],
                    {
                        key: "links_render_mode",
                        values: LiteGraph.LINK_RENDER_MODES,
                    },
                    c
                ),
                s.addSeparator(),
                (s.footer.innerHTML = "");
        }
        l(), a.canvas.parentNode.appendChild(s);
    }
    showShowNodePanel(e) {
        (this.SELECTED_NODE = e), this.closePanels();
        const t = this.getCanvasWindow(),
            r = this,
            n = this.createPanel(e.title || "", {
                closable: !0,
                window: t,
                onOpen: function () {
                    r.NODEPANEL_IS_OPEN = !0;
                },
                onClose: function () {
                    (r.NODEPANEL_IS_OPEN = !1), (r.node_panel = null);
                },
            });
        (r.node_panel = n),
            (n.id = "node-panel"),
            (n.node = e),
            n.classList.add("settings");
        function s() {
            var c;
            (n.content.innerHTML = ""),
                n.addHTML(
                    "<span class='node_type'>" +
                        e.type +
                        "</span><span class='node_desc'>" +
                        (e.constructor.desc || "") +
                        "</span><span class='separator'></span>"
                ),
                n.addHTML("<h4>Properties</h4>");
            const a = (u, h) => {
                r.graph.beforeChange(e);
                const f = Object.values(LiteGraph.NODE_MODES).indexOf(h);
                if (u.includes("inputName")) {
                    const d = e.properties[`editable-${u}`];
                    e.setInputName(d.index, h),
                        (e.properties[`editable-${u}`].value = h);
                } else if (u.includes("outputName")) {
                    const d = e.properties[`editable-${u}`];
                    e.setOutputName(d.index, h),
                        (e.properties[`editable-${u}`].value = h);
                } else
                    switch (u) {
                        case "Title":
                            e.title = h;
                            break;
                        case "Mode":
                            f >= 0 && LiteGraph.NODE_MODES[f]
                                ? e.changeMode(f)
                                : console.warn("unexpected mode: " + h);
                            break;
                        case "Color":
                            _LGraphCanvas.node_colors[h]
                                ? ((e.color =
                                      _LGraphCanvas.node_colors[h].color),
                                  (e.bgcolor =
                                      _LGraphCanvas.node_colors[h].bgcolor))
                                : console.warn("unexpected color: " + h);
                            break;
                        case "x":
                            e.pos = [parseInt(h), e.pos[1]];
                            break;
                        case "y":
                            e.pos = [e.pos[0], parseInt(h)];
                            break;
                        case "Width":
                            e.size = [parseInt(h), e.size[1]];
                            break;
                        case "Height":
                            e.size = [e.size[0], parseInt(h)];
                            break;
                        default:
                            e.setProperty(u, h);
                            break;
                    }
                r.graph.afterChange(), (r.dirty_canvas = !0);
            };
            n.addWidget(
                "string",
                "Title",
                e.title,
                {
                    disabled: !1,
                },
                a
            );
            const o = ["font_size", "status", "message"];
            for (let u in e.properties) {
                if (o.includes(u) || u.includes("editable-")) continue;
                const h = e.properties[u],
                    f = e.getPropertyInfo(u);
                f.type,
                    !(e.onAddPropertyToPanel && e.onAddPropertyToPanel(u, n)) &&
                        n.addWidget(f.widget || f.type, u, h, f, a);
            }
            if (
                (n.addSeparator(),
                e.onShowCustomPanelInfo && e.onShowCustomPanelInfo(n),
                (c = Object.keys(e.properties)) == null
                    ? void 0
                    : c.some((u) => u.includes("editable-")))
            ) {
                n.addHTML("<h4>Editable-Properties</h4>");
                for (let u in e.properties)
                    if (u.includes("editable-")) {
                        const h = e.properties[u].value,
                            f = e.getPropertyInfo(u);
                        f.type;
                        const d = u.split("-")[1];
                        if (
                            e.onAddPropertyToPanel &&
                            e.onAddPropertyToPanel(u, n)
                        )
                            continue;
                        n.addWidget(f.widget || f.type, d, h, f, a);
                    }
            }
            (n.footer.innerHTML = ""),
                n
                    .addButton("Delete", function () {
                        e.block_delete || (e.graph.remove(e), n.close());
                    })
                    .classList.add("delete");
        }
        (n.inner_showCodePad = (a) => {
            n.classList.remove("settings"),
                n.classList.add("centered"),
                (n.alt_content.innerHTML =
                    "<textarea class='code'></textarea>");
            const o = n.alt_content.querySelector("textarea"),
                l = () => {
                    n.toggleAltContent(!1),
                        n.toggleFooterVisibility(!0),
                        o.parentNode.removeChild(o),
                        n.classList.add("settings"),
                        n.classList.remove("centered"),
                        s();
                };
            (o.value = e.properties[a]),
                o.addEventListener("keydown", function (h) {
                    h.code == "Enter" &&
                        h.ctrlKey &&
                        (e.setProperty(a, o.value), l());
                }),
                n.toggleAltContent(!0),
                n.toggleFooterVisibility(!1),
                (o.style.height = "calc(100% - 40px)");
            const c = n.addButton("Assign", function () {
                e.setProperty(a, o.value), l();
            });
            n.alt_content.appendChild(c);
            const u = n.addButton("Close", l);
            (u.style.float = "right"), n.alt_content.appendChild(u);
        }),
            s(),
            this.canvas.parentNode.appendChild(n);
    }
    showSubgraphPropertiesDialog(e) {
        console.log("showing subgraph properties dialog");
        const t = this.canvas.parentNode.querySelector(".subgraph_dialog");
        t && t.close();
        const r = this.createPanel("Subgraph Inputs", {
            closable: !0,
            width: 500,
        });
        (r.node = e), r.classList.add("subgraph_dialog");
        function n() {
            if ((r.clear(), e.inputs))
                for (let o = 0; o < e.inputs.length; ++o) {
                    const l = e.inputs[o];
                    if (l.not_subgraph_input) continue;
                    const u = r.addHTML(
                        "<button>&#10005;</button> <span class='bullet_icon'></span><span class='name'></span><span class='type'></span>",
                        "subgraph_property"
                    );
                    (u.dataset.name = l.name),
                        (u.dataset.slot = o),
                        (u.querySelector(".name").innerText = l.name),
                        (u.querySelector(".type").innerText = l.type),
                        u
                            .querySelector("button")
                            .addEventListener("click", function (h) {
                                e.removeInput(
                                    Number(this.parentNode.dataset.slot)
                                ),
                                    n();
                            });
                }
        }
        return (
            r
                .addHTML(
                    " + <span class='label'>Name</span><input class='name'/><span class='label'>Type</span><input class='type'></input><button>+</button>",
                    "subgraph_property extra",
                    !0
                )
                .querySelector("button")
                .addEventListener("click", function (o) {
                    const l = this.parentNode,
                        c = l.querySelector(".name").value,
                        u = l.querySelector(".type").value;
                    !c ||
                        e.findInputSlot(c) != -1 ||
                        (e.addInput(c, u),
                        (l.querySelector(".name").value = ""),
                        (l.querySelector(".type").value = ""),
                        n());
                }),
            n(),
            this.canvas.parentNode.appendChild(r),
            r
        );
    }
    showSubgraphPropertiesDialogRight(e) {
        const t = this.canvas.parentNode.querySelector(".subgraph_dialog");
        t && t.close();
        const r = this.createPanel("Subgraph Outputs", {
            closable: !0,
            width: 500,
        });
        (r.node = e), r.classList.add("subgraph_dialog");
        function n() {
            if ((r.clear(), e.outputs))
                for (let l = 0; l < e.outputs.length; ++l) {
                    const c = e.outputs[l];
                    if (c.not_subgraph_output) continue;
                    const h = r.addHTML(
                        "<button>&#10005;</button> <span class='bullet_icon'></span><span class='name'></span><span class='type'></span>",
                        "subgraph_property"
                    );
                    (h.dataset.name = c.name),
                        (h.dataset.slot = l),
                        (h.querySelector(".name").innerText = c.name),
                        (h.querySelector(".type").innerText = c.type),
                        h
                            .querySelector("button")
                            .addEventListener("click", function (f) {
                                e.removeOutput(
                                    Number(this.parentNode.dataset.slot)
                                ),
                                    n();
                            });
                }
        }
        const a = r.addHTML(
            " + <span class='label'>Name</span><input class='name'/><span class='label'>Type</span><input class='type'></input><button>+</button>",
            "subgraph_property extra",
            !0
        );
        a.querySelector(".name").addEventListener("keydown", function (l) {
            l.keyCode == 13 && o.apply(this);
        }),
            a.querySelector("button").addEventListener("click", function (l) {
                o.apply(this);
            });
        function o() {
            const l = this.parentNode,
                c = l.querySelector(".name").value,
                u = l.querySelector(".type").value;
            !c ||
                e.findOutputSlot(c) != -1 ||
                (e.addOutput(c, u),
                (l.querySelector(".name").value = ""),
                (l.querySelector(".type").value = ""),
                n());
        }
        return n(), this.canvas.parentNode.appendChild(r), r;
    }
    checkPanels() {
        if (!this.canvas) return;
        const e = this.canvas.parentNode.querySelectorAll(".litegraph.dialog");
        for (let t = 0; t < e.length; ++t) {
            const r = e[t];
            r.node && (!r.node.graph || r.graph != this.graph) && r.close();
        }
    }
    static onMenuNodeCollapse(e, t, r, n, s) {
        s.graph
            .beforeChange
            /*?*/
            ();
        const a = function (l) {
                l.collapse();
            },
            o = _LGraphCanvas.active_canvas;
        if (!o.selected_nodes || Object.keys(o.selected_nodes).length <= 1)
            a(s);
        else for (const l in o.selected_nodes) a(o.selected_nodes[l]);
        s.graph
            .afterChange
            /*?*/
            ();
    }
    static onMenuNodePin(e, t, r, n, s) {
        s.pin();
    }
    static onMenuNodeMode(e, t, r, n, s) {
        new ContextMenu(LiteGraph.NODE_MODES, {
            event: r,
            callback: a,
            parentMenu: n,
            node: s,
        });
        function a(o) {
            if (!s) return;
            const l = Object.values(LiteGraph.NODE_MODES).indexOf(o),
                c = function (h) {
                    l >= 0 && LiteGraph.NODE_MODES[l]
                        ? h.changeMode(l)
                        : (console.warn("unexpected mode: " + o),
                          h.changeMode(LiteGraph.ALWAYS));
                },
                u = _LGraphCanvas.active_canvas;
            if (!u.selected_nodes || Object.keys(u.selected_nodes).length <= 1)
                c(s);
            else for (const h in u.selected_nodes) c(u.selected_nodes[h]);
        }
        return !1;
    }
    static onMenuNodeColors(e, t, r, n, s) {
        if (!s) throw "no node for color";
        const a = [];
        a.push({
            value: null,
            content:
                "<span style='display: block; padding-left: 4px;'>No color</span>",
        });
        for (const l in _LGraphCanvas.node_colors) {
            const c = _LGraphCanvas.node_colors[l],
                u = {
                    value: l,
                    content:
                        "<span style='display: block; color: #999; padding-left: 4px; border-left: 8px solid " +
                        c.color +
                        "; background-color:" +
                        c.bgcolor +
                        "'>" +
                        l +
                        "</span>",
                };
            a.push(u);
        }
        new ContextMenu(a, {
            event: r,
            callback: o,
            parentMenu: n,
            node: s,
        });
        function o(l) {
            if (!s) return;
            const c = l.value ? _LGraphCanvas.node_colors[l.value] : null,
                u = function (f) {
                    c
                        ? f.constructor === LiteGraph.LGraphGroup
                            ? (f.color = c.groupcolor)
                            : ((f.color = c.color), (f.bgcolor = c.bgcolor))
                        : (delete f.color, delete f.bgcolor);
                },
                h = _LGraphCanvas.active_canvas;
            if (!h.selected_nodes || Object.keys(h.selected_nodes).length <= 1)
                u(s);
            else for (const f in h.selected_nodes) u(h.selected_nodes[f]);
            s.setDirtyCanvas(!0, !0);
        }
        return !1;
    }
    static onMenuNodeShapes(e, t, r, n, s) {
        if (!s) throw "no node passed";
        new ContextMenu(LiteGraph.VALID_SHAPES, {
            event: r,
            callback: a,
            parentMenu: n,
            node: s,
        });
        function a(o) {
            if (!s) return;
            s.graph
                .beforeChange
                /*?*/
                ();
            const l = function (u) {
                    u.shape = o;
                },
                c = _LGraphCanvas.active_canvas;
            if (!c.selected_nodes || Object.keys(c.selected_nodes).length <= 1)
                l(s);
            else for (const u in c.selected_nodes) l(c.selected_nodes[u]);
            s.graph
                .afterChange
                /*?*/
                (),
                s.setDirtyCanvas(!0);
        }
        return !1;
    }
    static onMenuNodeRemove(e, t, r, n, s) {
        if (!s) throw "no node passed";
        const a = s.graph;
        a.beforeChange();
        const o = function (c) {
                c.removable !== !1 && a.remove(c);
            },
            l = _LGraphCanvas.active_canvas;
        if (!l.selected_nodes || Object.keys(l.selected_nodes).length <= 1)
            o(s);
        else for (const c in l.selected_nodes) o(l.selected_nodes[c]);
        a.afterChange(), s.setDirtyCanvas(!0, !0);
    }
    static onMenuNodeToSubgraph(e, t, r, n, s) {
        const a = s.graph,
            o = _LGraphCanvas.active_canvas;
        if (!o) return;
        let l = Object.values(o.selected_nodes || {});
        l.length || (l = [s]);
        const c = LiteGraph.createNode("graph/subgraph");
        (c.pos = s.pos.concat()),
            a.add(c),
            c.buildFromNodes(l),
            o.deselectAllNodes(),
            s.setDirtyCanvas(!0, !0);
    }
    static onMenuNodeClone(e, t, r, n, s) {
        s.graph.beforeChange();
        const a = {},
            o = function (c) {
                if (c.clonable === !1) return;
                const u = c.clone();
                u &&
                    ((u.pos = [c.pos[0] + 5, c.pos[1] + 5]),
                    c.graph.add(u),
                    (a[u.id] = u));
            },
            l = _LGraphCanvas.active_canvas;
        if (!l.selected_nodes || Object.keys(l.selected_nodes).length <= 1)
            o(s);
        else for (const c in l.selected_nodes) o(l.selected_nodes[c]);
        Object.keys(a).length && l.selectNodes(a),
            s.graph.afterChange(),
            s.setDirtyCanvas(!0, !0);
    }
    //called by processContextMenu to extract the menu list
    getNodeMenuOptions(e) {
        let t = null;
        if (
            (e.getMenuOptions
                ? (t = e.getMenuOptions(this))
                : ((t = [
                      {
                          content: "Inputs",
                          has_submenu: !0,
                          disabled: !0,
                          callback: _LGraphCanvas.showMenuNodeOptionalInputs,
                      },
                      {
                          content: "Outputs",
                          has_submenu: !0,
                          disabled: !0,
                          callback: _LGraphCanvas.showMenuNodeOptionalOutputs,
                      },
                      null,
                      {
                          content: "Properties",
                          has_submenu: !0,
                          callback: _LGraphCanvas.onShowMenuNodeProperties,
                      },
                      null,
                      {
                          content: "Title",
                          callback: _LGraphCanvas.onShowPropertyEditor,
                      },
                      {
                          content: "Mode",
                          has_submenu: !0,
                          callback: _LGraphCanvas.onMenuNodeMode,
                      },
                  ]),
                  e.resizable !== !1 &&
                      t.push({
                          content: "Resize",
                          callback: _LGraphCanvas.onMenuResizeNode,
                      }),
                  t.push(
                      {
                          content: "Collapse",
                          callback: _LGraphCanvas.onMenuNodeCollapse,
                      },
                      { content: "Pin", callback: _LGraphCanvas.onMenuNodePin },
                      {
                          content: "Colors",
                          has_submenu: !0,
                          callback: _LGraphCanvas.onMenuNodeColors,
                      },
                      {
                          content: "Shapes",
                          has_submenu: !0,
                          callback: _LGraphCanvas.onMenuNodeShapes,
                      },
                      null
                  )),
            e.onGetInputs)
        ) {
            const r = e.onGetInputs();
            r && r.length && (t[0].disabled = !1);
        }
        if (e.onGetOutputs) {
            const r = e.onGetOutputs();
            r && r.length && (t[1].disabled = !1);
        }
        if (e.getExtraMenuOptions) {
            const r = e.getExtraMenuOptions(this, t);
            r && (r.push(null), (t = r.concat(t)));
        }
        return (
            e.clonable !== !1 &&
                t.push({
                    content: "Clone",
                    callback: _LGraphCanvas.onMenuNodeClone,
                }),
            Object.keys(this.selected_nodes).length > 1 &&
                t.push({
                    content: "Align Selected To",
                    has_submenu: !0,
                    callback: _LGraphCanvas.onNodeAlign,
                }),
            t.push(null, {
                content: "Remove",
                disabled: !(e.removable !== !1 && !e.block_delete),
                callback: _LGraphCanvas.onMenuNodeRemove,
            }),
            e.graph &&
                e.graph.onGetNodeMenuOptions &&
                e.graph.onGetNodeMenuOptions(t, e),
            t
        );
    }
    bringGroupToFront(e) {
        const t = this.graph._groups,
            r = this.findGroupIndexById(e.id);
        Number(r) !== -1 &&
            (t.splice(Number(r), 1), t.push(e), this.setDirty(!0, !0));
    }
    onGrpSizeEditor(e, t, r, n, s) {
        e.property;
        const a = document.createElement("div");
        (a.is_modified = !1),
            (a.className = "graphdialog"),
            (a.innerHTML = `
                <div class="d-flex flex-column align-items-start p-2" id="grpSizeDialog">
                  <div> <div><span class='main-tit p-1'>그룹 사이즈 변경</span> </div>
                  <div class="p-1"><span class='sub-prop'>넓이</span><input  type='number' class='value' id="widthValue" /></div>
                  <div class="p-1"><span class='sub-prop'>높이</span><input type='number' class='value' id="heightValue"  /></div>
                  <div class="d-flex align-items-center justify-content-end p-1"><button class="okBtn">OK</button></div>
                </div>
               
                
                `),
            (a.close = function () {
                a.parentNode && a.parentNode.removeChild(a);
            });
        const l = _LGraphCanvas.active_canvas.canvas,
            c = l.getBoundingClientRect();
        let u = -20,
            h = -20;
        c && ((u -= c.left), (h -= c.top)),
            event
                ? ((a.style.left = event.clientX + u + "px"),
                  (a.style.top = event.clientY + h + "px"))
                : ((a.style.left = l.width * 0.5 + u + "px"),
                  (a.style.top = l.height * 0.5 + h + "px")),
            a.querySelector(".okBtn").addEventListener("click", E),
            l.parentNode.appendChild(a);
        const d = document.querySelector("#widthValue"),
            p = document.querySelector("#heightValue");
        d &&
            ((d.value = Number(s.size[0])),
            d.addEventListener("keydown", function (b) {
                if (((a.is_modified = !0), b.keyCode == 27)) a.close();
                else if (b.keyCode == 13) E();
                else if (b.keyCode != 13 && b.target.localName != "textarea")
                    return;
                b.preventDefault(), b.stopPropagation();
            })),
            p &&
                ((p.value = Number(s.size[1])),
                p.addEventListener("keydown", function (b) {
                    if (((a.is_modified = !0), b.keyCode == 27)) a.close();
                    else if (b.keyCode == 13) E();
                    else if (
                        b.keyCode != 13 &&
                        b.target.localName != "textarea"
                    )
                        return;
                    b.preventDefault(), b.stopPropagation();
                }));
        let _ = null;
        a.addEventListener("mouseleave", function (b) {
            LiteGraph.dialog_close_on_mouse_leave &&
                !a.is_modified &&
                LiteGraph.dialog_close_on_mouse_leave &&
                (_ = setTimeout(
                    a.close,
                    LiteGraph.dialog_close_on_mouse_leave_delay
                ));
        }),
            a.addEventListener("mouseenter", function (b) {
                LiteGraph.dialog_close_on_mouse_leave && _ && clearTimeout(_);
            });
        function E() {
            m(d == null ? void 0 : d.value, p == null ? void 0 : p.value);
        }
        function m(b, L) {
            const T = b || s.size[0],
                g = L || s.size[1];
            (s.size = [T, g]),
                a.parentNode && a.parentNode.removeChild(a),
                s.setDirtyCanvas(!0, !0);
        }
    }
    onShowPropertyEditor(e, t, r, n, s) {
        const a = e.property || "title",
            o = s[a],
            l = document.createElement("div");
        (l.is_modified = !1),
            (l.className = "graphdialog"),
            (l.innerHTML =
                "<span class='name'></span><input type='text' class='value '/><button>OK</button>"),
            (l.close = function () {
                l.parentNode && l.parentNode.removeChild(l);
            });
        const c = l.querySelector(".name");
        c.innerText = a;
        let u = l.querySelector(".value");
        u &&
            ((u.value = o),
            u.addEventListener("keydown", function (T) {
                if (((l.is_modified = !0), T.keyCode == 27)) l.close();
                else if (T.keyCode == 13) b();
                else if (T.keyCode != 13 && T.target.localName != "textarea")
                    return;
                T.preventDefault(), T.stopPropagation();
            }));
        const f = _LGraphCanvas.active_canvas.canvas,
            d = f.getBoundingClientRect();
        let p = -20,
            _ = -20;
        d && ((p -= d.left), (_ -= d.top)),
            event
                ? ((l.style.left = event.clientX + p + "px"),
                  (l.style.top = event.clientY + _ + "px"))
                : ((l.style.left = f.width * 0.5 + p + "px"),
                  (l.style.top = f.height * 0.5 + _ + "px")),
            l.querySelector("button").addEventListener("click", b),
            f.parentNode.appendChild(l);
        let m = null;
        l.addEventListener("mouseleave", function (T) {
            LiteGraph.dialog_close_on_mouse_leave &&
                !l.is_modified &&
                LiteGraph.dialog_close_on_mouse_leave &&
                (m = setTimeout(
                    l.close,
                    LiteGraph.dialog_close_on_mouse_leave_delay
                ));
        }),
            l.addEventListener("mouseenter", function (T) {
                LiteGraph.dialog_close_on_mouse_leave && m && clearTimeout(m);
            });
        function b() {
            u && L(u.value);
        }
        function L(T) {
            e.type == "Number"
                ? (T = Number(T))
                : e.type == "Boolean" && (T = !!T),
                (s[a] = T),
                l.parentNode && l.parentNode.removeChild(l),
                s.setDirtyCanvas(!0, !0);
        }
    }
    onGrpPositionEditor(e, t, r, n, s) {
        const a = document.createElement("div");
        (a.is_modified = !1),
            (a.className = "graphdialog"),
            (a.innerHTML = `
                <div class="d-flex flex-column align-items-start p-2" id="grpSizeDialog">
                  <div> <div><span class='main-tit p-1'>그룹 위치 변경</span> </div>
                  <div class="p-1"><span class='sub-prop'>X</span><input  type='number' class='value' id="xValue" /></div>
                  <div class="p-1"><span class='sub-prop'>Y</span><input type='number' class='value' id="yValue" /></div>
                  <div class="d-flex align-items-center justify-content-end p-1"><button class="okBtn">OK</button></div>
                </div>
                `),
            (a.close = function () {
                a.parentNode && a.parentNode.removeChild(a);
            });
        const l = _LGraphCanvas.active_canvas.canvas,
            c = l.getBoundingClientRect();
        let u = -20,
            h = -20;
        c && ((u -= c.left), (h -= c.top)),
            event
                ? ((a.style.left = event.clientX + u + "px"),
                  (a.style.top = event.clientY + h + "px"))
                : ((a.style.left = l.width * 0.5 + u + "px"),
                  (a.style.top = l.height * 0.5 + h + "px")),
            a.querySelector(".okBtn").addEventListener("click", E),
            l.parentNode.appendChild(a);
        const d = document.querySelector("#xValue"),
            p = document.querySelector("#yValue");
        d &&
            ((d.value = Number(s.pos[0])),
            d.addEventListener("keydown", function (b) {
                if (((a.is_modified = !0), b.keyCode == 27)) a.close();
                else if (b.keyCode == 13) E();
                else if (b.keyCode != 13 && b.target.localName != "textarea")
                    return;
                b.preventDefault(), b.stopPropagation();
            })),
            p &&
                ((p.value = Number(s.pos[1])),
                p.addEventListener("keydown", function (b) {
                    if (((a.is_modified = !0), b.keyCode == 27)) a.close();
                    else if (b.keyCode == 13) E();
                    else if (
                        b.keyCode != 13 &&
                        b.target.localName != "textarea"
                    )
                        return;
                    b.preventDefault(), b.stopPropagation();
                }));
        let _ = null;
        a.addEventListener("mouseleave", function (b) {
            LiteGraph.dialog_close_on_mouse_leave &&
                !a.is_modified &&
                LiteGraph.dialog_close_on_mouse_leave &&
                (_ = setTimeout(
                    a.close,
                    LiteGraph.dialog_close_on_mouse_leave_delay
                ));
        }),
            a.addEventListener("mouseenter", function (b) {
                LiteGraph.dialog_close_on_mouse_leave && _ && clearTimeout(_);
            });
        function E() {
            m(d == null ? void 0 : d.value, p == null ? void 0 : p.value);
        }
        function m(b, L) {
            const T = b || s.pos[0],
                g = L || s.pos[1];
            s.recomputeInsideNodes();
            const A = [T - s.pos[0], g - s.pos[1]];
            s.move(A[0], A[1]),
                a.parentNode && a.parentNode.removeChild(a),
                s.setDirtyCanvas(!0, !0);
        }
    }
    // 그룹을 뒤로 보내는 함수
    sendGroupToBack(e) {
        const t = this.graph._groups,
            r = this.findGroupIndexById(e.id);
        Number(r) !== -1 &&
            (t.splice(Number(r), 1), t.unshift(e), this.setDirty(!0, !0));
    }
    findGroupIndexById(e) {
        const t = this.graph._groups;
        for (let r in t) if (t[r].id === e) return r;
        return -1;
    }
    addNodeGuideLines(e) {
        var r;
        const t = this.selected_nodes ? Object.keys(this.selected_nodes) : [];
        if (
            (t == null ? void 0 : t.length) === 1 &&
            !this.read_only &&
            ((r = this.graph._nodes) == null ? void 0 : r.length) >= 2
        ) {
            const n = this.selected_nodes[t[0]],
                a = n.constructor.title_mode ? 0 : LiteGraph.NODE_TITLE_HEIGHT,
                o = this.graph._nodes
                    .map((f) => ({
                        x: f.pos[0],
                        y: f.pos[1] - a,
                        width: f.size[0],
                        height: f.size[1],
                        id: f.id,
                    }))
                    .filter(
                        (f) =>
                            (f == null ? void 0 : f.id) !==
                            (n == null ? void 0 : n.id)
                    ),
                l = n.size[0],
                c = n.size[1],
                u = n.pos[0],
                h = n.pos[1] - a;
            (e.strokeStyle = "#c4c4c4"), (e.lineWidth = 1);
            for (let f in o) {
                e.strokeStyle = 16711680;
                const d = o[f],
                    p = d.width,
                    _ = d.height,
                    E = d.x,
                    m = d.y,
                    b = Math.round(u),
                    L = Math.round(h),
                    T = Math.round(l),
                    g = Math.round(c),
                    A = Math.round(E),
                    G = Math.round(m),
                    M = Math.round(p),
                    N = Math.round(_);
                A === b &&
                    (L < G
                        ? (e.beginPath(),
                          e.moveTo(b, L),
                          e.lineTo(A, G + N + a),
                          e.stroke())
                        : (e.beginPath(),
                          e.moveTo(A, G),
                          e.lineTo(b, L + g + a),
                          e.stroke())),
                    A + M === b + T &&
                        (L < G
                            ? (e.beginPath(),
                              e.moveTo(b + T, L),
                              e.lineTo(A + M, G + N + a),
                              e.stroke())
                            : (e.beginPath(),
                              e.moveTo(A + M, G),
                              e.lineTo(b + T, L + g + a),
                              e.stroke())),
                    G === L &&
                        (b < A
                            ? (e.beginPath(),
                              e.moveTo(b, L),
                              e.lineTo(A + M, G),
                              e.stroke())
                            : (e.beginPath(),
                              e.moveTo(A, G),
                              e.lineTo(b + T, L),
                              e.stroke())),
                    G + N === L + g &&
                        (b < A
                            ? (e.beginPath(),
                              e.moveTo(b, L + g + a),
                              e.lineTo(A + M, G + N + a),
                              e.stroke())
                            : (e.beginPath(),
                              e.moveTo(A, G + N + a),
                              e.lineTo(b + T, L + g + a),
                              e.stroke()));
            }
        }
    }
    // 노드/그룹 추가 한글로 변경
    getCanvasMenuOptions() {
        let e = null;
        if (
            (this.getMenuOptions
                ? (e = this.getMenuOptions())
                : ((e = [
                      {
                          content: "노드 추가",
                          has_submenu: !0,
                          callback: _LGraphCanvas.onMenuAdd.bind(this),
                      },
                      {
                          content: "그룹 추가",
                          callback: _LGraphCanvas.onGroupAdd,
                      },
                      //{ content: "Arrange", callback: that.graph.arrange },
                      //{content:"Collapse All", callback: LGraphCanvas.onMenuCollapseAll }
                  ]),
                  Object.keys(this.selected_nodes).length > 1 &&
                      e.push({
                          content: "정렬",
                          has_submenu: !0,
                          callback: _LGraphCanvas.onGroupAlign,
                      }),
                  this._graph_stack &&
                      this._graph_stack.length > 0 &&
                      e.push(null, {
                          content: "Close subgraph",
                          callback: this.closeSubgraph.bind(this),
                      })),
            this.getExtraMenuOptions)
        ) {
            const t = this.getExtraMenuOptions(this, e);
            t && (e = e.concat(t));
        }
        return e;
    }
    // getCanvasMenuOptions () {
    //     const options = null;
    //     const that = this;
    //     if (this.getMenuOptions) {
    //         options = this.getMenuOptions();
    //     } else {
    //         options = [
    //             {
    //                 content: "Add Node",
    //                 has_submenu: true,
    //                 callback: LGraphCanvas.onMenuAdd,
    //             },
    //             { content: "Add Group", callback: LGraphCanvas.onGroupAdd },
    //             //{ content: "Arrange", callback: that.graph.arrange },
    //             //{content:"Collapse All", callback: LGraphCanvas.onMenuCollapseAll }
    //         ];
    //         /*if (LiteGraph.showCanvasOptions){
    //             options.push({ content: "Options", callback: that.showShowGraphOptionsPanel });
    //         }*/
    //         if (Object.keys(this.selected_nodes).length > 1) {
    //             options.push({
    //                 content: "Align",
    //                 has_submenu: true,
    //                 callback: LGraphCanvas.onGroupAlign,
    //             });
    //         }
    //         if (this._graph_stack && this._graph_stack.length > 0) {
    //             options.push(null, {
    //                 content: "Close subgraph",
    //                 callback: this.closeSubgraph.bind(this),
    //             });
    //         }
    //     }
    //     if (this.getExtraMenuOptions) {
    //         const extra = this.getExtraMenuOptions(this, options);
    //         if (extra) {
    //             options = options.concat(extra);
    //         }
    //     }
    //     return options;
    // };
    processContextMenu(e, t) {
        const r = this,
            s = _LGraphCanvas.active_canvas.getCanvasWindow();
        if (!s) return;
        let a = null;
        const o = {
            event: t,
            callback: c,
            extra: e,
        };
        e && (o.title = e.type);
        let l = null;
        if (
            (e &&
                ((l = e.getSlotInPosition(t.canvasX, t.canvasY)),
                (_LGraphCanvas.active_node = e)),
            l)
        ) {
            if (((a = []), e.getSlotMenuOptions)) a = e.getSlotMenuOptions(l);
            else {
                l &&
                    l.output &&
                    l.output.links &&
                    l.output.links.length &&
                    a.push({
                        content: "Disconnect Links",
                        slot: l,
                    });
                const u = l.input || l.output;
                u.removable &&
                    a.push(
                        u.locked
                            ? "Cannot remove"
                            : { content: "Remove Slot", slot: l }
                    ),
                    u.nameLocked || a.push({ content: "Rename Slot", slot: l });
            }
            (o.title = (l.input ? l.input.type : l.output.type) || "*"),
                l.input &&
                    l.input.type == LiteGraph.ACTION &&
                    (o.title = "Action"),
                l.output &&
                    l.output.type == LiteGraph.EVENT &&
                    (o.title = "Event");
        } else if (e) a = this.getNodeMenuOptions(e);
        else {
            a = this.getCanvasMenuOptions();
            const u = this.graph.getGroupOnPos(t.canvasX, t.canvasY);
            u &&
                a.push(null, {
                    content: "Edit Group",
                    has_submenu: !0,
                    submenu: {
                        title: "Group",
                        extra: u,
                        options: this.getGroupMenuOptions(u),
                    },
                });
        }
        if (!a) return;
        new ContextMenu(a, o, s);
        function c(u, h, f) {
            if (u) {
                if (u.content == "Remove Slot") {
                    const d = u.slot;
                    e.graph.beforeChange(),
                        d.input
                            ? e.removeInput(d.slot)
                            : d.output && e.removeOutput(d.slot),
                        e.graph.afterChange();
                    return;
                } else if (u.content == "Disconnect Links") {
                    const d = u.slot;
                    e.graph.beforeChange(),
                        d.output
                            ? e.disconnectOutput(d.slot)
                            : d.input && e.disconnectInput(d.slot),
                        e.graph.afterChange();
                    return;
                } else if (u.content == "Rename Slot") {
                    const d = u.slot,
                        p = d.input
                            ? e.getInputInfo(d.slot)
                            : e.getOutputInfo(d.slot),
                        _ = r.createDialog(
                            "<span class='name'>Name</span><input autofocus type='text'/><button>OK</button>",
                            h
                        ),
                        E = _.querySelector("input");
                    E && p && (E.value = p.label || "");
                    const m = function () {
                        e.graph.beforeChange(),
                            E.value &&
                                (p && (p.label = E.value), r.setDirty(!0)),
                            _.close(),
                            e.graph.afterChange();
                    };
                    _.querySelector("button").addEventListener("click", m),
                        E.addEventListener("keydown", function (b) {
                            if (((_.is_modified = !0), b.keyCode == 27))
                                _.close();
                            else if (b.keyCode == 13) m();
                            else if (
                                b.keyCode != 13 &&
                                b.target.localName != "textarea"
                            )
                                return;
                            b.preventDefault(), b.stopPropagation();
                        }),
                        E.focus();
                }
            }
        }
    }
};
k(
    _LGraphCanvas,
    "DEFAULT_BACKGROUND_IMAGE",
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNrs1rEKwjAUhlETUkj3vP9rdmr1Ysammk2w5wdxuLgcMHyptfawuZX4pJSWZTnfnu/lnIe/jNNxHHGNn//HNbbv+4dr6V+11uF527arU7+u63qfa/bnmh8sWLBgwYJlqRf8MEptXPBXJXa37BSl3ixYsGDBMliwFLyCV/DeLIMFCxYsWLBMwSt4Be/NggXLYMGCBUvBK3iNruC9WbBgwYJlsGApeAWv4L1ZBgsWLFiwYJmCV/AK3psFC5bBggULloJX8BpdwXuzYMGCBctgwVLwCl7Be7MMFixYsGDBsu8FH1FaSmExVfAxBa/gvVmwYMGCZbBg/W4vAQYA5tRF9QYlv/QAAAAASUVORK5CYII="
),
    k(_LGraphCanvas, "link_type_colors", {
        "-1": LiteGraph.EVENT_LINK_COLOR,
        number: "#AAA",
        node: "#DCA",
    }),
    k(_LGraphCanvas, "gradients", {}), //cache of gradients
    k(_LGraphCanvas, "search_limit", -1),
    k(_LGraphCanvas, "node_colors", {
        red: { color: "#322", bgcolor: "#533", groupcolor: "#A88" },
        brown: {
            color: "#332922",
            bgcolor: "#593930",
            groupcolor: "#b06634",
        },
        green: { color: "#232", bgcolor: "#353", groupcolor: "#8A8" },
        blue: { color: "#223", bgcolor: "#335", groupcolor: "#88A" },
        pale_blue: {
            color: "#2a363b",
            bgcolor: "#3f5159",
            groupcolor: "#3f789e",
        },
        cyan: { color: "#233", bgcolor: "#355", groupcolor: "#8AA" },
        purple: { color: "#323", bgcolor: "#535", groupcolor: "#a1309b" },
        yellow: { color: "#432", bgcolor: "#653", groupcolor: "#b58b2a" },
        black: { color: "#222", bgcolor: "#000", groupcolor: "#444" },
    });
let LGraphCanvas = _LGraphCanvas;
class ContextMenu {
    constructor(t, r) {
        (r = r || {}), (this.options = r);
        const n = this;
        r.parentMenu &&
            (r.parentMenu.constructor !== this.constructor
                ? (console.error(
                      "parentMenu must be of class ContextMenu, ignoring it"
                  ),
                  (r.parentMenu = null))
                : ((this.parentMenu = r.parentMenu),
                  (this.parentMenu.lock = !0),
                  (this.parentMenu.current_submenu = this)));
        let s = null;
        r.event && (s = r.event.constructor.name),
            s !== "MouseEvent" &&
                s !== "CustomEvent" &&
                s !== "PointerEvent" &&
                (console.error(
                    "Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it. (" +
                        s +
                        ")"
                ),
                (r.event = null));
        const a = document.createElement("div");
        (a.className = "litegraph litecontextmenu litemenubar-panel"),
            r.className && (a.className += " " + r.className),
            (a.style.minWidth = 100),
            (a.style.minHeight = 100),
            (a.style.pointerEvents = "none"),
            setTimeout(function () {
                a.style.pointerEvents = "auto";
            }, 100),
            LiteGraph.pointerListenerAdd(
                a,
                "up",
                function (d) {
                    return d.preventDefault(), !0;
                },
                !0
            ),
            a.addEventListener(
                "contextmenu",
                function (d) {
                    return d.button != 2 || d.preventDefault(), !1;
                },
                !0
            ),
            LiteGraph.pointerListenerAdd(
                a,
                "down",
                function (d) {
                    if (d.button == 2) return n.close(), d.preventDefault(), !0;
                },
                !0
            );
        function o(d) {
            const p = parseInt(a.style.top);
            return (
                (a.style.top =
                    (p + d.deltaY * r.scroll_speed).toFixed() + "px"),
                d.preventDefault(),
                !0
            );
        }
        if (
            (r.scroll_speed || (r.scroll_speed = 0.1),
            a.addEventListener("wheel", o, !0),
            a.addEventListener("mousewheel", o, !0),
            (this.root = a),
            r.title)
        ) {
            const d = document.createElement("div");
            (d.className = "litemenu-title"),
                (d.innerHTML = r.title),
                a.appendChild(d);
        }
        for (let d = 0; d < t.length; d++) {
            let p = t.constructor == Array ? t[d] : d;
            p != null &&
                p.constructor !== String &&
                (p = p.content === void 0 ? String(p) : p.content);
            const _ = t[d];
            this.addItem(p, _, r);
        }
        LiteGraph.pointerListenerAdd(a, "enter", function (d) {
            a.closing_timer && clearTimeout(a.closing_timer);
        });
        let l = document;
        r.event && (l = r.event.target.ownerDocument),
            l || (l = document),
            l.fullscreenElement
                ? l.fullscreenElement.appendChild(a)
                : l.body.appendChild(a);
        let c = r.left || 0,
            u = r.top || 0;
        if (r.event) {
            if (
                ((c = r.event.clientX - 10),
                (u = r.event.clientY - 10),
                r.title && (u -= 20),
                r.parentMenu)
            ) {
                const _ = r.parentMenu.root.getBoundingClientRect();
                c = _.left + _.width;
            }
            const d = document.body.getBoundingClientRect(),
                p = a.getBoundingClientRect();
            d.height == 0 &&
                console.error(
                    "document.body height is 0. That is dangerous, set html,body { height: 100%; }"
                ),
                d.width &&
                    c > d.width - p.width - 10 &&
                    (c = d.width - p.width - 10),
                d.height &&
                    u > d.height - p.height - 10 &&
                    (u = d.height - p.height - 10);
        }
        (a.style.left = c + "px"),
            (a.style.top = u + "px"),
            r.scale && (a.style.transform = "scale(" + r.scale + ")");
        const f = LGraphCanvas.active_canvas.canvas;
        this.parent = f.parentElement || document;
    }
    addItem(t, r, n) {
        const s = this;
        n = n || {};
        const a = document.createElement("div");
        a.className = "litemenu-entry submenu";
        let o = !1;
        r === null
            ? a.classList.add("separator")
            : ((a.innerHTML = r && r.title ? r.title : t),
              (a.value = r),
              r &&
                  (r.disabled && ((o = !0), a.classList.add("disabled")),
                  (r.submenu || r.has_submenu) &&
                      a.classList.add("has_submenu")),
              typeof r == "function"
                  ? ((a.dataset.value = t), (a.onclick_callback = r))
                  : (a.dataset.value = r),
              r.className && (a.className += " " + r.className)),
            this.root.appendChild(a),
            o || a.addEventListener("click", c),
            !o && n.autoopen && LiteGraph.pointerListenerAdd(a, "enter", l);
        function l(u) {
            const h = this.value;
            !h || !h.has_submenu || c.call(this, u);
        }
        function c(u) {
            const h = this.value;
            let f = !0;
            if (
                (s.current_submenu && s.current_submenu.close(u),
                n.callback &&
                    n.callback.call(this, h, n, u, s, n.node) === !0 &&
                    (f = !1),
                h &&
                    (h.callback &&
                        !n.ignore_item_callbacks &&
                        h.disabled !== !0 &&
                        h.callback.call(this, h, n, u, s, n.extra) === !0 &&
                        (f = !1),
                    h.submenu))
            ) {
                if (!h.submenu.options)
                    throw "ContextMenu submenu needs options";
                new s.constructor(h.submenu.options, {
                    callback: h.submenu.callback,
                    event: u,
                    parentMenu: s,
                    ignore_item_callbacks: h.submenu.ignore_item_callbacks,
                    title: h.submenu.title,
                    extra: h.submenu.extra,
                    autoopen: n.autoopen,
                }),
                    (f = !1);
            }
            f && !s.lock && s.close();
        }
        return a;
    }
    close(t, r) {
        this.root.parentNode && this.root.parentNode.removeChild(this.root),
            this.parentMenu &&
                !r &&
                ((this.parentMenu.lock = !1),
                (this.parentMenu.current_submenu = null),
                t === void 0
                    ? this.parentMenu.close()
                    : t &&
                      !ContextMenu.isCursorOverElement(
                          t,
                          this.parentMenu.root
                      ) &&
                      ContextMenu.trigger(
                          this.parentMenu.root,
                          LiteGraph.pointerevents_method + "leave",
                          t
                      )),
            this.current_submenu && this.current_submenu.close(t, !0),
            this.root.closing_timer && clearTimeout(this.root.closing_timer);
    }
    //this code is used to trigger events easily (used in the context menu mouseleave
    static trigger(t, r, n, s) {
        const a = document.createEvent("CustomEvent");
        return (
            a.initCustomEvent(r, !0, !0, n),
            (a.srcElement = s),
            t.dispatchEvent
                ? t.dispatchEvent(a)
                : t.__events && t.__events.dispatchEvent(a),
            a
        );
    }
    //returns the top most menu
    getTopMenu() {
        return this.options.parentMenu
            ? this.options.parentMenu.getTopMenu()
            : this;
    }
    getFirstEvent() {
        return this.options.parentMenu
            ? this.options.parentMenu.getFirstEvent()
            : this.options.event;
    }
    static isCursorOverElement(t, r) {
        const n = t.clientX,
            s = t.clientY,
            a = r.getBoundingClientRect();
        return a
            ? s > a.top &&
                  s < a.top + a.height &&
                  n > a.left &&
                  n < a.left + a.width
            : !1;
    }
}
function clamp(e, t, r) {
    return t > e ? t : r < e ? r : e;
}
typeof window < "u" &&
    !window.requestAnimationFrame &&
    (window.requestAnimationFrame =
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (e) {
            window.setTimeout(e, 1e3 / 60);
        });
typeof exports < "u" &&
    ((exports.LiteGraph = (void 0).LiteGraph),
    (exports.LGraph = (void 0).LGraph),
    (exports.LLink = (void 0).LLink),
    (exports.LGraphNode = (void 0).LGraphNode),
    (exports.LGraphGroup = (void 0).LGraphGroup),
    (exports.DragAndScale = (void 0).DragAndScale),
    (exports.LGraphCanvas = (void 0).LGraphCanvas),
    (exports.ContextMenu = (void 0).ContextMenu));
class Editor {
    constructor(t, r) {
        (this.options = r || {}), (this.container_id = t);
    }
    async init() {
        var t =
            "<div class='header'><div class='tools tools-left'></div><div class='tools tools-right'></div></div>";
        (t +=
            "<div class='content'><div class='editor-area'><canvas class='graphcanvas' width='1000' height='500' tabindex=10></canvas></div></div>"),
            (t +=
                "<div class='footer'><div class='tools tools-left'></div><div class='tools tools-right'></div></div>");
        var r = document.createElement("div");
        (this.root = r),
            (r.className = "litegraph litegraph-editor"),
            (r.innerHTML = t),
            (this.tools = r.querySelector(".tools")),
            (this.content = r.querySelector(".content")),
            (this.footer = r.querySelector(".footer"));
        var n = (this.canvas = r.querySelector(".graphcanvas")),
            s = (this.graph = new LGraph()),
            a = (this.graphcanvas = new LGraphCanvas(n, s, {
                useWebgl: !1,
            }));
        await a._init(n),
            (a.links_render_mode = 0),
            (a.background_image = "/editor/imgs/grid.png"),
            (s.onAfterExecute = function () {
                a.draw(!0);
            }),
            (a.onDropItem = this.onDropItem.bind(this)),
            this.addLoadCounter(),
            this.addToolsButton(
                "playnode_button",
                "Play",
                "/editor/imgs/icon-play.png",
                this.onPlayButton.bind(this),
                ".tools-right"
            ),
            this.addToolsButton(
                "playstepnode_button",
                "Step",
                "/editor/imgs/icon-playstep.png",
                this.onPlayStepButton.bind(this),
                ".tools-right"
            ),
            this.options.skip_livemode ||
                this.addToolsButton(
                    "livemode_button",
                    "Live",
                    "/editor/imgs/icon-record.png",
                    this.onLiveButton.bind(this),
                    ".tools-right"
                ),
            this.options.skip_maximize ||
                this.addToolsButton(
                    "maximize_button",
                    "",
                    "/editor/imgs/icon-maximize.png",
                    this.onFullscreenButton.bind(this),
                    ".tools-right"
                ),
            this.options.miniwindow && this.addMiniWindow(300, 200);
        var o = document.getElementById(this.container_id);
        o && o.appendChild(r), a.resize();
    }
    addLoadCounter() {
        var t = document.createElement("div");
        t.className = "headerpanel loadmeter toolbar-widget";
        var r =
            "<div class='cpuload'><strong>CPU</strong> <div class='bgload'><div class='fgload'></div></div></div>";
        (r +=
            "<div class='gpuload'><strong>GFX</strong> <div class='bgload'><div class='fgload'></div></div></div>"),
            (t.innerHTML = r),
            this.root.querySelector(".header .tools-left").appendChild(t);
        var n = this;
        setInterval(function () {
            (t.querySelector(".cpuload .fgload").style.width =
                2 * n.graph.execution_time * 90 + "px"),
                n.graph.status == LGraph.STATUS_RUNNING
                    ? (t.querySelector(".gpuload .fgload").style.width =
                          n.graphcanvas.render_time * 10 * 90 + "px")
                    : (t.querySelector(".gpuload .fgload").style.width = "4px");
        }, 200);
    }
    addToolsButton(t, r, n, s, a) {
        a || (a = ".tools");
        var o = this.createButton(r, n, s);
        (o.id = t), this.root.querySelector(a).appendChild(o);
    }
    createButton(t, r, n) {
        var s = document.createElement("button");
        return (
            r && (s.innerHTML = "<img src='" + r + "'/> "),
            s.classList.add("btn"),
            (s.innerHTML += t),
            n && s.addEventListener("click", n),
            s
        );
    }
    onLoadButton() {
        var t = this.graphcanvas.createPanel("Load session", {
            closable: !0,
        });
        this.root.appendChild(t);
    }
    onSaveButton() {}
    onPlayButton() {
        var t = this.graph,
            r = this.root.querySelector("#playnode_button");
        t.status == LGraph.STATUS_STOPPED
            ? ((r.innerHTML = "<img src='/editor/imgs/icon-stop.png'/> Stop"),
              t.start())
            : ((r.innerHTML = "<img src='/editor/imgs/icon-play.png'/> Play"),
              t.stop());
    }
    onPlayStepButton() {
        var t = this.graph;
        t.runStep(1), this.graphcanvas.draw(!0, !0);
    }
    onLiveButton() {
        var t = !this.graphcanvas.live_mode;
        this.graphcanvas.switchLiveMode(!0),
            this.graphcanvas.draw(),
            this.graphcanvas.live_mode;
        var r = this.root.querySelector("#livemode_button");
        r.innerHTML = t
            ? "<img src='/editor/imgs/icon-gear.png'/> Edit"
            : "<img src='/editor/imgs/icon-record.png'/> Live";
    }
    onDropItem(t) {
        for (var r = this, n = 0; n < t.dataTransfer.files.length; ++n) {
            var s = t.dataTransfer.files[n],
                a = LGraphCanvas.getFileExtension(s.name),
                o = new FileReader();
            a == "json" &&
                ((o.onload = function (l) {
                    var c = JSON.parse(l.target.result);
                    r.graph.configure(c);
                }),
                o.readAsText(s));
        }
    }
    goFullscreen() {
        if (this.root.requestFullscreen)
            this.root.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        else if (this.root.mozRequestFullscreen)
            this.root.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        else if (this.root.webkitRequestFullscreen)
            this.root.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        else throw "Fullscreen not supported";
        var t = this;
        setTimeout(function () {
            t.graphcanvas.resize();
        }, 100);
    }
    onFullscreenButton() {
        this.goFullscreen();
    }
    addMiniWindow(t, r) {
        var n = document.createElement("div");
        (n.className = "litegraph miniwindow"),
            (n.innerHTML =
                "<canvas class='graphcanvas' width='" +
                t +
                "' height='" +
                r +
                "' tabindex=10></canvas>");
        var s = n.querySelector("canvas"),
            a = this,
            o = new LGraphCanvas(s, this.graph);
        (o.show_info = !1),
            (o.background_image = "/editor/imgs/grid.png"),
            (o.scale = 0.25),
            (o.allow_dragnodes = !1),
            (o.allow_interaction = !1),
            (o.render_shadows = !1),
            (o.max_zoom = 0.25),
            (this.miniwindow_graphcanvas = o),
            (o.onClear = function () {
                (o.scale = 0.25),
                    (o.allow_dragnodes = !1),
                    (o.allow_interaction = !1);
            }),
            (o.onRenderBackground = function (c, u) {
                u.strokeStyle = "#567";
                var h = a.graphcanvas.convertOffsetToCanvas([0, 0]),
                    f = a.graphcanvas.convertOffsetToCanvas([
                        a.graphcanvas.canvas.width,
                        a.graphcanvas.canvas.height,
                    ]);
                (h = this.convertCanvasToOffset(h)),
                    (f = this.convertCanvasToOffset(f)),
                    (u.lineWidth = 1),
                    u.strokeRect(
                        Math.floor(h[0]) + 0.5,
                        Math.floor(h[1]) + 0.5,
                        Math.floor(f[0] - h[0]),
                        Math.floor(f[1] - h[1])
                    );
            }),
            (n.style.position = "absolute"),
            (n.style.top = "4px"),
            (n.style.right = "4px");
        var l = document.createElement("div");
        (l.className = "corner-button"),
            (l.innerHTML = "&#10060;"),
            l.addEventListener("click", function (c) {
                o.setGraph(null), n.parentNode.removeChild(n);
            }),
            n.appendChild(l),
            this.root.querySelector(".content").appendChild(n);
    }
    addMultiview() {
        var t = this.canvas;
        (this.graphcanvas.ctx.fillStyle = "black"),
            this.graphcanvas.ctx.fillRect(0, 0, t.width, t.height),
            (this.graphcanvas.viewport = [0, 0, t.width * 0.5 - 2, t.height]);
        var r = new LGraphCanvas(t, this.graph);
        (r.background_image = "/editor/imgs/grid.png"),
            (this.graphcanvas2 = r),
            (this.graphcanvas2.viewport = [
                t.width * 0.5,
                0,
                t.width * 0.5,
                t.height,
            ]);
    }
    subMultiview() {
        var t = this.canvas;

        var r = new LGraphCanvas(t, this.graph);
        (r.background_image = "/editor/imgs/grid.png"),
            (this.graphcanvas2 = r),
            (this.graphcanvas2.viewport = [t.width, 0, t.width, t.height]);
    }
}
class RootNode extends LGraphNode {
    constructor() {
        super(),
            (this.mode = 0),
            this.addProperty("status", 0, "number"),
            this.addProperty("message", "", "string");
    }
}
class ManualTrigger extends RootNode {
    constructor() {
        super(), (this.title = "수동 시작");
    }
    onExecute() {}
}
LiteGraph.registerNodeType("trigger/manualTrigger", ManualTrigger);
class Selector extends LGraphNode {
    constructor() {
        super(),
            this.addInput("sel", "number"),
            this.addInput("A"),
            this.addInput("B"),
            this.addInput("C"),
            this.addInput("D"),
            this.addOutput("out"),
            (this.selected = 0),
            (this.title = "Selector"),
            (this.desc = "selects an output");
    }
    onDrawBackground(t) {
        if (!this.flags.collapsed) {
            t.fillStyle = "#AFB";
            var r = (this.selected + 1) * LiteGraph.NODE_SLOT_HEIGHT + 6;
            t.beginPath(),
                t.moveTo(50, r),
                t.lineTo(50, r + LiteGraph.NODE_SLOT_HEIGHT),
                t.lineTo(34, r + LiteGraph.NODE_SLOT_HEIGHT * 0.5),
                t.fill();
        }
    }
    onExecute() {
        var t = this.getInputData(0);
        (t == null || t.constructor !== Number) && (t = 0),
            (this.selected = t = Math.round(t) % (this.inputs.length - 1));
        var r = this.getInputData(t + 1);
        r !== void 0 && this.setOutputData(0, r);
    }
    onGetInputs() {
        return [
            ["E", 0],
            ["F", 0],
            ["G", 0],
            ["H", 0],
        ];
    }
}
class Sequence extends LGraphNode {
    constructor() {
        super(),
            (this.properties = {
                sequence: "A,B,C",
            }),
            this.addInput("index", "number"),
            this.addInput("seq"),
            this.addOutput("out"),
            (this.index = 0),
            (this.values = this.properties.sequence.split(",")),
            (this.title = "Sequence"),
            (this.desc = "select one element from a sequence from a string");
    }
    onPropertyChanged(t, r) {
        t == "sequence" && (this.values = r.split(","));
    }
    onExecute() {
        var t = this.getInputData(1);
        t &&
            t != this.current_sequence &&
            ((this.values = t.split(",")), (this.current_sequence = t));
        var r = this.getInputData(0);
        r == null && (r = 0),
            (this.index = r = Math.round(r) % this.values.length),
            this.setOutputData(0, this.values[r]);
    }
}
class LogicAnd extends LGraphNode {
    constructor() {
        super(),
            (this.properties = {}),
            this.addInput("a", "boolean"),
            this.addInput("b", "boolean"),
            this.addOutput("out", "boolean"),
            (this.title = "AND"),
            (this.desc = "Return true if all inputs are true");
    }
    onExecute() {
        var t = !0;
        for (var r in this.inputs)
            if (!this.getInputData(r)) {
                var t = !1;
                break;
            }
        this.setOutputData(0, t);
    }
    onGetInputs() {
        return [["and", "boolean"]];
    }
}
class LogicOr extends LGraphNode {
    constructor() {
        super(),
            (this.properties = {}),
            this.addInput("a", "boolean"),
            this.addInput("b", "boolean"),
            this.addOutput("out", "boolean"),
            (this.title = "OR"),
            (this.desc = "Return true if at least one input is true");
    }
    onExecute() {
        var t = !1;
        for (var r in this.inputs)
            if (this.getInputData(r)) {
                t = !0;
                break;
            }
        this.setOutputData(0, t);
    }
    onGetInputs() {
        return [["or", "boolean"]];
    }
}
class LogicNot extends LGraphNode {
    constructor() {
        super(),
            (this.properties = {}),
            this.addInput("in", "boolean"),
            this.addOutput("out", "boolean"),
            (this.title = "NOT"),
            (this.desc = "Return the logical negation");
    }
    onExecute() {
        var t = !this.getInputData(0);
        this.setOutputData(0, t);
    }
}
class LogicCompare extends LGraphNode {
    constructor() {
        super(),
            (this.properties = {}),
            this.addInput("a", "boolean"),
            this.addInput("b", "boolean"),
            this.addOutput("out", "boolean"),
            (this.title = "bool == bool"),
            (this.desc = "Compare for logical equality");
    }
    onExecute() {
        var t = null,
            r = !0;
        for (var n in this.inputs)
            if (t === null) t = this.getInputData(n);
            else if (t != this.getInputData(n)) {
                r = !1;
                break;
            }
        this.setOutputData(0, r);
    }
    onGetInputs() {
        return [["bool", "boolean"]];
    }
}
class LogicBranch extends LGraphNode {
    constructor() {
        super(),
            (this.properties = {}),
            this.addInput("onTrigger", LiteGraph.ACTION),
            this.addInput("condition", "boolean"),
            this.addOutput("true", LiteGraph.EVENT),
            this.addOutput("false", LiteGraph.EVENT),
            (this.mode = LiteGraph.ON_TRIGGER),
            (this.title = "Branch"),
            (this.desc = "Branch execution on condition");
    }
    onExecute(t, r) {
        var n = this.getInputData(1);
        n ? this.triggerSlot(0) : this.triggerSlot(1);
    }
}
LiteGraph.registerNodeType("logic/CompareBool", LogicCompare);
LiteGraph.registerNodeType("logic/NOT", LogicNot);
LiteGraph.registerNodeType("logic/OR", LogicOr);
LiteGraph.registerNodeType("logic/AND", LogicAnd);
LiteGraph.registerNodeType("logic/sequence", Sequence);
LiteGraph.registerNodeType("logic/selector", Selector);
LiteGraph.registerNodeType("logic/IF", LogicBranch);
export {
    ContextMenu,
    DragAndScale,
    Editor,
    LGraph,
    LGraphCanvas,
    LGraphGroup,
    LGraphNode,
    LLink,
    LiteGraph,
    clamp,
};
