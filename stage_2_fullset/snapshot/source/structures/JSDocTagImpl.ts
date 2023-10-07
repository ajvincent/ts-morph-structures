//#region preamble
import {
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type JSDocTagStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
const JSDocTagStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JSDocTagImpl
  extends JSDocTagStructureBase
  implements JSDocTagStructure
{
  readonly kind: StructureKind.JSDocTag = StructureKind.JSDocTag;
  tagName = "";
  text?: stringOrWriter = undefined;

  public static copyFields(
    source: JSDocTagStructure & Structures,
    target: JSDocTagImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.tagName) {
      target.tagName = source.tagName;
    }

    if (source.text) {
      target.text = source.text;
    }
  }
}
