//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type JsxAttributeStructure,
  type JsxNamespacedNameStructure,
  OptionalKind,
  StructureKind,
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
    if (source.name) {
      target.name = source.name;
    }

    if (source.initializer) {
      target.initializer = source.initializer;
    }
  }

  public static clone(
    source: OptionalKind<JsxAttributeStructure>,
  ): JsxAttributeImpl {
    const target = new JsxAttributeImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): JsxAttributeStructure {
    const rv = super.toJSON() as JsxAttributeStructure;
    if (this.initializer) {
      rv.initializer = this.initializer;
    }

    rv.kind = this.kind;
    rv.name = this.name;
    return rv;
  }
}

JsxAttributeImpl satisfies CloneableStructure<
  JsxAttributeStructure,
  JsxAttributeImpl
>;
StructuresClassesMap.set(StructureKind.JsxAttribute, JsxAttributeImpl);
