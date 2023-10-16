//#region preamble
import {
  COPY_FIELDS,
  type PreferArrayFields,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  type RightExtendsLeft,
  StructureBase,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type {
  InitializerExpressionableNodeStructure,
  Structures,
} from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const InitializerExpressionableNodeStructureKey: unique symbol;
export type InitializerExpressionableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof InitializerExpressionableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: RequiredOmit<
      PreferArrayFields<InitializerExpressionableNodeStructure>,
      "initializer"
    >;
    symbolKey: typeof InitializerExpressionableNodeStructureKey;
  }
>;

export default function InitializerExpressionableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  InitializerExpressionableNodeStructureFields["staticFields"],
  InitializerExpressionableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class InitializerExpressionableNodeStructureMixin extends baseClass {
    initializer?: stringOrWriter = undefined;

    public static [COPY_FIELDS](
      source: InitializerExpressionableNodeStructure & Structures,
      target: InitializerExpressionableNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.initializer) {
        target.initializer = source.initializer;
      }
    }

    public toJSON(): Jsonify<InitializerExpressionableNodeStructure> {
      const rv = super.toJSON() as InitializerExpressionableNodeStructure;
      if (this.initializer) {
        rv.initializer = StructureBase[REPLACE_WRITER_WITH_STRING](
          this.initializer,
        );
      }

      return rv;
    }
  }

  return InitializerExpressionableNodeStructureMixin;
}

InitializerExpressionableNodeStructureMixin satisfies SubclassDecorator<
  InitializerExpressionableNodeStructureFields,
  typeof StructureBase,
  false
>;
