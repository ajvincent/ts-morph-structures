//#region preamble
import type {
  StatementedNodeStructureClassIfc,
  StatementStructureImpls,
} from "../../exports.js";
import {
  COPY_FIELDS,
  REPLACE_WRITER_WITH_STRING,
  type RightExtendsLeft,
  StructureBase,
  StructureClassesMap,
  type StructureClassToJSON,
} from "../../internal-exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
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
    instanceFields: StatementedNodeStructureClassIfc;
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

    /** @internal */
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
        ...statementsArray.map((statement) =>
          StatementedNodeStructureMixin.#cloneStatement(statement),
        ),
      );
    }

    static #cloneStatement(
      source: stringOrWriterFunction | StatementStructures,
    ): stringOrWriterFunction | StatementStructureImpls {
      if (typeof source !== "object") {
        return source;
      }
      return StructureClassesMap.clone<
        StatementStructures,
        StatementStructureImpls
      >(source);
    }

    public toJSON(): StructureClassToJSON<StatementedNodeStructureMixin> {
      const rv =
        super.toJSON() as StructureClassToJSON<StatementedNodeStructureMixin>;
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
