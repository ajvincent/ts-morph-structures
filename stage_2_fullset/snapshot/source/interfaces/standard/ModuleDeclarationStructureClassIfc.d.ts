import type { ModuleDeclarationKind, StructureKind } from "ts-morph";

export interface ModuleDeclarationStructureClassIfc {
  readonly kind: StructureKind.Module;
  declarationKind?: ModuleDeclarationKind;
}
