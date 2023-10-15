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
import { Scope, type ScopedNodeStructure, type Structures } from "ts-morph";
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

    public static [COPY_FIELDS](
      source: ScopedNodeStructure & Structures,
      target: ScopedNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.scope) {
        target.scope = source.scope;
      }
    }

    public toJSON(): ScopedNodeStructure {
      const rv = super.toJSON() as ScopedNodeStructure;
      if (this.scope) {
        rv.scope = this.scope;
      }

      return rv;
    }
  }

  return ScopedNodeStructureMixin;
}

ScopedNodeStructureMixin satisfies SubclassDecorator<
  ScopedNodeStructureFields,
  typeof StructureBase,
  false
>;
