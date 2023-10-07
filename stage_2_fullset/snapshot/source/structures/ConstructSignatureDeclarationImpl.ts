//#region preamble
import {
  type CloneableStructure,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ConstructSignatureDeclarationStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const ConstructSignatureDeclarationStructureBase = MultiMixinBuilder<
  [
    ParameteredNodeStructureFields,
    ReturnTypedNodeStructureFields,
    TypeParameteredNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class ConstructSignatureDeclarationImpl
  extends ConstructSignatureDeclarationStructureBase
  implements ConstructSignatureDeclarationStructure
{
  readonly kind: StructureKind.ConstructSignature =
    StructureKind.ConstructSignature;

  public static copyFields(
    source: OptionalKind<ConstructSignatureDeclarationStructure>,
    target: ConstructSignatureDeclarationImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<ConstructSignatureDeclarationStructure>,
  ): ConstructSignatureDeclarationImpl {
    const target = new ConstructSignatureDeclarationImpl();
    this.copyFields(source, target);
    return target;
  }
}

ConstructSignatureDeclarationImpl satisfies CloneableStructure<ConstructSignatureDeclarationStructure>;
StructuresClassesMap.set(
  StructureKind.ConstructSignature,
  ConstructSignatureDeclarationImpl,
);
