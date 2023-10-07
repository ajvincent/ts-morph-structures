//#region preamble
import {
  type CloneableStructure,
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

  public static copyFields(
    source: OptionalKind<ConstructorDeclarationOverloadStructure>,
    target: ConstructorDeclarationOverloadImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<ConstructorDeclarationOverloadStructure>,
  ): ConstructorDeclarationOverloadImpl {
    const target = new ConstructorDeclarationOverloadImpl();
    this.copyFields(source, target);
    return target;
  }
}

ConstructorDeclarationOverloadImpl satisfies CloneableStructure<ConstructorDeclarationOverloadStructure>;
StructuresClassesMap.set(
  StructureKind.ConstructorOverload,
  ConstructorDeclarationOverloadImpl,
);
