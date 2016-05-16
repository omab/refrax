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


function createNamespace(literal, options) {
  var treeNode, accessorNode;

  options = options || {};

  if (!literal || typeof(literal) !== 'string' || literal.length === 0) {
    throw new TypeError(
      'createNamespace - A valid literal must be passed, but found type `' + typeof(literal)+ '` with value `' + literal + '`.'
    );
  }

  treeNode = new RefraxTreeNode(RefraxTools.extend({
    uri: literal
  }, options));

  accessorNode = new RefraxSchemaNodeAccessor(
    new RefraxSchemaNode(treeNode, literal)
  );

  return accessorNode;
}

export default createNamespace;
