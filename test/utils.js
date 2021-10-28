const { writeFileSync, mkdirSync } = require('fs')
const { dirname } = require('path')

const test = (msg, cb) => {
  try {
    cb()
    console.log(msg, '✅')
  } catch (err) {
    console.log(msg, '❌')
    console.error(err)
  }
}

const writeIndexHtml = (path) => {
  const content = `<!doctype html>
<html>
  <head>
    <title>This is the title of the webpage!</title>
  </head>
  <body>
    <p>This is an example paragraph. Anything in the <strong>body</strong> tag will appear on the page, just like this <strong>p</strong> tag and its contents.</p>
  </body>
</html>`

  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, content)
}

module.exports = { test, writeIndexHtml }