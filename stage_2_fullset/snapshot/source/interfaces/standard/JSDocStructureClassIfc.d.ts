import type { JSDocTagImpl } from "../../exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type { StructureKind } from "ts-morph";

export interface JSDocStructureClassIfc {
  readonly kind: StructureKind.JSDoc;
  description: stringOrWriterFunction;
  tags: JSDocTagImpl[];
}
