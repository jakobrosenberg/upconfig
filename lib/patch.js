const { statSync, readdirSync, writeFileSync, mkdirSync, readFileSync, existsSync } = require('fs')
const { join, resolve, basename, dirname } = require('path')
const cheerio = require('cheerio')

const patchIndexHtml = (path, patch) => {
    const $ = cheerio.load(readFileSync(path, 'utf-8'))
    $('#__upconfig').remove()

    $('head').prepend(patch)
    writeFileSync(path, $.html())

}

/**
 * @typedef {Object.<string, any>} Config
 */

/**
 * @param {string} rawSource
 * @returns { Config } 
 */
const requestSource = (rawSource, options) => {
    let [src, name] = rawSource.split(':')

    const sourceFile = existsSync(src) ? src : process.env[src]

    if (!sourceFile) {
        console.warn(`upconfig didn\'t find any config for: ${src}`)
        return
    }

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

const writeConfig = (configStr, dir) => {
    const destination = join(dir, '__upconfig.js')
    mkdirSync(dir, { recursive: true })
    writeFileSync(destination, `${configStr}\nexport default upconfig`)
}

const getConfigs = source => {
    source = [].concat(...[source])
    const sourceObjs = source
        .map(requestSource)
        .reduce((configs, config) => ({ ...configs, ...config }))
    return sourceObjs
}

const getConfigsStr = (configs, indentation) => [
    `const upconfig = ${JSON.stringify(configs, null, indentation)}`,
    `if (typeof window != 'undefined') window.__upconfig = upconfig`,
    `if (typeof global != 'undefined') global.__upconfig = upconfig`,
].join(indentation ? '\n' : ';')

const patch = (source, htmlTemplate, options = {}) => {
    const indentation = options.inline ? 0 : 2
    const dir = dirname(htmlTemplate)
    const configs = getConfigs(source)
    const configStr = getConfigsStr(configs, indentation)
    if (!options.inline)
        writeConfig(configStr, dir)

    const htmlPatch = options.inline ?
        `<script id="__upconfig">${configStr}</script>` :
        '<script id="__upconfig" src="/__upconfig.js" type="module"></script>'
    patchIndexHtml(htmlTemplate, htmlPatch)
}

module.exports = { patch, requestSource }