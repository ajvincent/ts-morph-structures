# "Membered Type To Class" Primer

This package, `ts-morph-structures`, provides helper utilities for building classes out of existing TypeScript interfaces and object literals.  With some guidance, we can transform this:

```typescript
export interface RepeatString {
  stringValue: string;
  repeat(n: number): string;
}

type Vehicle = {
  color: string;
  get wheelCount(): number;
  set wheelCount(count: number);

  public startVehicle(passengers: string[]): void;
  public stopVehicle(): string[];
}
```

into this:

```typescript
class NumberStringClass implements RepeatString, Vehicle {
  color: string = "black";
  stringValue: string;

  #wheelCount = 4;
  #passengers: string[] = [];

  constructor(stringValue: string) {
    this.stringValue = string;
  }

  get wheelCount(): number {
    return this.#wheelCount;
  }
  set wheelCount(value: number) {
    this.#wheelCount = value;
  }

  repeat(n: number): string {
    return this.stringValue.repeat(n);
  }

  public startVehicle(passengers: string[]) {
    this.#passengers = passengers.slice();
  }

  public stopVehicle(): string[] {
    return this.#passengers;
  }
}
```

As you might imagine, such a task is not trivial.  There's a lot more in the class than in the combination of the interface and the object literal.  So how do we get from interfaces to classes?

## Concepts

Some of this may seem obvious to any programmer reading this, but it's important to lay out the foundations for why these utilities follow a specific pattern.  If these assumptions don't hold true for your use case, then you may not want to use the tools in this particular box.

### We build classes primarily around properties (some of which are private)

Properties of a class represent the actual data of the class.  They are what's specific to a particular instance of a class - or for static properties, what's specific to the class itself.  Everything else in the class builds on top of them (and the base class, of course).

In ts-morph-structures, the [`PropertyDeclarationImpl`](../api/structures/PropertyDeclarationImpl.md) represents a property structure, and has specific (pun not intended) properties:

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

Here I'm glossing over "return as early as you can", but this is solvable by creating more (private?) methods which do more specific tasks.

### Corollary: We can organize statements by constructor or getter or setter or method, then by purpose, then by the property they care about, then in an ordered array

Yes, four dimensions of complexity:

1. Where does a statement go? (constructor, getter, setter, method)
2. Why does a statement exist?  (purpose)
3. What property is that statement most about? (property)
4. What other statements go with that statement, and in what order?  (array of statements)

This becomes really important later ("ClassFieldStatementsMap").

### Definition: "Membered object" = [`InterfaceDeclarationImpl`](../api/structures/InterfaceDeclarationImpl.md) | [`MemberedObjectTypeStructureImpl`](../api/typeStructures/MemberedObjectTypeStructureImpl.md)

Both of these implement ts-morph's `TypeElementMemberedNodeStructure` interface, which has several properties:

- `callSignatures`: [`CallSignatureDeclarationImpl[]`](../api/structures/CallSignatureDeclarationImpl.md), _`(x: string): void;`_
- `constructSignatures`: [`ConstructSignatureDeclarationImpl[]`](../api/structures/ConstructSignatureDeclarationImpl.md), _`new (x: string): SomeObject`_
- `getAccessors`: [`GetAccessorDeclarationImpl[]`](../api/structures/GetAccessorDeclarationImpl.md), _`get y(): number`_
- `indexSignatures`: [`IndexSignatureDeclarationImpl[]`](../api/structures/IndexSignatureDeclarationImpl.md), _`[key: string]: boolean;`_
- `methods`: [`MethodSignatureImpl[]`](../api/structures/MethodSignatureImpl.md), _`doSomething(value: string): void`_
- `properties`: [`PropertySignatureImpl[]`](../api/structures/PropertySignatureImpl.md), _`color: string`_
- `setAccessors`: [`SetAccessorDeclarationImpl[]`](../api/structures/SetAccessorDeclarationImpl.md), _`set y(value: number);`_

Class structures have a different, partially compatible interface: [`ClassDeclarationImpl`](../api/structures/ClassDeclarationImpl.md).

- `ctors`: [`ConstructorDeclarationImpl[]`](../api/structures/ClassDeclarationImpl.md): _`constructor(color: string) {/* ... */}`_
  - Maybe there is some relation to `ConstructSignatureDeclarationImpl` above, but not in this context right now.  We very much build our own.
- `getAccessors`: `GetAccessorDeclarationImpl[]`
- `methods`: [`MethodDeclarationImpl[]`](../api/structures/MethodDeclarationImpl.md)
- `properties`: [`PropertyDeclarationImpl[]`](../api/structures/PropertyDeclarationImpl.md)
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

That said, the specific _keys_ of this map are _not_ necessarily the name of the member you have in mind.  Index signatures don't _have_ names, for example.  It's also easy to have a conflict between `get foo()` and a `foo` property.  For this, `TypeMembersMap` provides two static methods: `static keyFromMember(member: TypeMemberImpl): string` and `static keyFromName(kind: TypeMemberImpl["kind"], name: string): string`.  The basic algorithm for creating a key is simple:

1. If the member is a getter, add "get ".
2. If the member is a setter, add "set ".
3. Add the member's name.
4. Return the full key.

There are variations for constructors, index signatures and call signatures.

I do not recommend direct access to the map's inherited methods from `Map` unless you fully understand this algorithm.

For convenience, if you already have a membered object, `TypeMembersMap` has another method, `static fromMemberedObject(membered): TypeMembersMap`.

Individual maps have specific helper methods:

- `addMembers(members: TypeMemberImpl[]): void`
- `arrayOfKind<Kind extends TypeMemberImpl["kind"]>(kind: Kind)`
- `clone(): TypeMembersMap`
- `convertAccessorsToProperty(name: string): void`
- `convertPropertyToAccessors(name: string, toGetter: boolean, toSetter: boolean): void`
- `getAsKind<Kind extends TypeMemberImpl["kind"]>(kind: Kind, name: string)`
- `moveMembersToType(owner: InterfaceDeclarationImpl | MemberedObjectTypeStructureImpl): void`
- `resolveIndexSignature(signature: IndexSignatureDeclarationImpl, names: string[]): void`

The `resolveIndexSignature()` method needs some explanation.  [Index signatures](https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures) represent methods and properties, but with variable _names_ for the methods and properties.  Classes require concrete names.  This method lets you provide the concrete names to replace the index signature with.
