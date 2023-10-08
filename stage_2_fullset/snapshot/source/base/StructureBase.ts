import { type OptionalKind, Structures } from "ts-morph";

import { COPY_FIELDS } from "./symbolKeys.js";

export default class StructureBase {
  public static [COPY_FIELDS](
    source: OptionalKind<Structures>,
    target: Structures,
  ): void {
    void source;
    void target;
  }
}
