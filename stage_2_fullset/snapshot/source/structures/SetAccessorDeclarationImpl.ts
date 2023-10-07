//#region preamble
import {
  type AbstractableNodeStructureFields,
  AbstractableNodeStructureMixin,
  type CloneableStructure,
  type DecoratableNodeStructureFields,
  DecoratableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  type ScopedNodeStructureFields,
  ScopedNodeStructureMixin,
  type StatementedNodeStructureFields,
  StatementedNodeStructureMixin,
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
  OptionalKind,
  type SetAccessorDeclarationStructure,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const SetAccessorDeclarationStructureBase = MultiMixinBuilder<
  [
    StaticableNodeStructureFields,
    DecoratableNodeStructureFields,
    AbstractableNodeStructureFields,
    ScopedNodeStructureFields,
    StatementedNodeStructureFields,
    ParameteredNodeStructureFields,
    ReturnTypedNodeStructureFields,
    TypeParameteredNodeStructureFields,
    NamedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    StaticableNodeStructureMixin,
    DecoratableNodeStructureMixin,
    AbstractableNodeStructureMixin,
    ScopedNodeStructureMixin,
    StatementedNodeStructureMixin,
    ParameteredNodeStructureMixin,
    ReturnTypedNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class SetAccessorDeclarationImpl
  extends SetAccessorDeclarationStructureBase
  implements SetAccessorDeclarationStructure
{
  readonly kind: StructureKind.SetAccessor = StructureKind.SetAccessor;

  public static copyFields(
    source: OptionalKind<SetAccessorDeclarationStructure>,
    target: SetAccessorDeclarationImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<SetAccessorDeclarationStructure>,
  ): SetAccessorDeclarationImpl {
    const target = new SetAccessorDeclarationImpl();
    this.copyFields(source, target);
    return target;
  }
}

SetAccessorDeclarationImpl satisfies CloneableStructure<SetAccessorDeclarationStructure>;
StructuresClassesMap.set(StructureKind.SetAccessor, SetAccessorDeclarationImpl);
