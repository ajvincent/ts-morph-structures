//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
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
import type { Jsonify } from "type-fest";
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

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static clone(
    source: OptionalKind<MethodSignatureStructure>,
  ): MethodSignatureImpl {
    const target = new MethodSignatureImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<MethodSignatureStructure> {
    const rv = super.toJSON() as MethodSignatureStructure;
    rv.kind = this.kind;
    return rv;
  }
}

MethodSignatureImpl satisfies CloneableStructure<
  MethodSignatureStructure,
  MethodSignatureImpl
>;
StructuresClassesMap.set(StructureKind.MethodSignature, MethodSignatureImpl);
