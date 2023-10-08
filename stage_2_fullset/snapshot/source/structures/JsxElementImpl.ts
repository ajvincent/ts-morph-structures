//#region preamble
import {
  JsxAttributeImpl,
  JsxSelfClosingElementImpl,
  JsxSpreadAttributeImpl,
} from "../exports.js";
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
  type JsxElementStructure,
  type JsxSelfClosingElementStructure,
  type JsxSpreadAttributeStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const JsxElementStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class JsxElementImpl
  extends JsxElementStructureBase
  implements JsxElementStructure
{
  readonly kind: StructureKind.JsxElement = StructureKind.JsxElement;
  readonly attributes: (JsxAttributeImpl | JsxSpreadAttributeImpl)[] = [];
  readonly children: (JsxElementImpl | JsxSelfClosingElementImpl)[] = [];
  bodyText?: string = undefined;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<JsxElementStructure>,
    target: JsxElementImpl,
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

    if (source.children) {
      target.children.push(
        ...cloneRequiredAndOptionalArray<
          JsxSelfClosingElementStructure,
          StructureKind.JsxSelfClosingElement,
          OptionalKind<JsxElementStructure>,
          StructureKind.JsxElement,
          JsxSelfClosingElementImpl,
          JsxElementImpl
        >(
          source.children,
          StructureKind.JsxSelfClosingElement,
          StructureKind.JsxElement,
        ),
      );
    }

    if (source.bodyText) {
      target.bodyText = source.bodyText;
    }
  }

  public static clone(
    source: OptionalKind<JsxElementStructure>,
  ): JsxElementImpl {
    const target = new JsxElementImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }
}

JsxElementImpl satisfies CloneableStructure<JsxElementStructure>;
StructuresClassesMap.set(StructureKind.JsxElement, JsxElementImpl);
