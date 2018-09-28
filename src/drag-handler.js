const raf = window.requestAnimationFrame

function raffy(fn) {
  raf(() => {
    raf(fn)
  })
}

function winTimeout(fn) {
  window.setTimeout(fn, 50)
}

const waitForTransition = raf ? raffy : winTimeout

function isObject(obj) {
  return obj === Object(obj)
}

export class DragHandler {
  constructor({
    ctx,
    name,
    drake,
    options
  }) {
    this.dragElm = null
    this.dragIndex = null
    this.dropIndex = null
    this.sourceModel = null
    this.logging = ctx.logging
    this.ctx = ctx
    this.serviceName = ctx.name
    this.modelManager = ctx.modelManager
    this.drake = drake
    this.name = name
    this.eventBus = ctx.eventBus
    this.findModelForContainer = ctx.findModelForContainer.bind(ctx)
    this.domIndexOf = ctx.domIndexOf.bind(ctx)
  }

  get clazzName() {
    return this.constructor.name || 'DragHandler'
  }

  get shouldLog() {
    return this.logging && this.logging.dragHandler
  }

  log(event, ...args) {
    if (!this.shouldLog) return
    console.log(`${this.clazzName} [${this.name}] :`, event, ...args)
  }

  /**
   * Remove model at drag index
   */
  removeModel() {
    this.log('removeModel', {
      sourceModel: this.sourceModel,
      dragIndex: this.dragIndex
    })
    this.sourceModel.removeAt(this.dragIndex)
  }

  /**
   * Drop model on same container
   * Move model from dropIndex to dragIndex
   */
  dropModelSame() {
    this.log('dropModelSame', {
      sourceModel: this.sourceModel,
      dragIndex: this.dragIndex,
      dropIndex: this.dropIndex
    })

    this.sourceModel.move({
      dropIndex: this.dropIndex,
      dragIndex: this.dragIndex
    })
  }

  /**
   * Insert model on targetModel
   * @param {*} targetModel
   * @param {*} dropElmModel
   * @param {*} elements
   */
  insertModel(targetModel, dropElmModel, elements) {
    this.log('insertModel', {
      targetModel: targetModel,
      dropIndex: this.dropIndex,
      dropElmModel: dropElmModel,
      elements
    })

    targetModel.insertAt(this.dropIndex, dropElmModel)

    this.emit('insertAt', {
      elements,
      targetModel,
      transitModel: dropElmModel,
      dragIndex: this.dragIndex,
      dropIndex: this.dropIndex,
      models: {
        source: this.sourceModel,
        target: targetModel,
        transit: dropElmModel
      },
      indexes: {
        source: this.dragIndex,
        target: this.dropIndex
      }
    })
  }

  /**
   * If not copy, we remove model from source model after a nice transition
   */
  notCopy() {
    // This transition poses a problem in dropModel handlers - because if we try to use the model 
    // inside such a handler - the model has not been updated yet because of this waiting for transition 
    //waitForTransition(() => {
      this.sourceModel.removeAt(this.dragIndex)
    //})
  }

  /**
   * Cancel drop
   * @param {*} target
   */
  cancelDrop(target) {
    this.log('No targetModel could be found for target:', {
      target
    })
    this.log('in drake:', {
      drake: this.drake
    })
    this.drake.cancel(true)
  }

  /**
   * Handle drop model from source to target
   * @param {*} dropElm
   * @param {*} target
   * @param {*} source
   */
  dropModelTarget(dropElm, target, source) {
    this.log('dropModelTarget', {
      dropElm,
      target,
      source
    })
    let notCopy = this.dragElm === dropElm
    let targetModel = this.getModel(target)
    let dropElmModel = notCopy ? this.dropElmModel() : this.jsonDropElmModel()

    // we have to cancel the drop to prevent discrepancy between VirtualDOM and actual DOM
    // otherwise when we update the models and Vue tries to re-render it will be confused when not
    // finding the dragged node where Vue expects to find it
    this.drake.cancel(true); 
    
    if (notCopy) {
      this.notCopy()
    }

    if (!targetModel) {
      return this.cancelDrop(target)
    }

    let elements = {
      drop: dropElm,
      target,
      source
    }

    this.insertModel(targetModel, dropElmModel, elements)
  }

  dropModel(dropElm, target, source) {
    this.log('dropModel', {
      dropElm,
      target,
      source
    })
    target === source ? this.dropModelSame() : this.dropModelTarget(dropElm, target, source)
  }

  emit(eventName, opts = {}) {
    this.log('emit', {
      eventName,
      opts
    })
    opts.sourceModel = this.sourceModel
    opts.name = this.name
    this.eventBus.$emit(eventName, opts)

    this.log('emit service', {
      serviceEventName,
      eventName,
      opts
    })
    let serviceEventName = `${this.serviceName}:${eventName}`
    this.eventBus.$emit(serviceEventName, opts)
  }

  /**
   * Get model from location in
   * @param {*} location
   */
  getModel(location) {
    const model = this.findModelForContainer(location, this.drake)
    this.log('getModel', {
      location,
      model
    })

    return this.modelManager.createFor({
      name: this.name,
      drake: this.drake,
      logging: this.logging,
      model
    })
  }

  /**
   * Remov element from container in source
   * @param {*} el
   * @param {*} container
   * @param {*} source
   */
  remove(el, container, source) {
    this.log('remove', {
      el,
      container,
      source
    })
    if (!this.drake.models) {
      this.log('Warning: Can NOT remove it. Must have models:', this.drake.models)
      return
    }

    this.sourceModel = this.getModel(source)
    this.removeModel()
    this.drake.cancel(true)

    this.emit('removeModel', {
      el,
      source,
      dragIndex: this.dragIndex
    })
  }

  /**
   * Handle drag element from source
   * @param {*} el
   * @param {*} source
   */
  drag(el, source) {
    this.log('drag', {
      el,
      source
    })
    this.dragElm = el
    this.dragIndex = this.domIndexOf(el, source)
  }

  /**
   * Handle drop element from source to target
   * @param {*} dropEl
   * @param {*} target
   * @param {*} source
   */
  drop(dropEl, target, source) {
    this.log('drop', {
      dropEl,
      target,
      source
    })
    if (!this.drake.models && !target) {
      this.log('Warning: Can NOT drop it. Must have either models:', this.drake.models, ' or target:', target)
      return
    }
    this.dropIndex = this.domIndexOf(dropEl, target)
    this.sourceModel = this.getModel(source)
    this.dropModel(dropEl, target, source)

    this.emit('dropModel', {
      target,
      source,
      el: dropEl,
      dragIndex: this.dragIndex,
      dropIndex: this.dropIndex
    })
  }

  dropElmModel() {
    return this.sourceModel.at(this.dragIndex)
  }

  jsonDropElmModel() {
    let model = this.sourceModel.at(this.dragIndex)
    let stringable = model ? model.model || model.stringable : model
    let md = stringable || model
    if (!isObject(md)) {
      this.log('jsonDropElmModel', 'invalid element model, must be some sort of Object', stringable, model)
    }
    try {
      let jsonStr = JSON.stringify(stringable || model)
      return JSON.parse(jsonStr)
    } catch (e) {
      this.log('jsonDropElmModel', 'JSON stringify/parse error', e)
    }
  }
}
