import type { JSDocTagImpl, stringOrWriterFunction } from "../../exports.js";
import type { StructureKind } from "ts-morph";

export interface JSDocStructureClassIfc {
  readonly kind: StructureKind.JSDoc;
  description?: stringOrWriterFunction;
  readonly tags: JSDocTagImpl[];
}
