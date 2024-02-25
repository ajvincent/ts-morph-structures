import type { stringOrWriterFunction } from "../../exports.js";

export interface StructureClassIfc {
  readonly leadingTrivia: stringOrWriterFunction[];
  readonly trailingTrivia: stringOrWriterFunction[];
}
