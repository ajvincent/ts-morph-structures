//#region preamble
import {
  type AbstractableNodeStructureFields,
  AbstractableNodeStructureMixin,
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
  COPY_FIELDS,
  type DecoratableNodeStructureFields,
  DecoratableNodeStructureMixin,
  type ExclamationTokenableNodeStructureFields,
  ExclamationTokenableNodeStructureMixin,
  type InitializerExpressionableNodeStructureFields,
  InitializerExpressionableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type OverrideableNodeStructureFields,
  OverrideableNodeStructureMixin,
  type QuestionTokenableNodeStructureFields,
  QuestionTokenableNodeStructureMixin,
  type ReadonlyableNodeStructureFields,
  ReadonlyableNodeStructureMixin,
  type ScopedNodeStructureFields,
  ScopedNodeStructureMixin,
  type StaticableNodeStructureFields,
  StaticableNodeStructureMixin,
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
  type PropertyDeclarationStructure,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const PropertyDeclarationStructureBase = MultiMixinBuilder<
  [
    ExclamationTokenableNodeStructureFields,
    ReadonlyableNodeStructureFields,
    OverrideableNodeStructureFields,
    TypedNodeStructureFields,
    StaticableNodeStructureFields,
    InitializerExpressionableNodeStructureFields,
    QuestionTokenableNodeStructureFields,
    DecoratableNodeStructureFields,
    AbstractableNodeStructureFields,
    ScopedNodeStructureFields,
    AmbientableNodeStructureFields,
    NamedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ExclamationTokenableNodeStructureMixin,
    ReadonlyableNodeStructureMixin,
    OverrideableNodeStructureMixin,
    TypedNodeStructureMixin,
    StaticableNodeStructureMixin,
    InitializerExpressionableNodeStructureMixin,
    QuestionTokenableNodeStructureMixin,
    DecoratableNodeStructureMixin,
    AbstractableNodeStructureMixin,
    ScopedNodeStructureMixin,
    AmbientableNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class PropertyDeclarationImpl
  extends PropertyDeclarationStructureBase
  implements PropertyDeclarationStructure
{
  readonly kind: StructureKind.Property = StructureKind.Property;
  hasAccessorKeyword = false;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<PropertyDeclarationStructure>,
    target: PropertyDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    target.hasAccessorKeyword = source.hasAccessorKeyword ?? false;
  }

  public static clone(
    source: OptionalKind<PropertyDeclarationStructure>,
  ): PropertyDeclarationImpl {
    const target = new PropertyDeclarationImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }
}

PropertyDeclarationImpl satisfies CloneableStructure<PropertyDeclarationStructure>;
StructuresClassesMap.set(StructureKind.Property, PropertyDeclarationImpl);
