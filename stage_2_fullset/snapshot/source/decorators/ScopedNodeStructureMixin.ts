//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { Scope, ScopedNodeStructure, Structures } from "ts-morph";
//#endregion preamble
declare const ScopedNodeStructureKey: unique symbol;
export type ScopedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ScopedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: ScopedNodeStructure;
    symbolKey: typeof ScopedNodeStructureKey;
  }
>;

export default function ScopedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  ScopedNodeStructureFields["staticFields"],
  ScopedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class ScopedNodeStructureMixin extends baseClass {
    scope?: Scope = undefined;

    public static copyFields(
      source: ScopedNodeStructure & Structures,
      target: ScopedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.scope) {
        target.scope = source.scope;
      }
    }
  }

  return ScopedNodeStructureMixin;
}

ScopedNodeStructureMixin satisfies SubclassDecorator<
  ScopedNodeStructureFields,
  typeof StructureBase,
  false
>;
