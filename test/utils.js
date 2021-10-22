const test = (msg, cb) => {
    try {
        cb()
        console.log(msg, '✅')
    } catch (err) {
        console.log(msg, '❌')
        console.error(err)
    }
}

module.exports = { test }