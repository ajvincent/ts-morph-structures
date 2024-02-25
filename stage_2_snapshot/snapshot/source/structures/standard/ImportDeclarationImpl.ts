//#region preamble
import {
  ImportAttributeImpl,
  type ImportDeclarationStructureClassIfc,
  ImportSpecifierImpl,
  type stringOrWriterFunction,
} from "../../exports.js";
import {
  type CloneableStructure,
  COPY_FIELDS,
  type ExtractStructure,
  REPLACE_WRITER_WITH_STRING,
  StructureBase,
  StructureClassesMap,
  type StructureClassToJSON,
  type StructureFields,
  StructureMixin,
} from "../../internal-exports.js";
import MultiMixinBuilder from "mixin-decorators";
import {
  type ImportAttributeStructure,
  type ImportDeclarationStructure,
  type ImportSpecifierStructure,
  OptionalKind,
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
  implements ImportDeclarationStructureClassIfc
{
  readonly kind: StructureKind.ImportDeclaration =
    StructureKind.ImportDeclaration;
  attributes?: ImportAttributeImpl[];
  defaultImport?: string = undefined;
  isTypeOnly = false;
  moduleSpecifier: string;
  readonly namedImports: (stringOrWriterFunction | ImportSpecifierImpl)[] = [];
  namespaceImport?: string = undefined;

  constructor(moduleSpecifier: string) {
    super();
    this.moduleSpecifier = moduleSpecifier;
  }

  /** @internal */
  public static [COPY_FIELDS](
    source: OptionalKind<ImportDeclarationStructure>,
    target: ImportDeclarationImpl,
  ): void {
    super[COPY_FIELDS](source, target);
    if (source.attributes) {
      target.attributes = [];
      target.attributes.push(
        ...StructureClassesMap.cloneArrayWithKind<
          ImportAttributeStructure,
          StructureKind.ImportAttribute,
          ImportAttributeImpl
        >(
          StructureKind.ImportAttribute,
          StructureClassesMap.forceArray(source.attributes),
        ),
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
        ...StructureClassesMap.cloneArrayWithKind<
          ImportSpecifierStructure,
          StructureKind.ImportSpecifier,
          stringOrWriterFunction | ImportSpecifierImpl
        >(
          StructureKind.ImportSpecifier,
          StructureClassesMap.forceArray(source.namedImports),
        ),
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
StructureClassesMap.set(StructureKind.ImportDeclaration, ImportDeclarationImpl);
