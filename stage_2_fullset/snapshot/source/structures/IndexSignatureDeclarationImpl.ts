//#region preamble
import type { TypeStructures } from "../exports.js";
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type PreferArrayFields,
  type ReadonlyableNodeStructureFields,
  ReadonlyableNodeStructureMixin,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  StructureBase,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  TypeAccessors,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type IndexSignatureDeclarationStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const IndexSignatureDeclarationStructureBase = MultiMixinBuilder<
  [
    ReadonlyableNodeStructureFields,
    ReturnTypedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ReadonlyableNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class IndexSignatureDeclarationImpl
  extends IndexSignatureDeclarationStructureBase
  implements
    RequiredOmit<
      PreferArrayFields<IndexSignatureDeclarationStructure>,
      "keyName" | "keyType" | "returnType"
    >
{
  readonly kind: StructureKind.IndexSignature = StructureKind.IndexSignature;
  readonly #keyTypeManager = new TypeAccessors();
  keyName?: string = undefined;

  get keyType(): string | undefined {
    const type = this.#keyTypeManager.type;
    return type ? StructureBase[REPLACE_WRITER_WITH_STRING](type) : undefined;
  }

  set keyType(value: string | undefined) {
    this.#keyTypeManager.type = value;
  }

  get keyTypeStructure(): string | TypeStructures | undefined {
    return this.#keyTypeManager.typeStructure;
  }

  set keyTypeStructure(value: string | TypeStructures | undefined) {
    this.#keyTypeManager.typeStructure = value;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<IndexSignatureDeclarationStructure>,
    target: IndexSignatureDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.keyName) {
      target.keyName = source.keyName;
    }

    if (source.keyType) {
      target.keyType = source.keyType;
    }
  }

  public static clone(
    source: OptionalKind<IndexSignatureDeclarationStructure>,
  ): IndexSignatureDeclarationImpl {
    const target = new IndexSignatureDeclarationImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<IndexSignatureDeclarationImpl> {
    const rv =
      super.toJSON() as StructureClassToJSON<IndexSignatureDeclarationImpl>;
    if (this.keyName) {
      rv.keyName = this.keyName;
    }

    if (this.keyType) {
      rv.keyType = this.keyType;
    }

    rv.kind = this.kind;
    return rv;
  }
}

IndexSignatureDeclarationImpl satisfies CloneableStructure<
  IndexSignatureDeclarationStructure,
  IndexSignatureDeclarationImpl
> &
  Class<ExtractStructure<IndexSignatureDeclarationStructure["kind"]>>;
StructuresClassesMap.set(
  StructureKind.IndexSignature,
  IndexSignatureDeclarationImpl,
);
