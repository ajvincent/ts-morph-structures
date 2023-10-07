//#region preamble
import {
  type CloneableStructure,
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

  public static copyFields(
    source: OptionalKind<IndexSignatureDeclarationStructure>,
    target: IndexSignatureDeclarationImpl,
  ): void {
    super.copyFields(source, target);
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
    this.copyFields(source, target);
    return target;
  }
}

IndexSignatureDeclarationImpl satisfies CloneableStructure<IndexSignatureDeclarationStructure>;
StructuresClassesMap.set(
  StructureKind.IndexSignature,
  IndexSignatureDeclarationImpl,
);
