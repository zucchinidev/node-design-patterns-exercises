'use strict'
const path = require('path')
const fs = require('fs')

function asyncFlowWithThunks (generatorFunction) {
  function callback (err) {
    if (err) {
      return generator.throw(err)
    }
    const results = [].slice.call(arguments, 1)
    const data = results.length > 1 ? results : results[0]
    const thunk = generator.next(data).value
    thunk && thunk(callback)
  }

  const generator = generatorFunction()
  const thunk = generator.next().value
  thunk && thunk(callback)
}

function readFileThunk (fileName) {
  return (callback) => {
    fs.readFile(fileName, 'utf-8', callback)
  }
}

function writeFileThunk (fileName, data) {
  return (callback) => {
    fs.writeFile(fileName, data, callback)
  }
}

asyncFlowWithThunks(function * () {
  const fileName = path.basename(__filename)
  const mySelf = yield readFileThunk(__filename)
  yield writeFileThunk(`clone_of_${fileName}`, mySelf)
  console.log('File cloned')
})
