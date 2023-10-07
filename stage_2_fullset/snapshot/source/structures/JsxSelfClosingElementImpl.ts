//#region preamble
import {
  type CloneableStructure,
  type JsxAttributedNodeStructureFields,
  JsxAttributedNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type JsxSelfClosingElementStructure,
  OptionalKind,
  StructureKind,
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
    source: OptionalKind<JsxSelfClosingElementStructure>,
    target: JsxSelfClosingElementImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<JsxSelfClosingElementStructure>,
  ): JsxSelfClosingElementImpl {
    const target = new JsxSelfClosingElementImpl();
    this.copyFields(source, target);
    return target;
  }
}

JsxSelfClosingElementImpl satisfies CloneableStructure<JsxSelfClosingElementStructure>;
StructuresClassesMap.set(
  StructureKind.JsxSelfClosingElement,
  JsxSelfClosingElementImpl,
);
