import type {
  ImportAttributeImpl,
  ImportSpecifierImpl,
} from "../../exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type { StructureKind } from "ts-morph";

export interface ImportDeclarationStructureClassIfc {
  readonly kind: StructureKind.ImportDeclaration;
  attributes?: ImportAttributeImpl[];
  defaultImport?: string;
  isTypeOnly: boolean;
  moduleSpecifier: string;
  readonly namedImports: (stringOrWriterFunction | ImportSpecifierImpl)[];
  namespaceImport?: string;
}
