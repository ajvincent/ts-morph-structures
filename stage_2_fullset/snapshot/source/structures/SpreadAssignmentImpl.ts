//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  type PreferArrayFields,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
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
import type { Class, Jsonify } from "type-fest";
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
  expression: stringOrWriter = "";

  constructor(expression: stringOrWriter) {
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

  public toJSON(): Jsonify<SpreadAssignmentStructure> {
    const rv = super.toJSON() as SpreadAssignmentStructure;
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
