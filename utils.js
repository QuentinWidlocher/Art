export function toByte(v) { return v * 255 }
export function fromByte(v) { return v / 255 }

export function map(array, fn) {
    return array.map(fn);
}

export function random(to = 1, from = 0) {
    return Math.random()*(to - from) + from
}

export function rbgaToByte([r = 1, g = 1, b = 1, a = 1]) {
    return [...[r, g, b].map(toByte), a]
}

export function randomInt(from = 0, to = 1) {
    return Math.round(random(from, to))
}

export function randomColor(alpha = 1) {
    return [random(), random(), random(), alpha]
}

export function randomHSL() {
    return [random(360), random(), random()]
}

export function wrap(min, max, val) {
    var result = val
    if (val < min) result = max - (min - val)
    if (val > max) result = min + (val - max)
    if (max < result || result < min) result = wrap(min, max, result)
    return result
}

export function clamp(min, max, val) {
    var result = val
    if (val < min) result = min
    if (val > max) result = max
    return result
}

// Based on the formula at https://en.wikipedia.org/wiki/HSL_and_HSV
export function HSLToRGB([h, s, l]) {

    function isBetween(min = 0, v = 0, max = 1) {
        return min <= v && v <= max
    }

    h = wrap(0, 360, h)
    s = wrap(0, 1, s)
    l = wrap(0, 1, l)

    var c = (1 - Math.abs(2 * l - 1)) * s
    var hP = h / 60
    var x = c * (1 - Math.abs((hP % 2) - 1))

    var r1, g1, b1

    if (isBetween(0, hP, 1)) [r1, g1, b1] = [c, x, 0]
    if (isBetween(1, hP, 2)) [r1, g1, b1] = [x, c, 0]
    if (isBetween(2, hP, 3)) [r1, g1, b1] = [0, c, x]
    if (isBetween(3, hP, 4)) [r1, g1, b1] = [0, x, c]
    if (isBetween(4, hP, 5)) [r1, g1, b1] = [x, 0, c]
    if (isBetween(5, hP, 6)) [r1, g1, b1] = [c, 0, x]

    var m = l - (c/2)

    return [r1 + m, g1 + m, b1 + m]
}