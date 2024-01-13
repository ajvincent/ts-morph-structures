import {
  StructureKind,
} from "ts-morph";

import {
  ClassMembersMap,
  ConstructorDeclarationImpl,
  PropertyDeclarationImpl,
  MethodDeclarationImpl,
} from "#stage_two/snapshot/source/exports.js";

it("ClassMembersMap allows us to organize class members by kind", () => {
  const memberMap = new ClassMembersMap;

  const prop1 = new PropertyDeclarationImpl(false, "one");
  const prop2 = new PropertyDeclarationImpl(false, "two");

  const ctor_A = new ConstructorDeclarationImpl;

  const method3 = new MethodDeclarationImpl(true, "three");
  const method4 = new MethodDeclarationImpl(false, "four");

  memberMap.addMembers([
    prop1, prop2, ctor_A, method3, method4
  ]);

  expect(memberMap.get("one")).toBe(prop1);
  expect(memberMap.get("two")).toBe(prop2);
  expect(memberMap.get("static three")).toBe(method3);
  expect(memberMap.get("four")).toBe(method4);
  expect(memberMap.get("constructor")).toBe(ctor_A);
  expect(memberMap.size).toBe(5);

  expect<readonly PropertyDeclarationImpl[]>(
    memberMap.arrayOfKind<StructureKind.Property>(StructureKind.Property)
  ).toEqual([prop1, prop2]);

  expect<readonly MethodDeclarationImpl[]>(
    memberMap.arrayOfKind<StructureKind.Method>(StructureKind.Method)
  ).toEqual([method3, method4])

  expect<readonly ConstructorDeclarationImpl[]>(
    memberMap.arrayOfKind<StructureKind.Constructor>(StructureKind.Constructor)
  ).toEqual([ctor_A]);
});
