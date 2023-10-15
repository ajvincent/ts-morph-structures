//#region preamble
import {
  COPY_FIELDS,
  type RightExtendsLeft,
  StructureBase,
} from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { AbstractableNodeStructure, Structures } from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const AbstractableNodeStructureKey: unique symbol;
export type AbstractableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof AbstractableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: AbstractableNodeStructure;
    symbolKey: typeof AbstractableNodeStructureKey;
  }
>;

export default function AbstractableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  AbstractableNodeStructureFields["staticFields"],
  AbstractableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class AbstractableNodeStructureMixin extends baseClass {
    isAbstract = false;

    public static [COPY_FIELDS](
      source: AbstractableNodeStructure & Structures,
      target: AbstractableNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      target.isAbstract = source.isAbstract ?? false;
    }

    public toJSON(): Jsonify<AbstractableNodeStructure> {
      const rv = super.toJSON() as AbstractableNodeStructure;
      rv.isAbstract = this.isAbstract;
      return rv;
    }
  }

  return AbstractableNodeStructureMixin;
}

AbstractableNodeStructureMixin satisfies SubclassDecorator<
  AbstractableNodeStructureFields,
  typeof StructureBase,
  false
>;
