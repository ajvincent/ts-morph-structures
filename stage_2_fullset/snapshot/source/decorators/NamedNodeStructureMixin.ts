//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { NamedNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const NamedNodeStructureKey: unique symbol;
export type NamedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof NamedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: NamedNodeStructure;
    symbolKey: typeof NamedNodeStructureKey;
  }
>;

export default function NamedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  NamedNodeStructureFields["staticFields"],
  NamedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class NamedNodeStructureMixin extends baseClass {
    name = "";

    public static copyFields(
      source: NamedNodeStructure & Structures,
      target: NamedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.name) {
        target.name = source.name;
      }
    }
  }

  return NamedNodeStructureMixin;
}

NamedNodeStructureMixin satisfies SubclassDecorator<
  NamedNodeStructureFields,
  typeof StructureBase,
  false
>;
