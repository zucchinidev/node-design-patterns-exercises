'use strict'

const fs = require('fs')
const zlib = require('zlib')

const file = process.argv[2]

fs.readFile(file, (err, buff) => {
  zlib.gzip(buff, (err, buffer) => {
    fs.writeFile(`${file}.gz`, buffer, (err) => {
      console.log('File successfully compressed')
    })
  })
})