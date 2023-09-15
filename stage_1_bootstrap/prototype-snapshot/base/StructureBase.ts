import { stringOrWriterFunction } from "../../prototype-snapshot/types/ts-morph-native.js";
import { Structure } from "ts-morph";
import { stringOrWriterFunctionArray } from "./utilities.js";

export default class StructureBase {
  leadingTrivia: stringOrWriterFunction[] = [];
  trailingTrivia: stringOrWriterFunction[] = [];

  public static cloneTrivia(
    source: Structure,
    target: StructureBase
  ): void
  {
    target.leadingTrivia = stringOrWriterFunctionArray(source.leadingTrivia);
    target.trailingTrivia = stringOrWriterFunctionArray(source.trailingTrivia);
  }
}
