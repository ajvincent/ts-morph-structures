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
  readonly isStatic: boolean;

  constructor(isStatic: boolean) {
    super();
    this.isStatic = isStatic;
  }

  public static clone(
    source: OptionalKind<MethodDeclarationOverloadStructure>,
  ): MethodDeclarationOverloadImpl {
    const target = new MethodDeclarationOverloadImpl(source.isStatic ?? false);
    this[COPY_FIELDS](source, target);
    return target;
  }
}

MethodDeclarationOverloadImpl satisfies CloneableStructure<
  MethodDeclarationOverloadStructure,
  MethodDeclarationOverloadImpl
>;
StructuresClassesMap.set(
  StructureKind.MethodOverload,
  MethodDeclarationOverloadImpl,
);
