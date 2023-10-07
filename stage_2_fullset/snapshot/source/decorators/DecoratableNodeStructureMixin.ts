//#region preamble
import { DecoratorImpl } from "../exports.js";
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { DecoratableNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const DecoratableNodeStructureKey: unique symbol;
export type DecoratableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof DecoratableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: DecoratableNodeStructure;
    symbolKey: typeof DecoratableNodeStructureKey;
  }
>;

export default function DecoratableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  DecoratableNodeStructureFields["staticFields"],
  DecoratableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class DecoratableNodeStructureMixin extends baseClass {
    decorators: DecoratorImpl[] = [];

    public static copyFields(
      source: DecoratableNodeStructure & Structures,
      target: DecoratableNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
    }
  }

  return DecoratableNodeStructureMixin;
}

DecoratableNodeStructureMixin satisfies SubclassDecorator<
  DecoratableNodeStructureFields,
  typeof StructureBase,
  false
>;
