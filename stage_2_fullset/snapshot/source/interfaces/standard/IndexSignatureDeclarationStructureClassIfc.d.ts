import type { StructureKind } from "ts-morph";

export interface IndexSignatureDeclarationStructureClassIfc {
  readonly kind: StructureKind.IndexSignature;
  keyName: string;
  keyType: string;
}
