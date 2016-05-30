/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const Promise = require('bluebird');
const Axios = require('axios');
const RefraxTools = require('RefraxTools');
const RefraxConstants = require('RefraxConstants');
const processResponse = require('processResponse');
const STATUS_COMPLETE = RefraxConstants.status.COMPLETE;
const STATUS_STALE = RefraxConstants.status.STALE;
const TIMESTAMP_LOADING = RefraxConstants.timestamp.loading;
const ACTION_FETCH = RefraxConstants.action.fetch;
const ACTION_SAVE = RefraxConstants.action.save;
const ACTION_DELETE = RefraxConstants.action.delete;


// We only quietly consume RequestError's
Promise.onPossiblyUnhandledRejection(function(err, promise) {
  if (err instanceof RequestError) {
    return;
  }
  throw err;
});

function RequestError(message, response) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this);
  }
  this.message = '' + message;
  this.response = response;
  this.name = 'RequestError';
}
RequestError.prototype = Object.create(Error.prototype);

/**
 * Given a known Store update a resource descriptors data and repeat with
 * any embedded data.
 */
function updateStoreResource(store, resourceDescriptor, data, action) {
  if (action == ACTION_FETCH) {
    processResponse(data, resourceDescriptor);
  }
  else if (action == ACTION_DELETE) {
    store.destroyResource(resourceDescriptor);
  }
  else {
    store.updateResource(resourceDescriptor, data, STATUS_COMPLETE);
  }
}

function makeRequest(method, resourceDescriptor, action, touchParams, noTouchNotify) {
  var store = resourceDescriptor.store
    , requestConfig = {
      method: method,
      url: resourceDescriptor.path,
      data: resourceDescriptor.payload
    };

  touchParams = RefraxTools.extend({timestamp: TIMESTAMP_LOADING}, touchParams || {});

  store.touchResource(resourceDescriptor, touchParams, noTouchNotify);

  return new Promise(function(resolve, reject) {
    // eslint-disable-next-line new-cap
    Axios(requestConfig)
      .then(function(response) {
        var data = response && response.data || {};

        updateStoreResource(store, resourceDescriptor, data, action);
        resolve(response);
      }, function(response) {
        store.touchResource(resourceDescriptor, {timestamp: Date.now()});
        reject(new RequestError(response.statusText, response));
      })
      .catch(function(err) {
        console.assert(false, err);
      });
  });
}

export function get(resourceDescriptor, noTouchNotify) {
  return makeRequest('get',
                     resourceDescriptor,
                     ACTION_FETCH,
                     {status: STATUS_STALE},
                     noTouchNotify);
}

export function create(resourceDescriptor) {
  return makeRequest('post',
                     resourceDescriptor,
                     ACTION_SAVE);
}

export function update(resourceDescriptor) {
  return makeRequest('put',
                     resourceDescriptor,
                     ACTION_SAVE);
}

export function destroy(resourceDescriptor) {
  return makeRequest('delete',
                     resourceDescriptor,
                     ACTION_DELETE);
}

export function fetch(resourceDescriptor, noFetchGet) {
  var store = resourceDescriptor.store
    , resource = store.fetchResource(resourceDescriptor);

  if (!noFetchGet && resource.timestamp < TIMESTAMP_LOADING) {
    this.get(resourceDescriptor, true);
    resource = store.fetchResource(resourceDescriptor);
  }

  return resource;
}
