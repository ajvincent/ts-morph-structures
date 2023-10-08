//#region preamble
import {
  type CloneableStructure,
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

  public static copyFields(
    source: OptionalKind<PropertyAssignmentStructure>,
    target: PropertyAssignmentImpl,
  ): void {
    super.copyFields(source, target);
    if (source.initializer) {
      target.initializer = source.initializer;
    }
  }

  public static clone(
    source: OptionalKind<PropertyAssignmentStructure>,
  ): PropertyAssignmentImpl {
    const target = new PropertyAssignmentImpl(source.name, source.initializer);
    this.copyFields(source, target);
    return target;
  }
}

PropertyAssignmentImpl satisfies CloneableStructure<PropertyAssignmentStructure>;
StructuresClassesMap.set(
  StructureKind.PropertyAssignment,
  PropertyAssignmentImpl,
);
