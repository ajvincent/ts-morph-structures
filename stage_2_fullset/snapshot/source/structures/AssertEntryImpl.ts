//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type PreferArrayFields,
  type RequiredOmit,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type AssertEntryStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
const AssertEntryStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class AssertEntryImpl
  extends AssertEntryStructureBase
  implements RequiredOmit<PreferArrayFields<AssertEntryStructure>>
{
  readonly kind: StructureKind.AssertEntry = StructureKind.AssertEntry;
  value: string;

  constructor(name: string, value: string) {
    super();
    this.name = name;
    this.value = value;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<AssertEntryStructure>,
    target: AssertEntryImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.value) {
      target.value = source.value;
    }
  }

  public static clone(
    source: OptionalKind<AssertEntryStructure>,
  ): AssertEntryImpl {
    const target = new AssertEntryImpl(source.name, source.value);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<AssertEntryStructure> {
    const rv = super.toJSON() as AssertEntryStructure;
    rv.kind = this.kind;
    rv.value = this.value;
    return rv;
  }
}

AssertEntryImpl satisfies CloneableStructure<
  AssertEntryStructure,
  AssertEntryImpl
>;
StructuresClassesMap.set(StructureKind.AssertEntry, AssertEntryImpl);
