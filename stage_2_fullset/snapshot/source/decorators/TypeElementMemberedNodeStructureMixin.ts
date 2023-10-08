//#region preamble
import {
  CallSignatureDeclarationImpl,
  ConstructSignatureDeclarationImpl,
  IndexSignatureDeclarationImpl,
  MethodSignatureImpl,
  PropertySignatureImpl,
} from "../exports.js";
import {
  cloneStructureArray,
  type RightExtendsLeft,
  StructureBase,
} from "../internal-exports.js";
import type {
  MixinClass,
  StaticAndInstance,
  SubclassDecorator,
} from "mixin-decorators";
import {
  type CallSignatureDeclarationStructure,
  type ConstructSignatureDeclarationStructure,
  type IndexSignatureDeclarationStructure,
  type MethodSignatureStructure,
  type OptionalKind,
  type PropertySignatureStructure,
  StructureKind,
  type Structures,
  type TypeElementMemberedNodeStructure,
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
    readonly callSignatures: CallSignatureDeclarationImpl[] = [];
    readonly constructSignatures: ConstructSignatureDeclarationImpl[] = [];
    readonly indexSignatures: IndexSignatureDeclarationImpl[] = [];
    readonly methods: MethodSignatureImpl[] = [];
    readonly properties: PropertySignatureImpl[] = [];

    public static copyFields(
      source: TypeElementMemberedNodeStructure & Structures,
      target: TypeElementMemberedNodeStructureMixin & Structures,
    ): void {
      super.copyFields(source, target);
      if (source.callSignatures) {
        target.callSignatures.push(
          ...cloneStructureArray<
            OptionalKind<CallSignatureDeclarationStructure>,
            StructureKind.CallSignature,
            CallSignatureDeclarationImpl
          >(source.callSignatures, StructureKind.CallSignature),
        );
      }

      if (source.constructSignatures) {
        target.constructSignatures.push(
          ...cloneStructureArray<
            OptionalKind<ConstructSignatureDeclarationStructure>,
            StructureKind.ConstructSignature,
            ConstructSignatureDeclarationImpl
          >(source.constructSignatures, StructureKind.ConstructSignature),
        );
      }

      if (source.indexSignatures) {
        target.indexSignatures.push(
          ...cloneStructureArray<
            OptionalKind<IndexSignatureDeclarationStructure>,
            StructureKind.IndexSignature,
            IndexSignatureDeclarationImpl
          >(source.indexSignatures, StructureKind.IndexSignature),
        );
      }

      if (source.methods) {
        target.methods.push(
          ...cloneStructureArray<
            OptionalKind<MethodSignatureStructure>,
            StructureKind.MethodSignature,
            MethodSignatureImpl
          >(source.methods, StructureKind.MethodSignature),
        );
      }

      if (source.properties) {
        target.properties.push(
          ...cloneStructureArray<
            OptionalKind<PropertySignatureStructure>,
            StructureKind.PropertySignature,
            PropertySignatureImpl
          >(source.properties, StructureKind.PropertySignature),
        );
      }
    }
  }

  return TypeElementMemberedNodeStructureMixin;
}

TypeElementMemberedNodeStructureMixin satisfies SubclassDecorator<
  TypeElementMemberedNodeStructureFields,
  typeof StructureBase,
  false
>;
