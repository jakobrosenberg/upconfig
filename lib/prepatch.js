const { readFileSync, writeFileSync } = require('fs')


const prepatch = (fields, configs, htmlTemplate, options) => {
    const json = JSON.parse(readFileSync(options.packagejson, 'utf-8'))
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

    writeFileSync(options.packagejson, JSON.stringify(json))
}

module.exports = { prepatch }