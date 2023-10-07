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
  type CallSignatureDeclarationStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const CallSignatureDeclarationStructureBase = MultiMixinBuilder<
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

export default class CallSignatureDeclarationImpl
  extends CallSignatureDeclarationStructureBase
  implements CallSignatureDeclarationStructure
{
  readonly kind: StructureKind.CallSignature = StructureKind.CallSignature;

  public static copyFields(
    source: OptionalKind<CallSignatureDeclarationStructure>,
    target: CallSignatureDeclarationImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<CallSignatureDeclarationStructure>,
  ): CallSignatureDeclarationImpl {
    const target = new CallSignatureDeclarationImpl();
    this.copyFields(source, target);
    return target;
  }
}

CallSignatureDeclarationImpl satisfies CloneableStructure<CallSignatureDeclarationStructure>;
StructuresClassesMap.set(
  StructureKind.CallSignature,
  CallSignatureDeclarationImpl,
);
