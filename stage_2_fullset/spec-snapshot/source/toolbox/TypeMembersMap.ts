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
    prop1.typeStructure = "string";
    prop2 = new PropertySignatureImpl("two");

    call_B = new CallSignatureDeclarationImpl;

    ctor_A = new ConstructSignatureDeclarationImpl;
    index_C = new IndexSignatureDeclarationImpl;
    index_C.keyName = "Key";
    index_C.keyTypeStructure = "string";
    index_C.returnTypeStructure = "boolean";

    method3 = new MethodSignatureImpl("three");
    getter4 = new GetAccessorDeclarationImpl(false, "four");
    getter4.returnTypeStructure = "number";
    const setterParam = new ParameterDeclarationImpl("value");
    setterParam.typeStructure = getter4.returnTypeStructure;
    setter4 = new SetAccessorDeclarationImpl(false, "four", setterParam);
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

    expect<GetAccessorDeclarationImpl>(
      membersMap.getAsKind<StructureKind.GetAccessor>(StructureKind.GetAccessor, "four")!
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
      membersMap.getAsKind<StructureKind.SetAccessor>(StructureKind.SetAccessor, "four")!
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

  describe("convertPropertyToAccessors()", () => {
    let getter1: GetAccessorDeclarationImpl | undefined;
    let setter1: SetAccessorDeclarationImpl | undefined;
    beforeEach(() => {
      membersMap.addMembers([prop1]);
      getter1 = undefined;
      setter1 = undefined;
    });

    function retrieveAccessors(): void {
      getter1 = membersMap.getAsKind<StructureKind.GetAccessor>(StructureKind.GetAccessor, prop1.name);
      setter1 = membersMap.getAsKind<StructureKind.SetAccessor>(StructureKind.SetAccessor, prop1.name);
    }

    it("can give us a getter only", () => {
      membersMap.convertPropertyToAccessors(prop1.name, true, false);
      retrieveAccessors();

      expect(getter1).not.toBeUndefined();
      if (getter1) {
        expect(getter1.name).toBe(prop1.name);
        // property didn't have any docs or trivia
        expect(getter1.docs).toEqual([]);
        expect(getter1.leadingTrivia).toEqual([]);
        expect(getter1.trailingTrivia).toEqual([]);
        // we used a string type
        expect(getter1.returnTypeStructure).toEqual(prop1.typeStructure);
      }

      expect(setter1).toBeUndefined();
      expect(membersMap.getAsKind<StructureKind.PropertySignature>(
        StructureKind.PropertySignature, prop1.name
      )).toBeUndefined();
    });

    it("can give us a setter only", () => {
      membersMap.convertPropertyToAccessors(prop1.name, false, true);
      retrieveAccessors();

      expect(getter1).toBeUndefined();

      expect(setter1).not.toBeUndefined();
      if (setter1) {
        expect(setter1.parameters.length).toBe(1);
        const [parameter] = setter1.parameters as ParameterDeclarationImpl[];
        expect(parameter).not.toBeUndefined();
        if (parameter) {
          expect(parameter.name).toBe("value");
          // we used a string type
          expect(parameter.type).toBe(prop1.type);
        }

        // property didn't have any docs or trivia
        expect(setter1.docs).toEqual([]);
        expect(setter1.leadingTrivia).toEqual([]);
        expect(setter1.name).toBe(prop1.name);
        expect(setter1.trailingTrivia).toEqual([]);
      }

      expect(membersMap.getAsKind<StructureKind.PropertySignature>(
        StructureKind.PropertySignature, prop1.name
      )).toBeUndefined();
    });

    it("can give us both a getter and a setter", () => {
      membersMap.convertPropertyToAccessors(prop1.name, true, true);
      retrieveAccessors();

      expect(getter1).not.toBeUndefined();
      if (getter1) {
        expect(getter1.name).toBe(prop1.name);
        // property didn't have any docs or trivia
        expect(getter1.docs).toEqual([]);
        expect(getter1.leadingTrivia).toEqual([]);
        expect(getter1.trailingTrivia).toEqual([]);
        // we used a string type
        expect(getter1.returnTypeStructure).toEqual(prop1.typeStructure);
      }

      expect(setter1).not.toBeUndefined();
      if (setter1) {
        expect(setter1.parameters.length).toBe(1);
        const [parameter] = setter1.parameters as ParameterDeclarationImpl[];
        expect(parameter).not.toBeUndefined();
        if (parameter) {
          expect(parameter.name).toBe("value");
          // we used a string type
          expect(parameter.type).toBe(prop1.type);
        }

        // property didn't have any docs or trivia
        expect(setter1.docs).toEqual([]);
        expect(setter1.leadingTrivia).toEqual([]);
        expect(setter1.name).toBe(prop1.name);
        expect(setter1.trailingTrivia).toEqual([]);
      }

      expect(membersMap.getAsKind<StructureKind.PropertySignature>(
        StructureKind.PropertySignature, prop1.name
      )).toBeUndefined();
    });

    it("throws if we asked for neither a getter nor a setter", () => {
      expect(
        () => membersMap.convertPropertyToAccessors(prop1.name, false, false)
      ).toThrowError("You must request either a get accessor or a set accessor!");
    });
  });

  describe("convertAccessorsToProperty() can give us a property", () => {
    let prop4: PropertySignatureImpl | undefined;

    function retrieveProperty(): void {
      prop4 = membersMap.getAsKind<StructureKind.PropertySignature>(StructureKind.PropertySignature, getter4.name);
    }

    it("from a getter only", () => {
      membersMap.addMembers([getter4]);
      membersMap.convertAccessorsToProperty(getter4.name);

      retrieveProperty();
      expect(prop4).not.toBeUndefined();
      if (prop4) {
        expect(prop4.name).toBe(getter4.name);
        expect(prop4.typeStructure).toBe(getter4.returnTypeStructure);
      }

      expect(membersMap.getAsKind<StructureKind.GetAccessor>(
        StructureKind.GetAccessor, getter4.name
      )).toBeUndefined();
    });

    it("from a setter only", () => {
      membersMap.addMembers([setter4]);
      membersMap.convertAccessorsToProperty(setter4.name);

      retrieveProperty();
      expect(prop4).not.toBeUndefined();
      if (prop4) {
        expect(prop4.name).toBe(setter4.name);
        const param = setter4.parameters[0] as ParameterDeclarationImpl;
        expect(prop4.typeStructure).toBe(param.typeStructure);
      }

      expect(membersMap.getAsKind<StructureKind.SetAccessor>(
        StructureKind.SetAccessor, setter4.name
      )).toBeUndefined();
    });

    it("from a getter and a setter", () => {
      membersMap.addMembers([getter4, setter4]);
      membersMap.convertAccessorsToProperty(getter4.name);

      retrieveProperty();
      expect(prop4).not.toBeUndefined();
      if (prop4) {
        expect(prop4.name).toBe(getter4.name);
        expect(prop4.typeStructure).toBe(getter4.returnTypeStructure);
      }

      expect(membersMap.getAsKind<StructureKind.GetAccessor>(
        StructureKind.GetAccessor, getter4.name
      )).toBeUndefined();

      expect(membersMap.getAsKind<StructureKind.SetAccessor>(
        StructureKind.SetAccessor, setter4.name
      )).toBeUndefined();
    });

    it("except when there is no getter or setter to start with", () => {
      expect(
        () => membersMap.convertAccessorsToProperty(getter4.name)
      ).toThrowError(getter4.name + " accessors not found!");
    });
  });
});