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

  var styles = "/*\n  Note: there is a lot of repetition going on in this CSS.\n  This is intentional, in order to keep specificity low\n  enough that custom styles are easier to implement.\n */\n\ntraffic-control,\ntraffic-control *,\ntraffic-control *:before,\ntraffic-control *:after {\n  box-sizing: border-box;\n}\n\ntraffic-control {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  z-index: 10000;\n}\n\ntraffic-control .tc-bar {\n  display: none;\n  width: 100%;\n  height: 100%;\n  table-layout: fixed;\n  font-family: sans-serif;\n  background: #fff;\n  color: #000;\n  transition: all .2s ease;\n}\n\ntraffic-control.is-loading .tc-bar {\n  background: #eee;\n  color: #aaa;\n}\n\ntraffic-control .tc-bar.is-entering {\n  animation: slideInDown .6s ease both;\n}\n\ntraffic-control .tc-message {\n  display: table-cell;\n  vertical-align: middle;\n  height: 100%;\n}\n\ntraffic-control .tc-action {\n  display: table-cell;\n  vertical-align: middle;\n  height: 100%;\n  width: 100px;\n}\n\ntraffic-control .tc-close {\n  display: table-cell;\n  vertical-align: middle;\n  height: 100%;\n  width: 60px;\n  border-left: 1px solid #eee;\n  transition: all .2s ease;\n}\n\ntraffic-control.is-loading .tc-close {\n  border-color: #ccc;\n}\n\ntraffic-control .tc-message--text {\n  font-size: 14px;\n  position: relative;\n  padding: 16px;\n}\n\ntraffic-control .tc-message--loading {\n  display: none;\n  opacity: 0;\n}\n\ntraffic-control .tc-message--loading.is-entering {\n  animation: bounceFadeInLeft .6s cubic-bezier(0.19, 1, 0.22, 1) both;\n  animation-delay: .3s;\n}\n\ntraffic-control .tc-message--synchronized {\n  display: none;\n}\n\ntraffic-control .tc-message--diverged {\n  display: none;\n}\n\ntraffic-control .tc-message--unauthorized {\n  display: none;\n}\n\ntraffic-control .tc-message--ahead {\n  display: none;\n}\n\ntraffic-control .tc-action--deploy {\n  display: none;\n}\n\ntraffic-control .tc-action--info {\n  display: none;\n}\n\ntraffic-control .tc-action--authorize {\n  display: none;\n}\n\ntraffic-control .tc-close--button {\n  display: none;\n  margin: 0 auto;\n  padding: 16px;\n  width: 100%;\n  border: none;\n  outline: none;\n  background: none;\n  color: #eee;\n  font-size: 24px;\n  font-family: Arial, sans-serif;\n  cursor: pointer;\n  height: 100%;\n  position: relative;\n  transition: all .2s ease;\n  text-align: center;\n}\n\ntraffic-control.is-loading .tc-close--button {\n  border-color: #ccc;\n  color: #ccc;\n}\n\ntraffic-control .tc-close--button.is-entering {\n  animation: bounceFadeInRight .6s cubic-bezier(0.19, 1, 0.22, 1) both;\n  animation-delay: .3s;\n}\n\ntraffic-control .tc-bar.is-active {\n  display: table;\n}\n\ntraffic-control .tc-message--loading.is-active {\n  display: block;\n  opacity: 1;\n}\n\ntraffic-control .tc-message--synchronized.is-active {\n  display: block;\n}\n\ntraffic-control .tc-message--diverged.is-active {\n  display: block;\n}\n\ntraffic-control .tc-message--unauthorized.is-active {\n  display: block;\n}\n\ntraffic-control .tc-message--ahead.is-active {\n  display: block;\n}\n\ntraffic-control .tc-action--deploy.is-active {\n  display: block;\n}\n\ntraffic-control .tc-action--info.is-active {\n  display: block;\n}\n\ntraffic-control .tc-action--authorize.is-active {\n  display: block;\n}\n\ntraffic-control .tc-close--button.is-active {\n  display: block;\n}\n\n@keyframes bounceFadeInRight {\n  0% {\n    opacity: 0;\n    transform: translateX(100%);\n  }\n  50% {\n    opacity: 1;\n    transform: translateX(-25%);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n@keyframes bounceFadeInLeft {\n  0% {\n    opacity: 0;\n    transform: translateX(-100%);\n  }\n  50% {\n    opacity: 1;\n    transform: translateX(25%);\n  }\n  100% {\n    opacity: 1;\n    transform: translateX(0);\n  }\n}\n\n@keyframes slideInDown {\n  0% {\n    transform: translateY(-100%)\n  }\n  100% {\n    transform: translateY(0)\n  }\n}\n";

  /**
   * [trafficControl description]
   * @param  {[type]} opts [description]
   * @return {[type]}      [description]
   */
  function trafficControl(opts) {
    var netlify = window.netlify;

    /**
     * [description]
     * @return {[type]} [description]
     */
    var init = function init() {
      return new TrafficControl(opts);
    };

    /**
     * [description]
     * @return {[type]} [description]
     */
    var conditionallyLoadNetlify = function conditionallyLoadNetlify() {
      if (netlify == null) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onload = script.onreadystatechange = init;
        script.src = 'https://app.netlify.com/authentication.js';
        return document.body.appendChild(script);
      } else {
        return init();
      }
    };

    if (window.addEventListener) {
      window.addEventListener('load', conditionallyLoadNetlify, false);
    } else if (window.attachEvent) {
      window.attachEvent('onload', conditionallyLoadNetlify);
    }
  }

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
        this.el.id = 'traffic-control';
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

  // function trafficControl2 (opts) {
  //
  //   opts = opts || {}
  //   opts.GH_API = opts.GH_API || 'https://api.github.com'
  //   opts.stagingBranch = opts.stagingBranch || 'develop'
  //   opts.productionBranch = opts.productionBranch || 'master'
  //
  //   if (opts.repo == null) {
  //     throw new Error('You need to specify a repository.')
  //   }
  //
  //   var body = document.getElementsByTagName('body')[0]
  //   var bar = document.createElement('div')
  //   bar.id = 'staging-bar'
  //   bar.style.backgroundColor = '#eee'
  //   bar.style.color = '#222'
  //   bar.style.fontFamily = 'sans-serif'
  //   bar.style.padding = '16px 8px'
  //   bar.style.position = 'fixed'
  //   bar.style.top = '0'
  //   bar.style.width = '100%'
  //   bar.innerText = 'Loading...'
  //   body.insertBefore(bar, body.firstChild)
  //
  //   function init () {
  //     var $ = window.$
  //     var localStorage = window.localStorage
  //     var netlify = window.netlify
  //
  //     var $body = $(body)
  //     var $bar = $('#staging-bar')
  //     var $msg = $('<div />')
  //
  //     function bar () {
  //       if (!localStorage.gh_token) {
  //         $bar.empty()
  //         var $authBtn = $('<button>Authorize</button>')
  //         $msg.text('You are viewing the staging site, but you cannot deploy or view changes until you authorize read/write access to your Github repository.')
  //         $bar.append($msg)
  //         $bar.css({
  //           backgroundColor: '#E02D2D',
  //           color: 'white'
  //         })
  //         $bar.append($authBtn)
  //         $body.prepend($bar)
  //         $authBtn.on('click', function () {
  //           netlify.authenticate({ provider: 'github', scope: 'repo' }, function (err, data) {
  //             if (err) {
  //               console.log('Error authenticating: %s', err.message)
  //             }
  //             localStorage.gh_token = data.token
  //             bar()
  //           })
  //         })
  //       } else {
  //         $.getJSON(opts.GH_API + '/repos/' + opts.repo + '/compare/' + opts.productionBranch + '...' + opts.stagingBranch + 'develop?access_token=' + localStorage.gh_token, function (data) {
  //           $bar.empty()
  //           var $deployBtn = $('<button>Deploy</button>')
  //           if (data.status === 'ahead') {
  //             var have = data.ahead_by > 1 ? 'have' : 'has'
  //             var changes = data.ahead_by > 1 ? 'changes' : 'change'
  //             $msg.html('You are viewing the staging site. There ' + have + ' been <a href="' + data.permalink_url + '" target="_blank">' + data.ahead_by + '</a> ' + changes + ' since the last production build. 🚢')
  //             $bar.append($msg)
  //             $bar.css({
  //               backgroundColor: '#B8D5E9',
  //               color: '#222'
  //             })
  //             $bar.append($deployBtn)
  //             $body.prepend($bar)
  //             $deployBtn.on('click', function () {
  //               $.post(opts.GH_API + '/repos/' + opts.repo + '/merges?access_token=' + localStorage.gh_token, JSON.stringify({
  //                 base: 'master',
  //                 head: 'develop',
  //                 commit_message: ':vertical_traffic_light: Production deploy triggered from traffic-control'
  //               }), function () {
  //                 bar()
  //               })
  //             })
  //           } else if (data.status === 'diverged') {
  //             var commits = data.behind_by > 1 ? 'commits' : 'commit'
  //             $msg.html('You are viewing the staging site. Staging has diverged behind production by <a href="' + data.permalink_url + '" target="_blank">' + data.behind_by + '</a> ' + commits + '. Please rebase.')
  //             $bar.append($msg)
  //             $bar.css({
  //               backgroundColor: 'orange',
  //               color: '#222'
  //             })
  //             $body.prepend($bar)
  //           } else {
  //             $msg.text('You are viewing the staging site. Everything is in sync, production is even with staging. 👌')
  //             $bar.append($msg)
  //             $bar.css({
  //               backgroundColor: '#BAE9B8',
  //               color: '#222'
  //             })
  //             $body.prepend($bar)
  //           }
  //         })
  //       }
  //     }
  //     bar()
  //   }
  //
  //   function conditionallyLoadJQuery () {
  //     var jQuery = window.jQuery
  //     var protocol = '//'
  //     if (window.location.href.includes('file://')) {
  //       protocol = 'https://'
  //     }
  //     if (!(typeof jQuery !== 'undefined' && jQuery !== null)) {
  //       var jQ = document.createElement('script')
  //       jQ.type = 'text/javascript'
  //       jQ.onload = jQ.onreadystatechange = init
  //       jQ.src = protocol + 'code.jquery.com/jquery-2.2.4.min.js'
  //       return document.body.appendChild(jQ)
  //     } else {
  //       return init()
  //     }
  //   };
  //
  //   if (window.addEventListener) {
  //     window.addEventListener('load', conditionallyLoadJQuery, false)
  //   } else if (window.attachEvent) {
  //     window.attachEvent('onload', conditionallyLoadJQuery)
  //   }
  // }

  return trafficControl;

}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhZmZpYy1jb250cm9sLmRldi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kZWZpbmVkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1waWUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL191aWQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2hhcmVkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbnRlZ2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1hc3NpZ24uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZG9tLWNyZWF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faWU4LWRvbS1kZWZpbmUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnbi5qcyIsIi4uL3NyYy90ZW1wbGF0ZS5odG1sIiwiLi4vc3JjL3N0eWxlcy5jc3MiLCIuLi9zcmMvdHJhZmZpYy1jb250cm9sLmpzIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzIuNC4wJ307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59OyIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7IiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sczsiLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXHJcbm1vZHVsZS5leHBvcnRzID0gKFxyXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXHJcbikuc3BsaXQoJywnKTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXydcbiAgLCBzdG9yZSAgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0ge30pO1xufTsiLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKVxyXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcclxuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xyXG59OyIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgID0gTWF0aC5jZWlsXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgbWF4ICAgICAgID0gTWF0aC5tYXhcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaW5kZXgsIGxlbmd0aCl7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59OyIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1pbiAgICAgICA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHRvSW5kZXggICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBlbCwgZnJvbUluZGV4KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I3RvSW5kZXggaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59OyIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciBoYXMgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxyXG4gICwgdG9JT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXHJcbiAgLCBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKVxyXG4gICwgSUVfUFJPVE8gICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIG5hbWVzKXtcclxuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcclxuICAgICwgaSAgICAgID0gMFxyXG4gICAgLCByZXN1bHQgPSBbXVxyXG4gICAgLCBrZXk7XHJcbiAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xyXG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcclxuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XHJcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xyXG4gIH1cclxuICByZXR1cm4gcmVzdWx0O1xyXG59OyIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxyXG52YXIgJGtleXMgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpXHJcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKXtcclxuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xyXG59OyIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBnZXRLZXlzICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BTICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJylcbiAgLCBwSUUgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKVxuICAsIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCBJT2JqZWN0ICA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsICRhc3NpZ24gID0gT2JqZWN0LmFzc2lnbjtcblxuLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG5tb2R1bGUuZXhwb3J0cyA9ICEkYXNzaWduIHx8IHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgdmFyIEEgPSB7fVxuICAgICwgQiA9IHt9XG4gICAgLCBTID0gU3ltYm9sKClcbiAgICAsIEsgPSAnYWJjZGVmZ2hpamtsbW5vcHFyc3QnO1xuICBBW1NdID0gNztcbiAgSy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbihrKXsgQltrXSA9IGs7IH0pO1xuICByZXR1cm4gJGFzc2lnbih7fSwgQSlbU10gIT0gNyB8fCBPYmplY3Qua2V5cygkYXNzaWduKHt9LCBCKSkuam9pbignJykgIT0gSztcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICB2YXIgVCAgICAgPSB0b09iamVjdCh0YXJnZXQpXG4gICAgLCBhTGVuICA9IGFyZ3VtZW50cy5sZW5ndGhcbiAgICAsIGluZGV4ID0gMVxuICAgICwgZ2V0U3ltYm9scyA9IGdPUFMuZlxuICAgICwgaXNFbnVtICAgICA9IHBJRS5mO1xuICB3aGlsZShhTGVuID4gaW5kZXgpe1xuICAgIHZhciBTICAgICAgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSlcbiAgICAgICwga2V5cyAgID0gZ2V0U3ltYm9scyA/IGdldEtleXMoUykuY29uY2F0KGdldFN5bWJvbHMoUykpIDogZ2V0S2V5cyhTKVxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxuICAgICAgLCBqICAgICAgPSAwXG4gICAgICAsIGtleTtcbiAgICB3aGlsZShsZW5ndGggPiBqKWlmKGlzRW51bS5jYWxsKFMsIGtleSA9IGtleXNbaisrXSkpVFtrZXldID0gU1trZXldO1xuICB9IHJldHVybiBUO1xufSA6ICRhc3NpZ247IiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihiaXRtYXAsIHZhbHVlKXtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlICAgIDogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXG4gIH07XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTsiLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBTKXtcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZihTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgaWYoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xyXG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcclxufSk7IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoIWlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07IiwidmFyIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgZFAgICAgICAgICAgICAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKXtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG4gIGlmKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcyl0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZigndmFsdWUnIGluIEF0dHJpYnV0ZXMpT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTsiLCJ2YXIgZFAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYodGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgPSByZXF1aXJlKCcuL19jb3JlJylcbiAgLCBjdHggICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGhpZGUgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgZXhwUHJvdG8gID0gZXhwb3J0c1tQUk9UT1RZUEVdXG4gICAgLCB0YXJnZXQgICAgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdXG4gICAgLCBrZXksIG93biwgb3V0O1xuICBpZihJU19HTE9CQUwpc291cmNlID0gbmFtZTtcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgaWYob3duICYmIGtleSBpbiBleHBvcnRzKWNvbnRpbnVlO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gb3duID8gdGFyZ2V0W2tleV0gOiBzb3VyY2Vba2V5XTtcbiAgICAvLyBwcmV2ZW50IGdsb2JhbCBwb2xsdXRpb24gZm9yIG5hbWVzcGFjZXNcbiAgICBleHBvcnRzW2tleV0gPSBJU19HTE9CQUwgJiYgdHlwZW9mIHRhcmdldFtrZXldICE9ICdmdW5jdGlvbicgPyBzb3VyY2Vba2V5XVxuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgOiBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbClcbiAgICAvLyB3cmFwIGdsb2JhbCBjb25zdHJ1Y3RvcnMgZm9yIHByZXZlbnQgY2hhbmdlIHRoZW0gaW4gbGlicmFyeVxuICAgIDogSVNfV1JBUCAmJiB0YXJnZXRba2V5XSA9PSBvdXQgPyAoZnVuY3Rpb24oQyl7XG4gICAgICB2YXIgRiA9IGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgICBpZih0aGlzIGluc3RhbmNlb2YgQyl7XG4gICAgICAgICAgc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe1xuICAgICAgICAgICAgY2FzZSAwOiByZXR1cm4gbmV3IEM7XG4gICAgICAgICAgICBjYXNlIDE6IHJldHVybiBuZXcgQyhhKTtcbiAgICAgICAgICAgIGNhc2UgMjogcmV0dXJuIG5ldyBDKGEsIGIpO1xuICAgICAgICAgIH0gcmV0dXJuIG5ldyBDKGEsIGIsIGMpO1xuICAgICAgICB9IHJldHVybiBDLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgRltQUk9UT1RZUEVdID0gQ1tQUk9UT1RZUEVdO1xuICAgICAgcmV0dXJuIEY7XG4gICAgLy8gbWFrZSBzdGF0aWMgdmVyc2lvbnMgZm9yIHByb3RvdHlwZSBtZXRob2RzXG4gICAgfSkob3V0KSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5tZXRob2RzLiVOQU1FJVxuICAgIGlmKElTX1BST1RPKXtcbiAgICAgIChleHBvcnRzLnZpcnR1YWwgfHwgKGV4cG9ydHMudmlydHVhbCA9IHt9KSlba2V5XSA9IG91dDtcbiAgICAgIC8vIGV4cG9ydCBwcm90byBtZXRob2RzIHRvIGNvcmUuJUNPTlNUUlVDVE9SJS5wcm90b3R5cGUuJU5BTUUlXG4gICAgICBpZih0eXBlICYgJGV4cG9ydC5SICYmIGV4cFByb3RvICYmICFleHBQcm90b1trZXldKWhpZGUoZXhwUHJvdG8sIGtleSwgb3V0KTtcbiAgICB9XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgIFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0OyIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHthc3NpZ246IHJlcXVpcmUoJy4vX29iamVjdC1hc3NpZ24nKX0pOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24nKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5hc3NpZ247IiwiPGRpdiBjbGFzcz1cInRjLWJhclwiPlxuICA8ZGl2IGNsYXNzPVwidGMtbWVzc2FnZVwiPlxuICAgIDxkaXYgY2xhc3M9XCJ0Yy1jb250YWluZXJcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0Yy1tZXNzYWdlLS10ZXh0IHRjLW1lc3NhZ2UtLWxvYWRpbmdcIj5cbiAgICAgICAgTG9hZGluZy4uLlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwidGMtbWVzc2FnZS0tdGV4dCB0Yy1tZXNzYWdlLS1zeW5jaHJvbml6ZWRcIj5cbiAgICAgICAgWW91IGFyZSB2aWV3aW5nIHRoZSBzdGFnaW5nIHNpdGUuXG4gICAgICAgIEV2ZXJ5dGhpbmcgaXMgaW4gc3luYywgcHJvZHVjdGlvbiBpcyBldmVuIHdpdGggc3RhZ2luZy4g8J+RjFxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwidGMtbWVzc2FnZS0tdGV4dCB0Yy1tZXNzYWdlLS1haGVhZFwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInRjLW1lc3NhZ2UtLXRleHQgdGMtbWVzc2FnZS0tZGl2ZXJnZWRcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0Yy1tZXNzYWdlLS10ZXh0IHRjLW1lc3NhZ2UtLXVuYXV0aG9yaXplZFwiPlxuICAgICAgICBZb3UgYXJlIHZpZXdpbmcgdGhlIHN0YWdpbmcgc2l0ZSxcbiAgICAgICAgYnV0IHlvdSBjYW5ub3QgZGVwbG95IG9yIHZpZXcgY2hhbmdlc1xuICAgICAgICB1bnRpbCB5b3UgYXV0aG9yaXplIHJlYWQvd3JpdGUgYWNjZXNzXG4gICAgICAgIHRvIHlvdXIgR2l0aHViIHJlcG9zaXRvcnkuXG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIDxkaXYgY2xhc3M9XCJ0Yy1hY3Rpb25cIj5cbiAgICA8ZGl2IGNsYXNzPVwidGMtY29udGFpbmVyXCI+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzPVwidGMtYWN0aW9uLS1idXR0b24gdGMtYWN0aW9uLS1kZXBsb3lcIlxuICAgICAgICBhcmlhLWxhYmVsPVwiUGVyZm9ybSBhIGRlcGxveW1lbnQgdG8gdGhlIHByb2R1Y3Rpb24gYnJhbmNoLlwiXG4gICAgICA+RGVwbG95PC9idXR0b24+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzPVwidGMtYWN0aW9uLS1idXR0b24gdGMtYWN0aW9uLS1hdXRob3JpemVcIlxuICAgICAgICBhcmlhLWxhYmVsPVwiQXV0aG9yaXplIHRyYWZmaWMtY29udHJvbCB0byBhY2Nlc3MgeW91ciBHaXRodWIgYWNjb3VudC5cIlxuICAgICAgPkF1dGhvcml6ZTwvYnV0dG9uPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzcz1cInRjLWFjdGlvbi0tYnV0dG9uIHRjLWFjdGlvbi0taW5mb1wiXG4gICAgICAgIGFyaWEtbGFiZWw9XCJGaW5kIG91dCBtb3JlIGluZm9ybWF0aW9uLlwiXG4gICAgICA+SG93PzwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgPGRpdiBjbGFzcz1cInRjLWNsb3NlXCI+XG4gICAgPGRpdiBjbGFzcz1cInRjLWNvbnRhaW5lclwiPlxuICAgICAgPGJ1dHRvblxuICAgICAgICBjbGFzcz1cInRjLWNsb3NlLS1idXR0b25cIlxuICAgICAgICBhcmlhLWxhYmVsPVwiQ2xvc2UgdHJhZmZpYy1jb250cm9sIGRlcGxveW1lbnQgdXNlciBpbnRlcmZhY2UuXCJcbiAgICAgID4mdGltZXM7PC9idXR0b24+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuPC9kaXY+XG4iLCIvKlxuICBOb3RlOiB0aGVyZSBpcyBhIGxvdCBvZiByZXBldGl0aW9uIGdvaW5nIG9uIGluIHRoaXMgQ1NTLlxuICBUaGlzIGlzIGludGVudGlvbmFsLCBpbiBvcmRlciB0byBrZWVwIHNwZWNpZmljaXR5IGxvd1xuICBlbm91Z2ggdGhhdCBjdXN0b20gc3R5bGVzIGFyZSBlYXNpZXIgdG8gaW1wbGVtZW50LlxuICovXG5cbnRyYWZmaWMtY29udHJvbCxcbnRyYWZmaWMtY29udHJvbCAqLFxudHJhZmZpYy1jb250cm9sICo6YmVmb3JlLFxudHJhZmZpYy1jb250cm9sICo6YWZ0ZXIge1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG50cmFmZmljLWNvbnRyb2wge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIHotaW5kZXg6IDEwMDAwO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWJhciB7XG4gIGRpc3BsYXk6IG5vbmU7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHRhYmxlLWxheW91dDogZml4ZWQ7XG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuICBiYWNrZ3JvdW5kOiAjZmZmO1xuICBjb2xvcjogIzAwMDtcbiAgdHJhbnNpdGlvbjogYWxsIC4ycyBlYXNlO1xufVxuXG50cmFmZmljLWNvbnRyb2wuaXMtbG9hZGluZyAudGMtYmFyIHtcbiAgYmFja2dyb3VuZDogI2VlZTtcbiAgY29sb3I6ICNhYWE7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYmFyLmlzLWVudGVyaW5nIHtcbiAgYW5pbWF0aW9uOiBzbGlkZUluRG93biAuNnMgZWFzZSBib3RoO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2Uge1xuICBkaXNwbGF5OiB0YWJsZS1jZWxsO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uIHtcbiAgZGlzcGxheTogdGFibGUtY2VsbDtcbiAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwcHg7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtY2xvc2Uge1xuICBkaXNwbGF5OiB0YWJsZS1jZWxsO1xuICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiA2MHB4O1xuICBib3JkZXItbGVmdDogMXB4IHNvbGlkICNlZWU7XG4gIHRyYW5zaXRpb246IGFsbCAuMnMgZWFzZTtcbn1cblxudHJhZmZpYy1jb250cm9sLmlzLWxvYWRpbmcgLnRjLWNsb3NlIHtcbiAgYm9yZGVyLWNvbG9yOiAjY2NjO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLXRleHQge1xuICBmb250LXNpemU6IDE0cHg7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgcGFkZGluZzogMTZweDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1sb2FkaW5nIHtcbiAgZGlzcGxheTogbm9uZTtcbiAgb3BhY2l0eTogMDtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1sb2FkaW5nLmlzLWVudGVyaW5nIHtcbiAgYW5pbWF0aW9uOiBib3VuY2VGYWRlSW5MZWZ0IC42cyBjdWJpYy1iZXppZXIoMC4xOSwgMSwgMC4yMiwgMSkgYm90aDtcbiAgYW5pbWF0aW9uLWRlbGF5OiAuM3M7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tc3luY2hyb25pemVkIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1kaXZlcmdlZCB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tdW5hdXRob3JpemVkIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1haGVhZCB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1kZXBsb3kge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWFjdGlvbi0taW5mbyB7XG4gIGRpc3BsYXk6IG5vbmU7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1hdXRob3JpemUge1xuICBkaXNwbGF5OiBub25lO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWNsb3NlLS1idXR0b24ge1xuICBkaXNwbGF5OiBub25lO1xuICBtYXJnaW46IDAgYXV0bztcbiAgcGFkZGluZzogMTZweDtcbiAgd2lkdGg6IDEwMCU7XG4gIGJvcmRlcjogbm9uZTtcbiAgb3V0bGluZTogbm9uZTtcbiAgYmFja2dyb3VuZDogbm9uZTtcbiAgY29sb3I6ICNlZWU7XG4gIGZvbnQtc2l6ZTogMjRweDtcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBzYW5zLXNlcmlmO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGhlaWdodDogMTAwJTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0cmFuc2l0aW9uOiBhbGwgLjJzIGVhc2U7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxudHJhZmZpYy1jb250cm9sLmlzLWxvYWRpbmcgLnRjLWNsb3NlLS1idXR0b24ge1xuICBib3JkZXItY29sb3I6ICNjY2M7XG4gIGNvbG9yOiAjY2NjO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLWNsb3NlLS1idXR0b24uaXMtZW50ZXJpbmcge1xuICBhbmltYXRpb246IGJvdW5jZUZhZGVJblJpZ2h0IC42cyBjdWJpYy1iZXppZXIoMC4xOSwgMSwgMC4yMiwgMSkgYm90aDtcbiAgYW5pbWF0aW9uLWRlbGF5OiAuM3M7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYmFyLmlzLWFjdGl2ZSB7XG4gIGRpc3BsYXk6IHRhYmxlO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLWxvYWRpbmcuaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG4gIG9wYWNpdHk6IDE7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtbWVzc2FnZS0tc3luY2hyb25pemVkLmlzLWFjdGl2ZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLWRpdmVyZ2VkLmlzLWFjdGl2ZSB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG50cmFmZmljLWNvbnRyb2wgLnRjLW1lc3NhZ2UtLXVuYXV0aG9yaXplZC5pcy1hY3RpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1tZXNzYWdlLS1haGVhZC5pcy1hY3RpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWRlcGxveS5pcy1hY3RpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxudHJhZmZpYy1jb250cm9sIC50Yy1hY3Rpb24tLWluZm8uaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtYWN0aW9uLS1hdXRob3JpemUuaXMtYWN0aXZlIHtcbiAgZGlzcGxheTogYmxvY2s7XG59XG5cbnRyYWZmaWMtY29udHJvbCAudGMtY2xvc2UtLWJ1dHRvbi5pcy1hY3RpdmUge1xuICBkaXNwbGF5OiBibG9jaztcbn1cblxuQGtleWZyYW1lcyBib3VuY2VGYWRlSW5SaWdodCB7XG4gIDAlIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDAlKTtcbiAgfVxuICA1MCUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0yNSUpO1xuICB9XG4gIDEwMCUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDApO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgYm91bmNlRmFkZUluTGVmdCB7XG4gIDAlIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAwJSk7XG4gIH1cbiAgNTAlIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgyNSUpO1xuICB9XG4gIDEwMCUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDApO1xuICB9XG59XG5cbkBrZXlmcmFtZXMgc2xpZGVJbkRvd24ge1xuICAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xMDAlKVxuICB9XG4gIDEwMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKVxuICB9XG59XG4iLCIndXNlIHN0cmljdCdcblxuLy8gYW5pbWF0aW9uczogaHR0cDovL2pzYmluLmNvbS9yaWJpdmV0dXRhL2VkaXQ/Y3NzLGpzLG91dHB1dFxuXG5pbXBvcnQgYXNzaWduIGZyb20gJ2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduJ1xuaW1wb3J0IGluaXRpYWxNYXJrdXAgZnJvbSAnLi90ZW1wbGF0ZS5odG1sJ1xuaW1wb3J0IHN0eWxlcyBmcm9tICcuL3N0eWxlcy5jc3MnXG5cbi8qKlxuICogW3RyYWZmaWNDb250cm9sIGRlc2NyaXB0aW9uXVxuICogQHBhcmFtICB7W3R5cGVdfSBvcHRzIFtkZXNjcmlwdGlvbl1cbiAqIEByZXR1cm4ge1t0eXBlXX0gICAgICBbZGVzY3JpcHRpb25dXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRyYWZmaWNDb250cm9sIChvcHRzKSB7XG4gIGxldCBuZXRsaWZ5ID0gd2luZG93Lm5ldGxpZnlcblxuICAvKipcbiAgICogW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIGNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBUcmFmZmljQ29udHJvbChvcHRzKVxuICB9XG5cbiAgLyoqXG4gICAqIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBjb25zdCBjb25kaXRpb25hbGx5TG9hZE5ldGxpZnkgPSAoKSA9PiB7XG4gICAgaWYgKG5ldGxpZnkgPT0gbnVsbCkge1xuICAgICAgY29uc3Qgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgIHNjcmlwdC50eXBlID0gJ3RleHQvamF2YXNjcmlwdCdcbiAgICAgIHNjcmlwdC5vbmxvYWQgPSBzY3JpcHQub25yZWFkeXN0YXRlY2hhbmdlID0gaW5pdFxuICAgICAgc2NyaXB0LnNyYyA9ICdodHRwczovL2FwcC5uZXRsaWZ5LmNvbS9hdXRoZW50aWNhdGlvbi5qcydcbiAgICAgIHJldHVybiBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHNjcmlwdClcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGluaXQoKVxuICAgIH1cbiAgfVxuXG4gIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgY29uZGl0aW9uYWxseUxvYWROZXRsaWZ5LCBmYWxzZSlcbiAgfSBlbHNlIGlmICh3aW5kb3cuYXR0YWNoRXZlbnQpIHtcbiAgICB3aW5kb3cuYXR0YWNoRXZlbnQoJ29ubG9hZCcsIGNvbmRpdGlvbmFsbHlMb2FkTmV0bGlmeSlcbiAgfVxufVxuXG4vKipcbiAqXG4gKi9cbmNsYXNzIFRyYWZmaWNDb250cm9sIHtcbiAgLyoqXG4gICAqIFtjb25zdHJ1Y3RvciBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBvcHRzID0gICAgICAgICAgICAge30gW2Rlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19ICAgICAgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgY29uc3RydWN0b3IgKG9wdHMgPSB7fSkge1xuICAgIHRoaXMub3B0cyA9IGFzc2lnbih7fSwgdGhpcy5fZ2V0RGVmYXVsdE9wdHMoKSwgb3B0cylcbiAgICB0aGlzLl92YWxpZGF0ZU9wdHModGhpcy5vcHRzKVxuICAgIHRoaXMuX2luaXQoKVxuICB9XG5cbiAgLyoqXG4gICAqIFtfZ2V0RGVmYXVsdE9wdHMgZGVzY3JpcHRpb25dXG4gICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgX2dldERlZmF1bHRPcHRzICgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc3RhZ2luZ0JyYW5jaDogJ2RldmVsb3AnLFxuICAgICAgcHJvZHVjdGlvbkJyYWNoOiAnbWFzdGVyJyxcbiAgICAgIGdoQVBJOiAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbScsXG4gICAgICBjb250YWluZXJFbDogZG9jdW1lbnQuYm9keVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBbX3ZhbGlkYXRlT3B0cyBkZXNjcmlwdGlvbl1cbiAgICogQHBhcmFtICB7W3R5cGVdfSBvcHRzIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgIFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIF92YWxpZGF0ZU9wdHMgKG9wdHMpIHtcbiAgICBpZiAob3B0cy5yZXBvID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignWW91IG5lZWQgdG8gc3BlY2lmeSBhIHJlcG9zaXRvcnkuJylcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogW19pbml0IGRlc2NyaXB0aW9uXVxuICAgKiBAcmV0dXJuIHtbdHlwZV19IFtkZXNjcmlwdGlvbl1cbiAgICovXG4gIF9pbml0ICgpIHtcbiAgICB0aGlzLl9hZGRDc3Moc3R5bGVzKVxuICAgIHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0cmFmZmljLWNvbnRyb2wnKVxuICAgIHRoaXMuZWwuaWQgPSAndHJhZmZpYy1jb250cm9sJ1xuICAgIHRoaXMuZWwuaW5uZXJIVE1MID0gaW5pdGlhbE1hcmt1cFxuICAgIHRoaXMuZWxzID0ge1xuICAgICAgYmFyOiB0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RjLWJhcicpWzBdLFxuICAgICAgbG9hZGluZ01zZzogdGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0Yy1tZXNzYWdlLS1sb2FkaW5nJylbMF0sXG4gICAgICBzeW5jZWRNc2c6IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGMtbWVzc2FnZS0tc3luY2hyb25pemVkJylbMF0sXG4gICAgICBhaGVhZE1zZzogdGhpcy5lbC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCd0Yy1tZXNzYWdlLS1haGVhZCcpWzBdLFxuICAgICAgZGl2ZXJnZWRNc2c6IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGMtbWVzc2FnZS0tZGl2ZXJnZWQnKVswXSxcbiAgICAgIHVuYXV0aGVkTXNnOiB0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RjLW1lc3NhZ2UtLXVuYXV0aG9yaXplZCcpWzBdLFxuICAgICAgZGVwbG95QnRuOiB0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RjLWFjdGlvbi0tZGVwbG95JylbMF0sXG4gICAgICBhdXRoQnRuOiB0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RjLWFjdGlvbi0tYXV0aG9yaXplJylbMF0sXG4gICAgICBpbmZvQnRuOiB0aGlzLmVsLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3RjLWFjdGlvbi0taW5mbycpWzBdLFxuICAgICAgY2xvc2VCdG46IHRoaXMuZWwuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgndGMtY2xvc2UtLWJ1dHRvbicpWzBdXG4gICAgfVxuICAgIHRoaXMub3B0cy5jb250YWluZXJFbC5hcHBlbmRDaGlsZCh0aGlzLmVsKVxuICAgIHRoaXMuYW5pbWF0ZUluKHRoaXMuZWxzLmJhciwgKCkgPT4ge1xuICAgICAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdpcy1sb2FkaW5nJylcbiAgICB9KVxuICAgIHRoaXMuYW5pbWF0ZUluKHRoaXMuZWxzLmxvYWRpbmdNc2cpXG4gICAgdGhpcy5hbmltYXRlSW4odGhpcy5lbHMuY2xvc2VCdG4pXG4gIH1cblxuICAvKipcbiAgICogW19hZGRDc3MgZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSB7W3R5cGVdfSBjc3MgW2Rlc2NyaXB0aW9uXVxuICAgKi9cbiAgX2FkZENzcyAoY3NzKSB7XG4gICAgY29uc3Qgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG4gICAgY29uc3QgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXVxuICAgIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnXG4gICAgaWYgKHN0eWxlLnN0eWxlU2hlZXQpIHtcbiAgICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzc1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKVxuICAgIH1cbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKVxuICB9XG5cbiAgLyoqXG4gICAqIFthbmltYXRlSW4gZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gZWwgICAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IGFmdGVyIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBhbmltYXRlSW4gKGVsLCBhZnRlciwgZGVsYXkgPSAwKSB7XG4gICAgbGV0IGlzQW5pbWF0ZWQgPSBmYWxzZVxuICAgIGNvbnN0IHN0YXJ0Q2IgPSAoKSA9PiB7XG4gICAgICBpc0FuaW1hdGVkID0gdHJ1ZVxuICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihhbmltYXRpb25TdGFydCwgc3RhcnRDYilcbiAgICB9XG4gICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihhbmltYXRpb25TdGFydCwgc3RhcnRDYiwgZmFsc2UpXG4gICAgZWwuY2xhc3NMaXN0LmFkZCgnaXMtYWN0aXZlJylcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdpcy1lbnRlcmluZycpXG4gICAgaWYgKGFmdGVyICYmIHR5cGVvZiBhZnRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGlzQW5pbWF0ZWQpIHtcbiAgICAgICAgY29uc3QgY2FsbEFmdGVyID0gKCkgPT4ge1xuICAgICAgICAgIHNldFRpbWVvdXQoYWZ0ZXIsIGRlbGF5KVxuICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uRW5kLCBjYWxsQWZ0ZXIpXG4gICAgICAgIH1cbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmQsIGNhbGxBZnRlciwgZmFsc2UpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRUaW1lb3V0KGFmdGVyLCBkZWxheSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogW2FuaW1hdGVPdXQgZGVzY3JpcHRpb25dXG4gICAqIEBwYXJhbSAge1t0eXBlXX0gZWwgICAgW2Rlc2NyaXB0aW9uXVxuICAgKiBAcGFyYW0gIHtbdHlwZV19IGFmdGVyIFtkZXNjcmlwdGlvbl1cbiAgICogQHJldHVybiB7W3R5cGVdfSAgICAgICBbZGVzY3JpcHRpb25dXG4gICAqL1xuICBhbmltYXRlT3V0IChlbCwgYWZ0ZXIsIGRlbGF5ID0gMCkge1xuICAgIGxldCBpc0FuaW1hdGVkID0gZmFsc2VcbiAgICBjb25zdCBzdGFydENiID0gKCkgPT4ge1xuICAgICAgaXNBbmltYXRlZCA9IHRydWVcbiAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uU3RhcnQsIHN0YXJ0Q2IpXG4gICAgfVxuICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoYW5pbWF0aW9uU3RhcnQsIHN0YXJ0Q2IsIGZhbHNlKVxuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWVudGVyaW5nJylcbiAgICBlbC5jbGFzc0xpc3QuYWRkKCdpcy1sZWF2aW5nJylcbiAgICBpZiAoaXNBbmltYXRlZCkge1xuICAgICAgY29uc3QgY2IgPSAoKSA9PiB7XG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWxlYXZpbmcnKVxuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKVxuICAgICAgICBpZiAoYWZ0ZXIgJiYgdHlwZW9mIGFmdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgc2V0VGltZW91dChhZnRlciwgMjAwICsgZGVsYXkpXG4gICAgICAgIH1cbiAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmQsIGNiKVxuICAgICAgfVxuICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihhbmltYXRpb25FbmQsIGNiLCBmYWxzZSlcbiAgICB9IGVsc2Uge1xuICAgICAgZWwuY2xhc3NMaXN0LnJlbW92ZSgnaXMtbGVhdmluZycpXG4gICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKCdpcy1hY3RpdmUnKVxuICAgICAgaWYgKGFmdGVyICYmIHR5cGVvZiBhZnRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBzZXRUaW1lb3V0KGFmdGVyLCBkZWxheSlcbiAgICAgIH1cbiAgICB9XG4gIH1cblxufVxuXG4vKipcbiAqIFtkZXNjcmlwdGlvbl1cbiAqIEBwYXJhbSAge1t0eXBlXX0gKCBbZGVzY3JpcHRpb25dXG4gKiBAcmV0dXJuIHtbdHlwZV19ICAgW2Rlc2NyaXB0aW9uXVxuICovXG52YXIgYW5pbWF0aW9uRW5kID0gKCgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmYWtlZWxlbWVudCcpXG4gIGNvbnN0IGFuaW1hdGlvbnMgPSB7XG4gICAgJ2FuaW1hdGlvbic6ICdhbmltYXRpb25lbmQnLFxuICAgICdPQW5pbWF0aW9uJzogJ29hbmltYXRpb25lbmQnLFxuICAgICdNb3pBbmltYXRpb24nOiAnYW5pbWF0aW9uZW5kJyxcbiAgICAnV2Via2l0QW5pbWF0aW9uJzogJ3dlYmtpdEFuaW1hdGlvbkVuZCcsXG4gICAgJ01TQW5pbWF0aW9uJzogJ01TQW5pbWF0aW9uRW5kJ1xuICB9XG4gIGZvciAobGV0IHQgaW4gYW5pbWF0aW9ucykge1xuICAgIGlmICghZWwuc3R5bGVbdF0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGFuaW1hdGlvbnNbdF1cbiAgICB9XG4gIH1cbn0pKClcblxuLyoqXG4gKiBbZGVzY3JpcHRpb25dXG4gKiBAcGFyYW0gIHtbdHlwZV19ICggW2Rlc2NyaXB0aW9uXVxuICogQHJldHVybiB7W3R5cGVdfSAgIFtkZXNjcmlwdGlvbl1cbiAqL1xudmFyIGFuaW1hdGlvblN0YXJ0ID0gKCgpID0+IHtcbiAgY29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmYWtlZWxlbWVudCcpXG4gIGNvbnN0IGFuaW1hdGlvbnMgPSB7XG4gICAgJ2FuaW1hdGlvbic6ICdhbmltYXRpb25zdGFydCcsXG4gICAgJ09BbmltYXRpb24nOiAnb2FuaW1hdGlvbnN0YXJ0JyxcbiAgICAnTW96QW5pbWF0aW9uJzogJ2FuaW1hdGlvbnN0YXJ0JyxcbiAgICAnV2Via2l0QW5pbWF0aW9uJzogJ3dlYmtpdEFuaW1hdGlvblN0YXJ0JyxcbiAgICAnTVNBbmltYXRpb24nOiAnTVNBbmltYXRpb25TdGFydCdcbiAgfVxuICBmb3IgKGxldCB0IGluIGFuaW1hdGlvbnMpIHtcbiAgICBpZiAoIWVsLnN0eWxlW3RdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiBhbmltYXRpb25zW3RdXG4gICAgfVxuICB9XG59KSgpXG5cbi8vIGZ1bmN0aW9uIHRyYWZmaWNDb250cm9sMiAob3B0cykge1xuLy9cbi8vICAgb3B0cyA9IG9wdHMgfHwge31cbi8vICAgb3B0cy5HSF9BUEkgPSBvcHRzLkdIX0FQSSB8fCAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbSdcbi8vICAgb3B0cy5zdGFnaW5nQnJhbmNoID0gb3B0cy5zdGFnaW5nQnJhbmNoIHx8ICdkZXZlbG9wJ1xuLy8gICBvcHRzLnByb2R1Y3Rpb25CcmFuY2ggPSBvcHRzLnByb2R1Y3Rpb25CcmFuY2ggfHwgJ21hc3Rlcidcbi8vXG4vLyAgIGlmIChvcHRzLnJlcG8gPT0gbnVsbCkge1xuLy8gICAgIHRocm93IG5ldyBFcnJvcignWW91IG5lZWQgdG8gc3BlY2lmeSBhIHJlcG9zaXRvcnkuJylcbi8vICAgfVxuLy9cbi8vICAgdmFyIGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdXG4vLyAgIHZhciBiYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuLy8gICBiYXIuaWQgPSAnc3RhZ2luZy1iYXInXG4vLyAgIGJhci5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAnI2VlZSdcbi8vICAgYmFyLnN0eWxlLmNvbG9yID0gJyMyMjInXG4vLyAgIGJhci5zdHlsZS5mb250RmFtaWx5ID0gJ3NhbnMtc2VyaWYnXG4vLyAgIGJhci5zdHlsZS5wYWRkaW5nID0gJzE2cHggOHB4J1xuLy8gICBiYXIuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnXG4vLyAgIGJhci5zdHlsZS50b3AgPSAnMCdcbi8vICAgYmFyLnN0eWxlLndpZHRoID0gJzEwMCUnXG4vLyAgIGJhci5pbm5lclRleHQgPSAnTG9hZGluZy4uLidcbi8vICAgYm9keS5pbnNlcnRCZWZvcmUoYmFyLCBib2R5LmZpcnN0Q2hpbGQpXG4vL1xuLy8gICBmdW5jdGlvbiBpbml0ICgpIHtcbi8vICAgICB2YXIgJCA9IHdpbmRvdy4kXG4vLyAgICAgdmFyIGxvY2FsU3RvcmFnZSA9IHdpbmRvdy5sb2NhbFN0b3JhZ2Vcbi8vICAgICB2YXIgbmV0bGlmeSA9IHdpbmRvdy5uZXRsaWZ5XG4vL1xuLy8gICAgIHZhciAkYm9keSA9ICQoYm9keSlcbi8vICAgICB2YXIgJGJhciA9ICQoJyNzdGFnaW5nLWJhcicpXG4vLyAgICAgdmFyICRtc2cgPSAkKCc8ZGl2IC8+Jylcbi8vXG4vLyAgICAgZnVuY3Rpb24gYmFyICgpIHtcbi8vICAgICAgIGlmICghbG9jYWxTdG9yYWdlLmdoX3Rva2VuKSB7XG4vLyAgICAgICAgICRiYXIuZW1wdHkoKVxuLy8gICAgICAgICB2YXIgJGF1dGhCdG4gPSAkKCc8YnV0dG9uPkF1dGhvcml6ZTwvYnV0dG9uPicpXG4vLyAgICAgICAgICRtc2cudGV4dCgnWW91IGFyZSB2aWV3aW5nIHRoZSBzdGFnaW5nIHNpdGUsIGJ1dCB5b3UgY2Fubm90IGRlcGxveSBvciB2aWV3IGNoYW5nZXMgdW50aWwgeW91IGF1dGhvcml6ZSByZWFkL3dyaXRlIGFjY2VzcyB0byB5b3VyIEdpdGh1YiByZXBvc2l0b3J5LicpXG4vLyAgICAgICAgICRiYXIuYXBwZW5kKCRtc2cpXG4vLyAgICAgICAgICRiYXIuY3NzKHtcbi8vICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjRTAyRDJEJyxcbi8vICAgICAgICAgICBjb2xvcjogJ3doaXRlJ1xuLy8gICAgICAgICB9KVxuLy8gICAgICAgICAkYmFyLmFwcGVuZCgkYXV0aEJ0bilcbi8vICAgICAgICAgJGJvZHkucHJlcGVuZCgkYmFyKVxuLy8gICAgICAgICAkYXV0aEJ0bi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4vLyAgICAgICAgICAgbmV0bGlmeS5hdXRoZW50aWNhdGUoeyBwcm92aWRlcjogJ2dpdGh1YicsIHNjb3BlOiAncmVwbycgfSwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuLy8gICAgICAgICAgICAgaWYgKGVycikge1xuLy8gICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IgYXV0aGVudGljYXRpbmc6ICVzJywgZXJyLm1lc3NhZ2UpXG4vLyAgICAgICAgICAgICB9XG4vLyAgICAgICAgICAgICBsb2NhbFN0b3JhZ2UuZ2hfdG9rZW4gPSBkYXRhLnRva2VuXG4vLyAgICAgICAgICAgICBiYXIoKVxuLy8gICAgICAgICAgIH0pXG4vLyAgICAgICAgIH0pXG4vLyAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAkLmdldEpTT04ob3B0cy5HSF9BUEkgKyAnL3JlcG9zLycgKyBvcHRzLnJlcG8gKyAnL2NvbXBhcmUvJyArIG9wdHMucHJvZHVjdGlvbkJyYW5jaCArICcuLi4nICsgb3B0cy5zdGFnaW5nQnJhbmNoICsgJ2RldmVsb3A/YWNjZXNzX3Rva2VuPScgKyBsb2NhbFN0b3JhZ2UuZ2hfdG9rZW4sIGZ1bmN0aW9uIChkYXRhKSB7XG4vLyAgICAgICAgICAgJGJhci5lbXB0eSgpXG4vLyAgICAgICAgICAgdmFyICRkZXBsb3lCdG4gPSAkKCc8YnV0dG9uPkRlcGxveTwvYnV0dG9uPicpXG4vLyAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09PSAnYWhlYWQnKSB7XG4vLyAgICAgICAgICAgICB2YXIgaGF2ZSA9IGRhdGEuYWhlYWRfYnkgPiAxID8gJ2hhdmUnIDogJ2hhcydcbi8vICAgICAgICAgICAgIHZhciBjaGFuZ2VzID0gZGF0YS5haGVhZF9ieSA+IDEgPyAnY2hhbmdlcycgOiAnY2hhbmdlJ1xuLy8gICAgICAgICAgICAgJG1zZy5odG1sKCdZb3UgYXJlIHZpZXdpbmcgdGhlIHN0YWdpbmcgc2l0ZS4gVGhlcmUgJyArIGhhdmUgKyAnIGJlZW4gPGEgaHJlZj1cIicgKyBkYXRhLnBlcm1hbGlua191cmwgKyAnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+JyArIGRhdGEuYWhlYWRfYnkgKyAnPC9hPiAnICsgY2hhbmdlcyArICcgc2luY2UgdGhlIGxhc3QgcHJvZHVjdGlvbiBidWlsZC4g8J+aoicpXG4vLyAgICAgICAgICAgICAkYmFyLmFwcGVuZCgkbXNnKVxuLy8gICAgICAgICAgICAgJGJhci5jc3Moe1xuLy8gICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjQjhENUU5Jyxcbi8vICAgICAgICAgICAgICAgY29sb3I6ICcjMjIyJ1xuLy8gICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgICRiYXIuYXBwZW5kKCRkZXBsb3lCdG4pXG4vLyAgICAgICAgICAgICAkYm9keS5wcmVwZW5kKCRiYXIpXG4vLyAgICAgICAgICAgICAkZGVwbG95QnRuLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbi8vICAgICAgICAgICAgICAgJC5wb3N0KG9wdHMuR0hfQVBJICsgJy9yZXBvcy8nICsgb3B0cy5yZXBvICsgJy9tZXJnZXM/YWNjZXNzX3Rva2VuPScgKyBsb2NhbFN0b3JhZ2UuZ2hfdG9rZW4sIEpTT04uc3RyaW5naWZ5KHtcbi8vICAgICAgICAgICAgICAgICBiYXNlOiAnbWFzdGVyJyxcbi8vICAgICAgICAgICAgICAgICBoZWFkOiAnZGV2ZWxvcCcsXG4vLyAgICAgICAgICAgICAgICAgY29tbWl0X21lc3NhZ2U6ICc6dmVydGljYWxfdHJhZmZpY19saWdodDogUHJvZHVjdGlvbiBkZXBsb3kgdHJpZ2dlcmVkIGZyb20gdHJhZmZpYy1jb250cm9sJ1xuLy8gICAgICAgICAgICAgICB9KSwgZnVuY3Rpb24gKCkge1xuLy8gICAgICAgICAgICAgICAgIGJhcigpXG4vLyAgICAgICAgICAgICAgIH0pXG4vLyAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5zdGF0dXMgPT09ICdkaXZlcmdlZCcpIHtcbi8vICAgICAgICAgICAgIHZhciBjb21taXRzID0gZGF0YS5iZWhpbmRfYnkgPiAxID8gJ2NvbW1pdHMnIDogJ2NvbW1pdCdcbi8vICAgICAgICAgICAgICRtc2cuaHRtbCgnWW91IGFyZSB2aWV3aW5nIHRoZSBzdGFnaW5nIHNpdGUuIFN0YWdpbmcgaGFzIGRpdmVyZ2VkIGJlaGluZCBwcm9kdWN0aW9uIGJ5IDxhIGhyZWY9XCInICsgZGF0YS5wZXJtYWxpbmtfdXJsICsgJ1wiIHRhcmdldD1cIl9ibGFua1wiPicgKyBkYXRhLmJlaGluZF9ieSArICc8L2E+ICcgKyBjb21taXRzICsgJy4gUGxlYXNlIHJlYmFzZS4nKVxuLy8gICAgICAgICAgICAgJGJhci5hcHBlbmQoJG1zZylcbi8vICAgICAgICAgICAgICRiYXIuY3NzKHtcbi8vICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnb3JhbmdlJyxcbi8vICAgICAgICAgICAgICAgY29sb3I6ICcjMjIyJ1xuLy8gICAgICAgICAgICAgfSlcbi8vICAgICAgICAgICAgICRib2R5LnByZXBlbmQoJGJhcilcbi8vICAgICAgICAgICB9IGVsc2Uge1xuLy8gICAgICAgICAgICAgJG1zZy50ZXh0KCdZb3UgYXJlIHZpZXdpbmcgdGhlIHN0YWdpbmcgc2l0ZS4gRXZlcnl0aGluZyBpcyBpbiBzeW5jLCBwcm9kdWN0aW9uIGlzIGV2ZW4gd2l0aCBzdGFnaW5nLiDwn5GMJylcbi8vICAgICAgICAgICAgICRiYXIuYXBwZW5kKCRtc2cpXG4vLyAgICAgICAgICAgICAkYmFyLmNzcyh7XG4vLyAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogJyNCQUU5QjgnLFxuLy8gICAgICAgICAgICAgICBjb2xvcjogJyMyMjInXG4vLyAgICAgICAgICAgICB9KVxuLy8gICAgICAgICAgICAgJGJvZHkucHJlcGVuZCgkYmFyKVxuLy8gICAgICAgICAgIH1cbi8vICAgICAgICAgfSlcbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgICAgYmFyKClcbi8vICAgfVxuLy9cbi8vICAgZnVuY3Rpb24gY29uZGl0aW9uYWxseUxvYWRKUXVlcnkgKCkge1xuLy8gICAgIHZhciBqUXVlcnkgPSB3aW5kb3cualF1ZXJ5XG4vLyAgICAgdmFyIHByb3RvY29sID0gJy8vJ1xuLy8gICAgIGlmICh3aW5kb3cubG9jYXRpb24uaHJlZi5pbmNsdWRlcygnZmlsZTovLycpKSB7XG4vLyAgICAgICBwcm90b2NvbCA9ICdodHRwczovLydcbi8vICAgICB9XG4vLyAgICAgaWYgKCEodHlwZW9mIGpRdWVyeSAhPT0gJ3VuZGVmaW5lZCcgJiYgalF1ZXJ5ICE9PSBudWxsKSkge1xuLy8gICAgICAgdmFyIGpRID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jylcbi8vICAgICAgIGpRLnR5cGUgPSAndGV4dC9qYXZhc2NyaXB0J1xuLy8gICAgICAgalEub25sb2FkID0galEub25yZWFkeXN0YXRlY2hhbmdlID0gaW5pdFxuLy8gICAgICAgalEuc3JjID0gcHJvdG9jb2wgKyAnY29kZS5qcXVlcnkuY29tL2pxdWVyeS0yLjIuNC5taW4uanMnXG4vLyAgICAgICByZXR1cm4gZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChqUSlcbi8vICAgICB9IGVsc2Uge1xuLy8gICAgICAgcmV0dXJuIGluaXQoKVxuLy8gICAgIH1cbi8vICAgfTtcbi8vXG4vLyAgIGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuLy8gICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgY29uZGl0aW9uYWxseUxvYWRKUXVlcnksIGZhbHNlKVxuLy8gICB9IGVsc2UgaWYgKHdpbmRvdy5hdHRhY2hFdmVudCkge1xuLy8gICAgIHdpbmRvdy5hdHRhY2hFdmVudCgnb25sb2FkJywgY29uZGl0aW9uYWxseUxvYWRKUXVlcnkpXG4vLyAgIH1cbi8vIH1cbiJdLCJuYW1lcyI6WyJyZXF1aXJlJCQwIiwicmVxdWlyZSQkMSIsInJlcXVpcmUkJDIiLCJyZXF1aXJlJCQzIiwiYXNzaWduIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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