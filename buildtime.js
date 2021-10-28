const { statSync, readdirSync, writeFileSync, mkdirSync } = require('fs')
const { join, resolve, basename } = require('path')

/**
 * @typedef {Object.<string, any>} Config
 */

/**
 * @param {string} rawSource
 * @returns { Config } 
 */
const requestSource = (rawSource) => {
    let [src, name] = rawSource.split(':')
    const sourceFile = src.startsWith('$') ? process.env[src.substr(1)] || src : src
    name = name || basename(sourceFile)

    const stats = statSync(sourceFile)
    if (stats.isDirectory())
        return readdirSync(sourceFile)
            .map(file => (join(sourceFile, file)))
            .filter(file => statSync(file).isFile())
            .reduce((configs, file) =>
                ({ ...requestSource(file), ...configs }),
                {})
    else return { [name]: require(resolve(sourceFile)) }
}

const run = (source, dir) => {
    const destination = join(dir, '__upconfig.js')
    source = [source].flat(Infinity)
    const sourceObjs = source
        .map(requestSource)
        .reduce((configs, config) => ({ ...configs, ...config }))

    mkdirSync(dir, { recursive: true })

    writeFileSync(destination, [
            `const upconfig = ${JSON.stringify(sourceObjs, null, 2)}`,
            `if (typeof window != 'undefined')`,
            `  window.__upconfig = upconfig`,
            `if (typeof global != 'undefined')`,
            `  global.__upconfig = upconfig`,
            `export default upconfig`
        ].join('\n')
    )
}

module.exports = { run, requestSource }