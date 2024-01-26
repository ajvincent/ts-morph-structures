import { StructureKind } from "ts-morph";

import {
  ClassFieldStatementsMap,
  type ClassMemberImpl,
  ClassMembersMap,
  ConstructorDeclarationImpl,
  IndexSignatureResolver,
  type InterfaceDeclarationImpl,
  MemberedStatementsKeyClass,
  type MemberedTypeToClass_StatementGetter,
  type MemberedObjectTypeStructureImpl,
  NamedTypeMemberImpl,
  ParameterDeclarationImpl,
  type TypeMemberImpl,
  TypeMembersMap,
  type stringWriterOrStatementImpl,
} from "../exports.js";

/** Convert type members to a class members map, including statements. */
export default class MemberedTypeToClass {
  readonly #aggregateStaticTypesMap = new TypeMembersMap();
  readonly #aggregateTypeMembersMap = new TypeMembersMap();

  #classMembersMap?: ClassMembersMap;
  readonly #classFieldStatementsByPurpose = new Map<
    string,
    ClassFieldStatementsMap
  >();

  readonly #classConstructor = new ConstructorDeclarationImpl();
  readonly #statementGetter: MemberedTypeToClass_StatementGetter;
  #indexSignatureResolver?: IndexSignatureResolver;

  /**
   * @param constructorArguments - parameters to define on the constructor.
   * @param statementGetter - a callback to get statements for each individual statement purpose, field name and statement group name.
   */
  constructor(
    constructorArguments: ParameterDeclarationImpl[],
    statementGetter: MemberedTypeToClass_StatementGetter,
  ) {
    this.#classConstructor.parameters.push(...constructorArguments);
    this.#statementGetter = statementGetter;
  }

  #requireNotStarted(): void {
    if (this.#classMembersMap)
      throw new Error("You have already called buildClassDeclaration()");
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
    regionName?: string,
  ): void {
    this.#requireNotStarted();
    if (this.#classFieldStatementsByPurpose.has(purposeKey))
      throw new Error(
        "You have already defined a statements purpose with the key: " +
          purposeKey,
      );
    const statementsMap = new ClassFieldStatementsMap();
    this.#classFieldStatementsByPurpose.set(purposeKey, statementsMap);
    statementsMap.purposeKey = purposeKey;
    statementsMap.isBlockStatement = isBlockStatement;
    if (regionName) {
      statementsMap.regionName = regionName;
    }
  }

  //#region adding type members

  /**
   * Define a class member for a given type member (constructor, property, method, getter, setter).
   * @param isStatic - true if the class member is static.
   * @param member - the type member to convert to a class member.
   */
  addTypeMember(isStatic: boolean, member: TypeMemberImpl): void {
    this.#requireNotStarted();
    const typeMembersMap = new TypeMembersMap([
      [TypeMembersMap.keyFromMember(member), member],
    ]);
    const temporaryTypeMembers = new TypeMembersMap();
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
  ): void {
    this.#requireNotStarted();
    const temporaryTypeMembers = new TypeMembersMap();
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
    membered: InterfaceDeclarationImpl | MemberedObjectTypeStructureImpl,
  ): void {
    return this.importFromTypeMembersMap(
      isStatic,
      TypeMembersMap.fromMemberedObject(membered),
    );
  }

  #importFromTypeMembers(
    isStatic: boolean,
    membersMap: TypeMembersMap,
    temporaryTypeMembers: TypeMembersMap,
  ): void {
    for (const member of membersMap.values()) {
      this.#validateTypeMember(isStatic, member, temporaryTypeMembers);
    }
  }

  #validateTypeMember(
    isStatic: boolean,
    member: TypeMemberImpl,
    temporaryTypeMembers: TypeMembersMap,
  ): void {
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
          throw new Error(
            "Index signature found, but no index signature resolver is available",
          );
        }
        const names: string[] =
          this.#indexSignatureResolver.resolveIndexSignature(member);
        const newMembers: NamedTypeMemberImpl[] =
          temporaryTypeMembers.resolveIndexSignature(member, names);
        newMembers.forEach((newMember) =>
          this.#validateTypeMember(isStatic, newMember, temporaryTypeMembers),
        );
        return;
      }

      default: {
        const key = TypeMembersMap.keyFromMember(member);
        const aggregateMembers: TypeMembersMap = isStatic
          ? this.#aggregateStaticTypesMap
          : this.#aggregateTypeMembersMap;
        if (aggregateMembers.has(key)) {
          throw new Error(
            `You already have a class member with the key "${key}".`,
          );
        }
        if (temporaryTypeMembers.has(key)) {
          throw new Error(
            `You already have a class member with the key "${key}", possibly through an index signature resolution.`,
          );
        }
        temporaryTypeMembers.addMembers([member]);
      }
    }
  }

  #adoptTypeMembers(
    isStatic: boolean,
    temporaryTypeMembers: TypeMembersMap,
  ): void {
    const map: TypeMembersMap = isStatic
      ? this.#aggregateStaticTypesMap
      : this.#aggregateTypeMembersMap;
    map.addMembers(Array.from(temporaryTypeMembers.values()));
  }

  //#endregion adding type members

  //#region build the class members map

  /**
   * Convert cached type members to a ClassMembersMap, complete with statements.
   */
  buildClassMembersMap(): ClassMembersMap {
    this.#requireNotStarted();
    this.#classMembersMap = new ClassMembersMap();

    const members = this.#addClassMembersToMap();
    const keyClassArray = this.#buildKeyClassArray(members);

    const errors: Error[] = [];
    keyClassArray.forEach((keyClass) => {
      try {
        this.#callStatementGetter(keyClass);
      } catch (ex) {
        errors.push(ex instanceof Error ? ex : new Error(String(ex)));
      }
    });
    if (errors.length) throw new AggregateError(errors);

    this.#classMembersMap.moveStatementsToMembers(
      Array.from(this.#classFieldStatementsByPurpose.values()),
    );

    if (this.#classConstructor.statements.length === 0) {
      this.#classMembersMap.delete(
        ClassMembersMap.keyFromMember(this.#classConstructor),
      );
    }

    return this.#classMembersMap;
  }

  #addClassMembersToMap(): ClassMemberImpl[] {
    const staticTypeMembers = Array.from(
      this.#aggregateStaticTypesMap.values(),
    ) as NamedTypeMemberImpl[];
    const typeMembers = Array.from(
      this.#aggregateTypeMembersMap.values(),
    ) as NamedTypeMemberImpl[];
    const staticMembers = ClassMembersMap.convertTypeMembers(
      true,
      staticTypeMembers,
    );
    const classMembers = ClassMembersMap.convertTypeMembers(false, typeMembers);

    const members: ClassMemberImpl[] = [
      ...staticMembers,
      this.#classConstructor,
      ...classMembers,
    ];

    this.#classMembersMap!.addMembers(members);
    return members;
  }

  #buildKeyClassArray(
    members: ClassMemberImpl[],
  ): MemberedStatementsKeyClass[] {
    const keyClassMap = new Map<string, MemberedStatementsKeyClass>();
    const purposeKeys: string[] = Array.from(
      this.#classFieldStatementsByPurpose.keys(),
    );

    let propertyNames: string[] = [
      ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL,
      ...members
        .filter((member) => member.kind === StructureKind.Property)
        .map((property) => ClassMembersMap.keyFromMember(property)),
      ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN,
    ];
    propertyNames = Array.from(new Set(propertyNames));

    // properties
    {
      const propertyGroupNames: string[] = [
        ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
        ...members
          .filter(
            (member) =>
              member.kind === StructureKind.Constructor ||
              member.kind === StructureKind.Method,
          )
          .map((member) => ClassMembersMap.keyFromMember(member)),
      ];

      for (const fieldName of propertyNames) {
        for (const groupName of propertyGroupNames) {
          const [formattedFieldName, formattedGroupName] =
            ClassFieldStatementsMap.normalizeKeys(fieldName, groupName);

          if (
            formattedGroupName ===
            ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY
          ) {
            if (
              formattedFieldName ===
                ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL ||
              formattedFieldName ===
                ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN
            ) {
              continue;
            }
          }

          for (const purposeKey of purposeKeys) {
            this.#addKeyClass(
              formattedFieldName,
              formattedGroupName,
              purposeKey,
              keyClassMap,
            );
          }
        }
      }
    }

    // getters and setters
    let accessorNames: string[] = members
      .filter(
        (member) =>
          member.kind === StructureKind.GetAccessor ||
          member.kind === StructureKind.SetAccessor,
      )
      .map((member) =>
        ClassMembersMap.keyFromMember(member).replace(/\b[gs]et /, ""),
      );
    accessorNames = Array.from(new Set(accessorNames));
    {
      for (const accessorName of accessorNames) {
        for (const purposeKey of purposeKeys) {
          this.#addKeyClass(
            accessorName,
            ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
            purposeKey,
            keyClassMap,
          );

          for (const propertyName of propertyNames) {
            this.#addKeyClass(
              propertyName,
              accessorName,
              purposeKey,
              keyClassMap,
            );
          }
        }
      }
    }

    return Array.from(keyClassMap.values());
  }

  #addKeyClass(
    fieldName: string,
    groupName: string,
    purposeKey: string,
    keyClassMap: Map<string, MemberedStatementsKeyClass>,
  ): void {
    const compositeKey = JSON.stringify({ fieldName, groupName, purposeKey });
    if (keyClassMap.has(compositeKey)) return;
    keyClassMap.set(
      compositeKey,
      new MemberedStatementsKeyClass(fieldName, groupName, purposeKey),
    );
  }

  #callStatementGetter(keyClass: MemberedStatementsKeyClass): void {
    const statementsArray: stringWriterOrStatementImpl[] =
      this.#statementGetter.getStatements(keyClass);
    if (statementsArray.length === 0) return;

    const statementsMap: ClassFieldStatementsMap =
      this.#classFieldStatementsByPurpose.get(keyClass.purpose)!;
    statementsMap.set(
      keyClass.fieldKey,
      keyClass.statementGroupKey,
      statementsArray.slice(),
    );
  }

  //#endregion build the class members map
}
