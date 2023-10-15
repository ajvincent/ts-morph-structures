//#region preamble
import { DecoratorImpl } from "../exports.js";
import {
  cloneStructureArray,
  COPY_FIELDS,
  type RightExtendsLeft,
  StructureBase,
} from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import {
  type DecoratableNodeStructure,
  type DecoratorStructure,
  type OptionalKind,
  StructureKind,
  type Structures,
} from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const DecoratableNodeStructureKey: unique symbol;
export type DecoratableNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof DecoratableNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: DecoratableNodeStructure;
    symbolKey: typeof DecoratableNodeStructureKey;
  }
>;

export default function DecoratableNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  DecoratableNodeStructureFields["staticFields"],
  DecoratableNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class DecoratableNodeStructureMixin extends baseClass {
    readonly decorators: DecoratorImpl[] = [];

    public static [COPY_FIELDS](
      source: DecoratableNodeStructure & Structures,
      target: DecoratableNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.decorators) {
        target.decorators.push(
          ...cloneStructureArray<
            OptionalKind<DecoratorStructure>,
            StructureKind.Decorator,
            DecoratorImpl
          >(source.decorators, StructureKind.Decorator),
        );
      }
    }

    public toJSON(): Jsonify<DecoratableNodeStructure> {
      const rv = super.toJSON() as DecoratableNodeStructure;
      rv.decorators = this.decorators;
      return rv;
    }
  }

  return DecoratableNodeStructureMixin;
}

DecoratableNodeStructureMixin satisfies SubclassDecorator<
  DecoratableNodeStructureFields,
  typeof StructureBase,
  false
>;
