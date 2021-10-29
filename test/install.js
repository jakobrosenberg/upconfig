const assert = require('assert');
const { readFileSync } = require('fs');
const { relative } = require('path');
const { test, writePackageJson } = require("./utils");
const { install } = require('../lib/install')

const dir = relative(process.cwd(), __dirname + '/temp').replace(/\\/mg, '/')
const packageJson = dir + '/package.json'
const indexHtml = dir + '/index.html'
writePackageJson(packageJson)

const expect = {
    scripts: {
        prebuild: 'prebuildstuff && upconfig config.js,$MY_CONFIG test/temp/index.html',
        build: 'buildstuff',
        start: 'startstuff',
        prestart: 'upconfig config.js,$MY_CONFIG test/temp/index.html'
    }
}

const expectInline = {
    scripts: {
        prebuild: 'prebuildstuff && upconfig config.js,$MY_CONFIG test/temp/index.html -i',
        build: 'buildstuff',
        start: 'startstuff',
        prestart: 'upconfig config.js,$MY_CONFIG test/temp/index.html -i'
    }
}

test('can install', () => {    
    install(['start', 'build'], ['config.js', '\$MY_CONFIG'], indexHtml, { packageJson })
    const pkgjson = JSON.parse(readFileSync(packageJson, 'utf-8'))

    assert.deepEqual(pkgjson, expect)
})

test('install doesnt duplicate itself', () => {    
    install(['start', 'build'], ['config.js', '\$MY_CONFIG'], indexHtml, { packageJson })
    install(['start', 'build'], ['config.js', '\$MY_CONFIG'], indexHtml, { packageJson })
    install(['start', 'build'], ['config.js', '\$MY_CONFIG'], indexHtml, { packageJson })
    const pkgjson = JSON.parse(readFileSync(packageJson, 'utf-8'))

    assert.deepEqual(pkgjson, expect)
})


test('can install inline', () => {    
    install(['start', 'build'], ['config.js', '\$MY_CONFIG'], indexHtml, { packageJson, inline: true })
    const pkgjson = JSON.parse(readFileSync(packageJson, 'utf-8'))

    
    assert.deepEqual(pkgjson, expectInline)
})
