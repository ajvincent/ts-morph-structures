import {
  StructureKind,
} from "ts-morph";

import {
  ClassDeclarationImpl,
  ClassMembersMap,
  ClassFieldStatementsMap,
  GetAccessorDeclarationImpl,
  ConstructorDeclarationImpl,
  ParameterDeclarationImpl,
  PropertyDeclarationImpl,
  MethodDeclarationImpl,
  SetAccessorDeclarationImpl,
} from "#stage_two/snapshot/source/exports.js";

describe("ClassMembersMap", () => {
  let membersMap: ClassMembersMap;
  let prop1: PropertyDeclarationImpl, prop2: PropertyDeclarationImpl;
  let ctor_A: ConstructorDeclarationImpl;
  let method3: MethodDeclarationImpl, method4: MethodDeclarationImpl;
  let getter5: GetAccessorDeclarationImpl;
  let setter5: SetAccessorDeclarationImpl;

  beforeEach(() => {
    membersMap = new ClassMembersMap;

    prop1 = new PropertyDeclarationImpl(false, "one");
    prop2 = new PropertyDeclarationImpl(false, "two");

    ctor_A = new ConstructorDeclarationImpl;

    method3 = new MethodDeclarationImpl(true, "three");
    method4 = new MethodDeclarationImpl(false, "four");

    const value_five = new ParameterDeclarationImpl("five");
    value_five.typeStructure = "string";

    getter5 = new GetAccessorDeclarationImpl(false, "five", value_five.typeStructure);
    setter5 = new SetAccessorDeclarationImpl(false, "five", value_five);
  });

  it("ClassMembersMap allows us to organize class members by kind", () => {
    membersMap.addMembers([
      prop1, prop2, ctor_A, method3, method4, getter5, setter5
    ]);

    expect(membersMap.get('one')).toBe(prop1);
    expect(membersMap.get("two")).toBe(prop2);
    expect(membersMap.get("static three")).toBe(method3);
    expect(membersMap.get("four")).toBe(method4);
    expect(membersMap.get("constructor")).toBe(ctor_A);
    expect(membersMap.get("get five")).toBe(getter5);
    expect(membersMap.get("set five")).toBe(setter5);
    expect(membersMap.size).toBe(7);

    expect(
      membersMap.getAsKind<StructureKind.Property>(StructureKind.Property, false, "one")
    ).toBe(prop1);

    expect(
      membersMap.getAsKind<StructureKind.Method>(StructureKind.Method, true, "three")
    ).toBe(method3);

    expect(
      membersMap.getAsKind<StructureKind.Method>(StructureKind.Method, false, "four")
    ).toBe(method4);

    expect(
      membersMap.getAsKind<StructureKind.Method>(StructureKind.Method, true, "four")
    ).toBe(undefined);

    expect<readonly PropertyDeclarationImpl[]>(
      membersMap.arrayOfKind<StructureKind.Property>(StructureKind.Property)
    ).toEqual([prop1, prop2]);

    expect<readonly MethodDeclarationImpl[]>(
      membersMap.arrayOfKind<StructureKind.Method>(StructureKind.Method)
    ).toEqual([method3, method4])

    expect<readonly ConstructorDeclarationImpl[]>(
      membersMap.arrayOfKind<StructureKind.Constructor>(StructureKind.Constructor)
    ).toEqual([ctor_A]);

    expect<readonly  GetAccessorDeclarationImpl[]>(
      membersMap.arrayOfKind<StructureKind.GetAccessor>(StructureKind.GetAccessor)
    ).toEqual([getter5]);

    expect<readonly  SetAccessorDeclarationImpl[]>(
      membersMap.arrayOfKind<StructureKind.SetAccessor>(StructureKind.SetAccessor)
    ).toEqual([setter5]);
  });

  it("ClassMembersMap: moveMembersToClass populates a class declaration", () => {
    membersMap.addMembers([
      prop1, prop2, ctor_A, method3, method4, getter5, setter5
    ]);

    const statementMap1 = new ClassFieldStatementsMap([
      ["two", "constructor", ["this.two = 2;"]],

      //prop1
      ["one", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, [`"one"`]],

      // getter5, setter5
      ["five", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, [`this.#five`]],

      // method3
      ["middle", "static three", ["void(this.middle);"]],
      [ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN, "static three", ["return tail;"]],
      [ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL, "static three", ["void(head);"]],

      // method4
      ["one", "four", [`console.log(this.one);`]],
    ]);

    const classDecl = new ClassDeclarationImpl;
    membersMap.moveMembersToClass(classDecl, [statementMap1]);

    expect(ctor_A.statements).toEqual([
      "this.two = 2;"
    ]);

    expect(prop1.initializer).toBe(`"one"`);

    expect(classDecl.methods).toEqual([method3, method4]);
    expect(method3.statements).toEqual([
      "void(head);", "void(this.middle);", "return tail;"
    ]);

    expect(method4.statements).toEqual([`console.log(this.one);`]);

    expect(getter5.statements).toEqual([`return this.#five;`]);
    expect(setter5.statements).toEqual([`this.#five = five;`]);
  });

  it("ClassMembersMap static methods give us keys we can use in the map", () => {
    expect(ClassMembersMap.keyFromMember(method3)).toBe("static three");

    expect(ClassMembersMap.keyFromName(StructureKind.Constructor, true, "three")).toBe("constructor");
    expect(ClassMembersMap.keyFromName(StructureKind.GetAccessor, true, "three")).toBe("static get three");
    expect(ClassMembersMap.keyFromName(StructureKind.Method, true, "three")).toBe("static three");
    expect(ClassMembersMap.keyFromName(StructureKind.Method, false, "three")).toBe("three");
    expect(ClassMembersMap.keyFromName(StructureKind.SetAccessor, true, "three")).toBe("static set three");
    expect(ClassMembersMap.keyFromName(StructureKind.Property, true, "three")).toBe("static three");
  });

  it("ClassMembersMap.fromClassDeclaration() converts a ClassDeclaration into a ClassMembersMap", () => {
    const classDecl = new ClassDeclarationImpl;
    classDecl.properties.push(prop1, prop2);
    classDecl.ctors.push(ctor_A);
    classDecl.methods.push(method3, method4);
    classDecl.getAccessors.push(getter5);
    classDecl.setAccessors.push(setter5);

    membersMap = ClassMembersMap.fromClassDeclaration(classDecl);
    expect(Array.from(membersMap.entries())).toEqual([
      ["constructor", ctor_A],
      ["get five", getter5],
      ["static three", method3],
      ["four", method4],
      ["one", prop1],
      ["two", prop2],
      ["set five", setter5],
    ]);
  });
});
