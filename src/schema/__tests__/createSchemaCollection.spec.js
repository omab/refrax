/**
 * Copyright (c) 2015-present, Joshua Hollenbeck
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */
const chai = require('chai');
const TestHelper = require('TestHelper');
const RefraxSchemaNodeAccessor = require('RefraxSchemaNodeAccessor');
const RefraxSchemaNode = require('RefraxSchemaNode');
const RefraxTreeNode = require('RefraxTreeNode');
const RefraxStore = require('RefraxStore');
const createSchemaCollection = require('createSchemaCollection');
const expect = chai.expect;


/* eslint-disable no-new */
describe('createSchemaCollection', function() {
  afterEach(TestHelper.deleteStores);

  describe('invocation', function() {
    it('should throw an error with no arguments passed', function() {
      expect(function() {
        createSchemaCollection();
      }).to.throw(Error, 'A valid path must be passed');
    });

    it('should throw an error with invalid arguments passed', function() {
      expect(function() {
        createSchemaCollection(123);
      }).to.throw(Error, 'A valid path must be passed');

      expect(function() {
        createSchemaCollection('users', 123);
      }).to.throw(Error, 'A valid store reference of either');
    });

    it('should use a default store based off our path in singular form', function() {
      var collectionUsers = createSchemaCollection('users');

      expect(collectionUsers).to.be.an.instanceof(RefraxSchemaNodeAccessor);
      expect(collectionUsers).to.have.property('__node')
        .that.is.an.instanceof(RefraxSchemaNode)
        .to.have.property('subject')
          .that.is.an.instanceof(Array);

      expect(collectionUsers.__node.subject).with.deep.property('[0]')
        .that.is.an.instanceof(RefraxStore)
        .to.have.deep.property('definition.type', 'user');
    });

    it('should return the proper result when passed valid arguments', function() {
      var collectionUsers = createSchemaCollection('users', 'user');

      expect(collectionUsers).to.be.an.instanceof(RefraxSchemaNodeAccessor);
      expect(collectionUsers).to.have.property('__node')
        .that.is.an.instanceof(RefraxSchemaNode)
        .to.have.property('subject')
          .that.is.an.instanceof(Array);

      expect(collectionUsers.__node).to.have.property('identifier', 'users');
      expect(collectionUsers.__node.subject).with.deep.property('[0]')
        .that.is.an.instanceof(RefraxStore);
      expect(collectionUsers.__node.subject).with.deep.property('[1]')
        .that.is.an.instanceof(RefraxTreeNode);

      expect(collectionUsers).to.have.property('user')
        .that.is.an.instanceof(RefraxSchemaNodeAccessor)
        .to.have.property('__node')
          .that.is.instanceof(RefraxSchemaNode)
          .to.have.property('identifier', 'user');
    });
  });
});
