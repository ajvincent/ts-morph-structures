//#region preamble
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type ExtendsClauseableNodeStructureFields,
  ExtendsClauseableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
  type TypeElementMemberedNodeStructureFields,
  TypeElementMemberedNodeStructureMixin,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type InterfaceDeclarationStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const InterfaceDeclarationStructureBase = MultiMixinBuilder<
  [
    ExtendsClauseableNodeStructureFields,
    TypeElementMemberedNodeStructureFields,
    ExportableNodeStructureFields,
    AmbientableNodeStructureFields,
    TypeParameteredNodeStructureFields,
    NamedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ExtendsClauseableNodeStructureMixin,
    TypeElementMemberedNodeStructureMixin,
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class InterfaceDeclarationImpl
  extends InterfaceDeclarationStructureBase
  implements InterfaceDeclarationStructure
{
  readonly kind: StructureKind.Interface = StructureKind.Interface;

  public static copyFields(
    source: OptionalKind<InterfaceDeclarationStructure>,
    target: InterfaceDeclarationImpl,
  ): void {
    super.copyFields(source, target);
  }

  public static clone(
    source: OptionalKind<InterfaceDeclarationStructure>,
  ): InterfaceDeclarationImpl {
    const target = new InterfaceDeclarationImpl();
    this.copyFields(source, target);
    return target;
  }
}

InterfaceDeclarationImpl satisfies CloneableStructure<InterfaceDeclarationStructure>;
StructuresClassesMap.set(StructureKind.Interface, InterfaceDeclarationImpl);
