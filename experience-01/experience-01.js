import { rbgaToByte, randomInt, random, HSLToRGB } from '../utils.js'

const canvas = document.querySelector('canvas')
if (!canvas.getContext) alert('This website is not supported by your web browser. Ever heard of Chrome ? Firefox maybe ..?')
const ctx = canvas.getContext('2d')
const height = document.body.clientHeight
const width = document.body.clientWidth * (4/5)

const params = {
    edges:              { min: 3, max: 10,      value: 5,       step: 1     },
    delay:              { min: 0, max: 1000,    value: 200,    step: 1      },
    hueStart:           { min: 0, max: 360,     value: 0,     step: 0.1     },
    hueEnd:             { min: 0, max: 360,     value: 360,     step: 0.1   },
    hueFactor:          { min: 0, max: 10,      value: 10,      step: 0.1   },
    hueOffset:          { min: 0, max: 360,     value: 10,      step: 1     },
    hueChangeWithTime:  { min: 0, max: 1,       value: 1,       step: 1     },
    satStart:           { min: 0, max: 1,       value: 0.4,     step: 0.1   },
    satEnd:             { min: 0, max: 1,       value: 0.6,     step: 0.1   },
    satFactor:          { min: 0, max: 10,      value: 1,      step: 0.1    },
    satOffset:          { min: 0, max: 1,       value: 0.5,      step: 0.1  },
    satChangeWithTime:  { min: 0, max: 1,       value: 0,       step: 1     },
    lightStart:         { min: 0, max: 1,       value: 0.4,     step: 0.1   },
    lightEnd:           { min: 0, max: 1,       value: 0.6,     step: 0.1   },
    lightFactor:        { min: 0, max: 10,      value: 1,      step: 0.1    },
    lightOffset:        { min: 0, max: 1,       value: 0.5,      step: 0.1  },
    lightChangeWithTime:{ min: 0, max: 1,       value: 0,       step: 1     },
    alphaStart:         { min: 0, max: 1,       value: 1,       step: 0.1   },
    alphaEnd:           { min: 0, max: 1,       value: 1,       step: 0.1   },
    alphaFactor:        { min: 0, max: 10,      value: 1,      step: 0.1    },
    alphaOffset:        { min: 0, max: 1,       value: 0.5,      step: 0.1  },
    alphaChangeWithTime:{ min: 0, max: 1,       value: 0,       step: 1     },
}

var secretIsUnveiled = false

function paramGetVal(name) { return params[name].value }

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

function randomSaturatedColor(dT) {

    function getRandomBoundaries(changeWithTime, start, end, factor, offset) {
        return changeWithTime
            ? [dT * factor, dT * factor + offset]
            : [start, end]
    }

    var [randomHueStart, randomHueEnd] = getRandomBoundaries(
        paramGetVal('hueChangeWithTime') != 0, 
        paramGetVal('hueStart'), paramGetVal('hueEnd'),
        paramGetVal('hueFactor'), paramGetVal('hueOffset'),
    )

    var [randomSatStart, randomSatEnd] = getRandomBoundaries(
        paramGetVal('satChangeWithTime') != 0,
        paramGetVal('satStart'), paramGetVal('satEnd'),
        paramGetVal('satFactor'), paramGetVal('satOffset'),
    )

    var [randomLightStart, randomLightEnd] = getRandomBoundaries(
        paramGetVal('lightChangeWithTime') != 0,
        paramGetVal('lightStart'), paramGetVal('lightEnd'),
        paramGetVal('lightFactor'), paramGetVal('lightOffset'),
    )

    var [randomAlphaStart, randomAlphaEnd] = getRandomBoundaries(
        paramGetVal('alphaChangeWithTime') != 0,
        paramGetVal('alphaStart'), paramGetVal('alphaEnd'),
        paramGetVal('alphaFactor'), paramGetVal('alphaOffset'),
    )
        

    var randomHSL = [
        random(randomHueEnd, randomHueStart),
        random(randomSatEnd, randomSatStart),
        random(randomLightEnd, randomLightStart),
    ]

    var v = [
        ...HSLToRGB(randomHSL), 
        random(randomAlphaEnd, randomAlphaStart),
    ]
    return v
}

function createSliders() {

    var controlPanel = document.querySelector('aside')

    function createLabel(key) {
        var label = document.createElement('label')
        label.setAttribute('for', key)
        label.innerText = key
        return label
    } 

    function createInput() {
        return document.createElement('input')
    }

    function createSlider(key) {
        var slider = document.createElement('input')
        slider.setAttribute('type', 'range')
        slider.setAttribute('min', params[key].min)
        slider.setAttribute('max', params[key].max)
        slider.setAttribute('step', params[key].step)
        slider.setAttribute('id', key)
        slider.value = params[key].value
        slider.addEventListener('change', (ev) => params[key].value = +ev.target.value)
        return slider
    }

    function createToggleVisibilityButton() {
        var button = document.createElement('button')
        button.addEventListener('click', () => {
            var childrenList = [...controlPanel.children]
            childrenList.forEach(child => {
                child.disabled = true
                var childrenChildrenList = [...child.children]
                childrenChildrenList.forEach(childOfChild => childOfChild.disabled = true)
            })
            document.querySelector('body').setAttribute('style', '--label-display: block')
            button.innerText = 'Don\'t try to memorize them, they are randomized ;)'
        })
        button.innerText = 'Stop fumbling around and see what those sliders are actually called'
        return button
    }

    function shuffleArray(array) {
        var shuffled = [...array]
        for (var i = 0; i < shuffled.length; i++) {
            var j = randomInt(shuffled.length - 1, 0)
            var tmp = shuffled[i]
            shuffled[i] = shuffled[j]
            shuffled[j] = tmp
        }
        return shuffled
    
    }

    for (var key of shuffleArray(Object.keys(params))) {
        console.log(key)
        if (params.hasOwnProperty(key)) {
            var div = controlPanel.appendChild(document.createElement('div'))
            div.appendChild(createLabel(key))
            div.appendChild(createInput())
            div.appendChild(createSlider(key))
        }
    }

    controlPanel.appendChild(createToggleVisibilityButton())

}

export function run() {
    canvas.height = height
    canvas.width = width

    createSliders()

    var dT = 0

    function nextTick() {
        setTimeout(() => {
            dT++

            if (dT >= 100) dT = 0

            randomPolygon(params.edges.value, randomSaturatedColor(dT))
            nextTick()
        }, paramGetVal('delay'))
    }

    nextTick()
}