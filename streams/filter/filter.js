'use strict'
const stream = require('stream')

class Filter extends stream.Transform {
  constructor (filterProps, opts) {
    super({ ...opts, objectMode: true })
    this.filterProps = filterProps

  }

  _transform (obj, encoding, callback) {
    const filteredObj = Object.entries(obj).reduce((acc, [key, value]) => {
      const isValidKey = this.filterProps.every(prop => prop !== key)
      if (isValidKey) {
        acc[key] = value
      }
      return acc
    })
    this.push(filteredObj)
    callback()
  }
}

const filter = new Filter(['phone', 'email'])

filter.on('readable', () => {
  let obj
  while (null !== (obj = filter.read())) {
    console.log(obj)
  }
})

// now send some objects to filter through
filter.write({
  name: 'Foo', phone: '555-1212',
  email: 'foo@foo.com', id: 123
})
filter.write({
  name: 'Bar', phone: '555-1313',
  email: 'bar@bar.com', id: 456
})

filter.end()
