//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { JsxTagNamedNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const JsxTagNamedNodeStructureKey: unique symbol;
export type JsxTagNamedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof JsxTagNamedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: JsxTagNamedNodeStructure;
    symbolKey: typeof JsxTagNamedNodeStructureKey;
  }
>;

export default function JsxTagNamedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  JsxTagNamedNodeStructureFields["staticFields"],
  JsxTagNamedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class JsxTagNamedNodeStructureMixin extends baseClass {
    name: string = "";

    public static copyFields(
      source: JsxTagNamedNodeStructure & Structures,
      target: JsxTagNamedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.name) {
        target.name = source.name;
      }
    }
  }

  return JsxTagNamedNodeStructureMixin;
}

JsxTagNamedNodeStructureMixin satisfies SubclassDecorator<
  JsxTagNamedNodeStructureFields,
  typeof StructureBase,
  false
>;
