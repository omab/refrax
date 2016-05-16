/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxResourceBase = require('RefraxResourceBase');
const RefraxSchemaNodeAccessor = require('RefraxSchemaNodeAccessor');
const invokeDescriptor = require('invokeDescriptor');


/**
 * RefraxMutableResource is a public facing interface class to querying a Schema Node.
 */
class RefraxMutableResource extends RefraxResourceBase {
  static from(accessor, ...args) {
    return new RefraxMutableResource(accessor, ...args);
  }

  constructor(accessor, ...args) {
    if (!(accessor instanceof RefraxSchemaNodeAccessor)) {
      throw new TypeError(
        'RefraxMutableResource - Expected accessor of type RefraxSchemaNodeAccessor ' +
        'but found `' + typeof(accessor) + '`'
      );
    }

    super(accessor, ...args);
  }

  create(params) {
    return invokeDescriptor.create(this._generateDescriptor(params));
  }

  destroy(params) {
    return invokeDescriptor.destroy(this._generateDescriptor(params));
  }

  update(params) {
    return invokeDescriptor.update(this._generateDescriptor(params));
  }
}

export default RefraxMutableResource;
