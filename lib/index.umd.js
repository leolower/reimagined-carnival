(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('buffer'), require('crypto')) :
  typeof define === 'function' && define.amd ? define(['exports', 'buffer', 'crypto'], factory) :
  (global = global || self, factory(global['@makerdao-cdp-insurance/client'] = {}, global.buffer, global.crypto));
}(this, function (exports, buffer, crypto) { 'use strict';

  buffer = buffer && buffer.hasOwnProperty('default') ? buffer['default'] : buffer;
  crypto = crypto && crypto.hasOwnProperty('default') ? crypto['default'] : crypto;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};

    var target = _objectWithoutPropertiesLoose(source, excluded);

    var key, i;

    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }

    return target;
  }

  /**
   * Helpers.
   */

  var s = 1000;
  var m = s * 60;
  var h = m * 60;
  var d = h * 24;
  var w = d * 7;
  var y = d * 365.25;

  /**
   * Parse or format the given `val`.
   *
   * Options:
   *
   *  - `long` verbose formatting [false]
   *
   * @param {String|Number} val
   * @param {Object} [options]
   * @throws {Error} throw an error if val is not a non-empty string or a number
   * @return {String|Number}
   * @api public
   */

  var ms = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === 'string' && val.length > 0) {
      return parse(val);
    } else if (type === 'number' && isNaN(val) === false) {
      return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error(
      'val is not a non-empty string or a valid number. val=' +
        JSON.stringify(val)
    );
  };

  /**
   * Parse the given `str` and return milliseconds.
   *
   * @param {String} str
   * @return {Number}
   * @api private
   */

  function parse(str) {
    str = String(str);
    if (str.length > 100) {
      return;
    }
    var match = /^((?:\d+)?\-?\d?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
      str
    );
    if (!match) {
      return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || 'ms').toLowerCase();
    switch (type) {
      case 'years':
      case 'year':
      case 'yrs':
      case 'yr':
      case 'y':
        return n * y;
      case 'weeks':
      case 'week':
      case 'w':
        return n * w;
      case 'days':
      case 'day':
      case 'd':
        return n * d;
      case 'hours':
      case 'hour':
      case 'hrs':
      case 'hr':
      case 'h':
        return n * h;
      case 'minutes':
      case 'minute':
      case 'mins':
      case 'min':
      case 'm':
        return n * m;
      case 'seconds':
      case 'second':
      case 'secs':
      case 'sec':
      case 's':
        return n * s;
      case 'milliseconds':
      case 'millisecond':
      case 'msecs':
      case 'msec':
      case 'ms':
        return n;
      default:
        return undefined;
    }
  }

  /**
   * Short format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return Math.round(ms / d) + 'd';
    }
    if (msAbs >= h) {
      return Math.round(ms / h) + 'h';
    }
    if (msAbs >= m) {
      return Math.round(ms / m) + 'm';
    }
    if (msAbs >= s) {
      return Math.round(ms / s) + 's';
    }
    return ms + 'ms';
  }

  /**
   * Long format for `ms`.
   *
   * @param {Number} ms
   * @return {String}
   * @api private
   */

  function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
      return plural(ms, msAbs, d, 'day');
    }
    if (msAbs >= h) {
      return plural(ms, msAbs, h, 'hour');
    }
    if (msAbs >= m) {
      return plural(ms, msAbs, m, 'minute');
    }
    if (msAbs >= s) {
      return plural(ms, msAbs, s, 'second');
    }
    return ms + ' ms';
  }

  /**
   * Pluralization helper.
   */

  function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = _freeGlobal || freeSelf || Function('return this')();

  var _root = root;

  /** Built-in value references. */
  var Symbol = _root.Symbol;

  var _Symbol = Symbol;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag$1 && symToStringTag$1 in Object(value))
      ? _getRawTag(value)
      : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /**
   * Checks if `value` is `null`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `null`, else `false`.
   * @example
   *
   * _.isNull(null);
   * // => true
   *
   * _.isNull(void 0);
   * // => false
   */

  var bn = createCommonjsModule(function (module) {
  (function (module, exports) {

    // Utils
    function assert (val, msg) {
      if (!val) throw new Error(msg || 'Assertion failed');
    }

    // Could use `inherits` module, but don't want to move from single file
    // architecture yet.
    function inherits (ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }

    // BN

    function BN (number, base, endian) {
      if (BN.isBN(number)) {
        return number;
      }

      this.negative = 0;
      this.words = null;
      this.length = 0;

      // Reduction context
      this.red = null;

      if (number !== null) {
        if (base === 'le' || base === 'be') {
          endian = base;
          base = 10;
        }

        this._init(number || 0, base || 10, endian || 'be');
      }
    }
    if (typeof module === 'object') {
      module.exports = BN;
    } else {
      exports.BN = BN;
    }

    BN.BN = BN;
    BN.wordSize = 26;

    var Buffer;
    try {
      Buffer = commonjsRequire('buf' + 'fer').Buffer;
    } catch (e) {
    }

    BN.isBN = function isBN (num) {
      if (num instanceof BN) {
        return true;
      }

      return num !== null && typeof num === 'object' &&
        num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
    };

    BN.max = function max (left, right) {
      if (left.cmp(right) > 0) return left;
      return right;
    };

    BN.min = function min (left, right) {
      if (left.cmp(right) < 0) return left;
      return right;
    };

    BN.prototype._init = function init (number, base, endian) {
      if (typeof number === 'number') {
        return this._initNumber(number, base, endian);
      }

      if (typeof number === 'object') {
        return this._initArray(number, base, endian);
      }

      if (base === 'hex') {
        base = 16;
      }
      assert(base === (base | 0) && base >= 2 && base <= 36);

      number = number.toString().replace(/\s+/g, '');
      var start = 0;
      if (number[0] === '-') {
        start++;
      }

      if (base === 16) {
        this._parseHex(number, start);
      } else {
        this._parseBase(number, base, start);
      }

      if (number[0] === '-') {
        this.negative = 1;
      }

      this.strip();

      if (endian !== 'le') return;

      this._initArray(this.toArray(), base, endian);
    };

    BN.prototype._initNumber = function _initNumber (number, base, endian) {
      if (number < 0) {
        this.negative = 1;
        number = -number;
      }
      if (number < 0x4000000) {
        this.words = [ number & 0x3ffffff ];
        this.length = 1;
      } else if (number < 0x10000000000000) {
        this.words = [
          number & 0x3ffffff,
          (number / 0x4000000) & 0x3ffffff
        ];
        this.length = 2;
      } else {
        assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
        this.words = [
          number & 0x3ffffff,
          (number / 0x4000000) & 0x3ffffff,
          1
        ];
        this.length = 3;
      }

      if (endian !== 'le') return;

      // Reverse the bytes
      this._initArray(this.toArray(), base, endian);
    };

    BN.prototype._initArray = function _initArray (number, base, endian) {
      // Perhaps a Uint8Array
      assert(typeof number.length === 'number');
      if (number.length <= 0) {
        this.words = [ 0 ];
        this.length = 1;
        return this;
      }

      this.length = Math.ceil(number.length / 3);
      this.words = new Array(this.length);
      for (var i = 0; i < this.length; i++) {
        this.words[i] = 0;
      }

      var j, w;
      var off = 0;
      if (endian === 'be') {
        for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
          w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
          this.words[j] |= (w << off) & 0x3ffffff;
          this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
      } else if (endian === 'le') {
        for (i = 0, j = 0; i < number.length; i += 3) {
          w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
          this.words[j] |= (w << off) & 0x3ffffff;
          this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
      }
      return this.strip();
    };

    function parseHex (str, start, end) {
      var r = 0;
      var len = Math.min(str.length, end);
      for (var i = start; i < len; i++) {
        var c = str.charCodeAt(i) - 48;

        r <<= 4;

        // 'a' - 'f'
        if (c >= 49 && c <= 54) {
          r |= c - 49 + 0xa;

        // 'A' - 'F'
        } else if (c >= 17 && c <= 22) {
          r |= c - 17 + 0xa;

        // '0' - '9'
        } else {
          r |= c & 0xf;
        }
      }
      return r;
    }

    BN.prototype._parseHex = function _parseHex (number, start) {
      // Create possibly bigger array to ensure that it fits the number
      this.length = Math.ceil((number.length - start) / 6);
      this.words = new Array(this.length);
      for (var i = 0; i < this.length; i++) {
        this.words[i] = 0;
      }

      var j, w;
      // Scan 24-bit chunks and add them to the number
      var off = 0;
      for (i = number.length - 6, j = 0; i >= start; i -= 6) {
        w = parseHex(number, i, i + 6);
        this.words[j] |= (w << off) & 0x3ffffff;
        // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
        this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
      if (i + 6 !== start) {
        w = parseHex(number, start, i + 6);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
      }
      this.strip();
    };

    function parseBase (str, start, end, mul) {
      var r = 0;
      var len = Math.min(str.length, end);
      for (var i = start; i < len; i++) {
        var c = str.charCodeAt(i) - 48;

        r *= mul;

        // 'a'
        if (c >= 49) {
          r += c - 49 + 0xa;

        // 'A'
        } else if (c >= 17) {
          r += c - 17 + 0xa;

        // '0' - '9'
        } else {
          r += c;
        }
      }
      return r;
    }

    BN.prototype._parseBase = function _parseBase (number, base, start) {
      // Initialize as zero
      this.words = [ 0 ];
      this.length = 1;

      // Find length of limb in base
      for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
        limbLen++;
      }
      limbLen--;
      limbPow = (limbPow / base) | 0;

      var total = number.length - start;
      var mod = total % limbLen;
      var end = Math.min(total, total - mod) + start;

      var word = 0;
      for (var i = start; i < end; i += limbLen) {
        word = parseBase(number, i, i + limbLen, base);

        this.imuln(limbPow);
        if (this.words[0] + word < 0x4000000) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }

      if (mod !== 0) {
        var pow = 1;
        word = parseBase(number, i, number.length, base);

        for (i = 0; i < mod; i++) {
          pow *= base;
        }

        this.imuln(pow);
        if (this.words[0] + word < 0x4000000) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }
    };

    BN.prototype.copy = function copy (dest) {
      dest.words = new Array(this.length);
      for (var i = 0; i < this.length; i++) {
        dest.words[i] = this.words[i];
      }
      dest.length = this.length;
      dest.negative = this.negative;
      dest.red = this.red;
    };

    BN.prototype.clone = function clone () {
      var r = new BN(null);
      this.copy(r);
      return r;
    };

    BN.prototype._expand = function _expand (size) {
      while (this.length < size) {
        this.words[this.length++] = 0;
      }
      return this;
    };

    // Remove leading `0` from `this`
    BN.prototype.strip = function strip () {
      while (this.length > 1 && this.words[this.length - 1] === 0) {
        this.length--;
      }
      return this._normSign();
    };

    BN.prototype._normSign = function _normSign () {
      // -0 = 0
      if (this.length === 1 && this.words[0] === 0) {
        this.negative = 0;
      }
      return this;
    };

    BN.prototype.inspect = function inspect () {
      return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
    };

    /*

    var zeros = [];
    var groupSizes = [];
    var groupBases = [];

    var s = '';
    var i = -1;
    while (++i < BN.wordSize) {
      zeros[i] = s;
      s += '0';
    }
    groupSizes[0] = 0;
    groupSizes[1] = 0;
    groupBases[0] = 0;
    groupBases[1] = 0;
    var base = 2 - 1;
    while (++base < 36 + 1) {
      var groupSize = 0;
      var groupBase = 1;
      while (groupBase < (1 << BN.wordSize) / base) {
        groupBase *= base;
        groupSize += 1;
      }
      groupSizes[base] = groupSize;
      groupBases[base] = groupBase;
    }

    */

    var zeros = [
      '',
      '0',
      '00',
      '000',
      '0000',
      '00000',
      '000000',
      '0000000',
      '00000000',
      '000000000',
      '0000000000',
      '00000000000',
      '000000000000',
      '0000000000000',
      '00000000000000',
      '000000000000000',
      '0000000000000000',
      '00000000000000000',
      '000000000000000000',
      '0000000000000000000',
      '00000000000000000000',
      '000000000000000000000',
      '0000000000000000000000',
      '00000000000000000000000',
      '000000000000000000000000',
      '0000000000000000000000000'
    ];

    var groupSizes = [
      0, 0,
      25, 16, 12, 11, 10, 9, 8,
      8, 7, 7, 7, 7, 6, 6,
      6, 6, 6, 6, 6, 5, 5,
      5, 5, 5, 5, 5, 5, 5,
      5, 5, 5, 5, 5, 5, 5
    ];

    var groupBases = [
      0, 0,
      33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
      43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
      16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
      6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
      24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
    ];

    BN.prototype.toString = function toString (base, padding) {
      base = base || 10;
      padding = padding | 0 || 1;

      var out;
      if (base === 16 || base === 'hex') {
        out = '';
        var off = 0;
        var carry = 0;
        for (var i = 0; i < this.length; i++) {
          var w = this.words[i];
          var word = (((w << off) | carry) & 0xffffff).toString(16);
          carry = (w >>> (24 - off)) & 0xffffff;
          if (carry !== 0 || i !== this.length - 1) {
            out = zeros[6 - word.length] + word + out;
          } else {
            out = word + out;
          }
          off += 2;
          if (off >= 26) {
            off -= 26;
            i--;
          }
        }
        if (carry !== 0) {
          out = carry.toString(16) + out;
        }
        while (out.length % padding !== 0) {
          out = '0' + out;
        }
        if (this.negative !== 0) {
          out = '-' + out;
        }
        return out;
      }

      if (base === (base | 0) && base >= 2 && base <= 36) {
        // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
        var groupSize = groupSizes[base];
        // var groupBase = Math.pow(base, groupSize);
        var groupBase = groupBases[base];
        out = '';
        var c = this.clone();
        c.negative = 0;
        while (!c.isZero()) {
          var r = c.modn(groupBase).toString(base);
          c = c.idivn(groupBase);

          if (!c.isZero()) {
            out = zeros[groupSize - r.length] + r + out;
          } else {
            out = r + out;
          }
        }
        if (this.isZero()) {
          out = '0' + out;
        }
        while (out.length % padding !== 0) {
          out = '0' + out;
        }
        if (this.negative !== 0) {
          out = '-' + out;
        }
        return out;
      }

      assert(false, 'Base should be between 2 and 36');
    };

    BN.prototype.toNumber = function toNumber () {
      var ret = this.words[0];
      if (this.length === 2) {
        ret += this.words[1] * 0x4000000;
      } else if (this.length === 3 && this.words[2] === 0x01) {
        // NOTE: at this stage it is known that the top bit is set
        ret += 0x10000000000000 + (this.words[1] * 0x4000000);
      } else if (this.length > 2) {
        assert(false, 'Number can only safely store up to 53 bits');
      }
      return (this.negative !== 0) ? -ret : ret;
    };

    BN.prototype.toJSON = function toJSON () {
      return this.toString(16);
    };

    BN.prototype.toBuffer = function toBuffer (endian, length) {
      assert(typeof Buffer !== 'undefined');
      return this.toArrayLike(Buffer, endian, length);
    };

    BN.prototype.toArray = function toArray (endian, length) {
      return this.toArrayLike(Array, endian, length);
    };

    BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
      var byteLength = this.byteLength();
      var reqLength = length || Math.max(1, byteLength);
      assert(byteLength <= reqLength, 'byte array longer than desired length');
      assert(reqLength > 0, 'Requested array length <= 0');

      this.strip();
      var littleEndian = endian === 'le';
      var res = new ArrayType(reqLength);

      var b, i;
      var q = this.clone();
      if (!littleEndian) {
        // Assume big-endian
        for (i = 0; i < reqLength - byteLength; i++) {
          res[i] = 0;
        }

        for (i = 0; !q.isZero(); i++) {
          b = q.andln(0xff);
          q.iushrn(8);

          res[reqLength - i - 1] = b;
        }
      } else {
        for (i = 0; !q.isZero(); i++) {
          b = q.andln(0xff);
          q.iushrn(8);

          res[i] = b;
        }

        for (; i < reqLength; i++) {
          res[i] = 0;
        }
      }

      return res;
    };

    if (Math.clz32) {
      BN.prototype._countBits = function _countBits (w) {
        return 32 - Math.clz32(w);
      };
    } else {
      BN.prototype._countBits = function _countBits (w) {
        var t = w;
        var r = 0;
        if (t >= 0x1000) {
          r += 13;
          t >>>= 13;
        }
        if (t >= 0x40) {
          r += 7;
          t >>>= 7;
        }
        if (t >= 0x8) {
          r += 4;
          t >>>= 4;
        }
        if (t >= 0x02) {
          r += 2;
          t >>>= 2;
        }
        return r + t;
      };
    }

    BN.prototype._zeroBits = function _zeroBits (w) {
      // Short-cut
      if (w === 0) return 26;

      var t = w;
      var r = 0;
      if ((t & 0x1fff) === 0) {
        r += 13;
        t >>>= 13;
      }
      if ((t & 0x7f) === 0) {
        r += 7;
        t >>>= 7;
      }
      if ((t & 0xf) === 0) {
        r += 4;
        t >>>= 4;
      }
      if ((t & 0x3) === 0) {
        r += 2;
        t >>>= 2;
      }
      if ((t & 0x1) === 0) {
        r++;
      }
      return r;
    };

    // Return number of used bits in a BN
    BN.prototype.bitLength = function bitLength () {
      var w = this.words[this.length - 1];
      var hi = this._countBits(w);
      return (this.length - 1) * 26 + hi;
    };

    function toBitArray (num) {
      var w = new Array(num.bitLength());

      for (var bit = 0; bit < w.length; bit++) {
        var off = (bit / 26) | 0;
        var wbit = bit % 26;

        w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
      }

      return w;
    }

    // Number of trailing zero bits
    BN.prototype.zeroBits = function zeroBits () {
      if (this.isZero()) return 0;

      var r = 0;
      for (var i = 0; i < this.length; i++) {
        var b = this._zeroBits(this.words[i]);
        r += b;
        if (b !== 26) break;
      }
      return r;
    };

    BN.prototype.byteLength = function byteLength () {
      return Math.ceil(this.bitLength() / 8);
    };

    BN.prototype.toTwos = function toTwos (width) {
      if (this.negative !== 0) {
        return this.abs().inotn(width).iaddn(1);
      }
      return this.clone();
    };

    BN.prototype.fromTwos = function fromTwos (width) {
      if (this.testn(width - 1)) {
        return this.notn(width).iaddn(1).ineg();
      }
      return this.clone();
    };

    BN.prototype.isNeg = function isNeg () {
      return this.negative !== 0;
    };

    // Return negative clone of `this`
    BN.prototype.neg = function neg () {
      return this.clone().ineg();
    };

    BN.prototype.ineg = function ineg () {
      if (!this.isZero()) {
        this.negative ^= 1;
      }

      return this;
    };

    // Or `num` with `this` in-place
    BN.prototype.iuor = function iuor (num) {
      while (this.length < num.length) {
        this.words[this.length++] = 0;
      }

      for (var i = 0; i < num.length; i++) {
        this.words[i] = this.words[i] | num.words[i];
      }

      return this.strip();
    };

    BN.prototype.ior = function ior (num) {
      assert((this.negative | num.negative) === 0);
      return this.iuor(num);
    };

    // Or `num` with `this`
    BN.prototype.or = function or (num) {
      if (this.length > num.length) return this.clone().ior(num);
      return num.clone().ior(this);
    };

    BN.prototype.uor = function uor (num) {
      if (this.length > num.length) return this.clone().iuor(num);
      return num.clone().iuor(this);
    };

    // And `num` with `this` in-place
    BN.prototype.iuand = function iuand (num) {
      // b = min-length(num, this)
      var b;
      if (this.length > num.length) {
        b = num;
      } else {
        b = this;
      }

      for (var i = 0; i < b.length; i++) {
        this.words[i] = this.words[i] & num.words[i];
      }

      this.length = b.length;

      return this.strip();
    };

    BN.prototype.iand = function iand (num) {
      assert((this.negative | num.negative) === 0);
      return this.iuand(num);
    };

    // And `num` with `this`
    BN.prototype.and = function and (num) {
      if (this.length > num.length) return this.clone().iand(num);
      return num.clone().iand(this);
    };

    BN.prototype.uand = function uand (num) {
      if (this.length > num.length) return this.clone().iuand(num);
      return num.clone().iuand(this);
    };

    // Xor `num` with `this` in-place
    BN.prototype.iuxor = function iuxor (num) {
      // a.length > b.length
      var a;
      var b;
      if (this.length > num.length) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }

      for (var i = 0; i < b.length; i++) {
        this.words[i] = a.words[i] ^ b.words[i];
      }

      if (this !== a) {
        for (; i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }

      this.length = a.length;

      return this.strip();
    };

    BN.prototype.ixor = function ixor (num) {
      assert((this.negative | num.negative) === 0);
      return this.iuxor(num);
    };

    // Xor `num` with `this`
    BN.prototype.xor = function xor (num) {
      if (this.length > num.length) return this.clone().ixor(num);
      return num.clone().ixor(this);
    };

    BN.prototype.uxor = function uxor (num) {
      if (this.length > num.length) return this.clone().iuxor(num);
      return num.clone().iuxor(this);
    };

    // Not ``this`` with ``width`` bitwidth
    BN.prototype.inotn = function inotn (width) {
      assert(typeof width === 'number' && width >= 0);

      var bytesNeeded = Math.ceil(width / 26) | 0;
      var bitsLeft = width % 26;

      // Extend the buffer with leading zeroes
      this._expand(bytesNeeded);

      if (bitsLeft > 0) {
        bytesNeeded--;
      }

      // Handle complete words
      for (var i = 0; i < bytesNeeded; i++) {
        this.words[i] = ~this.words[i] & 0x3ffffff;
      }

      // Handle the residue
      if (bitsLeft > 0) {
        this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
      }

      // And remove leading zeroes
      return this.strip();
    };

    BN.prototype.notn = function notn (width) {
      return this.clone().inotn(width);
    };

    // Set `bit` of `this`
    BN.prototype.setn = function setn (bit, val) {
      assert(typeof bit === 'number' && bit >= 0);

      var off = (bit / 26) | 0;
      var wbit = bit % 26;

      this._expand(off + 1);

      if (val) {
        this.words[off] = this.words[off] | (1 << wbit);
      } else {
        this.words[off] = this.words[off] & ~(1 << wbit);
      }

      return this.strip();
    };

    // Add `num` to `this` in-place
    BN.prototype.iadd = function iadd (num) {
      var r;

      // negative + positive
      if (this.negative !== 0 && num.negative === 0) {
        this.negative = 0;
        r = this.isub(num);
        this.negative ^= 1;
        return this._normSign();

      // positive + negative
      } else if (this.negative === 0 && num.negative !== 0) {
        num.negative = 0;
        r = this.isub(num);
        num.negative = 1;
        return r._normSign();
      }

      // a.length > b.length
      var a, b;
      if (this.length > num.length) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }

      var carry = 0;
      for (var i = 0; i < b.length; i++) {
        r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
        this.words[i] = r & 0x3ffffff;
        carry = r >>> 26;
      }
      for (; carry !== 0 && i < a.length; i++) {
        r = (a.words[i] | 0) + carry;
        this.words[i] = r & 0x3ffffff;
        carry = r >>> 26;
      }

      this.length = a.length;
      if (carry !== 0) {
        this.words[this.length] = carry;
        this.length++;
      // Copy the rest of the words
      } else if (a !== this) {
        for (; i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }

      return this;
    };

    // Add `num` to `this`
    BN.prototype.add = function add (num) {
      var res;
      if (num.negative !== 0 && this.negative === 0) {
        num.negative = 0;
        res = this.sub(num);
        num.negative ^= 1;
        return res;
      } else if (num.negative === 0 && this.negative !== 0) {
        this.negative = 0;
        res = num.sub(this);
        this.negative = 1;
        return res;
      }

      if (this.length > num.length) return this.clone().iadd(num);

      return num.clone().iadd(this);
    };

    // Subtract `num` from `this` in-place
    BN.prototype.isub = function isub (num) {
      // this - (-num) = this + num
      if (num.negative !== 0) {
        num.negative = 0;
        var r = this.iadd(num);
        num.negative = 1;
        return r._normSign();

      // -this - num = -(this + num)
      } else if (this.negative !== 0) {
        this.negative = 0;
        this.iadd(num);
        this.negative = 1;
        return this._normSign();
      }

      // At this point both numbers are positive
      var cmp = this.cmp(num);

      // Optimization - zeroify
      if (cmp === 0) {
        this.negative = 0;
        this.length = 1;
        this.words[0] = 0;
        return this;
      }

      // a > b
      var a, b;
      if (cmp > 0) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }

      var carry = 0;
      for (var i = 0; i < b.length; i++) {
        r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
        carry = r >> 26;
        this.words[i] = r & 0x3ffffff;
      }
      for (; carry !== 0 && i < a.length; i++) {
        r = (a.words[i] | 0) + carry;
        carry = r >> 26;
        this.words[i] = r & 0x3ffffff;
      }

      // Copy rest of the words
      if (carry === 0 && i < a.length && a !== this) {
        for (; i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }

      this.length = Math.max(this.length, i);

      if (a !== this) {
        this.negative = 1;
      }

      return this.strip();
    };

    // Subtract `num` from `this`
    BN.prototype.sub = function sub (num) {
      return this.clone().isub(num);
    };

    function smallMulTo (self, num, out) {
      out.negative = num.negative ^ self.negative;
      var len = (self.length + num.length) | 0;
      out.length = len;
      len = (len - 1) | 0;

      // Peel one iteration (compiler can't do it, because of code complexity)
      var a = self.words[0] | 0;
      var b = num.words[0] | 0;
      var r = a * b;

      var lo = r & 0x3ffffff;
      var carry = (r / 0x4000000) | 0;
      out.words[0] = lo;

      for (var k = 1; k < len; k++) {
        // Sum all words with the same `i + j = k` and accumulate `ncarry`,
        // note that ncarry could be >= 0x3ffffff
        var ncarry = carry >>> 26;
        var rword = carry & 0x3ffffff;
        var maxJ = Math.min(k, num.length - 1);
        for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
          var i = (k - j) | 0;
          a = self.words[i] | 0;
          b = num.words[j] | 0;
          r = a * b + rword;
          ncarry += (r / 0x4000000) | 0;
          rword = r & 0x3ffffff;
        }
        out.words[k] = rword | 0;
        carry = ncarry | 0;
      }
      if (carry !== 0) {
        out.words[k] = carry | 0;
      } else {
        out.length--;
      }

      return out.strip();
    }

    // TODO(indutny): it may be reasonable to omit it for users who don't need
    // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
    // multiplication (like elliptic secp256k1).
    var comb10MulTo = function comb10MulTo (self, num, out) {
      var a = self.words;
      var b = num.words;
      var o = out.words;
      var c = 0;
      var lo;
      var mid;
      var hi;
      var a0 = a[0] | 0;
      var al0 = a0 & 0x1fff;
      var ah0 = a0 >>> 13;
      var a1 = a[1] | 0;
      var al1 = a1 & 0x1fff;
      var ah1 = a1 >>> 13;
      var a2 = a[2] | 0;
      var al2 = a2 & 0x1fff;
      var ah2 = a2 >>> 13;
      var a3 = a[3] | 0;
      var al3 = a3 & 0x1fff;
      var ah3 = a3 >>> 13;
      var a4 = a[4] | 0;
      var al4 = a4 & 0x1fff;
      var ah4 = a4 >>> 13;
      var a5 = a[5] | 0;
      var al5 = a5 & 0x1fff;
      var ah5 = a5 >>> 13;
      var a6 = a[6] | 0;
      var al6 = a6 & 0x1fff;
      var ah6 = a6 >>> 13;
      var a7 = a[7] | 0;
      var al7 = a7 & 0x1fff;
      var ah7 = a7 >>> 13;
      var a8 = a[8] | 0;
      var al8 = a8 & 0x1fff;
      var ah8 = a8 >>> 13;
      var a9 = a[9] | 0;
      var al9 = a9 & 0x1fff;
      var ah9 = a9 >>> 13;
      var b0 = b[0] | 0;
      var bl0 = b0 & 0x1fff;
      var bh0 = b0 >>> 13;
      var b1 = b[1] | 0;
      var bl1 = b1 & 0x1fff;
      var bh1 = b1 >>> 13;
      var b2 = b[2] | 0;
      var bl2 = b2 & 0x1fff;
      var bh2 = b2 >>> 13;
      var b3 = b[3] | 0;
      var bl3 = b3 & 0x1fff;
      var bh3 = b3 >>> 13;
      var b4 = b[4] | 0;
      var bl4 = b4 & 0x1fff;
      var bh4 = b4 >>> 13;
      var b5 = b[5] | 0;
      var bl5 = b5 & 0x1fff;
      var bh5 = b5 >>> 13;
      var b6 = b[6] | 0;
      var bl6 = b6 & 0x1fff;
      var bh6 = b6 >>> 13;
      var b7 = b[7] | 0;
      var bl7 = b7 & 0x1fff;
      var bh7 = b7 >>> 13;
      var b8 = b[8] | 0;
      var bl8 = b8 & 0x1fff;
      var bh8 = b8 >>> 13;
      var b9 = b[9] | 0;
      var bl9 = b9 & 0x1fff;
      var bh9 = b9 >>> 13;

      out.negative = self.negative ^ num.negative;
      out.length = 19;
      /* k = 0 */
      lo = Math.imul(al0, bl0);
      mid = Math.imul(al0, bh0);
      mid = (mid + Math.imul(ah0, bl0)) | 0;
      hi = Math.imul(ah0, bh0);
      var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
      w0 &= 0x3ffffff;
      /* k = 1 */
      lo = Math.imul(al1, bl0);
      mid = Math.imul(al1, bh0);
      mid = (mid + Math.imul(ah1, bl0)) | 0;
      hi = Math.imul(ah1, bh0);
      lo = (lo + Math.imul(al0, bl1)) | 0;
      mid = (mid + Math.imul(al0, bh1)) | 0;
      mid = (mid + Math.imul(ah0, bl1)) | 0;
      hi = (hi + Math.imul(ah0, bh1)) | 0;
      var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
      w1 &= 0x3ffffff;
      /* k = 2 */
      lo = Math.imul(al2, bl0);
      mid = Math.imul(al2, bh0);
      mid = (mid + Math.imul(ah2, bl0)) | 0;
      hi = Math.imul(ah2, bh0);
      lo = (lo + Math.imul(al1, bl1)) | 0;
      mid = (mid + Math.imul(al1, bh1)) | 0;
      mid = (mid + Math.imul(ah1, bl1)) | 0;
      hi = (hi + Math.imul(ah1, bh1)) | 0;
      lo = (lo + Math.imul(al0, bl2)) | 0;
      mid = (mid + Math.imul(al0, bh2)) | 0;
      mid = (mid + Math.imul(ah0, bl2)) | 0;
      hi = (hi + Math.imul(ah0, bh2)) | 0;
      var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
      w2 &= 0x3ffffff;
      /* k = 3 */
      lo = Math.imul(al3, bl0);
      mid = Math.imul(al3, bh0);
      mid = (mid + Math.imul(ah3, bl0)) | 0;
      hi = Math.imul(ah3, bh0);
      lo = (lo + Math.imul(al2, bl1)) | 0;
      mid = (mid + Math.imul(al2, bh1)) | 0;
      mid = (mid + Math.imul(ah2, bl1)) | 0;
      hi = (hi + Math.imul(ah2, bh1)) | 0;
      lo = (lo + Math.imul(al1, bl2)) | 0;
      mid = (mid + Math.imul(al1, bh2)) | 0;
      mid = (mid + Math.imul(ah1, bl2)) | 0;
      hi = (hi + Math.imul(ah1, bh2)) | 0;
      lo = (lo + Math.imul(al0, bl3)) | 0;
      mid = (mid + Math.imul(al0, bh3)) | 0;
      mid = (mid + Math.imul(ah0, bl3)) | 0;
      hi = (hi + Math.imul(ah0, bh3)) | 0;
      var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
      w3 &= 0x3ffffff;
      /* k = 4 */
      lo = Math.imul(al4, bl0);
      mid = Math.imul(al4, bh0);
      mid = (mid + Math.imul(ah4, bl0)) | 0;
      hi = Math.imul(ah4, bh0);
      lo = (lo + Math.imul(al3, bl1)) | 0;
      mid = (mid + Math.imul(al3, bh1)) | 0;
      mid = (mid + Math.imul(ah3, bl1)) | 0;
      hi = (hi + Math.imul(ah3, bh1)) | 0;
      lo = (lo + Math.imul(al2, bl2)) | 0;
      mid = (mid + Math.imul(al2, bh2)) | 0;
      mid = (mid + Math.imul(ah2, bl2)) | 0;
      hi = (hi + Math.imul(ah2, bh2)) | 0;
      lo = (lo + Math.imul(al1, bl3)) | 0;
      mid = (mid + Math.imul(al1, bh3)) | 0;
      mid = (mid + Math.imul(ah1, bl3)) | 0;
      hi = (hi + Math.imul(ah1, bh3)) | 0;
      lo = (lo + Math.imul(al0, bl4)) | 0;
      mid = (mid + Math.imul(al0, bh4)) | 0;
      mid = (mid + Math.imul(ah0, bl4)) | 0;
      hi = (hi + Math.imul(ah0, bh4)) | 0;
      var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
      w4 &= 0x3ffffff;
      /* k = 5 */
      lo = Math.imul(al5, bl0);
      mid = Math.imul(al5, bh0);
      mid = (mid + Math.imul(ah5, bl0)) | 0;
      hi = Math.imul(ah5, bh0);
      lo = (lo + Math.imul(al4, bl1)) | 0;
      mid = (mid + Math.imul(al4, bh1)) | 0;
      mid = (mid + Math.imul(ah4, bl1)) | 0;
      hi = (hi + Math.imul(ah4, bh1)) | 0;
      lo = (lo + Math.imul(al3, bl2)) | 0;
      mid = (mid + Math.imul(al3, bh2)) | 0;
      mid = (mid + Math.imul(ah3, bl2)) | 0;
      hi = (hi + Math.imul(ah3, bh2)) | 0;
      lo = (lo + Math.imul(al2, bl3)) | 0;
      mid = (mid + Math.imul(al2, bh3)) | 0;
      mid = (mid + Math.imul(ah2, bl3)) | 0;
      hi = (hi + Math.imul(ah2, bh3)) | 0;
      lo = (lo + Math.imul(al1, bl4)) | 0;
      mid = (mid + Math.imul(al1, bh4)) | 0;
      mid = (mid + Math.imul(ah1, bl4)) | 0;
      hi = (hi + Math.imul(ah1, bh4)) | 0;
      lo = (lo + Math.imul(al0, bl5)) | 0;
      mid = (mid + Math.imul(al0, bh5)) | 0;
      mid = (mid + Math.imul(ah0, bl5)) | 0;
      hi = (hi + Math.imul(ah0, bh5)) | 0;
      var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
      w5 &= 0x3ffffff;
      /* k = 6 */
      lo = Math.imul(al6, bl0);
      mid = Math.imul(al6, bh0);
      mid = (mid + Math.imul(ah6, bl0)) | 0;
      hi = Math.imul(ah6, bh0);
      lo = (lo + Math.imul(al5, bl1)) | 0;
      mid = (mid + Math.imul(al5, bh1)) | 0;
      mid = (mid + Math.imul(ah5, bl1)) | 0;
      hi = (hi + Math.imul(ah5, bh1)) | 0;
      lo = (lo + Math.imul(al4, bl2)) | 0;
      mid = (mid + Math.imul(al4, bh2)) | 0;
      mid = (mid + Math.imul(ah4, bl2)) | 0;
      hi = (hi + Math.imul(ah4, bh2)) | 0;
      lo = (lo + Math.imul(al3, bl3)) | 0;
      mid = (mid + Math.imul(al3, bh3)) | 0;
      mid = (mid + Math.imul(ah3, bl3)) | 0;
      hi = (hi + Math.imul(ah3, bh3)) | 0;
      lo = (lo + Math.imul(al2, bl4)) | 0;
      mid = (mid + Math.imul(al2, bh4)) | 0;
      mid = (mid + Math.imul(ah2, bl4)) | 0;
      hi = (hi + Math.imul(ah2, bh4)) | 0;
      lo = (lo + Math.imul(al1, bl5)) | 0;
      mid = (mid + Math.imul(al1, bh5)) | 0;
      mid = (mid + Math.imul(ah1, bl5)) | 0;
      hi = (hi + Math.imul(ah1, bh5)) | 0;
      lo = (lo + Math.imul(al0, bl6)) | 0;
      mid = (mid + Math.imul(al0, bh6)) | 0;
      mid = (mid + Math.imul(ah0, bl6)) | 0;
      hi = (hi + Math.imul(ah0, bh6)) | 0;
      var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
      w6 &= 0x3ffffff;
      /* k = 7 */
      lo = Math.imul(al7, bl0);
      mid = Math.imul(al7, bh0);
      mid = (mid + Math.imul(ah7, bl0)) | 0;
      hi = Math.imul(ah7, bh0);
      lo = (lo + Math.imul(al6, bl1)) | 0;
      mid = (mid + Math.imul(al6, bh1)) | 0;
      mid = (mid + Math.imul(ah6, bl1)) | 0;
      hi = (hi + Math.imul(ah6, bh1)) | 0;
      lo = (lo + Math.imul(al5, bl2)) | 0;
      mid = (mid + Math.imul(al5, bh2)) | 0;
      mid = (mid + Math.imul(ah5, bl2)) | 0;
      hi = (hi + Math.imul(ah5, bh2)) | 0;
      lo = (lo + Math.imul(al4, bl3)) | 0;
      mid = (mid + Math.imul(al4, bh3)) | 0;
      mid = (mid + Math.imul(ah4, bl3)) | 0;
      hi = (hi + Math.imul(ah4, bh3)) | 0;
      lo = (lo + Math.imul(al3, bl4)) | 0;
      mid = (mid + Math.imul(al3, bh4)) | 0;
      mid = (mid + Math.imul(ah3, bl4)) | 0;
      hi = (hi + Math.imul(ah3, bh4)) | 0;
      lo = (lo + Math.imul(al2, bl5)) | 0;
      mid = (mid + Math.imul(al2, bh5)) | 0;
      mid = (mid + Math.imul(ah2, bl5)) | 0;
      hi = (hi + Math.imul(ah2, bh5)) | 0;
      lo = (lo + Math.imul(al1, bl6)) | 0;
      mid = (mid + Math.imul(al1, bh6)) | 0;
      mid = (mid + Math.imul(ah1, bl6)) | 0;
      hi = (hi + Math.imul(ah1, bh6)) | 0;
      lo = (lo + Math.imul(al0, bl7)) | 0;
      mid = (mid + Math.imul(al0, bh7)) | 0;
      mid = (mid + Math.imul(ah0, bl7)) | 0;
      hi = (hi + Math.imul(ah0, bh7)) | 0;
      var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
      w7 &= 0x3ffffff;
      /* k = 8 */
      lo = Math.imul(al8, bl0);
      mid = Math.imul(al8, bh0);
      mid = (mid + Math.imul(ah8, bl0)) | 0;
      hi = Math.imul(ah8, bh0);
      lo = (lo + Math.imul(al7, bl1)) | 0;
      mid = (mid + Math.imul(al7, bh1)) | 0;
      mid = (mid + Math.imul(ah7, bl1)) | 0;
      hi = (hi + Math.imul(ah7, bh1)) | 0;
      lo = (lo + Math.imul(al6, bl2)) | 0;
      mid = (mid + Math.imul(al6, bh2)) | 0;
      mid = (mid + Math.imul(ah6, bl2)) | 0;
      hi = (hi + Math.imul(ah6, bh2)) | 0;
      lo = (lo + Math.imul(al5, bl3)) | 0;
      mid = (mid + Math.imul(al5, bh3)) | 0;
      mid = (mid + Math.imul(ah5, bl3)) | 0;
      hi = (hi + Math.imul(ah5, bh3)) | 0;
      lo = (lo + Math.imul(al4, bl4)) | 0;
      mid = (mid + Math.imul(al4, bh4)) | 0;
      mid = (mid + Math.imul(ah4, bl4)) | 0;
      hi = (hi + Math.imul(ah4, bh4)) | 0;
      lo = (lo + Math.imul(al3, bl5)) | 0;
      mid = (mid + Math.imul(al3, bh5)) | 0;
      mid = (mid + Math.imul(ah3, bl5)) | 0;
      hi = (hi + Math.imul(ah3, bh5)) | 0;
      lo = (lo + Math.imul(al2, bl6)) | 0;
      mid = (mid + Math.imul(al2, bh6)) | 0;
      mid = (mid + Math.imul(ah2, bl6)) | 0;
      hi = (hi + Math.imul(ah2, bh6)) | 0;
      lo = (lo + Math.imul(al1, bl7)) | 0;
      mid = (mid + Math.imul(al1, bh7)) | 0;
      mid = (mid + Math.imul(ah1, bl7)) | 0;
      hi = (hi + Math.imul(ah1, bh7)) | 0;
      lo = (lo + Math.imul(al0, bl8)) | 0;
      mid = (mid + Math.imul(al0, bh8)) | 0;
      mid = (mid + Math.imul(ah0, bl8)) | 0;
      hi = (hi + Math.imul(ah0, bh8)) | 0;
      var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
      w8 &= 0x3ffffff;
      /* k = 9 */
      lo = Math.imul(al9, bl0);
      mid = Math.imul(al9, bh0);
      mid = (mid + Math.imul(ah9, bl0)) | 0;
      hi = Math.imul(ah9, bh0);
      lo = (lo + Math.imul(al8, bl1)) | 0;
      mid = (mid + Math.imul(al8, bh1)) | 0;
      mid = (mid + Math.imul(ah8, bl1)) | 0;
      hi = (hi + Math.imul(ah8, bh1)) | 0;
      lo = (lo + Math.imul(al7, bl2)) | 0;
      mid = (mid + Math.imul(al7, bh2)) | 0;
      mid = (mid + Math.imul(ah7, bl2)) | 0;
      hi = (hi + Math.imul(ah7, bh2)) | 0;
      lo = (lo + Math.imul(al6, bl3)) | 0;
      mid = (mid + Math.imul(al6, bh3)) | 0;
      mid = (mid + Math.imul(ah6, bl3)) | 0;
      hi = (hi + Math.imul(ah6, bh3)) | 0;
      lo = (lo + Math.imul(al5, bl4)) | 0;
      mid = (mid + Math.imul(al5, bh4)) | 0;
      mid = (mid + Math.imul(ah5, bl4)) | 0;
      hi = (hi + Math.imul(ah5, bh4)) | 0;
      lo = (lo + Math.imul(al4, bl5)) | 0;
      mid = (mid + Math.imul(al4, bh5)) | 0;
      mid = (mid + Math.imul(ah4, bl5)) | 0;
      hi = (hi + Math.imul(ah4, bh5)) | 0;
      lo = (lo + Math.imul(al3, bl6)) | 0;
      mid = (mid + Math.imul(al3, bh6)) | 0;
      mid = (mid + Math.imul(ah3, bl6)) | 0;
      hi = (hi + Math.imul(ah3, bh6)) | 0;
      lo = (lo + Math.imul(al2, bl7)) | 0;
      mid = (mid + Math.imul(al2, bh7)) | 0;
      mid = (mid + Math.imul(ah2, bl7)) | 0;
      hi = (hi + Math.imul(ah2, bh7)) | 0;
      lo = (lo + Math.imul(al1, bl8)) | 0;
      mid = (mid + Math.imul(al1, bh8)) | 0;
      mid = (mid + Math.imul(ah1, bl8)) | 0;
      hi = (hi + Math.imul(ah1, bh8)) | 0;
      lo = (lo + Math.imul(al0, bl9)) | 0;
      mid = (mid + Math.imul(al0, bh9)) | 0;
      mid = (mid + Math.imul(ah0, bl9)) | 0;
      hi = (hi + Math.imul(ah0, bh9)) | 0;
      var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
      w9 &= 0x3ffffff;
      /* k = 10 */
      lo = Math.imul(al9, bl1);
      mid = Math.imul(al9, bh1);
      mid = (mid + Math.imul(ah9, bl1)) | 0;
      hi = Math.imul(ah9, bh1);
      lo = (lo + Math.imul(al8, bl2)) | 0;
      mid = (mid + Math.imul(al8, bh2)) | 0;
      mid = (mid + Math.imul(ah8, bl2)) | 0;
      hi = (hi + Math.imul(ah8, bh2)) | 0;
      lo = (lo + Math.imul(al7, bl3)) | 0;
      mid = (mid + Math.imul(al7, bh3)) | 0;
      mid = (mid + Math.imul(ah7, bl3)) | 0;
      hi = (hi + Math.imul(ah7, bh3)) | 0;
      lo = (lo + Math.imul(al6, bl4)) | 0;
      mid = (mid + Math.imul(al6, bh4)) | 0;
      mid = (mid + Math.imul(ah6, bl4)) | 0;
      hi = (hi + Math.imul(ah6, bh4)) | 0;
      lo = (lo + Math.imul(al5, bl5)) | 0;
      mid = (mid + Math.imul(al5, bh5)) | 0;
      mid = (mid + Math.imul(ah5, bl5)) | 0;
      hi = (hi + Math.imul(ah5, bh5)) | 0;
      lo = (lo + Math.imul(al4, bl6)) | 0;
      mid = (mid + Math.imul(al4, bh6)) | 0;
      mid = (mid + Math.imul(ah4, bl6)) | 0;
      hi = (hi + Math.imul(ah4, bh6)) | 0;
      lo = (lo + Math.imul(al3, bl7)) | 0;
      mid = (mid + Math.imul(al3, bh7)) | 0;
      mid = (mid + Math.imul(ah3, bl7)) | 0;
      hi = (hi + Math.imul(ah3, bh7)) | 0;
      lo = (lo + Math.imul(al2, bl8)) | 0;
      mid = (mid + Math.imul(al2, bh8)) | 0;
      mid = (mid + Math.imul(ah2, bl8)) | 0;
      hi = (hi + Math.imul(ah2, bh8)) | 0;
      lo = (lo + Math.imul(al1, bl9)) | 0;
      mid = (mid + Math.imul(al1, bh9)) | 0;
      mid = (mid + Math.imul(ah1, bl9)) | 0;
      hi = (hi + Math.imul(ah1, bh9)) | 0;
      var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
      w10 &= 0x3ffffff;
      /* k = 11 */
      lo = Math.imul(al9, bl2);
      mid = Math.imul(al9, bh2);
      mid = (mid + Math.imul(ah9, bl2)) | 0;
      hi = Math.imul(ah9, bh2);
      lo = (lo + Math.imul(al8, bl3)) | 0;
      mid = (mid + Math.imul(al8, bh3)) | 0;
      mid = (mid + Math.imul(ah8, bl3)) | 0;
      hi = (hi + Math.imul(ah8, bh3)) | 0;
      lo = (lo + Math.imul(al7, bl4)) | 0;
      mid = (mid + Math.imul(al7, bh4)) | 0;
      mid = (mid + Math.imul(ah7, bl4)) | 0;
      hi = (hi + Math.imul(ah7, bh4)) | 0;
      lo = (lo + Math.imul(al6, bl5)) | 0;
      mid = (mid + Math.imul(al6, bh5)) | 0;
      mid = (mid + Math.imul(ah6, bl5)) | 0;
      hi = (hi + Math.imul(ah6, bh5)) | 0;
      lo = (lo + Math.imul(al5, bl6)) | 0;
      mid = (mid + Math.imul(al5, bh6)) | 0;
      mid = (mid + Math.imul(ah5, bl6)) | 0;
      hi = (hi + Math.imul(ah5, bh6)) | 0;
      lo = (lo + Math.imul(al4, bl7)) | 0;
      mid = (mid + Math.imul(al4, bh7)) | 0;
      mid = (mid + Math.imul(ah4, bl7)) | 0;
      hi = (hi + Math.imul(ah4, bh7)) | 0;
      lo = (lo + Math.imul(al3, bl8)) | 0;
      mid = (mid + Math.imul(al3, bh8)) | 0;
      mid = (mid + Math.imul(ah3, bl8)) | 0;
      hi = (hi + Math.imul(ah3, bh8)) | 0;
      lo = (lo + Math.imul(al2, bl9)) | 0;
      mid = (mid + Math.imul(al2, bh9)) | 0;
      mid = (mid + Math.imul(ah2, bl9)) | 0;
      hi = (hi + Math.imul(ah2, bh9)) | 0;
      var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
      w11 &= 0x3ffffff;
      /* k = 12 */
      lo = Math.imul(al9, bl3);
      mid = Math.imul(al9, bh3);
      mid = (mid + Math.imul(ah9, bl3)) | 0;
      hi = Math.imul(ah9, bh3);
      lo = (lo + Math.imul(al8, bl4)) | 0;
      mid = (mid + Math.imul(al8, bh4)) | 0;
      mid = (mid + Math.imul(ah8, bl4)) | 0;
      hi = (hi + Math.imul(ah8, bh4)) | 0;
      lo = (lo + Math.imul(al7, bl5)) | 0;
      mid = (mid + Math.imul(al7, bh5)) | 0;
      mid = (mid + Math.imul(ah7, bl5)) | 0;
      hi = (hi + Math.imul(ah7, bh5)) | 0;
      lo = (lo + Math.imul(al6, bl6)) | 0;
      mid = (mid + Math.imul(al6, bh6)) | 0;
      mid = (mid + Math.imul(ah6, bl6)) | 0;
      hi = (hi + Math.imul(ah6, bh6)) | 0;
      lo = (lo + Math.imul(al5, bl7)) | 0;
      mid = (mid + Math.imul(al5, bh7)) | 0;
      mid = (mid + Math.imul(ah5, bl7)) | 0;
      hi = (hi + Math.imul(ah5, bh7)) | 0;
      lo = (lo + Math.imul(al4, bl8)) | 0;
      mid = (mid + Math.imul(al4, bh8)) | 0;
      mid = (mid + Math.imul(ah4, bl8)) | 0;
      hi = (hi + Math.imul(ah4, bh8)) | 0;
      lo = (lo + Math.imul(al3, bl9)) | 0;
      mid = (mid + Math.imul(al3, bh9)) | 0;
      mid = (mid + Math.imul(ah3, bl9)) | 0;
      hi = (hi + Math.imul(ah3, bh9)) | 0;
      var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
      w12 &= 0x3ffffff;
      /* k = 13 */
      lo = Math.imul(al9, bl4);
      mid = Math.imul(al9, bh4);
      mid = (mid + Math.imul(ah9, bl4)) | 0;
      hi = Math.imul(ah9, bh4);
      lo = (lo + Math.imul(al8, bl5)) | 0;
      mid = (mid + Math.imul(al8, bh5)) | 0;
      mid = (mid + Math.imul(ah8, bl5)) | 0;
      hi = (hi + Math.imul(ah8, bh5)) | 0;
      lo = (lo + Math.imul(al7, bl6)) | 0;
      mid = (mid + Math.imul(al7, bh6)) | 0;
      mid = (mid + Math.imul(ah7, bl6)) | 0;
      hi = (hi + Math.imul(ah7, bh6)) | 0;
      lo = (lo + Math.imul(al6, bl7)) | 0;
      mid = (mid + Math.imul(al6, bh7)) | 0;
      mid = (mid + Math.imul(ah6, bl7)) | 0;
      hi = (hi + Math.imul(ah6, bh7)) | 0;
      lo = (lo + Math.imul(al5, bl8)) | 0;
      mid = (mid + Math.imul(al5, bh8)) | 0;
      mid = (mid + Math.imul(ah5, bl8)) | 0;
      hi = (hi + Math.imul(ah5, bh8)) | 0;
      lo = (lo + Math.imul(al4, bl9)) | 0;
      mid = (mid + Math.imul(al4, bh9)) | 0;
      mid = (mid + Math.imul(ah4, bl9)) | 0;
      hi = (hi + Math.imul(ah4, bh9)) | 0;
      var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
      w13 &= 0x3ffffff;
      /* k = 14 */
      lo = Math.imul(al9, bl5);
      mid = Math.imul(al9, bh5);
      mid = (mid + Math.imul(ah9, bl5)) | 0;
      hi = Math.imul(ah9, bh5);
      lo = (lo + Math.imul(al8, bl6)) | 0;
      mid = (mid + Math.imul(al8, bh6)) | 0;
      mid = (mid + Math.imul(ah8, bl6)) | 0;
      hi = (hi + Math.imul(ah8, bh6)) | 0;
      lo = (lo + Math.imul(al7, bl7)) | 0;
      mid = (mid + Math.imul(al7, bh7)) | 0;
      mid = (mid + Math.imul(ah7, bl7)) | 0;
      hi = (hi + Math.imul(ah7, bh7)) | 0;
      lo = (lo + Math.imul(al6, bl8)) | 0;
      mid = (mid + Math.imul(al6, bh8)) | 0;
      mid = (mid + Math.imul(ah6, bl8)) | 0;
      hi = (hi + Math.imul(ah6, bh8)) | 0;
      lo = (lo + Math.imul(al5, bl9)) | 0;
      mid = (mid + Math.imul(al5, bh9)) | 0;
      mid = (mid + Math.imul(ah5, bl9)) | 0;
      hi = (hi + Math.imul(ah5, bh9)) | 0;
      var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
      w14 &= 0x3ffffff;
      /* k = 15 */
      lo = Math.imul(al9, bl6);
      mid = Math.imul(al9, bh6);
      mid = (mid + Math.imul(ah9, bl6)) | 0;
      hi = Math.imul(ah9, bh6);
      lo = (lo + Math.imul(al8, bl7)) | 0;
      mid = (mid + Math.imul(al8, bh7)) | 0;
      mid = (mid + Math.imul(ah8, bl7)) | 0;
      hi = (hi + Math.imul(ah8, bh7)) | 0;
      lo = (lo + Math.imul(al7, bl8)) | 0;
      mid = (mid + Math.imul(al7, bh8)) | 0;
      mid = (mid + Math.imul(ah7, bl8)) | 0;
      hi = (hi + Math.imul(ah7, bh8)) | 0;
      lo = (lo + Math.imul(al6, bl9)) | 0;
      mid = (mid + Math.imul(al6, bh9)) | 0;
      mid = (mid + Math.imul(ah6, bl9)) | 0;
      hi = (hi + Math.imul(ah6, bh9)) | 0;
      var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
      w15 &= 0x3ffffff;
      /* k = 16 */
      lo = Math.imul(al9, bl7);
      mid = Math.imul(al9, bh7);
      mid = (mid + Math.imul(ah9, bl7)) | 0;
      hi = Math.imul(ah9, bh7);
      lo = (lo + Math.imul(al8, bl8)) | 0;
      mid = (mid + Math.imul(al8, bh8)) | 0;
      mid = (mid + Math.imul(ah8, bl8)) | 0;
      hi = (hi + Math.imul(ah8, bh8)) | 0;
      lo = (lo + Math.imul(al7, bl9)) | 0;
      mid = (mid + Math.imul(al7, bh9)) | 0;
      mid = (mid + Math.imul(ah7, bl9)) | 0;
      hi = (hi + Math.imul(ah7, bh9)) | 0;
      var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
      w16 &= 0x3ffffff;
      /* k = 17 */
      lo = Math.imul(al9, bl8);
      mid = Math.imul(al9, bh8);
      mid = (mid + Math.imul(ah9, bl8)) | 0;
      hi = Math.imul(ah9, bh8);
      lo = (lo + Math.imul(al8, bl9)) | 0;
      mid = (mid + Math.imul(al8, bh9)) | 0;
      mid = (mid + Math.imul(ah8, bl9)) | 0;
      hi = (hi + Math.imul(ah8, bh9)) | 0;
      var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
      w17 &= 0x3ffffff;
      /* k = 18 */
      lo = Math.imul(al9, bl9);
      mid = Math.imul(al9, bh9);
      mid = (mid + Math.imul(ah9, bl9)) | 0;
      hi = Math.imul(ah9, bh9);
      var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
      w18 &= 0x3ffffff;
      o[0] = w0;
      o[1] = w1;
      o[2] = w2;
      o[3] = w3;
      o[4] = w4;
      o[5] = w5;
      o[6] = w6;
      o[7] = w7;
      o[8] = w8;
      o[9] = w9;
      o[10] = w10;
      o[11] = w11;
      o[12] = w12;
      o[13] = w13;
      o[14] = w14;
      o[15] = w15;
      o[16] = w16;
      o[17] = w17;
      o[18] = w18;
      if (c !== 0) {
        o[19] = c;
        out.length++;
      }
      return out;
    };

    // Polyfill comb
    if (!Math.imul) {
      comb10MulTo = smallMulTo;
    }

    function bigMulTo (self, num, out) {
      out.negative = num.negative ^ self.negative;
      out.length = self.length + num.length;

      var carry = 0;
      var hncarry = 0;
      for (var k = 0; k < out.length - 1; k++) {
        // Sum all words with the same `i + j = k` and accumulate `ncarry`,
        // note that ncarry could be >= 0x3ffffff
        var ncarry = hncarry;
        hncarry = 0;
        var rword = carry & 0x3ffffff;
        var maxJ = Math.min(k, num.length - 1);
        for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
          var i = k - j;
          var a = self.words[i] | 0;
          var b = num.words[j] | 0;
          var r = a * b;

          var lo = r & 0x3ffffff;
          ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
          lo = (lo + rword) | 0;
          rword = lo & 0x3ffffff;
          ncarry = (ncarry + (lo >>> 26)) | 0;

          hncarry += ncarry >>> 26;
          ncarry &= 0x3ffffff;
        }
        out.words[k] = rword;
        carry = ncarry;
        ncarry = hncarry;
      }
      if (carry !== 0) {
        out.words[k] = carry;
      } else {
        out.length--;
      }

      return out.strip();
    }

    function jumboMulTo (self, num, out) {
      var fftm = new FFTM();
      return fftm.mulp(self, num, out);
    }

    BN.prototype.mulTo = function mulTo (num, out) {
      var res;
      var len = this.length + num.length;
      if (this.length === 10 && num.length === 10) {
        res = comb10MulTo(this, num, out);
      } else if (len < 63) {
        res = smallMulTo(this, num, out);
      } else if (len < 1024) {
        res = bigMulTo(this, num, out);
      } else {
        res = jumboMulTo(this, num, out);
      }

      return res;
    };

    // Cooley-Tukey algorithm for FFT
    // slightly revisited to rely on looping instead of recursion

    function FFTM (x, y) {
      this.x = x;
      this.y = y;
    }

    FFTM.prototype.makeRBT = function makeRBT (N) {
      var t = new Array(N);
      var l = BN.prototype._countBits(N) - 1;
      for (var i = 0; i < N; i++) {
        t[i] = this.revBin(i, l, N);
      }

      return t;
    };

    // Returns binary-reversed representation of `x`
    FFTM.prototype.revBin = function revBin (x, l, N) {
      if (x === 0 || x === N - 1) return x;

      var rb = 0;
      for (var i = 0; i < l; i++) {
        rb |= (x & 1) << (l - i - 1);
        x >>= 1;
      }

      return rb;
    };

    // Performs "tweedling" phase, therefore 'emulating'
    // behaviour of the recursive algorithm
    FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
      for (var i = 0; i < N; i++) {
        rtws[i] = rws[rbt[i]];
        itws[i] = iws[rbt[i]];
      }
    };

    FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
      this.permute(rbt, rws, iws, rtws, itws, N);

      for (var s = 1; s < N; s <<= 1) {
        var l = s << 1;

        var rtwdf = Math.cos(2 * Math.PI / l);
        var itwdf = Math.sin(2 * Math.PI / l);

        for (var p = 0; p < N; p += l) {
          var rtwdf_ = rtwdf;
          var itwdf_ = itwdf;

          for (var j = 0; j < s; j++) {
            var re = rtws[p + j];
            var ie = itws[p + j];

            var ro = rtws[p + j + s];
            var io = itws[p + j + s];

            var rx = rtwdf_ * ro - itwdf_ * io;

            io = rtwdf_ * io + itwdf_ * ro;
            ro = rx;

            rtws[p + j] = re + ro;
            itws[p + j] = ie + io;

            rtws[p + j + s] = re - ro;
            itws[p + j + s] = ie - io;

            /* jshint maxdepth : false */
            if (j !== l) {
              rx = rtwdf * rtwdf_ - itwdf * itwdf_;

              itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
              rtwdf_ = rx;
            }
          }
        }
      }
    };

    FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
      var N = Math.max(m, n) | 1;
      var odd = N & 1;
      var i = 0;
      for (N = N / 2 | 0; N; N = N >>> 1) {
        i++;
      }

      return 1 << i + 1 + odd;
    };

    FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
      if (N <= 1) return;

      for (var i = 0; i < N / 2; i++) {
        var t = rws[i];

        rws[i] = rws[N - i - 1];
        rws[N - i - 1] = t;

        t = iws[i];

        iws[i] = -iws[N - i - 1];
        iws[N - i - 1] = -t;
      }
    };

    FFTM.prototype.normalize13b = function normalize13b (ws, N) {
      var carry = 0;
      for (var i = 0; i < N / 2; i++) {
        var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
          Math.round(ws[2 * i] / N) +
          carry;

        ws[i] = w & 0x3ffffff;

        if (w < 0x4000000) {
          carry = 0;
        } else {
          carry = w / 0x4000000 | 0;
        }
      }

      return ws;
    };

    FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
      var carry = 0;
      for (var i = 0; i < len; i++) {
        carry = carry + (ws[i] | 0);

        rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
        rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
      }

      // Pad with zeroes
      for (i = 2 * len; i < N; ++i) {
        rws[i] = 0;
      }

      assert(carry === 0);
      assert((carry & ~0x1fff) === 0);
    };

    FFTM.prototype.stub = function stub (N) {
      var ph = new Array(N);
      for (var i = 0; i < N; i++) {
        ph[i] = 0;
      }

      return ph;
    };

    FFTM.prototype.mulp = function mulp (x, y, out) {
      var N = 2 * this.guessLen13b(x.length, y.length);

      var rbt = this.makeRBT(N);

      var _ = this.stub(N);

      var rws = new Array(N);
      var rwst = new Array(N);
      var iwst = new Array(N);

      var nrws = new Array(N);
      var nrwst = new Array(N);
      var niwst = new Array(N);

      var rmws = out.words;
      rmws.length = N;

      this.convert13b(x.words, x.length, rws, N);
      this.convert13b(y.words, y.length, nrws, N);

      this.transform(rws, _, rwst, iwst, N, rbt);
      this.transform(nrws, _, nrwst, niwst, N, rbt);

      for (var i = 0; i < N; i++) {
        var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
        iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
        rwst[i] = rx;
      }

      this.conjugate(rwst, iwst, N);
      this.transform(rwst, iwst, rmws, _, N, rbt);
      this.conjugate(rmws, _, N);
      this.normalize13b(rmws, N);

      out.negative = x.negative ^ y.negative;
      out.length = x.length + y.length;
      return out.strip();
    };

    // Multiply `this` by `num`
    BN.prototype.mul = function mul (num) {
      var out = new BN(null);
      out.words = new Array(this.length + num.length);
      return this.mulTo(num, out);
    };

    // Multiply employing FFT
    BN.prototype.mulf = function mulf (num) {
      var out = new BN(null);
      out.words = new Array(this.length + num.length);
      return jumboMulTo(this, num, out);
    };

    // In-place Multiplication
    BN.prototype.imul = function imul (num) {
      return this.clone().mulTo(num, this);
    };

    BN.prototype.imuln = function imuln (num) {
      assert(typeof num === 'number');
      assert(num < 0x4000000);

      // Carry
      var carry = 0;
      for (var i = 0; i < this.length; i++) {
        var w = (this.words[i] | 0) * num;
        var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
        carry >>= 26;
        carry += (w / 0x4000000) | 0;
        // NOTE: lo is 27bit maximum
        carry += lo >>> 26;
        this.words[i] = lo & 0x3ffffff;
      }

      if (carry !== 0) {
        this.words[i] = carry;
        this.length++;
      }

      return this;
    };

    BN.prototype.muln = function muln (num) {
      return this.clone().imuln(num);
    };

    // `this` * `this`
    BN.prototype.sqr = function sqr () {
      return this.mul(this);
    };

    // `this` * `this` in-place
    BN.prototype.isqr = function isqr () {
      return this.imul(this.clone());
    };

    // Math.pow(`this`, `num`)
    BN.prototype.pow = function pow (num) {
      var w = toBitArray(num);
      if (w.length === 0) return new BN(1);

      // Skip leading zeroes
      var res = this;
      for (var i = 0; i < w.length; i++, res = res.sqr()) {
        if (w[i] !== 0) break;
      }

      if (++i < w.length) {
        for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
          if (w[i] === 0) continue;

          res = res.mul(q);
        }
      }

      return res;
    };

    // Shift-left in-place
    BN.prototype.iushln = function iushln (bits) {
      assert(typeof bits === 'number' && bits >= 0);
      var r = bits % 26;
      var s = (bits - r) / 26;
      var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
      var i;

      if (r !== 0) {
        var carry = 0;

        for (i = 0; i < this.length; i++) {
          var newCarry = this.words[i] & carryMask;
          var c = ((this.words[i] | 0) - newCarry) << r;
          this.words[i] = c | carry;
          carry = newCarry >>> (26 - r);
        }

        if (carry) {
          this.words[i] = carry;
          this.length++;
        }
      }

      if (s !== 0) {
        for (i = this.length - 1; i >= 0; i--) {
          this.words[i + s] = this.words[i];
        }

        for (i = 0; i < s; i++) {
          this.words[i] = 0;
        }

        this.length += s;
      }

      return this.strip();
    };

    BN.prototype.ishln = function ishln (bits) {
      // TODO(indutny): implement me
      assert(this.negative === 0);
      return this.iushln(bits);
    };

    // Shift-right in-place
    // NOTE: `hint` is a lowest bit before trailing zeroes
    // NOTE: if `extended` is present - it will be filled with destroyed bits
    BN.prototype.iushrn = function iushrn (bits, hint, extended) {
      assert(typeof bits === 'number' && bits >= 0);
      var h;
      if (hint) {
        h = (hint - (hint % 26)) / 26;
      } else {
        h = 0;
      }

      var r = bits % 26;
      var s = Math.min((bits - r) / 26, this.length);
      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
      var maskedWords = extended;

      h -= s;
      h = Math.max(0, h);

      // Extended mode, copy masked part
      if (maskedWords) {
        for (var i = 0; i < s; i++) {
          maskedWords.words[i] = this.words[i];
        }
        maskedWords.length = s;
      }

      if (s === 0) ; else if (this.length > s) {
        this.length -= s;
        for (i = 0; i < this.length; i++) {
          this.words[i] = this.words[i + s];
        }
      } else {
        this.words[0] = 0;
        this.length = 1;
      }

      var carry = 0;
      for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
        var word = this.words[i] | 0;
        this.words[i] = (carry << (26 - r)) | (word >>> r);
        carry = word & mask;
      }

      // Push carried bits as a mask
      if (maskedWords && carry !== 0) {
        maskedWords.words[maskedWords.length++] = carry;
      }

      if (this.length === 0) {
        this.words[0] = 0;
        this.length = 1;
      }

      return this.strip();
    };

    BN.prototype.ishrn = function ishrn (bits, hint, extended) {
      // TODO(indutny): implement me
      assert(this.negative === 0);
      return this.iushrn(bits, hint, extended);
    };

    // Shift-left
    BN.prototype.shln = function shln (bits) {
      return this.clone().ishln(bits);
    };

    BN.prototype.ushln = function ushln (bits) {
      return this.clone().iushln(bits);
    };

    // Shift-right
    BN.prototype.shrn = function shrn (bits) {
      return this.clone().ishrn(bits);
    };

    BN.prototype.ushrn = function ushrn (bits) {
      return this.clone().iushrn(bits);
    };

    // Test if n bit is set
    BN.prototype.testn = function testn (bit) {
      assert(typeof bit === 'number' && bit >= 0);
      var r = bit % 26;
      var s = (bit - r) / 26;
      var q = 1 << r;

      // Fast case: bit is much higher than all existing words
      if (this.length <= s) return false;

      // Check bit and return
      var w = this.words[s];

      return !!(w & q);
    };

    // Return only lowers bits of number (in-place)
    BN.prototype.imaskn = function imaskn (bits) {
      assert(typeof bits === 'number' && bits >= 0);
      var r = bits % 26;
      var s = (bits - r) / 26;

      assert(this.negative === 0, 'imaskn works only with positive numbers');

      if (this.length <= s) {
        return this;
      }

      if (r !== 0) {
        s++;
      }
      this.length = Math.min(s, this.length);

      if (r !== 0) {
        var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
        this.words[this.length - 1] &= mask;
      }

      return this.strip();
    };

    // Return only lowers bits of number
    BN.prototype.maskn = function maskn (bits) {
      return this.clone().imaskn(bits);
    };

    // Add plain number `num` to `this`
    BN.prototype.iaddn = function iaddn (num) {
      assert(typeof num === 'number');
      assert(num < 0x4000000);
      if (num < 0) return this.isubn(-num);

      // Possible sign change
      if (this.negative !== 0) {
        if (this.length === 1 && (this.words[0] | 0) < num) {
          this.words[0] = num - (this.words[0] | 0);
          this.negative = 0;
          return this;
        }

        this.negative = 0;
        this.isubn(num);
        this.negative = 1;
        return this;
      }

      // Add without checks
      return this._iaddn(num);
    };

    BN.prototype._iaddn = function _iaddn (num) {
      this.words[0] += num;

      // Carry
      for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
        this.words[i] -= 0x4000000;
        if (i === this.length - 1) {
          this.words[i + 1] = 1;
        } else {
          this.words[i + 1]++;
        }
      }
      this.length = Math.max(this.length, i + 1);

      return this;
    };

    // Subtract plain number `num` from `this`
    BN.prototype.isubn = function isubn (num) {
      assert(typeof num === 'number');
      assert(num < 0x4000000);
      if (num < 0) return this.iaddn(-num);

      if (this.negative !== 0) {
        this.negative = 0;
        this.iaddn(num);
        this.negative = 1;
        return this;
      }

      this.words[0] -= num;

      if (this.length === 1 && this.words[0] < 0) {
        this.words[0] = -this.words[0];
        this.negative = 1;
      } else {
        // Carry
        for (var i = 0; i < this.length && this.words[i] < 0; i++) {
          this.words[i] += 0x4000000;
          this.words[i + 1] -= 1;
        }
      }

      return this.strip();
    };

    BN.prototype.addn = function addn (num) {
      return this.clone().iaddn(num);
    };

    BN.prototype.subn = function subn (num) {
      return this.clone().isubn(num);
    };

    BN.prototype.iabs = function iabs () {
      this.negative = 0;

      return this;
    };

    BN.prototype.abs = function abs () {
      return this.clone().iabs();
    };

    BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
      var len = num.length + shift;
      var i;

      this._expand(len);

      var w;
      var carry = 0;
      for (i = 0; i < num.length; i++) {
        w = (this.words[i + shift] | 0) + carry;
        var right = (num.words[i] | 0) * mul;
        w -= right & 0x3ffffff;
        carry = (w >> 26) - ((right / 0x4000000) | 0);
        this.words[i + shift] = w & 0x3ffffff;
      }
      for (; i < this.length - shift; i++) {
        w = (this.words[i + shift] | 0) + carry;
        carry = w >> 26;
        this.words[i + shift] = w & 0x3ffffff;
      }

      if (carry === 0) return this.strip();

      // Subtraction overflow
      assert(carry === -1);
      carry = 0;
      for (i = 0; i < this.length; i++) {
        w = -(this.words[i] | 0) + carry;
        carry = w >> 26;
        this.words[i] = w & 0x3ffffff;
      }
      this.negative = 1;

      return this.strip();
    };

    BN.prototype._wordDiv = function _wordDiv (num, mode) {
      var shift = this.length - num.length;

      var a = this.clone();
      var b = num;

      // Normalize
      var bhi = b.words[b.length - 1] | 0;
      var bhiBits = this._countBits(bhi);
      shift = 26 - bhiBits;
      if (shift !== 0) {
        b = b.ushln(shift);
        a.iushln(shift);
        bhi = b.words[b.length - 1] | 0;
      }

      // Initialize quotient
      var m = a.length - b.length;
      var q;

      if (mode !== 'mod') {
        q = new BN(null);
        q.length = m + 1;
        q.words = new Array(q.length);
        for (var i = 0; i < q.length; i++) {
          q.words[i] = 0;
        }
      }

      var diff = a.clone()._ishlnsubmul(b, 1, m);
      if (diff.negative === 0) {
        a = diff;
        if (q) {
          q.words[m] = 1;
        }
      }

      for (var j = m - 1; j >= 0; j--) {
        var qj = (a.words[b.length + j] | 0) * 0x4000000 +
          (a.words[b.length + j - 1] | 0);

        // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
        // (0x7ffffff)
        qj = Math.min((qj / bhi) | 0, 0x3ffffff);

        a._ishlnsubmul(b, qj, j);
        while (a.negative !== 0) {
          qj--;
          a.negative = 0;
          a._ishlnsubmul(b, 1, j);
          if (!a.isZero()) {
            a.negative ^= 1;
          }
        }
        if (q) {
          q.words[j] = qj;
        }
      }
      if (q) {
        q.strip();
      }
      a.strip();

      // Denormalize
      if (mode !== 'div' && shift !== 0) {
        a.iushrn(shift);
      }

      return {
        div: q || null,
        mod: a
      };
    };

    // NOTE: 1) `mode` can be set to `mod` to request mod only,
    //       to `div` to request div only, or be absent to
    //       request both div & mod
    //       2) `positive` is true if unsigned mod is requested
    BN.prototype.divmod = function divmod (num, mode, positive) {
      assert(!num.isZero());

      if (this.isZero()) {
        return {
          div: new BN(0),
          mod: new BN(0)
        };
      }

      var div, mod, res;
      if (this.negative !== 0 && num.negative === 0) {
        res = this.neg().divmod(num, mode);

        if (mode !== 'mod') {
          div = res.div.neg();
        }

        if (mode !== 'div') {
          mod = res.mod.neg();
          if (positive && mod.negative !== 0) {
            mod.iadd(num);
          }
        }

        return {
          div: div,
          mod: mod
        };
      }

      if (this.negative === 0 && num.negative !== 0) {
        res = this.divmod(num.neg(), mode);

        if (mode !== 'mod') {
          div = res.div.neg();
        }

        return {
          div: div,
          mod: res.mod
        };
      }

      if ((this.negative & num.negative) !== 0) {
        res = this.neg().divmod(num.neg(), mode);

        if (mode !== 'div') {
          mod = res.mod.neg();
          if (positive && mod.negative !== 0) {
            mod.isub(num);
          }
        }

        return {
          div: res.div,
          mod: mod
        };
      }

      // Both numbers are positive at this point

      // Strip both numbers to approximate shift value
      if (num.length > this.length || this.cmp(num) < 0) {
        return {
          div: new BN(0),
          mod: this
        };
      }

      // Very short reduction
      if (num.length === 1) {
        if (mode === 'div') {
          return {
            div: this.divn(num.words[0]),
            mod: null
          };
        }

        if (mode === 'mod') {
          return {
            div: null,
            mod: new BN(this.modn(num.words[0]))
          };
        }

        return {
          div: this.divn(num.words[0]),
          mod: new BN(this.modn(num.words[0]))
        };
      }

      return this._wordDiv(num, mode);
    };

    // Find `this` / `num`
    BN.prototype.div = function div (num) {
      return this.divmod(num, 'div', false).div;
    };

    // Find `this` % `num`
    BN.prototype.mod = function mod (num) {
      return this.divmod(num, 'mod', false).mod;
    };

    BN.prototype.umod = function umod (num) {
      return this.divmod(num, 'mod', true).mod;
    };

    // Find Round(`this` / `num`)
    BN.prototype.divRound = function divRound (num) {
      var dm = this.divmod(num);

      // Fast case - exact division
      if (dm.mod.isZero()) return dm.div;

      var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

      var half = num.ushrn(1);
      var r2 = num.andln(1);
      var cmp = mod.cmp(half);

      // Round down
      if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

      // Round up
      return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
    };

    BN.prototype.modn = function modn (num) {
      assert(num <= 0x3ffffff);
      var p = (1 << 26) % num;

      var acc = 0;
      for (var i = this.length - 1; i >= 0; i--) {
        acc = (p * acc + (this.words[i] | 0)) % num;
      }

      return acc;
    };

    // In-place division by number
    BN.prototype.idivn = function idivn (num) {
      assert(num <= 0x3ffffff);

      var carry = 0;
      for (var i = this.length - 1; i >= 0; i--) {
        var w = (this.words[i] | 0) + carry * 0x4000000;
        this.words[i] = (w / num) | 0;
        carry = w % num;
      }

      return this.strip();
    };

    BN.prototype.divn = function divn (num) {
      return this.clone().idivn(num);
    };

    BN.prototype.egcd = function egcd (p) {
      assert(p.negative === 0);
      assert(!p.isZero());

      var x = this;
      var y = p.clone();

      if (x.negative !== 0) {
        x = x.umod(p);
      } else {
        x = x.clone();
      }

      // A * x + B * y = x
      var A = new BN(1);
      var B = new BN(0);

      // C * x + D * y = y
      var C = new BN(0);
      var D = new BN(1);

      var g = 0;

      while (x.isEven() && y.isEven()) {
        x.iushrn(1);
        y.iushrn(1);
        ++g;
      }

      var yp = y.clone();
      var xp = x.clone();

      while (!x.isZero()) {
        for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
        if (i > 0) {
          x.iushrn(i);
          while (i-- > 0) {
            if (A.isOdd() || B.isOdd()) {
              A.iadd(yp);
              B.isub(xp);
            }

            A.iushrn(1);
            B.iushrn(1);
          }
        }

        for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
        if (j > 0) {
          y.iushrn(j);
          while (j-- > 0) {
            if (C.isOdd() || D.isOdd()) {
              C.iadd(yp);
              D.isub(xp);
            }

            C.iushrn(1);
            D.iushrn(1);
          }
        }

        if (x.cmp(y) >= 0) {
          x.isub(y);
          A.isub(C);
          B.isub(D);
        } else {
          y.isub(x);
          C.isub(A);
          D.isub(B);
        }
      }

      return {
        a: C,
        b: D,
        gcd: y.iushln(g)
      };
    };

    // This is reduced incarnation of the binary EEA
    // above, designated to invert members of the
    // _prime_ fields F(p) at a maximal speed
    BN.prototype._invmp = function _invmp (p) {
      assert(p.negative === 0);
      assert(!p.isZero());

      var a = this;
      var b = p.clone();

      if (a.negative !== 0) {
        a = a.umod(p);
      } else {
        a = a.clone();
      }

      var x1 = new BN(1);
      var x2 = new BN(0);

      var delta = b.clone();

      while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
        for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
        if (i > 0) {
          a.iushrn(i);
          while (i-- > 0) {
            if (x1.isOdd()) {
              x1.iadd(delta);
            }

            x1.iushrn(1);
          }
        }

        for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
        if (j > 0) {
          b.iushrn(j);
          while (j-- > 0) {
            if (x2.isOdd()) {
              x2.iadd(delta);
            }

            x2.iushrn(1);
          }
        }

        if (a.cmp(b) >= 0) {
          a.isub(b);
          x1.isub(x2);
        } else {
          b.isub(a);
          x2.isub(x1);
        }
      }

      var res;
      if (a.cmpn(1) === 0) {
        res = x1;
      } else {
        res = x2;
      }

      if (res.cmpn(0) < 0) {
        res.iadd(p);
      }

      return res;
    };

    BN.prototype.gcd = function gcd (num) {
      if (this.isZero()) return num.abs();
      if (num.isZero()) return this.abs();

      var a = this.clone();
      var b = num.clone();
      a.negative = 0;
      b.negative = 0;

      // Remove common factor of two
      for (var shift = 0; a.isEven() && b.isEven(); shift++) {
        a.iushrn(1);
        b.iushrn(1);
      }

      do {
        while (a.isEven()) {
          a.iushrn(1);
        }
        while (b.isEven()) {
          b.iushrn(1);
        }

        var r = a.cmp(b);
        if (r < 0) {
          // Swap `a` and `b` to make `a` always bigger than `b`
          var t = a;
          a = b;
          b = t;
        } else if (r === 0 || b.cmpn(1) === 0) {
          break;
        }

        a.isub(b);
      } while (true);

      return b.iushln(shift);
    };

    // Invert number in the field F(num)
    BN.prototype.invm = function invm (num) {
      return this.egcd(num).a.umod(num);
    };

    BN.prototype.isEven = function isEven () {
      return (this.words[0] & 1) === 0;
    };

    BN.prototype.isOdd = function isOdd () {
      return (this.words[0] & 1) === 1;
    };

    // And first word and num
    BN.prototype.andln = function andln (num) {
      return this.words[0] & num;
    };

    // Increment at the bit position in-line
    BN.prototype.bincn = function bincn (bit) {
      assert(typeof bit === 'number');
      var r = bit % 26;
      var s = (bit - r) / 26;
      var q = 1 << r;

      // Fast case: bit is much higher than all existing words
      if (this.length <= s) {
        this._expand(s + 1);
        this.words[s] |= q;
        return this;
      }

      // Add bit and propagate, if needed
      var carry = q;
      for (var i = s; carry !== 0 && i < this.length; i++) {
        var w = this.words[i] | 0;
        w += carry;
        carry = w >>> 26;
        w &= 0x3ffffff;
        this.words[i] = w;
      }
      if (carry !== 0) {
        this.words[i] = carry;
        this.length++;
      }
      return this;
    };

    BN.prototype.isZero = function isZero () {
      return this.length === 1 && this.words[0] === 0;
    };

    BN.prototype.cmpn = function cmpn (num) {
      var negative = num < 0;

      if (this.negative !== 0 && !negative) return -1;
      if (this.negative === 0 && negative) return 1;

      this.strip();

      var res;
      if (this.length > 1) {
        res = 1;
      } else {
        if (negative) {
          num = -num;
        }

        assert(num <= 0x3ffffff, 'Number is too big');

        var w = this.words[0] | 0;
        res = w === num ? 0 : w < num ? -1 : 1;
      }
      if (this.negative !== 0) return -res | 0;
      return res;
    };

    // Compare two numbers and return:
    // 1 - if `this` > `num`
    // 0 - if `this` == `num`
    // -1 - if `this` < `num`
    BN.prototype.cmp = function cmp (num) {
      if (this.negative !== 0 && num.negative === 0) return -1;
      if (this.negative === 0 && num.negative !== 0) return 1;

      var res = this.ucmp(num);
      if (this.negative !== 0) return -res | 0;
      return res;
    };

    // Unsigned comparison
    BN.prototype.ucmp = function ucmp (num) {
      // At this point both numbers have the same sign
      if (this.length > num.length) return 1;
      if (this.length < num.length) return -1;

      var res = 0;
      for (var i = this.length - 1; i >= 0; i--) {
        var a = this.words[i] | 0;
        var b = num.words[i] | 0;

        if (a === b) continue;
        if (a < b) {
          res = -1;
        } else if (a > b) {
          res = 1;
        }
        break;
      }
      return res;
    };

    BN.prototype.gtn = function gtn (num) {
      return this.cmpn(num) === 1;
    };

    BN.prototype.gt = function gt (num) {
      return this.cmp(num) === 1;
    };

    BN.prototype.gten = function gten (num) {
      return this.cmpn(num) >= 0;
    };

    BN.prototype.gte = function gte (num) {
      return this.cmp(num) >= 0;
    };

    BN.prototype.ltn = function ltn (num) {
      return this.cmpn(num) === -1;
    };

    BN.prototype.lt = function lt (num) {
      return this.cmp(num) === -1;
    };

    BN.prototype.lten = function lten (num) {
      return this.cmpn(num) <= 0;
    };

    BN.prototype.lte = function lte (num) {
      return this.cmp(num) <= 0;
    };

    BN.prototype.eqn = function eqn (num) {
      return this.cmpn(num) === 0;
    };

    BN.prototype.eq = function eq (num) {
      return this.cmp(num) === 0;
    };

    //
    // A reduce context, could be using montgomery or something better, depending
    // on the `m` itself.
    //
    BN.red = function red (num) {
      return new Red(num);
    };

    BN.prototype.toRed = function toRed (ctx) {
      assert(!this.red, 'Already a number in reduction context');
      assert(this.negative === 0, 'red works only with positives');
      return ctx.convertTo(this)._forceRed(ctx);
    };

    BN.prototype.fromRed = function fromRed () {
      assert(this.red, 'fromRed works only with numbers in reduction context');
      return this.red.convertFrom(this);
    };

    BN.prototype._forceRed = function _forceRed (ctx) {
      this.red = ctx;
      return this;
    };

    BN.prototype.forceRed = function forceRed (ctx) {
      assert(!this.red, 'Already a number in reduction context');
      return this._forceRed(ctx);
    };

    BN.prototype.redAdd = function redAdd (num) {
      assert(this.red, 'redAdd works only with red numbers');
      return this.red.add(this, num);
    };

    BN.prototype.redIAdd = function redIAdd (num) {
      assert(this.red, 'redIAdd works only with red numbers');
      return this.red.iadd(this, num);
    };

    BN.prototype.redSub = function redSub (num) {
      assert(this.red, 'redSub works only with red numbers');
      return this.red.sub(this, num);
    };

    BN.prototype.redISub = function redISub (num) {
      assert(this.red, 'redISub works only with red numbers');
      return this.red.isub(this, num);
    };

    BN.prototype.redShl = function redShl (num) {
      assert(this.red, 'redShl works only with red numbers');
      return this.red.shl(this, num);
    };

    BN.prototype.redMul = function redMul (num) {
      assert(this.red, 'redMul works only with red numbers');
      this.red._verify2(this, num);
      return this.red.mul(this, num);
    };

    BN.prototype.redIMul = function redIMul (num) {
      assert(this.red, 'redMul works only with red numbers');
      this.red._verify2(this, num);
      return this.red.imul(this, num);
    };

    BN.prototype.redSqr = function redSqr () {
      assert(this.red, 'redSqr works only with red numbers');
      this.red._verify1(this);
      return this.red.sqr(this);
    };

    BN.prototype.redISqr = function redISqr () {
      assert(this.red, 'redISqr works only with red numbers');
      this.red._verify1(this);
      return this.red.isqr(this);
    };

    // Square root over p
    BN.prototype.redSqrt = function redSqrt () {
      assert(this.red, 'redSqrt works only with red numbers');
      this.red._verify1(this);
      return this.red.sqrt(this);
    };

    BN.prototype.redInvm = function redInvm () {
      assert(this.red, 'redInvm works only with red numbers');
      this.red._verify1(this);
      return this.red.invm(this);
    };

    // Return negative clone of `this` % `red modulo`
    BN.prototype.redNeg = function redNeg () {
      assert(this.red, 'redNeg works only with red numbers');
      this.red._verify1(this);
      return this.red.neg(this);
    };

    BN.prototype.redPow = function redPow (num) {
      assert(this.red && !num.red, 'redPow(normalNum)');
      this.red._verify1(this);
      return this.red.pow(this, num);
    };

    // Prime numbers with efficient reduction
    var primes = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };

    // Pseudo-Mersenne prime
    function MPrime (name, p) {
      // P = 2 ^ N - K
      this.name = name;
      this.p = new BN(p, 16);
      this.n = this.p.bitLength();
      this.k = new BN(1).iushln(this.n).isub(this.p);

      this.tmp = this._tmp();
    }

    MPrime.prototype._tmp = function _tmp () {
      var tmp = new BN(null);
      tmp.words = new Array(Math.ceil(this.n / 13));
      return tmp;
    };

    MPrime.prototype.ireduce = function ireduce (num) {
      // Assumes that `num` is less than `P^2`
      // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
      var r = num;
      var rlen;

      do {
        this.split(r, this.tmp);
        r = this.imulK(r);
        r = r.iadd(this.tmp);
        rlen = r.bitLength();
      } while (rlen > this.n);

      var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
      if (cmp === 0) {
        r.words[0] = 0;
        r.length = 1;
      } else if (cmp > 0) {
        r.isub(this.p);
      } else {
        r.strip();
      }

      return r;
    };

    MPrime.prototype.split = function split (input, out) {
      input.iushrn(this.n, 0, out);
    };

    MPrime.prototype.imulK = function imulK (num) {
      return num.imul(this.k);
    };

    function K256 () {
      MPrime.call(
        this,
        'k256',
        'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
    }
    inherits(K256, MPrime);

    K256.prototype.split = function split (input, output) {
      // 256 = 9 * 26 + 22
      var mask = 0x3fffff;

      var outLen = Math.min(input.length, 9);
      for (var i = 0; i < outLen; i++) {
        output.words[i] = input.words[i];
      }
      output.length = outLen;

      if (input.length <= 9) {
        input.words[0] = 0;
        input.length = 1;
        return;
      }

      // Shift by 9 limbs
      var prev = input.words[9];
      output.words[output.length++] = prev & mask;

      for (i = 10; i < input.length; i++) {
        var next = input.words[i] | 0;
        input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
        prev = next;
      }
      prev >>>= 22;
      input.words[i - 10] = prev;
      if (prev === 0 && input.length > 10) {
        input.length -= 10;
      } else {
        input.length -= 9;
      }
    };

    K256.prototype.imulK = function imulK (num) {
      // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
      num.words[num.length] = 0;
      num.words[num.length + 1] = 0;
      num.length += 2;

      // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
      var lo = 0;
      for (var i = 0; i < num.length; i++) {
        var w = num.words[i] | 0;
        lo += w * 0x3d1;
        num.words[i] = lo & 0x3ffffff;
        lo = w * 0x40 + ((lo / 0x4000000) | 0);
      }

      // Fast length reduction
      if (num.words[num.length - 1] === 0) {
        num.length--;
        if (num.words[num.length - 1] === 0) {
          num.length--;
        }
      }
      return num;
    };

    function P224 () {
      MPrime.call(
        this,
        'p224',
        'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
    }
    inherits(P224, MPrime);

    function P192 () {
      MPrime.call(
        this,
        'p192',
        'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
    }
    inherits(P192, MPrime);

    function P25519 () {
      // 2 ^ 255 - 19
      MPrime.call(
        this,
        '25519',
        '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
    }
    inherits(P25519, MPrime);

    P25519.prototype.imulK = function imulK (num) {
      // K = 0x13
      var carry = 0;
      for (var i = 0; i < num.length; i++) {
        var hi = (num.words[i] | 0) * 0x13 + carry;
        var lo = hi & 0x3ffffff;
        hi >>>= 26;

        num.words[i] = lo;
        carry = hi;
      }
      if (carry !== 0) {
        num.words[num.length++] = carry;
      }
      return num;
    };

    // Exported mostly for testing purposes, use plain name instead
    BN._prime = function prime (name) {
      // Cached version of prime
      if (primes[name]) return primes[name];

      var prime;
      if (name === 'k256') {
        prime = new K256();
      } else if (name === 'p224') {
        prime = new P224();
      } else if (name === 'p192') {
        prime = new P192();
      } else if (name === 'p25519') {
        prime = new P25519();
      } else {
        throw new Error('Unknown prime ' + name);
      }
      primes[name] = prime;

      return prime;
    };

    //
    // Base reduction engine
    //
    function Red (m) {
      if (typeof m === 'string') {
        var prime = BN._prime(m);
        this.m = prime.p;
        this.prime = prime;
      } else {
        assert(m.gtn(1), 'modulus must be greater than 1');
        this.m = m;
        this.prime = null;
      }
    }

    Red.prototype._verify1 = function _verify1 (a) {
      assert(a.negative === 0, 'red works only with positives');
      assert(a.red, 'red works only with red numbers');
    };

    Red.prototype._verify2 = function _verify2 (a, b) {
      assert((a.negative | b.negative) === 0, 'red works only with positives');
      assert(a.red && a.red === b.red,
        'red works only with red numbers');
    };

    Red.prototype.imod = function imod (a) {
      if (this.prime) return this.prime.ireduce(a)._forceRed(this);
      return a.umod(this.m)._forceRed(this);
    };

    Red.prototype.neg = function neg (a) {
      if (a.isZero()) {
        return a.clone();
      }

      return this.m.sub(a)._forceRed(this);
    };

    Red.prototype.add = function add (a, b) {
      this._verify2(a, b);

      var res = a.add(b);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res._forceRed(this);
    };

    Red.prototype.iadd = function iadd (a, b) {
      this._verify2(a, b);

      var res = a.iadd(b);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res;
    };

    Red.prototype.sub = function sub (a, b) {
      this._verify2(a, b);

      var res = a.sub(b);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res._forceRed(this);
    };

    Red.prototype.isub = function isub (a, b) {
      this._verify2(a, b);

      var res = a.isub(b);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res;
    };

    Red.prototype.shl = function shl (a, num) {
      this._verify1(a);
      return this.imod(a.ushln(num));
    };

    Red.prototype.imul = function imul (a, b) {
      this._verify2(a, b);
      return this.imod(a.imul(b));
    };

    Red.prototype.mul = function mul (a, b) {
      this._verify2(a, b);
      return this.imod(a.mul(b));
    };

    Red.prototype.isqr = function isqr (a) {
      return this.imul(a, a.clone());
    };

    Red.prototype.sqr = function sqr (a) {
      return this.mul(a, a);
    };

    Red.prototype.sqrt = function sqrt (a) {
      if (a.isZero()) return a.clone();

      var mod3 = this.m.andln(3);
      assert(mod3 % 2 === 1);

      // Fast case
      if (mod3 === 3) {
        var pow = this.m.add(new BN(1)).iushrn(2);
        return this.pow(a, pow);
      }

      // Tonelli-Shanks algorithm (Totally unoptimized and slow)
      //
      // Find Q and S, that Q * 2 ^ S = (P - 1)
      var q = this.m.subn(1);
      var s = 0;
      while (!q.isZero() && q.andln(1) === 0) {
        s++;
        q.iushrn(1);
      }
      assert(!q.isZero());

      var one = new BN(1).toRed(this);
      var nOne = one.redNeg();

      // Find quadratic non-residue
      // NOTE: Max is such because of generalized Riemann hypothesis.
      var lpow = this.m.subn(1).iushrn(1);
      var z = this.m.bitLength();
      z = new BN(2 * z * z).toRed(this);

      while (this.pow(z, lpow).cmp(nOne) !== 0) {
        z.redIAdd(nOne);
      }

      var c = this.pow(z, q);
      var r = this.pow(a, q.addn(1).iushrn(1));
      var t = this.pow(a, q);
      var m = s;
      while (t.cmp(one) !== 0) {
        var tmp = t;
        for (var i = 0; tmp.cmp(one) !== 0; i++) {
          tmp = tmp.redSqr();
        }
        assert(i < m);
        var b = this.pow(c, new BN(1).iushln(m - i - 1));

        r = r.redMul(b);
        c = b.redSqr();
        t = t.redMul(c);
        m = i;
      }

      return r;
    };

    Red.prototype.invm = function invm (a) {
      var inv = a._invmp(this.m);
      if (inv.negative !== 0) {
        inv.negative = 0;
        return this.imod(inv).redNeg();
      } else {
        return this.imod(inv);
      }
    };

    Red.prototype.pow = function pow (a, num) {
      if (num.isZero()) return new BN(1);
      if (num.cmpn(1) === 0) return a.clone();

      var windowSize = 4;
      var wnd = new Array(1 << windowSize);
      wnd[0] = new BN(1).toRed(this);
      wnd[1] = a;
      for (var i = 2; i < wnd.length; i++) {
        wnd[i] = this.mul(wnd[i - 1], a);
      }

      var res = wnd[0];
      var current = 0;
      var currentLen = 0;
      var start = num.bitLength() % 26;
      if (start === 0) {
        start = 26;
      }

      for (i = num.length - 1; i >= 0; i--) {
        var word = num.words[i];
        for (var j = start - 1; j >= 0; j--) {
          var bit = (word >> j) & 1;
          if (res !== wnd[0]) {
            res = this.sqr(res);
          }

          if (bit === 0 && current === 0) {
            currentLen = 0;
            continue;
          }

          current <<= 1;
          current |= bit;
          currentLen++;
          if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

          res = this.mul(res, wnd[current]);
          currentLen = 0;
          current = 0;
        }
        start = 26;
      }

      return res;
    };

    Red.prototype.convertTo = function convertTo (num) {
      var r = num.umod(this.m);

      return r === num ? r.clone() : r;
    };

    Red.prototype.convertFrom = function convertFrom (num) {
      var res = num.clone();
      res.red = null;
      return res;
    };

    //
    // Montgomery method engine
    //

    BN.mont = function mont (num) {
      return new Mont(num);
    };

    function Mont (m) {
      Red.call(this, m);

      this.shift = this.m.bitLength();
      if (this.shift % 26 !== 0) {
        this.shift += 26 - (this.shift % 26);
      }

      this.r = new BN(1).iushln(this.shift);
      this.r2 = this.imod(this.r.sqr());
      this.rinv = this.r._invmp(this.m);

      this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
      this.minv = this.minv.umod(this.r);
      this.minv = this.r.sub(this.minv);
    }
    inherits(Mont, Red);

    Mont.prototype.convertTo = function convertTo (num) {
      return this.imod(num.ushln(this.shift));
    };

    Mont.prototype.convertFrom = function convertFrom (num) {
      var r = this.imod(num.mul(this.rinv));
      r.red = null;
      return r;
    };

    Mont.prototype.imul = function imul (a, b) {
      if (a.isZero() || b.isZero()) {
        a.words[0] = 0;
        a.length = 1;
        return a;
      }

      var t = a.imul(b);
      var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u = t.isub(c).iushrn(this.shift);
      var res = u;

      if (u.cmp(this.m) >= 0) {
        res = u.isub(this.m);
      } else if (u.cmpn(0) < 0) {
        res = u.iadd(this.m);
      }

      return res._forceRed(this);
    };

    Mont.prototype.mul = function mul (a, b) {
      if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

      var t = a.mul(b);
      var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u = t.isub(c).iushrn(this.shift);
      var res = u;
      if (u.cmp(this.m) >= 0) {
        res = u.isub(this.m);
      } else if (u.cmpn(0) < 0) {
        res = u.iadd(this.m);
      }

      return res._forceRed(this);
    };

    Mont.prototype.invm = function invm (a) {
      // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
      var res = this.imod(a._invmp(this.m).mul(this.r2));
      return res._forceRed(this);
    };
  })(module, commonjsGlobal);
  });

  /**
   * Returns a `Boolean` on whether or not the a `String` starts with '0x'
   * @param {String} str the string input value
   * @return {Boolean} a boolean if it is or is not hex prefixed
   * @throws if the str input is not a string
   */
  var src = function isHexPrefixed(str) {
    if (typeof str !== 'string') {
      throw new Error("[is-hex-prefixed] value must be type 'string', is currently type " + (typeof str) + ", while checking isHexPrefixed.");
    }

    return str.slice(0, 2) === '0x';
  };

  /**
   * Removes '0x' from a given `String` is present
   * @param {String} str the string value
   * @return {String|Optional} a string by pass if necessary
   */
  var src$1 = function stripHexPrefix(str) {
    if (typeof str !== 'string') {
      return str;
    }

    return src(str) ? str.slice(2) : str;
  };

  /**
   * Returns a BN object, converts a number value to a BN
   * @param {String|Number|Object} `arg` input a string number, hex string number, number, BigNumber or BN object
   * @return {Object} `output` BN object of the number
   * @throws if the argument is not an array, object that isn't a bignumber, not a string number or number
   */
  var src$2 = function numberToBN(arg) {
    if (typeof arg === 'string' || typeof arg === 'number') {
      var multiplier = new bn(1); // eslint-disable-line
      var formattedString = String(arg).toLowerCase().trim();
      var isHexPrefixed = formattedString.substr(0, 2) === '0x' || formattedString.substr(0, 3) === '-0x';
      var stringArg = src$1(formattedString); // eslint-disable-line
      if (stringArg.substr(0, 1) === '-') {
        stringArg = src$1(stringArg.slice(1));
        multiplier = new bn(-1, 10);
      }
      stringArg = stringArg === '' ? '0' : stringArg;

      if ((!stringArg.match(/^-?[0-9]+$/) && stringArg.match(/^[0-9A-Fa-f]+$/))
        || stringArg.match(/^[a-fA-F]+$/)
        || (isHexPrefixed === true && stringArg.match(/^[0-9A-Fa-f]+$/))) {
        return new bn(stringArg, 16).mul(multiplier);
      }

      if ((stringArg.match(/^-?[0-9]+$/) || stringArg === '') && isHexPrefixed === false) {
        return new bn(stringArg, 10).mul(multiplier);
      }
    } else if (typeof arg === 'object' && arg.toString && (!arg.pop && !arg.push)) {
      if (arg.toString(10).match(/^-?[0-9]+$/) && (arg.mul || arg.dividedToIntegerBy)) {
        return new bn(arg.toString(10), 10);
      }
    }

    throw new Error('[number-to-bn] while converting number ' + JSON.stringify(arg) + ' to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported.');
  };

  var utf8 = createCommonjsModule(function (module, exports) {
  (function(root) {

  	// Detect free variables `exports`
  	var freeExports = exports;

  	// Detect free variable `module`
  	var freeModule = module &&
  		module.exports == freeExports && module;

  	// Detect free variable `global`, from Node.js or Browserified code,
  	// and use it as `root`
  	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal;
  	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
  		root = freeGlobal;
  	}

  	/*--------------------------------------------------------------------------*/

  	var stringFromCharCode = String.fromCharCode;

  	// Taken from https://mths.be/punycode
  	function ucs2decode(string) {
  		var output = [];
  		var counter = 0;
  		var length = string.length;
  		var value;
  		var extra;
  		while (counter < length) {
  			value = string.charCodeAt(counter++);
  			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
  				// high surrogate, and there is a next character
  				extra = string.charCodeAt(counter++);
  				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
  					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
  				} else {
  					// unmatched surrogate; only append this code unit, in case the next
  					// code unit is the high surrogate of a surrogate pair
  					output.push(value);
  					counter--;
  				}
  			} else {
  				output.push(value);
  			}
  		}
  		return output;
  	}

  	// Taken from https://mths.be/punycode
  	function ucs2encode(array) {
  		var length = array.length;
  		var index = -1;
  		var value;
  		var output = '';
  		while (++index < length) {
  			value = array[index];
  			if (value > 0xFFFF) {
  				value -= 0x10000;
  				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
  				value = 0xDC00 | value & 0x3FF;
  			}
  			output += stringFromCharCode(value);
  		}
  		return output;
  	}

  	function checkScalarValue(codePoint) {
  		if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
  			throw Error(
  				'Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
  				' is not a scalar value'
  			);
  		}
  	}
  	/*--------------------------------------------------------------------------*/

  	function createByte(codePoint, shift) {
  		return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
  	}

  	function encodeCodePoint(codePoint) {
  		if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
  			return stringFromCharCode(codePoint);
  		}
  		var symbol = '';
  		if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
  			symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
  		}
  		else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
  			checkScalarValue(codePoint);
  			symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
  			symbol += createByte(codePoint, 6);
  		}
  		else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
  			symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
  			symbol += createByte(codePoint, 12);
  			symbol += createByte(codePoint, 6);
  		}
  		symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
  		return symbol;
  	}

  	function utf8encode(string) {
  		var codePoints = ucs2decode(string);
  		var length = codePoints.length;
  		var index = -1;
  		var codePoint;
  		var byteString = '';
  		while (++index < length) {
  			codePoint = codePoints[index];
  			byteString += encodeCodePoint(codePoint);
  		}
  		return byteString;
  	}

  	/*--------------------------------------------------------------------------*/

  	function readContinuationByte() {
  		if (byteIndex >= byteCount) {
  			throw Error('Invalid byte index');
  		}

  		var continuationByte = byteArray[byteIndex] & 0xFF;
  		byteIndex++;

  		if ((continuationByte & 0xC0) == 0x80) {
  			return continuationByte & 0x3F;
  		}

  		// If we end up here, it’s not a continuation byte
  		throw Error('Invalid continuation byte');
  	}

  	function decodeSymbol() {
  		var byte1;
  		var byte2;
  		var byte3;
  		var byte4;
  		var codePoint;

  		if (byteIndex > byteCount) {
  			throw Error('Invalid byte index');
  		}

  		if (byteIndex == byteCount) {
  			return false;
  		}

  		// Read first byte
  		byte1 = byteArray[byteIndex] & 0xFF;
  		byteIndex++;

  		// 1-byte sequence (no continuation bytes)
  		if ((byte1 & 0x80) == 0) {
  			return byte1;
  		}

  		// 2-byte sequence
  		if ((byte1 & 0xE0) == 0xC0) {
  			var byte2 = readContinuationByte();
  			codePoint = ((byte1 & 0x1F) << 6) | byte2;
  			if (codePoint >= 0x80) {
  				return codePoint;
  			} else {
  				throw Error('Invalid continuation byte');
  			}
  		}

  		// 3-byte sequence (may include unpaired surrogates)
  		if ((byte1 & 0xF0) == 0xE0) {
  			byte2 = readContinuationByte();
  			byte3 = readContinuationByte();
  			codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
  			if (codePoint >= 0x0800) {
  				checkScalarValue(codePoint);
  				return codePoint;
  			} else {
  				throw Error('Invalid continuation byte');
  			}
  		}

  		// 4-byte sequence
  		if ((byte1 & 0xF8) == 0xF0) {
  			byte2 = readContinuationByte();
  			byte3 = readContinuationByte();
  			byte4 = readContinuationByte();
  			codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
  				(byte3 << 0x06) | byte4;
  			if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
  				return codePoint;
  			}
  		}

  		throw Error('Invalid UTF-8 detected');
  	}

  	var byteArray;
  	var byteCount;
  	var byteIndex;
  	function utf8decode(byteString) {
  		byteArray = ucs2decode(byteString);
  		byteCount = byteArray.length;
  		byteIndex = 0;
  		var codePoints = [];
  		var tmp;
  		while ((tmp = decodeSymbol()) !== false) {
  			codePoints.push(tmp);
  		}
  		return ucs2encode(codePoints);
  	}

  	/*--------------------------------------------------------------------------*/

  	var utf8 = {
  		'version': '2.0.0',
  		'encode': utf8encode,
  		'decode': utf8decode
  	};

  	// Some AMD build optimizers, like r.js, check for specific condition patterns
  	// like the following:
  	if (freeExports && !freeExports.nodeType) {
  		if (freeModule) { // in Node.js or RingoJS v0.8.0+
  			freeModule.exports = utf8;
  		} else { // in Narwhal or RingoJS v0.7.0-
  			var object = {};
  			var hasOwnProperty = object.hasOwnProperty;
  			for (var key in utf8) {
  				hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
  			}
  		}
  	} else { // in Rhino or a web browser
  		root.utf8 = utf8;
  	}

  }(commonjsGlobal));
  });

  // This was ported from https://github.com/emn178/js-sha3, with some minor

  var bn$1 = createCommonjsModule(function (module) {
  (function (module, exports) {

    // Utils
    function assert (val, msg) {
      if (!val) throw new Error(msg || 'Assertion failed');
    }

    // Could use `inherits` module, but don't want to move from single file
    // architecture yet.
    function inherits (ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }

    // BN

    function BN (number, base, endian) {
      if (BN.isBN(number)) {
        return number;
      }

      this.negative = 0;
      this.words = null;
      this.length = 0;

      // Reduction context
      this.red = null;

      if (number !== null) {
        if (base === 'le' || base === 'be') {
          endian = base;
          base = 10;
        }

        this._init(number || 0, base || 10, endian || 'be');
      }
    }
    if (typeof module === 'object') {
      module.exports = BN;
    } else {
      exports.BN = BN;
    }

    BN.BN = BN;
    BN.wordSize = 26;

    var Buffer;
    try {
      Buffer = buffer.Buffer;
    } catch (e) {
    }

    BN.isBN = function isBN (num) {
      if (num instanceof BN) {
        return true;
      }

      return num !== null && typeof num === 'object' &&
        num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
    };

    BN.max = function max (left, right) {
      if (left.cmp(right) > 0) return left;
      return right;
    };

    BN.min = function min (left, right) {
      if (left.cmp(right) < 0) return left;
      return right;
    };

    BN.prototype._init = function init (number, base, endian) {
      if (typeof number === 'number') {
        return this._initNumber(number, base, endian);
      }

      if (typeof number === 'object') {
        return this._initArray(number, base, endian);
      }

      if (base === 'hex') {
        base = 16;
      }
      assert(base === (base | 0) && base >= 2 && base <= 36);

      number = number.toString().replace(/\s+/g, '');
      var start = 0;
      if (number[0] === '-') {
        start++;
      }

      if (base === 16) {
        this._parseHex(number, start);
      } else {
        this._parseBase(number, base, start);
      }

      if (number[0] === '-') {
        this.negative = 1;
      }

      this.strip();

      if (endian !== 'le') return;

      this._initArray(this.toArray(), base, endian);
    };

    BN.prototype._initNumber = function _initNumber (number, base, endian) {
      if (number < 0) {
        this.negative = 1;
        number = -number;
      }
      if (number < 0x4000000) {
        this.words = [ number & 0x3ffffff ];
        this.length = 1;
      } else if (number < 0x10000000000000) {
        this.words = [
          number & 0x3ffffff,
          (number / 0x4000000) & 0x3ffffff
        ];
        this.length = 2;
      } else {
        assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
        this.words = [
          number & 0x3ffffff,
          (number / 0x4000000) & 0x3ffffff,
          1
        ];
        this.length = 3;
      }

      if (endian !== 'le') return;

      // Reverse the bytes
      this._initArray(this.toArray(), base, endian);
    };

    BN.prototype._initArray = function _initArray (number, base, endian) {
      // Perhaps a Uint8Array
      assert(typeof number.length === 'number');
      if (number.length <= 0) {
        this.words = [ 0 ];
        this.length = 1;
        return this;
      }

      this.length = Math.ceil(number.length / 3);
      this.words = new Array(this.length);
      for (var i = 0; i < this.length; i++) {
        this.words[i] = 0;
      }

      var j, w;
      var off = 0;
      if (endian === 'be') {
        for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
          w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
          this.words[j] |= (w << off) & 0x3ffffff;
          this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
      } else if (endian === 'le') {
        for (i = 0, j = 0; i < number.length; i += 3) {
          w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
          this.words[j] |= (w << off) & 0x3ffffff;
          this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
      }
      return this.strip();
    };

    function parseHex (str, start, end) {
      var r = 0;
      var len = Math.min(str.length, end);
      for (var i = start; i < len; i++) {
        var c = str.charCodeAt(i) - 48;

        r <<= 4;

        // 'a' - 'f'
        if (c >= 49 && c <= 54) {
          r |= c - 49 + 0xa;

        // 'A' - 'F'
        } else if (c >= 17 && c <= 22) {
          r |= c - 17 + 0xa;

        // '0' - '9'
        } else {
          r |= c & 0xf;
        }
      }
      return r;
    }

    BN.prototype._parseHex = function _parseHex (number, start) {
      // Create possibly bigger array to ensure that it fits the number
      this.length = Math.ceil((number.length - start) / 6);
      this.words = new Array(this.length);
      for (var i = 0; i < this.length; i++) {
        this.words[i] = 0;
      }

      var j, w;
      // Scan 24-bit chunks and add them to the number
      var off = 0;
      for (i = number.length - 6, j = 0; i >= start; i -= 6) {
        w = parseHex(number, i, i + 6);
        this.words[j] |= (w << off) & 0x3ffffff;
        // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
        this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
      if (i + 6 !== start) {
        w = parseHex(number, start, i + 6);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
      }
      this.strip();
    };

    function parseBase (str, start, end, mul) {
      var r = 0;
      var len = Math.min(str.length, end);
      for (var i = start; i < len; i++) {
        var c = str.charCodeAt(i) - 48;

        r *= mul;

        // 'a'
        if (c >= 49) {
          r += c - 49 + 0xa;

        // 'A'
        } else if (c >= 17) {
          r += c - 17 + 0xa;

        // '0' - '9'
        } else {
          r += c;
        }
      }
      return r;
    }

    BN.prototype._parseBase = function _parseBase (number, base, start) {
      // Initialize as zero
      this.words = [ 0 ];
      this.length = 1;

      // Find length of limb in base
      for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
        limbLen++;
      }
      limbLen--;
      limbPow = (limbPow / base) | 0;

      var total = number.length - start;
      var mod = total % limbLen;
      var end = Math.min(total, total - mod) + start;

      var word = 0;
      for (var i = start; i < end; i += limbLen) {
        word = parseBase(number, i, i + limbLen, base);

        this.imuln(limbPow);
        if (this.words[0] + word < 0x4000000) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }

      if (mod !== 0) {
        var pow = 1;
        word = parseBase(number, i, number.length, base);

        for (i = 0; i < mod; i++) {
          pow *= base;
        }

        this.imuln(pow);
        if (this.words[0] + word < 0x4000000) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }
    };

    BN.prototype.copy = function copy (dest) {
      dest.words = new Array(this.length);
      for (var i = 0; i < this.length; i++) {
        dest.words[i] = this.words[i];
      }
      dest.length = this.length;
      dest.negative = this.negative;
      dest.red = this.red;
    };

    BN.prototype.clone = function clone () {
      var r = new BN(null);
      this.copy(r);
      return r;
    };

    BN.prototype._expand = function _expand (size) {
      while (this.length < size) {
        this.words[this.length++] = 0;
      }
      return this;
    };

    // Remove leading `0` from `this`
    BN.prototype.strip = function strip () {
      while (this.length > 1 && this.words[this.length - 1] === 0) {
        this.length--;
      }
      return this._normSign();
    };

    BN.prototype._normSign = function _normSign () {
      // -0 = 0
      if (this.length === 1 && this.words[0] === 0) {
        this.negative = 0;
      }
      return this;
    };

    BN.prototype.inspect = function inspect () {
      return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
    };

    /*

    var zeros = [];
    var groupSizes = [];
    var groupBases = [];

    var s = '';
    var i = -1;
    while (++i < BN.wordSize) {
      zeros[i] = s;
      s += '0';
    }
    groupSizes[0] = 0;
    groupSizes[1] = 0;
    groupBases[0] = 0;
    groupBases[1] = 0;
    var base = 2 - 1;
    while (++base < 36 + 1) {
      var groupSize = 0;
      var groupBase = 1;
      while (groupBase < (1 << BN.wordSize) / base) {
        groupBase *= base;
        groupSize += 1;
      }
      groupSizes[base] = groupSize;
      groupBases[base] = groupBase;
    }

    */

    var zeros = [
      '',
      '0',
      '00',
      '000',
      '0000',
      '00000',
      '000000',
      '0000000',
      '00000000',
      '000000000',
      '0000000000',
      '00000000000',
      '000000000000',
      '0000000000000',
      '00000000000000',
      '000000000000000',
      '0000000000000000',
      '00000000000000000',
      '000000000000000000',
      '0000000000000000000',
      '00000000000000000000',
      '000000000000000000000',
      '0000000000000000000000',
      '00000000000000000000000',
      '000000000000000000000000',
      '0000000000000000000000000'
    ];

    var groupSizes = [
      0, 0,
      25, 16, 12, 11, 10, 9, 8,
      8, 7, 7, 7, 7, 6, 6,
      6, 6, 6, 6, 6, 5, 5,
      5, 5, 5, 5, 5, 5, 5,
      5, 5, 5, 5, 5, 5, 5
    ];

    var groupBases = [
      0, 0,
      33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
      43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
      16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
      6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
      24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
    ];

    BN.prototype.toString = function toString (base, padding) {
      base = base || 10;
      padding = padding | 0 || 1;

      var out;
      if (base === 16 || base === 'hex') {
        out = '';
        var off = 0;
        var carry = 0;
        for (var i = 0; i < this.length; i++) {
          var w = this.words[i];
          var word = (((w << off) | carry) & 0xffffff).toString(16);
          carry = (w >>> (24 - off)) & 0xffffff;
          if (carry !== 0 || i !== this.length - 1) {
            out = zeros[6 - word.length] + word + out;
          } else {
            out = word + out;
          }
          off += 2;
          if (off >= 26) {
            off -= 26;
            i--;
          }
        }
        if (carry !== 0) {
          out = carry.toString(16) + out;
        }
        while (out.length % padding !== 0) {
          out = '0' + out;
        }
        if (this.negative !== 0) {
          out = '-' + out;
        }
        return out;
      }

      if (base === (base | 0) && base >= 2 && base <= 36) {
        // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
        var groupSize = groupSizes[base];
        // var groupBase = Math.pow(base, groupSize);
        var groupBase = groupBases[base];
        out = '';
        var c = this.clone();
        c.negative = 0;
        while (!c.isZero()) {
          var r = c.modn(groupBase).toString(base);
          c = c.idivn(groupBase);

          if (!c.isZero()) {
            out = zeros[groupSize - r.length] + r + out;
          } else {
            out = r + out;
          }
        }
        if (this.isZero()) {
          out = '0' + out;
        }
        while (out.length % padding !== 0) {
          out = '0' + out;
        }
        if (this.negative !== 0) {
          out = '-' + out;
        }
        return out;
      }

      assert(false, 'Base should be between 2 and 36');
    };

    BN.prototype.toNumber = function toNumber () {
      var ret = this.words[0];
      if (this.length === 2) {
        ret += this.words[1] * 0x4000000;
      } else if (this.length === 3 && this.words[2] === 0x01) {
        // NOTE: at this stage it is known that the top bit is set
        ret += 0x10000000000000 + (this.words[1] * 0x4000000);
      } else if (this.length > 2) {
        assert(false, 'Number can only safely store up to 53 bits');
      }
      return (this.negative !== 0) ? -ret : ret;
    };

    BN.prototype.toJSON = function toJSON () {
      return this.toString(16);
    };

    BN.prototype.toBuffer = function toBuffer (endian, length) {
      assert(typeof Buffer !== 'undefined');
      return this.toArrayLike(Buffer, endian, length);
    };

    BN.prototype.toArray = function toArray (endian, length) {
      return this.toArrayLike(Array, endian, length);
    };

    BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
      var byteLength = this.byteLength();
      var reqLength = length || Math.max(1, byteLength);
      assert(byteLength <= reqLength, 'byte array longer than desired length');
      assert(reqLength > 0, 'Requested array length <= 0');

      this.strip();
      var littleEndian = endian === 'le';
      var res = new ArrayType(reqLength);

      var b, i;
      var q = this.clone();
      if (!littleEndian) {
        // Assume big-endian
        for (i = 0; i < reqLength - byteLength; i++) {
          res[i] = 0;
        }

        for (i = 0; !q.isZero(); i++) {
          b = q.andln(0xff);
          q.iushrn(8);

          res[reqLength - i - 1] = b;
        }
      } else {
        for (i = 0; !q.isZero(); i++) {
          b = q.andln(0xff);
          q.iushrn(8);

          res[i] = b;
        }

        for (; i < reqLength; i++) {
          res[i] = 0;
        }
      }

      return res;
    };

    if (Math.clz32) {
      BN.prototype._countBits = function _countBits (w) {
        return 32 - Math.clz32(w);
      };
    } else {
      BN.prototype._countBits = function _countBits (w) {
        var t = w;
        var r = 0;
        if (t >= 0x1000) {
          r += 13;
          t >>>= 13;
        }
        if (t >= 0x40) {
          r += 7;
          t >>>= 7;
        }
        if (t >= 0x8) {
          r += 4;
          t >>>= 4;
        }
        if (t >= 0x02) {
          r += 2;
          t >>>= 2;
        }
        return r + t;
      };
    }

    BN.prototype._zeroBits = function _zeroBits (w) {
      // Short-cut
      if (w === 0) return 26;

      var t = w;
      var r = 0;
      if ((t & 0x1fff) === 0) {
        r += 13;
        t >>>= 13;
      }
      if ((t & 0x7f) === 0) {
        r += 7;
        t >>>= 7;
      }
      if ((t & 0xf) === 0) {
        r += 4;
        t >>>= 4;
      }
      if ((t & 0x3) === 0) {
        r += 2;
        t >>>= 2;
      }
      if ((t & 0x1) === 0) {
        r++;
      }
      return r;
    };

    // Return number of used bits in a BN
    BN.prototype.bitLength = function bitLength () {
      var w = this.words[this.length - 1];
      var hi = this._countBits(w);
      return (this.length - 1) * 26 + hi;
    };

    function toBitArray (num) {
      var w = new Array(num.bitLength());

      for (var bit = 0; bit < w.length; bit++) {
        var off = (bit / 26) | 0;
        var wbit = bit % 26;

        w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
      }

      return w;
    }

    // Number of trailing zero bits
    BN.prototype.zeroBits = function zeroBits () {
      if (this.isZero()) return 0;

      var r = 0;
      for (var i = 0; i < this.length; i++) {
        var b = this._zeroBits(this.words[i]);
        r += b;
        if (b !== 26) break;
      }
      return r;
    };

    BN.prototype.byteLength = function byteLength () {
      return Math.ceil(this.bitLength() / 8);
    };

    BN.prototype.toTwos = function toTwos (width) {
      if (this.negative !== 0) {
        return this.abs().inotn(width).iaddn(1);
      }
      return this.clone();
    };

    BN.prototype.fromTwos = function fromTwos (width) {
      if (this.testn(width - 1)) {
        return this.notn(width).iaddn(1).ineg();
      }
      return this.clone();
    };

    BN.prototype.isNeg = function isNeg () {
      return this.negative !== 0;
    };

    // Return negative clone of `this`
    BN.prototype.neg = function neg () {
      return this.clone().ineg();
    };

    BN.prototype.ineg = function ineg () {
      if (!this.isZero()) {
        this.negative ^= 1;
      }

      return this;
    };

    // Or `num` with `this` in-place
    BN.prototype.iuor = function iuor (num) {
      while (this.length < num.length) {
        this.words[this.length++] = 0;
      }

      for (var i = 0; i < num.length; i++) {
        this.words[i] = this.words[i] | num.words[i];
      }

      return this.strip();
    };

    BN.prototype.ior = function ior (num) {
      assert((this.negative | num.negative) === 0);
      return this.iuor(num);
    };

    // Or `num` with `this`
    BN.prototype.or = function or (num) {
      if (this.length > num.length) return this.clone().ior(num);
      return num.clone().ior(this);
    };

    BN.prototype.uor = function uor (num) {
      if (this.length > num.length) return this.clone().iuor(num);
      return num.clone().iuor(this);
    };

    // And `num` with `this` in-place
    BN.prototype.iuand = function iuand (num) {
      // b = min-length(num, this)
      var b;
      if (this.length > num.length) {
        b = num;
      } else {
        b = this;
      }

      for (var i = 0; i < b.length; i++) {
        this.words[i] = this.words[i] & num.words[i];
      }

      this.length = b.length;

      return this.strip();
    };

    BN.prototype.iand = function iand (num) {
      assert((this.negative | num.negative) === 0);
      return this.iuand(num);
    };

    // And `num` with `this`
    BN.prototype.and = function and (num) {
      if (this.length > num.length) return this.clone().iand(num);
      return num.clone().iand(this);
    };

    BN.prototype.uand = function uand (num) {
      if (this.length > num.length) return this.clone().iuand(num);
      return num.clone().iuand(this);
    };

    // Xor `num` with `this` in-place
    BN.prototype.iuxor = function iuxor (num) {
      // a.length > b.length
      var a;
      var b;
      if (this.length > num.length) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }

      for (var i = 0; i < b.length; i++) {
        this.words[i] = a.words[i] ^ b.words[i];
      }

      if (this !== a) {
        for (; i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }

      this.length = a.length;

      return this.strip();
    };

    BN.prototype.ixor = function ixor (num) {
      assert((this.negative | num.negative) === 0);
      return this.iuxor(num);
    };

    // Xor `num` with `this`
    BN.prototype.xor = function xor (num) {
      if (this.length > num.length) return this.clone().ixor(num);
      return num.clone().ixor(this);
    };

    BN.prototype.uxor = function uxor (num) {
      if (this.length > num.length) return this.clone().iuxor(num);
      return num.clone().iuxor(this);
    };

    // Not ``this`` with ``width`` bitwidth
    BN.prototype.inotn = function inotn (width) {
      assert(typeof width === 'number' && width >= 0);

      var bytesNeeded = Math.ceil(width / 26) | 0;
      var bitsLeft = width % 26;

      // Extend the buffer with leading zeroes
      this._expand(bytesNeeded);

      if (bitsLeft > 0) {
        bytesNeeded--;
      }

      // Handle complete words
      for (var i = 0; i < bytesNeeded; i++) {
        this.words[i] = ~this.words[i] & 0x3ffffff;
      }

      // Handle the residue
      if (bitsLeft > 0) {
        this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
      }

      // And remove leading zeroes
      return this.strip();
    };

    BN.prototype.notn = function notn (width) {
      return this.clone().inotn(width);
    };

    // Set `bit` of `this`
    BN.prototype.setn = function setn (bit, val) {
      assert(typeof bit === 'number' && bit >= 0);

      var off = (bit / 26) | 0;
      var wbit = bit % 26;

      this._expand(off + 1);

      if (val) {
        this.words[off] = this.words[off] | (1 << wbit);
      } else {
        this.words[off] = this.words[off] & ~(1 << wbit);
      }

      return this.strip();
    };

    // Add `num` to `this` in-place
    BN.prototype.iadd = function iadd (num) {
      var r;

      // negative + positive
      if (this.negative !== 0 && num.negative === 0) {
        this.negative = 0;
        r = this.isub(num);
        this.negative ^= 1;
        return this._normSign();

      // positive + negative
      } else if (this.negative === 0 && num.negative !== 0) {
        num.negative = 0;
        r = this.isub(num);
        num.negative = 1;
        return r._normSign();
      }

      // a.length > b.length
      var a, b;
      if (this.length > num.length) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }

      var carry = 0;
      for (var i = 0; i < b.length; i++) {
        r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
        this.words[i] = r & 0x3ffffff;
        carry = r >>> 26;
      }
      for (; carry !== 0 && i < a.length; i++) {
        r = (a.words[i] | 0) + carry;
        this.words[i] = r & 0x3ffffff;
        carry = r >>> 26;
      }

      this.length = a.length;
      if (carry !== 0) {
        this.words[this.length] = carry;
        this.length++;
      // Copy the rest of the words
      } else if (a !== this) {
        for (; i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }

      return this;
    };

    // Add `num` to `this`
    BN.prototype.add = function add (num) {
      var res;
      if (num.negative !== 0 && this.negative === 0) {
        num.negative = 0;
        res = this.sub(num);
        num.negative ^= 1;
        return res;
      } else if (num.negative === 0 && this.negative !== 0) {
        this.negative = 0;
        res = num.sub(this);
        this.negative = 1;
        return res;
      }

      if (this.length > num.length) return this.clone().iadd(num);

      return num.clone().iadd(this);
    };

    // Subtract `num` from `this` in-place
    BN.prototype.isub = function isub (num) {
      // this - (-num) = this + num
      if (num.negative !== 0) {
        num.negative = 0;
        var r = this.iadd(num);
        num.negative = 1;
        return r._normSign();

      // -this - num = -(this + num)
      } else if (this.negative !== 0) {
        this.negative = 0;
        this.iadd(num);
        this.negative = 1;
        return this._normSign();
      }

      // At this point both numbers are positive
      var cmp = this.cmp(num);

      // Optimization - zeroify
      if (cmp === 0) {
        this.negative = 0;
        this.length = 1;
        this.words[0] = 0;
        return this;
      }

      // a > b
      var a, b;
      if (cmp > 0) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }

      var carry = 0;
      for (var i = 0; i < b.length; i++) {
        r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
        carry = r >> 26;
        this.words[i] = r & 0x3ffffff;
      }
      for (; carry !== 0 && i < a.length; i++) {
        r = (a.words[i] | 0) + carry;
        carry = r >> 26;
        this.words[i] = r & 0x3ffffff;
      }

      // Copy rest of the words
      if (carry === 0 && i < a.length && a !== this) {
        for (; i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }

      this.length = Math.max(this.length, i);

      if (a !== this) {
        this.negative = 1;
      }

      return this.strip();
    };

    // Subtract `num` from `this`
    BN.prototype.sub = function sub (num) {
      return this.clone().isub(num);
    };

    function smallMulTo (self, num, out) {
      out.negative = num.negative ^ self.negative;
      var len = (self.length + num.length) | 0;
      out.length = len;
      len = (len - 1) | 0;

      // Peel one iteration (compiler can't do it, because of code complexity)
      var a = self.words[0] | 0;
      var b = num.words[0] | 0;
      var r = a * b;

      var lo = r & 0x3ffffff;
      var carry = (r / 0x4000000) | 0;
      out.words[0] = lo;

      for (var k = 1; k < len; k++) {
        // Sum all words with the same `i + j = k` and accumulate `ncarry`,
        // note that ncarry could be >= 0x3ffffff
        var ncarry = carry >>> 26;
        var rword = carry & 0x3ffffff;
        var maxJ = Math.min(k, num.length - 1);
        for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
          var i = (k - j) | 0;
          a = self.words[i] | 0;
          b = num.words[j] | 0;
          r = a * b + rword;
          ncarry += (r / 0x4000000) | 0;
          rword = r & 0x3ffffff;
        }
        out.words[k] = rword | 0;
        carry = ncarry | 0;
      }
      if (carry !== 0) {
        out.words[k] = carry | 0;
      } else {
        out.length--;
      }

      return out.strip();
    }

    // TODO(indutny): it may be reasonable to omit it for users who don't need
    // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
    // multiplication (like elliptic secp256k1).
    var comb10MulTo = function comb10MulTo (self, num, out) {
      var a = self.words;
      var b = num.words;
      var o = out.words;
      var c = 0;
      var lo;
      var mid;
      var hi;
      var a0 = a[0] | 0;
      var al0 = a0 & 0x1fff;
      var ah0 = a0 >>> 13;
      var a1 = a[1] | 0;
      var al1 = a1 & 0x1fff;
      var ah1 = a1 >>> 13;
      var a2 = a[2] | 0;
      var al2 = a2 & 0x1fff;
      var ah2 = a2 >>> 13;
      var a3 = a[3] | 0;
      var al3 = a3 & 0x1fff;
      var ah3 = a3 >>> 13;
      var a4 = a[4] | 0;
      var al4 = a4 & 0x1fff;
      var ah4 = a4 >>> 13;
      var a5 = a[5] | 0;
      var al5 = a5 & 0x1fff;
      var ah5 = a5 >>> 13;
      var a6 = a[6] | 0;
      var al6 = a6 & 0x1fff;
      var ah6 = a6 >>> 13;
      var a7 = a[7] | 0;
      var al7 = a7 & 0x1fff;
      var ah7 = a7 >>> 13;
      var a8 = a[8] | 0;
      var al8 = a8 & 0x1fff;
      var ah8 = a8 >>> 13;
      var a9 = a[9] | 0;
      var al9 = a9 & 0x1fff;
      var ah9 = a9 >>> 13;
      var b0 = b[0] | 0;
      var bl0 = b0 & 0x1fff;
      var bh0 = b0 >>> 13;
      var b1 = b[1] | 0;
      var bl1 = b1 & 0x1fff;
      var bh1 = b1 >>> 13;
      var b2 = b[2] | 0;
      var bl2 = b2 & 0x1fff;
      var bh2 = b2 >>> 13;
      var b3 = b[3] | 0;
      var bl3 = b3 & 0x1fff;
      var bh3 = b3 >>> 13;
      var b4 = b[4] | 0;
      var bl4 = b4 & 0x1fff;
      var bh4 = b4 >>> 13;
      var b5 = b[5] | 0;
      var bl5 = b5 & 0x1fff;
      var bh5 = b5 >>> 13;
      var b6 = b[6] | 0;
      var bl6 = b6 & 0x1fff;
      var bh6 = b6 >>> 13;
      var b7 = b[7] | 0;
      var bl7 = b7 & 0x1fff;
      var bh7 = b7 >>> 13;
      var b8 = b[8] | 0;
      var bl8 = b8 & 0x1fff;
      var bh8 = b8 >>> 13;
      var b9 = b[9] | 0;
      var bl9 = b9 & 0x1fff;
      var bh9 = b9 >>> 13;

      out.negative = self.negative ^ num.negative;
      out.length = 19;
      /* k = 0 */
      lo = Math.imul(al0, bl0);
      mid = Math.imul(al0, bh0);
      mid = (mid + Math.imul(ah0, bl0)) | 0;
      hi = Math.imul(ah0, bh0);
      var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
      w0 &= 0x3ffffff;
      /* k = 1 */
      lo = Math.imul(al1, bl0);
      mid = Math.imul(al1, bh0);
      mid = (mid + Math.imul(ah1, bl0)) | 0;
      hi = Math.imul(ah1, bh0);
      lo = (lo + Math.imul(al0, bl1)) | 0;
      mid = (mid + Math.imul(al0, bh1)) | 0;
      mid = (mid + Math.imul(ah0, bl1)) | 0;
      hi = (hi + Math.imul(ah0, bh1)) | 0;
      var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
      w1 &= 0x3ffffff;
      /* k = 2 */
      lo = Math.imul(al2, bl0);
      mid = Math.imul(al2, bh0);
      mid = (mid + Math.imul(ah2, bl0)) | 0;
      hi = Math.imul(ah2, bh0);
      lo = (lo + Math.imul(al1, bl1)) | 0;
      mid = (mid + Math.imul(al1, bh1)) | 0;
      mid = (mid + Math.imul(ah1, bl1)) | 0;
      hi = (hi + Math.imul(ah1, bh1)) | 0;
      lo = (lo + Math.imul(al0, bl2)) | 0;
      mid = (mid + Math.imul(al0, bh2)) | 0;
      mid = (mid + Math.imul(ah0, bl2)) | 0;
      hi = (hi + Math.imul(ah0, bh2)) | 0;
      var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
      w2 &= 0x3ffffff;
      /* k = 3 */
      lo = Math.imul(al3, bl0);
      mid = Math.imul(al3, bh0);
      mid = (mid + Math.imul(ah3, bl0)) | 0;
      hi = Math.imul(ah3, bh0);
      lo = (lo + Math.imul(al2, bl1)) | 0;
      mid = (mid + Math.imul(al2, bh1)) | 0;
      mid = (mid + Math.imul(ah2, bl1)) | 0;
      hi = (hi + Math.imul(ah2, bh1)) | 0;
      lo = (lo + Math.imul(al1, bl2)) | 0;
      mid = (mid + Math.imul(al1, bh2)) | 0;
      mid = (mid + Math.imul(ah1, bl2)) | 0;
      hi = (hi + Math.imul(ah1, bh2)) | 0;
      lo = (lo + Math.imul(al0, bl3)) | 0;
      mid = (mid + Math.imul(al0, bh3)) | 0;
      mid = (mid + Math.imul(ah0, bl3)) | 0;
      hi = (hi + Math.imul(ah0, bh3)) | 0;
      var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
      w3 &= 0x3ffffff;
      /* k = 4 */
      lo = Math.imul(al4, bl0);
      mid = Math.imul(al4, bh0);
      mid = (mid + Math.imul(ah4, bl0)) | 0;
      hi = Math.imul(ah4, bh0);
      lo = (lo + Math.imul(al3, bl1)) | 0;
      mid = (mid + Math.imul(al3, bh1)) | 0;
      mid = (mid + Math.imul(ah3, bl1)) | 0;
      hi = (hi + Math.imul(ah3, bh1)) | 0;
      lo = (lo + Math.imul(al2, bl2)) | 0;
      mid = (mid + Math.imul(al2, bh2)) | 0;
      mid = (mid + Math.imul(ah2, bl2)) | 0;
      hi = (hi + Math.imul(ah2, bh2)) | 0;
      lo = (lo + Math.imul(al1, bl3)) | 0;
      mid = (mid + Math.imul(al1, bh3)) | 0;
      mid = (mid + Math.imul(ah1, bl3)) | 0;
      hi = (hi + Math.imul(ah1, bh3)) | 0;
      lo = (lo + Math.imul(al0, bl4)) | 0;
      mid = (mid + Math.imul(al0, bh4)) | 0;
      mid = (mid + Math.imul(ah0, bl4)) | 0;
      hi = (hi + Math.imul(ah0, bh4)) | 0;
      var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
      w4 &= 0x3ffffff;
      /* k = 5 */
      lo = Math.imul(al5, bl0);
      mid = Math.imul(al5, bh0);
      mid = (mid + Math.imul(ah5, bl0)) | 0;
      hi = Math.imul(ah5, bh0);
      lo = (lo + Math.imul(al4, bl1)) | 0;
      mid = (mid + Math.imul(al4, bh1)) | 0;
      mid = (mid + Math.imul(ah4, bl1)) | 0;
      hi = (hi + Math.imul(ah4, bh1)) | 0;
      lo = (lo + Math.imul(al3, bl2)) | 0;
      mid = (mid + Math.imul(al3, bh2)) | 0;
      mid = (mid + Math.imul(ah3, bl2)) | 0;
      hi = (hi + Math.imul(ah3, bh2)) | 0;
      lo = (lo + Math.imul(al2, bl3)) | 0;
      mid = (mid + Math.imul(al2, bh3)) | 0;
      mid = (mid + Math.imul(ah2, bl3)) | 0;
      hi = (hi + Math.imul(ah2, bh3)) | 0;
      lo = (lo + Math.imul(al1, bl4)) | 0;
      mid = (mid + Math.imul(al1, bh4)) | 0;
      mid = (mid + Math.imul(ah1, bl4)) | 0;
      hi = (hi + Math.imul(ah1, bh4)) | 0;
      lo = (lo + Math.imul(al0, bl5)) | 0;
      mid = (mid + Math.imul(al0, bh5)) | 0;
      mid = (mid + Math.imul(ah0, bl5)) | 0;
      hi = (hi + Math.imul(ah0, bh5)) | 0;
      var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
      w5 &= 0x3ffffff;
      /* k = 6 */
      lo = Math.imul(al6, bl0);
      mid = Math.imul(al6, bh0);
      mid = (mid + Math.imul(ah6, bl0)) | 0;
      hi = Math.imul(ah6, bh0);
      lo = (lo + Math.imul(al5, bl1)) | 0;
      mid = (mid + Math.imul(al5, bh1)) | 0;
      mid = (mid + Math.imul(ah5, bl1)) | 0;
      hi = (hi + Math.imul(ah5, bh1)) | 0;
      lo = (lo + Math.imul(al4, bl2)) | 0;
      mid = (mid + Math.imul(al4, bh2)) | 0;
      mid = (mid + Math.imul(ah4, bl2)) | 0;
      hi = (hi + Math.imul(ah4, bh2)) | 0;
      lo = (lo + Math.imul(al3, bl3)) | 0;
      mid = (mid + Math.imul(al3, bh3)) | 0;
      mid = (mid + Math.imul(ah3, bl3)) | 0;
      hi = (hi + Math.imul(ah3, bh3)) | 0;
      lo = (lo + Math.imul(al2, bl4)) | 0;
      mid = (mid + Math.imul(al2, bh4)) | 0;
      mid = (mid + Math.imul(ah2, bl4)) | 0;
      hi = (hi + Math.imul(ah2, bh4)) | 0;
      lo = (lo + Math.imul(al1, bl5)) | 0;
      mid = (mid + Math.imul(al1, bh5)) | 0;
      mid = (mid + Math.imul(ah1, bl5)) | 0;
      hi = (hi + Math.imul(ah1, bh5)) | 0;
      lo = (lo + Math.imul(al0, bl6)) | 0;
      mid = (mid + Math.imul(al0, bh6)) | 0;
      mid = (mid + Math.imul(ah0, bl6)) | 0;
      hi = (hi + Math.imul(ah0, bh6)) | 0;
      var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
      w6 &= 0x3ffffff;
      /* k = 7 */
      lo = Math.imul(al7, bl0);
      mid = Math.imul(al7, bh0);
      mid = (mid + Math.imul(ah7, bl0)) | 0;
      hi = Math.imul(ah7, bh0);
      lo = (lo + Math.imul(al6, bl1)) | 0;
      mid = (mid + Math.imul(al6, bh1)) | 0;
      mid = (mid + Math.imul(ah6, bl1)) | 0;
      hi = (hi + Math.imul(ah6, bh1)) | 0;
      lo = (lo + Math.imul(al5, bl2)) | 0;
      mid = (mid + Math.imul(al5, bh2)) | 0;
      mid = (mid + Math.imul(ah5, bl2)) | 0;
      hi = (hi + Math.imul(ah5, bh2)) | 0;
      lo = (lo + Math.imul(al4, bl3)) | 0;
      mid = (mid + Math.imul(al4, bh3)) | 0;
      mid = (mid + Math.imul(ah4, bl3)) | 0;
      hi = (hi + Math.imul(ah4, bh3)) | 0;
      lo = (lo + Math.imul(al3, bl4)) | 0;
      mid = (mid + Math.imul(al3, bh4)) | 0;
      mid = (mid + Math.imul(ah3, bl4)) | 0;
      hi = (hi + Math.imul(ah3, bh4)) | 0;
      lo = (lo + Math.imul(al2, bl5)) | 0;
      mid = (mid + Math.imul(al2, bh5)) | 0;
      mid = (mid + Math.imul(ah2, bl5)) | 0;
      hi = (hi + Math.imul(ah2, bh5)) | 0;
      lo = (lo + Math.imul(al1, bl6)) | 0;
      mid = (mid + Math.imul(al1, bh6)) | 0;
      mid = (mid + Math.imul(ah1, bl6)) | 0;
      hi = (hi + Math.imul(ah1, bh6)) | 0;
      lo = (lo + Math.imul(al0, bl7)) | 0;
      mid = (mid + Math.imul(al0, bh7)) | 0;
      mid = (mid + Math.imul(ah0, bl7)) | 0;
      hi = (hi + Math.imul(ah0, bh7)) | 0;
      var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
      w7 &= 0x3ffffff;
      /* k = 8 */
      lo = Math.imul(al8, bl0);
      mid = Math.imul(al8, bh0);
      mid = (mid + Math.imul(ah8, bl0)) | 0;
      hi = Math.imul(ah8, bh0);
      lo = (lo + Math.imul(al7, bl1)) | 0;
      mid = (mid + Math.imul(al7, bh1)) | 0;
      mid = (mid + Math.imul(ah7, bl1)) | 0;
      hi = (hi + Math.imul(ah7, bh1)) | 0;
      lo = (lo + Math.imul(al6, bl2)) | 0;
      mid = (mid + Math.imul(al6, bh2)) | 0;
      mid = (mid + Math.imul(ah6, bl2)) | 0;
      hi = (hi + Math.imul(ah6, bh2)) | 0;
      lo = (lo + Math.imul(al5, bl3)) | 0;
      mid = (mid + Math.imul(al5, bh3)) | 0;
      mid = (mid + Math.imul(ah5, bl3)) | 0;
      hi = (hi + Math.imul(ah5, bh3)) | 0;
      lo = (lo + Math.imul(al4, bl4)) | 0;
      mid = (mid + Math.imul(al4, bh4)) | 0;
      mid = (mid + Math.imul(ah4, bl4)) | 0;
      hi = (hi + Math.imul(ah4, bh4)) | 0;
      lo = (lo + Math.imul(al3, bl5)) | 0;
      mid = (mid + Math.imul(al3, bh5)) | 0;
      mid = (mid + Math.imul(ah3, bl5)) | 0;
      hi = (hi + Math.imul(ah3, bh5)) | 0;
      lo = (lo + Math.imul(al2, bl6)) | 0;
      mid = (mid + Math.imul(al2, bh6)) | 0;
      mid = (mid + Math.imul(ah2, bl6)) | 0;
      hi = (hi + Math.imul(ah2, bh6)) | 0;
      lo = (lo + Math.imul(al1, bl7)) | 0;
      mid = (mid + Math.imul(al1, bh7)) | 0;
      mid = (mid + Math.imul(ah1, bl7)) | 0;
      hi = (hi + Math.imul(ah1, bh7)) | 0;
      lo = (lo + Math.imul(al0, bl8)) | 0;
      mid = (mid + Math.imul(al0, bh8)) | 0;
      mid = (mid + Math.imul(ah0, bl8)) | 0;
      hi = (hi + Math.imul(ah0, bh8)) | 0;
      var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
      w8 &= 0x3ffffff;
      /* k = 9 */
      lo = Math.imul(al9, bl0);
      mid = Math.imul(al9, bh0);
      mid = (mid + Math.imul(ah9, bl0)) | 0;
      hi = Math.imul(ah9, bh0);
      lo = (lo + Math.imul(al8, bl1)) | 0;
      mid = (mid + Math.imul(al8, bh1)) | 0;
      mid = (mid + Math.imul(ah8, bl1)) | 0;
      hi = (hi + Math.imul(ah8, bh1)) | 0;
      lo = (lo + Math.imul(al7, bl2)) | 0;
      mid = (mid + Math.imul(al7, bh2)) | 0;
      mid = (mid + Math.imul(ah7, bl2)) | 0;
      hi = (hi + Math.imul(ah7, bh2)) | 0;
      lo = (lo + Math.imul(al6, bl3)) | 0;
      mid = (mid + Math.imul(al6, bh3)) | 0;
      mid = (mid + Math.imul(ah6, bl3)) | 0;
      hi = (hi + Math.imul(ah6, bh3)) | 0;
      lo = (lo + Math.imul(al5, bl4)) | 0;
      mid = (mid + Math.imul(al5, bh4)) | 0;
      mid = (mid + Math.imul(ah5, bl4)) | 0;
      hi = (hi + Math.imul(ah5, bh4)) | 0;
      lo = (lo + Math.imul(al4, bl5)) | 0;
      mid = (mid + Math.imul(al4, bh5)) | 0;
      mid = (mid + Math.imul(ah4, bl5)) | 0;
      hi = (hi + Math.imul(ah4, bh5)) | 0;
      lo = (lo + Math.imul(al3, bl6)) | 0;
      mid = (mid + Math.imul(al3, bh6)) | 0;
      mid = (mid + Math.imul(ah3, bl6)) | 0;
      hi = (hi + Math.imul(ah3, bh6)) | 0;
      lo = (lo + Math.imul(al2, bl7)) | 0;
      mid = (mid + Math.imul(al2, bh7)) | 0;
      mid = (mid + Math.imul(ah2, bl7)) | 0;
      hi = (hi + Math.imul(ah2, bh7)) | 0;
      lo = (lo + Math.imul(al1, bl8)) | 0;
      mid = (mid + Math.imul(al1, bh8)) | 0;
      mid = (mid + Math.imul(ah1, bl8)) | 0;
      hi = (hi + Math.imul(ah1, bh8)) | 0;
      lo = (lo + Math.imul(al0, bl9)) | 0;
      mid = (mid + Math.imul(al0, bh9)) | 0;
      mid = (mid + Math.imul(ah0, bl9)) | 0;
      hi = (hi + Math.imul(ah0, bh9)) | 0;
      var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
      w9 &= 0x3ffffff;
      /* k = 10 */
      lo = Math.imul(al9, bl1);
      mid = Math.imul(al9, bh1);
      mid = (mid + Math.imul(ah9, bl1)) | 0;
      hi = Math.imul(ah9, bh1);
      lo = (lo + Math.imul(al8, bl2)) | 0;
      mid = (mid + Math.imul(al8, bh2)) | 0;
      mid = (mid + Math.imul(ah8, bl2)) | 0;
      hi = (hi + Math.imul(ah8, bh2)) | 0;
      lo = (lo + Math.imul(al7, bl3)) | 0;
      mid = (mid + Math.imul(al7, bh3)) | 0;
      mid = (mid + Math.imul(ah7, bl3)) | 0;
      hi = (hi + Math.imul(ah7, bh3)) | 0;
      lo = (lo + Math.imul(al6, bl4)) | 0;
      mid = (mid + Math.imul(al6, bh4)) | 0;
      mid = (mid + Math.imul(ah6, bl4)) | 0;
      hi = (hi + Math.imul(ah6, bh4)) | 0;
      lo = (lo + Math.imul(al5, bl5)) | 0;
      mid = (mid + Math.imul(al5, bh5)) | 0;
      mid = (mid + Math.imul(ah5, bl5)) | 0;
      hi = (hi + Math.imul(ah5, bh5)) | 0;
      lo = (lo + Math.imul(al4, bl6)) | 0;
      mid = (mid + Math.imul(al4, bh6)) | 0;
      mid = (mid + Math.imul(ah4, bl6)) | 0;
      hi = (hi + Math.imul(ah4, bh6)) | 0;
      lo = (lo + Math.imul(al3, bl7)) | 0;
      mid = (mid + Math.imul(al3, bh7)) | 0;
      mid = (mid + Math.imul(ah3, bl7)) | 0;
      hi = (hi + Math.imul(ah3, bh7)) | 0;
      lo = (lo + Math.imul(al2, bl8)) | 0;
      mid = (mid + Math.imul(al2, bh8)) | 0;
      mid = (mid + Math.imul(ah2, bl8)) | 0;
      hi = (hi + Math.imul(ah2, bh8)) | 0;
      lo = (lo + Math.imul(al1, bl9)) | 0;
      mid = (mid + Math.imul(al1, bh9)) | 0;
      mid = (mid + Math.imul(ah1, bl9)) | 0;
      hi = (hi + Math.imul(ah1, bh9)) | 0;
      var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
      w10 &= 0x3ffffff;
      /* k = 11 */
      lo = Math.imul(al9, bl2);
      mid = Math.imul(al9, bh2);
      mid = (mid + Math.imul(ah9, bl2)) | 0;
      hi = Math.imul(ah9, bh2);
      lo = (lo + Math.imul(al8, bl3)) | 0;
      mid = (mid + Math.imul(al8, bh3)) | 0;
      mid = (mid + Math.imul(ah8, bl3)) | 0;
      hi = (hi + Math.imul(ah8, bh3)) | 0;
      lo = (lo + Math.imul(al7, bl4)) | 0;
      mid = (mid + Math.imul(al7, bh4)) | 0;
      mid = (mid + Math.imul(ah7, bl4)) | 0;
      hi = (hi + Math.imul(ah7, bh4)) | 0;
      lo = (lo + Math.imul(al6, bl5)) | 0;
      mid = (mid + Math.imul(al6, bh5)) | 0;
      mid = (mid + Math.imul(ah6, bl5)) | 0;
      hi = (hi + Math.imul(ah6, bh5)) | 0;
      lo = (lo + Math.imul(al5, bl6)) | 0;
      mid = (mid + Math.imul(al5, bh6)) | 0;
      mid = (mid + Math.imul(ah5, bl6)) | 0;
      hi = (hi + Math.imul(ah5, bh6)) | 0;
      lo = (lo + Math.imul(al4, bl7)) | 0;
      mid = (mid + Math.imul(al4, bh7)) | 0;
      mid = (mid + Math.imul(ah4, bl7)) | 0;
      hi = (hi + Math.imul(ah4, bh7)) | 0;
      lo = (lo + Math.imul(al3, bl8)) | 0;
      mid = (mid + Math.imul(al3, bh8)) | 0;
      mid = (mid + Math.imul(ah3, bl8)) | 0;
      hi = (hi + Math.imul(ah3, bh8)) | 0;
      lo = (lo + Math.imul(al2, bl9)) | 0;
      mid = (mid + Math.imul(al2, bh9)) | 0;
      mid = (mid + Math.imul(ah2, bl9)) | 0;
      hi = (hi + Math.imul(ah2, bh9)) | 0;
      var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
      w11 &= 0x3ffffff;
      /* k = 12 */
      lo = Math.imul(al9, bl3);
      mid = Math.imul(al9, bh3);
      mid = (mid + Math.imul(ah9, bl3)) | 0;
      hi = Math.imul(ah9, bh3);
      lo = (lo + Math.imul(al8, bl4)) | 0;
      mid = (mid + Math.imul(al8, bh4)) | 0;
      mid = (mid + Math.imul(ah8, bl4)) | 0;
      hi = (hi + Math.imul(ah8, bh4)) | 0;
      lo = (lo + Math.imul(al7, bl5)) | 0;
      mid = (mid + Math.imul(al7, bh5)) | 0;
      mid = (mid + Math.imul(ah7, bl5)) | 0;
      hi = (hi + Math.imul(ah7, bh5)) | 0;
      lo = (lo + Math.imul(al6, bl6)) | 0;
      mid = (mid + Math.imul(al6, bh6)) | 0;
      mid = (mid + Math.imul(ah6, bl6)) | 0;
      hi = (hi + Math.imul(ah6, bh6)) | 0;
      lo = (lo + Math.imul(al5, bl7)) | 0;
      mid = (mid + Math.imul(al5, bh7)) | 0;
      mid = (mid + Math.imul(ah5, bl7)) | 0;
      hi = (hi + Math.imul(ah5, bh7)) | 0;
      lo = (lo + Math.imul(al4, bl8)) | 0;
      mid = (mid + Math.imul(al4, bh8)) | 0;
      mid = (mid + Math.imul(ah4, bl8)) | 0;
      hi = (hi + Math.imul(ah4, bh8)) | 0;
      lo = (lo + Math.imul(al3, bl9)) | 0;
      mid = (mid + Math.imul(al3, bh9)) | 0;
      mid = (mid + Math.imul(ah3, bl9)) | 0;
      hi = (hi + Math.imul(ah3, bh9)) | 0;
      var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
      w12 &= 0x3ffffff;
      /* k = 13 */
      lo = Math.imul(al9, bl4);
      mid = Math.imul(al9, bh4);
      mid = (mid + Math.imul(ah9, bl4)) | 0;
      hi = Math.imul(ah9, bh4);
      lo = (lo + Math.imul(al8, bl5)) | 0;
      mid = (mid + Math.imul(al8, bh5)) | 0;
      mid = (mid + Math.imul(ah8, bl5)) | 0;
      hi = (hi + Math.imul(ah8, bh5)) | 0;
      lo = (lo + Math.imul(al7, bl6)) | 0;
      mid = (mid + Math.imul(al7, bh6)) | 0;
      mid = (mid + Math.imul(ah7, bl6)) | 0;
      hi = (hi + Math.imul(ah7, bh6)) | 0;
      lo = (lo + Math.imul(al6, bl7)) | 0;
      mid = (mid + Math.imul(al6, bh7)) | 0;
      mid = (mid + Math.imul(ah6, bl7)) | 0;
      hi = (hi + Math.imul(ah6, bh7)) | 0;
      lo = (lo + Math.imul(al5, bl8)) | 0;
      mid = (mid + Math.imul(al5, bh8)) | 0;
      mid = (mid + Math.imul(ah5, bl8)) | 0;
      hi = (hi + Math.imul(ah5, bh8)) | 0;
      lo = (lo + Math.imul(al4, bl9)) | 0;
      mid = (mid + Math.imul(al4, bh9)) | 0;
      mid = (mid + Math.imul(ah4, bl9)) | 0;
      hi = (hi + Math.imul(ah4, bh9)) | 0;
      var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
      w13 &= 0x3ffffff;
      /* k = 14 */
      lo = Math.imul(al9, bl5);
      mid = Math.imul(al9, bh5);
      mid = (mid + Math.imul(ah9, bl5)) | 0;
      hi = Math.imul(ah9, bh5);
      lo = (lo + Math.imul(al8, bl6)) | 0;
      mid = (mid + Math.imul(al8, bh6)) | 0;
      mid = (mid + Math.imul(ah8, bl6)) | 0;
      hi = (hi + Math.imul(ah8, bh6)) | 0;
      lo = (lo + Math.imul(al7, bl7)) | 0;
      mid = (mid + Math.imul(al7, bh7)) | 0;
      mid = (mid + Math.imul(ah7, bl7)) | 0;
      hi = (hi + Math.imul(ah7, bh7)) | 0;
      lo = (lo + Math.imul(al6, bl8)) | 0;
      mid = (mid + Math.imul(al6, bh8)) | 0;
      mid = (mid + Math.imul(ah6, bl8)) | 0;
      hi = (hi + Math.imul(ah6, bh8)) | 0;
      lo = (lo + Math.imul(al5, bl9)) | 0;
      mid = (mid + Math.imul(al5, bh9)) | 0;
      mid = (mid + Math.imul(ah5, bl9)) | 0;
      hi = (hi + Math.imul(ah5, bh9)) | 0;
      var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
      w14 &= 0x3ffffff;
      /* k = 15 */
      lo = Math.imul(al9, bl6);
      mid = Math.imul(al9, bh6);
      mid = (mid + Math.imul(ah9, bl6)) | 0;
      hi = Math.imul(ah9, bh6);
      lo = (lo + Math.imul(al8, bl7)) | 0;
      mid = (mid + Math.imul(al8, bh7)) | 0;
      mid = (mid + Math.imul(ah8, bl7)) | 0;
      hi = (hi + Math.imul(ah8, bh7)) | 0;
      lo = (lo + Math.imul(al7, bl8)) | 0;
      mid = (mid + Math.imul(al7, bh8)) | 0;
      mid = (mid + Math.imul(ah7, bl8)) | 0;
      hi = (hi + Math.imul(ah7, bh8)) | 0;
      lo = (lo + Math.imul(al6, bl9)) | 0;
      mid = (mid + Math.imul(al6, bh9)) | 0;
      mid = (mid + Math.imul(ah6, bl9)) | 0;
      hi = (hi + Math.imul(ah6, bh9)) | 0;
      var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
      w15 &= 0x3ffffff;
      /* k = 16 */
      lo = Math.imul(al9, bl7);
      mid = Math.imul(al9, bh7);
      mid = (mid + Math.imul(ah9, bl7)) | 0;
      hi = Math.imul(ah9, bh7);
      lo = (lo + Math.imul(al8, bl8)) | 0;
      mid = (mid + Math.imul(al8, bh8)) | 0;
      mid = (mid + Math.imul(ah8, bl8)) | 0;
      hi = (hi + Math.imul(ah8, bh8)) | 0;
      lo = (lo + Math.imul(al7, bl9)) | 0;
      mid = (mid + Math.imul(al7, bh9)) | 0;
      mid = (mid + Math.imul(ah7, bl9)) | 0;
      hi = (hi + Math.imul(ah7, bh9)) | 0;
      var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
      w16 &= 0x3ffffff;
      /* k = 17 */
      lo = Math.imul(al9, bl8);
      mid = Math.imul(al9, bh8);
      mid = (mid + Math.imul(ah9, bl8)) | 0;
      hi = Math.imul(ah9, bh8);
      lo = (lo + Math.imul(al8, bl9)) | 0;
      mid = (mid + Math.imul(al8, bh9)) | 0;
      mid = (mid + Math.imul(ah8, bl9)) | 0;
      hi = (hi + Math.imul(ah8, bh9)) | 0;
      var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
      w17 &= 0x3ffffff;
      /* k = 18 */
      lo = Math.imul(al9, bl9);
      mid = Math.imul(al9, bh9);
      mid = (mid + Math.imul(ah9, bl9)) | 0;
      hi = Math.imul(ah9, bh9);
      var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
      w18 &= 0x3ffffff;
      o[0] = w0;
      o[1] = w1;
      o[2] = w2;
      o[3] = w3;
      o[4] = w4;
      o[5] = w5;
      o[6] = w6;
      o[7] = w7;
      o[8] = w8;
      o[9] = w9;
      o[10] = w10;
      o[11] = w11;
      o[12] = w12;
      o[13] = w13;
      o[14] = w14;
      o[15] = w15;
      o[16] = w16;
      o[17] = w17;
      o[18] = w18;
      if (c !== 0) {
        o[19] = c;
        out.length++;
      }
      return out;
    };

    // Polyfill comb
    if (!Math.imul) {
      comb10MulTo = smallMulTo;
    }

    function bigMulTo (self, num, out) {
      out.negative = num.negative ^ self.negative;
      out.length = self.length + num.length;

      var carry = 0;
      var hncarry = 0;
      for (var k = 0; k < out.length - 1; k++) {
        // Sum all words with the same `i + j = k` and accumulate `ncarry`,
        // note that ncarry could be >= 0x3ffffff
        var ncarry = hncarry;
        hncarry = 0;
        var rword = carry & 0x3ffffff;
        var maxJ = Math.min(k, num.length - 1);
        for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
          var i = k - j;
          var a = self.words[i] | 0;
          var b = num.words[j] | 0;
          var r = a * b;

          var lo = r & 0x3ffffff;
          ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
          lo = (lo + rword) | 0;
          rword = lo & 0x3ffffff;
          ncarry = (ncarry + (lo >>> 26)) | 0;

          hncarry += ncarry >>> 26;
          ncarry &= 0x3ffffff;
        }
        out.words[k] = rword;
        carry = ncarry;
        ncarry = hncarry;
      }
      if (carry !== 0) {
        out.words[k] = carry;
      } else {
        out.length--;
      }

      return out.strip();
    }

    function jumboMulTo (self, num, out) {
      var fftm = new FFTM();
      return fftm.mulp(self, num, out);
    }

    BN.prototype.mulTo = function mulTo (num, out) {
      var res;
      var len = this.length + num.length;
      if (this.length === 10 && num.length === 10) {
        res = comb10MulTo(this, num, out);
      } else if (len < 63) {
        res = smallMulTo(this, num, out);
      } else if (len < 1024) {
        res = bigMulTo(this, num, out);
      } else {
        res = jumboMulTo(this, num, out);
      }

      return res;
    };

    // Cooley-Tukey algorithm for FFT
    // slightly revisited to rely on looping instead of recursion

    function FFTM (x, y) {
      this.x = x;
      this.y = y;
    }

    FFTM.prototype.makeRBT = function makeRBT (N) {
      var t = new Array(N);
      var l = BN.prototype._countBits(N) - 1;
      for (var i = 0; i < N; i++) {
        t[i] = this.revBin(i, l, N);
      }

      return t;
    };

    // Returns binary-reversed representation of `x`
    FFTM.prototype.revBin = function revBin (x, l, N) {
      if (x === 0 || x === N - 1) return x;

      var rb = 0;
      for (var i = 0; i < l; i++) {
        rb |= (x & 1) << (l - i - 1);
        x >>= 1;
      }

      return rb;
    };

    // Performs "tweedling" phase, therefore 'emulating'
    // behaviour of the recursive algorithm
    FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
      for (var i = 0; i < N; i++) {
        rtws[i] = rws[rbt[i]];
        itws[i] = iws[rbt[i]];
      }
    };

    FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
      this.permute(rbt, rws, iws, rtws, itws, N);

      for (var s = 1; s < N; s <<= 1) {
        var l = s << 1;

        var rtwdf = Math.cos(2 * Math.PI / l);
        var itwdf = Math.sin(2 * Math.PI / l);

        for (var p = 0; p < N; p += l) {
          var rtwdf_ = rtwdf;
          var itwdf_ = itwdf;

          for (var j = 0; j < s; j++) {
            var re = rtws[p + j];
            var ie = itws[p + j];

            var ro = rtws[p + j + s];
            var io = itws[p + j + s];

            var rx = rtwdf_ * ro - itwdf_ * io;

            io = rtwdf_ * io + itwdf_ * ro;
            ro = rx;

            rtws[p + j] = re + ro;
            itws[p + j] = ie + io;

            rtws[p + j + s] = re - ro;
            itws[p + j + s] = ie - io;

            /* jshint maxdepth : false */
            if (j !== l) {
              rx = rtwdf * rtwdf_ - itwdf * itwdf_;

              itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
              rtwdf_ = rx;
            }
          }
        }
      }
    };

    FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
      var N = Math.max(m, n) | 1;
      var odd = N & 1;
      var i = 0;
      for (N = N / 2 | 0; N; N = N >>> 1) {
        i++;
      }

      return 1 << i + 1 + odd;
    };

    FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
      if (N <= 1) return;

      for (var i = 0; i < N / 2; i++) {
        var t = rws[i];

        rws[i] = rws[N - i - 1];
        rws[N - i - 1] = t;

        t = iws[i];

        iws[i] = -iws[N - i - 1];
        iws[N - i - 1] = -t;
      }
    };

    FFTM.prototype.normalize13b = function normalize13b (ws, N) {
      var carry = 0;
      for (var i = 0; i < N / 2; i++) {
        var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
          Math.round(ws[2 * i] / N) +
          carry;

        ws[i] = w & 0x3ffffff;

        if (w < 0x4000000) {
          carry = 0;
        } else {
          carry = w / 0x4000000 | 0;
        }
      }

      return ws;
    };

    FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
      var carry = 0;
      for (var i = 0; i < len; i++) {
        carry = carry + (ws[i] | 0);

        rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
        rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
      }

      // Pad with zeroes
      for (i = 2 * len; i < N; ++i) {
        rws[i] = 0;
      }

      assert(carry === 0);
      assert((carry & ~0x1fff) === 0);
    };

    FFTM.prototype.stub = function stub (N) {
      var ph = new Array(N);
      for (var i = 0; i < N; i++) {
        ph[i] = 0;
      }

      return ph;
    };

    FFTM.prototype.mulp = function mulp (x, y, out) {
      var N = 2 * this.guessLen13b(x.length, y.length);

      var rbt = this.makeRBT(N);

      var _ = this.stub(N);

      var rws = new Array(N);
      var rwst = new Array(N);
      var iwst = new Array(N);

      var nrws = new Array(N);
      var nrwst = new Array(N);
      var niwst = new Array(N);

      var rmws = out.words;
      rmws.length = N;

      this.convert13b(x.words, x.length, rws, N);
      this.convert13b(y.words, y.length, nrws, N);

      this.transform(rws, _, rwst, iwst, N, rbt);
      this.transform(nrws, _, nrwst, niwst, N, rbt);

      for (var i = 0; i < N; i++) {
        var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
        iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
        rwst[i] = rx;
      }

      this.conjugate(rwst, iwst, N);
      this.transform(rwst, iwst, rmws, _, N, rbt);
      this.conjugate(rmws, _, N);
      this.normalize13b(rmws, N);

      out.negative = x.negative ^ y.negative;
      out.length = x.length + y.length;
      return out.strip();
    };

    // Multiply `this` by `num`
    BN.prototype.mul = function mul (num) {
      var out = new BN(null);
      out.words = new Array(this.length + num.length);
      return this.mulTo(num, out);
    };

    // Multiply employing FFT
    BN.prototype.mulf = function mulf (num) {
      var out = new BN(null);
      out.words = new Array(this.length + num.length);
      return jumboMulTo(this, num, out);
    };

    // In-place Multiplication
    BN.prototype.imul = function imul (num) {
      return this.clone().mulTo(num, this);
    };

    BN.prototype.imuln = function imuln (num) {
      assert(typeof num === 'number');
      assert(num < 0x4000000);

      // Carry
      var carry = 0;
      for (var i = 0; i < this.length; i++) {
        var w = (this.words[i] | 0) * num;
        var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
        carry >>= 26;
        carry += (w / 0x4000000) | 0;
        // NOTE: lo is 27bit maximum
        carry += lo >>> 26;
        this.words[i] = lo & 0x3ffffff;
      }

      if (carry !== 0) {
        this.words[i] = carry;
        this.length++;
      }

      return this;
    };

    BN.prototype.muln = function muln (num) {
      return this.clone().imuln(num);
    };

    // `this` * `this`
    BN.prototype.sqr = function sqr () {
      return this.mul(this);
    };

    // `this` * `this` in-place
    BN.prototype.isqr = function isqr () {
      return this.imul(this.clone());
    };

    // Math.pow(`this`, `num`)
    BN.prototype.pow = function pow (num) {
      var w = toBitArray(num);
      if (w.length === 0) return new BN(1);

      // Skip leading zeroes
      var res = this;
      for (var i = 0; i < w.length; i++, res = res.sqr()) {
        if (w[i] !== 0) break;
      }

      if (++i < w.length) {
        for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
          if (w[i] === 0) continue;

          res = res.mul(q);
        }
      }

      return res;
    };

    // Shift-left in-place
    BN.prototype.iushln = function iushln (bits) {
      assert(typeof bits === 'number' && bits >= 0);
      var r = bits % 26;
      var s = (bits - r) / 26;
      var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
      var i;

      if (r !== 0) {
        var carry = 0;

        for (i = 0; i < this.length; i++) {
          var newCarry = this.words[i] & carryMask;
          var c = ((this.words[i] | 0) - newCarry) << r;
          this.words[i] = c | carry;
          carry = newCarry >>> (26 - r);
        }

        if (carry) {
          this.words[i] = carry;
          this.length++;
        }
      }

      if (s !== 0) {
        for (i = this.length - 1; i >= 0; i--) {
          this.words[i + s] = this.words[i];
        }

        for (i = 0; i < s; i++) {
          this.words[i] = 0;
        }

        this.length += s;
      }

      return this.strip();
    };

    BN.prototype.ishln = function ishln (bits) {
      // TODO(indutny): implement me
      assert(this.negative === 0);
      return this.iushln(bits);
    };

    // Shift-right in-place
    // NOTE: `hint` is a lowest bit before trailing zeroes
    // NOTE: if `extended` is present - it will be filled with destroyed bits
    BN.prototype.iushrn = function iushrn (bits, hint, extended) {
      assert(typeof bits === 'number' && bits >= 0);
      var h;
      if (hint) {
        h = (hint - (hint % 26)) / 26;
      } else {
        h = 0;
      }

      var r = bits % 26;
      var s = Math.min((bits - r) / 26, this.length);
      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
      var maskedWords = extended;

      h -= s;
      h = Math.max(0, h);

      // Extended mode, copy masked part
      if (maskedWords) {
        for (var i = 0; i < s; i++) {
          maskedWords.words[i] = this.words[i];
        }
        maskedWords.length = s;
      }

      if (s === 0) ; else if (this.length > s) {
        this.length -= s;
        for (i = 0; i < this.length; i++) {
          this.words[i] = this.words[i + s];
        }
      } else {
        this.words[0] = 0;
        this.length = 1;
      }

      var carry = 0;
      for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
        var word = this.words[i] | 0;
        this.words[i] = (carry << (26 - r)) | (word >>> r);
        carry = word & mask;
      }

      // Push carried bits as a mask
      if (maskedWords && carry !== 0) {
        maskedWords.words[maskedWords.length++] = carry;
      }

      if (this.length === 0) {
        this.words[0] = 0;
        this.length = 1;
      }

      return this.strip();
    };

    BN.prototype.ishrn = function ishrn (bits, hint, extended) {
      // TODO(indutny): implement me
      assert(this.negative === 0);
      return this.iushrn(bits, hint, extended);
    };

    // Shift-left
    BN.prototype.shln = function shln (bits) {
      return this.clone().ishln(bits);
    };

    BN.prototype.ushln = function ushln (bits) {
      return this.clone().iushln(bits);
    };

    // Shift-right
    BN.prototype.shrn = function shrn (bits) {
      return this.clone().ishrn(bits);
    };

    BN.prototype.ushrn = function ushrn (bits) {
      return this.clone().iushrn(bits);
    };

    // Test if n bit is set
    BN.prototype.testn = function testn (bit) {
      assert(typeof bit === 'number' && bit >= 0);
      var r = bit % 26;
      var s = (bit - r) / 26;
      var q = 1 << r;

      // Fast case: bit is much higher than all existing words
      if (this.length <= s) return false;

      // Check bit and return
      var w = this.words[s];

      return !!(w & q);
    };

    // Return only lowers bits of number (in-place)
    BN.prototype.imaskn = function imaskn (bits) {
      assert(typeof bits === 'number' && bits >= 0);
      var r = bits % 26;
      var s = (bits - r) / 26;

      assert(this.negative === 0, 'imaskn works only with positive numbers');

      if (this.length <= s) {
        return this;
      }

      if (r !== 0) {
        s++;
      }
      this.length = Math.min(s, this.length);

      if (r !== 0) {
        var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
        this.words[this.length - 1] &= mask;
      }

      return this.strip();
    };

    // Return only lowers bits of number
    BN.prototype.maskn = function maskn (bits) {
      return this.clone().imaskn(bits);
    };

    // Add plain number `num` to `this`
    BN.prototype.iaddn = function iaddn (num) {
      assert(typeof num === 'number');
      assert(num < 0x4000000);
      if (num < 0) return this.isubn(-num);

      // Possible sign change
      if (this.negative !== 0) {
        if (this.length === 1 && (this.words[0] | 0) < num) {
          this.words[0] = num - (this.words[0] | 0);
          this.negative = 0;
          return this;
        }

        this.negative = 0;
        this.isubn(num);
        this.negative = 1;
        return this;
      }

      // Add without checks
      return this._iaddn(num);
    };

    BN.prototype._iaddn = function _iaddn (num) {
      this.words[0] += num;

      // Carry
      for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
        this.words[i] -= 0x4000000;
        if (i === this.length - 1) {
          this.words[i + 1] = 1;
        } else {
          this.words[i + 1]++;
        }
      }
      this.length = Math.max(this.length, i + 1);

      return this;
    };

    // Subtract plain number `num` from `this`
    BN.prototype.isubn = function isubn (num) {
      assert(typeof num === 'number');
      assert(num < 0x4000000);
      if (num < 0) return this.iaddn(-num);

      if (this.negative !== 0) {
        this.negative = 0;
        this.iaddn(num);
        this.negative = 1;
        return this;
      }

      this.words[0] -= num;

      if (this.length === 1 && this.words[0] < 0) {
        this.words[0] = -this.words[0];
        this.negative = 1;
      } else {
        // Carry
        for (var i = 0; i < this.length && this.words[i] < 0; i++) {
          this.words[i] += 0x4000000;
          this.words[i + 1] -= 1;
        }
      }

      return this.strip();
    };

    BN.prototype.addn = function addn (num) {
      return this.clone().iaddn(num);
    };

    BN.prototype.subn = function subn (num) {
      return this.clone().isubn(num);
    };

    BN.prototype.iabs = function iabs () {
      this.negative = 0;

      return this;
    };

    BN.prototype.abs = function abs () {
      return this.clone().iabs();
    };

    BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
      var len = num.length + shift;
      var i;

      this._expand(len);

      var w;
      var carry = 0;
      for (i = 0; i < num.length; i++) {
        w = (this.words[i + shift] | 0) + carry;
        var right = (num.words[i] | 0) * mul;
        w -= right & 0x3ffffff;
        carry = (w >> 26) - ((right / 0x4000000) | 0);
        this.words[i + shift] = w & 0x3ffffff;
      }
      for (; i < this.length - shift; i++) {
        w = (this.words[i + shift] | 0) + carry;
        carry = w >> 26;
        this.words[i + shift] = w & 0x3ffffff;
      }

      if (carry === 0) return this.strip();

      // Subtraction overflow
      assert(carry === -1);
      carry = 0;
      for (i = 0; i < this.length; i++) {
        w = -(this.words[i] | 0) + carry;
        carry = w >> 26;
        this.words[i] = w & 0x3ffffff;
      }
      this.negative = 1;

      return this.strip();
    };

    BN.prototype._wordDiv = function _wordDiv (num, mode) {
      var shift = this.length - num.length;

      var a = this.clone();
      var b = num;

      // Normalize
      var bhi = b.words[b.length - 1] | 0;
      var bhiBits = this._countBits(bhi);
      shift = 26 - bhiBits;
      if (shift !== 0) {
        b = b.ushln(shift);
        a.iushln(shift);
        bhi = b.words[b.length - 1] | 0;
      }

      // Initialize quotient
      var m = a.length - b.length;
      var q;

      if (mode !== 'mod') {
        q = new BN(null);
        q.length = m + 1;
        q.words = new Array(q.length);
        for (var i = 0; i < q.length; i++) {
          q.words[i] = 0;
        }
      }

      var diff = a.clone()._ishlnsubmul(b, 1, m);
      if (diff.negative === 0) {
        a = diff;
        if (q) {
          q.words[m] = 1;
        }
      }

      for (var j = m - 1; j >= 0; j--) {
        var qj = (a.words[b.length + j] | 0) * 0x4000000 +
          (a.words[b.length + j - 1] | 0);

        // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
        // (0x7ffffff)
        qj = Math.min((qj / bhi) | 0, 0x3ffffff);

        a._ishlnsubmul(b, qj, j);
        while (a.negative !== 0) {
          qj--;
          a.negative = 0;
          a._ishlnsubmul(b, 1, j);
          if (!a.isZero()) {
            a.negative ^= 1;
          }
        }
        if (q) {
          q.words[j] = qj;
        }
      }
      if (q) {
        q.strip();
      }
      a.strip();

      // Denormalize
      if (mode !== 'div' && shift !== 0) {
        a.iushrn(shift);
      }

      return {
        div: q || null,
        mod: a
      };
    };

    // NOTE: 1) `mode` can be set to `mod` to request mod only,
    //       to `div` to request div only, or be absent to
    //       request both div & mod
    //       2) `positive` is true if unsigned mod is requested
    BN.prototype.divmod = function divmod (num, mode, positive) {
      assert(!num.isZero());

      if (this.isZero()) {
        return {
          div: new BN(0),
          mod: new BN(0)
        };
      }

      var div, mod, res;
      if (this.negative !== 0 && num.negative === 0) {
        res = this.neg().divmod(num, mode);

        if (mode !== 'mod') {
          div = res.div.neg();
        }

        if (mode !== 'div') {
          mod = res.mod.neg();
          if (positive && mod.negative !== 0) {
            mod.iadd(num);
          }
        }

        return {
          div: div,
          mod: mod
        };
      }

      if (this.negative === 0 && num.negative !== 0) {
        res = this.divmod(num.neg(), mode);

        if (mode !== 'mod') {
          div = res.div.neg();
        }

        return {
          div: div,
          mod: res.mod
        };
      }

      if ((this.negative & num.negative) !== 0) {
        res = this.neg().divmod(num.neg(), mode);

        if (mode !== 'div') {
          mod = res.mod.neg();
          if (positive && mod.negative !== 0) {
            mod.isub(num);
          }
        }

        return {
          div: res.div,
          mod: mod
        };
      }

      // Both numbers are positive at this point

      // Strip both numbers to approximate shift value
      if (num.length > this.length || this.cmp(num) < 0) {
        return {
          div: new BN(0),
          mod: this
        };
      }

      // Very short reduction
      if (num.length === 1) {
        if (mode === 'div') {
          return {
            div: this.divn(num.words[0]),
            mod: null
          };
        }

        if (mode === 'mod') {
          return {
            div: null,
            mod: new BN(this.modn(num.words[0]))
          };
        }

        return {
          div: this.divn(num.words[0]),
          mod: new BN(this.modn(num.words[0]))
        };
      }

      return this._wordDiv(num, mode);
    };

    // Find `this` / `num`
    BN.prototype.div = function div (num) {
      return this.divmod(num, 'div', false).div;
    };

    // Find `this` % `num`
    BN.prototype.mod = function mod (num) {
      return this.divmod(num, 'mod', false).mod;
    };

    BN.prototype.umod = function umod (num) {
      return this.divmod(num, 'mod', true).mod;
    };

    // Find Round(`this` / `num`)
    BN.prototype.divRound = function divRound (num) {
      var dm = this.divmod(num);

      // Fast case - exact division
      if (dm.mod.isZero()) return dm.div;

      var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

      var half = num.ushrn(1);
      var r2 = num.andln(1);
      var cmp = mod.cmp(half);

      // Round down
      if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

      // Round up
      return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
    };

    BN.prototype.modn = function modn (num) {
      assert(num <= 0x3ffffff);
      var p = (1 << 26) % num;

      var acc = 0;
      for (var i = this.length - 1; i >= 0; i--) {
        acc = (p * acc + (this.words[i] | 0)) % num;
      }

      return acc;
    };

    // In-place division by number
    BN.prototype.idivn = function idivn (num) {
      assert(num <= 0x3ffffff);

      var carry = 0;
      for (var i = this.length - 1; i >= 0; i--) {
        var w = (this.words[i] | 0) + carry * 0x4000000;
        this.words[i] = (w / num) | 0;
        carry = w % num;
      }

      return this.strip();
    };

    BN.prototype.divn = function divn (num) {
      return this.clone().idivn(num);
    };

    BN.prototype.egcd = function egcd (p) {
      assert(p.negative === 0);
      assert(!p.isZero());

      var x = this;
      var y = p.clone();

      if (x.negative !== 0) {
        x = x.umod(p);
      } else {
        x = x.clone();
      }

      // A * x + B * y = x
      var A = new BN(1);
      var B = new BN(0);

      // C * x + D * y = y
      var C = new BN(0);
      var D = new BN(1);

      var g = 0;

      while (x.isEven() && y.isEven()) {
        x.iushrn(1);
        y.iushrn(1);
        ++g;
      }

      var yp = y.clone();
      var xp = x.clone();

      while (!x.isZero()) {
        for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
        if (i > 0) {
          x.iushrn(i);
          while (i-- > 0) {
            if (A.isOdd() || B.isOdd()) {
              A.iadd(yp);
              B.isub(xp);
            }

            A.iushrn(1);
            B.iushrn(1);
          }
        }

        for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
        if (j > 0) {
          y.iushrn(j);
          while (j-- > 0) {
            if (C.isOdd() || D.isOdd()) {
              C.iadd(yp);
              D.isub(xp);
            }

            C.iushrn(1);
            D.iushrn(1);
          }
        }

        if (x.cmp(y) >= 0) {
          x.isub(y);
          A.isub(C);
          B.isub(D);
        } else {
          y.isub(x);
          C.isub(A);
          D.isub(B);
        }
      }

      return {
        a: C,
        b: D,
        gcd: y.iushln(g)
      };
    };

    // This is reduced incarnation of the binary EEA
    // above, designated to invert members of the
    // _prime_ fields F(p) at a maximal speed
    BN.prototype._invmp = function _invmp (p) {
      assert(p.negative === 0);
      assert(!p.isZero());

      var a = this;
      var b = p.clone();

      if (a.negative !== 0) {
        a = a.umod(p);
      } else {
        a = a.clone();
      }

      var x1 = new BN(1);
      var x2 = new BN(0);

      var delta = b.clone();

      while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
        for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
        if (i > 0) {
          a.iushrn(i);
          while (i-- > 0) {
            if (x1.isOdd()) {
              x1.iadd(delta);
            }

            x1.iushrn(1);
          }
        }

        for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
        if (j > 0) {
          b.iushrn(j);
          while (j-- > 0) {
            if (x2.isOdd()) {
              x2.iadd(delta);
            }

            x2.iushrn(1);
          }
        }

        if (a.cmp(b) >= 0) {
          a.isub(b);
          x1.isub(x2);
        } else {
          b.isub(a);
          x2.isub(x1);
        }
      }

      var res;
      if (a.cmpn(1) === 0) {
        res = x1;
      } else {
        res = x2;
      }

      if (res.cmpn(0) < 0) {
        res.iadd(p);
      }

      return res;
    };

    BN.prototype.gcd = function gcd (num) {
      if (this.isZero()) return num.abs();
      if (num.isZero()) return this.abs();

      var a = this.clone();
      var b = num.clone();
      a.negative = 0;
      b.negative = 0;

      // Remove common factor of two
      for (var shift = 0; a.isEven() && b.isEven(); shift++) {
        a.iushrn(1);
        b.iushrn(1);
      }

      do {
        while (a.isEven()) {
          a.iushrn(1);
        }
        while (b.isEven()) {
          b.iushrn(1);
        }

        var r = a.cmp(b);
        if (r < 0) {
          // Swap `a` and `b` to make `a` always bigger than `b`
          var t = a;
          a = b;
          b = t;
        } else if (r === 0 || b.cmpn(1) === 0) {
          break;
        }

        a.isub(b);
      } while (true);

      return b.iushln(shift);
    };

    // Invert number in the field F(num)
    BN.prototype.invm = function invm (num) {
      return this.egcd(num).a.umod(num);
    };

    BN.prototype.isEven = function isEven () {
      return (this.words[0] & 1) === 0;
    };

    BN.prototype.isOdd = function isOdd () {
      return (this.words[0] & 1) === 1;
    };

    // And first word and num
    BN.prototype.andln = function andln (num) {
      return this.words[0] & num;
    };

    // Increment at the bit position in-line
    BN.prototype.bincn = function bincn (bit) {
      assert(typeof bit === 'number');
      var r = bit % 26;
      var s = (bit - r) / 26;
      var q = 1 << r;

      // Fast case: bit is much higher than all existing words
      if (this.length <= s) {
        this._expand(s + 1);
        this.words[s] |= q;
        return this;
      }

      // Add bit and propagate, if needed
      var carry = q;
      for (var i = s; carry !== 0 && i < this.length; i++) {
        var w = this.words[i] | 0;
        w += carry;
        carry = w >>> 26;
        w &= 0x3ffffff;
        this.words[i] = w;
      }
      if (carry !== 0) {
        this.words[i] = carry;
        this.length++;
      }
      return this;
    };

    BN.prototype.isZero = function isZero () {
      return this.length === 1 && this.words[0] === 0;
    };

    BN.prototype.cmpn = function cmpn (num) {
      var negative = num < 0;

      if (this.negative !== 0 && !negative) return -1;
      if (this.negative === 0 && negative) return 1;

      this.strip();

      var res;
      if (this.length > 1) {
        res = 1;
      } else {
        if (negative) {
          num = -num;
        }

        assert(num <= 0x3ffffff, 'Number is too big');

        var w = this.words[0] | 0;
        res = w === num ? 0 : w < num ? -1 : 1;
      }
      if (this.negative !== 0) return -res | 0;
      return res;
    };

    // Compare two numbers and return:
    // 1 - if `this` > `num`
    // 0 - if `this` == `num`
    // -1 - if `this` < `num`
    BN.prototype.cmp = function cmp (num) {
      if (this.negative !== 0 && num.negative === 0) return -1;
      if (this.negative === 0 && num.negative !== 0) return 1;

      var res = this.ucmp(num);
      if (this.negative !== 0) return -res | 0;
      return res;
    };

    // Unsigned comparison
    BN.prototype.ucmp = function ucmp (num) {
      // At this point both numbers have the same sign
      if (this.length > num.length) return 1;
      if (this.length < num.length) return -1;

      var res = 0;
      for (var i = this.length - 1; i >= 0; i--) {
        var a = this.words[i] | 0;
        var b = num.words[i] | 0;

        if (a === b) continue;
        if (a < b) {
          res = -1;
        } else if (a > b) {
          res = 1;
        }
        break;
      }
      return res;
    };

    BN.prototype.gtn = function gtn (num) {
      return this.cmpn(num) === 1;
    };

    BN.prototype.gt = function gt (num) {
      return this.cmp(num) === 1;
    };

    BN.prototype.gten = function gten (num) {
      return this.cmpn(num) >= 0;
    };

    BN.prototype.gte = function gte (num) {
      return this.cmp(num) >= 0;
    };

    BN.prototype.ltn = function ltn (num) {
      return this.cmpn(num) === -1;
    };

    BN.prototype.lt = function lt (num) {
      return this.cmp(num) === -1;
    };

    BN.prototype.lten = function lten (num) {
      return this.cmpn(num) <= 0;
    };

    BN.prototype.lte = function lte (num) {
      return this.cmp(num) <= 0;
    };

    BN.prototype.eqn = function eqn (num) {
      return this.cmpn(num) === 0;
    };

    BN.prototype.eq = function eq (num) {
      return this.cmp(num) === 0;
    };

    //
    // A reduce context, could be using montgomery or something better, depending
    // on the `m` itself.
    //
    BN.red = function red (num) {
      return new Red(num);
    };

    BN.prototype.toRed = function toRed (ctx) {
      assert(!this.red, 'Already a number in reduction context');
      assert(this.negative === 0, 'red works only with positives');
      return ctx.convertTo(this)._forceRed(ctx);
    };

    BN.prototype.fromRed = function fromRed () {
      assert(this.red, 'fromRed works only with numbers in reduction context');
      return this.red.convertFrom(this);
    };

    BN.prototype._forceRed = function _forceRed (ctx) {
      this.red = ctx;
      return this;
    };

    BN.prototype.forceRed = function forceRed (ctx) {
      assert(!this.red, 'Already a number in reduction context');
      return this._forceRed(ctx);
    };

    BN.prototype.redAdd = function redAdd (num) {
      assert(this.red, 'redAdd works only with red numbers');
      return this.red.add(this, num);
    };

    BN.prototype.redIAdd = function redIAdd (num) {
      assert(this.red, 'redIAdd works only with red numbers');
      return this.red.iadd(this, num);
    };

    BN.prototype.redSub = function redSub (num) {
      assert(this.red, 'redSub works only with red numbers');
      return this.red.sub(this, num);
    };

    BN.prototype.redISub = function redISub (num) {
      assert(this.red, 'redISub works only with red numbers');
      return this.red.isub(this, num);
    };

    BN.prototype.redShl = function redShl (num) {
      assert(this.red, 'redShl works only with red numbers');
      return this.red.shl(this, num);
    };

    BN.prototype.redMul = function redMul (num) {
      assert(this.red, 'redMul works only with red numbers');
      this.red._verify2(this, num);
      return this.red.mul(this, num);
    };

    BN.prototype.redIMul = function redIMul (num) {
      assert(this.red, 'redMul works only with red numbers');
      this.red._verify2(this, num);
      return this.red.imul(this, num);
    };

    BN.prototype.redSqr = function redSqr () {
      assert(this.red, 'redSqr works only with red numbers');
      this.red._verify1(this);
      return this.red.sqr(this);
    };

    BN.prototype.redISqr = function redISqr () {
      assert(this.red, 'redISqr works only with red numbers');
      this.red._verify1(this);
      return this.red.isqr(this);
    };

    // Square root over p
    BN.prototype.redSqrt = function redSqrt () {
      assert(this.red, 'redSqrt works only with red numbers');
      this.red._verify1(this);
      return this.red.sqrt(this);
    };

    BN.prototype.redInvm = function redInvm () {
      assert(this.red, 'redInvm works only with red numbers');
      this.red._verify1(this);
      return this.red.invm(this);
    };

    // Return negative clone of `this` % `red modulo`
    BN.prototype.redNeg = function redNeg () {
      assert(this.red, 'redNeg works only with red numbers');
      this.red._verify1(this);
      return this.red.neg(this);
    };

    BN.prototype.redPow = function redPow (num) {
      assert(this.red && !num.red, 'redPow(normalNum)');
      this.red._verify1(this);
      return this.red.pow(this, num);
    };

    // Prime numbers with efficient reduction
    var primes = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };

    // Pseudo-Mersenne prime
    function MPrime (name, p) {
      // P = 2 ^ N - K
      this.name = name;
      this.p = new BN(p, 16);
      this.n = this.p.bitLength();
      this.k = new BN(1).iushln(this.n).isub(this.p);

      this.tmp = this._tmp();
    }

    MPrime.prototype._tmp = function _tmp () {
      var tmp = new BN(null);
      tmp.words = new Array(Math.ceil(this.n / 13));
      return tmp;
    };

    MPrime.prototype.ireduce = function ireduce (num) {
      // Assumes that `num` is less than `P^2`
      // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
      var r = num;
      var rlen;

      do {
        this.split(r, this.tmp);
        r = this.imulK(r);
        r = r.iadd(this.tmp);
        rlen = r.bitLength();
      } while (rlen > this.n);

      var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
      if (cmp === 0) {
        r.words[0] = 0;
        r.length = 1;
      } else if (cmp > 0) {
        r.isub(this.p);
      } else {
        r.strip();
      }

      return r;
    };

    MPrime.prototype.split = function split (input, out) {
      input.iushrn(this.n, 0, out);
    };

    MPrime.prototype.imulK = function imulK (num) {
      return num.imul(this.k);
    };

    function K256 () {
      MPrime.call(
        this,
        'k256',
        'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
    }
    inherits(K256, MPrime);

    K256.prototype.split = function split (input, output) {
      // 256 = 9 * 26 + 22
      var mask = 0x3fffff;

      var outLen = Math.min(input.length, 9);
      for (var i = 0; i < outLen; i++) {
        output.words[i] = input.words[i];
      }
      output.length = outLen;

      if (input.length <= 9) {
        input.words[0] = 0;
        input.length = 1;
        return;
      }

      // Shift by 9 limbs
      var prev = input.words[9];
      output.words[output.length++] = prev & mask;

      for (i = 10; i < input.length; i++) {
        var next = input.words[i] | 0;
        input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
        prev = next;
      }
      prev >>>= 22;
      input.words[i - 10] = prev;
      if (prev === 0 && input.length > 10) {
        input.length -= 10;
      } else {
        input.length -= 9;
      }
    };

    K256.prototype.imulK = function imulK (num) {
      // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
      num.words[num.length] = 0;
      num.words[num.length + 1] = 0;
      num.length += 2;

      // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
      var lo = 0;
      for (var i = 0; i < num.length; i++) {
        var w = num.words[i] | 0;
        lo += w * 0x3d1;
        num.words[i] = lo & 0x3ffffff;
        lo = w * 0x40 + ((lo / 0x4000000) | 0);
      }

      // Fast length reduction
      if (num.words[num.length - 1] === 0) {
        num.length--;
        if (num.words[num.length - 1] === 0) {
          num.length--;
        }
      }
      return num;
    };

    function P224 () {
      MPrime.call(
        this,
        'p224',
        'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
    }
    inherits(P224, MPrime);

    function P192 () {
      MPrime.call(
        this,
        'p192',
        'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
    }
    inherits(P192, MPrime);

    function P25519 () {
      // 2 ^ 255 - 19
      MPrime.call(
        this,
        '25519',
        '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
    }
    inherits(P25519, MPrime);

    P25519.prototype.imulK = function imulK (num) {
      // K = 0x13
      var carry = 0;
      for (var i = 0; i < num.length; i++) {
        var hi = (num.words[i] | 0) * 0x13 + carry;
        var lo = hi & 0x3ffffff;
        hi >>>= 26;

        num.words[i] = lo;
        carry = hi;
      }
      if (carry !== 0) {
        num.words[num.length++] = carry;
      }
      return num;
    };

    // Exported mostly for testing purposes, use plain name instead
    BN._prime = function prime (name) {
      // Cached version of prime
      if (primes[name]) return primes[name];

      var prime;
      if (name === 'k256') {
        prime = new K256();
      } else if (name === 'p224') {
        prime = new P224();
      } else if (name === 'p192') {
        prime = new P192();
      } else if (name === 'p25519') {
        prime = new P25519();
      } else {
        throw new Error('Unknown prime ' + name);
      }
      primes[name] = prime;

      return prime;
    };

    //
    // Base reduction engine
    //
    function Red (m) {
      if (typeof m === 'string') {
        var prime = BN._prime(m);
        this.m = prime.p;
        this.prime = prime;
      } else {
        assert(m.gtn(1), 'modulus must be greater than 1');
        this.m = m;
        this.prime = null;
      }
    }

    Red.prototype._verify1 = function _verify1 (a) {
      assert(a.negative === 0, 'red works only with positives');
      assert(a.red, 'red works only with red numbers');
    };

    Red.prototype._verify2 = function _verify2 (a, b) {
      assert((a.negative | b.negative) === 0, 'red works only with positives');
      assert(a.red && a.red === b.red,
        'red works only with red numbers');
    };

    Red.prototype.imod = function imod (a) {
      if (this.prime) return this.prime.ireduce(a)._forceRed(this);
      return a.umod(this.m)._forceRed(this);
    };

    Red.prototype.neg = function neg (a) {
      if (a.isZero()) {
        return a.clone();
      }

      return this.m.sub(a)._forceRed(this);
    };

    Red.prototype.add = function add (a, b) {
      this._verify2(a, b);

      var res = a.add(b);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res._forceRed(this);
    };

    Red.prototype.iadd = function iadd (a, b) {
      this._verify2(a, b);

      var res = a.iadd(b);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res;
    };

    Red.prototype.sub = function sub (a, b) {
      this._verify2(a, b);

      var res = a.sub(b);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res._forceRed(this);
    };

    Red.prototype.isub = function isub (a, b) {
      this._verify2(a, b);

      var res = a.isub(b);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res;
    };

    Red.prototype.shl = function shl (a, num) {
      this._verify1(a);
      return this.imod(a.ushln(num));
    };

    Red.prototype.imul = function imul (a, b) {
      this._verify2(a, b);
      return this.imod(a.imul(b));
    };

    Red.prototype.mul = function mul (a, b) {
      this._verify2(a, b);
      return this.imod(a.mul(b));
    };

    Red.prototype.isqr = function isqr (a) {
      return this.imul(a, a.clone());
    };

    Red.prototype.sqr = function sqr (a) {
      return this.mul(a, a);
    };

    Red.prototype.sqrt = function sqrt (a) {
      if (a.isZero()) return a.clone();

      var mod3 = this.m.andln(3);
      assert(mod3 % 2 === 1);

      // Fast case
      if (mod3 === 3) {
        var pow = this.m.add(new BN(1)).iushrn(2);
        return this.pow(a, pow);
      }

      // Tonelli-Shanks algorithm (Totally unoptimized and slow)
      //
      // Find Q and S, that Q * 2 ^ S = (P - 1)
      var q = this.m.subn(1);
      var s = 0;
      while (!q.isZero() && q.andln(1) === 0) {
        s++;
        q.iushrn(1);
      }
      assert(!q.isZero());

      var one = new BN(1).toRed(this);
      var nOne = one.redNeg();

      // Find quadratic non-residue
      // NOTE: Max is such because of generalized Riemann hypothesis.
      var lpow = this.m.subn(1).iushrn(1);
      var z = this.m.bitLength();
      z = new BN(2 * z * z).toRed(this);

      while (this.pow(z, lpow).cmp(nOne) !== 0) {
        z.redIAdd(nOne);
      }

      var c = this.pow(z, q);
      var r = this.pow(a, q.addn(1).iushrn(1));
      var t = this.pow(a, q);
      var m = s;
      while (t.cmp(one) !== 0) {
        var tmp = t;
        for (var i = 0; tmp.cmp(one) !== 0; i++) {
          tmp = tmp.redSqr();
        }
        assert(i < m);
        var b = this.pow(c, new BN(1).iushln(m - i - 1));

        r = r.redMul(b);
        c = b.redSqr();
        t = t.redMul(c);
        m = i;
      }

      return r;
    };

    Red.prototype.invm = function invm (a) {
      var inv = a._invmp(this.m);
      if (inv.negative !== 0) {
        inv.negative = 0;
        return this.imod(inv).redNeg();
      } else {
        return this.imod(inv);
      }
    };

    Red.prototype.pow = function pow (a, num) {
      if (num.isZero()) return new BN(1).toRed(this);
      if (num.cmpn(1) === 0) return a.clone();

      var windowSize = 4;
      var wnd = new Array(1 << windowSize);
      wnd[0] = new BN(1).toRed(this);
      wnd[1] = a;
      for (var i = 2; i < wnd.length; i++) {
        wnd[i] = this.mul(wnd[i - 1], a);
      }

      var res = wnd[0];
      var current = 0;
      var currentLen = 0;
      var start = num.bitLength() % 26;
      if (start === 0) {
        start = 26;
      }

      for (i = num.length - 1; i >= 0; i--) {
        var word = num.words[i];
        for (var j = start - 1; j >= 0; j--) {
          var bit = (word >> j) & 1;
          if (res !== wnd[0]) {
            res = this.sqr(res);
          }

          if (bit === 0 && current === 0) {
            currentLen = 0;
            continue;
          }

          current <<= 1;
          current |= bit;
          currentLen++;
          if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

          res = this.mul(res, wnd[current]);
          currentLen = 0;
          current = 0;
        }
        start = 26;
      }

      return res;
    };

    Red.prototype.convertTo = function convertTo (num) {
      var r = num.umod(this.m);

      return r === num ? r.clone() : r;
    };

    Red.prototype.convertFrom = function convertFrom (num) {
      var res = num.clone();
      res.red = null;
      return res;
    };

    //
    // Montgomery method engine
    //

    BN.mont = function mont (num) {
      return new Mont(num);
    };

    function Mont (m) {
      Red.call(this, m);

      this.shift = this.m.bitLength();
      if (this.shift % 26 !== 0) {
        this.shift += 26 - (this.shift % 26);
      }

      this.r = new BN(1).iushln(this.shift);
      this.r2 = this.imod(this.r.sqr());
      this.rinv = this.r._invmp(this.m);

      this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
      this.minv = this.minv.umod(this.r);
      this.minv = this.r.sub(this.minv);
    }
    inherits(Mont, Red);

    Mont.prototype.convertTo = function convertTo (num) {
      return this.imod(num.ushln(this.shift));
    };

    Mont.prototype.convertFrom = function convertFrom (num) {
      var r = this.imod(num.mul(this.rinv));
      r.red = null;
      return r;
    };

    Mont.prototype.imul = function imul (a, b) {
      if (a.isZero() || b.isZero()) {
        a.words[0] = 0;
        a.length = 1;
        return a;
      }

      var t = a.imul(b);
      var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u = t.isub(c).iushrn(this.shift);
      var res = u;

      if (u.cmp(this.m) >= 0) {
        res = u.isub(this.m);
      } else if (u.cmpn(0) < 0) {
        res = u.iadd(this.m);
      }

      return res._forceRed(this);
    };

    Mont.prototype.mul = function mul (a, b) {
      if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

      var t = a.mul(b);
      var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u = t.isub(c).iushrn(this.shift);
      var res = u;
      if (u.cmp(this.m) >= 0) {
        res = u.isub(this.m);
      } else if (u.cmpn(0) < 0) {
        res = u.iadd(this.m);
      }

      return res._forceRed(this);
    };

    Mont.prototype.invm = function invm (a) {
      // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
      var res = this.imod(a._invmp(this.m).mul(this.r2));
      return res._forceRed(this);
    };
  })(module, commonjsGlobal);
  });

  var bn$2 = createCommonjsModule(function (module) {
  (function (module, exports) {

    // Utils
    function assert (val, msg) {
      if (!val) throw new Error(msg || 'Assertion failed');
    }

    // Could use `inherits` module, but don't want to move from single file
    // architecture yet.
    function inherits (ctor, superCtor) {
      ctor.super_ = superCtor;
      var TempCtor = function () {};
      TempCtor.prototype = superCtor.prototype;
      ctor.prototype = new TempCtor();
      ctor.prototype.constructor = ctor;
    }

    // BN

    function BN (number, base, endian) {
      if (BN.isBN(number)) {
        return number;
      }

      this.negative = 0;
      this.words = null;
      this.length = 0;

      // Reduction context
      this.red = null;

      if (number !== null) {
        if (base === 'le' || base === 'be') {
          endian = base;
          base = 10;
        }

        this._init(number || 0, base || 10, endian || 'be');
      }
    }
    if (typeof module === 'object') {
      module.exports = BN;
    } else {
      exports.BN = BN;
    }

    BN.BN = BN;
    BN.wordSize = 26;

    var Buffer;
    try {
      Buffer = commonjsRequire('buf' + 'fer').Buffer;
    } catch (e) {
    }

    BN.isBN = function isBN (num) {
      if (num instanceof BN) {
        return true;
      }

      return num !== null && typeof num === 'object' &&
        num.constructor.wordSize === BN.wordSize && Array.isArray(num.words);
    };

    BN.max = function max (left, right) {
      if (left.cmp(right) > 0) return left;
      return right;
    };

    BN.min = function min (left, right) {
      if (left.cmp(right) < 0) return left;
      return right;
    };

    BN.prototype._init = function init (number, base, endian) {
      if (typeof number === 'number') {
        return this._initNumber(number, base, endian);
      }

      if (typeof number === 'object') {
        return this._initArray(number, base, endian);
      }

      if (base === 'hex') {
        base = 16;
      }
      assert(base === (base | 0) && base >= 2 && base <= 36);

      number = number.toString().replace(/\s+/g, '');
      var start = 0;
      if (number[0] === '-') {
        start++;
      }

      if (base === 16) {
        this._parseHex(number, start);
      } else {
        this._parseBase(number, base, start);
      }

      if (number[0] === '-') {
        this.negative = 1;
      }

      this.strip();

      if (endian !== 'le') return;

      this._initArray(this.toArray(), base, endian);
    };

    BN.prototype._initNumber = function _initNumber (number, base, endian) {
      if (number < 0) {
        this.negative = 1;
        number = -number;
      }
      if (number < 0x4000000) {
        this.words = [ number & 0x3ffffff ];
        this.length = 1;
      } else if (number < 0x10000000000000) {
        this.words = [
          number & 0x3ffffff,
          (number / 0x4000000) & 0x3ffffff
        ];
        this.length = 2;
      } else {
        assert(number < 0x20000000000000); // 2 ^ 53 (unsafe)
        this.words = [
          number & 0x3ffffff,
          (number / 0x4000000) & 0x3ffffff,
          1
        ];
        this.length = 3;
      }

      if (endian !== 'le') return;

      // Reverse the bytes
      this._initArray(this.toArray(), base, endian);
    };

    BN.prototype._initArray = function _initArray (number, base, endian) {
      // Perhaps a Uint8Array
      assert(typeof number.length === 'number');
      if (number.length <= 0) {
        this.words = [ 0 ];
        this.length = 1;
        return this;
      }

      this.length = Math.ceil(number.length / 3);
      this.words = new Array(this.length);
      for (var i = 0; i < this.length; i++) {
        this.words[i] = 0;
      }

      var j, w;
      var off = 0;
      if (endian === 'be') {
        for (i = number.length - 1, j = 0; i >= 0; i -= 3) {
          w = number[i] | (number[i - 1] << 8) | (number[i - 2] << 16);
          this.words[j] |= (w << off) & 0x3ffffff;
          this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
      } else if (endian === 'le') {
        for (i = 0, j = 0; i < number.length; i += 3) {
          w = number[i] | (number[i + 1] << 8) | (number[i + 2] << 16);
          this.words[j] |= (w << off) & 0x3ffffff;
          this.words[j + 1] = (w >>> (26 - off)) & 0x3ffffff;
          off += 24;
          if (off >= 26) {
            off -= 26;
            j++;
          }
        }
      }
      return this.strip();
    };

    function parseHex (str, start, end) {
      var r = 0;
      var len = Math.min(str.length, end);
      for (var i = start; i < len; i++) {
        var c = str.charCodeAt(i) - 48;

        r <<= 4;

        // 'a' - 'f'
        if (c >= 49 && c <= 54) {
          r |= c - 49 + 0xa;

        // 'A' - 'F'
        } else if (c >= 17 && c <= 22) {
          r |= c - 17 + 0xa;

        // '0' - '9'
        } else {
          r |= c & 0xf;
        }
      }
      return r;
    }

    BN.prototype._parseHex = function _parseHex (number, start) {
      // Create possibly bigger array to ensure that it fits the number
      this.length = Math.ceil((number.length - start) / 6);
      this.words = new Array(this.length);
      for (var i = 0; i < this.length; i++) {
        this.words[i] = 0;
      }

      var j, w;
      // Scan 24-bit chunks and add them to the number
      var off = 0;
      for (i = number.length - 6, j = 0; i >= start; i -= 6) {
        w = parseHex(number, i, i + 6);
        this.words[j] |= (w << off) & 0x3ffffff;
        // NOTE: `0x3fffff` is intentional here, 26bits max shift + 24bit hex limb
        this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
        off += 24;
        if (off >= 26) {
          off -= 26;
          j++;
        }
      }
      if (i + 6 !== start) {
        w = parseHex(number, start, i + 6);
        this.words[j] |= (w << off) & 0x3ffffff;
        this.words[j + 1] |= w >>> (26 - off) & 0x3fffff;
      }
      this.strip();
    };

    function parseBase (str, start, end, mul) {
      var r = 0;
      var len = Math.min(str.length, end);
      for (var i = start; i < len; i++) {
        var c = str.charCodeAt(i) - 48;

        r *= mul;

        // 'a'
        if (c >= 49) {
          r += c - 49 + 0xa;

        // 'A'
        } else if (c >= 17) {
          r += c - 17 + 0xa;

        // '0' - '9'
        } else {
          r += c;
        }
      }
      return r;
    }

    BN.prototype._parseBase = function _parseBase (number, base, start) {
      // Initialize as zero
      this.words = [ 0 ];
      this.length = 1;

      // Find length of limb in base
      for (var limbLen = 0, limbPow = 1; limbPow <= 0x3ffffff; limbPow *= base) {
        limbLen++;
      }
      limbLen--;
      limbPow = (limbPow / base) | 0;

      var total = number.length - start;
      var mod = total % limbLen;
      var end = Math.min(total, total - mod) + start;

      var word = 0;
      for (var i = start; i < end; i += limbLen) {
        word = parseBase(number, i, i + limbLen, base);

        this.imuln(limbPow);
        if (this.words[0] + word < 0x4000000) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }

      if (mod !== 0) {
        var pow = 1;
        word = parseBase(number, i, number.length, base);

        for (i = 0; i < mod; i++) {
          pow *= base;
        }

        this.imuln(pow);
        if (this.words[0] + word < 0x4000000) {
          this.words[0] += word;
        } else {
          this._iaddn(word);
        }
      }
    };

    BN.prototype.copy = function copy (dest) {
      dest.words = new Array(this.length);
      for (var i = 0; i < this.length; i++) {
        dest.words[i] = this.words[i];
      }
      dest.length = this.length;
      dest.negative = this.negative;
      dest.red = this.red;
    };

    BN.prototype.clone = function clone () {
      var r = new BN(null);
      this.copy(r);
      return r;
    };

    BN.prototype._expand = function _expand (size) {
      while (this.length < size) {
        this.words[this.length++] = 0;
      }
      return this;
    };

    // Remove leading `0` from `this`
    BN.prototype.strip = function strip () {
      while (this.length > 1 && this.words[this.length - 1] === 0) {
        this.length--;
      }
      return this._normSign();
    };

    BN.prototype._normSign = function _normSign () {
      // -0 = 0
      if (this.length === 1 && this.words[0] === 0) {
        this.negative = 0;
      }
      return this;
    };

    BN.prototype.inspect = function inspect () {
      return (this.red ? '<BN-R: ' : '<BN: ') + this.toString(16) + '>';
    };

    /*

    var zeros = [];
    var groupSizes = [];
    var groupBases = [];

    var s = '';
    var i = -1;
    while (++i < BN.wordSize) {
      zeros[i] = s;
      s += '0';
    }
    groupSizes[0] = 0;
    groupSizes[1] = 0;
    groupBases[0] = 0;
    groupBases[1] = 0;
    var base = 2 - 1;
    while (++base < 36 + 1) {
      var groupSize = 0;
      var groupBase = 1;
      while (groupBase < (1 << BN.wordSize) / base) {
        groupBase *= base;
        groupSize += 1;
      }
      groupSizes[base] = groupSize;
      groupBases[base] = groupBase;
    }

    */

    var zeros = [
      '',
      '0',
      '00',
      '000',
      '0000',
      '00000',
      '000000',
      '0000000',
      '00000000',
      '000000000',
      '0000000000',
      '00000000000',
      '000000000000',
      '0000000000000',
      '00000000000000',
      '000000000000000',
      '0000000000000000',
      '00000000000000000',
      '000000000000000000',
      '0000000000000000000',
      '00000000000000000000',
      '000000000000000000000',
      '0000000000000000000000',
      '00000000000000000000000',
      '000000000000000000000000',
      '0000000000000000000000000'
    ];

    var groupSizes = [
      0, 0,
      25, 16, 12, 11, 10, 9, 8,
      8, 7, 7, 7, 7, 6, 6,
      6, 6, 6, 6, 6, 5, 5,
      5, 5, 5, 5, 5, 5, 5,
      5, 5, 5, 5, 5, 5, 5
    ];

    var groupBases = [
      0, 0,
      33554432, 43046721, 16777216, 48828125, 60466176, 40353607, 16777216,
      43046721, 10000000, 19487171, 35831808, 62748517, 7529536, 11390625,
      16777216, 24137569, 34012224, 47045881, 64000000, 4084101, 5153632,
      6436343, 7962624, 9765625, 11881376, 14348907, 17210368, 20511149,
      24300000, 28629151, 33554432, 39135393, 45435424, 52521875, 60466176
    ];

    BN.prototype.toString = function toString (base, padding) {
      base = base || 10;
      padding = padding | 0 || 1;

      var out;
      if (base === 16 || base === 'hex') {
        out = '';
        var off = 0;
        var carry = 0;
        for (var i = 0; i < this.length; i++) {
          var w = this.words[i];
          var word = (((w << off) | carry) & 0xffffff).toString(16);
          carry = (w >>> (24 - off)) & 0xffffff;
          if (carry !== 0 || i !== this.length - 1) {
            out = zeros[6 - word.length] + word + out;
          } else {
            out = word + out;
          }
          off += 2;
          if (off >= 26) {
            off -= 26;
            i--;
          }
        }
        if (carry !== 0) {
          out = carry.toString(16) + out;
        }
        while (out.length % padding !== 0) {
          out = '0' + out;
        }
        if (this.negative !== 0) {
          out = '-' + out;
        }
        return out;
      }

      if (base === (base | 0) && base >= 2 && base <= 36) {
        // var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
        var groupSize = groupSizes[base];
        // var groupBase = Math.pow(base, groupSize);
        var groupBase = groupBases[base];
        out = '';
        var c = this.clone();
        c.negative = 0;
        while (!c.isZero()) {
          var r = c.modn(groupBase).toString(base);
          c = c.idivn(groupBase);

          if (!c.isZero()) {
            out = zeros[groupSize - r.length] + r + out;
          } else {
            out = r + out;
          }
        }
        if (this.isZero()) {
          out = '0' + out;
        }
        while (out.length % padding !== 0) {
          out = '0' + out;
        }
        if (this.negative !== 0) {
          out = '-' + out;
        }
        return out;
      }

      assert(false, 'Base should be between 2 and 36');
    };

    BN.prototype.toNumber = function toNumber () {
      var ret = this.words[0];
      if (this.length === 2) {
        ret += this.words[1] * 0x4000000;
      } else if (this.length === 3 && this.words[2] === 0x01) {
        // NOTE: at this stage it is known that the top bit is set
        ret += 0x10000000000000 + (this.words[1] * 0x4000000);
      } else if (this.length > 2) {
        assert(false, 'Number can only safely store up to 53 bits');
      }
      return (this.negative !== 0) ? -ret : ret;
    };

    BN.prototype.toJSON = function toJSON () {
      return this.toString(16);
    };

    BN.prototype.toBuffer = function toBuffer (endian, length) {
      assert(typeof Buffer !== 'undefined');
      return this.toArrayLike(Buffer, endian, length);
    };

    BN.prototype.toArray = function toArray (endian, length) {
      return this.toArrayLike(Array, endian, length);
    };

    BN.prototype.toArrayLike = function toArrayLike (ArrayType, endian, length) {
      var byteLength = this.byteLength();
      var reqLength = length || Math.max(1, byteLength);
      assert(byteLength <= reqLength, 'byte array longer than desired length');
      assert(reqLength > 0, 'Requested array length <= 0');

      this.strip();
      var littleEndian = endian === 'le';
      var res = new ArrayType(reqLength);

      var b, i;
      var q = this.clone();
      if (!littleEndian) {
        // Assume big-endian
        for (i = 0; i < reqLength - byteLength; i++) {
          res[i] = 0;
        }

        for (i = 0; !q.isZero(); i++) {
          b = q.andln(0xff);
          q.iushrn(8);

          res[reqLength - i - 1] = b;
        }
      } else {
        for (i = 0; !q.isZero(); i++) {
          b = q.andln(0xff);
          q.iushrn(8);

          res[i] = b;
        }

        for (; i < reqLength; i++) {
          res[i] = 0;
        }
      }

      return res;
    };

    if (Math.clz32) {
      BN.prototype._countBits = function _countBits (w) {
        return 32 - Math.clz32(w);
      };
    } else {
      BN.prototype._countBits = function _countBits (w) {
        var t = w;
        var r = 0;
        if (t >= 0x1000) {
          r += 13;
          t >>>= 13;
        }
        if (t >= 0x40) {
          r += 7;
          t >>>= 7;
        }
        if (t >= 0x8) {
          r += 4;
          t >>>= 4;
        }
        if (t >= 0x02) {
          r += 2;
          t >>>= 2;
        }
        return r + t;
      };
    }

    BN.prototype._zeroBits = function _zeroBits (w) {
      // Short-cut
      if (w === 0) return 26;

      var t = w;
      var r = 0;
      if ((t & 0x1fff) === 0) {
        r += 13;
        t >>>= 13;
      }
      if ((t & 0x7f) === 0) {
        r += 7;
        t >>>= 7;
      }
      if ((t & 0xf) === 0) {
        r += 4;
        t >>>= 4;
      }
      if ((t & 0x3) === 0) {
        r += 2;
        t >>>= 2;
      }
      if ((t & 0x1) === 0) {
        r++;
      }
      return r;
    };

    // Return number of used bits in a BN
    BN.prototype.bitLength = function bitLength () {
      var w = this.words[this.length - 1];
      var hi = this._countBits(w);
      return (this.length - 1) * 26 + hi;
    };

    function toBitArray (num) {
      var w = new Array(num.bitLength());

      for (var bit = 0; bit < w.length; bit++) {
        var off = (bit / 26) | 0;
        var wbit = bit % 26;

        w[bit] = (num.words[off] & (1 << wbit)) >>> wbit;
      }

      return w;
    }

    // Number of trailing zero bits
    BN.prototype.zeroBits = function zeroBits () {
      if (this.isZero()) return 0;

      var r = 0;
      for (var i = 0; i < this.length; i++) {
        var b = this._zeroBits(this.words[i]);
        r += b;
        if (b !== 26) break;
      }
      return r;
    };

    BN.prototype.byteLength = function byteLength () {
      return Math.ceil(this.bitLength() / 8);
    };

    BN.prototype.toTwos = function toTwos (width) {
      if (this.negative !== 0) {
        return this.abs().inotn(width).iaddn(1);
      }
      return this.clone();
    };

    BN.prototype.fromTwos = function fromTwos (width) {
      if (this.testn(width - 1)) {
        return this.notn(width).iaddn(1).ineg();
      }
      return this.clone();
    };

    BN.prototype.isNeg = function isNeg () {
      return this.negative !== 0;
    };

    // Return negative clone of `this`
    BN.prototype.neg = function neg () {
      return this.clone().ineg();
    };

    BN.prototype.ineg = function ineg () {
      if (!this.isZero()) {
        this.negative ^= 1;
      }

      return this;
    };

    // Or `num` with `this` in-place
    BN.prototype.iuor = function iuor (num) {
      while (this.length < num.length) {
        this.words[this.length++] = 0;
      }

      for (var i = 0; i < num.length; i++) {
        this.words[i] = this.words[i] | num.words[i];
      }

      return this.strip();
    };

    BN.prototype.ior = function ior (num) {
      assert((this.negative | num.negative) === 0);
      return this.iuor(num);
    };

    // Or `num` with `this`
    BN.prototype.or = function or (num) {
      if (this.length > num.length) return this.clone().ior(num);
      return num.clone().ior(this);
    };

    BN.prototype.uor = function uor (num) {
      if (this.length > num.length) return this.clone().iuor(num);
      return num.clone().iuor(this);
    };

    // And `num` with `this` in-place
    BN.prototype.iuand = function iuand (num) {
      // b = min-length(num, this)
      var b;
      if (this.length > num.length) {
        b = num;
      } else {
        b = this;
      }

      for (var i = 0; i < b.length; i++) {
        this.words[i] = this.words[i] & num.words[i];
      }

      this.length = b.length;

      return this.strip();
    };

    BN.prototype.iand = function iand (num) {
      assert((this.negative | num.negative) === 0);
      return this.iuand(num);
    };

    // And `num` with `this`
    BN.prototype.and = function and (num) {
      if (this.length > num.length) return this.clone().iand(num);
      return num.clone().iand(this);
    };

    BN.prototype.uand = function uand (num) {
      if (this.length > num.length) return this.clone().iuand(num);
      return num.clone().iuand(this);
    };

    // Xor `num` with `this` in-place
    BN.prototype.iuxor = function iuxor (num) {
      // a.length > b.length
      var a;
      var b;
      if (this.length > num.length) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }

      for (var i = 0; i < b.length; i++) {
        this.words[i] = a.words[i] ^ b.words[i];
      }

      if (this !== a) {
        for (; i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }

      this.length = a.length;

      return this.strip();
    };

    BN.prototype.ixor = function ixor (num) {
      assert((this.negative | num.negative) === 0);
      return this.iuxor(num);
    };

    // Xor `num` with `this`
    BN.prototype.xor = function xor (num) {
      if (this.length > num.length) return this.clone().ixor(num);
      return num.clone().ixor(this);
    };

    BN.prototype.uxor = function uxor (num) {
      if (this.length > num.length) return this.clone().iuxor(num);
      return num.clone().iuxor(this);
    };

    // Not ``this`` with ``width`` bitwidth
    BN.prototype.inotn = function inotn (width) {
      assert(typeof width === 'number' && width >= 0);

      var bytesNeeded = Math.ceil(width / 26) | 0;
      var bitsLeft = width % 26;

      // Extend the buffer with leading zeroes
      this._expand(bytesNeeded);

      if (bitsLeft > 0) {
        bytesNeeded--;
      }

      // Handle complete words
      for (var i = 0; i < bytesNeeded; i++) {
        this.words[i] = ~this.words[i] & 0x3ffffff;
      }

      // Handle the residue
      if (bitsLeft > 0) {
        this.words[i] = ~this.words[i] & (0x3ffffff >> (26 - bitsLeft));
      }

      // And remove leading zeroes
      return this.strip();
    };

    BN.prototype.notn = function notn (width) {
      return this.clone().inotn(width);
    };

    // Set `bit` of `this`
    BN.prototype.setn = function setn (bit, val) {
      assert(typeof bit === 'number' && bit >= 0);

      var off = (bit / 26) | 0;
      var wbit = bit % 26;

      this._expand(off + 1);

      if (val) {
        this.words[off] = this.words[off] | (1 << wbit);
      } else {
        this.words[off] = this.words[off] & ~(1 << wbit);
      }

      return this.strip();
    };

    // Add `num` to `this` in-place
    BN.prototype.iadd = function iadd (num) {
      var r;

      // negative + positive
      if (this.negative !== 0 && num.negative === 0) {
        this.negative = 0;
        r = this.isub(num);
        this.negative ^= 1;
        return this._normSign();

      // positive + negative
      } else if (this.negative === 0 && num.negative !== 0) {
        num.negative = 0;
        r = this.isub(num);
        num.negative = 1;
        return r._normSign();
      }

      // a.length > b.length
      var a, b;
      if (this.length > num.length) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }

      var carry = 0;
      for (var i = 0; i < b.length; i++) {
        r = (a.words[i] | 0) + (b.words[i] | 0) + carry;
        this.words[i] = r & 0x3ffffff;
        carry = r >>> 26;
      }
      for (; carry !== 0 && i < a.length; i++) {
        r = (a.words[i] | 0) + carry;
        this.words[i] = r & 0x3ffffff;
        carry = r >>> 26;
      }

      this.length = a.length;
      if (carry !== 0) {
        this.words[this.length] = carry;
        this.length++;
      // Copy the rest of the words
      } else if (a !== this) {
        for (; i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }

      return this;
    };

    // Add `num` to `this`
    BN.prototype.add = function add (num) {
      var res;
      if (num.negative !== 0 && this.negative === 0) {
        num.negative = 0;
        res = this.sub(num);
        num.negative ^= 1;
        return res;
      } else if (num.negative === 0 && this.negative !== 0) {
        this.negative = 0;
        res = num.sub(this);
        this.negative = 1;
        return res;
      }

      if (this.length > num.length) return this.clone().iadd(num);

      return num.clone().iadd(this);
    };

    // Subtract `num` from `this` in-place
    BN.prototype.isub = function isub (num) {
      // this - (-num) = this + num
      if (num.negative !== 0) {
        num.negative = 0;
        var r = this.iadd(num);
        num.negative = 1;
        return r._normSign();

      // -this - num = -(this + num)
      } else if (this.negative !== 0) {
        this.negative = 0;
        this.iadd(num);
        this.negative = 1;
        return this._normSign();
      }

      // At this point both numbers are positive
      var cmp = this.cmp(num);

      // Optimization - zeroify
      if (cmp === 0) {
        this.negative = 0;
        this.length = 1;
        this.words[0] = 0;
        return this;
      }

      // a > b
      var a, b;
      if (cmp > 0) {
        a = this;
        b = num;
      } else {
        a = num;
        b = this;
      }

      var carry = 0;
      for (var i = 0; i < b.length; i++) {
        r = (a.words[i] | 0) - (b.words[i] | 0) + carry;
        carry = r >> 26;
        this.words[i] = r & 0x3ffffff;
      }
      for (; carry !== 0 && i < a.length; i++) {
        r = (a.words[i] | 0) + carry;
        carry = r >> 26;
        this.words[i] = r & 0x3ffffff;
      }

      // Copy rest of the words
      if (carry === 0 && i < a.length && a !== this) {
        for (; i < a.length; i++) {
          this.words[i] = a.words[i];
        }
      }

      this.length = Math.max(this.length, i);

      if (a !== this) {
        this.negative = 1;
      }

      return this.strip();
    };

    // Subtract `num` from `this`
    BN.prototype.sub = function sub (num) {
      return this.clone().isub(num);
    };

    function smallMulTo (self, num, out) {
      out.negative = num.negative ^ self.negative;
      var len = (self.length + num.length) | 0;
      out.length = len;
      len = (len - 1) | 0;

      // Peel one iteration (compiler can't do it, because of code complexity)
      var a = self.words[0] | 0;
      var b = num.words[0] | 0;
      var r = a * b;

      var lo = r & 0x3ffffff;
      var carry = (r / 0x4000000) | 0;
      out.words[0] = lo;

      for (var k = 1; k < len; k++) {
        // Sum all words with the same `i + j = k` and accumulate `ncarry`,
        // note that ncarry could be >= 0x3ffffff
        var ncarry = carry >>> 26;
        var rword = carry & 0x3ffffff;
        var maxJ = Math.min(k, num.length - 1);
        for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
          var i = (k - j) | 0;
          a = self.words[i] | 0;
          b = num.words[j] | 0;
          r = a * b + rword;
          ncarry += (r / 0x4000000) | 0;
          rword = r & 0x3ffffff;
        }
        out.words[k] = rword | 0;
        carry = ncarry | 0;
      }
      if (carry !== 0) {
        out.words[k] = carry | 0;
      } else {
        out.length--;
      }

      return out.strip();
    }

    // TODO(indutny): it may be reasonable to omit it for users who don't need
    // to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
    // multiplication (like elliptic secp256k1).
    var comb10MulTo = function comb10MulTo (self, num, out) {
      var a = self.words;
      var b = num.words;
      var o = out.words;
      var c = 0;
      var lo;
      var mid;
      var hi;
      var a0 = a[0] | 0;
      var al0 = a0 & 0x1fff;
      var ah0 = a0 >>> 13;
      var a1 = a[1] | 0;
      var al1 = a1 & 0x1fff;
      var ah1 = a1 >>> 13;
      var a2 = a[2] | 0;
      var al2 = a2 & 0x1fff;
      var ah2 = a2 >>> 13;
      var a3 = a[3] | 0;
      var al3 = a3 & 0x1fff;
      var ah3 = a3 >>> 13;
      var a4 = a[4] | 0;
      var al4 = a4 & 0x1fff;
      var ah4 = a4 >>> 13;
      var a5 = a[5] | 0;
      var al5 = a5 & 0x1fff;
      var ah5 = a5 >>> 13;
      var a6 = a[6] | 0;
      var al6 = a6 & 0x1fff;
      var ah6 = a6 >>> 13;
      var a7 = a[7] | 0;
      var al7 = a7 & 0x1fff;
      var ah7 = a7 >>> 13;
      var a8 = a[8] | 0;
      var al8 = a8 & 0x1fff;
      var ah8 = a8 >>> 13;
      var a9 = a[9] | 0;
      var al9 = a9 & 0x1fff;
      var ah9 = a9 >>> 13;
      var b0 = b[0] | 0;
      var bl0 = b0 & 0x1fff;
      var bh0 = b0 >>> 13;
      var b1 = b[1] | 0;
      var bl1 = b1 & 0x1fff;
      var bh1 = b1 >>> 13;
      var b2 = b[2] | 0;
      var bl2 = b2 & 0x1fff;
      var bh2 = b2 >>> 13;
      var b3 = b[3] | 0;
      var bl3 = b3 & 0x1fff;
      var bh3 = b3 >>> 13;
      var b4 = b[4] | 0;
      var bl4 = b4 & 0x1fff;
      var bh4 = b4 >>> 13;
      var b5 = b[5] | 0;
      var bl5 = b5 & 0x1fff;
      var bh5 = b5 >>> 13;
      var b6 = b[6] | 0;
      var bl6 = b6 & 0x1fff;
      var bh6 = b6 >>> 13;
      var b7 = b[7] | 0;
      var bl7 = b7 & 0x1fff;
      var bh7 = b7 >>> 13;
      var b8 = b[8] | 0;
      var bl8 = b8 & 0x1fff;
      var bh8 = b8 >>> 13;
      var b9 = b[9] | 0;
      var bl9 = b9 & 0x1fff;
      var bh9 = b9 >>> 13;

      out.negative = self.negative ^ num.negative;
      out.length = 19;
      /* k = 0 */
      lo = Math.imul(al0, bl0);
      mid = Math.imul(al0, bh0);
      mid = (mid + Math.imul(ah0, bl0)) | 0;
      hi = Math.imul(ah0, bh0);
      var w0 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w0 >>> 26)) | 0;
      w0 &= 0x3ffffff;
      /* k = 1 */
      lo = Math.imul(al1, bl0);
      mid = Math.imul(al1, bh0);
      mid = (mid + Math.imul(ah1, bl0)) | 0;
      hi = Math.imul(ah1, bh0);
      lo = (lo + Math.imul(al0, bl1)) | 0;
      mid = (mid + Math.imul(al0, bh1)) | 0;
      mid = (mid + Math.imul(ah0, bl1)) | 0;
      hi = (hi + Math.imul(ah0, bh1)) | 0;
      var w1 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w1 >>> 26)) | 0;
      w1 &= 0x3ffffff;
      /* k = 2 */
      lo = Math.imul(al2, bl0);
      mid = Math.imul(al2, bh0);
      mid = (mid + Math.imul(ah2, bl0)) | 0;
      hi = Math.imul(ah2, bh0);
      lo = (lo + Math.imul(al1, bl1)) | 0;
      mid = (mid + Math.imul(al1, bh1)) | 0;
      mid = (mid + Math.imul(ah1, bl1)) | 0;
      hi = (hi + Math.imul(ah1, bh1)) | 0;
      lo = (lo + Math.imul(al0, bl2)) | 0;
      mid = (mid + Math.imul(al0, bh2)) | 0;
      mid = (mid + Math.imul(ah0, bl2)) | 0;
      hi = (hi + Math.imul(ah0, bh2)) | 0;
      var w2 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w2 >>> 26)) | 0;
      w2 &= 0x3ffffff;
      /* k = 3 */
      lo = Math.imul(al3, bl0);
      mid = Math.imul(al3, bh0);
      mid = (mid + Math.imul(ah3, bl0)) | 0;
      hi = Math.imul(ah3, bh0);
      lo = (lo + Math.imul(al2, bl1)) | 0;
      mid = (mid + Math.imul(al2, bh1)) | 0;
      mid = (mid + Math.imul(ah2, bl1)) | 0;
      hi = (hi + Math.imul(ah2, bh1)) | 0;
      lo = (lo + Math.imul(al1, bl2)) | 0;
      mid = (mid + Math.imul(al1, bh2)) | 0;
      mid = (mid + Math.imul(ah1, bl2)) | 0;
      hi = (hi + Math.imul(ah1, bh2)) | 0;
      lo = (lo + Math.imul(al0, bl3)) | 0;
      mid = (mid + Math.imul(al0, bh3)) | 0;
      mid = (mid + Math.imul(ah0, bl3)) | 0;
      hi = (hi + Math.imul(ah0, bh3)) | 0;
      var w3 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w3 >>> 26)) | 0;
      w3 &= 0x3ffffff;
      /* k = 4 */
      lo = Math.imul(al4, bl0);
      mid = Math.imul(al4, bh0);
      mid = (mid + Math.imul(ah4, bl0)) | 0;
      hi = Math.imul(ah4, bh0);
      lo = (lo + Math.imul(al3, bl1)) | 0;
      mid = (mid + Math.imul(al3, bh1)) | 0;
      mid = (mid + Math.imul(ah3, bl1)) | 0;
      hi = (hi + Math.imul(ah3, bh1)) | 0;
      lo = (lo + Math.imul(al2, bl2)) | 0;
      mid = (mid + Math.imul(al2, bh2)) | 0;
      mid = (mid + Math.imul(ah2, bl2)) | 0;
      hi = (hi + Math.imul(ah2, bh2)) | 0;
      lo = (lo + Math.imul(al1, bl3)) | 0;
      mid = (mid + Math.imul(al1, bh3)) | 0;
      mid = (mid + Math.imul(ah1, bl3)) | 0;
      hi = (hi + Math.imul(ah1, bh3)) | 0;
      lo = (lo + Math.imul(al0, bl4)) | 0;
      mid = (mid + Math.imul(al0, bh4)) | 0;
      mid = (mid + Math.imul(ah0, bl4)) | 0;
      hi = (hi + Math.imul(ah0, bh4)) | 0;
      var w4 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w4 >>> 26)) | 0;
      w4 &= 0x3ffffff;
      /* k = 5 */
      lo = Math.imul(al5, bl0);
      mid = Math.imul(al5, bh0);
      mid = (mid + Math.imul(ah5, bl0)) | 0;
      hi = Math.imul(ah5, bh0);
      lo = (lo + Math.imul(al4, bl1)) | 0;
      mid = (mid + Math.imul(al4, bh1)) | 0;
      mid = (mid + Math.imul(ah4, bl1)) | 0;
      hi = (hi + Math.imul(ah4, bh1)) | 0;
      lo = (lo + Math.imul(al3, bl2)) | 0;
      mid = (mid + Math.imul(al3, bh2)) | 0;
      mid = (mid + Math.imul(ah3, bl2)) | 0;
      hi = (hi + Math.imul(ah3, bh2)) | 0;
      lo = (lo + Math.imul(al2, bl3)) | 0;
      mid = (mid + Math.imul(al2, bh3)) | 0;
      mid = (mid + Math.imul(ah2, bl3)) | 0;
      hi = (hi + Math.imul(ah2, bh3)) | 0;
      lo = (lo + Math.imul(al1, bl4)) | 0;
      mid = (mid + Math.imul(al1, bh4)) | 0;
      mid = (mid + Math.imul(ah1, bl4)) | 0;
      hi = (hi + Math.imul(ah1, bh4)) | 0;
      lo = (lo + Math.imul(al0, bl5)) | 0;
      mid = (mid + Math.imul(al0, bh5)) | 0;
      mid = (mid + Math.imul(ah0, bl5)) | 0;
      hi = (hi + Math.imul(ah0, bh5)) | 0;
      var w5 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w5 >>> 26)) | 0;
      w5 &= 0x3ffffff;
      /* k = 6 */
      lo = Math.imul(al6, bl0);
      mid = Math.imul(al6, bh0);
      mid = (mid + Math.imul(ah6, bl0)) | 0;
      hi = Math.imul(ah6, bh0);
      lo = (lo + Math.imul(al5, bl1)) | 0;
      mid = (mid + Math.imul(al5, bh1)) | 0;
      mid = (mid + Math.imul(ah5, bl1)) | 0;
      hi = (hi + Math.imul(ah5, bh1)) | 0;
      lo = (lo + Math.imul(al4, bl2)) | 0;
      mid = (mid + Math.imul(al4, bh2)) | 0;
      mid = (mid + Math.imul(ah4, bl2)) | 0;
      hi = (hi + Math.imul(ah4, bh2)) | 0;
      lo = (lo + Math.imul(al3, bl3)) | 0;
      mid = (mid + Math.imul(al3, bh3)) | 0;
      mid = (mid + Math.imul(ah3, bl3)) | 0;
      hi = (hi + Math.imul(ah3, bh3)) | 0;
      lo = (lo + Math.imul(al2, bl4)) | 0;
      mid = (mid + Math.imul(al2, bh4)) | 0;
      mid = (mid + Math.imul(ah2, bl4)) | 0;
      hi = (hi + Math.imul(ah2, bh4)) | 0;
      lo = (lo + Math.imul(al1, bl5)) | 0;
      mid = (mid + Math.imul(al1, bh5)) | 0;
      mid = (mid + Math.imul(ah1, bl5)) | 0;
      hi = (hi + Math.imul(ah1, bh5)) | 0;
      lo = (lo + Math.imul(al0, bl6)) | 0;
      mid = (mid + Math.imul(al0, bh6)) | 0;
      mid = (mid + Math.imul(ah0, bl6)) | 0;
      hi = (hi + Math.imul(ah0, bh6)) | 0;
      var w6 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w6 >>> 26)) | 0;
      w6 &= 0x3ffffff;
      /* k = 7 */
      lo = Math.imul(al7, bl0);
      mid = Math.imul(al7, bh0);
      mid = (mid + Math.imul(ah7, bl0)) | 0;
      hi = Math.imul(ah7, bh0);
      lo = (lo + Math.imul(al6, bl1)) | 0;
      mid = (mid + Math.imul(al6, bh1)) | 0;
      mid = (mid + Math.imul(ah6, bl1)) | 0;
      hi = (hi + Math.imul(ah6, bh1)) | 0;
      lo = (lo + Math.imul(al5, bl2)) | 0;
      mid = (mid + Math.imul(al5, bh2)) | 0;
      mid = (mid + Math.imul(ah5, bl2)) | 0;
      hi = (hi + Math.imul(ah5, bh2)) | 0;
      lo = (lo + Math.imul(al4, bl3)) | 0;
      mid = (mid + Math.imul(al4, bh3)) | 0;
      mid = (mid + Math.imul(ah4, bl3)) | 0;
      hi = (hi + Math.imul(ah4, bh3)) | 0;
      lo = (lo + Math.imul(al3, bl4)) | 0;
      mid = (mid + Math.imul(al3, bh4)) | 0;
      mid = (mid + Math.imul(ah3, bl4)) | 0;
      hi = (hi + Math.imul(ah3, bh4)) | 0;
      lo = (lo + Math.imul(al2, bl5)) | 0;
      mid = (mid + Math.imul(al2, bh5)) | 0;
      mid = (mid + Math.imul(ah2, bl5)) | 0;
      hi = (hi + Math.imul(ah2, bh5)) | 0;
      lo = (lo + Math.imul(al1, bl6)) | 0;
      mid = (mid + Math.imul(al1, bh6)) | 0;
      mid = (mid + Math.imul(ah1, bl6)) | 0;
      hi = (hi + Math.imul(ah1, bh6)) | 0;
      lo = (lo + Math.imul(al0, bl7)) | 0;
      mid = (mid + Math.imul(al0, bh7)) | 0;
      mid = (mid + Math.imul(ah0, bl7)) | 0;
      hi = (hi + Math.imul(ah0, bh7)) | 0;
      var w7 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w7 >>> 26)) | 0;
      w7 &= 0x3ffffff;
      /* k = 8 */
      lo = Math.imul(al8, bl0);
      mid = Math.imul(al8, bh0);
      mid = (mid + Math.imul(ah8, bl0)) | 0;
      hi = Math.imul(ah8, bh0);
      lo = (lo + Math.imul(al7, bl1)) | 0;
      mid = (mid + Math.imul(al7, bh1)) | 0;
      mid = (mid + Math.imul(ah7, bl1)) | 0;
      hi = (hi + Math.imul(ah7, bh1)) | 0;
      lo = (lo + Math.imul(al6, bl2)) | 0;
      mid = (mid + Math.imul(al6, bh2)) | 0;
      mid = (mid + Math.imul(ah6, bl2)) | 0;
      hi = (hi + Math.imul(ah6, bh2)) | 0;
      lo = (lo + Math.imul(al5, bl3)) | 0;
      mid = (mid + Math.imul(al5, bh3)) | 0;
      mid = (mid + Math.imul(ah5, bl3)) | 0;
      hi = (hi + Math.imul(ah5, bh3)) | 0;
      lo = (lo + Math.imul(al4, bl4)) | 0;
      mid = (mid + Math.imul(al4, bh4)) | 0;
      mid = (mid + Math.imul(ah4, bl4)) | 0;
      hi = (hi + Math.imul(ah4, bh4)) | 0;
      lo = (lo + Math.imul(al3, bl5)) | 0;
      mid = (mid + Math.imul(al3, bh5)) | 0;
      mid = (mid + Math.imul(ah3, bl5)) | 0;
      hi = (hi + Math.imul(ah3, bh5)) | 0;
      lo = (lo + Math.imul(al2, bl6)) | 0;
      mid = (mid + Math.imul(al2, bh6)) | 0;
      mid = (mid + Math.imul(ah2, bl6)) | 0;
      hi = (hi + Math.imul(ah2, bh6)) | 0;
      lo = (lo + Math.imul(al1, bl7)) | 0;
      mid = (mid + Math.imul(al1, bh7)) | 0;
      mid = (mid + Math.imul(ah1, bl7)) | 0;
      hi = (hi + Math.imul(ah1, bh7)) | 0;
      lo = (lo + Math.imul(al0, bl8)) | 0;
      mid = (mid + Math.imul(al0, bh8)) | 0;
      mid = (mid + Math.imul(ah0, bl8)) | 0;
      hi = (hi + Math.imul(ah0, bh8)) | 0;
      var w8 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w8 >>> 26)) | 0;
      w8 &= 0x3ffffff;
      /* k = 9 */
      lo = Math.imul(al9, bl0);
      mid = Math.imul(al9, bh0);
      mid = (mid + Math.imul(ah9, bl0)) | 0;
      hi = Math.imul(ah9, bh0);
      lo = (lo + Math.imul(al8, bl1)) | 0;
      mid = (mid + Math.imul(al8, bh1)) | 0;
      mid = (mid + Math.imul(ah8, bl1)) | 0;
      hi = (hi + Math.imul(ah8, bh1)) | 0;
      lo = (lo + Math.imul(al7, bl2)) | 0;
      mid = (mid + Math.imul(al7, bh2)) | 0;
      mid = (mid + Math.imul(ah7, bl2)) | 0;
      hi = (hi + Math.imul(ah7, bh2)) | 0;
      lo = (lo + Math.imul(al6, bl3)) | 0;
      mid = (mid + Math.imul(al6, bh3)) | 0;
      mid = (mid + Math.imul(ah6, bl3)) | 0;
      hi = (hi + Math.imul(ah6, bh3)) | 0;
      lo = (lo + Math.imul(al5, bl4)) | 0;
      mid = (mid + Math.imul(al5, bh4)) | 0;
      mid = (mid + Math.imul(ah5, bl4)) | 0;
      hi = (hi + Math.imul(ah5, bh4)) | 0;
      lo = (lo + Math.imul(al4, bl5)) | 0;
      mid = (mid + Math.imul(al4, bh5)) | 0;
      mid = (mid + Math.imul(ah4, bl5)) | 0;
      hi = (hi + Math.imul(ah4, bh5)) | 0;
      lo = (lo + Math.imul(al3, bl6)) | 0;
      mid = (mid + Math.imul(al3, bh6)) | 0;
      mid = (mid + Math.imul(ah3, bl6)) | 0;
      hi = (hi + Math.imul(ah3, bh6)) | 0;
      lo = (lo + Math.imul(al2, bl7)) | 0;
      mid = (mid + Math.imul(al2, bh7)) | 0;
      mid = (mid + Math.imul(ah2, bl7)) | 0;
      hi = (hi + Math.imul(ah2, bh7)) | 0;
      lo = (lo + Math.imul(al1, bl8)) | 0;
      mid = (mid + Math.imul(al1, bh8)) | 0;
      mid = (mid + Math.imul(ah1, bl8)) | 0;
      hi = (hi + Math.imul(ah1, bh8)) | 0;
      lo = (lo + Math.imul(al0, bl9)) | 0;
      mid = (mid + Math.imul(al0, bh9)) | 0;
      mid = (mid + Math.imul(ah0, bl9)) | 0;
      hi = (hi + Math.imul(ah0, bh9)) | 0;
      var w9 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w9 >>> 26)) | 0;
      w9 &= 0x3ffffff;
      /* k = 10 */
      lo = Math.imul(al9, bl1);
      mid = Math.imul(al9, bh1);
      mid = (mid + Math.imul(ah9, bl1)) | 0;
      hi = Math.imul(ah9, bh1);
      lo = (lo + Math.imul(al8, bl2)) | 0;
      mid = (mid + Math.imul(al8, bh2)) | 0;
      mid = (mid + Math.imul(ah8, bl2)) | 0;
      hi = (hi + Math.imul(ah8, bh2)) | 0;
      lo = (lo + Math.imul(al7, bl3)) | 0;
      mid = (mid + Math.imul(al7, bh3)) | 0;
      mid = (mid + Math.imul(ah7, bl3)) | 0;
      hi = (hi + Math.imul(ah7, bh3)) | 0;
      lo = (lo + Math.imul(al6, bl4)) | 0;
      mid = (mid + Math.imul(al6, bh4)) | 0;
      mid = (mid + Math.imul(ah6, bl4)) | 0;
      hi = (hi + Math.imul(ah6, bh4)) | 0;
      lo = (lo + Math.imul(al5, bl5)) | 0;
      mid = (mid + Math.imul(al5, bh5)) | 0;
      mid = (mid + Math.imul(ah5, bl5)) | 0;
      hi = (hi + Math.imul(ah5, bh5)) | 0;
      lo = (lo + Math.imul(al4, bl6)) | 0;
      mid = (mid + Math.imul(al4, bh6)) | 0;
      mid = (mid + Math.imul(ah4, bl6)) | 0;
      hi = (hi + Math.imul(ah4, bh6)) | 0;
      lo = (lo + Math.imul(al3, bl7)) | 0;
      mid = (mid + Math.imul(al3, bh7)) | 0;
      mid = (mid + Math.imul(ah3, bl7)) | 0;
      hi = (hi + Math.imul(ah3, bh7)) | 0;
      lo = (lo + Math.imul(al2, bl8)) | 0;
      mid = (mid + Math.imul(al2, bh8)) | 0;
      mid = (mid + Math.imul(ah2, bl8)) | 0;
      hi = (hi + Math.imul(ah2, bh8)) | 0;
      lo = (lo + Math.imul(al1, bl9)) | 0;
      mid = (mid + Math.imul(al1, bh9)) | 0;
      mid = (mid + Math.imul(ah1, bl9)) | 0;
      hi = (hi + Math.imul(ah1, bh9)) | 0;
      var w10 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w10 >>> 26)) | 0;
      w10 &= 0x3ffffff;
      /* k = 11 */
      lo = Math.imul(al9, bl2);
      mid = Math.imul(al9, bh2);
      mid = (mid + Math.imul(ah9, bl2)) | 0;
      hi = Math.imul(ah9, bh2);
      lo = (lo + Math.imul(al8, bl3)) | 0;
      mid = (mid + Math.imul(al8, bh3)) | 0;
      mid = (mid + Math.imul(ah8, bl3)) | 0;
      hi = (hi + Math.imul(ah8, bh3)) | 0;
      lo = (lo + Math.imul(al7, bl4)) | 0;
      mid = (mid + Math.imul(al7, bh4)) | 0;
      mid = (mid + Math.imul(ah7, bl4)) | 0;
      hi = (hi + Math.imul(ah7, bh4)) | 0;
      lo = (lo + Math.imul(al6, bl5)) | 0;
      mid = (mid + Math.imul(al6, bh5)) | 0;
      mid = (mid + Math.imul(ah6, bl5)) | 0;
      hi = (hi + Math.imul(ah6, bh5)) | 0;
      lo = (lo + Math.imul(al5, bl6)) | 0;
      mid = (mid + Math.imul(al5, bh6)) | 0;
      mid = (mid + Math.imul(ah5, bl6)) | 0;
      hi = (hi + Math.imul(ah5, bh6)) | 0;
      lo = (lo + Math.imul(al4, bl7)) | 0;
      mid = (mid + Math.imul(al4, bh7)) | 0;
      mid = (mid + Math.imul(ah4, bl7)) | 0;
      hi = (hi + Math.imul(ah4, bh7)) | 0;
      lo = (lo + Math.imul(al3, bl8)) | 0;
      mid = (mid + Math.imul(al3, bh8)) | 0;
      mid = (mid + Math.imul(ah3, bl8)) | 0;
      hi = (hi + Math.imul(ah3, bh8)) | 0;
      lo = (lo + Math.imul(al2, bl9)) | 0;
      mid = (mid + Math.imul(al2, bh9)) | 0;
      mid = (mid + Math.imul(ah2, bl9)) | 0;
      hi = (hi + Math.imul(ah2, bh9)) | 0;
      var w11 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w11 >>> 26)) | 0;
      w11 &= 0x3ffffff;
      /* k = 12 */
      lo = Math.imul(al9, bl3);
      mid = Math.imul(al9, bh3);
      mid = (mid + Math.imul(ah9, bl3)) | 0;
      hi = Math.imul(ah9, bh3);
      lo = (lo + Math.imul(al8, bl4)) | 0;
      mid = (mid + Math.imul(al8, bh4)) | 0;
      mid = (mid + Math.imul(ah8, bl4)) | 0;
      hi = (hi + Math.imul(ah8, bh4)) | 0;
      lo = (lo + Math.imul(al7, bl5)) | 0;
      mid = (mid + Math.imul(al7, bh5)) | 0;
      mid = (mid + Math.imul(ah7, bl5)) | 0;
      hi = (hi + Math.imul(ah7, bh5)) | 0;
      lo = (lo + Math.imul(al6, bl6)) | 0;
      mid = (mid + Math.imul(al6, bh6)) | 0;
      mid = (mid + Math.imul(ah6, bl6)) | 0;
      hi = (hi + Math.imul(ah6, bh6)) | 0;
      lo = (lo + Math.imul(al5, bl7)) | 0;
      mid = (mid + Math.imul(al5, bh7)) | 0;
      mid = (mid + Math.imul(ah5, bl7)) | 0;
      hi = (hi + Math.imul(ah5, bh7)) | 0;
      lo = (lo + Math.imul(al4, bl8)) | 0;
      mid = (mid + Math.imul(al4, bh8)) | 0;
      mid = (mid + Math.imul(ah4, bl8)) | 0;
      hi = (hi + Math.imul(ah4, bh8)) | 0;
      lo = (lo + Math.imul(al3, bl9)) | 0;
      mid = (mid + Math.imul(al3, bh9)) | 0;
      mid = (mid + Math.imul(ah3, bl9)) | 0;
      hi = (hi + Math.imul(ah3, bh9)) | 0;
      var w12 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w12 >>> 26)) | 0;
      w12 &= 0x3ffffff;
      /* k = 13 */
      lo = Math.imul(al9, bl4);
      mid = Math.imul(al9, bh4);
      mid = (mid + Math.imul(ah9, bl4)) | 0;
      hi = Math.imul(ah9, bh4);
      lo = (lo + Math.imul(al8, bl5)) | 0;
      mid = (mid + Math.imul(al8, bh5)) | 0;
      mid = (mid + Math.imul(ah8, bl5)) | 0;
      hi = (hi + Math.imul(ah8, bh5)) | 0;
      lo = (lo + Math.imul(al7, bl6)) | 0;
      mid = (mid + Math.imul(al7, bh6)) | 0;
      mid = (mid + Math.imul(ah7, bl6)) | 0;
      hi = (hi + Math.imul(ah7, bh6)) | 0;
      lo = (lo + Math.imul(al6, bl7)) | 0;
      mid = (mid + Math.imul(al6, bh7)) | 0;
      mid = (mid + Math.imul(ah6, bl7)) | 0;
      hi = (hi + Math.imul(ah6, bh7)) | 0;
      lo = (lo + Math.imul(al5, bl8)) | 0;
      mid = (mid + Math.imul(al5, bh8)) | 0;
      mid = (mid + Math.imul(ah5, bl8)) | 0;
      hi = (hi + Math.imul(ah5, bh8)) | 0;
      lo = (lo + Math.imul(al4, bl9)) | 0;
      mid = (mid + Math.imul(al4, bh9)) | 0;
      mid = (mid + Math.imul(ah4, bl9)) | 0;
      hi = (hi + Math.imul(ah4, bh9)) | 0;
      var w13 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w13 >>> 26)) | 0;
      w13 &= 0x3ffffff;
      /* k = 14 */
      lo = Math.imul(al9, bl5);
      mid = Math.imul(al9, bh5);
      mid = (mid + Math.imul(ah9, bl5)) | 0;
      hi = Math.imul(ah9, bh5);
      lo = (lo + Math.imul(al8, bl6)) | 0;
      mid = (mid + Math.imul(al8, bh6)) | 0;
      mid = (mid + Math.imul(ah8, bl6)) | 0;
      hi = (hi + Math.imul(ah8, bh6)) | 0;
      lo = (lo + Math.imul(al7, bl7)) | 0;
      mid = (mid + Math.imul(al7, bh7)) | 0;
      mid = (mid + Math.imul(ah7, bl7)) | 0;
      hi = (hi + Math.imul(ah7, bh7)) | 0;
      lo = (lo + Math.imul(al6, bl8)) | 0;
      mid = (mid + Math.imul(al6, bh8)) | 0;
      mid = (mid + Math.imul(ah6, bl8)) | 0;
      hi = (hi + Math.imul(ah6, bh8)) | 0;
      lo = (lo + Math.imul(al5, bl9)) | 0;
      mid = (mid + Math.imul(al5, bh9)) | 0;
      mid = (mid + Math.imul(ah5, bl9)) | 0;
      hi = (hi + Math.imul(ah5, bh9)) | 0;
      var w14 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w14 >>> 26)) | 0;
      w14 &= 0x3ffffff;
      /* k = 15 */
      lo = Math.imul(al9, bl6);
      mid = Math.imul(al9, bh6);
      mid = (mid + Math.imul(ah9, bl6)) | 0;
      hi = Math.imul(ah9, bh6);
      lo = (lo + Math.imul(al8, bl7)) | 0;
      mid = (mid + Math.imul(al8, bh7)) | 0;
      mid = (mid + Math.imul(ah8, bl7)) | 0;
      hi = (hi + Math.imul(ah8, bh7)) | 0;
      lo = (lo + Math.imul(al7, bl8)) | 0;
      mid = (mid + Math.imul(al7, bh8)) | 0;
      mid = (mid + Math.imul(ah7, bl8)) | 0;
      hi = (hi + Math.imul(ah7, bh8)) | 0;
      lo = (lo + Math.imul(al6, bl9)) | 0;
      mid = (mid + Math.imul(al6, bh9)) | 0;
      mid = (mid + Math.imul(ah6, bl9)) | 0;
      hi = (hi + Math.imul(ah6, bh9)) | 0;
      var w15 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w15 >>> 26)) | 0;
      w15 &= 0x3ffffff;
      /* k = 16 */
      lo = Math.imul(al9, bl7);
      mid = Math.imul(al9, bh7);
      mid = (mid + Math.imul(ah9, bl7)) | 0;
      hi = Math.imul(ah9, bh7);
      lo = (lo + Math.imul(al8, bl8)) | 0;
      mid = (mid + Math.imul(al8, bh8)) | 0;
      mid = (mid + Math.imul(ah8, bl8)) | 0;
      hi = (hi + Math.imul(ah8, bh8)) | 0;
      lo = (lo + Math.imul(al7, bl9)) | 0;
      mid = (mid + Math.imul(al7, bh9)) | 0;
      mid = (mid + Math.imul(ah7, bl9)) | 0;
      hi = (hi + Math.imul(ah7, bh9)) | 0;
      var w16 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w16 >>> 26)) | 0;
      w16 &= 0x3ffffff;
      /* k = 17 */
      lo = Math.imul(al9, bl8);
      mid = Math.imul(al9, bh8);
      mid = (mid + Math.imul(ah9, bl8)) | 0;
      hi = Math.imul(ah9, bh8);
      lo = (lo + Math.imul(al8, bl9)) | 0;
      mid = (mid + Math.imul(al8, bh9)) | 0;
      mid = (mid + Math.imul(ah8, bl9)) | 0;
      hi = (hi + Math.imul(ah8, bh9)) | 0;
      var w17 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w17 >>> 26)) | 0;
      w17 &= 0x3ffffff;
      /* k = 18 */
      lo = Math.imul(al9, bl9);
      mid = Math.imul(al9, bh9);
      mid = (mid + Math.imul(ah9, bl9)) | 0;
      hi = Math.imul(ah9, bh9);
      var w18 = (((c + lo) | 0) + ((mid & 0x1fff) << 13)) | 0;
      c = (((hi + (mid >>> 13)) | 0) + (w18 >>> 26)) | 0;
      w18 &= 0x3ffffff;
      o[0] = w0;
      o[1] = w1;
      o[2] = w2;
      o[3] = w3;
      o[4] = w4;
      o[5] = w5;
      o[6] = w6;
      o[7] = w7;
      o[8] = w8;
      o[9] = w9;
      o[10] = w10;
      o[11] = w11;
      o[12] = w12;
      o[13] = w13;
      o[14] = w14;
      o[15] = w15;
      o[16] = w16;
      o[17] = w17;
      o[18] = w18;
      if (c !== 0) {
        o[19] = c;
        out.length++;
      }
      return out;
    };

    // Polyfill comb
    if (!Math.imul) {
      comb10MulTo = smallMulTo;
    }

    function bigMulTo (self, num, out) {
      out.negative = num.negative ^ self.negative;
      out.length = self.length + num.length;

      var carry = 0;
      var hncarry = 0;
      for (var k = 0; k < out.length - 1; k++) {
        // Sum all words with the same `i + j = k` and accumulate `ncarry`,
        // note that ncarry could be >= 0x3ffffff
        var ncarry = hncarry;
        hncarry = 0;
        var rword = carry & 0x3ffffff;
        var maxJ = Math.min(k, num.length - 1);
        for (var j = Math.max(0, k - self.length + 1); j <= maxJ; j++) {
          var i = k - j;
          var a = self.words[i] | 0;
          var b = num.words[j] | 0;
          var r = a * b;

          var lo = r & 0x3ffffff;
          ncarry = (ncarry + ((r / 0x4000000) | 0)) | 0;
          lo = (lo + rword) | 0;
          rword = lo & 0x3ffffff;
          ncarry = (ncarry + (lo >>> 26)) | 0;

          hncarry += ncarry >>> 26;
          ncarry &= 0x3ffffff;
        }
        out.words[k] = rword;
        carry = ncarry;
        ncarry = hncarry;
      }
      if (carry !== 0) {
        out.words[k] = carry;
      } else {
        out.length--;
      }

      return out.strip();
    }

    function jumboMulTo (self, num, out) {
      var fftm = new FFTM();
      return fftm.mulp(self, num, out);
    }

    BN.prototype.mulTo = function mulTo (num, out) {
      var res;
      var len = this.length + num.length;
      if (this.length === 10 && num.length === 10) {
        res = comb10MulTo(this, num, out);
      } else if (len < 63) {
        res = smallMulTo(this, num, out);
      } else if (len < 1024) {
        res = bigMulTo(this, num, out);
      } else {
        res = jumboMulTo(this, num, out);
      }

      return res;
    };

    // Cooley-Tukey algorithm for FFT
    // slightly revisited to rely on looping instead of recursion

    function FFTM (x, y) {
      this.x = x;
      this.y = y;
    }

    FFTM.prototype.makeRBT = function makeRBT (N) {
      var t = new Array(N);
      var l = BN.prototype._countBits(N) - 1;
      for (var i = 0; i < N; i++) {
        t[i] = this.revBin(i, l, N);
      }

      return t;
    };

    // Returns binary-reversed representation of `x`
    FFTM.prototype.revBin = function revBin (x, l, N) {
      if (x === 0 || x === N - 1) return x;

      var rb = 0;
      for (var i = 0; i < l; i++) {
        rb |= (x & 1) << (l - i - 1);
        x >>= 1;
      }

      return rb;
    };

    // Performs "tweedling" phase, therefore 'emulating'
    // behaviour of the recursive algorithm
    FFTM.prototype.permute = function permute (rbt, rws, iws, rtws, itws, N) {
      for (var i = 0; i < N; i++) {
        rtws[i] = rws[rbt[i]];
        itws[i] = iws[rbt[i]];
      }
    };

    FFTM.prototype.transform = function transform (rws, iws, rtws, itws, N, rbt) {
      this.permute(rbt, rws, iws, rtws, itws, N);

      for (var s = 1; s < N; s <<= 1) {
        var l = s << 1;

        var rtwdf = Math.cos(2 * Math.PI / l);
        var itwdf = Math.sin(2 * Math.PI / l);

        for (var p = 0; p < N; p += l) {
          var rtwdf_ = rtwdf;
          var itwdf_ = itwdf;

          for (var j = 0; j < s; j++) {
            var re = rtws[p + j];
            var ie = itws[p + j];

            var ro = rtws[p + j + s];
            var io = itws[p + j + s];

            var rx = rtwdf_ * ro - itwdf_ * io;

            io = rtwdf_ * io + itwdf_ * ro;
            ro = rx;

            rtws[p + j] = re + ro;
            itws[p + j] = ie + io;

            rtws[p + j + s] = re - ro;
            itws[p + j + s] = ie - io;

            /* jshint maxdepth : false */
            if (j !== l) {
              rx = rtwdf * rtwdf_ - itwdf * itwdf_;

              itwdf_ = rtwdf * itwdf_ + itwdf * rtwdf_;
              rtwdf_ = rx;
            }
          }
        }
      }
    };

    FFTM.prototype.guessLen13b = function guessLen13b (n, m) {
      var N = Math.max(m, n) | 1;
      var odd = N & 1;
      var i = 0;
      for (N = N / 2 | 0; N; N = N >>> 1) {
        i++;
      }

      return 1 << i + 1 + odd;
    };

    FFTM.prototype.conjugate = function conjugate (rws, iws, N) {
      if (N <= 1) return;

      for (var i = 0; i < N / 2; i++) {
        var t = rws[i];

        rws[i] = rws[N - i - 1];
        rws[N - i - 1] = t;

        t = iws[i];

        iws[i] = -iws[N - i - 1];
        iws[N - i - 1] = -t;
      }
    };

    FFTM.prototype.normalize13b = function normalize13b (ws, N) {
      var carry = 0;
      for (var i = 0; i < N / 2; i++) {
        var w = Math.round(ws[2 * i + 1] / N) * 0x2000 +
          Math.round(ws[2 * i] / N) +
          carry;

        ws[i] = w & 0x3ffffff;

        if (w < 0x4000000) {
          carry = 0;
        } else {
          carry = w / 0x4000000 | 0;
        }
      }

      return ws;
    };

    FFTM.prototype.convert13b = function convert13b (ws, len, rws, N) {
      var carry = 0;
      for (var i = 0; i < len; i++) {
        carry = carry + (ws[i] | 0);

        rws[2 * i] = carry & 0x1fff; carry = carry >>> 13;
        rws[2 * i + 1] = carry & 0x1fff; carry = carry >>> 13;
      }

      // Pad with zeroes
      for (i = 2 * len; i < N; ++i) {
        rws[i] = 0;
      }

      assert(carry === 0);
      assert((carry & ~0x1fff) === 0);
    };

    FFTM.prototype.stub = function stub (N) {
      var ph = new Array(N);
      for (var i = 0; i < N; i++) {
        ph[i] = 0;
      }

      return ph;
    };

    FFTM.prototype.mulp = function mulp (x, y, out) {
      var N = 2 * this.guessLen13b(x.length, y.length);

      var rbt = this.makeRBT(N);

      var _ = this.stub(N);

      var rws = new Array(N);
      var rwst = new Array(N);
      var iwst = new Array(N);

      var nrws = new Array(N);
      var nrwst = new Array(N);
      var niwst = new Array(N);

      var rmws = out.words;
      rmws.length = N;

      this.convert13b(x.words, x.length, rws, N);
      this.convert13b(y.words, y.length, nrws, N);

      this.transform(rws, _, rwst, iwst, N, rbt);
      this.transform(nrws, _, nrwst, niwst, N, rbt);

      for (var i = 0; i < N; i++) {
        var rx = rwst[i] * nrwst[i] - iwst[i] * niwst[i];
        iwst[i] = rwst[i] * niwst[i] + iwst[i] * nrwst[i];
        rwst[i] = rx;
      }

      this.conjugate(rwst, iwst, N);
      this.transform(rwst, iwst, rmws, _, N, rbt);
      this.conjugate(rmws, _, N);
      this.normalize13b(rmws, N);

      out.negative = x.negative ^ y.negative;
      out.length = x.length + y.length;
      return out.strip();
    };

    // Multiply `this` by `num`
    BN.prototype.mul = function mul (num) {
      var out = new BN(null);
      out.words = new Array(this.length + num.length);
      return this.mulTo(num, out);
    };

    // Multiply employing FFT
    BN.prototype.mulf = function mulf (num) {
      var out = new BN(null);
      out.words = new Array(this.length + num.length);
      return jumboMulTo(this, num, out);
    };

    // In-place Multiplication
    BN.prototype.imul = function imul (num) {
      return this.clone().mulTo(num, this);
    };

    BN.prototype.imuln = function imuln (num) {
      assert(typeof num === 'number');
      assert(num < 0x4000000);

      // Carry
      var carry = 0;
      for (var i = 0; i < this.length; i++) {
        var w = (this.words[i] | 0) * num;
        var lo = (w & 0x3ffffff) + (carry & 0x3ffffff);
        carry >>= 26;
        carry += (w / 0x4000000) | 0;
        // NOTE: lo is 27bit maximum
        carry += lo >>> 26;
        this.words[i] = lo & 0x3ffffff;
      }

      if (carry !== 0) {
        this.words[i] = carry;
        this.length++;
      }

      return this;
    };

    BN.prototype.muln = function muln (num) {
      return this.clone().imuln(num);
    };

    // `this` * `this`
    BN.prototype.sqr = function sqr () {
      return this.mul(this);
    };

    // `this` * `this` in-place
    BN.prototype.isqr = function isqr () {
      return this.imul(this.clone());
    };

    // Math.pow(`this`, `num`)
    BN.prototype.pow = function pow (num) {
      var w = toBitArray(num);
      if (w.length === 0) return new BN(1);

      // Skip leading zeroes
      var res = this;
      for (var i = 0; i < w.length; i++, res = res.sqr()) {
        if (w[i] !== 0) break;
      }

      if (++i < w.length) {
        for (var q = res.sqr(); i < w.length; i++, q = q.sqr()) {
          if (w[i] === 0) continue;

          res = res.mul(q);
        }
      }

      return res;
    };

    // Shift-left in-place
    BN.prototype.iushln = function iushln (bits) {
      assert(typeof bits === 'number' && bits >= 0);
      var r = bits % 26;
      var s = (bits - r) / 26;
      var carryMask = (0x3ffffff >>> (26 - r)) << (26 - r);
      var i;

      if (r !== 0) {
        var carry = 0;

        for (i = 0; i < this.length; i++) {
          var newCarry = this.words[i] & carryMask;
          var c = ((this.words[i] | 0) - newCarry) << r;
          this.words[i] = c | carry;
          carry = newCarry >>> (26 - r);
        }

        if (carry) {
          this.words[i] = carry;
          this.length++;
        }
      }

      if (s !== 0) {
        for (i = this.length - 1; i >= 0; i--) {
          this.words[i + s] = this.words[i];
        }

        for (i = 0; i < s; i++) {
          this.words[i] = 0;
        }

        this.length += s;
      }

      return this.strip();
    };

    BN.prototype.ishln = function ishln (bits) {
      // TODO(indutny): implement me
      assert(this.negative === 0);
      return this.iushln(bits);
    };

    // Shift-right in-place
    // NOTE: `hint` is a lowest bit before trailing zeroes
    // NOTE: if `extended` is present - it will be filled with destroyed bits
    BN.prototype.iushrn = function iushrn (bits, hint, extended) {
      assert(typeof bits === 'number' && bits >= 0);
      var h;
      if (hint) {
        h = (hint - (hint % 26)) / 26;
      } else {
        h = 0;
      }

      var r = bits % 26;
      var s = Math.min((bits - r) / 26, this.length);
      var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
      var maskedWords = extended;

      h -= s;
      h = Math.max(0, h);

      // Extended mode, copy masked part
      if (maskedWords) {
        for (var i = 0; i < s; i++) {
          maskedWords.words[i] = this.words[i];
        }
        maskedWords.length = s;
      }

      if (s === 0) ; else if (this.length > s) {
        this.length -= s;
        for (i = 0; i < this.length; i++) {
          this.words[i] = this.words[i + s];
        }
      } else {
        this.words[0] = 0;
        this.length = 1;
      }

      var carry = 0;
      for (i = this.length - 1; i >= 0 && (carry !== 0 || i >= h); i--) {
        var word = this.words[i] | 0;
        this.words[i] = (carry << (26 - r)) | (word >>> r);
        carry = word & mask;
      }

      // Push carried bits as a mask
      if (maskedWords && carry !== 0) {
        maskedWords.words[maskedWords.length++] = carry;
      }

      if (this.length === 0) {
        this.words[0] = 0;
        this.length = 1;
      }

      return this.strip();
    };

    BN.prototype.ishrn = function ishrn (bits, hint, extended) {
      // TODO(indutny): implement me
      assert(this.negative === 0);
      return this.iushrn(bits, hint, extended);
    };

    // Shift-left
    BN.prototype.shln = function shln (bits) {
      return this.clone().ishln(bits);
    };

    BN.prototype.ushln = function ushln (bits) {
      return this.clone().iushln(bits);
    };

    // Shift-right
    BN.prototype.shrn = function shrn (bits) {
      return this.clone().ishrn(bits);
    };

    BN.prototype.ushrn = function ushrn (bits) {
      return this.clone().iushrn(bits);
    };

    // Test if n bit is set
    BN.prototype.testn = function testn (bit) {
      assert(typeof bit === 'number' && bit >= 0);
      var r = bit % 26;
      var s = (bit - r) / 26;
      var q = 1 << r;

      // Fast case: bit is much higher than all existing words
      if (this.length <= s) return false;

      // Check bit and return
      var w = this.words[s];

      return !!(w & q);
    };

    // Return only lowers bits of number (in-place)
    BN.prototype.imaskn = function imaskn (bits) {
      assert(typeof bits === 'number' && bits >= 0);
      var r = bits % 26;
      var s = (bits - r) / 26;

      assert(this.negative === 0, 'imaskn works only with positive numbers');

      if (this.length <= s) {
        return this;
      }

      if (r !== 0) {
        s++;
      }
      this.length = Math.min(s, this.length);

      if (r !== 0) {
        var mask = 0x3ffffff ^ ((0x3ffffff >>> r) << r);
        this.words[this.length - 1] &= mask;
      }

      return this.strip();
    };

    // Return only lowers bits of number
    BN.prototype.maskn = function maskn (bits) {
      return this.clone().imaskn(bits);
    };

    // Add plain number `num` to `this`
    BN.prototype.iaddn = function iaddn (num) {
      assert(typeof num === 'number');
      assert(num < 0x4000000);
      if (num < 0) return this.isubn(-num);

      // Possible sign change
      if (this.negative !== 0) {
        if (this.length === 1 && (this.words[0] | 0) < num) {
          this.words[0] = num - (this.words[0] | 0);
          this.negative = 0;
          return this;
        }

        this.negative = 0;
        this.isubn(num);
        this.negative = 1;
        return this;
      }

      // Add without checks
      return this._iaddn(num);
    };

    BN.prototype._iaddn = function _iaddn (num) {
      this.words[0] += num;

      // Carry
      for (var i = 0; i < this.length && this.words[i] >= 0x4000000; i++) {
        this.words[i] -= 0x4000000;
        if (i === this.length - 1) {
          this.words[i + 1] = 1;
        } else {
          this.words[i + 1]++;
        }
      }
      this.length = Math.max(this.length, i + 1);

      return this;
    };

    // Subtract plain number `num` from `this`
    BN.prototype.isubn = function isubn (num) {
      assert(typeof num === 'number');
      assert(num < 0x4000000);
      if (num < 0) return this.iaddn(-num);

      if (this.negative !== 0) {
        this.negative = 0;
        this.iaddn(num);
        this.negative = 1;
        return this;
      }

      this.words[0] -= num;

      if (this.length === 1 && this.words[0] < 0) {
        this.words[0] = -this.words[0];
        this.negative = 1;
      } else {
        // Carry
        for (var i = 0; i < this.length && this.words[i] < 0; i++) {
          this.words[i] += 0x4000000;
          this.words[i + 1] -= 1;
        }
      }

      return this.strip();
    };

    BN.prototype.addn = function addn (num) {
      return this.clone().iaddn(num);
    };

    BN.prototype.subn = function subn (num) {
      return this.clone().isubn(num);
    };

    BN.prototype.iabs = function iabs () {
      this.negative = 0;

      return this;
    };

    BN.prototype.abs = function abs () {
      return this.clone().iabs();
    };

    BN.prototype._ishlnsubmul = function _ishlnsubmul (num, mul, shift) {
      var len = num.length + shift;
      var i;

      this._expand(len);

      var w;
      var carry = 0;
      for (i = 0; i < num.length; i++) {
        w = (this.words[i + shift] | 0) + carry;
        var right = (num.words[i] | 0) * mul;
        w -= right & 0x3ffffff;
        carry = (w >> 26) - ((right / 0x4000000) | 0);
        this.words[i + shift] = w & 0x3ffffff;
      }
      for (; i < this.length - shift; i++) {
        w = (this.words[i + shift] | 0) + carry;
        carry = w >> 26;
        this.words[i + shift] = w & 0x3ffffff;
      }

      if (carry === 0) return this.strip();

      // Subtraction overflow
      assert(carry === -1);
      carry = 0;
      for (i = 0; i < this.length; i++) {
        w = -(this.words[i] | 0) + carry;
        carry = w >> 26;
        this.words[i] = w & 0x3ffffff;
      }
      this.negative = 1;

      return this.strip();
    };

    BN.prototype._wordDiv = function _wordDiv (num, mode) {
      var shift = this.length - num.length;

      var a = this.clone();
      var b = num;

      // Normalize
      var bhi = b.words[b.length - 1] | 0;
      var bhiBits = this._countBits(bhi);
      shift = 26 - bhiBits;
      if (shift !== 0) {
        b = b.ushln(shift);
        a.iushln(shift);
        bhi = b.words[b.length - 1] | 0;
      }

      // Initialize quotient
      var m = a.length - b.length;
      var q;

      if (mode !== 'mod') {
        q = new BN(null);
        q.length = m + 1;
        q.words = new Array(q.length);
        for (var i = 0; i < q.length; i++) {
          q.words[i] = 0;
        }
      }

      var diff = a.clone()._ishlnsubmul(b, 1, m);
      if (diff.negative === 0) {
        a = diff;
        if (q) {
          q.words[m] = 1;
        }
      }

      for (var j = m - 1; j >= 0; j--) {
        var qj = (a.words[b.length + j] | 0) * 0x4000000 +
          (a.words[b.length + j - 1] | 0);

        // NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
        // (0x7ffffff)
        qj = Math.min((qj / bhi) | 0, 0x3ffffff);

        a._ishlnsubmul(b, qj, j);
        while (a.negative !== 0) {
          qj--;
          a.negative = 0;
          a._ishlnsubmul(b, 1, j);
          if (!a.isZero()) {
            a.negative ^= 1;
          }
        }
        if (q) {
          q.words[j] = qj;
        }
      }
      if (q) {
        q.strip();
      }
      a.strip();

      // Denormalize
      if (mode !== 'div' && shift !== 0) {
        a.iushrn(shift);
      }

      return {
        div: q || null,
        mod: a
      };
    };

    // NOTE: 1) `mode` can be set to `mod` to request mod only,
    //       to `div` to request div only, or be absent to
    //       request both div & mod
    //       2) `positive` is true if unsigned mod is requested
    BN.prototype.divmod = function divmod (num, mode, positive) {
      assert(!num.isZero());

      if (this.isZero()) {
        return {
          div: new BN(0),
          mod: new BN(0)
        };
      }

      var div, mod, res;
      if (this.negative !== 0 && num.negative === 0) {
        res = this.neg().divmod(num, mode);

        if (mode !== 'mod') {
          div = res.div.neg();
        }

        if (mode !== 'div') {
          mod = res.mod.neg();
          if (positive && mod.negative !== 0) {
            mod.iadd(num);
          }
        }

        return {
          div: div,
          mod: mod
        };
      }

      if (this.negative === 0 && num.negative !== 0) {
        res = this.divmod(num.neg(), mode);

        if (mode !== 'mod') {
          div = res.div.neg();
        }

        return {
          div: div,
          mod: res.mod
        };
      }

      if ((this.negative & num.negative) !== 0) {
        res = this.neg().divmod(num.neg(), mode);

        if (mode !== 'div') {
          mod = res.mod.neg();
          if (positive && mod.negative !== 0) {
            mod.isub(num);
          }
        }

        return {
          div: res.div,
          mod: mod
        };
      }

      // Both numbers are positive at this point

      // Strip both numbers to approximate shift value
      if (num.length > this.length || this.cmp(num) < 0) {
        return {
          div: new BN(0),
          mod: this
        };
      }

      // Very short reduction
      if (num.length === 1) {
        if (mode === 'div') {
          return {
            div: this.divn(num.words[0]),
            mod: null
          };
        }

        if (mode === 'mod') {
          return {
            div: null,
            mod: new BN(this.modn(num.words[0]))
          };
        }

        return {
          div: this.divn(num.words[0]),
          mod: new BN(this.modn(num.words[0]))
        };
      }

      return this._wordDiv(num, mode);
    };

    // Find `this` / `num`
    BN.prototype.div = function div (num) {
      return this.divmod(num, 'div', false).div;
    };

    // Find `this` % `num`
    BN.prototype.mod = function mod (num) {
      return this.divmod(num, 'mod', false).mod;
    };

    BN.prototype.umod = function umod (num) {
      return this.divmod(num, 'mod', true).mod;
    };

    // Find Round(`this` / `num`)
    BN.prototype.divRound = function divRound (num) {
      var dm = this.divmod(num);

      // Fast case - exact division
      if (dm.mod.isZero()) return dm.div;

      var mod = dm.div.negative !== 0 ? dm.mod.isub(num) : dm.mod;

      var half = num.ushrn(1);
      var r2 = num.andln(1);
      var cmp = mod.cmp(half);

      // Round down
      if (cmp < 0 || r2 === 1 && cmp === 0) return dm.div;

      // Round up
      return dm.div.negative !== 0 ? dm.div.isubn(1) : dm.div.iaddn(1);
    };

    BN.prototype.modn = function modn (num) {
      assert(num <= 0x3ffffff);
      var p = (1 << 26) % num;

      var acc = 0;
      for (var i = this.length - 1; i >= 0; i--) {
        acc = (p * acc + (this.words[i] | 0)) % num;
      }

      return acc;
    };

    // In-place division by number
    BN.prototype.idivn = function idivn (num) {
      assert(num <= 0x3ffffff);

      var carry = 0;
      for (var i = this.length - 1; i >= 0; i--) {
        var w = (this.words[i] | 0) + carry * 0x4000000;
        this.words[i] = (w / num) | 0;
        carry = w % num;
      }

      return this.strip();
    };

    BN.prototype.divn = function divn (num) {
      return this.clone().idivn(num);
    };

    BN.prototype.egcd = function egcd (p) {
      assert(p.negative === 0);
      assert(!p.isZero());

      var x = this;
      var y = p.clone();

      if (x.negative !== 0) {
        x = x.umod(p);
      } else {
        x = x.clone();
      }

      // A * x + B * y = x
      var A = new BN(1);
      var B = new BN(0);

      // C * x + D * y = y
      var C = new BN(0);
      var D = new BN(1);

      var g = 0;

      while (x.isEven() && y.isEven()) {
        x.iushrn(1);
        y.iushrn(1);
        ++g;
      }

      var yp = y.clone();
      var xp = x.clone();

      while (!x.isZero()) {
        for (var i = 0, im = 1; (x.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
        if (i > 0) {
          x.iushrn(i);
          while (i-- > 0) {
            if (A.isOdd() || B.isOdd()) {
              A.iadd(yp);
              B.isub(xp);
            }

            A.iushrn(1);
            B.iushrn(1);
          }
        }

        for (var j = 0, jm = 1; (y.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
        if (j > 0) {
          y.iushrn(j);
          while (j-- > 0) {
            if (C.isOdd() || D.isOdd()) {
              C.iadd(yp);
              D.isub(xp);
            }

            C.iushrn(1);
            D.iushrn(1);
          }
        }

        if (x.cmp(y) >= 0) {
          x.isub(y);
          A.isub(C);
          B.isub(D);
        } else {
          y.isub(x);
          C.isub(A);
          D.isub(B);
        }
      }

      return {
        a: C,
        b: D,
        gcd: y.iushln(g)
      };
    };

    // This is reduced incarnation of the binary EEA
    // above, designated to invert members of the
    // _prime_ fields F(p) at a maximal speed
    BN.prototype._invmp = function _invmp (p) {
      assert(p.negative === 0);
      assert(!p.isZero());

      var a = this;
      var b = p.clone();

      if (a.negative !== 0) {
        a = a.umod(p);
      } else {
        a = a.clone();
      }

      var x1 = new BN(1);
      var x2 = new BN(0);

      var delta = b.clone();

      while (a.cmpn(1) > 0 && b.cmpn(1) > 0) {
        for (var i = 0, im = 1; (a.words[0] & im) === 0 && i < 26; ++i, im <<= 1);
        if (i > 0) {
          a.iushrn(i);
          while (i-- > 0) {
            if (x1.isOdd()) {
              x1.iadd(delta);
            }

            x1.iushrn(1);
          }
        }

        for (var j = 0, jm = 1; (b.words[0] & jm) === 0 && j < 26; ++j, jm <<= 1);
        if (j > 0) {
          b.iushrn(j);
          while (j-- > 0) {
            if (x2.isOdd()) {
              x2.iadd(delta);
            }

            x2.iushrn(1);
          }
        }

        if (a.cmp(b) >= 0) {
          a.isub(b);
          x1.isub(x2);
        } else {
          b.isub(a);
          x2.isub(x1);
        }
      }

      var res;
      if (a.cmpn(1) === 0) {
        res = x1;
      } else {
        res = x2;
      }

      if (res.cmpn(0) < 0) {
        res.iadd(p);
      }

      return res;
    };

    BN.prototype.gcd = function gcd (num) {
      if (this.isZero()) return num.abs();
      if (num.isZero()) return this.abs();

      var a = this.clone();
      var b = num.clone();
      a.negative = 0;
      b.negative = 0;

      // Remove common factor of two
      for (var shift = 0; a.isEven() && b.isEven(); shift++) {
        a.iushrn(1);
        b.iushrn(1);
      }

      do {
        while (a.isEven()) {
          a.iushrn(1);
        }
        while (b.isEven()) {
          b.iushrn(1);
        }

        var r = a.cmp(b);
        if (r < 0) {
          // Swap `a` and `b` to make `a` always bigger than `b`
          var t = a;
          a = b;
          b = t;
        } else if (r === 0 || b.cmpn(1) === 0) {
          break;
        }

        a.isub(b);
      } while (true);

      return b.iushln(shift);
    };

    // Invert number in the field F(num)
    BN.prototype.invm = function invm (num) {
      return this.egcd(num).a.umod(num);
    };

    BN.prototype.isEven = function isEven () {
      return (this.words[0] & 1) === 0;
    };

    BN.prototype.isOdd = function isOdd () {
      return (this.words[0] & 1) === 1;
    };

    // And first word and num
    BN.prototype.andln = function andln (num) {
      return this.words[0] & num;
    };

    // Increment at the bit position in-line
    BN.prototype.bincn = function bincn (bit) {
      assert(typeof bit === 'number');
      var r = bit % 26;
      var s = (bit - r) / 26;
      var q = 1 << r;

      // Fast case: bit is much higher than all existing words
      if (this.length <= s) {
        this._expand(s + 1);
        this.words[s] |= q;
        return this;
      }

      // Add bit and propagate, if needed
      var carry = q;
      for (var i = s; carry !== 0 && i < this.length; i++) {
        var w = this.words[i] | 0;
        w += carry;
        carry = w >>> 26;
        w &= 0x3ffffff;
        this.words[i] = w;
      }
      if (carry !== 0) {
        this.words[i] = carry;
        this.length++;
      }
      return this;
    };

    BN.prototype.isZero = function isZero () {
      return this.length === 1 && this.words[0] === 0;
    };

    BN.prototype.cmpn = function cmpn (num) {
      var negative = num < 0;

      if (this.negative !== 0 && !negative) return -1;
      if (this.negative === 0 && negative) return 1;

      this.strip();

      var res;
      if (this.length > 1) {
        res = 1;
      } else {
        if (negative) {
          num = -num;
        }

        assert(num <= 0x3ffffff, 'Number is too big');

        var w = this.words[0] | 0;
        res = w === num ? 0 : w < num ? -1 : 1;
      }
      if (this.negative !== 0) return -res | 0;
      return res;
    };

    // Compare two numbers and return:
    // 1 - if `this` > `num`
    // 0 - if `this` == `num`
    // -1 - if `this` < `num`
    BN.prototype.cmp = function cmp (num) {
      if (this.negative !== 0 && num.negative === 0) return -1;
      if (this.negative === 0 && num.negative !== 0) return 1;

      var res = this.ucmp(num);
      if (this.negative !== 0) return -res | 0;
      return res;
    };

    // Unsigned comparison
    BN.prototype.ucmp = function ucmp (num) {
      // At this point both numbers have the same sign
      if (this.length > num.length) return 1;
      if (this.length < num.length) return -1;

      var res = 0;
      for (var i = this.length - 1; i >= 0; i--) {
        var a = this.words[i] | 0;
        var b = num.words[i] | 0;

        if (a === b) continue;
        if (a < b) {
          res = -1;
        } else if (a > b) {
          res = 1;
        }
        break;
      }
      return res;
    };

    BN.prototype.gtn = function gtn (num) {
      return this.cmpn(num) === 1;
    };

    BN.prototype.gt = function gt (num) {
      return this.cmp(num) === 1;
    };

    BN.prototype.gten = function gten (num) {
      return this.cmpn(num) >= 0;
    };

    BN.prototype.gte = function gte (num) {
      return this.cmp(num) >= 0;
    };

    BN.prototype.ltn = function ltn (num) {
      return this.cmpn(num) === -1;
    };

    BN.prototype.lt = function lt (num) {
      return this.cmp(num) === -1;
    };

    BN.prototype.lten = function lten (num) {
      return this.cmpn(num) <= 0;
    };

    BN.prototype.lte = function lte (num) {
      return this.cmp(num) <= 0;
    };

    BN.prototype.eqn = function eqn (num) {
      return this.cmpn(num) === 0;
    };

    BN.prototype.eq = function eq (num) {
      return this.cmp(num) === 0;
    };

    //
    // A reduce context, could be using montgomery or something better, depending
    // on the `m` itself.
    //
    BN.red = function red (num) {
      return new Red(num);
    };

    BN.prototype.toRed = function toRed (ctx) {
      assert(!this.red, 'Already a number in reduction context');
      assert(this.negative === 0, 'red works only with positives');
      return ctx.convertTo(this)._forceRed(ctx);
    };

    BN.prototype.fromRed = function fromRed () {
      assert(this.red, 'fromRed works only with numbers in reduction context');
      return this.red.convertFrom(this);
    };

    BN.prototype._forceRed = function _forceRed (ctx) {
      this.red = ctx;
      return this;
    };

    BN.prototype.forceRed = function forceRed (ctx) {
      assert(!this.red, 'Already a number in reduction context');
      return this._forceRed(ctx);
    };

    BN.prototype.redAdd = function redAdd (num) {
      assert(this.red, 'redAdd works only with red numbers');
      return this.red.add(this, num);
    };

    BN.prototype.redIAdd = function redIAdd (num) {
      assert(this.red, 'redIAdd works only with red numbers');
      return this.red.iadd(this, num);
    };

    BN.prototype.redSub = function redSub (num) {
      assert(this.red, 'redSub works only with red numbers');
      return this.red.sub(this, num);
    };

    BN.prototype.redISub = function redISub (num) {
      assert(this.red, 'redISub works only with red numbers');
      return this.red.isub(this, num);
    };

    BN.prototype.redShl = function redShl (num) {
      assert(this.red, 'redShl works only with red numbers');
      return this.red.shl(this, num);
    };

    BN.prototype.redMul = function redMul (num) {
      assert(this.red, 'redMul works only with red numbers');
      this.red._verify2(this, num);
      return this.red.mul(this, num);
    };

    BN.prototype.redIMul = function redIMul (num) {
      assert(this.red, 'redMul works only with red numbers');
      this.red._verify2(this, num);
      return this.red.imul(this, num);
    };

    BN.prototype.redSqr = function redSqr () {
      assert(this.red, 'redSqr works only with red numbers');
      this.red._verify1(this);
      return this.red.sqr(this);
    };

    BN.prototype.redISqr = function redISqr () {
      assert(this.red, 'redISqr works only with red numbers');
      this.red._verify1(this);
      return this.red.isqr(this);
    };

    // Square root over p
    BN.prototype.redSqrt = function redSqrt () {
      assert(this.red, 'redSqrt works only with red numbers');
      this.red._verify1(this);
      return this.red.sqrt(this);
    };

    BN.prototype.redInvm = function redInvm () {
      assert(this.red, 'redInvm works only with red numbers');
      this.red._verify1(this);
      return this.red.invm(this);
    };

    // Return negative clone of `this` % `red modulo`
    BN.prototype.redNeg = function redNeg () {
      assert(this.red, 'redNeg works only with red numbers');
      this.red._verify1(this);
      return this.red.neg(this);
    };

    BN.prototype.redPow = function redPow (num) {
      assert(this.red && !num.red, 'redPow(normalNum)');
      this.red._verify1(this);
      return this.red.pow(this, num);
    };

    // Prime numbers with efficient reduction
    var primes = {
      k256: null,
      p224: null,
      p192: null,
      p25519: null
    };

    // Pseudo-Mersenne prime
    function MPrime (name, p) {
      // P = 2 ^ N - K
      this.name = name;
      this.p = new BN(p, 16);
      this.n = this.p.bitLength();
      this.k = new BN(1).iushln(this.n).isub(this.p);

      this.tmp = this._tmp();
    }

    MPrime.prototype._tmp = function _tmp () {
      var tmp = new BN(null);
      tmp.words = new Array(Math.ceil(this.n / 13));
      return tmp;
    };

    MPrime.prototype.ireduce = function ireduce (num) {
      // Assumes that `num` is less than `P^2`
      // num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
      var r = num;
      var rlen;

      do {
        this.split(r, this.tmp);
        r = this.imulK(r);
        r = r.iadd(this.tmp);
        rlen = r.bitLength();
      } while (rlen > this.n);

      var cmp = rlen < this.n ? -1 : r.ucmp(this.p);
      if (cmp === 0) {
        r.words[0] = 0;
        r.length = 1;
      } else if (cmp > 0) {
        r.isub(this.p);
      } else {
        r.strip();
      }

      return r;
    };

    MPrime.prototype.split = function split (input, out) {
      input.iushrn(this.n, 0, out);
    };

    MPrime.prototype.imulK = function imulK (num) {
      return num.imul(this.k);
    };

    function K256 () {
      MPrime.call(
        this,
        'k256',
        'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');
    }
    inherits(K256, MPrime);

    K256.prototype.split = function split (input, output) {
      // 256 = 9 * 26 + 22
      var mask = 0x3fffff;

      var outLen = Math.min(input.length, 9);
      for (var i = 0; i < outLen; i++) {
        output.words[i] = input.words[i];
      }
      output.length = outLen;

      if (input.length <= 9) {
        input.words[0] = 0;
        input.length = 1;
        return;
      }

      // Shift by 9 limbs
      var prev = input.words[9];
      output.words[output.length++] = prev & mask;

      for (i = 10; i < input.length; i++) {
        var next = input.words[i] | 0;
        input.words[i - 10] = ((next & mask) << 4) | (prev >>> 22);
        prev = next;
      }
      prev >>>= 22;
      input.words[i - 10] = prev;
      if (prev === 0 && input.length > 10) {
        input.length -= 10;
      } else {
        input.length -= 9;
      }
    };

    K256.prototype.imulK = function imulK (num) {
      // K = 0x1000003d1 = [ 0x40, 0x3d1 ]
      num.words[num.length] = 0;
      num.words[num.length + 1] = 0;
      num.length += 2;

      // bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
      var lo = 0;
      for (var i = 0; i < num.length; i++) {
        var w = num.words[i] | 0;
        lo += w * 0x3d1;
        num.words[i] = lo & 0x3ffffff;
        lo = w * 0x40 + ((lo / 0x4000000) | 0);
      }

      // Fast length reduction
      if (num.words[num.length - 1] === 0) {
        num.length--;
        if (num.words[num.length - 1] === 0) {
          num.length--;
        }
      }
      return num;
    };

    function P224 () {
      MPrime.call(
        this,
        'p224',
        'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');
    }
    inherits(P224, MPrime);

    function P192 () {
      MPrime.call(
        this,
        'p192',
        'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');
    }
    inherits(P192, MPrime);

    function P25519 () {
      // 2 ^ 255 - 19
      MPrime.call(
        this,
        '25519',
        '7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');
    }
    inherits(P25519, MPrime);

    P25519.prototype.imulK = function imulK (num) {
      // K = 0x13
      var carry = 0;
      for (var i = 0; i < num.length; i++) {
        var hi = (num.words[i] | 0) * 0x13 + carry;
        var lo = hi & 0x3ffffff;
        hi >>>= 26;

        num.words[i] = lo;
        carry = hi;
      }
      if (carry !== 0) {
        num.words[num.length++] = carry;
      }
      return num;
    };

    // Exported mostly for testing purposes, use plain name instead
    BN._prime = function prime (name) {
      // Cached version of prime
      if (primes[name]) return primes[name];

      var prime;
      if (name === 'k256') {
        prime = new K256();
      } else if (name === 'p224') {
        prime = new P224();
      } else if (name === 'p192') {
        prime = new P192();
      } else if (name === 'p25519') {
        prime = new P25519();
      } else {
        throw new Error('Unknown prime ' + name);
      }
      primes[name] = prime;

      return prime;
    };

    //
    // Base reduction engine
    //
    function Red (m) {
      if (typeof m === 'string') {
        var prime = BN._prime(m);
        this.m = prime.p;
        this.prime = prime;
      } else {
        assert(m.gtn(1), 'modulus must be greater than 1');
        this.m = m;
        this.prime = null;
      }
    }

    Red.prototype._verify1 = function _verify1 (a) {
      assert(a.negative === 0, 'red works only with positives');
      assert(a.red, 'red works only with red numbers');
    };

    Red.prototype._verify2 = function _verify2 (a, b) {
      assert((a.negative | b.negative) === 0, 'red works only with positives');
      assert(a.red && a.red === b.red,
        'red works only with red numbers');
    };

    Red.prototype.imod = function imod (a) {
      if (this.prime) return this.prime.ireduce(a)._forceRed(this);
      return a.umod(this.m)._forceRed(this);
    };

    Red.prototype.neg = function neg (a) {
      if (a.isZero()) {
        return a.clone();
      }

      return this.m.sub(a)._forceRed(this);
    };

    Red.prototype.add = function add (a, b) {
      this._verify2(a, b);

      var res = a.add(b);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res._forceRed(this);
    };

    Red.prototype.iadd = function iadd (a, b) {
      this._verify2(a, b);

      var res = a.iadd(b);
      if (res.cmp(this.m) >= 0) {
        res.isub(this.m);
      }
      return res;
    };

    Red.prototype.sub = function sub (a, b) {
      this._verify2(a, b);

      var res = a.sub(b);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res._forceRed(this);
    };

    Red.prototype.isub = function isub (a, b) {
      this._verify2(a, b);

      var res = a.isub(b);
      if (res.cmpn(0) < 0) {
        res.iadd(this.m);
      }
      return res;
    };

    Red.prototype.shl = function shl (a, num) {
      this._verify1(a);
      return this.imod(a.ushln(num));
    };

    Red.prototype.imul = function imul (a, b) {
      this._verify2(a, b);
      return this.imod(a.imul(b));
    };

    Red.prototype.mul = function mul (a, b) {
      this._verify2(a, b);
      return this.imod(a.mul(b));
    };

    Red.prototype.isqr = function isqr (a) {
      return this.imul(a, a.clone());
    };

    Red.prototype.sqr = function sqr (a) {
      return this.mul(a, a);
    };

    Red.prototype.sqrt = function sqrt (a) {
      if (a.isZero()) return a.clone();

      var mod3 = this.m.andln(3);
      assert(mod3 % 2 === 1);

      // Fast case
      if (mod3 === 3) {
        var pow = this.m.add(new BN(1)).iushrn(2);
        return this.pow(a, pow);
      }

      // Tonelli-Shanks algorithm (Totally unoptimized and slow)
      //
      // Find Q and S, that Q * 2 ^ S = (P - 1)
      var q = this.m.subn(1);
      var s = 0;
      while (!q.isZero() && q.andln(1) === 0) {
        s++;
        q.iushrn(1);
      }
      assert(!q.isZero());

      var one = new BN(1).toRed(this);
      var nOne = one.redNeg();

      // Find quadratic non-residue
      // NOTE: Max is such because of generalized Riemann hypothesis.
      var lpow = this.m.subn(1).iushrn(1);
      var z = this.m.bitLength();
      z = new BN(2 * z * z).toRed(this);

      while (this.pow(z, lpow).cmp(nOne) !== 0) {
        z.redIAdd(nOne);
      }

      var c = this.pow(z, q);
      var r = this.pow(a, q.addn(1).iushrn(1));
      var t = this.pow(a, q);
      var m = s;
      while (t.cmp(one) !== 0) {
        var tmp = t;
        for (var i = 0; tmp.cmp(one) !== 0; i++) {
          tmp = tmp.redSqr();
        }
        assert(i < m);
        var b = this.pow(c, new BN(1).iushln(m - i - 1));

        r = r.redMul(b);
        c = b.redSqr();
        t = t.redMul(c);
        m = i;
      }

      return r;
    };

    Red.prototype.invm = function invm (a) {
      var inv = a._invmp(this.m);
      if (inv.negative !== 0) {
        inv.negative = 0;
        return this.imod(inv).redNeg();
      } else {
        return this.imod(inv);
      }
    };

    Red.prototype.pow = function pow (a, num) {
      if (num.isZero()) return new BN(1);
      if (num.cmpn(1) === 0) return a.clone();

      var windowSize = 4;
      var wnd = new Array(1 << windowSize);
      wnd[0] = new BN(1).toRed(this);
      wnd[1] = a;
      for (var i = 2; i < wnd.length; i++) {
        wnd[i] = this.mul(wnd[i - 1], a);
      }

      var res = wnd[0];
      var current = 0;
      var currentLen = 0;
      var start = num.bitLength() % 26;
      if (start === 0) {
        start = 26;
      }

      for (i = num.length - 1; i >= 0; i--) {
        var word = num.words[i];
        for (var j = start - 1; j >= 0; j--) {
          var bit = (word >> j) & 1;
          if (res !== wnd[0]) {
            res = this.sqr(res);
          }

          if (bit === 0 && current === 0) {
            currentLen = 0;
            continue;
          }

          current <<= 1;
          current |= bit;
          currentLen++;
          if (currentLen !== windowSize && (i !== 0 || j !== 0)) continue;

          res = this.mul(res, wnd[current]);
          currentLen = 0;
          current = 0;
        }
        start = 26;
      }

      return res;
    };

    Red.prototype.convertTo = function convertTo (num) {
      var r = num.umod(this.m);

      return r === num ? r.clone() : r;
    };

    Red.prototype.convertFrom = function convertFrom (num) {
      var res = num.clone();
      res.red = null;
      return res;
    };

    //
    // Montgomery method engine
    //

    BN.mont = function mont (num) {
      return new Mont(num);
    };

    function Mont (m) {
      Red.call(this, m);

      this.shift = this.m.bitLength();
      if (this.shift % 26 !== 0) {
        this.shift += 26 - (this.shift % 26);
      }

      this.r = new BN(1).iushln(this.shift);
      this.r2 = this.imod(this.r.sqr());
      this.rinv = this.r._invmp(this.m);

      this.minv = this.rinv.mul(this.r).isubn(1).div(this.m);
      this.minv = this.minv.umod(this.r);
      this.minv = this.r.sub(this.minv);
    }
    inherits(Mont, Red);

    Mont.prototype.convertTo = function convertTo (num) {
      return this.imod(num.ushln(this.shift));
    };

    Mont.prototype.convertFrom = function convertFrom (num) {
      var r = this.imod(num.mul(this.rinv));
      r.red = null;
      return r;
    };

    Mont.prototype.imul = function imul (a, b) {
      if (a.isZero() || b.isZero()) {
        a.words[0] = 0;
        a.length = 1;
        return a;
      }

      var t = a.imul(b);
      var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u = t.isub(c).iushrn(this.shift);
      var res = u;

      if (u.cmp(this.m) >= 0) {
        res = u.isub(this.m);
      } else if (u.cmpn(0) < 0) {
        res = u.iadd(this.m);
      }

      return res._forceRed(this);
    };

    Mont.prototype.mul = function mul (a, b) {
      if (a.isZero() || b.isZero()) return new BN(0)._forceRed(this);

      var t = a.mul(b);
      var c = t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);
      var u = t.isub(c).iushrn(this.shift);
      var res = u;
      if (u.cmp(this.m) >= 0) {
        res = u.isub(this.m);
      } else if (u.cmpn(0) < 0) {
        res = u.iadd(this.m);
      }

      return res._forceRed(this);
    };

    Mont.prototype.invm = function invm (a) {
      // (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
      var res = this.imod(a._invmp(this.m).mul(this.r2));
      return res._forceRed(this);
    };
  })(module, commonjsGlobal);
  });

  var zero = new bn$2(0);
  var negative1 = new bn$2(-1);

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  var _listCacheClear = listCacheClear;

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  var eq_1 = eq;

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq_1(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  var _assocIndexOf = assocIndexOf;

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  var _listCacheDelete = listCacheDelete;

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  var _listCacheGet = listCacheGet;

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return _assocIndexOf(this.__data__, key) > -1;
  }

  var _listCacheHas = listCacheHas;

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = _assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  var _listCacheSet = listCacheSet;

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = _listCacheClear;
  ListCache.prototype['delete'] = _listCacheDelete;
  ListCache.prototype.get = _listCacheGet;
  ListCache.prototype.has = _listCacheHas;
  ListCache.prototype.set = _listCacheSet;

  var _ListCache = ListCache;

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject_1(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = _baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  var isFunction_1 = isFunction;

  /** Used to detect overreaching core-js shims. */
  var coreJsData = _root['__core-js_shared__'];

  var _coreJsData = coreJsData;

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(_coreJsData && _coreJsData.keys && _coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  var _isMasked = isMasked;

  /** Used for built-in method references. */
  var funcProto = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  var _toSource = toSource;

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype,
      objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject_1(value) || _isMasked(value)) {
      return false;
    }
    var pattern = isFunction_1(value) ? reIsNative : reIsHostCtor;
    return pattern.test(_toSource(value));
  }

  var _baseIsNative = baseIsNative;

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  var _getValue = getValue;

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = _getValue(object, key);
    return _baseIsNative(value) ? value : undefined;
  }

  var _getNative = getNative;

  /* Built-in method references that are verified to be native. */
  var Map$1 = _getNative(_root, 'Map');

  var _Map = Map$1;

  /* Built-in method references that are verified to be native. */
  var nativeCreate = _getNative(Object, 'create');

  var _nativeCreate = nativeCreate;

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = _nativeCreate ? _nativeCreate(null) : {};
    this.size = 0;
  }

  var _hashClear = hashClear;

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  var _hashDelete = hashDelete;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$3.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (_nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty$2.call(data, key) ? data[key] : undefined;
  }

  var _hashGet = hashGet;

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$4.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return _nativeCreate ? (data[key] !== undefined) : hasOwnProperty$3.call(data, key);
  }

  var _hashHas = hashHas;

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (_nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
    return this;
  }

  var _hashSet = hashSet;

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = _hashClear;
  Hash.prototype['delete'] = _hashDelete;
  Hash.prototype.get = _hashGet;
  Hash.prototype.has = _hashHas;
  Hash.prototype.set = _hashSet;

  var _Hash = Hash;

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new _Hash,
      'map': new (_Map || _ListCache),
      'string': new _Hash
    };
  }

  var _mapCacheClear = mapCacheClear;

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  var _isKeyable = isKeyable;

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return _isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  var _getMapData = getMapData;

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = _getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  var _mapCacheDelete = mapCacheDelete;

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return _getMapData(this, key).get(key);
  }

  var _mapCacheGet = mapCacheGet;

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return _getMapData(this, key).has(key);
  }

  var _mapCacheHas = mapCacheHas;

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = _getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  var _mapCacheSet = mapCacheSet;

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = _mapCacheClear;
  MapCache.prototype['delete'] = _mapCacheDelete;
  MapCache.prototype.get = _mapCacheGet;
  MapCache.prototype.has = _mapCacheHas;
  MapCache.prototype.set = _mapCacheSet;

  var _MapCache = MapCache;

  /** Used to stand-in for `undefined` hash values. */

  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */

  /** Built-in value references. */
  var Uint8Array = _root.Uint8Array;

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = _Symbol ? _Symbol.prototype : undefined,
      symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */

  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike_1(value) && _baseGetTag(value) == argsTag;
  }

  var _baseIsArguments = baseIsArguments;

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$5.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$5.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = _baseIsArguments(function() { return arguments; }()) ? _baseIsArguments : function(value) {
    return isObjectLike_1(value) && hasOwnProperty$4.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  var stubFalse_1 = stubFalse;

  var isBuffer_1 = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? _root.Buffer : undefined;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse_1;

  module.exports = isBuffer;
  });

  /** Used as references for various `Number` constants. */

  /** Used as references for various `Number` constants. */

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */

  var _nodeUtil = createCommonjsModule(function (module, exports) {
  /** Detect free variable `exports`. */
  var freeExports = exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports && _freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule && freeModule.require && freeModule.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  module.exports = nodeUtil;
  });

  /* Node.js helper references. */
  var nodeIsTypedArray = _nodeUtil && _nodeUtil.isTypedArray;

  /** Used for built-in method references. */

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */

  /* Built-in method references that are verified to be native. */
  var DataView = _getNative(_root, 'DataView');

  var _DataView = DataView;

  /* Built-in method references that are verified to be native. */
  var Promise$1 = _getNative(_root, 'Promise');

  var _Promise = Promise$1;

  /* Built-in method references that are verified to be native. */
  var Set = _getNative(_root, 'Set');

  var _Set = Set;

  /* Built-in method references that are verified to be native. */
  var WeakMap = _getNative(_root, 'WeakMap');

  var _WeakMap = WeakMap;

  /** `Object#toString` result references. */
  var mapTag = '[object Map]',
      objectTag = '[object Object]',
      promiseTag = '[object Promise]',
      setTag = '[object Set]',
      weakMapTag = '[object WeakMap]';

  var dataViewTag = '[object DataView]';

  /** Used to detect maps, sets, and weakmaps. */
  var dataViewCtorString = _toSource(_DataView),
      mapCtorString = _toSource(_Map),
      promiseCtorString = _toSource(_Promise),
      setCtorString = _toSource(_Set),
      weakMapCtorString = _toSource(_WeakMap);

  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  var getTag = _baseGetTag;

  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
  if ((_DataView && getTag(new _DataView(new ArrayBuffer(1))) != dataViewTag) ||
      (_Map && getTag(new _Map) != mapTag) ||
      (_Promise && getTag(_Promise.resolve()) != promiseTag) ||
      (_Set && getTag(new _Set) != setTag) ||
      (_WeakMap && getTag(new _WeakMap) != weakMapTag)) {
    getTag = function(value) {
      var result = _baseGetTag(value),
          Ctor = result == objectTag ? value.constructor : undefined,
          ctorString = Ctor ? _toSource(Ctor) : '';

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString: return dataViewTag;
          case mapCtorString: return mapTag;
          case promiseCtorString: return promiseTag;
          case setCtorString: return setTag;
          case weakMapCtorString: return weakMapTag;
        }
      }
      return result;
    };
  }

  /**
   * A specialized version of `matchesProperty` for source values suitable
   * for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `clear`, `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || _MapCache);
    return memoized;
  }

  // Expose `MapCache`.
  memoize.Cache = _MapCache;

  var memoize_1 = memoize;

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /**
   * A specialized version of `_.memoize` which clears the memoized function's
   * cache when it exceeds `MAX_MEMOIZE_SIZE`.
   *
   * @private
   * @param {Function} func The function to have its output memoized.
   * @returns {Function} Returns the new memoized function.
   */
  function memoizeCapped(func) {
    var result = memoize_1(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });

    var cache = result.cache;
    return result;
  }

  var _memoizeCapped = memoizeCapped;

  /** Used to match property names within property paths. */
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath = _memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46 /* . */) {
      result.push('');
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  });

  /** Used to convert symbols to primitives and strings. */
  var symbolProto$1 = _Symbol ? _Symbol.prototype : undefined,
      symbolToString = symbolProto$1 ? symbolProto$1.toString : undefined;

  /**
   * The base implementation of `_.hasIn` without support for deep paths.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */

  const toBN = number => {
    try {
      return src$2(number);
    } catch (error) {
      throw new Error(`${error} Given value: "${number}"`);
    }
  };
  const toBN$1 = toBN;

  var abi=[{constant:true,inputs:[],name:"tub",outputs:[{name:"",type:"address"}],payable:false,stateMutability:"view",type:"function",signature:"0x34e70cc2"},{constant:false,inputs:[],name:"renounceOwnership",outputs:[],payable:false,stateMutability:"nonpayable",type:"function",signature:"0x715018a6"},{constant:true,inputs:[],name:"owner",outputs:[{name:"",type:"address"}],payable:false,stateMutability:"view",type:"function",signature:"0x8da5cb5b"},{constant:true,inputs:[],name:"isOwner",outputs:[{name:"",type:"bool"}],payable:false,stateMutability:"view",type:"function",signature:"0x8f32d59b"},{constant:true,inputs:[],name:"sai",outputs:[{name:"",type:"address"}],payable:false,stateMutability:"view",type:"function",signature:"0x9166cba4"},{constant:true,inputs:[{name:"",type:"bytes32"}],name:"cdps",outputs:[{name:"cdp",type:"bytes32"},{name:"policy",type:"address"},{name:"date",type:"uint256"},{name:"duration",type:"uint256"},{name:"collateral",type:"uint256"},{name:"debt",type:"uint256"}],payable:false,stateMutability:"view",type:"function",signature:"0xee527e8a"},{constant:false,inputs:[{name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],payable:false,stateMutability:"nonpayable",type:"function",signature:"0xf2fde38b"},{constant:true,inputs:[],name:"controller",outputs:[{name:"",type:"address"}],payable:false,stateMutability:"view",type:"function",signature:"0xf77c4791"},{inputs:[{name:"_controller",type:"address"},{name:"_tub",type:"address"},{name:"_sai",type:"address"}],payable:false,stateMutability:"nonpayable",type:"constructor",signature:"constructor"},{anonymous:false,inputs:[{indexed:true,name:"owner",type:"address"},{indexed:false,name:"cdp",type:"bytes32"},{indexed:false,name:"activationDate",type:"uint256"},{indexed:false,name:"duration",type:"uint256"},{indexed:false,name:"policy",type:"address"},{indexed:false,name:"price",type:"uint256"},{indexed:false,name:"liquidationPenalty",type:"uint256"},{indexed:false,name:"debt",type:"uint256"}],name:"ProtectionActivated",type:"event",signature:"0xbf2efd80b94cc742782c7f3b204cf8a7ce0cce62f0625ff42fa259f1557f1481"},{anonymous:false,inputs:[{indexed:true,name:"sender",type:"address"},{indexed:false,name:"owner",type:"address"},{indexed:false,name:"cdp",type:"bytes32"},{indexed:false,name:"activationDate",type:"uint256"}],name:"ProtectionCanceled",type:"event",signature:"0x975e27bb73361fee770082e17ff3e87da927fcd9324a9774247ae949b06d4513"},{anonymous:false,inputs:[{indexed:true,name:"owner",type:"address"},{indexed:false,name:"cdp",type:"bytes32"},{indexed:false,name:"activationDate",type:"uint256"},{indexed:false,name:"duration",type:"uint256"},{indexed:false,name:"policy",type:"address"},{indexed:false,name:"price",type:"uint256"},{indexed:false,name:"liquidationPenalty",type:"uint256"},{indexed:false,name:"debt",type:"uint256"}],name:"ProtectionChanged",type:"event",signature:"0x0a4c0bab3420a87441f7992ea15b3d918c8c098fe20caae4575042320b9bccdc"},{anonymous:false,inputs:[{indexed:true,name:"sender",type:"address"},{indexed:false,name:"owner",type:"address"},{indexed:false,name:"cdp",type:"bytes32"},{indexed:false,name:"activationDate",type:"uint256"}],name:"ProtectionErased",type:"event",signature:"0x9d4b9af11f7d9f93ced1e4e490a7205580a34fac414ccf5a42e5cde9d7bd5ce4"},{anonymous:false,inputs:[{indexed:true,name:"sender",type:"address"},{indexed:false,name:"owner",type:"address"},{indexed:false,name:"cdp",type:"bytes32"},{indexed:false,name:"activationDate",type:"uint256"}],name:"ProtectionExecuted",type:"event",signature:"0xe572e950d3d5f2573ae23236ce091804d0777d20354a0b37a1fad1b27b19b28a"},{anonymous:false,inputs:[{indexed:true,name:"previousOwner",type:"address"},{indexed:true,name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event",signature:"0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"},{constant:false,inputs:[{name:"_controller",type:"address"},{name:"_tub",type:"address"},{name:"_sai",type:"address"}],name:"initialize",outputs:[],payable:false,stateMutability:"nonpayable",type:"function",signature:"0xc0c53b8b"},{constant:false,inputs:[{name:"_cdp",type:"bytes32"},{name:"_debt",type:"uint256"},{name:"_duration",type:"uint256"},{name:"_policy",type:"address"}],name:"activateProtection",outputs:[],payable:false,stateMutability:"nonpayable",type:"function",signature:"0xd909a565"},{constant:false,inputs:[{name:"_cdp",type:"bytes32"}],name:"cancelProtection",outputs:[],payable:false,stateMutability:"nonpayable",type:"function",signature:"0xc45c73fd"},{constant:false,inputs:[{name:"_cdp",type:"bytes32"},{name:"_debt",type:"uint256"},{name:"_duration",type:"uint256"},{name:"_policy",type:"address"}],name:"changeProtection",outputs:[],payable:false,stateMutability:"nonpayable",type:"function",signature:"0xdf767613"},{constant:false,inputs:[{name:"_cdp",type:"bytes32"}],name:"eraseExpiredProtection",outputs:[],payable:false,stateMutability:"nonpayable",type:"function",signature:"0xae5eb166"},{constant:false,inputs:[{name:"_userProxy",type:"address"},{name:"_cdp",type:"bytes32"}],name:"executeProtectionPolicy",outputs:[],payable:false,stateMutability:"nonpayable",type:"function",signature:"0x3dc00196"},{constant:false,inputs:[{name:"tub",type:"address"},{name:"cup",type:"bytes32"},{name:"wad",type:"uint256"},{name:"otc",type:"address"}],name:"calcFee",outputs:[{name:"",type:"uint256"}],payable:false,stateMutability:"nonpayable",type:"function",signature:"0xc1a89969"},{constant:true,inputs:[{name:"_cdp",type:"bytes32"}],name:"calculateRefund",outputs:[{name:"",type:"uint256"}],payable:false,stateMutability:"view",type:"function",signature:"0x8c51f60f"},{constant:true,inputs:[{name:"_cdp",type:"bytes32"},{name:"_debt",type:"uint256"},{name:"_duration",type:"uint256"}],name:"isProtectionAvailable",outputs:[{name:"",type:"bool"}],payable:false,stateMutability:"view",type:"function",signature:"0xbb264b1a"},{constant:true,inputs:[{name:"_cdp",type:"bytes32"}],name:"isProtected",outputs:[{name:"",type:"bool"}],payable:false,stateMutability:"view",type:"function",signature:"0x4297329d"},{constant:true,inputs:[{name:"_cdp",type:"bytes32"}],name:"isExpired",outputs:[{name:"",type:"bool"}],payable:false,stateMutability:"view",type:"function",signature:"0x6db2feb2"},{constant:true,inputs:[{name:"_cdp",type:"bytes32"},{name:"_debt",type:"uint256"},{name:"_duration",type:"uint256"},{name:"_policy",type:"address"}],name:"changeProtectionPrice",outputs:[{name:"price",type:"uint256"},{name:"isRefund",type:"bool"}],payable:false,stateMutability:"view",type:"function",signature:"0xd5962006"},{constant:true,inputs:[{name:"_cdp",type:"bytes32"},{name:"_debt",type:"uint256"},{name:"_duration",type:"uint256"},{name:"_policy",type:"address"}],name:"protectionPrice",outputs:[{name:"",type:"uint256"},{name:"",type:"uint256"}],payable:false,stateMutability:"view",type:"function",signature:"0x561f6c3c"},{constant:true,inputs:[{name:"_cdp",type:"bytes32"},{name:"_debt",type:"uint256"},{name:"_duration",type:"uint256"}],name:"protectionPrice",outputs:[{name:"",type:"uint256"},{name:"",type:"uint256"}],payable:false,stateMutability:"view",type:"function",signature:"0x10cb799b"},{constant:true,inputs:[{name:"_cdp",type:"bytes32"}],name:"protectionDetails",outputs:[{name:"cdp_",type:"bytes32"},{name:"policy_",type:"address"},{name:"date_",type:"uint256"},{name:"duration_",type:"uint256"},{name:"price_",type:"uint256"},{name:"liquidationPenalty_",type:"uint256"}],payable:false,stateMutability:"view",type:"function",signature:"0xf821ad0f"},{constant:true,inputs:[],name:"policyRegistry",outputs:[{name:"",type:"address"}],payable:false,stateMutability:"view",type:"function",signature:"0x1c4dd7d0"},{constant:true,inputs:[],name:"getCurrentPolicy",outputs:[{name:"",type:"address"}],payable:false,stateMutability:"view",type:"function",signature:"0x0a715827"},{constant:true,inputs:[],name:"vault",outputs:[{name:"",type:"address"}],payable:false,stateMutability:"view",type:"function",signature:"0xfbfa77cf"}];

  var networks={"42":{events:{"0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0":{anonymous:false,inputs:[{indexed:true,name:"previousOwner",type:"address"},{indexed:true,name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event",signature:"0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0"}},links:{},address:"0x409ea6b3d2cC82D9003c96917C97577Ba46EC619",transactionHash:"0x5ffef32e608b1a823ba2aff4ceb52e49953879a1f6fc475ea706c93f4ebd7011"}};

  class SmartContract {
    static configure({
      contractName,
      abi,
      networks: artifacts
    }) {
      return async web3 => {
        // Obtain current network ID
        const [networkId, networkType] = await Promise.all([web3.eth.net.getId(), web3.eth.net.getNetworkType()]);

        if (!artifacts || !artifacts[`${networkId}`]) {
          throw Error(`${contractName} contract not available in ${networkType} (id:=${networkId})`);
        }

        const {
          address,
          transactionHash
        } = artifacts[`${networkId}`]; // Obtain block in which the contract was deployed

        let initialBlock = 0;

        if (transactionHash) {
          const tx = await web3.eth.getTransaction(transactionHash);
          initialBlock = tx.blockNumber;
        }

        return {
          address,
          initialBlock,
          jsonInterface: abi,
          networkType,
          web3
        };
      };
    } // Contract address


    constructor(_ref) {
      let {
        web3,
        jsonInterface
      } = _ref,
          options = _objectWithoutProperties(_ref, ["web3", "jsonInterface"]);

      _defineProperty(this, "address", void 0);

      _defineProperty(this, "networkType", void 0);

      _defineProperty(this, "initialBlock", 0);

      _defineProperty(this, "contract", void 0);

      _defineProperty(this, "web3", void 0);

      Object.assign(this, options);
      this.contract = new web3.eth.Contract(jsonInterface, options.address);
      this.web3 = web3;
    }

  }

  class PolicyService extends SmartContract {
    static async build(web3) {
      const builder = PolicyService.configure({
        contractName: 'PolicyService',
        abi,
        networks
      });
      const options = await builder(web3);
      return new PolicyService(options);
    }

    async getActiveProtections(options) {
      const policies = [];
      const events = await this.contract.getPastEvents('allEvents', _objectSpread({
        fromBlock: this.initialBlock
      }, options));
      events.filter(({
        event
      }) => event === 'ProtectionActivated' || event === 'ProtectionCanceled' || event === 'ProtectionChanged' || event === 'ProtectionErased' || event === 'ProtectionExecuted').reduce((cdpEvents, {
        event,
        returnValues
      }) => {
        const data = returnValues;

        if (!cdpEvents.has(data.cdp)) {
          cdpEvents.set(data.cdp, []);
        }

        cdpEvents.get(data.cdp).push(_objectSpread({
          event
        }, data));
        return cdpEvents;
      }, new Map()).forEach(cdpEvents => {
        const newestEvent = cdpEvents[cdpEvents.length - 1];

        if (newestEvent.event === 'ProtectionActivated' || newestEvent.event === 'ProtectionChanged') {
          const cdpId = toBN$1(newestEvent.cdp.toString()).toNumber();
          const activation = toBN$1(newestEvent.activationDate.toString()).toNumber() * ms('1s');
          const duration = toBN$1(newestEvent.duration.toString()).toNumber();
          const expiration = activation + duration * ms('1d');
          policies.push({
            activation,
            cdpId,
            debt: toBN$1(newestEvent.debt.toString()),
            duration,
            expiration,
            liquidationPenalty: toBN$1(newestEvent.liquidationPenalty.toString()),
            owner: newestEvent.owner,
            policy: newestEvent.policy,
            price: toBN$1(newestEvent.price.toString())
          });
        }
      });
      return policies;
    }

    async getActivationEvents(options) {
      const events = await this.contract.getPastEvents('ProtectionActivated', _objectSpread({
        fromBlock: this.initialBlock
      }, options));
      const activationEvents = await Promise.all(events.map(async ({
        event,
        returnValues,
        blockNumber
      }) => {
        const timestamp = (await this.web3.eth.getBlock(blockNumber)).timestamp * ms('1s');
        const data = returnValues;
        return {
          activation: toBN$1(data.activationDate.toString()).toNumber() * ms('1s'),
          blockNumber,
          cdp: toBN$1(data.cdp.toString()).toNumber(),
          debt: toBN$1(data.debt.toString()),
          duration: toBN$1(data.duration.toString()).toNumber(),
          liquidationPenalty: toBN$1(data.liquidationPenalty.toString()),
          owner: data.owner,
          policy: data.policy,
          price: toBN$1(data.price.toString()),
          timestamp
        };
      }));
      return activationEvents;
    }

    async getChangeEvents(options) {
      const events = await this.contract.getPastEvents('ProtectionChanged', _objectSpread({
        fromBlock: this.initialBlock
      }, options));
      const adjusmentEvents = await Promise.all(events.map(async ({
        event,
        returnValues,
        blockNumber
      }) => {
        const timestamp = (await this.web3.eth.getBlock(blockNumber)).timestamp * ms('1s');
        const data = returnValues;
        return {
          activation: toBN$1(data.activationDate.toString()).toNumber() * ms('1s'),
          blockNumber,
          cdp: toBN$1(data.cdp.toString()).toNumber(),
          debt: toBN$1(data.debt.toString()),
          duration: toBN$1(data.duration.toString()).toNumber(),
          liquidationPenalty: toBN$1(data.liquidationPenalty.toString()),
          owner: data.owner,
          policy: data.policy,
          price: toBN$1(data.price.toString()),
          timestamp
        };
      }));
      return adjusmentEvents;
    }

    async getCancellationEvents(options) {
      const events = await this.contract.getPastEvents('ProtectionCanceled', _objectSpread({
        fromBlock: this.initialBlock
      }, options));
      const cancelEvents = await Promise.all(events.map(async ({
        event,
        returnValues,
        blockNumber
      }) => {
        const timestamp = (await this.web3.eth.getBlock(blockNumber)).timestamp * ms('1s');
        const data = returnValues;
        return {
          activation: toBN$1(data.activationDate.toString()).toNumber() * ms('1s'),
          blockNumber,
          cdp: toBN$1(data.cdp.toString()).toNumber(),
          owner: data.sender,
          timestamp
        };
      }));
      return cancelEvents;
    }

    async getEraseEvents(options) {
      const events = await this.contract.getPastEvents('ProtectionErased', _objectSpread({
        fromBlock: this.initialBlock
      }, options));
      const eraseEvents = await Promise.all(events.map(async ({
        event,
        returnValues,
        blockNumber
      }) => {
        const timestamp = (await this.web3.eth.getBlock(blockNumber)).timestamp * ms('1s');
        const data = returnValues;
        return {
          activation: toBN$1(data.activationDate.toString()).toNumber() * ms('1s'),
          blockNumber,
          cdp: toBN$1(data.cdp.toString()).toNumber(),
          owner: data.owner,
          timestamp
        };
      }));
      return eraseEvents;
    }

    async getExecutionEvents(options) {
      const events = await this.contract.getPastEvents('ProtectionExecuted', _objectSpread({
        fromBlock: this.initialBlock
      }, options));
      const executionEvents = await Promise.all(events.map(async ({
        event,
        returnValues,
        blockNumber
      }) => {
        const timestamp = (await this.web3.eth.getBlock(blockNumber)).timestamp * ms('1s');
        const data = returnValues;
        return {
          activation: toBN$1(data.activationDate.toString()).toNumber() * ms('1s'),
          blockNumber,
          cdp: toBN$1(data.cdp.toString()).toNumber(),
          owner: data.owner,
          timestamp
        };
      }));
      return executionEvents;
    }

  }

  exports.PolicyService = PolicyService;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.umd.js.map
