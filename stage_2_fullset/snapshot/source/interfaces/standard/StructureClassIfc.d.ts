import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";

export interface StructureClassIfc {
  leadingTrivia: stringOrWriterFunction[];
  trailingTrivia: stringOrWriterFunction[];
}
