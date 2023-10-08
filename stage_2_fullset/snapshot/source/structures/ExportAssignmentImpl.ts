//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ExportAssignmentStructure,
  OptionalKind,
  StructureKind,
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

  constructor(expression: stringOrWriter) {
    super();
    this.expression = expression;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<ExportAssignmentStructure>,
    target: ExportAssignmentImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    target.isExportEquals = source.isExportEquals ?? false;
    if (source.expression) {
      target.expression = source.expression;
    }
  }

  public static clone(
    source: OptionalKind<ExportAssignmentStructure>,
  ): ExportAssignmentImpl {
    const target = new ExportAssignmentImpl(source.expression);
    this[COPY_FIELDS](source, target);
    return target;
  }
}

ExportAssignmentImpl satisfies CloneableStructure<ExportAssignmentStructure>;
StructuresClassesMap.set(StructureKind.ExportAssignment, ExportAssignmentImpl);
