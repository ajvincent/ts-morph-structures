//#region preamble
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  OptionalKind,
  StructureKind,
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
    source: OptionalKind<VariableStatementStructure>,
    target: VariableStatementImpl,
  ): void {
    super.copyFields(source, target);
    if (source.declarationKind) {
      target.declarationKind = source.declarationKind;
    }
  }

  public static clone(
    source: OptionalKind<VariableStatementStructure>,
  ): VariableStatementImpl {
    const target = new VariableStatementImpl();
    this.copyFields(source, target);
    return target;
  }
}

VariableStatementImpl satisfies CloneableStructure<VariableStatementStructure>;
StructuresClassesMap.set(
  StructureKind.VariableStatement,
  VariableStatementImpl,
);
