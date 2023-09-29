//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { AbstractableNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const AbstractableNodeStructureKey: unique symbol;
export type AbstractableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof AbstractableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: Required<AbstractableNodeStructure>;
    symbolKey: typeof AbstractableNodeStructureKey;
  }
>;

export default function AbstractableNode(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  AbstractableNodeStructureFields["staticFields"],
  AbstractableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class AbstractableNodeMixin extends baseClass {
    isAbstract = false;

    public static copyFields(
      source: AbstractableNodeStructure & Structures,
      target: Required<AbstractableNodeMixin> & Structures,
    ): void {
      super.copyFields(source, target);
      target.isAbstract = source.isAbstract ?? false;
    }
  }

  return AbstractableNodeMixin;
}

AbstractableNode satisfies SubclassDecorator<
  AbstractableNodeStructureFields,
  typeof StructureBase,
  false
>;
