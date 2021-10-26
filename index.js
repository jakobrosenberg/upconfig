const upconfig = async () => {
    try {
        const module = eval("import ('/__upconfig.js')");
        return module
    } catch (err) {
        console.log(err)
        console.log('found no /__upconfig.js');
    }
}

module.exports = { upconfig }