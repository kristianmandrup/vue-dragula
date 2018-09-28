import {
  BaseModelManager
} from './base-model-manager'

export class ModelManager extends BaseModelManager {
  constructor(opts = {}) {
    super(opts)
    this.model = this.createModel(this.modelRef)
    this.log('CREATE', opts)
  }

  get clazzName() {
    return this.constructor.name || 'ModelManager'
  }

  get shouldLog() {
    return this.logging && this.logging.modelManager
  }

  log(event, ...args) {
    if (!this.shouldLog) return
    console.log(`${this.clazzName} [${this.name}] :`, event, ...args)
  }

  undo() {
    this.log('undo', 'not yet implemented')
  }

  redo() {
    this.log('redo', 'not yet implemented')
  }

  at(index) {
    return this.model.get ? this.model.get(index) : this.model[index]
  }

  clear() {
    this.model = this.createModel()
  }

  createModel(model) {
    return this.model || model || []
  }

  createFor(opts = {}) {
    return new ModelManager(opts)
  }

  removeAt(index) {
    if (this.copy) return
    this.log('removeAt', {
      model: this.model,
      index
    })
    const splicedModel = this.model.splice(index, 1)
    const removedModel = this.model

    this.log({
      splicedModel,
      removedModel
    })
    return removedModel
  }

  insertAt(index, insertModel) {
    this.log('insertAt', {
      model: this.model,
      index,
      insertModel
    })
    // according to Vue docs, Vue wraps splice method to mutate array in place and update view
    const splicedModel = this.model.splice(index, 0, insertModel)
    const modelAfterInsert = this.model

    this.log('insertAt', {
      splicedModel,
      modelAfterInsert
    })
    return modelAfterInsert
  }

  move({
    dragIndex,
    dropIndex
  }) {
    if (this.copy) return
    this.log('move', {
      model: this.model,
      dragIndex,
      dropIndex
    })
    const splicedRemainder = this.model.splice(dragIndex, 1)
    const remainder = splicedRemainder[0]

    const modelAfterRemove = this.model.splice(dropIndex, 0, remainder)
    const movedModel = this.model

    this.log('move', {
      splicedRemainder,
      modelAfterRemove,
      movedModel
    })
    return modelAfterRemove
  }
}
