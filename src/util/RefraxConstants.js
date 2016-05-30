/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
export default {
  status: {
    COMPLETE: 'complete',
    PARTIAL: 'partial',
    STALE: 'stale'
  },
  defaultFragment: 'full',
  timestamp: {
    stale: -1,
    loading: 0
  },
  action: {
    fetch: 'GET',
    save: 'SAVE',
    delete: 'DELETE'
  },
  coerce: {
    collection: 'collection',
    item: 'item'
  }
};
