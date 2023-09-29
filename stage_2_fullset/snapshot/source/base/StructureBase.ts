import { Structures } from "ts-morph";

export default class StructureBase {
  protected static copyFields(
    source: Structures,
    target: Structures
  ): void
  {
    void(source);
    void(target);
  }
}
