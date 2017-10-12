const Q = require('q');
const assert = require('assert');
const chai = require('chai');

const expect = chai.expect;

const jyson = require('./../../../lib/jyson');

describe('jyson.basic.spec: a basic template', () => {
  beforeEach(() =>{
    this.templateFunction = jyson.buildTemplateFunction({
      a: 'a',
      b: 'b',
      c: 'c',
    });
  });

  it('must convert an object to "json"', () => {
    const input = {
      a: 1,
      b: 2,
      c: 3
    };
    const json = this.templateFunction(input);

    expect(json.a).to.equal(input.a);
    expect(json.b).to.equal(input.b);
    expect(json.c).to.equal(input.c);
  });

  it('must ignore additional values', () => {
    const input = {
      a: 1,
      b: 2,
      c: 3,
      d: 4
    };
    const json = this.templateFunction(input);

    expect(Object.keys(json)).to.include('a', 'b', 'c');
    expect(Object.keys(json)).not.to.include('d', 'e');
  });

  it('must use null for missing objects', () => {
    const input = {
      a: 1,
      c: 3
    };
    const json = this.templateFunction(input);

    expect(json.b).to.equal(null);
  });

  it('must error if it encounters an unexpected array', () => {
    const input = {
      a: [1],
    };

    return Q.when(null, () => {
      return this.templateFunction(input);
    })
    .then(() => {
      return Q.reject('an error should have been thrown');
    })
    .catch(error => {
      expect(error).to.be.an.instanceOf(assert.AssertionError);
      expect(error.message).to.equal('jyson encountered an array when it was not expecting one: a');
    });
  });

  it('must convert arrays "json"', () => {
    const input = [
      {a:1},
      {b:2},
      {c:3}
    ];
    const json = this.templateFunction(input);

    expect(json).to.deep.equal([
      {a:1, b:null, c:null},
      {a:null, b:2, c:null},
      {a:null, b:null, c:3}
    ]);
  });

  it('must convert deep arrays "json"', () => {
    this.templateFunction = jyson.buildTemplateFunction({
      a: {a: 'a.a'},
      b: {b: 'b.b'},
      c: {c: 'c.c'},
    });

    const input = [
      {a:{a: 1}},
      {b:{b: 2}},
      {c:{c: 3}}
    ];
    const json = this.templateFunction(input);

    expect(json).to.deep.equal([
      {a:{a:1}, b:{b: null}, c:{c: null}},
      {a:{a:null}, b:{b: 2}, c:{c: null}},
      {a:{a:null}, b:{b: null}, c:{c: 3}}
    ]);
  });

  it('must convert an object with properties "json"', () => {
    const input = {};
    Object.defineProperty(input, 'a', {
      get: function() { return 1; },
      set: function() { },
      enumerable: true,
      configurable: false
    });
    Object.defineProperty(input, 'b', {
      get: function() { return 2; },
      set: function() { },
      enumerable: true,
      configurable: false
    });
    Object.defineProperty(input, 'c', {
      get: function() { return 3; },
      set: function() {  },
      enumerable: true,
      configurable: false
    });

    const json = this.templateFunction(input);

    expect(json.a).to.equal(1);
    expect(json.b).to.equal(2);
    expect(json.c).to.equal(3);
  });
});