//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
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
import type { Jsonify } from "type-fest";
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

  public static clone(
    source: OptionalKind<CallSignatureDeclarationStructure>,
  ): CallSignatureDeclarationImpl {
    const target = new CallSignatureDeclarationImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<CallSignatureDeclarationStructure> {
    const rv = super.toJSON() as CallSignatureDeclarationStructure;
    rv.kind = this.kind;
    return rv;
  }
}

CallSignatureDeclarationImpl satisfies CloneableStructure<
  CallSignatureDeclarationStructure,
  CallSignatureDeclarationImpl
>;
StructuresClassesMap.set(
  StructureKind.CallSignature,
  CallSignatureDeclarationImpl,
);
