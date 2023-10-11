//#region preamble
import {
  COPY_FIELDS,
  type RightExtendsLeft,
  StructureBase,
} from "../internal-exports.js";
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
    /** When true, inserts a question mark (?) after the field name. */
    hasQuestionToken = false;

    public static [COPY_FIELDS](
      source: QuestionTokenableNodeStructure & Structures,
      target: QuestionTokenableNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
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
