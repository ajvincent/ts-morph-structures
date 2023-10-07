//#region preamble
import { AssertEntryImpl, ImportSpecifierImpl } from "../exports.js";
import {
  type CloneableStructure,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ImportDeclarationStructure,
  OptionalKind,
  StructureKind,
} from "ts-morph";
//#endregion preamble
const ImportDeclarationStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class ImportDeclarationImpl
  extends ImportDeclarationStructureBase
  implements ImportDeclarationStructure
{
  readonly kind: StructureKind.ImportDeclaration =
    StructureKind.ImportDeclaration;
  isTypeOnly = false;
  namedImports: (stringOrWriter | ImportSpecifierImpl)[] = [];
  assertElements: AssertEntryImpl[] = [];
  defaultImport?: string = undefined;
  namespaceImport?: string = undefined;
  moduleSpecifier = "";

  public static copyFields(
    source: OptionalKind<ImportDeclarationStructure>,
    target: ImportDeclarationImpl,
  ): void {
    super.copyFields(source, target);
    target.isTypeOnly = source.isTypeOnly ?? false;
    if (source.defaultImport) {
      target.defaultImport = source.defaultImport;
    }

    if (source.namespaceImport) {
      target.namespaceImport = source.namespaceImport;
    }

    if (source.moduleSpecifier) {
      target.moduleSpecifier = source.moduleSpecifier;
    }
  }

  public static clone(
    source: OptionalKind<ImportDeclarationStructure>,
  ): ImportDeclarationImpl {
    const target = new ImportDeclarationImpl();
    this.copyFields(source, target);
    return target;
  }
}

ImportDeclarationImpl satisfies CloneableStructure<ImportDeclarationStructure>;
StructuresClassesMap.set(
  StructureKind.ImportDeclaration,
  ImportDeclarationImpl,
);
