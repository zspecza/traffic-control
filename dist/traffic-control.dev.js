(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('trafficControl', factory) :
  (global.trafficControl = factory());
}(this, function () { 'use strict';

  var babelHelpers = {};
  babelHelpers.typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
  };

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
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

  babelHelpers;


  function __commonjs(fn, module) { return module = { exports: {} }, fn(module, module.exports), module.exports; }

  var _core = __commonjs(function (module) {
  var core = module.exports = { version: '2.4.0' };
  if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef
  });

  var require$$2 = (_core && typeof _core === 'object' && 'default' in _core ? _core['default'] : _core);

  var _fails = __commonjs(function (module) {
  module.exports = function (exec) {
    try {
      return !!exec();
    } catch (e) {
      return true;
    }
  };
  });

  var require$$1 = (_fails && typeof _fails === 'object' && 'default' in _fails ? _fails['default'] : _fails);

  var _cof = __commonjs(function (module) {
  var toString = {}.toString;

  module.exports = function (it) {
    return toString.call(it).slice(8, -1);
  };
  });

  var require$$0$1 = (_cof && typeof _cof === 'object' && 'default' in _cof ? _cof['default'] : _cof);

  var _iobject = __commonjs(function (module) {
  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var cof = require$$0$1;
  module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
    return cof(it) == 'String' ? it.split('') : Object(it);
  };
  });

  var require$$1$1 = (_iobject && typeof _iobject === 'object' && 'default' in _iobject ? _iobject['default'] : _iobject);

  var _defined = __commonjs(function (module) {
  // 7.2.1 RequireObjectCoercible(argument)
  module.exports = function (it) {
    if (it == undefined) throw TypeError("Can't call method on  " + it);
    return it;
  };
  });

  var require$$0$2 = (_defined && typeof _defined === 'object' && 'default' in _defined ? _defined['default'] : _defined);

  var _toObject = __commonjs(function (module) {
  // 7.1.13 ToObject(argument)
  var defined = require$$0$2;
  module.exports = function (it) {
    return Object(defined(it));
  };
  });

  var require$$2$1 = (_toObject && typeof _toObject === 'object' && 'default' in _toObject ? _toObject['default'] : _toObject);

  var _objectPie = __commonjs(function (module, exports) {
  exports.f = {}.propertyIsEnumerable;
  });

  var require$$3 = (_objectPie && typeof _objectPie === 'object' && 'default' in _objectPie ? _objectPie['default'] : _objectPie);

  var _objectGops = __commonjs(function (module, exports) {
  exports.f = Object.getOwnPropertySymbols;
  });

  var require$$4 = (_objectGops && typeof _objectGops === 'object' && 'default' in _objectGops ? _objectGops['default'] : _objectGops);

  var _enumBugKeys = __commonjs(function (module) {
  // IE 8- don't enum bug keys
  module.exports = 'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'.split(',');
  });

  var require$$0$3 = (_enumBugKeys && typeof _enumBugKeys === 'object' && 'default' in _enumBugKeys ? _enumBugKeys['default'] : _enumBugKeys);

  var _uid = __commonjs(function (module) {
  var id = 0,
      px = Math.random();
  module.exports = function (key) {
    return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
  };
  });

  var require$$0$5 = (_uid && typeof _uid === 'object' && 'default' in _uid ? _uid['default'] : _uid);

  var _global = __commonjs(function (module) {
  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global = module.exports = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
  if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef
  });

  var require$$0$6 = (_global && typeof _global === 'object' && 'default' in _global ? _global['default'] : _global);

  var _shared = __commonjs(function (module) {
  var global = require$$0$6,
      SHARED = '__core-js_shared__',
      store = global[SHARED] || (global[SHARED] = {});
  module.exports = function (key) {
    return store[key] || (store[key] = {});
  };
  });

  var require$$1$3 = (_shared && typeof _shared === 'object' && 'default' in _shared ? _shared['default'] : _shared);

  var _sharedKey = __commonjs(function (module) {
  var shared = require$$1$3('keys'),
      uid = require$$0$5;
  module.exports = function (key) {
    return shared[key] || (shared[key] = uid(key));
  };
  });

  var require$$0$4 = (_sharedKey && typeof _sharedKey === 'object' && 'default' in _sharedKey ? _sharedKey['default'] : _sharedKey);

  var _toInteger = __commonjs(function (module) {
  // 7.1.4 ToInteger
  var ceil = Math.ceil,
      floor = Math.floor;
  module.exports = function (it) {
    return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
  };
  });

  var require$$0$8 = (_toInteger && typeof _toInteger === 'object' && 'default' in _toInteger ? _toInteger['default'] : _toInteger);

  var _toIndex = __commonjs(function (module) {
  var toInteger = require$$0$8,
      max = Math.max,
      min = Math.min;
  module.exports = function (index, length) {
    index = toInteger(index);
    return index < 0 ? max(index + length, 0) : min(index, length);
  };
  });

  var require$$0$7 = (_toIndex && typeof _toIndex === 'object' && 'default' in _toIndex ? _toIndex['default'] : _toIndex);

  var _toLength = __commonjs(function (module) {
  // 7.1.15 ToLength
  var toInteger = require$$0$8,
      min = Math.min;
  module.exports = function (it) {
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  };
  });

  var require$$1$5 = (_toLength && typeof _toLength === 'object' && 'default' in _toLength ? _toLength['default'] : _toLength);

  var _toIobject = __commonjs(function (module) {
  // to indexed object, toObject with fallback for non-array-like ES3 strings
  var IObject = require$$1$1,
      defined = require$$0$2;
  module.exports = function (it) {
    return IObject(defined(it));
  };
  });

  var require$$2$2 = (_toIobject && typeof _toIobject === 'object' && 'default' in _toIobject ? _toIobject['default'] : _toIobject);

  var _arrayIncludes = __commonjs(function (module) {
  // false -> Array#indexOf
  // true  -> Array#includes
  var toIObject = require$$2$2,
      toLength = require$$1$5,
      toIndex = require$$0$7;
  module.exports = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIObject($this),
          length = toLength(O.length),
          index = toIndex(fromIndex, length),
          value;
      // Array#includes uses SameValueZero equality algorithm
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        if (value != value) return true;
        // Array#toIndex ignores holes, Array#includes - not
      } else for (; length > index; index++) {
          if (IS_INCLUDES || index in O) {
            if (O[index] === el) return IS_INCLUDES || index || 0;
          }
        }return !IS_INCLUDES && -1;
    };
  };
  });

  var require$$1$4 = (_arrayIncludes && typeof _arrayIncludes === 'object' && 'default' in _arrayIncludes ? _arrayIncludes['default'] : _arrayIncludes);

  var _has = __commonjs(function (module) {
  var hasOwnProperty = {}.hasOwnProperty;
  module.exports = function (it, key) {
    return hasOwnProperty.call(it, key);
  };
  });

  var require$$3$1 = (_has && typeof _has === 'object' && 'default' in _has ? _has['default'] : _has);

  var _objectKeysInternal = __commonjs(function (module) {
  var has = require$$3$1,
      toIObject = require$$2$2,
      arrayIndexOf = require$$1$4(false),
      IE_PROTO = require$$0$4('IE_PROTO');

  module.exports = function (object, names) {
    var O = toIObject(object),
        i = 0,
        result = [],
        key;
    for (key in O) {
      if (key != IE_PROTO) has(O, key) && result.push(key);
    } // Don't enum bug & hidden keys
    while (names.length > i) {
      if (has(O, key = names[i++])) {
        ~arrayIndexOf(result, key) || result.push(key);
      }
    }return result;
  };
  });

  var require$$1$2 = (_objectKeysInternal && typeof _objectKeysInternal === 'object' && 'default' in _objectKeysInternal ? _objectKeysInternal['default'] : _objectKeysInternal);

  var _objectKeys = __commonjs(function (module) {
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  var $keys = require$$1$2,
      enumBugKeys = require$$0$3;

  module.exports = Object.keys || function keys(O) {
    return $keys(O, enumBugKeys);
  };
  });

  var require$$5 = (_objectKeys && typeof _objectKeys === 'object' && 'default' in _objectKeys ? _objectKeys['default'] : _objectKeys);

  var _objectAssign = __commonjs(function (module) {
  'use strict';
  // 19.1.2.1 Object.assign(target, source, ...)

  var getKeys = require$$5,
      gOPS = require$$4,
      pIE = require$$3,
      toObject = require$$2$1,
      IObject = require$$1$1,
      $assign = Object.assign;

  // should work with symbols and should have deterministic property order (V8 bug)
  module.exports = !$assign || require$$1(function () {
    var A = {},
        B = {},
        S = Symbol(),
        K = 'abcdefghijklmnopqrst';
    A[S] = 7;
    K.split('').forEach(function (k) {
      B[k] = k;
    });
    return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
  }) ? function assign(target, source) {
    // eslint-disable-line no-unused-vars
    var T = toObject(target),
        aLen = arguments.length,
        index = 1,
        getSymbols = gOPS.f,
        isEnum = pIE.f;
    while (aLen > index) {
      var S = IObject(arguments[index++]),
          keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S),
          length = keys.length,
          j = 0,
          key;
      while (length > j) {
        if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
      }
    }return T;
  } : $assign;
  });

  var require$$0 = (_objectAssign && typeof _objectAssign === 'object' && 'default' in _objectAssign ? _objectAssign['default'] : _objectAssign);

  var _descriptors = __commonjs(function (module) {
  // Thank's IE8 for his funny defineProperty
  module.exports = !require$$1(function () {
    return Object.defineProperty({}, 'a', { get: function get() {
        return 7;
      } }).a != 7;
  });
  });

  var require$$2$3 = (_descriptors && typeof _descriptors === 'object' && 'default' in _descriptors ? _descriptors['default'] : _descriptors);

  var _propertyDesc = __commonjs(function (module) {
  module.exports = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };
  });

  var require$$1$7 = (_propertyDesc && typeof _propertyDesc === 'object' && 'default' in _propertyDesc ? _propertyDesc['default'] : _propertyDesc);

  var _isObject = __commonjs(function (module) {
  module.exports = function (it) {
    return (typeof it === 'undefined' ? 'undefined' : babelHelpers.typeof(it)) === 'object' ? it !== null : typeof it === 'function';
  };
  });

  var require$$0$10 = (_isObject && typeof _isObject === 'object' && 'default' in _isObject ? _isObject['default'] : _isObject);

  var _toPrimitive = __commonjs(function (module) {
  // 7.1.1 ToPrimitive(input [, PreferredType])
  var isObject = require$$0$10;
  // instead of the ES6 spec version, we didn't implement @@toPrimitive case
  // and the second argument - flag - preferred type is a string
  module.exports = function (it, S) {
    if (!isObject(it)) return it;
    var fn, val;
    if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
    if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
    throw TypeError("Can't convert object to primitive value");
  };
  });

  var require$$1$8 = (_toPrimitive && typeof _toPrimitive === 'object' && 'default' in _toPrimitive ? _toPrimitive['default'] : _toPrimitive);

  var _domCreate = __commonjs(function (module) {
  var isObject = require$$0$10,
      document = require$$0$6.document
  // in old IE typeof document.createElement is 'object'
  ,
      is = isObject(document) && isObject(document.createElement);
  module.exports = function (it) {
    return is ? document.createElement(it) : {};
  };
  });

  var require$$0$11 = (_domCreate && typeof _domCreate === 'object' && 'default' in _domCreate ? _domCreate['default'] : _domCreate);

  var _ie8DomDefine = __commonjs(function (module) {
  module.exports = !require$$2$3 && !require$$1(function () {
    return Object.defineProperty(require$$0$11('div'), 'a', { get: function get() {
        return 7;
      } }).a != 7;
  });
  });

  var require$$2$5 = (_ie8DomDefine && typeof _ie8DomDefine === 'object' && 'default' in _ie8DomDefine ? _ie8DomDefine['default'] : _ie8DomDefine);

  var _anObject = __commonjs(function (module) {
  var isObject = require$$0$10;
  module.exports = function (it) {
    if (!isObject(it)) throw TypeError(it + ' is not an object!');
    return it;
  };
  });

  var require$$3$2 = (_anObject && typeof _anObject === 'object' && 'default' in _anObject ? _anObject['default'] : _anObject);

  var _objectDp = __commonjs(function (module, exports) {
  var anObject = require$$3$2,
      IE8_DOM_DEFINE = require$$2$5,
      toPrimitive = require$$1$8,
      dP = Object.defineProperty;

  exports.f = require$$2$3 ? Object.defineProperty : function defineProperty(O, P, Attributes) {
    anObject(O);
    P = toPrimitive(P, true);
    anObject(Attributes);
    if (IE8_DOM_DEFINE) try {
      return dP(O, P, Attributes);
    } catch (e) {/* empty */}
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };
  });

  var require$$2$4 = (_objectDp && typeof _objectDp === 'object' && 'default' in _objectDp ? _objectDp['default'] : _objectDp);

  var _hide = __commonjs(function (module) {
  var dP = require$$2$4,
      createDesc = require$$1$7;
  module.exports = require$$2$3 ? function (object, key, value) {
    return dP.f(object, key, createDesc(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };
  });

  var require$$0$9 = (_hide && typeof _hide === 'object' && 'default' in _hide ? _hide['default'] : _hide);

  var _aFunction = __commonjs(function (module) {
  module.exports = function (it) {
    if (typeof it != 'function') throw TypeError(it + ' is not a function!');
    return it;
  };
  });

  var require$$0$12 = (_aFunction && typeof _aFunction === 'object' && 'default' in _aFunction ? _aFunction['default'] : _aFunction);

  var _ctx = __commonjs(function (module) {
  // optional / simple context binding
  var aFunction = require$$0$12;
  module.exports = function (fn, that, length) {
    aFunction(fn);
    if (that === undefined) return fn;
    switch (length) {
      case 1:
        return function (a) {
          return fn.call(that, a);
        };
      case 2:
        return function (a, b) {
          return fn.call(that, a, b);
        };
      case 3:
        return function (a, b, c) {
          return fn.call(that, a, b, c);
        };
    }
    return function () /* ...args */{
      return fn.apply(that, arguments);
    };
  };
  });

  var require$$1$9 = (_ctx && typeof _ctx === 'object' && 'default' in _ctx ? _ctx['default'] : _ctx);

  var _export = __commonjs(function (module, exports) {
  var global = require$$0$6,
      core = require$$2,
      ctx = require$$1$9,
      hide = require$$0$9,
      PROTOTYPE = 'prototype';

  var $export = function $export(type, name, source) {
    var IS_FORCED = type & $export.F,
        IS_GLOBAL = type & $export.G,
        IS_STATIC = type & $export.S,
        IS_PROTO = type & $export.P,
        IS_BIND = type & $export.B,
        IS_WRAP = type & $export.W,
        exports = IS_GLOBAL ? core : core[name] || (core[name] = {}),
        expProto = exports[PROTOTYPE],
        target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE],
        key,
        own,
        out;
    if (IS_GLOBAL) source = name;
    for (key in source) {
      // contains in native
      own = !IS_FORCED && target && target[key] !== undefined;
      if (own && key in exports) continue;
      // export native or passed
      out = own ? target[key] : source[key];
      // prevent global pollution for namespaces
      exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
      // bind timers to global for call from export context
      : IS_BIND && own ? ctx(out, global)
      // wrap global constructors for prevent change them in library
      : IS_WRAP && target[key] == out ? function (C) {
        var F = function F(a, b, c) {
          if (this instanceof C) {
            switch (arguments.length) {
              case 0:
                return new C();
              case 1:
                return new C(a);
              case 2:
                return new C(a, b);
            }return new C(a, b, c);
          }return C.apply(this, arguments);
        };
        F[PROTOTYPE] = C[PROTOTYPE];
        return F;
        // make static versions for prototype methods
      }(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
      // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
      if (IS_PROTO) {
        (exports.virtual || (exports.virtual = {}))[key] = out;
        // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
        if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
      }
    }
  };
  // type bitmap
  $export.F = 1; // forced
  $export.G = 2; // global
  $export.S = 4; // static
  $export.P = 8; // proto
  $export.B = 16; // bind
  $export.W = 32; // wrap
  $export.U = 64; // safe
  $export.R = 128; // real proto method for `library`
  module.exports = $export;
  });

  var require$$1$6 = (_export && typeof _export === 'object' && 'default' in _export ? _export['default'] : _export);

  var es6_object_assign = __commonjs(function (module) {
  // 19.1.3.1 Object.assign(target, source)
  var $export = require$$1$6;

  $export($export.S + $export.F, 'Object', { assign: require$$0 });
  });

  var assign = __commonjs(function (module) {
  module.exports = require$$2.Object.assign;
  });

  var assign$1 = (assign && typeof assign === 'object' && 'default' in assign ? assign['default'] : assign);

  var initialMarkup = "<div class=\"tc-bar\">\n  <div class=\"tc-message\">\n    <div class=\"tc-container\">\n      <div class=\"tc-message--text tc-message--loading\">\n        Loading...\n      </div>\n      <div class=\"tc-message--text tc-message--synchronized\">\n        You are viewing the staging site.\n        Everything is in sync, production is even with staging. 👌\n      </div>\n      <div class=\"tc-message--text tc-message--ahead\"></div>\n      <div class=\"tc-message--text tc-message--diverged\"></div>\n      <div class=\"tc-message--text tc-message--unauthorized\">\n        You are viewing the staging site,\n        but you cannot deploy or view changes\n        until you authorize read/write access\n        to your Github repository.\n      </div>\n    </div>\n  </div>\n  <div class=\"tc-action\">\n    <div class=\"tc-container\">\n      <button\n        class=\"tc-action--button tc-action--deploy\"\n        aria-label=\"Perform a deployment to the production branch.\"\n      >Deploy</button>\n      <button\n        class=\"tc-action--button tc-action--authorize\"\n        aria-label=\"Authorize traffic-control to access your Github account.\"\n      >Authorize</button>\n      <button\n        class=\"tc-action--button tc-action--info\"\n        aria-label=\"Find out more information.\"\n      >How?</button>\n    </div>\n  </div>\n  <div class=\"tc-close\">\n    <div class=\"tc-container\">\n      <button\n        class=\"tc-close--button\"\n        aria-label=\"Close traffic-control deployment user interface.\"\n      >&times;</button>\n    </div>\n  </div>\n</div>\n";

  var styles = "/*\n  Note: there is a lot of repetition going on in this CSS.\n  This is intentional, in order to keep specificity low\n  enough that custom styles are easier to implement.\n */\n\ntraffic-control,\ntraffic-control *,\ntraffic-control *:before,\ntraffic-control *:after {\n  box-sizing: border-box;\n}\n\ntraffic-control {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  z-index: 10000;\n}\n\ntraffic-control .tc-bar {\n  display: none;\n  width: 100%;\n  height: 100%;\n  table-layout: fixed;\n  font-family: sans-serif;\n  background: #fff;\n  color: #000;\n  transition: all .2s ease;\n}\n\ntraffic-control.is-loading .tc-bar {\n  background: #eee;\n  color: #ccc;\n}\n\ntraffic-control .tc-bar.is-entering {\n  animation: slideInDown .6s ease both;\n}\n\ntraffic-control .tc-message {\n  display: table-cell;\n  vertical-align: middle;\n  height: 100%;\n}\n\ntraffic-control .tc-action {\n  display: table-cell;\n  vertical-align: middle;\n  height: 100%;\n  width: 100px;\n}\n\ntraffic-control .tc-close {\n  display: table-cell;\n  vertical-align: middle;\n  height: 100%;\n  width: 60px;\n  border-left: 1px solid #eee;\n  transition: all .2s ease;\n}\n\ntraffic-control.is-loading .tc-close {\n  border-color: #ccc;\n}\n\ntraffic-control .tc-message--text {\n  font-size: 14px;\n  position: relative;\n  padding: 16px;\n}\n\ntraffic-control .tc-message--loading {\n  display: none;\n  opacity: 0;\n}\n\ntraffic-control .tc-message--loading.is-entering {\n  animation: bounceFadeInLeft .6s cubic-bezier(0.19, 1, 0.22, 1) both;\n  animation-delay: .3s;\n}\n\ntraffic-control .tc-message--synchronized {\n  display: none;\n}\n\ntraffic-control .tc-message--diverged {\n  display: none;\n}\n\ntraffic-control .tc-message--unauthorized {\n  display: none;\n}\n\ntraffic-control .tc-message--ahead {\n  display: none;\n}\n\ntraffic-control .tc-action--deploy {\n  display: none;\n}\n\ntraffic-control .tc-action--info {\n  display: none;\n}\n\ntraffic-control .tc-action--authorize {\n  display: none;\n}\n\ntraffic-control .tc-close--button {\n  display: none;\n  margin: 0 auto;\n  padding: 16px;\n  width: 100%;\n  border: none;\n  outline: none;\n  background: none;\n  color: #eee;\n  font-size: 24px;\n  font-family: Arial, sans-serif;\n  cursor: pointer;\n  height: 100%;\n  position: relative;\n  transition: all .2s ease;\n  text-align: center;\n}\n\ntraffic-control.is-loading .tc-close--button {\n  border-color: #ccc;\n  color: #ccc;\n}\n\ntraffic-control .tc-close--button.is-entering {\n  animation: bounceFadeInRight .6s cubic-bezier(0.19, 1, 0.22, 1) both;\n  animation-delay: .3s;\n}\n\ntraffic-control .tc-bar.is-active {\n  display: table;\n}\n\ntraffic-control .tc-message--loading.is-active {\n  display: block;\n  opacity: 1;\n}\n\ntraffic-control .tc-message--synchronized.is-active {\n  display: block;\n}\n\ntraffic-control .tc-message--diverged.is-active {\n  display: block;\n}\n\ntraffic-control .tc-message--unauthorized.is-active {\n  display: block;\n}\n\ntraffic-control .tc-message--ahead.is-active {\n  display: block;\n}\n\ntraffic-control .tc-action--deploy.is-active {\n  display: block;\n}\n\ntraffic-control .tc-action--info.is-active {\n  display: block;\n}\n\ntraffic-control .tc-action--authorize.is-active {\n  display: block;\n}\n\ntraffic-control .tc-close--button.is-active {\n  display: block;\n}\n\n@keyframes bounceFadeInRight {\n  0% {\n    opacity: 0;\n    transform: translateX(100%);\n  }\n  50% {\n    opacity: 1;\n    transform: translateX(-25%);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n@keyframes bounceFadeInLeft {\n  0% {\n    opacity: 0;\n    transform: translateX(-100%);\n  }\n  50% {\n    opacity: 1;\n    transform: translateX(25%);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n@keyframes slideInDown {\n  0% {\n    transform: translateY(-100%)\n  }\n  100% {\n    transform: translateY(0)\n  }\n}\n";

  /**
   *
   */

  var TrafficControl = function () {
    /**
     * [constructor description]
     * @param  {[type]} opts =             {} [description]
     * @return {[type]}      [description]
     */

    function TrafficControl() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      babelHelpers.classCallCheck(this, TrafficControl);

      this.opts = assign$1({}, this._getDefaultOpts(), opts);
      this._validateOpts(this.opts);
      this._init();
    }

    /**
     * [_getDefaultOpts description]
     * @return {[type]} [description]
     */


    babelHelpers.createClass(TrafficControl, [{
      key: '_getDefaultOpts',
      value: function _getDefaultOpts() {
        return {
          stagingBranch: 'develop',
          productionBrach: 'master',
          ghAPI: 'https://api.github.com',
          containerEl: document.body
        };
      }

      /**
       * [_validateOpts description]
       * @param  {[type]} opts [description]
       * @return {[type]}      [description]
       */

    }, {
      key: '_validateOpts',
      value: function _validateOpts(opts) {
        if (opts.repo == null) {
          throw new Error('You need to specify a repository.');
        }
      }

      /**
       * [_init description]
       * @return {[type]} [description]
       */

    }, {
      key: '_init',
      value: function _init() {
        var _this = this;

        this._addCss(styles);
        this.el = document.createElement('traffic-control');
        this.el.innerHTML = initialMarkup;
        this.els = {
          bar: this.el.getElementsByClassName('tc-bar')[0],
          loadingMsg: this.el.getElementsByClassName('tc-message--loading')[0],
          syncedMsg: this.el.getElementsByClassName('tc-message--synchronized')[0],
          aheadMsg: this.el.getElementsByClassName('tc-message--ahead')[0],
          divergedMsg: this.el.getElementsByClassName('tc-message--diverged')[0],
          unauthedMsg: this.el.getElementsByClassName('tc-message--unauthorized')[0],
          deployBtn: this.el.getElementsByClassName('tc-action--deploy')[0],
          authBtn: this.el.getElementsByClassName('tc-action--authorize')[0],
          infoBtn: this.el.getElementsByClassName('tc-action--info')[0],
          closeBtn: this.el.getElementsByClassName('tc-close--button')[0]
        };
        this.opts.containerEl.appendChild(this.el);
        this.animateIn(this.els.bar, function () {
          _this.el.classList.add('is-loading');
        });
        this.animateIn(this.els.loadingMsg);
        this.animateIn(this.els.closeBtn);
      }

      /**
       * [_addCss description]
       * @param {[type]} css [description]
       */

    }, {
      key: '_addCss',
      value: function _addCss(css) {
        var style = document.createElement('style');
        var head = document.head || document.getElementsByTagName('head')[0];
        style.type = 'text/css';
        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
      }

      /**
       * [animateIn description]
       * @param  {[type]} el    [description]
       * @param  {[type]} after [description]
       * @return {[type]}       [description]
       */

    }, {
      key: 'animateIn',
      value: function animateIn(el, after) {
        var delay = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        var isAnimated = false;
        var startCb = function startCb() {
          isAnimated = true;
          el.removeEventListener(animationStart, startCb);
        };
        el.addEventListener(animationStart, startCb, false);
        el.classList.add('is-active');
        el.classList.add('is-entering');
        if (after && typeof after === 'function') {
          if (isAnimated) {
            (function () {
              var callAfter = function callAfter() {
                setTimeout(after, delay);
                el.removeEventListener(animationEnd, callAfter);
              };
              el.addEventListener(animationEnd, callAfter, false);
            })();
          } else {
            setTimeout(after, delay);
          }
        }
      }

      /**
       * [animateOut description]
       * @param  {[type]} el    [description]
       * @param  {[type]} after [description]
       * @return {[type]}       [description]
       */

    }, {
      key: 'animateOut',
      value: function animateOut(el, after) {
        var delay = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

        var isAnimated = false;
        var startCb = function startCb() {
          isAnimated = true;
          el.removeEventListener(animationStart, startCb);
        };
        el.addEventListener(animationStart, startCb, false);
        el.classList.remove('is-entering');
        el.classList.add('is-leaving');
        if (isAnimated) {
          (function () {
            var cb = function cb() {
              el.classList.remove('is-leaving');
              el.classList.remove('is-active');
              if (after && typeof after === 'function') {
                setTimeout(after, 200 + delay);
              }
              el.removeEventListener(animationEnd, cb);
            };
            el.addEventListener(animationEnd, cb, false);
          })();
        } else {
          el.classList.remove('is-leaving');
          el.classList.remove('is-active');
          if (after && typeof after === 'function') {
            setTimeout(after, delay);
          }
        }
      }
    }]);
    return TrafficControl;
  }();

  /**
   * [description]
   * @param  {[type]} ( [description]
   * @return {[type]}   [description]
   */


  var animationEnd = function () {
    var el = document.createElement('fakeelement');
    var animations = {
      'animation': 'animationend',
      'OAnimation': 'oanimationend',
      'MozAnimation': 'animationend',
      'WebkitAnimation': 'webkitAnimationEnd',
      'MSAnimation': 'MSAnimationEnd'
    };
    for (var t in animations) {
      if (!el.style[t] != null) {
        return animations[t];
      }
    }
  }();

  /**
   * [description]
   * @param  {[type]} ( [description]
   * @return {[type]}   [description]
   */
  var animationStart = function () {
    var el = document.createElement('fakeelement');
    var animations = {
      'animation': 'animationstart',
      'OAnimation': 'oanimationstart',
      'MozAnimation': 'animationstart',
      'WebkitAnimation': 'webkitAnimationStart',
      'MSAnimation': 'MSAnimationStart'
    };
    for (var t in animations) {
      if (!el.style[t] != null) {
        return animations[t];
      }
    }
  }();

  function trafficControl(opts) {

    return new TrafficControl(opts);

    opts = opts || {};
    opts.GH_API = opts.GH_API || 'https://api.github.com';
    opts.stagingBranch = opts.stagingBranch || 'develop';
    opts.productionBranch = opts.productionBranch || 'master';

    if (opts.repo == null) {
      throw new Error('You need to specify a repository.');
    }

    var body = document.getElementsByTagName('body')[0];
    var bar = document.createElement('div');
    bar.id = 'staging-bar';
    bar.style.backgroundColor = '#eee';
    bar.style.color = '#222';
    bar.style.fontFamily = 'sans-serif';
    bar.style.padding = '16px 8px';
    bar.style.position = 'fixed';
    bar.style.top = '0';
    bar.style.width = '100%';
    bar.innerText = 'Loading...';
    body.insertBefore(bar, body.firstChild);

    function init() {
      var $ = window.$;
      var localStorage = window.localStorage;
      var netlify = window.netlify;

      var $body = $(body);
      var $bar = $('#staging-bar');
      var $msg = $('<div />');

      function bar() {
        if (!localStorage.gh_token) {
          $bar.empty();
          var $authBtn = $('<button>Authorize</button>');
          $msg.text('You are viewing the staging site, but you cannot deploy or view changes until you authorize read/write access to your Github repository.');
          $bar.append($msg);
          $bar.css({
            backgroundColor: '#E02D2D',
            color: 'white'
          });
          $bar.append($authBtn);
          $body.prepend($bar);
          $authBtn.on('click', function () {
            netlify.authenticate({ provider: 'github', scope: 'repo' }, function (err, data) {
              if (err) {
                console.log('Error authenticating: %s', err.message);
              }
              localStorage.gh_token = data.token;
              bar();
            });
          });
        } else {
          $.getJSON(opts.GH_API + '/repos/' + opts.repo + '/compare/' + opts.productionBranch + '...' + opts.stagingBranch + 'develop?access_token=' + localStorage.gh_token, function (data) {
            $bar.empty();
            var $deployBtn = $('<button>Deploy</button>');
            if (data.status === 'ahead') {
              var have = data.ahead_by > 1 ? 'have' : 'has';
              var changes = data.ahead_by > 1 ? 'changes' : 'change';
              $msg.html('You are viewing the staging site. There ' + have + ' been <a href="' + data.permalink_url + '" target="_blank">' + data.ahead_by + '</a> ' + changes + ' since the last production build. 🚢');
              $bar.append($msg);
              $bar.css({
                backgroundColor: '#B8D5E9',
                color: '#222'
              });
              $bar.append($deployBtn);
              $body.prepend($bar);
              $deployBtn.on('click', function () {
                $.post(opts.GH_API + '/repos/' + opts.repo + '/merges?access_token=' + localStorage.gh_token, JSON.stringify({
                  base: 'master',
                  head: 'develop',
                  commit_message: ':vertical_traffic_light: Production deploy triggered from traffic-control'
                }), function () {
                  bar();
                });
              });
            } else if (data.status === 'diverged') {
              var commits = data.behind_by > 1 ? 'commits' : 'commit';
              $msg.html('You are viewing the staging site. Staging has diverged behind production by <a href="' + data.permalink_url + '" target="_blank">' + data.behind_by + '</a> ' + commits + '. Please rebase.');
              $bar.append($msg);
              $bar.css({
                backgroundColor: 'orange',
                color: '#222'
              });
              $body.prepend($bar);
            } else {
              $msg.text('You are viewing the staging site. Everything is in sync, production is even with staging. 👌');
              $bar.append($msg);
              $bar.css({
                backgroundColor: '#BAE9B8',
                color: '#222'
              });
              $body.prepend($bar);
            }
          });
        }
      }
      bar();
    }

    function conditionallyLoadJQuery() {
      var jQuery = window.jQuery;
      var protocol = '//';
      if (window.location.href.includes('file://')) {
        protocol = 'https://';
      }
      if (!(typeof jQuery !== 'undefined' && jQuery !== null)) {
        var jQ = document.createElement('script');
        jQ.type = 'text/javascript';
        jQ.onload = jQ.onreadystatechange = init;
        jQ.src = protocol + 'code.jquery.com/jquery-2.2.4.min.js';
        return document.body.appendChild(jQ);
      } else {
        return init();
      }
    };

    if (window.addEventListener) {
      window.addEventListener('load', conditionallyLoadJQuery, false);
    } else if (window.attachEvent) {
      window.attachEvent('onload', conditionallyLoadJQuery);
    }
  }

  return trafficControl;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhZmZpYy1jb250cm9sLmRldi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZWZpbmVkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1waWUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL191aWQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2hhcmVkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbnRlZ2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1hc3NpZ24uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnbi5qcyIsIi4uL3NyYy90ZW1wbGF0ZS5odG1sIiwiLi4vc3JjL3N0eWxlcy5jc3MiLCIuLi9zcmMvdHJhZmZpYy1jb250cm9sLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzIuNC4wJ307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59OyIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7IiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sczsiLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXHJcbm1vZHVsZS5leHBvcnRzID0gKFxyXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXHJcbikuc3BsaXQoJywnKTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKVxyXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcclxuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xyXG59OyIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWF4ICAgICAgID0gTWF0aC5tYXhcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaW5kZXgsIGxlbmd0aCl7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHRvSW5kZXggICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBlbCwgZnJvbUluZGV4KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I3RvSW5kZXggaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59OyIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciBoYXMgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxyXG4gICwgdG9JT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXHJcbiAgLCBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKVxyXG4gICwgSUVfUFJPVE8gICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIG5hbWVzKXtcclxuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcclxuICAgICwgaSAgICAgID0gMFxyXG4gICAgLCByZXN1bHQgPSBbXVxyXG4gICAgLCBrZXk7XHJcbiAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xyXG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcclxuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XHJcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xyXG4gIH1cclxuICByZXR1cm4gcmVzdWx0O1xyXG59OyIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxyXG52YXIgJGtleXMgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpXHJcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKXtcclxuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xyXG59OyIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BTICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJylcbiAgLCBwSUUgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsICRhc3NpZ24gID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgdmFyIEEgPSB7fVxuICAgICwgQiA9IHt9XG4gICAgLCBTID0gU3ltYm9sKClcbiAgICAsIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbihrKXsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCAgICAgPSB0b09iamVjdCh0YXJnZXQpXG4gICAgLCBhTGVuICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGluZGV4ID0gMVxuICAgICwgZ2V0U3ltYm9scyA9IGdPUFMuZlxuICAgICwgaXNFbnVtICAgICA9IHBJRS5mO1xuICB3aGlsZShhTGVuID4gaW5kZXgpe1xuICAgIHZhciBTICAgICAgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSlcbiAgICAgICwga2V5cyAgID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBqICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShsZW5ndGggPiBqKWlmKGlzRW51bS5jYWxsKFMsIGtleSA9IGtleXNbaisrXSkpVFtrZXldID0gU1trZXldO1xuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247IiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTsiLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBTKXtcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZihTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xyXG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcclxufSk7IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoIWlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07IiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTsiLCJ2YXIgZFAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYodGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgZXhwUHJvdG8gID0gZXhwb3J0c1tQUk9UT1RZUEVdXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBrZXksIG93biwgb3V0O1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgICBpZih0aGlzIGluc3RhbmNlb2YgQyl7XG4gICAgICAgICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEM7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmKElTX1BST1RPKXtcbiAgICAgIChleHBvcnRzLnZpcnR1YWwgfHwgKGV4cG9ydHMudmlydHVhbCA9IHt9KSlba2V5XSA9IG91dDtcbiAgICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5wcm90b3R5cGUuJU5BTUUlXG4gICAgICBpZih0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKWhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgIFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0OyIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHthc3NpZ246IHJlcXVpcmUoJy4vX29iamVjdC1hc3NpZ24nKX0pOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5hc3NpZ247IiwiPGRpdiBjbGFzcz1cInRjLWJhclwiPlxuICA8ZGl2IGNsYXNzPVwidGMtbWVzc2FnZVwiPlxuICAgIDxkaXYgY2xhc3M9XCJ0Yy1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0Yy1tZXNzYWdlLS10ZXh0IHRjLW1lc3NhZ2UtLWxvYWRpbmdcIj5cbiAgICAgICAgTG9hZGluZy4uLlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwidGMtbWVzc2FnZS0tdGV4dCB0Yy1tZXNzYWdlLS1zeW5jaHJvbml6ZWRcIj5cbiAgICAgICAgWW91IGFyZSB2aWV3aW5nIHRoZSBzdGFnaW5nIHNpdGUuXG4gICAgICAgIEV2ZXJ5dGhpbmcgaXMgaW4gc3luYywgcHJvZHVjdGlvbiBpcyBldmVuIHdpdGggc3RhZ2luZy4g8J+RjFxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwidGMtbWVzc2FnZS0tdGV4dCB0Yy1tZXNzYWdlLS1haGVhZFwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInRjLW1lc3NhZ2UtLXRleHQgdGMtbWVzc2FnZS0tZGl2ZXJnZWRcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0Yy1tZXNzYWdlLS10ZXh0IHRjLW1lc3NhZ2UtLXVuYXV0aG9yaXplZFwiPlxuICAgICAgICBZb3UgYXJlIHZpZXdpbmcgdGhlIHN0YWdpbmcgc2l0ZSxcbiAgICAgICAgYnV0IHlvdSBjYW5ub3QgZGVwbG95IG9yIHZpZXcgY2hhbmdlc1xuICAgICAgICB1bnRpbCB5b3UgYXV0aG9yaXplIHJlYWQvd3JpdGUgYWNjZXNzXG4gICAgICAgIHRvIHlvdXIgR2l0aHViIHJlcG9zaXRvcnkuXG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJ0Yy1hY3Rpb25cIj5cbiAgICA8ZGl2IGNsYXNzPVwidGMtY29udGFpbmVyXCI+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzPVwidGMtYWN0aW9uLS1idXR0b24gdGMtYWN0aW9uLS1kZXBsb3lcIlxuICAgICAgICBhcmlhLWxhYmVsPVwiUGVyZm9ybSBhIGRlcGxveW1lbnQgdG8gdGhlIHByb2R1Y3Rpb24gYnJhbmNoLlwiXG4gICAgICA+RGVwbG95PC9idXR0b24+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzPVwidGMtYWN0aW9uLS1idXR0b24gdGMtYWN0aW9uLS1hdXRob3JpemVcIlxuICAgICAgICBhcmlhLWxhYmVsPVwiQXV0aG9yaXplIHRyYWZmaWMtY29udHJvbCB0byBhY2Nlc3MgeW91ciBHaXRodWIgYWNjb3VudC5cIlxuICAgICAgPkF1dGhvcml6ZTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzcz1cInRjLWFjdGlvbi0tYnV0dG9uIHRjLWFjdGlvbi0taW5mb1wiXG4gICAgICAgIGFyaWEtbGFiZWw9XCJGaW5kIG91dCBtb3JlIGluZm9ybWF0aW9uLlwiXG4gICAgICA+SG93PzwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInRjLWNsb3NlXCI+XG4gICAgPGRpdiBjbGFzcz1cInRjLWNvbnRhaW5lclwiPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzcz1cInRjLWNsb3NlLS1idXR0b25cIlxuICAgICAgICBhcmlhLWxhYmVsPVwiQ2xvc2UgdHJhZmZpYy1jb250cm9sIGRlcGxveW1lbnQgdXNlciBpbnRlcmZhY2UuXCJcbiAgICAgID4mdGltZXM7PC9idXR0b24+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG4iLCIvKlxuICBOb3RlOiB0aGVyZSBpcyBhIGxvdCBvZiByZXBldGl0aW9uIGdvaW5nIG9uIGluIHRoaXMgQ1NTLlxuICBUaGlzIGlzIGludGVudGlvbmFsLCBpbiBvcmRlciB0byBrZWVwIHNwZWNpZmljaXR5IGxvd1xuICBlbm91Z2ggdGhhdCBjdXN0b20gc3R5bGVzIGFyZSBlYXNpZXIgdG8gaW1wbGVtZW50LlxuICovXG5cbnRyYWZmaWMtY29udHJvbCxcbnRyYWZmaWMtY29udHJvbCAqLFxudHJhZmZpYy1jb250cm9sICo6YmVmb3JlLFxudHJhZmZpYy1jb250cm9sICo6YWZ0ZXIge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG50cmFmZmljLWNvbnRyb2wge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIHotaW5kZXg6IDEwMDAwO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWJhciB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHRhYmxlLWxheW91dDogZml4ZWQ7XG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBjb2xvcjogIzAwMDtcbiAgdHJhbnNpdGlvbjogYWxsIC4ycyBlYXNlO1xufVxuXG50cmFmZmljLWNvbnRyb2wuaXMtbG9hZGluZyAudGMtYmFyIHtcbiAgYmFja2dyb3VuZDogI2VlZTtcbiAgY29sb3I6ICNjY2M7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYmFyLmlzLWVudGVyaW5nIHtcbiAgYW5pbWF0aW9uOiBzbGlkZUluRG93biAuNnMgZWFzZSBib3RoO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2Uge1xuICBkaXNwbGF5OiB0YWJsZS1jZWxsO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uIHtcbiAgZGlzcGxheTogdGFibGUtY2VsbDtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwcHg7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtY2xvc2Uge1xuICBkaXNwbGF5OiB0YWJsZS1jZWxsO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiA2MHB4O1xuICBib3JkZXItbGVmdDogMXB4IHNvbGlkICNlZWU7XG4gIHRyYW5zaXRpb246IGFsbCAuMnMgZWFzZTtcbn1cblxudHJhZmZpYy1jb250cm9sLmlzLWxvYWRpbmcgLnRjLWNsb3NlIHtcbiAgYm9yZGVyLWNvbG9yOiAjY2NjO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLXRleHQge1xuICBmb250LXNpemU6IDE0cHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgcGFkZGluZzogMTZweDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1sb2FkaW5nIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgb3BhY2l0eTogMDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1sb2FkaW5nLmlzLWVudGVyaW5nIHtcbiAgYW5pbWF0aW9uOiBib3VuY2VGYWRlSW5MZWZ0IC42cyBjdWJpYy1iZXppZXIoMC4xOSwgMSwgMC4yMiwgMSkgYm90aDtcbiAgYW5pbWF0aW9uLWRlbGF5OiAuM3M7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tc3luY2hyb25pemVkIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1kaXZlcmdlZCB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tdW5hdXRob3JpemVkIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1haGVhZCB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1kZXBsb3kge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWFjdGlvbi0taW5mbyB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1hdXRob3JpemUge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWNsb3NlLS1idXR0b24ge1xuICBkaXNwbGF5OiBub25lO1xuICBtYXJnaW46IDAgYXV0bztcbiAgcGFkZGluZzogMTZweDtcbiAgd2lkdGg6IDEwMCU7XG4gIGJvcmRlcjogbm9uZTtcbiAgb3V0bGluZTogbm9uZTtcbiAgYmFja2dyb3VuZDogbm9uZTtcbiAgY29sb3I6ICNlZWU7XG4gIGZvbnQtc2l6ZTogMjRweDtcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGhlaWdodDogMTAwJTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0cmFuc2l0aW9uOiBhbGwgLjJzIGVhc2U7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxudHJhZmZpYy1jb250cm9sLmlzLWxvYWRpbmcgLnRjLWNsb3NlLS1idXR0b24ge1xuICBib3JkZXItY29sb3I6ICNjY2M7XG4gIGNvbG9yOiAjY2NjO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWNsb3NlLS1idXR0b24uaXMtZW50ZXJpbmcge1xuICBhbmltYXRpb246IGJvdW5jZUZhZGVJblJpZ2h0IC42cyBjdWJpYy1iZXppZXIoMC4xOSwgMSwgMC4yMiwgMSkgYm90aDtcbiAgYW5pbWF0aW9uLWRlbGF5OiAuM3M7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYmFyLmlzLWFjdGl2ZSB7XG4gIGRpc3BsYXk6IHRhYmxlO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLWxvYWRpbmcuaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIG9wYWNpdHk6IDE7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tc3luY2hyb25pemVkLmlzLWFjdGl2ZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLWRpdmVyZ2VkLmlzLWFjdGl2ZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLXVuYXV0aG9yaXplZC5pcy1hY3RpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1haGVhZC5pcy1hY3RpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWRlcGxveS5pcy1hY3RpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWluZm8uaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1hdXRob3JpemUuaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtY2xvc2UtLWJ1dHRvbi5pcy1hY3RpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuQGtleWZyYW1lcyBib3VuY2VGYWRlSW5SaWdodCB7XG4gIDAlIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDAlKTtcbiAgfVxuICA1MCUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0yNSUpO1xuICB9XG4gIDEwMCUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDApO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlRmFkZUluTGVmdCB7XG4gIDAlIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAwJSk7XG4gIH1cbiAgNTAlIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyNSUpO1xuICB9XG4gIDEwMCUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDApO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgc2xpZGVJbkRvd24ge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xMDAlKVxuICB9XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKVxuICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxuLy8gYW5pbWF0aW9uczogaHR0cDovL2pzYmluLmNvbS9yaWJpdmV0dXRhL2VkaXQ/Y3NzLGpzLG91dHB1dFxuXG5pbXBvcnQgYXNzaWduIGZyb20gJ2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduJ1xuaW1wb3J0IGluaXRpYWxNYXJrdXAgZnJvbSAnLi90ZW1wbGF0ZS5odG1sJ1xuaW1wb3J0IHN0eWxlcyBmcm9tICcuL3N0eWxlcy5jc3MnXG5cbi8qKlxuICpcbiAqL1xuY2xhc3MgVHJhZmZpY0NvbnRyb2wge1xuICAvKipcbiAgICogW2NvbnN0cnVjdG9yIGRlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IG9wdHMgPSAgICAgICAgICAgICB7fSBbZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBjb25zdHJ1Y3RvciAob3B0cyA9IHt9KSB7XG4gICAgdGhpcy5vcHRzID0gYXNzaWduKHt9LCB0aGlzLl9nZXREZWZhdWx0T3B0cygpLCBvcHRzKVxuICAgIHRoaXMuX3ZhbGlkYXRlT3B0cyh0aGlzLm9wdHMpXG4gICAgdGhpcy5faW5pdCgpXG4gIH1cblxuICAvKipcbiAgICogW19nZXREZWZhdWx0T3B0cyBkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBfZ2V0RGVmYXVsdE9wdHMgKCkge1xuICAgIHJldHVybiB7XG4gICAgICBzdGFnaW5nQnJhbmNoOiAnZGV2ZWxvcCcsXG4gICAgICBwcm9kdWN0aW9uQnJhY2g6ICdtYXN0ZXInLFxuICAgICAgZ2hBUEk6ICdodHRwczovL2FwaS5naXRodWIuY29tJyxcbiAgICAgIGNvbnRhaW5lckVsOiBkb2N1bWVudC5ib2R5XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFtfdmFsaWRhdGVPcHRzIGRlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IG9wdHMgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgX3ZhbGlkYXRlT3B0cyAob3B0cykge1xuICAgIGlmIChvcHRzLnJlcG8gPT0gbnVsbCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgbmVlZCB0byBzcGVjaWZ5IGEgcmVwb3NpdG9yeS4nKVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBbX2luaXQgZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgX2luaXQgKCkge1xuICAgIHRoaXMuX2FkZENzcyhzdHlsZXMpXG4gICAgdGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RyYWZmaWMtY29udHJvbCcpXG4gICAgdGhpcy5lbC5pbm5lckhUTUwgPSBpbml0aWFsTWFya3VwXG4gICAgdGhpcy5lbHMgPSB7XG4gICAgICBiYXI6IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGMtYmFyJylbMF0sXG4gICAgICBsb2FkaW5nTXNnOiB0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RjLW1lc3NhZ2UtLWxvYWRpbmcnKVswXSxcbiAgICAgIHN5bmNlZE1zZzogdGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0Yy1tZXNzYWdlLS1zeW5jaHJvbml6ZWQnKVswXSxcbiAgICAgIGFoZWFkTXNnOiB0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RjLW1lc3NhZ2UtLWFoZWFkJylbMF0sXG4gICAgICBkaXZlcmdlZE1zZzogdGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0Yy1tZXNzYWdlLS1kaXZlcmdlZCcpWzBdLFxuICAgICAgdW5hdXRoZWRNc2c6IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGMtbWVzc2FnZS0tdW5hdXRob3JpemVkJylbMF0sXG4gICAgICBkZXBsb3lCdG46IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGMtYWN0aW9uLS1kZXBsb3knKVswXSxcbiAgICAgIGF1dGhCdG46IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGMtYWN0aW9uLS1hdXRob3JpemUnKVswXSxcbiAgICAgIGluZm9CdG46IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGMtYWN0aW9uLS1pbmZvJylbMF0sXG4gICAgICBjbG9zZUJ0bjogdGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0Yy1jbG9zZS0tYnV0dG9uJylbMF1cbiAgICB9XG4gICAgdGhpcy5vcHRzLmNvbnRhaW5lckVsLmFwcGVuZENoaWxkKHRoaXMuZWwpXG4gICAgdGhpcy5hbmltYXRlSW4odGhpcy5lbHMuYmFyLCAoKSA9PiB7XG4gICAgICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2lzLWxvYWRpbmcnKVxuICAgIH0pXG4gICAgdGhpcy5hbmltYXRlSW4odGhpcy5lbHMubG9hZGluZ01zZylcbiAgICB0aGlzLmFuaW1hdGVJbih0aGlzLmVscy5jbG9zZUJ0bilcbiAgfVxuXG4gIC8qKlxuICAgKiBbX2FkZENzcyBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtIHtbdHlwZV19IGNzcyBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBfYWRkQ3NzIChjc3MpIHtcbiAgICBjb25zdCBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJylcbiAgICBjb25zdCBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdXG4gICAgc3R5bGUudHlwZSA9ICd0ZXh0L2NzcydcbiAgICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzXG4gICAgfSBlbHNlIHtcbiAgICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpXG4gICAgfVxuICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpXG4gIH1cblxuICAvKipcbiAgICogW2FuaW1hdGVJbiBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBlbCAgICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gYWZ0ZXIgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGFuaW1hdGVJbiAoZWwsIGFmdGVyLCBkZWxheSA9IDApIHtcbiAgICBsZXQgaXNBbmltYXRlZCA9IGZhbHNlXG4gICAgY29uc3Qgc3RhcnRDYiA9ICgpID0+IHtcbiAgICAgIGlzQW5pbWF0ZWQgPSB0cnVlXG4gICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGFuaW1hdGlvblN0YXJ0LCBzdGFydENiKVxuICAgIH1cbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKGFuaW1hdGlvblN0YXJ0LCBzdGFydENiLCBmYWxzZSlcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdpcy1hY3RpdmUnKVxuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2lzLWVudGVyaW5nJylcbiAgICBpZiAoYWZ0ZXIgJiYgdHlwZW9mIGFmdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAoaXNBbmltYXRlZCkge1xuICAgICAgICBjb25zdCBjYWxsQWZ0ZXIgPSAoKSA9PiB7XG4gICAgICAgICAgc2V0VGltZW91dChhZnRlciwgZGVsYXkpXG4gICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmQsIGNhbGxBZnRlcilcbiAgICAgICAgfVxuICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGFuaW1hdGlvbkVuZCwgY2FsbEFmdGVyLCBmYWxzZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRpbWVvdXQoYWZ0ZXIsIGRlbGF5KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBbYW5pbWF0ZU91dCBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBlbCAgICBbZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gYWZ0ZXIgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGFuaW1hdGVPdXQgKGVsLCBhZnRlciwgZGVsYXkgPSAwKSB7XG4gICAgbGV0IGlzQW5pbWF0ZWQgPSBmYWxzZVxuICAgIGNvbnN0IHN0YXJ0Q2IgPSAoKSA9PiB7XG4gICAgICBpc0FuaW1hdGVkID0gdHJ1ZVxuICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihhbmltYXRpb25TdGFydCwgc3RhcnRDYilcbiAgICB9XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihhbmltYXRpb25TdGFydCwgc3RhcnRDYiwgZmFsc2UpXG4gICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtZW50ZXJpbmcnKVxuICAgIGVsLmNsYXNzTGlzdC5hZGQoJ2lzLWxlYXZpbmcnKVxuICAgIGlmIChpc0FuaW1hdGVkKSB7XG4gICAgICBjb25zdCBjYiA9ICgpID0+IHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtbGVhdmluZycpXG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpXG4gICAgICAgIGlmIChhZnRlciAmJiB0eXBlb2YgYWZ0ZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBzZXRUaW1lb3V0KGFmdGVyLCAyMDAgKyBkZWxheSlcbiAgICAgICAgfVxuICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGFuaW1hdGlvbkVuZCwgY2IpXG4gICAgICB9XG4gICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGFuaW1hdGlvbkVuZCwgY2IsIGZhbHNlKVxuICAgIH0gZWxzZSB7XG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1sZWF2aW5nJylcbiAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpXG4gICAgICBpZiAoYWZ0ZXIgJiYgdHlwZW9mIGFmdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoYWZ0ZXIsIGRlbGF5KVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG59XG5cbi8qKlxuICogW2Rlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSAoIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICBbZGVzY3JpcHRpb25dXG4gKi9cbnZhciBhbmltYXRpb25FbmQgPSAoKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zha2VlbGVtZW50JylcbiAgY29uc3QgYW5pbWF0aW9ucyA9IHtcbiAgICAnYW5pbWF0aW9uJzogJ2FuaW1hdGlvbmVuZCcsXG4gICAgJ09BbmltYXRpb24nOiAnb2FuaW1hdGlvbmVuZCcsXG4gICAgJ01vekFuaW1hdGlvbic6ICdhbmltYXRpb25lbmQnLFxuICAgICdXZWJraXRBbmltYXRpb24nOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAnTVNBbmltYXRpb24nOiAnTVNBbmltYXRpb25FbmQnXG4gIH1cbiAgZm9yIChsZXQgdCBpbiBhbmltYXRpb25zKSB7XG4gICAgaWYgKCFlbC5zdHlsZVt0XSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gYW5pbWF0aW9uc1t0XVxuICAgIH1cbiAgfVxufSkoKVxuXG4vKipcbiAqIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gKCBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgW2Rlc2NyaXB0aW9uXVxuICovXG52YXIgYW5pbWF0aW9uU3RhcnQgPSAoKCkgPT4ge1xuICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zha2VlbGVtZW50JylcbiAgY29uc3QgYW5pbWF0aW9ucyA9IHtcbiAgICAnYW5pbWF0aW9uJzogJ2FuaW1hdGlvbnN0YXJ0JyxcbiAgICAnT0FuaW1hdGlvbic6ICdvYW5pbWF0aW9uc3RhcnQnLFxuICAgICdNb3pBbmltYXRpb24nOiAnYW5pbWF0aW9uc3RhcnQnLFxuICAgICdXZWJraXRBbmltYXRpb24nOiAnd2Via2l0QW5pbWF0aW9uU3RhcnQnLFxuICAgICdNU0FuaW1hdGlvbic6ICdNU0FuaW1hdGlvblN0YXJ0J1xuICB9XG4gIGZvciAobGV0IHQgaW4gYW5pbWF0aW9ucykge1xuICAgIGlmICghZWwuc3R5bGVbdF0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGFuaW1hdGlvbnNbdF1cbiAgICB9XG4gIH1cbn0pKClcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJhZmZpY0NvbnRyb2wgKG9wdHMpIHtcblxuICByZXR1cm4gbmV3IFRyYWZmaWNDb250cm9sKG9wdHMpXG5cbiAgb3B0cyA9IG9wdHMgfHwge31cbiAgb3B0cy5HSF9BUEkgPSBvcHRzLkdIX0FQSSB8fCAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbSdcbiAgb3B0cy5zdGFnaW5nQnJhbmNoID0gb3B0cy5zdGFnaW5nQnJhbmNoIHx8ICdkZXZlbG9wJ1xuICBvcHRzLnByb2R1Y3Rpb25CcmFuY2ggPSBvcHRzLnByb2R1Y3Rpb25CcmFuY2ggfHwgJ21hc3RlcidcblxuICBpZiAob3B0cy5yZXBvID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBuZWVkIHRvIHNwZWNpZnkgYSByZXBvc2l0b3J5LicpXG4gIH1cblxuICB2YXIgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF1cbiAgdmFyIGJhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpXG4gIGJhci5pZCA9ICdzdGFnaW5nLWJhcidcbiAgYmFyLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICcjZWVlJ1xuICBiYXIuc3R5bGUuY29sb3IgPSAnIzIyMidcbiAgYmFyLnN0eWxlLmZvbnRGYW1pbHkgPSAnc2Fucy1zZXJpZidcbiAgYmFyLnN0eWxlLnBhZGRpbmcgPSAnMTZweCA4cHgnXG4gIGJhci5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCdcbiAgYmFyLnN0eWxlLnRvcCA9ICcwJ1xuICBiYXIuc3R5bGUud2lkdGggPSAnMTAwJSdcbiAgYmFyLmlubmVyVGV4dCA9ICdMb2FkaW5nLi4uJ1xuICBib2R5Lmluc2VydEJlZm9yZShiYXIsIGJvZHkuZmlyc3RDaGlsZClcblxuICBmdW5jdGlvbiBpbml0ICgpIHtcbiAgICB2YXIgJCA9IHdpbmRvdy4kXG4gICAgdmFyIGxvY2FsU3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2VcbiAgICB2YXIgbmV0bGlmeSA9IHdpbmRvdy5uZXRsaWZ5XG5cbiAgICB2YXIgJGJvZHkgPSAkKGJvZHkpXG4gICAgdmFyICRiYXIgPSAkKCcjc3RhZ2luZy1iYXInKVxuICAgIHZhciAkbXNnID0gJCgnPGRpdiAvPicpXG5cbiAgICBmdW5jdGlvbiBiYXIgKCkge1xuICAgICAgaWYgKCFsb2NhbFN0b3JhZ2UuZ2hfdG9rZW4pIHtcbiAgICAgICAgJGJhci5lbXB0eSgpXG4gICAgICAgIHZhciAkYXV0aEJ0biA9ICQoJzxidXR0b24+QXV0aG9yaXplPC9idXR0b24+JylcbiAgICAgICAgJG1zZy50ZXh0KCdZb3UgYXJlIHZpZXdpbmcgdGhlIHN0YWdpbmcgc2l0ZSwgYnV0IHlvdSBjYW5ub3QgZGVwbG95IG9yIHZpZXcgY2hhbmdlcyB1bnRpbCB5b3UgYXV0aG9yaXplIHJlYWQvd3JpdGUgYWNjZXNzIHRvIHlvdXIgR2l0aHViIHJlcG9zaXRvcnkuJylcbiAgICAgICAgJGJhci5hcHBlbmQoJG1zZylcbiAgICAgICAgJGJhci5jc3Moe1xuICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNFMDJEMkQnLFxuICAgICAgICAgIGNvbG9yOiAnd2hpdGUnXG4gICAgICAgIH0pXG4gICAgICAgICRiYXIuYXBwZW5kKCRhdXRoQnRuKVxuICAgICAgICAkYm9keS5wcmVwZW5kKCRiYXIpXG4gICAgICAgICRhdXRoQnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBuZXRsaWZ5LmF1dGhlbnRpY2F0ZSh7IHByb3ZpZGVyOiAnZ2l0aHViJywgc2NvcGU6ICdyZXBvJyB9LCBmdW5jdGlvbiAoZXJyLCBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBhdXRoZW50aWNhdGluZzogJXMnLCBlcnIubWVzc2FnZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZS5naF90b2tlbiA9IGRhdGEudG9rZW5cbiAgICAgICAgICAgIGJhcigpXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQuZ2V0SlNPTihvcHRzLkdIX0FQSSArICcvcmVwb3MvJyArIG9wdHMucmVwbyArICcvY29tcGFyZS8nICsgb3B0cy5wcm9kdWN0aW9uQnJhbmNoICsgJy4uLicgKyBvcHRzLnN0YWdpbmdCcmFuY2ggKyAnZGV2ZWxvcD9hY2Nlc3NfdG9rZW49JyArIGxvY2FsU3RvcmFnZS5naF90b2tlbiwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAkYmFyLmVtcHR5KClcbiAgICAgICAgICB2YXIgJGRlcGxveUJ0biA9ICQoJzxidXR0b24+RGVwbG95PC9idXR0b24+JylcbiAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT09ICdhaGVhZCcpIHtcbiAgICAgICAgICAgIHZhciBoYXZlID0gZGF0YS5haGVhZF9ieSA+IDEgPyAnaGF2ZScgOiAnaGFzJ1xuICAgICAgICAgICAgdmFyIGNoYW5nZXMgPSBkYXRhLmFoZWFkX2J5ID4gMSA/ICdjaGFuZ2VzJyA6ICdjaGFuZ2UnXG4gICAgICAgICAgICAkbXNnLmh0bWwoJ1lvdSBhcmUgdmlld2luZyB0aGUgc3RhZ2luZyBzaXRlLiBUaGVyZSAnICsgaGF2ZSArICcgYmVlbiA8YSBocmVmPVwiJyArIGRhdGEucGVybWFsaW5rX3VybCArICdcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nICsgZGF0YS5haGVhZF9ieSArICc8L2E+ICcgKyBjaGFuZ2VzICsgJyBzaW5jZSB0aGUgbGFzdCBwcm9kdWN0aW9uIGJ1aWxkLiDwn5qiJylcbiAgICAgICAgICAgICRiYXIuYXBwZW5kKCRtc2cpXG4gICAgICAgICAgICAkYmFyLmNzcyh7XG4gICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNCOEQ1RTknLFxuICAgICAgICAgICAgICBjb2xvcjogJyMyMjInXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgJGJhci5hcHBlbmQoJGRlcGxveUJ0bilcbiAgICAgICAgICAgICRib2R5LnByZXBlbmQoJGJhcilcbiAgICAgICAgICAgICRkZXBsb3lCdG4ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAkLnBvc3Qob3B0cy5HSF9BUEkgKyAnL3JlcG9zLycgKyBvcHRzLnJlcG8gKyAnL21lcmdlcz9hY2Nlc3NfdG9rZW49JyArIGxvY2FsU3RvcmFnZS5naF90b2tlbiwgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIGJhc2U6ICdtYXN0ZXInLFxuICAgICAgICAgICAgICAgIGhlYWQ6ICdkZXZlbG9wJyxcbiAgICAgICAgICAgICAgICBjb21taXRfbWVzc2FnZTogJzp2ZXJ0aWNhbF90cmFmZmljX2xpZ2h0OiBQcm9kdWN0aW9uIGRlcGxveSB0cmlnZ2VyZWQgZnJvbSB0cmFmZmljLWNvbnRyb2wnXG4gICAgICAgICAgICAgIH0pLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgYmFyKClcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnN0YXR1cyA9PT0gJ2RpdmVyZ2VkJykge1xuICAgICAgICAgICAgdmFyIGNvbW1pdHMgPSBkYXRhLmJlaGluZF9ieSA+IDEgPyAnY29tbWl0cycgOiAnY29tbWl0J1xuICAgICAgICAgICAgJG1zZy5odG1sKCdZb3UgYXJlIHZpZXdpbmcgdGhlIHN0YWdpbmcgc2l0ZS4gU3RhZ2luZyBoYXMgZGl2ZXJnZWQgYmVoaW5kIHByb2R1Y3Rpb24gYnkgPGEgaHJlZj1cIicgKyBkYXRhLnBlcm1hbGlua191cmwgKyAnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+JyArIGRhdGEuYmVoaW5kX2J5ICsgJzwvYT4gJyArIGNvbW1pdHMgKyAnLiBQbGVhc2UgcmViYXNlLicpXG4gICAgICAgICAgICAkYmFyLmFwcGVuZCgkbXNnKVxuICAgICAgICAgICAgJGJhci5jc3Moe1xuICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICdvcmFuZ2UnLFxuICAgICAgICAgICAgICBjb2xvcjogJyMyMjInXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgJGJvZHkucHJlcGVuZCgkYmFyKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbXNnLnRleHQoJ1lvdSBhcmUgdmlld2luZyB0aGUgc3RhZ2luZyBzaXRlLiBFdmVyeXRoaW5nIGlzIGluIHN5bmMsIHByb2R1Y3Rpb24gaXMgZXZlbiB3aXRoIHN0YWdpbmcuIPCfkYwnKVxuICAgICAgICAgICAgJGJhci5hcHBlbmQoJG1zZylcbiAgICAgICAgICAgICRiYXIuY3NzKHtcbiAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnI0JBRTlCOCcsXG4gICAgICAgICAgICAgIGNvbG9yOiAnIzIyMidcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAkYm9keS5wcmVwZW5kKCRiYXIpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgICBiYXIoKVxuICB9XG5cbiAgZnVuY3Rpb24gY29uZGl0aW9uYWxseUxvYWRKUXVlcnkgKCkge1xuICAgIHZhciBqUXVlcnkgPSB3aW5kb3cualF1ZXJ5XG4gICAgdmFyIHByb3RvY29sID0gJy8vJ1xuICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcygnZmlsZTovLycpKSB7XG4gICAgICBwcm90b2NvbCA9ICdodHRwczovLydcbiAgICB9XG4gICAgaWYgKCEodHlwZW9mIGpRdWVyeSAhPT0gJ3VuZGVmaW5lZCcgJiYgalF1ZXJ5ICE9PSBudWxsKSkge1xuICAgICAgdmFyIGpRID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgIGpRLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0J1xuICAgICAgalEub25sb2FkID0galEub25yZWFkeXN0YXRlY2hhbmdlID0gaW5pdFxuICAgICAgalEuc3JjID0gcHJvdG9jb2wgKyAnY29kZS5qcXVlcnkuY29tL2pxdWVyeS0yLjIuNC5taW4uanMnXG4gICAgICByZXR1cm4gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChqUSlcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGluaXQoKVxuICAgIH1cbiAgfTtcblxuICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGNvbmRpdGlvbmFsbHlMb2FkSlF1ZXJ5LCBmYWxzZSlcbiAgfSBlbHNlIGlmICh3aW5kb3cuYXR0YWNoRXZlbnQpIHtcbiAgICB3aW5kb3cuYXR0YWNoRXZlbnQoJ29ubG9hZCcsIGNvbmRpdGlvbmFsbHlMb2FkSlF1ZXJ5KVxuICB9XG59XG4iXSwibmFtZXMiOlsicmVxdWlyZSQkMCIsInJlcXVpcmUkJDEiLCJyZXF1aXJlJCQyIiwicmVxdWlyZSQkMyIsImFzc2lnbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLEVBQUEsSUFBSSxPQUFPLE9BQU8sT0FBUCxHQUFpQixFQUFDLFNBQVMsT0FBVixFQUE1QjtBQUNBLEVBQUEsSUFBRyxPQUFPLEdBQVAsSUFBYyxRQUFqQixFQUEwQixNQUFNLElBQU47Ozs7OztBQ0QxQixFQUFBLE9BQU8sT0FBUCxHQUFpQixVQUFTLElBQVQsRUFBYztRQUN6QjthQUNLLENBQUMsQ0FBQyxNQUFUO0tBREYsQ0FFRSxPQUFNLENBQU4sRUFBUTthQUNELElBQVA7O0dBSko7Ozs7OztBQ0FBLEVBQUEsSUFBSSxXQUFXLEdBQUcsUUFBbEI7O0FBRUEsRUFBQSxPQUFPLE9BQVAsR0FBaUIsVUFBUyxFQUFULEVBQVk7V0FDcEIsU0FBUyxJQUFULENBQWMsRUFBZCxFQUFrQixLQUFsQixDQUF3QixDQUF4QixFQUEyQixDQUFDLENBQTVCLENBQVA7R0FERjs7Ozs7OztBQ0RBLEVBQUEsSUFBSSxNQUFNQSxZQUFWO0FBQ0EsRUFBQSxPQUFPLE9BQVAsR0FBaUIsT0FBTyxHQUFQ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