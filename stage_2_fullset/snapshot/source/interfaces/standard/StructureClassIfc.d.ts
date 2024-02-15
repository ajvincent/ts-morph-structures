import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";

export interface StructureClassIfc {
  readonly leadingTrivia: stringOrWriterFunction[];
  readonly trailingTrivia: stringOrWriterFunction[];
}
