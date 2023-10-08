//#region preamble
import { EnumMemberImpl } from "../exports.js";
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
  cloneStructureArray,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type EnumDeclarationStructure,
  type EnumMemberStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";
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
  implements EnumDeclarationStructure
{
  readonly kind: StructureKind.Enum = StructureKind.Enum;
  isConst = false;
  readonly members: EnumMemberImpl[] = [];

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static copyFields(
    source: OptionalKind<EnumDeclarationStructure>,
    target: EnumDeclarationImpl,
  ): void {
    super.copyFields(source, target);
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
    this.copyFields(source, target);
    return target;
  }
}

EnumDeclarationImpl satisfies CloneableStructure<EnumDeclarationStructure>;
StructuresClassesMap.set(StructureKind.Enum, EnumDeclarationImpl);
