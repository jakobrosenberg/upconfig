const upconfig = {
  "config-a.js": {
    "hello": "I'm a",
    "envValue": "foobar"
  }
}
if (typeof window != 'undefined')
  window.__upconfig = upconfig
if (typeof global != 'undefined')
  global.__upconfig = upconfig
export default upconfig