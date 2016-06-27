/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const chai = require('chai');
const RefraxFragmentCache = require('RefraxFragmentCache');
const partialFragmentCacheFetch = require('RefraxFragmentCache-fetch.specp');
const partialFragmentCacheInvalidate = require('RefraxFragmentCache-invalidate.specp');
const partialFragmentCacheTouch = require('RefraxFragmentCache-touch.specp');
const partialFragmentCacheDestroy = require('RefraxFragmentCache-destroy.specp');
const partialFragmentCacheUpdateReplace = require('RefraxFragmentCache-updateReplace.specp');
const partialFragmentCacheUpdateMerge = require('RefraxFragmentCache-updateMerge.specp');
const expect = chai.expect;


describe('RefraxFragmentCache', function() {
  var fragmentCache;

  beforeEach(function() {
    fragmentCache = new RefraxFragmentCache();
  });

  describe('instantiation', function() {
    it('should look like a FragmentCache', function() {
      expect(Object.keys(fragmentCache)).to.deep.equal(['fragments', 'queries']);
    });
  });

  describe('instance method', function() {
    partialFragmentCacheFetch();
    partialFragmentCacheInvalidate();
    partialFragmentCacheTouch();
    partialFragmentCacheDestroy();
    partialFragmentCacheUpdateReplace();
    partialFragmentCacheUpdateMerge();
  });
});
