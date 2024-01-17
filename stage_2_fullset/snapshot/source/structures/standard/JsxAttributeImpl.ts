//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  type PreferArrayFields,
  type RequiredOmit,
  StructureBase,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type JsxAttributeStructure,
  type JsxNamespacedNameStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const JsxAttributeStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JsxAttributeImpl
  extends JsxAttributeStructureBase
  implements
    RequiredOmit<PreferArrayFields<JsxAttributeStructure>, "initializer">
{
  readonly kind: StructureKind.JsxAttribute = StructureKind.JsxAttribute;
  initializer?: string = undefined;
  name: string | JsxNamespacedNameStructure = "";

  constructor(name: string | JsxNamespacedNameStructure) {
    super();
    this.name = name;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<JsxAttributeStructure>,
    target: JsxAttributeImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.initializer) {
      target.initializer = source.initializer;
    }

    if (source.name) {
      target.name = source.name;
    }
  }

  public static clone(
    source: OptionalKind<JsxAttributeStructure>,
  ): JsxAttributeImpl {
    const target = new JsxAttributeImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<JsxAttributeImpl> {
    const rv = super.toJSON() as StructureClassToJSON<JsxAttributeImpl>;
    if (this.initializer) {
      rv.initializer = this.initializer;
    } else {
      rv.initializer = undefined;
    }

    rv.kind = this.kind;
    rv.name = this.name;
    return rv;
  }
}

JsxAttributeImpl satisfies CloneableStructure<
  JsxAttributeStructure,
  JsxAttributeImpl
> &
  Class<ExtractStructure<JsxAttributeStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.JsxAttribute, JsxAttributeImpl);
