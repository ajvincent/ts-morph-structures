//#region preamble
import {
  type CloneableStructure,
  type ExpressionedNodeStructureFields,
  ExpressionedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  OptionalKind,
  type SpreadAssignmentStructure,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const SpreadAssignmentStructureBase = MultiMixinBuilder<
  [ExpressionedNodeStructureFields, StructureFields],
  typeof StructureBase
>([ExpressionedNodeStructureMixin, StructureMixin], StructureBase);

export default class SpreadAssignmentImpl
  extends SpreadAssignmentStructureBase
  implements SpreadAssignmentStructure
{
  readonly kind: StructureKind.SpreadAssignment =
    StructureKind.SpreadAssignment;

  public static copyFields(
    source: OptionalKind<SpreadAssignmentStructure>,
    target: SpreadAssignmentImpl,
  ): void {
    super.copyFields(source, target);
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
