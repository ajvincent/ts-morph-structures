//#region preamble
import {
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import type { ImportSpecifierStructure, Structures } from "ts-morph";
//#endregion preamble
const ImportSpecifierStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class ImportSpecifierImpl extends ImportSpecifierStructureBase {
  isTypeOnly = false;
  name: string = "";
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
