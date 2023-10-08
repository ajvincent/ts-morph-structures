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
  name: string | JsxNamespacedNameStructure = "";
  initializer?: string = undefined;

  constructor(name: string | JsxNamespacedNameStructure) {
    super();
    this.name = name;
  }

  public static copyFields(
    source: OptionalKind<JsxAttributeStructure>,
    target: JsxAttributeImpl,
  ): void {
    super.copyFields(source, target);
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
    this.copyFields(source, target);
    return target;
  }
}

JsxAttributeImpl satisfies CloneableStructure<JsxAttributeStructure>;
StructuresClassesMap.set(StructureKind.JsxAttribute, JsxAttributeImpl);
