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
import type { Structures, TypedNodeStructure } from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const TypedNodeStructureKey: unique symbol;
export type TypedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof TypedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: RequiredOmit<PreferArrayFields<TypedNodeStructure>, "type">;
    symbolKey: typeof TypedNodeStructureKey;
  }
>;

export default function TypedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  TypedNodeStructureFields["staticFields"],
  TypedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class TypedNodeStructureMixin extends baseClass {
    type?: stringOrWriterFunction = undefined;

    public static [COPY_FIELDS](
      source: TypedNodeStructure & Structures,
      target: TypedNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.type) {
        target.type = source.type;
      }
    }

    public toJSON(): Jsonify<TypedNodeStructure> {
      const rv = super.toJSON() as TypedNodeStructure;
      if (this.type) {
        rv.type = StructureBase[REPLACE_WRITER_WITH_STRING](this.type);
      }

      return rv;
    }
  }

  return TypedNodeStructureMixin;
}

TypedNodeStructureMixin satisfies SubclassDecorator<
  TypedNodeStructureFields,
  typeof StructureBase,
  false
>;
