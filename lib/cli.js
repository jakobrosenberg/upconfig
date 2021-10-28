#!/usr/bin/env node


const { program } = require('commander')
const { patch } = require('./patch')
const { prepatch } = require('./prepatch')

const splitByComma = str => str.split(',')

program
    .command('patch', { isDefault: true })
    .argument('<source>', 'comma separated list of files or dirs to process, supports environment variables', splitByComma)
    .argument('<html-template>', 'eg. /public/index.html or /dist/index.html',)
    .action(patch)
    .command('prepatch')
    .argument('<scripts>', 'scripts to prepatch, comma separated, eg. start,build', splitByComma)
    .argument('<configs', 'configs to load, comma separated, eg. config.js,\$MY_ENV_CONFIG', splitByComma)
    .argument('<html-template>', 'eg. /public/index.html or /dist/index.html')
    .option('-p --package-json <path>', 'path to package json', 'package.json')
    .action(prepatch)

program.parse()