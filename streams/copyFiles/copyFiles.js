const from = require('from2')
const through = require('through2')
const path = require('path')
const fs = require('fs')

const copyFiles = function (files, callback) {
  from({ objectMode: true }, function (size, callback) {
    if (files.length <= 0) {
      return callback(null, null)
    }

    callback(null, files.shift())
  })
    .pipe(through.obj((file, encoding, done) => copyFile(file, done)))
    .on('finish', () => callback())
}

const copyFile = function (file, done) {
  const name = path.basename(file)
  fs.createReadStream(file)
    .pipe(fs.createWriteStream(`${name}.copy`))
    .on('finish', done)
}

module.exports = copyFiles
