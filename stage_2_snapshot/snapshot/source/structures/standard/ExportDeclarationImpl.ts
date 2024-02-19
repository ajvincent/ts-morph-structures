//#region preamble
import { ExportSpecifierImpl, ImportAttributeImpl } from "../../exports.js";
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExportDeclarationStructureClassIfc,
  type ExtractStructure,
  REPLACE_WRITER_WITH_STRING,
  StructureBase,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
  StructuresClassesMap,
} from "../../internal-exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ExportDeclarationStructure,
  type ExportSpecifierStructure,
  type ImportAttributeStructure,
  OptionalKind,
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
  implements ExportDeclarationStructureClassIfc
{
  readonly kind: StructureKind.ExportDeclaration =
    StructureKind.ExportDeclaration;
  attributes?: ImportAttributeImpl[];
  isTypeOnly = false;
  moduleSpecifier?: string = undefined;
  readonly namedExports: (stringOrWriterFunction | ExportSpecifierImpl)[] = [];
  namespaceExport?: string = undefined;

  /** @internal */
  public static [COPY_FIELDS](
    source: OptionalKind<ExportDeclarationStructure>,
    target: ExportDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.attributes) {
      target.attributes = [];
      target.attributes.push(
        ...StructuresClassesMap.cloneArrayWithKind<
          ImportAttributeStructure,
          StructureKind.ImportAttribute,
          ImportAttributeImpl
        >(
          StructureKind.ImportAttribute,
          StructuresClassesMap.forceArray(source.attributes),
        ),
      );
    }

    target.isTypeOnly = source.isTypeOnly ?? false;
    if (source.moduleSpecifier) {
      target.moduleSpecifier = source.moduleSpecifier;
    }

    if (source.namedExports) {
      target.namedExports.push(
        ...StructuresClassesMap.cloneArrayWithKind<
          ExportSpecifierStructure,
          StructureKind.ExportSpecifier,
          stringOrWriterFunction | ExportSpecifierImpl
        >(
          StructureKind.ExportSpecifier,
          StructuresClassesMap.forceArray(source.namedExports),
        ),
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
    } else {
      rv.moduleSpecifier = undefined;
    }

    rv.namedExports = this.namedExports.map((value) => {
      if (typeof value === "object") {
        return value;
      }
      return StructureBase[REPLACE_WRITER_WITH_STRING](value);
    });
    if (this.namespaceExport) {
      rv.namespaceExport = this.namespaceExport;
    } else {
      rv.namespaceExport = undefined;
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
