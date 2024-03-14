import assert from "node:assert/strict";

import {
  StructureKind
} from "ts-morph";

import {
  ClassFieldStatementsMap,
  type ClassAbstractMemberQuestion,
  type ClassAsyncMethodQuestion,
  type ClassGeneratorMethodQuestion,
  type ClassMemberImpl,
  type ClassScopeMemberQuestion,
  type ClassStatementsGetter,
  ClassMembersMap,
  ConstructorDeclarationImpl,
  type GetAccessorDeclarationImpl,
  IndexSignatureResolver,
  type InterfaceDeclarationImpl,
  type MethodDeclarationImpl,
  type MethodSignatureImpl,
  type MemberedObjectTypeStructureImpl,
  NamedTypeMemberImpl,
  ParameterDeclarationImpl,
  type PropertyDeclarationImpl,
  type PropertySignatureImpl,
  type SetAccessorDeclarationImpl,
  type TypeMemberImpl,
  TypeMembersMap,
  type stringWriterOrStatementImpl,
} from "../../snapshot/source/exports.js";

import {
  MemberedStatementsKeyClass,
} from "../../snapshot/source/internal-exports.js";

/** @internal */
interface ClassMembersByKind {
  readonly ctors: ConstructorDeclarationImpl[];
  readonly getAccessors: GetAccessorDeclarationImpl[];
  readonly methods: MethodDeclarationImpl[];
  readonly properties: PropertyDeclarationImpl[];
  readonly setAccessors: SetAccessorDeclarationImpl[];
}

interface InsertedMemberKey {
  readonly isFieldStatic: boolean;
  readonly fieldType: PropertySignatureImpl;
  readonly isGroupStatic: boolean;
  readonly groupType: (
    GetAccessorDeclarationImpl |
    SetAccessorDeclarationImpl |
    MethodSignatureImpl |
    "constructor" |
    "(initializer or property reference)" /* ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY */
  )
}

/** Convert type members to a class members map, including statements. */
export default class MemberedTypeToClass {
  readonly #aggregateStaticTypesMap = new TypeMembersMap;
  readonly #aggregateTypeMembersMap = new TypeMembersMap;
  readonly #classMemberToTypeMemberMap = new WeakMap<ClassMemberImpl, TypeMemberImpl>;
  readonly #memberKeyToClassMember = new Map<string, ClassMemberImpl>;

  #classMembersMap?: ClassMembersMap;
  readonly #classFieldStatementsByPurpose = new Map<string, ClassFieldStatementsMap>;

  readonly #classConstructor = new ConstructorDeclarationImpl;
  readonly #statementsGetter: ClassStatementsGetter;

  #indexSignatureResolver?: IndexSignatureResolver;
  #isAbstractCallback?: ClassAbstractMemberQuestion;
  #isAsyncCallback?: ClassAsyncMethodQuestion;
  #isGeneratorCallback?: ClassGeneratorMethodQuestion;
  #scopeCallback?: ClassScopeMemberQuestion;
  readonly #insertedMemberKeys: InsertedMemberKey[] = [];

  /**
   * @param constructorArguments - parameters to define on the constructor.
   * @param statementsGetter - a callback to get statements for each individual statement purpose, field name and statement group name.
   */
  constructor(
    constructorArguments: ParameterDeclarationImpl[],
    statementsGetter: ClassStatementsGetter,
  )
  {
    this.#classConstructor.parameters.push(...constructorArguments);
    this.#statementsGetter = statementsGetter;
  }

  #requireNotStarted(): void {
    if (this.#classMembersMap)
      throw new Error("You have already called buildClassDeclaration()");
  }

  /** The class constructor's current parameters list. */
  get constructorParameters(): ParameterDeclarationImpl[] {
    return this.#classConstructor.parameters;
  }

  /**
   * An interface to get names which match an index signature's key name.
   */
  get indexSignatureResolver(): IndexSignatureResolver | undefined {
    return this.#indexSignatureResolver;
  }

  set indexSignatureResolver(value: IndexSignatureResolver | undefined) {
    this.#requireNotStarted();
    this.#indexSignatureResolver = value;
  }

  get isAbstractCallback(): ClassAbstractMemberQuestion | undefined
  {
    return this.#isAbstractCallback;
  }

  set isAbstractCallback(
    value: ClassAbstractMemberQuestion | undefined
  )
  {
    this.#requireNotStarted();
    this.#isAbstractCallback = value;
  }

  get isAsyncCallback(): ClassAsyncMethodQuestion | undefined {
    return this.#isAsyncCallback;
  }

  set isAsyncCallback(value: ClassAsyncMethodQuestion | undefined) {
    this.#requireNotStarted();
    this.#isAsyncCallback = value;
  }

  get isGeneratorCallback(): ClassGeneratorMethodQuestion | undefined {
    return this.#isGeneratorCallback;
  }

  set isGeneratorCallback(value: ClassGeneratorMethodQuestion | undefined) {
    this.#requireNotStarted();
    this.#isGeneratorCallback = value;
  }

  get scopeCallback(): ClassScopeMemberQuestion | undefined {
    return this.#scopeCallback;
  }

  set scopeCallback(
    value: ClassScopeMemberQuestion | undefined
  )
  {
    this.#requireNotStarted();
    this.#scopeCallback = value;
  }

  /**
   *
   * @param purposeKey - The purpose of the statmeent group (validation, preconditions, body, postconditions, etc.)
   * @param isBlockStatement - true if the statement block should be enclosed in curly braces.
   * @param regionName - an optional #region / #endregion comment name.
   *
   * Call this in the order of statement purpose groups you intend.
   */
  defineStatementsByPurpose(
    purposeKey: string,
    isBlockStatement: boolean,
    regionName?: string
  ): void
  {
    this.#requireNotStarted();
    if (this.#classFieldStatementsByPurpose.has(purposeKey))
      throw new Error("You have already defined a statements purpose with the key: " + purposeKey);
    const statementsMap = new ClassFieldStatementsMap;
    this.#classFieldStatementsByPurpose.set(purposeKey, statementsMap);
    statementsMap.purposeKey = purposeKey;
    statementsMap.isBlockStatement = isBlockStatement;
    if (regionName) {
      statementsMap.regionName = regionName;
    }
  }

  //#region type members

  /**
   * Get the current type members in our cache.
   *
   * @internal This is for debugging and testing purposes only.
   */
  getCurrentTypeMembers(
    isStatic: boolean
  ): readonly TypeMemberImpl[]
  {
    return Array.from(isStatic ?
      this.#aggregateStaticTypesMap.values() :
      this.#aggregateTypeMembersMap.values()
    );
  }

  /**
   * Define a class member for a given type member (constructor, property, method, getter, setter).
   * @param isStatic - true if the class member is static.
   * @param member - the type member to convert to a class member.
   */
  addTypeMember(
    isStatic: boolean,
    member: TypeMemberImpl,
  ): void
  {
    this.#requireNotStarted();
    const typeMembersMap = new TypeMembersMap([
      [(TypeMembersMap.keyFromMember(member)), member]
    ]);
    const temporaryTypeMembers = new TypeMembersMap;
    this.#importFromTypeMembers(isStatic, typeMembersMap, temporaryTypeMembers);

    this.#adoptTypeMembers(isStatic, temporaryTypeMembers);
  }

  /**
   * Define class members for a map of given type members (constructor, property, method, getter, setter).
   * @param isStatic - true if the class members are static.
   * @param membersMap - the type members map for conversion to class members.
   */
  importFromTypeMembersMap(
    isStatic: boolean,
    membersMap: TypeMembersMap,
  ): void
  {
    this.#requireNotStarted();
    const temporaryTypeMembers = new TypeMembersMap;
    this.#importFromTypeMembers(isStatic, membersMap, temporaryTypeMembers);

    this.#adoptTypeMembers(isStatic, temporaryTypeMembers);
  }

  /**
   * Define class members for a membered object type or interface.
   * @param isStatic - true if the class members are static.
   * @param membered - the interface or membered object type.
   */
  importFromMemberedType(
    isStatic: boolean,
    membered: InterfaceDeclarationImpl | MemberedObjectTypeStructureImpl
  ): void
  {
    return this.importFromTypeMembersMap(
      isStatic, TypeMembersMap.fromMemberedObject(membered)
    );
  }

  #importFromTypeMembers(
    isStatic: boolean,
    membersMap: TypeMembersMap,
    temporaryTypeMembers: TypeMembersMap
  ): void
  {
    for (const member of membersMap.values()) {
      this.#validateTypeMember(isStatic, member, temporaryTypeMembers);
    }
  }

  #validateTypeMember(
    isStatic: boolean,
    member: TypeMemberImpl,
    temporaryTypeMembers: TypeMembersMap
  ): void
  {
    switch (member.kind) {
      case StructureKind.CallSignature:
        throw new Error("Call signatures are not allowed");
      case StructureKind.ConstructSignature:
        throw new Error("Construct signatures are not allowed");
      case StructureKind.IndexSignature: {
        if (isStatic) {
          //TODO: rethink this.  Maybe this is doable via a `satisfies` statement.
          throw new Error("index signatures cannot be static");
        }
        if (!this.#indexSignatureResolver) {
          throw new Error("Index signature found, but no index signature resolver is available");
        }
        const names: string[] = this.#indexSignatureResolver.resolveIndexSignature(member);
        names.forEach(name => {
          if (this.#aggregateTypeMembersMap.has(name) || temporaryTypeMembers.has(name)) {
            throw new Error(`Index signature resolver requested the name "${name}", but this field already exists.`);
          }
        });

        temporaryTypeMembers.addMembers([member]);
        const newMembers: NamedTypeMemberImpl[] = temporaryTypeMembers.resolveIndexSignature(member, names);
        newMembers.forEach(newMember => temporaryTypeMembers.delete(TypeMembersMap.keyFromMember(newMember)));
        newMembers.forEach(newMember => this.#validateTypeMember(isStatic, newMember, temporaryTypeMembers));
        return;
      }

      default: {
        const key = TypeMembersMap.keyFromMember(member);
        const aggregateMembers: TypeMembersMap = isStatic ? this.#aggregateStaticTypesMap : this.#aggregateTypeMembersMap;
        if (aggregateMembers.has(key)) {
          throw new Error(`You already have a class member with the key "${key}".`);
        }
        if (temporaryTypeMembers.has(key)) {
          throw new Error(`You already have a class member with the key "${key}", possibly through an index signature resolution.`);
        }
        temporaryTypeMembers.addMembers([member]);
      }
    }
  }

  #adoptTypeMembers(
    isStatic: boolean,
    temporaryTypeMembers: TypeMembersMap
  ): void
  {
    const map: TypeMembersMap = isStatic ? this.#aggregateStaticTypesMap : this.#aggregateTypeMembersMap;
    map.addMembers(Array.from(temporaryTypeMembers.values()));
  }

  //#endregion type members

  //#region build the class members map

  /**
   * Convert cached type members to a ClassMembersMap, complete with statements.
   */
  buildClassMembersMap(): ClassMembersMap
  {
    this.#requireNotStarted();
    this.#classMembersMap = new ClassMembersMap;

    const members = this.#addClassMembersToMap();
    const keyClassArray = this.#buildKeyClassArray(members);

    const errors: Error[] = [];
    keyClassArray.forEach(keyClass => {
      try {
        this.#callStatementGetter(keyClass)
      }
      catch (ex) {
        errors.push(ex instanceof Error ? ex : new Error(String(ex)));
      }
    });
    if (errors.length)
      throw new AggregateError(errors);

    this.#classMembersMap.moveStatementsToMembers(Array.from(this.#classFieldStatementsByPurpose.values()));

    if (this.#classConstructor.statements.length === 0) {
      this.#classMembersMap.delete(
        ClassMembersMap.keyFromMember(this.#classConstructor)
      );
    }

    return this.#classMembersMap;
  }

  #addClassMembersToMap(): ClassMemberImpl[]
  {
    const staticTypeMembers = Array.from(this.#aggregateStaticTypesMap.values()) as NamedTypeMemberImpl[];
    const typeMembers = Array.from(this.#aggregateTypeMembersMap.values()) as NamedTypeMemberImpl[];
    const staticMembers = ClassMembersMap.convertTypeMembers(
      true, staticTypeMembers, this.#classMemberToTypeMemberMap
    );
    const classMembers = ClassMembersMap.convertTypeMembers(
      false, typeMembers, this.#classMemberToTypeMemberMap
    );

    const members: ClassMemberImpl[] = [
      ...staticMembers,
      this.#classConstructor,
      ...classMembers
    ];

    this.#classMembersMap!.addMembers(members);

    if (this.#isAbstractCallback) {
      classMembers.forEach(member => {
        member.isAbstract = this.#isAbstractCallback!.isAbstract(member.kind, member.name);
      });
    }

    if (this.#scopeCallback) {
      members.forEach(member => {
        const [isStatic, name] =
          (member.kind === StructureKind.Constructor) ?
          [false, "constructor"] :
          [member.isStatic, member.name];

        member.scope = this.#scopeCallback!.getScope(isStatic, member.kind, name);
      });
    }

    if (this.#isAsyncCallback ?? this.#isGeneratorCallback) {
      const methods = members.filter(
        member => member.kind === StructureKind.Method
      ) as MethodDeclarationImpl[];

      methods.forEach(method => {
        if (this.#isAsyncCallback) {
          method.isAsync = this.#isAsyncCallback.isAsync(
            method.isStatic, method.kind, method.name
          );
        }
        if (this.#isGeneratorCallback) {
          method.isGenerator = this.#isGeneratorCallback.isGenerator(
            method.isStatic, method.kind, method.name
          );
        }
      });
    }

    return members;
  }

  #buildKeyClassArray(
    members: ClassMemberImpl[]
  ): MemberedStatementsKeyClass[]
  {
    const keyClassMap = new Map<string, MemberedStatementsKeyClass>;
    const purposeKeys: string[] = Array.from(this.#classFieldStatementsByPurpose.keys());

    const membersByKind = this.#sortMembersByKind(members);

    membersByKind.properties.forEach(
      property => this.#addPropertyInitializerKeys(keyClassMap, purposeKeys, property)
    );

    let propertyNames: string[] = [
      ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL,
      ...membersByKind.properties.map(property => ClassMembersMap.keyFromMember(property)),
      ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN
    ];
    propertyNames = Array.from(new Set(propertyNames));

    this.#addStatementKeysForMethodOrCtor(this.#classConstructor, keyClassMap, purposeKeys, propertyNames);
    membersByKind.methods.forEach(
      method => this.#addStatementKeysForMethodOrCtor(method, keyClassMap, purposeKeys, propertyNames)
    );

    membersByKind.getAccessors.forEach(getter => {
      this.#addAccessorInitializerKey(getter, keyClassMap, purposeKeys);
      this.#addStatementKeysForAccessor(getter, keyClassMap, purposeKeys, propertyNames);
    });

    membersByKind.setAccessors.forEach(setter => {
      this.#addAccessorInitializerKey(setter, keyClassMap, purposeKeys);
      this.#addStatementKeysForAccessor(setter, keyClassMap, purposeKeys, propertyNames);
    });

    this.#insertedMemberKeys.forEach(addedKey => this.#applyInsertedKeys(addedKey, keyClassMap, purposeKeys));

    return Array.from(keyClassMap.values());
  }

  /**
   * Add member keys for a field and a group.
   * @param isFieldStatic - true if the field is static.
   * @param fieldType - the field signature.
   * @param isGroupStatic - true if the group is static (false for constructors)
   * @param groupType - the group signature, or "constructor" for the constructor I generate.
   */
  insertMemberKey(
    isFieldStatic: boolean,
    fieldType: PropertySignatureImpl,
    isGroupStatic: boolean,
    groupType: InsertedMemberKey["groupType"]
  ): void
  {
    this.#insertedMemberKeys.push({
      isFieldStatic, fieldType, isGroupStatic, groupType
    })
  }

  #sortMembersByKind(members: ClassMemberImpl[]): ClassMembersByKind {
    const rv: ClassMembersByKind = {
      ctors: [],
      getAccessors: [],
      methods: [],
      properties: [],
      setAccessors: []
    };

    members.forEach(member => {
      switch (member.kind) {
        case StructureKind.Constructor:
          rv.ctors.push(member);
          return;
        case StructureKind.GetAccessor:
          rv.getAccessors.push(member);
          return;
        case StructureKind.Method:
          rv.methods.push(member);
          return;
        case StructureKind.Property:
          rv.properties.push(member);
          return;
        case StructureKind.SetAccessor:
          rv.setAccessors.push(member);
          return;
        default:
          assert(false, "not reachable");
      }
    });

    return rv;
  }

  #addPropertyInitializerKeys(
    keyClassMap: Map<string, MemberedStatementsKeyClass>,
    purposeKeys: string[],
    property: PropertyDeclarationImpl,
  ): void
  {
    if (property.isAbstract)
      return;

    const [
      formattedFieldName, formattedGroupName
    ] = ClassFieldStatementsMap.normalizeKeys(
      ClassMembersMap.keyFromMember(property),
      ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY
    );

    if (!this.#memberKeyToClassMember.has(formattedFieldName))
      this.#memberKeyToClassMember.set(formattedFieldName, property);

    for (const purposeKey of purposeKeys) {
      this.#addKeyClass(
        formattedFieldName,
        formattedGroupName,
        purposeKey,
        keyClassMap
      );
    }
  }

  #addStatementKeysForMethodOrCtor(
    methodOrCtor: MethodDeclarationImpl | ConstructorDeclarationImpl,
    keyClassMap: Map<string, MemberedStatementsKeyClass>,
    purposeKeys: string[],
    propertyNames: string[],
  ): void
  {
    if (methodOrCtor.kind === StructureKind.Method && methodOrCtor.isAbstract)
      return;

    const groupName = ClassMembersMap.keyFromMember(methodOrCtor);
    if (!this.#memberKeyToClassMember.has(groupName))
      this.#memberKeyToClassMember.set(groupName, methodOrCtor);

    for (const fieldName of propertyNames) {
      const [
        formattedFieldName, formattedGroupName
      ] = ClassFieldStatementsMap.normalizeKeys(fieldName, groupName);

      for (const purposeKey of purposeKeys) {
        this.#addKeyClass(
          formattedFieldName, formattedGroupName, purposeKey, keyClassMap
        );
      }
    }
  }

  #addAccessorInitializerKey(
    accessor: GetAccessorDeclarationImpl | SetAccessorDeclarationImpl,
    keyClassMap: Map<string, MemberedStatementsKeyClass>,
    purposeKeys: string[],
  ): void {
    if (accessor.isAbstract)
      return;

    const accessorName = ClassMembersMap.keyFromMember(accessor).replace(/\b[gs]et /, "");
    if (!this.#memberKeyToClassMember.has(accessorName))
      this.#memberKeyToClassMember.set(accessorName, accessor);

    purposeKeys.forEach(purposeKey => this.#addKeyClass(
      accessorName,
      ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
      purposeKey,
      keyClassMap
    ));
  }

  #addStatementKeysForAccessor(
    accessor: GetAccessorDeclarationImpl | SetAccessorDeclarationImpl,
    keyClassMap: Map<string, MemberedStatementsKeyClass>,
    purposeKeys: string[],
    propertyNames: string[],
  ): void
  {
    if (accessor.isAbstract)
      return;

    const accessorName = ClassMembersMap.keyFromMember(accessor).replace(/\b[gs]et /, "");
    if (!this.#memberKeyToClassMember.has(accessorName))
      this.#memberKeyToClassMember.set(accessorName, accessor);

    for (const purposeKey of purposeKeys) {
      for (const propertyName of propertyNames) {
        this.#addKeyClass(
          propertyName,
          accessorName,
          purposeKey,
          keyClassMap
        );
      }
    }
  }

  #applyInsertedKeys(
    addedKey: InsertedMemberKey,
    keyClassMap: Map<string, MemberedStatementsKeyClass>,
    purposeKeys: readonly string[]
  ): void
  {
    let fieldName = TypeMembersMap.keyFromName(addedKey.fieldType.kind, addedKey.fieldType.name);
    if (addedKey.isFieldStatic)
      fieldName = "static " + fieldName;

    let groupName = "constructor";
    if ((addedKey.groupType !== "constructor") && (addedKey.groupType !== ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY)) {
      groupName = TypeMembersMap.keyFromName(addedKey.groupType.kind, addedKey.groupType.name);
      if (addedKey.isGroupStatic) {
        groupName = "static " + groupName;
      }
    }

    const [
      formattedFieldName, formattedGroupName
    ] = ClassFieldStatementsMap.normalizeKeys(fieldName, groupName);

    for (const purposeKey of purposeKeys) {
      this.#addKeyClass(
        formattedFieldName, formattedGroupName, purposeKey, keyClassMap
      );
    }
  }

  #addKeyClass(
    fieldName: string,
    groupName: string,
    purposeKey: string,
    keyClassMap: Map<string, MemberedStatementsKeyClass>,
  ): void
  {
    const compositeKey = JSON.stringify({fieldName, groupName, purposeKey});
    if (keyClassMap.has(compositeKey))
      return;

    const fieldClassMember = this.#memberKeyToClassMember.get(fieldName);
    const groupClassMember = this.#memberKeyToClassMember.get(groupName);

    const fieldTypeMember = fieldClassMember ? this.#classMemberToTypeMemberMap.get(fieldClassMember) : undefined;
    const groupTypeMember = groupClassMember ? this.#classMemberToTypeMemberMap.get(groupClassMember) : undefined;
    const isFieldStatic = fieldClassMember && fieldClassMember.kind !== StructureKind.Constructor ?
      fieldClassMember.isStatic : false;
    const isGroupStatic = groupClassMember && groupClassMember.kind !== StructureKind.Constructor ?
      groupClassMember.isStatic : false;

    keyClassMap.set(compositeKey, new MemberedStatementsKeyClass(
      fieldName,
      groupName,
      purposeKey,
      fieldTypeMember ? [isFieldStatic, fieldTypeMember] : undefined,
      groupTypeMember ? [isGroupStatic, groupTypeMember] : undefined,
    ));
  }

  #callStatementGetter(
    keyClass: MemberedStatementsKeyClass
  ): void
  {
    const statementsArray: readonly stringWriterOrStatementImpl[] =
      this.#statementsGetter.getStatements(keyClass);
    if (statementsArray.length === 0)
      return;

    const statementsMap: ClassFieldStatementsMap =
      this.#classFieldStatementsByPurpose.get(keyClass.purpose)!;
    statementsMap.set(keyClass.fieldKey, keyClass.statementGroupKey, statementsArray.slice());
  }

  //#endregion build the class members map
}
