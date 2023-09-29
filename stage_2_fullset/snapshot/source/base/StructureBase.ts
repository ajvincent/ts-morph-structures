import { Structures } from "ts-morph";

export default class StructureBase {
  public static copyFields(
    source: Structures,
    target: Structures
  ): void
  {
    void(source);
    void(target);
  }
}
