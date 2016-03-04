/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const chai = require('chai');
const testHelper = require('testHelper');
const RefraxSchemaNodeAccessor = require('RefraxSchemaNodeAccessor');
const RefraxSchemaNode = require('RefraxSchemaNode');
const RefraxTreeNode = require('RefraxTreeNode');
const RefraxStore = require('RefraxStore');
const createCollection = require('createCollection');
const expect = chai.expect;


/* eslint-disable no-new */
describe('createCollection', function() {
  afterEach(testHelper.deleteStores);

  describe('invocation', function() {
    it('should throw an error with no arguments passed', function() {
      expect(function() {
        createCollection();
      }).to.throw(Error, 'A valid literal must be passed');
    });

    it('should throw an error with invalid arguments passed', function() {
      expect(function() {
        createCollection(123);
      }).to.throw(Error, 'A valid literal must be passed');

      expect(function() {
        createCollection('users');
      }).to.throw(Error, 'A valid store reference of either');

      expect(function() {
        createCollection('users', 123);
      }).to.throw(Error, 'A valid store reference of either');
    });

    it('should return the proper result when passed valid arguments', function() {
      var collectionUsers = createCollection('users', 'user');

      expect(collectionUsers).to.be.an.instanceof(RefraxSchemaNodeAccessor);
      expect(collectionUsers).to.have.property('__node')
        .that.is.an.instanceof(RefraxSchemaNode)
        .to.have.property('payload')
          .that.is.an.instanceof(Array);

      expect(collectionUsers.__node).to.have.property('literal', 'users');
      expect(collectionUsers.__node.payload).with.deep.property('[0]')
        .that.is.an.instanceof(RefraxStore);
      expect(collectionUsers.__node.payload).with.deep.property('[1]')
        .that.is.an.instanceof(RefraxTreeNode);

      expect(collectionUsers).to.have.property('user')
        .that.is.an.instanceof(RefraxSchemaNodeAccessor)
        .to.have.property('__node')
          .that.is.instanceof(RefraxSchemaNode)
          .to.have.property('literal', 'user');
    });
  });
});
