//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { StaticableNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const StaticableNodeStructureKey: unique symbol;
export type StaticableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof StaticableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: Required<StaticableNodeStructure>;
    symbolKey: typeof StaticableNodeStructureKey;
  }
>;

export default function StaticableNode(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  StaticableNodeStructureFields["staticFields"],
  StaticableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class StaticableNodeMixin extends baseClass {
    isStatic = false;

    public static copyFields(
      source: StaticableNodeStructure & Structures,
      target: Required<StaticableNodeMixin> & Structures,
    ): void {
      super.copyFields(source, target);
      target.isStatic = source.isStatic ?? false;
    }
  }

  return StaticableNodeMixin;
}

StaticableNode satisfies SubclassDecorator<
  StaticableNodeStructureFields,
  typeof StructureBase,
  false
>;
