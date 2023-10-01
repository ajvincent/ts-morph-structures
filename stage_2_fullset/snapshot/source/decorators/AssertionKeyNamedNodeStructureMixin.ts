//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { AssertionKeyNamedNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const AssertionKeyNamedNodeStructureKey: unique symbol;
export type AssertionKeyNamedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof AssertionKeyNamedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: AssertionKeyNamedNodeStructure;
    symbolKey: typeof AssertionKeyNamedNodeStructureKey;
  }
>;

export default function AssertionKeyNamedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  AssertionKeyNamedNodeStructureFields["staticFields"],
  AssertionKeyNamedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class AssertionKeyNamedNodeStructureMixin extends baseClass {
    name: string = "";

    public static copyFields(
      source: AssertionKeyNamedNodeStructure & Structures,
      target: AssertionKeyNamedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.name) {
        target.name = source.name;
      }
    }
  }

  return AssertionKeyNamedNodeStructureMixin;
}

AssertionKeyNamedNodeStructureMixin satisfies SubclassDecorator<
  AssertionKeyNamedNodeStructureFields,
  typeof StructureBase,
  false
>;
