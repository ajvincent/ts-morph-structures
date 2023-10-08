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
  type GetAccessorDeclarationStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const GetAccessorDeclarationStructureBase = MultiMixinBuilder<
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

export default class GetAccessorDeclarationImpl
  extends GetAccessorDeclarationStructureBase
  implements GetAccessorDeclarationStructure
{
  readonly kind: StructureKind.GetAccessor = StructureKind.GetAccessor;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static copyFields(
    source: OptionalKind<GetAccessorDeclarationStructure>,
    target: GetAccessorDeclarationImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<GetAccessorDeclarationStructure>,
  ): GetAccessorDeclarationImpl {
    const target = new GetAccessorDeclarationImpl(source.name);
    this.copyFields(source, target);
    return target;
  }
}

GetAccessorDeclarationImpl satisfies CloneableStructure<GetAccessorDeclarationStructure>;
StructuresClassesMap.set(StructureKind.GetAccessor, GetAccessorDeclarationImpl);
