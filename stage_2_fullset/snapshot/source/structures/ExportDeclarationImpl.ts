//#region preamble
import { AssertEntryImpl, ExportSpecifierImpl } from "../exports.js";
import {
  type CloneableStructure,
  cloneStructureArray,
  cloneStructureStringOrWriterArray,
  COPY_FIELDS,
  REPLACE_WRITER_WITH_STRING,
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
import type { Jsonify } from "type-fest";
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
  assertElements?: AssertEntryImpl[] = undefined;
  isTypeOnly = false;
  moduleSpecifier?: string = undefined;
  readonly namedExports: (stringOrWriter | ExportSpecifierImpl)[] = [];
  namespaceExport?: string = undefined;

  public static [COPY_FIELDS](
    source: OptionalKind<ExportDeclarationStructure>,
    target: ExportDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
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
      target.assertElements = [];
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
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<ExportDeclarationStructure> {
    const rv = super.toJSON() as ExportDeclarationStructure;
    rv.assertElements = this.assertElements;
    rv.isTypeOnly = this.isTypeOnly;
    rv.kind = this.kind;
    if (this.moduleSpecifier) {
      rv.moduleSpecifier = this.moduleSpecifier;
    }

    rv.namedExports = this.namedExports.map((value) => {
      if (typeof value === "object") {
        return value;
      }
      return StructureBase[REPLACE_WRITER_WITH_STRING](value);
    });
    if (this.namespaceExport) {
      rv.namespaceExport = this.namespaceExport;
    }

    return rv;
  }
}

ExportDeclarationImpl satisfies CloneableStructure<
  ExportDeclarationStructure,
  ExportDeclarationImpl
>;
StructuresClassesMap.set(
  StructureKind.ExportDeclaration,
  ExportDeclarationImpl,
);
