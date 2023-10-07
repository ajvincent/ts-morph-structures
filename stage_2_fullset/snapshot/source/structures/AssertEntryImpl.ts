//#region preamble
import {
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import type { AssertEntryStructure, Structures } from "ts-morph";
//#endregion preamble
const AssertEntryStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class AssertEntryImpl extends AssertEntryStructureBase {
  value = "";

  public static copyFields(
    source: AssertEntryStructure & Structures,
    target: AssertEntryImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.value) {
      target.value = source.value;
    }
  }
}
