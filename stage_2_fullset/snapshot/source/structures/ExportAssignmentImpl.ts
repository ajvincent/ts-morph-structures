//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type PreferArrayFields,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  StructureBase,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import type { stringOrWriterFunction } from "../types/stringOrWriterFunction.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ExportAssignmentStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const ExportAssignmentStructureBase = MultiMixinBuilder<
  [JSDocableNodeStructureFields, StructureFields],
  typeof StructureBase
>([JSDocableNodeStructureMixin, StructureMixin], StructureBase);

export default class ExportAssignmentImpl
  extends ExportAssignmentStructureBase
  implements RequiredOmit<PreferArrayFields<ExportAssignmentStructure>>
{
  readonly kind: StructureKind.ExportAssignment =
    StructureKind.ExportAssignment;
  expression: stringOrWriterFunction = "";
  isExportEquals = false;

  constructor(expression: stringOrWriterFunction) {
    super();
    this.expression = expression;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<ExportAssignmentStructure>,
    target: ExportAssignmentImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.expression) {
      target.expression = source.expression;
    }

    target.isExportEquals = source.isExportEquals ?? false;
  }

  public static clone(
    source: OptionalKind<ExportAssignmentStructure>,
  ): ExportAssignmentImpl {
    const target = new ExportAssignmentImpl(source.expression);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<ExportAssignmentImpl> {
    const rv = super.toJSON() as StructureClassToJSON<ExportAssignmentImpl>;
    rv.expression = StructureBase[REPLACE_WRITER_WITH_STRING](this.expression);
    rv.isExportEquals = this.isExportEquals;
    rv.kind = this.kind;
    return rv;
  }
}

ExportAssignmentImpl satisfies CloneableStructure<
  ExportAssignmentStructure,
  ExportAssignmentImpl
> &
  Class<ExtractStructure<ExportAssignmentStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.ExportAssignment, ExportAssignmentImpl);
