# Use Case: Two-string keyed Map

Very often, I find myself needing a map with two keys for each value.  Instead of writing `Map<string, Map<string, object>>`, though, I want a simple class I generate from existing `Map` objects and the `Map` interface.

To do this, I'll have to bootstrap from existing `Map`, hashing the keys into a combined key... but I also have to generate a new type and then build a class for it, using [`MemberedTypeToClass`](../guides/MemberedTypeToClass.md)

## Design

```typescript
interface StringStringKey {
  readonly firstKey: string,
  readonly secondKey: string
}

class StringStringMap<V> {
  static #hashKeys(firstKey: string, secondKey: string): string {
    return JSON.stringify({firstKey, secondKey});
  }

  static #parseKeys(hashedKey: string): [string, string]
  {
    const { firstKey, secondKey } = JSON.parse(hashedKey) as StringStringKey;
    return [firstKey, secondKey];
  }

  readonly #hashMap = new Map<string, V>;
}
```

This lays the foundation for `StringStringMap`, but obviously it's nowhere near complete.  

## Getting the `Map` interfaces from TypeScript

## Rewriting the `Map` type for the `implements` attribute

## Rewriting the `Map` type in a `TypeMembersMap`

## Creating the existing class structure

Ideally with something even as complex as our `StringStringMap` design above, I'd start with an existing source file.  I _could_ build the `ClassDeclarationImpl` from scratch, but why would I?

```typescript
const sourceFile = buildSourceFile(`
interface StringStringKey {
// ...
`);

const classDecl = getTypeAugmentedStructure(
  sourceFile.getClassOrThrow("StringStringMap"),

)
```

## Using `MemberedTypeToClass` to build the rest of the class

### Statements
