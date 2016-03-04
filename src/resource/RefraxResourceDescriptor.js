/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const RefraxTools = require('RefraxTools');
const RefraxConfig = require('RefraxConfig');
const RefraxStore = require('RefraxStore');
const RefraxTreeNode = require('RefraxTreeNode');
const RefraxParameters = require('RefraxParameters');
const RefraxPath = require('RefraxPath');


function fillURI(uri, params, paramMap) {
  var vars = uri.match(/:(\w+)/g) || []
    , lastParamKey = null
    , i, v, value;

  for (i = 0; i < vars.length; i++) {
    v = vars[i];

    lastParamKey = v.substr(1);
    if (paramMap && paramMap[lastParamKey]) {
      lastParamKey = paramMap[lastParamKey];
    }

    if ((value = params[lastParamKey])) {
      uri = uri.replace(v, value);
    }
    else {
      throw new TypeError('Failed to map path component `' + lastParamKey + '` for `' + uri + '`' +
      ' while using params: ' + JSON.stringify(params));
    }
  }

  return {
    lastParamKey: lastParamKey,
    uri: uri
  };
}

/**
 * Given a stack representing a path in our Schema tree and options affecting it, we
 * reduce and resolve it down to a descriptor describing a resource.
 */
function processStack(resourceDescriptor, stack) {
  var resolvedParams = {}
    , resolvedParamMap = {}
    , resolvedPartial = null
    , resolvedType = null
    , resolvedStore = null
    , resolvedPath = ''
    , resolvedFragments = []
    , resolvedParamId = null
    , resolvedPayload = {}
    , resolvedCoercion = null
    , pathAppend = ''
    , i, item, definition
    , lastURIParamId = null
    , key, event, result;

  if (!stack) {
    throw new TypeError('generateDescriptor: expected non-null stack');
  }

  // Pass 1
  for (i = 0; i < stack.length; i++) {
    item = stack[i];
    if (!item) {
      throw new TypeError('generateDescriptor: Found null stack element at index ' + i + ' from stack ' + JSON.stringify(stack));
    }

    definition = item.definition;

    if (item instanceof RefraxStore) {
      // every store encounter is considered a hard scope change
      resolvedStore = item;
      resolvedParamId = definition.paramId || null;
      resolvedType = definition.type;
      resolvedCoercion = null;
    }
    else if (item instanceof RefraxTreeNode) {
      if (definition.paramMap) {
        resolvedParamMap = RefraxTools.extend(resolvedParamMap, definition.paramMap);
      }

      if (definition.partial) {
        resolvedPartial = definition.partial;
      }

      if (definition.fragments) {
        resolvedFragments = RefraxTools.concatUnique(resolvedFragments, definition.fragments);
      }

      if (definition.paramId) {
        resolvedParamId = resolvedParamId;
      }

      resolvedCoercion = definition.coerce;
    }
    else if (item instanceof RefraxParameters) {
      resolvedParams = RefraxTools.extend(resolvedParams, item.params);
    }
    else if (item instanceof RefraxPath) {
      pathAppend += item.path;
    }
    else if (RefraxTools.isPlainObject(item)) {
      resolvedPayload = RefraxTools.extend(resolvedPayload, item);
    }
  }

  // Pass 2 - Since URI uses resolved params we need to do it separately
  for (i = 0; i < stack.length; i++) {
    item = stack[i];
    definition = item.definition;

    if (item instanceof RefraxTreeNode) {
      if (definition.uri) {
        result = fillURI(definition.uri, resolvedParams, resolvedParamMap);
        resolvedPath+= result.uri;
        lastURIParamId = result.lastParamKey;
      }
      else if (definition.paramId) {
        result = fillURI('/:'+definition.paramId, resolvedParams, resolvedParamMap);
        resolvedPath+= result.uri;
        lastURIParamId = result.lastParamKey;
      }
    }
  }

  resolvedPath = RefraxConfig.hostname + resolvedPath;

  key = resolvedParamId || lastURIParamId || 'id';
  if (resolvedParamMap[key]) {
    key = resolvedParamMap[key];
  }
  resolvedParamId = (resolvedParamId = resolvedParams[key]) &&
                    ('' + resolvedParamId);

  event = ['change'].concat(resolvedParamId || []).join(':');

  resourceDescriptor.event = event;
  resourceDescriptor.coerce = resolvedCoercion;
  resourceDescriptor.partial = resolvedPartial;
  resourceDescriptor.id = resolvedParamId;
  resourceDescriptor.params = resolvedParams;
  resourceDescriptor.fragments = resolvedFragments.reverse();
  resourceDescriptor.basePath = resolvedPath;
  resourceDescriptor.path = resolvedPath + pathAppend;
  resourceDescriptor.payload = resolvedPayload;
  resourceDescriptor.store = resolvedStore;
  resourceDescriptor.type = resolvedType;
}

class ResourceDescriptor {
  constructor(stack) {
    processStack(this, stack);
  }

  // Using our own descriptor's rules, grab an id from an object
  idFrom(target) {
    // TODO: id map?
    return target.id && ('' + target.id);
  }
}

export default ResourceDescriptor;
