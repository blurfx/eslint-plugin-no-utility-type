# eslint-plugin-no-utility-type

eslint-plugin-no-utility-type is an eslint plugin that prevents the use of utility types for concrete types.

## Installation

```sh
npm install -D eslint-plugin-no-utility-type
# or
yarn add -D eslint-plugin-no-utility-type
# or
pnpm add -D eslint-plugin-no-utility-type
```

## Usage

Add the `no-utility-type` plugin to your `.eslintrc`, and add the `no-utility-type/disallow` rule.

By default, the `Omit`, `Exclude`, `Pick`, and `Extract` types are not allowed.

```json
{
  "plugins": ["no-utility-type"],
  "rules": {
    "no-utility-type/disallow": "error"
  }
}
```

Use the `types` option to manually set the types to disallow.

```json
{
  "plugins": ["no-utility-type"],
  "rules": {
    "no-utility-type/disallow": [
      "error",
      {
        "types": ["Omit", "Exclude", "Record"]
      }
    ]
  }
}
```

You CANNOT set a type that is not a TypeScript built-in type., in which case the linter will report an error.

For example:

```ts
// eslint error: User-defined type 'MyRecord' should be allowed
type myRecord  = MyRecord<string, unknown>;
```

```json
{
  "plugins": ["no-utility-type"],
  "rules": {
    "no-utility-type/disallow": [
      "error",
      {
        "types": ["Omit", "Exclude", "MyRecord"]
      }
    ]
  }
}
```
