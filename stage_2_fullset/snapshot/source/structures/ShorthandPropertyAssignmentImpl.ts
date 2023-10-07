//#region preamble
import {
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import type {
  ShorthandPropertyAssignmentStructure,
  Structures,
} from "ts-morph";
//#endregion preamble
const ShorthandPropertyAssignmentStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class ShorthandPropertyAssignmentImpl extends ShorthandPropertyAssignmentStructureBase {
  public static copyFields(
    source: ShorthandPropertyAssignmentStructure & Structures,
    target: ShorthandPropertyAssignmentImpl & Structures,
  ): void {
    super.copyFields(source, target);
  }
}
