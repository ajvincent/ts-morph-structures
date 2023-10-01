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

export default function AbstractableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  AbstractableNodeStructureFields["staticFields"],
  AbstractableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class AbstractableNodeStructureMixin extends baseClass {
    isAbstract = false;

    public static copyFields(
      source: AbstractableNodeStructure & Structures,
      target: Required<AbstractableNodeStructureMixin> & Structures,
    ): void {
      super.copyFields(source, target);
      target.isAbstract = source.isAbstract ?? false;
    }
  }

  return AbstractableNodeStructureMixin;
}

AbstractableNodeStructureMixin satisfies SubclassDecorator<
  AbstractableNodeStructureFields,
  typeof StructureBase,
  false
>;
