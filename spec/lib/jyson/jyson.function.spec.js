const jyson = require('./../../../lib/jyson');

describe('jyson.function.spec: a function in the template', () => {
  describe('simple functions', () => {
    beforeEach(() => {
      this.templateFunction = jyson.buildTemplateFunction({
        a: () => 1,
        b: () => {
          return 2;
        },
        c: () => {
          return 3;
        }
      });
    });

    it('must convert an object to "json"', () => {
      const input = {
        a: 0,
        b: 0,
        c: 0
      };
      const json = this.templateFunction(input);

      expect(json.a).toBe(1);
      expect(json.b).toBe(2);
      expect(json.c).toBe(3);
    });

    it('must call functions with the correct arguments', () => {
      this.templateValueFunction = jest.fn(() => 1);
      this.templateFunction = jyson.buildTemplateFunction({
        a: this.templateValueFunction,
      });

      const input = {
        a: 0,
      };
      const json = this.templateFunction(input);


      expect(json.a).toBe(1);
      expect(this.templateValueFunction.mock.calls).toHaveLength(1);
      expect(this.templateValueFunction.mock.calls[0][0]).toEqual({
        key: 'a',
        object: { a: 0 },
        templateOpts: {},
        opts: { arrayIndexes: [], emptyArrayValue: [], undefinedValue: null }
      });
    });
  });

  describe('simple undefined functions', () => {
    beforeEach(() => {
      this.templateFunction = jyson.buildTemplateFunction({
        a: () => 1,
        b: () => {
          return;
        },
        c: () => {
          return;
        }
      });
    });

    it('must convert an object to "json"', () => {
      const input = {
        a: 0,
        b: 0,
        c: 0
      };

      const json = this.templateFunction(input);
      expect(json.a).toBe(1);
      expect(json.b).toBe(null);
      expect(json.c).toBe(null);
    });
  });

  describe('nested comments via functions', () => {
    beforeEach(() => {
      this.templateFunction = jyson.buildTemplateFunction({
        commentText: 'text',
        commentReplies: ({ object, templateOpts }) => {
          return this.templateFunction(templateOpts.comments.filter((comment) => {
            return comment.parent === object.id;
          }), templateOpts);
        }
      });
    });

    it('must be able to use functions to create reddit style comments', () => {
      const comments = [
        { id: 0, parent: null, text: '0' },
        { id: 1, parent: 0,    text: '0.1' },
        { id: 2, parent: 0,    text: '0.2' },
        { id: 3, parent: 1,    text: '0.1.1' },
        { id: 4, parent: 0,    text: '0.3' },
        { id: 5, parent: 6,    text: '0.4' }, // this comment is orphaned
        { id: 7, parent: null, text: '1' }, // note no comment 6 due to 5
      ];

      const rootComments = comments.filter((comment) => {
        return comment.parent === null;
      });

      const json = this.templateFunction(rootComments, { comments });

      expect(json).toEqual([
        { commentText: '0', commentReplies: [
          { commentText: '0.1', commentReplies: [
            { commentText: '0.1.1', commentReplies: [] }
          ] },
          { commentText: '0.2', commentReplies: [] },
          { commentText: '0.3', commentReplies: [] },
        ] },
        { commentText: '1', commentReplies: [] }
      ]);
    });
  });
});
