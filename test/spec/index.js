import { ok, equal } from 'assert'
import { ChildProcess } from 'child_process'
import { run as zoroaster } from '../../src'
import Context from '../context'

/** @type {Object.<string, (c: Context)>} */
const t = {
  context: Context,
  'exports a function'() {
    equal(typeof zoroaster, 'function')
  },
  async 'returns a child process w/ a promise'() {
    const proc = zoroaster()
    ok(proc instanceof ChildProcess)
    ok(proc.promise instanceof Promise)
    await proc.promise
  },
  async 'reports on 0 tests executed when empty args'() {
    const { promise } = zoroaster([], {
      execArgv: [],
    })
    const { stdout, stderr } = await promise
    if (stderr) throw new Error(stderr)
    equal('🦅  Executed 0 tests.', stdout.trim())
  },
  async 'reports on test suite executed'({ TEST_SUITE_PATH }) {
    const { promise } = zoroaster([TEST_SUITE_PATH, '--alamode'], {
      execArgv: [],
    })
    ok(promise instanceof Promise)
    const { stderr, code, stdout } = await promise
    let se = stderr
    // if we're loading src zoroaster, alamode will
    // already be loaded in src/bin/index.js that is spawned, on top of --alamode flag.
    if (stderr.startsWith('Reverting JS')) {
      const [,,,...rest] = stderr.split('\n')
      se = rest.join('\n')
    }
    equal(se, '')
    equal(code, 4) // test fixtures not passing with 4 errors
    ok(stdout.length > 100)
  },
}

// export default t