//#region preamble
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
  type ExportableNodeStructureFields,
  ExportableNodeStructureMixin,
  type JSDocableNodeStructureFields,
  JSDocableNodeStructureMixin,
  type NamedNodeStructureFields,
  NamedNodeStructureMixin,
  type StatementedNodeStructureFields,
  StatementedNodeStructureMixin,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  ModuleDeclarationKind,
  type ModuleDeclarationStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const ModuleDeclarationStructureBase = MultiMixinBuilder<
  [
    ExportableNodeStructureFields,
    StatementedNodeStructureFields,
    AmbientableNodeStructureFields,
    NamedNodeStructureFields,
    JSDocableNodeStructureFields,
    StructureFields,
  ],
  typeof StructureBase
>(
  [
    ExportableNodeStructureMixin,
    StatementedNodeStructureMixin,
    AmbientableNodeStructureMixin,
    NamedNodeStructureMixin,
    JSDocableNodeStructureMixin,
    StructureMixin,
  ],
  StructureBase,
);

export default class ModuleDeclarationImpl
  extends ModuleDeclarationStructureBase
  implements ModuleDeclarationStructure
{
  readonly kind: StructureKind.Module = StructureKind.Module;
  declarationKind?: ModuleDeclarationKind = undefined;

  constructor(name: string) {
    super();
    this.name = name;
  }

  public static copyFields(
    source: OptionalKind<ModuleDeclarationStructure>,
    target: ModuleDeclarationImpl,
  ): void {
    super.copyFields(source, target);
    if (source.declarationKind) {
      target.declarationKind = source.declarationKind;
    }
  }

  public static clone(
    source: OptionalKind<ModuleDeclarationStructure>,
  ): ModuleDeclarationImpl {
    const target = new ModuleDeclarationImpl(source.name);
    this.copyFields(source, target);
    return target;
  }
}

ModuleDeclarationImpl satisfies CloneableStructure<ModuleDeclarationStructure>;
StructuresClassesMap.set(StructureKind.Module, ModuleDeclarationImpl);
