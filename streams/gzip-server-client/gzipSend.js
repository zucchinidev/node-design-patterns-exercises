const fs = require('fs')
const zlib = require('zlib')
const http = require('http')
const path = require('path')
const file = process.argv[2]
const filename = file && path.basename(file)
const hostname = process.argv[3]

const opts = {
  hostname,
  port: 3000,
  path: '/',
  method: 'PUT',
  headers: {
    filename,
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'gzip'
  }
}

const req = http.request(opts, res => {
  console.log(`Server response: ${res.statusCode}`)
})

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  .pipe(req)
  .on('finish', () => {
    console.log('File successfully sent')
  })