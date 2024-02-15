//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  type InitializerExpressionableNodeStructureFields,
  InitializerExpressionableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type PropertySignatureStructureClassIfc,
  type QuestionTokenableNodeStructureFields,
  QuestionTokenableNodeStructureMixin,
  type ReadonlyableNodeStructureFields,
  ReadonlyableNodeStructureMixin,
  StructureBase,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypedNodeStructureFields,
  TypedNodeStructureMixin,
} from "../../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  OptionalKind,
  type PropertySignatureStructure,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
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
  implements PropertySignatureStructureClassIfc
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

  public toJSON(): StructureClassToJSON<PropertySignatureImpl> {
    const rv = super.toJSON() as StructureClassToJSON<PropertySignatureImpl>;
    rv.kind = this.kind;
    return rv;
  }
}

PropertySignatureImpl satisfies CloneableStructure<
  PropertySignatureStructure,
  PropertySignatureImpl
> &
  Class<ExtractStructure<PropertySignatureStructure["kind"]>>;
StructuresClassesMap.set(
  StructureKind.PropertySignature,
  PropertySignatureImpl,
);
