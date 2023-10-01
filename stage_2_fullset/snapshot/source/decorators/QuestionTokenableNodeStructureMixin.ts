//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { QuestionTokenableNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const QuestionTokenableNodeStructureKey: unique symbol;
export type QuestionTokenableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof QuestionTokenableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: QuestionTokenableNodeStructure;
    symbolKey: typeof QuestionTokenableNodeStructureKey;
  }
>;

export default function QuestionTokenableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  QuestionTokenableNodeStructureFields["staticFields"],
  QuestionTokenableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class QuestionTokenableNodeStructureMixin extends baseClass {
    hasQuestionToken = false;

    public static copyFields(
      source: QuestionTokenableNodeStructure & Structures,
      target: QuestionTokenableNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      target.hasQuestionToken = source.hasQuestionToken ?? false;
    }
  }

  return QuestionTokenableNodeStructureMixin;
}

QuestionTokenableNodeStructureMixin satisfies SubclassDecorator<
  QuestionTokenableNodeStructureFields,
  typeof StructureBase,
  false
>;
