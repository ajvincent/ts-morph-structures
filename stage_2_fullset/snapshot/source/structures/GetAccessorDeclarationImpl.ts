//#region preamble
import {
  type AbstractableNodeStructureFields,
  AbstractableNodeStructureMixin,
  type CloneableStructure,
  COPY_FIELDS,
  type DecoratableNodeStructureFields,
  DecoratableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type PreferArrayFields,
  type RequiredOmit,
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
  type GetAccessorDeclarationStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Jsonify } from "type-fest";
//#endregion preamble
const GetAccessorDeclarationStructureBase = MultiMixinBuilder<
  [
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
  implements
    RequiredOmit<
      PreferArrayFields<GetAccessorDeclarationStructure>,
      "returnType" | "scope"
    >
{
  readonly kind: StructureKind.GetAccessor = StructureKind.GetAccessor;
  readonly isStatic: boolean;

  constructor(isStatic: boolean, name: string) {
    super();
    this.isStatic = isStatic;
    this.name = name;
  }

  public static clone(
    source: OptionalKind<GetAccessorDeclarationStructure>,
  ): GetAccessorDeclarationImpl {
    const target = new GetAccessorDeclarationImpl(
      source.isStatic ?? false,
      source.name,
    );
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<GetAccessorDeclarationStructure> {
    const rv = super.toJSON() as GetAccessorDeclarationStructure;
    rv.isStatic = this.isStatic;
    rv.kind = this.kind;
    return rv;
  }
}

GetAccessorDeclarationImpl satisfies CloneableStructure<
  GetAccessorDeclarationStructure,
  GetAccessorDeclarationImpl
>;
StructuresClassesMap.set(StructureKind.GetAccessor, GetAccessorDeclarationImpl);
