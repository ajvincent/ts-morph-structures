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
import type { OverrideableNodeStructure, Structures } from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const OverrideableNodeStructureKey: unique symbol;
export type OverrideableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof OverrideableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: RequiredOmit<PreferArrayFields<OverrideableNodeStructure>>;
    symbolKey: typeof OverrideableNodeStructureKey;
  }
>;

export default function OverrideableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  OverrideableNodeStructureFields["staticFields"],
  OverrideableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class OverrideableNodeStructureMixin extends baseClass {
    hasOverrideKeyword = false;

    public static [COPY_FIELDS](
      source: OverrideableNodeStructure & Structures,
      target: OverrideableNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      target.hasOverrideKeyword = source.hasOverrideKeyword ?? false;
    }

    public toJSON(): Jsonify<OverrideableNodeStructure> {
      const rv = super.toJSON() as OverrideableNodeStructure;
      rv.hasOverrideKeyword = this.hasOverrideKeyword;
      return rv;
    }
  }

  return OverrideableNodeStructureMixin;
}

OverrideableNodeStructureMixin satisfies SubclassDecorator<
  OverrideableNodeStructureFields,
  typeof StructureBase,
  false
>;
