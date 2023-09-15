// #region preamble
import {
  type ExportDeclarationStructure,
  StructureKind,
} from "ts-morph";

import {
  AssertEntryImpl,
  ExportSpecifierImpl,
} from "../../prototype-exports.js";

import StatementClassesMap from "../base/StatementClassesMap.js";

import StructureBase from "../base/StructureBase.js";

import StructuresClassesMap from "../base/StructuresClassesMap.js";

import type {
  CloneableStructure
} from "../types/CloneableStructure.js";

import type {
  stringOrWriterFunction
} from "../types/ts-morph-native.js";
// #endregion preamble

export default class ExportDeclarationImpl
extends StructureBase
implements ExportDeclarationStructure
{
  readonly kind: StructureKind.ExportDeclaration = StructureKind.ExportDeclaration;

  isTypeOnly = false;
  namespaceExport: string | undefined = undefined;
  namedExports: (stringOrWriterFunction | ExportSpecifierImpl)[] = [];
  moduleSpecifier: string | undefined = undefined;
  assertElements?: AssertEntryImpl[] = [];

  public static clone(
    other: ExportDeclarationStructure
  ): ExportDeclarationImpl
  {
    const clone = new ExportDeclarationImpl;

    StructureBase.cloneTrivia(other, clone);
    clone.isTypeOnly = other.isTypeOnly ?? false;
    clone.namespaceExport = other.namespaceExport;

    if (Array.isArray(other.namedExports)) {
      other.namedExports.forEach(namedExport => {
        if ((typeof namedExport === "string") || (typeof namedExport === "function"))
          clone.namedExports.push(namedExport);
        else
          clone.namedExports.push(ExportSpecifierImpl.clone(namedExport));
      });
    }
    else if (other.namedExports) {
      clone.namedExports = [other.namedExports];
    }

    clone.moduleSpecifier = other.moduleSpecifier;

    if (other.assertElements) {
      clone.assertElements = other.assertElements.map(element => AssertEntryImpl.clone(element));
    }


    return clone;
  }
}
ExportDeclarationImpl satisfies CloneableStructure<ExportDeclarationStructure>;

StatementClassesMap.set(StructureKind.ExportDeclaration, ExportDeclarationImpl);
StructuresClassesMap.set(StructureKind.ExportDeclaration, ExportDeclarationImpl);
