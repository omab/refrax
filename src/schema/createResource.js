/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxTools = require('RefraxTools');
const RefraxTreeNode = require('RefraxTreeNode');
const RefraxStore = require('RefraxStore');
const RefraxSchemaNode = require('RefraxSchemaNode');
const RefraxSchemaNodeAccessor = require('RefraxSchemaNodeAccessor');


function createResource(literal, store, options) {
  var treeNode, accessorNode;

  options = options || {};

  if (!literal || typeof(literal) !== 'string' || literal.length === 0) {
    throw new TypeError(
      'createResource - A valid literal must be passed, but found type `' + typeof(literal)+ '` with value `' + literal + '`.'
    );
  }

  if (!store || !(typeof(store) === 'string' || store instanceof RefraxStore)) {
    throw new TypeError(
      'createResource - A valid store reference of either a `String` or `Store` type must be passed, ' +
      'but found type `' + typeof(store)+ '`.'
    );
  }

  if (typeof(store) === 'string') {
    store = RefraxStore.get(store);
  }

  treeNode = new RefraxTreeNode(RefraxTools.extend({
    uri: literal,
    coerce: 'item'
  }, options));

  literal = RefraxTools.cleanIdentifier(literal);

  accessorNode = new RefraxSchemaNodeAccessor(
    new RefraxSchemaNode([store, treeNode], literal)
  );

  return accessorNode;
}

export default createResource;
