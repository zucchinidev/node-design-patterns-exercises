'use strict'

const stream = require('stream')
const util = require('util')

class ReplaceStream extends stream.Transform {
  constructor (searchString, replaceString) {
    super()
    this.searchString = searchString
    this.replaceString = replaceString
    this.tailPiece = ''
  }

  _transform (chunk, encoding, callback) {
    const chain = this.tailPiece + chunk
    const pieces = chain.split(this.searchString)
    const lastPiece = pieces[pieces.length - 1]
    const tailPiecesLength = this.searchString.length - 1
    this.tailPiece = lastPiece.slice(-tailPiecesLength)
    pieces[pieces.length - 1] = lastPiece.slice(0, -tailPiecesLength)
    this.push(pieces.join(this.replaceString))
    callback()
  }

  _flush (callback) {
    this.push(this.tailPiece)
    callback()
  }

}
let result = ''
const rs = new ReplaceStream('World', 'Node.js')
rs.on('data', chunk => {
  result += chunk.toString()
  console.log(result)
})

rs.write('Hello ')
rs.write('World!')
rs.end()
