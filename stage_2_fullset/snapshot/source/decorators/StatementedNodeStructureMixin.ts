//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type {
  StatementedNodeStructure,
  StatementStructures,
  Structures,
} from "ts-morph";
//#endregion preamble
declare const StatementedNodeStructureKey: unique symbol;
export type StatementedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof StatementedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: StatementedNodeStructure;
    symbolKey: typeof StatementedNodeStructureKey;
  }
>;

export default function StatementedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  StatementedNodeStructureFields["staticFields"],
  StatementedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class StatementedNodeStructureMixin extends baseClass {
    statements: (stringOrWriter | StatementStructures)[] = [];

    public static copyFields(
      source: StatementedNodeStructure & Structures,
      target: StatementedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (Array.isArray(source.statements)) {
        target.statements = source.statements.slice();
      } else if (source.statements !== undefined) {
        target.statements = [source.statements];
      }
    }
  }

  return StatementedNodeStructureMixin;
}

StatementedNodeStructureMixin satisfies SubclassDecorator<
  StatementedNodeStructureFields,
  typeof StructureBase,
  false
>;
