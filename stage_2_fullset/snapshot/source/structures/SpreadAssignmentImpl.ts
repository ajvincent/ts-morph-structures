//#region preamble
import {
  type ExpressionedNodeStructureFields,
  ExpressionedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type SpreadAssignmentStructure,
  StructureKind,
  type Structures,
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
    source: SpreadAssignmentStructure & Structures,
    target: SpreadAssignmentImpl & Structures,
  ): void {
    super.copyFields(source, target);
  }
}
