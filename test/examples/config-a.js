process.env.CONFIGUP_TEST_VALUE = 'foobar'

module.exports = {
    hello: `I'm a`,
    envValue: process.env.CONFIGUP_TEST_VALUE
}