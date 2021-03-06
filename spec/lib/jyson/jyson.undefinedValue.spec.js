const jyson = require('./../../../lib/jyson');

describe('jyson.undefinedValue.spec: basic undefined', () => {
  beforeEach(() => {
    this.templateFunction = jyson.buildTemplateFunction({
      a: 'a',
      b: { b: 'b' },
      // eslint-disable-next-line
      c: function({ object }) {
        return object.c;
      }
    }, {
      undefinedValue: undefined
    });
  });

  it('must handle missing basic values', () => {
    const input = {
      b: 2,
      c: 3
    };
    const json = this.templateFunction(input);
    const jsonKeys = Object.keys(json);
    const jsonBKeys = Object.keys(json.b);

    expect(json.a).toBeUndefined();
    expect(json.b.b).toBe(input.b);
    expect(json.c).toBe(input.c);

    expect(jsonKeys).toHaveLength(2);
    expect(jsonKeys).not.toContain('a');
    expect(jsonKeys).toContain('b');
    expect(jsonKeys).toContain('c');

    expect(jsonBKeys).toHaveLength(1);
    expect(jsonBKeys).toContain('b');
  });

  it('must handle missing nested values', () => {
    const input = {
      a: 1,
      c: 3
    };
    const json = this.templateFunction(input);
    const jsonKeys = Object.keys(json);
    const jsonBKeys = Object.keys(json.b);

    expect(json.a).toBe(input.a);
    expect(json.b.b).toBeUndefined();
    expect(json.c).toBe(input.c);

    expect(jsonKeys).toHaveLength(3);
    expect(jsonKeys).toContain('a');
    expect(jsonKeys).toContain('b');
    expect(jsonKeys).toContain('c');

    expect(jsonBKeys).toHaveLength(0);
    expect(jsonBKeys).not.toContain('b');
  });

  it('must handle missing function values', () => {
    const input = {
      a: 1,
      b: 2
    };
    const json = this.templateFunction(input);
    const jsonKeys = Object.keys(json);
    const jsonBKeys = Object.keys(json.b);

    expect(json.a).toBe(input.a);
    expect(json.b.b).toBe(input.b);
    expect(json.c).toBeUndefined();

    expect(jsonKeys).toHaveLength(2);
    expect(jsonKeys).toContain('a');
    expect(jsonKeys).toContain('b');
    expect(jsonKeys).not.toContain('c');

    expect(jsonBKeys).toHaveLength(1);
    expect(jsonBKeys).toContain('b');
  });
});

describe('jyson.undefinedValue.spec: string undefined', () => {
  beforeEach(() => {
    this.templateFunction = jyson.buildTemplateFunction({
      a: 'a',
      b: { b: 'b' },
      c: function getC({ object }) {
        return object.c;
      }
    }, {
      undefinedValue: 'MISSING'
    });
  });

  it('must handle missing basic values', () => {
    const input = {
      b: 2,
      c: 3
    };
    const json = this.templateFunction(input);

    expect(json.a).toBe('MISSING');
    expect(json.b.b).toBe(input.b);
    expect(json.c).toBe(input.c);
  });

  it('must handle missing nested values', () => {
    const input = {
      a: 1,
      c: 3
    };
    const json = this.templateFunction(input);

    expect(json.a).toBe(input.a);
    expect(json.b.b).toBe('MISSING');
    expect(json.c).toBe(input.c);
  });

  it('must handle missing function values', () => {
    const input = {
      a: 1,
      b: 2
    };
    const json = this.templateFunction(input);

    expect(json.a).toBe(input.a);
    expect(json.b.b).toBe(input.b);
    expect(json.c).toBe('MISSING');
  });
});