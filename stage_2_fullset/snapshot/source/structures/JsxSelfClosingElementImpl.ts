//#region preamble
import { JsxAttributeImpl, JsxSpreadAttributeImpl } from "../exports.js";
import {
  type CloneableStructure,
  cloneRequiredAndOptionalArray,
  COPY_FIELDS,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type JsxAttributeStructure,
  type JsxSelfClosingElementStructure,
  type JsxSpreadAttributeStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const JsxSelfClosingElementStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class JsxSelfClosingElementImpl
  extends JsxSelfClosingElementStructureBase
  implements JsxSelfClosingElementStructure
{
  readonly kind: StructureKind.JsxSelfClosingElement =
    StructureKind.JsxSelfClosingElement;
  readonly attributes: (JsxAttributeImpl | JsxSpreadAttributeImpl)[] = [];

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<JsxSelfClosingElementStructure>,
    target: JsxSelfClosingElementImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.attributes) {
      target.attributes.push(
        ...cloneRequiredAndOptionalArray<
          JsxSpreadAttributeStructure,
          StructureKind.JsxSpreadAttribute,
          OptionalKind<JsxAttributeStructure>,
          StructureKind.JsxAttribute,
          JsxSpreadAttributeImpl,
          JsxAttributeImpl
        >(
          source.attributes,
          StructureKind.JsxSpreadAttribute,
          StructureKind.JsxAttribute,
        ),
      );
    }
  }

  public static clone(
    source: OptionalKind<JsxSelfClosingElementStructure>,
  ): JsxSelfClosingElementImpl {
    const target = new JsxSelfClosingElementImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }
}

JsxSelfClosingElementImpl satisfies CloneableStructure<JsxSelfClosingElementStructure>;
StructuresClassesMap.set(
  StructureKind.JsxSelfClosingElement,
  JsxSelfClosingElementImpl,
);
