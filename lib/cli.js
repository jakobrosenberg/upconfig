#!/usr/bin/env node


const { program } = require('commander')
const { patch } = require('./patch')
const { install } = require('./install')

const splitByComma = str => str.split(',')

program
    .command('patch', { isDefault: true })
    .argument('<source>', 'comma separated list of files or dirs to process, supports environment variables', splitByComma)
    .argument('<html-template>', 'eg. /public/index.html or /dist/index.html',)
    .action(patch)
program
    .command('install')
    .description('installs upconfig by patching package.json scripts.')
    .usage('upconfig install dev,serve CONFIG_PATH dist/index.html')
    .argument('<scripts>', 'scripts to install, comma separated, eg. start,build', splitByComma)
    .argument('<configs', 'configs to load, comma separated, eg. config.js,\$MY_ENV_CONFIG', splitByComma)
    .argument('<html-template>', 'eg. /public/index.html or /dist/index.html')
    .option('-p --package-json <path>', 'path to package json', 'package.json')
    .action(install)

program.parse()