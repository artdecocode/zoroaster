import { throws, deepEqual } from '@zoroaster/assert'
import { buildDirectory } from '../../../src/lib/bin'

const T = {
  async 'builds a directory'() {
    const ts = await buildDirectory('test/fixture/root')
    const { 'make-test-suite': mts } = ts
    deepEqual(Object.keys(mts), ['default', 'testA', 'testB'])
  },
  async 'throws when cannot merge'() {
    await throws({
      fn: buildDirectory,
      args: 'test/fixture/root-merge',
      message: 'Duplicate key testA',
    })
  },
}

export default T