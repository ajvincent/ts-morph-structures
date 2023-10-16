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
import type { NamedNodeStructure, Structures } from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const NamedNodeStructureKey: unique symbol;
export type NamedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof NamedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: RequiredOmit<PreferArrayFields<NamedNodeStructure>>;
    symbolKey: typeof NamedNodeStructureKey;
  }
>;

export default function NamedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  NamedNodeStructureFields["staticFields"],
  NamedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class NamedNodeStructureMixin extends baseClass {
    name = "";

    public static [COPY_FIELDS](
      source: NamedNodeStructure & Structures,
      target: NamedNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.name) {
        target.name = source.name;
      }
    }

    public toJSON(): Jsonify<NamedNodeStructure> {
      const rv = super.toJSON() as NamedNodeStructure;
      rv.name = this.name;
      return rv;
    }
  }

  return NamedNodeStructureMixin;
}

NamedNodeStructureMixin satisfies SubclassDecorator<
  NamedNodeStructureFields,
  typeof StructureBase,
  false
>;
