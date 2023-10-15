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
import type { Jsonify } from "type-fest";
//#endregion preamble
const PropertyDeclarationStructureBase = MultiMixinBuilder<
  [
    ExclamationTokenableNodeStructureFields,
    ReadonlyableNodeStructureFields,
    OverrideableNodeStructureFields,
    TypedNodeStructureFields,
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
  readonly isStatic: boolean;

  constructor(isStatic: boolean, name: string) {
    super();
    this.isStatic = isStatic;
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
    const target = new PropertyDeclarationImpl(
      source.isStatic ?? false,
      source.name,
    );
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<PropertyDeclarationStructure> {
    const rv = super.toJSON() as PropertyDeclarationStructure;
    rv.hasAccessorKeyword = this.hasAccessorKeyword;
    rv.isStatic = this.isStatic;
    rv.kind = this.kind;
    return rv;
  }
}

PropertyDeclarationImpl satisfies CloneableStructure<
  PropertyDeclarationStructure,
  PropertyDeclarationImpl
>;
StructuresClassesMap.set(StructureKind.Property, PropertyDeclarationImpl);
