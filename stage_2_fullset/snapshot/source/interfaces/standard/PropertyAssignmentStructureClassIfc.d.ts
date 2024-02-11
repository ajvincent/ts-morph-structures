import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type { StructureKind } from "ts-morph";

export interface PropertyAssignmentStructureClassIfc {
  readonly kind: StructureKind.PropertyAssignment;
  initializer: stringOrWriterFunction;
}
