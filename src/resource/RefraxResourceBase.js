/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxTools = require('RefraxTools');
const RefraxParameters = require('RefraxParameters');
const RefraxPath = require('RefraxPath');
const mixinSubscribable = require('mixinSubscribable');
const RefraxResourceDescriptor = require('RefraxResourceDescriptor');


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
      console.info("RefraxResourceBase found arg: %o", arg);
      if (typeof(arg) === 'string') {
        stack.push(new RefraxPath(arg));
      }
      else if (RefraxTools.isPlainObject(arg)) {
        RefraxTools.extend(options, arg);
      }
    }

    mixinSubscribable(this);

    Object.defineProperty(this, '_stack', {value: accessor.__stack.concat(stack)});
    Object.defineProperty(this, '_options', {value: options});
  }

  _generateDescriptor(params) {
    var stack = this._stack.slice();

    if (this._options.paramsGenerator) {
      stack.push(new RefraxParameters(this._options.paramsGenerator()));
    }

    if (this._options.params) {
      stack.push(new RefraxParameters(this._options.params));
    }

    if (params) {
      stack.push(params);
    }

    console.info('_generateDescriptor from stack: %o', stack);
    return new RefraxResourceDescriptor(stack);
  }
}

export default RefraxResourceBase;
