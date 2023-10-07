//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { BindingNamedNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const BindingNamedNodeStructureKey: unique symbol;
export type BindingNamedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof BindingNamedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: BindingNamedNodeStructure;
    symbolKey: typeof BindingNamedNodeStructureKey;
  }
>;

export default function BindingNamedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  BindingNamedNodeStructureFields["staticFields"],
  BindingNamedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class BindingNamedNodeStructureMixin extends baseClass {
    name = "";

    public static copyFields(
      source: BindingNamedNodeStructure & Structures,
      target: BindingNamedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.name) {
        target.name = source.name;
      }
    }
  }

  return BindingNamedNodeStructureMixin;
}

BindingNamedNodeStructureMixin satisfies SubclassDecorator<
  BindingNamedNodeStructureFields,
  typeof StructureBase,
  false
>;
