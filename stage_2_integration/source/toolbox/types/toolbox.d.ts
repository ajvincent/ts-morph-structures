import type {
  Scope,
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
} from "../../../snapshot/source/exports.js";

/** A description of the exports to add. */
export interface AddExportContext {
  /** This could be an absolute path, or a package import like "ts-morph-structures". */
  pathToExportedModule: string,

  /** The names to add to the import.  Pass an empty array for "*". */
  exportNames: readonly string[],

  /** True if the import is the default.  exportNames will then be the default export name. */
  isDefaultExport: boolean,

  /** True if the export names are types only. */
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

  /** The names to add to the import.  Pass an empty array for "*". */
  importNames: readonly string[],

  /** True if the import is the default.  importNames will then be the default import. */
  isDefaultImport: boolean,

  /** True if the import names are types only. */
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

export interface IndexSignatureResolver {
  resolveIndexSignature(signature: IndexSignatureDeclarationImpl): string[];
}

export interface MemberedStatementsKey {
  readonly fieldKey: string;
  readonly statementGroupKey: string;
  readonly purpose: string;

  readonly isFieldStatic: boolean;
  readonly fieldType: TypeMemberImpl | undefined;

  readonly isGroupStatic: boolean;
  readonly groupType: TypeMemberImpl | undefined;
}

export interface ClassAbstractMemberQuestion {
  isAbstract(
    kind: Exclude<ClassMemberImpl, ConstructorDeclarationImpl>["kind"],
    memberName: string
  ): boolean
}

export interface ClassAsyncMethodQuestion {
  isAsync(
    isStatic: boolean,
    methodName: string,
  ): boolean;
}

export interface ClassGeneratorMethodQuestion {
  isGenerator(
    isStatic: boolean,
    methodName: string,
  ): boolean
}

export interface ClassScopeMemberQuestion {
  getScope(
    isStatic: boolean,
    kind: ClassMemberImpl["kind"],
    memberName: string,
  ): Scope | undefined;
}

export interface ClassStatementsGetter {
  getStatements(key: MemberedStatementsKey): readonly stringWriterOrStatementImpl[]
}

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
