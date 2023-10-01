//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { ImplementsClauseableNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const ImplementsClauseableNodeStructureKey: unique symbol;
export type ImplementsClauseableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ImplementsClauseableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: ImplementsClauseableNodeStructure;
    symbolKey: typeof ImplementsClauseableNodeStructureKey;
  }
>;

export default function ImplementsClauseableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  ImplementsClauseableNodeStructureFields["staticFields"],
  ImplementsClauseableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class ImplementsClauseableNodeStructureMixin extends baseClass {
    implements: stringOrWriter[] = [];

    public static copyFields(
      source: ImplementsClauseableNodeStructure & Structures,
      target: ImplementsClauseableNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (Array.isArray(source.implements)) {
        target.implements = source.implements.slice();
      } else if (source.implements !== undefined) {
        target.implements = [source.implements];
      }
    }
  }

  return ImplementsClauseableNodeStructureMixin;
}

ImplementsClauseableNodeStructureMixin satisfies SubclassDecorator<
  ImplementsClauseableNodeStructureFields,
  typeof StructureBase,
  false
>;
