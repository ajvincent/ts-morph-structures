//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { ExpressionedNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const ExpressionedNodeStructureKey: unique symbol;
export type ExpressionedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ExpressionedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: ExpressionedNodeStructure;
    symbolKey: typeof ExpressionedNodeStructureKey;
  }
>;

export default function ExpressionedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  ExpressionedNodeStructureFields["staticFields"],
  ExpressionedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class ExpressionedNodeStructureMixin extends baseClass {
    expression: stringOrWriter = "";

    public static copyFields(
      source: ExpressionedNodeStructure & Structures,
      target: ExpressionedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.expression) {
        target.expression = source.expression;
      }
    }
  }

  return ExpressionedNodeStructureMixin;
}

ExpressionedNodeStructureMixin satisfies SubclassDecorator<
  ExpressionedNodeStructureFields,
  typeof StructureBase,
  false
>;
