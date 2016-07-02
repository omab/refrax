/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxTools = require('RefraxTools');


/**
 * A RefraxQueryParameters is a wrapper around an object to identify it as a
 * set of query parameters.
 */
class RefraxQueryParameters {
  constructor(options) {
    if (!RefraxTools.isPlainObject(options)) {
      throw new TypeError(
        'RefraxQueryParameters expected argument of type `Object`\n\r' +
        'found: `' + options + '`'
      );
    }

    RefraxTools.extend(this, options);
  }
}

export default RefraxQueryParameters;
