const stream = require('stream')
const Chance = require('chance')

const chance = new Chance()

module.exports = class RandomStrings extends stream.Readable {
  constructor (options) {
    super(options)
  }

  _read (size) {
    const chunk = chance.string()
    this.push(chunk, 'utf8')
    if (chance.bool({ likelihood: 5 })) {
      this.push(null)
    }
  }
}
