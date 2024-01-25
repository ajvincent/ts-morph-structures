import type {
  WriterFunction,
} from "ts-morph";

import type {
  CallSignatureDeclarationImpl,
  ConstructorDeclarationImpl,
  ConstructSignatureDeclarationImpl,
  GetAccessorDeclarationImpl,
  IndexSignatureDeclarationImpl,
  MethodDeclarationImpl,
  MethodSignatureImpl,
  PropertyDeclarationImpl,
  PropertySignatureImpl,
  SetAccessorDeclarationImpl,
  StatementStructureImpls,
  stringOrWriterFunction,
} from "../../snapshot/source/exports.js";

/** A description of the exports to add. */
export interface AddExportContext {
  absolutePathToModule: string,
  exportNames: readonly string[],
  isDefaultExport: boolean,
  isType: boolean,
}

/** A description of the imports to add. */
export interface AddImportContext {
  /** This could be an absolute path, or a package import like "ts-morph-structures". */
  pathToImportedModule: string,

  /**
   * True if `this.pathToImportedModule` represents a package import.
   * False if the imported module path should be relative to the
   * manager's absolute path in generated code.
   */
  isPackageImport: boolean,

  importNames: readonly string[],
  isDefaultImport: boolean,
  isTypeOnly: boolean,
}

export type ClassFieldStatement = string | WriterFunction | StatementStructureImpls;

export type ClassMemberImpl = (
  ConstructorDeclarationImpl |
  GetAccessorDeclarationImpl |
  MethodDeclarationImpl |
  PropertyDeclarationImpl |
  SetAccessorDeclarationImpl
);

export type IndexSignatureResolver = (
  signature: IndexSignatureDeclarationImpl
) => string[];

export interface MemberedStatementsKey {
  readonly fieldKey: string;
  readonly statementGroupKey: string;
  readonly purpose: string;
}

export type MemberedTypeToClass_StatementGetter = (
  key: MemberedStatementsKey
) => Promise<stringWriterOrStatementImpl[]>;

export type NamedClassMemberImpl = Extract<ClassMemberImpl, { name: string }>;

export type NamedTypeMemberImpl = Extract<TypeMemberImpl, { name: string }>;

export type TypeMemberImpl = (
  CallSignatureDeclarationImpl |
  ConstructSignatureDeclarationImpl |
  GetAccessorDeclarationImpl |
  IndexSignatureDeclarationImpl |
  MethodSignatureImpl |
  PropertySignatureImpl |
  SetAccessorDeclarationImpl
);

export type stringWriterOrStatementImpl = stringOrWriterFunction | StatementStructureImpls;
