//#region preamble
import { VariableDeclarationImpl } from "../../exports.js";
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
  StructureBase,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type VariableStatementStructureClassIfc,
} from "../../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type OptionalKind,
  StructureKind,
  VariableDeclarationKind,
  type VariableDeclarationStructure,
  type VariableStatementStructure,
} from "ts-morph";
import type { Class } from "type-fest";
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
  implements VariableStatementStructureClassIfc
{
  readonly kind: StructureKind.VariableStatement =
    StructureKind.VariableStatement;
  declarationKind?: VariableDeclarationKind = undefined;
  readonly declarations: VariableDeclarationImpl[] = [];

  /** @internal */
  public static [COPY_FIELDS](
    source: OptionalKind<VariableStatementStructure>,
    target: VariableStatementImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.declarationKind) {
      target.declarationKind = source.declarationKind;
    }

    target.declarations.push(
      ...cloneStructureArray<
        OptionalKind<VariableDeclarationStructure>,
        StructureKind.VariableDeclaration,
        VariableDeclarationImpl
      >(source.declarations, StructureKind.VariableDeclaration),
    );
  }

  public static clone(
    source: OptionalKind<VariableStatementStructure>,
  ): VariableStatementImpl {
    const target = new VariableStatementImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<VariableStatementImpl> {
    const rv = super.toJSON() as StructureClassToJSON<VariableStatementImpl>;
    if (this.declarationKind) {
      rv.declarationKind = this.declarationKind;
    } else {
      rv.declarationKind = undefined;
    }

    rv.declarations = this.declarations;
    rv.kind = this.kind;
    return rv;
  }
}

VariableStatementImpl satisfies CloneableStructure<
  VariableStatementStructure,
  VariableStatementImpl
> &
  Class<ExtractStructure<VariableStatementStructure["kind"]>>;
StructuresClassesMap.set(
  StructureKind.VariableStatement,
  VariableStatementImpl,
);
