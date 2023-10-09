//#region preamble
import {
  CallSignatureDeclarationImpl,
  ConstructSignatureDeclarationImpl,
  IndexSignatureDeclarationImpl,
  MethodSignatureImpl,
  PropertySignatureImpl,
} from "../exports.js";
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
  cloneStructureArray,
  COPY_FIELDS,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type CallSignatureDeclarationStructure,
  type ConstructSignatureDeclarationStructure,
  type IndexSignatureDeclarationStructure,
  type InterfaceDeclarationStructure,
  type MethodSignatureStructure,
  type OptionalKind,
  type PropertySignatureStructure,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const InterfaceDeclarationStructureBase = MultiMixinBuilder<
  [
    ExportableNodeStructureFields,
    AmbientableNodeStructureFields,
    TypeParameteredNodeStructureFields,
    NamedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class InterfaceDeclarationImpl
  extends InterfaceDeclarationStructureBase
  implements InterfaceDeclarationStructure
{
  readonly kind: StructureKind.Interface = StructureKind.Interface;
  readonly extends: stringOrWriter[] = [];
  readonly callSignatures: CallSignatureDeclarationImpl[] = [];
  readonly constructSignatures: ConstructSignatureDeclarationImpl[] = [];
  readonly indexSignatures: IndexSignatureDeclarationImpl[] = [];
  readonly methods: MethodSignatureImpl[] = [];
  readonly properties: PropertySignatureImpl[] = [];

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<InterfaceDeclarationStructure>,
    target: InterfaceDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (Array.isArray(source.extends)) {
      target.extends.push(...source.extends);
    } else if (source.extends !== undefined) {
      target.extends.push(source.extends);
    }

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

  public static clone(
    source: OptionalKind<InterfaceDeclarationStructure>,
  ): InterfaceDeclarationImpl {
    const target = new InterfaceDeclarationImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }
}

InterfaceDeclarationImpl satisfies CloneableStructure<
  InterfaceDeclarationStructure,
  InterfaceDeclarationImpl
>;
StructuresClassesMap.set(StructureKind.Interface, InterfaceDeclarationImpl);
