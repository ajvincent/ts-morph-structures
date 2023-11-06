//#region preamble
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type ParameteredNodeStructureFields,
  ParameteredNodeStructureMixin,
  type PreferArrayFields,
  type RequiredOmit,
  type ReturnTypedNodeStructureFields,
  ReturnTypedNodeStructureMixin,
  type ScopedNodeStructureFields,
  ScopedNodeStructureMixin,
  StructureBase,
  type StructureClassToJSON,
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
import type { Class } from "type-fest";
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
  implements
    RequiredOmit<
      PreferArrayFields<ConstructorDeclarationOverloadStructure>,
      "returnType" | "scope"
    >
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

  public toJSON(): StructureClassToJSON<ConstructorDeclarationOverloadImpl> {
    const rv =
      super.toJSON() as StructureClassToJSON<ConstructorDeclarationOverloadImpl>;
    rv.kind = this.kind;
    return rv;
  }
}

ConstructorDeclarationOverloadImpl satisfies CloneableStructure<
  ConstructorDeclarationOverloadStructure,
  ConstructorDeclarationOverloadImpl
> &
  Class<ExtractStructure<ConstructorDeclarationOverloadStructure["kind"]>>;
StructuresClassesMap.set(
  StructureKind.ConstructorOverload,
  ConstructorDeclarationOverloadImpl,
);
