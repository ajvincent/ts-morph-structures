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
import MultiMixinBuilder from "mixin-decorators";
import {
  OptionalKind,
  type ShorthandPropertyAssignmentStructure,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const ShorthandPropertyAssignmentStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class ShorthandPropertyAssignmentImpl
  extends ShorthandPropertyAssignmentStructureBase
  implements ShorthandPropertyAssignmentStructure
{
  readonly kind: StructureKind.ShorthandPropertyAssignment =
    StructureKind.ShorthandPropertyAssignment;

  public static copyFields(
    source: OptionalKind<ShorthandPropertyAssignmentStructure>,
    target: ShorthandPropertyAssignmentImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<ShorthandPropertyAssignmentStructure>,
  ): ShorthandPropertyAssignmentImpl {
    const target = new ShorthandPropertyAssignmentImpl();
    this.copyFields(source, target);
    return target;
  }
}

ShorthandPropertyAssignmentImpl satisfies CloneableStructure<ShorthandPropertyAssignmentStructure>;
StructuresClassesMap.set(
  StructureKind.ShorthandPropertyAssignment,
  ShorthandPropertyAssignmentImpl,
);
