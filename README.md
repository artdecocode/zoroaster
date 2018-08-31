# zoroaster

[![npm version](https://badge.fury.io/js/zoroaster.svg)](https://npmjs.org/package/zoroaster)

[![Build Status](https://travis-ci.org/artdecocode/zoroaster.svg?branch=master)](https://travis-ci.org/artdecocode/zoroaster)
[![Build status](https://ci.appveyor.com/api/projects/status/1gc2cqf97ty69mfw/branch/master?svg=true)](https://ci.appveyor.com/project/zavr-1/zoroaster/branch/master)

A modern JavaScript testing framework for _Node.js_. It introduces the concept of test contexts, which aim in helping to provide documentable and re-usable test infrastructure, across spec files in a single package, as well as across packages.

[![](doc/graphics/movflamecolumn.gif)](https://zoroaster.co.uk)
[![](doc/graphics/movzcard.gif)](http://www.crystalinks.com/zoroaster.html)
[![](doc/graphics/movflamecolumn.gif)](https://artdecocode.bz)

Are you fed up with `mocha` or have you had enough of `chai` in your life? Is it not time to say good-bye to the old stereotype that the same software must be used every day? Say no more, `zoroaster` is here to save our souls and bring a change.

```
yarn add -DE zoroaster
```

## Table Of Contents

- [Table Of Contents](#table-of-contents)
- [Quick Example](#quick-example)
- [Copyright](#copyright)

## Quick Example

All _Zoroaster_ tests are written in spec files and exported as tests suites which are objects.

For example, tests can be run against sync and async methods.

```js
export const software = (type) => {
  switch (type) {
  case 'boolean':
    return true
  case 'string':
    return 'string'
  default:
    return null
  }
}

export const asyncSoftware = async (type) => {
  await new Promise(r => setTimeout(r, 50))
  return software(type)
}
```

```js
import { ok, equal } from 'assert'
import { software, asyncSoftware } from './src'

export default {
  'runs a test'() {
    const res = software('boolean')
    ok(res)
  },
  async 'runs an async test'() {
    const res = await asyncSoftware('string')
    equal(res, 'string')
  },
}
```

![tests results](doc/tests.png)
## Copyright

(c) [Art Deco][1] 2018

[1]: https://artdeco.bz