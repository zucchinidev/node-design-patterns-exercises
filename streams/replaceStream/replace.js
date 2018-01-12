const ReplaceStream = require('./replaceStream')

let result = ''
const rs = new ReplaceStream('World', 'Node.js')
rs.on('data', chunk => {
  result += chunk.toString()
  console.log(result)
})

rs.write('Hello ')
rs.write('World!')
rs.end()
