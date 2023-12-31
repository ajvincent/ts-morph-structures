//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
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
  type ImportAttributeStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const ImportAttributeStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class ImportAttributeImpl
  extends ImportAttributeStructureBase
  implements RequiredOmit<PreferArrayFields<ImportAttributeStructure>>
{
  readonly kind: StructureKind.ImportAttribute = StructureKind.ImportAttribute;
  name: string;
  value: string;

  constructor(value: string, name: string) {
    super();
    this.name = name;
    this.value = value;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<ImportAttributeStructure>,
    target: ImportAttributeImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.name) {
      target.name = source.name;
    }

    if (source.value) {
      target.value = source.value;
    }
  }

  public static clone(
    source: OptionalKind<ImportAttributeStructure>,
  ): ImportAttributeImpl {
    const target = new ImportAttributeImpl(source.value, source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<ImportAttributeImpl> {
    const rv = super.toJSON() as StructureClassToJSON<ImportAttributeImpl>;
    rv.kind = this.kind;
    rv.name = this.name;
    rv.value = this.value;
    return rv;
  }
}

ImportAttributeImpl satisfies CloneableStructure<
  ImportAttributeStructure,
  ImportAttributeImpl
> &
  Class<ExtractStructure<ImportAttributeStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.ImportAttribute, ImportAttributeImpl);
