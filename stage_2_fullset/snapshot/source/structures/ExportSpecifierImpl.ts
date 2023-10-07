//#region preamble
import {
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import type { ExportSpecifierStructure, Structures } from "ts-morph";
//#endregion preamble
const ExportSpecifierStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class ExportSpecifierImpl extends ExportSpecifierStructureBase {
  isTypeOnly = false;
  name = "";
  alias?: string = undefined;

  public static copyFields(
    source: ExportSpecifierStructure & Structures,
    target: ExportSpecifierImpl & Structures,
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
