//#region preamble
import { ConstructorDeclarationOverloadImpl } from "../exports.js";
import {
  type CloneableStructure,
  cloneStructureArray,
  COPY_FIELDS,
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
  type OptionalKind,
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
  readonly overloads: ConstructorDeclarationOverloadImpl[] = [];

  public static [COPY_FIELDS](
    source: OptionalKind<ConstructorDeclarationStructure>,
    target: ConstructorDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.overloads) {
      target.overloads.push(
        ...cloneStructureArray<
          OptionalKind<ConstructorDeclarationOverloadStructure>,
          StructureKind.ConstructorOverload,
          ConstructorDeclarationOverloadImpl
        >(source.overloads, StructureKind.ConstructorOverload),
      );
    }
  }

  public static clone(
    source: OptionalKind<ConstructorDeclarationStructure>,
  ): ConstructorDeclarationImpl {
    const target = new ConstructorDeclarationImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }
}

ConstructorDeclarationImpl satisfies CloneableStructure<ConstructorDeclarationStructure>;
StructuresClassesMap.set(StructureKind.Constructor, ConstructorDeclarationImpl);
