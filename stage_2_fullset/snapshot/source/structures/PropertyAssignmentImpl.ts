//#region preamble
import {
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type PropertyAssignmentStructure,
  StructureKind,
  type Structures,
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

  public static copyFields(
    source: PropertyAssignmentStructure & Structures,
    target: PropertyAssignmentImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.initializer) {
      target.initializer = source.initializer;
    }
  }
}
