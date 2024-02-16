import type { StructureKind } from "ts-morph";

export interface EnumMemberStructureClassIfc {
  readonly kind: StructureKind.EnumMember;
  value?: string | number;
}
