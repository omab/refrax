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


function createNamespace(path, options) {
  var treeNode, accessorNode, identifier;

  RefraxSchemaTools.validatePath('createNamespace', path);

  options = options || {};
  identifier = RefraxTools.cleanIdentifier(path);

  treeNode = new RefraxTreeNode(RefraxTools.extend({
    uri: path
  }, options));

  accessorNode = new RefraxSchemaNodeAccessor(
    new RefraxSchemaNode(treeNode, identifier)
  );

  return accessorNode;
}

export default createNamespace;
