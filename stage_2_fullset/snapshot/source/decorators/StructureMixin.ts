//#region preamble
import {
  COPY_FIELDS,
  type PreferArrayFields,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  type RightExtendsLeft,
  StructureBase,
} from "../internal-exports.js";
import type { stringOrWriterFunction } from "../types/stringOrWriterFunction.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { Structure, Structures } from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const StructureKey: unique symbol;
export type StructureFields = RightExtendsLeft<
  StaticAndInstance<typeof StructureKey>,
  {
    staticFields: object;
    instanceFields: RequiredOmit<PreferArrayFields<Structure>>;
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
    readonly leadingTrivia: stringOrWriterFunction[] = [];
    readonly trailingTrivia: stringOrWriterFunction[] = [];

    public static [COPY_FIELDS](
      source: Structure & Structures,
      target: StructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (Array.isArray(source.leadingTrivia)) {
        target.leadingTrivia.push(...source.leadingTrivia);
      } else if (source.leadingTrivia !== undefined) {
        target.leadingTrivia.push(source.leadingTrivia);
      }

      if (Array.isArray(source.trailingTrivia)) {
        target.trailingTrivia.push(...source.trailingTrivia);
      } else if (source.trailingTrivia !== undefined) {
        target.trailingTrivia.push(source.trailingTrivia);
      }
    }

    public toJSON(): Jsonify<Structure> {
      const rv = super.toJSON() as Structure;
      rv.leadingTrivia = this.leadingTrivia.map((value) => {
        return StructureBase[REPLACE_WRITER_WITH_STRING](value);
      });
      rv.trailingTrivia = this.trailingTrivia.map((value) => {
        return StructureBase[REPLACE_WRITER_WITH_STRING](value);
      });
      return rv;
    }
  }

  return StructureMixin;
}

StructureMixin satisfies SubclassDecorator<
  StructureFields,
  typeof StructureBase,
  false
>;
