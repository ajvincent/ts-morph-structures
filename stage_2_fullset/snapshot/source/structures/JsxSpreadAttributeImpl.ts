//#region preamble
import {
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import type { JsxSpreadAttributeStructure, Structures } from "ts-morph";
//#endregion preamble
const JsxSpreadAttributeStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JsxSpreadAttributeImpl extends JsxSpreadAttributeStructureBase {
  expression: string = "";

  public static copyFields(
    source: JsxSpreadAttributeStructure & Structures,
    target: JsxSpreadAttributeImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.expression) {
      target.expression = source.expression;
    }
  }
}
