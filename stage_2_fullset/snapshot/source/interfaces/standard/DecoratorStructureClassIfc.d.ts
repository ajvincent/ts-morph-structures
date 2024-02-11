import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type { StructureKind } from "ts-morph";

export interface DecoratorStructureClassIfc {
  readonly kind: StructureKind.Decorator;
  arguments: stringOrWriterFunction[];
  typeArguments: string[];
}
