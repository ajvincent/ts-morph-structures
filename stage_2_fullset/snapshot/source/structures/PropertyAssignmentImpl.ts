//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
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
//#endregion preamble
const PropertyAssignmentStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class PropertyAssignmentImpl
  extends PropertyAssignmentStructureBase
  implements PropertyAssignmentStructure
{
  readonly kind: StructureKind.PropertyAssignment =
    StructureKind.PropertyAssignment;
  initializer: stringOrWriter = "";

  constructor(name: string, initializer: stringOrWriter) {
    super();
    this.name = name;
    this.initializer = initializer;
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

  public toJSON(): PropertyAssignmentStructure {
    const rv = super.toJSON() as PropertyAssignmentStructure;
    rv.initializer = this.initializer;
    rv.kind = this.kind;
    return rv;
  }
}

PropertyAssignmentImpl satisfies CloneableStructure<
  PropertyAssignmentStructure,
  PropertyAssignmentImpl
>;
StructuresClassesMap.set(
  StructureKind.PropertyAssignment,
  PropertyAssignmentImpl,
);
