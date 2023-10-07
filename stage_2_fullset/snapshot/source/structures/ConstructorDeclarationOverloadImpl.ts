//#region preamble
import {
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
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ConstructorDeclarationOverloadStructure,
  StructureKind,
  type Structures,
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
    source: ConstructorDeclarationOverloadStructure & Structures,
    target: ConstructorDeclarationOverloadImpl & Structures,
  ): void {
    super.copyFields(source, target);
  }
}
