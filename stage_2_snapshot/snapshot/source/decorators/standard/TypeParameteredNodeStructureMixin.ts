//#region preamble
import {
  TypeParameterDeclarationImpl,
  type TypeParameteredNodeStructureClassIfc,
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
    instanceFields: TypeParameteredNodeStructureClassIfc;
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

    /** @internal */
    public static [COPY_FIELDS](
      source: TypeParameteredNodeStructure & Structures,
      target: TypeParameteredNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.typeParameters) {
        target.typeParameters.push(
          ...StructuresClassesMap.cloneArrayWithKind<
            TypeParameterDeclarationStructure,
            StructureKind.TypeParameter,
            string | TypeParameterDeclarationImpl
          >(
            StructureKind.TypeParameter,
            StructuresClassesMap.forceArray(source.typeParameters),
          ),
        );
      }
    }

    public toJSON(): StructureClassToJSON<TypeParameteredNodeStructureMixin> {
      const rv =
        super.toJSON() as StructureClassToJSON<TypeParameteredNodeStructureMixin>;
      rv.typeParameters = this.typeParameters;
      return rv;
    }
  }

  return TypeParameteredNodeStructureMixin;
}

TypeParameteredNodeStructureMixin satisfies SubclassDecorator<
  TypeParameteredNodeStructureFields,
  typeof StructureBase,
  false
>;
