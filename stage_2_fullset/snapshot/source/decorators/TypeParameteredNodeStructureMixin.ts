//#region preamble
import { TypeParameterDeclarationImpl } from "../exports.js";
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
  type OptionalKind,
  StructureKind,
  type Structures,
  type TypeParameterDeclarationStructure,
  type TypeParameteredNodeStructure,
} from "ts-morph";
//#endregion preamble
declare const TypeParameteredNodeStructureKey: unique symbol;
export type TypeParameteredNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof TypeParameteredNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: TypeParameteredNodeStructure;
    symbolKey: typeof TypeParameteredNodeStructureKey;
  }
>;

export default function TypeParameteredNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  TypeParameteredNodeStructureFields["staticFields"],
  TypeParameteredNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class TypeParameteredNodeStructureMixin extends baseClass {
    readonly typeParameters: (string | TypeParameterDeclarationImpl)[] = [];

    public static copyFields(
      source: TypeParameteredNodeStructure & Structures,
      target: TypeParameteredNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.typeParameters) {
        target.typeParameters.push(
          ...cloneStructureOrStringArray<
            OptionalKind<TypeParameterDeclarationStructure>,
            StructureKind.TypeParameter,
            TypeParameterDeclarationImpl
          >(source.typeParameters, StructureKind.TypeParameter),
        );
      }
    }
  }

  return TypeParameteredNodeStructureMixin;
}

TypeParameteredNodeStructureMixin satisfies SubclassDecorator<
  TypeParameteredNodeStructureFields,
  typeof StructureBase,
  false
>;
