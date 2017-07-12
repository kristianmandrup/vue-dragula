import { BaseModelManager } from './base-model-manager'

export class ModelManager extends BaseModelManager {
  constructor (opts = {}) {
    super(opts)
    this.model = this.createModel(this.modelRef)
    this.log('CREATE', opts)
  }

  get clazzName () {
    return this.constructor.name || 'ModelManager'
  }

  get shouldLog () {
    return this.logging && this.logging.modelManager
  }

  log (event, ...args) {
    if (!this.shouldLog) return
    console.log(`${this.clazzName} [${this.name}] :`, event, ...args)
  }

  undo () {
    this.log('undo', 'not yet implemented')
  }

  redo () {
    this.log('redo', 'not yet implemented')
  }

  at (index) {
    return this.model.get ? this.model.get(index) : this.model[index]
  }

  clear () {
    this.model = this.createModel()
  }

  createModel (model) {
    return this.model || model || []
  }

  createFor (opts = {}) {
    return new ModelManager(opts)
  }

  removeAt (index) {
    if (this.copy) return;
    this.log('removeAt', {
      model: this.model,
      index
    })
    return this.model.splice(index, 1)
  }

  insertAt (index, dropModel) {
    this.log('insertAt', {
      model: this.model,
      index,
      dropModel
    })
    return this.model.splice(index, 0, dropModel)
  }

  move ({dragIndex, dropIndex}) {
    if (this.copy) return;
    this.log('move', {
      model: this.model,
      dragIndex,
      dropIndex
    })

    return this.model.splice(dropIndex, 0, this.model.splice(dragIndex, 1)[0])
  }
}
