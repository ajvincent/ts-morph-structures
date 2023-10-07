//#region preamble
import {
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type JsxSpreadAttributeStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
const JsxSpreadAttributeStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JsxSpreadAttributeImpl
  extends JsxSpreadAttributeStructureBase
  implements JsxSpreadAttributeStructure
{
  readonly kind: StructureKind.JsxSpreadAttribute =
    StructureKind.JsxSpreadAttribute;
  expression = "";

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
