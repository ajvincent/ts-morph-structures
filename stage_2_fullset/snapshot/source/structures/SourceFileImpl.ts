//#region preamble
import {
  type CloneableStructure,
  type StatementedNodeStructureFields,
  StatementedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  OptionalKind,
  type SourceFileStructure,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const SourceFileStructureBase = MultiMixinBuilder<
  [StatementedNodeStructureFields, StructureFields],
  typeof StructureBase
>([StatementedNodeStructureMixin, StructureMixin], StructureBase);

export default class SourceFileImpl
  extends SourceFileStructureBase
  implements SourceFileStructure
{
  readonly kind: StructureKind.SourceFile = StructureKind.SourceFile;

  public static copyFields(
    source: OptionalKind<SourceFileStructure>,
    target: SourceFileImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<SourceFileStructure>,
  ): SourceFileImpl {
    const target = new SourceFileImpl();
    this.copyFields(source, target);
    return target;
  }
}

SourceFileImpl satisfies CloneableStructure<SourceFileStructure>;
StructuresClassesMap.set(StructureKind.SourceFile, SourceFileImpl);
