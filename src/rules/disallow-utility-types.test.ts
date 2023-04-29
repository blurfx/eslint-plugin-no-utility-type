import disallowUtilityTypesRule from './disallow-utility-types';
import { AST_NODE_TYPES, ESLintUtils } from '@typescript-eslint/utils';

const ruleTester = new ESLintUtils.RuleTester({
  parser: '@typescript-eslint/parser',
}); 

ruleTester.run('disallow', disallowUtilityTypesRule, {
  valid: [
    {
      code: `
        type Foo = 'A' | 'B';
        const foo: Foo = 'A';
      `,
    },
    {
      code: `
        type KV = Record<string, string>;
      `,
    },
    {
      code: `
      type Foo = { name: string; age: number; }
      type Bar = Pick<Foo, 'name'>;
      `,
      options: [{
        types: ['Record'],
      }],
    },
  ],
  invalid: [
    {
      code: `
      type Foo = { name: string; age: number; }
      type Bar = Pick<Foo, 'name'>;
      `,
      errors: [
        {
          messageId: 'disallowedUtilityType',
          type: AST_NODE_TYPES.TSTypeReference,
        },
      ],
    },
    {
      code: `
        type Foo = 'A' | 'B';
        type Bar = Omit<Foo, 'A'>;
      `,
      errors: [
        {
          messageId: 'disallowedUtilityType',
          type: AST_NODE_TYPES.TSTypeReference,
        },
      ],
    },
    {
      code: `
        type KV = Record<string, string>;
      `,
      errors: [
        {
          messageId: 'disallowedUtilityType',
          type: AST_NODE_TYPES.TSTypeReference,
        },
      ],
      options: [{
        types: ['Record'],
      }],
    },
    {
      code: `
        type KV = string;
        const str: KV = 'a';
      `,
      errors: [
        {
          messageId: 'userDefinedType',
          type: AST_NODE_TYPES.TSTypeReference,
        },
      ],
      options: [{
        types: ['KV'],
      }],
    },
    {
      filename: 'index.ts',
      code: `
        type KV = Record<string, string>;

        type Foo = 'A' | 'B';

        type Bar = Exclude<Foo, 'A'>;
      `,
      errors: [
        {
          messageId: 'disallowedUtilityType',
          type: AST_NODE_TYPES.TSTypeReference,
        },
      ],
    }
  ]
});