//#region preamble
import {
  StructureBase,
  type StructureFields,
  StructureMixin,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type AssertEntryStructure,
  type ExportDeclarationStructure,
  type ExportSpecifierStructure,
  StructureKind,
  type Structures,
} from "ts-morph";
//#endregion preamble
const ExportDeclarationStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class ExportDeclarationImpl
  extends ExportDeclarationStructureBase
  implements ExportDeclarationStructure
{
  readonly kind: StructureKind.ExportDeclaration =
    StructureKind.ExportDeclaration;
  isTypeOnly = false;
  namedExports: (stringOrWriter | ExportSpecifierStructure)[] = [];
  assertElements: AssertEntryStructure[] = [];
  namespaceExport?: string = undefined;
  moduleSpecifier?: string = undefined;

  public static copyFields(
    source: ExportDeclarationStructure & Structures,
    target: ExportDeclarationImpl & Structures,
  ): void {
    super.copyFields(source, target);
    target.isTypeOnly = source.isTypeOnly ?? false;
    if (source.namespaceExport) {
      target.namespaceExport = source.namespaceExport;
    }

    if (source.moduleSpecifier) {
      target.moduleSpecifier = source.moduleSpecifier;
    }
  }
}
