import {
  StructureKind,
} from "ts-morph";

import {
  GetAccessorDeclarationImpl,
  MethodSignatureImpl,
  ParameterDeclarationImpl,
  PropertySignatureImpl,
  SetAccessorDeclarationImpl,
  TypeMembersMap,
} from "#stage_two/snapshot/source/exports.js";

it("TypeMembersMap allows us to organize type members by kind", () => {
  const memberMap = new TypeMembersMap;
  const prop1 = new PropertySignatureImpl("one");
  const prop2 = new PropertySignatureImpl("two");

  const method3 = new MethodSignatureImpl("three");
  const getter4 = new GetAccessorDeclarationImpl(false, "four");
  const setter4 = new SetAccessorDeclarationImpl(false, "four", new ParameterDeclarationImpl("value"));

  memberMap.addMembers([
    prop1, prop2, method3, getter4, setter4
  ]);

  expect<readonly PropertySignatureImpl[]>(
    memberMap.arrayOfKind<StructureKind.PropertySignature>(StructureKind.PropertySignature)
  ).toEqual([prop1, prop2]);

  expect<readonly MethodSignatureImpl[]>(
    memberMap.arrayOfKind<StructureKind.MethodSignature>(StructureKind.MethodSignature)
  ).toEqual([method3]);

  expect<readonly GetAccessorDeclarationImpl[]>(
    memberMap.arrayOfKind<StructureKind.GetAccessor>(StructureKind.GetAccessor)
  ).toEqual([getter4]);

  expect<readonly SetAccessorDeclarationImpl[]>(
    memberMap.arrayOfKind<StructureKind.SetAccessor>(StructureKind.SetAccessor)
  ).toEqual([setter4]);
});
