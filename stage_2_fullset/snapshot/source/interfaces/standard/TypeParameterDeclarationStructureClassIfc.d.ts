import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type { StructureKind, TypeParameterVariance } from "ts-morph";

export interface TypeParameterDeclarationStructureClassIfc {
  readonly kind: StructureKind.TypeParameter;
  constraint: stringOrWriterFunction;
  default: stringOrWriterFunction;
  isConst: boolean;
  variance: TypeParameterVariance;
}
