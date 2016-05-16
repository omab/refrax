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


function createResource(path, store, options) {
  var treeNode, accessorNode, identifier;

  RefraxSchemaTools.validatePath('createResource', path);

  options = options || {};
  identifier = RefraxTools.cleanIdentifier(path);
  store = RefraxSchemaTools.defaultStore('createCollection', store, identifier);

  treeNode = new RefraxTreeNode(RefraxTools.extend({
    uri: path,
    coerce: 'item'
  }, options));

  accessorNode = new RefraxSchemaNodeAccessor(
    new RefraxSchemaNode([store, treeNode], identifier)
  );

  return accessorNode;
}

export default createResource;
