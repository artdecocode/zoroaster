'use strict'

const EOL = require('os').EOL
const cleanStack = require('clean-stack')
const lib = require('./lib')

/**
 * Create a new test object.
 * @return {Test} A test object with properties.
 */
class Test {
    constructor (name, fn) {
        this.name = name
        this.fn = fn
        this.started = null
        this.finished = null
        this.error = null
        this.result = null
    }

    run() {
        return runTest(this)
    }
    dump() {
        return dumpResult(this)
    }
    hasErrors() {
        return this.error !== null
    }
}

function filterStack(test) {
    if (!test.error) {
        throw new Error('cannot filter stack when a test does not have an error')
    }
    const stack_split = test.error.stack.split(EOL)
    const test_name_regex = new RegExp(`at ${test.name}`)
    const res_index = stack_split.findIndex((element) => {
        return test_name_regex.test(element)
    }) + 1
    const stack_joined = stack_split.slice(0, res_index).join(EOL)
    return stack_joined ? stack_joined : cleanStack(test.error.stack)
}

function dumpResult(test) {
    if (test.error === null) {
        return '\x1b[32m \u2713 \x1b[0m ' + test.name
    } else {
        return '\x1b[31m \u2717 \x1b[0m ' + test.name + '\n'
            + lib.indent(filterStack(test), ' | ')
    }
}

/**
 * Create a promise for a test function.
 * @param {function} fn - function to execute
 * @return {Promise} A promise to execute function.
 */
function createTestPromise(fn) {
    return Promise.resolve()
        .then(() => fn())
}

/**
 * Returns a promise to run a test.
 * @param {Test} test - a test to run
 * @return {Promise} A promise resolved with the run test.
 */
function runTest(test) {
    test.started = new Date()

    return createTestPromise(test.fn)
        .then(
            (res) => { test.result = res },
            (err) => { test.error = err }
        )
        .then(() => { test.finished = new Date() })
        .then(() => test)
}

module.exports = Test