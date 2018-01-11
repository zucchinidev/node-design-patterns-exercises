const stream = require('stream')
const mkdirp = require('mkdirp')
const fs = require('fs')
const path = require('path')

module.exports = class ToFileStream extends stream.Writable {
  constructor (options) {
    super(Object.assign({}, options, { objectMode: true }))
  }

  _write (chunk, encoding, callback) {
    mkdirp(path.dirname(chunk.path), err => {
      if (err) {
        return callback(err)
      }

      fs.writeFile(chunk.path, chunk.content, callback)
    })
  }
}