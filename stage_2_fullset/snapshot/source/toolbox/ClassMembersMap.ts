import { StructureKind } from "ts-morph";

import {
  ClassDeclarationImpl,
  ConstructorDeclarationImpl,
  PropertyDeclarationImpl,
  GetAccessorDeclarationImpl,
  SetAccessorDeclarationImpl,
  MethodDeclarationImpl,
} from "../exports.js";

export type ClassMemberImpl =
  | ConstructorDeclarationImpl
  | PropertyDeclarationImpl
  | GetAccessorDeclarationImpl
  | SetAccessorDeclarationImpl
  | MethodDeclarationImpl;

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
export default class ClassMembersMap extends Map<
  string | symbol,
  ClassMemberImpl
> {
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
    kind: ClassMemberImpl["kind"],
  ): readonly (ClassMemberImpl & { kind: Kind })[] {
    let items = Array.from(this.values());
    items = items.filter((item) => item.kind === kind);
    return items as (ClassMemberImpl & { kind: Kind })[];
  }

  /**
   * A typed call to `this.get()` for a given kind.
   * @param key - the key to get.
   * @param kind - the structure kind.
   * @returns - the class member, as the right type, or undefined if the wrong type.
   *
   * @see `ClassMembersMap::keyFromName`
   */
  getAsKind<Kind extends ClassMemberImpl["kind"]>(
    key: string,
    kind: Kind,
  ): (ClassMemberImpl & { kind: Kind }) | undefined {
    const rv = this.get(key);
    if (rv?.kind === kind) return rv as ClassMemberImpl & { kind: Kind };
    return undefined;
  }

  /**
   * Move class members from this map to a class declaration, and clear this map.
   *
   * @param classDecl - the target class declaration.
   */
  moveMembersToClass(classDecl: ClassDeclarationImpl): void {
    this.forEach((member) => this.#moveMemberToClass(classDecl, member));
    this.clear();
  }

  #moveMemberToClass(
    classDecl: ClassDeclarationImpl,
    member: ClassMemberImpl,
  ): void {
    switch (member.kind) {
      case StructureKind.Constructor:
        classDecl.ctors.push(member);
        return;
      case StructureKind.Property:
        classDecl.properties.push(member);
        return;
      case StructureKind.GetAccessor:
        classDecl.getAccessors.push(member);
        return;
      case StructureKind.SetAccessor:
        classDecl.setAccessors.push(member);
        return;
      case StructureKind.Method:
        classDecl.methods.push(member);
        return;
      default:
        throw new Error("unreachable");
    }
  }
}
