/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const Refrax = require('Refrax');
const RefraxConstants = require('RefraxConstants');
const RefraxResourceDescriptor = require('RefraxResourceDescriptor');
const RefraxTools = require('RefraxTools');
const COERCE_COLLECTION = RefraxConstants.coerce.collection;
const COERCE_ITEM = RefraxConstants.coerce.item;


exports.deleteStores = function() {
  for (var key in Refrax.Store.all) {
    delete Refrax.Store.all[key];
  }
};

export function descriptorFrom(params) {
  var descriptor = new RefraxResourceDescriptor();
  descriptor.basePath = params.path || descriptor.path;
  RefraxTools.extend(descriptor, params);
  return descriptor;
}

export function descriptorCollection(params) {
  return RefraxTools.extend(descriptorFrom(params), {
    coerce: COERCE_COLLECTION
  });
}

export function descriptorCollectionItem(params) {
  return RefraxTools.extend(descriptorFrom(params), {
    coerce: COERCE_ITEM
  });
}
