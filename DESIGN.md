# Roadmap for ts-morph structure classes

## New classes code

### StructureImplementer interface

```typescript
import type {
  Class,
} from "type-fest";

import type {
  OptionalKind,
  Structure,
} from "ts-morph";

interface StructureImplementer<
  Base extends Structure,
  NodeBase extends Node
> extends Class<Base>
{
  clone(source: OptionalKind<Base>): StructureImplementer<Base, NodeBase>;
  fromNode(source: NodeBase): StructureImplementer<Base, NodeBase>;
}
```

### StructureBaseImpl

```typescript
import { stringOrWriterFunction } from "./source/types/ts-morph-native.js";
import { Structure } from "ts-morph";
import { stringOrWriterFunctionArray } from "./utilities.js";

export default class StructureBaseImpl {
  leadingTrivia: stringOrWriterFunction[] = [];
  trailingTrivia: stringOrWriterFunction[] = [];

  protected static copyStructure(
    source: Structure,
    target: StructureBase
  ): void
  {
    target.leadingTrivia = stringOrWriterFunctionArray(source.leadingTrivia);
    target.trailingTrivia = stringOrWriterFunctionArray(source.trailingTrivia);
  }
  
  protected static copyFromNode(
    source: Node,
    target: StructureBaseImpl
  ): void
  {
    // to be determined
  }
}

```

### Structure class decorators

Each decorator will return a class extending `StructureBaseImpl` and overriding `copyStructure` and `copyFromNode`.  

### Structure classes

Each class will be a mixin from class decorators, similar to how I implemented them in my project.  A few notes:

- Each class must be the default export from a module, following the naming convention I have established (`s/Structure$/Impl/`).
- Each class must subclass `StructureBaseImpl`
- Each class must satisfy `StructureImplementer`: it must have static methods for `clone()` and `fromNode()`.
- For cloning purposes, each structure class must register with a `CloneableStructuresMap` by structure kind.

### Miscellaneous

- Defining the `TypeStructures` union, and adding it to the `Structures` union
- Adding the `StructuresClassesMap` map for cloning structures
- Adding a `Map<SyntaxKind, StructureBaseImpl & { fromNode: (node: Node) => StructureBaseImpl }>` as a `FromNodeMap`, for invoking `fromNode` for an arbitrary node supporting structures
- `Structure.isFooTypedStructure(object);`
- Type node constructors for these new structures taking the structure as an argument

### Exports

Ideally, we'd export all the new structure classes and interfaces.  Internal objects (`TypeAccessors` and `StructureClassesMap`, for example) we would not export.

### `TypedNodeStructure`

```typescript
export interface TypedNodeStructure {
  /** @deprecated */
  type?: string | WriterFunction;

  typeStructure?: TypeStructures;
}

```

Similar changes to `ReturnTypedNodeStructure`, `ClassLikeDeclarationBaseSpecificStructure` (for `extends`), `TypeParameterDeclarationSpecificStructure` (for `constraint` and `default`).

### `ImplementsClauseableNodeStructure` and `ExtendsClauseableNodeStructure`

```typescript
export interface ImplementsClauseableNodeStructure {
  /** @deprecated */
  implements?: (string | WriterFunction)[] | WriterFunction;
  implementsSet: Set<string | WriterFunction | TypeStructures>;
}
```

Similar changes for `ExtendsClauseableNodeStructure`.

## Project management

- Estimated time to code-complete: ???
  - People have waited a long time for this, and I have only my spare time to offer.
  - This will _not_ be quick.
  - Help wanted!!!
