//#region preamble
import {
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type JsxAttributeStructure,
  type JsxElementStructure,
  type JsxSelfClosingElementStructure,
  type JsxSpreadAttributeStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
const JsxElementStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JsxElementImpl
  extends JsxElementStructureBase
  implements JsxElementStructure
{
  readonly kind: StructureKind.JsxElement = StructureKind.JsxElement;
  attributes: (JsxAttributeStructure | JsxSpreadAttributeStructure)[] = [];
  children: (JsxElementStructure | JsxSelfClosingElementStructure)[] = [];
  name = "";
  bodyText?: string = undefined;

  public static copyFields(
    source: JsxElementStructure & Structures,
    target: JsxElementImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.name) {
      target.name = source.name;
    }

    if (source.bodyText) {
      target.bodyText = source.bodyText;
    }
  }
}
