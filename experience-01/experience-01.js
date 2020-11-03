import { rbgaToByte, randomInt, random, HSLToRGB } from '../utils.js'

const canvas = document.querySelector('canvas')
if (!canvas.getContext) alert('This website is not supported by your web browser. Ever heard of Chrome ? Firefox maybe ..?')
const ctx = canvas.getContext('2d')
const height = document.body.clientHeight
const width = document.body.clientWidth

function getRandomV2(xStart = 0, xEnd = width, yStart = 0, yEnd = height) {
    return [randomInt(xStart, xEnd), randomInt(yStart, yEnd)]
}

function fillColor(color) {
    var [r, g, b, a] = rbgaToByte(color)
    ctx.fillStyle = `rgba(${r},${g},${b},${a})`
    ctx.fill()
}

function randomPolygon(edges, color) {
    ctx.beginPath()
    ctx.moveTo(...getRandomV2())
    for (var i = 0; i < edges - 1; i++) {
        ctx.lineTo(...getRandomV2())
    }
    fillColor(color)
}

export function randomSaturatedColor(dT) {
    var factor = 0.1
    var offset = 0
    return [...HSLToRGB([random(dT * factor, dT * factor + offset), 1, random(0.55, 0.45)]), 1]
}

export function run() {
    canvas.height = height
    canvas.width = width

    var dT = 0

    setInterval(() => {
        dT++
        randomPolygon(3, randomSaturatedColor(dT))
    })
}