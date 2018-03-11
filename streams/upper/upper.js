const stream = require('stream')

class Upper extends stream.Transform {
  _transform (chunk, encoding, callback) {
    const upperChunk = chunk.toString().toUpperCase()
    this.push(upperChunk)
    callback()
  }
}

const upper = new Upper()
upper.pipe(process.stdout)
upper.write('Hello world\n')
upper.write('another line')
upper.end()
