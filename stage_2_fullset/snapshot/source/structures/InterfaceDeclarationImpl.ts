//#region preamble
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type ExtendsClauseableNodeStructureFields,
  ExtendsClauseableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  type TypeElementMemberedNodeStructureFields,
  TypeElementMemberedNodeStructureMixin,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import type { InterfaceDeclarationStructure, Structures } from "ts-morph";
//#endregion preamble
const InterfaceDeclarationStructureBase = MultiMixinBuilder<
  [
    ExtendsClauseableNodeStructureFields,
    TypeElementMemberedNodeStructureFields,
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
    ExtendsClauseableNodeStructureMixin,
    TypeElementMemberedNodeStructureMixin,
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class InterfaceDeclarationImpl extends InterfaceDeclarationStructureBase {
  public static copyFields(
    source: InterfaceDeclarationStructure & Structures,
    target: InterfaceDeclarationImpl & Structures,
  ): void {
    super.copyFields(source, target);
  }
}
