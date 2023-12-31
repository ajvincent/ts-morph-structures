//#region preamble
import {
  COPY_FIELDS,
  type PreferArrayFields,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  type RightExtendsLeft,
  StructureBase,
  type StructureClassToJSON,
} from "../internal-exports.js";
import type { stringOrWriterFunction } from "../types/stringOrWriterFunction.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type {
  InitializerExpressionableNodeStructure,
  Structures,
} from "ts-morph";
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
    initializer?: stringOrWriterFunction = undefined;

    public static [COPY_FIELDS](
      source: InitializerExpressionableNodeStructure & Structures,
      target: InitializerExpressionableNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.initializer) {
        target.initializer = source.initializer;
      }
    }

    public toJSON(): StructureClassToJSON<InitializerExpressionableNodeStructureMixin> {
      const rv =
        super.toJSON() as StructureClassToJSON<InitializerExpressionableNodeStructureMixin>;
      if (this.initializer) {
        rv.initializer = StructureBase[REPLACE_WRITER_WITH_STRING](
          this.initializer,
        );
      } else {
        rv.initializer = undefined;
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
