#!/usr/bin/env node


const { program } = require('commander')
const { run } = require('./buildtime')

const splitByComma = str => str.split(',')

program
    .argument('<source>', 'comma separated list of files or dirs to process, supports environment variables', splitByComma)
    .argument('[public-dir]', '',)
    .action(run)

program.parse()