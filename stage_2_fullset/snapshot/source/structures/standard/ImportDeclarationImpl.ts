//#region preamble
import { ImportAttributeImpl, ImportSpecifierImpl } from "../../exports.js";
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
} from "../../internal-exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ImportAttributeStructure,
  type ImportDeclarationStructure,
  type ImportSpecifierStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Class } from "type-fest";
//#endregion preamble
const ImportDeclarationStructureBase = MultiMixinBuilder<
  [StructureFields],
  typeof StructureBase
>([StructureMixin], StructureBase);

export default class ImportDeclarationImpl
  extends ImportDeclarationStructureBase
  implements
    RequiredOmit<
      PreferArrayFields<ImportDeclarationStructure>,
      "defaultImport" | "namespaceImport"
    >
{
  readonly kind: StructureKind.ImportDeclaration =
    StructureKind.ImportDeclaration;
  readonly attributes: ImportAttributeImpl[] = [];
  defaultImport?: string = undefined;
  isTypeOnly = false;
  moduleSpecifier: string;
  readonly namedImports: (stringOrWriterFunction | ImportSpecifierImpl)[] = [];
  namespaceImport?: string = undefined;

  constructor(moduleSpecifier: string) {
    super();
    this.moduleSpecifier = moduleSpecifier;
  }

  public static [COPY_FIELDS](
    source: OptionalKind<ImportDeclarationStructure>,
    target: ImportDeclarationImpl,
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

    if (source.defaultImport) {
      target.defaultImport = source.defaultImport;
    }

    target.isTypeOnly = source.isTypeOnly ?? false;
    if (source.moduleSpecifier) {
      target.moduleSpecifier = source.moduleSpecifier;
    }

    if (source.namedImports) {
      target.namedImports.push(
        ...cloneStructureStringOrWriterArray<
          OptionalKind<ImportSpecifierStructure>,
          StructureKind.ImportSpecifier,
          ImportSpecifierImpl
        >(source.namedImports, StructureKind.ImportSpecifier),
      );
    }

    if (source.namespaceImport) {
      target.namespaceImport = source.namespaceImport;
    }
  }

  public static clone(
    source: OptionalKind<ImportDeclarationStructure>,
  ): ImportDeclarationImpl {
    const target = new ImportDeclarationImpl(source.moduleSpecifier);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): StructureClassToJSON<ImportDeclarationImpl> {
    const rv = super.toJSON() as StructureClassToJSON<ImportDeclarationImpl>;
    rv.attributes = this.attributes;
    if (this.defaultImport) {
      rv.defaultImport = this.defaultImport;
    } else {
      rv.defaultImport = undefined;
    }

    rv.isTypeOnly = this.isTypeOnly;
    rv.kind = this.kind;
    rv.moduleSpecifier = this.moduleSpecifier;
    rv.namedImports = this.namedImports.map((value) => {
      if (typeof value === "object") {
        return value;
      }
      return StructureBase[REPLACE_WRITER_WITH_STRING](value);
    });
    if (this.namespaceImport) {
      rv.namespaceImport = this.namespaceImport;
    } else {
      rv.namespaceImport = undefined;
    }

    return rv;
  }
}

ImportDeclarationImpl satisfies CloneableStructure<
  ImportDeclarationStructure,
  ImportDeclarationImpl
> &
  Class<ExtractStructure<ImportDeclarationStructure["kind"]>>;
StructuresClassesMap.set(
  StructureKind.ImportDeclaration,
  ImportDeclarationImpl,
);
