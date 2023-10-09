//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
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
  type ConstructorDeclarationOverloadStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const ConstructorDeclarationOverloadStructureBase = MultiMixinBuilder<
  [
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
    ScopedNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class ConstructorDeclarationOverloadImpl
  extends ConstructorDeclarationOverloadStructureBase
  implements ConstructorDeclarationOverloadStructure
{
  readonly kind: StructureKind.ConstructorOverload =
    StructureKind.ConstructorOverload;

  public static clone(
    source: OptionalKind<ConstructorDeclarationOverloadStructure>,
  ): ConstructorDeclarationOverloadImpl {
    const target = new ConstructorDeclarationOverloadImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }
}

ConstructorDeclarationOverloadImpl satisfies CloneableStructure<
  ConstructorDeclarationOverloadStructure,
  ConstructorDeclarationOverloadImpl
>;
StructuresClassesMap.set(
  StructureKind.ConstructorOverload,
  ConstructorDeclarationOverloadImpl,
);
