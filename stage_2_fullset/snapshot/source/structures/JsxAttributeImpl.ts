//#region preamble
import {
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type JsxAttributeStructure,
  type JsxNamespacedNameStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
const JsxAttributeStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JsxAttributeImpl
  extends JsxAttributeStructureBase
  implements JsxAttributeStructure
{
  readonly kind: StructureKind.JsxAttribute = StructureKind.JsxAttribute;
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
