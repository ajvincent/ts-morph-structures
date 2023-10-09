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
  expression: string;

  constructor(expression: string) {
    super();
    this.expression = expression;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<JsxSpreadAttributeStructure>,
    target: JsxSpreadAttributeImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.expression) {
      target.expression = source.expression;
    }
  }

  public static clone(
    source: OptionalKind<JsxSpreadAttributeStructure>,
  ): JsxSpreadAttributeImpl {
    const target = new JsxSpreadAttributeImpl(source.expression);
    this[COPY_FIELDS](source, target);
    return target;
  }
}

JsxSpreadAttributeImpl satisfies CloneableStructure<
  JsxSpreadAttributeStructure,
  JsxSpreadAttributeImpl
>;
StructuresClassesMap.set(
  StructureKind.JsxSpreadAttribute,
  JsxSpreadAttributeImpl,
);
