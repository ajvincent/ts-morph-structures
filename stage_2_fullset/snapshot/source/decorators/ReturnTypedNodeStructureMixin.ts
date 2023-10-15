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
import type { ReturnTypedNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const ReturnTypedNodeStructureKey: unique symbol;
export type ReturnTypedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ReturnTypedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: ReturnTypedNodeStructure;
    symbolKey: typeof ReturnTypedNodeStructureKey;
  }
>;

export default function ReturnTypedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  ReturnTypedNodeStructureFields["staticFields"],
  ReturnTypedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class ReturnTypedNodeStructureMixin extends baseClass {
    returnType?: stringOrWriter = undefined;

    public static [COPY_FIELDS](
      source: ReturnTypedNodeStructure & Structures,
      target: ReturnTypedNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.returnType) {
        target.returnType = source.returnType;
      }
    }

    public toJSON(): ReturnTypedNodeStructure {
      const rv = super.toJSON() as ReturnTypedNodeStructure;
      if (this.returnType) {
        rv.returnType = this.returnType;
      }

      return rv;
    }
  }

  return ReturnTypedNodeStructureMixin;
}

ReturnTypedNodeStructureMixin satisfies SubclassDecorator<
  ReturnTypedNodeStructureFields,
  typeof StructureBase,
  false
>;
