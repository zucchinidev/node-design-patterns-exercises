const http = require('http')
const Chance = require('chance')
const chance = new Chance()
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  function generateMore () {
    while (chance.bool({ likelihood: 95 })) {
      const length16KB = 16 * 1024
      // default highWaterMark in internal buffer 16KB
      const shouldContinue = res.write(chance.string({length: (length16KB) - 1}))
      if (!shouldContinue) {
        console.log('Back-pressure')
        return res.once('drain', generateMore)
      }
    }
    res.end(' \nThe end...\n', () => console.log('All data was sent'))
  }
  generateMore()
}).listen(3000, () => console.log('Litening on port:', 3000))