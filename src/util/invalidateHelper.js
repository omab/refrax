/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxTools = require('RefraxTools');


function invalidateHelper(items, options = {}) {
  items = [].concat(items || []);

  RefraxTools.each(items, function(item) {
    item.invalidate(options);
  });
}

export default invalidateHelper;
