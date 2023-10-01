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
    instanceFields: StaticableNodeStructure;
    symbolKey: typeof StaticableNodeStructureKey;
  }
>;

export default function StaticableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  StaticableNodeStructureFields["staticFields"],
  StaticableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class StaticableNodeStructureMixin extends baseClass {
    isStatic = false;

    public static copyFields(
      source: StaticableNodeStructure & Structures,
      target: StaticableNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      target.isStatic = source.isStatic ?? false;
    }
  }

  return StaticableNodeStructureMixin;
}

StaticableNodeStructureMixin satisfies SubclassDecorator<
  StaticableNodeStructureFields,
  typeof StructureBase,
  false
>;
