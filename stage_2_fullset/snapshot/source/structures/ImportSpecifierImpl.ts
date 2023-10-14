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
  type ImportSpecifierStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const ImportSpecifierStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class ImportSpecifierImpl
  extends ImportSpecifierStructureBase
  implements ImportSpecifierStructure
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
    target.isTypeOnly = source.isTypeOnly ?? false;
    if (source.alias) {
      target.alias = source.alias;
    }
  }

  public static clone(
    source: OptionalKind<ImportSpecifierStructure>,
  ): ImportSpecifierImpl {
    const target = new ImportSpecifierImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }
}

ImportSpecifierImpl satisfies CloneableStructure<
  ImportSpecifierStructure,
  ImportSpecifierImpl
>;
StructuresClassesMap.set(StructureKind.ImportSpecifier, ImportSpecifierImpl);
