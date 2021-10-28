const { statSync, readdirSync, writeFileSync, mkdirSync, readFileSync } = require('fs')
const { join, resolve, basename, dirname } = require('path')
const cheerio = require('cheerio')

const patchIndexHtml = (path) => {
    const $ = cheerio.load(readFileSync(path, 'utf-8'))
    const existing = $('[src="/__upconfig.js"]')
    if (!existing.length) {
        $('head').prepend('<script src="/__upconfig.js"></script>')
        writeFileSync(path, $.html())
    }
}

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

const writeConfig = (source, dir) => {
    const destination = join(dir, '__upconfig.js')
    source = [].concat(...[source])
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

const run = (source, htmlTemplate) => {
    const dir = dirname(htmlTemplate)
    writeConfig(source, dir)
    patchIndexHtml(htmlTemplate)
}

module.exports = { run, requestSource }