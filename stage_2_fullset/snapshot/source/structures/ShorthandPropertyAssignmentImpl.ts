//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type PreferArrayFields,
  type RequiredOmit,
  StructureBase,
  type StructureClassToJSON,
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
import type { Class } from "type-fest";
//#endregion preamble
const ShorthandPropertyAssignmentStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class ShorthandPropertyAssignmentImpl
  extends ShorthandPropertyAssignmentStructureBase
  implements
    RequiredOmit<PreferArrayFields<ShorthandPropertyAssignmentStructure>>
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

  public toJSON(): StructureClassToJSON<ShorthandPropertyAssignmentImpl> {
    const rv =
      super.toJSON() as StructureClassToJSON<ShorthandPropertyAssignmentImpl>;
    rv.kind = this.kind;
    return rv;
  }
}

ShorthandPropertyAssignmentImpl satisfies CloneableStructure<
  ShorthandPropertyAssignmentStructure,
  ShorthandPropertyAssignmentImpl
> &
  Class<ExtractStructure<ShorthandPropertyAssignmentStructure["kind"]>>;
StructuresClassesMap.set(
  StructureKind.ShorthandPropertyAssignment,
  ShorthandPropertyAssignmentImpl,
);
