//#region preamble
import { ParameterDeclarationImpl } from "../exports.js";
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
  type OptionalKind,
  type ParameterDeclarationStructure,
  type ParameteredNodeStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
declare const ParameteredNodeStructureKey: unique symbol;
export type ParameteredNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ParameteredNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: ParameteredNodeStructure;
    symbolKey: typeof ParameteredNodeStructureKey;
  }
>;

export default function ParameteredNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  ParameteredNodeStructureFields["staticFields"],
  ParameteredNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class ParameteredNodeStructureMixin extends baseClass {
    readonly parameters: ParameterDeclarationImpl[] = [];

    public static [COPY_FIELDS](
      source: ParameteredNodeStructure & Structures,
      target: ParameteredNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.parameters) {
        target.parameters.push(
          ...cloneStructureArray<
            OptionalKind<ParameterDeclarationStructure>,
            StructureKind.Parameter,
            ParameterDeclarationImpl
          >(source.parameters, StructureKind.Parameter),
        );
      }
    }

    public toJSON(): Jsonify<ParameteredNodeStructure> {
      const rv = super.toJSON() as ParameteredNodeStructure;
      rv.parameters = this.parameters;
      return rv;
    }
  }

  return ParameteredNodeStructureMixin;
}

ParameteredNodeStructureMixin satisfies SubclassDecorator<
  ParameteredNodeStructureFields,
  typeof StructureBase,
  false
>;
