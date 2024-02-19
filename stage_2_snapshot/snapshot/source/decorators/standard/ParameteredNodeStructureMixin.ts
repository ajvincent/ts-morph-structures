//#region preamble
import {
  ParameterDeclarationImpl,
  type ParameteredNodeStructureClassIfc,
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
  type ParameterDeclarationStructure,
  type ParameteredNodeStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
declare const ParameteredNodeStructureKey: unique symbol;
export type ParameteredNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof ParameteredNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: ParameteredNodeStructureClassIfc;
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

    /** @internal */
    public static [COPY_FIELDS](
      source: ParameteredNodeStructure & Structures,
      target: ParameteredNodeStructureMixin & Structures,
    ): void {
      super[COPY_FIELDS](source, target);
      if (source.parameters) {
        target.parameters.push(
          ...StructuresClassesMap.cloneArrayWithKind<
            ParameterDeclarationStructure,
            StructureKind.Parameter,
            ParameterDeclarationImpl
          >(
            StructureKind.Parameter,
            StructuresClassesMap.forceArray(source.parameters),
          ),
        );
      }
    }

    public toJSON(): StructureClassToJSON<ParameteredNodeStructureMixin> {
      const rv =
        super.toJSON() as StructureClassToJSON<ParameteredNodeStructureMixin>;
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
