//#region preamble
import { AssertEntryImpl, ImportSpecifierImpl } from "../exports.js";
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
  type ImportDeclarationStructure,
  type ImportSpecifierStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";
import type { Jsonify } from "type-fest";
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
  assertElements?: AssertEntryImpl[] = undefined;
  defaultImport?: string = undefined;
  isTypeOnly = false;
  moduleSpecifier: string;
  readonly namedImports: (stringOrWriter | ImportSpecifierImpl)[] = [];
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
    target.isTypeOnly = source.isTypeOnly ?? false;
    if (source.namedImports) {
      target.namedImports.push(
        ...cloneStructureStringOrWriterArray<
          OptionalKind<ImportSpecifierStructure>,
          StructureKind.ImportSpecifier,
          ImportSpecifierImpl
        >(source.namedImports, StructureKind.ImportSpecifier),
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
    const target = new ImportDeclarationImpl(source.moduleSpecifier);
    this[COPY_FIELDS](source, target);
    return target;
  }

  public toJSON(): Jsonify<ImportDeclarationStructure> {
    const rv = super.toJSON() as ImportDeclarationStructure;
    rv.assertElements = this.assertElements;
    if (this.defaultImport) {
      rv.defaultImport = this.defaultImport;
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
    }

    return rv;
  }
}

ImportDeclarationImpl satisfies CloneableStructure<
  ImportDeclarationStructure,
  ImportDeclarationImpl
>;
StructuresClassesMap.set(
  StructureKind.ImportDeclaration,
  ImportDeclarationImpl,
);
