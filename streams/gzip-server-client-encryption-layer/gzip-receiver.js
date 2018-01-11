'use strict'

const http = require('http')
const crypto = require('crypto')
const zlib = require('zlib')
const fs = require('fs')


const server = http.createServer((req, res) => {
  const filename = req.headers.filename
  console.log('Filename received', filename)
  req
    .pipe(crypto.createDecipher('aes192', 'a_shared_secret'))
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream(`./tmp/${filename}.copy`))
    .on('finish', () => {
      console.log('File correctly copied')
      res.writeHead(201, {'Content-Type': 'text/plain'})
      res.end(`That's it\n`)
    })
})

server.listen(3000, () => console.log('server listening on port ', 3000))