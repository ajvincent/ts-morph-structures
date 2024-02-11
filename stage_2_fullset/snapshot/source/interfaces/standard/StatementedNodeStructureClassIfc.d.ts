import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type { StatementStructures } from "ts-morph";

export interface StatementedNodeStructureClassIfc {
  statements: (stringOrWriterFunction | StatementStructures)[];
}
