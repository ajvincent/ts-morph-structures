//#region preamble
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
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
  OptionalKind,
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
  members: EnumMemberStructure[] = [];

  public static copyFields(
    source: OptionalKind<EnumDeclarationStructure>,
    target: EnumDeclarationImpl,
  ): void {
    super.copyFields(source, target);
    target.isConst = source.isConst ?? false;
  }

  public static clone(
    source: OptionalKind<EnumDeclarationStructure>,
  ): EnumDeclarationImpl {
    const target = new EnumDeclarationImpl();
    this.copyFields(source, target);
    return target;
  }
}

EnumDeclarationImpl satisfies CloneableStructure<EnumDeclarationStructure>;
StructuresClassesMap.set(StructureKind.Enum, EnumDeclarationImpl);
