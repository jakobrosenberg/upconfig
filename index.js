const resolveFromWindowOrGlobal = () => {
    if (typeof window !== 'undefined' && window.__upconfig)
        return window.__upconfig
    if (typeof global !== 'undefined' && global.__upconfig)
        return global.__upconfig
}

const upconfig = () => {
    const config = resolveFromWindowOrGlobal()
    if (config)
        return config
    try {
        const module = eval("import('/__upconfig.js').then(m => m.default)");
        return module
    } catch (err) {
        console.log(err)
        console.log('found no /__upconfig.js or global __upconfig');
    }
}

module.exports = upconfig