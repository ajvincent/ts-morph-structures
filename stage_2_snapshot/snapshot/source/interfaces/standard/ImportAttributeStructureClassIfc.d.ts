import type { StructureKind } from "ts-morph";

export interface ImportAttributeStructureClassIfc {
  readonly kind: StructureKind.ImportAttribute;
  value: string;
}
