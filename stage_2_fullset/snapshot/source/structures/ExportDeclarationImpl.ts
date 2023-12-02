//#region preamble
import { ExportSpecifierImpl, ImportAttributeImpl } from "../exports.js";
import {
  type CloneableStructure,
  cloneStructureArray,
  cloneStructureStringOrWriterArray,
  COPY_FIELDS,
  type ExtractStructure,
  type PreferArrayFields,
  REPLACE_WRITER_WITH_STRING,
  type RequiredOmit,
  StructureBase,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../internal-exports.js";
import type { stringOrWriterFunction } from "../types/stringOrWriterFunction.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ExportDeclarationStructure,
  type ExportSpecifierStructure,
  type ImportAttributeStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const ExportDeclarationStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class ExportDeclarationImpl
  extends ExportDeclarationStructureBase
  implements
    RequiredOmit<
      PreferArrayFields<ExportDeclarationStructure>,
      "moduleSpecifier" | "namespaceExport"
    >
{
  readonly kind: StructureKind.ExportDeclaration =
    StructureKind.ExportDeclaration;
  readonly attributes: ImportAttributeImpl[] = [];
  isTypeOnly = false;
  moduleSpecifier?: string = undefined;
  readonly namedExports: (stringOrWriterFunction | ExportSpecifierImpl)[] = [];
  namespaceExport?: string = undefined;

  public static [COPY_FIELDS](
    source: OptionalKind<ExportDeclarationStructure>,
    target: ExportDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.attributes) {
      target.attributes.push(
        ...cloneStructureArray<
          OptionalKind<ImportAttributeStructure>,
          StructureKind.ImportAttribute,
          ImportAttributeImpl
        >(source.attributes, StructureKind.ImportAttribute),
      );
    }

    target.isTypeOnly = source.isTypeOnly ?? false;
    if (source.moduleSpecifier) {
      target.moduleSpecifier = source.moduleSpecifier;
    }

    if (source.namedExports) {
      target.namedExports.push(
        ...cloneStructureStringOrWriterArray<
          OptionalKind<ExportSpecifierStructure>,
          StructureKind.ExportSpecifier,
          ExportSpecifierImpl
        >(source.namedExports, StructureKind.ExportSpecifier),
      );
    }

    if (source.namespaceExport) {
      target.namespaceExport = source.namespaceExport;
    }
  }

  public static clone(
    source: OptionalKind<ExportDeclarationStructure>,
  ): ExportDeclarationImpl {
    const target = new ExportDeclarationImpl();
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<ExportDeclarationImpl> {
    const rv = super.toJSON() as StructureClassToJSON<ExportDeclarationImpl>;
    rv.attributes = this.attributes;
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
> &
  Class<ExtractStructure<ExportDeclarationStructure["kind"]>>;
StructuresClassesMap.set(
  StructureKind.ExportDeclaration,
  ExportDeclarationImpl,
);
