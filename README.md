# vue2-dragula
> :ok_hand: Drag and drop so simple it hurts

Vue wrapper for [dragula](https://github.com/bevacqua/dragula) drag'n drop library, based on [vue-dragula](https://github.com/Astray-git/vue-dragula) by [@Astray-git](https://github.com/Astray-git).

This library has been refactored, upgraded and extended with powerful new features for use with Vue 2.

## Overview
- Works with [Vue 2](https://medium.com/the-vue-point/vue-2-0-is-here-ef1f26acf4b8#.c089dtgol)
- More flexible and powerful than original (Vue 1) plugin
- Removed concept of bags. Reference named drakes directly
- [Vue2 demo app](https://github.com/kristianmandrup/vue2-dragula-demo/)

See [Changelog](https://github.com/kristianmandrup/vue2-dragula/blob/master/Changelog.md) for more details.

## Status

All test pass. Now supports action history with time travel and undo/redo. See [demo](https://github.com/kristianmandrup/vue2-dragula-demo/)

## Install
#### CommonJS

*npm*

```bash
npm install vue2-dragula --save
```

*yarn*

```bash
yarn add vue2-dragula
```

*Vue configuration*

```js
import Vue from 'vue'
import { Vue2Dragula } from 'vue2-dragula'

Vue.use(Vue2Dragula, {
  logging: {
    service: true
  }
});
```

## Template Usage
``` html
<div class="wrapper">
  <div class="container" v-dragula="colOne" drake="first">
    <!-- with click -->
    <div v-for="text in colOne" :key="text" @click="onClick">{{text}} [click me]</div>
  </div>
  <div class="container" v-dragula="colTwo" drake="first">
    <div v-for="text in colTwo" :key="text">{{text}}</div>
  </div>
</div>
```

**NOTE**: Since Vue 2.x, having the `:key` attribute when using `v-for` is **reqired**.

## API
You can access the global app service via `Vue.$dragula.$service` or from within a component via `this.$dragula.$service`.

You can also create named services for more fine grained control (more on this later)

### `options(name, options)`
Set [dragula options](https://github.com/bevacqua/dragula#optionscontainers)

```js
// ...
new Vue({
  // ...
  created () {
    const service = Vue.$dragula.$service
    service.options('my-drake', {
      direction: 'vertical'
    })
  }
})
```

### `find(name)`
Returns the named `drake` instance of the service.

## Events
For [drake events](https://github.com/bevacqua/dragula#drakeon-events)

```js
  service.eventBus.$on('drop', (args) => {
    console.log('drop: ' + args[0])
  })
})
```

## Development
`npm` scripts included:

- `npm run build` to build new distribution in `/dist`
- `npm run dev` run example in dev mode
- `npm run lint` lint code using ESlint

[Vue 2 demo app](https://github.com/kristianmandrup/vue2-dragula-demo/)

## The API in depth
Access `this.$dragula` in your `created () { ... }` life cycle hook of any component which uses the `v-dragula` directive. 
Add named service(s) via `this.$dragula.createService` and initialise with the drakes you want to use.

### $dragula
`$dragula` API:
  - `createService({name, eventBus, drakes})` : to create a named service
  - `createServices({names, ...})` : to create multiple services (`names` list)
  - `on(handlerConfig = {})` : add event handlers to all services
  - `on(name, handlerConfig = {})` : add event handlers to specific service
  - `drakesFor(name, drakes = {})` : configure a service with drakes
  - `service(name)` : get named service
  - `.services` : get list of all registered services
  - `.serviceNames` : get list of names for all registered services

### DragulaService
The `DragulaService` constructor takes the following deconstructed arguments.
Only `name` and `eventBus` are required. 

Note: You don't normally need to create the `DragulaService` yourself. Use the API to handle this for you.

```js
class DragulaService {
  constructor ({name, eventBus, drakes, options}) {
    ...
  }
  // ...
}
```

Drakes are indexed by name in the `drakes` Object of the service. Each key is the name of a drake which points to a `drake` instance. The `drake` can have event handlers, models, containers etc. See [dragula options](https://github.com/bevacqua/dragula#dragulacontainers-options)

## Model mechanics
The `drake` event handlers have default mechanics for how to operate on the underlyng models. These can be customized as needed.

A common scenario is to have a tree of node objects, where each node has 
a `children` key. You'd want to be able to drag elements to modify the node tree stucture.

```js
{
  type: 'container'
  children: [
    {
      type: 'form',
      children: [
        {
          type: 'input'
          as: 'text'
          value: 'hello'
          label: 'Your name'
        },
        {
          type: 'input'
          as: 'checkbox'
          value: 'yes'
          label: 'Feeling good?'
        }
      ]
    },
    {
      type: 'form',
      children: [
      ]
    }
  ]
}
```

In this example we should be able to move a form input specification object from one form container node to another. This is possible simply by 
setting `<template>` elements with `v-dragula` directives to point to `children[0].children` and `children[1].children` respectively. We can use the rest of the node tree data to visualize the various different nodes. This could form the basis for a visual editor!

### DragHandler for fine-grained control
For fine-grained control on how nodes are added/removed from the various lists. Some lists might only allow that nodes added at the front or back, some might have validation/business rules etc.

The `dragHandler` instance of the `DragHandler` class encapsulates the states and logic of dragging and re-arranging the underlying models.

Sample code taken from `handleModels` method of `DragulaService`

```js
const dragHandler = this.createDragHandler({ ctx: this, name, drake })

drake.on('remove', dragHandler.remove)
drake.on('drag', dragHandler.drag)
drake.on('drop', dragHandler.drop)
```

Key model operation methods in `DragHandler`
- on `remove` drag action: `removeModel`
- on `drop` drag action: `dropModelSame` and `insertModel`

```js
  removeModel() {
    this.log('removeModel', {
      sourceModel: this.sourceModel,
      dragIndex: this.dragIndex
    })
    this.sourceModel.removeAt(this.dragIndex)
  }

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

  insertModel(targetModel, dropElmModel) {
    this.log('insertModel', {
      targetModel: targetModel,
      dropElmModel: dropElmModel
    })
    targetModel.insertAt(this.dropIndex, dropElmModel)
  }
```

The `DragHandler` class can be subclassed and the model operations customized as needed. You can pass a custom factory method `createDragHandler` as a service option. Let's assume we have a `MyDragHandler` class which extends `DragHandler` and overrides key methods with custom logic. Now lets use it!

```js
function createDragHandler({ctx, name, drake}) {
  return new MyDragHandler({ ctx, name, drake })
}

export default {
  props: [],
  data() {
    return {
      //...
    }
  },
  // setup services with drakes
  created () {
    this.$dragula.createService({
      name: 'myService',
      createDragHandler,
      drakes: {
        third: true,
        fourth: {
          copy : true
        }
      }
    })
  }
}
```

Note that you can set a drake to `true` as a convenience to configure it with default options. This is a shorthand for `third: {}`. You can also pass an array of drake names, ie `drakes: ['third', 'fourth']`

### ModelManager to create and manage model

The underlying model is controlled by a `ModelManager`. By default a simple Array is used, however you can substitute and customize the `ModelManager` just like the `DragHandler` to fit your needs. You could f.ex use a history stack to enalke undo/redo and history or you an immutable list or both in combination.

```js
import { ModelManager } from 'vue2-dragula'

class MyModelManager {
  constructor(opts) {
    super(opts)
  }

  createModel() {
    return new ImmutableList()
  }

  removeAt(index) {
    //...
  }

  insertAt(index, item) {
    //...
  }

  move({dragIndex, dropIndex})
    //...
  }
}

function createModelManager(opts) {
  return new MyModelManager(opts)
}
```

Then you can pass it as the `createModelManager` option when creating a service.

```js
this.$dragula.createService({
  name: 'myService',
  createDragHandler,
  createModelManager
  // ...
})
```

The demo app now contains an example demonstrating use of a custom ModelManager, `ImmutableModelManager` with a `TimeMachine` and `ActionManager` which maintains a history of transitions and enables undo/redo of drag and drop actions!!

### Binding models to draggable elements
Please note that `vue-dragula` expects the `v-dragula` binding expression to point to a model in the VM of the component, ie. `v-dragula="items"`

When you move the elements in the UI you also (by default) rearrange the underlying model list items (using `findModelForContainer` in the service). This is VERY powerful!

Note that special Vue events `removeModel`, `dropModel` and `insertAt` are emitted as model items are moved around.

```js
this.name, el, source, this.dragIndex
  'my-first:removeModel': ({name, el, source, dragIndex, sourceModel}) => {
    // ...
  },
  'my-first:dropModel': ({name, el, source, target, dropIndex, sourceModel}) => {
    // ...
  },
  'my-first:insertAt': ({indexes, models, elements}) => {
    // ...
  },
```

- `el` main DOM element of element (f.ex element being dropped on)
- `source` is the element being dragged
- `target` is the element being dragged to
- `dragIndex` and `dropIndex` are indexes in the VM models (lists)

If you need more advanced control over models (such as filtering, conditions etc.) you can use watchers on these models and then create derived models in response, perhaps dispatching local model state to a [Vuex](vuex.vuejs.org) store. We recommend keeping the "raw" dragula models intact and in sync with the UI models/elements.

### Event delegation

Each `drake` is setup to delegate dragula events to the Vue event system (ie. `$emit`) and sends events of the same name. This lets you define custom drag'n drop event handling as regular Vue event handlers.

A named service `my-first` emits events such as `drop` and `my-first:drop` so you can choose to setup listeneres to for service specific events!

There are also two special events for when the underlying models are operated on: `removeModel` and `dropModel`. These also have service specific variants.

### Logging
You can pass a `logging: true` as an option when initialising the plugin or when you create a new service.

```js
Vue.use(VueDragula, {
  // ...
  logging: true
});
```

*Fine grained logging*

You can also specify more fine grained logging as follows:

```js
Vue.use(VueDragula, {
  // ...
  logging: {
    service: true,
    dragHandler: true
  }
});
```

The logging options are: `plugin`, `directive`, `service` and `dragHandler`

Logging is essential in development mode!!

### Customise DragulaService
You can also subclass `DragulaService` or create your own, then pass a `createService` option for you install the plugin:

```js
import { DragulaService } from 'vue2-dragula'

class MyDragulaService extends DragulaService {
  /// ...
}

function createService({name, eventBus, drakes}) {
  return new MyDragulaService({
    name,
    eventBus,
    drakes
  })
}

Vue.use(VueDragula, { createService });
```

### Custom event bus
You can customize the event bus used via the `createEventBus` option. 
You could f.ex create an event bus factory method to always log events emitted if logging is turned on.

```js
function createEventBus(Vue, options = {}) {
  const eventBus = new Vue()
  return {
    $emit: function(event, args) {
      if (options.logging) {
        console.log('emit:', event, args)
      }
      eventBus.$emit(event, args)
    }
  })
}

Vue.use(VueDragula, { createEventBus });
```

## How do the drakes work!?
In the directive `bind` function we have the following core logic:

```js
  if (drake) {
    drake.containers.push(container)
    return
  }
  drake = dragula({
    containers: [container]
  })
  service.add(name, drake)
```

If the drake already exists, ie. `if (drake) { ... }` then we add the container directly into a pre-existing drake created in the `created` lifecycle hook of the component. Otherwise it tries to register as a new named drake in the service `drakes` map (Object).

*Drake conflict warning*

You can get a conflict if one or more drakes are added via directives, and the drakes have not been pre-configured in the VM. This conflict is caused by race conditions, as the directives are evaluated asynchronously for enhanced view performance!

Thanks to [@Astray-git](https://github.com/Astray-git) for [making this clear](https://github.com/Astray-git/vue-dragula/issues/12#issuecomment-260134897)

Note: *@Astray-git* is the original author of this plugin :)

Note: In the near future we will likely try to overcome this constraint, by always inserting the new container in an existing drake or simply overwriting.

Setup a service with one or more drakes ready for drag'n drop action

```js
created () {
  this.$dragula.createService({
    name: 'myService',
    drakes: {
      'first': {
        copy: true
      }
    }
  }).on({
    // ... event handler map
  })
}
```

You can also use the `drakesFor` method on a registered service.

```
  this.$dragula.drakesFor('myService', {
    'first': {
      copy: true
    }
  })
}
```

This ensures that the `DragulaService` instance `myService` is registered and contains one or more drakes which are ready to be populated by `v-dragula` container elements.

``` html
<div class="wrapper">
  <div class="container" v-dragula="colOne" service="myService" drake="first">
    <!-- with click -->
    <div v-for="text in colOne" @click="onClick">{{text}} [click me]</div>
  </div>
  <div class="container" v-dragula="colTwo" service="myService" drake="first">
    <div v-for="text in colTwo">{{text}}</div>
  </div>
</div>
```

If you simply specify the service name without a specific named drake configuration it will use the `default` drake. A named service will always have a `default` drake configuration.

```html
  <div class="container" v-dragula="colTwo" service="myService">
    <div v-for="text in colTwo">{{text}}</div>
  </div>
```

You can configure the `default` drake simply using the `drake` option on the service.

```js
this.$dragula.createService({
  name: 'myService',
  drake: {
  }
})
```

When the `v-dragula` directives are evaluated and bound to the component (via directive `bind` method), they will each find a drake configuration of that name on the service and push their DOM `container` to the list of `drake.containers`.

```js
  if (drake) {
    drake.containers.push(container)
    return
  }
```

### Advanced drake configuration
If you need to add [dragula containers and models](https://github.com/bevacqua/dragula#dragulacontainers-options) programmatically, try something like this:

```js
  drake.models.push({
    model: model,
    container: container
  })
```

Here the `model` is a pointer to a list in the model data of your VM. The container is a DOM element which contains a list of elements that an be dragged and rearranged and their ordering reflected (mirrored) in the model.

To access and modify models and containers for a particular drake:

```js
let drake = this.$dragula.service('my-list').find('third')
drake.models.push({
  model: model,
  container: container
})
drake.containers.push(container)
```

You will need a good understanding of the inner workings of Dragula in order to get this right ;) Feel free to help improve the API to make this easier!

## Adding Drag Effects

Please see and try out the `DragEffects` example of the [demo app](https://github.com/kristianmandrup/vue2-dragula-demo/)

See [dragula drakeon events](https://github.com/bevacqua/dragula#drakeon-events)

```js
// https://developer.mozilla.org/en/docs/Web/API/Element/classList
service.on({
  accepts: ({name, el, target}) => {
    return true
  },
  drag: ({el, container, service, drake}) => {
    el.classList.remove('ex-moved')
  },
  drop: ({el, container}) => {
    el.classList.add('ex-moved')
  },
  over: ({el, container}) => {
    el.classList.add('ex-over')
  },
  out: ({el, container}) => {
    el.classList.remove('ex-over')
  }
})
```

Here `name` is the drake name and `drake`  and `server` are the drake and service instances (objects).

You can also subscribe to service specific events, here for `drag` events from the service called `my-first`

```js
  'my-first:drag': ({el, container}) => {
    el.classList.remove('ex-moved')
  },
```

Sample effect styling with [CSS fade-in transition effect](http://www.chrisbuttery.com/articles/fade-in-fade-out-with-javascript/)

```css
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

.ex-moved {
  animation: fadeIn .5s ease-in 1 forwards;
  border: 2px solid yellow;
  padding: 2px
}

.ex-over {
  animation: fadeIn .5s ease-in 1 forwards;
  border: 4px solid green;
  padding: 2px
}
```

### Time travel

The following classes are included:

- `ImmutableModelManager`
- `TimeMachine`
- `ActionManager`

See [time travel demo](https://github.com/kristianmandrup/vue2-dragula-demo/) for how to use these classes.

```js
import { 
  ImmutableModelManager, 
  TimeMachine, ActionManager 
} from 'vue2-dragula'
```

The ImmutableModelManager should normally be subclassed, especially `createModel` which returns a normal `Array`

```js
  createModel (model) {
    return model || []
  }
```

Instead wrap the created model in an immutable of your choice, such as [seamless-immutable](https://www.npmjs.com/package/seamless-immutable) used in the demo.

```js
class SeamlessImmutableModelManager extends ImmutableModelManager {
  constructor(opts) {
    super(opts)
  }

  createModel (model) {
    return Immutable(model || [])
  }
}
```

Note that you can pass a `createTimeMachine` factory method as an option in `opts`, otherwise the default time machine is used.

```js
const createDefaultTimeMachine = function (opts) {
  return new TimeMachine(opts)
}
```

The `ActionManager` can be used to manage actions at the VM level. If you have multiple draggable containers, register an ActionManager for each in a registry of sorts.

## Bonus Recipes

#### Auto-sorted lists

Add an Rx `Observable` or a `watch` to your model (list) which triggers a `sort` of a derived (ie. immutable) model whenever it is updated. You should then display the derived model in your view. Otherwise each sort operation would trigger a new sort.

## License

MIT Kristian Mandrup 2016
