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
  type AssertEntryStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const AssertEntryStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class AssertEntryImpl
  extends AssertEntryStructureBase
  implements AssertEntryStructure
{
  readonly kind: StructureKind.AssertEntry = StructureKind.AssertEntry;
  value = "";

  public static copyFields(
    source: OptionalKind<AssertEntryStructure>,
    target: AssertEntryImpl,
  ): void {
    super.copyFields(source, target);
    if (source.value) {
      target.value = source.value;
    }
  }

  public static clone(
    source: OptionalKind<AssertEntryStructure>,
  ): AssertEntryImpl {
    const target = new AssertEntryImpl();
    this.copyFields(source, target);
    return target;
  }
}

AssertEntryImpl satisfies CloneableStructure<AssertEntryStructure>;
StructuresClassesMap.set(StructureKind.AssertEntry, AssertEntryImpl);
