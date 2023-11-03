//#region preamble
import type { StatementStructureImpls } from "../exports.js";
import {
  COPY_FIELDS,
  type PreferArrayFields,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  type RightExtendsLeft,
  StructureBase,
  StructuresClassesMap,
} from "../internal-exports.js";
import type { stringOrWriterFunction } from "../types/stringOrWriterFunction.js";
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
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const StatementedNodeStructureKey: unique symbol;
export type StatementedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof StatementedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: RequiredOmit<PreferArrayFields<StatementedNodeStructure>>;
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
    readonly statements: (stringOrWriterFunction | StatementStructureImpls)[] =
      [];

    public static [COPY_FIELDS](
      source: StatementedNodeStructure & Structures,
      target: StatementedNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);

      let statementsArray: (
        | stringOrWriterFunction
        | StatementStructureImpls
      )[] = [];
      if (Array.isArray(source.statements)) {
        statementsArray = source.statements as (
          | stringOrWriterFunction
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
      source: stringOrWriterFunction | StatementStructures,
    ): stringOrWriterFunction | StatementStructureImpls {
      if (typeof source !== "object") {
        return source;
      }
      return StructuresClassesMap.clone(source) as StatementStructureImpls;
    }

    public toJSON(): Jsonify<StatementedNodeStructure> {
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
