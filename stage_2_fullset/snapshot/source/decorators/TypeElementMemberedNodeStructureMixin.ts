//#region preamble
import {
  CallSignatureDeclarationImpl,
  ConstructSignatureDeclarationImpl,
  IndexSignatureDeclarationImpl,
  MethodSignatureImpl,
  PropertySignatureImpl,
} from "../exports.js";
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type { Structures, TypeElementMemberedNodeStructure } from "ts-morph";
//#endregion preamble
declare const TypeElementMemberedNodeStructureKey: unique symbol;
export type TypeElementMemberedNodeStructureFields = RightExtendsLeft<
  StaticAndInstance<typeof TypeElementMemberedNodeStructureKey>,
  {
    staticFields: object;
    instanceFields: TypeElementMemberedNodeStructure;
    symbolKey: typeof TypeElementMemberedNodeStructureKey;
  }
>;

export default function TypeElementMemberedNodeStructureMixin(
  baseClass: typeof StructureBase,
  context: ClassDecoratorContext,
): MixinClass<
  TypeElementMemberedNodeStructureFields["staticFields"],
  TypeElementMemberedNodeStructureFields["instanceFields"],
  typeof StructureBase
> {
  void context;

  class TypeElementMemberedNodeStructureMixin extends baseClass {
    callSignatures: CallSignatureDeclarationImpl[] = [];
    constructSignatures: ConstructSignatureDeclarationImpl[] = [];
    indexSignatures: IndexSignatureDeclarationImpl[] = [];
    methods: MethodSignatureImpl[] = [];
    properties: PropertySignatureImpl[] = [];

    public static copyFields(
      source: TypeElementMemberedNodeStructure & Structures,
      target: TypeElementMemberedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
    }
  }

  return TypeElementMemberedNodeStructureMixin;
}

TypeElementMemberedNodeStructureMixin satisfies SubclassDecorator<
  TypeElementMemberedNodeStructureFields,
  typeof StructureBase,
  false
>;
