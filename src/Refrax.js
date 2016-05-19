/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxSchema = require('RefraxSchema');
const RefraxConfig = require('RefraxConfig');
const RefraxTools = require('RefraxTools');
const RefraxResource = require('RefraxResource');
const RefraxMutableResource = require('RefraxMutableResource');
const createAction = require('createAction');
const createCollection = require('createCollection');
const createResource = require('createResource');
const createNamespace = require('createNamespace');
const processResponse = require('processResponse');
const RefraxStore = require('RefraxStore');


export default {
  Config: RefraxConfig,
  Store: RefraxStore.get,
  resetStore: RefraxStore.reset,
  Schema: RefraxSchema,
  Tools: RefraxTools,
  createAction,
  createCollection,
  createResource,
  createNamespace,
  processResponse,
  Resource: RefraxResource,
  MutableResource: RefraxMutableResource
};
