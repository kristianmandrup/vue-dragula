export class TimeMachine {
  constructor ({name, model, modelRef, history, logging}) {
    this.name = name || 'default'
    this.model = model
    this.modelRef = modelRef
    this.logging = logging
    this.history = history || this.createHistory()
    this.history.push(this.model)
    this.timeIndex = 0
  }

  get shouldLog () {
    return this.logging && this.logging.modelManager
  }

  get clazzName () {
    return this.constructor.name || 'TimeMachine'
  }

  log (event, ...args) {
    if (!this.shouldLog) return
    console.log(`${this.clazzName} [${this.name}] :`, event, ...args)
  }

  createHistory () {
    return this.history || []
  }

  timeTravel (index) {
    this.log('timeTravel to', index)
    this.model = this.history[index]
    this.updateModelRef()
    return this
  }

  updateModelRef () {
    // this.modelRef = mutable
    // this.log('set modelRef', this.modelRef, this.model)
    this.modelRef.splice(0, this.modelRef.length)
    this.model.forEach(item => {
      this.modelRef.push(item)
    })
  }

  undo () {
    this.log('undo timeIndex', this.timeIndex)
    if (this.timeIndex === 0) {
      return false
    }
    this.timeIndex--
    this.timeTravel(this.timeIndex)
    return this
  }

  redo () {
    this.log('redo timeIndex', this.timeIndex, this.history.length)
    if (this.timeIndex > this.history.length - 1) {
      return false
    }
    this.timeIndex++
    this.timeTravel(this.timeIndex)
    return this
  }

  addToHistory (newModel) {
    this.log('addToHistory')
    this.log('old', this.model)
    this.log('new', newModel)
    this.model = newModel
    this.log('model was set to', this.model)
    this.history.push(newModel)
    this.timeIndex++
    this.updateModelRef()
    return this
  }
}
