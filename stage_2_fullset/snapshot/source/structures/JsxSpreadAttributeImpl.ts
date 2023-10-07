//#region preamble
import {
  type CloneableStructure,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type JsxSpreadAttributeStructure,
  OptionalKind,
  StructureKind,
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
    source: OptionalKind<JsxSpreadAttributeStructure>,
    target: JsxSpreadAttributeImpl,
  ): void {
    super.copyFields(source, target);
    if (source.expression) {
      target.expression = source.expression;
    }
  }

  public static clone(
    source: OptionalKind<JsxSpreadAttributeStructure>,
  ): JsxSpreadAttributeImpl {
    const target = new JsxSpreadAttributeImpl();
    this.copyFields(source, target);
    return target;
  }
}

JsxSpreadAttributeImpl satisfies CloneableStructure<JsxSpreadAttributeStructure>;
StructuresClassesMap.set(
  StructureKind.JsxSpreadAttribute,
  JsxSpreadAttributeImpl,
);
