//#region preamble
import {
  COPY_FIELDS,
  type PreferArrayFields,
  type RequiredOmit,
  type RightExtendsLeft,
  StructureBase,
} from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { ReadonlyableNodeStructure, Structures } from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const ReadonlyableNodeStructureKey: unique symbol;
export type ReadonlyableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ReadonlyableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: RequiredOmit<PreferArrayFields<ReadonlyableNodeStructure>>;
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

    public static [COPY_FIELDS](
      source: ReadonlyableNodeStructure & Structures,
      target: ReadonlyableNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      target.isReadonly = source.isReadonly ?? false;
    }

    public toJSON(): Jsonify<ReadonlyableNodeStructure> {
      const rv = super.toJSON() as ReadonlyableNodeStructure;
      rv.isReadonly = this.isReadonly;
      return rv;
    }
  }

  return ReadonlyableNodeStructureMixin;
}

ReadonlyableNodeStructureMixin satisfies SubclassDecorator<
  ReadonlyableNodeStructureFields,
  typeof StructureBase,
  false
>;
