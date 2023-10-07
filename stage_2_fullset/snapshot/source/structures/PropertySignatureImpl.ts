//#region preamble
import {
  type CloneableStructure,
  type InitializerExpressionableNodeStructureFields,
  InitializerExpressionableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type QuestionTokenableNodeStructureFields,
  QuestionTokenableNodeStructureMixin,
  type ReadonlyableNodeStructureFields,
  ReadonlyableNodeStructureMixin,
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
  implements PropertySignatureStructure
{
  readonly kind: StructureKind.PropertySignature =
    StructureKind.PropertySignature;

  public static copyFields(
    source: OptionalKind<PropertySignatureStructure>,
    target: PropertySignatureImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<PropertySignatureStructure>,
  ): PropertySignatureImpl {
    const target = new PropertySignatureImpl();
    this.copyFields(source, target);
    return target;
  }
}

PropertySignatureImpl satisfies CloneableStructure<PropertySignatureStructure>;
StructuresClassesMap.set(
  StructureKind.PropertySignature,
  PropertySignatureImpl,
);
