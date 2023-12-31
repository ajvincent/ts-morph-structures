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
  type ImportSpecifierStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const ImportSpecifierStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class ImportSpecifierImpl
  extends ImportSpecifierStructureBase
  implements RequiredOmit<PreferArrayFields<ImportSpecifierStructure>, "alias">
{
  readonly kind: StructureKind.ImportSpecifier = StructureKind.ImportSpecifier;
  alias?: string = undefined;
  isTypeOnly = false;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<ImportSpecifierStructure>,
    target: ImportSpecifierImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.alias) {
      target.alias = source.alias;
    }

    target.isTypeOnly = source.isTypeOnly ?? false;
  }

  public static clone(
    source: OptionalKind<ImportSpecifierStructure>,
  ): ImportSpecifierImpl {
    const target = new ImportSpecifierImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<ImportSpecifierImpl> {
    const rv = super.toJSON() as StructureClassToJSON<ImportSpecifierImpl>;
    if (this.alias) {
      rv.alias = this.alias;
    } else {
      rv.alias = undefined;
    }

    rv.isTypeOnly = this.isTypeOnly;
    rv.kind = this.kind;
    return rv;
  }
}

ImportSpecifierImpl satisfies CloneableStructure<
  ImportSpecifierStructure,
  ImportSpecifierImpl
> &
  Class<ExtractStructure<ImportSpecifierStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.ImportSpecifier, ImportSpecifierImpl);
