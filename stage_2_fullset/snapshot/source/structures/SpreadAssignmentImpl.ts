//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
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
  OptionalKind,
  type SpreadAssignmentStructure,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const SpreadAssignmentStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class SpreadAssignmentImpl
  extends SpreadAssignmentStructureBase
  implements RequiredOmit<PreferArrayFields<SpreadAssignmentStructure>>
{
  readonly kind: StructureKind.SpreadAssignment =
    StructureKind.SpreadAssignment;
  expression: stringOrWriterFunction = "";

  constructor(expression: stringOrWriterFunction) {
    super();
    this.expression = expression;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<SpreadAssignmentStructure>,
    target: SpreadAssignmentImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.expression) {
      target.expression = source.expression;
    }
  }

  public static clone(
    source: OptionalKind<SpreadAssignmentStructure>,
  ): SpreadAssignmentImpl {
    const target = new SpreadAssignmentImpl(source.expression);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<SpreadAssignmentImpl> {
    const rv = super.toJSON() as StructureClassToJSON<SpreadAssignmentImpl>;
    rv.expression = StructureBase[REPLACE_WRITER_WITH_STRING](this.expression);
    rv.kind = this.kind;
    return rv;
  }
}

SpreadAssignmentImpl satisfies CloneableStructure<
  SpreadAssignmentStructure,
  SpreadAssignmentImpl
> &
  Class<ExtractStructure<SpreadAssignmentStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.SpreadAssignment, SpreadAssignmentImpl);
