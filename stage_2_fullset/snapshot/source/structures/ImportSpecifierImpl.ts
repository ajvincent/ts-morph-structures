//#region preamble
import {
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ImportSpecifierStructure,
  StructureKind,
  type Structures,
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
    source: ImportSpecifierStructure & Structures,
    target: ImportSpecifierImpl & Structures,
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
}
