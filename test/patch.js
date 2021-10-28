const assert = require('assert');
const { readFileSync } = require('fs');
const { join } = require('path');
const { requestSource, patch } = require("../lib/patch");
const { test, writeIndexHtml } = require("./utils");

const configA = 'test/examples/config-a.js'
const configB = 'test/examples/config-B.js'
const dir = __dirname + '/temp'
const indexHtml = __dirname + '/temp/index.html'
const expectA = { 'config-a.js': { hello: "I'm a", envValue: 'foobar' } }
const expectB = { 'config-b.js': { hello: "I'm b" } }
const expectHtml = '<!DOCTYPE html><html><head><script src="/__upconfig.js"></script>\n' +
    '    <title>This is the title of the webpage!</title>\n' +
    '  </head>\n' +
    '  <body>\n' +
    '    <p>This is an example paragraph. Anything in the <strong>body</strong> tag will appear on the page, just like this <strong>p</strong> tag and its contents.</p>\n' +
    '  \n' +
    '</body></html>'
writeIndexHtml(indexHtml)


test('can process source', () => {
    const config = requestSource(configA)
    assert.deepEqual(config, expectA)
})
test('can name source', () => {
    const config = requestSource(`${configA}:somename`)
    assert.deepEqual(config, { somename: expectA['config-a.js'] })
})

test('can process source from env variable', () => {
    process.env.UPCONFIG_TEST = configA
    const config = requestSource('$UPCONFIG_TEST')
    assert.deepEqual(config, expectA)
})

test('can process sources from dir', () => {
    const config = requestSource('test/examples')
    assert.deepEqual(config, { ...expectA, ...expectB })
})

test('can create configs', () => {
    patch(configA, indexHtml)
    const content = readFileSync(join(dir, '__upconfig.js'), 'utf-8')
    assert.equal(content,
        `const upconfig = ${JSON.stringify(expectA, null, 2)}\n` +
        "if (typeof window != 'undefined')\n" +
        "  window.__upconfig = upconfig\n" +
        "if (typeof global != 'undefined')\n" +
        "  global.__upconfig = upconfig\n" +
        "export default upconfig"
    )
})

test('can access configs', () => {
    require('esm')(module)('./temp/__upconfig')
    const upconfig = require('../lib')
    const config = upconfig()
    assert.deepEqual(config, expectA)
})

test('updates index.html', () => {
    patch(configA, indexHtml)
    const content = readFileSync(indexHtml, 'utf-8')
    assert.equal(content, expectHtml)
})

test('ignores patched index.html', () => {
    patch(configA, indexHtml)
    patch(configA, indexHtml)
    patch(configA, indexHtml)
    patch(configA, indexHtml)
    const content = readFileSync(indexHtml, 'utf-8')
    assert.equal(content, expectHtml)
})