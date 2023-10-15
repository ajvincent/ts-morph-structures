//#region preamble
import {
  type AmbientableNodeStructureFields,
  AmbientableNodeStructureMixin,
  type CloneableStructure,
  COPY_FIELDS,
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

  public static [COPY_FIELDS](
    source: OptionalKind<ModuleDeclarationStructure>,
    target: ModuleDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.declarationKind) {
      target.declarationKind = source.declarationKind;
    }
  }

  public static clone(
    source: OptionalKind<ModuleDeclarationStructure>,
  ): ModuleDeclarationImpl {
    const target = new ModuleDeclarationImpl(source.name);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): ModuleDeclarationStructure {
    const rv = super.toJSON() as ModuleDeclarationStructure;
    if (this.declarationKind) {
      rv.declarationKind = this.declarationKind;
    }

    rv.kind = this.kind;
    return rv;
  }
}

ModuleDeclarationImpl satisfies CloneableStructure<
  ModuleDeclarationStructure,
  ModuleDeclarationImpl
>;
StructuresClassesMap.set(StructureKind.Module, ModuleDeclarationImpl);
