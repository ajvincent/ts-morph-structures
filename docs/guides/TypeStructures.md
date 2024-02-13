# Type Structures

In ts-morph, types in structures appear as strings, writer functions, or arrays of strings and writer functions.  You can convert writer functions to strings, and in fact you do, so this isn't the burden.  The burden is strings, which are not as easy to work with when you're dealing with a type having arguments, such as `Extract<Structures, { kind: StructureKind.Class }>`.  TypeScript is not a _regular_ language, meaning [_regular_ expressions are not sufficient to deal with it](https://blog.codinghorror.com/parsing-html-the-cthulhu-way/).  TypeScript types do not define a regular language either, so an [abstract syntax tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree) of the types is really nice to have.

Where ts-morph stops in its structure objects, ts-morph-structures lends a further hand.  This project bootstraps from ts-morph nodes to build a more complete (not complete - see "statements") structure tree, including subtrees for types.

## Basic type structures

Type structures are instances of classes, representing type nodes in the TypeScript AST.  There are a few fundamental type structures (meaning they can't get any simpler, and thus they have no children):

- `LiteralTypeStructureImpl`, representing literal values (boolean, string, null, object, this, void, etc.) and identifiers (Foo, NumberStringType, etc.), which I print as-is.
- `StringTypeStructureImpl`, which represents strings in double quotes.

`LiteralTypeStructureImpl` and `StringTypeStructureImpl` have a read-only `stringValue` property.  Their constructors take a single string as the string value.  

Also, each of these has a static `.get()` method, which returns a singleton structure for the value you pass in.  These structures are not cloneable because of their constant values, but I don't see this being a big problem.

- `WriterTypeStructureImpl`, for wrapping writer functions, if we get them.  (These are rare.)

Similarly, `WriterTypeStructureImpl` takes a writer function as its constructor's first argument, and exposes it via the readonly `writerFunction` property.

From these, I provide more complex type structures.

## Complex type structures

These are type structures which contain other type structures.

### Table of type structure classes

| Class name | Examples | Key properties |
|------------|----------|----------------|
| [ArrayTypeStructureImpl](../api/structures/type/ArrayTypeStructureImpl.md) | `string[]` | objectType |
| [ConditionalTypeStructureImpl](../api/structures/type/ConditionalTypeStructureImpl.md) | `foo extends true ? string : never` | checkType, extendsType, trueType, falseType |
| [FunctionTypeStructureImpl](../api/structures/type/FunctionTypeStructureImpl.md) | `("new" or "get" or "set" or "") name<typeParameters>(parameters, ...restParameter) ("=>" or ":" ) returnType` | name, typeParameters, parameters, restParameter, returnType, writerStyle |
| [IndexedAccessStructureImpl](../api/structures/type/IndexedAccessTypeStructureImpl.md) | `NumberStringType["repeatForward"]` | objectType, childTypes (`[TypeStructures]`) |
| [InferTypeStructureImpl](../api/structures/type/InferTypeStructureImpl.md) | `Elements extends [infer Head, ...infer Tail]` | typeParameter |
| [IntersectionTypeStructureImpl](../api/structures/type/IntersectionTypeStructureImpl.md) | `Foo & Bar` | childTypes |
| [LiteralTypeStructureImpl](../api/structures/type/LiteralTypeStructureImpl.md) | `string`, `number`, identifiers, etc. | stringValue |
| [MappedTypeTypeStructureImpl](../api/structures/type/MappedTypeTypeStructureImpl.md) | `{ readonly [key in keyof Foo]: boolean }` | parameter, type |
| [MemberedObjectTypeStructureImpl](../api/structures/type/MemberedObjectTypeStructureImpl.md) | See below | getAccessors, indexSignatures, methods, properties, setAccessors |
| [ParameterTypeStructureImpl](../api/structures/type/ParameterTypeStructureImpl.md) | `foo: boolean` | name, typeStructure |
| [ParenthesesTypeStructureImpl](../api/structures/type/ParenthesesTypeStructureImpl.md) | `(string)` | childTypes (`[TypeStructure]`) |
| [PrefixOperatorsTypeStructureImpl](../api/structures/type/PrefixOperatorsTypeStructureImpl.md) | `keyof typeof MyClass` | operators, objectType |
| [QualifiedNameTypeStructureImpl](../api/structures/type//QualifiedNameTypeStructureImpl.md) | `SyntaxKind.SourceFile` | childTypes (`string[]`)|
| [StringTypeStructureImpl](../api/structures/type/StringTypeStructureImpl.md)  | `"Hello World"` | stringValue |
| [TemplateLiteralTypeStructureImpl](../api/structures/type/TemplateLiteralTypeStructureImpl.md) | &#x60;`one${"A"}two${"C"}three`&#x60; | head, spans |
| [TupleTypeStructureImpl](../api/structures/type/TupleTypeStructureImpl.md) | `[string, number]` | childTypes |
| [TypeArgumentedTypeStructureImpl](../api/structures/type/TypeArgumentedTypeStructureImpl.md) | `Pick<Array, "slice">` | objectType, childTypes |
| [UnionTypeStructureImpl](../api/structures/type/UnionTypeStructureImpl.md) | "one" &#x7c; "two" &#x7c; "three" | childTypes |
| [WriterTypeStructureImpl](../api/structures/type/WriterTypeStructureImpl.md) | Wrapper for `(writer: CodeBlockWriter) => void` | writerFunction |

### Membered object types

These are very similar to interfaces.

```typescript
class Foo {}
type FooAlias = {
  readonly value: string;
  doSomething(): number;
  get myValue(): string;
  set myValue(value: string);

  // call signature
  (...args: unknown[]): Foo;

  // construct signature
  new (...args): Foo;
}

type BarAlias = {
  // index signature
  [foo: string]: number;
}
```

## Why is there a literal type structure?  Couldn't we just define a string instead?

Initially, raw strings for literals _was_ a specific goal for this.  Alas, the [`forEachAugmentedStructureChild()`](./NavigatingStructures.md) API is for iterating over _objects_.  To keep the iteration API simpler, I converted back to requiring `LiteralTypeStructureImpl` objects in these cases.

It's a trade-off.  Simpler types for obvious uses, or consistent API for convenient iteration?

Besides, if I _had_ kept strings as literals, I would forever be reserving them for that purpose, and no future expansion of this library could ever use them for any other purpose.  I can't justify that right now.

## Accessing type structures from existing structures

Generally speaking, where you have a single type field:

- The type is a string or writer function, per ts-morph.
- There is a matching type structure field, with the name matching and a suffix "Structure".

Example:

```typescript
const method = new MethodSignatureDeclarationImpl("foo");
method.returnTypeStructure = LiteralTypeStructureImpl.get("boolean");
console.log(method.returnType); // writes "boolean", without the quotes.
```

Where you have an _array_ of type structures (specifically, `ClassDeclarationImpl::implements` and `InterfaceDeclarationImpl::extends`), there are some special rules:

- The ts-morph structure types define these as `(string | WriterFunction)[]`.
  - This is great for serialization.
  - This doesn't allow for foreign types, like my `TypeStructure` objects.
  - As arrays, there is an implication of _ordered_ arrays, which isn't really necessary for types.
- These are effectively _readonly_ arrays in ts-morph-structures, because the structure class must maintain strict control of the array at all times.
  - Under the hood, these are _JavaScript proxies_ to a `ReadonlyArrayProxy` to control indexed access.
  - Modifying the array requires more complicated support.  It's not necessarily _hard_, just not a priority right now.

So how _do_ you modify the array of types?

These classes also provide type structure sets, in `ClassDeclarationImpl::implementsSet` and `InterfaceDeclarationImpl::extendsSet`, respectively.  Each of these is a `Set<TypeStructures>` object, with a couple extra methods:

- `cloneFromTypeStructureSet(other: TypeStructureSet): void;`
- `replaceFromTypeArray(array: (string | WriterFunction)[]): void;`

So you can just call `classDecl.implementsSet.add(typeStructure);`, and it will update `classDecl.implements` for you.

## A few notes

- Some of these type structures wrap standard structure classes:
  - `FunctionTypeStructureImpl`: typeParameters, parameters, restParameter
  - `InferTypeStructureImpl`: typeParameter
  - `MappedTypeStructureImpl`: parameter
  - `MemberedObjectTypeStructureImpl`: getAccessors, setAccessors
- You won't see `ParameterTypeStructureImpl` outside of `FunctionTypeStructureImpl`.
