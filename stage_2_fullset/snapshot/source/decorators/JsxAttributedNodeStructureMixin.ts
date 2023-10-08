//#region preamble
import { JsxAttributeImpl, JsxSpreadAttributeImpl } from "../exports.js";
import {
  cloneRequiredAndOptionalArray,
  type RightExtendsLeft,
  StructureBase,
} from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import {
  type JsxAttributedNodeStructure,
  type JsxAttributeStructure,
  type JsxSpreadAttributeStructure,
  type OptionalKind,
  StructureKind,
  type Structures,
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
    readonly attributes: (JsxAttributeImpl | JsxSpreadAttributeImpl)[] = [];

    public static copyFields(
      source: JsxAttributedNodeStructure & Structures,
      target: JsxAttributedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
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
  }

  return JsxAttributedNodeStructureMixin;
}

JsxAttributedNodeStructureMixin satisfies SubclassDecorator<
  JsxAttributedNodeStructureFields,
  typeof StructureBase,
  false
>;
