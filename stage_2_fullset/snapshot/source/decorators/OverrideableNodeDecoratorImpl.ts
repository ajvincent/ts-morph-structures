//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { OverrideableNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const OverrideableNodeStructureKey: unique symbol;
export type OverrideableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof OverrideableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: Required<OverrideableNodeStructure>;
    symbolKey: typeof OverrideableNodeStructureKey;
  }
>;

export default function OverrideableNode(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  OverrideableNodeStructureFields["staticFields"],
  OverrideableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class OverrideableNodeDecoratorImpl extends baseClass {
    hasOverrideKeyword = false;

    public static copyFields(
      source: OverrideableNodeStructure & Structures,
      target: Required<OverrideableNodeDecoratorImpl> & Structures,
    ): void {
      super.copyFields(source, target);
      target.hasOverrideKeyword = source.hasOverrideKeyword ?? false;
    }
  }

  return OverrideableNodeDecoratorImpl;
}

OverrideableNode satisfies SubclassDecorator<
  OverrideableNodeStructureFields,
  typeof StructureBase,
  false
>;
