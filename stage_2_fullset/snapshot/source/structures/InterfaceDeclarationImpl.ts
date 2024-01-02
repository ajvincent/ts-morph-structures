//#region preamble
import {
  CallSignatureDeclarationImpl,
  ConstructSignatureDeclarationImpl,
  GetAccessorDeclarationImpl,
  IndexSignatureDeclarationImpl,
  MethodSignatureImpl,
  PropertySignatureImpl,
  SetAccessorDeclarationImpl,
} from "../exports.js";
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
  cloneStructureArray,
  COPY_FIELDS,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type ExtractStructure,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type PreferArrayFields,
  ReadonlyArrayProxyHandler,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  StructureBase,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
  TypeStructureSet,
} from "../internal-exports.js";
import type { stringOrWriterFunction } from "../types/stringOrWriterFunction.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type CallSignatureDeclarationStructure,
  type ConstructSignatureDeclarationStructure,
  type GetAccessorDeclarationStructure,
  type IndexSignatureDeclarationStructure,
  type InterfaceDeclarationStructure,
  type MethodSignatureStructure,
  type OptionalKind,
  type PropertySignatureStructure,
  type SetAccessorDeclarationStructure,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
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

interface ExtendsInterface {
  extendsSet: TypeStructureSet;
}

export default class InterfaceDeclarationImpl
  extends InterfaceDeclarationStructureBase
  implements
    RequiredOmit<PreferArrayFields<InterfaceDeclarationStructure>>,
    ExtendsInterface
{
  static readonly #extendsArrayReadonlyHandler = new ReadonlyArrayProxyHandler(
    "The extends array is read-only.  Please use this.extendsSet to set strings and type structures.",
  );
  readonly kind: StructureKind.Interface = StructureKind.Interface;
  readonly #extends_ShadowArray: stringOrWriterFunction[] = [];
  readonly #extendsProxyArray = new Proxy<stringOrWriterFunction[]>(
    this.#extends_ShadowArray,
    InterfaceDeclarationImpl.#extendsArrayReadonlyHandler,
  );
  readonly callSignatures: CallSignatureDeclarationImpl[] = [];
  readonly constructSignatures: ConstructSignatureDeclarationImpl[] = [];
  readonly extendsSet = new TypeStructureSet(this.#extends_ShadowArray);
  readonly getAccessors: GetAccessorDeclarationImpl[] = [];
  readonly indexSignatures: IndexSignatureDeclarationImpl[] = [];
  readonly methods: MethodSignatureImpl[] = [];
  readonly properties: PropertySignatureImpl[] = [];
  readonly setAccessors: SetAccessorDeclarationImpl[] = [];

  constructor(name: string) {
    super();
    this.name = name;
  }

  get extends(): stringOrWriterFunction[] {
    return this.#extendsProxyArray;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<InterfaceDeclarationStructure>,
    target: InterfaceDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
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

    const { extendsSet } = source as unknown as InterfaceDeclarationImpl;
    if (extendsSet instanceof TypeStructureSet) {
      target.extendsSet.cloneFromTypeStructureSet(extendsSet);
    } else if (Array.isArray(source.extends)) {
      target.extendsSet.replaceFromTypeArray(source.extends);
    } else if (typeof source.extends === "function") {
      target.extendsSet.replaceFromTypeArray([source.extends]);
    }

    if (source.getAccessors) {
      target.getAccessors.push(
        ...cloneStructureArray<
          OptionalKind<GetAccessorDeclarationStructure>,
          StructureKind.GetAccessor,
          GetAccessorDeclarationImpl
        >(source.getAccessors, StructureKind.GetAccessor),
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

    if (source.setAccessors) {
      target.setAccessors.push(
        ...cloneStructureArray<
          OptionalKind<SetAccessorDeclarationStructure>,
          StructureKind.SetAccessor,
          SetAccessorDeclarationImpl
        >(source.setAccessors, StructureKind.SetAccessor),
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

  public toJSON(): StructureClassToJSON<InterfaceDeclarationImpl> {
    const rv = super.toJSON() as StructureClassToJSON<InterfaceDeclarationImpl>;
    rv.callSignatures = this.callSignatures;
    rv.constructSignatures = this.constructSignatures;
    rv.extends = this.extends.map((value) => {
      return StructureBase[REPLACE_WRITER_WITH_STRING](value);
    });
    rv.getAccessors = this.getAccessors;
    rv.indexSignatures = this.indexSignatures;
    rv.kind = this.kind;
    rv.methods = this.methods;
    rv.properties = this.properties;
    rv.setAccessors = this.setAccessors;
    return rv;
  }
}

InterfaceDeclarationImpl satisfies CloneableStructure<
  InterfaceDeclarationStructure,
  InterfaceDeclarationImpl
> &
  Class<ExtractStructure<InterfaceDeclarationStructure["kind"]>>;
StructuresClassesMap.set(StructureKind.Interface, InterfaceDeclarationImpl);
