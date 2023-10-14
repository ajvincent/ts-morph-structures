import { StructureKind } from "ts-morph";

import {
  ClassDeclarationImpl,
  ConstructorDeclarationImpl,
  PropertyDeclarationImpl,
  GetAccessorDeclarationImpl,
  SetAccessorDeclarationImpl,
  MethodDeclarationImpl,
} from "#stage_one/prototype-snapshot/exports.js";

export type ClassMemberImpl = (
  ConstructorDeclarationImpl |
  PropertyDeclarationImpl |
  GetAccessorDeclarationImpl |
  SetAccessorDeclarationImpl |
  MethodDeclarationImpl
);

export default class ClassMembersMap
extends Map<string | symbol, ClassMemberImpl>
{
  static memberKey(member: Exclude<ClassMemberImpl, ConstructorDeclarationImpl>): string {
    let rv = "";
    if (member.isStatic)
      rv = "static ";
    if (member.kind === StructureKind.GetAccessor)
      rv += "get ";
    else if (member.kind === StructureKind.SetAccessor)
      rv += "set ";
    rv += member.name;
    return rv;
  }

  public addMembers(
    members: readonly ClassMemberImpl[]
  ): void
  {
    members.forEach(member => {
      if (member.kind === StructureKind.Constructor) {
        this.set("constructor", member);
      }
      else {
        this.set(ClassMembersMap.memberKey(member), member);
      }
    });
  }

  public arrayOfKind<
    Kind extends ClassMemberImpl["kind"]
  >
  (
    kind: ClassMemberImpl["kind"]
  ): readonly (ClassMemberImpl & { kind: Kind })[]
  {
    let items = Array.from(this.values());
    items = items.filter(item => item.kind === kind);
    return items as (ClassMemberImpl & { kind: Kind })[];
  }

  getAsKind<
    Kind extends ClassMemberImpl["kind"]
  >
  (
    name: string,
    kind: Kind
  ): (ClassMemberImpl & { kind: Kind }) | undefined
  {
    const rv = this.get(name);
    if (rv?.kind === kind)
      return rv as ClassMemberImpl & { kind: Kind };
    return undefined;
  }

  moveMembersToClass(
    classDecl: ClassDeclarationImpl
  ): void
  {
    this.forEach(member => this.#moveMemberToClass(classDecl, member));
    this.clear();
  }

  #moveMemberToClass(
    classDecl: ClassDeclarationImpl,
    member: ClassMemberImpl
  ): void
  {
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
