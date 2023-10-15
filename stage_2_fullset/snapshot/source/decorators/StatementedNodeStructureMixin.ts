//#region preamble
import type { StatementStructureImpls } from "../exports.js";
import {
  COPY_FIELDS,
  REPLACE_WRITER_WITH_STRING,
  type RightExtendsLeft,
  StructureBase,
  StructuresClassesMap,
} from "../internal-exports.js";
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
    readonly statements: (stringOrWriter | StatementStructureImpls)[] = [];

    public static [COPY_FIELDS](
      source: StatementedNodeStructure & Structures,
      target: StatementedNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);

      let statementsArray: (stringOrWriter | StatementStructureImpls)[] = [];
      if (Array.isArray(source.statements)) {
        statementsArray = source.statements as (
          | stringOrWriter
          | StatementStructureImpls
        )[];
      } else if (source.statements !== undefined) {
        statementsArray = [source.statements];
      }
      target.statements.push(
        ...statementsArray.map((statement) => this.#cloneStatement(statement)),
      );
    }

    static #cloneStatement(
      source: stringOrWriter | StatementStructures,
    ): stringOrWriter | StatementStructureImpls {
      if (typeof source !== "object") {
        return source;
      }
      return StructuresClassesMap.clone(source) as StatementStructureImpls;
    }

    public toJSON(): StatementedNodeStructure {
      const rv = super.toJSON() as StatementedNodeStructure;
      rv.statements = this.statements.map((value) => {
        if (typeof value === "object") {
          return value;
        }
        return StructureBase[REPLACE_WRITER_WITH_STRING](value);
      });
      return rv;
    }
  }

  return StatementedNodeStructureMixin;
}

StatementedNodeStructureMixin satisfies SubclassDecorator<
  StatementedNodeStructureFields,
  typeof StructureBase,
  false
>;
