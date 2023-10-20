import { KindedStructure, StructureKind } from "ts-morph";

import {
  CallSignatureDeclarationImpl,
  ConstructSignatureDeclarationImpl,
  InterfaceDeclarationImpl,
  IndexSignatureDeclarationImpl,
  MemberedObjectTypeStructureImpl,
  MethodSignatureImpl,
  PropertySignatureImpl,
} from "../exports.js";

export type TypeMemberImpl =
  | CallSignatureDeclarationImpl
  | ConstructSignatureDeclarationImpl
  | IndexSignatureDeclarationImpl
  | MethodSignatureImpl
  | PropertySignatureImpl;

export type NamedTypeMemberImpl = Extract<TypeMemberImpl, { name: string }>;

export default class TypeMembersMap extends Map<string, TypeMemberImpl> {
  static readonly #uniqueKey = new WeakMap<TypeMemberImpl, string>();
  static #uniqueKeyCounter = 0;

  /**
   * Get a map key from a potential class member.
   * @param member - the class member
   */
  static keyFromMember(member: TypeMemberImpl): string {
    let key = TypeMembersMap.#uniqueKey.get(member);
    if (key) return key;

    key = TypeMembersMap.#keyFromMember(member);
    TypeMembersMap.#uniqueKey.set(member, key);
    return key;
  }

  static #keyFromMember(member: TypeMemberImpl): string {
    if (member.kind === StructureKind.ConstructSignature) return "constructor";
    if (member.kind === StructureKind.IndexSignature)
      return `(index:${member.keyName} ${TypeMembersMap.#uniqueKeyCounter++})`;
    if (member.kind === StructureKind.CallSignature)
      return `(callsignature ${TypeMembersMap.#uniqueKeyCounter++})`;
    return this.keyFromName(member.kind, member.name);
  }

  /**
   * @param kind - the structure kind.
   * @param name - the name of the class member.
   * @returns the map key to use.
   */
  static keyFromName(kind: NamedTypeMemberImpl["kind"], name: string): string {
    let rv = "";
    /*
    if (kind === StructureKind.GetAccessorSignature)
      rv += "get ";
    else if (kind === StructureKind.SetAccessorSignature)
      rv += "set ";
    */
    rv += name;
    return rv;
  }

  public addMembers(members: readonly TypeMemberImpl[]): void {
    members.forEach((member) => {
      this.set(TypeMembersMap.keyFromMember(member), member);
    });
  }

  public arrayAsKind<Kind extends TypeMemberImpl["kind"]>(
    kind: Kind,
  ): readonly Extract<TypeMemberImpl, KindedStructure<Kind>>[] {
    let items = Array.from(this.values());
    items = items.filter((item) => item.kind === kind);
    return items as Extract<TypeMemberImpl, KindedStructure<Kind>>[];
  }

  getAsKind<Kind extends TypeMemberImpl["kind"]>(
    key: string,
    kind: Kind,
  ): Extract<TypeMemberImpl, KindedStructure<Kind>> | undefined {
    const rv = this.get(key);
    if (rv?.kind === kind)
      return rv as Extract<TypeMemberImpl, KindedStructure<Kind>>;
    return undefined;
  }

  moveMembersToType(
    owner: InterfaceDeclarationImpl | MemberedObjectTypeStructureImpl,
  ): void {
    this.forEach((member) => this.#moveMemberToOwner(owner, member));
    this.clear();
  }

  #moveMemberToOwner(
    owner: InterfaceDeclarationImpl | MemberedObjectTypeStructureImpl,
    member: TypeMemberImpl,
  ): void {
    switch (member.kind) {
      case StructureKind.CallSignature:
        owner.callSignatures.push(member);
        return;
      case StructureKind.ConstructSignature:
        owner.constructSignatures.push(member);
        return;
      case StructureKind.IndexSignature:
        owner.indexSignatures.push(member);
        return;
      case StructureKind.MethodSignature:
        owner.methods.push(member);
        return;
      case StructureKind.PropertySignature:
        owner.properties.push(member);
        return;
      default:
        throw new Error("unreachable");
    }
  }
}
