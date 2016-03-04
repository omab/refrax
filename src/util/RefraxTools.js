/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
export var objToString = Object.prototype.toString;

// eslint-disable-next-line one-var
export var setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
  // eslint-disable-next-line no-proto
  obj.__proto__ = proto;
  return obj;
};

// eslint-disable-next-line one-var
export var keysFor = Object.keys || function(obj) {
  var keys = []
    , key;

  if (typeof(obj) !== 'object') {
    return [];
  }

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      keys.push(key);
    }
  }

  return keys;
};

export function isObject(obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
}

export function isFunction(value) {
  return typeof value === 'function';
}

export function isArray(obj) {
  return isObject(obj) && objToString.call(obj) === '[object Array]';
}

export function isPlainObject(obj) {
  return typeof(obj) === 'object' && objToString.call(obj) === '[object Object]';
}

export function extend(obj) {
  var length = arguments.length
    , index
    , i, l
    , source
    , keys
    , key;

  if (length < 2 || obj === null) {
    return obj;
  }

  for (index = 1; index < length; index++) {
    if (!(source = arguments[index])) {
      continue;
    }

    keys = keysFor(source);
    l = keys.length;

    for (i = 0; i < l; i++) {
      key = keys[i];
      obj[key] = source[key];
    }
  }
  return obj;
}

export function each(obj, iteratee) {
  var i, length, keys;

  if (isArray(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      iteratee(obj[i], i, obj);
    }
  }
  else {
    keys = keysFor(obj);
    for (i = 0, length = keys.length; i < length; i++) {
      iteratee(obj[keys[i]], keys[i], obj);
    }
  }
  return obj;
}

export function select(obj, predicate) {
  var results = [];

  each(obj, function(value, index, list) {
    if (predicate(value, index, list)) {
      results.push(value);
    }
  });
  return results;
}

export function any(obj, predicate) {
  var i, length, keys;

  if (isArray(obj)) {
    for (i = 0, length = obj.length; i < length; i++) {
      if (predicate(obj[i], i, obj)) {
        return true;
      }
    }
  }
  else {
    keys = keysFor(obj);
    for (i = 0, length = keys.length; i < length; i++) {
      if (predicate(obj[keys[i]], keys[i], obj)) {
        return true;
      }
    }
  }
  return false;
}

export function map(obj, iteratee) {
  var keys = !isArray(obj) && keysFor(obj)
    , length = (keys || obj).length
    , results = Array(length)
    , index
    , currentKey;

  for (index = 0; index < length; index++) {
    currentKey = keys ? keys[index] : index;
    results[index] = iteratee(obj[currentKey], currentKey, obj);
  }
  return results;
}

export function concatUnique(src, values) {
  var results = [].concat(src || [])
    , i;

  values = values || [];
  for (i = 0; i < values.length; i++) {
    if (results.indexOf(values[i]) == -1) {
      results.push(values[i]);
    }
  }
  return results;
}

export function deepCopy(obj) {
  var out
    , i
    , length
    , keys;

  if (objToString.call(obj) === '[object Array]') {
    length = obj.length;
    out = [];
    for (i = 0; i < length; i++) {
      out[i] = deepCopy(obj[i]);
    }
    return out;
  }
  else if (typeof obj === 'object') {
    keys = keysFor(obj);
    length = keys.length;
    out = {};
    for (i = 0; i < length; i++) {
      out[i] = deepCopy(obj[i]);
    }
    return out;
  }
  return obj;
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase()+string.slice(1);
}

export function nextTick(callback) {
  setTimeout(callback, 0);
}

export function randomString(length) {
  var str = ''
    , min = 0
    , max = 62
    , i, r;

  for (i = 0; i < length; i++) {
    // eslint-disable-next-line no-bitwise
    r = Math.random() * (max - min) + min << 0;
    r+= r > 9 ? (r < 36 ? 55 : 61) : 48;
    str += String.fromCharCode(r);
  }
  return str;
}