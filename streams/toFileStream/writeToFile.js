const ToFileStream = require('./toFileStream')
const tfs = new ToFileStream()
tfs.on('finish', () => console.log('All files created'))

const files = [
  { path: 'file1.txt', content: 'Hello' },
  { path: 'file2.txt', content: 'Node.js' },
  { path: 'file3.txt', content: 'Streams' }
]
files.forEach(file => tfs.write(file))
tfs.end(() => console.log('end executed'))
