/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */


class RefraxSchemaNode {
  constructor(payload, identifier) {
    if (identifier && typeof(identifier) !== 'string') {
      throw new TypeError(
        'RefraxSchemaNode - A identifier argument can only be of type `String`, ' +
        'but found type `' + typeof(identifier)+ '`.'
      );
    }

    Object.defineProperty(this, 'payload', {value: payload});
    Object.defineProperty(this, 'leafs', {value: {}});
    // TODO: are we mutable?
    this.identifier = identifier;
  }
}

export default RefraxSchemaNode;
