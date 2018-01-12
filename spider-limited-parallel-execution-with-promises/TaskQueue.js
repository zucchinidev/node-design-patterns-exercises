module.exports = class TaskQueue {
  constructor (concurrency) {
    this.concurrency = concurrency
    this.runningTask = 0
    this.queue = []
  }

  pushTask (task) {
    this.queue.push(task)
    this.next()
  }

  next () {
    while (this.runningTask < this.concurrency && this.queue.length) {
      const task = this.queue.shift()

      task().then(() => {
        this.runningTask -= 1
        this.next()
      })

      this.runningTask += 1
    }
  }
}