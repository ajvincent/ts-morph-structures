//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
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
  type PropertyAssignmentStructure,
  StructureKind,
} from "ts-morph";
import type { Class, Jsonify } from "type-fest";
//#endregion preamble
const PropertyAssignmentStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class PropertyAssignmentImpl
  extends PropertyAssignmentStructureBase
  implements RequiredOmit<PreferArrayFields<PropertyAssignmentStructure>>
{
  readonly kind: StructureKind.PropertyAssignment =
    StructureKind.PropertyAssignment;
  initializer: stringOrWriter = "";

  constructor(name: string, initializer: stringOrWriter) {
    super();
    this.initializer = initializer;
    this.name = name;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<PropertyAssignmentStructure>,
    target: PropertyAssignmentImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.initializer) {
      target.initializer = source.initializer;
    }
  }

  public static clone(
    source: OptionalKind<PropertyAssignmentStructure>,
  ): PropertyAssignmentImpl {
    const target = new PropertyAssignmentImpl(source.name, source.initializer);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<PropertyAssignmentStructure> {
    const rv = super.toJSON() as PropertyAssignmentStructure;
    rv.initializer = StructureBase[REPLACE_WRITER_WITH_STRING](
      this.initializer,
    );
    rv.kind = this.kind;
    return rv;
  }
}

PropertyAssignmentImpl satisfies CloneableStructure<
  PropertyAssignmentStructure,
  PropertyAssignmentImpl
> &
  Class<ExtractStructure<PropertyAssignmentStructure["kind"]>>;
StructuresClassesMap.set(
  StructureKind.PropertyAssignment,
  PropertyAssignmentImpl,
);
