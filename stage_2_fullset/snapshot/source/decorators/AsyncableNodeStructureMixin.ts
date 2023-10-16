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
import type { AsyncableNodeStructure, Structures } from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const AsyncableNodeStructureKey: unique symbol;
export type AsyncableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof AsyncableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: RequiredOmit<PreferArrayFields<AsyncableNodeStructure>>;
    symbolKey: typeof AsyncableNodeStructureKey;
  }
>;

export default function AsyncableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  AsyncableNodeStructureFields["staticFields"],
  AsyncableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class AsyncableNodeStructureMixin extends baseClass {
    isAsync = false;

    public static [COPY_FIELDS](
      source: AsyncableNodeStructure & Structures,
      target: AsyncableNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      target.isAsync = source.isAsync ?? false;
    }

    public toJSON(): Jsonify<AsyncableNodeStructure> {
      const rv = super.toJSON() as AsyncableNodeStructure;
      rv.isAsync = this.isAsync;
      return rv;
    }
  }

  return AsyncableNodeStructureMixin;
}

AsyncableNodeStructureMixin satisfies SubclassDecorator<
  AsyncableNodeStructureFields,
  typeof StructureBase,
  false
>;
