import {
  StructureKind,
} from "ts-morph";

import {
  CallSignatureDeclarationImpl,
  ConstructSignatureDeclarationImpl,
  GetAccessorDeclarationImpl,
  IndexSignatureDeclarationImpl,
  InterfaceDeclarationImpl,
  MemberedObjectTypeStructureImpl,
  MethodSignatureImpl,
  ParameterDeclarationImpl,
  PropertySignatureImpl,
  SetAccessorDeclarationImpl,
  TypeMembersMap,
} from "#stage_two/snapshot/source/exports.js";

describe("TypeMembersMap", () => {
  let membersMap: TypeMembersMap;
  let call_B: CallSignatureDeclarationImpl;
  let prop1: PropertySignatureImpl, prop2: PropertySignatureImpl;
  let ctor_A: ConstructSignatureDeclarationImpl;
  let index_C: IndexSignatureDeclarationImpl;
  let method3: MethodSignatureImpl;
  let getter4: GetAccessorDeclarationImpl;
  let setter4: SetAccessorDeclarationImpl;

  beforeEach(() => {
    membersMap = new TypeMembersMap;
    prop1 = new PropertySignatureImpl("one");
    prop2 = new PropertySignatureImpl("two");

    call_B = new CallSignatureDeclarationImpl;

    ctor_A = new ConstructSignatureDeclarationImpl;
    index_C = new IndexSignatureDeclarationImpl;
    index_C.keyName = "Key";
    index_C.keyTypeStructure = "string";
    index_C.returnTypeStructure = "boolean";

    method3 = new MethodSignatureImpl("three");
    getter4 = new GetAccessorDeclarationImpl(false, "four");
    setter4 = new SetAccessorDeclarationImpl(false, "four", new ParameterDeclarationImpl("value"));
  });

  it("allows us to organize type members by kind", () => {
    membersMap.addMembers([
      prop1, prop2, method3, getter4, setter4, ctor_A, call_B, index_C
    ]);

    expect(membersMap.get(TypeMembersMap.keyFromMember(call_B))).toBe(call_B);
    expect(membersMap.get('constructor')).toBe(ctor_A);
    expect(membersMap.get("get four")).toBe(getter4);
    expect(membersMap.get("set four")).toBe(setter4);
    expect(membersMap.get("one")).toBe(prop1);
    expect(membersMap.get("two")).toBe(prop2);
    expect(membersMap.get("three")).toBe(method3);
    expect(membersMap.get(TypeMembersMap.keyFromMember(index_C))).toBe(index_C);
    expect(membersMap.size).toBe(8);

    expect<ConstructSignatureDeclarationImpl>(
      membersMap.getAsKind<StructureKind.ConstructSignature>(StructureKind.ConstructSignature, "constructor")!
    ).toBe(ctor_A);

    expect<GetAccessorDeclarationImpl>(
      membersMap.getAsKind<StructureKind.GetAccessor>(StructureKind.GetAccessor, "get four")!
    ).toBe(getter4);

    expect<PropertySignatureImpl>(
      membersMap.getAsKind<StructureKind.PropertySignature>(StructureKind.PropertySignature, "one")!
    ).toBe(prop1);

    expect<PropertySignatureImpl>(
      membersMap.getAsKind<StructureKind.PropertySignature>(StructureKind.PropertySignature, "two")!
    ).toBe(prop2);

    expect<MethodSignatureImpl>(
      membersMap.getAsKind<StructureKind.MethodSignature>(StructureKind.MethodSignature, "three")!
    ).toBe(method3);

    expect<SetAccessorDeclarationImpl>(
      membersMap.getAsKind<StructureKind.SetAccessor>(StructureKind.SetAccessor, "set four")!
    ).toBe(setter4);

    expect<readonly CallSignatureDeclarationImpl[]>(
      membersMap.arrayOfKind<StructureKind.CallSignature>(StructureKind.CallSignature)
    ).toEqual([call_B]);

    expect<readonly ConstructSignatureDeclarationImpl[]>(
      membersMap.arrayOfKind<StructureKind.ConstructSignature>(StructureKind.ConstructSignature)
    ).toEqual([ctor_A]);

    expect<readonly GetAccessorDeclarationImpl[]>(
      membersMap.arrayOfKind<StructureKind.GetAccessor>(StructureKind.GetAccessor)
    ).toEqual([getter4]);

    expect<readonly IndexSignatureDeclarationImpl[]>(
      membersMap.arrayOfKind<StructureKind.IndexSignature>(StructureKind.IndexSignature)
    ).toEqual([index_C]);

    expect<readonly PropertySignatureImpl[]>(
      membersMap.arrayOfKind<StructureKind.PropertySignature>(StructureKind.PropertySignature)
    ).toEqual([prop1, prop2]);

    expect<readonly MethodSignatureImpl[]>(
      membersMap.arrayOfKind<StructureKind.MethodSignature>(StructureKind.MethodSignature)
    ).toEqual([method3]);

    expect<readonly SetAccessorDeclarationImpl[]>(
      membersMap.arrayOfKind<StructureKind.SetAccessor>(StructureKind.SetAccessor)
    ).toEqual([setter4]);
  });

  it("moveMembersToType() populates a membered object", () => {
    membersMap.addMembers([
      prop1, prop2, method3, getter4, setter4, ctor_A, call_B, index_C
    ]);

    const interface_D = new InterfaceDeclarationImpl("Foo");
    membersMap.moveMembersToType(interface_D);

    expect(interface_D.callSignatures).toEqual([call_B]);
    expect(interface_D.constructSignatures).toEqual([ctor_A]);
    expect(interface_D.getAccessors).toEqual([getter4]);
    expect(interface_D.indexSignatures).toEqual([index_C]);
    expect(interface_D.methods).toEqual([method3]);
    expect(interface_D.properties).toEqual([prop1, prop2]);
    expect(interface_D.setAccessors).toEqual([setter4]);
  });

  it("static fromMemberedObject() converts a MemberedObjectTypeStructureImpl into a TypeMembersMap", () => {
    const membered = new MemberedObjectTypeStructureImpl;
    membered.callSignatures.push(call_B);
    membered.constructSignatures.push(ctor_A);
    membered.indexSignatures.push(index_C);
    membered.getAccessors.push(getter4);
    membered.setAccessors.push(setter4);
    membered.properties.push(prop1, prop2);
    membered.methods.push(method3);

    membersMap = TypeMembersMap.fromMemberedObject(membered);
    expect(Array.from(membersMap.entries())).toEqual([
      [TypeMembersMap.keyFromMember(call_B), call_B],
      ["constructor", ctor_A],
      ["get four", getter4],
      [TypeMembersMap.keyFromMember(index_C), index_C],
      ["three", method3],
      ["one", prop1],
      ["two", prop2],
      ["set four", setter4],
    ]);
  });
});
