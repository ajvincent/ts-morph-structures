import {
  KindedStructure,
  JSDocStructure,
  StructureKind
} from "ts-morph";

import {
  CallSignatureDeclarationImpl,
  ConstructSignatureDeclarationImpl,
  GetAccessorDeclarationImpl,
  JSDocImpl,
  InterfaceDeclarationImpl,
  IndexSignatureDeclarationImpl,
  MemberedObjectTypeStructureImpl,
  MethodSignatureImpl,
  ParameterDeclarationImpl,
  PropertySignatureImpl,
  SetAccessorDeclarationImpl,
} from "../snapshot/source/exports.js";

import {
  TypeStructureClassesMap,
  cloneStructureOrStringArray,
} from "../snapshot/source/internal-exports.js";

export type TypeMemberImpl = (
  CallSignatureDeclarationImpl |
  ConstructSignatureDeclarationImpl |
  GetAccessorDeclarationImpl |
  IndexSignatureDeclarationImpl |
  MethodSignatureImpl |
  PropertySignatureImpl |
  SetAccessorDeclarationImpl
);

export type NamedTypeMemberImpl = Extract<TypeMemberImpl, { name: string }>;

/**
 * A map for members of `InterfaceDeclarationImpl` and `MemberedObjectTypeStructureImpl`.  This
 * doesn't replace the structures, rather it _feeds_ them.
 *
 * @example
 *
 * const map = new TypeMembersMap;
 * const foo = new PropertySignatureImpl(false, "foo");
 * map.addMembers([foo]);
 * // ...
 * const interfaceDecl = new InterfaceDeclarationImpl("FooInterface");
 * map.moveMembersToType(interfaceDecl);
 * // interfaceDecl.properties === [foo];
 */
export default class TypeMembersMap
extends Map<string, TypeMemberImpl>
{
  static readonly #uniqueKey = new WeakMap<TypeMemberImpl, string>;
  static #uniqueKeyCounter = 0;

  /**
   * Get a map key from a potential type member.
   * @param member - the type member
   */
  static keyFromMember(
    member: TypeMemberImpl
  ): string
  {
    let key = TypeMembersMap.#uniqueKey.get(member);
    if (key)
      return key;

    key = TypeMembersMap.#keyFromMember(member);
    TypeMembersMap.#uniqueKey.set(member, key);
    return key;
  }

  static #keyFromMember(
    member: TypeMemberImpl
  ): string
  {
    if (member.kind === StructureKind.ConstructSignature)
      return "constructor";
    if (member.kind === StructureKind.IndexSignature)
      return `(index ${TypeMembersMap.#uniqueKeyCounter++})`;
    if (member.kind === StructureKind.CallSignature)
      return `(callsignature ${TypeMembersMap.#uniqueKeyCounter++})`;
    return this.keyFromName(member.kind, member.name);
  }

  /**
   * @param kind - the structure kind.
   * @param name - the name of the type member.
   * @returns the map key to use.
   */
  static keyFromName(
    kind: NamedTypeMemberImpl["kind"],
    name: string,
  ): string
  {
    let rv = "";
    if (kind === StructureKind.GetAccessor)
      rv += "get ";
    else if (kind === StructureKind.SetAccessor)
      rv += "set ";
    rv += name;
    return rv;
  }

  /**
   * Create a `TypeMembersMap` from an interface or membered object.
   * @param membered - the membered object.
   * @returns the type members map.
   */
  static fromMemberedObject(
    membered: InterfaceDeclarationImpl | MemberedObjectTypeStructureImpl
  ): TypeMembersMap
  {
    const map = new TypeMembersMap;

    const members: TypeMemberImpl[] = [
      ...membered.callSignatures,
      ...membered.constructSignatures,
      ...membered.getAccessors,
      ...membered.indexSignatures,
      ...membered.methods,
      ...membered.properties,
      ...membered.setAccessors,
    ];
    map.addMembers(members);

    return map;
  }

  /**
   * Add type members as values of this map, using standard keys.
   *
   * @param members - the type members to add.
   */
  public addMembers(
    members: readonly TypeMemberImpl[]
  ): void
  {
    members.forEach(member => {
      this.set(TypeMembersMap.keyFromMember(member), member)
    });
  }

  /**
   * Get type members of a particular kind.
   *
   * @param kind - the structure kind to get.
   * @returns all current members of that kind.
   */
  public arrayOfKind<
    Kind extends TypeMemberImpl["kind"]
  >
  (
    kind: Kind
  ): readonly (Extract<TypeMemberImpl, KindedStructure<Kind>>)[]
  {
    let items = Array.from(this.values());
    items = items.filter(item => item.kind === kind);
    return items as (Extract<TypeMemberImpl, KindedStructure<Kind>>)[];
  }

  /**
   * A typed call to `this.get()` for a given kind.
   * @param kind - the structure kind.
   * @param name - the key to get.
   * @returns - the type member, as the right type, or undefined if the wrong type.
   *
   * @see `TypeMembersMap::keyFromName`
   */
  getAsKind<
    Kind extends NamedTypeMemberImpl["kind"]
  >
  (
    kind: Kind,
    name: string,
  ): Extract<TypeMemberImpl, KindedStructure<Kind>> | undefined
  {
    const key = TypeMembersMap.keyFromName(kind, name);
    const rv = this.get(key);
    if (rv?.kind === kind)
      return rv as Extract<TypeMemberImpl, KindedStructure<Kind>>;
    return undefined;
  }

  /**
   * Convert get and/or set accessors to a property.  This may be lossy, but we try to be faithful.
   * @param name - the property name
   */
  convertAccessorsToProperty(
    name: string
  ): void
  {
    const getter = this.getAsKind<StructureKind.GetAccessor>(StructureKind.GetAccessor, name);
    const setter = this.getAsKind<StructureKind.SetAccessor>(StructureKind.SetAccessor, name);
    if (!getter && !setter) {
      throw new Error(name + " accessors not found!");
    }

    const prop = new PropertySignatureImpl(getter?.name ?? setter!.name);
    // This is a merge operation: prefer getter fields over setter fields

    const docs = getter?.docs ?? setter!.docs;
    if (docs) {
      prop.docs.push(...cloneStructureOrStringArray<JSDocStructure, StructureKind.JSDoc, JSDocImpl>(
        docs as (string | JSDocImpl)[], StructureKind.JSDoc
      ));
    }

    prop.leadingTrivia.push(...(getter?.leadingTrivia ?? setter!.leadingTrivia));
    prop.trailingTrivia.push(...(getter?.leadingTrivia ?? setter!.leadingTrivia));

    if (getter?.returnTypeStructure) {
      prop.typeStructure = TypeStructureClassesMap.clone(getter.returnTypeStructure);
    }
    else if (setter) {
      const setterParam = setter.parameters[0] as ParameterDeclarationImpl;
      if (setterParam.typeStructure) {
        prop.typeStructure = TypeStructureClassesMap.clone(setterParam.typeStructure);
      }
    }

    this.addMembers([prop]);
    if (getter) {
      this.delete(TypeMembersMap.keyFromMember(getter));
    }
    if (setter) {
      this.delete(TypeMembersMap.keyFromMember(setter));
    }
  }

  /**
   * Convert a property signature to get and/or set accessors.  This may be lossy, but we try to be faithful.
   * @param name - the property name
   * @param toGetter - true if the caller wants a getter
   * @param toSetter - true if the caller wants a setter
   */
  convertPropertyToAccessors(
    name: string,
    toGetter: boolean,
    toSetter: boolean
  ): void
  {
    if (!toGetter && !toSetter)
      throw new Error("You must request either a get accessor or a set accessor!");

    const prop = this.getAsKind<StructureKind.PropertySignature>(StructureKind.PropertySignature, name);
    if (!prop) {
      throw new Error(name + " property not found!");
    }

    if (toGetter) {
      const getter = new GetAccessorDeclarationImpl(false, prop.name, prop.typeStructure);
      if (prop.docs) {
        getter.docs.push(...cloneStructureOrStringArray<JSDocStructure, StructureKind.JSDoc, JSDocImpl>(
          prop.docs as (string | JSDocImpl)[]
        , StructureKind.JSDoc))
      }

      getter.leadingTrivia.push(...prop.leadingTrivia);
      getter.trailingTrivia.push(...prop.trailingTrivia);

      this.addMembers([getter]);
    }

    if (toSetter) {
      const param = new ParameterDeclarationImpl("value");
      if (prop.typeStructure)
        param.typeStructure = TypeStructureClassesMap.clone(prop.typeStructure);

      const setter = new SetAccessorDeclarationImpl(false, prop.name, param);

      if (prop.docs) {
        setter.docs.push(...cloneStructureOrStringArray<JSDocStructure, StructureKind.JSDoc, JSDocImpl>(
          prop.docs as (string | JSDocImpl)[]
        , StructureKind.JSDoc))
      }

      setter.leadingTrivia.push(...prop.leadingTrivia);
      setter.trailingTrivia.push(...prop.trailingTrivia);

      this.addMembers([setter]);
    }

    this.delete(TypeMembersMap.keyFromMember(prop));
  }

  resolveIndexSignature(
  ): never
  {
    throw new Error("not yet implemented");
  }

  /**
   * Move type members from this map to an interface or type literal, and clear this map.
   *
   * @param owner - the target interface or type literal declaration.
   */
  moveMembersToType(
    owner: InterfaceDeclarationImpl | MemberedObjectTypeStructureImpl
  ): void
  {
    this.forEach(member => this.#moveMemberToOwner(owner, member));
    this.clear();
  }

  #moveMemberToOwner(
    owner: InterfaceDeclarationImpl | MemberedObjectTypeStructureImpl,
    member: TypeMemberImpl
  ): void
  {
    switch (member.kind) {
      case StructureKind.CallSignature:
        owner.callSignatures.push(member);
        return;
      case StructureKind.ConstructSignature:
        owner.constructSignatures.push(member);
        return;
      case StructureKind.GetAccessor:
        owner.getAccessors.push(member);
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
      case StructureKind.SetAccessor:
        owner.setAccessors.push(member);
        return;
      default:
        throw new Error("unreachable");
    }
  }
}