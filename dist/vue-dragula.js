/*!
 * vue-dragula v2.5.3
 * (c) 2018 Yichang Liu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.vueDragula = global.vueDragula || {})));
}(this, function (exports) { 'use strict';

	var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {}

	function interopDefault(ex) {
		return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var atoa = createCommonjsModule(function (module) {
	  module.exports = function atoa(a, n) {
	    return Array.prototype.slice.call(a, n);
	  };
	});

	var atoa$1 = interopDefault(atoa);

var require$$1 = Object.freeze({
	  default: atoa$1
	});

	var ticky = createCommonjsModule(function (module) {
	  var si = typeof setImmediate === 'function',
	      tick;
	  if (si) {
	    tick = function tick(fn) {
	      setImmediate(fn);
	    };
	  } else if (typeof process !== 'undefined' && process.nextTick) {
	    tick = process.nextTick;
	  } else {
	    tick = function tick(fn) {
	      setTimeout(fn, 0);
	    };
	  }

	  module.exports = tick;
	});

	var ticky$1 = interopDefault(ticky);

var require$$0$1 = Object.freeze({
	  default: ticky$1
	});

	var debounce = createCommonjsModule(function (module) {
	  'use strict';

	  var ticky = interopDefault(require$$0$1);

	  module.exports = function debounce(fn, args, ctx) {
	    if (!fn) {
	      return;
	    }
	    ticky(function run() {
	      fn.apply(ctx || null, args || []);
	    });
	  };
	});

	var debounce$1 = interopDefault(debounce);

var require$$0 = Object.freeze({
	  default: debounce$1
	});

	var emitter = createCommonjsModule(function (module) {
	  'use strict';

	  var atoa = interopDefault(require$$1);
	  var debounce = interopDefault(require$$0);

	  module.exports = function emitter(thing, options) {
	    var opts = options || {};
	    var evt = {};
	    if (thing === undefined) {
	      thing = {};
	    }
	    thing.on = function (type, fn) {
	      if (!evt[type]) {
	        evt[type] = [fn];
	      } else {
	        evt[type].push(fn);
	      }
	      return thing;
	    };
	    thing.once = function (type, fn) {
	      fn._once = true; // thing.off(fn) still works!
	      thing.on(type, fn);
	      return thing;
	    };
	    thing.off = function (type, fn) {
	      var c = arguments.length;
	      if (c === 1) {
	        delete evt[type];
	      } else if (c === 0) {
	        evt = {};
	      } else {
	        var et = evt[type];
	        if (!et) {
	          return thing;
	        }
	        et.splice(et.indexOf(fn), 1);
	      }
	      return thing;
	    };
	    thing.emit = function () {
	      var args = atoa(arguments);
	      return thing.emitterSnapshot(args.shift()).apply(this, args);
	    };
	    thing.emitterSnapshot = function (type) {
	      var et = (evt[type] || []).slice(0);
	      return function () {
	        var args = atoa(arguments);
	        var ctx = this || thing;
	        if (type === 'error' && opts.throws !== false && !et.length) {
	          throw args.length === 1 ? args[0] : args;
	        }
	        et.forEach(function emitter(listen) {
	          if (opts.async) {
	            debounce(listen, args, ctx);
	          } else {
	            listen.apply(ctx, args);
	          }
	          if (listen._once) {
	            thing.off(type, listen);
	          }
	        });
	        return thing;
	      };
	    };
	    return thing;
	  };
	});

	var emitter$1 = interopDefault(emitter);

var require$$2 = Object.freeze({
	  default: emitter$1
	});

	var index = createCommonjsModule(function (module) {
	  var NativeCustomEvent = commonjsGlobal.CustomEvent;

	  function useNative() {
	    try {
	      var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
	      return 'cat' === p.type && 'bar' === p.detail.foo;
	    } catch (e) {}
	    return false;
	  }

	  /**
	   * Cross-browser `CustomEvent` constructor.
	   *
	   * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
	   *
	   * @public
	   */

	  module.exports = useNative() ? NativeCustomEvent :

	  // IE >= 9
	  'function' === typeof document.createEvent ? function CustomEvent(type, params) {
	    var e = document.createEvent('CustomEvent');
	    if (params) {
	      e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
	    } else {
	      e.initCustomEvent(type, false, false, void 0);
	    }
	    return e;
	  } :

	  // IE <= 8
	  function CustomEvent(type, params) {
	    var e = document.createEventObject();
	    e.type = type;
	    if (params) {
	      e.bubbles = Boolean(params.bubbles);
	      e.cancelable = Boolean(params.cancelable);
	      e.detail = params.detail;
	    } else {
	      e.bubbles = false;
	      e.cancelable = false;
	      e.detail = void 0;
	    }
	    return e;
	  };
	});

	var index$1 = interopDefault(index);

var require$$1$2 = Object.freeze({
	  default: index$1
	});

	var eventmap = createCommonjsModule(function (module) {
	  'use strict';

	  var eventmap = [];
	  var eventname = '';
	  var ron = /^on/;

	  for (eventname in commonjsGlobal) {
	    if (ron.test(eventname)) {
	      eventmap.push(eventname.slice(2));
	    }
	  }

	  module.exports = eventmap;
	});

	var eventmap$1 = interopDefault(eventmap);

var require$$0$2 = Object.freeze({
	  default: eventmap$1
	});

	var crossvent = createCommonjsModule(function (module) {
	  'use strict';

	  var customEvent = interopDefault(require$$1$2);
	  var eventmap = interopDefault(require$$0$2);
	  var doc = commonjsGlobal.document;
	  var addEvent = addEventEasy;
	  var removeEvent = removeEventEasy;
	  var hardCache = [];

	  if (!commonjsGlobal.addEventListener) {
	    addEvent = addEventHard;
	    removeEvent = removeEventHard;
	  }

	  module.exports = {
	    add: addEvent,
	    remove: removeEvent,
	    fabricate: fabricateEvent
	  };

	  function addEventEasy(el, type, fn, capturing) {
	    return el.addEventListener(type, fn, capturing);
	  }

	  function addEventHard(el, type, fn) {
	    return el.attachEvent('on' + type, wrap(el, type, fn));
	  }

	  function removeEventEasy(el, type, fn, capturing) {
	    return el.removeEventListener(type, fn, capturing);
	  }

	  function removeEventHard(el, type, fn) {
	    var listener = unwrap(el, type, fn);
	    if (listener) {
	      return el.detachEvent('on' + type, listener);
	    }
	  }

	  function fabricateEvent(el, type, model) {
	    var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
	    if (el.dispatchEvent) {
	      el.dispatchEvent(e);
	    } else {
	      el.fireEvent('on' + type, e);
	    }
	    function makeClassicEvent() {
	      var e;
	      if (doc.createEvent) {
	        e = doc.createEvent('Event');
	        e.initEvent(type, true, true);
	      } else if (doc.createEventObject) {
	        e = doc.createEventObject();
	      }
	      return e;
	    }
	    function makeCustomEvent() {
	      return new customEvent(type, { detail: model });
	    }
	  }

	  function wrapperFactory(el, type, fn) {
	    return function wrapper(originalEvent) {
	      var e = originalEvent || commonjsGlobal.event;
	      e.target = e.target || e.srcElement;
	      e.preventDefault = e.preventDefault || function preventDefault() {
	        e.returnValue = false;
	      };
	      e.stopPropagation = e.stopPropagation || function stopPropagation() {
	        e.cancelBubble = true;
	      };
	      e.which = e.which || e.keyCode;
	      fn.call(el, e);
	    };
	  }

	  function wrap(el, type, fn) {
	    var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
	    hardCache.push({
	      wrapper: wrapper,
	      element: el,
	      type: type,
	      fn: fn
	    });
	    return wrapper;
	  }

	  function unwrap(el, type, fn) {
	    var i = find(el, type, fn);
	    if (i) {
	      var wrapper = hardCache[i].wrapper;
	      hardCache.splice(i, 1); // free up a tad of memory
	      return wrapper;
	    }
	  }

	  function find(el, type, fn) {
	    var i, item;
	    for (i = 0; i < hardCache.length; i++) {
	      item = hardCache[i];
	      if (item.element === el && item.type === type && item.fn === fn) {
	        return i;
	      }
	    }
	  }
	});

	var crossvent$1 = interopDefault(crossvent);
	var add = crossvent.add;
	var remove = crossvent.remove;
	var fabricate = crossvent.fabricate;

var require$$1$1 = Object.freeze({
	  default: crossvent$1,
	  add: add,
	  remove: remove,
	  fabricate: fabricate
	});

	var classes = createCommonjsModule(function (module) {
	  'use strict';

	  var cache = {};
	  var start = '(?:^|\\s)';
	  var end = '(?:\\s|$)';

	  function lookupClass(className) {
	    var cached = cache[className];
	    if (cached) {
	      cached.lastIndex = 0;
	    } else {
	      cache[className] = cached = new RegExp(start + className + end, 'g');
	    }
	    return cached;
	  }

	  function addClass(el, className) {
	    var current = el.className;
	    if (!current.length) {
	      el.className = className;
	    } else if (!lookupClass(className).test(current)) {
	      el.className += ' ' + className;
	    }
	  }

	  function rmClass(el, className) {
	    el.className = el.className.replace(lookupClass(className), ' ').trim();
	  }

	  module.exports = {
	    add: addClass,
	    rm: rmClass
	  };
	});

	var classes$1 = interopDefault(classes);
	var add$1 = classes.add;
	var rm = classes.rm;

var require$$0$3 = Object.freeze({
	  default: classes$1,
	  add: add$1,
	  rm: rm
	});

	var dragula = createCommonjsModule(function (module) {
	  'use strict';

	  var emitter = interopDefault(require$$2);
	  var crossvent = interopDefault(require$$1$1);
	  var classes = interopDefault(require$$0$3);
	  var doc = document;
	  var documentElement = doc.documentElement;

	  function dragula(initialContainers, options) {
	    var len = arguments.length;
	    if (len === 1 && Array.isArray(initialContainers) === false) {
	      options = initialContainers;
	      initialContainers = [];
	    }
	    var _mirror; // mirror image
	    var _source; // source container
	    var _item; // item being dragged
	    var _offsetX; // reference x
	    var _offsetY; // reference y
	    var _moveX; // reference move x
	    var _moveY; // reference move y
	    var _initialSibling; // reference sibling when grabbed
	    var _currentSibling; // reference sibling now
	    var _copy; // item used for copying
	    var _renderTimer; // timer for setTimeout renderMirrorImage
	    var _lastDropTarget = null; // last container item was over
	    var _grabbed; // holds mousedown context until first mousemove

	    var o = options || {};
	    if (o.moves === void 0) {
	      o.moves = always;
	    }
	    if (o.accepts === void 0) {
	      o.accepts = always;
	    }
	    if (o.invalid === void 0) {
	      o.invalid = invalidTarget;
	    }
	    if (o.containers === void 0) {
	      o.containers = initialContainers || [];
	    }
	    if (o.isContainer === void 0) {
	      o.isContainer = never;
	    }
	    if (o.copy === void 0) {
	      o.copy = false;
	    }
	    if (o.copySortSource === void 0) {
	      o.copySortSource = false;
	    }
	    if (o.revertOnSpill === void 0) {
	      o.revertOnSpill = false;
	    }
	    if (o.removeOnSpill === void 0) {
	      o.removeOnSpill = false;
	    }
	    if (o.direction === void 0) {
	      o.direction = 'vertical';
	    }
	    if (o.ignoreInputTextSelection === void 0) {
	      o.ignoreInputTextSelection = true;
	    }
	    if (o.mirrorContainer === void 0) {
	      o.mirrorContainer = doc.body;
	    }

	    var drake = emitter({
	      containers: o.containers,
	      start: manualStart,
	      end: end,
	      cancel: cancel,
	      remove: remove,
	      destroy: destroy,
	      canMove: canMove,
	      dragging: false
	    });

	    if (o.removeOnSpill === true) {
	      drake.on('over', spillOver).on('out', spillOut);
	    }

	    events();

	    return drake;

	    function isContainer(el) {
	      return drake.containers.indexOf(el) !== -1 || o.isContainer(el);
	    }

	    function events(remove) {
	      var op = remove ? 'remove' : 'add';
	      touchy(documentElement, op, 'mousedown', grab);
	      touchy(documentElement, op, 'mouseup', release);
	    }

	    function eventualMovements(remove) {
	      var op = remove ? 'remove' : 'add';
	      touchy(documentElement, op, 'mousemove', startBecauseMouseMoved);
	    }

	    function movements(remove) {
	      var op = remove ? 'remove' : 'add';
	      crossvent[op](documentElement, 'selectstart', preventGrabbed); // IE8
	      crossvent[op](documentElement, 'click', preventGrabbed);
	    }

	    function destroy() {
	      events(true);
	      release({});
	    }

	    function preventGrabbed(e) {
	      if (_grabbed) {
	        e.preventDefault();
	      }
	    }

	    function grab(e) {
	      _moveX = e.clientX;
	      _moveY = e.clientY;

	      var ignore = whichMouseButton(e) !== 1 || e.metaKey || e.ctrlKey;
	      if (ignore) {
	        return; // we only care about honest-to-god left clicks and touch events
	      }
	      var item = e.target;
	      var context = canStart(item);
	      if (!context) {
	        return;
	      }
	      _grabbed = context;
	      eventualMovements();
	      if (e.type === 'mousedown') {
	        if (isInput(item)) {
	          // see also: https://github.com/bevacqua/dragula/issues/208
	          item.focus(); // fixes https://github.com/bevacqua/dragula/issues/176
	        } else {
	          e.preventDefault(); // fixes https://github.com/bevacqua/dragula/issues/155
	        }
	      }
	    }

	    function startBecauseMouseMoved(e) {
	      if (!_grabbed) {
	        return;
	      }
	      if (whichMouseButton(e) === 0) {
	        release({});
	        return; // when text is selected on an input and then dragged, mouseup doesn't fire. this is our only hope
	      }
	      // truthy check fixes #239, equality fixes #207
	      if (e.clientX !== void 0 && e.clientX === _moveX && e.clientY !== void 0 && e.clientY === _moveY) {
	        return;
	      }
	      if (o.ignoreInputTextSelection) {
	        var clientX = getCoord('clientX', e);
	        var clientY = getCoord('clientY', e);
	        var elementBehindCursor = doc.elementFromPoint(clientX, clientY);
	        if (isInput(elementBehindCursor)) {
	          return;
	        }
	      }

	      var grabbed = _grabbed; // call to end() unsets _grabbed
	      eventualMovements(true);
	      movements();
	      end();
	      start(grabbed);

	      var offset = getOffset(_item);
	      _offsetX = getCoord('pageX', e) - offset.left;
	      _offsetY = getCoord('pageY', e) - offset.top;

	      classes.add(_copy || _item, 'gu-transit');
	      renderMirrorImage();
	      drag(e);
	    }

	    function canStart(item) {
	      if (drake.dragging && _mirror) {
	        return;
	      }
	      if (isContainer(item)) {
	        return; // don't drag container itself
	      }
	      var handle = item;
	      while (getParent(item) && isContainer(getParent(item)) === false) {
	        if (o.invalid(item, handle)) {
	          return;
	        }
	        item = getParent(item); // drag target should be a top element
	        if (!item) {
	          return;
	        }
	      }
	      var source = getParent(item);
	      if (!source) {
	        return;
	      }
	      if (o.invalid(item, handle)) {
	        return;
	      }

	      var movable = o.moves(item, source, handle, nextEl(item));
	      if (!movable) {
	        return;
	      }

	      return {
	        item: item,
	        source: source
	      };
	    }

	    function canMove(item) {
	      return !!canStart(item);
	    }

	    function manualStart(item) {
	      var context = canStart(item);
	      if (context) {
	        start(context);
	      }
	    }

	    function start(context) {
	      if (isCopy(context.item, context.source)) {
	        _copy = context.item.cloneNode(true);
	        drake.emit('cloned', _copy, context.item, 'copy');
	      }

	      _source = context.source;
	      _item = context.item;
	      _initialSibling = _currentSibling = nextEl(context.item);

	      drake.dragging = true;
	      drake.emit('drag', _item, _source);
	    }

	    function invalidTarget() {
	      return false;
	    }

	    function end() {
	      if (!drake.dragging) {
	        return;
	      }
	      var item = _copy || _item;
	      drop(item, getParent(item));
	    }

	    function ungrab() {
	      _grabbed = false;
	      eventualMovements(true);
	      movements(true);
	    }

	    function release(e) {
	      ungrab();

	      if (!drake.dragging) {
	        return;
	      }
	      var item = _copy || _item;
	      var clientX = getCoord('clientX', e);
	      var clientY = getCoord('clientY', e);
	      var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
	      var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
	      if (dropTarget && (_copy && o.copySortSource || !_copy || dropTarget !== _source)) {
	        drop(item, dropTarget);
	      } else if (o.removeOnSpill) {
	        remove();
	      } else {
	        cancel();
	      }
	    }

	    function drop(item, target) {
	      var parent = getParent(item);
	      if (_copy && o.copySortSource && target === _source) {
	        parent.removeChild(_item);
	      }
	      if (isInitialPlacement(target)) {
	        drake.emit('cancel', item, _source, _source);
	      } else {
	        drake.emit('drop', item, target, _source, _currentSibling);
	      }
	      cleanup();
	    }

	    function remove() {
	      if (!drake.dragging) {
	        return;
	      }
	      var item = _copy || _item;
	      var parent = getParent(item);
	      if (parent) {
	        parent.removeChild(item);
	      }
	      drake.emit(_copy ? 'cancel' : 'remove', item, parent, _source);
	      cleanup();
	    }

	    function cancel(revert) {
	      if (!drake.dragging) {
	        return;
	      }
	      var reverts = arguments.length > 0 ? revert : o.revertOnSpill;
	      var item = _copy || _item;
	      var parent = getParent(item);
	      var initial = isInitialPlacement(parent);
	      if (initial === false && reverts) {
	        if (_copy) {
	          if (parent) {
	            parent.removeChild(_copy);
	          }
	        } else {
	          _source.insertBefore(item, _initialSibling);
	        }
	      }
	      if (initial || reverts) {
	        drake.emit('cancel', item, _source, _source);
	      } else {
	        drake.emit('drop', item, parent, _source, _currentSibling);
	      }
	      cleanup();
	    }

	    function cleanup() {
	      var item = _copy || _item;
	      ungrab();
	      removeMirrorImage();
	      if (item) {
	        classes.rm(item, 'gu-transit');
	      }
	      if (_renderTimer) {
	        clearTimeout(_renderTimer);
	      }
	      drake.dragging = false;
	      if (_lastDropTarget) {
	        drake.emit('out', item, _lastDropTarget, _source);
	      }
	      drake.emit('dragend', item);
	      _source = _item = _copy = _initialSibling = _currentSibling = _renderTimer = _lastDropTarget = null;
	    }

	    function isInitialPlacement(target, s) {
	      var sibling;
	      if (s !== void 0) {
	        sibling = s;
	      } else if (_mirror) {
	        sibling = _currentSibling;
	      } else {
	        sibling = nextEl(_copy || _item);
	      }
	      return target === _source && sibling === _initialSibling;
	    }

	    function findDropTarget(elementBehindCursor, clientX, clientY) {
	      var target = elementBehindCursor;
	      while (target && !accepted()) {
	        target = getParent(target);
	      }
	      return target;

	      function accepted() {
	        var droppable = isContainer(target);
	        if (droppable === false) {
	          return false;
	        }

	        var immediate = getImmediateChild(target, elementBehindCursor);
	        var reference = getReference(target, immediate, clientX, clientY);
	        var initial = isInitialPlacement(target, reference);
	        if (initial) {
	          return true; // should always be able to drop it right back where it was
	        }
	        return o.accepts(_item, target, _source, reference);
	      }
	    }

	    function drag(e) {
	      if (!_mirror) {
	        return;
	      }
	      e.preventDefault();

	      var clientX = getCoord('clientX', e);
	      var clientY = getCoord('clientY', e);
	      var x = clientX - _offsetX;
	      var y = clientY - _offsetY;

	      _mirror.style.left = x + 'px';
	      _mirror.style.top = y + 'px';

	      var item = _copy || _item;
	      var elementBehindCursor = getElementBehindPoint(_mirror, clientX, clientY);
	      var dropTarget = findDropTarget(elementBehindCursor, clientX, clientY);
	      var changed = dropTarget !== null && dropTarget !== _lastDropTarget;
	      if (changed || dropTarget === null) {
	        out();
	        _lastDropTarget = dropTarget;
	        over();
	      }
	      var parent = getParent(item);
	      if (dropTarget === _source && _copy && !o.copySortSource) {
	        if (parent) {
	          parent.removeChild(item);
	        }
	        return;
	      }
	      var reference;
	      var immediate = getImmediateChild(dropTarget, elementBehindCursor);
	      if (immediate !== null) {
	        reference = getReference(dropTarget, immediate, clientX, clientY);
	      } else if (o.revertOnSpill === true && !_copy) {
	        reference = _initialSibling;
	        dropTarget = _source;
	      } else {
	        if (_copy && parent) {
	          parent.removeChild(item);
	        }
	        return;
	      }
	      if (reference === null && changed || reference !== item && reference !== nextEl(item)) {
	        _currentSibling = reference;
	        dropTarget.insertBefore(item, reference);
	        drake.emit('shadow', item, dropTarget, _source);
	      }
	      function moved(type) {
	        drake.emit(type, item, _lastDropTarget, _source);
	      }
	      function over() {
	        if (changed) {
	          moved('over');
	        }
	      }
	      function out() {
	        if (_lastDropTarget) {
	          moved('out');
	        }
	      }
	    }

	    function spillOver(el) {
	      classes.rm(el, 'gu-hide');
	    }

	    function spillOut(el) {
	      if (drake.dragging) {
	        classes.add(el, 'gu-hide');
	      }
	    }

	    function renderMirrorImage() {
	      if (_mirror) {
	        return;
	      }
	      var rect = _item.getBoundingClientRect();
	      _mirror = _item.cloneNode(true);
	      _mirror.style.width = getRectWidth(rect) + 'px';
	      _mirror.style.height = getRectHeight(rect) + 'px';
	      classes.rm(_mirror, 'gu-transit');
	      classes.add(_mirror, 'gu-mirror');
	      o.mirrorContainer.appendChild(_mirror);
	      touchy(documentElement, 'add', 'mousemove', drag);
	      classes.add(o.mirrorContainer, 'gu-unselectable');
	      drake.emit('cloned', _mirror, _item, 'mirror');
	    }

	    function removeMirrorImage() {
	      if (_mirror) {
	        classes.rm(o.mirrorContainer, 'gu-unselectable');
	        touchy(documentElement, 'remove', 'mousemove', drag);
	        getParent(_mirror).removeChild(_mirror);
	        _mirror = null;
	      }
	    }

	    function getImmediateChild(dropTarget, target) {
	      var immediate = target;
	      while (immediate !== dropTarget && getParent(immediate) !== dropTarget) {
	        immediate = getParent(immediate);
	      }
	      if (immediate === documentElement) {
	        return null;
	      }
	      return immediate;
	    }

	    function getReference(dropTarget, target, x, y) {
	      var horizontal = o.direction === 'horizontal';
	      var reference = target !== dropTarget ? inside() : outside();
	      return reference;

	      function outside() {
	        // slower, but able to figure out any position
	        var len = dropTarget.children.length;
	        var i;
	        var el;
	        var rect;
	        for (i = 0; i < len; i++) {
	          el = dropTarget.children[i];
	          rect = el.getBoundingClientRect();
	          if (horizontal && rect.left + rect.width / 2 > x) {
	            return el;
	          }
	          if (!horizontal && rect.top + rect.height / 2 > y) {
	            return el;
	          }
	        }
	        return null;
	      }

	      function inside() {
	        // faster, but only available if dropped inside a child element
	        var rect = target.getBoundingClientRect();
	        if (horizontal) {
	          return resolve(x > rect.left + getRectWidth(rect) / 2);
	        }
	        return resolve(y > rect.top + getRectHeight(rect) / 2);
	      }

	      function resolve(after) {
	        return after ? nextEl(target) : target;
	      }
	    }

	    function isCopy(item, container) {
	      return typeof o.copy === 'boolean' ? o.copy : o.copy(item, container);
	    }
	  }

	  function touchy(el, op, type, fn) {
	    var touch = {
	      mouseup: 'touchend',
	      mousedown: 'touchstart',
	      mousemove: 'touchmove'
	    };
	    var pointers = {
	      mouseup: 'pointerup',
	      mousedown: 'pointerdown',
	      mousemove: 'pointermove'
	    };
	    var microsoft = {
	      mouseup: 'MSPointerUp',
	      mousedown: 'MSPointerDown',
	      mousemove: 'MSPointerMove'
	    };
	    if (commonjsGlobal.navigator.pointerEnabled) {
	      crossvent[op](el, pointers[type], fn);
	    } else if (commonjsGlobal.navigator.msPointerEnabled) {
	      crossvent[op](el, microsoft[type], fn);
	    } else {
	      crossvent[op](el, touch[type], fn);
	      crossvent[op](el, type, fn);
	    }
	  }

	  function whichMouseButton(e) {
	    if (e.touches !== void 0) {
	      return e.touches.length;
	    }
	    if (e.which !== void 0 && e.which !== 0) {
	      return e.which;
	    } // see https://github.com/bevacqua/dragula/issues/261
	    if (e.buttons !== void 0) {
	      return e.buttons;
	    }
	    var button = e.button;
	    if (button !== void 0) {
	      // see https://github.com/jquery/jquery/blob/99e8ff1baa7ae341e94bb89c3e84570c7c3ad9ea/src/event.js#L573-L575
	      return button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
	    }
	  }

	  function getOffset(el) {
	    var rect = el.getBoundingClientRect();
	    return {
	      left: rect.left + getScroll('scrollLeft', 'pageXOffset'),
	      top: rect.top + getScroll('scrollTop', 'pageYOffset')
	    };
	  }

	  function getScroll(scrollProp, offsetProp) {
	    if (typeof commonjsGlobal[offsetProp] !== 'undefined') {
	      return commonjsGlobal[offsetProp];
	    }
	    if (documentElement.clientHeight) {
	      return documentElement[scrollProp];
	    }
	    return doc.body[scrollProp];
	  }

	  function getElementBehindPoint(point, x, y) {
	    var p = point || {};
	    var state = p.className;
	    var el;
	    p.className += ' gu-hide';
	    el = doc.elementFromPoint(x, y);
	    p.className = state;
	    return el;
	  }

	  function never() {
	    return false;
	  }
	  function always() {
	    return true;
	  }
	  function getRectWidth(rect) {
	    return rect.width || rect.right - rect.left;
	  }
	  function getRectHeight(rect) {
	    return rect.height || rect.bottom - rect.top;
	  }
	  function getParent(el) {
	    return el.parentNode === doc ? null : el.parentNode;
	  }
	  function isInput(el) {
	    return el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || isEditable(el);
	  }
	  function isEditable(el) {
	    if (!el) {
	      return false;
	    } // no parents were editable
	    if (el.contentEditable === 'false') {
	      return false;
	    } // stop the lookup
	    if (el.contentEditable === 'true') {
	      return true;
	    } // found a contentEditable element in the chain
	    return isEditable(getParent(el)); // contentEditable is set to 'inherit'
	  }

	  function nextEl(el) {
	    return el.nextElementSibling || manually();
	    function manually() {
	      var sibling = el;
	      do {
	        sibling = sibling.nextSibling;
	      } while (sibling && sibling.nodeType !== 1);
	      return sibling;
	    }
	  }

	  function getEventHost(e) {
	    // on touchend event, we have to use `e.changedTouches`
	    // see http://stackoverflow.com/questions/7192563/touchend-event-properties
	    // see https://github.com/bevacqua/dragula/issues/34
	    if (e.targetTouches && e.targetTouches.length) {
	      return e.targetTouches[0];
	    }
	    if (e.changedTouches && e.changedTouches.length) {
	      return e.changedTouches[0];
	    }
	    return e;
	  }

	  function getCoord(coord, e) {
	    var host = getEventHost(e);
	    var missMap = {
	      pageX: 'clientX', // IE8
	      pageY: 'clientY' // IE8
	    };
	    if (coord in missMap && !(coord in host) && missMap[coord] in host) {
	      coord = missMap[coord];
	    }
	    return host[coord];
	  }

	  module.exports = dragula;
	});

	var dragula$1 = interopDefault(dragula);

	var classCallCheck = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

	var createClass = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      Object.defineProperty(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

	var inherits = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
	};

	var possibleConstructorReturn = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && (typeof call === "object" || typeof call === "function") ? call : self;
	};

	var raf = window.requestAnimationFrame;

	function raffy(fn) {
	  raf(function () {
	    raf(fn);
	  });
	}

	function winTimeout(fn) {
	  window.setTimeout(fn, 50);
	}

	var waitForTransition = raf ? raffy : winTimeout;

	function isObject(obj) {
	  return obj === Object(obj);
	}

	var DragHandler = function () {
	  function DragHandler(_ref) {
	    var ctx = _ref.ctx,
	        name = _ref.name,
	        drake = _ref.drake,
	        options = _ref.options;
	    classCallCheck(this, DragHandler);

	    this.dragElm = null;
	    this.dragIndex = null;
	    this.dropIndex = null;
	    this.sourceModel = null;
	    this.logging = ctx.logging;
	    this.ctx = ctx;
	    this.serviceName = ctx.name;
	    this.modelManager = ctx.modelManager;
	    this.drake = drake;
	    this.name = name;
	    this.eventBus = ctx.eventBus;
	    this.findModelForContainer = ctx.findModelForContainer.bind(ctx);
	    this.domIndexOf = ctx.domIndexOf.bind(ctx);
	  }

	  createClass(DragHandler, [{
	    key: 'log',
	    value: function log(event) {
	      var _console;

	      if (!this.shouldLog) return;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      (_console = console).log.apply(_console, [this.clazzName + ' [' + this.name + '] :', event].concat(args));
	    }

	    /**
	     * Remove model at drag index
	     */

	  }, {
	    key: 'removeModel',
	    value: function removeModel() {
	      this.log('removeModel', {
	        sourceModel: this.sourceModel,
	        dragIndex: this.dragIndex
	      });
	      this.sourceModel.removeAt(this.dragIndex);
	    }

	    /**
	     * Drop model on same container
	     * Move model from dropIndex to dragIndex
	     */

	  }, {
	    key: 'dropModelSame',
	    value: function dropModelSame() {
	      this.log('dropModelSame', {
	        sourceModel: this.sourceModel,
	        dragIndex: this.dragIndex,
	        dropIndex: this.dropIndex
	      });

	      this.sourceModel.move({
	        dropIndex: this.dropIndex,
	        dragIndex: this.dragIndex
	      });
	    }

	    /**
	     * Insert model on targetModel
	     * @param {*} targetModel
	     * @param {*} dropElmModel
	     * @param {*} elements
	     */

	  }, {
	    key: 'insertModel',
	    value: function insertModel(targetModel, dropElmModel, elements) {
	      this.log('insertModel', {
	        targetModel: targetModel,
	        dropIndex: this.dropIndex,
	        dropElmModel: dropElmModel,
	        elements: elements
	      });

	      targetModel.insertAt(this.dropIndex, dropElmModel);

	      this.emit('insertAt', {
	        elements: elements,
	        targetModel: targetModel,
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
	      });
	    }

	    /**
	     * If not copy, we remove model from source model after a nice transition
	     */

	  }, {
	    key: 'notCopy',
	    value: function notCopy() {
	      var _this = this;

	      waitForTransition(function () {
	        _this.sourceModel.removeAt(_this.dragIndex);
	      });
	    }

	    /**
	     * Cancel drop
	     * @param {*} target
	     */

	  }, {
	    key: 'cancelDrop',
	    value: function cancelDrop(target) {
	      this.log('No targetModel could be found for target:', {
	        target: target
	      });
	      this.log('in drake:', {
	        drake: this.drake
	      });
	      this.drake.cancel(true);
	    }

	    /**
	     * Handle drop model from source to target
	     * @param {*} dropElm
	     * @param {*} target
	     * @param {*} source
	     */

	  }, {
	    key: 'dropModelTarget',
	    value: function dropModelTarget(dropElm, target, source) {
	      this.log('dropModelTarget', {
	        dropElm: dropElm,
	        target: target,
	        source: source
	      });
	      var notCopy = this.dragElm === dropElm;
	      var targetModel = this.getModel(target);
	      var dropElmModel = notCopy ? this.dropElmModel() : this.jsonDropElmModel();

	      if (notCopy) {
	        this.notCopy();
	      }

	      if (!targetModel) {
	        return this.cancelDrop(target);
	      }

	      var elements = {
	        drop: dropElm,
	        target: target,
	        source: source
	      };

	      this.insertModel(targetModel, dropElmModel, elements);
	    }
	  }, {
	    key: 'dropModel',
	    value: function dropModel(dropElm, target, source) {
	      this.log('dropModel', {
	        dropElm: dropElm,
	        target: target,
	        source: source
	      });
	      target === source ? this.dropModelSame() : this.dropModelTarget(dropElm, target, source);
	    }
	  }, {
	    key: 'emit',
	    value: function emit(eventName) {
	      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      this.log('emit', {
	        eventName: eventName,
	        opts: opts
	      });
	      opts.sourceModel = this.sourceModel;
	      opts.name = this.name;
	      this.eventBus.$emit(eventName, opts);

	      this.log('emit service', {
	        serviceEventName: serviceEventName,
	        eventName: eventName,
	        opts: opts
	      });
	      var serviceEventName = this.serviceName + ':' + eventName;
	      this.eventBus.$emit(serviceEventName, opts);
	    }

	    /**
	     * Get model from location in
	     * @param {*} location
	     */

	  }, {
	    key: 'getModel',
	    value: function getModel(location) {
	      var model = this.findModelForContainer(location, this.drake);
	      this.log('getModel', {
	        location: location,
	        model: model
	      });

	      return this.modelManager.createFor({
	        name: this.name,
	        drake: this.drake,
	        logging: this.logging,
	        model: model
	      });
	    }

	    /**
	     * Remov element from container in source
	     * @param {*} el
	     * @param {*} container
	     * @param {*} source
	     */

	  }, {
	    key: 'remove',
	    value: function remove(el, container, source) {
	      this.log('remove', {
	        el: el,
	        container: container,
	        source: source
	      });
	      if (!this.drake.models) {
	        this.log('Warning: Can NOT remove it. Must have models:', this.drake.models);
	        return;
	      }

	      this.sourceModel = this.getModel(source);
	      this.removeModel();
	      this.drake.cancel(true);

	      this.emit('removeModel', {
	        el: el,
	        source: source,
	        dragIndex: this.dragIndex
	      });
	    }

	    /**
	     * Handle drag element from source
	     * @param {*} el
	     * @param {*} source
	     */

	  }, {
	    key: 'drag',
	    value: function drag(el, source) {
	      this.log('drag', {
	        el: el,
	        source: source
	      });
	      this.dragElm = el;
	      this.dragIndex = this.domIndexOf(el, source);
	    }

	    /**
	     * Handle drop element from source to target
	     * @param {*} dropEl
	     * @param {*} target
	     * @param {*} source
	     */

	  }, {
	    key: 'drop',
	    value: function drop(dropEl, target, source) {
	      this.log('drop', {
	        dropEl: dropEl,
	        target: target,
	        source: source
	      });
	      if (!this.drake.models && !target) {
	        this.log('Warning: Can NOT drop it. Must have either models:', this.drake.models, ' or target:', target);
	        return;
	      }
	      this.dropIndex = this.domIndexOf(dropEl, target);
	      this.sourceModel = this.getModel(source);
	      this.dropModel(dropEl, target, source);

	      this.emit('dropModel', {
	        target: target,
	        source: source,
	        el: dropEl,
	        dragIndex: this.dragIndex,
	        dropIndex: this.dropIndex
	      });
	    }
	  }, {
	    key: 'dropElmModel',
	    value: function dropElmModel() {
	      return this.sourceModel.at(this.dragIndex);
	    }
	  }, {
	    key: 'jsonDropElmModel',
	    value: function jsonDropElmModel() {
	      var model = this.sourceModel.at(this.dragIndex);
	      var stringable = model ? model.model || model.stringable : model;
	      var md = stringable || model;
	      if (!isObject(md)) {
	        this.log('jsonDropElmModel', 'invalid element model, must be some sort of Object', stringable, model);
	      }
	      try {
	        var jsonStr = JSON.stringify(stringable || model);
	        return JSON.parse(jsonStr);
	      } catch (e) {
	        this.log('jsonDropElmModel', 'JSON stringify/parse error', e);
	      }
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      return this.constructor.name || 'DragHandler';
	    }
	  }, {
	    key: 'shouldLog',
	    get: function get() {
	      return this.logging && this.logging.dragHandler;
	    }
	  }]);
	  return DragHandler;
	}();

	var BaseModelManager = function () {
	  function BaseModelManager() {
	    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    classCallCheck(this, BaseModelManager);

	    if (Array.isArray(opts)) {
	      opts = {
	        model: opts
	      };
	    }
	    opts.drake = opts.drake || {};
	    this.opts = opts;
	    this.copy = opts.copy || opts.drake.copy;
	    this.name = opts.name;
	    this.drake = opts.drake;
	    this.logging = opts.logging;
	    this.logging = opts.logging;
	    this.modelRef = opts.model || [];
	  }

	  createClass(BaseModelManager, [{
	    key: 'log',
	    value: function log(event) {
	      var _console;

	      if (!this.shouldLog) return;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      (_console = console).log.apply(_console, [this.clazzName + ' [' + this.name + '] :', event].concat(args));
	    }
	  }, {
	    key: 'notYet',
	    value: function notYet(name) {
	      this.log(name, 'not yet implemented');
	    }
	  }, {
	    key: 'undo',
	    value: function undo() {
	      this.notYet('undo');
	    }
	  }, {
	    key: 'redo',
	    value: function redo() {
	      this.notYet('redo');
	    }
	  }, {
	    key: 'at',
	    value: function at(index) {
	      this.notYet('at');
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.notYet('clear');
	    }
	  }, {
	    key: 'createModel',
	    value: function createModel(model) {
	      this.notYet('createModel');
	    }
	  }, {
	    key: 'createFor',
	    value: function createFor() {
	      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      this.notYet('createFor');
	    }
	  }, {
	    key: 'removeAt',
	    value: function removeAt(index) {
	      this.notYet('removeAt');
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, dropModel) {
	      this.notYet('removeAt');
	    }
	  }, {
	    key: 'move',
	    value: function move(_ref) {
	      var dragIndex = _ref.dragIndex,
	          dropIndex = _ref.dropIndex;

	      this.notYet('move');
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      return this.constructor.name || 'BaseModelManager';
	    }
	  }, {
	    key: 'shouldLog',
	    get: function get() {
	      return this.logging && this.logging.modelManager;
	    }
	  }]);
	  return BaseModelManager;
	}();

	var ModelManager = function (_BaseModelManager) {
	  inherits(ModelManager, _BaseModelManager);

	  function ModelManager() {
	    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    classCallCheck(this, ModelManager);

	    var _this = possibleConstructorReturn(this, (ModelManager.__proto__ || Object.getPrototypeOf(ModelManager)).call(this, opts));

	    _this.model = _this.createModel(_this.modelRef);
	    _this.log('CREATE', opts);
	    return _this;
	  }

	  createClass(ModelManager, [{
	    key: 'log',
	    value: function log(event) {
	      var _console;

	      if (!this.shouldLog) return;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      (_console = console).log.apply(_console, [this.clazzName + ' [' + this.name + '] :', event].concat(args));
	    }
	  }, {
	    key: 'undo',
	    value: function undo() {
	      this.log('undo', 'not yet implemented');
	    }
	  }, {
	    key: 'redo',
	    value: function redo() {
	      this.log('redo', 'not yet implemented');
	    }
	  }, {
	    key: 'at',
	    value: function at(index) {
	      return this.model.get ? this.model.get(index) : this.model[index];
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.model = this.createModel();
	    }
	  }, {
	    key: 'createModel',
	    value: function createModel(model) {
	      return this.model || model || [];
	    }
	  }, {
	    key: 'createFor',
	    value: function createFor() {
	      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      return new ModelManager(opts);
	    }
	  }, {
	    key: 'removeAt',
	    value: function removeAt(index) {
	      if (this.copy) return;
	      this.log('removeAt', {
	        model: this.model,
	        index: index
	      });
	      var splicedModel = this.model.splice(index, 1);
	      var removedModel = this.model;

	      this.log({
	        splicedModel: splicedModel,
	        removedModel: removedModel
	      });
	      return splicedModel;
	    }
	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, insertModel) {
	      this.log('insertAt', {
	        model: this.model,
	        index: index,
	        insertModel: insertModel
	      });
	      // according to Vue docs, Vue wraps splice method to mutate array in place and update view
	      var splicedModel = this.model.splice(index, 0, insertModel);
	      var modelAfterInsert = this.model;

	      this.log('insertAt', {
	        splicedModel: splicedModel,
	        modelAfterInsert: modelAfterInsert
	      });
	      return modelAfterInsert;
	    }
	  }, {
	    key: 'move',
	    value: function move(_ref) {
	      var dragIndex = _ref.dragIndex,
	          dropIndex = _ref.dropIndex;

	      if (this.copy) return;
	      this.log('move', {
	        model: this.model,
	        dragIndex: dragIndex,
	        dropIndex: dropIndex
	      });
	      var splicedRemainder = this.model.splice(dragIndex, 1);
	      var remainder = splicedRemainder[0];

	      var modelAfterRemove = this.model.splice(dropIndex, 0, remainder);
	      var movedModel = this.model;

	      this.log('move', {
	        splicedRemainder: splicedRemainder,
	        modelAfterRemove: modelAfterRemove,
	        movedModel: movedModel
	      });
	      return modelAfterRemove;
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      return this.constructor.name || 'ModelManager';
	    }
	  }, {
	    key: 'shouldLog',
	    get: function get() {
	      return this.logging && this.logging.modelManager;
	    }
	  }]);
	  return ModelManager;
	}(BaseModelManager);

	if (!dragula$1) {
	  throw new Error('[vue-dragula] cannot locate dragula.');
	}

	function createDragHandler(_ref) {
	  var ctx = _ref.ctx,
	      name = _ref.name,
	      drake = _ref.drake;

	  return new DragHandler({
	    ctx: ctx,
	    name: name,
	    drake: drake
	  });
	}

	function createModelManager(opts) {
	  return new ModelManager(opts);
	}

	var DragulaService = function () {
	  function DragulaService() {
	    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    classCallCheck(this, DragulaService);
	    var name = opts.name,
	        eventBus = opts.eventBus,
	        drakes = opts.drakes,
	        options = opts.options;

	    options = options || {};
	    this.options = options;
	    this.logging = options.logging;

	    this.log('CREATE DragulaService', opts);

	    this.name = name;
	    this.drakes = drakes || {}; // drake store
	    this.eventBus = eventBus;
	    this.createDragHandler = options.createDragHandler || createDragHandler;
	    this.createModelManager = options.createModelManager || createModelManager;

	    this.modelManager = this.createModelManager(options);

	    // Dragula events supported
	    this.events = ['cancel', 'cloned', 'drag', 'dragend', 'drop', 'out', 'over', 'remove', 'shadow', 'dropModel', 'removeModel', 'accepts', 'moves', 'invalid'];
	  }

	  createClass(DragulaService, [{
	    key: 'addEvents',
	    value: function addEvents() {
	      var _events;

	      this.events = (_events = this.events).concat.apply(_events, arguments);
	    }
	  }, {
	    key: 'removeEvents',
	    value: function removeEvents() {
	      for (var _len = arguments.length, eventNames = Array(_len), _key = 0; _key < _len; _key++) {
	        eventNames[_key] = arguments[_key];
	      }

	      this.events = this.events.filter(function (name) {
	        return eventNames.includes(name);
	      });
	    }
	  }, {
	    key: 'createModel',
	    value: function createModel() {
	      return this.modelManager.createModel();
	    }
	  }, {
	    key: 'log',
	    value: function log(event) {
	      var _console;

	      if (!this.shouldLog) return;

	      for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        args[_key2 - 1] = arguments[_key2];
	      }

	      (_console = console).log.apply(_console, ['DragulaService [' + this.name + '] :', event].concat(args));
	    }
	  }, {
	    key: 'error',
	    value: function error(msg) {
	      console.error(msg);
	      throw new Error(msg);
	    }
	  }, {
	    key: '_validate',
	    value: function _validate(method, name) {
	      if (!name) {
	        this.error(method + ' must take a drake name as the first argument');
	      }
	    }
	  }, {
	    key: 'add',
	    value: function add(name, drake) {
	      this.log('add (drake)', name, drake);
	      this._validate('add', name);
	      if (this.find(name)) {
	        this.log('existing drakes', this.drakeNames);
	        var errMsg = 'Drake named: "' + name + '" already exists for this service [' + this.name + '].\n      Most likely this error in cause by a race condition evaluating multiple template elements with\n      the v-dragula directive having the same drake name. Please initialise the drake in the created() life cycle hook of the VM to fix this problem.';
	        this.error(errMsg);
	      }

	      this.drakes[name] = drake;
	      if (drake.models) {
	        this.handleModels(name, drake);
	      }
	      if (!drake.initEvents) {
	        this.setupEvents(name, drake);
	      }
	      return drake;
	    }
	  }, {
	    key: 'find',
	    value: function find(name) {
	      this.log('find (drake) by name', name);
	      this._validate('find', name);
	      return this.drakes[name];
	    }
	  }, {
	    key: 'handleModels',
	    value: function handleModels(name, drake) {
	      this.log('handleModels', name, drake);
	      this._validate('handleModels', name);
	      if (drake.registered) {
	        // do not register events twice
	        this.log('handleModels', 'already registered');
	        return;
	      }

	      var dragHandler = this.createDragHandler({
	        ctx: this,
	        name: name,
	        drake: drake
	      });
	      this.log('created dragHandler for service', dragHandler);

	      drake.on('remove', dragHandler.remove.bind(dragHandler));
	      drake.on('drag', dragHandler.drag.bind(dragHandler));
	      drake.on('drop', dragHandler.drop.bind(dragHandler));

	      drake.registered = true;
	    }

	    // convenience to set eventBus handlers via Object

	  }, {
	    key: 'on',
	    value: function on() {
	      var _this2 = this;

	      var handlerConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      this.log('on (events) ', handlerConfig);
	      Object.keys(handlerConfig).forEach(function (handlerName) {
	        var handlerFunction = handlerConfig[handlerName];
	        _this2.log('$on', handlerName, handlerFunction);
	        _this2.eventBus.$on(handlerName, handlerFunction);
	      });
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy(name) {
	      this.log('destroy (drake) ', name);
	      this._validate('destroy', name);
	      var drake = this.find(name);
	      if (!drake) {
	        return;
	      }
	      drake.destroy();
	      this._delete(name);
	    }
	  }, {
	    key: '_delete',
	    value: function _delete(name) {
	      delete this.drakes[name];
	    }
	  }, {
	    key: 'setOptions',
	    value: function setOptions(name, options) {
	      this.log('setOptions (drake)', name, options);
	      this._validate('setOptions', name);
	      var drake = this.add(name, dragula$1(options));
	      this.handleModels(name, drake);
	      return this;
	    }
	  }, {
	    key: 'calcOpts',
	    value: function calcOpts(name, args) {
	      function noOpts() {
	        return {};
	      }
	      var argEventMap = this.argsEventMap[name] || this.argsEventMap.defaultEvent || noOpts;
	      return argEventMap(args);
	    }
	  }, {
	    key: 'setupEvents',
	    value: function setupEvents(name) {
	      var drake = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	      this.log('setupEvents', name, drake);
	      this._validate('setupEvents', name);
	      drake.initEvents = true;
	      var _this = this;

	      var emitter = function emitter(type) {
	        _this.log('emitter', type);

	        function replicate() {
	          var args = Array.prototype.slice.call(arguments);
	          var opts = _this.calcOpts(name, args);
	          opts.name = name;
	          opts.service = this;
	          opts.drake = drake;
	          _this.log('eventBus.$emit', type, name, opts);
	          _this.eventBus.$emit(type, opts);
	          _this.eventBus.$emit(this.name + ':' + type, opts);
	        }

	        drake.on(type, replicate);
	      };
	      this.events.forEach(emitter);
	    }
	  }, {
	    key: 'domIndexOf',
	    value: function domIndexOf(child, parent) {
	      return Array.prototype.indexOf.call(parent.children, child);
	    }
	  }, {
	    key: 'findModelForContainer',
	    value: function findModelForContainer(container, drake) {
	      this.log('findModelForContainer', container, drake);
	      return (this.findModelContainerByContainer(container, drake) || {}).model;
	    }
	  }, {
	    key: 'findModelContainerByContainer',
	    value: function findModelContainerByContainer(container, drake) {
	      if (!drake.models) {
	        this.log('findModelContainerByContainer', 'warning: no models found');
	        return;
	      }
	      var found = drake.models.find(function (model) {
	        return model.container === container;
	      });
	      if (!found) {
	        this.log('No matching model could be found for container:', container);
	        this.log('in drake', drake.name, ' models:', drake.models);
	      }
	      return found;
	    }
	  }, {
	    key: 'shouldLog',
	    get: function get() {
	      return this.logging && this.logging.service;
	    }
	  }, {
	    key: 'drakeNames',
	    get: function get() {
	      return Object.keys(this.drakes);
	    }
	  }, {
	    key: 'argsEventMap',
	    get: function get() {
	      this._argsEventMap = this._argsEventMap || this.defaultArgsEventMap;
	      return this._argsEventMap;
	    },
	    set: function set(customArgsEventMap) {
	      this._argsEventMap = customArgsEventMap;
	    }
	  }, {
	    key: 'defaultArgsEventMap',
	    get: function get() {
	      return {
	        cloned: function cloned(args) {
	          return {
	            clone: args[0],
	            original: args[1],
	            type: args[2]
	          };
	        },
	        moves: function moves(args) {
	          return {
	            el: args[0],
	            source: args[1],
	            handle: args[2],
	            sibling: args[3]
	          };
	        },
	        copy: function copy(args) {
	          return {
	            el: args[0],
	            source: args[1]
	          };
	        },
	        accepts: function accepts(args) {
	          return {
	            el: args[0],
	            target: args[1],
	            source: args[2],
	            sibling: args[3]
	          };
	        },
	        invalid: function invalid(args) {
	          return {
	            el: args[0],
	            handle: args[1]
	          };
	        },
	        drag: function drag(args) {
	          return {
	            el: args[0],
	            source: args[1]
	          };
	        },
	        dragend: function dragend(args) {
	          return {
	            el: args[0]
	          };
	        },
	        drop: function drop(args) {
	          return {
	            el: args[0],
	            target: args[1],
	            source: args[2],
	            sibling: args[3]
	          };
	        },
	        defaultEvent: function defaultEvent(args) {
	          return {
	            el: args[0],
	            container: args[1],
	            source: args[2]
	          };
	        }
	      };
	    }
	  }]);
	  return DragulaService;
	}();

	if (!dragula$1) {
	  throw new Error('[vue-dragula] cannot locate dragula.');
	}

	var defaults = {
	  createService: function createService(_ref) {
	    var name = _ref.name,
	        eventBus = _ref.eventBus,
	        drakes = _ref.drakes,
	        options = _ref.options;

	    return new DragulaService({
	      name: name,
	      eventBus: eventBus,
	      drakes: drakes,
	      options: options
	    });
	  },
	  createEventBus: function createEventBus(Vue) {
	    return new Vue();
	  }
	};

	function isEmpty(str) {
	  if (!str) return true;
	  if (str.length === 0) return true;
	  return false;
	}

	function VueDragula (Vue) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  // set full fine-grained logging if true
	  if (options.logging === true) {
	    options.logging = {
	      plugin: true,
	      directive: true,
	      service: true,
	      dragHandler: true
	    };
	  }

	  function logPlugin() {
	    var _console;

	    if (!options.logging) return;
	    if (!options.logging.plugin) return;

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    (_console = console).log.apply(_console, ['vue-dragula plugin'].concat(args));
	  }

	  function logServiceConfig() {
	    var _console2;

	    if (!options.logging) return;
	    if (!options.logging.service) return;

	    for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	      args[_key2] = arguments[_key2];
	    }

	    (_console2 = console).log.apply(_console2, ['vue-dragula service config: '].concat(args));
	  }

	  function logDir() {
	    var _console3;

	    if (!options.logging) return;
	    if (!options.logging.directive) return;

	    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	      args[_key3] = arguments[_key3];
	    }

	    (_console3 = console).log.apply(_console3, ['v-dragula directive'].concat(args));
	  }

	  logPlugin('Initializing vue-dragula plugin', options);

	  var _createService = options.createService || defaults.createService;
	  var createEventBus = options.createEventBus || defaults.createEventBus || new Vue();

	  logPlugin('create eventBus', createEventBus);
	  var eventBus = createEventBus(Vue, options);

	  if (!eventBus) {
	    console.warn('Eventbus could not be created');
	    throw new Error('Eventbus could not be created');
	  }

	  logPlugin('eventBus created', eventBus);

	  // global service
	  var appService = _createService({
	    name: 'global.dragula',
	    eventBus: eventBus,
	    drakes: options.drakes,
	    options: options
	  });

	  var globalName = 'globalDrake';

	  var Dragula = function () {
	    function Dragula(options) {
	      classCallCheck(this, Dragula);

	      this.options = options;

	      // convenience functions on global service
	      this.$service = {
	        options: appService.setOptions.bind(appService),
	        find: appService.find.bind(appService),
	        eventBus: appService.eventBus
	        // add default drake on global app service
	      };this.$service.options('default', {});

	      // alias
	      this.createServices = this.createService;
	    }

	    createClass(Dragula, [{
	      key: 'optionsFor',
	      value: function optionsFor(name) {
	        var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	        this.service(name).setOptions(opts);
	        return this;
	      }
	    }, {
	      key: 'createService',
	      value: function createService() {
	        var _this = this;

	        var serviceOpts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	        logServiceConfig('createService', serviceOpts);

	        this._serviceMap = this._serviceMap || {};

	        var names = serviceOpts.names || [];
	        var name = serviceOpts.name || [];
	        var drakes = serviceOpts.drakes || {};
	        var drake = serviceOpts.drake;
	        var opts = Object.assign({}, options, serviceOpts);
	        names = names.length > 0 ? names : [name];
	        var eventBus = serviceOpts.eventBus || appService.eventBus;
	        if (!eventBus) {
	          console.warn('Eventbus could not be created', eventBus);
	        }

	        logServiceConfig('names', names);
	        names.forEach(function (name) {
	          var createOpts = {
	            name: name,
	            eventBus: eventBus,
	            options: opts
	          };
	          logServiceConfig('create DragulaService', name, createOpts);
	          _this._serviceMap[name] = _createService(createOpts);

	          // use 'default' drakes if none specified
	          if (!drakes.default) {
	            drakes.default = drake || true;
	          }

	          _this.drakesFor(name, drakes);
	        });
	        return this;
	      }
	    }, {
	      key: 'drakesFor',
	      value: function drakesFor(name) {
	        var drakes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	        logServiceConfig('drakesFor', name, drakes);
	        var service = this.service(name);

	        if (Array.isArray(drakes)) {
	          // turn Array into object of [name]: true
	          drakes = drakes.reduce(function (obj, name) {
	            obj[name] = true;
	            return obj;
	          }, {});
	        }

	        Object.keys(drakes).forEach(function (drakeName) {
	          var drakeOpts = drakes[drakeName];
	          if (drakeOpts === true) {
	            drakeOpts = {};
	          }

	          service.setOptions(drakeName, drakeOpts);
	        });
	        return this;
	      }
	    }, {
	      key: 'on',
	      value: function on(name) {
	        var _this2 = this;

	        var handlerConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	        logServiceConfig('on', name, handlerConfig);
	        if ((typeof name === 'undefined' ? 'undefined' : typeof name) === 'object') {
	          handlerConfig = name;
	          // add event handlers for all services
	          var serviceNames = this.serviceNames;

	          if (!serviceNames || serviceNames.length < 1) {
	            console.warn('vue-dragula: No services found to add events handlers for', this._serviceMap);
	            return this;
	          }

	          logServiceConfig('add event handlers for', serviceNames);
	          serviceNames.forEach(function (serviceName) {
	            _this2.on(serviceName, handlerConfig);
	          });
	          return this;
	        }

	        var service = this.service(name);
	        if (!service) {
	          console.warn('vue-dragula: no service ' + name + ' to add event handlers for');
	          return this;
	        }
	        logServiceConfig('service.on', service, handlerConfig);
	        service.on(handlerConfig);
	        return this;
	      }
	    }, {
	      key: 'service',


	      // return named service or first service
	      value: function service(name) {
	        if (!this._serviceMap) return;

	        var found = this._serviceMap[name];
	        logServiceConfig('lookup service', name, found);

	        if (!found) {
	          logServiceConfig('not found by name, get default');
	          var keys = this.serviceNames;
	          if (keys) {
	            found = this._serviceMap[keys[0]];
	          }
	        }
	        return found;
	      }
	    }, {
	      key: 'serviceNames',
	      get: function get() {
	        return Object.keys(this._serviceMap);
	      }
	    }, {
	      key: 'services',
	      get: function get() {
	        return Object.values(this._serviceMap);
	      }
	    }]);
	    return Dragula;
	  }();

	  Vue.$dragula = new Dragula(options);

	  var drakeContainers = {};

	  Vue.prototype.$dragula = Vue.$dragula;

	  function findService(name, vnode, serviceName) {
	    // first try to register on DragulaService of component
	    if (vnode) {
	      var _dragula = vnode.context.$dragula;
	      if (_dragula) {
	        logDir('trying to find and use component service');

	        var componentService = _dragula.service(serviceName);
	        if (componentService) {
	          logDir('using component service', componentService);
	          return componentService;
	        }
	      }
	    }
	    logDir('using global service', appService);
	    return appService;
	  }

	  function calcNames(name, vnode, ctx) {
	    var drakeName = vnode ? vnode.data.attrs.drake : this.params.drake;
	    var serviceName = vnode ? vnode.data.attrs.service : this.params.service;

	    if (drakeName !== undefined && drakeName.length !== 0) {
	      name = drakeName;
	    }
	    drakeName = isEmpty(drakeName) ? 'default' : drakeName;

	    return {
	      name: name,
	      drakeName: drakeName,
	      serviceName: serviceName
	    };
	  }

	  function updateDirective(container, binding, vnode, oldVnode) {
	    logDir('updateDirective');
	    var newValue = vnode ? binding.value : container;
	    if (!newValue) {
	      return;
	    }

	    var _calcNames = calcNames(globalName, vnode, this),
	        name = _calcNames.name,
	        drakeName = _calcNames.drakeName,
	        serviceName = _calcNames.serviceName;

	    var service = findService(name, vnode, serviceName);
	    var drake = service.find(drakeName, vnode);

	    drakeContainers[drakeName] = drakeContainers[drakeName] || [];
	    var dc = drakeContainers[drakeName];

	    // skip if has already been configured (same container in same drake)
	    if (dc) {
	      var found = dc.find(function (c) {
	        return c === container;
	      });
	      if (found) {
	        logDir('already has drake container configured', drakeName, container);
	        return;
	      }
	    }

	    if (!service) {
	      logDir('no service found', name, drakeName);
	      return;
	    }

	    if (!drake.models) {
	      drake.models = [];
	    }

	    if (!vnode) {
	      container = this.el; // Vue 1
	    }

	    var modelContainer = service.findModelContainerByContainer(container, drake);

	    dc.push(container);

	    logDir('DATA', {
	      service: {
	        name: serviceName,
	        instance: service
	      },
	      drake: {
	        name: drakeName,
	        instance: drake
	      },
	      container: container,
	      modelContainer: modelContainer
	    });

	    if (modelContainer) {
	      logDir('set model of container', newValue);
	      modelContainer.model = newValue;
	    } else {
	      logDir('push model and container on drake', newValue, container);
	      drake.models.push({
	        model: newValue,
	        container: container
	      });
	    }
	  }

	  Vue.directive('dragula', {
	    params: ['drake', 'service'],

	    bind: function bind(container, binding, vnode) {
	      logDir('BIND', container, binding, vnode);

	      var _calcNames2 = calcNames(globalName, vnode, this),
	          name = _calcNames2.name,
	          drakeName = _calcNames2.drakeName,
	          serviceName = _calcNames2.serviceName;

	      var service = findService(name, vnode, serviceName);
	      var drake = service.find(drakeName, vnode);

	      if (!vnode) {
	        container = this.el; // Vue 1
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
	        container: container
	      });

	      if (drake) {
	        drake.containers.push(container);
	        return;
	      }
	      var newDrake = dragula$1({
	        containers: [container]
	      });
	      service.add(name, newDrake);

	      service.handleModels(name, newDrake);
	    },
	    update: function update(container, binding, vnode, oldVnode) {
	      logDir('UPDATE', container, binding, vnode);
	      // Vue 1
	      if (Vue.version === 1) {
	        updateDirective(container, binding, vnode, oldVnode);
	      }
	    },
	    componentUpdated: function componentUpdated(container, binding, vnode, oldVnode) {
	      logDir('COMPONENT UPDATED', container, binding, vnode);
	    },
	    inserted: function inserted(container, binding, vnode, oldVnode) {
	      logDir('INSERTED', container, binding, vnode);
	      // Vue 2
	      updateDirective(container, binding, vnode, oldVnode);
	    },
	    unbind: function unbind(container, binding, vnode) {
	      logDir('UNBIND', container, binding, vnode);

	      var _calcNames3 = calcNames(globalName, vnode, this),
	          name = _calcNames3.name,
	          drakeName = _calcNames3.drakeName,
	          serviceName = _calcNames3.serviceName;

	      var service = findService(name, vnode, serviceName);
	      var drake = service.find(drakeName, vnode);

	      logDir({
	        service: {
	          name: serviceName,
	          instance: service
	        },
	        drake: {
	          name: drakeName,
	          instance: drake
	        },
	        container: container
	      });

	      if (!drake) {
	        return;
	      }

	      var containerIndex = drake.containers.indexOf(container);

	      if (containerIndex > -1) {
	        logDir('remove container', containerIndex);
	        drake.containers.splice(containerIndex, 1);
	      }

	      if (drake.containers.length === 0) {
	        logDir('destroy service');
	        service.destroy(name);
	      }
	    }
	  });
	}

	var TimeMachine = function () {
	  function TimeMachine(_ref) {
	    var name = _ref.name,
	        model = _ref.model,
	        modelRef = _ref.modelRef,
	        history = _ref.history,
	        logging = _ref.logging;
	    classCallCheck(this, TimeMachine);

	    this.name = name || 'default';
	    this.model = model;
	    this.modelRef = modelRef;
	    this.logging = logging;
	    this.history = history || this.createHistory();
	    this.history.push(this.model);
	    this.timeIndex = 0;
	  }

	  createClass(TimeMachine, [{
	    key: 'log',
	    value: function log(event) {
	      var _console;

	      if (!this.shouldLog) return;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      (_console = console).log.apply(_console, [this.clazzName + ' [' + this.name + '] :', event].concat(args));
	    }
	  }, {
	    key: 'createHistory',
	    value: function createHistory() {
	      return this.history || [];
	    }
	  }, {
	    key: 'timeTravel',
	    value: function timeTravel(index) {
	      this.log('timeTravel to', index);
	      this.model = this.history[index];
	      this.updateModelRef();
	      return this;
	    }
	  }, {
	    key: 'updateModelRef',
	    value: function updateModelRef() {
	      var _this = this;

	      // this.modelRef = mutable
	      // this.log('set modelRef', this.modelRef, this.model)
	      this.modelRef.splice(0, this.modelRef.length);
	      this.model.forEach(function (item) {
	        _this.modelRef.push(item);
	      });
	    }
	  }, {
	    key: 'undo',
	    value: function undo() {
	      this.log('undo timeIndex', this.timeIndex);
	      if (this.timeIndex === 0) {
	        return false;
	      }
	      this.timeIndex--;
	      this.timeTravel(this.timeIndex);
	      return this;
	    }
	  }, {
	    key: 'redo',
	    value: function redo() {
	      this.log('redo timeIndex', this.timeIndex, this.history.length);
	      if (this.timeIndex > this.history.length - 1) {
	        return false;
	      }
	      this.timeIndex++;
	      this.timeTravel(this.timeIndex);
	      return this;
	    }
	  }, {
	    key: 'addToHistory',
	    value: function addToHistory(newModel) {
	      this.log('addToHistory');
	      this.log('old', this.model);
	      this.log('new', newModel);
	      this.model = newModel;
	      this.log('model was set to', this.model);
	      this.history.push(newModel);
	      this.timeIndex++;
	      this.updateModelRef();
	      return this;
	    }
	  }, {
	    key: 'shouldLog',
	    get: function get() {
	      return this.logging && this.logging.modelManager;
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      return this.constructor.name || 'TimeMachine';
	    }
	  }]);
	  return TimeMachine;
	}();

	var createDefaultTimeMachine = function createDefaultTimeMachine(opts) {
	  return new TimeMachine(opts);
	};

	var ImmutableModelManager = function (_ModelManager) {
	  inherits(ImmutableModelManager, _ModelManager);

	  function ImmutableModelManager() {
	    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    classCallCheck(this, ImmutableModelManager);

	    var _this = possibleConstructorReturn(this, (ImmutableModelManager.__proto__ || Object.getPrototypeOf(ImmutableModelManager)).call(this, opts));

	    _this.timeOut = opts.timeOut || 800;
	    var createTimeMachine = opts.createTimeMachine || createDefaultTimeMachine;
	    _this.timeMachine = createTimeMachine(Object.assign(opts, {
	      model: _this.model,
	      modelRef: _this.modelRef
	    }));
	    return _this;
	  }

	  createClass(ImmutableModelManager, [{
	    key: 'timeTravel',


	    /**
	     * Travel to specific point in action history stack
	     * @param {*} index
	     */
	    value: function timeTravel(index) {
	      return this.timeMachine.timeTravel(index);
	    }

	    /**
	     * Undo previous action from history
	     */

	  }, {
	    key: 'undo',
	    value: function undo() {
	      // this.log('UNDO', this.timeMachine)
	      this.timeMachine.undo();
	      return this;
	    }

	    /**
	     * Redo undone action
	     */

	  }, {
	    key: 'redo',
	    value: function redo() {
	      // this.log('REDO', this.timeMachine)
	      this.timeMachine.redo();
	      return this;
	    }
	  }, {
	    key: 'addToHistory',
	    value: function addToHistory(model) {
	      this.timeMachine.addToHistory(model);
	      return this;
	    }

	    // override with Immutable

	  }, {
	    key: 'createModel',
	    value: function createModel(model) {
	      return model || [];
	    }

	    // TODO: add to history!?

	  }, {
	    key: 'createFor',
	    value: function createFor() {
	      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	      return new ImmutableModelManager(opts);
	    }
	  }, {
	    key: 'isEmpty',
	    value: function isEmpty() {
	      return this.model.length === 0;
	    }
	  }, {
	    key: 'actionUpdateModel',
	    value: function actionUpdateModel(newModel) {
	      var _this2 = this;

	      setTimeout(function () {
	        _this2.addToHistory(newModel);
	      }, this.timeOut || 800);
	    }

	    /**
	     * Removes item at index
	     * @param {*} index
	     */

	  }, {
	    key: 'removeAt',
	    value: function removeAt(index) {
	      if (this.copy) return;
	      this.log('removeAt', {
	        model: this.model,
	        index: index
	      });
	      // create new model with self excluded
	      var before = this.model.slice(0, index);
	      var exclAfter = this.model.slice(index + 1);

	      this.log('removeAt: concat', before, exclAfter);
	      var newModel = this.createModel().concat(before, exclAfter);

	      this.actionUpdateModel(newModel);
	      return newModel;
	    }

	    /**
	     * Inserts a dropModel at specific index
	     * NOTE: Copy needs to insert the copied item only, no remove or move involved
	     * @param {*} index
	     * @param {*} dropModel
	     */

	  }, {
	    key: 'insertAt',
	    value: function insertAt(index, insertModel) {
	      this.log('insertAt', {
	        model: this.model,
	        index: index,
	        insertModel: insertModel
	      });

	      // create new model with new inserted

	      // Slice off the items BEFORE the insertion index
	      var itemsBefore = this.sliceBefore(index);

	      // Slice off the items ATER the insertion index
	      var itemsAfter = this._sliceAfter(index);

	      this.log('insertAt: concat', {
	        itemsBefore: itemsBefore,
	        insertModel: insertModel,
	        itemsAfter: itemsAfter
	      });

	      var newModel = this._createNewModelFromInsert(itemsBefore, insertModel, itemsAfter);

	      this.log({
	        newModel: newModel
	      });

	      this.actionUpdateModel(newModel);
	      return newModel;
	    }
	  }, {
	    key: '_createNewModelFromInsert',
	    value: function _createNewModelFromInsert(itemsBefore, insertItem, itemsAfter) {
	      return this.createModel().concat(itemsBefore, insertItem, itemsAfter);
	    }

	    /**
	     * Slice off the items before the insertion index
	     * @param {*} index
	     */

	  }, {
	    key: '_sliceBefore',
	    value: function _sliceBefore(index) {
	      return this.model.slice(0, index);
	    }

	    /**
	     * Slice off the items after the insertion index
	     * @param {*} index
	     */

	  }, {
	    key: '_sliceAfter',
	    value: function _sliceAfter(index) {
	      this.model.slice(index);
	    }

	    /**
	     * Moves item from one index to another
	     * NOTE: If we are doing a copy, we should never perform a move (ie. a remove and insert)
	     * @param {*} param0
	     */

	  }, {
	    key: 'move',
	    value: function move(_ref) {
	      var dragIndex = _ref.dragIndex,
	          dropIndex = _ref.dropIndex;

	      if (this.copy) return;
	      this.log('move', {
	        model: this.model,
	        dragIndex: dragIndex,
	        dropIndex: dropIndex
	      });
	      this.timeMachine.undo();
	      return this;
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      return this.constructor.name || 'ImmutableModelManager';
	    }
	  }, {
	    key: 'model',
	    get: function get() {
	      return this.timeMachine ? this.timeMachine.model : this._model;
	    }
	  }, {
	    key: 'history',
	    get: function get() {
	      return this.timeMachine.history;
	    }
	  }, {
	    key: 'timeIndex',
	    get: function get() {
	      return this.timeMachine.timeIndex;
	    }
	  }, {
	    key: 'first',
	    get: function get() {
	      return this.at(0);
	    }
	  }, {
	    key: 'last',
	    get: function get() {
	      return this.at(this.model.length - 1);
	    }
	  }]);
	  return ImmutableModelManager;
	}(ModelManager);

	var ActionManager = function () {
	  function ActionManager() {
	    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	    classCallCheck(this, ActionManager);

	    this.name = opts.name || 'default';
	    this.logging = opts.logging;
	    this.observer = {
	      undo: function undo(action) {},
	      redo: function redo(action) {}
	    };

	    this.actions = {
	      // stack of actions to undo
	      done: [],
	      // stack of actions undone to be redone(via. redo)
	      undone: []
	    };
	  }

	  createClass(ActionManager, [{
	    key: 'log',
	    value: function log(event) {
	      var _console;

	      if (!this.shouldLog) return;

	      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        args[_key - 1] = arguments[_key];
	      }

	      (_console = console).log.apply(_console, [this.clazzName + ' [' + this.name + '] :', event].concat(args));
	    }
	  }, {
	    key: 'clear',
	    value: function clear() {
	      this.actions.done = [];
	      this.actions.undone = [];
	    }

	    // perform undo/redo on model (container)

	  }, {
	    key: 'doAct',
	    value: function doAct(container, action) {
	      this.log('doAct', {
	        container: container,
	        action: action
	      });
	      var actFun = container[action].bind(container);
	      // this.log('doAct', actFun, container, action)
	      if (!actFun) {
	        throw new Error(container, 'missing', action, 'method');
	      }
	      actFun();
	    }

	    // if not a copy action, do the action on source container also

	  }, {
	    key: 'isSourceContainerAction',
	    value: function isSourceContainerAction(action) {
	      return action !== 'copy';
	    }
	  }, {
	    key: 'isTargetContainerAction',
	    value: function isTargetContainerAction(action) {
	      return true;
	    }
	  }, {
	    key: 'do',
	    value: function _do(_ref) {
	      var name = _ref.name,
	          container = _ref.container;

	      // this.log(name)
	      var cDo = container.do;
	      var cUndo = container.undo;
	      if (!cDo.length) {
	        // this.log('actions empty', cDo)
	        return;
	      }
	      var action = cDo.pop();
	      // TODO: use elements, indexes to create visual transition/animation effect
	      var models = action.models;

	      this.log('do', {
	        name: name,
	        action: action,
	        source: source,
	        target: target
	      });

	      var source = models.source,
	          target = models.target;

	      // perform one action on source and one on target
	      // this could be the cause of the double copy problem
	      // since a copy action only takes effect on the target container

	      if (this.isSourceContainerAction(action)) {
	        this.doAct(source, name);
	      }
	      if (this.isTargetContainerAction(action)) {
	        this.doAct(target, name);
	      }

	      this.emitAction(name, action);

	      cUndo.push(action);
	      // this.log('actions undo', cUndo)
	    }
	  }, {
	    key: 'emitAction',
	    value: function emitAction(name, action) {
	      this.log('emitAction', {
	        name: name,
	        action: action
	      });
	      var fun = this.observer[name];
	      if (typeof fun === 'function') fun(action);
	    }
	  }, {
	    key: 'onUndo',
	    value: function onUndo(fun) {
	      this.observer.undo = fun;
	    }
	  }, {
	    key: 'onRedo',
	    value: function onRedo(fun) {
	      this.observer.redo = fun;
	    }
	  }, {
	    key: 'undo',
	    value: function undo() {
	      this.log('UNDO');

	      this.do({
	        name: 'undo',
	        container: {
	          do: this.actions.done,
	          undo: this.actions.undone
	        }
	      });
	    }
	  }, {
	    key: 'redo',
	    value: function redo() {
	      this.log('REDO');
	      this.do({
	        name: 'redo',
	        container: {
	          do: this.actions.undone,
	          undo: this.actions.done
	        }
	      });
	    }
	  }, {
	    key: 'act',
	    value: function act() {
	      var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	      var name = action.name,
	          models = action.models,
	          indexes = action.indexes,
	          elements = action.elements;

	      this.log('act (store action on stack)', {
	        name: name,
	        models: models,
	        indexes: indexes,
	        elements: elements
	      });
	      this.actions.done.push(action);
	    }
	  }, {
	    key: 'clazzName',
	    get: function get() {
	      return this.constructor.name || 'ActionManager';
	    }
	  }, {
	    key: 'shouldLog',
	    get: function get() {
	      return this.logging;
	    }
	  }]);
	  return ActionManager;
	}();

	function plugin(Vue) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  if (plugin.installed) {
	    console.warn('[vue-dragula] already installed.');
	  }

	  console.log('Add Dragula plugin:', options);
	  VueDragula(Vue, options);
	}

	plugin.version = '2.0.1';

	var Vue2Dragula = plugin;

	if (typeof define === 'function' && define.amd) {
	  // eslint-disable-line
	  define([], function () {
	    plugin;
	  }); // eslint-disable-line
	} else if (window.Vue) {
	  window.Vue.use(plugin);
	}

	exports.Vue2Dragula = Vue2Dragula;
	exports.DragulaService = DragulaService;
	exports.DragHandler = DragHandler;
	exports.ModelManager = ModelManager;
	exports.ImmutableModelManager = ImmutableModelManager;
	exports.TimeMachine = TimeMachine;
	exports.ActionManager = ActionManager;

}));