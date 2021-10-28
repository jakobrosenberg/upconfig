const assert = require('assert');
const { readFileSync } = require('fs');
const { relative } = require('path');
const { test, writePackageJson } = require("./utils");
const { prepatch } = require('../lib/prepatch')

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

test('can prepatch', () => {    
    prepatch(['start', 'build'], ['config.js', '\$MY_CONFIG'], indexHtml, { packageJson })
    const pkgjson = JSON.parse(readFileSync(packageJson, 'utf-8'))

    assert.deepEqual(pkgjson, expect)
})

test('prepatch doesnt duplicate itself', () => {    
    prepatch(['start', 'build'], ['config.js', '\$MY_CONFIG'], indexHtml, { packageJson })
    prepatch(['start', 'build'], ['config.js', '\$MY_CONFIG'], indexHtml, { packageJson })
    prepatch(['start', 'build'], ['config.js', '\$MY_CONFIG'], indexHtml, { packageJson })
    const pkgjson = JSON.parse(readFileSync(packageJson, 'utf-8'))

    assert.deepEqual(pkgjson, expect)
})