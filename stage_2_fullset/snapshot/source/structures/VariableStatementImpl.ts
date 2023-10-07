//#region preamble
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  StructureKind,
  type Structures,
  VariableDeclarationKind,
  type VariableDeclarationStructure,
  type VariableStatementStructure,
} from "ts-morph";
//#endregion preamble
const VariableStatementStructureBase = MultiMixinBuilder<
  [
    ExportableNodeStructureFields,
    AmbientableNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class VariableStatementImpl
  extends VariableStatementStructureBase
  implements VariableStatementStructure
{
  readonly kind: StructureKind.VariableStatement =
    StructureKind.VariableStatement;
  declarations: VariableDeclarationStructure[] = [];
  declarationKind?: VariableDeclarationKind = undefined;

  public static copyFields(
    source: VariableStatementStructure & Structures,
    target: VariableStatementImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.declarationKind) {
      target.declarationKind = source.declarationKind;
    }
  }
}
