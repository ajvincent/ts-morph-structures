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
import {
  type JsxSelfClosingElementStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
const JsxSelfClosingElementStructureBase = MultiMixinBuilder<
  [JsxAttributedNodeStructureFields, NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>(
  [JsxAttributedNodeStructureMixin, NamedNodeStructureMixin, StructureMixin],
  StructureBase,
);

export default class JsxSelfClosingElementImpl
  extends JsxSelfClosingElementStructureBase
  implements JsxSelfClosingElementStructure
{
  readonly kind: StructureKind.JsxSelfClosingElement =
    StructureKind.JsxSelfClosingElement;

  public static copyFields(
    source: JsxSelfClosingElementStructure & Structures,
    target: JsxSelfClosingElementImpl & Structures,
  ): void {
    super.copyFields(source, target);
  }
}
