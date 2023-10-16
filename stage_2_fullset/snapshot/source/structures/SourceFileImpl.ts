//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type PreferArrayFields,
  type RequiredOmit,
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
import type { Jsonify } from "type-fest";
//#endregion preamble
const SourceFileStructureBase = MultiMixinBuilder<
  [StatementedNodeStructureFields, StructureFields],
  typeof StructureBase
>([StatementedNodeStructureMixin, StructureMixin], StructureBase);

export default class SourceFileImpl
  extends SourceFileStructureBase
  implements RequiredOmit<PreferArrayFields<SourceFileStructure>>
{
  readonly kind: StructureKind.SourceFile = StructureKind.SourceFile;

  public static clone(
    source: OptionalKind<SourceFileStructure>,
  ): SourceFileImpl {
    const target = new SourceFileImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<SourceFileStructure> {
    const rv = super.toJSON() as SourceFileStructure;
    rv.kind = this.kind;
    return rv;
  }
}

SourceFileImpl satisfies CloneableStructure<
  SourceFileStructure,
  SourceFileImpl
>;
StructuresClassesMap.set(StructureKind.SourceFile, SourceFileImpl);
