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
  type ExtractStructure,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type PreferArrayFields,
  type RequiredOmit,
  StructureBase,
  type StructureClassToJSON,
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
import type { Class } from "type-fest";
//#endregion preamble
const JsxElementStructureBase = MultiMixinBuilder<
  [NamedNodeStructureFields, StructureFields],
  typeof StructureBase
>([NamedNodeStructureMixin, StructureMixin], StructureBase);

export default class JsxElementImpl
  extends JsxElementStructureBase
  implements RequiredOmit<PreferArrayFields<JsxElementStructure>, "bodyText">
{
  readonly kind: StructureKind.JsxElement = StructureKind.JsxElement;
  readonly attributes: (JsxAttributeImpl | JsxSpreadAttributeImpl)[] = [];
  bodyText?: string = undefined;
  readonly children: (JsxElementImpl | JsxSelfClosingElementImpl)[] = [];

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

    if (source.bodyText) {
      target.bodyText = source.bodyText;
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
  }

  public static clone(
    source: OptionalKind<JsxElementStructure>,
  ): JsxElementImpl {
    const target = new JsxElementImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<JsxElementImpl> {
    const rv = super.toJSON() as StructureClassToJSON<JsxElementImpl>;
    rv.attributes = this.attributes;
    if (this.bodyText) {
      rv.bodyText = this.bodyText;
    } else {
      rv.bodyText = undefined;
    }

    rv.children = this.children;
    rv.kind = this.kind;
    return rv;
  }
}

JsxElementImpl satisfies CloneableStructure<
  JsxElementStructure,
  JsxElementImpl
> &
  Class<ExtractStructure<JsxElementStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.JsxElement, JsxElementImpl);
