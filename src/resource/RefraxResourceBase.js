/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const mixinSubscribable = require('mixinSubscribable');
const RefraxOptions = require('RefraxOptions');
const RefraxParameters = require('RefraxParameters');
const RefraxPath = require('RefraxPath');
const RefraxResourceDescriptor = require('RefraxResourceDescriptor');
const RefraxTools = require('RefraxTools');
const RefraxConstants = require('RefraxConstants');
const ACTION_GET = RefraxConstants.action.get;


/**
 * RefraxResource is a public facing interface class to querying a Schema Node.
 */
class RefraxResourceBase {
  constructor(accessor, ...args) {
    var i, arg
      , options = {}
      , stack = [];

    for (i=0; i<args.length; i++) {
      arg = args[i];
      if (arg === undefined || arg === null) {
        continue;
      }
      else if (typeof(arg) === 'string' || arg instanceof RefraxPath) {
        stack.push(new RefraxPath(arg));
      }
      else if (arg instanceof RefraxOptions) {
        RefraxTools.extend(options, arg);
      }
      else if (RefraxTools.isPlainObject(arg)) {
        if (arg.options) {
          RefraxTools.extend(options, arg.options);
          arg.options = undefined;
        }
        stack.push(new RefraxParameters(arg));
      }
      else {
        console.warn('RefraxResourceBase: unexpected argument `' + arg + '` passed to constructor.');
      }
    }

    mixinSubscribable(this);

    Object.defineProperty(this, '_accessorStack', {value: accessor.__stack});
    Object.defineProperty(this, '_stack', {value: stack});
    Object.defineProperty(this, '_options', {value: options});
  }

  _generateDescriptor(action, data) {
    var runtimeParams = [];

    if (this._options.paramsGenerator) {
      runtimeParams.push(new RefraxParameters(this._options.paramsGenerator()));
    }

    if (this._options.params) {
      runtimeParams.push(new RefraxParameters(this._options.params));
    }

    // params intentionally comes before our stack so paramsGenerator params
    // can get overridden if needed
    return new RefraxResourceDescriptor(action || ACTION_GET, [].concat(
      this._accessorStack,
      runtimeParams,
      this._stack,
      data || []
    ));
  }
}

export default RefraxResourceBase;
