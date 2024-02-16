import type {
  ExportSpecifierImpl,
  ImportAttributeImpl,
} from "../../exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type { StructureKind } from "ts-morph";

export interface ExportDeclarationStructureClassIfc {
  readonly kind: StructureKind.ExportDeclaration;
  attributes?: ImportAttributeImpl[];
  isTypeOnly: boolean;
  moduleSpecifier?: string;
  readonly namedExports: (stringOrWriterFunction | ExportSpecifierImpl)[];
  namespaceExport?: string;
}
