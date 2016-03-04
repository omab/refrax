/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const chai = require('chai');
const RefraxTreeNode = require('RefraxTreeNode');
const expect = chai.expect;


/* eslint-disable no-new */
describe('RefraxTreeNode', function() {
  describe('instantiation', function() {
    it('should only accept object params type', function() {
      expect(function() {
        new RefraxTreeNode(123);
      }).to.throw(Error, 'pass an invalid definition of type');

      expect(function() {
        new RefraxTreeNode('abc');
      }).to.throw(Error, 'pass an invalid definition of type');
    });

    it('should throw an error with an invalid option', function() {
      expect(function() {
        new RefraxTreeNode({barfoo: 123});
      }).to.throw(Error, 'Invalid definition option');
    });

    it('should throw an error on invalid option values', function() {
      expect(function() {
        new RefraxTreeNode({partial: 123});
      }).to.throw(Error);

      expect(function() {
        new RefraxTreeNode({fragments: 123});
      }).to.throw(Error);

      expect(function() {
        new RefraxTreeNode({uri: 123});
      }).to.throw(Error);
    });

    it('should not throw an error on valid option values', function() {
      expect(function() {
        new RefraxTreeNode({uri: '/foo'});
        new RefraxTreeNode({partial: 'minimal'});
        new RefraxTreeNode({paramId: 'fooId'});
        new RefraxTreeNode({fragments: ['default', 'full']});
      }).to.not.throw(Error);
    });
  });

  describe('methods', function() {
  });
});
