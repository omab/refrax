/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxTools = require('RefraxTools');


/**
 * A RefraxPath is a wrapper around a string to identify it as a uri path.
 */
class RefraxPath {
  constructor(path, isModifier) {
    this.path = RefraxTools.cleanPath(path);
    this.isModifier = !!isModifier;
  }
}

export default RefraxPath;
