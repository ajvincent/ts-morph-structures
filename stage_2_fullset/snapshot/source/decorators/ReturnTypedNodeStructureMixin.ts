//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
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

    public static copyFields(
      source: ReturnTypedNodeStructure & Structures,
      target: ReturnTypedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.returnType) {
        target.returnType = source.returnType;
      }
    }
  }

  return ReturnTypedNodeStructureMixin;
}

ReturnTypedNodeStructureMixin satisfies SubclassDecorator<
  ReturnTypedNodeStructureFields,
  typeof StructureBase,
  false
>;
