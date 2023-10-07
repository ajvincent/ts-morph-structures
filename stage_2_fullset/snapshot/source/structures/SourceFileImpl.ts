//#region preamble
import {
  type StatementedNodeStructureFields,
  StatementedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type SourceFileStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
const SourceFileStructureBase = MultiMixinBuilder<
  [StatementedNodeStructureFields, StructureFields],
  typeof StructureBase
>([StatementedNodeStructureMixin, StructureMixin], StructureBase);

export default class SourceFileImpl extends SourceFileStructureBase {
  readonly kind: StructureKind.SourceFile = StructureKind.SourceFile;

  public static copyFields(
    source: SourceFileStructure & Structures,
    target: SourceFileImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.kind) {
      target.kind = source.kind;
    }
  }
}
