const { readFileSync, writeFileSync } = require('fs')


const install = (fields, configs, htmlTemplate, options) => {
    const json = JSON.parse(readFileSync(options.packageJson, 'utf-8'))
    const cmd = `upconfig ${configs.join(',')} ${htmlTemplate}`
    const { scripts } = json

    fields.forEach(rawField => {
        const field = `pre${rawField}`
        const currentDirty = scripts[field] || ''
        const currentClean = currentDirty
            .replace(/&& +upconfig +[^ ]+ +[^ ]+/, '')
            .replace(/upconfig +[^ ]+ +[^ ]+ +&&/, '')
            .replace(/upconfig +[^ ]+ +[^ ]+/, '')
            .trim()
        const currentPatched = [currentClean, cmd].filter(Boolean).join(' && ')
        scripts[field] = currentPatched
    })

    writeFileSync(options.packageJson, JSON.stringify(json, null, 2))
}

module.exports = { install }