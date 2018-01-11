'use strict'

const http = require('http')
const path = require('path')
const fs = require('fs')
const zlib = require('zlib')
const crypto = require('crypto')


const file = process.argv[2]
const filename = path.basename(file)

function onResponseServer (res) {
  console.log(`Response status ${res.statusCode}`)
}

const options = {
  hots: 'localhost',
  method: 'PUT',
  path: '/',
  port: 3000,
  headers: {
    filename,
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip'
  }
}

const req = http.request(options, onResponseServer)

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(crypto.createCipher('aes192', 'a_shared_secret'))
  .pipe(req)
  .on('finish', () => {
    console.log('File successfully sent')
  })