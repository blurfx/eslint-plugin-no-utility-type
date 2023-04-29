import { ESLintUtils } from '@typescript-eslint/utils';

const createRule = ESLintUtils.RuleCreator(
  () => `https://github.com/blurfx/eslint-plugin-type`,
);

type MessageIds = 'disallowedUtilityType' | 'userDefinedType';

type Options = [{
  types?: string[];
}]

const DEFAULT_DISALLOWED_UTILITY_TYPES = ['Omit', 'Pick', 'Exclude', 'Extract'];

const disallowUtilityTypesRule = createRule<Options, MessageIds>({
  create(context) {
    const disallowedUtilityTypes = context.options[0]?.types || DEFAULT_DISALLOWED_UTILITY_TYPES;

    function isTypeScriptLibraryType(node: any) {
      const variable = context.getScope().variables.find(
        (variable) => variable.name === node.typeName.name
      );

      if (!variable) {
        return true;
      }

      if (variable.defs.length === 0) {
        return true;
      }

      const importDeclaration = variable.defs[0]?.node;
      if (
        importDeclaration &&
        importDeclaration.type === 'ImportDeclaration' &&
        importDeclaration.source.value === 'typescript'
      ) {
        return true;
      }

      return false;
    }

    return {
      TSTypeReference(node) {
        if (
          node.typeName.type === 'Identifier' &&
          disallowedUtilityTypes.includes(node.typeName.name)
        ) {
          context.report({
            data: {
              name: node.typeName.name,
            },
            node,
            messageId: isTypeScriptLibraryType(node) ? 'disallowedUtilityType' : 'userDefinedType',
          });
        }
      },
    };
  },
  name: 'disallow',
  meta: {
    docs: {
      description:
        'Prevent the use of TypeScript built-in utility types.',
      recommended: 'error',
    },
    messages: {
      disallowedUtilityType: 'Using utility type \'{{name}}\' is not allowed.',
      userDefinedType: 'User-defined type \'{{name}}\' should be allowed.',
    },
    type: 'problem',
    schema: [
      {
        type: 'object',
        properties: {
          'types': {
            "type": "array",
            "items": {
              "type": "string"
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },
  defaultOptions: [{
    types: ['Omit', 'Pick', 'Exclude', 'Extract'],
  }],
});

export default disallowUtilityTypesRule;
