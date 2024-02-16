import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type { StructureKind } from "ts-morph";

export interface DecoratorStructureClassIfc {
  readonly kind: StructureKind.Decorator;
  readonly arguments: stringOrWriterFunction[];
  readonly typeArguments: string[];
}
