import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type { StructureKind } from "ts-morph";

export interface TypeAliasDeclarationStructureClassIfc {
  readonly kind: StructureKind.TypeAlias;
  type: stringOrWriterFunction;
}
