import {
  StructureKind,
  type CodeBlockWriter,
  Scope,
  type WriterFunction
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  ClassMembersMap,
  type ClassMemberImpl,
  type ClassStatementsGetter,
  GetAccessorDeclarationImpl,
  IndexSignatureDeclarationImpl,
  InterfaceDeclarationImpl,
  type MemberedStatementsKey,
  MemberedTypeToClass,
  MemberedObjectTypeStructureImpl,
  MethodSignatureImpl,
  ParameterDeclarationImpl,
  PropertySignatureImpl,
  SetAccessorDeclarationImpl,
  TypeMembersMap,
  type stringOrWriterFunction,
  type stringWriterOrStatementImpl,
} from "#stage_two/snapshot/source/exports.js";

import {
  MemberedStatementsKeyClass,
} from "#stage_two/snapshot/source/internal-exports.js";

class StubStatementsGetter implements ClassStatementsGetter {
  static #hashKeys(
    fieldName: string,
    groupName: string,
    purpose: string
  ): string
  {
    const keyClass = new MemberedStatementsKeyClass(fieldName, groupName, purpose);
    return JSON.stringify(keyClass);
  }

  readonly #writerToContents = new WeakMap<WriterFunction, string>;
  readonly #statementsMap = new Map<string, stringWriterOrStatementImpl[]>;
  readonly #visitedHashes = new Set<string>;

  createWriter(
    contents = "void(true);"
  ): WriterFunction
  {
    const writer = function(writer: CodeBlockWriter): void {
      writer.writeLine(contents);
    };
    this.#writerToContents.set(writer, contents);
    return writer;
  }

  getWriterValues(
    keys: stringOrWriterFunction[]
  ): string[]
  {
    return keys.map(key => {
      if (typeof key === "string")
        return key;
      return this.#writerToContents.get(key)!;
    });
  }

  setStatements(
    fieldName: string,
    groupName: string,
    purpose: string,
    statements: stringWriterOrStatementImpl[]
  ): void
  {
    const hash = StubStatementsGetter.#hashKeys(fieldName, groupName, purpose);
    this.#statementsMap.set(hash, statements);
  }

  getStatements(
    key: MemberedStatementsKey
  ): stringWriterOrStatementImpl[]
  {
    const hash = StubStatementsGetter.#hashKeys(key.fieldKey, key.statementGroupKey, key.purpose);
    this.#visitedHashes.add(hash);
    return this.#statementsMap.get(hash) ?? [];
  }

  get visitedSize(): number {
    return this.#visitedHashes.size;
  }

  hasVisited(
    fieldName: string,
    groupName: string,
    purpose: string,
  ): boolean
  {
    return this.#visitedHashes.has(
      StubStatementsGetter.#hashKeys(fieldName, groupName, purpose)
    );
  }

  matchesVisited(
    fieldNames: string[],
    groupNames: string[],
    purposeKeys: string[]
  ): boolean
  {
    for (const fieldName of fieldNames) {
      for (const groupName of groupNames) {
        for (const purpose of purposeKeys) {
          if (!this.hasVisited(fieldName, groupName, purpose))
            return false;
        }
      }
    }

    return true;
  }
}

describe("MemberedTypeToClass", () => {
  let statementsGetter: StubStatementsGetter;
  let typeToClass: MemberedTypeToClass;
  beforeEach(() => {
    statementsGetter = new StubStatementsGetter;
    typeToClass = new MemberedTypeToClass([], statementsGetter);
  });

  it("can create an empty class, with no statement maps", () => {
    const classMembers: ClassMembersMap = typeToClass.buildClassMembersMap();
    expect(classMembers.size).toBe(0);

    expect(statementsGetter.visitedSize).toBe(0);
  });

  it("will visit all keys and groups for a constructor with multiple statement groups", () => {
    // testing order of statement groups
    typeToClass.defineStatementsByPurpose("first", false);
    typeToClass.defineStatementsByPurpose("second", false);
    typeToClass.defineStatementsByPurpose("fourth", false);

    const first_head_ctor = statementsGetter.createWriter(`void("first head");`);
    const second_head_ctor = statementsGetter.createWriter(`void("second head");`);
    const fourth_head_ctor = statementsGetter.createWriter(`void("fourth head");`);
    const first_tail_ctor = statementsGetter.createWriter(`void("first tail");`);
    const second_tail_ctor = statementsGetter.createWriter(`void("second tail");`);
    const fourth_tail_ctor = statementsGetter.createWriter(`void("fourth tail");`);

    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL, "constructor", "first", [
        first_head_ctor
      ]
    );
    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN, "constructor", "first", [
        first_tail_ctor
      ]
    );
    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL, "constructor", "fourth", [
        fourth_head_ctor
      ]
    );
    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN, "constructor", "fourth", [
        fourth_tail_ctor
      ]
    );
    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL, "constructor", "second", [
        second_head_ctor
      ]
    );
    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN, "constructor", "second", [
        second_tail_ctor
      ]
    );

    const classMembers: ClassMembersMap = typeToClass.buildClassMembersMap();

    expect(statementsGetter.matchesVisited(
      [ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL, ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN],
      ["constructor"],
      ["first", "second", "fourth"],
    )).toBe(true);

    expect(statementsGetter.visitedSize).toBe(6);

    expect(classMembers.size).toBe(1);
    const ctor = classMembers.get(
      ClassMembersMap.keyFromName(StructureKind.Constructor, false, "constructor")
    );
    expect(ctor).not.toBeUndefined();
    if (!ctor)
      return;
    expect(ctor.kind).toBe(StructureKind.Constructor);
    if (ctor.kind !== StructureKind.Constructor)
      return;

    expect(ctor.typeParameters.length).toBe(0);
    expect(ctor.parameters.length).toBe(0);

    const expectedStatements = statementsGetter.getWriterValues([
      first_head_ctor,
      first_tail_ctor,

      second_head_ctor,
      second_tail_ctor,

      fourth_head_ctor,
      fourth_tail_ctor,
    ]);
    const actualStatements = statementsGetter.getWriterValues(ctor.statements as stringOrWriterFunction[]);

    expect(actualStatements).toEqual(expectedStatements);
  });

  it("will iterate over properties for initializers and all statemented nodes", () => {
    // #region set up type members
    const membersMap: TypeMembersMap = new TypeMembersMap;

    const prop1 = new PropertySignatureImpl("one");
    prop1.typeStructure = "string";

    const prop2 = new PropertySignatureImpl("two");
    prop2.isReadonly = true;
    prop2.typeStructure = "string";

    const method3 = new MethodSignatureImpl("three");
    method3.returnTypeStructure = "string";

    const private_4: PropertySignatureImpl = new PropertySignatureImpl("#four");
    private_4.typeStructure = "number";

    const getter4 = new GetAccessorDeclarationImpl(false, "four");
    getter4.returnTypeStructure = private_4.typeStructure;

    const setterParam = new ParameterDeclarationImpl("value");
    setterParam.typeStructure = private_4.typeStructure;
    const setter4 = new SetAccessorDeclarationImpl(false, "four", setterParam);

    membersMap.addMembers([
      prop1, method3, getter4, setter4
    ]);
    // #endregion set up type members

    //#region statementsGetter set-up

    const head_ctor = statementsGetter.createWriter(`void("ctor head");`);
    const tail_ctor = statementsGetter.createWriter(`void("ctor tail");`);

    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL, "constructor", "first", [
        head_ctor
      ]
    );
    statementsGetter.setStatements(
      ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN, "constructor", "first", [
        tail_ctor
      ]
    );

    // using direct key names instead of ClassMembersMap.keyFromName() because it's faster and more obvious
    statementsGetter.setStatements(
      "one", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, "first", [
        `"value one"`
      ]
    );

    statementsGetter.setStatements(
      "one", "constructor", "first", [
        `if (one) { this.one = one; }`
      ]
    );

    statementsGetter.setStatements(
      "static two", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, "first", [
        `"value two"`
      ]
    );

    statementsGetter.setStatements(
      "#four", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, "first", [
        "4"
      ]
    );

    statementsGetter.setStatements(
      "four", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, "first", [
        "this.#four"
      ]
    );

    statementsGetter.setStatements(
      "static two", "three", "first", [
        `return MyClassName.two + " plus one";`
      ]
    );
    //#endregion statementsGetter set-up

    const ctorParameters: ParameterDeclarationImpl[] = [];
    const ctorOneParam = new ParameterDeclarationImpl("one");
    ctorOneParam.typeStructure = prop1.typeStructure;
    ctorParameters.push(ctorOneParam);

    typeToClass = new MemberedTypeToClass(ctorParameters, statementsGetter);

    typeToClass.importFromTypeMembersMap(false, membersMap);
    typeToClass.addTypeMember(true, prop2);
    typeToClass.addTypeMember(false, private_4);

    typeToClass.defineStatementsByPurpose("first", false);

    const classMembers: ClassMembersMap = typeToClass.buildClassMembersMap();

    //#region inspecting the class members map

    const ctor_Decl = classMembers.getAsKind<StructureKind.Constructor>(StructureKind.Constructor, false, "constructor");
    expect(ctor_Decl).not.toBeUndefined();
    if (ctor_Decl) {
      expect(ctor_Decl.typeParameters.length).toBe(0);
      expect(ctor_Decl.parameters.length).toBe(1);
      expect(ctor_Decl.parameters[0]).toBe(ctorOneParam);
      expect(ctor_Decl.statements).toEqual([
        head_ctor,
        `if (one) { this.one = one; }`,
        tail_ctor,
      ]);
    }

    const prop1_Decl = classMembers.getAsKind<StructureKind.Property>(StructureKind.Property, false, "one");
    expect(prop1_Decl).not.toBeUndefined();
    if (prop1_Decl) {
      expect(prop1_Decl.isReadonly).toBe(false);
      expect(prop1_Decl.isStatic).toBe(false);
      expect(prop1_Decl.isAbstract).toBe(false);
      expect(prop1_Decl.name).toBe("one");
      expect(prop1_Decl.typeStructure).toBe("string");
      expect(prop1_Decl.initializer).toBe(`"value one"`);
    }

    const prop2_Decl = classMembers.getAsKind<StructureKind.Property>(StructureKind.Property, true, "two");
    expect(prop2_Decl).not.toBeUndefined();
    if (prop2_Decl) {
      expect(prop2_Decl.isReadonly).toBe(true);
      expect(prop2_Decl.isStatic).toBe(true);
      expect(prop2_Decl.isAbstract).toBe(false);
      expect(prop2_Decl.name).toBe("two");
      expect(prop2_Decl.typeStructure).toBe("string");
      expect(prop2_Decl.initializer).toBe(`"value two"`);
    }

    const prop4_PrivateDecl = classMembers.getAsKind<StructureKind.Property>(StructureKind.Property, false, "#four");
    expect(prop4_PrivateDecl).not.toBeUndefined();
    if (prop4_PrivateDecl) {
      expect(prop4_PrivateDecl.isReadonly).toBe(false);
      expect(prop4_PrivateDecl.isStatic).toBe(false);
      expect(prop4_PrivateDecl.isAbstract).toBe(false);
      expect(prop4_PrivateDecl.name).toBe("#four");
      expect(prop4_PrivateDecl.typeStructure).toBe("number");
      expect(prop4_PrivateDecl.initializer).toBe("4");
    }

    const method3_Decl = classMembers.getAsKind<StructureKind.Method>(StructureKind.Method, false, "three");
    expect(method3_Decl).not.toBeUndefined();
    if (method3_Decl) {
      expect(method3_Decl.isAbstract).toBe(false);
      expect(method3_Decl.typeParameters.length).toBe(0);
      expect(method3_Decl.parameters.length).toBe(0);
      expect(method3_Decl.returnTypeStructure).toBe("string");
      expect(method3_Decl.statements).toEqual([
        `return MyClassName.two + " plus one";`
      ]);
    }

    const getter4_Decl = classMembers.getAsKind<StructureKind.GetAccessor>(StructureKind.GetAccessor, false, "four");
    expect(getter4_Decl).not.toBeUndefined();
    if (getter4_Decl) {
      expect(getter4_Decl.isAbstract).toBe(false);
      expect(getter4_Decl.typeParameters.length).toBe(0);
      expect(getter4_Decl.parameters.length).toBe(0);
      expect(getter4_Decl.returnTypeStructure).toBe("number");
      expect(getter4_Decl.statements).toEqual([
        `return this.#four;`
      ]);
    }

    const setter4_Decl = classMembers.getAsKind<StructureKind.SetAccessor>(StructureKind.SetAccessor, false, "four");
    expect(setter4_Decl).not.toBeUndefined();
    if (setter4_Decl) {
      expect(setter4_Decl.isAbstract).toBe(false);
      expect(setter4_Decl.typeParameters.length).toBe(0);
      expect(setter4_Decl.parameters.length).toBe(1);
      const fourParam = setter4_Decl.parameters[0] as ParameterDeclarationImpl | undefined;
      if (fourParam) {
        expect(fourParam.name).toBe("value");
        expect(fourParam.typeStructure).toBe("number");
      }
      expect(setter4_Decl.statements).toEqual([
        `this.#four = value;`
      ]);
    }

    expect(classMembers.size).toBe(7);

    //#endregion inspecting the class members map
  });

  it("will resolve index signatures when it gets them from adding type members", () => {
    const index_C = new IndexSignatureDeclarationImpl;
    index_C.keyName = "Key";
    index_C.keyTypeStructure = "string";
    index_C.returnTypeStructure = "boolean";

    statementsGetter.setStatements(
      "foo", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, "first", [`true`]
    );
    statementsGetter.setStatements(
      "bar", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, "first", [`false`]
    );

    typeToClass.indexSignatureResolver = {
      resolveIndexSignature: function(
        signature: IndexSignatureDeclarationImpl
      ): string[]
      {
        void(signature);
        return ["foo", "bar"];
      }
    }
    typeToClass.addTypeMember(false, index_C);
    typeToClass.defineStatementsByPurpose("first", false);

    const classMembers: ClassMembersMap = typeToClass.buildClassMembersMap();
    expect(classMembers.size).toBe(2);

    const foo = classMembers.getAsKind<StructureKind.Property>(
      StructureKind.Property, false, "foo"
    );
    expect(foo).not.toBeUndefined();
    if (foo) {
      expect(foo.typeStructure).toBe("boolean");
      expect(foo.initializer).toBe("true");
    }

    const bar = classMembers.getAsKind<StructureKind.Property>(
      StructureKind.Property, false, "bar"
    );
    expect(bar).not.toBeUndefined();
    if (bar) {
      expect(bar.typeStructure).toBe("boolean");
      expect(bar.initializer).toBe("false");
    }
  });

  it("will detect some collisions between type members", () => {
    const prop1 = new PropertySignatureImpl("one");
    prop1.typeStructure = "string";

    typeToClass.addTypeMember(false, prop1);
    expect(typeToClass.getCurrentTypeMembers(true)).toEqual([]);
    expect(typeToClass.getCurrentTypeMembers(false)).toEqual([prop1]);

    expect(() => {
      typeToClass.addTypeMember(false, prop1);
    }).toThrowError(`You already have a class member with the key "one".`);
    expect(typeToClass.getCurrentTypeMembers(false)).toEqual([prop1]);

    const prop1Clone = PropertySignatureImpl.clone(prop1);
    expect(() => {
      typeToClass.addTypeMember(false, prop1Clone);
    }).toThrowError(`You already have a class member with the key "one".`);
    expect(typeToClass.getCurrentTypeMembers(false)).toEqual([prop1]);

    typeToClass.addTypeMember(true, prop1);
    expect(typeToClass.getCurrentTypeMembers(true)).toEqual([prop1]);
    expect(typeToClass.getCurrentTypeMembers(false)).toEqual([prop1]);

    const method1 = new MethodSignatureImpl("one");
    method1.returnTypeStructure = "string";
    expect(
      () => typeToClass.addTypeMember(false, method1)
    ).toThrowError(`You already have a class member with the key "one".`);

    // It's not perfect, you can still do dumb things
    const getter1 = new GetAccessorDeclarationImpl(false, "one");
    getter1.returnTypeStructure = "string";
    typeToClass.addTypeMember(false, getter1);
    expect(typeToClass.getCurrentTypeMembers(true)).toEqual([prop1]);
    expect(typeToClass.getCurrentTypeMembers(false)).toEqual([prop1, getter1]);

    // Collisions via index signatures
    let indexNames = ["foo", "bar"];
    typeToClass.indexSignatureResolver = {
      resolveIndexSignature: function(
        signature: IndexSignatureDeclarationImpl
      ): string[]
      {
        void(signature);
        return indexNames.slice();
      }
    }

    let indexSignature = new IndexSignatureDeclarationImpl();
    indexSignature.keyName = "Key";
    indexSignature.keyType = "string";
    indexSignature.returnType = "string";

    const foo = new PropertySignatureImpl("foo");
    typeToClass.addTypeMember(false, foo);
    expect(typeToClass.getCurrentTypeMembers(true)).toEqual([prop1]);
    expect(typeToClass.getCurrentTypeMembers(false)).toEqual([prop1, getter1, foo]);

    expect(() => {
      typeToClass.addTypeMember(false, indexSignature);
    }).toThrowError(
      `Index signature resolver requested the name "foo", but this field already exists.`
    );
    expect(typeToClass.getCurrentTypeMembers(true)).toEqual([prop1]);
    expect(typeToClass.getCurrentTypeMembers(false)).toEqual([prop1, getter1, foo]);

    indexNames = ["bar", "bar"];
    indexSignature = IndexSignatureDeclarationImpl.clone(indexSignature);
    expect(() => {
      typeToClass.addTypeMember(false, indexSignature);
    }).toThrowError(
      `You already have a class member with the key "bar", possibly through an index signature resolution.`
    );
    expect(typeToClass.getCurrentTypeMembers(true)).toEqual([prop1]);
    expect(typeToClass.getCurrentTypeMembers(false)).toEqual([prop1, getter1, foo]);
  });

  it("can add isAbstract to class members", () => {
    // #region set up type members
    const membersMap: TypeMembersMap = new TypeMembersMap;

    const prop1 = new PropertySignatureImpl("one");
    prop1.typeStructure = "string";

    const prop2 = new PropertySignatureImpl("two");
    prop2.isReadonly = true;
    prop2.typeStructure = "string";

    const method3 = new MethodSignatureImpl("three");
    method3.returnTypeStructure = "string";

    const private_4: PropertySignatureImpl = new PropertySignatureImpl("#four");
    private_4.typeStructure = "number";

    const getter4 = new GetAccessorDeclarationImpl(false, "four");
    getter4.returnTypeStructure = private_4.typeStructure;

    const setterParam = new ParameterDeclarationImpl("value");
    setterParam.typeStructure = private_4.typeStructure;
    const setter4 = new SetAccessorDeclarationImpl(false, "four", setterParam);

    membersMap.addMembers([
      prop1, prop2, method3, getter4, setter4
    ]);
    // #endregion set up type members

    typeToClass.isAbstractCallback = {
      isAbstract: function(kind: ClassMemberImpl["kind"], name: string): boolean {
        if ((kind === StructureKind.Property) && (name === prop2.name))
          return true;
        if ((kind === StructureKind.GetAccessor) && (name === getter4.name))
          return true;
        if ((kind === StructureKind.Method) && (name === method3.name))
          return true;
        if ((kind === StructureKind.SetAccessor) && (name === setter4.name))
          return true;
        return false;
      }
    }

    statementsGetter.setStatements(
      "one", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, "first", [
        `"value one"`
      ]
    );

    // shouldn't be called
    statementsGetter.setStatements(
      "two", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, "first", [
        `"value two"`
      ]
    );

    // shouldn't be called
    statementsGetter.setStatements(
      "four", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, "first", [
        "this.#four"
      ]
    );

    // shouldn't be called
    statementsGetter.setStatements(
      "two", "three", "first", [
        `return this.two + " plus one";`
      ]
    );

    typeToClass.defineStatementsByPurpose("first", false);
    typeToClass.importFromTypeMembersMap(false, membersMap);
    const classMembers: ClassMembersMap = typeToClass.buildClassMembersMap();

    //#region inspecting the class members map

    const prop1_Decl = classMembers.getAsKind<StructureKind.Property>(StructureKind.Property, false, "one");
    expect(prop1_Decl).not.toBeUndefined();
    if (prop1_Decl) {
      expect(prop1_Decl.isReadonly).toBe(false);
      expect(prop1_Decl.isStatic).toBe(false);
      expect(prop1_Decl.isAbstract).toBe(false);
      expect(prop1_Decl.name).toBe("one");
      expect(prop1_Decl.typeStructure).toBe("string");
      expect(prop1_Decl.initializer).toBe(`"value one"`);
    }

    const prop2_Decl = classMembers.getAsKind<StructureKind.Property>(StructureKind.Property, false, "two");
    expect(prop2_Decl).not.toBeUndefined();
    if (prop2_Decl) {
      expect(prop2_Decl.isReadonly).toBe(true);
      expect(prop2_Decl.isStatic).toBe(false);
      expect(prop2_Decl.isAbstract).toBe(true);
      expect(prop2_Decl.name).toBe("two");
      expect(prop2_Decl.typeStructure).toBe("string");
      expect(prop2_Decl.initializer).toBe(undefined);
    }

    const method3_Decl = classMembers.getAsKind<StructureKind.Method>(StructureKind.Method, false, "three");
    expect(method3_Decl).not.toBeUndefined();
    if (method3_Decl) {
      expect(method3_Decl.isAbstract).toBe(true);
      expect(method3_Decl.typeParameters.length).toBe(0);
      expect(method3_Decl.parameters.length).toBe(0);
      expect(method3_Decl.returnTypeStructure).toBe("string");
      expect(method3_Decl.statements).toEqual([]);
    }

    const getter4_Decl = classMembers.getAsKind<StructureKind.GetAccessor>(StructureKind.GetAccessor, false, "four");
    expect(getter4_Decl).not.toBeUndefined();
    if (getter4_Decl) {
      expect(getter4_Decl.isAbstract).toBe(true);
      expect(getter4_Decl.typeParameters.length).toBe(0);
      expect(getter4_Decl.parameters.length).toBe(0);
      expect(getter4_Decl.returnTypeStructure).toBe("number");
      expect(getter4_Decl.statements).toEqual([]);
    }

    const setter4_Decl = classMembers.getAsKind<StructureKind.SetAccessor>(StructureKind.SetAccessor, false, "four");
    expect(setter4_Decl).not.toBeUndefined();
    if (setter4_Decl) {
      expect(setter4_Decl.isAbstract).toBe(true);
      expect(setter4_Decl.typeParameters.length).toBe(0);
      expect(setter4_Decl.parameters.length).toBe(1);
      const fourParam = setter4_Decl.parameters[0] as ParameterDeclarationImpl | undefined;
      if (fourParam) {
        expect(fourParam.name).toBe("value");
        expect(fourParam.typeStructure).toBe("number");
      }
      expect(setter4_Decl.statements).toEqual([]);
    }

    expect(statementsGetter.hasVisited(
      "one", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, "first"
    )).toBe(true);
    expect(statementsGetter.hasVisited(
      "two", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, "first"
    )).toBe(false);
    expect(statementsGetter.hasVisited(
      "two", "three", "first"
    )).toBe(false);
    expect(statementsGetter.hasVisited(
      "four", ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY, "first"
    )).toBe(false);
  });

  it("can add scope to class members", () => {
    const prop1 = new PropertySignatureImpl("one");
    prop1.typeStructure = "string";

    const prop2 = new PropertySignatureImpl("two");
    prop1.typeStructure = "string";

    const prop3 = new PropertySignatureImpl("three");
    prop1.typeStructure = "string";

    typeToClass.scopeCallback = {
      getScope: function(
        isStatic: boolean,
        kind: ClassMemberImpl["kind"],
        name: string
      ): Scope | undefined
      {
        if (name === "one")
          return Scope.Public;
        if (name === "two")
          return Scope.Protected;
      }
    }

    const tempMap = new TypeMembersMap();
    tempMap.addMembers([prop1, prop2, prop3]);
    typeToClass.importFromTypeMembersMap(false, tempMap);

    const classMembers: ClassMembersMap = typeToClass.buildClassMembersMap();
    expect(classMembers.size).toBe(3);

    const prop1_Decl = classMembers.getAsKind<StructureKind.Property>(
      StructureKind.Property, false, "one"
    );
    expect(prop1_Decl?.scope).toBe(Scope.Public);

    const prop2_Decl = classMembers.getAsKind<StructureKind.Property>(
      StructureKind.Property, false, "two"
    );
    expect(prop2_Decl?.scope).toBe(Scope.Protected);

    const prop3_Decl = classMembers.getAsKind<StructureKind.Property>(
      StructureKind.Property, false, "three"
    );
    expect(prop3_Decl).not.toBeUndefined();
    expect(prop3_Decl?.scope).toBeUndefined();
  });

  it("can add isAsync to methods", () => {
    const method1 = new MethodSignatureImpl("one");
    method1.returnTypeStructure = "string";

    const method2 = new MethodSignatureImpl("two");
    method2.returnTypeStructure = "string";

    typeToClass.isAsyncCallback = {
      isAsync: function(isStatic: boolean, kind, name): boolean {
        return name === "one";
      }
    };

    const interfaceDecl = new InterfaceDeclarationImpl("MyInterface");
    interfaceDecl.methods.push(method1, method2);

    typeToClass.importFromMemberedType(false, interfaceDecl);

    const classMembers: ClassMembersMap = typeToClass.buildClassMembersMap();
    expect(classMembers.size).toBe(2);

    const method1_Decl = classMembers.getAsKind<StructureKind.Method>(
      StructureKind.Method, false, "one"
    );
    expect(method1_Decl?.isAsync).toBeTrue();

    const method2_Decl = classMembers.getAsKind<StructureKind.Method>(
      StructureKind.Method, false, "two"
    );
    expect(method2_Decl?.isAsync).toBeFalse();
  });

  it("can add isGenerator to methods", () => {
    const method1 = new MethodSignatureImpl("one");
    method1.returnTypeStructure = "string";

    const method2 = new MethodSignatureImpl("two");
    method2.returnTypeStructure = "string";

    typeToClass.isGeneratorCallback = {
      isGenerator: function(isStatic: boolean, kind, name): boolean {
        return name === "one";
      }
    };

    const membered = new MemberedObjectTypeStructureImpl;
    membered.methods.push(method1, method2);

    typeToClass.importFromMemberedType(false, membered);

    const classMembers: ClassMembersMap = typeToClass.buildClassMembersMap();
    expect(classMembers.size).toBe(2);

    const method1_Decl = classMembers.getAsKind<StructureKind.Method>(
      StructureKind.Method, false, "one"
    );
    expect(method1_Decl?.isGenerator).toBeTrue();

    const method2_Decl = classMembers.getAsKind<StructureKind.Method>(
      StructureKind.Method, false, "two"
    );
    expect(method2_Decl?.isGenerator).toBeFalse();
  });
});
