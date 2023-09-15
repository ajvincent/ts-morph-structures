// #region preamble
import {
  type ImportDeclarationStructure,
  type OptionalKind,
  StructureKind,
} from "ts-morph";

import {
  AssertEntryImpl,
  ImportSpecifierImpl,
} from "../../prototype-exports.js";

import StructureBase from "../base/StructureBase.js";

import StatementClassesMap from "../base/StatementClassesMap.js";

import StructuresClassesMap from "../base/StructuresClassesMap.js";

import type {
  stringOrWriterFunction
} from "../types/ts-morph-native.js";

import type {
  CloneableStructure
} from "../types/CloneableStructure.js";
// #endregion preamble

export default class ImportDeclarationImpl
extends StructureBase
implements ImportDeclarationStructure
{
  readonly kind: StructureKind.ImportDeclaration = StructureKind.ImportDeclaration;
  isTypeOnly = false;
  defaultImport: string | undefined = undefined;
  namespaceImport: string | undefined = undefined;
  namedImports: (stringOrWriterFunction | ImportSpecifierImpl)[] = [];
  moduleSpecifier: string;
  assertElements: AssertEntryImpl[] | undefined = undefined;

  constructor(
    moduleSpecifier: string
  )
  {
    super();
    this.moduleSpecifier = moduleSpecifier;
  }

  public static clone(
    other: OptionalKind<ImportDeclarationStructure>
  ): ImportDeclarationImpl
  {
    const clone = new ImportDeclarationImpl(other.moduleSpecifier);

    StructureBase.cloneTrivia(other, clone);

    clone.isTypeOnly = other.isTypeOnly ?? false;
    clone.defaultImport = other.defaultImport;
    clone.namespaceImport = other.namespaceImport;

    if (Array.isArray(other.namedImports)) {
      other.namedImports.forEach(namedImport => {
        if ((typeof namedImport === "string") || (typeof namedImport === "function"))
          clone.namedImports.push(namedImport);
        else
          clone.namedImports.push(ImportSpecifierImpl.clone(namedImport));
      });
    }
    else if (other.namedImports) {
      clone.namedImports = [other.namedImports];
    }

    if (other.assertElements) {
      clone.assertElements = other.assertElements.map(element => AssertEntryImpl.clone(element));
    }

    return clone;
  }
}
ImportDeclarationImpl satisfies CloneableStructure<ImportDeclarationStructure>;

StatementClassesMap.set(StructureKind.ImportDeclaration, ImportDeclarationImpl);
StructuresClassesMap.set(StructureKind.ImportDeclaration, ImportDeclarationImpl);
