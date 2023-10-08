//#region preamble
import {
  type CloneableStructure,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  OptionalKind,
  type SpreadAssignmentStructure,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const SpreadAssignmentStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class SpreadAssignmentImpl
  extends SpreadAssignmentStructureBase
  implements SpreadAssignmentStructure
{
  readonly kind: StructureKind.SpreadAssignment =
    StructureKind.SpreadAssignment;
  expression: stringOrWriter = "";

  public static copyFields(
    source: OptionalKind<SpreadAssignmentStructure>,
    target: SpreadAssignmentImpl,
  ): void {
    super.copyFields(source, target);
    if (source.expression) {
      target.expression = source.expression;
    }
  }

  public static clone(
    source: OptionalKind<SpreadAssignmentStructure>,
  ): SpreadAssignmentImpl {
    const target = new SpreadAssignmentImpl();
    this.copyFields(source, target);
    return target;
  }
}

SpreadAssignmentImpl satisfies CloneableStructure<SpreadAssignmentStructure>;
StructuresClassesMap.set(StructureKind.SpreadAssignment, SpreadAssignmentImpl);
