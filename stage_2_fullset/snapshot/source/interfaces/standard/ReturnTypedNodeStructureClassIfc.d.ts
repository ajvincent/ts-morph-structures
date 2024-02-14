import type { TypeStructures } from "../../exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";

export interface ReturnTypedNodeStructureClassIfc {
  returnType?: stringOrWriterFunction;
  returnTypeStructure: TypeStructures | undefined;
}
