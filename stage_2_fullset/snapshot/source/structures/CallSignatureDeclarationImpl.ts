//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type PreferArrayFields,
  type RequiredOmit,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  StructureBase,
  type StructureClassToJSON,
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
import type { Class } from "type-fest";
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
  implements
    RequiredOmit<
      PreferArrayFields<CallSignatureDeclarationStructure>,
      "returnType"
    >
{
  readonly kind: StructureKind.CallSignature = StructureKind.CallSignature;

  public static clone(
    source: OptionalKind<CallSignatureDeclarationStructure>,
  ): CallSignatureDeclarationImpl {
    const target = new CallSignatureDeclarationImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<CallSignatureDeclarationImpl> {
    const rv =
      super.toJSON() as StructureClassToJSON<CallSignatureDeclarationImpl>;
    rv.kind = this.kind;
    return rv;
  }
}

CallSignatureDeclarationImpl satisfies CloneableStructure<
  CallSignatureDeclarationStructure,
  CallSignatureDeclarationImpl
> &
  Class<ExtractStructure<CallSignatureDeclarationStructure["kind"]>>;
StructuresClassesMap.set(
  StructureKind.CallSignature,
  CallSignatureDeclarationImpl,
);
