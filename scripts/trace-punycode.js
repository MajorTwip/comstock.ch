const Module = require('module')
const originalLoad = Module._load

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'punycode') {
    const from = parent && parent.filename ? ` from ${parent.filename}` : ''
    // eslint-disable-next-line no-console
    console.error(`punycode required${from}`)
    // eslint-disable-next-line no-console
    console.error(new Error('punycode require stack').stack)
  }
  return originalLoad.call(this, request, parent, isMain)
}
