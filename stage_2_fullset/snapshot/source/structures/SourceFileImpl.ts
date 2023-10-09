//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
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

  public static clone(
    source: OptionalKind<SourceFileStructure>,
  ): SourceFileImpl {
    const target = new SourceFileImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }
}

SourceFileImpl satisfies CloneableStructure<
  SourceFileStructure,
  SourceFileImpl
>;
StructuresClassesMap.set(StructureKind.SourceFile, SourceFileImpl);
