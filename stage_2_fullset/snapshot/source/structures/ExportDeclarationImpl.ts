//#region preamble
import { AssertEntryImpl, ExportSpecifierImpl } from "../exports.js";
import {
  type CloneableStructure,
  cloneStructureArray,
  cloneStructureStringOrWriterArray,
  StructureBase,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import type { stringOrWriter } from "../types/stringOrWriter.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type AssertEntryStructure,
  type ExportDeclarationStructure,
  type ExportSpecifierStructure,
  type OptionalKind,
  StructureKind,
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
  readonly namedExports: (stringOrWriter | ExportSpecifierImpl)[] = [];
  readonly assertElements: AssertEntryImpl[] = [];
  namespaceExport?: string = undefined;
  moduleSpecifier?: string = undefined;

  public static copyFields(
    source: OptionalKind<ExportDeclarationStructure>,
    target: ExportDeclarationImpl,
  ): void {
    super.copyFields(source, target);
    target.isTypeOnly = source.isTypeOnly ?? false;
    if (source.namedExports) {
      target.namedExports.push(
        ...cloneStructureStringOrWriterArray<
          OptionalKind<ExportSpecifierStructure>,
          StructureKind.ExportSpecifier,
          ExportSpecifierImpl
        >(source.namedExports, StructureKind.ExportSpecifier),
      );
    }

    if (source.assertElements) {
      target.assertElements.push(
        ...cloneStructureArray<
          OptionalKind<AssertEntryStructure>,
          StructureKind.AssertEntry,
          AssertEntryImpl
        >(source.assertElements, StructureKind.AssertEntry),
      );
    }

    if (source.namespaceExport) {
      target.namespaceExport = source.namespaceExport;
    }

    if (source.moduleSpecifier) {
      target.moduleSpecifier = source.moduleSpecifier;
    }
  }

  public static clone(
    source: OptionalKind<ExportDeclarationStructure>,
  ): ExportDeclarationImpl {
    const target = new ExportDeclarationImpl();
    this.copyFields(source, target);
    return target;
  }
}

ExportDeclarationImpl satisfies CloneableStructure<ExportDeclarationStructure>;
StructuresClassesMap.set(
  StructureKind.ExportDeclaration,
  ExportDeclarationImpl,
);
