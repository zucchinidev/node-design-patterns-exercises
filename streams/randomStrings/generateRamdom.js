const RandomStrings = require('./randomStrings')
const random = new RandomStrings({
  encoding: 'utf8'
})

random
  .on('readable', () => {
    let chunk
    while ((chunk = random.read()) !== null) {
      console.log(typeof chunk)
      console.log(`Chunk received: ${chunk}`)
    }
  })
  .on('end', () => console.log('Generation of random strings finished'))