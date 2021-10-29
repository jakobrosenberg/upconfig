const { execSync } = require('child_process')
const { readFileSync, writeFileSync } = require('fs')


const install = (fields, configs, htmlTemplate, options) => {
    execSync('npm install upconfig')

    const json = JSON.parse(readFileSync(options.packageJson, 'utf-8'))
    const inlineStr = options.inline ? ' -i' : ''
    const cmd = `upconfig ${configs.join(',')} ${htmlTemplate + inlineStr}`
    const { scripts } = json

    fields.forEach(rawField => {
        const field = `pre${rawField}`
        const currentDirty = scripts[field] || ''
        const currentClean = currentDirty
            .replace(/&& +upconfig .+?&&/, '&&')
            .replace(/^ *upconfig .+?&&/, '')
            .replace(/&& *upconfig .+/, '')
            .replace(/upconfig .+/, '')
            .trim()
        const currentPatched = [currentClean, cmd].filter(Boolean).join(' && ')
        scripts[field] = currentPatched
    })

    writeFileSync(options.packageJson, JSON.stringify(json, null, 2))
}

module.exports = { install }