const fs = require('fs')
const path = require('path')

const root = process.cwd()

const replacements = [
  {
    file: 'node_modules/whatwg-url/lib/url-state-machine.js',
    replace: (content) => content.replace('require("punycode");', 'require("punycode/");'),
  },
  {
    file: 'node_modules/tr46/index.js',
    replace: (content) => content.replace('require("punycode");', 'require("punycode/");'),
  },
  {
    file: 'node_modules/rehype-citation/dist/node/rehype-citation.mjs',
    replace: (content) => content.replace("from 'punycode';", "from 'punycode/punycode.js';"),
  },
  {
    file: 'node_modules/rehype-citation/dist/node/cite.mjs',
    replace: (content) => content.replace("from 'punycode';", "from 'punycode/punycode.js';"),
  },
  {
    file: 'node_modules/fetch-ponyfill/fetch-node.js',
    replace: () => `'use strict';

function wrapFetchForNode(fetch) {
  // Support schemaless URIs on the server for parity with the browser.
  // https://github.com/matthew-andrews/isomorphic-fetch/pull/10
  return function (u, options) {
    if (typeof u === 'string' && u.slice(0, 2) === '//') {
      return fetch('https:' + u, options);
    }

    return fetch(u, options);
  };
}

function hasNativeFetch() {
  return (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.fetch === 'function' &&
    typeof globalThis.Headers === 'function' &&
    typeof globalThis.Request === 'function' &&
    typeof globalThis.Response === 'function'
  );
}

function createNativeWrapper() {
  return {
    fetch: wrapFetchForNode(globalThis.fetch),
    Headers: globalThis.Headers,
    Request: globalThis.Request,
    Response: globalThis.Response,
  };
}

module.exports = function (context) {
  // Prefer the built-in fetch to avoid loading legacy polyfills (and their deprecations).
  if (hasNativeFetch()) {
    return createNativeWrapper();
  }

  var fetch = require('node-fetch');

  // Support webpack module import weirdness.
  var fetchFn = fetch.default ? fetch.default : fetch;

  // This modifies the global \`node-fetch\` object, which isn't great, since
  // different callers to \`fetch-ponyfill\` which pass a different Promise
  // implementation would each expect to have their implementation used. But,
  // given the way \`node-fetch\` is implemented, this is the only way to make
  // it work at all.
  if (context && context.Promise) {
    fetchFn.Promise = context.Promise;
  }

  return {
    fetch: wrapFetchForNode(fetchFn),
    Headers: fetch.Headers,
    Request: fetch.Request,
    Response: fetch.Response,
  };
};
`,
  },
  {
    file: 'node_modules/cross-fetch/dist/node-ponyfill.js',
    replace: () => `const hasNativeFetch =
  typeof globalThis !== 'undefined' &&
  typeof globalThis.fetch === 'function' &&
  typeof globalThis.Headers === 'function' &&
  typeof globalThis.Request === 'function' &&
  typeof globalThis.Response === 'function'

const nodeFetch = hasNativeFetch ? null : require('node-fetch')
const realFetch = hasNativeFetch ? globalThis.fetch : nodeFetch.default || nodeFetch

const fetch = function (url, options) {
  // Support schemaless URIs on the server for parity with the browser.
  // Ex: //github.com/ -> https://github.com/
  if (/^\\/\\//.test(url)) {
    url = 'https:' + url
  }
  return realFetch.call(this, url, options)
}

fetch.ponyfill = true

module.exports = exports = fetch
exports.fetch = fetch
exports.Headers = hasNativeFetch ? globalThis.Headers : nodeFetch.Headers
exports.Request = hasNativeFetch ? globalThis.Request : nodeFetch.Request
exports.Response = hasNativeFetch ? globalThis.Response : nodeFetch.Response

// Needed for TypeScript consumers without esModuleInterop.
exports.default = fetch
`,
  },
]

let patchedCount = 0

for (const { file, replace } of replacements) {
  const target = path.join(root, file)
  if (!fs.existsSync(target)) {
    continue
  }

  const original = fs.readFileSync(target, 'utf8')
  const updated = replace(original)

  if (updated !== original) {
    fs.writeFileSync(target, updated)
    patchedCount++
    // eslint-disable-next-line no-console
    console.log(`patched ${file}`)
  }
}

if (patchedCount === 0) {
  // eslint-disable-next-line no-console
  console.log('punycode fixes already applied')
}
