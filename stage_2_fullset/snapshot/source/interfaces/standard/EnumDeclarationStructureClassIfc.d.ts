import type { EnumMemberImpl } from "../../exports.js";
import type { StructureKind } from "ts-morph";

export interface EnumDeclarationStructureClassIfc {
  readonly kind: StructureKind.Enum;
  isConst: boolean;
  members: EnumMemberImpl[];
}
