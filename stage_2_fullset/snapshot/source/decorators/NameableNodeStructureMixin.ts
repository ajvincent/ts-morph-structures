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
import type { NameableNodeStructure, Structures } from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const NameableNodeStructureKey: unique symbol;
export type NameableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof NameableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: RequiredOmit<
      PreferArrayFields<NameableNodeStructure>,
      "name"
    >;
    symbolKey: typeof NameableNodeStructureKey;
  }
>;

export default function NameableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  NameableNodeStructureFields["staticFields"],
  NameableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class NameableNodeStructureMixin extends baseClass {
    name?: string = undefined;

    public static [COPY_FIELDS](
      source: NameableNodeStructure & Structures,
      target: NameableNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.name) {
        target.name = source.name;
      }
    }

    public toJSON(): Jsonify<NameableNodeStructure> {
      const rv = super.toJSON() as NameableNodeStructure;
      if (this.name) {
        rv.name = this.name;
      }

      return rv;
    }
  }

  return NameableNodeStructureMixin;
}

NameableNodeStructureMixin satisfies SubclassDecorator<
  NameableNodeStructureFields,
  typeof StructureBase,
  false
>;
