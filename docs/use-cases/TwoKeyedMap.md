# Use Case: Two-string keyed Map

Very often, I find myself needing a map with two keys for each value.  Instead of writing `Map<string, Map<string, object>>`, though, I want a simple class I generate from existing `Map` objects and the `Map` interface.

To do this, I'll have to bootstrap from existing `Map`, hashing the keys into a combined key... but I also have to generate a new type and then build a class for it, using [`MemberedTypeToClass`](../guides/MemberedTypeToClass.md)

## Design requirements

- There will be a private `#hashMap: Map<string, V>`, which every method will forward operations to.
- We must hash two keys into one, and we must be able to extract two keys from every hashed key.
- Otherwise, it should resemble the `Map` class very closely.

## Starting source code

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

Because the `Map` is a built-in type for TypeScript, we have to look up interfaces from TypeScript's own files.

```typescript
  /* What are we dealing with? */
  const MapInterfaceNodes = getTypeScriptNodes<InterfaceDeclaration>(
    sourceFile => sourceFile.getInterfaces().filter(ifc => ifc.getName() === "Map")
  ).map(entry => entry[1]);
  for (const node of MapInterfaceNodes) {
    console.log(node.print());
  }
```

What is this `getTypeScriptNodes` function?  I wrote this utility function in a separate module:

```typescript
import fs from "fs/promises";
import path from "path";

import {
  type SourceFile
} from "ts-morph";

import {
  NodeWithStructures,
  project,
  projectDir,
} from "./sharedProject.js";

const TYPESCRIPT_LIBS = path.join(projectDir, "node_modules/typescript/lib");
const fileNames = (await fs.readdir(TYPESCRIPT_LIBS)).filter(f => /^lib\..*\.d.ts$/.test(f)).map(f => path.join(TYPESCRIPT_LIBS, f));
const sourceFiles: readonly SourceFile[] = project.addSourceFilesAtPaths(fileNames);

export default function getTypeScriptNodes<
  NodeKind extends NodeWithStructures
>
(
  callback: (sourceFile: SourceFile) => NodeKind[]
): [string, NodeKind][]
{
  return sourceFiles.map(
    sourceFile => processSourceFile(sourceFile, callback)
  ).flat();
}

function processSourceFile<
  NodeKind extends NodeWithStructures
>
(
  sourceFile: SourceFile,
  callback: (sourceFile: SourceFile) => NodeKind[]
): [string, NodeKind][]
{
  const nodes = callback(sourceFile);
  const pathToSourceFile = sourceFile.getFilePath();
  return nodes.map(node => [pathToSourceFile, node]);
}
```

## What do the interfaces specify?

So before this, I asked to log the interfaces, stringified.  Some snippets:

```typescript
interface Map<K, V> {
  // ...
  forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void;
  // ...
  get(key: K): V | undefined;
  // ...
}

interface Map<K, V> {
  [Symbol.iterator](): IterableIterator<[
      K,
      V
  ]>;
  // ...
  keys(): IterableIterator<K>;
  // ...
}

interface Map<K, V> {
  readonly [Symbol.toStringTag]: string;
}
```

The first of these interfaces is not too bad.  K doesn't appear as a stand-alone type parameter, only as a type for a parameter `key`.  So I can replace `key: K` with `firstKey: string, secondKey: string` (two parameters).

The second interface is more challenging.  [`[Symbol.iterator]`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator) isn't so bad: we can replace K with `string, string` in the return type.  But `keys` is a genuine problem.  `IterableIterator` is a type taking only one type parameter.  To support this, I need to turn the return type into `IterableIterator<[string, string]>`.

For the third interface, I just have to look up the documentation on [`Symbol.toStringTag`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toStringTag).

## Creating a [`TypeMembersMap`](../guides/MemberedTypeToClass.md#typemembersmap) from the interface nodes

This is relatively easy, and is necessary for `MemberedTypeToClass` to work:

```typescript
  // Create the initial type members map
  const typeMembers = new TypeMembersMap();
  MapInterfaceNodes.forEach(node => {
    const structure = getTypeAugmentedStructure(
      node, VoidTypeNodeToTypeStructureConsole, true, StructureKind.Interface
    ).rootStructure;
    typeMembers.addMembers([
      // no getters or setters to worry about
      ...structure.properties,
      ...structure.methods
    ]);
  });
```

## Analyzing the interfaces for type-to-class requirements

There are a few properties, but mostly methods:

_Properties_

- `readonly size: number`
- `readonly [Symbol.toStringTag]: string`

_Methods_

- clear
- delete
- forEach
- get
- has
- set
- `[Symbol.iterator]`
- entries
- keys
- values

I need to think of these as tables, for method statements.  Properties have their own table for initializers:

| Property name          | Initializer       |
|------------------------|-------------------|
| size                   | 0                 |
| `[Symbol.toStringTag]` | "StringStringMap" |

| Method name | (header) | `size` | `toStringTag` | (footer) |
|-------------|----------|--------|---------------|----------|
| clear       | | | | |
| delete      | | | | |
| forEach     | | | | |
| get         | | | | |
| has         | | | | |
| `[Symbol.Iterator]` | | | | |
| entries     | | | | |
| keys        | | | | |
| values      | | | | |

There are two key pieces missing from these tables.  First, I know each of these methods will refer to `this.#hashMap`, but there's no interface property for private members.  (The reason for this should be obvious.)  I specified the property directly in the class stub earlier, but this now appears to be a mistake.

The second missing piece is "constructor".  The interfaces don't tell you this, but [the `Map` class has a constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/Map) which takes an optional argument:

```typescript
interface MapConstructor {
    new (): Map<any, any>;
    new <K, V>(entries?: readonly (readonly [K, V])[] | null): Map<K, V>;
    readonly prototype: Map<any, any>;
}
declare var Map: MapConstructor;
```

Our `StringStringMap` class _will_ emulate this, but for now we just need to be aware of it and adjust our method-property statements table accordingly.

To solve the first, I need to create a property signature for the property, and add the signature to the type members map.  To save myself some trouble, I'm going to comment out this line from earlier:

```typescript
  readonly #hashMap = new Map<string, V>;
```

Instead, I need to create a new property signature:

```typescript
{
  const hashMap = new PropertySignatureImpl("#hashMap");
  hashMap.isReadonly = true;
  typeMembers.addMembers([hashMap]);
}
```

There's one more problem we have to solve before we can move on.  The size property should actually be a _getter_, returning our private hash map's size.

```typescript
typeMembers.convertPropertyToAccessors("size", true, false);
```

With this, I can adjust the above tables:

| Property name          | Initializer          |
|------------------------|----------------------|
| `[Symbol.toStringTag]` | "StringStringMap"    |
| `#hashMap`             | `new Map<string, V>` |

| Method name | (header) | `toStringTag` | `#hashMap` | (footer) |
|-------------|----------|---------------|------------|----------|
| clear       | | | | |
| delete      | | | | |
| forEach     | | | | |
| get         | | | | |
| has         | | | | |
| `[Symbol.Iterator]` | | | | |
| entries     | | | | |
| keys        | | | | |
| values      | | | | |
| constructor(...?) | | | | |
| get size() | | | | |

## Adjusting method types in the `TypeMembersMap`

Most methods need _some_ adjustment.  So I'm going to call `arrayOfKind` to get the method signatures.  (Method _signatures_ in interfaces are the type definitions for the equivalent method _declarations_ in classes.)

```typescript
{
  const methods: readonly MethodSignatureImpl[] = typeMembers.arrayOfKind(StructureKind.MethodSignature);
  for (const method of methods) {
    // ...
  }
}
```

[MethodSignatureImpl documentation](../api/ts-morph-structures.methodsignatureimpl.md)

### The `keys` method

I've already called out the `keys` method as needing special attention.  What I want is a return type of `IterableIterator<[string, string]>`.  What I have is a return type of `IterableIterator<K>`.

Here, I'm going to use NodeJS's `assert` function for a couple reasons.  (1) I wish to _assert_ the existing definition of `keys` from TypeScript doesn't change in the future.  (The odds of this are not quite infinitesimal, but if it does change, I want to know.)  (2) The [assert function allows TypeScript to _know_](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions) the shape of a particular type structure.

It helps to look up the [type structures table](../guides/TypeStructures.md#table-of-type-structure-classes).  I also need to be familiar with the following properties of `MethodSignatureImpl` objects:

- name
- parameters
- returnTypeStructure

For the `keys` case, I'll skip the research and present the solution:
```typescript
if (method.name === "keys") {
  const { returnTypeStructure } = method;
  assert.equal(returnTypeStructure?.kind, TypeStructureKind.TypeArgumented, "Expected a type-argumented type.");
  assert.equal(returnTypeStructure.objectType, LiteralTypeStructureImpl.get("IterableIterator"), "Expected an IterableIterator");
  assert.equal(returnTypeStructure.childTypes.length, 1);
  assert.equal(returnTypeStructure.childTypes[0], LiteralTypeStructureImpl.get("K"));

  returnTypeStructure.childTypes[0] = new TupleTypeStructureImpl([
    LiteralTypeStructureImpl.get("string"),
    LiteralTypeStructureImpl.get("string"),
  ]);
}
```

### Other iterator methods

### Methods taking arguments

## Creating the existing class structure

## Using `MemberedTypeToClass` to build the rest of the class

### Statements
