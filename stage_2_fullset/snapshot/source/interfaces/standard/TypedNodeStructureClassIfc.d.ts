import type { TypeStructures } from "../../exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";

export interface TypedNodeStructureClassIfc {
  type?: stringOrWriterFunction;
  typeStructure: TypeStructures | undefined;
}
