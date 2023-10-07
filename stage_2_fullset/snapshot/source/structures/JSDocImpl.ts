//#region preamble
import {
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import type { JSDocStructure, JSDocTagStructure, Structures } from "ts-morph";
//#endregion preamble
const JSDocStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JSDocImpl extends JSDocStructureBase {
  tags: JSDocTagStructure[] = [];
  description?: stringOrWriter = undefined;

  public static copyFields(
    source: JSDocStructure & Structures,
    target: JSDocImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.description) {
      target.description = source.description;
    }
  }
}
