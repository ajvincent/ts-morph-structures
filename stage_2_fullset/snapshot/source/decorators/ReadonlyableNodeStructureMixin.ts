//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { ReadonlyableNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const ReadonlyableNodeStructureKey: unique symbol;
export type ReadonlyableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ReadonlyableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: Required<ReadonlyableNodeStructure>;
    symbolKey: typeof ReadonlyableNodeStructureKey;
  }
>;

export default function ReadonlyableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  ReadonlyableNodeStructureFields["staticFields"],
  ReadonlyableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class ReadonlyableNodeStructureMixin extends baseClass {
    isReadonly = false;

    public static copyFields(
      source: ReadonlyableNodeStructure & Structures,
      target: Required<ReadonlyableNodeStructureMixin> & Structures,
    ): void {
      super.copyFields(source, target);
      target.isReadonly = source.isReadonly ?? false;
    }
  }

  return ReadonlyableNodeStructureMixin;
}

ReadonlyableNodeStructureMixin satisfies SubclassDecorator<
  ReadonlyableNodeStructureFields,
  typeof StructureBase,
  false
>;
