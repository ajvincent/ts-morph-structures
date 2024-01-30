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

Here I'm glossing over "return as early as you can", but this is solvable by creating more (private?) methods which do more specific tasks.

### Corollary: We can organize statements by constructor or getter or setter or method, then by purpose, then by the property they care about, then in an ordered array

Yes, four dimensions of statement complexity:

1. Where does a statement go? (constructor / initializer, getter, setter, method)
2. Why does a statement exist?  (purpose)
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
  - Maybe there is some relation to `ConstructSignatureDeclarationImpl` above, but not in this context right now.  We very much build our own.
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

There are variations for constructors, index signatures and call signatures.

I do not recommend direct access to the map's inherited methods from `Map` unless you fully understand this algorithm.

For convenience, if you already have a membered object, `TypeMembersMap` has another method,
- `static fromMemberedObject(membered): TypeMembersMap`.

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

The key algorithm is similar as well.  The methods for generating keys are `static keyFromMember(member: ClassMemberImpl): string` and `static keyFromName(kind: ClassMemberImpl["kind"], isStatic: boolean, name: string,): string`.  The algorithm for generating a key is:

1. If the member is static, add "static ".
2. If the member is a getter, add "get ".
3. If the member is a setter, add "set ".
4. Add the member's name.
5. Return the full key.

The class member map's non-static methods are similar too:

- `addMembers(members: readonly ClassMemberImpl[]): void;`
- `arrayOfKind<Kind extends ClassMemberImpl["kind"]>(kind: Kind);`
- `getAsKind<kind extend ClassMemberImpl["kind"]>(kind: Kind, key: string)`
- `moveMembersToClass(classDecl: ClassDeclarationImpl, statementMaps: ClassFieldStatementsMap[]): void;`

The `moveMembersToClass()` method is the last step in the process, but requires an explanation of `ClassFieldStatementsMap`.

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
- The second key is the function containing the array of statements, the "statement group".
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