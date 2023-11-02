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
  type ExtractStructure,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type PreferArrayFields,
  type RequiredOmit,
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
import type { Class, Jsonify } from "type-fest";
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
  implements
    RequiredOmit<
      PreferArrayFields<VariableStatementStructure>,
      "declarationKind"
    >
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

  public toJSON(): Jsonify<VariableStatementStructure> {
    const rv = super.toJSON() as VariableStatementStructure;
    if (this.declarationKind) {
      rv.declarationKind = this.declarationKind;
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
