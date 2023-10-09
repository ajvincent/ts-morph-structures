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

export default class ClassMembersMap
extends Map<string | symbol, ClassMemberImpl>
{
  public addMembers(
    members: readonly ClassMemberImpl[]
  ): void
  {
    members.forEach(member => {
      if (member.kind === StructureKind.Constructor) {
        this.set(Symbol("constructor"), member);
      }
      else {
        this.set(member.name, member);
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
