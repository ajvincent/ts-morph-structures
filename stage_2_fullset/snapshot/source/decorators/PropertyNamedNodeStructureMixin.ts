//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { PropertyNamedNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const PropertyNamedNodeStructureKey: unique symbol;
export type PropertyNamedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof PropertyNamedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: PropertyNamedNodeStructure;
    symbolKey: typeof PropertyNamedNodeStructureKey;
  }
>;

export default function PropertyNamedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  PropertyNamedNodeStructureFields["staticFields"],
  PropertyNamedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class PropertyNamedNodeStructureMixin extends baseClass {
    name = "";

    public static copyFields(
      source: PropertyNamedNodeStructure & Structures,
      target: PropertyNamedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.name) {
        target.name = source.name;
      }
    }
  }

  return PropertyNamedNodeStructureMixin;
}

PropertyNamedNodeStructureMixin satisfies SubclassDecorator<
  PropertyNamedNodeStructureFields,
  typeof StructureBase,
  false
>;
