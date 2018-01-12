const ReplaceStream = require('./replaceStream')
const search = process.argv[2]
const replace = process.argv[3]

process.stdin
  .pipe(new ReplaceStream(search, replace))
  .pipe(process.stdout)

// echo 'Hello world' | node replace world Node
