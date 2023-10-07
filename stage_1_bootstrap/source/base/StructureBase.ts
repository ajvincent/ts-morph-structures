import {
  type OptionalKind,
  Structures
} from "ts-morph";

export default class StructureBase {
  public static copyFields(
    source: OptionalKind<Structures>,
    target: Structures
  ): void
  {
    void(source);
    void(target);
  }
}
