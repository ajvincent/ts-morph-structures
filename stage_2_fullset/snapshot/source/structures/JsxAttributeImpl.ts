//#region preamble
import {
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import type {
  JsxAttributeStructure,
  JsxNamespacedNameStructure,
  Structures,
} from "ts-morph";
//#endregion preamble
const JsxAttributeStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JsxAttributeImpl extends JsxAttributeStructureBase {
  name: string | JsxNamespacedNameStructure = "";
  initializer?: string = undefined;

  public static copyFields(
    source: JsxAttributeStructure & Structures,
    target: JsxAttributeImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.name) {
      target.name = source.name;
    }

    if (source.initializer) {
      target.initializer = source.initializer;
    }
  }
}
