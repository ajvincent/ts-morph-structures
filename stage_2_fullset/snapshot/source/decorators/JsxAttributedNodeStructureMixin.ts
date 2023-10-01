//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type {
  JsxAttributedNodeStructure,
  JsxAttributeStructure,
  JsxSpreadAttributeStructure,
  Structures,
} from "ts-morph";
//#endregion preamble
declare const JsxAttributedNodeStructureKey: unique symbol;
export type JsxAttributedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof JsxAttributedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: JsxAttributedNodeStructure;
    symbolKey: typeof JsxAttributedNodeStructureKey;
  }
>;

export default function JsxAttributedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  JsxAttributedNodeStructureFields["staticFields"],
  JsxAttributedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class JsxAttributedNodeStructureMixin extends baseClass {
    attributes: (JsxAttributeStructure | JsxSpreadAttributeStructure)[] = [];

    public static copyFields(
      source: JsxAttributedNodeStructure & Structures,
      target: JsxAttributedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
    }
  }

  return JsxAttributedNodeStructureMixin;
}

JsxAttributedNodeStructureMixin satisfies SubclassDecorator<
  JsxAttributedNodeStructureFields,
  typeof StructureBase,
  false
>;
