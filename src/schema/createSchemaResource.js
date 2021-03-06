/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxTools = require('RefraxTools');
const RefraxTreeNode = require('RefraxTreeNode');
const RefraxSchemaNode = require('RefraxSchemaNode');
const RefraxSchemaNodeAccessor = require('RefraxSchemaNodeAccessor');
const RefraxSchemaTools = require('RefraxSchemaTools');
const RefraxConstants = require('RefraxConstants');
const CLASSIFY_RESOURCE = RefraxConstants.classify.resource;


function createSchemaResource(path, store, options) {
  var treeNode, accessorNode, identifier;

  if (RefraxTools.isPlainObject(store)) {
    options = store;
    store = null;
  }

  path = RefraxSchemaTools.validatePath('createSchemaResource', path);
  options = options || {};
  identifier = options.identifier || RefraxTools.cleanIdentifier(path);
  store = RefraxSchemaTools.defaultStore('createCollection', identifier, store);

  treeNode = new RefraxTreeNode(RefraxTools.extend({
    uri: path,
    classify: CLASSIFY_RESOURCE
  }, options.resource));

  accessorNode = new RefraxSchemaNodeAccessor(
    new RefraxSchemaNode([store, treeNode], identifier)
  );

  return accessorNode;
}

export default createSchemaResource;
