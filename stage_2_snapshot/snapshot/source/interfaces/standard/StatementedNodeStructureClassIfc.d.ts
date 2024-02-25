import type { stringOrWriterFunction } from "../../exports.js";
import type { StatementStructures } from "ts-morph";

export interface StatementedNodeStructureClassIfc {
  readonly statements: (StatementStructures | stringOrWriterFunction)[];
}
