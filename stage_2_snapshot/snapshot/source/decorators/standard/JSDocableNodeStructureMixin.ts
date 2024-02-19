//#region preamble
import {
  type JSDocableNodeStructureClassIfc,
  JSDocImpl,
} from "../../exports.js";
import {
  COPY_FIELDS,
  type RightExtendsLeft,
  StructureBase,
  type StructureClassToJSON,
  StructuresClassesMap,
} from "../../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import {
  type JSDocableNodeStructure,
  type JSDocStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
declare const JSDocableNodeStructureKey: unique symbol;
export type JSDocableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof JSDocableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: JSDocableNodeStructureClassIfc;
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

    /** @internal */
    public static [COPY_FIELDS](
      source: JSDocableNodeStructure & Structures,
      target: JSDocableNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.docs) {
        target.docs.push(
          ...StructuresClassesMap.cloneArrayWithKind<
            JSDocStructure,
            StructureKind.JSDoc,
            string | JSDocImpl
          >(StructureKind.JSDoc, StructuresClassesMap.forceArray(source.docs)),
        );
      }
    }

    public toJSON(): StructureClassToJSON<JSDocableNodeStructureMixin> {
      const rv =
        super.toJSON() as StructureClassToJSON<JSDocableNodeStructureMixin>;
      rv.docs = this.docs;
      return rv;
    }
  }

  return JSDocableNodeStructureMixin;
}

JSDocableNodeStructureMixin satisfies SubclassDecorator<
  JSDocableNodeStructureFields,
  typeof StructureBase,
  false
>;
