//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type PreferArrayFields,
  type RequiredOmit,
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
import type { Jsonify } from "type-fest";
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
  implements
    RequiredOmit<
      PreferArrayFields<ConstructSignatureDeclarationStructure>,
      "returnType"
    >
{
  readonly kind: StructureKind.ConstructSignature =
    StructureKind.ConstructSignature;

  public static clone(
    source: OptionalKind<ConstructSignatureDeclarationStructure>,
  ): ConstructSignatureDeclarationImpl {
    const target = new ConstructSignatureDeclarationImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<ConstructSignatureDeclarationStructure> {
    const rv = super.toJSON() as ConstructSignatureDeclarationStructure;
    rv.kind = this.kind;
    return rv;
  }
}

ConstructSignatureDeclarationImpl satisfies CloneableStructure<
  ConstructSignatureDeclarationStructure,
  ConstructSignatureDeclarationImpl
>;
StructuresClassesMap.set(
  StructureKind.ConstructSignature,
  ConstructSignatureDeclarationImpl,
);
