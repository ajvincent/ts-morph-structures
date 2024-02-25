import type { stringOrWriterFunction } from "../../exports.js";
import type { StructureKind } from "ts-morph";

export interface DecoratorStructureClassIfc {
  readonly kind: StructureKind.Decorator;
  readonly arguments: stringOrWriterFunction[];
  readonly typeArguments: string[];
}
