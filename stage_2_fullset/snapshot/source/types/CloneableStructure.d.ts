import type { Class } from "type-fest";

import type { OptionalKind, Structure } from "ts-morph";

import type { StructuresImpl } from "./StructureImplUnions.js";

export type CloneableStructure<
  Base extends Structure,
  Result extends StructuresImpl,
> = Class<Base> & {
  clone(other: OptionalKind<Base> | Base): Result;
};
