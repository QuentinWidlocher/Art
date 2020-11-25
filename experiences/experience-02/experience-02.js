import { getRGBA, random, randomInt } from '../../utils.js'

const canvas = document.querySelector('canvas')
if (!canvas.getContext) alert('This website is not supported by your web browser. Ever heard of Chrome ? Firefox maybe ..?')
const ctx = canvas.getContext('2d')
const height = document.body.clientHeight
const width = document.body.clientWidth

var defaultWave = {
    x: 0, y: 0,
    offset: 0,
    life: 1,
    lifeSpan: 2000,
    opacity: 0,
    foamOpacity: 0,
    foamScale: 0,
    wetSandOpacity: 0,
    wetSandScale: 0,
    distance: ((height / 5) * 4)
}

var waveList = [...new Array(2)].map(_ => ({ 
    ...defaultWave, 
    lifeSpan: randomInt(1500, 3500), 
    life: randomInt(defaultWave.lifeSpan, 1),
    distance: defaultWave.distance + randomInt(100, -100)
}))

export function run() {
    canvas.height = height
    canvas.width = width

    function nextTick() {
        setTimeout(() => {
            clear()
            drawRectangle('#CDB48C', 0, 0, width, height)
            waveList.forEach(draw)
            nextTick()
        })
    }

    nextTick()
}

function clear() {
    ctx.clearRect(0, 0, width, height)
}

function draw(wave) {
    if (wave.life <= wave.lifeSpan) {
        waveUpdatePosition(wave)
        waveUpdateOpacity(wave)
        waveUpdateWetSandSize(wave)
        waveUpdateWetSandOpacity(wave)
        waveUpdateFoamSize(wave)
        waveUpdateFoamOpacity(wave)

        var waveColor = getRGBA([0, 132/255, 162/255, wave.opacity / 1.5])
        var wetSandColor = getRGBA([0, 0, 0, wave.wetSandOpacity / 10])
        var foamColor = getRGBA([1, 1, 1, wave.foamOpacity])

        drawRectangle(waveColor, wave.x, wave.y - height, width, height)
        drawRectangle(wetSandColor, wave.x, wave.y, width, wave.wetSandScale*500)
        drawRectangle(foamColor, wave.x, wave.y, width, wave.foamScale * 100)

        wave.life += 1
    } else {
        wave.life = 1
        wave.offset = random()
    }
}

function waveUpdatePosition(wave) {
    function f(x) {
        return Math.sin(Math.PI * x)
    }

    var x = (wave.life / wave.lifeSpan)
    wave.y = f(x) * wave.distance
}

function waveUpdateOpacity(wave) {
    function f(x) {
        return -4 * Math.pow(x - 0.5, 2) + 1
    }

    var x = wave.life / wave.lifeSpan
    wave.opacity = f(x)
}

function waveUpdateWetSandOpacity(wave) {
    function f(x) {
        return -8 * Math.pow(x - 0.65, 2) + 1
    }

    var x = wave.life / wave.lifeSpan
    wave.wetSandOpacity = f(x)
}

function waveUpdateWetSandSize(wave) {
    function f(x) {
        return -4 * Math.pow(x - 0.5, 2) + 1
    }

    function g(x) {
        return -f(x)+1.15
    }

    var x = wave.life / wave.lifeSpan
    wave.wetSandScale = x > 0.5 ? g(x) : 0
}

function waveUpdateFoamOpacity(wave) {
    function f(x) {
        return -8 * Math.pow(x - 0.5, 2) + 1
    }

    function g(x) {
        return f(x - 0.1)
    }

    var x = wave.life / wave.lifeSpan
    wave.foamOpacity = g(x)
}

function waveUpdateFoamSize(wave) {
    function f(x) {
        return -8 * Math.pow(x - 0.5, 2) + 1
    }

    function g(x) {
        return f(x/1.5)
    }

    var x = wave.life / wave.lifeSpan
    wave.foamScale = g(x)
}

function drawRectangle(color, ...rectParams) {
    ctx.fillStyle = color
    ctx.fillRect(...rectParams)
}