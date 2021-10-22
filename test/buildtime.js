const assert = require('assert');
const { readFileSync } = require('fs');
const { join } = require('path');
const { requestSource, run } = require("../buildtime");
const { test } = require("./utils");

const configA = 'test/examples/config-a.js'
const configB = 'test/examples/config-B.js'
const dir = __dirname + '/temp'
const expectA = { 'config-a.js': { hello: "I'm a", envValue: 'foobar' } }
const expectB = { 'config-b.js': { hello: "I'm b" } }


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
    run(configA, dir)
    const content = readFileSync(join(dir, '__upconfig.js'), 'utf-8')
    assert.deepEqual(content, `export default ${JSON.stringify(expectA, null, 2)}`)
})