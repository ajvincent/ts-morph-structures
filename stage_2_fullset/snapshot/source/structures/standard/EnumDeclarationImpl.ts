//#region preamble
import { EnumMemberImpl } from "../../exports.js";
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
  cloneStructureArray,
  COPY_FIELDS,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type ExtractStructure,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type PreferArrayFields,
  type RequiredOmit,
  StructureBase,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type EnumDeclarationStructure,
  type EnumMemberStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const EnumDeclarationStructureBase = MultiMixinBuilder<
  [
    ExportableNodeStructureFields,
    AmbientableNodeStructureFields,
    NamedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class EnumDeclarationImpl
  extends EnumDeclarationStructureBase
  implements RequiredOmit<PreferArrayFields<EnumDeclarationStructure>>
{
  readonly kind: StructureKind.Enum = StructureKind.Enum;
  isConst = false;
  readonly members: EnumMemberImpl[] = [];

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<EnumDeclarationStructure>,
    target: EnumDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    target.isConst = source.isConst ?? false;
    if (source.members) {
      target.members.push(
        ...cloneStructureArray<
          OptionalKind<EnumMemberStructure>,
          StructureKind.EnumMember,
          EnumMemberImpl
        >(source.members, StructureKind.EnumMember),
      );
    }
  }

  public static clone(
    source: OptionalKind<EnumDeclarationStructure>,
  ): EnumDeclarationImpl {
    const target = new EnumDeclarationImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<EnumDeclarationImpl> {
    const rv = super.toJSON() as StructureClassToJSON<EnumDeclarationImpl>;
    rv.isConst = this.isConst;
    rv.kind = this.kind;
    rv.members = this.members;
    return rv;
  }
}

EnumDeclarationImpl satisfies CloneableStructure<
  EnumDeclarationStructure,
  EnumDeclarationImpl
> &
  Class<ExtractStructure<EnumDeclarationStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.Enum, EnumDeclarationImpl);
