//#region preamble
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  type TypedNodeStructureFields,
  TypedNodeStructureMixin,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  StructureKind,
  type Structures,
  type TypeAliasDeclarationStructure,
} from "ts-morph";
//#endregion preamble
const TypeAliasDeclarationStructureBase = MultiMixinBuilder<
  [
    TypedNodeStructureFields,
    ExportableNodeStructureFields,
    AmbientableNodeStructureFields,
    TypeParameteredNodeStructureFields,
    NamedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    TypedNodeStructureMixin,
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class TypeAliasDeclarationImpl
  extends TypeAliasDeclarationStructureBase
  implements TypeAliasDeclarationStructure
{
  readonly kind: StructureKind.TypeAlias = StructureKind.TypeAlias;
  type: stringOrWriter = "";

  public static copyFields(
    source: TypeAliasDeclarationStructure & Structures,
    target: TypeAliasDeclarationImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.type) {
      target.type = source.type;
    }
  }
}
