//#region preamble
import { VariableDeclarationImpl } from "../exports.js";
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
  cloneStructureArray,
  COPY_FIELDS,
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
  type OptionalKind,
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
  declarationKind?: VariableDeclarationKind = undefined;
  readonly declarations: VariableDeclarationImpl[] = [];

  public static [COPY_FIELDS](
    source: OptionalKind<VariableStatementStructure>,
    target: VariableStatementImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    target.declarations.push(
      ...cloneStructureArray<
        OptionalKind<VariableDeclarationStructure>,
        StructureKind.VariableDeclaration,
        VariableDeclarationImpl
      >(source.declarations, StructureKind.VariableDeclaration),
    );
    if (source.declarationKind) {
      target.declarationKind = source.declarationKind;
    }
  }

  public static clone(
    source: OptionalKind<VariableStatementStructure>,
  ): VariableStatementImpl {
    const target = new VariableStatementImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }
}

VariableStatementImpl satisfies CloneableStructure<
  VariableStatementStructure,
  VariableStatementImpl
>;
StructuresClassesMap.set(
  StructureKind.VariableStatement,
  VariableStatementImpl,
);
