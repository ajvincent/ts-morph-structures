//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type {
  InitializerExpressionableNodeStructure,
  Structures,
} from "ts-morph";
//#endregion preamble
declare const InitializerExpressionableNodeStructureKey: unique symbol;
export type InitializerExpressionableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof InitializerExpressionableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: InitializerExpressionableNodeStructure;
    symbolKey: typeof InitializerExpressionableNodeStructureKey;
  }
>;

export default function InitializerExpressionableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  InitializerExpressionableNodeStructureFields["staticFields"],
  InitializerExpressionableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class InitializerExpressionableNodeStructureMixin extends baseClass {
    initializer?: stringOrWriter = undefined;

    public static copyFields(
      source: InitializerExpressionableNodeStructure & Structures,
      target: InitializerExpressionableNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.initializer) {
        target.initializer = source.initializer;
      }
    }
  }

  return InitializerExpressionableNodeStructureMixin;
}

InitializerExpressionableNodeStructureMixin satisfies SubclassDecorator<
  InitializerExpressionableNodeStructureFields,
  typeof StructureBase,
  false
>;
