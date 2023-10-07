//#region preamble
import {
  type JsxAttributedNodeStructureFields,
  JsxAttributedNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import type { JsxSelfClosingElementStructure, Structures } from "ts-morph";
//#endregion preamble
const JsxSelfClosingElementStructureBase = MultiMixinBuilder<
  [JsxAttributedNodeStructureFields, NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>(
  [JsxAttributedNodeStructureMixin, NamedNodeStructureMixin, StructureMixin],
  StructureBase,
);

export default class JsxSelfClosingElementImpl extends JsxSelfClosingElementStructureBase {
  public static copyFields(
    source: JsxSelfClosingElementStructure & Structures,
    target: JsxSelfClosingElementImpl & Structures,
  ): void {
    super.copyFields(source, target);
  }
}
