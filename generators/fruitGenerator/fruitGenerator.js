function* fruitGenerator () {
  yield 'apple'
  yield 'orange'
  yield 'watermelon'
}

const newFruitGenerator = fruitGenerator()
let result
do {
  result = newFruitGenerator.next()
  if (typeof result.value !== 'undefined') {
    console.log(result.value)
  }
} while (!result.done)