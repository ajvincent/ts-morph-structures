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
  type StatementedNodeStructureFields,
  StatementedNodeStructureMixin,
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
  type ConstructorDeclarationStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const ConstructorDeclarationStructureBase = MultiMixinBuilder<
  [
    ScopedNodeStructureFields,
    StatementedNodeStructureFields,
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
    StatementedNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class ConstructorDeclarationImpl
  extends ConstructorDeclarationStructureBase
  implements ConstructorDeclarationStructure
{
  readonly kind: StructureKind.Constructor = StructureKind.Constructor;
  overloads: ConstructorDeclarationOverloadStructure[] = [];

  public static copyFields(
    source: OptionalKind<ConstructorDeclarationStructure>,
    target: ConstructorDeclarationImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<ConstructorDeclarationStructure>,
  ): ConstructorDeclarationImpl {
    const target = new ConstructorDeclarationImpl();
    this.copyFields(source, target);
    return target;
  }
}

ConstructorDeclarationImpl satisfies CloneableStructure<ConstructorDeclarationStructure>;
StructuresClassesMap.set(StructureKind.Constructor, ConstructorDeclarationImpl);
