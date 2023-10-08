//#region preamble
import { JSDocImpl } from "../exports.js";
import {
  cloneStructureOrStringArray,
  type RightExtendsLeft,
  StructureBase,
} from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import {
  type JSDocableNodeStructure,
  type JSDocStructure,
  type OptionalKind,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
declare const JSDocableNodeStructureKey: unique symbol;
export type JSDocableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof JSDocableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: JSDocableNodeStructure;
    symbolKey: typeof JSDocableNodeStructureKey;
  }
>;

export default function JSDocableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  JSDocableNodeStructureFields["staticFields"],
  JSDocableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class JSDocableNodeStructureMixin extends baseClass {
    readonly docs: (string | JSDocImpl)[] = [];

    public static copyFields(
      source: JSDocableNodeStructure & Structures,
      target: JSDocableNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.docs) {
        target.docs.push(
          ...cloneStructureOrStringArray<
            OptionalKind<JSDocStructure>,
            StructureKind.JSDoc,
            JSDocImpl
          >(source.docs, StructureKind.JSDoc),
        );
      }
    }
  }

  return JSDocableNodeStructureMixin;
}

JSDocableNodeStructureMixin satisfies SubclassDecorator<
  JSDocableNodeStructureFields,
  typeof StructureBase,
  false
>;
