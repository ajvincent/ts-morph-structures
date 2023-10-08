//#region preamble
import {
  COPY_FIELDS,
  type RightExtendsLeft,
  StructureBase,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { Structures, TypedNodeStructure } from "ts-morph";
//#endregion preamble
declare const TypedNodeStructureKey: unique symbol;
export type TypedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof TypedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: TypedNodeStructure;
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
    type?: stringOrWriter = undefined;

    public static [COPY_FIELDS](
      source: TypedNodeStructure & Structures,
      target: TypedNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.type) {
        target.type = source.type;
      }
    }
  }

  return TypedNodeStructureMixin;
}

TypedNodeStructureMixin satisfies SubclassDecorator<
  TypedNodeStructureFields,
  typeof StructureBase,
  false
>;
