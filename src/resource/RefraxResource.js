/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxTools = require('RefraxTools');
const RefraxConstants = require('RefraxConstants');
const RefraxResourceBase = require('RefraxResourceBase');
const invokeDescriptor = require('invokeDescriptor');
const STATUS_STALE = RefraxConstants.status.STALE;
const TIMESTAMP_LOADING = RefraxConstants.timestamp.loading;
const ResourceMap = new WeakMap();


/**
 * RefraxResource is a public facing interface class to querying a Schema Node.
 */
class RefraxResource extends RefraxResourceBase {
  static from(accessor, ...args) {
    return new RefraxResource(accessor, ...args);
  }

  get timestamp() {
    return ResourceMap.get(this).timestamp;
  }

  get status() {
    return ResourceMap.get(this).status;
  }

  get data() {
    return ResourceMap.get(this).data;
  }

  constructor(accessor, ...args) {
    super(accessor, ...args);

    var self = this
      , descriptor;

    Object.defineProperty(this, '_disposers', {value: []});

    descriptor = this._generateDescriptor();

    if (this._options.noSubscribe !== true && descriptor.store) {
      this._disposers.push(
        descriptor.store.subscribe(descriptor.event, function(event) {
          self._fetch();
          if (event.noPropagate !== true) {
            self.emit('change', self, event);
          }
        })
      );
    }

    if (this._options.invalidate) {
      // shortcut for no options
      if (this._options.invalidate === true) {
        this._options.invalidate = {noPropagate: true};
      }

      // this.invalidate(this._options.invalidate);
    }

    this._fetch();
  }

  _dispose() {
    ResourceMap.delete(this);

    RefraxTools.each(this._disposers, function(disposer) {
      disposer();
    });
    this._disposers.length = 0;

    return this;
  }

  _fetch() {
    var descriptor
      , result = {};

    descriptor = this._generateDescriptor();
    if (!descriptor.store) {
      return result;
    }

    result = invokeDescriptor.fetch(descriptor, this._options.noFetchGet);

    // TODO should this be Cache responsibility?
    if (!result.data && descriptor.coerce) {
      if (descriptor.coerce === 'collection') {
        result.data = [];
      }
    }

    ResourceMap.set(this, result);
    return result;
  }

  invalidate(options) {
    var descriptor = this._generateDescriptor();

    if (descriptor.store) {
      descriptor.store.invalidate(descriptor, options);
    }
  }

  isLoading() {
    return this.timestamp === TIMESTAMP_LOADING;
  }

  isStale() {
    return this.status === STATUS_STALE;
  }

  hasData() {
    return !!this.data;
  }
}

export default RefraxResource;
