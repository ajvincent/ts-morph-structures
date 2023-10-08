//#region preamble
import {
  type AbstractableNodeStructureFields,
  AbstractableNodeStructureMixin,
  type AsyncableNodeStructureFields,
  AsyncableNodeStructureMixin,
  type CloneableStructure,
  COPY_FIELDS,
  type GeneratorableNodeStructureFields,
  GeneratorableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type OverrideableNodeStructureFields,
  OverrideableNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type QuestionTokenableNodeStructureFields,
  QuestionTokenableNodeStructureMixin,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  type ScopedNodeStructureFields,
  ScopedNodeStructureMixin,
  type StaticableNodeStructureFields,
  StaticableNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type MethodDeclarationOverloadStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const MethodDeclarationOverloadStructureBase = MultiMixinBuilder<
  [
    AsyncableNodeStructureFields,
    GeneratorableNodeStructureFields,
    OverrideableNodeStructureFields,
    StaticableNodeStructureFields,
    AbstractableNodeStructureFields,
    QuestionTokenableNodeStructureFields,
    ScopedNodeStructureFields,
    ParameteredNodeStructureFields,
    ReturnTypedNodeStructureFields,
    TypeParameteredNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    AsyncableNodeStructureMixin,
    GeneratorableNodeStructureMixin,
    OverrideableNodeStructureMixin,
    StaticableNodeStructureMixin,
    AbstractableNodeStructureMixin,
    QuestionTokenableNodeStructureMixin,
    ScopedNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class MethodDeclarationOverloadImpl
  extends MethodDeclarationOverloadStructureBase
  implements MethodDeclarationOverloadStructure
{
  readonly kind: StructureKind.MethodOverload = StructureKind.MethodOverload;

  public static [COPY_FIELDS](
    source: OptionalKind<MethodDeclarationOverloadStructure>,
    target: MethodDeclarationOverloadImpl,
  ): void {
    super[COPY_FIELDS](source, target);
  }

  public static clone(
    source: OptionalKind<MethodDeclarationOverloadStructure>,
  ): MethodDeclarationOverloadImpl {
    const target = new MethodDeclarationOverloadImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }
}

MethodDeclarationOverloadImpl satisfies CloneableStructure<MethodDeclarationOverloadStructure>;
StructuresClassesMap.set(
  StructureKind.MethodOverload,
  MethodDeclarationOverloadImpl,
);
