function* iteratorGenerator (args) {
  for (let i = 0; i < args.length; i += 1) {
    yield args[i]
  }
}

const iterator = iteratorGenerator(['apple', 'banana', 'orange', 'watermelon'])
let currentItem = iterator.next()
while (!currentItem.done) {
  console.log(currentItem.value)
  currentItem = iterator.next()
}