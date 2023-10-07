//#region preamble
import {
  type CloneableStructure,
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
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class ImportSpecifierImpl
  extends ImportSpecifierStructureBase
  implements ImportSpecifierStructure
{
  readonly kind: StructureKind.ImportSpecifier = StructureKind.ImportSpecifier;
  isTypeOnly = false;
  name = "";
  alias?: string = undefined;

  public static copyFields(
    source: OptionalKind<ImportSpecifierStructure>,
    target: ImportSpecifierImpl,
  ): void {
    super.copyFields(source, target);
    target.isTypeOnly = source.isTypeOnly ?? false;
    if (source.name) {
      target.name = source.name;
    }

    if (source.alias) {
      target.alias = source.alias;
    }
  }

  public static clone(
    source: OptionalKind<ImportSpecifierStructure>,
  ): ImportSpecifierImpl {
    const target = new ImportSpecifierImpl();
    this.copyFields(source, target);
    return target;
  }
}

ImportSpecifierImpl satisfies CloneableStructure<ImportSpecifierStructure>;
StructuresClassesMap.set(StructureKind.ImportSpecifier, ImportSpecifierImpl);
