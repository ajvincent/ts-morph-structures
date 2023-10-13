import {
  ConstructorDeclarationImpl,
  PropertyDeclarationImpl,
  GetAccessorDeclarationImpl,
  SetAccessorDeclarationImpl,
  MethodDeclarationImpl
} from "#stage_one/prototype-snapshot/exports.js";
import { StructureKind } from "ts-morph";

type ClassMemberImpl = (
  ConstructorDeclarationImpl |
  PropertyDeclarationImpl |
  GetAccessorDeclarationImpl |
  SetAccessorDeclarationImpl |
  MethodDeclarationImpl
);

/**
 * @internal
 * @privateRemarks
 *
 * Unfortunately, this can't be a public tool.  Users can switch isStatic out at any time on a member in the prototype snapshot.
 */
export default class ClassMembersMap
extends Map<string | symbol, ClassMemberImpl>
{
  static getKey(member: Exclude<ClassMemberImpl, ConstructorDeclarationImpl>): string {
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
        this.set(Symbol("constructor"), member);
      }
      else {
        this.set(ClassMembersMap.getKey(member), member);
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
}
