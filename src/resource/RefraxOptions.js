/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxTools = require('RefraxTools');


/**
 * A RefraxOptions is a wrapper around an object to identify it as a set of options.
 */
class RefraxOptions {
  constructor(options) {
    RefraxTools.extend(this, options);
  }
}

export default RefraxOptions;