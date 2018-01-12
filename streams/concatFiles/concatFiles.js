const fromArray = require('from2-array')
const through = require('through2')
const fs = require('fs')

function concatFiles (destination, files, callback) {
  const destinationStream = fs.createWriteStream(destination)
  fromArray.obj(files)
    .pipe(through.obj((file, enc, done) => writeFile(file, destinationStream, done)))
    .on('finish', () => {
      destinationStream.end()
      callback()
    })
}

function writeFile (file, destStream, done) {
  const src = fs.createReadStream(file)
  src.pipe(destStream, { end: false })
  src.on('end', done)
}

module.exports = concatFiles
