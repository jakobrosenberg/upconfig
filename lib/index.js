const resolveFromWindowOrGlobal = () => {
    if (typeof window !== 'undefined' && window.__upconfig)
        return window.__upconfig
    if (typeof global !== 'undefined' && global.__upconfig)
        return global.__upconfig
}

const upconfig = (autoResolve) => {
    let config = resolveFromWindowOrGlobal()
    if (!config)
        try {
            config = eval("import('/__upconfig.js').then(m => m.default)");
            return module
        } catch (err) {
            console.log(err)
        }

    if (!config) {
        console.log('found no /__upconfig.js or global __upconfig');
        return null
    } else if (autoResolve === true)
        return Object.values(config)[0]
    else if (autoResolve === 'string')
        return config[autoResolve]

    return config

}

module.exports = upconfig