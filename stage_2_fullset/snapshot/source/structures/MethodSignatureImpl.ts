//#region preamble
import {
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type QuestionTokenableNodeStructureFields,
  QuestionTokenableNodeStructureMixin,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type MethodSignatureStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
const MethodSignatureStructureBase = MultiMixinBuilder<
  [
    QuestionTokenableNodeStructureFields,
    ParameteredNodeStructureFields,
    ReturnTypedNodeStructureFields,
    TypeParameteredNodeStructureFields,
    NamedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    QuestionTokenableNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class MethodSignatureImpl
  extends MethodSignatureStructureBase
  implements MethodSignatureStructure
{
  readonly kind: StructureKind.MethodSignature = StructureKind.MethodSignature;

  public static copyFields(
    source: MethodSignatureStructure & Structures,
    target: MethodSignatureImpl & Structures,
  ): void {
    super.copyFields(source, target);
  }
}
