//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { ExtendsClauseableNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const ExtendsClauseableNodeStructureKey: unique symbol;
export type ExtendsClauseableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ExtendsClauseableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: ExtendsClauseableNodeStructure;
    symbolKey: typeof ExtendsClauseableNodeStructureKey;
  }
>;

export default function ExtendsClauseableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  ExtendsClauseableNodeStructureFields["staticFields"],
  ExtendsClauseableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class ExtendsClauseableNodeStructureMixin extends baseClass {
    extends: stringOrWriter[] = [];

    public static copyFields(
      source: ExtendsClauseableNodeStructure & Structures,
      target: ExtendsClauseableNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (Array.isArray(source.extends)) {
        target.extends = source.extends.slice();
      } else if (source.extends !== undefined) {
        target.extends = [source.extends];
      }
    }
  }

  return ExtendsClauseableNodeStructureMixin;
}

ExtendsClauseableNodeStructureMixin satisfies SubclassDecorator<
  ExtendsClauseableNodeStructureFields,
  typeof StructureBase,
  false
>;
