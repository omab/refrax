/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const pluralize = require('pluralize');
const RefraxTools = require('RefraxTools');
const RefraxTreeNode = require('RefraxTreeNode');
const RefraxSchemaNode = require('RefraxSchemaNode');
const RefraxSchemaNodeAccessor = require('RefraxSchemaNodeAccessor');
const RefraxSchemaTools = require('RefraxSchemaTools');
const RefraxConstants = require('RefraxConstants');
const CLASSIFY_COLLECTION = RefraxConstants.classify.collection;
const CLASSIFY_ITEM = RefraxConstants.classify.item;


function createSchemaCollection(path, store, options) {
  var treeNodeCollection, accessorNodeCollection
    , treeNodeMember
    , memberIdentifier, memberId
    , identifier;

  if (RefraxTools.isPlainObject(store) && !options) {
    options = store;
    store = null;
  }

  path = RefraxSchemaTools.validatePath('createSchemaCollection', path);
  options = options || {};
  identifier = options.identifier || RefraxTools.cleanIdentifier(path);
  store = RefraxSchemaTools.defaultStore('createSchemaCollection', store, identifier);

  // Collection Node

  treeNodeCollection = new RefraxTreeNode(RefraxTools.extend({
    uri: path,
    classify: CLASSIFY_COLLECTION
  }, options.collection));

  accessorNodeCollection = new RefraxSchemaNodeAccessor(
    new RefraxSchemaNode([store, treeNodeCollection], identifier)
  );

  // Member Node

  memberIdentifier = pluralize.singular(identifier);
  if (memberIdentifier == identifier) {
    memberIdentifier = 'member';
    memberId = identifier + 'Id';
  }
  else {
    memberId = memberIdentifier + 'Id';
  }

  treeNodeMember = new RefraxTreeNode(RefraxTools.extend({
    paramId: memberId,
    classify: CLASSIFY_ITEM
  }, options.member));

  accessorNodeCollection.addLeaf(
    new RefraxSchemaNode(treeNodeMember, memberIdentifier)
  );

  return accessorNodeCollection;
}

export default createSchemaCollection;
