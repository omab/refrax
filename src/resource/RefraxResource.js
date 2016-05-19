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
const MediaryFetches = new WeakMap();


/**
 * RefraxResource is a public facing interface class to querying a Schema Node.
 */
class RefraxResource extends RefraxResourceBase {
  get timestamp() {
    return MediaryFetches.get(this).timestamp;
  }

  get status() {
    return MediaryFetches.get(this).status;
  }

  get data() {
    return MediaryFetches.get(this).data;
  }

  constructor(accessor, ...args) {
    super(accessor, ...args);

    var self = this
      , descriptor;

    Object.defineProperty(this, '_disposers', {value: []});

    descriptor = this._generateDescriptor();

    if (descriptor.store) {
      this._disposers.push(
        descriptor.store.subscribe(descriptor.event, function() {
          self._fetch();
          self.emit('change', self);
        })
      );
    }

    this._fetch();
  }

  _dispose() {
    RefraxTools.each(this._disposers, function(disposer) {
      disposer();
    });
    this._disposers.length = 0;

    return this;
  }

  _fetch() {
    var descriptor
      , result;

    descriptor = this._generateDescriptor();
    if (!descriptor.store) {
      return;
    }

    result = invokeDescriptor.fetch(descriptor, this._options.noFetchGet);

    // TODO should this be Cache responsibility?
    if (!result.data && descriptor.coerce) {
      if (descriptor.coerce === 'collection') {
        result.data = [];
      }
    }

    MediaryFetches.set(this, result);
  }

  invalidate(opts) {
    this._resourceDescriptor.store.invalidate(opts);
  }

  isLoading() {
    return this.timestamp === TIMESTAMP_LOADING &&
           this.status === STATUS_STALE;
  }

  isUpdating() {
    return this.timestamp === TIMESTAMP_LOADING &&
           this.status !== STATUS_STALE;
  }

  hasData() {
    return RefraxTools.keysFor(this.data).length != 0;
  }

  isStale() {
    return this.status !== STATUS_STALE;
  }
}

export default RefraxResource;
