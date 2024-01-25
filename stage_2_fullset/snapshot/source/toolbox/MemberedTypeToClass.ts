import { StructureKind } from "ts-morph";

import {
  ClassDeclarationImpl,
  ClassFieldStatementsMap,
  type ClassMemberImpl,
  ClassMembersMap,
  ConstructorDeclarationImpl,
  IndexSignatureResolver,
  MemberedStatementsKeyClass,
  type MemberedTypeToClass_StatementGetter,
  NamedTypeMemberImpl,
  ParameterDeclarationImpl,
  type TypeMemberImpl,
  TypeMembersMap,
  type stringWriterOrStatementImpl,
} from "../exports.js";

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
  readonly #indexSignatureResolver?: IndexSignatureResolver;

  #startedClassMap = false;

  constructor(
    constructorArguments: ParameterDeclarationImpl[],
    statementGetter: MemberedTypeToClass_StatementGetter,
    indexSignatureResolver?: IndexSignatureResolver,
  ) {
    this.#classConstructor.parameters.push(...constructorArguments);
    this.#statementGetter = statementGetter;
    this.#indexSignatureResolver = indexSignatureResolver;
  }

  #requireNotStarted(): void {
    if (this.#classMembersMap)
      throw new Error("You have already called buildClassDeclaration()");
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

  addTypeMember(isStatic: boolean, member: TypeMemberImpl): void {
    this.#requireNotStarted();
    const typeMembersMap = new TypeMembersMap([
      [TypeMembersMap.keyFromMember(member), member],
    ]);
    this.#importFromTypeMembers(isStatic, typeMembersMap, new TypeMembersMap());
  }

  importFromTypeMembers(isStatic: boolean, membersMap: TypeMembersMap): void {
    this.#requireNotStarted();
    this.#importFromTypeMembers(isStatic, membersMap, new TypeMembersMap());
  }

  #importFromTypeMembers(
    isStatic: boolean,
    membersMap: TypeMembersMap,
    temporaryTypeMembers: TypeMembersMap,
  ): void {
    for (const member of membersMap.values()) {
      this.#validateTypeMember(isStatic, member, temporaryTypeMembers);
    }
    this.#aggregateTypeMembersMap.addMembers(
      Array.from(temporaryTypeMembers.values()),
    );
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
        const names = this.#indexSignatureResolver(member);
        const newMembers = temporaryTypeMembers.resolveIndexSignature(
          member,
          names,
        );
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
      }
    }
  }

  //#endregion adding type members

  //#region build the class!

  async buildClassDeclaration(): Promise<ClassDeclarationImpl> {
    this.#requireNotStarted();
    this.#classMembersMap = new ClassMembersMap();

    const members = this.#addClassMembersToMap();
    const keyClassArray = this.#buildKeyClassArray(members);

    await Promise.all(
      keyClassArray.map((keyClass) => this.#callStatementGetter(keyClass)),
    );

    const classDecl = new ClassDeclarationImpl();
    this.#classMembersMap.moveMembersToClass(
      classDecl,
      Array.from(this.#classFieldStatementsByPurpose.values()),
    );
    return classDecl;
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
    const fieldNames: string[] = [
      ClassFieldStatementsMap.FIELD_HEAD_SUPER_CALL,
      ...members
        .filter((member) => member.kind === StructureKind.Property)
        .map((property) => ClassMembersMap.keyFromMember(property)),
      ClassFieldStatementsMap.FIELD_TAIL_FINAL_RETURN,
    ];

    const groupNames: string[] = [
      ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
      ...members
        .filter((member) => member.kind !== StructureKind.Property)
        .map((member) => ClassMembersMap.keyFromMember(member)),
    ];

    const purposeKeys: string[] = Array.from(
      this.#classFieldStatementsByPurpose.keys(),
    );

    const keyClassMap = new Map<string, MemberedStatementsKeyClass>();
    for (const fieldName of fieldNames) {
      for (const groupName of groupNames) {
        const [formattedFieldName, formattedGroupName] =
          ClassFieldStatementsMap.normalizeKeys(fieldName, groupName);
        for (const purposeKey of purposeKeys) {
          const compositeKey = JSON.stringify({
            formattedFieldName,
            formattedGroupName,
            purposeKey,
          });
          if (keyClassMap.has(compositeKey)) continue;
          keyClassMap.set(
            compositeKey,
            new MemberedStatementsKeyClass(
              formattedFieldName,
              formattedGroupName,
              purposeKey,
            ),
          );
        }
      }
    }

    return Array.from(keyClassMap.values());
  }

  async #callStatementGetter(
    keyClass: MemberedStatementsKeyClass,
  ): Promise<void> {
    const statementsArray: stringWriterOrStatementImpl[] =
      await this.#statementGetter(keyClass);
    if (statementsArray.length === 0) return;

    const statementsMap: ClassFieldStatementsMap =
      this.#classFieldStatementsByPurpose.get(keyClass.purpose)!;
    statementsMap.set(
      keyClass.fieldKey,
      keyClass.statementGroupKey,
      statementsArray.slice(),
    );
  }

  //#endregion build the class!
}
