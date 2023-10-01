//#region preamble
import { type RightExtendsLeft, StructureBase } from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import type {
  CallSignatureDeclarationStructure,
  ConstructSignatureDeclarationStructure,
  IndexSignatureDeclarationStructure,
  MethodSignatureStructure,
  PropertySignatureStructure,
  Structures,
  TypeElementMemberedNodeStructure,
} from "ts-morph";
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
    callSignatures: CallSignatureDeclarationStructure[] = [];
    constructSignatures: ConstructSignatureDeclarationStructure[] = [];
    indexSignatures: IndexSignatureDeclarationStructure[] = [];
    methods: MethodSignatureStructure[] = [];
    properties: PropertySignatureStructure[] = [];

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
