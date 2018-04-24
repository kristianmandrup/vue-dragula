# vue2-dragula

> :ok_hand: Drag and drop so simple it hurts

Vue wrapper for [dragula](https://github.com/bevacqua/dragula) drag'n drop library, based on [vue-dragula](https://github.com/Astray-git/vue-dragula) by [@Astray-git](https://github.com/Astray-git).

This library has been refactored, upgraded and extended with powerful new features for use with Vue 2.

## Call for help: copy error

This library has a long standing issue with the `copy` operation, resulting in items being inserted twice in the target container.

I have tried to debug it thorougly but with no success so far. I suspect it has to do with the Vue2 override of Array `splice` method, used in the `ModelManager` and the correct use of the Vue update queue.

You can try the `ImmutableModelManager` and see if that works better as it will return a new immutable array with a new pointer on each change.

[$set for modifying objects in array for reactivity](https://github.com/vuejs/vue/issues/4443)

`Vue.set(this.model, changedModel)`

Here a [JSFiddle](https://jsfiddle.net/tfvouu61/2/) to play with

Please help fix this bug!

You can also try a simple array example in a Vue component, with buttons and handlers to simulate each of the effects (on underlying array model) for the drag effects:

- `copy`
- `move`

To better help track and fix the problem with the way Vue updates arrays.

```js
insertAt(index, insertModel) {
  const splicedModel = this.model.splice(index, 0, insertModel)
  const modelAfterInsert = this.model
  return splicedModel
}
```

Currently the `splicedModel` returns an empty array `[]` and `modelAfterInsert` the same (unmodified) array as before the `splice`. Yet, `copy` (or Vue?) still ends up inserting the item twice in the UI

## Copy: ensure clone

When making a copy error we need to ensure we are not reusing the same reference in the two container models. We need to clone the value first.

Otherwise, if "copy" is deleted or modified in one container, it will be deleted/modifed in both due to shared reference.

```js
dropModelTarget(dropElm, target, source) {
  let notCopy = this.dragElm === dropElm
  let dropElmModel = notCopy ? this.dropElmModel() : this.jsonDropElmModel()
  if (notCopy) {
    this.notCopy()
  }
  // ...
}

jsonDropElmModel() {
  // ...
  let jsonStr = JSON.stringify(stringable || model)
  return JSON.parse(jsonStr)
}
```

So we should be handling this correctly!?

### Call for care taker or more contributors

I haven't been using Vue2 much for the past year, so could use one or more contributors to be take care of this project and keep it up to date.
Thanks!

## Overview

- Works with [Vue 2](https://medium.com/the-vue-point/vue-2-0-is-here-ef1f26acf4b8#.c089dtgol)
- More flexible and powerful than original (Vue 1) plugin
- Removed concept of bags. Reference named drakes directly
- [Vue2 demo app](https://github.com/kristianmandrup/vue2-dragula-demo/)

See [Changelog](https://github.com/kristianmandrup/vue2-dragula/blob/master/Changelog.md) for details.

## Demo

See [vue2-dragula demo](https://github.com/kristianmandrup/vue2-dragula-demo/)

## Gotchas

Beware of Vue 2 reactivity issues when working with Arrays.

See post: [reactivity in Vue2 vs Vue3](https://blog.cloudboost.io/reactivity-in-vue-js-2-vs-vue-js-3-dcdd0728dcdf)

Use `Vue.set` or `vm.$set` to explicitly set/initialize an Array on a component and notify Vue about it.

Beware of pointers and instances which can lead to bugs where a service is triggered multiple times, leading to duplication of events.
## Installation and configuration

### npm

```bash
npm install vue2-dragula --save
```

### yarn

```bash
yarn add vue2-dragula
```

### Vue configuration

```js
import Vue from 'vue'
import { Vue2Dragula } from 'vue2-dragula'

Vue.use(Vue2Dragula, {
  logging: {
    service: true // to only log methods in service (DragulaService)
  }
});
```

[Dragula's CSS](https://github.com/bevacqua/dragula/blob/master/dist/dragula.css), which provides visual feedback for drag effects, is not included in this package and must be imported or provided in your app.

```js
import 'dragula/dist/dragula.css'
```

## Documentation

For additional documentation, see the [docs folder](https://github.com/kristianmandrup/vue2-dragula/tree/master/docs)

## Dragula events and drag effects

See [Dragula events and drag effects](https://github.com/kristianmandrup/vue2-dragula/tree/master/docs/Events-management.md)

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

You can access the global app service via `Vue.$dragula.$service` or from within a component via `this.$dragula.$service` (recommended for most scenarios).

You can also create named services for more fine grained control.

### Service configuration

Set [dragula options](https://github.com/bevacqua/dragula#optionscontainers)

Use `service.options(name, options)` to configure service options

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

### find drake by name

Use `service.find(name)` to return a named `drake` instance registered with the service.

## Event handlers via event bus

See [drake events](https://github.com/bevacqua/dragula#drakeon-events)

Use `service.eventBus.$on` to define drake event handlers

```js
service.eventBus.$on('drop', (args) => {
  console.log('drop: ' + args[0])
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

Add a named service via `this.$dragula.createService({name, eventBus, drakes})` factory method. Initialise each service with the drakes you want to use.

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

## Advanced concepts

### Logging

See [Logging](https://github.com/kristianmandrup/vue2-dragula/tree/master/docs/Logging.md)

## Model mechanics

See [Model mechanics](https://github.com/kristianmandrup/vue2-dragula/tree/master/docs/Model-mechanics.md)

## Customization

See [Customization](https://github.com/kristianmandrup/vue2-dragula/tree/master/docs/Customization.md)

## Drake mechanics and configuration

See [Drake mechanics and configuration](https://github.com/kristianmandrup/vue2-dragula/tree/master/docs/Drake-mechanics.md)

## Adding Drag Effects

See [Drag Effects](https://github.com/kristianmandrup/vue2-dragula/tree/master/docs/Drag-effects.md)

## Time travel

See [Time travel](https://github.com/kristianmandrup/vue2-dragula/tree/master/docs/Time-travel.md)

## VueX integration

See [VueX integration example](https://github.com/kristianmandrup/vue2-dragula/tree/master/examples/VueX-sample.md)

Please help add more examples.

## Wiki with Bonus Recipes

Please see the [Wiki](https://github.com/kristianmandrup/vue2-dragula/wiki)

## Recipes

### Auto-sorted lists

Add an Rx `Observable` or a `watch` to your model (list) which triggers a `sort` of a derived (ie. immutable) model whenever it is updated. You should then display the derived model in your view. Otherwise each sort operation would trigger a new sort.

## License

MIT Kristian Mandrup 2016
