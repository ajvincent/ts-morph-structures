//#region preamble
import {
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ExportAssignmentStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
const ExportAssignmentStructureBase = MultiMixinBuilder<
  [JSDocableNodeStructureFields, StructureFields],
  typeof StructureBase
>([JSDocableNodeStructureMixin, StructureMixin], StructureBase);

export default class ExportAssignmentImpl
  extends ExportAssignmentStructureBase
  implements ExportAssignmentStructure
{
  readonly kind: StructureKind.ExportAssignment =
    StructureKind.ExportAssignment;
  isExportEquals = false;
  expression: stringOrWriter = "";

  public static copyFields(
    source: ExportAssignmentStructure & Structures,
    target: ExportAssignmentImpl & Structures,
  ): void {
    super.copyFields(source, target);
    target.isExportEquals = source.isExportEquals ?? false;
    if (source.expression) {
      target.expression = source.expression;
    }
  }
}
