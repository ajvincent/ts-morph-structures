//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { Structure, Structures } from "ts-morph";
//#endregion preamble
declare const StructureKey: unique symbol;
export type StructureFields = RightExtendsLeft<
  StaticAndInstance<typeof StructureKey>,
  {
    staticFields: object;
    instanceFields: Structure;
    symbolKey: typeof StructureKey;
  }
>;

export default function StructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  StructureFields["staticFields"],
  StructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class StructureMixin extends baseClass {
    leadingTrivia: stringOrWriter[] = [];
    trailingTrivia: stringOrWriter[] = [];

    public static copyFields(
      source: Structure & Structures,
      target: StructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (Array.isArray(source.leadingTrivia)) {
        target.leadingTrivia = source.leadingTrivia.slice();
      } else if (source.leadingTrivia !== undefined) {
        target.leadingTrivia = [source.leadingTrivia];
      }

      if (Array.isArray(source.trailingTrivia)) {
        target.trailingTrivia = source.trailingTrivia.slice();
      } else if (source.trailingTrivia !== undefined) {
        target.trailingTrivia = [source.trailingTrivia];
      }
    }
  }

  return StructureMixin;
}

StructureMixin satisfies SubclassDecorator<
  StructureFields,
  typeof StructureBase,
  false
>;
