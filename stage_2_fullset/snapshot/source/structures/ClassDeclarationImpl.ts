//#region preamble
import {
  type AbstractableNodeStructureFields,
  AbstractableNodeStructureMixin,
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type DecoratableNodeStructureFields,
  DecoratableNodeStructureMixin,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type ImplementsClauseableNodeStructureFields,
  ImplementsClauseableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NameableNodeStructureFields,
  NameableNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  type TypeParameteredNodeStructureFields,
  TypeParameteredNodeStructureMixin,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ClassDeclarationStructure,
  type ConstructorDeclarationStructure,
  type GetAccessorDeclarationStructure,
  type MethodDeclarationStructure,
  type PropertyDeclarationStructure,
  type SetAccessorDeclarationStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
const ClassDeclarationStructureBase = MultiMixinBuilder<
  [
    ImplementsClauseableNodeStructureFields,
    NameableNodeStructureFields,
    DecoratableNodeStructureFields,
    AbstractableNodeStructureFields,
    ExportableNodeStructureFields,
    AmbientableNodeStructureFields,
    TypeParameteredNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ImplementsClauseableNodeStructureMixin,
    NameableNodeStructureMixin,
    DecoratableNodeStructureMixin,
    AbstractableNodeStructureMixin,
    ExportableNodeStructureMixin,
    AmbientableNodeStructureMixin,
    TypeParameteredNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class ClassDeclarationImpl
  extends ClassDeclarationStructureBase
  implements ClassDeclarationStructure
{
  readonly kind: StructureKind.Class = StructureKind.Class;
  ctors: ConstructorDeclarationStructure[] = [];
  properties: PropertyDeclarationStructure[] = [];
  getAccessors: GetAccessorDeclarationStructure[] = [];
  setAccessors: SetAccessorDeclarationStructure[] = [];
  methods: MethodDeclarationStructure[] = [];
  extends?: stringOrWriter = undefined;
  name?: string = undefined;

  public static copyFields(
    source: ClassDeclarationStructure & Structures,
    target: ClassDeclarationImpl & Structures,
  ): void {
    super.copyFields(source, target);
    if (source.extends) {
      target.extends = source.extends;
    }

    if (source.name) {
      target.name = source.name;
    }
  }
}
