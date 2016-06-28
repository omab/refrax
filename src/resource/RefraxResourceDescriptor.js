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
const RefraxQueryParameters = require('RefraxQueryParameters');
const RefraxPath = require('RefraxPath');
const RefraxOptions = require('RefraxOptions');
const RefraxConstants = require('RefraxConstants');
const ACTION_GET = RefraxConstants.action.get;
const FRAGMENT_DEFAULT = RefraxConstants.defaultFragment;
const CACHE_STRATEGY_REPLACE = RefraxConstants.cacheStrategy.replace;
const CLASSIFY_RESOURCE = RefraxConstants.classify.resource;


// simple-depth serialize to avoid circular references for error debugging
function serializer() {
  var stack = [];

  return function(key, value) {
    if (stack.length > 0) {
      if (stack.indexOf(this) == -1 && typeof(value) === 'object') {
        return '...';
      }
    }
    else {
      stack.push(value);
    }

    return value;
  };
}

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
      throw new TypeError('Failed to map path component `' + lastParamKey + '` from `' + uri + '`' +
      ' while using params: ' + JSON.stringify(params, serializer()));
    }
  }

  return {
    lastParamKey: lastParamKey,
    uri: uri
  };
}

function encodeURIData(data) {
  var result = [];

  RefraxTools.each(data || [], function(value, key) {
    if (RefraxTools.isArray(value)) {
      RefraxTools.each(value, function(v) {
        result.push(key + '[]=' + v);
      });
    }
    else {
      result.push(key + '=' + global.encodeURIComponent(value));
    }
  });

  return result.length > 0
    ? '?' + result.join('&')
    : '';
}

/**
 * Given a stack representing a path in our Schema tree and options affecting it, we
 * reduce and resolve it down to a descriptor describing a resource.
 */
function processStack(resourceDescriptor, action, stack) {
  var canResolveParams = action !== 'inspect'
    , resolvedParams = {}
    , resolvedParamMap = {}
    , resolvedPartial = null
    , resolvedType = null
    , resolvedStore = null
    , resolvedPath = []
    , resolvedFragments = null
    , resolvedParamId = null
    , resolvedPayload = {}
    , resolvedQueryParams = {}
    , resolvedClassification = CLASSIFY_RESOURCE
    , resolvedAppendPaths = []
    , resolvedCacheStrategy = CACHE_STRATEGY_REPLACE
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
      resolvedClassification = CLASSIFY_RESOURCE;
      resolvedPartial = null;
      resolvedFragments = null;
    }
    else if (item instanceof RefraxTreeNode) {
      if (definition.paramMap) {
        resolvedParamMap = RefraxTools.extend(resolvedParamMap, definition.paramMap);
      }

      if (definition.paramId) {
        resolvedParamId = resolvedParamId;
      }

      resolvedPartial = definition.partial;
      resolvedFragments = definition.fragments;
      if (definition.classify) {
        resolvedClassification = definition.classify;
      }
    }
    else if (item instanceof RefraxOptions) {
      resolvedCacheStrategy = item.cacheStrategy || resolvedCacheStrategy;
    }
    else if (item instanceof RefraxParameters) {
      resolvedParams = RefraxTools.extend(resolvedParams, item);
    }
    else if (item instanceof RefraxQueryParameters) {
      resolvedQueryParams = RefraxTools.extend(resolvedQueryParams, item);
    }
    else if (item instanceof RefraxPath) {
      resolvedAppendPaths.push(item);
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
        result = canResolveParams ? fillURI(definition.uri, resolvedParams, resolvedParamMap)
                                  : {uri: definition.uri};
        resolvedPath.push(result.uri);
        lastURIParamId = result.lastParamKey;
      }
      else if (definition.paramId) {
        result = canResolveParams ? fillURI(':'+definition.paramId, resolvedParams, resolvedParamMap)
                                  : {uri: ':'+definition.paramId};
        resolvedPath.push(result.uri);
        lastURIParamId = result.lastParamKey;
      }
    }
  }

  resolvedAppendPaths = RefraxTools.map(RefraxTools.select(resolvedAppendPaths, function(rPath) {
    return rPath.isModifier || resolvedPath.push(rPath.path);
  }), function(rPath) {
    return rPath.path;
  });

  // If we have no base path's ignore pathing all together
  if (resolvedPath.length > 0) {
    resourceDescriptor.basePath =
      resourceDescriptor.path = RefraxConfig.hostname + '/' + resolvedPath.join('/');

    if (resolvedAppendPaths.length > 0) {
      resourceDescriptor.path+= '/' + resolvedAppendPaths.join('/');
    }

    if (action === ACTION_GET) {
      resourceDescriptor.path+= encodeURIData(resolvedQueryParams);
    }
  }

  key = resolvedParamId || lastURIParamId || 'id';
  if (resolvedParamMap[key]) {
    key = resolvedParamMap[key];
  }
  resolvedParamId = (resolvedParamId = resolvedParams[key]) &&
                    ('' + resolvedParamId);

  event = ['change'].concat(resolvedParamId || []).join(':');

  resourceDescriptor.action = action;
  resourceDescriptor.event = event;
  resourceDescriptor.classify = resolvedClassification;
  resourceDescriptor.partial = resolvedPartial || FRAGMENT_DEFAULT;
  resourceDescriptor.id = resolvedParamId;
  resourceDescriptor.params = resolvedParams;
  resourceDescriptor.fragments = (resolvedFragments || []).reverse();
  resourceDescriptor.payload = resolvedPayload;
  resourceDescriptor.store = resolvedStore;
  resourceDescriptor.type = resolvedType;
  resourceDescriptor.cacheStrategy = resolvedCacheStrategy;
}

class RefraxResourceDescriptor {
  constructor(action = ACTION_GET, stack = []) {
    if (!RefraxTools.isArray(stack)) {
      stack = [stack];
    }

    processStack(this, action, stack);
  }

  // Using our own descriptor's rules, grab an id from an object
  idFrom(target) {
    // TODO: id map?
    return target && target.id && ('' + target.id);
  }
}

export default RefraxResourceDescriptor;
