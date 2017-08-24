// This sample demonstrates how generators can be used as a control
// flow mechanism.
'use strict'
const path = require('path')
const fs = require('fs')

function asyncFlow (generatorFunction) {
  function callback (err) {
    if (err) {
      return generator.throw(err)
    }
    const results = [].slice.call(arguments, 1)
    generator.next(results.length > 1 ? results : results[0])
  }
  const generator = generatorFunction(callback)
  generator.next()
}

asyncFlow(function* (callback) {
  const fileName = path.basename(__filename)
  const mySelf = yield fs.readFile(fileName, 'utf-8', callback)
  yield fs.writeFile(`clone_of_${fileName}`, mySelf, callback)
  console.log('File cloned')
})
