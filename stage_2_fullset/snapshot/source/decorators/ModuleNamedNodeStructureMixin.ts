//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { ModuleNamedNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const ModuleNamedNodeStructureKey: unique symbol;
export type ModuleNamedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ModuleNamedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: ModuleNamedNodeStructure;
    symbolKey: typeof ModuleNamedNodeStructureKey;
  }
>;

export default function ModuleNamedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  ModuleNamedNodeStructureFields["staticFields"],
  ModuleNamedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class ModuleNamedNodeStructureMixin extends baseClass {
    name = "";

    public static copyFields(
      source: ModuleNamedNodeStructure & Structures,
      target: ModuleNamedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.name) {
        target.name = source.name;
      }
    }
  }

  return ModuleNamedNodeStructureMixin;
}

ModuleNamedNodeStructureMixin satisfies SubclassDecorator<
  ModuleNamedNodeStructureFields,
  typeof StructureBase,
  false
>;
