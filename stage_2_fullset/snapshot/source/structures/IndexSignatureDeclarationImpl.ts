//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type ReadonlyableNodeStructureFields,
  ReadonlyableNodeStructureMixin,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type IndexSignatureDeclarationStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
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
  implements IndexSignatureDeclarationStructure
{
  readonly kind: StructureKind.IndexSignature = StructureKind.IndexSignature;
  keyName?: string = undefined;
  keyType?: string = undefined;

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

  public toJSON(): IndexSignatureDeclarationStructure {
    const rv = super.toJSON() as IndexSignatureDeclarationStructure;
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
>;
StructuresClassesMap.set(
  StructureKind.IndexSignature,
  IndexSignatureDeclarationImpl,
);
