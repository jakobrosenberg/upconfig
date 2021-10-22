const upconfig = async () => {
    try {
        const module = eval("import ('/__upconfig.js')");
        console.log(Object.keys(module))
        return module
    } catch (err) {
        console.log(err)
        console.log('foun no /__upconfig.js');
    }
}

module.exports = { upconfig }