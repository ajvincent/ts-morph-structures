import { StructureKind } from "ts-morph";

import {
  ClassDeclarationImpl,
  ConstructorDeclarationImpl,
  GetAccessorDeclarationImpl,
  PropertyDeclarationImpl,
  MethodDeclarationImpl,
  SetAccessorDeclarationImpl,
} from "../exports.js";

import ClassFieldStatementsMap from "./ClassFieldStatementsMap.js";

export type ClassMemberImpl =
  | ConstructorDeclarationImpl
  | GetAccessorDeclarationImpl
  | MethodDeclarationImpl
  | PropertyDeclarationImpl
  | SetAccessorDeclarationImpl;

/**
 * A map for class methods, properties, accessors and a constructor.  This doesn't
 * replace `ClassDeclarationImpl`, rather, it _feeds_ `ClassDeclarationImpl`.
 *
 * @example
 *
 * const map = new ClassMembersMap;
 * const foo = new PropertyDeclarationImpl(false, "foo");
 * map.addMembers([foo]);
 * // ...
 * const classDecl = new ClassDeclaration;
 * classDecl.name = "FooClass";
 * map.moveMembersToClass(classDecl);
 * // classDecl.properties === [foo];
 */
export default class ClassMembersMap extends Map<string, ClassMemberImpl> {
  /**
   * Get a map key from a potential class member.
   * @param member - the class member
   */
  static keyFromMember(member: ClassMemberImpl): string {
    if (member.kind === StructureKind.Constructor) return "constructor";

    return this.keyFromName(member.kind, member.isStatic, member.name);
  }

  /**
   * @param kind - the structure kind.
   * @param isStatic - true if the class member should be static.
   * @param name - the name of the class member.
   * @returns the map key to use.
   */
  static keyFromName(
    kind: ClassMemberImpl["kind"],
    isStatic: boolean,
    name: string,
  ): string {
    if (kind === StructureKind.Constructor) return "constructor";

    let rv = "";
    if (isStatic) rv = "static ";
    if (kind === StructureKind.GetAccessor) rv += "get ";
    else if (kind === StructureKind.SetAccessor) rv += "set ";
    rv += name;
    return rv;
  }

  static fromClassDeclaration(
    classDecl: ClassDeclarationImpl,
  ): ClassMembersMap {
    const map = new ClassMembersMap();

    const members: ClassMemberImpl[] = [
      ...classDecl.ctors,
      ...classDecl.getAccessors,
      ...classDecl.methods,
      ...classDecl.properties,
      ...classDecl.setAccessors,
    ];
    map.addMembers(members);

    return map;
  }

  /**
   * Add class members as values of this map, using standard keys.
   *
   * @param members - the class members to add.
   */
  public addMembers(members: readonly ClassMemberImpl[]): void {
    members.forEach((member) => {
      this.set(ClassMembersMap.keyFromMember(member), member);
    });
  }

  /**
   * Get class members of a particular kind.
   *
   * @param kind - the structure kind to get.
   * @returns all current members of that kind.
   */
  public arrayOfKind<Kind extends ClassMemberImpl["kind"]>(
    kind: Kind,
  ): Extract<ClassMemberImpl, { kind: Kind }>[] {
    let items = Array.from(this.values());
    items = items.filter((item) => item.kind === kind);
    return items as Extract<ClassMemberImpl, { kind: Kind }>[];
  }

  /**
   * A typed call to `this.get()` for a given kind.
   * @param kind - the structure kind.
   * @param isStatic - true if the member is static.
   * @param name - the name of the member.
   * @returns - the class member, as the right type, or undefined if the wrong type.
   *
   * @see `ClassMembersMap::keyFromName`
   */
  getAsKind<Kind extends ClassMemberImpl["kind"]>(
    kind: Kind,
    isStatic: boolean,
    name: string,
  ): Extract<ClassMemberImpl, { kind: Kind }> | undefined {
    const key = ClassMembersMap.keyFromName(kind, isStatic, name);
    const rv = this.get(key);
    if (rv?.kind === kind)
      return rv as Extract<ClassMemberImpl, { kind: Kind }>;
    return undefined;
  }

  /**
   * Move class members from this map to a class declaration, and clear this map.
   *
   * @param classDecl - the target class declaration.
   */
  moveMembersToClass(
    classDecl: ClassDeclarationImpl,
    statementsMaps: ClassFieldStatementsMap[],
  ): void {
    // validate setters have an argument
    {
      const setters = this.arrayOfKind<StructureKind.SetAccessor>(
        StructureKind.SetAccessor,
      );
      const missedNames: string[] = [];
      setters.forEach((setter) => {
        if (setter.parameters.length !== 1) {
          missedNames.push(setter.name);
        }
      });
      if (missedNames.length > 0) {
        throw new Error(
          "The following setters do not have exactly one parameter: " +
            missedNames.join(", "),
        );
      }
    }

    this.forEach((member) =>
      this.#moveMemberToClass(classDecl, member, statementsMaps),
    );
    this.clear();
  }

  #moveMemberToClass(
    classDecl: ClassDeclarationImpl,
    member: ClassMemberImpl,
    statementsMaps: ClassFieldStatementsMap[],
  ): void {
    switch (member.kind) {
      case StructureKind.Constructor:
        classDecl.ctors.push(member);
        statementsMaps.forEach((map) =>
          this.#addStatementsToConstructor(member, map),
        );
        return;

      case StructureKind.Property:
        classDecl.properties.push(member);
        statementsMaps.forEach((map) =>
          this.#addPropertyInitializer(member, map),
        );
        return;

      case StructureKind.GetAccessor:
        classDecl.getAccessors.push(member);
        statementsMaps.forEach((map) =>
          this.#addStatementsToGetter(member, map),
        );
        return;

      case StructureKind.SetAccessor:
        classDecl.setAccessors.push(member);
        statementsMaps.forEach((map) =>
          this.#addStatementsToSetter(member, map),
        );
        return;

      case StructureKind.Method:
        classDecl.methods.push(member);
        statementsMaps.forEach((map) =>
          this.#addStatementsToMethod(member, map),
        );
        return;

      default:
        throw new Error("unreachable");
    }
  }

  #addStatementsToConstructor(
    member: ConstructorDeclarationImpl,
    statementsMap: ClassFieldStatementsMap,
  ): void {
    const statementsDictionary = statementsMap.groupStatementsMap(
      ClassMembersMap.keyFromMember(member),
    );
    if (statementsDictionary) {
      const statements = Array.from(statementsDictionary.values());
      member.statements.push(...statements.flat());
    }
  }

  #addPropertyInitializer(
    member: PropertyDeclarationImpl,
    statementsMap: ClassFieldStatementsMap,
  ): void {
    const statementsDictionary = statementsMap.groupStatementsMap(
      ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
    );
    if (!statementsDictionary) {
      return;
    }

    const initializer = statementsDictionary.get(
      ClassMembersMap.keyFromMember(member),
    );
    if (!initializer) return;

    if (initializer.length === 1 && typeof initializer[0] !== "object") {
      member.initializer = initializer[0];
      return;
    }

    throw new Error(
      "initializer cannot be more than one statement for property " +
        member.name,
    );
  }

  #addStatementsToGetter(
    member: GetAccessorDeclarationImpl,
    statementsMap: ClassFieldStatementsMap,
  ): void {
    const groupName = ClassMembersMap.keyFromMember(member);

    let statementsDictionary = statementsMap.groupStatementsMap(
      ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
    );
    if (statementsDictionary) {
      const initializer = statementsDictionary.get(
        groupName.replace("get ", ""),
      );
      if (initializer && initializer.length > 0) {
        member.statements.push(
          `return ${(initializer as string[]).join(" ")};`,
        );
        return;
      }
    }

    statementsDictionary = statementsMap.groupStatementsMap(groupName);
    if (statementsDictionary) {
      const statementsArray = Array.from(statementsDictionary.values()).flat();
      member.statements.push(...statementsArray);
    }
  }

  #addStatementsToSetter(
    member: SetAccessorDeclarationImpl,
    statementsMap: ClassFieldStatementsMap,
  ): void {
    const groupName = ClassMembersMap.keyFromMember(member);

    let statementsDictionary = statementsMap.groupStatementsMap(
      ClassFieldStatementsMap.GROUP_INITIALIZER_OR_PROPERTY,
    );
    if (statementsDictionary) {
      const initializer = statementsDictionary.get(
        groupName.replace("set ", ""),
      );
      if (initializer && initializer.length > 0) {
        member.statements.push(
          `${initializer[0] as string} = ${member.parameters[0].name};`,
        );
        return;
      }
    }

    statementsDictionary = statementsMap.groupStatementsMap(groupName);
    if (statementsDictionary) {
      const statementsArray = Array.from(statementsDictionary.values()).flat();
      member.statements.push(...statementsArray);
    }
  }

  #addStatementsToMethod(
    member: MethodDeclarationImpl,
    statementsMap: ClassFieldStatementsMap,
  ): void {
    const groupName = ClassMembersMap.keyFromMember(member);

    const statementsDictionary = statementsMap.groupStatementsMap(groupName);
    if (statementsDictionary) {
      const statements = Array.from(statementsDictionary.values());
      member.statements.push(...statements.flat());
    }
  }
}
