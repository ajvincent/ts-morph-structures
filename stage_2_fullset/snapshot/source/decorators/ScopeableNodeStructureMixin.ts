//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import { Scope, type ScopeableNodeStructure, type Structures } from "ts-morph";
//#endregion preamble
declare const ScopeableNodeStructureKey: unique symbol;
export type ScopeableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ScopeableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: ScopeableNodeStructure;
    symbolKey: typeof ScopeableNodeStructureKey;
  }
>;

export default function ScopeableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  ScopeableNodeStructureFields["staticFields"],
  ScopeableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class ScopeableNodeStructureMixin extends baseClass {
    scope?: Scope = undefined;

    public static copyFields(
      source: ScopeableNodeStructure & Structures,
      target: ScopeableNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.scope) {
        target.scope = source.scope;
      }
    }
  }

  return ScopeableNodeStructureMixin;
}

ScopeableNodeStructureMixin satisfies SubclassDecorator<
  ScopeableNodeStructureFields,
  typeof StructureBase,
  false
>;
