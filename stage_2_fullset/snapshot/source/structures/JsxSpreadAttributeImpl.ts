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
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type JsxSpreadAttributeStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const JsxSpreadAttributeStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class JsxSpreadAttributeImpl
  extends JsxSpreadAttributeStructureBase
  implements RequiredOmit<PreferArrayFields<JsxSpreadAttributeStructure>>
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

  public toJSON(): StructureClassToJSON<JsxSpreadAttributeImpl> {
    const rv = super.toJSON() as StructureClassToJSON<JsxSpreadAttributeImpl>;
    rv.expression = this.expression;
    rv.kind = this.kind;
    return rv;
  }
}

JsxSpreadAttributeImpl satisfies CloneableStructure<
  JsxSpreadAttributeStructure,
  JsxSpreadAttributeImpl
> &
  Class<ExtractStructure<JsxSpreadAttributeStructure["kind"]>>;
StructuresClassesMap.set(
  StructureKind.JsxSpreadAttribute,
  JsxSpreadAttributeImpl,
);
