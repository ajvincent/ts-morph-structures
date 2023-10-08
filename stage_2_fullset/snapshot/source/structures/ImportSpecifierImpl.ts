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
  isTypeOnly = false;
  alias?: string = undefined;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static copyFields(
    source: OptionalKind<ImportSpecifierStructure>,
    target: ImportSpecifierImpl,
  ): void {
    super.copyFields(source, target);
    target.isTypeOnly = source.isTypeOnly ?? false;
    if (source.alias) {
      target.alias = source.alias;
    }
  }

  public static clone(
    source: OptionalKind<ImportSpecifierStructure>,
  ): ImportSpecifierImpl {
    const target = new ImportSpecifierImpl(source.name);
    this.copyFields(source, target);
    return target;
  }
}

ImportSpecifierImpl satisfies CloneableStructure<ImportSpecifierStructure>;
StructuresClassesMap.set(StructureKind.ImportSpecifier, ImportSpecifierImpl);
