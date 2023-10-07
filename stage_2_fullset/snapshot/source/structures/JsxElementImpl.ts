//#region preamble
import {
  JsxAttributeImpl,
  JsxSelfClosingElementImpl,
  JsxSpreadAttributeImpl,
} from "../exports.js";
import {
  type CloneableStructure,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type JsxElementStructure,
  OptionalKind,
  StructureKind,
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
  attributes: (JsxAttributeImpl | JsxSpreadAttributeImpl)[] = [];
  children: (JsxElementImpl | JsxSelfClosingElementImpl)[] = [];
  name = "";
  bodyText?: string = undefined;

  public static copyFields(
    source: OptionalKind<JsxElementStructure>,
    target: JsxElementImpl,
  ): void {
    super.copyFields(source, target);
    if (source.name) {
      target.name = source.name;
    }

    if (source.bodyText) {
      target.bodyText = source.bodyText;
    }
  }

  public static clone(
    source: OptionalKind<JsxElementStructure>,
  ): JsxElementImpl {
    const target = new JsxElementImpl();
    this.copyFields(source, target);
    return target;
  }
}

JsxElementImpl satisfies CloneableStructure<JsxElementStructure>;
StructuresClassesMap.set(StructureKind.JsxElement, JsxElementImpl);
