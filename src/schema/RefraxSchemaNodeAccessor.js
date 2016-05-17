/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxTools = require('RefraxTools');
const RefraxSchemaNode = require('RefraxSchemaNode');
const RefraxResourceDescriptor = require('RefraxResourceDescriptor');

const SchemaAccescessorMixins = [];

// Determine if a stack matches the ending of another
function compareStack(part, stack) {
  stack = stack.slice(Math.max(stack.length - part.length, 1));
  return JSON.stringify(part) === JSON.stringify(stack);
}

function enumerateLeafs(node, stack, action) {
  RefraxTools.each(node.leafs, function(leaf, key) {
    action(key, leaf, [].concat(stack, leaf.payload));
  });

  RefraxTools.each(node.leafs_detached, function(detached, key) {
    if (compareStack(detached.stack, stack)) {
      action(key, detached.leaf, [].concat(stack, detached.leaf.payload));
    }
  });
}

class RefraxSchemaNodeAccessor {
  constructor(node, parent, stack) {
    var self = this;

    if (!(node instanceof RefraxSchemaNode)) {
      throw new TypeError(
        'RefraxSchemaNodeAccessor - Expected node of type RefraxSchemaNode but found `' + typeof(node) + '`'
      );
    }

    if (!stack) {
      stack = [].concat(node.payload || []);
    }

    Object.defineProperty(this, '__node', {value: node});
    Object.defineProperty(this, '__parent', {value: parent});
    Object.defineProperty(this, '__stack', {value: stack});

    RefraxTools.each(SchemaAccescessorMixins, function(mixin) {
      RefraxTools.extend(this, mixin);
    });

    enumerateLeafs(node, stack, function(key, leaf, leafStack) {
      Object.defineProperty(self, key, {
        get: function() {
          return new RefraxSchemaNodeAccessor(leaf, node, leafStack);
        }
      });
    });
  }

  inspect() {
    var node = this.__node
      , stack = this.__stack || []
      , result = {};

    enumerateLeafs(node, stack, function(key, leaf, leafStack) {
      var descriptor = new RefraxResourceDescriptor(leafStack, false);
      result[descriptor.path] = descriptor.store && descriptor.store.definition.type;
      RefraxTools.extend(result, new RefraxSchemaNodeAccessor(leaf, node, leafStack).inspect());
    });

    return result;
  }

  addLeaf(identifier, leaf) {
    var node = this.__node
      , stack = this.__stack;

    if (!leaf) {
      leaf = identifier;
      identifier = null;
    }

    if (leaf instanceof RefraxSchemaNodeAccessor) {
      leaf = leaf.__node;
    }
    else if (!(leaf instanceof RefraxSchemaNode)) {
      throw new TypeError(
        'RefraxSchemaNodeAccessor:addLeaf - Expected leaf of type RefraxSchemaNodeAccessor or RefraxSchemaNode'
      );
    }

    if (!identifier && !(identifier = leaf.identifier)) {
      throw new TypeError(
        'RefraxSchemaNodeAccessor:addLeaf - Failed to add leaf with no inherit identifier.'
      );
    }

    identifier = RefraxTools.cleanIdentifier(identifier);
    node.leafs[identifier] = leaf;

    Object.defineProperty(this, identifier, {
      get() {
        return new RefraxSchemaNodeAccessor(leaf, node, [].concat(stack || [], leaf.payload));
      }
    });

    return new RefraxSchemaNodeAccessor(leaf, this.__parent);
  }

  addDetachedLeaf(identifier, leaf) {
    var node = this.__node
      , stack = this.__stack;

    if (!leaf) {
      leaf = identifier;
      identifier = null;
    }

    if (leaf instanceof RefraxSchemaNodeAccessor) {
      leaf = leaf.__node;
    }
    else if (!(leaf instanceof RefraxSchemaNode)) {
      throw new TypeError(
        'RefraxSchemaNodeAccessor:addLeaf - Expected leaf of type RefraxSchemaNodeAccessor or RefraxSchemaNode'
      );
    }

    if (!identifier && !(identifier = leaf.identifier)) {
      throw new TypeError(
        'RefraxSchemaNodeAccessor:addLeaf - Failed to add leaf with no inherit identifier.'
      );
    }

    identifier = RefraxTools.cleanIdentifier(identifier);
    node.leafs_detached[identifier] = {stack: stack, leaf: leaf};

    Object.defineProperty(this, identifier, {
      get() {
        return new RefraxSchemaNodeAccessor(leaf, node, [].concat(stack || [], leaf.payload));
      }
    });

    return new RefraxSchemaNodeAccessor(leaf, this.__parent);
  }
}

RefraxSchemaNodeAccessor.mixins = SchemaAccescessorMixins;

export default RefraxSchemaNodeAccessor;
