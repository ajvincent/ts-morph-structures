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
  type StatementedNodeStructureFields,
  StatementedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  ModuleDeclarationKind,
  type ModuleDeclarationStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
const ModuleDeclarationStructureBase = MultiMixinBuilder<
  [
    ExportableNodeStructureFields,
    StatementedNodeStructureFields,
    AmbientableNodeStructureFields,
    NamedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ExportableNodeStructureMixin,
    StatementedNodeStructureMixin,
    AmbientableNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class ModuleDeclarationImpl
  extends ModuleDeclarationStructureBase
  implements ModuleDeclarationStructure
{
  readonly kind: StructureKind.Module = StructureKind.Module;
  declarationKind?: ModuleDeclarationKind = undefined;

  public static copyFields(
    source: ModuleDeclarationStructure & Structures,
    target: ModuleDeclarationImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.declarationKind) {
      target.declarationKind = source.declarationKind;
    }
  }
}
