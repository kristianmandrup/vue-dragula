import dragula from 'dragula'
import {
  DragulaService
} from './service'

if (!dragula) {
  throw new Error('[vue-dragula] cannot locate dragula.')
}

const defaults = {
  createService: function ({
    name,
    eventBus,
    drakes,
    options
  }) {
    return new DragulaService({
      name,
      eventBus,
      drakes,
      options
    })
  },
  createEventBus: function (Vue) {
    return new Vue()
  }
}

function isEmpty(str) {
  if (!str) return true
  if (str.length === 0) return true
  return false
}

export default function (Vue, options = {}) {
  // set full fine-grained logging if true
  if (options.logging === true) {
    options.logging = {
      plugin: true,
      directive: true,
      service: true,
      dragHandler: true
    }
  }

  function logPlugin(...args) {
    if (!options.logging) return
    if (!options.logging.plugin) return
    console.log('vue-dragula plugin', ...args)
  }

  function logServiceConfig(...args) {
    if (!options.logging) return
    if (!options.logging.service) return
    console.log('vue-dragula service config: ', ...args)
  }

  function logDir(...args) {
    if (!options.logging) return
    if (!options.logging.directive) return
    console.log('v-dragula directive', ...args)
  }

  logPlugin('Initializing vue-dragula plugin', options)

  let createService = options.createService || defaults.createService
  let createEventBus = options.createEventBus || defaults.createEventBus || new Vue()

  logPlugin('create eventBus', createEventBus)
  const eventBus = createEventBus(Vue, options)

  if (!eventBus) {
    console.warn('Eventbus could not be created')
    throw new Error('Eventbus could not be created')
  }

  logPlugin('eventBus created', eventBus)

  // global service
  const appService = createService({
    name: 'global.dragula',
    eventBus,
    drakes: options.drakes,
    options
  })

  let globalName = 'globalDrake'

  class Dragula {
    constructor(options) {
      this.options = options

      // convenience functions on global service
      this.$service = {
        options: appService.setOptions.bind(appService),
        find: appService.find.bind(appService),
        eventBus: appService.eventBus
      }
      // add default drake on global app service
      this.$service.options('default', {})

      // alias
      this.createServices = this.createService
    }

    optionsFor(name, opts = {}) {
      this.service(name).setOptions(opts)
      return this
    }

    createService(serviceOpts = {}) {
      logServiceConfig('createService', serviceOpts)

      this._serviceMap = this._serviceMap || {}

      let names = serviceOpts.names || []
      let name = serviceOpts.name || []
      let drakes = serviceOpts.drakes || {}
      let drake = serviceOpts.drake
      let opts = Object.assign({}, options, serviceOpts)
      names = names.length > 0 ? names : [name]
      let eventBus = serviceOpts.eventBus || appService.eventBus
      if (!eventBus) {
        console.warn('Eventbus could not be created', eventBus)
      }

      logServiceConfig('names', names)
      names.forEach(name => {
        let createOpts = {
          name,
          eventBus,
          options: opts
        }
        logServiceConfig('create DragulaService', name, createOpts)
        this._serviceMap[name] = createService(createOpts)

        // use 'default' drakes if none specified
        if (!drakes.default) {
          drakes.default = drake || true
        }

        this.drakesFor(name, drakes)
      })
      return this
    }

    drakesFor(name, drakes = {}) {
      logServiceConfig('drakesFor', name, drakes)
      let service = this.service(name)

      if (Array.isArray(drakes)) {
        // turn Array into object of [name]: true
        drakes = drakes.reduce((obj, name) => {
          obj[name] = true
          return obj
        }, {})
      }

      Object.keys(drakes).forEach(drakeName => {
        let drakeOpts = drakes[drakeName]
        if (drakeOpts === true) {
          drakeOpts = {}
        }

        service.setOptions(drakeName, drakeOpts)
      })
      return this
    }

    on(name, handlerConfig = {}) {
      logServiceConfig('on', name, handlerConfig)
      if (typeof name === 'object') {
        handlerConfig = name
        // add event handlers for all services
        let serviceNames = this.serviceNames

        if (!serviceNames || serviceNames.length < 1) {
          console.warn('vue-dragula: No services found to add events handlers for', this._serviceMap)
          return this
        }

        logServiceConfig('add event handlers for', serviceNames)
        serviceNames.forEach(serviceName => {
          this.on(serviceName, handlerConfig)
        })
        return this
      }

      let service = this.service(name)
      if (!service) {
        console.warn(`vue-dragula: no service ${name} to add event handlers for`)
        return this
      }
      logServiceConfig('service.on', service, handlerConfig)
      service.on(handlerConfig)
      return this
    }

    get serviceNames() {
      return Object.keys(this._serviceMap)
    }

    get services() {
      return Object.values(this._serviceMap)
    }

    // return named service or first service
    service(name) {
      if (!this._serviceMap) return

      let found = this._serviceMap[name]
      logServiceConfig('lookup service', name, found)

      if (!found) {
        logServiceConfig('not found by name, get default')
        let keys = this.serviceNames
        if (keys) {
          found = this._serviceMap[keys[0]]
        }
      }
      return found
    }
  }

  Vue.$dragula = new Dragula(options)

  let drakeContainers = {}

  Vue.prototype.$dragula = Vue.$dragula

  function findService(name, vnode, serviceName) {
    // first try to register on DragulaService of component
    if (vnode) {
      let dragula = vnode.context.$dragula
      if (dragula) {
        logDir('trying to find and use component service')

        let componentService = dragula.service(serviceName)
        if (componentService) {
          logDir('using component service', componentService)
          return componentService
        }
      }
    }
    logDir('using global service', appService)
    return appService
  }

  function calcNames(name, vnode, ctx) {
    let drakeName = vnode ? vnode.data.attrs.drake : this.params.drake
    const serviceName = vnode ? vnode.data.attrs.service : this.params.service
    let drakeOptions = vnode ? vnode.data.attrs.options : this.params.options

    if (drakeName !== undefined && drakeName.length !== 0) {
      name = drakeName
    }
    drakeName = isEmpty(drakeName) ? 'default' : drakeName
    if (!drakeOptions) drakeOptions = {}

    return {
      name,
      drakeName,
      serviceName,
      drakeOptions
    }
  }

  function updateDirective(container, binding, vnode, oldVnode) {
    logDir('updateDirective')
    const newValue = vnode ? binding.value : container
    if (!newValue) {
      return
    }

    const {
      name,
      drakeName,
      serviceName
    } = calcNames(globalName, vnode, this)
    const service = findService(name, vnode, serviceName)
    const drake = service.find(drakeName, vnode)

    drakeContainers[drakeName] = drakeContainers[drakeName] || []
    let dc = drakeContainers[drakeName]

    // skip if has already been configured (same container in same drake)
    if (dc) {
      let found = dc.find(c => c === container)
      if (found) {
        logDir('already has drake container configured', drakeName, container)
        return
      }
    }

    if (!service) {
      logDir('no service found', name, drakeName)
      return
    }

    if (!drake.models) {
      drake.models = []
    }

    if (!vnode) {
      container = this.el // Vue 1
    }

    let modelContainer = service.findModelContainerByContainer(container, drake)

    dc.push(container)

    logDir('DATA', {
      service: {
        name: serviceName,
        instance: service
      },
      drake: {
        name: drakeName,
        instance: drake
      },
      container,
      modelContainer
    })

    if (modelContainer) {
      logDir('set model of container', newValue)
      modelContainer.model = newValue
    } else {
      logDir('push model and container on drake', newValue, container)
      drake.models.push({
        model: newValue,
        container: container
      })
    }
  }

  Vue.directive('dragula', {
    params: ['drake', 'service', 'options'],

    bind(container, binding, vnode) {
      logDir('BIND', container, binding, vnode)

      const {
        name,
        drakeName,
        serviceName,
        drakeOptions
      } = calcNames(globalName, vnode, this)
      const service = findService(name, vnode, serviceName)
      const drake = service.find(drakeName, vnode)

      if (!vnode) {
        container = this.el // Vue 1
      }

      logDir({
        service: {
          name: serviceName,
          instance: service
        },
        drake: {
          name: drakeName,
          instance: drake
        },
        container
      })

      if (drake) {
        drake.containers.push(container)
        return
      }
      drakeOptions.containers = [container]
      let newDrake = dragula(drakeOptions)
      service.add(name, newDrake)

      service.handleModels(name, newDrake)
    },

    update(container, binding, vnode, oldVnode) {
      logDir('UPDATE', container, binding, vnode)
      // Vue 1
      if (Vue.version === 1) {
        updateDirective(container, binding, vnode, oldVnode)
      }
    },

    componentUpdated(container, binding, vnode, oldVnode) {
      logDir('COMPONENT UPDATED', container, binding, vnode)
    },

    inserted(container, binding, vnode, oldVnode) {
      logDir('INSERTED', container, binding, vnode)
      // Vue 2
      updateDirective(container, binding, vnode, oldVnode)
    },

    unbind(container, binding, vnode) {
      logDir('UNBIND', container, binding, vnode)

      const {
        name,
        drakeName,
        serviceName
      } = calcNames(globalName, vnode, this)
      const service = findService(name, vnode, serviceName)
      const drake = service.find(drakeName, vnode)

      logDir({
        service: {
          name: serviceName,
          instance: service
        },
        drake: {
          name: drakeName,
          instance: drake
        },
        container
      })

      if (!drake) {
        return
      }

      var containerIndex = drake.containers.indexOf(container)

      if (containerIndex > -1) {
        logDir('remove container', containerIndex)
        drake.containers.splice(containerIndex, 1)
      }

      if (drake.containers.length === 0) {
        logDir('destroy service')
        service.destroy(name)
      }
    }

  })
}
