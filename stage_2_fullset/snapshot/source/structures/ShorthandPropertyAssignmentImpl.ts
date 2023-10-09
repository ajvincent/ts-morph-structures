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

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static clone(
    source: OptionalKind<ShorthandPropertyAssignmentStructure>,
  ): ShorthandPropertyAssignmentImpl {
    const target = new ShorthandPropertyAssignmentImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }
}

ShorthandPropertyAssignmentImpl satisfies CloneableStructure<
  ShorthandPropertyAssignmentStructure,
  ShorthandPropertyAssignmentImpl
>;
StructuresClassesMap.set(
  StructureKind.ShorthandPropertyAssignment,
  ShorthandPropertyAssignmentImpl,
);
