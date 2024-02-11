# "Membered Type To Class" Primer

This package, `ts-morph-structures`, provides helper utilities for building stub classes out of existing TypeScript interfaces and object literals.  

As you might imagine, such a task is not trivial.  There's a lot more in the class than in the combination of the interface and the object literal.  So how do we get from interfaces to classes?

## Concepts

Some of this may seem obvious to any programmer reading this, but it's important to lay out the foundations for why these utilities follow a specific pattern.  If these assumptions don't hold true for your use case, then you may not want to use all of the tools in this particular box.

### We build classes primarily around properties (some of which are private)

Properties of a class represent the actual data of the class.  They are what's specific to a particular instance of a class - or for static properties, what's specific to the class itself.  Everything else in the class builds on top of them (and the base class, of course).

In ts-morph-structures, the [`PropertyDeclarationImpl`](../api/structures/standard/PropertyDeclarationImpl.md) represents a property structure, and has specific (pun not intended) properties:

- name
- type
- initializer
- isReadonly
- hasQuestionToken ("is it required or optional")
- isAbstract
- isStatic
- and so on.

For type-to-class purposes, we're concerned mostly with "name", "type" and "initializer".

### Constructors, methods and accessors interact with properties via [statements](../api/decorators/StatementedNodeStructureMixin.ts)

The first part of this is obvious to any programmer, but the most important part here is in the last word.  Without statements (in a particular order), methods are useless.  So are constructors, getters and setters.

### We can organize statements for a method (or constructor, getter or setter) in groups, first by purpose, then by property

By "purpose", I mean "what are we doing in this part?"  It could be one of several tasks:

- Checking class and method preconditions
- Validating arguments
- The actual work of the function:  Processing the arguments and the class fields
- Determining what to return
- Checking class and method postconditions
- Returning a value

Here I'm glossing over "return as early as you can".

### Corollary: We can organize statements by constructor or getter or setter or method, then by purpose, then by the property they care about, then in an ordered array

Yes, four dimensions of statement complexity:

1. Where does a statement go? (constructor / initializer, getter, setter, method)
2. Why does a statement exist? (purpose)
3. What property is that statement most about? (property)
4. What other statements go with that statement, and in what order?  (array of statements)

This becomes really important later ("ClassFieldStatementsMap").

### Definition: "Membered object" = [`InterfaceDeclarationImpl`](../api/structures/standard/InterfaceDeclarationImpl.md) | [`MemberedObjectTypeStructureImpl`](../api/structures/type/MemberedObjectTypeStructureImpl.md)

Both of these implement ts-morph's `TypeElementMemberedNodeStructure` interface, which has several properties:

- `callSignatures`: [`CallSignatureDeclarationImpl[]`](../api/structures/standard/CallSignatureDeclarationImpl.md), _`(x: string): void;`_
- `constructSignatures`: [`ConstructSignatureDeclarationImpl[]`](../api/structures/standard/ConstructSignatureDeclarationImpl.md), _`new (x: string): SomeObject`_
- `getAccessors`: [`GetAccessorDeclarationImpl[]`](../api/structures/standard/GetAccessorDeclarationImpl.md), _`get y(): number`_
- `indexSignatures`: [`IndexSignatureDeclarationImpl[]`](../api/structures/standard/IndexSignatureDeclarationImpl.md), _`[key: string]: boolean;`_
- `methods`: [`MethodSignatureImpl[]`](../api/structures/standard/MethodSignatureImpl.md), _`doSomething(value: string): void`_
- `properties`: [`PropertySignatureImpl[]`](../api/structures/standard/PropertySignatureImpl.md), _`color: string`_
- `setAccessors`: [`SetAccessorDeclarationImpl[]`](../api/structures/standard/SetAccessorDeclarationImpl.md), _`set y(value: number);`_

Class structures have a different, partially compatible interface: [`ClassDeclarationImpl`](../api/structures/standard/ClassDeclarationImpl.md).

- `ctors`: [`ConstructorDeclarationImpl[]`](../api/structures/standard/ClassDeclarationImpl.md): _`constructor(color: string) {/* ... */}`_
  - Maybe there is some relation to `ConstructSignatureDeclarationImpl` above, but not in this context right now.  I very much build my own here.
- `getAccessors`: `GetAccessorDeclarationImpl[]`
- `methods`: [`MethodDeclarationImpl[]`](../api/structures/standard/MethodDeclarationImpl.md)
- `properties`: [`PropertyDeclarationImpl[]`](../api/structures/standard/PropertyDeclarationImpl.md)
- `setAccessors`: `SetAccessorDeclarationImpl[]`

`MemberedTypeToClass` and its helpers try to bridge this specific gap.

## Supporting tools

### [`TypeMembersMap`](../api/toolbox/TypeMembersMap.md)

A membered object is ideal for serializing (writer functions not withstanding), but for getting a specific member, or for defining one, it's less direct.  `TypeMembersMap` extends `Map<string, TypeMemberImpl>` with the following definition:

```typescript
export type TypeMemberImpl = (
  CallSignatureDeclarationImpl |
  ConstructSignatureDeclarationImpl |
  GetAccessorDeclarationImpl |
  IndexSignatureDeclarationImpl |
  MethodSignatureImpl |
  PropertySignatureImpl |
  SetAccessorDeclarationImpl
);
```

That said, the specific _keys_ of this map are _not_ necessarily the name of the member you have in mind.  Index signatures don't _have_ names, for example.  It's also easy to have a conflict between `get foo()` and a `foo` property.  For this, `TypeMembersMap` provides two static methods:

- `static keyFromMember(member: TypeMemberImpl): string` and
- `static keyFromName(kind: TypeMemberImpl["kind"], name: string): string`

The basic algorithm for creating a key is simple:

1. If the member is a getter, add "get ".
2. If the member is a setter, add "set ".
3. Add the member's name.
4. Return the full key.

Example: `typeMembers.has(TypeMembersMap.keyFromMember(myProperty));`

There are variations for constructors, index signatures and call signatures.

I do not recommend direct access to the map's inherited methods from `Map` unless you fully understand this algorithm.

For convenience, if you already have a membered object, `TypeMembersMap` has another method.

- `static fromMemberedObject(membered): TypeMembersMap`

Individual maps have specific helper methods:

- `addMembers(members: TypeMemberImpl[]): void`
- `arrayOfKind<Kind extends TypeMemberImpl["kind"]>(kind: Kind)`
- `clone(): TypeMembersMap`
- `convertAccessorsToProperty(name: string): void`
- `convertPropertyToAccessors(name: string, toGetter: boolean, toSetter: boolean): void`
- `getAsKind<Kind extends TypeMemberImpl["kind"]>(kind: Kind, name: string)`
- `moveMembersToType(owner: InterfaceDeclarationImpl | MemberedObjectTypeStructureImpl): void`
- `resolveIndexSignature(signature: IndexSignatureDeclarationImpl, names: string[]): void`
- `sortEntries(comparator: (a: [string, TypeMemberImpl], b: [string, TypeMemberImpl]) => number): void;`

The `resolveIndexSignature()` method needs some explanation.  [Index signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures) represent methods and properties, but with variable _names_ for the methods and properties.  Classes require concrete names.  This method lets you provide the concrete names to replace the index signature with.

### [`ClassMembersMap`](../api/toolbox/ClassMembersMap.md)

Similar to `TypeMembersMap`, `ClassMembersMap extends Map<string, ClassMemberImpl>`.

```typescript
export type ClassMemberImpl = (
  ConstructorDeclarationImpl |
  PropertyDeclarationImpl |
  GetAccessorDeclarationImpl |
  SetAccessorDeclarationImpl |
  MethodDeclarationImpl
);
```

The key algorithm is similar as well.  The methods for generating keys are:

- `static keyFromMember(member: ClassMemberImpl): string`
- `static keyFromName(kind: ClassMemberImpl["kind"], isStatic: boolean, name: string,): string`

The algorithm for generating a key is:

1. If the member is static, add "static ".
2. If the member is a getter, add "get ".
3. If the member is a setter, add "set ".
4. Add the member's name.
5. Return the full key.

Other static methods:

- `fromClassDeclaration(classDecl: ClassDeclarationImpl): ClassMembersMap`
- `convertTypeMembers(isStatic: boolean, typeMembers: NamedTypeMemberImpl[], map?: WeakMap<ClassMemberImpl, TypeMemberImpl>): NamedClassMemberImpl[]`

The class member map's non-static methods are similar too:

- `addMembers(members: readonly ClassMemberImpl[]): void;`
- `arrayOfKind<Kind extends ClassMemberImpl["kind"]>(kind: Kind);`
- `moveMembersToClass(classDecl: ClassDeclarationImpl): ClassDeclarationImpl;`
- `clone(): ClassMembersMap;`
- `convertAccessorsToProperty(isStatic: boolean, name: string): void;`
- `convertPropertyToAccessors(isStatic: boolean, name: string, toGetter: boolean, toSetter: boolean);`
- `getAsKind<kind extend ClassMemberImpl["kind"]>(kind: Kind, key: string);`
- `moveStatementsToMembers(statementMaps: ClassFieldStatementsMap[]): void;`
- `sortEntries(comparator: (a: [string, ClassMemberImpl], b: [string, ClassMemberImpl]) => number): void;`

The `moveStatementsToMembers()` method requires an explanation of `ClassFieldStatementsMap`.

### [`ClassFieldStatementsMap`](../api/toolbox/ClassFieldStatementsMap.md)

Consider the following example:

```typescript
class RedAndBluePlayers {
  #redPoints: number;
  #bluePoints: number;

  constructor(redPoints: number, bluePoints: number) {
  }

  public movePointFromRedToBlue() {
  }

  public movePointFromBlueToRed() {
  }
}
```

Everything above we can get from a `TypeMembersMap`, converting to a `ClassMembersMap` (and adding the constructor to the class map).  What we can't get are the function bodies.  There's a number of statements to consider:

- If we're moving a point from red to blue,
  - Is `this.#redPoints` greater than zero? If not, throw.
  - Add one to `this.#bluePoints`.
  - Subtract one from `this.#redPoints`.
- If we're moving a point from blue to red,
  - Is `this.#bluePoints` greater than zero?  If not, throw.
  - Add one to `this.#redPoints`.
  - Subtract one from `this.#bluePoints`.

We could capture this as follows:

```typescript
const statementsMap = new ClassFieldStatementsMap();
statementsMap.set("_check", "movePointFromRedToBlue", [
  `if (this.#redPoints <= 0) throw new Error("no red points to move");`,
]);
statementsMap.set("_check", "movePointFromBlueToRed", [
  `if (this.#bluePoints <= 0) throw new Error("no blue points to move");`,
]);
statementsMap.set("redPoints", "movePointFromRedToBlue", [
  `this.#redPoints--;`,
]);
statementsMap.set("bluePoints", "movePointFromBlueToRed", [
  `this.#bluePoints++;`,
]);
statementsMap.set("redPoints", "movePointFromBlueToRed", [
  `this.#redPoints++;`,
]);
statementsMap.set("bluePoints", "movePointFromBlueToRed", [
  `this.#bluePoints--;`,
]);
statementsMap.set("redPoints", "constructor", [
  `this.#redPoints = redPoints;`,
]);
statementsMap.set("bluePoints", "constructor", [
  `this.#bluePoints = bluePoints;`,
]);
```

From the above, the class members map could then generate the following code:

```typescript
class RedAndBluePlayers {
  #redPoints: number;
  #bluePoints: number;

  constructor(redPoints: number, bluePoints: number) {
    this.#bluePoints = bluePoints;
    this.#redPoints = redPoints;
  }

  public movePointFromRedToBlue() {
    if (this.#redPoints <= 0) throw new Error("no red points to move");
    this.#bluePoints++;
    this.#redPoints--;
  }

  public movePointFromBlueToRed() {
    if (this.#bluePoints <= 0) throw new Error("no blue points to move");
    this.#bluePoints--;
    this.#redPoints++;
  }
}
```

This is what `ClassFieldStatementsMap` is all about.

Earlier, I mentioned four dimensions of complexity for statements.  `ClassFieldStatementsMap` handles three of them:

- Where does a statement go? (constructor / initializer, getter, setter, method)
- What property is that statement most about? (property)
- What other statements go with that statement, and in what order?  (array of statements)

`ClassFieldStatementsMap` is a _two-keyed_ map, with similar API to `Map<string, ClassFieldStatement[]>`.  It's like saying `Map<string, string, ClassFieldStatement[]>`, although this would be an illegal map definition.  (I derived it from my ["composite-collection"](https://github.com/ajvincent/composite-collection) library, which generates multi-keyed maps and sets.)

- The first key is the property name, or "field name".
  - Special key: `ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL` for statements that must be at the head of a statement group.  (Example: `super.doSomething();`)
  - Special key: `ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN` for statements that must be at the tail of a statement group.  (Example: `return true;`)
  - Otherwise, statements for property names appear in [lexical order](https://en.wikipedia.org/wiki/Lexicographic_order).
- The second key is the function containing the array of statements, the "statement group".
  - Special key: `ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY`.  For properties, this is an initializer for the property.  (Example: `foo: number = 5;`)  For getters and setters, this represents a value to mirror.  (Example: `return this.#foo;`, `this.#foo = value;`)
- The value is the array of statements.

```typescript
export type ClassFieldStatement = string | WriterFunction | StatementStructureImpls;

export type StatementStructureImpls =
  | ClassDeclarationImpl
  | EnumDeclarationImpl
  | ExportAssignmentImpl
  | ExportDeclarationImpl
  | FunctionDeclarationImpl
  | ImportDeclarationImpl
  | InterfaceDeclarationImpl
  | ModuleDeclarationImpl
  | TypeAliasDeclarationImpl
  | VariableStatementImpl;
```

Beyond the standard methods of a `Map`, there are two additional methods specific to statement groups (the second key):

- `groupKeys(): string[]`, returning all the statement group keys.
- `groupStatementsMap(statementGroup: string): ReadonlyMap<string, ClassFieldStatement[]> | undefined`, returning all the field names and statement arrays for a given statement group.

`ClassFieldStatementsMap` exposes other features:

- `purposeKey?: string;`: the purpose key (though this is just a placeholder)
- `regionName?: string;`: `//#region` and `//#endregion` comments around the block for [code folding](https://code.visualstudio.com/docs/editor/codebasics#_folding)
- `isBlockStatement: boolean`: if true, enclose all statements from the map in curly braces.

Other useful methods:

- `static normalizeKeys(fieldName: string, statementGroup: string): [string, string];`
- `static fieldComparator(a: string, b: string): number;` (for sorting statements by field name)

## [`MemberedTypeToClass`](../api/toolbox/MemberedTypeToClass.md): your driver for creating stub classes

Now we get to the center of it all: the `MemberedTypeToClass` class.  Primarily, it has a few tasks, in order:

1. Convert signatures of methods, properties, getters and setters from existing types (`importFromMemberedType()`, `importFromTypeMembersMap()`, `addTypeMember()`)
2. Define a constructor's parameters (which you pass in when calling `new MemberedTypeToClass`)
3. Define a callback hook for getting statements (which you pass in when calling `new MemberedTypeToClass`)
4. Define other callback hooks for:
  - Resolving index signatures (`indexSignatureResolver`)
  - Deciding if a class member is abstract (`isAbstractCallback`)
  - Declaring a class method is asynchronous (`isAsyncCallback`)
  - Declaring a class method is a generator (`isGeneratorCallback`)
  - Declaring a class field's scope ("public", "protected", "private": `scopeCallback`)
5. Defining the class field statement maps (purpose, `isBlockStatement`, optional `regionName`)
6. Building a class members map using all of the above (`buildClassMembersMap()`)

Building a class declaration is trivial, once you have the class members map.  (`.moveMembersToClass(classDecl)`)

### Adding type members

```typescript
declare class MemberedTypeToClass {
  importFromMemberedType(
    isStatic: boolean,
    membered: InterfaceDeclarationImpl | MemberedObjectTypeStructureImpl,
  ): void;

  importFromTypeMembersMap(
    isStatic: boolean,
    membersMap: TypeMembersMap,
  ): void;

  addTypeMember(
    isStatic: boolean,
    member: TypeMemberImpl
  ): void;
}
```

With an [`InterfaceDeclarationImpl`](../api/structures/standard/InterfaceDeclarationImpl.md) or a [`MemberedObjectTypeStructureImpl`](../api/structures/type/MemberedObjectTypeStructureImpl.md), or a `TypeMembersMap`, or an ordinary type member, you can define class members to build.

Please note the type members you define might not be the type members you start with.  For example, your original interface might say:

```typescript
interface ColorSpectrum {
  colors: string | string[]
}
```

But you may want to implement:

```typescript
interface ColorSpectrum {
  colors: string[]
}
```

Here, it's best to:

1. Clone the interface structure
2. Modify the type members of the clone as necessary
3. Feed the cloned interface to `MemberedTypeToClass`

Later, you can use the original interface as part of an `implementsSet` for the class declaration.

### Constructor parameters and the statements callback

```typescript
declare class MemberedTypeToClass {
  constructor(
    constructorArguments: ParameterDeclarationImpl[],
    statementsGetter: ClassStatementsGetter,
  );
}

export interface ClassStatementsGetter {
  getStatements(key: MemberedStatementsKey): ClassFieldStatement[];
}

export interface MemberedStatementsKey {
  readonly fieldKey: string;
  readonly statementGroupKey: string;
  readonly purpose: string;

  readonly isFieldStatic: boolean;
  readonly fieldType: ReadonlyDeep<TypeMemberImpl> | undefined;

  readonly isGroupStatic: boolean;
  readonly groupType: ReadonlyDeep<TypeMemberImpl> | undefined;
}
```

The `constructorArguments` are the parameters to define on the class constructor, if one is necessary.  (If the constructor has no statements, not even a `super()` call, the class members map will omit the constructor.)

The `statementsGetter` interface is a simple callback hook.  It provides the field key, the statement group key, and the purpose for the statement array in question.  You return the array matching those conditions.

It may not be convenient to have _all_ of these in one callback object.  More likely, you'll want to forward the request to other `ClassStatementsGetter` objects based on the field key, the statement group key, and/or the purpose.  Rather than decide for you how to do such routing, I simply provide the interface for you to make the decisions.

### Callback hooks

The callbacks each provide useful information to `MemberedTypeToClass`.  In simplified pseudo-code,

```typescript
export interface IndexSignatureResolver {
  resolveIndexSignature(signature: IndexSignatureDeclarationImpl): string[];
}

export interface ClassAbstractMemberQuestion {
  isAbstract(kind: ClassMemberType["kind"], memberName: string): boolean;
}

export interface ClassAsyncMethodQuestion {
  isAsync(isStatic: boolean, kind: StructureKind.Method, memberName: string): boolean;
}

export interface ClassGeneratorMethodQuestion {
  isGenerator(isStatic: boolean, kind: StructureKind.Method, memberName: string): boolean;
}

export interface ClassScopeMemberQuestion {
  getScope(isStatic: boolean, kind: ClassMemberImpl["kind"], memberName: string): Scope | undefined
}

declare class MemberedTypeToClass {
  indexSignatureResolver?: IndexSignatureResolver;
  isAbstractCallback?: ClassAbstractMemberQuestion;
  isAsyncCallback?: ClassAsyncMethodQuestion;
  isGeneratorCallback?: ClassGeneratorMethodQuestion;
  scopeCallback?: ClassScopeMemberQuestion;
}
```

### Defining class field statement maps

```typescript

declare class MemberedTypeToClass {
  defineStatementsByPurpose(
    purposeKey: string,
    isBlockStatement: boolean,
    regionName?: string,
  ): void;
}
```

These allow you to define each `ClassFieldStatementMap`, in the order you wish the statemeent blocks to appear by purpose.

### Building a class members map

```typescript
declare class MemberedTypeToClass {
  buildClassMembersMap(): ClassMembersMap;
}
```

Note this is the final part of the process:  after invoking this, none of the other methods of `MemberedTypeToClass` should work.

After this, you usually would call `.moveMembersToClass(classDecl)` on the `ClassMembersMap`.

## Suggested practices (not "best" because this is still new)

- Define your type members strictly, or narrow existing types via cloning.  The class members' definitions I infer directly from the type members you pass in.
- Give your purpose keys meaningful names.  "one", "two", "three" are less useful than "precondition", "argumentValidation", "processing".
- Decide carefully whether you want to use "isBlockStatement" on purpose blocks.  Curly braces affect the scope of `const` and `let` variable declarations.
  - Region names, on the other hand, are comments and won't affect scope.
- Consider implementing router and/or filter classes for your statements getter.

## What's not part of this?

### Class member sorting / organization, mixing class field types

This is because ts-morph provides no mechanism for organizing class members from a structure.  You give ts-morph a `ClassDeclarationStructure`, and it decides for you where to put the members.  Properties appear in one group, methods in another, getters and setters in another.  It's outside my control.

### Pretty-printing of statements

What you put in, you get out.  I provide the ts-morph structures, but I don't try to format the outputs beyond common sense.  Once they go into a ts-morph node, it's up to you to use utilities like ts-morph or Prettier to clean up the output.

### A "satisfies" statement for the class

Some time ago, [a TypeScript bug on "static implements"](https://github.com/microsoft/TypeScript/issues/33892) inspired me to add `Foo satisfies CloneableStructure<FooType>` statements after my classes, to type-check static fields.  `ClassDeclarationImpl` doesn't support that (yet), though I could see that being very useful.

### Rigorous validation of inputs

You can do dumb things with ts-morph-structures, like provide a getter and a property with the same name.  You can do the same dumb things with ts-morph.  The utilities here don't try very hard to protect you from this.

## Enjoy!

Please, let me know of any pain points you encounter - and suggestions for improving them.  Unlike the structure classes, these are more complex.  I can add new features as necessary.
