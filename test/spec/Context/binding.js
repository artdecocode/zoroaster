import { equal } from 'assert'
import TestSuite from '../../../src/lib/TestSuite'
import Context from '../../context'
import { runTestSuiteAndNotify } from '../../../src/lib/run-test'

/** @type {Object.<string, (c: Context)>} */
const T = {
  context: Context,
  async 'binds methods'({ TEST_SUITE_NAME, runTestSuite }) {
    class Test {
      async _init() {
        await new Promise(r => setTimeout(r, 100))
        this.init = true
      }
      get isInit() {
        return this.init
      }
      getData() {
        return this._data
      }
      setData(d) {
        this._data = d
      }
    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      context: Test,
      testA({ getData, setData }) {
        const t = 'test'
        setData(t)
        const d = getData()
        equal(d, t)
      },
    })
    await runTestSuite(testSuite)
  },
  async 'binds inherited methods'({ TEST_SUITE_NAME, runTestSuite }) {
    class Test {
      async _init() {
        await new Promise(r => setTimeout(r, 100))
        this.init = true
      }
      get isInit() {
        return this.init
      }
      getData() {
        return this._data
      }
      setData(d) {
        this._data = d
      }
    }
    class TestA extends Test {

    }
    const testSuite = new TestSuite(TEST_SUITE_NAME, {
      context: TestA,
      testA({ getData, setData }) {
        const t = 'test'
        setData(t)
        const d = getData()
        equal(d, t)
      },
    })
    await runTestSuite(testSuite)
  },
}

export default T
