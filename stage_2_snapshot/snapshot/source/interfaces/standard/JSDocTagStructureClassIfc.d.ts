import type { stringOrWriterFunction } from "../../exports.js";
import type { StructureKind } from "ts-morph";

export interface JSDocTagStructureClassIfc {
  readonly kind: StructureKind.JSDocTag;
  tagName: string;
  text?: stringOrWriterFunction;
}
