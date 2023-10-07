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
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import type {
  EnumDeclarationStructure,
  EnumMemberStructure,
  Structures,
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

export default class EnumDeclarationImpl extends EnumDeclarationStructureBase {
  isConst = false;
  members: EnumMemberStructure[] = [];

  public static copyFields(
    source: EnumDeclarationStructure & Structures,
    target: EnumDeclarationImpl & Structures,
  ): void {
    super.copyFields(source, target);
    target.isConst = source.isConst ?? false;
  }
}
