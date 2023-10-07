//#region preamble
import {
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import type {
  AssertEntryStructure,
  ImportDeclarationStructure,
  ImportSpecifierStructure,
  Structures,
} from "ts-morph";
//#endregion preamble
const ImportDeclarationStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class ImportDeclarationImpl extends ImportDeclarationStructureBase {
  isTypeOnly = false;
  namedImports: (stringOrWriter | ImportSpecifierStructure)[] = [];
  assertElements: AssertEntryStructure[] = [];
  defaultImport?: string = undefined;
  namespaceImport?: string = undefined;
  moduleSpecifier: string = "";

  public static copyFields(
    source: ImportDeclarationStructure & Structures,
    target: ImportDeclarationImpl & Structures,
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
}
