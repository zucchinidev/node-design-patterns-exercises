'use strict'

const stream = require('stream')
const crypto = require('crypto')
const digester = Symbol('digester')

class ShaSum extends stream.Transform {

  constructor (opts) {
    super(opts)
    this[digester] = crypto.createHash('sha1')
  }

  _transform (chunk, encoding, callback) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding)
    this[digester].update(buffer)
    callback()
  }

  _flush (callback) {
    this.push(this[digester].digest('hex'))
    callback()
  }
}

const shasum = new ShaSum()
shasum.pipe(process.stdout)
shasum.write('hello world\n')
shasum.write('another line')
shasum.end()
