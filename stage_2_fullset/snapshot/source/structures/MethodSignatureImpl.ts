//#region preamble
import {
  type CloneableStructure,
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
  StructuresClassesMap,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type MethodSignatureStructure,
  OptionalKind,
  StructureKind,
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
    source: OptionalKind<MethodSignatureStructure>,
    target: MethodSignatureImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<MethodSignatureStructure>,
  ): MethodSignatureImpl {
    const target = new MethodSignatureImpl();
    this.copyFields(source, target);
    return target;
  }
}

MethodSignatureImpl satisfies CloneableStructure<MethodSignatureStructure>;
StructuresClassesMap.set(StructureKind.MethodSignature, MethodSignatureImpl);
