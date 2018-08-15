const { resolve } = require('path')
const { fork } = require('spawncommand')
const { SpawnOptions } = require('child_process') // eslint-disable-line no-unused-vars

const BIN = resolve(__dirname, 'bin', process.env.BABEL_ENV == 'test-build' ? 'zoroaster.js' : 'index.js')

/**
 * Start zoroaster process, and return a child process with a `promise` property.
 * @param {string[]} args An array of strings as arguments
 * @param {SpawnOptions} options Options to pass when creating child process
 * @returns {ChildProcess} An instance of a ChildProcess, with `.promise` property,
 * which will be resolved when tests are finished.
 */
function run(args, options = {}) {
  const proc = fork(BIN, args, {
    stdio: 'pipe',
    ...options,
  })
  return proc
}

module.exports = run

const $default = require('./lib/mask')

module.exports.getTests = $default