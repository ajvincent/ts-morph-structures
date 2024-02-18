# Integrating hand-written code with generated code for stage 2

Here, we host [source code](./source/) and [snapshot build tools](./build/) to generate a final snapshot.

## Philosophy of this design

- Type structures map to type nodes.
- Every type attribute on a structure class has a backing type structure.
- Recursive design for creating type structures.
- Each type structure class does only one thing, but does it well.
- Each type structure class is _cloneable_.
- The source code should be readable.

## Source files

### `StructureBase`

All ts-morph structure classes inherit from [`StructureBase`](./source/base/StructureBase.ts).

### Classes maps

There are two class maps for this project:

```typescript
const StructuresClassesMap = new Map<
  StructureKind,
  CloneableStructure<Structures> & Class<KindedStructure<StructureKind>>
>;

// with a couple additional utility methods
const TypeStructureClassesMap = new Map<
  TypeStructureKind,
  CloneableStructure<TypeStructures> & Class<KindedTypeStructure<TypeStructureKind>>
>;

export type CloneableStructure<
  Base extends Structure,
  Result extends StructureImpls,
> = Class<Base> & {
  clone(other: OptionalKind<Base> | Base): Result;
};

export type CloneableTypeStructure<Base extends TypeStructures> =
  Class<Base> & {
    clone(other: Base): Base;
  };
```

These provide a common API for cloning a structure or type structure:  get the class from the map, then invoke the class's static `clone()` method.

The source files are [StructureClassesMap](./source/base/StructuresClassesMap.ts) and [TypeStructureClassesMap](./source/base/TypeStructureClassesMap.ts).

### `TypeStructureKind`

Each type structure has a `kind` property which comes from a [`TypeStructureKind`](./source/base/TypeStructureKind.ts) enum.  The values for this enum start at 1,000,000,000.  Since there's less than 100 type structure kinds, there should be no conflict with ts-morph.

There is also a `KindedTypeStructure` type, similar to `KindedStructure`.

By using a similar enum to `StructureKind`, perhaps I can make a future migration into ts-morph easier, if it ever happens.

## Build files