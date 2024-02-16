import type { Scope, StructureKind } from "ts-morph";

export interface ParameterDeclarationStructureClassIfc {
  readonly kind: StructureKind.Parameter;
  isRestParameter: boolean;
  scope?: Scope;
}
