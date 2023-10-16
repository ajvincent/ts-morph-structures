//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type InitializerExpressionableNodeStructureFields,
  InitializerExpressionableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type PreferArrayFields,
  type QuestionTokenableNodeStructureFields,
  QuestionTokenableNodeStructureMixin,
  type ReadonlyableNodeStructureFields,
  ReadonlyableNodeStructureMixin,
  type RequiredOmit,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypedNodeStructureFields,
  TypedNodeStructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  OptionalKind,
  type PropertySignatureStructure,
  StructureKind,
} from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
const PropertySignatureStructureBase = MultiMixinBuilder<
  [
    ReadonlyableNodeStructureFields,
    TypedNodeStructureFields,
    InitializerExpressionableNodeStructureFields,
    QuestionTokenableNodeStructureFields,
    NamedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ReadonlyableNodeStructureMixin,
    TypedNodeStructureMixin,
    InitializerExpressionableNodeStructureMixin,
    QuestionTokenableNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class PropertySignatureImpl
  extends PropertySignatureStructureBase
  implements
    RequiredOmit<
      PreferArrayFields<PropertySignatureStructure>,
      "initializer" | "type"
    >
{
  readonly kind: StructureKind.PropertySignature =
    StructureKind.PropertySignature;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static clone(
    source: OptionalKind<PropertySignatureStructure>,
  ): PropertySignatureImpl {
    const target = new PropertySignatureImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<PropertySignatureStructure> {
    const rv = super.toJSON() as PropertySignatureStructure;
    rv.kind = this.kind;
    return rv;
  }
}

PropertySignatureImpl satisfies CloneableStructure<
  PropertySignatureStructure,
  PropertySignatureImpl
>;
StructuresClassesMap.set(
  StructureKind.PropertySignature,
  PropertySignatureImpl,
);
