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