import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type { StructureKind } from "ts-morph";

export interface SpreadAssignmentStructureClassIfc {
  readonly kind: StructureKind.SpreadAssignment;
  expression: stringOrWriterFunction;
}
