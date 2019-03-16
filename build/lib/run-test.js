const { EOL } = require('os');
let reducer = require('@zoroaster/reducer'); const { runTest } = reducer; if (reducer && reducer.__esModule) reducer = reducer.default;
const { evaluateContext, destroyContexts } = require('@zoroaster/reducer/build/lib');
let promto = require('promto'); if (promto && promto.__esModule) promto = promto.default;
const { TICK, CROSS, indent, filterStack, replaceFilename } = require('.');
const handleSnapshot = require('./snapshot');

/**
 * Run the test.
 * @param {function} [notify] - notify function
 */
async function runTestAndNotify(notify, path, snapshot, snapshotRoot, { name, context, fn, timeout, persistentContext }) {
  if (notify) notify({
    name,
    type: 'test-start',
  })
  const res = await runTest({
    context,
    persistentContext,
    fn,
    timeout,
  })
  let { error, result } = res
  try {
    await handleSnapshot(result, name, path, snapshot, snapshotRoot)
  } catch (err) {
    error = err
  }

  if (notify) notify({
    name,
    error,
    type: 'test-end',
    result: dumpResult({ error, name }),
  })
  return res
}

function dumpResult({ error, name }) {
  if (error === null) {
    return `${TICK} ${name}`
  } else {
    return `${CROSS} ${name}` + EOL
      + indent(filterStack({ error, name }), ' | ')
  }
}

/**
 * Run test suite (wrapper for notify).
 * @param {function} notify The function to call for notifications.
 * @param {string[]} path The path to the test suite.
 * @param {string} snapshot The path to the snapshot dir.
 * @param {string[]} snapshotRoot Parts to ignore in the beginning of snapshot paths.
 */
       async function runTestSuiteAndNotify(
  notify, path, snapshot, snapshotRoot, { name, tests, persistentContext }, onlyFocused,
) {
  const n = getNames(persistentContext)
  // console.log('will run a test suite %s', n)
  notify({ type: 'test-suite-start', name })
  let pc, res
  if (persistentContext) {
    // console.log('will evaluate %s', n)
    pc = await evaluatePersistentContext(persistentContext)
    bindContexts(tests, pc)
  }
  try {
    const newPath = [...path, replaceFilename(name)]
    res = await runInSequence(notify, newPath, tests, onlyFocused, snapshot, snapshotRoot)
    notify({ type: 'test-suite-end', name })
  } finally {
    if (pc) {
      // console.log('will destroy %s', n)
      await destroyPersistentContext(pc)
    }
  }
  return res
}

const bindContexts = (tests, pc) => {
  tests.forEach((t) => {
    t.persistentContext = pc
  })
}

const evaluatePersistentContext = async (context, timeout = 5000) => {
  const c = Array.isArray(context) ? context[0] : context
  const p = evaluateContext(c)
  const _timeout = c._timeout || timeout
  const res = await promto(p, _timeout, `Evaluate persistent context ${
    c.name ? c.name : ''}`)
  return res
  // await p <- time-leak
}
const destroyPersistentContext = async (context, timeout = 5000) => {
  const p = destroyContexts([context])
  const _timeout = context._timeout || timeout
  const res = await promto(p, _timeout, `Destroy persistent context ${
    context.name ? context.name : ''}`)
  return res
  // await p <- time-leak
}

const getNames = persistentContext => {
  if (!persistentContext) return ''
  const p = Array.isArray(persistentContext) ? persistentContext : [persistentContext]
  return p.map(({ name }) => name).join(', ')
}

/**
 * Run all tests in sequence, one by one.
 * @param {function} [notify] A notify function to be passed to run method.
 * @param {string[]} path The path to the test suite in form of names of parent test suites and the current one.
 * @param {Test[]} tests An array with tests to run.
 * @param {boolean} [onlyFocused=false] Run only focused tests.
 * @param {string} snapshot The path to the snapshot file.
 */
       async function runInSequence(notify = () => {}, path, tests, onlyFocused, snapshot, snapshotRoot) {
  const res = await reducer(tests, {
    onlyFocused,
    runTest(test) {
      return runTestAndNotify(notify, path, snapshot, snapshotRoot, test)
    },
    runTestSuite(testSuite, hasFocused) {
      return runTestSuiteAndNotify(notify, path, snapshot, snapshotRoot, testSuite, onlyFocused ? hasFocused : false)
    },
  })
  return res
}

module.exports=runTestAndNotify

module.exports.runTestSuiteAndNotify = runTestSuiteAndNotify
module.exports.runInSequence = runInSequence