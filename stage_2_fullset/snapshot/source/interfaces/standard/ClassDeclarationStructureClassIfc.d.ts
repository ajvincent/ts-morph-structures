import type {
  ConstructorDeclarationImpl,
  GetAccessorDeclarationImpl,
  MethodDeclarationImpl,
  PropertyDeclarationImpl,
  SetAccessorDeclarationImpl,
} from "../../exports.js";
import type { stringOrWriterFunction } from "../../types/stringOrWriterFunction.js";
import type { StructureKind } from "ts-morph";

export interface ClassDeclarationStructureClassIfc {
  readonly kind: StructureKind.Class;
  ctors: ConstructorDeclarationImpl[];
  extends: stringOrWriterFunction;
  getAccessors: GetAccessorDeclarationImpl[];
  implements: stringOrWriterFunction[];
  methods: MethodDeclarationImpl[];
  properties: PropertyDeclarationImpl[];
  setAccessors: SetAccessorDeclarationImpl[];
}
