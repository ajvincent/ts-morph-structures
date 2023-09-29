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
    instanceFields: Required<QuestionTokenableNodeStructure>;
    symbolKey: typeof QuestionTokenableNodeStructureKey;
  }
>;

export default function QuestionTokenableNode(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  QuestionTokenableNodeStructureFields["staticFields"],
  QuestionTokenableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class QuestionTokenableNodeMixin extends baseClass {
    hasQuestionToken = false;

    public static copyFields(
      source: QuestionTokenableNodeStructure & Structures,
      target: Required<QuestionTokenableNodeMixin> & Structures,
    ): void {
      super.copyFields(source, target);
      target.hasQuestionToken = source.hasQuestionToken ?? false;
    }
  }

  return QuestionTokenableNodeMixin;
}

QuestionTokenableNode satisfies SubclassDecorator<
  QuestionTokenableNodeStructureFields,
  typeof StructureBase,
  false
>;
